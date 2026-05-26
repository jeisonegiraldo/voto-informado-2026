'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const navItems = [
  { href: '/comparar', label: 'Comparar' },
  { href: '/candidatos', label: 'Candidatos' },
  { href: '/quiz', label: 'Quiz de afinidad' },
  { href: '/noticias', label: 'Noticias' },
  { href: '/metodologia', label: 'Metodología' },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight">
            Voto<span className="text-blue-600">Informado</span>
          </span>
          <span className="hidden rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800 sm:inline">
            2026
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
            >
              {item.label}
            </Link>
          ))}
          <Link href="/quiz">
            <Button size="sm" className="ml-2">
              Hacer el Quiz
            </Button>
          </Link>
        </nav>

        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menú"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {mobileOpen && (
        <nav className="border-t bg-white px-4 pb-4 md:hidden">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="block rounded-lg px-3 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
            >
              {item.label}
            </Link>
          ))}
          <Link href="/quiz" onClick={() => setMobileOpen(false)}>
            <Button className="mt-2 w-full">Hacer el Quiz</Button>
          </Link>
        </nav>
      )}
    </header>
  );
}
