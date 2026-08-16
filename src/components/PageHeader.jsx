import React from 'react';

/**
 * The masthead every secondary screen opens with. Having one component here
 * is what keeps US Open, Recomendaciones, Gastos and Guía Pro from each
 * inventing their own heading scale and spacing.
 *
 * `stats` renders as inline pills, `actions` as the button row underneath —
 * both stack cleanly at 375px.
 */
export default function PageHeader({
  eyebrow,
  title,
  description,
  icon: Icon,
  accent = 'var(--accent-primary-text)',
  accentBg = 'var(--accent-primary-soft)',
  stats = [],
  actions,
  children
}) {
  return (
    <header className="spa-banner p-6 sm:p-9 space-y-5">
      <div className="flex items-start gap-4">
        {Icon && (
          <span className="spa-tile-lg flex-shrink-0" style={{ backgroundColor: accentBg, color: accent }}>
            <Icon className="w-6 h-6" />
          </span>
        )}
        <div className="flex-1 min-w-0">
          {eyebrow && <span className="spa-eyebrow">{eyebrow}</span>}
          <h1 className="font-heading font-black text-2xl sm:text-4xl text-[var(--text-primary)] leading-tight mt-1">
            {title}
          </h1>
        </div>
      </div>

      {description && (
        <p className="text-[13px] sm:text-[15px] text-[var(--text-secondary)] leading-relaxed max-w-2xl">
          {description}
        </p>
      )}

      {stats.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {stats.map((stat) => {
            const StatIcon = stat.icon;
            return (
              <span
                key={stat.label}
                className="spa-chip h-9"
                style={stat.color ? { backgroundColor: stat.soft, color: stat.color, borderColor: 'transparent' } : undefined}
              >
                {StatIcon && <StatIcon className="w-3.5 h-3.5" />}
                {stat.label}
                <span className="font-mono opacity-80">{stat.value}</span>
              </span>
            );
          })}
        </div>
      )}

      {actions && <div className="flex flex-wrap gap-2 pt-1">{actions}</div>}

      {children}
    </header>
  );
}
