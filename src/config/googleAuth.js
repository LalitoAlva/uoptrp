// Google Identity Services config. The Client ID is public by design (it
// ships to every browser that loads the app) — it is NOT a secret. Never put
// a Google Client Secret here or anywhere in this codebase: that flow is for
// server-mediated OAuth, which this static app doesn't have, and a secret
// bundled into client code would be visible to anyone who opens devtools.
export const GOOGLE_CLIENT_ID = '734269022415-ipbmetadholbf2n7nl5ukekqmp3geu4k.apps.googleusercontent.com';

/**
 * Decodes the JWT credential Google's Sign-In button returns. This reads the
 * claims (email, name, picture, email_verified) without cryptographically
 * verifying Google's signature — real signature verification needs either a
 * backend or fetching Google's public keys, neither of which this static app
 * has. Accepted trade-off for a personal, low-stakes trip planner; anyone
 * determined enough to forge a token already has read/write access to
 * everything in this app's localStorage anyway.
 */
export function decodeGoogleCredential(credential) {
  try {
    const payload = credential.split('.')[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    const json = JSON.parse(decodeURIComponent(escape(decoded)));
    return json;
  } catch {
    return null;
  }
}
