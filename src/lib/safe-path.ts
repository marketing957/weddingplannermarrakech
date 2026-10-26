/** Same-origin relative path only. Blocks `https://…`, `//evil.com`, and `/\evil.com`. */
export function safeInternalPath(value: string | null | undefined, fallback = "/plan"): string {
  if (!value) return fallback;
  let path = value;
  try {
    path = decodeURIComponent(value);
  } catch {
    return fallback;
  }
  if (!path.startsWith("/")) return fallback;
  if (path.startsWith("//") || path.startsWith("/\\")) return fallback;
  if (path.includes("\\") || path.includes("://") || path.includes("@")) return fallback;
  if (/[\u0000-\u001f\u007f]/.test(path)) return fallback;
  return path;
}
