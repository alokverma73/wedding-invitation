(function () {
  'use strict';
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var body = document.body, root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Missing photo fallback */
  $$('img[data-photo]').forEach(function (img) {
    var mark = function () { var w = img.closest('[data-photo-wrap]'); if (w) w.classList.add('img-missing'); };
    img.addEventListener('error', mark);
    if (img.complete && img.naturalWidth === 0 && img.getAttribute('src')) mark();
  });

  /* Split headings into words for a staggered text reveal */
  $$('.h2').forEach(function (h) {
    var text = h.textContent.trim(), words = text.split(/\s+/);
    h.classList.add('split');
    h.setAttribute('aria-label', text);
    h.textContent = '';
    words.forEach(function (w, i) {
      var s = document.createElement('span');
      s.className = 'w'; s.setAttribute('aria-hidden', 'true');
      s.style.setProperty('--k', i); s.textContent = w;
      h.appendChild(s);
      if (i < words.length - 1) h.appendChild(document.createTextNode(' '));
    });
  });

  /* Petals and gold sparkles */
  function makePetals(count) {
    var box = $('#petals'); if (!box || reduce) return;
    for (var i = 0; i < count; i++) {
      var p = document.createElement('span'); p.className = 'petal';
      p.style.setProperty('--x', (Math.random() * 100).toFixed(1) + '%');
      p.style.setProperty('--s', (9 + Math.random() * 9).toFixed(1) + 'px');
      p.style.setProperty('--t', (13 + Math.random() * 12).toFixed(1) + 's');
      p.style.setProperty('--w', (-Math.random() * 18).toFixed(1) + 's');
      p.style.setProperty('--dx', (Math.random() * 120 - 60).toFixed(0) + 'px');
      box.appendChild(p);
    }
  }
  (function sparks() {
    var box = $('#sparks'); if (!box || reduce) return;
    for (var i = 0; i < 22; i++) {
      var s = document.createElement('span'); s.className = 'spark';
      s.style.setProperty('--x', (Math.random() * 100).toFixed(1) + '%');
      s.style.setProperty('--y', (Math.random() * 100).toFixed(1) + '%');
      s.style.setProperty('--s', (2 + Math.random() * 2.5).toFixed(1) + 'px');
      s.style.setProperty('--t', (3 + Math.random() * 4).toFixed(1) + 's');
      s.style.setProperty('--w', (-Math.random() * 6).toFixed(1) + 's');
      box.appendChild(s);
    }
  })();

  /* Music: starts when the guest touches the curtain (a user tap, so browsers allow it) */
  var audio = $('#bgm'), wantMusic = false;
  function fadeIn() {
    var v = 0, t = setInterval(function () { v += 0.05; audio.volume = Math.min(v, 0.8); if (v >= 0.8) clearInterval(t); }, 160);
  }
  function startMusic() {
    if (!audio) return;
    try { audio.volume = 0; } catch (e) {}
    var p = audio.play();
    wantMusic = true;
    if (p && p.then) {
      p.then(fadeIn).catch(function () {
        var retry = function () { audio.play().then(fadeIn).catch(function () {}); };
        document.addEventListener('pointerdown', retry, { once: true });
      });
    }
  }
  if (audio) {
    audio.addEventListener('error', function () { wantMusic = false; });
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) audio.pause();
      else if (wantMusic) audio.play().catch(function () {});
    });
  }

  /* Curtain opening */
  var intro = $('#intro'), opened = false;
  function openInvitation() {
    if (opened) return; opened = true;
    window.scrollTo(0, 0);
    intro.classList.add('open');
    body.classList.add('opened');
    startMusic();
    makePetals(10);
    setTimeout(function () { body.classList.remove('locked'); }, 1800);
    setTimeout(function () { intro.style.display = 'none'; }, 3200);
  }
  intro.addEventListener('click', openInvitation);

  /* Navigation */
  var nav = $('#nav'), menu = $('#mobileMenu'), menuBtn = $('#menuBtn');
  function toggleMenu(open) {
    menu.hidden = !open; body.classList.toggle('menu-open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  menuBtn.addEventListener('click', function () { toggleMenu(menu.hidden); });
  $$('a', menu).forEach(function (a) { a.addEventListener('click', function () { toggleMenu(false); }); });
  window.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !menu.hidden) toggleMenu(false); });
  window.addEventListener('resize', function () { if (window.innerWidth >= 860 && !menu.hidden) toggleMenu(false); });

  /* Scroll: progress bar, parallax variable, nav background */
  var progress = $('#progress'), ticking = false;
  function onScroll() {
    var y = window.scrollY, max = root.scrollHeight - window.innerHeight;
    root.style.setProperty('--sy', y.toFixed(0));
    progress.style.setProperty('--p', max > 0 ? (y / max).toFixed(4) : 0);
    nav.classList.toggle('solid', y > 40);
    ticking = false;
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  /* Reveal on scroll and active link */
  var targets = $$('.reveal, .split');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    targets.forEach(function (el) { io.observe(el); });
    var links = $$('.nav__links a');
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) links.forEach(function (l) { l.classList.toggle('active', l.getAttribute('href') === '#' + en.target.id); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    ['home', 'story', 'events', 'gallery', 'venue', 'rsvp'].forEach(function (id) { var s = document.getElementById(id); if (s) spy.observe(s); });
  } else { targets.forEach(function (el) { el.classList.add('in'); }); }

  /* Countdown to 6:00 PM IST, 03 Dec 2026 */
  var target = new Date('2026-12-03T18:00:00+05:30').getTime();
  var cd = [['d', 86400], ['h', 3600], ['m', 60], ['s', 1]].map(function (x) { return { el: $('#cd-' + x[0]), u: x[1] }; });
  var first = true, timer;
  function pad(n) { return n < 10 ? '0' + n : String(n); }
  function tick() {
    var diff = target - Date.now();
    if (diff <= 0) {
      $('#countGrid').hidden = true; $('#countDone').hidden = false; $('.kicker', $('#countdown')).hidden = true;
      clearInterval(timer); return;
    }
    var sec = Math.floor(diff / 1000);
    cd.forEach(function (c, i) {
      var v = pad(i === 0 ? Math.floor(sec / c.u) : Math.floor(sec / c.u) % (i === 3 ? 60 : i === 2 ? 60 : 24));
      if (c.el.textContent !== v) {
        c.el.textContent = v;
        if (!first && !reduce) { c.el.classList.remove('tick'); void c.el.offsetWidth; c.el.classList.add('tick'); }
      }
    });
    first = false;
  }
  tick(); timer = setInterval(tick, 1000);

  /* Card tilt (desktop with a mouse only) */
  if (window.matchMedia('(hover: hover)').matches && !reduce) {
    $$('[data-tilt]').forEach(function (c) {
      c.addEventListener('pointermove', function (e) {
        var r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        c.style.setProperty('--ry', ((x - 0.5) * 10).toFixed(2) + 'deg');
        c.style.setProperty('--rx', ((0.5 - y) * 10).toFixed(2) + 'deg');
        c.style.setProperty('--mx', (x * 100).toFixed(0) + '%'); c.style.setProperty('--my', (y * 100).toFixed(0) + '%');
        c.classList.add('tilting');
      });
      c.addEventListener('pointerleave', function () {
        c.classList.remove('tilting'); c.style.setProperty('--rx', '0deg'); c.style.setProperty('--ry', '0deg');
      });
    });
  }

  /* Photo viewer */
  var lb = $('#lightbox'), lbImg = $('#lbImg'), current = 0, startX = 0;
  function photos() { return $$('.gallery-item:not(.img-missing) img'); }
  function show(i) {
    var l = photos(); if (!l.length) return;
    current = (i + l.length) % l.length; lbImg.src = l[current].currentSrc || l[current].src; lbImg.alt = l[current].alt;
  }
  function openLb(i) { show(i); lb.hidden = false; body.classList.add('lb-open'); $('#lbClose').focus(); }
  function closeLb() { lb.hidden = true; body.classList.remove('lb-open'); }
  $('#galleryGrid').addEventListener('click', function (e) {
    var fig = e.target.closest('.gallery-item');
    if (fig && !fig.classList.contains('img-missing')) openLb(photos().indexOf($('img', fig)));
  });
  $('#lbClose').addEventListener('click', closeLb);
  $('#lbPrev').addEventListener('click', function () { show(current - 1); });
  $('#lbNext').addEventListener('click', function () { show(current + 1); });
  lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
  window.addEventListener('keydown', function (e) {
    if (lb.hidden) return;
    if (e.key === 'Escape') closeLb(); if (e.key === 'ArrowLeft') show(current - 1); if (e.key === 'ArrowRight') show(current + 1);
  });
  lb.addEventListener('touchstart', function (e) { startX = e.changedTouches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', function (e) {
    var dx = e.changedTouches[0].clientX - startX; if (Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1));
  }, { passive: true });
})();
