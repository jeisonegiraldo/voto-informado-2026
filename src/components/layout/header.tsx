'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const navItems = [
  { href: '/resumen', label: 'Resumen' },
  { href: '/comparar', label: 'Comparar' },
  { href: '/brujula', label: 'Brújula' },
  { href: '/quiz', label: 'Quiz' },
  { href: '/verificador', label: 'Verificador' },
  { href: '/buscar', label: 'Buscar' },
  { href: '/chat', label: 'Chat IA' },
  { href: '/buzon', label: 'Buzón' },
  { href: '/noticias', label: 'Noticias' },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-lg">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:h-16">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-extrabold tracking-tight text-gray-900">
            Voto<span className="text-teal-600">Informado</span>
          </span>
          <span className="hidden rounded-md bg-teal-50 px-2 py-0.5 text-[11px] font-bold text-teal-700 sm:inline">
            2026
          </span>
        </Link>

        <nav className="hidden items-center gap-0.5 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-1.5 text-[13px] font-medium text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-900"
            >
              {item.label}
            </Link>
          ))}
          <Link href="/quiz" className="ml-2">
            <Button
              size="sm"
              className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-sm transition-all hover:brightness-110"
            >
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
        <nav className="border-t border-gray-100 bg-white px-4 pb-4 md:hidden">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="block rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
            >
              {item.label}
            </Link>
          ))}
          <Link href="/quiz" onClick={() => setMobileOpen(false)}>
            <Button className="mt-2 w-full bg-gradient-to-r from-teal-500 to-emerald-500 text-white">
              Hacer el Quiz
            </Button>
          </Link>
        </nav>
      )}
    </header>
  );
}
