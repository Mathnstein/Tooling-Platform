'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { name: 'Home', path: '/' },
  { name: 'Active Jobs', path: '/jobs' },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-black/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="font-bold text-xl tracking-tighter text-black dark:text-white">
            Tooling Platform
          </Link>
          <div className="hidden md:flex gap-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`text-sm font-medium transition-colors ${
                  pathname === item.path 
                    ? 'text-black dark:text-white' 
                    : 'text-zinc-500 hover:text-black dark:hover:text-white'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
        
        {/* Auth Placeholder */}
        <div className="flex items-center gap-4">
          <button className="text-sm font-medium px-4 py-2 rounded-full bg-zinc-900 dark:bg-zinc-50 text-white dark:text-black">
            Sign In
          </button>
        </div>
      </div>
    </nav>
  );
}