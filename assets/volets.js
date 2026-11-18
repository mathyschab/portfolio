// « Volets » — variante du Lecteur en accordéon (4 volets : le premier réunit le nom et l'à propos). Routes : #/ · #/projets · #/projets/04 · #/principes · #/principes/02 · #/contact (#/univers et #/playlist → #/principes)
// Clavier : ← → volet précédent / suivant (ou projet / principe précédent / suivant) · ↑ ↓ image dans la visionneuse · 0–3 volets · Échap retour
(() => {
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Les vrais projets (page « image » du Figma) : [titre, catégorie, images [fichier, légende, 'video'?] — la 1re est le mockup, montré en grand —, couverture, palette?, fiche technique?]
  const PROJETS = [
    ['Graines Électroniques', 'Identité de festival', [['895', 'En situation, mur urbain'], ['889', 'Affiche officielle'], ['890', 'Déclinaison'], ['894', 'Mockup écrans'], ['897', 'Post Instagram, soirée house'], ['896', 'Post Instagram — concert'], ['891', 'Billets']], '889'],
    ['Le Jeu de Paume', 'Identité visuelle · bar', [['900', 'Logo et carte'], ['902', 'Logotype'], ['899', 'La façade'], ['918', 'Tablier'], ['920', 'Carte de table'], ['901', 'Sous-bocks']], '900', ['#005795', '#C8A550']],
    ['Motion Design', 'Film d\'animation · DALYO3', [['guijaune', 'Film, 0:44', 'video']], 'guijaune', null, [['Durée', '0:44'], ['Format', '16:9 · 1080p']]],
    ['Toca Loco', 'Site web · food truck mexicain', [['tocaloco', 'Vidéo de présentation, 0:24', 'video'], ['917', 'Application en main'], ['916', 'Écrans']], '917'],
    ['C3L3ST', 'Cover d\'album · vinyle', [['913', 'Vinyle, ambiance nocturne'], ['914', 'Cover'], ['915', 'Déclinaison paysage']], '914'],
    ['63OG', 'Cover d\'album · vinyle', [['910', 'Mockup vinyle'], ['911', 'Cover'], ['912', 'Bannière']], '911'],
    ['Dancing In The Rain', 'Affiche · 63KLUF', [['907', 'En situation, rue'], ['905', 'Affiche'], ['906', 'Détail']], '905'],
    ['Obscura', 'Affiche lo-fi', [['908', 'En situation, mur décrépi'], ['909', 'Affiche']], '909']
  ];
  // Pour chaque projet (même ordre que PROJETS) : [cadre, la demande, mes choix, logiciels] — d'après les notes de Mathys
  const TEXTES = [
    ['Projet d\'école, 3e année',
     'Concevoir l\'identité visuelle d\'un festival engagé, déclinée sur une affiche, un site web et des goodies.',
     'Mon inspiration vient de l\'univers visuel des clips musicaux : un grain prononcé et une palette très chaude. Je voulais exprimer le thème de la lumière et du feu intérieur. La typographie AKIRA affirme une identité forte et percutante.',
     ['Photoshop', 'Illustrator', 'Figma']],
    ['Projet d\'école',
     'Repenser l\'identité visuelle du bar Le Jeu de Paume dans le cadre d\'un rebranding.',
     'J\'ai conservé l\'esprit du lieu tout en proposant un regard nouveau. La typographie, sobre, se distingue par un léger décalage entre les lettres et installe une atmosphère calme, à l\'image du moment de détente que l\'on vient chercher au bar. J\'ai repris le bleu de leur identité et ajouté du doré pour apporter de la chaleur.',
     ['Photoshop', 'Illustrator']],
    ['Projet d\'école',
     'Réaliser un film en motion design pour une fédération sportive, avec un message clair : le sport est accessible à tous.',
     'Je me suis inspiré de l\'univers du jeu vidéo, de l\'étoile de Mario aux planètes d\'autres jeux. Le vert, le rose et le bleu reprennent la charte de la fédération, et une typographie pixel renforce la référence au jeu vidéo.',
     ['After Effects']],
    ['Projet d\'école',
     'Concevoir le site web d\'un food truck mexicain, avec une direction artistique fidèle à la culture mexicaine.',
     'J\'ai choisi une palette volontairement sourde, relevée par un beige qui apporte le contraste. Ces teintes s\'inspirent de la cuisine mexicaine, des nachos aux sauces pimentées. La typographie, chaleureuse et accessible, met le client à l\'aise.',
     ['Figma']],
    ['Projet personnel',
     'Créer la pochette d\'album d\'un artiste au son dynamique et puissant, avec une direction artistique affirmée, presque agressive.',
     'Je me suis appuyé sur l\'esthétique des clips de rap. Le titre en rouge traduit cette intensité, et le grain, présent dans une grande partie de mes projets, ancre la pochette dans ma direction artistique.',
     ['Photoshop', 'Illustrator']],
    ['Projet personnel',
     'Une pochette réalisée pour moi-même, afin de m\'exercer et d\'enrichir mes projets personnels dans ma direction artistique.',
     'Je me suis inspiré de l\'univers visuel des clips d\'un artiste de rap que j\'apprécie particulièrement.',
     ['Photoshop', 'Illustrator']],
    ['Projet personnel',
     'Dans la continuité de 63OG, un exercice personnel, décliné cette fois en affiche.',
     'Le jaune fait référence à un album de 63KLUF et aux bracelets qu\'il a sortis.',
     ['Photoshop', 'Illustrator']],
    ['Projet d\'école',
     'Associer deux esthétiques dans une même affiche : l\'opium et le lo-fi.',
     'Le violet évoque l\'univers lo-fi, tandis que le noir et blanc appliqué aux artistes renvoie à l\'opium. Le grain, fil conducteur de mon travail, relie l\'ensemble.',
     ['Photoshop', 'Illustrator']]
  ];
  // Principes (choisis avec Mathys, textes tirés de ses « Mes choix » — à corriger par lui) :
  // [ligne 1, ligne 2 du titre écrasé, explication, projets où on le voit (index dans PROJETS), image, légende]
  const PRINCIPES = [
    ['Partir de', 'la musique', 'Mon inspiration vient souvent de l\'univers visuel des clips de rap : leur grain, leurs couleurs, leur intensité. C\'est le point de départ de la plupart de mes projets, des pochettes aux affiches.', [5, 4, 0], '911', '63OG, cover'],
    ['Le grain', 'comme signature', 'Le grain est le fil conducteur de mon travail. Présent dans une grande partie de mes projets, il ancre chaque image dans ma direction artistique et les relie entre elles.', [4, 7, 0], '914', 'C3L3ST, cover'],
    ['Une couleur,', 'une raison', 'Je choisis chaque teinte pour ce qu\'elle raconte : le violet évoque le lo-fi, le jaune un album de 63KLUF, le bleu et le doré l\'identité du bar. Pour Motion Design, les couleurs reprennent la charte de la fédération.', [7, 6, 1, 2], '909', 'Obscura, affiche'],
    ['La typo', 'donne le ton', 'La typographie installe l\'ambiance d\'un projet : AKIRA pour un festival percutant, une typographie sobre et légèrement décalée pour un bar calme, une typographie pixel pour un film inspiré du jeu vidéo, une typographie chaleureuse pour un food truck.', [0, 1, 2, 3], '889', 'Graines Électroniques, affiche officielle'],
    ['Garder l\'esprit', 'du lieu', 'Quand je reprends une identité, je conserve l\'esprit du lieu tout en proposant un regard nouveau. Pour Toca Loco, la direction artistique reste fidèle à la culture mexicaine.', [1, 3], '900', 'Le Jeu de Paume, logo et carte'],
    ['Créer aussi', 'pour moi', 'En dehors des projets d\'école, je réalise des pochettes et des affiches pour moi-même. C\'est là que je m\'exerce le plus et que je pousse ma direction artistique plus loin.', [5, 6], '905', 'Dancing In The Rain, affiche']
  ];
  const NP = PRINCIPES.length;
  const NB = PROJETS.length;
  const src = id => 'assets/projets/' + id + '.jpg';
  const nn = i => String(i + 1).padStart(2, '0');
  const compte = p => { const nv = p[2].filter(x => x[2] === 'video').length, ni = p[2].length - nv; return [nv ? 'Vidéo' : '', ni ? ni + ' visuels' : ''].filter(Boolean).join(' + '); };
  const ORDRE = ['accueil', 'projets', 'principes', 'contact'];   // « À propos » est fusionné dans le premier volet

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
    '<button style="--img:url(' + src(p[3]) + ')" data-i="' + i + '" aria-label="' + p[0] + '" data-af></button>').join('');
  $$('#pellicule button').forEach(b => b.addEventListener('click', () => { location.hash = '#/projets/' + nn(+b.dataset.i); }));

  // Index : une ligne par projet
  $('#index').innerHTML = PROJETS.map((p, i) =>
    '<a href="#/projets/' + nn(i) + '" data-af><span class="t">' + p[0] + '</span><span class="c">' + p[1] + '</span><span class="k">' + compte(p) + '</span><img class="vi" src="' + src(p[3]) + '" alt="" loading="lazy"></a>').join('');

  // Visionneuse : une image à la fois, en grand, avec les vignettes du projet
  let vue = 0;
  function montrer(k) {
    const im = PROJETS[projet][2], n = im.length;
    vue = (k + n) % n;
    const v = $('#sc-vid'), estVideo = im[vue][2] === 'video';
    $('#sc-img').hidden = estVideo; $('#sc-ecran').hidden = !estVideo;
    $('.fiche').classList.toggle('film', estVideo);
    $('.fiche').classList.toggle('solo', im.length === 1);   // un film seul : pas de vignettes
    if (estVideo) { v.poster = src(im[vue][0]); if (!v.src.endsWith(im[vue][0] + '.mp4')) { v.src = 'assets/projets/' + im[vue][0] + '.mp4'; arreterFilm(); } }
    else { arreterFilm(); v.removeAttribute('src'); v.load(); $('#sc-img').src = src(im[vue][0]); }
    $('#sc-img').alt = PROJETS[projet][0] + ', ' + im[vue][1];
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
    $('#pj-num').textContent = p[1];
    $('#pj-titre span').textContent = p[0];
    $('#pj-compte').textContent = compte(p);
    $('#pj-cadre').textContent = TEXTES[i][0];
    $('#pj-demande').textContent = TEXTES[i][1];
    $('#pj-choix').textContent = TEXTES[i][2];
    $('#pj-outils').innerHTML = TEXTES[i][3].map(o => '<li>' + o + '</li>').join('');
    $('#pj-tech').innerHTML = (p[5] || []).map(([k, val]) => '<dt>' + k + '</dt><dd>' + val + '</dd>').join('');
    // la ligne discrète des principes que ce projet illustre
    const liesPr = PRINCIPES.map((x, k) => x[3].includes(i) ? '<a class="pill mini" href="#/principes/' + nn(k) + '" data-af>' + x[0] + ' ' + x[1] + ' →</a>' : '').join('');
    $('#pj-pr').innerHTML = liesPr ? '<span class="label">Principes</span>' + liesPr : '';
    $('#pj-palette').innerHTML = (p[4] || []).map(c => '<i style="background:' + c + '"></i>').join('');
    $('#sc-vign').innerHTML = p[2].map((x, k) => '<button data-k="' + k + '" aria-label="' + x[1] + '" data-af><img src="' + src(x[0]) + '" alt=""></button>').join('');
    $$('#sc-vign button').forEach(b => b.addEventListener('click', () => montrer(+b.dataset.k)));
    // téléphone : la visionneuse prend la hauteur de l'image la plus haute du projet, pour éviter les grands vides
    const sc = $('#pj-scene'); let rmax = 0;
    sc.style.removeProperty('--ratio');
    p[2].forEach(x => {
      if (x[2] === 'video') return;
      const im = new Image();
      im.onload = () => { if (projet !== i || !im.naturalWidth) return; rmax = Math.max(rmax, im.naturalHeight / im.naturalWidth); sc.style.setProperty('--ratio', rmax.toFixed(3)); };
      im.src = src(x[0]);
    });
    montrer(0);
    $$('#pellicule button').forEach(b => b.setAttribute('aria-current', +b.dataset.i === i));
    $('#pj-fil').textContent = p[0];
  }
  const allerProjet = d => { location.hash = '#/projets/' + nn((projet + d + NB) % NB); };
  $('#pj-prec').addEventListener('click', () => allerProjet(-1));
  $('#pj-suiv').addEventListener('click', () => allerProjet(1));
  $('#vers-planche').addEventListener('click', () => { location.hash = '#/projets'; });

  // ───── Principes : un principe par écran ─────
  let principe = -1;
  $('#pr-traits').innerHTML = PRINCIPES.map((x, k) => '<button data-k="' + k + '" aria-label="' + x[0] + ' ' + x[1] + '" data-af></button>').join('');
  $$('#pr-traits button').forEach(b => b.addEventListener('click', () => { location.hash = '#/principes/' + nn(+b.dataset.k); }));
  function montrerPrincipe(k) {
    const x = PRINCIPES[k], change = k !== principe;
    principe = k;
    $('#pr-titre').textContent = x[0] + ' ' + x[1];
    $('#pr-l1 span').textContent = x[0];
    $('#pr-l2 span').textContent = x[1];
    $('#pr-d').textContent = x[2];
    $('#pr-liens').innerHTML = x[3].map(i => '<a class="pill mini" href="#/projets/' + nn(i) + '" data-af>' + PROJETS[i][0] + ' →</a>').join('');
    $('#pr-img').src = src(x[4]);
    $('#pr-img').alt = x[5];
    $('#pr-leg').textContent = x[5];
    $$('#pr-traits button').forEach((b, j) => b.setAttribute('aria-current', j === k));
    fit($('#pr-l1')); fit($('#pr-l2'));
    if (change && !reduce) { const pr = $('.pr'); pr.classList.remove('entre'); void pr.offsetWidth; pr.classList.add('entre'); }
  }
  const allerPrincipe = d => { location.hash = '#/principes/' + nn((principe + d + NP) % NP); };
  $('#pr-prec').addEventListener('click', () => allerPrincipe(-1));
  $('#pr-suiv').addEventListener('click', () => allerPrincipe(1));
  // sur téléphone : glisser l'écran vers la gauche / la droite = principe suivant / précédent
  let px0 = null, py0 = 0;
  $('.pr').addEventListener('touchstart', e => { px0 = e.touches[0].clientX; py0 = e.touches[0].clientY; }, { passive: true });
  $('.pr').addEventListener('touchend', e => {
    if (px0 === null) return;
    const dx = e.changedTouches[0].clientX - px0, dy = e.changedTouches[0].clientY - py0; px0 = null;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) allerPrincipe(dx < 0 ? 1 : -1);
  });

  // ───── Routeur ─────
  function lire() {
    let [a, b] = location.hash.replace(/^#\/?/, '').split('/');
    if (a === 'playlist' || a === 'univers') a = 'principes';   // anciens liens partagés
    if (a === 'principes') return { v: 'principes', k: /^\d\d$/.test(b || '') && +b >= 1 && +b <= NP ? +b - 1 : 0 };
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
    if (r.i !== undefined) fiche(r.i); else $('#pj-fil').textContent = NB + ' projets';
    // sur téléphone la fiche défile : chaque nouveau projet (ou le retour à l'index) repart du haut
    if (r.v === 'projets') pj.querySelector('.contenu').scrollTop = 0;
    if (r.v === 'principes') { montrerPrincipe(r.k); $('.principes .contenu').scrollTop = 0; }
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
      if (r.v === 'principes') { allerPrincipe(d); return; }
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

  // ───── Boucle ─────
  function frame() {
    const ouvert = $('.volet.ouvert');
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
  addEventListener('resize', () => fitVolet($('.volet.ouvert')));
})();
