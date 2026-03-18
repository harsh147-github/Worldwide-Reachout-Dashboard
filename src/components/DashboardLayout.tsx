'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  Mail,
  Radar,
  Settings,
  ChevronLeft,
  ChevronRight,
  Globe2,
  Zap,
  Menu,
  X,
} from 'lucide-react';
import clsx from 'clsx';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, shortcut: 'D' },
  { href: '/contacts', label: 'Contacts', icon: Users, shortcut: 'C' },
  { href: '/pipeline', label: 'Pipeline', icon: Zap, shortcut: 'P' },
  { href: '/messages', label: 'Messages', icon: Mail, shortcut: 'M' },
  { href: '/scout', label: 'AI Scout', icon: Radar, shortcut: 'S' },
  { href: '/settings', label: 'Settings', icon: Settings, shortcut: ',' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed lg:static z-50 h-full flex flex-col border-r border-white/[0.04] bg-bg-secondary transition-all duration-300',
          collapsed ? 'w-[68px]' : 'w-[240px]',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Logo */}
        <div className={clsx(
          'flex items-center gap-3 px-4 h-16 border-b border-white/[0.04]',
          collapsed && 'justify-center'
        )}>
          <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
            <Globe2 className="w-4.5 h-4.5 text-accent" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <h1 className="font-display text-base text-fg-primary leading-tight">Outreach HQ</h1>
              <p className="text-[10px] text-fg-muted tracking-wider uppercase">Worldwide</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 py-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={clsx(
                  'group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 relative',
                  collapsed && 'justify-center px-2',
                  isActive
                    ? 'bg-accent/10 text-accent'
                    : 'text-fg-secondary hover:text-fg-primary hover:bg-white/[0.03]'
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-active"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-accent"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <item.icon className={clsx('flex-shrink-0', collapsed ? 'w-5 h-5' : 'w-[18px] h-[18px]')} />
                {!collapsed && (
                  <>
                    <span className="flex-1 font-medium">{item.label}</span>
                    <kbd className="hidden group-hover:inline-flex items-center justify-center w-5 h-5 rounded text-[10px] text-fg-muted bg-white/[0.04] font-mono">
                      {item.shortcut}
                    </kbd>
                  </>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Collapse toggle */}
        <div className="px-2 py-3 border-t border-white/[0.04]">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex w-full items-center justify-center gap-2 px-3 py-2 rounded-lg text-fg-muted hover:text-fg-secondary hover:bg-white/[0.03] transition-colors text-xs"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            {!collapsed && <span>Collapse</span>}
          </button>

          {/* Profile badge */}
          {!collapsed && (
            <div className="mt-2 px-3 py-2 rounded-lg bg-white/[0.02] flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center text-accent text-xs font-bold">
                HS
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-medium text-fg-primary truncate">Harsh Sonavane</p>
                <p className="text-[10px] text-fg-muted truncate">Aero-Structural Eng.</p>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center gap-3 px-4 h-14 border-b border-white/[0.04] bg-bg-secondary/80 backdrop-blur-xl sticky top-0 z-30">
          <button onClick={() => setMobileOpen(true)} className="p-1.5 rounded-lg hover:bg-white/[0.05]">
            <Menu className="w-5 h-5 text-fg-secondary" />
          </button>
          <h1 className="font-display text-sm">Outreach HQ</h1>
        </div>

        <div className="p-4 md:p-6 lg:p-8 max-w-[1400px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
