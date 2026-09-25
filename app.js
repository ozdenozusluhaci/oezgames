(function () {
  'use strict';
  var S = window.SITE || {};
  var root = document.documentElement;

  /* ---------------- Metinler (3 dil) ---------------- */
  var T = window.I18N;

  var LANGS = ['tr', 'en', 'de'];
  var PAGE_LANG = root.getAttribute('data-page-lang');   // ana sayfa, /en/ ve /de/ için sabit dil
  var LANG_URL = { tr: './', en: 'en/', de: 'de/' };
  var qs = new URLSearchParams(location.search);
  var lang = 'tr';
  if (PAGE_LANG) {
    lang = PAGE_LANG;
    // Ziyaretçi daha önce bilerek başka bir dil seçtiyse ana sayfada o dile yönlendir
    try {
      var saved = localStorage.getItem('lang');
      if (PAGE_LANG === 'tr' && saved && saved !== 'tr' && LANGS.indexOf(saved) >= 0 && !qs.has('stay')) {
        location.replace(LANG_URL[saved] + location.hash);
      }
    } catch (e) {}
  } else {
    try { lang = localStorage.getItem('lang') || ''; } catch (e) {}
    if (LANGS.indexOf(lang) < 0) {
      var nav = (navigator.language || 'tr').slice(0, 2).toLowerCase();
      lang = LANGS.indexOf(nav) >= 0 ? nav : 'tr';
    }
    if (LANGS.indexOf(qs.get('lang')) >= 0) lang = qs.get('lang');
  }

  function t(key) { return (T[lang] && T[lang][key]) || T.tr[key] || ''; }
  function tx(v) { if (!v) return ''; if (typeof v === 'string') return v; return v[lang] || v.tr || ''; }
  function $(sel) { return document.querySelector(sel); }
  function $$(sel) { return Array.prototype.slice.call(document.querySelectorAll(sel)); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  /* ---------------- Ses ---------------- */
  var sound = false, ac = null;
  try { sound = localStorage.getItem('sound') === '1'; } catch (e) {}
  function click(kind) {
    if (!sound) return;
    try {
      var AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
      ac = ac || new AC(); if (ac.state === 'suspended') ac.resume();
      var o = ac.createOscillator(), g = ac.createGain(), now = ac.currentTime;
      var f = kind === 'jelly' ? 420 : kind === 'tap' ? 1500 : 900;
      o.type = 'sine';
      o.frequency.setValueAtTime(f, now);
      o.frequency.exponentialRampToValueAtTime(f * (kind === 'jelly' ? 1.8 : 0.5), now + 0.07);
      g.gain.setValueAtTime(0.07, now);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);
      o.connect(g); g.connect(ac.destination); o.start(now); o.stop(now + 0.1);
    } catch (e) {}
  }
  document.addEventListener('pointerdown', function (e) {
    var el = e.target.closest && e.target.closest('.press, .jelly, .tap');
    if (!el) return;
    click(el.classList.contains('jelly') ? 'jelly' : el.classList.contains('tap') ? 'tap' : 'press');
  });
  var ICON_ON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/></svg>';
  var ICON_OFF = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9z"/><path d="M17 9l5 6M22 9l-5 6"/></svg>';
  function paintSound() {
    $$('[data-sound]').forEach(function (b) { b.innerHTML = sound ? ICON_ON : ICON_OFF; b.setAttribute('aria-pressed', String(sound)); });
  }
  $$('[data-sound]').forEach(function (b) {
    b.addEventListener('click', function () {
      sound = !sound; try { localStorage.setItem('sound', sound ? '1' : '0'); } catch (e) {}
      paintSound(); click('tap');
    });
  });

  /* ---------------- Tema (lamba) ---------------- */
  function paintTheme() {
    var night = root.dataset.theme === 'night';
    $$('[data-theme-toggle]').forEach(function (b) {
      b.setAttribute('aria-pressed', String(night));
      b.setAttribute('aria-label', night ? t('lampNight') : t('lampDay'));
    });
    var m = document.querySelectorAll('meta[name="theme-color"]');
    m.forEach(function (x) { x.setAttribute('content', night ? '#101A30' : '#F6EFE0'); });
  }
  $$('[data-theme-toggle]').forEach(function (b) {
    b.addEventListener('click', function () {
      root.dataset.theme = root.dataset.theme === 'night' ? 'day' : 'night';
      try { localStorage.setItem('theme', root.dataset.theme); } catch (e) {}
      paintTheme();
    });
  });

  /* ---------------- Mobil menü ---------------- */
  var drawer = $('#drawer');
  function setDrawer(open) {
    if (!drawer) return;
    drawer.classList.toggle('open', open);
    drawer.setAttribute('aria-hidden', String(!open));
    $$('[data-menu-open]').forEach(function (b) { b.setAttribute('aria-expanded', String(open)); });
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) { var c = drawer.querySelector('[data-menu-close]'); if (c) c.focus(); }
  }
  $$('[data-menu-open]').forEach(function (b) { b.addEventListener('click', function () { setDrawer(true); }); });
  $$('[data-menu-close]').forEach(function (b) { b.addEventListener('click', function () { setDrawer(false); }); });
  if (drawer) drawer.addEventListener('click', function (e) { if (e.target.closest('nav a')) setDrawer(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setDrawer(false); });

  /* ---------------- Basılı tut → satın al ---------------- */
  function bindHold(btn) {
    var timer = null, pct = 0, url = btn.getAttribute('data-url');
    function reset() {
      clearInterval(timer); timer = null; pct = 0;
      btn.style.outlineColor = 'transparent';
      if (!btn.classList.contains('done')) btn.textContent = t('buy');
    }
    btn.addEventListener('pointerdown', function (e) {
      e.preventDefault();
      if (timer) return;
      btn.textContent = t('hold');
      timer = setInterval(function () {
        pct += 5;
        btn.style.outlineColor = 'rgba(224,162,59,' + (0.25 + pct / 130).toFixed(2) + ')';
        if (pct >= 100) {
          clearInterval(timer); timer = null;
          btn.classList.add('done'); btn.textContent = '✓';
          click('press');
          setTimeout(function () { location.assign(url); }, 350);
        }
      }, 40);
    });
    ['pointerup', 'pointerleave', 'pointercancel'].forEach(function (ev) { btn.addEventListener(ev, function () { if (timer) reset(); }); });
    btn.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); location.assign(url); } });
    btn.addEventListener('contextmenu', function (e) { e.preventDefault(); });
  }

  /* ---------------- Oyun görselleri ---------------- */
  var ART = {
    fish: '<svg viewBox="0 0 160 120" aria-hidden="true"><path d="M0 80 q40 -14 80 0 t80 0 v40 h-160z" fill="#5E8C9A"/><path d="M40 70 h70 l-10 16 h-50z" fill="#9A5320"/><path d="M78 70 v-50 l34 60" fill="none" stroke="#1C2B4B" stroke-width="3"/><circle cx="60" cy="58" r="10" fill="#F6EFE0"/></svg>',
    house: '<svg viewBox="0 0 160 120" aria-hidden="true"><path d="M0 90 q80 -30 160 0 v30 h-160z" fill="#6F8563"/><rect x="56" y="54" width="48" height="40" fill="#F6EFE0" stroke="#1C2B4B" stroke-width="3"/><path d="M48 58 l32 -26 l32 26z" fill="#9A5320" stroke="#1C2B4B" stroke-width="3" stroke-linejoin="round"/><circle cx="128" cy="62" r="16" fill="#4F6447"/></svg>',
    bird: '<svg viewBox="0 0 160 120" aria-hidden="true"><ellipse cx="80" cy="66" rx="30" ry="36" fill="#7FB069"/><circle cx="80" cy="38" r="22" fill="#9CCB86"/><circle cx="88" cy="34" r="4" fill="#1C2B4B"/><path d="M100 38 l12 4 l-12 5z" fill="#E0A23B"/><path d="M40 104 h80" stroke="#9A5320" stroke-width="6" stroke-linecap="round"/></svg>',
    tablet: '<svg viewBox="0 0 160 120" aria-hidden="true"><rect x="42" y="14" width="76" height="94" rx="10" fill="#B89565" stroke="#6E4B22" stroke-width="3"/><g stroke="#5A3C18" stroke-width="3" stroke-linecap="round" fill="none"><path d="M56 34 h14 M78 34 l8 8 M96 30 v12"/><path d="M56 56 q8 -8 16 0 M82 52 h20"/><path d="M58 78 l10 8 l10 -8 M88 74 v14 M96 80 h8"/></g><circle cx="118" cy="96" r="12" fill="#E0A23B" opacity=".85"/></svg>'
  };

  /* ---------------- Sayfayı çiz ---------------- */
  function render() {
    root.lang = lang;
    $$('[data-i18n]').forEach(function (el) { el.textContent = t(el.getAttribute('data-i18n')); });
    $$('[data-i18n-label]').forEach(function (el) { el.setAttribute('aria-label', t(el.getAttribute('data-i18n-label'))); });
    $$('[data-langs]').forEach(function (box) {
      box.innerHTML = LANGS.map(function (l) {
        if (PAGE_LANG) return '<a class="tap" href="' + LANG_URL[l] + (l === 'tr' ? '?stay=1' : '') + '" data-lang-link="' + l + '" hreflang="' + l + '" lang="' + l + '"' + (l === lang ? ' aria-current="page"' : '') + '>' + l.toUpperCase() + '</a>';
        return '<button type="button" class="tap" data-lang="' + l + '" aria-pressed="' + (l === lang) + '" lang="' + l + '">' + l.toUpperCase() + '</button>';
      }).join('');
    });
    $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

    var photo = $('[data-photo]');
    if (photo) photo.innerHTML = S.about && S.about.photo ? '<img src="' + esc(S.about.photo) + '" alt="' + esc(S.name) + '" loading="lazy">' : '<span>' + t('photo') + '</span>';
    var bio = $('[data-bio]'); if (bio && S.about) bio.textContent = tx(S.about.bio);
    var stats = $('[data-stats]');
    if (stats && S.about) {
      var st = S.about.stats || {}, lab = t('stats');
      stats.innerHTML = ['books', 'games', 'countries', 'shows'].map(function (k) {
        return '<div class="stat"><strong>' + esc(st[k] || 0) + '</strong><span>' + esc(lab[k]) + '</span></div>';
      }).join('');
    }
    var tl = $('[data-timeline]');
    if (tl && S.about) tl.innerHTML = (S.about.timeline || []).map(function (r) { return '<li><b>' + esc(r.year) + '</b><span>' + esc(tx(r.text)) + '</span></li>'; }).join('');
    $$('[data-cv]').forEach(function (a) { if (S.about && S.about.cvPdf) a.href = S.about.cvPdf; });

    var books = $('[data-books]');
    if (books) {
      books.innerHTML = (S.books || []).map(function (b) {
        var action = b.buyUrl
          ? '<button type="button" class="btn small press hold" data-url="' + esc(b.buyUrl) + '" aria-label="' + esc(b.title + ': ' + t('holdHint')) + '">' + t('buy') + '</button>'
          : (b.freePdf ? '<a class="btn small ghost press" href="' + esc(b.freePdf) + '" download>' + t('free') + '</a>' : '<span class="muted">' + t('soon') + '</span>');
        return '<article class="book"><div class="cover" style="background:' + esc(b.color) + ';color:' + esc(b.ink) + '"><h3>' + esc(b.title) + '</h3><small>' + esc(tx(b.tag)) + '</small></div>' +
          '<div class="row"><strong>' + esc(b.price || '') + '</strong>' + action + '</div></article>';
      }).join('');
      books.querySelectorAll('.hold').forEach(bindHold);
    }

    var games = $('[data-games]');
    if (games) {
      games.innerHTML = (S.games || []).map(function (g) {
        return '<article class="cabinet"><div class="screen" style="background:' + esc(g.screen) + '">' + (ART[g.art] || '') + '</div>' +
          '<div class="row"><div><h3>' + esc(g.name) + '</h3><small>' + esc(tx(g.tag)) + '</small></div>' +
          '<a class="btn small alt jelly" href="games/' + esc(g.folder) + '/?lang=' + lang + '" aria-label="' + esc(g.name + ' ' + t('playLabel')) + '">' + t('play') + '</a></div></article>';
      }).join('');
    }

    var vids = $('[data-videos]');
    if (vids) {
      vids.innerHTML = (S.videos || []).map(function (id) {
        if (!id) return '<div class="yt" role="img" aria-label="' + t('video') + '">' + t('video') + '</div>';
        return '<button type="button" class="yt" data-yt="' + esc(id) + '" aria-label="' + t('videoPlay') + '"><img src="https://i.ytimg.com/vi/' + esc(id) + '/hqdefault.jpg" alt="" loading="lazy"><span class="play"><svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5l12 7-12 7z" fill="#121D36"/></svg></span></button>';
      }).join('');
      vids.querySelectorAll('[data-yt]').forEach(function (b) {
        b.addEventListener('click', function () {
          var id = b.getAttribute('data-yt');
          b.outerHTML = '<div class="yt"><iframe src="https://www.youtube-nocookie.com/embed/' + encodeURIComponent(id) + '?autoplay=1" title="YouTube" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe></div>';
        });
      });
    }
    var ph = $('[data-photos]');
    if (ph) ph.innerHTML = (S.photos || []).map(function (p) { return '<div>' + (p ? '<img src="' + esc(p) + '" alt="" loading="lazy">' : t('photo')) + '</div>'; }).join('');

    var stamps = $('[data-stamps]');
    if (stamps) {
      var rot = [-12, 6, -4, 9, -16, 3];
      stamps.innerHTML = (S.stamps || []).map(function (s, i) {
        return '<div class="stamp" style="--r:' + rot[i % rot.length] + 'deg"><strong>' + esc(tx(s.country)) + '</strong><span>' + esc(tx(s.what)) + '</span><span>' + esc(s.year) + '</span></div>';
      }).join('') + '<div class="stamp next">' + t('nextStamp') + '</div>';
      observeStamps();
    }

    var posts = $('[data-posts]');
    if (posts) {
      posts.innerHTML = (S.posts || []).slice(0, 3).map(function (p) {
        return '<a class="post" href="blog.html?p=' + encodeURIComponent(p.id) + '&lang=' + lang + '"><small>' + esc(p.minutes) + ' ' + t('min') + '</small><h3>' + esc(tx(p.title)) + '</h3></a>';
      }).join('');
    }

    var socials = $('[data-socials]');
    if (socials && S.social) {
      var ic = {
        youtube: '<svg viewBox="0 0 24 24" fill="none" stroke="#1C2B4B" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="5" width="20" height="14" rx="4"/><path d="M10 9l5 3-5 3z"/></svg>',
        instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="#1C2B4B" stroke-width="2" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".6"/></svg>',
        facebook: '<svg viewBox="0 0 24 24" fill="none" stroke="#1C2B4B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 3h-2a4 4 0 0 0-4 4v3H7v4h2v7h4v-7h2.5l.5-4h-3V7.5a1 1 0 0 1 1-1h2z"/></svg>'
      };
      socials.innerHTML = Object.keys(ic).filter(function (k) { return S.social[k]; }).map(function (k) {
        return '<a class="tap" href="' + esc(S.social[k]) + '" target="_blank" rel="noopener" aria-label="' + k.charAt(0).toUpperCase() + k.slice(1) + '">' + ic[k] + '</a>';
      }).join('');
    }
    $$('[data-mail]').forEach(function (a) { a.href = 'mailto:' + (S.email || ''); });

    renderArticle();
    paintSound();
    paintTheme();
  }

  document.addEventListener('click', function (e) {
    var ln = e.target.closest && e.target.closest('[data-lang-link]');
    if (ln) { try { localStorage.setItem('lang', ln.getAttribute('data-lang-link')); } catch (err) {} return; }
    var b = e.target.closest && e.target.closest('[data-lang]');
    if (!b) return;
    lang = b.getAttribute('data-lang');
    try { localStorage.setItem('lang', lang); } catch (err) {}
    render();
    var again = document.querySelector('[data-lang="' + lang + '"]'); if (again && drawer && !drawer.classList.contains('open')) again.focus();
  });

  /* ---------------- Pasaport damgaları ---------------- */
  function observeStamps() {
    var items = $$('.stamp:not(.next)');
    if (!('IntersectionObserver' in window)) { items.forEach(function (s) { s.classList.add('in'); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var i = items.indexOf(en.target);
        setTimeout(function () { en.target.classList.add('in'); }, i * 220);
        io.unobserve(en.target);
      });
    }, { threshold: 0.5 });
    items.forEach(function (s) { io.observe(s); });
  }

  /* ---------------- Blog yazısı + fincan ---------------- */
  var cupBound = false;
  function renderArticle() {
    var box = $('[data-article]'); if (!box) return;
    var id = qs.get('p');
    var post = (S.posts || []).filter(function (p) { return p.id === id; })[0] || (S.posts || [])[0];
    if (!post) { box.innerHTML = '<p>' + t('notFound') + '</p>'; return; }
    document.title = tx(post.title) + ' — ' + (S.name || '');
    box.innerHTML = '<p class="muted">' + esc(post.minutes) + ' ' + t('min') + '</p><h1>' + esc(tx(post.title)) + '</h1><div class="body">' +
      (post.body || []).map(function (p) { return '<p>' + esc(tx(p)) + '</p>'; }).join('') + '</div>';
    updateCup();
    if (!cupBound) {
      cupBound = true;
      window.addEventListener('scroll', updateCup, { passive: true });
      window.addEventListener('resize', updateCup);
    }
  }
  function updateCup() {
    var box = $('[data-article]'), liquid = $('[data-liquid]'), cb = $('.cupbox');
    if (!box || !liquid || !cb) return;
    var r = box.getBoundingClientRect();
    var total = r.height - window.innerHeight * 0.6;
    var p = total <= 0 ? 1 : Math.min(1, Math.max(0, -r.top / total));
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) p = 1;
    liquid.setAttribute('y', String(206 - p * 130));
    var pct = Math.round(p * 100);
    cb.classList.toggle('full', pct >= 100);
    var h = $('[data-cup-title]'); if (h) h.textContent = pct >= 100 ? t('cupFull') : pct > 0 ? t('cupMid') : t('cupEmpty');
    var pc = $('[data-cup-pct]'); if (pc) pc.textContent = '%' + pct + ' ' + t('read');
  }

  render();

  /* ---------------- PWA: çevrimdışı çalışma ---------------- */
  if ('serviceWorker' in navigator && location.protocol === 'https:') {
    window.addEventListener('load', function () { navigator.serviceWorker.register('sw.js').catch(function () {}); });
  }
})();
