import type { LessonSlideType } from '@/domain';

import {
  CompareSlide,
  ExamplesSlide,
  IntroSlide,
  MistakesSlide,
  RuleSlide,
  SummarySlide,
  type SlideProps,
} from './slideComponents';

/**
 * Slayd növü → komponent xəritəsi.
 * Yeni növ əlavə etmək üçün yalnız bu obyektə bir sətir yazılır (OCP:
 * oynadıcı komponenti dəyişmir, `switch` yoxdur).
 */
export const SLIDE_COMPONENTS: Readonly<
  Record<LessonSlideType, (props: SlideProps) => React.JSX.Element>
> = {
  Intro: IntroSlide,
  Rule: RuleSlide,
  Examples: ExamplesSlide,
  Mistakes: MistakesSlide,
  Compare: CompareSlide,
  Summary: SummarySlide,
};
