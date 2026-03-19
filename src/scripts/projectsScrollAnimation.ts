import { animate, stagger } from 'animejs';

type Cleanup = () => void;

const qs = <T extends HTMLElement>(root: ParentNode, sel: string) =>
  root.querySelector<T>(sel);

const qsAll = <T extends HTMLElement>(root: ParentNode, sel: string) =>
  Array.from(root.querySelectorAll<T>(sel));

/* ── Transition timings ── */
const DUR_EXIT = 440;
const DUR_ENTER = 680;
const EASE_EXIT = 'easeInCubic';
const EASE_ENTER = 'easeOutExpo';

function exitScene(el: HTMLElement, reduced: boolean): void {
  if (reduced) {
    el.style.opacity = '0';
    el.style.transform = '';
    el.classList.remove('is-active');
    return;
  }
  animate(el, {
    opacity: [1, 0],
    translateY: [0, -48],
    scale: [1, 0.97],
    duration: DUR_EXIT,
    easing: EASE_EXIT,
    complete: () => {
      el.classList.remove('is-active');
      el.style.transform = '';
    },
  });
}

function enterScene(el: HTMLElement, reduced: boolean, isFirst = false): void {
  el.classList.add('is-active');

  if (reduced) {
    el.style.opacity = '1';
    el.style.transform = '';
    // Show all reveal elements immediately
    qsAll<HTMLElement>(el, '[data-reveal]').forEach((r) => {
      r.style.opacity = '1';
      r.style.transform = '';
    });
    return;
  }

  const delay = isFirst ? 0 : 80;

  animate(el, {
    opacity: [0, 1],
    translateY: [48, 0],
    scale: [0.97, 1],
    duration: DUR_ENTER,
    delay,
    easing: EASE_ENTER,
  });

  // Staggered inner reveals
  const reveals = qsAll<HTMLElement>(el, '[data-reveal]');
  if (reveals.length) {
    animate(reveals, {
      opacity: [0, 1],
      translateY: [20, 0],
      duration: 520,
      delay: stagger(70, { start: delay + 140 }),
      easing: 'easeOutCubic',
    });
  }
}

export function initProjectsScrollAnimation(): Cleanup {
  const stage = qs<HTMLElement>(document, '[data-ps-stage]');
  const spacer = qs<HTMLElement>(document, '[data-ps-spacer]');
  const scenes = qsAll<HTMLElement>(document, '[data-ps-scene]');
  const dots = qsAll<HTMLButtonElement>(document, '[data-ps-dot]');
  const progressFill = qs<HTMLElement>(document, '[data-ps-progress-fill]');
  const counterCurrent = qs<HTMLElement>(document, '[data-ps-counter-current]');
  const counterTotal = qs<HTMLElement>(document, '[data-ps-counter-total]');

  if (!stage || !spacer || !scenes.length) return () => undefined;

  const totalScenes = scenes.length;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // We change scenes faster by requiring less scroll pixels per scene (e.g., 0.45x viewport height).
  const getScrollDistance = () => window.innerHeight * 0.45;

  // Spacer height: enough for all scenes + 2 full viewports as tail buffer.
  // This guarantees the user can always physically scroll to trigger the last scene.
  const updateSpacerHeight = () => {
    spacer.style.height = `${(totalScenes - 1) * getScrollDistance() + window.innerHeight * 2}px`;
  };
  updateSpacerHeight();

  if (counterTotal) counterTotal.textContent = String(totalScenes);

  let currentIndex = -1;

  const goToScene = (index: number) => {
    const clamped = Math.max(0, Math.min(index, totalScenes - 1));
    if (clamped === currentIndex) return;

    const prev = currentIndex;
    currentIndex = clamped;

    // Exit previous scene
    if (prev >= 0 && scenes[prev]) {
      exitScene(scenes[prev], reduced);
    }

    // Enter new scene
    if (scenes[clamped]) {
      enterScene(scenes[clamped], reduced, prev < 0);
    }

    // Update dot nav
    dots.forEach((dot, i) => {
      dot.classList.toggle('is-active', i === clamped);
    });

    // Update progress bar
    if (progressFill) {
      const progress = totalScenes > 1 ? clamped / (totalScenes - 1) : 1;
      progressFill.style.transform = `scaleX(${progress.toFixed(4)})`;
    }

    // Update counter
    if (counterCurrent) counterCurrent.textContent = String(clamped + 1);
  };

  // Initialize first scene
  goToScene(0);

  // Scroll → scene mapping
  const onScroll = () => {
    const sd = getScrollDistance();
    const raw = window.scrollY / sd;
    // If the user has scrolled past 75% of the last scene's trigger point,
    // lock to the final scene — prevents the CTA from being unreachable.
    const index = raw >= totalScenes - 1.25 ? totalScenes - 1 : Math.round(raw);
    goToScene(index);
  };

  // Dot click → scroll to scene
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      window.scrollTo({ top: i * getScrollDistance(), behavior: 'smooth' });
    });
  });

  // Resize: recalculate spacer + re-snap
  let resizeTimer: ReturnType<typeof setTimeout> | null = null;
  const onResize = () => {
    if (resizeTimer) clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      updateSpacerHeight();
      // Re-snap to current scene
      window.scrollTo({ top: currentIndex * getScrollDistance(), behavior: 'instant' });
    }, 120);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onResize, { passive: true });

  return () => {
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onResize);
    if (resizeTimer) clearTimeout(resizeTimer);
  };
}
