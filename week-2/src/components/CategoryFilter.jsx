export default function CategoryFilter({
  categories,
  selected,
  onChange,
  products,
}) {
  return (
    <aside className="category-sidebar">
      <h2>Categories</h2>
      <div className="category-options">
        {['All', ...categories].map((category) => (
          <button
            key={category}
            aria-pressed={selected === category}
            onClick={() => onChange(category)}
            className={selected === category ? 'selected' : ''}
          >
            <span>{category === 'All' ? 'All products' : category}</span>
            <span className="category-count">
              {category === 'All'
                ? products.length
                : products.filter((item) => item.category === category).length}
            </span>
          </button>
        ))}
      </div>
      <div className="sidebar-note">
        <span className="small-label">THE FORMA EDIT</span>
        <h3>Less, but better.</h3>
        <p>Useful things. Thoughtful details. Find your everyday favorites.</p>
        <span className="note-line" />
      </div>
    </aside>
  );
}
