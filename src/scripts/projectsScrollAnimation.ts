type Cleanup = () => void;

const qs = <T extends HTMLElement>(root: ParentNode, sel: string) => root.querySelector<T>(sel);
const qsAll = <T extends HTMLElement>(root: ParentNode, sel: string) => Array.from(root.querySelectorAll<T>(sel));

const DESKTOP_QUERY = '(min-width: 860px) and (prefers-reduced-motion: no-preference)';

const setSceneRevealIndexes = (scenes: HTMLElement[]) => {
  scenes.forEach((scene) => {
    qsAll<HTMLElement>(scene, '[data-reveal]').forEach((element, index) => {
      element.style.setProperty('--ps-reveal-index', String(index));
    });
  });
};

export function initProjectsScrollAnimation(): Cleanup {
  const root = qs<HTMLElement>(document, '.ps-root');
  const spacer = qs<HTMLElement>(document, '[data-ps-spacer]');
  const scenes = qsAll<HTMLElement>(document, '[data-ps-scene]');
  const dots = qsAll<HTMLButtonElement>(document, '[data-ps-dot]');
  const progressFill = qs<HTMLElement>(document, '[data-ps-progress-fill]');
  const counterCurrent = qs<HTMLElement>(document, '[data-ps-counter-current]');
  const counterTotal = qs<HTMLElement>(document, '[data-ps-counter-total]');

  if (!root || !spacer || !scenes.length) return () => undefined;

  const desktopQuery = window.matchMedia(DESKTOP_QUERY);
  const totalScenes = scenes.length;
  let currentIndex = -1;
  let rafId = 0;
  let resizeTimer: ReturnType<typeof setTimeout> | null = null;

  setSceneRevealIndexes(scenes);
  if (counterTotal) counterTotal.textContent = String(totalScenes);

  const getScrollDistance = () => window.innerHeight * 0.58;

  const updateSpacerHeight = () => {
    spacer.style.height = `${(totalScenes - 1) * getScrollDistance() + window.innerHeight * 1.65}px`;
  };

  const setNativeMode = () => {
    root.dataset.psMode = 'native';
    spacer.style.height = '0px';
    scenes.forEach((scene) => scene.classList.add('is-active'));
    dots.forEach((dot, index) => dot.classList.toggle('is-active', index === 0));
    if (progressFill) progressFill.style.transform = 'scaleX(0)';
    if (counterCurrent) counterCurrent.textContent = '1';
  };

  const goToScene = (index: number) => {
    const clamped = Math.max(0, Math.min(index, totalScenes - 1));
    if (clamped === currentIndex) return;

    currentIndex = clamped;
    scenes.forEach((scene, sceneIndex) => {
      scene.classList.toggle('is-active', sceneIndex === clamped);
      scene.setAttribute('aria-hidden', String(sceneIndex !== clamped));
    });

    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle('is-active', dotIndex === clamped);
    });

    if (progressFill) {
      const progress = totalScenes > 1 ? clamped / (totalScenes - 1) : 1;
      progressFill.style.transform = `scaleX(${progress.toFixed(4)})`;
    }

    if (counterCurrent) counterCurrent.textContent = String(clamped + 1);
  };

  const syncFromScroll = () => {
    rafId = 0;
    if (!desktopQuery.matches) return;

    const raw = window.scrollY / getScrollDistance();
    const index = raw >= totalScenes - 1.2 ? totalScenes - 1 : Math.round(raw);
    goToScene(index);
  };

  const requestSync = () => {
    if (rafId) return;
    rafId = window.requestAnimationFrame(syncFromScroll);
  };

  const enableDesktopMode = () => {
    root.dataset.psMode = 'scene';
    updateSpacerHeight();
    scenes.forEach((scene) => scene.setAttribute('aria-hidden', 'true'));
    goToScene(Math.max(0, currentIndex));
    requestSync();
  };

  const syncMode = () => {
    if (desktopQuery.matches) {
      enableDesktopMode();
      return;
    }

    setNativeMode();
  };

  const onResize = () => {
    if (resizeTimer) clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      syncMode();
      if (desktopQuery.matches) {
        window.scrollTo({ top: Math.max(0, currentIndex) * getScrollDistance(), behavior: 'instant' });
      }
    }, 120);
  };

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      if (!desktopQuery.matches) return;
      window.scrollTo({ top: index * getScrollDistance(), behavior: 'smooth' });
    });
  });

  window.addEventListener('scroll', requestSync, { passive: true });
  window.addEventListener('resize', onResize);
  desktopQuery.addEventListener?.('change', syncMode);

  syncMode();

  return () => {
    if (rafId) window.cancelAnimationFrame(rafId);
    if (resizeTimer) clearTimeout(resizeTimer);
    window.removeEventListener('scroll', requestSync);
    window.removeEventListener('resize', onResize);
    desktopQuery.removeEventListener?.('change', syncMode);
  };
}
