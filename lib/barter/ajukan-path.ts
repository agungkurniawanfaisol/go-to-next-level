/** URL kanonik halaman ajukan barter (bukan modal). */
export function barterAjukanPath(listingId: string): string {
  // Route yang memang ada: app/barter/[id]/ajukan/page.tsx
  return `/barter/${listingId}/ajukan`;
}
