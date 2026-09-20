'use client';

import React, { useEffect, useState, useRef, Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';


function NavbarContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category');
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);

  const isDetailPage =
    pathname.startsWith('/opportunities/') && pathname !== '/opportunities';

  useEffect(() => {
    if (!isDetailPage) {
      setHidden(false);
      return;
    }

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      // Hide when scrolling down past 120px, show when scrolling up
      if (currentScrollY > lastScrollY.current && currentScrollY > 120) {
        setHidden(true);
        document.documentElement.setAttribute('data-header-hidden', '');
      } else {
        setHidden(false);
        document.documentElement.removeAttribute('data-header-hidden');
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isDetailPage]);

  // Do not render public navbar on admin routes
  if (pathname.startsWith('/admin')) {
    return null;
  }

  const navItems = [
    { label: 'Home', href: '/', exact: true },
    { label: 'Scholarships', href: '/category/scholarships' },
    { label: 'Internships', href: '/category/internships' },
    { label: 'Fellowships', href: '/category/fellowships' },
    { label: 'Online Courses', href: '/category/courses' },
    { label: 'Others', href: '/category/others' },
  ];

  return (
    <header
      className={`header ${hidden ? 'header--hidden' : ''}`}
    >
      <div className="container header-content">
        <Link href="/" className="logo-link">
          <img
            src="/logo-oppmaps.png"
            alt="opportunitiesmap."
            className="logo-img"
          />
        </Link>

        <nav className="header-nav">
          <ul className="nav-links">
            {navItems.map((item) => {
              const isActive = item.exact 
                ? pathname === item.href 
                : pathname.startsWith(item.href);
              
              return (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className={`nav-link ${isActive ? 'active' : ''}`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="header-actions">
          <Link
            href="/opportunities"
            className="btn-icon"
            title="Buscar convocatorias"
            aria-label="Buscar convocatorias"
          >
            <Search size={18} />
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Navbar() {
  return (
    <Suspense fallback={<div className="header-placeholder" />}>
      <NavbarContent />
    </Suspense>
  );
}
