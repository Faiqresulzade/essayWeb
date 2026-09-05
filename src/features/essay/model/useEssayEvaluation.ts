import { useEffect, useRef } from 'react';

import type { Essay, EssayGrade } from '@/domain';

import { useEvaluateGrade9EssayMutation, useEvaluateTextEssayMutation } from '../api/essayQueries';

export interface EvaluationInput {
  readonly text: string;
  readonly grade: EssayGrade;
  readonly topic?: string;
  readonly studentId?: number;
  readonly fromImage: boolean;
  /** Yalnız Grade9 üçün: DİM tapşırıq şəkli. */
  readonly promptImage?: File;
}

/**
 * Qiymətləndirmə axınının tək giriş nöqtəsi: sinifə görə düzgün endpoint seçilir
 * (Grade9 həmişə multipart endpoint-ə gedir) və istifadəçi səhifədən çıxanda sorğu ləğv olunur.
 */
export function useEssayEvaluation() {
  const textMutation = useEvaluateTextEssayMutation();
  const grade9Mutation = useEvaluateGrade9EssayMutation();
  const controllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => controllerRef.current?.abort();
  }, []);

  const evaluate = async (input: EvaluationInput): Promise<Essay> => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    if (input.grade === 'Grade9') {
      return grade9Mutation.mutateAsync({
        command: {
          text: input.text,
          ...(input.studentId !== undefined ? { studentId: input.studentId } : {}),
          ...(input.promptImage ? { promptImage: input.promptImage } : {}),
        },
        signal: controller.signal,
      });
    }

    return textMutation.mutateAsync({
      command: {
        text: input.text,
        source: input.fromImage ? 'Image' : 'Text',
        grade: input.grade,
        ...(input.topic ? { topic: input.topic } : {}),
        ...(input.studentId !== undefined ? { studentId: input.studentId } : {}),
      },
      signal: controller.signal,
    });
  };

  return {
    evaluate,
    isPending: textMutation.isPending || grade9Mutation.isPending,
  };
}
