import { BACKEND_LEGAL_URLS } from '@/shared/config/app';
import { strings } from '@/shared/i18n/strings';

import { LegalPageLayout } from './LegalPageLayout';

export default function PrivacyPage() {
  return (
    <LegalPageLayout title={strings.legal.privacyTitle}>
      {/* TODO: Yekun mətn sahib tərəfindən veriləcək. */}
      <p className="text-[var(--color-text-muted)]">{strings.legal.placeholder}</p>
      <a
        href={BACKEND_LEGAL_URLS.privacy}
        target="_blank"
        rel="noreferrer"
        className="font-semibold text-[var(--color-brand)]"
      >
        {strings.legal.privacyTitle}
      </a>
    </LegalPageLayout>
  );
}
