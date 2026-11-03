import { Outlet, Link, useLocation } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import Header from '../components/Header';
import { useTheme } from '../hooks/useTheme';

export default function StoreLayout() {
  const { theme, toggleTheme } = useTheme();
  const { pathname } = useLocation();
  const previousPath = useRef(pathname);
  useEffect(() => {
    if (previousPath.current !== pathname) {
      window.scrollTo(0, 0);
      document.getElementById('main')?.focus();
      previousPath.current = pathname;
    }
  }, [pathname]);
  return (
    <>
      <Header theme={theme} onToggle={toggleTheme} />
      <main id="main" tabIndex={-1}>
        <Outlet />
      </main>
      <footer className="footer">
        <div className="container footer-inner">
          <div>
            <Link className="brand" to="/">
              forma<span>®</span>
            </Link>
            <p>Everyday, considered.</p>
          </div>
          <p>A curated collection for a life well lived.</p>
          <span>© {new Date().getFullYear()} Forma · Demo storefront</span>
        </div>
      </footer>
    </>
  );
}
