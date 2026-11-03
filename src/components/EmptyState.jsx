import { SearchX } from 'lucide-react';
import Button from './ui/Button';
export default function EmptyState({ title, message, action, onAction }) {
  return (
    <div className="empty-state">
      <SearchX size={30} aria-hidden="true" />
      <h2>{title}</h2>
      <p>{message}</p>
      {action && (
        <Button variant="secondary" onClick={onAction}>
          {action}
        </Button>
      )}
    </div>
  );
}
