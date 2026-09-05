# EssayCheck AI — Veb Tətbiq

İngilis dili esselərini süni intellektlə DİM tərzli meyarlarla qiymətləndirən platformanın
veb (React) tərəfi. Mövcud .NET 8 backend API-si ilə işləyir — backend dəyişikliyi tələb olunmur.

## Başlanğıc

```bash
npm install
npm run dev        # http://localhost:5173
```

`.env` faylı:

```bash
VITE_API_BASE_URL=https://essaycheck-api.onrender.com
```

## Skriptlər

| Əmr | Təsvir |
|---|---|
| `npm run dev` | İnkişaf serveri |
| `npm run build` | TypeScript yoxlaması + production build (`dist/`) |
| `npm run preview` | Build nəticəsini yerli işə salır |
| `npm run typecheck` | Yalnız tip yoxlaması |
| `npm run lint` | oxlint (qat sərhədləri daxil) |
| `npm run format` | Prettier |

## Arxitektura

Qatlar bir istiqamətli asılılıqla düzülüb; sərhədlər `.oxlintrc.json`-dakı
`no-restricted-imports` qaydaları ilə **məcburidir** (səhv import lint xətası verir).

```
src/
├── domain/      # Saf biznes modeli: tiplər, qaydalar, xətalar, portlar (interfeyslər).
│                # HEÇ BİR qatdan asılı deyil.
├── data/        # Portların implementasiyası: axios HTTP klienti, DTO-lar, mapper-lər,
│                # repository-lər, token saxlama, ödəniş provayderi, DI konteyneri.
├── features/    # Use-case qatı: TanStack Query hook-ları, feature komponentləri, auth store.
│                # Yalnız @/domain interfeyslərini tanıyır (DIP).
├── pages/       # Marşrut səviyyəli səhifələr (yalnız features + shared işlədir).
├── app/         # Kompozisiya kökü: provayderlər, router, layout.
└── shared/      # UI kitabxanası (shadcn primitivləri), konfiq, i18n mətnləri, köməkçilər, DI konteksti.
```

**Əsas prinsiplər**

- **DIP:** `axios` və `localStorage` yalnız `data/` qatında mövcuddur; yuxarı qatlar
  `domain/ports`-dakı interfeysləri görür. Test üçün saxta implementasiya vermək kifayətdir
  (`ServicesProvider`).
- **SRP:** `AxiosHttpClient` yalnız nəqliyyat + 401 refresh; `errorMapper` yalnız xəta çevirməsi;
  repository-lər yalnız endpoint + mapper; komponentlər yalnız render.
- **OCP:** dərs slaydları `slideRegistry.ts` xəritəsi ilə həll olunur (yeni slayd növü =
  bir sətir); ödəniş provayderi `PaymentProvider` interfeysi arxasındadır (AzeriCard hazır
  olanda yalnız `data/payment/` dəyişir).
- **Vahid xəta modeli:** bütün HTTP xətaları `AppError`-a çevrilir (`code`), UI status kodu ilə
  deyil, semantik kodla mesaj seçir (`shared/lib/errorMessage.ts`).
- **Mətnlər:** bütün UI mətnləri `shared/i18n/strings.ts`-dədir, komponentdə hardcoded mətn yoxdur.

## Backend ilə bağlı vacib qaydalar

- **Grade9** esseləri həmişə `POST /api/essay/evaluate/grade9-images` (multipart) endpoint-inə gedir;
  adi `/evaluate` `Grade9` üçün 400 qaytarır.
- **OCR** (`/api/essay/ocr`) gündəlik sayğacı artırmır; bir sorğu = bir şəkil, ona görə çox səhifəli
  esse üçün sorğular ardıcıl göndərilir və mətnlər birləşdirilir.
- **Analitikada** `average` yox, `percent` işlədilir (Content-in maksimumu 2.0-dır).
- **Dərslər ortaq kitabxanadır:** silmə endpoint-i yoxdur, test variantları yenidən qarışdırılmır,
  slaydların sırası dəyişdirilmir.
- **Abunəlik:** `POST /api/subscription/subscribe` backend-dən çıxarılıb; veb-də kartla ödəniş
  hələ yoxdur (`paymentProvider.availability === 'coming-soon'`).
- **Token axını:** access token yaddaşda, refresh token `localStorage`-da; hər refresh yeni cüt
  qaytarır və köhnəsi ləğv olunur.

## Deploy

Statik hosting (Vercel / Netlify / Cloudflare Pages):

```bash
npm run build   # → dist/
```

SPA yönləndirmələri hazırdır: `vercel.json` (Vercel) və `public/_redirects` (Netlify).
Backend-də CORS bütün mənşələrə açıqdır, əlavə konfiqurasiya tələb olunmur.

## Görüləcəklər

- Hüquqi səhifələrin (`/privacy`, `/terms`) yekun mətni əlavə olunmalıdır.
- Backend-də `App:ResetPasswordUrl` bu saytın `/reset-password` səhifəsinə yönləndirilməlidir.
- AzeriCard inteqrasiyası hazır olanda `src/data/payment/` yenilənir (UI toxunulmur).
