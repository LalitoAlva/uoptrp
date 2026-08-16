import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

/**
 * Content-Security-Policy for the built app.
 *
 * Defence in depth for a client-side app that renders content it did not
 * author: imported CSV/JSON backups, the user-editable reminder text, and
 * guide HTML that goes through DOMPurify.
 *
 * Why each directive is what it is:
 *  · script-src has NO 'unsafe-inline'. The service-worker registration was
 *    moved out to /register-sw.js precisely so that injected <script> markup
 *    stays inoperative.
 *  · style-src does need 'unsafe-inline': the UI themes itself with inline
 *    `style` attributes, and Tailwind and SweetAlert2 inject <style> at runtime.
 *  · accounts.google.com covers Google Identity Services (its script + iframe).
 *  · connect-src is 'self' plus Google — nothing else in this app talks to a
 *    network endpoint, and the geolocation feature deliberately keeps
 *    coordinates on-device. Anything new has to be added here on purpose.
 *  · object-src 'none', base-uri 'self' and form-action 'none' close the
 *    classic post-injection moves: plugin embeds, hijacking every relative
 *    URL via an injected <base>, and exfiltrating via an injected <form>.
 */
const CSP = [
  "default-src 'self'",
  "script-src 'self' https://accounts.google.com https://apis.google.com",
  // accounts.google.com is needed here too: the Sign-In button pulls
  // https://accounts.google.com/gsi/style, and without it the button renders unstyled.
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://accounts.google.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data: blob: https:",
  "connect-src 'self' https://accounts.google.com",
  "frame-src https://accounts.google.com",
  "worker-src 'self'",
  "manifest-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'none'"
].join('; ');

/**
 * Injects the CSP as a <meta> tag, but only for production builds.
 *
 * It must not apply in dev: Vite's React Fast Refresh preamble is an inline
 * script, which this policy would (correctly) block, breaking the dev server.
 * In production the same policy is also sent as a real HTTP header from
 * render.yaml — headers take precedence and are the only place directives
 * like frame-ancestors actually work; this meta tag is the fallback for hosts
 * that serve the static build without custom headers.
 */
function cspPlugin() {
  return {
    name: 'inject-csp-meta',
    apply: 'build',
    transformIndexHtml(html) {
      return html.replace(
        '<meta name="referrer"',
        `<meta http-equiv="Content-Security-Policy" content="${CSP}" />\n    <meta name="referrer"`
      );
    }
  };
}

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    cspPlugin()
  ],
  server: {
    port: 3000,
    host: true
  }
});
