// Vanilla carousel built on native CSS scroll-snap.
// Touch swipe, trackpad and keyboard work natively; JS only adds arrows,
// pagination dots, mouse drag and filtering.
(() => {
  const ICON_MORE = `<img src="data:image/svg+xml,%3csvg%20width='17'%20height='18'%20viewBox='0%200%2017%2018'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M8.49988%2012.9657C8.28219%2012.9657%208.0645%2012.8824%207.89868%2012.7166L6.44712%2011.265H3.39775C2.92836%2011.265%202.5474%2010.8841%202.5474%2010.4147V2.76149C2.5474%202.29209%202.92836%201.91113%203.39775%201.91113H6.79917C7.02537%201.91113%207.24051%202.00042%207.40037%202.16029L8.49988%203.25979L9.59939%202.16029C9.7584%202.00042%209.97524%201.91113%2010.2006%201.91113H13.602C14.0714%201.91113%2014.4524%202.29209%2014.4524%202.76149V10.4147C14.4524%2010.8841%2014.0714%2011.265%2013.602%2011.265H10.5526L9.10108%2012.7166C8.93526%2012.8824%208.71757%2012.9657%208.49988%2012.9657ZM4.24811%209.56432H6.79917C7.02537%209.56432%207.24051%209.65361%207.40037%209.81347L8.49988%2010.913L9.59939%209.81347C9.7584%209.65361%209.97524%209.56432%2010.2006%209.56432H12.7517V3.61184H10.5526L9.10108%205.0634C8.76859%205.39588%208.23117%205.39588%207.89868%205.0634L6.44712%203.61184H4.24811V9.56432ZM7.98967%2016.1971C8.14103%2016.311%208.32046%2016.3672%208.49988%2016.3672C8.67931%2016.3672%208.85958%2016.311%209.01009%2016.1971L12.1853%2013.8161H16.1531C16.6225%2013.8161%2017.0034%2013.4351%2017.0034%2012.9657V3.61184H15.3027V12.1154H11.9013C11.7168%2012.1154%2011.5382%2012.1749%2011.3911%2012.2855L8.49988%2014.4539L5.60868%2012.2855C5.46156%2012.1749%205.28299%2012.1154%205.09846%2012.1154H1.69705V3.61184H-0.00366211V12.9657C-0.00366211%2013.4351%200.377297%2013.8161%200.846692%2013.8161H4.81445L7.98967%2016.1971Z'%20fill='%230064F0'/%3e%3c/svg%3e" alt="" class="w-4">`;
  const ICON_PREV = '<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M10 3 5 8l5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const ICON_UP_RIGHT = '<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M5 11 11 5M6 5h5v5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const SEGMENTS = { 'higher-ed': 'Higher Education', business: 'Business School', healthcare: 'Healthcare' };
  const ICON_PLAY = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l10.5-6.5z" fill="currentColor"/></svg>';
  const ICON_NEXT = '<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="m6 3 5 5-5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  function cardHTML(cs) {
    return `<a class="card-link" href="${esc(cs.href)}" target="_blank" rel="noopener" aria-label="Read more about ${esc(cs.title)}">
      <div class="card">
        <div class="card__media"><img src="${esc(cs.image)}" alt="" loading="lazy"></div>
        <div class="card__body">
          <div><div class="pill pill--blue">Case Study</div><div class="card__title">${esc(cs.title)}</div></div>
          <div class="card__more">${ICON_MORE}<span>Read more</span></div>
        </div>
      </div></a>`;
  }

  // Variant C: full-bleed image card, text over a gradient (inspired by Apple-style card strips)
  function immersiveCardHTML(cs) {
    return `<a class="card-link" href="${esc(cs.href)}" target="_blank" rel="noopener" aria-label="Read more about ${esc(cs.title)}">
      <div class="icard">
        <img src="${esc(cs.image)}" alt="" loading="lazy">
        <div class="pill pill--blue icard__pill">Case Study</div>
        <div class="icard__body">
          <div class="icard__meta">${esc(cs.org)} · ${esc(SEGMENTS[cs.segment])}</div>
          <div class="icard__title">${esc(cs.title)}</div>
          <span class="icard__go">${ICON_UP_RIGHT}</span>
        </div>
      </div></a>`;
  }

  // Variant D: one case study per slide (Figma "Video Case Studies"): video on the
  // left with the case study tag and title over it, quote and author on the right.
  // The video sits paused on its first frame (#t=0.1 makes Safari paint it too);
  // the overlay button on top starts playback and then gets out of the way.
  // first and last name only: skips titles, middle initials and suffixes (Dr., A., II)
  const initials = (name) => {
    const words = name.split(/\s+/).filter((w) => /^[A-ZÀ-Ý][a-zà-ÿ]+$/.test(w) && !/^(Dr|Professor)$/.test(w));
    return (words[0][0] + (words.length > 1 ? words[words.length - 1][0] : '')).toUpperCase();
  };

  // Right half shared by both story layouts: quote, author, institution logo
  function storyBodyHTML(st) {
    const logo = st.logo
      ? `<img class="vstory__logo" src="${esc(st.logo)}" alt="${esc(st.org)}" loading="lazy">`
      : `<span class="vstory__logo vstory__logo--text">${esc(st.org)}</span>`;
    return `<div class="vstory__body">
        <blockquote class="vstory__quote" cite="${esc(st.href)}"><p>“${esc(st.quote)}”</p></blockquote>
        <div class="vstory__author">
          <div class="vstory__signature">
            <span class="vstory__avatar" aria-hidden="true">${esc(initials(st.name))}</span>
            <p class="vstory__person"><strong>${esc(st.name)}</strong><span>${esc(st.role)}, ${esc(st.org)}</span></p>
          </div>
          ${logo}
        </div>
      </div>`;
  }

  function videoStoryHTML(st) {
    return `<article class="vstory">
      <div class="vstory__media">
        <video class="vstory__video" src="${esc(st.video)}#t=0.1" poster="${esc(st.image)}" preload="none" muted playsinline tabindex="-1" aria-label="${esc(st.org)} customer story"></video>
        <button class="vstory__poster" type="button" data-play aria-label="Play video: ${esc(st.title)}">
          <img class="vstory__image" src="${esc(st.image)}" alt="" loading="lazy">
          <span class="vstory__play"><img src="assets/play.svg" alt="" width="19.4286" height="19.4286"></span>
          <span class="vstory__caption">
            <span class="vstory__tag">${esc(st.tag)}</span>
            <span class="vstory__title">${esc(st.title)}</span>
          </span>
        </button>
      </div>
      ${storyBodyHTML(st)}
    </article>`;
  }

  // Variant D · Image (Figma "Multiple Images"): the left half is a link to the case study,
  // with tag, title, reading time and a round arrow button over the image.
  function imageStoryHTML(st) {
    return `<article class="vstory vstory--image">
      <a class="vstory__media vstory__cover" href="${esc(st.href)}" target="_blank" rel="noopener" aria-label="Read the case study: ${esc(st.title)}">
        <img class="vstory__image" src="${esc(st.image)}" alt="" loading="lazy">
        <span class="vstory__strip"></span>
        <span class="vstory__caption vstory__caption--row">
          <span class="vstory__text">
            <span class="vstory__tag">${esc(st.tag)}</span>
            <span class="vstory__title">${esc(st.title)}</span>
            <span class="vstory__read"><img src="assets/timer.svg" alt="" width="13" height="13">${esc(st.readTime)}</span>
          </span>
          <span class="vstory__go"><img src="assets/arrow-go.svg" alt="" width="17" height="17"></span>
        </span>
      </a>
      ${storyBodyHTML(st)}
    </article>`;
  }

  const LAYOUTS = { immersive: immersiveCardHTML, video: videoStoryHTML, image: imageStoryHTML };
  const SOURCES = { stories: () => window.VIDEO_STORIES, 'image-stories': () => window.IMAGE_STORIES };

  function setup(root) {
    const section = root.closest('section');
    const data = SOURCES[root.dataset.source]?.() || window.CASE_STUDIES;
    const renderCard = LAYOUTS[root.dataset.layout] || cardHTML;
    const isStory = root.dataset.layout === 'video' || root.dataset.layout === 'image';
    const slideClass = isStory ? 'slide slide--full' : 'slide';
    // Variant D uses the Figma chevrons
    const prevIcon = isStory ? '<img src="assets/arrow-left.svg" alt="" width="13" height="13">' : ICON_PREV;
    const nextIcon = isStory ? '<img src="assets/arrow-right.svg" alt="" width="13" height="13">' : ICON_NEXT;

    const track = document.createElement('ul');
    track.className = 'track';
    track.tabIndex = 0;
    track.setAttribute('aria-label', 'Case studies, use arrow keys to scroll');
    track.innerHTML = data.map((cs) =>
      `<li class="${slideClass}" role="group" aria-roledescription="slide" data-segment="${esc(cs.segment || '')}">${renderCard(cs)}</li>`
    ).join('');
    root.appendChild(track);

    const live = document.createElement('div');
    live.className = 'sr-only';
    live.setAttribute('aria-live', 'polite');
    root.appendChild(live);

    // Arrows
    const arrowsHost = section.querySelector('[data-arrows]');
    arrowsHost.innerHTML =
      `<button class="arrow" type="button" aria-label="Previous case studies">${prevIcon}</button>` +
      `<button class="arrow" type="button" aria-label="Next case studies">${nextIcon}</button>`;

    // Nav bar under the carousel: [prev] [dots] [next].
    // Its arrows only show on mobile, where the header arrows are hidden (CSS).
    const bottomNav = document.createElement('div');
    bottomNav.className = isStory ? 'cs-bottom-nav cs-bottom-nav--story' : 'cs-bottom-nav';
    bottomNav.innerHTML =
      `<button class="arrow" type="button" aria-label="Previous case studies">${prevIcon}</button>` +
      `<div class="dots"></div>` +
      `<button class="arrow" type="button" aria-label="Next case studies">${nextIcon}</button>`;
    root.after(bottomNav);
    const dotsEl = bottomNav.querySelector('.dots');
    const arrowButtons = [...arrowsHost.children, ...bottomNav.querySelectorAll('.arrow')];
    const prevBtns = arrowButtons.filter((b) => b.getAttribute('aria-label').startsWith('Previous'));
    const nextBtns = arrowButtons.filter((b) => b.getAttribute('aria-label').startsWith('Next'));

    const slides = () => [...track.children].filter((s) => !s.hidden);
    const gap = () => parseFloat(getComputedStyle(track).columnGap) || 0;
    const stepSize = () => { const s = slides()[0]; return s ? s.getBoundingClientRect().width + gap() : 1; };
    const perView = () => Math.max(1, Math.floor((track.clientWidth - 24 + gap() + 2) / stepSize()));
    const maxScroll = () => track.scrollWidth - track.clientWidth;
    const firstIndex = () => Math.round(track.scrollLeft / stepSize());
    const goTo = (i) => {
      const n = slides().length;
      const clamped = Math.max(0, Math.min(i, n - perView()));
      track.scrollTo({ left: clamped * stepSize() });
    };

    let lastDotsKey = '';
    function renderDots(pages) {
      const key = pages + ':' + slides().length;
      if (key === lastDotsKey) return;
      lastDotsKey = key;
      dotsEl.innerHTML = Array.from({ length: pages }, (_, i) =>
        `<button class="dot" type="button" aria-label="Go to group ${i + 1} of ${pages}"></button>`).join('');
      dotsEl.hidden = pages <= 1;
      dotsEl.querySelectorAll('.dot').forEach((d, i) => d.addEventListener('click', () => goTo(i * perView())));
    }

    let lastAnnounce = '';
    function update() {
      const n = slides().length;
      const pv = Math.min(perView(), n);
      const atStart = track.scrollLeft <= 2;
      const atEnd = track.scrollLeft >= maxScroll() - 2;
      const first = atEnd ? Math.max(0, n - pv) : firstIndex();
      const last = Math.min(n, first + pv);

      prevBtns.forEach((b) => { b.disabled = atStart; });
      nextBtns.forEach((b) => { b.disabled = atEnd; });
      arrowsHost.hidden = n <= pv;
      bottomNav.classList.toggle('is-static', n <= pv);
      const pages = Math.ceil(n / pv);
      renderDots(pages);
      const current = atEnd ? pages - 1 : Math.floor(first / pv);
      dotsEl.querySelectorAll('.dot').forEach((d, i) => d.setAttribute('aria-current', String(i === current)));
      slides().forEach((s, i) => s.setAttribute('aria-label', `${i + 1} of ${n}`));

      // stop any video that has scrolled out of view
      slides().forEach((s, i) => { if (i < first || i >= last) s.querySelector('video')?.pause(); });

      const msg = pv === 1 ? `Showing story ${first + 1} of ${n}` : `Showing case studies ${first + 1} to ${last} of ${n}`;
      if (msg !== lastAnnounce) { lastAnnounce = msg; live.textContent = msg; }
    }

    let raf = 0;
    track.addEventListener('scroll', () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(update); }, { passive: true });
    new ResizeObserver(() => { lastDotsKey = ''; update(); }).observe(track);

    prevBtns.forEach((b) => b.addEventListener('click', () => goTo(firstIndex() - perView())));
    nextBtns.forEach((b) => b.addEventListener('click', () => goTo(firstIndex() + perView())));

    track.addEventListener('keydown', (e) => {
      if (e.target !== track) return;
      if (e.key === 'ArrowRight') { e.preventDefault(); goTo(firstIndex() + 1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(firstIndex() - 1); }
      if (e.key === 'Home') { e.preventDefault(); goTo(0); }
      if (e.key === 'End') { e.preventDefault(); goTo(Infinity); }
    });

    // Mouse drag (desktop). Touch and pen keep native scrolling.
    let drag = null;
    track.addEventListener('pointerdown', (e) => {
      if (e.pointerType !== 'mouse' || e.button !== 0 || e.target.closest('video')) return;
      drag = { x: e.clientX, left: track.scrollLeft, moved: false };
    });
    window.addEventListener('pointermove', (e) => {
      if (!drag) return;
      const dx = e.clientX - drag.x;
      if (!drag.moved && Math.abs(dx) > 5) {
        drag.moved = true;
        track.style.scrollSnapType = 'none';
        track.style.scrollBehavior = 'auto';
        track.style.cursor = 'grabbing';
      }
      if (drag.moved) track.scrollLeft = drag.left - dx;
    });
    window.addEventListener('pointerup', () => {
      if (!drag) return;
      const wasDragged = drag.moved;
      drag = null;
      if (!wasDragged) return;
      track.style.cursor = '';
      track.style.scrollBehavior = '';
      track.style.scrollSnapType = '';
      goTo(Math.round(track.scrollLeft / stepSize()));
      // swallow the click that follows a drag so the card link doesn't open
      track.addEventListener('click', (ev) => { ev.preventDefault(); ev.stopPropagation(); }, { capture: true, once: true });
    });
    track.addEventListener('dragstart', (e) => e.preventDefault());

    // Video posters (variant D)
    track.addEventListener('click', (e) => {
      const poster = e.target.closest('[data-play]');
      if (!poster) return;
      const video = poster.previousElementSibling;
      poster.remove();
      video.muted = false;
      video.controls = true;
      video.removeAttribute('tabindex');
      video.currentTime = 0;
      video.play().catch(() => {});
      video.focus();
    });

    // Sector filter chips (variant B)
    if (root.hasAttribute('data-filterable')) {
      const chips = section.querySelectorAll('[data-chips] .chip');
      chips.forEach((chip) => {
        const f = chip.dataset.filter;
        const count = f === 'all' ? data.length : data.filter((d) => d.segment === f).length;
        chip.insertAdjacentHTML('beforeend', `<span class="count">${count}</span>`);
        chip.addEventListener('click', () => {
          chips.forEach((c) => { c.classList.toggle('is-active', c === chip); c.setAttribute('aria-pressed', String(c === chip)); });
          [...track.children].forEach((s) => { s.hidden = f !== 'all' && s.dataset.segment !== f; });
          track.style.scrollBehavior = 'auto';
          track.scrollLeft = 0;
          track.style.scrollBehavior = '';
          lastDotsKey = '';
          update();
        });
      });
    }

    update();
  }

  document.querySelectorAll('[data-carousel]').forEach(setup);
})();
