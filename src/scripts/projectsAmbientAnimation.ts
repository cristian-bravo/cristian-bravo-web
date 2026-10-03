import { animate } from 'animejs/animation';

type Cleanup = () => void;
type AmbientAnimation = ReturnType<typeof animate>;
type AmbientScene = {
  scene: HTMLElement;
  ambient: HTMLElement | SVGElement;
  visible: boolean;
  animations: AmbientAnimation[];
};

const activeControllers = new WeakMap<HTMLElement, Cleanup>();

/** Keep ambient movement local to the scene the visitor can currently see. */
export function initProjectsAmbientAnimation(): Cleanup {
  const root = document.querySelector<HTMLElement>('.ps-root');
  if (!root) return () => undefined;

  activeControllers.get(root)?.();

  const scenes = Array.from(root.querySelectorAll<HTMLElement>('[data-ps-scene]'))
    .flatMap((scene): AmbientScene[] => {
      const ambient = scene.querySelector<HTMLElement | SVGElement>('[data-project-ambient]');
      return ambient ? [{ scene, ambient, visible: false, animations: [] }] : [];
    });

  if (!scenes.length) return () => undefined;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const sceneLookup = new Map(scenes.map((entry) => [entry.scene, entry]));
  let disposed = false;

  const createAnimations = ({ ambient }: AmbientScene): AmbientAnimation[] => {
    const drifts = Array.from(ambient.querySelectorAll<SVGElement>('[data-ambient-drift]'));
    const traces = Array.from(ambient.querySelectorAll<SVGElement>('[data-ambient-trace]'));

    return [
      ...drifts.map((element, index) => {
        const direction = index % 2 === 0 ? 1 : -1;
        return animate(element, {
          translateX: [-8 * direction, 8 * direction],
          translateY: [6 * direction, -6 * direction],
          duration: 20_000 + index * 4_000,
          alternate: true,
          loop: true,
          ease: 'inOutSine',
          autoplay: false,
        });
      }),
      ...traces.map((element, index) => animate(element, {
        strokeDashoffset: [1, 0],
        duration: 24_000 + index * 3_000,
        loop: true,
        ease: 'linear',
        autoplay: false,
      })),
    ];
  };

  const revertAnimations = (entry: AmbientScene) => {
    entry.animations.forEach((animation) => animation.revert());
    entry.animations = [];
  };

  const sync = () => {
    if (disposed) return;
    const usesSceneMode = root.dataset.psMode === 'scene';

    scenes.forEach((entry) => {
      if (reducedMotion.matches) {
        revertAnimations(entry);
        entry.ambient.dataset.ambientState = 'static';
        return;
      }

      const eligible = !document.hidden && (usesSceneMode
        ? entry.scene.classList.contains('is-active')
        : entry.visible);

      if (eligible) {
        if (!entry.animations.length) entry.animations = createAnimations(entry);
        entry.animations.forEach((animation) => animation.resume());
        entry.ambient.dataset.ambientState = 'running';
      } else {
        entry.animations.forEach((animation) => animation.pause());
        entry.ambient.dataset.ambientState = entry.animations.length ? 'paused' : 'idle';
      }
    });
  };

  // Native scrolling can show adjacent scenes together. The observer confines
  // work to those visible sections without running a scroll handler every frame.
  const intersectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((intersection) => {
      const entry = sceneLookup.get(intersection.target as HTMLElement);
      if (entry) entry.visible = intersection.isIntersecting && intersection.intersectionRect.height > 0;
    });
    sync();
  }, { threshold: [0, 0.01] });

  const mutationObserver = new MutationObserver(sync);
  mutationObserver.observe(root, { attributes: true, attributeFilter: ['data-ps-mode'] });
  scenes.forEach(({ scene }) => {
    mutationObserver.observe(scene, { attributes: true, attributeFilter: ['class'] });
    intersectionObserver.observe(scene);
  });

  const cleanup = () => {
    if (disposed) return;
    disposed = true;
    intersectionObserver.disconnect();
    mutationObserver.disconnect();
    reducedMotion.removeEventListener('change', sync);
    document.removeEventListener('visibilitychange', sync);
    document.removeEventListener('astro:before-swap', cleanup);
    scenes.forEach((entry) => {
      revertAnimations(entry);
      delete entry.ambient.dataset.ambientState;
    });
    if (activeControllers.get(root) === cleanup) activeControllers.delete(root);
  };

  reducedMotion.addEventListener('change', sync);
  document.addEventListener('visibilitychange', sync);
  document.addEventListener('astro:before-swap', cleanup);
  activeControllers.set(root, cleanup);
  sync();

  return cleanup;
}
