import { useEffect, useRef, useState } from 'react';

import { useRecognizeTextMutation } from '../api/essayQueries';

export interface OcrProgress {
  readonly current: number;
  readonly total: number;
}

/**
 * Backend bir sorğuda bir şəkil qəbul edir; çox səhifəli esse üçün
 * şəkillər ardıcıl oxunur və mətnlər birləşdirilir.
 * OCR gündəlik sayğacı artırmır — yalnız qalan haqqın olub-olmadığını yoxlayır.
 */
export function useOcrRecognition() {
  const mutation = useRecognizeTextMutation();
  const [progress, setProgress] = useState<OcrProgress | null>(null);
  const controllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => controllerRef.current?.abort();
  }, []);

  const recognize = async (files: readonly File[]): Promise<string> => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    const parts: string[] = [];
    try {
      for (const [index, file] of files.entries()) {
        setProgress({ current: index + 1, total: files.length });
        const text = await mutation.mutateAsync({ image: file, signal: controller.signal });
        if (text.trim()) parts.push(text.trim());
      }
    } finally {
      setProgress(null);
    }
    return parts.join('\n\n');
  };

  return { recognize, progress, isPending: mutation.isPending };
}
