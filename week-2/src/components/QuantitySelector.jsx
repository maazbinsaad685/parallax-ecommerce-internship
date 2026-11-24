import Button from './ui/Button';
export default function QuantitySelector({
  value,
  max,
  onChange,
  label = 'Quantity',
}) {
  return (
    <div className="quantity-control" role="group" aria-label={label}>
      <Button
        variant="secondary"
        aria-label={`Decrease ${label}`}
        disabled={value <= 1}
        onClick={() => onChange(value - 1)}
      >
        −
      </Button>
      <output aria-label={label}>{value}</output>
      <Button
        variant="secondary"
        aria-label={`Increase ${label}`}
        disabled={value >= max}
        onClick={() => onChange(value + 1)}
      >
        +
      </Button>
    </div>
  );
}
