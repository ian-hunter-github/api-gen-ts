/**
 * Generates a random UUID v4 string
 * @returns {string} A RFC4122-compliant UUID string
 */
export function generateUUID(): string {
  return crypto.randomUUID();
}
