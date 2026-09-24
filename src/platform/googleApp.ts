export function isGoogleAppBrowser() {
  return /\bGSA\//i.test(navigator.userAgent)
}
