/**
 * Pure deterministic word splitter for text animations.
 * Keeps word order, trims extra whitespace, preserves punctuation,
 * and caps at 12 chunks (remainder stays in the last chunk).
 */
export function splitWords(text: string, maxWords = 12): string[] {
  if (!text) return [];
  const trimmed = text.trim();
  if (!trimmed) return [];

  const words = trimmed.split(/\s+/);
  if (words.length <= maxWords) {
    return words;
  }

  const result = words.slice(0, maxWords - 1);
  const remainder = words.slice(maxWords - 1).join(' ');
  result.push(remainder);
  return result;
}
