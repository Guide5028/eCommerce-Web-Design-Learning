const RANGES = [
  { image: '/images/category-dining.jpg', alt: 'Dining room table styled with linen and pottery', title: 'Dining' },
  { image: '/images/category-living.jpg', alt: 'Living room armchair with cushions and throw', title: 'Living' },
  { image: '/images/category-bedroom.jpg', alt: 'Bedroom corner with folding screen and plant', title: 'Bedroom' },
];

export default function BrowseRange() {
  return (
    <section className="browse-range">
      <div className="section-heading">
        <h2>Browse The Range</h2>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
      </div>

      <div className="range-grid">
        {RANGES.map((range) => (
          <div className="range-item" key={range.title}>
            <img src={range.image} alt={range.alt} />
            <h3>{range.title}</h3>
          </div>
        ))}
      </div>
    </section>
  );
}
