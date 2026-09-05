import type { ScoreDirection } from '@/domain';

/** Zəif istiqamət → hazır dərs mövzusu (şagird profilindən dərs yaratmaq üçün). */
export const WEAKNESS_TOPICS: Readonly<Record<ScoreDirection, string>> = {
  Structure: 'Esse strukturu və abzas bölgüsü',
  Content: 'Esse məzmununu zənginləşdirmək',
  Grammar: 'İngilis dilində qrammatika səhvləri',
  Vocabulary: 'Esse üçün lüğət ehtiyatı və sinonimlər',
};
