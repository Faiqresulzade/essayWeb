import { strings } from '@/shared/i18n/strings';

import { LegalPageLayout } from './LegalPageLayout';

const SECTIONS: readonly { title: string; body: readonly string[] }[] = [
  {
    title: '1. Xidmətin təsviri',
    body: [
      'EssayCheck AI, ingilis dilində yazılmış esseləri Dövlət İmtahan Mərkəzi (DİM) meyarlarına ' +
        'əsaslanaraq süni intellekt vasitəsilə qiymətləndirən köməkçi bir vasitədir. Nəticələr ' +
        'tövsiyə xarakterlidir və rəsmi DİM qiymətləndirməsini əvəz etmir.',
    ],
  },
  {
    title: '2. Hesab',
    body: [
      'Qeydiyyat zamanı düzgün məlumat verməyi öhtəsinə götürürsünüz. Hesabınızın ' +
        'təhlükəsizliyinə görə (şifrənizi kimsə ilə paylaşmamaq) siz məsuliyyət daşıyırsınız.',
    ],
  },
  {
    title: '3. Planlar və ödəniş',
    body: [
      'Free: gündə 1 pulsuz mətn yoxlaması.',
      'Pro / Pro Plus: Google Play vasitəsilə aylıq abunəlik, avtomatik yenilənir.',
      'Abunəliyi istənilən vaxt Google Play → Subscriptions bölməsindən ləğv edə bilərsiniz.',
      'Ödənişlər Google Play Billing tərəfindən idarə olunur, geri qaytarma siyasəti Google Play qaydalarına tabedir.',
    ],
  },
  {
    title: '4. Qadağan olunan istifadə',
    body: [
      'Xidməti qanunsuz məqsədlərlə, sistemi həddindən artıq yükləməklə və ya digər ' +
        'istifadəçilərə zərər verəcək şəkildə istifadə etmək qadağandır. Bu qaydaların ' +
        'pozulması hesabın bloklanmasına səbəb ola bilər.',
    ],
  },
  {
    title: '5. Məzmun mülkiyyəti',
    body: [
      'Göndərdiyiniz esse mətnlərinin müəllif hüququ sizə məxsus qalır. Bu məzmun yalnız ' +
        'qiymətləndirmə məqsədilə emal olunur.',
    ],
  },
  {
    title: '6. Məsuliyyətin məhdudlaşdırılması',
    body: [
      'Xidmət "olduğu kimi" təqdim olunur. Süni intellektin qiymətləndirməsində xətalar ola ' +
        'bilər, buna görə tətbiqin nəticələrinə əsaslanaraq alınan qərarlara görə məsuliyyət ' +
        'daşımırıq.',
    ],
  },
  {
    title: '7. Xidmətin dəyişdirilməsi',
    body: [
      'Xidməti istənilən vaxt yeniləmək, dəyişdirmək və ya dayandırmaq hüququnu özümüzdə ' +
        'saxlayırıq.',
    ],
  },
  {
    title: '8. Əlaqə',
    body: ['Suallarınız üçün: faigrasulzada@gmail.com'],
  },
];

export default function TermsPage() {
  return (
    <LegalPageLayout title={strings.legal.termsTitle}>
      <p className="text-sm text-[var(--color-text-muted)]">
        EssayCheck AI · Qüvvəyə minmə tarixi: 23 iyul 2026
      </p>
      <p>
        EssayCheck AI tətbiqindən istifadə etməklə aşağıdakı şərtləri qəbul etmiş olursunuz.
      </p>

      <div className="space-y-5">
        {SECTIONS.map(section => (
          <section key={section.title} className="space-y-2">
            <h2 className="text-base">{section.title}</h2>
            {section.body.length > 1 ? (
              <ul className="list-disc space-y-1 pl-5 text-[var(--color-text-muted)]">
                {section.body.map(line => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            ) : (
              <p className="text-[var(--color-text-muted)]">{section.body[0]}</p>
            )}
          </section>
        ))}
      </div>
    </LegalPageLayout>
  );
}
