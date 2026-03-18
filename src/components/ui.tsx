'use client';

import { ReactNode, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2 } from 'lucide-react';
import clsx from 'clsx';
import type { ContactStatus, PriorityLevel, Region } from '@/types';

// ============================================================
// STAT CARD (with animated counter)
// ============================================================

export function StatCard({
  label,
  value,
  subtitle,
  icon,
  accent = false,
  delay = 0,
}: {
  label: string;
  value: number;
  subtitle?: string;
  icon?: ReactNode;
  accent?: boolean;
  delay?: number;
}) {
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    const duration = 1200;
    const start = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setDisplayed(Math.round(eased * value));
      if (progress < 1) requestAnimationFrame(step);
    };
    const timer = setTimeout(() => requestAnimationFrame(step), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay / 1000, duration: 0.4 }}
      className={clsx(
        'relative overflow-hidden rounded-xl border p-5 transition-colors',
        accent
          ? 'border-accent/20 bg-accent/[0.04]'
          : 'border-white/[0.04] bg-bg-secondary hover:border-white/[0.08]'
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-fg-muted uppercase tracking-wider">{label}</p>
          <p className={clsx('text-3xl font-display mt-1', accent ? 'text-accent' : 'text-fg-primary')}>
            {displayed}
          </p>
          {subtitle && <p className="text-xs text-fg-muted mt-1">{subtitle}</p>}
        </div>
        {icon && (
          <div className={clsx('p-2 rounded-lg', accent ? 'bg-accent/10 text-accent' : 'bg-white/[0.04] text-fg-muted')}>
            {icon}
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ============================================================
// STATUS BADGE
// ============================================================

export function StatusBadge({ status }: { status: ContactStatus }) {
  return (
    <span className={clsx('inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium', `status-${status}`)}>
      {status.replace(/_/g, ' ')}
    </span>
  );
}

// ============================================================
// PRIORITY BADGE
// ============================================================

const PRIORITY_COLORS: Record<PriorityLevel, string> = {
  critical: 'bg-red-500/20 text-red-400',
  high: 'bg-amber-500/20 text-amber-400',
  medium: 'bg-blue-500/20 text-blue-400',
  low: 'bg-gray-500/20 text-gray-400',
};

export function PriorityBadge({ priority }: { priority: PriorityLevel }) {
  return (
    <span className={clsx('inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium', PRIORITY_COLORS[priority])}>
      {priority}
    </span>
  );
}

// ============================================================
// REGION BADGE
// ============================================================

const REGION_COLORS: Record<string, string> = {
  japan: 'bg-orange-500/20 text-orange-400',
  europe_west: 'bg-blue-500/20 text-blue-400',
  europe_north: 'bg-sky-500/20 text-sky-400',
  europe_central: 'bg-indigo-500/20 text-indigo-400',
  north_america: 'bg-purple-500/20 text-purple-400',
  uk: 'bg-emerald-500/20 text-emerald-400',
  australia_nz: 'bg-yellow-500/20 text-yellow-400',
  south_korea: 'bg-cyan-500/20 text-cyan-400',
  singapore: 'bg-teal-500/20 text-teal-400',
  middle_east: 'bg-pink-500/20 text-pink-400',
  south_america: 'bg-lime-500/20 text-lime-400',
};

const REGION_FLAGS: Record<string, string> = {
  japan: '🇯🇵', europe_west: '🇪🇺', europe_north: '🇸🇪', europe_central: '🇩🇪',
  north_america: '🇺🇸', uk: '🇬🇧', australia_nz: '🇦🇺', south_korea: '🇰🇷',
  singapore: '🇸🇬', middle_east: '🇦🇪', south_america: '🇧🇷', other: '🌍',
};

export function RegionBadge({ region }: { region: Region | string }) {
  return (
    <span className={clsx('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium', REGION_COLORS[region] || 'bg-gray-500/20 text-gray-400')}>
      {REGION_FLAGS[region] || '🌍'} {region.replace(/_/g, ' ')}
    </span>
  );
}

// ============================================================
// BUTTON
// ============================================================

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className,
  ...props
}: {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const variants = {
    primary: 'bg-accent hover:bg-accent-hover text-white shadow-lg shadow-accent/10',
    secondary: 'bg-white/[0.06] hover:bg-white/[0.1] text-fg-primary border border-white/[0.08]',
    ghost: 'hover:bg-white/[0.04] text-fg-secondary hover:text-fg-primary',
    danger: 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20',
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-6 py-2.5 text-sm gap-2',
  };

  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
      {children}
    </button>
  );
}

// ============================================================
// MODAL
// ============================================================

export function Modal({
  open,
  onClose,
  title,
  children,
  maxWidth = 'max-w-lg',
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  maxWidth?: string;
}) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className={clsx(
              'relative w-full rounded-2xl border border-white/[0.06] bg-bg-secondary shadow-2xl overflow-hidden',
              maxWidth
            )}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.04]">
              <h2 className="font-display text-lg">{title}</h2>
              <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/[0.05] text-fg-muted hover:text-fg-secondary transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="px-6 py-5 max-h-[70vh] overflow-y-auto">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// ============================================================
// INPUT / SELECT
// ============================================================

export function Input({
  label,
  className,
  ...props
}: { label?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className={className}>
      {label && <label className="block text-xs font-medium text-fg-muted mb-1.5">{label}</label>}
      <input
        className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-sm text-fg-primary placeholder:text-fg-muted/50 focus:outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/20 transition-colors"
        {...props}
      />
    </div>
  );
}

export function Select({
  label,
  options,
  className,
  ...props
}: {
  label?: string;
  options: { value: string; label: string }[];
} & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className={className}>
      {label && <label className="block text-xs font-medium text-fg-muted mb-1.5">{label}</label>}
      <select
        className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-sm text-fg-primary focus:outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/20 transition-colors appearance-none"
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-bg-secondary">
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

// ============================================================
// EMPTY STATE
// ============================================================

export function EmptyState({ icon, title, description, action }: {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="p-4 rounded-2xl bg-white/[0.03] text-fg-muted mb-4">{icon}</div>
      <h3 className="font-display text-lg text-fg-primary mb-1">{title}</h3>
      <p className="text-sm text-fg-muted max-w-md">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

// ============================================================
// REGION DISTRIBUTION BAR
// ============================================================

export function RegionBar({ data }: { data: Record<string, number> }) {
  const total = Object.values(data).reduce((s, v) => s + v, 0);
  if (!total) return null;

  const BAR_COLORS: Record<string, string> = {
    japan: '#E85D3A', europe_west: '#3B82F6', europe_north: '#38BDF8', europe_central: '#6366F1',
    north_america: '#8B5CF6', uk: '#10B981', australia_nz: '#F59E0B', south_korea: '#06B6D4',
    singapore: '#14B8A6', middle_east: '#EC4899', south_america: '#84CC16',
  };

  return (
    <div className="space-y-3">
      <div className="flex h-3 rounded-full overflow-hidden bg-white/[0.04]">
        {Object.entries(data)
          .sort(([, a], [, b]) => b - a)
          .map(([region, count]) => (
            <div
              key={region}
              style={{ width: `${(count / total) * 100}%`, backgroundColor: BAR_COLORS[region] || '#6B7280' }}
              className="transition-all duration-500"
              title={`${region}: ${count}`}
            />
          ))}
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1">
        {Object.entries(data)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 6)
          .map(([region, count]) => (
            <div key={region} className="flex items-center gap-1.5 text-[11px] text-fg-muted">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: BAR_COLORS[region] || '#6B7280' }} />
              <span>{REGION_FLAGS[region]} {count}</span>
            </div>
          ))}
      </div>
    </div>
  );
}
