import {containsQueryString} from './qs';

interface HashParsed {
  /**
   * Pathname.
   */
  path: string;
  /**
   * Query params.
   */
  query: URLSearchParams;
}

/**
 * Converts passed URL to its full form.
 * TODO: Maybe, there is a bit easier way? window.open will accept
 *  unformatted URL too, probably.
 * @param url - URL to format.
 * @throws {Error} URL protocol is not supported by OS, or link has not allowed
 * protocol.
 * @private
 */
export function formatURL(url: string): string {
  // We do create new anchor element and assign its href to passed URL. This
  // will format link, so it could be used in `window.open`.
  const anchor = document.createElement('a');
  anchor.href = url;

  // Check if protocol is correct.
  if (anchor.protocol !== 'http:' && anchor.protocol !== 'https:') {
    throw Error(
      'URL protocol is not supported by OS, or link has not allowed ' +
      `protocol: ${anchor.protocol}`
    );
  }
  return anchor.href;
}

/**
 * Parses passed url (usually presented only as hash) as usual URL.
 * @param location - URL which could have hashtag at the beginning.
 * @return Returns URL with parsed query.
 */
export function parseHash(location: string): HashParsed {
  // Leave only hash part.
  const hashIndex = location.indexOf('#');
  const hash = hashIndex === -1 ? location : location.slice(hashIndex + 1);

  let path: string;
  let query: URLSearchParams;

  // In case, we detected query string, we should determine, what exactly
  // was found - path with query params, or query params only.
  if (containsQueryString(hash)) {
    // Detect previous query string part.
    const qIndex = hash.indexOf('?');

    // Question sign was found. So, the path is everything before it, query
    // params - after.
    if (qIndex >= 0) {
      path = hash.slice(0, qIndex);
      query = new URLSearchParams(hash.slice(qIndex + 1));
    } else {
      path = '';
      query = new URLSearchParams(hash);
    }
  } else {
    path = hash;
    query = new URLSearchParams();
  }

  return {path, query};
}
