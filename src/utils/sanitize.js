import DOMPurify from 'dompurify';

// Guide content (day tips, extraCards) is authored with a few inline HTML
// tags for emphasis (<strong>, <em>). That content can also arrive via a
// JSON backup a user imports through ImportExportModal — so before it goes
// into dangerouslySetInnerHTML, strip everything except that small
// formatting whitelist. Prevents a tampered/shared backup from smuggling
// in a <script>/<img onerror> and running in the victim's browser.
const ALLOWED_TAGS = ['strong', 'em', 'b', 'i', 'br'];

export function sanitizeRichText(html) {
  if (typeof html !== 'string') return '';
  return DOMPurify.sanitize(html, { ALLOWED_TAGS, ALLOWED_ATTR: [] });
}

// mapsUrl (activities, recommendations) is free text that can arrive via
// JSON restore or bulk CSV import — both explicitly designed to accept
// files from elsewhere (another device, a shared spreadsheet). Rendered
// straight into an <a href>, a `javascript:` value there executes in the
// app's origin the moment someone clicks "Google Maps", with full access to
// everything in localStorage. Only allow real http(s) links through.
const SAFE_URL_PROTOCOLS = ['http:', 'https:'];

export function sanitizeUrl(url) {
  if (typeof url !== 'string' || !url.trim()) return null;
  try {
    const parsed = new URL(url, window.location.origin);
    if (!SAFE_URL_PROTOCOLS.includes(parsed.protocol)) return null;
    // Return the *parsed* URL rather than the original string: otherwise the
    // value we validated and the value we hand to href are two different
    // strings, and anything the URL parser normalised away (stray control
    // characters, tabs and newlines inside the scheme, whitespace) would
    // reach the DOM unchecked. Returning `href` guarantees the browser gets
    // exactly the URL that passed the protocol check.
    return parsed.href;
  } catch {
    return null;
  }
}
