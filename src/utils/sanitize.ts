/** Strip HTML tags, limit length, trim whitespace. */
export function sanitizeContact(raw: string): string {
  return raw
    .replace(/<[^>]*>/g, "")   // strip tags
    .replace(/[<>"'`]/g, "")   // strip dangerous chars
    .trim()
    .slice(0, 120);
}
