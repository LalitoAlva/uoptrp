// Google Identity Services config. The Client ID is public by design (it
// ships to every browser that loads the app) — it is NOT a secret. Never put
// a Google Client Secret here or anywhere in this codebase: that flow is for
// server-mediated OAuth, which this static app doesn't have, and a secret
// bundled into client code would be visible to anyone who opens devtools.
export const GOOGLE_CLIENT_ID = '734269022415-ipbmetadholbf2n7nl5ukekqmp3geu4k.apps.googleusercontent.com';

const VALID_ISSUERS = ['accounts.google.com', 'https://accounts.google.com'];

/** base64url → string, without the deprecated `escape()` round-trip. */
function decodeBase64Url(segment) {
  const base64 = segment.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder('utf-8').decode(bytes);
}

/**
 * Decodes and sanity-checks the JWT credential Google's Sign-In button
 * returns.
 *
 * IMPORTANT — what this does and does not guarantee: it reads the claims
 * without cryptographically verifying Google's signature. Real verification
 * needs a backend (or fetching and checking Google's JWKS), and this is a
 * static site with no server. So this is NOT an authentication boundary:
 * anyone who can open devtools can also just write to localStorage directly
 * and grant themselves access. Treat the whitelist as "keeps the wrong family
 * member out", not as a security control against a motivated attacker.
 *
 * What the checks below *do* buy, cheaply: a token has to actually be a
 * Google-issued token minted for *this* Client ID and still be valid, so a
 * leftover credential from some other site — or a long-expired one — is
 * rejected instead of being accepted purely because the email matches.
 */
export function decodeGoogleCredential(credential) {
  try {
    if (typeof credential !== 'string') return null;

    const parts = credential.split('.');
    if (parts.length !== 3) return null;

    const payload = JSON.parse(decodeBase64Url(parts[1]));
    if (!payload || typeof payload !== 'object') return null;

    // Audience: the token must have been minted for this app's Client ID.
    if (payload.aud !== GOOGLE_CLIENT_ID) return null;

    // Issuer: must be Google.
    if (!VALID_ISSUERS.includes(payload.iss)) return null;

    // Expiry: `exp` is in seconds. 60s of leeway for clock skew.
    const nowSeconds = Math.floor(Date.now() / 1000);
    if (typeof payload.exp !== 'number' || payload.exp + 60 < nowSeconds) return null;

    if (typeof payload.email !== 'string') return null;

    return payload;
  } catch {
    return null;
  }
}
