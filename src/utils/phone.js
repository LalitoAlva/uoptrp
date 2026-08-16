/**
 * Phone numbers, stored as country code + national number.
 *
 * Kept as two fields rather than one string on purpose: the whole reason
 * these exist is to be dialled *from the United States*, where a Mexican
 * number only works with its `+52` prefix. Storing "55 1234 5678" and hoping
 * someone remembers the code at the moment they need it is exactly the
 * failure this is meant to prevent.
 */

/** Country codes worth offering, most relevant to this trip first. */
export const COUNTRY_CODES = [
  { code: '+52', label: 'México' },
  { code: '+1', label: 'EE. UU. / Canadá' },
  { code: '+34', label: 'España' },
  { code: '+54', label: 'Argentina' },
  { code: '+55', label: 'Brasil' },
  { code: '+56', label: 'Chile' },
  { code: '+57', label: 'Colombia' },
  { code: '+51', label: 'Perú' },
  { code: '+58', label: 'Venezuela' },
  { code: '+506', label: 'Costa Rica' },
  { code: '+502', label: 'Guatemala' },
  { code: '+33', label: 'Francia' },
  { code: '+39', label: 'Italia' },
  { code: '+44', label: 'Reino Unido' },
  { code: '+49', label: 'Alemania' }
];

export const DEFAULT_COUNTRY_CODE = '+52';

/** An empty phone, so callers never have to null-check the shape. */
export const emptyPhone = () => ({ code: DEFAULT_COUNTRY_CODE, number: '' });

/**
 * Coerces anything stored into `{ code, number }`.
 *
 * Also migrates the old single-string `phone` field: a legacy value like
 * "+52 55 1234 5678" gets split back into its parts by matching the longest
 * known code, so upgrading doesn't silently drop numbers people already saved.
 */
export function normalisePhone(value) {
  if (!value) return emptyPhone();

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return emptyPhone();

    // Longest code first, so +506 wins over +50 / +5.
    const match = [...COUNTRY_CODES]
      .sort((a, b) => b.code.length - a.code.length)
      .find(c => trimmed.startsWith(c.code));

    if (match) {
      return { code: match.code, number: trimmed.slice(match.code.length).trim() };
    }
    return { code: DEFAULT_COUNTRY_CODE, number: trimmed };
  }

  if (typeof value === 'object') {
    const code = typeof value.code === 'string' && value.code.trim() ? value.code.trim() : DEFAULT_COUNTRY_CODE;
    const number = typeof value.number === 'string' ? value.number.trim() : '';
    return { code, number };
  }

  return emptyPhone();
}

export function hasPhone(phone) {
  return Boolean(normalisePhone(phone).number);
}

/** "+52 55 1234 5678" — for reading on screen. */
export function formatPhone(phone) {
  const { code, number } = normalisePhone(phone);
  return number ? `${code} ${number}` : '';
}

/**
 * `tel:` value — digits and a single leading `+` only.
 *
 * Dialers choke on spaces, dashes and parentheses, so everything that isn't
 * a digit is stripped after the code is prepended.
 */
export function telHref(phone) {
  const { code, number } = normalisePhone(phone);
  if (!number) return null;
  const digits = `${code}${number}`.replace(/[^\d+]/g, '');
  return `tel:${digits}`;
}

/** Both phones a person can have, always in this order. */
export const PHONE_KINDS = [
  { key: 'mobile', label: 'Móvil' },
  { key: 'home', label: 'Casa' }
];

/** Coerces the whole `{ mobile, home }` bag. */
export function normalisePhones(phones, legacyPhone) {
  const source = phones && typeof phones === 'object' ? phones : {};
  return {
    // A pre-existing single `phone` string becomes the mobile, which is what
    // it always meant in practice.
    mobile: normalisePhone(source.mobile ?? legacyPhone),
    home: normalisePhone(source.home)
  };
}
