// « Volets » — variante du Lecteur en accordéon (4 volets : le premier réunit le nom et l'à propos). Routes : #/ · #/projets · #/projets/04 · #/univers · #/contact (#/playlist → #/univers)
// Clavier : ← → volet précédent / suivant (ou projet précédent / suivant dans une fiche) · ↑ ↓ image dans la visionneuse · 0–3 volets · Échap retour
(() => {
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Les vrais projets (page « image » du Figma) : [titre, catégorie, images [fichier, légende, 'video'?] — la 1re est le mockup, montré en grand —, couverture, palette?, fiche technique?]
  const PROJETS = [
    ['Graines Électroniques', 'Identité de festival', [['895', 'En situation, mur urbain'], ['889', 'Affiche officielle'], ['890', 'Déclinaison'], ['894', 'Mockup écrans'], ['897', 'Post Instagram — soirée house'], ['896', 'Post Instagram — concert'], ['891', 'Billets']], '889'],
    ['Le Jeu de Paume', 'Identité visuelle · bar', [['900', 'Logo et carte'], ['902', 'Logotype'], ['899', 'La façade'], ['918', 'Tablier'], ['920', 'Carte de table'], ['901', 'Sous-bocks']], '900', ['#005795', '#C8A550']],
    ['Motion Design', 'Film d\'animation · DALYO3', [['guijaune', 'Film — 0:44', 'video']], 'guijaune', null, [['Durée', '0:44'], ['Format', '16:9 · 1080p'], ['Son', 'Oui'], ['Cadre', 'DALYO3 · WSP1']]],
    ['C3L3ST', 'Cover d\'album · vinyle', [['913', 'Vinyle, ambiance nocturne'], ['914', 'Cover'], ['915', 'Déclinaison paysage']], '914'],
    ['63OG', 'Cover d\'album · vinyle', [['910', 'Mockup vinyle'], ['911', 'Cover'], ['912', 'Bannière']], '911'],
    ['Toca Loco', 'Identité digitale', [['917', 'Application en main'], ['916', 'Écrans']], '917'],
    ['Dancing In The Rain', 'Affiche · 63KLUF', [['907', 'En situation, rue'], ['905', 'Affiche'], ['906', 'Détail']], '905'],
    ['Obscura', 'Affiche lo-fi', [['908', 'En situation, mur décrépi'], ['909', 'Affiche']], '909']
  ];
  // Une phrase par projet + les logiciels utilisés (même ordre que PROJETS)
  const TEXTES = [
    ['Identité visuelle d\'un festival engagé : affiche, déclinaisons, billets et posts pour les réseaux.', ['Photoshop', 'Illustrator', 'Figma']],
    ['Rebranding d\'un bar : logotype, carte, façade, tablier et sous-bocks.', ['Photoshop', 'Illustrator']],
    ['Film en motion design pour une fédération de sport pour tous.', ['After Effects']],
    ['Projet personnel : une cover d\'album, du vinyle au format paysage.', ['Photoshop', 'Illustrator']],
    ['Projet personnel : une cover d\'album, déclinée en vinyle et en bannière.', ['Photoshop', 'Illustrator']],
    ['Branding d\'un food truck, jusqu\'aux écrans de son application.', ['Figma']],
    ['Projet personnel : une affiche et sa mise en situation dans la rue.', ['Photoshop', 'Illustrator']],
    ['La combinaison de deux styles dans une seule affiche lo-fi.', ['Photoshop', 'Illustrator']]
  ];
  const NB = PROJETS.length;
  const src = id => 'assets/projets/' + id + '.jpg';
  const nn = i => String(i + 1).padStart(2, '0');
  const compte = p => p[2][0][2] === 'video' ? 'Vidéo' : p[2].length + ' visuels';
  const ORDRE = ['accueil', 'projets', 'univers', 'contact'];   // « À propos » est fusionné dans le premier volet

  // ───── Typo écrasée ─────
  const mctx = document.createElement('canvas').getContext('2d');
  const measure = t => { mctx.font = '100 100px Montserrat'; return mctx.measureText(t); };
  let BASELINE = 0;
  function probe() {
    const s = document.createElement('span');
    s.style.cssText = 'position:absolute;visibility:hidden;font:100 100px/1 Montserrat';
    s.innerHTML = 'H<i style="display:inline-block;width:0;height:0;vertical-align:baseline"></i>';
    document.body.appendChild(s);
    BASELINE = s.lastChild.getBoundingClientRect().top - s.getBoundingClientRect().top;
    s.remove();
  }
  function fit(el) {
    const w = el.clientWidth, h = el.clientHeight, sp = el.firstElementChild;
    if (!w || !h || !sp) return;
    const m = measure(sp.textContent.toUpperCase());
    const gw = m.actualBoundingBoxLeft + m.actualBoundingBoxRight, gh = m.actualBoundingBoxAscent + m.actualBoundingBoxDescent;
    sp.style.transform = 'scale(' + (w / gw) + ',' + (h / gh) + ') translate(' + m.actualBoundingBoxLeft + 'px,' + (m.actualBoundingBoxAscent - BASELINE) + 'px)';
  }
  const fitVolet = v => v.querySelectorAll('.sq').forEach(fit);

  // ───── Nom élastique (comme la maquette 1) ─────
  const lignesNom = ['MATHYS', 'CHABANEL'].map(mot => {
    const el = document.createElement('div');
    el.className = 'ligne';
    el.setAttribute('aria-hidden', 'true');
    $('#nom').appendChild(el);
    return { el, mot, lettres: [], amp: 0, mx: .5 };
  });
  $('#nom').setAttribute('aria-label', 'Mathys Chabanel');
  let capH = 70, capTop = 0;
  function construireNom() {
    capH = measure('H').actualBoundingBoxAscent;
    capTop = BASELINE - capH;
    lignesNom.forEach(L => {
      L.el.innerHTML = '';
      L.lettres = [...L.mot].map(ch => { const s = document.createElement('span'); s.textContent = ch; L.el.appendChild(s); return { el: s, adv: measure(ch).width, w: 1 }; });
    });
  }
  const survol = { dedans: false, x: 0, y: 0 };
  $('#nom').addEventListener('mousemove', e => { survol.dedans = true; survol.x = e.clientX; survol.y = e.clientY; });
  $('#nom').addEventListener('mouseleave', () => { survol.dedans = false; });
  function dessinerNom() {
    lignesNom.forEach(L => {
      const W = L.el.clientWidth, Hh = L.el.clientHeight;
      if (!W || !L.lettres.length) return;
      const r = L.el.getBoundingClientRect();
      const surLigne = survol.dedans && survol.y >= r.top && survol.y <= r.bottom;
      L.amp += ((reduce ? 0 : survol.dedans ? (surLigne ? 1.9 : .9) : 0) - L.amp) * .08;
      if (survol.dedans) L.mx += (Math.max(0, Math.min(1, (survol.x - r.left) / W)) - L.mx) * .25;
      const total = L.lettres.reduce((s, x) => s + x.adv, 0);
      let cx = 0;
      L.lettres.forEach(x => { const c = (cx + x.adv / 2) / total; cx += x.adv; x.w += (1 + L.amp * Math.exp(-Math.pow((c - L.mx) / .13, 2)) - x.w) * .18; });
      const k = W / L.lettres.reduce((s, x) => s + x.adv * x.w, 0), sy = Hh / capH;
      let x0 = 0;
      L.lettres.forEach(x => {
        const sx = k * x.w;
        x.el.style.transform = 'translate(' + x0.toFixed(2) + 'px,0) scale(' + sx.toFixed(4) + ',' + sy.toFixed(4) + ') translate(0,' + (-capTop).toFixed(2) + 'px)';
        x0 += x.adv * sx;
      });
    });
  }

  // ───── Projets : index + fiche (visionneuse) ─────
  $('#pellicule').innerHTML = PROJETS.map((p, i) =>
    '<button style="--img:url(' + src(p[3]) + ')" data-i="' + i + '" aria-label="' + p[0] + '" data-af><span>' + nn(i) + '</span></button>').join('');
  $$('#pellicule button').forEach(b => b.addEventListener('click', () => { location.hash = '#/projets/' + nn(+b.dataset.i); }));

  // Index : une ligne par projet
  $('#index').innerHTML = PROJETS.map((p, i) =>
    '<a href="#/projets/' + nn(i) + '" data-af><span class="n">' + nn(i) + '</span><span class="t">' + p[0] + '</span><span class="c">' + p[1] + '</span><span class="k">' + compte(p) + '</span><img class="vi" src="' + src(p[3]) + '" alt="" loading="lazy"></a>').join('');

  // Visionneuse : une image à la fois, en grand, avec les vignettes du projet
  let vue = 0;
  function montrer(k) {
    const im = PROJETS[projet][2], n = im.length;
    vue = (k + n) % n;
    const v = $('#sc-vid'), estVideo = im[vue][2] === 'video';
    $('#sc-img').hidden = estVideo; $('#sc-ecran').hidden = !estVideo;
    $('.fiche').classList.toggle('film', estVideo);
    if (estVideo) { v.poster = src(im[vue][0]); if (!v.src.endsWith(im[vue][0] + '.mp4')) { v.src = 'assets/projets/' + im[vue][0] + '.mp4'; arreterFilm(); } }
    else { arreterFilm(); v.removeAttribute('src'); v.load(); $('#sc-img').src = src(im[vue][0]); }
    $('#sc-img').alt = PROJETS[projet][0] + ' — ' + im[vue][1];
    $('#sc-leg').innerHTML = '<b>' + nn(vue) + ' / ' + String(n).padStart(2, '0') + '</b>' + im[vue][1];
    $$('#sc-vign button').forEach((b, j) => b.setAttribute('aria-current', j === vue));
  }
  $('#sc-fig').addEventListener('click', () => { if (PROJETS[projet][2].length > 1) montrer(vue + 1); });
  // Film : gros bouton « Lire » sur l'aperçu, puis les commandes natives ; il revient à la fin
  function arreterFilm() { const v = $('#sc-vid'); v.pause(); v.controls = false; $('#sc-ecran').classList.remove('joue'); }
  $('#sc-lire').addEventListener('click', e => { e.stopPropagation(); const v = $('#sc-vid'); v.controls = true; $('#sc-ecran').classList.add('joue'); v.play(); });
  $('#sc-vid').addEventListener('ended', arreterFilm);
  // sur téléphone : glisser l'image vers la gauche / la droite = image suivante / précédente
  let x0 = null;
  $('#sc-fig').addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
  $('#sc-fig').addEventListener('touchend', e => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0; x0 = null;
    if (Math.abs(dx) > 40 && PROJETS[projet][2].length > 1) { e.preventDefault(); montrer(vue + (dx < 0 ? 1 : -1)); }
  });

  let projet = 0;
  function fiche(i) {
    projet = i;
    const p = PROJETS[i];
    $('#pj-num').textContent = 'P' + nn(i) + ' — ' + p[1];
    $('#pj-titre span').textContent = p[0];
    $('#pj-compte').textContent = compte(p);
    $('#pj-desc').textContent = TEXTES[i][0];
    $('#pj-outils').innerHTML = TEXTES[i][1].map(o => '<li>' + o + '</li>').join('');
    $('#pj-tech').innerHTML = (p[5] || []).map(([k, val]) => '<dt>' + k + '</dt><dd>' + val + '</dd>').join('');
    $('#pj-palette').innerHTML = (p[4] || []).map(c => '<i style="background:' + c + '"></i>').join('');
    $('#sc-vign').innerHTML = p[2].map((x, k) => '<button data-k="' + k + '" aria-label="' + x[1] + '" data-af><img src="' + src(x[0]) + '" alt=""></button>').join('');
    $$('#sc-vign button').forEach(b => b.addEventListener('click', () => montrer(+b.dataset.k)));
    montrer(0);
    $$('#pellicule button').forEach(b => b.setAttribute('aria-current', +b.dataset.i === i));
    $('#pj-fil').textContent = '01 — Projets / ' + p[0];
  }
  const allerProjet = d => { location.hash = '#/projets/' + nn((projet + d + NB) % NB); };
  $('#pj-prec').addEventListener('click', () => allerProjet(-1));
  $('#pj-suiv').addEventListener('click', () => allerProjet(1));
  $('#vers-planche').addEventListener('click', () => { location.hash = '#/projets'; });

  // ───── Routeur ─────
  function lire() {
    let [a, b] = location.hash.replace(/^#\/?/, '').split('/');
    if (a === 'playlist') a = 'univers';   // ancien lien partagé
    if (a === 'projets' && /^\d\d$/.test(b || '') && +b >= 1 && +b <= NB) return { v: 'projets', i: +b - 1 };
    if (ORDRE.indexOf(a) > 0) return { v: a };
    return { v: 'accueil' };
  }
  function afficher() {
    const r = lire();
    $$('.volet').forEach(v => {
      const on = v.dataset.v === r.v;
      v.classList.toggle('ouvert', on);
      v.querySelector('.tranche').setAttribute('aria-current', on ? 'page' : 'false');
      v.querySelector('.contenu').toggleAttribute('inert', !on);
    });
    const pj = $('.projets');
    pj.classList.toggle('detail', r.i !== undefined);
    $('#vers-planche').hidden = r.i === undefined;
    if (r.i === undefined) arreterFilm();
    if (r.i !== undefined) fiche(r.i); else $('#pj-fil').textContent = '01 — Projets · ' + NB + ' projets';
    document.title = (r.v === 'accueil' ? '' : (r.i !== undefined ? PROJETS[r.i][0] : $('.volet.ouvert .titre').textContent) + ' — ') + 'Mathys Chabanel';
    const v = $('.volet.ouvert');
    // les titres écrasés se recalent une fois le volet déplié
    setTimeout(() => fitVolet(v), reduce ? 0 : 700);
  }
  addEventListener('hashchange', afficher);

  function retour() {
    const r = lire();
    if (r.i !== undefined) location.hash = '#/projets';
    else if (r.v !== 'accueil') location.hash = '#/';
  }
  addEventListener('keydown', e => {
    if (e.target.matches && e.target.matches('input, textarea')) { if (e.key === 'Escape') e.target.blur(); return; }
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const r = lire();
    if (e.key === 'Escape') { retour(); return; }
    if (/^[0-3]$/.test(e.key)) { location.hash = '#/' + (e.key === '0' ? '' : ORDRE[+e.key]); return; }
    if (r.i !== undefined && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) { e.preventDefault(); montrer(vue + (e.key === 'ArrowDown' ? 1 : -1)); return; }
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      const d = e.key === 'ArrowRight' ? 1 : -1;
      if (r.i !== undefined) { allerProjet(d); return; }
      const k = ORDRE.indexOf(r.v) + d;
      if (k >= 0 && k < ORDRE.length) location.hash = '#/' + (k ? ORDRE[k] : '');
    }
  });

  // ───── Contact ─────
  $('#copier').addEventListener('click', async () => {
    const mail = 'chabanel.mathys@gmail.com';
    try { await navigator.clipboard.writeText(mail); $('#copier-etat').textContent = 'Adresse copiée ✓'; }
    catch (e) { location.href = 'mailto:' + mail; }
    setTimeout(() => { $('#copier-etat').textContent = 'Clic pour copier l\'adresse'; }, 1800);
  });

  // ───── Cadre de mise au point ─────
  const af = $('#af'), box = { x: 0, y: 0, w: 0, h: 0 };
  let cible = null;
  const viser = t => { cible = t; af.classList.toggle('on', !!t); };
  document.addEventListener('mouseover', e => viser(e.target.closest('[data-af]')));
  document.addEventListener('focusin', e => viser(e.target.closest('[data-af]')));

  // ───── Boucle ─────
  const t0 = performance.now();
  const pad = n => String(Math.floor(n)).padStart(2, '0');
  function frame(now) {
    const s = (now - t0) / 1000, tc = 'REC ' + pad(s / 3600) + ':' + pad(s / 60 % 60) + ':' + pad(s % 60);
    const ouvert = $('.volet.ouvert');
    if (ouvert) { const rec = ouvert.querySelector('[data-rec]'); if (rec) rec.textContent = tc; }
    if (cible && cible.isConnected) {
      const r = cible.getBoundingClientRect(), k = box.w ? .3 : 1;
      box.x += (r.left - 6 - box.x) * k; box.y += (r.top - 6 - box.y) * k; box.w += (r.width + 12 - box.w) * k; box.h += (r.height + 12 - box.h) * k;
      af.style.transform = 'translate(' + box.x + 'px,' + box.y + 'px)'; af.style.width = box.w + 'px'; af.style.height = box.h + 'px';
    }
    if (ouvert && ouvert.dataset.v === 'accueil') dessinerNom();
    requestAnimationFrame(frame);
  }
  document.fonts.load('100 100px Montserrat').then(() => {
    probe();
    // chaque titre écrasé se recale dès que sa boîte change de taille (fin d'ouverture d'un volet, rotation…)
    const ro = new ResizeObserver(es => es.forEach(e => fit(e.target)));
    $$('.sq').forEach(el => ro.observe(el));
    construireNom();
    afficher();
    requestAnimationFrame(frame);
  });
  addEventListener('resize', () => { fitVolet($('.volet.ouvert')); fit($('#u-sq')); });
})();
