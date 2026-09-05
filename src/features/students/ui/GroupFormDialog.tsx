import { useState } from 'react';

import { GROUP_NAME_MAX_CHARS } from '@/domain';
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
import { FormField } from '@/shared/ui/FormField';

interface GroupFormDialogProps {
  readonly open: boolean;
  readonly initialName?: string;
  readonly loading?: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly onSubmit: (name: string) => void;
}

export function GroupFormDialog({
  open,
  initialName = '',
  loading = false,
  onOpenChange,
  onSubmit,
}: GroupFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {initialName ? strings.students.editGroupTitle : strings.students.newGroupTitle}
          </DialogTitle>
        </DialogHeader>

        {/* `key` forma vəziyyətini sıfırlayır — effekt daxilində setState-ə ehtiyac qalmır. */}
        <GroupForm
          key={`${String(open)}-${initialName}`}
          initialName={initialName}
          loading={loading}
          onCancel={() => onOpenChange(false)}
          onSubmit={onSubmit}
        />
      </DialogContent>
    </Dialog>
  );
}

interface GroupFormProps {
  readonly initialName: string;
  readonly loading: boolean;
  readonly onCancel: () => void;
  readonly onSubmit: (name: string) => void;
}

function GroupForm({ initialName, loading, onCancel, onSubmit }: GroupFormProps) {
  const [name, setName] = useState(initialName);
  const [error, setError] = useState<string | null>(null);

  const submit = () => {
    if (!name.trim()) {
      setError(strings.validation.required);
      return;
    }
    onSubmit(name.trim());
  };

  return (
    <>
      <FormField id="group-name" label={strings.students.groupNameLabel} error={error ?? undefined}>
        <Input
          id="group-name"
          value={name}
          maxLength={GROUP_NAME_MAX_CHARS}
          placeholder={strings.students.groupNamePlaceholder}
          onChange={event => setName(event.target.value)}
          onKeyDown={event => event.key === 'Enter' && submit()}
        />
      </FormField>

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
