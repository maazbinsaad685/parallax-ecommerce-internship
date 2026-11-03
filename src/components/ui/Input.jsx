import { useId } from 'react';

export default function Input({ label, id, className = '', ...props }) {
  const generatedId = useId();
  const inputId = id || generatedId;
  return (
    <div className={`field ${className}`}>
      <label htmlFor={inputId}>{label}</label>
      <input id={inputId} {...props} />
    </div>
  );
}
