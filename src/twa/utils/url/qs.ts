/**
 * Converts passed query string to JSON object with keys and values.
 *
 * @param qs - query string.
 */
export function parseQueryString(qs: string): Record<string, unknown> {
  const query = new URLSearchParams(qs);
  const result: Record<string, unknown> = {};

  query.forEach((value, name) => {
    // Try parsing as integer.
    const int = parseInt(value);
    if (!Number.isNaN(int)) {
      result[name] = int
      return;
    }

    // Try parsing as bool.
    if (value === 'true' || value === 'false') {
      result[name] = value === 'true'
      return;
    }

    // Try parsing as JSON;
    if (
      (value.startsWith('[') && value.endsWith(']')) ||
      (value.startsWith('{') && value.endsWith('}'))
    ) {
      try {
        result[name] = JSON.parse(value);
        return
      } catch (e) {
      }
    }

    // Otherwise, usual string is presented.
    result[name] = value;
  });

  return result;
}

/**
 * Returns true in case, passed value contains query string in its default
 * representation (after question sign) or inside hash part.
 *
 * Valid values:
 * https://game.com/#hash=1
 * https://game.com/#?hash=4
 * https://game.com/#path?query
 *
 * @param text - text to check. Should be any URL or its part.
 */
export function containsQueryString(text: string): boolean {
  return text.match(/[=?]/) !== null;
}