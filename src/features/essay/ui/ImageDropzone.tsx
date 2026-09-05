import { ImagePlus, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

import { strings } from '@/shared/i18n/strings';
import { cn } from '@/shared/lib/cn';
import { createPreviewUrl, revokePreviewUrl, validateImage } from '@/shared/lib/file';
import { Button } from '@/shared/ui/primitives/button';

interface ImageDropzoneProps {
  readonly files: readonly File[];
  readonly maxFiles: number;
  readonly disabled?: boolean;
  readonly hint?: string;
  readonly onChange: (files: File[]) => void;
  readonly onError: (message: string) => void;
}

/** Vebdə kamera əvəzinə: sürüşdürüb-burax və ya klik ilə fayl seçimi. */
export function ImageDropzone({
  files,
  maxFiles,
  disabled = false,
  hint,
  onChange,
  onError,
}: ImageDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const accept = (incoming: FileList | null) => {
    if (!incoming || incoming.length === 0) return;
    const selected = [...incoming];

    if (files.length + selected.length > maxFiles) {
      onError(strings.essay.dropzoneTooMany(maxFiles));
      return;
    }
    for (const file of selected) {
      const problem = validateImage(file);
      if (problem === 'type') {
        onError(strings.essay.dropzoneInvalidType);
        return;
      }
      if (problem === 'size') {
        onError(strings.essay.dropzoneTooLarge);
        return;
      }
    }
    onChange([...files, ...selected]);
  };

  return (
    <div className="space-y-3">
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled}
        onClick={() => !disabled && inputRef.current?.click()}
        onKeyDown={event => {
          if (disabled) return;
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragOver={event => {
          event.preventDefault();
          if (!disabled) setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={event => {
          event.preventDefault();
          setDragging(false);
          if (!disabled) accept(event.dataTransfer.files);
        }}
        className={cn(
          'flex cursor-pointer flex-col items-center gap-2 rounded-card border-2 border-dashed px-6 py-10 text-center transition-colors',
          dragging
            ? 'border-[var(--color-brand)] bg-[var(--color-brand)]/5'
            : 'border-[var(--color-border)] hover:border-[var(--color-brand)]',
          disabled && 'cursor-not-allowed opacity-60',
        )}
      >
        <ImagePlus className="size-7 text-[var(--color-brand)]" aria-hidden />
        <p className="font-medium">{strings.essay.dropzoneHint}</p>
        <p className="text-xs text-[var(--color-text-muted)]">
          {hint ?? strings.essay.dropzoneFormats}
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple={maxFiles > 1}
          hidden
          disabled={disabled}
          onChange={event => {
            accept(event.target.files);
            event.target.value = '';
          }}
        />
      </div>

      {files.length > 0 && (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {files.map((file, index) => (
            <li key={`${file.name}-${index}`}>
              <ImagePreview
                file={file}
                disabled={disabled}
                onRemove={() => onChange(files.filter((_, position) => position !== index))}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

interface ImagePreviewProps {
  readonly file: File;
  readonly disabled: boolean;
  readonly onRemove: () => void;
}

function ImagePreview({ file, disabled, onRemove }: ImagePreviewProps) {
  const url = useMemo(() => createPreviewUrl(file), [file]);

  // Obyekt URL-i istifadədən sonra azad edilməlidir (yaddaş sızması olmasın).
  useEffect(() => () => revokePreviewUrl(url), [url]);

  return (
    <div className="relative overflow-hidden rounded-card border border-[var(--color-border)]">
      <img src={url} alt={file.name} className="h-28 w-full object-cover" />
      <Button
        type="button"
        variant="secondary"
        size="icon"
        className="absolute top-1 right-1 size-7"
        aria-label={strings.essay.removeImage}
        disabled={disabled}
        onClick={onRemove}
      >
        <X className="size-4" />
      </Button>
    </div>
  );
}
