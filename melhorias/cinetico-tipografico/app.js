/* ============================================================================
   CINÉTICO TIPOGRÁFICO — app.js
   Maria Marta Garcia · Motion Director: João Paulo
   GSAP 3.13 + ScrollTrigger + SplitText + ScrambleText
   ============================================================================ */

(function () {
  'use strict';

  /* --------------------------------------------------------------------------
     0. PREFLIGHT — Reduced motion gate
     Content is always visible; we only add motion if conditions allow.
     -------------------------------------------------------------------------- */
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Safety fallback: se GSAP OU ScrollTrigger falharem (requests CDN
     independentes), nada fica escondido — o gate .motion-ready abaixo só
     entra com os dois presentes. ScrollTrigger é referenciado sem typeof
     no registro dos plugins; um ReferenceError ali mataria a IIFE inteira
     DEPOIS do pre-hide, violando o "conteúdo sempre visível". */
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  /* Flag for CSS pre-hiding reveal targets */
  if (!prefersReduced) {
    document.documentElement.classList.add('motion-ready');
  }

  /* Register plugins */
  const plugins = [ScrollTrigger];
  if (typeof SplitText !== 'undefined') plugins.push(SplitText);
  if (typeof ScrambleTextPlugin !== 'undefined') plugins.push(ScrambleTextPlugin);
  gsap.registerPlugin(...plugins);

  /* Global GSAP defaults */
  gsap.defaults({ ease: 'power3.out', duration: 0.9 });

  /* ============================================================================
     1. CUSTOM CURSOR
     ============================================================================ */
  const cursor     = document.getElementById('cursor');
  const cursorRing = document.getElementById('cursor-ring');

  if (cursor && cursorRing && window.matchMedia('(hover: hover)').matches) {
    let mouseX = 0, mouseY = 0;
    let ringX  = 0, ringY  = 0;

    document.addEventListener('mousemove', e => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      gsap.to(cursor, { x: mouseX, y: mouseY, duration: 0.15, ease: 'power1.out' });
    });

    /* Ring follows with lag */
    gsap.ticker.add(() => {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      gsap.set(cursorRing, { x: ringX, y: ringY });
    });

    /* Magnetic on interactive elements */
    const magnetTargets = document.querySelectorAll('a, button, .btn, .diff-card, .marquee-name, .livro');
    magnetTargets.forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
  }

  /* ============================================================================
     2. HEADER — scroll state
     ============================================================================ */
  const header = document.querySelector('.site-header');
  if (header) {
    ScrollTrigger.create({
      start: 80,
      onEnter:    () => header.classList.add('scrolled'),
      onLeaveBack: () => header.classList.remove('scrolled'),
    });
  }

  /* ============================================================================
     3. MOBILE MENU
     ============================================================================ */
  const hamburger    = document.querySelector('.hamburger-btn');
  const mobileOverlay = document.querySelector('.mobile-overlay');

  if (hamburger && mobileOverlay) {
    hamburger.addEventListener('click', () => {
      const open = hamburger.classList.toggle('open');
      mobileOverlay.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', open);
      /* Menu aberto nunca convive com header oculto (§23) */
      if (open && header) header.classList.remove('oculto');
      document.body.style.overflow = open ? 'hidden' : '';
    });

    mobileOverlay.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileOverlay.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  /* ============================================================================
     4. HERO ENTRANCE — SplitText + staggered line reveal
     ============================================================================ */
  if (prefersReduced) {
    /* Reduced motion: just fade in gently */
    gsap.fromTo('.hero__inner > *', { autoAlpha: 0 }, {
      autoAlpha: 1, duration: 0.5, stagger: 0.1, delay: 0.3
    });
  } else {
    const tl = gsap.timeline({ delay: 0.2, defaults: { ease: 'expo.out' } });

    /* Eyebrow scramble */
    const eyebrow = document.querySelector('.hero__eyebrow-text');
    if (eyebrow && typeof ScrambleTextPlugin !== 'undefined') {
      tl.from(eyebrow, { autoAlpha: 0, duration: 0.3 }, 0)
        .to(eyebrow, {
          duration: 1.2,
          scrambleText: {
            text: eyebrow.dataset.text || eyebrow.textContent,
            chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ·',
            speed: 0.5,
            revealDelay: 0.3,
          }
        }, 0.1);
    }

    /* Title lines — SplitText if available, fallback to pre-marked spans
       (filho direto: o .hero__caret dentro do span dourado fica de fora) */
    const titleLines = document.querySelectorAll('.hero__title-line > span');
    if (titleLines.length) {
      gsap.set(titleLines, { y: '105%', rotation: 1.5 });
      tl.to(titleLines, {
        y: '0%',
        rotation: 0,
        duration: 1.1,
        stagger: 0.08,
        ease: 'expo.out',
      }, 0.05);
    }

    /* Verbs — stagger in */
    const verbs = document.querySelectorAll('.hero__verb');
    gsap.set(verbs, { autoAlpha: 0, y: 24 });
    tl.to(verbs, {
      autoAlpha: 1, y: 0,
      duration: 0.8,
      stagger: 0.1,
    }, 0.55);

    /* Lead text */
    const lead = document.querySelector('.hero__lead');
    if (lead) {
      gsap.set(lead, { autoAlpha: 0, y: 20 });
      tl.to(lead, { autoAlpha: 1, y: 0, duration: 0.8 }, 0.75);
    }

    /* CTA */
    const cta = document.querySelector('.hero__cta');
    if (cta) {
      gsap.set(cta, { autoAlpha: 0, y: 16 });
      tl.to(cta, { autoAlpha: 1, y: 0, duration: 0.7 }, 0.9);
    }

    /* Microcopy */
    const micro = document.querySelector('.hero__microcopy');
    if (micro) {
      gsap.set(micro, { autoAlpha: 0 });
      tl.to(micro, { autoAlpha: 1, duration: 0.6 }, 1.1);
    }

    /* Caret — acende depois que o título assenta (pisca via CSS) */
    tl.set('.hero__caret', { autoAlpha: 1 }, 1.35);

    /* Corrige do lead — risco dourado, erro esmaece, correção se revela */
    tl.to('.hero__lead .corrige__risco', { scaleX: 1, duration: 0.35, ease: 'power2.in' }, 1.4)
      .to('.hero__lead .corrige__erro',  { color: '#a09c92' /* --stone-400 */, duration: 0.25 }, 1.7)
      .to('.hero__lead .corrige__certo', { clipPath: 'inset(0 0% 0 0)', duration: 0.5, ease: 'expo.out' }, 1.8);

    /* Ghost letters subtle parallax */
    const ghost1 = document.querySelector('.hero__ghost--1');
    const ghost2 = document.querySelector('.hero__ghost--2');
    if (ghost1) gsap.fromTo(ghost1, { y: 0 }, {
      y: -120,
      ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 },
    });
    if (ghost2) gsap.fromTo(ghost2, { y: 0 }, {
      y: 80,
      ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1.5 },
    });

    /* Scroll hint line fade out */
    gsap.to('.scroll-hint', {
      autoAlpha: 0,
      ease: 'none',
      scrollTrigger: { trigger: '.hero', start: '30% top', end: '60% top', scrub: true },
    });
  }

  /* ============================================================================
     5. MARQUEE — two rows, different speeds/directions
     ============================================================================ */
  /* CSS animation handles it — just make sure rows are duplicated (done in HTML) */
  /* Pause on hover */
  document.querySelectorAll('.marquee-row').forEach(row => {
    const inner = row.querySelector('.marquee-inner');
    if (!inner) return;
    row.addEventListener('mouseenter', () => { inner.style.animationPlayState = 'paused'; });
    row.addEventListener('mouseleave', () => { inner.style.animationPlayState = 'running'; });
  });

  /* ============================================================================
     6. MANIFESTO — scroll-pinned phrase rotation
     The section has extra scroll height (set via min-height in JS below).
     ============================================================================ */
  const manifestoSection = document.querySelector('.manifesto');
  const phrases          = document.querySelectorAll('.manifesto__phrase');
  const fracaoAtual      = document.querySelector('.fracao-atual');
  const N                = phrases.length;

  if (manifestoSection && N > 0 && !prefersReduced) {
    /* Set section height = viewport * N so each phrase gets a full scroll */
    manifestoSection.style.minHeight = `${N * 100}dvh`;

    const setPhrase = (index) => {
      phrases.forEach((p, i) => {
        p.classList.toggle('active', i === index);
      });
      /* Fração de fólio — numerador pulsa quando o "capítulo" vira */
      if (fracaoAtual && fracaoAtual.textContent !== String(index + 1)) {
        fracaoAtual.textContent = index + 1;
        gsap.fromTo(fracaoAtual,
          { y: 6, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.3, overwrite: 'auto' }
        );
      }
    };

    /* Initial state */
    setPhrase(0);

    ScrollTrigger.create({
      trigger: manifestoSection,
      start: 'top top',
      end: 'bottom bottom',
      scrub: false,
      pin: '.manifesto__inner',
      anticipatePin: 1,
      /* Cadência de virada de página — imã pro centro de cada frase */
      snap: {
        snapTo: v => (Math.floor(gsap.utils.clamp(0, 0.999, v) * N) + 0.5) / N,
        duration: { min: 0.25, max: 0.6 },
        ease: 'power2.inOut',
        directional: true,
      },
      onUpdate: self => {
        const idx = Math.floor(self.progress * N);
        const clamped = Math.min(idx, N - 1);
        setPhrase(clamped);
      },
    });

    /* Animate each phrase in/out with SplitText if available */
    let frase2Revisada  = false; /* corrige ao vivo roda UMA vez; reentradas chegam prontas (styles inline persistem) */
    let frase3Sublinhada = false; /* squiggle desenha UMA vez pelo mesmo motivo */

    phrases.forEach((phrase) => {
      const observer = new MutationObserver(mutations => {
        mutations.forEach(m => {
          if (m.type === 'attributes' && m.attributeName === 'class') {
            const el   = m.target;
            const txt  = el.querySelector('.manifesto__text');
            if (!txt) return;
            if (el.classList.contains('active')) {
              gsap.fromTo(txt,
                { autoAlpha: 0, y: 30, filter: 'blur(8px)' },
                { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.7, ease: 'power3.out' }
              );

              /* Frase 2 — revisada ao vivo: risco → esmaece → correção */
              const struck = el.querySelector('.struck');
              if (struck && !frase2Revisada) {
                frase2Revisada = true;
                const revisao = gsap.timeline({ delay: 0.5 });
                revisao
                  .to(el.querySelector('.strike-line'), { scaleX: 1, duration: 0.4, ease: 'power2.in' })
                  .to(struck, { color: '#4d4843' /* --stone-600 */, duration: 0.3 }, '-=0.1');
                const revela = { autoAlpha: 1, duration: 0.9 };
                if (typeof ScrambleTextPlugin !== 'undefined') {
                  revela.scrambleText = { text: 'revelar', chars: 'aeiourlv', speed: 0.4 };
                }
                revisao.to(el.querySelector('.corrected'), revela);
              }

              /* Frase 3 — squiggle sob "alguém passou por ali." */
              const goldPath = el.querySelector('.gold-underline .squiggle path');
              if (goldPath && !frase3Sublinhada) {
                frase3Sublinhada = true;
                gsap.to(goldPath, { strokeDashoffset: 0, duration: 0.9, ease: 'power2.inOut', delay: 0.4 });
              }
            } else {
              gsap.to(txt, { autoAlpha: 0, y: -20, filter: 'blur(6px)', duration: 0.4, ease: 'power2.in' });
            }
          }
        });
      });
      observer.observe(phrase, { attributes: true });
    });
  }

  /* ============================================================================
     7. SECTION REVEALS — ScrollTrigger batch
     ============================================================================ */
  if (!prefersReduced) {
    /* Generic section headers */
    ScrollTrigger.batch('.section-eyebrow, .section-title, .sobre__eyebrow, .sobre__title', {
      onEnter: batch => gsap.fromTo(batch,
        { autoAlpha: 0, y: 30 },
        { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.08, ease: 'power3.out' }
      ),
      start: 'top 85%',
      once: true,
    });

    /* Bio text */
    ScrollTrigger.batch('.sobre__bio', {
      onEnter: batch => gsap.fromTo(batch,
        { autoAlpha: 0, y: 20 },
        { autoAlpha: 1, y: 0, duration: 1.0, stagger: 0.1 }
      ),
      start: 'top 80%',
      once: true,
    });

    /* List items */
    ScrollTrigger.batch('.sobre__meta-col li', {
      onEnter: batch => gsap.fromTo(batch,
        { autoAlpha: 0, x: -16 },
        { autoAlpha: 1, x: 0, duration: 0.6, stagger: 0.06 }
      ),
      start: 'top 85%',
      once: true,
    });

    /* Portrait photo */
    const photo = document.querySelector('.sobre__photo-frame');
    if (photo) {
      gsap.fromTo(photo,
        { autoAlpha: 0, scale: 0.96 },
        {
          autoAlpha: 1, scale: 1, duration: 1.2,
          scrollTrigger: { trigger: photo, start: 'top 80%', once: true },
        }
      );
    }

    /* Decorative lines on portrait */
    const decoH = document.querySelector('.sobre__deco-line--h');
    const decoV = document.querySelector('.sobre__deco-line--v');
    if (decoH) gsap.fromTo(decoH, { scaleX: 0, transformOrigin: 'left' },
      { scaleX: 1, duration: 1.2, ease: 'expo.out',
        scrollTrigger: { trigger: photo, start: 'top 75%', once: true }, delay: 0.4 });
    if (decoV) gsap.fromTo(decoV, { scaleY: 0, transformOrigin: 'top' },
      { scaleY: 1, duration: 1.2, ease: 'expo.out',
        scrollTrigger: { trigger: photo, start: 'top 75%', once: true }, delay: 0.6 });
  }

  /* ============================================================================
     8. COUNTER / STATS — number roll-up
     ============================================================================ */
  document.querySelectorAll('.stat-num[data-value]').forEach(numEl => {
    const target   = parseFloat(numEl.dataset.value);
    const suffix   = numEl.dataset.suffix || '';
    const decimals = numEl.dataset.decimals ? parseInt(numEl.dataset.decimals) : 0;
    const display  = numEl.querySelector('.stat-val') || numEl;

    const obj = { val: 0 };

    const runCounter = () => {
      gsap.to(obj, {
        val: target,
        duration: prefersReduced ? 0 : 2.2,
        ease: 'power2.out',
        onUpdate: () => {
          display.textContent = obj.val.toFixed(decimals);
        },
        onComplete: () => {
          display.textContent = target.toFixed(decimals);
        },
      });
    };

    if (prefersReduced) {
      display.textContent = target.toFixed(decimals);
    } else {
      ScrollTrigger.create({
        trigger: numEl,
        start: 'top 80%',
        once: true,
        onEnter: runCounter,
      });
    }
  });

  /* ============================================================================
     9. DIFF CARDS — stagger reveal
     ============================================================================ */
  const diffCards = document.querySelectorAll('.diff-card');
  if (diffCards.length && !prefersReduced) {
    gsap.fromTo(diffCards,
      { autoAlpha: 0, y: 40 },
      {
        autoAlpha: 1, y: 0,
        duration: 0.8,
        stagger: { each: 0.08, from: 'start' },
        scrollTrigger: {
          trigger: '.diffs__grid',
          start: 'top 80%',
          once: true,
        },
      }
    );
  }

  /* ============================================================================
     10. DEPOIMENTO — quote reveal
     ============================================================================ */
  const depoText   = document.querySelector('.depo-text');
  const depoAuthor = document.querySelector('.depo-author');

  if (depoText && !prefersReduced) {
    /* If SplitText available, reveal word by word */
    if (typeof SplitText !== 'undefined') {
      const split = SplitText.create(depoText, { type: 'words, lines' });
      gsap.fromTo(split.words,
        { autoAlpha: 0, y: 12 },
        {
          autoAlpha: 1, y: 0,
          duration: 0.6,
          stagger: 0.025,
          scrollTrigger: { trigger: depoText, start: 'top 80%', once: true },
        }
      );
    } else {
      gsap.fromTo(depoText,
        { autoAlpha: 0, y: 20 },
        {
          autoAlpha: 1, y: 0, duration: 1.1,
          scrollTrigger: { trigger: depoText, start: 'top 80%', once: true },
        }
      );
    }

    if (depoAuthor) {
      gsap.fromTo(depoAuthor,
        { autoAlpha: 0, x: -20 },
        {
          autoAlpha: 1, x: 0, duration: 0.8,
          scrollTrigger: { trigger: depoAuthor, start: 'top 85%', once: true },
          delay: 0.3,
        }
      );
    }
  }

  /* ============================================================================
     11. CTA SECTION — big headline reveal
     ============================================================================ */
  const ctaHeadline = document.querySelector('.cta-headline');
  if (ctaHeadline && !prefersReduced) {
    if (typeof SplitText !== 'undefined') {
      /* ignore: '.corrige' — o split NÃO pode picotar o componente corrige.
         aria:'none' — o aria:'auto' padrão gravaria no h2 um aria-label com
         o textContent inteiro, vazando o erro aria-hidden ('atenção.');
         o label manual abaixo mantém só a versão correta. */
      const split = SplitText.create(ctaHeadline, { type: 'chars', ignore: '.corrige', aria: 'none' });
      ctaHeadline.setAttribute('aria-label', 'Seu texto merece cuidado.');
      gsap.fromTo(split.chars,
        { autoAlpha: 0, y: 40, rotation: 3 },
        {
          autoAlpha: 1, y: 0, rotation: 0,
          duration: 0.7,
          stagger: 0.025,
          ease: 'back.out(1.2)',
          scrollTrigger: { trigger: ctaHeadline, start: 'top 80%', once: true },
        }
      );
    } else {
      gsap.fromTo(ctaHeadline,
        { autoAlpha: 0, y: 30 },
        {
          autoAlpha: 1, y: 0, duration: 1,
          scrollTrigger: { trigger: ctaHeadline, start: 'top 80%', once: true },
        }
      );
    }

    /* Corrige da headline + carimbo APROVADO — o fecho narrativo do livro.
       Começa ~0.8s depois do reveal dos chars; roda uma única vez. */
    if (ctaHeadline.querySelector('.corrige')) {
      const tlAprovado = gsap.timeline({
        delay: 0.8,
        scrollTrigger: { trigger: '.cta-headline', start: 'top 70%', once: true },
      });
      tlAprovado
        .to('.cta-headline .corrige__risco', { scaleX: 1, duration: 0.35, ease: 'power2.in' })
        .to('.cta-headline .corrige__erro',  { color: '#a09c92' /* --stone-400 */, duration: 0.25 }, '+=0.05')
        .to('.cta-headline .corrige__certo', { clipPath: 'inset(0 0% 0 0)', duration: 0.5, ease: 'expo.out' }, '-=0.05')
        /* Carimbo cai sobre a página… */
        .fromTo('.carimbo',
          { scale: 2.2, autoAlpha: 0, rotation: -14 },
          { scale: 1, autoAlpha: 1, rotation: -6, duration: 0.3, ease: 'power4.in' }, '+=0.15')
        /* …assenta com um leve tranco… */
        .to('.carimbo', { rotation: -5.2, duration: 0.08, yoyo: true, repeat: 1 })
        /* …e a headline treme com o impacto */
        .fromTo('.cta-headline', { y: 0 }, { y: 2, duration: 0.06, yoyo: true, repeat: 1 }, '<');
    }

    ScrollTrigger.batch('.cta-label, .cta-sub, .cta-buttons, .cta-social', {
      onEnter: batch => gsap.fromTo(batch,
        { autoAlpha: 0, y: 20 },
        { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.1 }
      ),
      start: 'top 85%',
      once: true,
    });
  }

  /* ============================================================================
     12. EYEBROW SCRAMBLE — on scroll into view
     For section eyebrows with data-scramble attribute.
     ============================================================================ */
  if (!prefersReduced && typeof ScrambleTextPlugin !== 'undefined') {
    /* Exclude hero eyebrow (handled in hero timeline) */
    document.querySelectorAll('[data-scramble]:not(.hero__eyebrow-text)').forEach(el => {
      const original = el.textContent.trim();
      el.textContent = original; /* ensure content always set */

      ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          gsap.to(el, {
            duration: 1.4,
            scrambleText: {
              text: original,
              chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ·—',
              speed: 0.6,
              revealDelay: 0.15,
            },
          });
        },
      });
    });
  }

  /* ============================================================================
     13. STATS SECTION — horizontal reveal on scroll
     ============================================================================ */
  const statItems = document.querySelectorAll('.stat-item');
  if (statItems.length && !prefersReduced) {
    gsap.fromTo(statItems,
      { autoAlpha: 0, y: 30 },
      {
        autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.12,
        scrollTrigger: { trigger: '.stats', start: 'top 75%', once: true },
      }
    );
  }

  /* ============================================================================
     14. MAGNETIC BUTTON EFFECT
     ============================================================================ */
  if (!prefersReduced && window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.btn').forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const rect = btn.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 12;
        const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 8;
        gsap.to(btn, { x, y, duration: 0.4, ease: 'power2.out' });
      });
      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1,0.5)' });
      });
    });
  }

  /* ============================================================================
     15. FOOTER ENTRANCE
     ============================================================================ */
  if (!prefersReduced) {
    gsap.fromTo('.footer-brand, .footer-meta',
      { autoAlpha: 0, y: 20 },
      {
        autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.1,
        scrollTrigger: { trigger: '.site-footer', start: 'top 90%', once: true },
      }
    );

    /* Colofão — a régua dourada se estende quando o livro fecha */
    gsap.to('.colofao__linha', {
      scaleX: 1, duration: 1.2, ease: 'expo.out',
      scrollTrigger: { trigger: '.colofao', start: 'top 92%', once: true },
    });
  }

  /* ============================================================================
     16. FALLBACK REVEAL — any .will-reveal not caught by specific animations
     Runs last so it only covers elements still at opacity:0
     NOTA: o setTimeout(100) só dispara depois de TODO o código síncrono do
     arquivo (§17–§26 incluídas) — o ScrollTrigger.refresh() final, portanto,
     cobre todos os triggers criados abaixo, inclusive os dois pins.
     ============================================================================ */
  if (!prefersReduced) {
    /* Small timeout lets specific animations claim their elements first */
    setTimeout(() => {
      document.querySelectorAll('.will-reveal').forEach(el => {
        /* Pula alvos já reivindicados por animações dedicadas que só disparam
           no scroll (§7 batch, §9 diff-cards, §10 depo-author, §13 stats) —
           opacity 0 aqui significa "aguardando scroll", não "órfão"; um
           segundo trigger a 88% causaria flicker (reveal → re-hide → reveal).
           .depo-text, .sobre__photo-wrap, .sobre__meta e o .hero__cta do
           sobre ficam: suas dedicadas atingem só filhos ou não existem. */
        if (el.matches('.sobre__title, .sobre__bio, .section-title, .stat-item, .diff-card, .depo-author')) return;
        /* If the element's computed opacity is still 0, set up a reveal */
        const computed = window.getComputedStyle(el);
        if (parseFloat(computed.opacity) < 0.05) {
          ScrollTrigger.create({
            trigger: el,
            start: 'top 88%',
            once: true,
            onEnter: () => {
              gsap.fromTo(el,
                { opacity: 0, y: 24 },
                { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', clearProps: 'transform' }
              );
            },
          });
        }
      });
      /* Refresh after all triggers are registered */
      ScrollTrigger.refresh();
    }, 100);
  } else {
    /* Reduced motion: ensure all will-reveal are visible */
    document.querySelectorAll('.will-reveal').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    ScrollTrigger.refresh();
  }

  /* ============================================================================
     17. ESTANTE — travessia horizontal pinada + tilt 3D das capas
     Sem JS / mobile / touch / reduced-motion: o track nativo com scroll-snap
     (CSS) é o fallback. Aqui só entra o pin em desktop com hover e motion.
     ============================================================================ */
  const estante      = document.querySelector('.estante');
  const estanteTrack = document.querySelector('.estante__track');

  if (estante && estanteTrack) {

    /* Pin + scrub — mesmo padrão de pin do manifesto (§6), anima só transform */
    const estanteMM = gsap.matchMedia();
    estanteMM.add('(min-width: 900px) and (hover: hover) and (prefers-reduced-motion: no-preference)', () => {
      estante.classList.add('estante--pinada');

      const dist = () => estanteTrack.scrollWidth - window.innerWidth;

      const travessia = gsap.to(estanteTrack, {
        x: () => -dist(),
        ease: 'none',
        scrollTrigger: {
          trigger: '.estante__viewport',
          pin: true,
          anticipatePin: 1,
          start: 'top top',
          end: () => '+=' + dist(),
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      /* Foco de teclado dentro do track deslocado via transform: o browser
         tenta revelar o alvo alterando o scrollLeft do viewport (overflow:
         hidden é programaticamente rolável), por fora do ScrollTrigger — o
         conteúdo desloca em dobro e o anel de foco some. Desfazemos o desvio
         e convertemos o foco em progresso do pin (alvo centralizado). */
      const viewport = document.querySelector('.estante__viewport');
      const focoNaTravessia = () => {
        if (!viewport || !viewport.scrollLeft) return; /* alvo já visível — nada a corrigir */
        viewport.scrollLeft = 0;
        const alvo = document.activeElement;
        if (!alvo || !estanteTrack.contains(alvo)) return;
        const st = travessia.scrollTrigger;
        const centro = alvo.offsetLeft + alvo.offsetWidth / 2 - window.innerWidth / 2;
        st.scroll(st.start + gsap.utils.clamp(0, 1, centro / dist()) * dist());
      };
      if (viewport) viewport.addEventListener('focusin', focoNaTravessia);

      /* Tilt 3D contido — mesma receita do efeito magnético da §14 */
      const tiltHandlers = [];
      estante.querySelectorAll('.livro__capa').forEach(capa => {
        const inclinaCapa = e => {
          const rect = capa.getBoundingClientRect();
          const nx = (e.clientX - rect.left) / rect.width  - 0.5;
          const ny = (e.clientY - rect.top)  / rect.height - 0.5;
          gsap.to(capa, { rotationY: nx * 6, rotationX: -ny * 5, y: -6, duration: 0.4, ease: 'power2.out' });
        };
        const soltaCapa = () => {
          gsap.to(capa, { rotationY: 0, rotationX: 0, y: 0, duration: 0.7, ease: 'elastic.out(1,0.5)' });
        };
        capa.addEventListener('mousemove', inclinaCapa);
        capa.addEventListener('mouseleave', soltaCapa);
        tiltHandlers.push({ capa, inclinaCapa, soltaCapa });
      });

      /* Cleanup ao sair do breakpoint (tweens/ScrollTriggers o mm mata sozinho) */
      return () => {
        estante.classList.remove('estante--pinada');
        if (viewport) viewport.removeEventListener('focusin', focoNaTravessia);
        tiltHandlers.forEach(({ capa, inclinaCapa, soltaCapa }) => {
          capa.removeEventListener('mousemove', inclinaCapa);
          capa.removeEventListener('mouseleave', soltaCapa);
          gsap.set(capa, { clearProps: 'transform' });
        });
      };
    });

    /* Ghost "32" — parallax suave, fora do matchMedia (vale pra qualquer tela) */
    if (!prefersReduced) {
      gsap.fromTo('.estante__ghost', { y: 40 }, {
        y: -60,
        ease: 'none',
        scrollTrigger: { trigger: '.estante', start: 'top bottom', end: 'bottom top', scrub: 1 },
      });
    }

    /* Hint some no primeiro deslize nativo do track (modo pinado esconde via CSS) */
    estanteTrack.addEventListener('scroll', () => {
      gsap.to('.estante__hint', { autoAlpha: 0, duration: prefersReduced ? 0 : 0.4 });
    }, { once: true });
  }

  /* ============================================================================
     18. SQUIGGLE — sublinhado ondulado de revisor, desenhado no scroll
     Os squiggles de hover (.u-squiggle--hover, diff-cards) são da §19; o da
     frase 3 do manifesto é disparado pelo observer da §6.
     ============================================================================ */
  if (!prefersReduced) {
    ScrollTrigger.batch('.u-squiggle:not(.u-squiggle--hover)', {
      start: 'top 85%',
      once: true,
      onEnter: batch => batch.forEach(el => {
        const path = el.querySelector('.squiggle path');
        if (path) gsap.to(path, { strokeDashoffset: 0, duration: 0.9, ease: 'power2.inOut' });
      }),
    });
  }

  /* ============================================================================
     19. SELO "rev. ✓" NOS DIFF-CARDS — scramble do num no hover
     + squiggle do título desenhado no PRIMEIRO mouseenter (e mantido).
     ============================================================================ */
  if (!prefersReduced && window.matchMedia('(hover: hover)').matches) {
    const scrambleOk = typeof ScrambleTextPlugin !== 'undefined';

    document.querySelectorAll('.diff-card').forEach(card => {
      const num = card.querySelector('.diff-card__num');
      if (!num || !num.dataset.rev) return;

      const tituloPath = card.querySelector('.u-squiggle--hover .squiggle path');
      let seloTween      = null;  /* debounce: não reinicia scramble ativo */
      let tituloRiscado  = false; /* squiggle desenha uma vez e fica */

      card.addEventListener('mouseenter', () => {
        if (!tituloRiscado && tituloPath) {
          tituloRiscado = true;
          gsap.to(tituloPath, { strokeDashoffset: 0, duration: 0.9, ease: 'power2.inOut' });
        }
        if (!scrambleOk) return;
        if (seloTween && seloTween.isActive()) return;
        seloTween = gsap.to(num, {
          duration: 0.5,
          overwrite: true,
          scrambleText: { text: num.dataset.rev, chars: '01✓·', speed: 0.8 },
        });
      });

      card.addEventListener('mouseleave', () => {
        if (!scrambleOk) return;
        seloTween = gsap.to(num, {
          duration: 0.5,
          overwrite: true,
          scrambleText: { text: num.dataset.num, chars: '01✓·', speed: 0.8 },
        });
      });
    });
  }

  /* ============================================================================
     20. MARGINALIA VIVA — anotações de revisora flutuam nas margens
     Só transform/opacity, scrub suave; escondidas via CSS abaixo de 1200px.
     ============================================================================ */
  if (!prefersReduced) {
    gsap.utils.toArray('.marginalia').forEach(el => {
      gsap.fromTo(el,
        { y: 30, autoAlpha: 0 },
        {
          keyframes: [
            { y: 0,   autoAlpha: 0.9 },
            { y: -30, autoAlpha: 0 },
          ],
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 1.2 },
        }
      );
    });
  }

  /* ============================================================================
     21. MODO TINTA — a página mergulha na tinta e emerge de volta ao papel
     Anima SÓ a opacity da camada .pagina-fundo__tinta (compositável) — nunca
     background-color. Quatro trechos scrubados com ranges disjuntos;
     immediateRender:false impede um fromTo de pintar fora da própria janela.
     ============================================================================ */
  if (!prefersReduced && document.querySelector('.pagina-fundo__tinta')) {
    const trechosTinta = [
      /* mergulho — o manifesto entra no escuro */
      { trigger: '.manifesto',  start: 'top 85%',    end: 'top 15%',    de: 0, para: 1 },
      /* emersão RÁPIDA — completa enquanto o Sobre ainda mostra só a foto
         (imagem, não texto), evitando ink-sobre-ink */
      { trigger: '.manifesto',  start: 'bottom 95%', end: 'bottom 55%', de: 1, para: 0 },
      /* mergulho — o depoimento volta ao escuro */
      { trigger: '.depoimento', start: 'top 95%',    end: 'top 40%',    de: 0, para: 1 },
      /* emersão — só completa quando o texto branco do depoimento já saiu
         de tela (a .cta-section abaixo tem fundo opaco, então a tinta só é
         visível atrás do próprio depoimento) */
      { trigger: '.depoimento', start: 'bottom 70%', end: 'bottom 15%', de: 1, para: 0 },
    ];
    trechosTinta.forEach(({ trigger, start, end, de, para }) => {
      gsap.fromTo('.pagina-fundo__tinta', { opacity: de }, {
        opacity: para,
        ease: 'none',
        immediateRender: false,
        overwrite: 'auto',
        scrollTrigger: { trigger, start, end, scrub: true },
      });
    });
  }

  /* ============================================================================
     22. FÓLIO — título corrente da seção, trocado com scramble
     Um trigger por "capítulo"; fora dos capítulos o fólio mantém o último rótulo.
     ============================================================================ */
  const folio = document.querySelector('.folio');
  if (folio && !prefersReduced) {
    const scrambleFolioOk = typeof ScrambleTextPlugin !== 'undefined';
    const capitulos = [
      ['#inicio',       '§ 01 · Capa'],
      ['.manifesto',    '§ 02 · Manifesto'],
      ['#sobre',        '§ 03 · Sobre'],
      ['#estante',      '§ 04 · Estante'],
      ['#diferenciais', '§ 05 · Serviços'],
      ['#depoimento',   '§ 06 · Depoimento'],
      ['#contato',      '§ 07 · Colofão'],
    ];
    capitulos.forEach(([trigger, label]) => {
      if (!document.querySelector(trigger)) return;
      ScrollTrigger.create({
        trigger,
        start: 'top 50%',
        end: 'bottom 50%',
        onToggle: self => {
          if (!self.isActive) return;
          if (scrambleFolioOk) {
            gsap.to(folio, {
              duration: 0.7,
              overwrite: 'auto',
              scrambleText: { text: label, chars: '0123456789§·' },
            });
          } else {
            folio.textContent = label;
          }
        },
      });
    });
  }

  /* ============================================================================
     23. HEADER QUE RESPIRA — some ao rolar pra baixo, reaparece ao subir
     Trigger separado do §2 (aquele começa em 80 e não cobre a página toda).
     Teclado: .oculto:focus-within traz o header de volta via CSS.
     ============================================================================ */
  if (header && !prefersReduced) {
    ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: self => {
        if (hamburger && hamburger.classList.contains('open')) return;
        header.classList.toggle('oculto', self.direction === 1 && self.scroll() > 400);
      },
    });
  }

  /* ============================================================================
     24. MARQUEE COM INÉRCIA — tinta arrastada pela velocidade do scroll
     A CSSAnimation do .marquee-inner anima translateX — o GSAP NÃO toca nela:
     o skew vai no PAI (.marquee-row) e a aceleração vai no playbackRate da
     própria CSSAnimation via Web Animations API. O decay roda no ticker, então
     skew e rate voltam ao repouso mesmo quando o scroll para de emitir eventos
     (roda de mouse em saltos discretos não deixa skew residual).
     ============================================================================ */
  const marqueeInners = gsap.utils.toArray('.marquee-inner');
  if (!prefersReduced && marqueeInners.length &&
      typeof marqueeInners[0].getAnimations === 'function') {

    const marqueeAnims = marqueeInners.flatMap(el => el.getAnimations());
    const marqueeRows  = gsap.utils.toArray('.marquee-row');

    if (marqueeAnims.length && marqueeRows.length) {
      const marca = { rate: 1, skew: 0 };

      ScrollTrigger.create({
        start: 0,
        end: 'max',
        onUpdate: self => {
          const v = gsap.utils.clamp(-1, 1, self.getVelocity() / 2500);
          if (Math.abs(v * -4) > Math.abs(marca.skew)) marca.skew = v * -4;
          marca.rate = Math.max(marca.rate, 1 + Math.abs(v) * 2.5);
        },
      });

      /* Decay — só escreve no DOM quando o valor de fato mudou */
      const aplicaSkew   = gsap.quickSetter(marqueeRows, 'skewX', 'deg');
      let skewAplicado = null;
      let rateAplicado = null;
      gsap.ticker.add(() => {
        marca.skew += (0 - marca.skew) * 0.1;
        marca.rate += (1 - marca.rate) * 0.06;
        if (Math.abs(marca.skew) < 0.02)     marca.skew = 0;
        if (Math.abs(marca.rate - 1) < 0.01) marca.rate = 1;
        if (marca.skew !== skewAplicado) {
          skewAplicado = marca.skew;
          aplicaSkew(marca.skew);
        }
        if (marca.rate !== rateAplicado) {
          rateAplicado = marca.rate;
          marqueeAnims.forEach(a => { a.playbackRate = marca.rate; });
        }
      });
    }
  }

  /* ============================================================================
     25. PARALLAX DE JANELA NO RETRATO — a foto respira dentro do frame
     O frame tem overflow:hidden; scale fixo 1.14 garante bordas nunca expostas.
     A entrada da §7 anima autoAlpha/scale no FRAME (não na img) — sem conflito.
     Linhas deco: entradas animam scaleX/scaleY, aqui só x/y — sem conflito.
     ============================================================================ */
  if (!prefersReduced && document.querySelector('.sobre__photo')) {
    gsap.fromTo('.sobre__photo',
      { yPercent: -7, scale: 1.14 },
      {
        yPercent: 7, scale: 1.14, ease: 'none',
        scrollTrigger: { trigger: '.sobre__photo-frame', start: 'top bottom', end: 'bottom top', scrub: 1 },
      }
    );

    /* Linhas deco em sentidos opostos, mesmos bounds */
    gsap.fromTo('.sobre__deco-line--h', { x: -20 }, {
      x: 20, ease: 'none',
      scrollTrigger: { trigger: '.sobre__photo-frame', start: 'top bottom', end: 'bottom top', scrub: 1 },
    });
    gsap.fromTo('.sobre__deco-line--v', { y: 16 }, {
      y: -16, ease: 'none',
      scrollTrigger: { trigger: '.sobre__photo-frame', start: 'top bottom', end: 'bottom top', scrub: 1 },
    });
  }

  /* ============================================================================
     26. ASPA GIGANTE DO DEPOIMENTO — parallax lento da aspa de fundo
     ============================================================================ */
  if (!prefersReduced && document.querySelector('.depo-aspas')) {
    gsap.fromTo('.depo-aspas', { y: 40 }, {
      y: -50,
      ease: 'none',
      scrollTrigger: { trigger: '.depoimento', start: 'top bottom', end: 'bottom top', scrub: 1 },
    });
  }

})();
