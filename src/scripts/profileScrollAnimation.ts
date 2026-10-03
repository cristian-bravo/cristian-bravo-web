import { animate } from 'animejs';

type Cleanup = () => void;
type Animation = ReturnType<typeof animate>;

const DESKTOP_QUERY =
  '(min-width: 1120px) and (min-height: 760px) and (prefers-reduced-motion: no-preference)';
const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));

/** A progressive enhancement: document scrolling always remains browser controlled. */
export function initProfileScrollAnimation(): Cleanup {
  const root = document.querySelector<HTMLElement>('[data-profile-journey]');
  const stage = root?.querySelector<HTMLElement>('[data-profile-stage]');
  const scenes = Array.from(root?.querySelectorAll<HTMLElement>('[data-profile-scene]') ?? []);
  if (!root || !stage || !scenes.length) return () => undefined;

  const steps = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-profile-step]'));
  const progress = root.querySelector<HTMLElement>('[data-profile-progress]');
  const navbar = document.querySelector<HTMLElement>('[data-profile-navbar]');
  const query = window.matchMedia(DESKTOP_QUERY);
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const originalRootStyle = root.getAttribute('style');
  const originalMode = root.getAttribute('data-profile-mode');
  const originalActive = root.getAttribute('data-profile-active');
  const originalProgressStyle = progress?.getAttribute('style') ?? null;
  const originals = scenes.map((scene) => ({
    style: scene.getAttribute('style'),
    hidden: scene.getAttribute('aria-hidden'),
    inert: scene.inert,
    active: scene.classList.contains('is-active'),
  }));
  const originalSteps = steps.map((step) => ({
    current: step.getAttribute('aria-current'),
    active: step.classList.contains('is-active'),
  }));
  const animations = new Set<Animation>();
  let sceneMode = false;
  let currentIndex = -1;
  let frame = 0;
  let resizeTimer: ReturnType<typeof setTimeout> | undefined;
  let disposed = false;

  const restoreAttribute = (element: HTMLElement, name: string, value: string | null) => {
    if (value === null) element.removeAttribute(name);
    else element.setAttribute(name, value);
  };

  const cancelAnimations = () => {
    animations.forEach((animation) => animation.cancel());
    animations.clear();
  };

  const getTop = () => root.getBoundingClientRect().top + window.scrollY;
  const getStageHeight = () => stage.getBoundingClientRect().height || window.innerHeight;
  const getDistance = () => Math.max(1, root.getBoundingClientRect().height - getStageHeight());
  const getProgress = () => clamp((window.scrollY - getTop()) / getDistance());
  const getIndex = (value: number) => Math.round(value * (scenes.length - 1));

  const updateProgress = (value: number) => {
    if (progress) progress.style.transform = `scaleX(${value.toFixed(4)})`;
  };

  const restoreScenes = () => {
    cancelAnimations();
    scenes.forEach((scene, index) => {
      restoreAttribute(scene, 'style', originals[index].style);
      restoreAttribute(scene, 'aria-hidden', originals[index].hidden);
      scene.inert = originals[index].inert;
      scene.classList.toggle('is-active', originals[index].active);
    });
  };

  const setScene = (index: number, immediate = false) => {
    const next = clamp(index, 0, scenes.length - 1);
    if (next === currentIndex && !immediate) return;
    const previous = currentIndex;
    const direction = next >= previous ? 1 : -1;
    const focusedScene = scenes.findIndex((scene) => scene.contains(document.activeElement));
    cancelAnimations();
    currentIndex = next;
    root.dataset.profileActive = String(next);

    // Keep keyboard focus on a persistent, visible control when its chapter leaves.
    if (focusedScene !== -1 && focusedScene !== next) steps[next]?.focus({ preventScroll: true });

    scenes.forEach((scene, sceneIndex) => {
      const active = sceneIndex === next;
      const outgoing = !immediate && sceneIndex === previous;
      scene.classList.toggle('is-active', active);
      scene.inert = !active;
      scene.setAttribute('aria-hidden', String(!active));
      scene.style.visibility = active || outgoing ? 'visible' : 'hidden';
      if (active && !immediate) {
        scene.style.opacity = '0';
        scene.style.transform = `translateY(${direction * 32}px)`;
        const animation = animate(scene, {
          opacity: [0, 1],
          translateY: [direction * 32, 0],
          duration: 520,
          delay: previous < 0 ? 0 : 70,
          ease: 'outCubic',
          onComplete: (completed) => animations.delete(completed),
        });
        animations.add(animation);
      } else if (outgoing) {
        const animation = animate(scene, {
          opacity: 0,
          translateY: direction * -24,
          duration: 230,
          ease: 'outQuad',
          onComplete: (completed) => {
            if (sceneIndex !== currentIndex) scene.style.visibility = 'hidden';
            animations.delete(completed);
          },
        });
        animations.add(animation);
      } else {
        scene.style.opacity = active ? '1' : '0';
        scene.style.transform = 'none';
      }
    });
    steps.forEach((step, stepIndex) => {
      step.classList.toggle('is-active', stepIndex === next);
      if (stepIndex === next) step.setAttribute('aria-current', 'step');
      else step.removeAttribute('aria-current');
    });
  };

  const syncScroll = () => {
    frame = 0;
    if (!sceneMode || disposed) return;
    const value = getProgress();
    setScene(getIndex(value));
    updateProgress(value);
  };

  const requestSync = () => {
    if (!frame && !disposed) frame = window.requestAnimationFrame(syncScroll);
  };

  const contentFits = () => {
    const height = getStageHeight();
    return scenes.every((scene) => {
      const content = scene.querySelector<HTMLElement>('.profile-scene-content');
      if (!content) return false;
      const styles = window.getComputedStyle(scene);
      const available = height - parseFloat(styles.paddingTop) - parseFloat(styles.paddingBottom);
      return Math.max(content.scrollHeight, content.getBoundingClientRect().height) <= available + 1;
    });
  };

  const scrollToScene = (index: number, behavior: ScrollBehavior = 'smooth') => {
    const target = clamp(index, 0, scenes.length - 1);
    if (!sceneMode) {
      scenes[target].scrollIntoView({ behavior: reducedMotion.matches ? 'instant' : behavior, block: 'start' });
      return;
    }
    const fraction = scenes.length > 1 ? target / (scenes.length - 1) : 0;
    window.scrollTo({ top: getTop() + getDistance() * fraction, behavior });
  };

  const configure = () => {
    if (disposed) return;
    const rect = root.getBoundingClientRect();
    const wasSceneMode = sceneMode;
    const focusedStep = steps.some((step) => step.contains(document.activeElement));
    const followingContentVisible = rect.top < 0 && rect.bottom < window.innerHeight;
    const preservePosition = rect.top <= 1 && rect.bottom > 0 && !followingContentVisible;
    const previousProgress = sceneMode ? getProgress() : 0;
    let anchorIndex = sceneMode ? getIndex(previousProgress) : 0;
    if (!sceneMode) {
      const reference = Math.min(window.innerHeight * 0.4, 240);
      const nearest = scenes.findIndex((scene) => scene.getBoundingClientRect().bottom > reference);
      anchorIndex = Math.max(0, nearest);
    }
    const preserveFollowingContent = () => {
      if (!followingContentVisible) return;
      window.scrollTo({
        top: window.scrollY + root.getBoundingClientRect().bottom - rect.bottom,
        behavior: 'instant',
      });
    };

    restoreScenes();
    if (navbar) root.style.setProperty('--profile-nav-height', `${navbar.getBoundingClientRect().height}px`);
    root.dataset.profileMode = query.matches ? 'scene' : 'native';
    sceneMode = query.matches;
    if (sceneMode) {
      root.style.setProperty('--profile-scroll-height', `${getStageHeight() * scenes.length}px`);
      sceneMode = contentFits();
    }

    if (!sceneMode) {
      root.dataset.profileMode = 'native';
      root.style.removeProperty('--profile-scroll-height');
      root.removeAttribute('data-profile-active');
      currentIndex = -1;
      steps.forEach((step, index) => {
        restoreAttribute(step, 'aria-current', originalSteps[index].current);
        step.classList.toggle('is-active', originalSteps[index].active);
      });
      if (progress) restoreAttribute(progress, 'style', originalProgressStyle);
      if (wasSceneMode && preservePosition) {
        const headerHeight = navbar?.getBoundingClientRect().height ?? 0;
        window.scrollTo({
          top: window.scrollY + scenes[anchorIndex].getBoundingClientRect().top - headerHeight - 24,
          behavior: 'instant',
        });
      }
      preserveFollowingContent();
      if (wasSceneMode && focusedStep) scenes[anchorIndex].focus({ preventScroll: true });
      return;
    }

    if (preservePosition) {
      if (wasSceneMode) {
        window.scrollTo({ top: getTop() + getDistance() * previousProgress, behavior: 'instant' });
      } else {
        // A resize into presentation mode keeps the section the reader was viewing.
        scrollToScene(anchorIndex, 'instant');
      }
    }
    preserveFollowingContent();
    const value = getProgress();
    setScene(getIndex(value), true);
    updateProgress(value);
  };

  const scheduleConfigure = () => {
    if (resizeTimer) clearTimeout(resizeTimer);
    resizeTimer = setTimeout(configure, 120);
  };

  const onHashChange = () => {
    if (!sceneMode || !window.location.hash) return;
    let id: string;
    try {
      id = decodeURIComponent(window.location.hash.slice(1));
    } catch {
      return;
    }
    const target = document.getElementById(id);
    const index = scenes.findIndex((scene) => scene === target || (target && scene.contains(target)));
    if (index !== -1) scrollToScene(index, 'instant');
  };

  const stepCleanups = steps.map((step, index) => {
    const onClick = () => scrollToScene(index);
    step.addEventListener('click', onClick);
    return () => step.removeEventListener('click', onClick);
  });
  const observer = new ResizeObserver(() => {
    if (sceneMode && !contentFits()) scheduleConfigure();
  });
  scenes.forEach((scene) => {
    const content = scene.querySelector('.profile-scene-content');
    if (content) observer.observe(content);
  });
  window.addEventListener('scroll', requestSync, { passive: true });
  window.addEventListener('resize', scheduleConfigure, { passive: true });
  window.addEventListener('hashchange', onHashChange);
  query.addEventListener('change', configure);
  document.fonts.ready.then(() => {
    if (!disposed) configure();
  });
  configure();
  onHashChange();

  return () => {
    disposed = true;
    if (frame) window.cancelAnimationFrame(frame);
    if (resizeTimer) clearTimeout(resizeTimer);
    observer.disconnect();
    window.removeEventListener('scroll', requestSync);
    window.removeEventListener('resize', scheduleConfigure);
    window.removeEventListener('hashchange', onHashChange);
    query.removeEventListener('change', configure);
    stepCleanups.forEach((remove) => remove());
    restoreScenes();
    restoreAttribute(root, 'style', originalRootStyle);
    restoreAttribute(root, 'data-profile-mode', originalMode);
    restoreAttribute(root, 'data-profile-active', originalActive);
    if (progress) restoreAttribute(progress, 'style', originalProgressStyle);
    steps.forEach((step, index) => {
      restoreAttribute(step, 'aria-current', originalSteps[index].current);
      step.classList.toggle('is-active', originalSteps[index].active);
    });
  };
}
