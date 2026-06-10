/** Pannellum tidak bisa memuat `data:` URL via XHR — perlu blob: atau http(s). */
export async function dataUrlToBlobUrl(dataUrl: string): Promise<string> {
  const response = await fetch(dataUrl);
  const blob = await response.blob();
  return URL.createObjectURL(blob);
}

export function revokeBlobUrl(url: string | null): void {
  if (url?.startsWith("blob:")) {
    URL.revokeObjectURL(url);
  }
}
