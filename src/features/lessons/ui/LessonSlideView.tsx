import type { LessonSlide } from '@/domain';

import { SLIDE_COMPONENTS } from './slides/slideRegistry';

interface LessonSlideViewProps {
  readonly slide: LessonSlide;
  /** Slayd dəyişəndə animasiyanın təkrarlanması üçün açar. */
  readonly step: number;
}

export function LessonSlideView({ slide, step }: LessonSlideViewProps) {
  const SlideComponent = SLIDE_COMPONENTS[slide.type] ?? SLIDE_COMPONENTS.Intro;
  return <SlideComponent key={step} slide={slide} />;
}
