/**
 * Backend enum-larının string qarşılıqları.
 * Bütün enum-lar API-dan STRING kimi gəlir (`"plan": "ProPlus"`), rəqəm yox.
 */

export const ESSAY_GRADES = ['Grade9', 'Grade11'] as const;
export type EssayGrade = (typeof ESSAY_GRADES)[number];

export const ESSAY_SOURCES = ['Text', 'Image'] as const;
export type EssaySource = (typeof ESSAY_SOURCES)[number];

export const MISTAKE_CATEGORIES = [
  'Grammar',
  'Spelling',
  'Vocabulary',
  'NaturalExpression',
] as const;
export type MistakeCategory = (typeof MISTAKE_CATEGORIES)[number];

export const SCORE_DIRECTIONS = ['Structure', 'Content', 'Grammar', 'Vocabulary'] as const;
export type ScoreDirection = (typeof SCORE_DIRECTIONS)[number];

export const SUBSCRIPTION_PLANS = ['Free', 'Pro', 'ProPlus', 'Premium'] as const;
export type SubscriptionPlan = (typeof SUBSCRIPTION_PLANS)[number];

export const SUBSCRIPTION_PLATFORMS = ['Manual', 'GooglePlay', 'AppStore', 'Trial'] as const;
export type SubscriptionPlatform = (typeof SUBSCRIPTION_PLATFORMS)[number];

export const LESSON_SLIDE_TYPES = [
  'Intro',
  'Rule',
  'Examples',
  'Mistakes',
  'Compare',
  'Summary',
] as const;
export type LessonSlideType = (typeof LESSON_SLIDE_TYPES)[number];
