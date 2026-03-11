import { createTimeline, onScroll, remove, set, stagger } from 'animejs';

type Cleanup = () => void;
type SceneKind = 'hero' | 'project' | 'cta';

interface SceneRefs {
  wrapper: HTMLElement;
  kind: SceneKind;
  tone: number;
  projectStepIndex: number | null;
  heroRoot: HTMLElement | null;
  heroAvatar: HTMLElement | null;
  heroReveal: HTMLElement[];
  projectSection: HTMLElement | null;
  projectPanel: HTMLElement | null;
  projectGlow: HTMLElement | null;
  projectAvatar: HTMLElement | null;
  projectLetters: HTMLElement[];
  projectDescriptions: HTMLElement[];
  projectMediaItems: HTMLElement[];
  projectTags: HTMLElement[];
  ctaRoot: HTMLElement | null;
  ctaPanel: HTMLElement | null;
  ctaRadial: HTMLElement | null;
  ctaButton: HTMLElement | null;
  ctaReveal: HTMLElement[];
}

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const lerp = (from: number, to: number, amount: number) => from + (to - from) * amount;

const queryAll = <T extends HTMLElement>(root: ParentNode, selector: string): T[] =>
  Array.from(root.querySelectorAll<T>(selector));

const clearInlineStyles = (elements: Array<HTMLElement | null | undefined>) => {
  elements.forEach((element) => {
    if (!element) return;
    element.style.opacity = '';
    element.style.transform = '';
    element.style.filter = '';
    element.style.willChange = '';
  });
};

const markWillChange = (elements: Array<HTMLElement | null | undefined>) => {
  elements.forEach((element) => {
    if (!element) return;
    element.style.willChange = 'transform, opacity';
  });
};

const collectScenes = (root: HTMLElement): SceneRefs[] => {
  const wrappers = queryAll<HTMLElement>(root, '[data-story-scene]');

  return wrappers
    .map((wrapper) => {
      const kind = (wrapper.dataset.sceneKind as SceneKind) ?? 'project';
      const projectStepIndex =
        wrapper.dataset.projectStepIndex != null ? Number(wrapper.dataset.projectStepIndex) : null;

      return {
        wrapper,
        kind,
        tone: Number(wrapper.dataset.themeTone ?? 0),
        projectStepIndex,
        heroRoot: wrapper.querySelector<HTMLElement>('[data-project-hero]'),
        heroAvatar: wrapper.querySelector<HTMLElement>('[data-project-hero-avatar]'),
        heroReveal: queryAll<HTMLElement>(wrapper, '[data-project-hero-reveal]'),
        projectSection: wrapper.querySelector<HTMLElement>('.project-section'),
        projectPanel: wrapper.querySelector<HTMLElement>('[data-project-panel]'),
        projectGlow: wrapper.querySelector<HTMLElement>('[data-project-glow]'),
        projectAvatar: wrapper.querySelector<HTMLElement>('[data-project-step-avatar]'),
        projectLetters: queryAll<HTMLElement>(wrapper, '[data-project-title-letter]'),
        projectDescriptions: queryAll<HTMLElement>(wrapper, '[data-project-description]'),
        projectMediaItems: queryAll<HTMLElement>(wrapper, '[data-project-media-item]'),
        projectTags: queryAll<HTMLElement>(wrapper, '.project-scroll__tag'),
        ctaRoot: wrapper.querySelector<HTMLElement>('[data-project-final-cta]'),
        ctaPanel: wrapper.querySelector<HTMLElement>('[data-project-cta-panel]'),
        ctaRadial: wrapper.querySelector<HTMLElement>('[data-project-cta-light]'),
        ctaButton: wrapper.querySelector<HTMLElement>('[data-project-cta-button]'),
        ctaReveal: queryAll<HTMLElement>(wrapper, '[data-project-cta-reveal]'),
      };
    })
    .sort(
      (left, right) => Number(left.wrapper.dataset.sceneIndex ?? 0) - Number(right.wrapper.dataset.sceneIndex ?? 0),
    );
};

const getActiveScene = (scenes: SceneRefs[]) => {
  const focusLine = window.innerHeight * 0.42;

  return scenes.reduce<SceneRefs | null>((closest, scene) => {
    const rect = scene.wrapper.getBoundingClientRect();
    const center = rect.top + rect.height / 2;
    const distance = Math.abs(center - focusLine);

    if (!closest) return scene;

    const closestRect = closest.wrapper.getBoundingClientRect();
    const closestCenter = closestRect.top + closestRect.height / 2;
    const closestDistance = Math.abs(closestCenter - focusLine);

    return distance < closestDistance ? scene : closest;
  }, null);
};

const getRootProgress = (root: HTMLElement) => {
  const rect = root.getBoundingClientRect();
  const totalDistance = rect.height + window.innerHeight;
  return clamp((window.innerHeight - rect.top) / Math.max(totalDistance, 1));
};

const prepareHero = (scene: SceneRefs) => {
  const textTargets = scene.heroReveal;
  const heroTargets = [...textTargets, scene.heroAvatar].filter(Boolean) as HTMLElement[];

  if (!heroTargets.length) return () => undefined;

  markWillChange(heroTargets);
  if (textTargets.length) {
    set(textTargets, {
      opacity: 0,
      y: 26,
    });
  }
  if (scene.heroAvatar) {
    set(scene.heroAvatar, {
      opacity: 0,
      y: 18,
    });
  }

  const timeline = createTimeline({
    defaults: { ease: 'outExpo' },
  });

  if (textTargets.length) {
    timeline.add(
      textTargets,
      {
        opacity: [0, 1],
        y: [26, 0],
        duration: 720,
        delay: stagger(110),
      },
      0,
    );
  }

  if (scene.heroAvatar) {
    timeline.add(
      scene.heroAvatar,
      {
        opacity: [0, 1],
        y: [18, 0],
        duration: 780,
      },
      140,
    );
  }

  scene.heroRoot?.classList.add('is-ready');

  return () => {
    remove(heroTargets);
    timeline.revert();
    clearInlineStyles(heroTargets);
    scene.heroRoot?.classList.remove('is-ready', 'is-floating');
  };
};

const prepareProjectScene = (scene: SceneRefs) => {
  const primaryTargets = [scene.projectPanel, scene.projectGlow, scene.projectAvatar].filter(Boolean) as HTMLElement[];
  const textTargets = [...scene.projectLetters, ...scene.projectDescriptions, ...scene.projectTags];
  const mediaTargets = scene.projectMediaItems;
  const allTargets = [...primaryTargets, ...textTargets, ...mediaTargets];

  if (!allTargets.length) return () => undefined;

  markWillChange(allTargets);

  if (scene.projectPanel) {
    set(scene.projectPanel, {
      opacity: 0,
      y: 56,
      scale: 0.985,
    });
  }

  if (scene.projectGlow) {
    set(scene.projectGlow, {
      opacity: 0.04,
    });
  }

  if (scene.projectAvatar) {
    set(scene.projectAvatar, {
      opacity: 0,
    });
  }

  if (scene.projectLetters.length) {
    set(scene.projectLetters, {
      opacity: 0,
      y: 24,
    });
  }

  if (scene.projectDescriptions.length) {
    set(scene.projectDescriptions, {
      opacity: 0,
      y: 18,
    });
  }

  if (scene.projectMediaItems.length) {
    set(scene.projectMediaItems, {
      opacity: 0,
    });
  }

  if (scene.projectTags.length) {
    set(scene.projectTags, {
      opacity: 0,
      y: 14,
    });
  }

  const observer = onScroll({
    target: scene.wrapper,
    enter: 'top bottom-=10%',
    leave: 'bottom top+=18%',
    sync: true,
    repeat: true,
    onEnter: () => {
      scene.projectSection?.classList.add('is-revealed');
    },
    onEnterBackward: () => {
      scene.projectSection?.classList.add('is-revealed');
    },
  });

  const timeline = createTimeline({
    autoplay: observer,
    defaults: { ease: 'outCubic' },
  });

  if (scene.projectPanel) {
    timeline.add(
      scene.projectPanel,
      {
        opacity: [0, 1],
        y: [56, 0],
        scale: [0.985, 1],
        duration: 680,
      },
      0,
    );
  }

  if (scene.projectGlow) {
    timeline.add(
      scene.projectGlow,
      {
        opacity: [0.04, 0.34],
        duration: 720,
      },
      60,
    );
  }

  if (scene.projectAvatar) {
    timeline.add(
      scene.projectAvatar,
      {
        opacity: [0, 1],
        duration: 340,
      },
      120,
    );
  }

  if (scene.projectLetters.length) {
    timeline.add(
      scene.projectLetters,
      {
        opacity: [0, 1],
        y: [24, 0],
        duration: 360,
        delay: stagger(18),
      },
      140,
    );
  }

  if (scene.projectDescriptions.length) {
    timeline.add(
      scene.projectDescriptions,
      {
        opacity: [0, 1],
        y: [18, 0],
        duration: 420,
        delay: stagger(80),
      },
      260,
    );
  }

  if (scene.projectMediaItems.length) {
    timeline.add(
      scene.projectMediaItems,
      {
        opacity: [0, 1],
        duration: 360,
        delay: stagger(85),
      },
      360,
    );
  }

  if (scene.projectTags.length) {
    timeline.add(
      scene.projectTags,
      {
        opacity: [0, 1],
        y: [14, 0],
        duration: 300,
        delay: stagger(44),
      },
      520,
    );
  }

  observer.refresh();

  return () => {
    remove(allTargets);
    timeline.revert();
    observer.revert();
    clearInlineStyles(allTargets);
    scene.projectSection?.classList.remove('is-active', 'is-inactive', 'is-revealed');
  };
};

const prepareCtaScene = (scene: SceneRefs) => {
  const ctaTargets = [scene.ctaPanel, ...scene.ctaReveal, scene.ctaButton, scene.ctaRadial].filter(Boolean) as HTMLElement[];

  if (!ctaTargets.length) return () => undefined;

  markWillChange(ctaTargets);

  if (scene.ctaPanel) {
    set(scene.ctaPanel, {
      opacity: 0,
      y: 42,
      scale: 0.99,
    });
  }

  if (scene.ctaReveal.length) {
    set(scene.ctaReveal, {
      opacity: 0,
      y: 18,
    });
  }

  if (scene.ctaButton) {
    set(scene.ctaButton, {
      opacity: 0,
      y: 14,
    });
  }

  if (scene.ctaRadial) {
    set(scene.ctaRadial, {
      opacity: 0.12,
    });
  }

  const observer = onScroll({
    target: scene.wrapper,
    enter: 'top bottom-=8%',
    leave: 'bottom top+=12%',
    sync: true,
    repeat: true,
  });

  const timeline = createTimeline({
    autoplay: observer,
    defaults: { ease: 'outCubic' },
  });

  if (scene.ctaPanel) {
    timeline.add(
      scene.ctaPanel,
      {
        opacity: [0, 1],
        y: [42, 0],
        scale: [0.99, 1],
        duration: 680,
      },
      0,
    );
  }

  if (scene.ctaReveal.length) {
    timeline.add(
      scene.ctaReveal,
      {
        opacity: [0, 1],
        y: [18, 0],
        duration: 360,
        delay: stagger(90),
      },
      160,
    );
  }

  if (scene.ctaButton) {
    timeline.add(
      scene.ctaButton,
      {
        opacity: [0, 1],
        y: [14, 0],
        duration: 320,
      },
      320,
    );
  }

  if (scene.ctaRadial) {
    timeline.add(
      scene.ctaRadial,
      {
        opacity: [0.12, 0.34],
        duration: 920,
      },
      0,
    );
  }

  observer.refresh();

  return () => {
    remove(ctaTargets);
    timeline.revert();
    observer.revert();
    clearInlineStyles(ctaTargets);
    scene.ctaRoot?.classList.remove('is-active', 'is-ready', 'is-fully-visible');
  };
};

export function initScrollPortfolioAnimations(rootNode: ParentNode | Element = document): Cleanup {
  const root =
    rootNode instanceof HTMLElement
      ? rootNode
      : rootNode.querySelector<HTMLElement>('[data-projects-story-root]');

  if (!root) return () => undefined;
  if (root.dataset.scrollPortfolioBound === 'true') return () => undefined;

  root.dataset.scrollPortfolioBound = 'true';

  const storyRoot = root.closest<HTMLElement>('[data-story-root]');
  const storyScroll = root.closest<HTMLElement>('[data-story-scroll]');
  const stage = root.closest<HTMLElement>('[data-story-stage]');

  storyRoot?.classList.remove('story-root--scroll-linked', 'story-root--motion-disabled');
  storyScroll?.classList.remove('story-scroll--scroll-linked', 'story-scroll--motion-disabled');
  stage?.classList.remove('story-stage--scroll-linked', 'story-stage--motion-disabled');
  storyScroll?.style.removeProperty('height');

  root.classList.remove(
    'projects-story--motion-disabled',
    'projects-story--scroll-linked',
    'projects-story--no-project-scenes',
  );
  root.classList.add('projects-story--enhanced');
  root.dataset.activeTone = root.dataset.activeTone ?? '0';

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const scenes = collectScenes(root);
  const projectScenes = scenes.filter((scene) => scene.kind === 'project');
  const dots = queryAll<HTMLElement>(root, '[data-project-progress-dot]');
  const disposers: Cleanup[] = [];

  const updateActiveState = () => {
    const activeScene = getActiveScene(scenes);
    if (!activeScene) return;
    const progress = getRootProgress(root);

    root.dataset.activeTone = String(activeScene.tone);
    root.style.setProperty('--projects-story-progress', progress.toFixed(4));
    root.style.setProperty('--projects-grid-shift-x', `${lerp(-10, 18, progress).toFixed(2)}px`);
    root.style.setProperty('--projects-grid-shift-y', `${lerp(-6, 12, progress).toFixed(2)}px`);
    root.style.setProperty('--projects-grid-overlay-opacity', lerp(0.15, 0.24, progress).toFixed(3));

    scenes.forEach((scene) => {
      const sceneRect = scene.wrapper.getBoundingClientRect();
      const inView = sceneRect.bottom > window.innerHeight * 0.12 && sceneRect.top < window.innerHeight * 0.88;
      const active = scene === activeScene;

      if (scene.heroRoot) {
        scene.heroRoot.classList.add('is-ready');
        scene.heroRoot.classList.toggle('is-floating', active && !reducedMotion.matches);
      }

      if (scene.projectSection) {
        if (inView) {
          scene.projectSection.classList.add('is-revealed');
        }
        scene.projectSection.classList.toggle('is-active', active);
        scene.projectSection.classList.toggle('is-inactive', !active);
      }

      if (scene.ctaRoot) {
        scene.ctaRoot.classList.add('is-ready');
        scene.ctaRoot.classList.toggle('is-active', active);
        scene.ctaRoot.classList.toggle('is-fully-visible', active && inView);
      }
    });

    const activeProjectIndex = activeScene.kind === 'project' ? activeScene.projectStepIndex : null;
    dots.forEach((dot, index) => {
      const isActive = activeProjectIndex === index;
      const isPast =
        activeProjectIndex != null ? index < activeProjectIndex : activeScene.kind === 'cta';
      const isFuture =
        activeProjectIndex != null ? index > activeProjectIndex : activeScene.kind !== 'cta';

      dot.classList.toggle('is-active', isActive);
      dot.classList.toggle('is-past', isPast);
      dot.classList.toggle('is-future', isFuture);
    });
  };

  let rafId: number | null = null;
  const requestUpdate = () => {
    if (rafId !== null) return;
    rafId = window.requestAnimationFrame(() => {
      rafId = null;
      updateActiveState();
    });
  };

  if (!reducedMotion.matches) {
    scenes.forEach((scene) => {
      if (scene.kind === 'hero') {
        disposers.push(prepareHero(scene));
        return;
      }
      if (scene.kind === 'project') {
        disposers.push(prepareProjectScene(scene));
        return;
      }
      if (scene.kind === 'cta') {
        disposers.push(prepareCtaScene(scene));
      }
    });
  } else {
    root.classList.add('projects-story--motion-disabled');
  }

  dots.forEach((dot, index) => {
    const scene = projectScenes[index];
    const target = scene?.projectSection ?? scene?.wrapper;
    if (!target) return;

    const onClick = () => {
      target.scrollIntoView({
        behavior: reducedMotion.matches ? 'auto' : 'smooth',
        block: 'start',
      });
    };

    dot.addEventListener('click', onClick);
    disposers.push(() => dot.removeEventListener('click', onClick));
  });

  const onScroll = () => {
    requestUpdate();
  };

  const onResize = () => {
    requestUpdate();
  };

  const onReducedMotionChange = () => {
    cleanup();
    initScrollPortfolioAnimations(root);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onResize);
  reducedMotion.addEventListener?.('change', onReducedMotionChange);

  requestUpdate();

  const cleanup = () => {
    if (rafId !== null) {
      window.cancelAnimationFrame(rafId);
      rafId = null;
    }

    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onResize);
    reducedMotion.removeEventListener?.('change', onReducedMotionChange);

    disposers.forEach((dispose) => dispose());

    scenes.forEach((scene) => {
      scene.heroRoot?.classList.remove('is-ready', 'is-floating');
      scene.projectSection?.classList.remove('is-active', 'is-inactive', 'is-revealed');
      scene.ctaRoot?.classList.remove('is-active', 'is-ready', 'is-fully-visible');
    });

    dots.forEach((dot) => {
      dot.classList.remove('is-active', 'is-past', 'is-future');
    });

    root.classList.remove('projects-story--enhanced', 'projects-story--motion-disabled');
    root.style.removeProperty('--projects-story-progress');
    root.style.removeProperty('--projects-grid-shift-x');
    root.style.removeProperty('--projects-grid-shift-y');
    root.style.removeProperty('--projects-grid-overlay-opacity');
    root.dataset.activeTone = '0';
    delete root.dataset.scrollPortfolioBound;
  };

  return cleanup;
}
