import { Moon, Sun } from 'lucide-react';
export default function ThemeToggle({ theme, onToggle }) {
  return (
    <button
      className="icon-button"
      onClick={onToggle}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? <Moon size={19} /> : <Sun size={19} />}
    </button>
  );
}
