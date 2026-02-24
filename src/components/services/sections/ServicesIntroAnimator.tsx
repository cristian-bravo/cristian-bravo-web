import { animate, remove, set, stagger } from 'animejs';
import { useEffect } from 'preact/hooks';

interface ServicesIntroAnimatorProps {
  targetId: string;
}

const INTRO_REVEAL_OFFSET = 24;
const INTRO_TEXT_DURATION = 560;
const INTRO_CARDS_DURATION = 620;
const INTRO_CARDS_DELAY = 220;

const clearRevealInlineStyles = (elements: HTMLElement[]) => {
  elements.forEach((element) => {
    element.style.opacity = '';
    element.style.transform = '';
    element.style.willChange = '';
  });
};

export default function ServicesIntroAnimator({ targetId }: ServicesIntroAnimatorProps) {
  useEffect(() => {
    const section = document.getElementById(targetId);
    if (!section || section.dataset.introAnimated === 'true') return;

    const revealElements = Array.from(section.querySelectorAll<HTMLElement>('[data-intro-reveal]'));
    if (!revealElements.length) return;

    const cardElements = revealElements.filter((element) => element.dataset.introReveal === 'card');
    const textElements = revealElements.filter((element) => element.dataset.introReveal !== 'card');
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const markReady = () => {
      section.classList.add('services-intro--ready');
      section.classList.remove('services-intro--prepared');
      section.dataset.introAnimated = 'true';
      clearRevealInlineStyles(revealElements);
    };

    if (motionQuery.matches) {
      markReady();
      return;
    }

    section.classList.add('services-intro--prepared');
    revealElements.forEach((element) => {
      element.style.willChange = 'transform, opacity';
    });
    set(revealElements, {
      opacity: 0,
      y: INTRO_REVEAL_OFFSET,
    });

    animate(textElements, {
      opacity: 1,
      y: 0,
      duration: INTRO_TEXT_DURATION,
      delay: stagger(70),
      ease: 'outExpo',
    });

    animate(cardElements, {
      opacity: 1,
      y: 0,
      duration: INTRO_CARDS_DURATION,
      delay: stagger(90, { start: INTRO_CARDS_DELAY }),
      ease: 'outExpo',
    });

    const finalizeTimer = window.setTimeout(markReady, 980);

    const onMotionChange = (event: MediaQueryListEvent) => {
      if (!event.matches) return;
      window.clearTimeout(finalizeTimer);
      remove(revealElements);
      markReady();
    };

    motionQuery.addEventListener?.('change', onMotionChange);

    return () => {
      window.clearTimeout(finalizeTimer);
      motionQuery.removeEventListener?.('change', onMotionChange);
      remove(revealElements);
      clearRevealInlineStyles(revealElements);
      section.classList.remove('services-intro--prepared');
    };
  }, [targetId]);

  return null;
}
