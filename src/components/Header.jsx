import { NavLink, Link } from 'react-router-dom';
import { ShoppingBag, ArrowUpRight } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

export default function Header({ theme, onToggle }) {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <div className="announcement">
        A little more intention. A little better every day.
      </div>
      <header className="header">
        <div className="container header-inner">
          <Link to="/" className="brand" aria-label="Forma home">
            forma<span>®</span>
          </Link>
          <nav aria-label="Main navigation">
            <NavLink to="/" end>
              Shop all
            </NavLink>
            <Link to="/?category=Home">
              For your home <ArrowUpRight size={13} />
            </Link>
          </nav>
          <div className="header-actions">
            <ThemeToggle theme={theme} onToggle={onToggle} />
            <NavLink to="/cart" className="cart-link" aria-label="Shopping bag">
              <ShoppingBag size={20} />
              <span>Bag</span>
            </NavLink>
          </div>
        </div>
      </header>
    </>
  );
}
