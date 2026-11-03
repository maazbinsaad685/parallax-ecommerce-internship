import { Grid2X2, List } from 'lucide-react';
export default function ViewToggle({ value, onChange }) {
  return (
    <div className="view-toggle" role="group" aria-label="Product layout">
      <button
        aria-label="Grid view"
        aria-pressed={value === 'grid'}
        onClick={() => onChange('grid')}
      >
        <Grid2X2 size={18} />
      </button>
      <button
        aria-label="List view"
        aria-pressed={value === 'list'}
        onClick={() => onChange('list')}
      >
        <List size={20} />
      </button>
    </div>
  );
}
