import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface RouteMeta {
  title: string;
  description: string;
}

const ROUTE_METADATA: Record<string, RouteMeta> = {
  '/': {
    title: 'Kok Sen Restaurant (國成餐室) · Michelin Bib Gourmand Cantonese Zi Char',
    description: 'Iconic third-generation Cantonese Zi Char at 4 Keong Saik Road, Singapore. Famed for Big Prawn Hor Fun, Claypot Yong Tau Foo, Har Cheong Gai, and roaring wok hei since 1968.',
  },
  '/menu': {
    title: 'Parchment Menu & Dishes · Kok Sen Restaurant (國成餐室)',
    description: 'Browse the complete 125-listing Cantonese zi char menu with authentic Chinese names, size options, and direct online ordering on Oddle.',
  },
  '/our-story': {
    title: 'Our Story & 50-Year Wok Hei Heritage · Kok Sen Restaurant (國成餐室)',
    description: 'Founded in 1968 in Chinatown. Discover three generations of culinary heritage, our legendary 3-hour prawn broth, and consecutive Michelin Bib Gourmand awards (2016–2026).',
  },
  '/gallery': {
    title: 'Visual Archive & Photo Gallery · Kok Sen Restaurant (國成餐室)',
    description: 'Authentic archival photos of our Keong Saik shophouse, roaring woks, bubbling claypots, and verified diner plates.',
  },
  '/visit': {
    title: 'Visit Us · Keong Saik Road & City Square Mall · Kok Sen Restaurant',
    description: 'Find addresses, opening hours, MRT walking directions, parking information, and live Google Maps for both Kok Sen outlets.',
  },
  '/reservations': {
    title: 'Table Reservations & Enquiries · Kok Sen Restaurant (國成餐室)',
    description: 'Reserve a table or submit an enquiry via mainline WhatsApp for Keong Saik Road or City Square Mall. Walk-ins always welcome.',
  },
  '/delivery': {
    title: 'Islandwide Delivery & Takeaway · Kok Sen Restaurant (國成餐室)',
    description: 'Enjoy piping-hot Cantonese zi char at home. Thermal separation packaging, distance zone guide, and direct WhatsApp takeaway ordering.',
  },
};

interface NavigationContextType {
  currentPath: string;
  searchParams: URLSearchParams;
  navigate: (to: string, options?: { replace?: boolean; scrollToTop?: boolean }) => void;
  setSearchParam: (key: string, value: string | null) => void;
}

const NavigationContext = createContext<NavigationContextType | null>(null);

function normalizePath(pathname: string): string {
  if (!pathname || pathname === '') return '/';
  // Remove trailing slash if length > 1
  if (pathname.length > 1 && pathname.endsWith('/')) {
    return pathname.slice(0, -1);
  }
  return pathname;
}

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return normalizePath(window.location.pathname);
  });
  const [searchParams, setSearchParams] = useState<URLSearchParams>(() => {
    return new URLSearchParams(window.location.search);
  });

  // Update SEO Title and Description
  const updateMeta = useCallback((path: string) => {
    const meta = ROUTE_METADATA[path] || {
      title: 'Kok Sen Restaurant (國成餐室) · Singapore Zi Char',
      description: 'Michelin Bib Gourmand Cantonese Zi Char restaurant in Keong Saik Road, Singapore.',
    };

    document.title = meta.title;

    let descEl = document.querySelector('meta[name="description"]');
    if (!descEl) {
      descEl = document.createElement('meta');
      descEl.setAttribute('name', 'description');
      document.head.appendChild(descEl);
    }
    descEl.setAttribute('content', meta.description);

    let ogTitleEl = document.querySelector('meta[property="og:title"]');
    if (ogTitleEl) ogTitleEl.setAttribute('content', meta.title);

    let ogDescEl = document.querySelector('meta[property="og:description"]');
    if (ogDescEl) ogDescEl.setAttribute('content', meta.description);
  }, []);

  useEffect(() => {
    updateMeta(currentPath);
  }, [currentPath, updateMeta]);

  // Handle browser Back and Forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const path = normalizePath(window.location.pathname);
      setCurrentPath(path);
      setSearchParams(new URLSearchParams(window.location.search));
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = useCallback((to: string, options?: { replace?: boolean; scrollToTop?: boolean }) => {
    const [pathPart, queryPart] = to.split('?');
    const targetPath = normalizePath(pathPart || '/');
    const newSearch = queryPart ? `?${queryPart}` : '';
    const fullUrl = `${targetPath}${newSearch}`;

    if (options?.replace) {
      window.history.replaceState({}, '', fullUrl);
    } else {
      window.history.pushState({}, '', fullUrl);
    }

    setCurrentPath(targetPath);
    setSearchParams(new URLSearchParams(newSearch));

    if (options?.scrollToTop !== false) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const setSearchParam = useCallback((key: string, value: string | null) => {
    const params = new URLSearchParams(window.location.search);
    if (value === null || value === '') {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    const newSearchStr = params.toString() ? `?${params.toString()}` : '';
    const fullUrl = `${currentPath}${newSearchStr}`;
    window.history.replaceState({}, '', fullUrl);
    setSearchParams(params);
  }, [currentPath]);

  return (
    <NavigationContext.Provider value={{ currentPath, searchParams, navigate, setSearchParam }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
}

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  className?: string;
  children: React.ReactNode;
  activeClassName?: string;
  replace?: boolean;
}

export function Link({ href, className = '', activeClassName = '', children, replace = false, onClick, ...rest }: LinkProps) {
  const { currentPath, navigate } = useNavigation();
  const [targetPath] = href.split('?');
  const isActive = currentPath === normalizePath(targetPath);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) onClick(e);
    // Let browser handle new tab or modified clicks
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) {
      return;
    }
    e.preventDefault();
    navigate(href, { replace, scrollToTop: true });
  };

  const combinedClass = `${className} ${isActive ? activeClassName : ''}`.trim();

  return (
    <a
      href={href}
      onClick={handleClick}
      className={combinedClass}
      aria-current={isActive ? 'page' : undefined}
      {...rest}
    >
      {children}
    </a>
  );
}
