import {
  Lock,
  Lightbulb,
  CheckCircle2,
  CircleXmark,
  Clock,
  TennisBall,
  Beer,
  Utensils,
  Music,
  Landmark,
  ShoppingBag,
  Plane
} from './icons';

/**
 * Single source of truth for how a stop looks. DayCard, LiveTripCompanion,
 * the itinerary filters and the admin panel all used to keep their own
 * near-identical copies of these maps, which is how they drifted apart
 * visually. Colors are expressed as CSS custom properties so both themes
 * stay in sync automatically.
 */
export const STATUS_CONFIG = {
  pendiente: {
    label: 'Por hacer',
    short: 'Por hacer',
    icon: Clock,
    color: 'var(--text-muted)',
    soft: 'color-mix(in srgb, var(--text-muted) 14%, transparent)',
    solid: 'var(--text-primary)',
    onSolid: 'var(--bg-app)'
  },
  fijo: {
    label: 'Inamovible',
    short: 'Fijo',
    icon: Lock,
    color: 'var(--accent-indigo-text)',
    soft: 'color-mix(in srgb, var(--accent-indigo) 16%, transparent)',
    solid: 'var(--accent-indigo)',
    onSolid: '#fff'
  },
  opcional: {
    label: 'Se puede quitar',
    short: 'Opcional',
    icon: Lightbulb,
    color: 'var(--accent-amber-text)',
    soft: 'color-mix(in srgb, var(--accent-amber) 16%, transparent)',
    solid: 'var(--accent-amber)',
    onSolid: '#fff'
  },
  hecho: {
    label: 'Ya lo hice',
    short: 'Hecho',
    icon: CheckCircle2,
    color: 'var(--accent-emerald-text)',
    soft: 'color-mix(in srgb, var(--accent-emerald) 16%, transparent)',
    solid: 'var(--accent-emerald)',
    onSolid: '#fff'
  },
  no_hecho: {
    label: 'No lo hice',
    short: 'Omitido',
    icon: CircleXmark,
    color: 'var(--accent-rose-text)',
    soft: 'color-mix(in srgb, var(--accent-rose) 16%, transparent)',
    solid: 'var(--accent-rose)',
    onSolid: '#fff'
  }
};

/** The order the status picker renders in — most-used first. */
export const STATUS_ORDER = ['hecho', 'pendiente', 'fijo', 'opcional', 'no_hecho'];

export const CATEGORY_CONFIG = {
  tennis: { label: 'US Open', icon: TennisBall, color: 'var(--accent-tennis-text)', soft: 'color-mix(in srgb, var(--accent-tennis) 16%, transparent)' },
  beer: { label: 'Bares', icon: Beer, color: 'var(--accent-amber-text)', soft: 'color-mix(in srgb, var(--accent-amber) 16%, transparent)' },
  food: { label: 'Comida', icon: Utensils, color: 'var(--accent-emerald-text)', soft: 'color-mix(in srgb, var(--accent-emerald) 16%, transparent)' },
  music: { label: 'Jazz', icon: Music, color: '#C4B5FD', soft: 'rgba(139, 92, 246, 0.16)' },
  culture: { label: 'Paseos', icon: Landmark, color: 'var(--accent-primary-text)', soft: 'var(--accent-primary-soft)' },
  sights: { label: 'Paseos', icon: Landmark, color: 'var(--accent-primary-text)', soft: 'var(--accent-primary-soft)' },
  books: { label: 'Compras', icon: ShoppingBag, color: '#F9A8D4', soft: 'rgba(236, 72, 153, 0.16)' },
  shopping: { label: 'Compras', icon: ShoppingBag, color: '#F9A8D4', soft: 'rgba(236, 72, 153, 0.16)' },
  logistics: { label: 'Logística', icon: Plane, color: 'var(--text-secondary)', soft: 'color-mix(in srgb, var(--text-muted) 16%, transparent)' }
};

export function getCategory(category) {
  return CATEGORY_CONFIG[category] || CATEGORY_CONFIG.logistics;
}

/** Older records only carry `completed`; newer ones carry an explicit status. */
export function getStatus(item) {
  return item?.status || (item?.completed ? 'hecho' : 'pendiente');
}

export function getStatusConfig(item) {
  return STATUS_CONFIG[getStatus(item)] || STATUS_CONFIG.pendiente;
}
