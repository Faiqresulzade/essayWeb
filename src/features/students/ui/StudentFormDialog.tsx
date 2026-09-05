import { useState } from 'react';

import { FULL_NAME_MAX_CHARS, type EssayGrade, type StudentDraft } from '@/domain';
import { strings } from '@/shared/i18n/strings';
import { Button } from '@/shared/ui/primitives/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/primitives/dialog';
import { Input } from '@/shared/ui/primitives/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/primitives/select';
import { FormField } from '@/shared/ui/FormField';

const NOT_SET = 'not-set';

interface StudentInitialValues {
  readonly fullName: string;
  readonly grade: EssayGrade | null;
}

interface StudentFormDialogProps {
  readonly open: boolean;
  readonly initial?: StudentInitialValues;
  readonly loading?: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly onSubmit: (draft: StudentDraft) => void;
}

export function StudentFormDialog({
  open,
  initial,
  loading = false,
  onOpenChange,
  onSubmit,
}: StudentFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {initial ? strings.students.editStudentTitle : strings.students.newStudentTitle}
          </DialogTitle>
        </DialogHeader>

        {/* `key` forma vəziyyətini sıfırlayır — effekt daxilində setState-ə ehtiyac qalmır. */}
        <StudentForm
          key={`${String(open)}-${initial?.fullName ?? ''}-${initial?.grade ?? ''}`}
          initial={initial}
          loading={loading}
          onCancel={() => onOpenChange(false)}
          onSubmit={onSubmit}
        />
      </DialogContent>
    </Dialog>
  );
}

interface StudentFormProps {
  readonly initial: StudentInitialValues | undefined;
  readonly loading: boolean;
  readonly onCancel: () => void;
  readonly onSubmit: (draft: StudentDraft) => void;
}

function StudentForm({ initial, loading, onCancel, onSubmit }: StudentFormProps) {
  const [fullName, setFullName] = useState(initial?.fullName ?? '');
  const [grade, setGrade] = useState<EssayGrade | null>(initial?.grade ?? null);
  const [error, setError] = useState<string | null>(null);

  const submit = () => {
    if (!fullName.trim()) {
      setError(strings.validation.required);
      return;
    }
    onSubmit({ fullName: fullName.trim(), grade });
  };

  return (
    <>
      <div className="space-y-4">
        <FormField
          id="student-name"
          label={strings.students.studentNameLabel}
          error={error ?? undefined}
        >
          <Input
            id="student-name"
            value={fullName}
            maxLength={FULL_NAME_MAX_CHARS}
            placeholder={strings.students.studentNamePlaceholder}
            onChange={event => setFullName(event.target.value)}
          />
        </FormField>

        <FormField id="student-grade" label={strings.students.studentGradeLabel}>
          <Select
            value={grade ?? NOT_SET}
            onValueChange={value => setGrade(value === NOT_SET ? null : (value as EssayGrade))}
          >
            <SelectTrigger id="student-grade" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={NOT_SET}>{strings.students.gradeNotSet}</SelectItem>
              <SelectItem value="Grade9">{strings.essay.grade9}</SelectItem>
              <SelectItem value="Grade11">{strings.essay.grade11}</SelectItem>
            </SelectContent>
          </Select>
        </FormField>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onCancel} disabled={loading}>
          {strings.common.cancel}
        </Button>
        <Button onClick={submit} disabled={loading}>
          {strings.common.save}
        </Button>
      </DialogFooter>
    </>
  );
}
