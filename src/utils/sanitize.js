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
