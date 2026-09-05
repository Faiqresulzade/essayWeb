import { Link } from 'react-router-dom';

import type { Group, Student } from '@/domain';
import { ROUTES } from '@/shared/config/routes';
import { strings } from '@/shared/i18n/strings';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/primitives/select';
import { FormField } from '@/shared/ui/FormField';

const MYSELF_VALUE = 'myself';

interface StudentPickerProps {
  readonly groups: readonly Group[];
  readonly students: readonly Student[];
  readonly value: number | null;
  readonly onChange: (studentId: number | null) => void;
}

/** Yalnız istifadəçinin qrupu və ya şagirdi varsa göstərilir. */
export function StudentPicker({ groups, students, value, onChange }: StudentPickerProps) {
  const grouped = groups
    .map(group => ({
      group,
      members: students.filter(student => student.groupId === group.id),
    }))
    .filter(entry => entry.members.length > 0);

  return (
    <FormField id="student-picker" label={strings.studentPicker.label}>
      <Select
        value={value === null ? MYSELF_VALUE : String(value)}
        onValueChange={next => onChange(next === MYSELF_VALUE ? null : Number(next))}
      >
        <SelectTrigger id="student-picker" className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={MYSELF_VALUE}>{strings.studentPicker.myself}</SelectItem>
          {grouped.map(({ group, members }) => (
            <SelectGroup key={group.id}>
              <SelectLabel>{group.name}</SelectLabel>
              {members.map(student => (
                <SelectItem key={student.id} value={String(student.id)}>
                  {student.fullName}
                </SelectItem>
              ))}
            </SelectGroup>
          ))}
        </SelectContent>
      </Select>
      <Link
        to={ROUTES.students}
        className="mt-2 inline-block text-xs font-semibold text-[var(--color-brand)]"
      >
        {strings.studentPicker.addStudent}
      </Link>
    </FormField>
  );
}
