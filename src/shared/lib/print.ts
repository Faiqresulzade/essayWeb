/**
 * PDF ixracı çap dialoqu ilə həyata keçirilir (§14.3 A variantı):
 * əlavə asılılıq yoxdur, mətn seçilə bilən qalır, Azərbaycan hərfləri düzgün çıxır.
 * `.no-print` sinifli elementlər çapda gizlənir (bax `src/index.css`).
 */
export function printCurrentPage(): void {
  window.print();
}
