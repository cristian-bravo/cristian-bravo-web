import { createTimeline, remove, stagger } from 'animejs';

type Cleanup = () => void;

type SceneKind = 'hero' | 'project' | 'cta';

interface SceneRefs {
  wrapper: HTMLElement;
  kind: SceneKind;
  sceneIndex: number;
  tone: number;
  innerRoot: HTMLElement | null;
  projectStepIndex: number | null;
  heroCopy: HTMLElement | null;
  heroAvatar: HTMLElement | null;
  heroReveal: HTMLElement[];
  projectSection: HTMLElement | null;
  projectPanel: HTMLElement | null;
  projectGlow: HTMLElement | null;
  projectAvatar: HTMLElement | null;
  projectLetters: HTMLElement[];
  projectDescriptions: HTMLElement[];
  projectMediaItems: HTMLElement[];
  ctaRoot: HTMLElement | null;
  ctaPanel: HTMLElement | null;
  ctaRadial: HTMLElement | null;
  ctaButton: HTMLElement | null;
  ctaReveal: HTMLElement[];
}

interface Metrics {
  viewportHeight: number;
  storyScrollHeight: number;
  documentScrollHeight: number;
  scrollRange: number;
}

interface TimelineConfig {
  segmentDuration: number;
  wrapperInDuration: number;
  wrapperOutDuration: number;
  letterStagger: number;
  mediaStagger: number;
  descStagger: number;
  enableFloats: boolean;
}

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const lerp = (from: number, to: number, amount: number) => from + (to - from) * amount;
const formatPx = (value: number) => `${value.toFixed(2)}px`;

const getTimelineConfig = (mobile: boolean): TimelineConfig => ({
  segmentDuration: mobile ? 860 : 1080,
  wrapperInDuration: mobile ? 210 : 260,
  wrapperOutDuration: mobile ? 190 : 240,
  letterStagger: mobile ? 7 : 11,
  mediaStagger: mobile ? 28 : 48,
  descStagger: mobile ? 28 : 38,
  enableFloats: !mobile,
});

const clearInlineStyles = (elements: Array<HTMLElement | null | undefined>) => {
  elements.forEach((element) => {
    if (!element) return;
    element.style.opacity = '';
    element.style.transform = '';
    element.style.filter = '';
    element.style.zIndex = '';
    element.style.pointerEvents = '';
    element.style.willChange = '';
  });
};

const queryAll = <T extends HTMLElement>(root: ParentNode, selector: string): T[] =>
  Array.from(root.querySelectorAll<T>(selector));

const collectScenes = (root: HTMLElement): SceneRefs[] => {
  const wrappers = queryAll<HTMLElement>(root, '[data-story-scene]');

  return wrappers.map((wrapper) => {
    const kind = (wrapper.dataset.sceneKind as SceneKind) ?? 'project';
    const sceneIndex = Number(wrapper.dataset.sceneIndex ?? 0);
    const tone = Number(wrapper.dataset.themeTone ?? 0);
    const projectStepIndex =
      wrapper.dataset.projectStepIndex != null ? Number(wrapper.dataset.projectStepIndex) : null;

    const heroRoot = wrapper.querySelector<HTMLElement>('[data-project-hero]');
    const projectRoot = wrapper.querySelector<HTMLElement>('.project-section');
    const ctaRoot = wrapper.querySelector<HTMLElement>('[data-project-final-cta]');
    const innerRoot = heroRoot ?? projectRoot ?? ctaRoot ?? null;

    return {
      wrapper,
      kind,
      sceneIndex,
      tone,
      innerRoot,
      projectStepIndex,
      heroCopy: wrapper.querySelector<HTMLElement>('[data-project-hero-copy]'),
      heroAvatar: wrapper.querySelector<HTMLElement>('[data-project-hero-avatar]'),
      heroReveal: queryAll<HTMLElement>(wrapper, '[data-project-hero-reveal]'),
      projectSection: projectRoot,
      projectPanel: wrapper.querySelector<HTMLElement>('[data-project-panel]'),
      projectGlow: wrapper.querySelector<HTMLElement>('[data-project-glow]'),
      projectAvatar: wrapper.querySelector<HTMLElement>('[data-project-step-avatar]'),
      projectLetters: queryAll<HTMLElement>(wrapper, '[data-project-title-letter]'),
      projectDescriptions: queryAll<HTMLElement>(wrapper, '[data-project-description]'),
      projectMediaItems: queryAll<HTMLElement>(wrapper, '[data-project-media-item]'),
      ctaRoot,
      ctaPanel: wrapper.querySelector<HTMLElement>('[data-project-cta-panel]'),
      ctaRadial: wrapper.querySelector<HTMLElement>('[data-project-cta-light]'),
      ctaButton: wrapper.querySelector<HTMLElement>('[data-project-cta-button]'),
      ctaReveal: queryAll<HTMLElement>(wrapper, '[data-project-cta-reveal]'),
    };
  });
};

const getSceneAnimatedTargets = (scene: SceneRefs): HTMLElement[] =>
  [
    scene.wrapper,
    scene.heroCopy,
    scene.heroAvatar,
    ...scene.heroReveal,
    scene.projectPanel,
    scene.projectGlow,
    scene.projectAvatar,
    ...scene.projectLetters,
    ...scene.projectDescriptions,
    ...scene.projectMediaItems,
    scene.ctaPanel,
    scene.ctaRadial,
    scene.ctaButton,
    ...scene.ctaReveal,
  ].filter(Boolean) as HTMLElement[];

const applyNoMotionState = (root: HTMLElement, storyScroll: HTMLElement, scenes: SceneRefs[]) => {
  root.classList.add('projects-story--motion-disabled');
  root.classList.remove('projects-story--scroll-linked');
  storyScroll.style.height = '';

  root.style.setProperty('--projects-story-progress', '1');
  root.style.setProperty('--projects-grid-shift-x', '0px');
  root.style.setProperty('--projects-grid-shift-y', '0px');
  root.style.setProperty('--projects-grid-overlay-opacity', '0.18');

  scenes.forEach((scene, index) => {
    scene.wrapper.classList.remove('is-active', 'is-visible', 'is-interactive');
    scene.wrapper.classList.add('is-visible');
    scene.wrapper.style.pointerEvents = 'auto';

    scene.innerRoot?.classList.add('is-ready');
    if (scene.projectSection) {
      scene.projectSection.classList.toggle('is-active', index === 1);
      scene.projectSection.classList.toggle('is-inactive', index !== 1);
      scene.projectSection.classList.add('is-revealed');
    }

    if (scene.ctaRoot) {
      scene.ctaRoot.classList.add('is-ready', 'is-active', 'is-fully-visible');
    }
  });

  const dots = queryAll<HTMLElement>(root, '[data-project-progress-dot]');
  dots.forEach((dot) => {
    dot.classList.remove('is-active', 'is-past', 'is-future');
  });
};

const buildMasterTimeline = (scenes: SceneRefs[], config: TimelineConfig) => {
  const timeline = createTimeline({
    autoplay: false,
    defaults: { ease: 'linear' },
  });

  const segment = config.segmentDuration;

  scenes.forEach((scene, sceneOrderIndex) => {
    const start = sceneOrderIndex * segment;
    const isFirst = sceneOrderIndex === 0;
    const isLast = sceneOrderIndex === scenes.length - 1;

    if (!isFirst) {
      timeline.add(
        scene.wrapper,
        {
          opacity: [0, 1],
          scale: [0.985, 1],
          duration: config.wrapperInDuration,
        },
        start,
      );
    }

    if (!isLast) {
      timeline.add(
        scene.wrapper,
        {
          opacity: [1, 0],
          scale: [1, 0.992],
          duration: config.wrapperOutDuration,
        },
        start + segment - config.wrapperOutDuration,
      );
    }

    if (scene.kind === 'hero') {
      const heroTargets = scene.heroReveal.length ? scene.heroReveal : [scene.heroCopy].filter(Boolean);
      if (heroTargets.length) {
        timeline.add(
          heroTargets,
          {
            y: [0, -18],
            opacity: [1, 0.9],
            duration: segment - 80,
            delay: stagger(18),
          },
          start,
        );
      }

      if (scene.heroCopy) {
        timeline.add(
          scene.heroCopy,
          {
            y: [0, -28],
            opacity: [1, 0.88],
            duration: segment - 60,
          },
          start,
        );
      }

      if (scene.heroAvatar) {
        timeline.add(
          scene.heroAvatar,
          {
            y: [0, -12],
            scale: [0.96, 1.04],
            opacity: [1, 0.95],
            duration: segment - 50,
          },
          start,
        );
      }
    }

    if (scene.kind === 'project') {
      if (scene.projectPanel) {
        timeline.add(
          scene.projectPanel,
          {
            opacity: [0.5, 1],
            y: [26, 0],
            scale: [0.985, 1],
            duration: Math.round(segment * 0.34),
          },
          start + 50,
        );

        timeline.add(
          scene.projectPanel,
          {
            opacity: [1, 0.76],
            scale: [1, 0.988],
            duration: Math.round(segment * 0.24),
          },
          start + Math.round(segment * 0.78),
        );
      }

      if (scene.projectGlow) {
        timeline.add(
          scene.projectGlow,
          {
            opacity: [0.06, 0.36],
            scale: [0.97, 1.03],
            duration: Math.round(segment * 0.34),
          },
          start + 60,
        );

        timeline.add(
          scene.projectGlow,
          {
            opacity: [0.36, 0.1],
            scale: [1.03, 0.99],
            duration: Math.round(segment * 0.22),
          },
          start + Math.round(segment * 0.8),
        );
      }

      if (scene.projectAvatar) {
        timeline.add(
          scene.projectAvatar,
          {
            opacity: [0.45, 1],
            scale: [0.8, 1],
            y: [10, 0],
            duration: Math.round(segment * 0.28),
          },
          start + 30,
        );

        timeline.add(
          scene.projectAvatar,
          {
            opacity: [1, 0.86],
            scale: [1, 0.96],
            duration: Math.round(segment * 0.22),
          },
          start + Math.round(segment * 0.79),
        );
      }

      if (scene.projectLetters.length) {
        timeline.add(
          scene.projectLetters,
          {
            opacity: [0, 1],
            y: [18, 0],
            duration: Math.round(segment * 0.19),
            delay: stagger(config.letterStagger),
          },
          start + 90,
        );
      }

      if (scene.projectDescriptions.length) {
        timeline.add(
          scene.projectDescriptions,
          {
            opacity: [0, 1],
            y: [16, 0],
            duration: Math.round(segment * 0.2),
            delay: stagger(config.descStagger),
          },
          start + 170,
        );

        timeline.add(
          scene.projectDescriptions,
          {
            opacity: [1, 0.82],
            y: [0, -6],
            duration: Math.round(segment * 0.18),
          },
          start + Math.round(segment * 0.8),
        );
      }

      if (scene.projectMediaItems.length) {
        timeline.add(
          scene.projectMediaItems,
          {
            opacity: [0, 1],
            y: [28, 0],
            scale: [0.96, 1],
            duration: Math.round(segment * 0.25),
            delay: stagger(config.mediaStagger),
          },
          start + 210,
        );

        timeline.add(
          scene.projectMediaItems,
          {
            y: [0, -14],
            duration: Math.round(segment * 0.3),
            delay: stagger(Math.max(10, Math.round(config.mediaStagger * 0.35))),
          },
          start + Math.round(segment * 0.44),
        );

        timeline.add(
          scene.projectMediaItems,
          {
            opacity: [1, 0.72],
            y: [-14, -6],
            scale: [1, 0.986],
            duration: Math.round(segment * 0.22),
            delay: stagger(Math.max(10, Math.round(config.mediaStagger * 0.25)), { from: 'last' }),
          },
          start + Math.round(segment * 0.78),
        );
      }
    }

    if (scene.kind === 'cta') {
      if (scene.ctaPanel) {
        timeline.add(
          scene.ctaPanel,
          {
            opacity: [0.45, 1],
            y: [20, 0],
            scale: [0.985, 1],
            duration: Math.round(segment * 0.34),
          },
          start + 50,
        );
      }

      if (scene.ctaReveal.length) {
        timeline.add(
          scene.ctaReveal,
          {
            opacity: [0.25, 1],
            y: [16, 0],
            scale: [0.985, 1],
            duration: Math.round(segment * 0.26),
            delay: stagger(config.descStagger),
          },
          start + 120,
        );
      }

      if (scene.ctaRadial) {
        timeline.add(
          scene.ctaRadial,
          {
            opacity: [0.12, 0.42],
            y: [30, -24],
            scale: [0.92, 1.24],
            duration: Math.round(segment * 0.9),
          },
          start,
        );
      }

      if (scene.ctaButton) {
        timeline.add(
          scene.ctaButton,
          {
            y: [10, 0],
            scale: [0.985, 1],
            duration: Math.round(segment * 0.2),
          },
          start + 220,
        );
      }
    }
  });

  return timeline;
};

export function initScrollPortfolioAnimations(rootNode: ParentNode | Element = document): Cleanup {
  const root =
    rootNode instanceof HTMLElement
      ? rootNode
      : rootNode.querySelector<HTMLElement>('[data-projects-story-root]');

  if (!root) return () => undefined;
  if (root.dataset.scrollPortfolioBound === 'true') return () => undefined;

  const stage = root.closest<HTMLElement>('[data-story-stage]');
  const storyScroll = stage?.closest<HTMLElement>('[data-story-scroll]');
  const storyRoot = storyScroll?.closest<HTMLElement>('[data-story-root]');
  const track = root.querySelector<HTMLElement>('[data-story-track]');
  if (!storyRoot || !storyScroll || !stage || !track) return () => undefined;

  root.dataset.scrollPortfolioBound = 'true';

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const mobileQuery = window.matchMedia('(max-width: 767px)');
  const scenes = collectScenes(root).sort((a, b) => a.sceneIndex - b.sceneIndex);
  const allProjectSections = Array.from(document.querySelectorAll<HTMLElement>('.project-section'));
  const rootProjectSections = allProjectSections.filter((section) => root.contains(section));
  const themeLayers = queryAll<HTMLElement>(root, '.projects-story__theme-layer');
  const dots = queryAll<HTMLElement>(root, '[data-project-progress-dot]');
  const projectScenes = scenes.filter((scene) => scene.kind === 'project');

  if (reducedMotion.matches) {
    storyRoot.classList.remove('story-root--scroll-linked', 'story-root--motion-disabled');
    storyRoot.classList.add('story-root--motion-disabled');
    storyScroll.classList.remove('story-scroll--scroll-linked', 'story-scroll--motion-disabled');
    storyScroll.classList.add('story-scroll--motion-disabled');
    stage.classList.remove('story-stage--scroll-linked', 'story-stage--motion-disabled');
    stage.classList.add('story-stage--motion-disabled');
    applyNoMotionState(root, storyScroll, scenes);
    return () => {
      delete root.dataset.scrollPortfolioBound;
      storyRoot.classList.remove('story-root--motion-disabled', 'story-root--scroll-linked');
      storyScroll.classList.remove('story-scroll--motion-disabled', 'story-scroll--scroll-linked');
      stage.classList.remove('story-stage--motion-disabled', 'story-stage--scroll-linked');
      root.classList.remove('projects-story--motion-disabled');
      root.style.removeProperty('--projects-story-progress');
      root.style.removeProperty('--projects-grid-shift-x');
      root.style.removeProperty('--projects-grid-shift-y');
      root.style.removeProperty('--projects-grid-overlay-opacity');
    };
  }

  root.classList.remove('projects-story--motion-disabled');
  root.classList.add('projects-story--scroll-linked', 'projects-story--enhanced');
  storyRoot.classList.remove('story-root--motion-disabled');
  storyRoot.classList.add('story-root--scroll-linked');
  storyScroll.classList.remove('story-scroll--motion-disabled');
  storyScroll.classList.add('story-scroll--scroll-linked');
  stage.classList.remove('story-stage--motion-disabled');
  stage.classList.add('story-stage--scroll-linked');

  const config = getTimelineConfig(mobileQuery.matches);
  const masterTimeline = buildMasterTimeline(scenes, config);
  const animatedTargets = scenes.flatMap(getSceneAnimatedTargets);
  const totalDuration = Math.max(masterTimeline.duration || 1, 1);
  const sceneCount = Math.max(scenes.length, 1);
  if (!rootProjectSections.length) {
    // The timeline still supports hero/cta-only states, but the portfolio expects project scenes.
    root.classList.add('projects-story--no-project-scenes');
  }
  const sceneSegment = totalDuration / sceneCount;

  let metrics: Metrics = {
    viewportHeight: window.innerHeight,
    storyScrollHeight: 0,
    documentScrollHeight: 0,
    scrollRange: 1,
  };
  let rafId: number | null = null;
  let activeSceneIdx = -1;
  let currentTime = 0;
  const dotClickCleanups: Cleanup[] = [];

  const setThemeCrossfade = (timelineProgress: number) => {
    if (!themeLayers.length) return;
    const sceneFloat = clamp(timelineProgress) * Math.max(sceneCount - 1, 0);
    const baseIndex = Math.floor(sceneFloat);
    const mix = clamp(sceneFloat - baseIndex);
    const toneWeights = new Map<number, number>();

    const baseTone = scenes[clamp(baseIndex, 0, scenes.length - 1)]?.tone ?? 0;
    const nextTone = scenes[clamp(baseIndex + 1, 0, scenes.length - 1)]?.tone ?? baseTone;

    toneWeights.set(baseTone, (toneWeights.get(baseTone) ?? 0) + (1 - mix));
    toneWeights.set(nextTone, (toneWeights.get(nextTone) ?? 0) + mix);

    themeLayers.forEach((layer) => {
      const tone = Number(layer.dataset.tone ?? 0);
      const weight = clamp(toneWeights.get(tone) ?? 0);
      layer.style.opacity = weight.toFixed(4);
    });
  };

  const updateDots = (timelineProgress: number) => {
    const projectCount = projectScenes.length;
    const activeScene = activeSceneIdx >= 0 ? scenes[activeSceneIdx] : null;
    const activeProject =
      activeScene?.kind === 'project'
        ? activeScene.projectStepIndex ?? null
        : null;

    root.style.setProperty('--projects-story-progress', timelineProgress.toFixed(4));
    dots.forEach((dot, dotIndex) => {
      let isActive = activeProject === dotIndex;
      let isPast = activeProject != null ? dotIndex < activeProject : false;
      let isFuture = activeProject != null ? dotIndex > activeProject : true;

      if (activeProject == null && projectCount) {
        isActive = false;
        if (activeScene?.kind === 'cta') {
          isPast = true;
          isFuture = false;
        } else {
          isPast = false;
          isFuture = true;
        }
      }

      dot.classList.toggle('is-active', isActive);
      dot.classList.toggle('is-past', isPast);
      dot.classList.toggle('is-future', isFuture);
    });
  };

  const setSceneClasses = (timelineProgress: number) => {
    const sceneFloat = clamp(timelineProgress) * Math.max(sceneCount - 1, 0);
    const nearestSceneIdx = Math.round(sceneFloat);
    activeSceneIdx = clamp(nearestSceneIdx, 0, scenes.length - 1);

    scenes.forEach((scene, idx) => {
      const local = clamp((currentTime - idx * sceneSegment) / Math.max(sceneSegment, 1));
      const visible = local > 0.01 && local < 0.995;
      const active = idx === activeSceneIdx;
      const distance = Math.abs(sceneFloat - idx);
      const zBase = 1000 - Math.round(distance * 100);

      scene.wrapper.classList.toggle('is-visible', visible || active);
      scene.wrapper.classList.toggle('is-active', active);
      scene.wrapper.classList.toggle('is-interactive', active);
      scene.wrapper.style.pointerEvents = active ? 'auto' : 'none';
      scene.wrapper.style.zIndex = String(Math.max(1, zBase));

      if (scene.innerRoot) {
        scene.innerRoot.classList.toggle('is-active', active);
        scene.innerRoot.classList.toggle('is-inactive', !active);
      }

      if (scene.kind === 'hero' && scene.innerRoot) {
        scene.innerRoot.classList.add('is-ready');
        scene.innerRoot.classList.toggle('is-floating', active && config.enableFloats);
      }

      if (scene.projectSection) {
        scene.projectSection.classList.add('is-revealed');
        scene.projectSection.classList.toggle('is-active', active);
        scene.projectSection.classList.toggle('is-inactive', !active);

        const parallax = clamp((local - 0.5) / 0.5, -1, 1) * (mobileQuery.matches ? -10 : -18);
        scene.projectSection.style.setProperty('--project-parallax-y', formatPx(parallax));
        scene.projectSection.style.setProperty('--project-section-progress', local.toFixed(4));
      }

      if (scene.ctaRoot) {
        scene.ctaRoot.classList.add('is-ready');
        scene.ctaRoot.classList.toggle('is-active', active);
        scene.ctaRoot.classList.toggle('is-fully-visible', active && local > 0.9);
      }
    });

    const activeTone = scenes[activeSceneIdx]?.tone ?? 0;
    root.dataset.activeTone = String(activeTone);
  };

  const updateBackgroundGrid = (timelineProgress: number) => {
    root.style.setProperty('--projects-grid-shift-x', formatPx(lerp(-12, 18, timelineProgress)));
    root.style.setProperty('--projects-grid-shift-y', formatPx(lerp(-8, 14, timelineProgress)));
    root.style.setProperty(
      '--projects-grid-overlay-opacity',
      lerp(0.15, 0.26, Math.abs(timelineProgress - 0.5) * 0.9).toFixed(3),
    );
  };

  const seekTimeline = (timelineProgress: number) => {
    const clampedProgress = clamp(timelineProgress);
    currentTime = clampedProgress * totalDuration;
    masterTimeline.seek(currentTime);
    setThemeCrossfade(clampedProgress);
    setSceneClasses(clampedProgress);
    updateDots(clampedProgress);
    updateBackgroundGrid(clampedProgress);
  };

  const measure = () => {
    metrics.viewportHeight = window.innerHeight;
    metrics.storyScrollHeight = Math.max(sceneCount, 1) * metrics.viewportHeight;
    storyScroll.style.height = `${metrics.storyScrollHeight}px`;
    metrics.documentScrollHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
    metrics.scrollRange = Math.max(metrics.documentScrollHeight - metrics.viewportHeight, 1);
  };

  const getTimelineProgressFromScroll = () => {
    return clamp(window.scrollY / metrics.scrollRange);
  };

  const tick = () => {
    rafId = null;
    seekTimeline(getTimelineProgressFromScroll());
  };

  const requestTick = () => {
    if (rafId !== null) return;
    rafId = window.requestAnimationFrame(tick);
  };

  const onScroll = () => {
    requestTick();
  };

  const onResize = () => {
    measure();
    requestTick();
  };

  const onReducedMotionChange = (event: MediaQueryListEvent) => {
    if (!event.matches) return;
    cleanup();
    storyRoot.classList.add('story-root--motion-disabled');
    storyScroll.classList.add('story-scroll--motion-disabled');
    stage.classList.add('story-stage--motion-disabled');
    applyNoMotionState(root, storyScroll, scenes);
  };

  const onMobileChange = () => {
    // Rebuilding the timeline is simpler and safer when durations/staggers differ by breakpoint.
    cleanup();
    initScrollPortfolioAnimations(root);
  };

  let cleanup: Cleanup = () => undefined;

  // Initial visual state before first seek.
  scenes.forEach((scene, idx) => {
    scene.wrapper.style.willChange = 'transform, opacity';
    scene.wrapper.style.pointerEvents = idx === 0 ? 'auto' : 'none';
  });

  dots.forEach((dot, dotIndex) => {
    const targetScene = projectScenes[dotIndex];
    if (!targetScene) return;

    const onClick = () => {
      const maxSceneIndex = Math.max(sceneCount - 1, 1);
      const targetProgress = clamp(targetScene.sceneIndex / maxSceneIndex);
      const targetScroll = Math.round(targetProgress * metrics.scrollRange);

      window.scrollTo({
        top: targetScroll,
        behavior: reducedMotion.matches ? 'auto' : 'smooth',
      });
    };

    dot.addEventListener('click', onClick);
    dotClickCleanups.push(() => dot.removeEventListener('click', onClick));
  });

  measure();
  seekTimeline(getTimelineProgressFromScroll());

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onResize);
  reducedMotion.addEventListener?.('change', onReducedMotionChange);
  mobileQuery.addEventListener?.('change', onMobileChange);

  cleanup = () => {
    if (rafId !== null) {
      window.cancelAnimationFrame(rafId);
      rafId = null;
    }

    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onResize);
    reducedMotion.removeEventListener?.('change', onReducedMotionChange);
    mobileQuery.removeEventListener?.('change', onMobileChange);
    dotClickCleanups.forEach((dispose) => dispose());

    remove(animatedTargets);
    masterTimeline.revert();

    scenes.forEach((scene) => {
      clearInlineStyles(getSceneAnimatedTargets(scene));
      scene.wrapper.classList.remove('is-active', 'is-visible', 'is-interactive');
      scene.innerRoot?.classList.remove('is-active', 'is-inactive', 'is-ready', 'is-floating');

      if (scene.projectSection) {
        scene.projectSection.classList.remove('is-active', 'is-inactive', 'is-revealed');
        scene.projectSection.style.removeProperty('--project-parallax-y');
        scene.projectSection.style.removeProperty('--project-section-progress');
      }

      if (scene.ctaRoot) {
        scene.ctaRoot.classList.remove('is-active', 'is-ready', 'is-fully-visible');
      }
    });

    themeLayers.forEach((layer) => {
      layer.style.opacity = '';
    });

    dots.forEach((dot) => {
      dot.classList.remove('is-active', 'is-past', 'is-future');
    });

    storyScroll.style.height = '';
    storyRoot.classList.remove('story-root--scroll-linked', 'story-root--motion-disabled');
    storyScroll.classList.remove('story-scroll--scroll-linked', 'story-scroll--motion-disabled');
    stage.classList.remove('story-stage--scroll-linked', 'story-stage--motion-disabled');
    root.classList.remove('projects-story--scroll-linked', 'projects-story--enhanced');
    root.classList.remove('projects-story--no-project-scenes');
    root.style.removeProperty('--projects-story-progress');
    root.style.removeProperty('--projects-grid-shift-x');
    root.style.removeProperty('--projects-grid-shift-y');
    root.style.removeProperty('--projects-grid-overlay-opacity');
    root.dataset.activeTone = '0';
    delete root.dataset.scrollPortfolioBound;
  };

  return cleanup;
}
