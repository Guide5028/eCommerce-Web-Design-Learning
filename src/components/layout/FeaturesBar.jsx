const FEATURES = [
  { icon: '/images/icon/trophy.jpg', alt: 'Trophy icon', title: 'High Quality', subtitle: 'crafted from top materials' },
  { icon: '/images/icon/guarantee.jpg', alt: 'Warranty shield icon', title: 'Warranty Protection', subtitle: 'Over 2 years' },
  { icon: '/images/icon/shipping.jpg', alt: 'Shipping icon', title: 'Free Shipping', subtitle: 'Order over 150 $' },
  { icon: '/images/icon/customer-support.jpg', alt: 'Support headset icon', title: '24 / 7 Support', subtitle: 'Dedicated support' },
];

export default function FeaturesBar() {
  return (
    <section className="features-bar">
      {FEATURES.map((feature) => (
        <div className="feature-item" key={feature.title}>
          <img className="feature-icon" src={feature.icon} alt={feature.alt} width="40" height="40" />
          <div className="feature-text">
            <h3 className="feature-title">{feature.title}</h3>
            <p className="feature-subtitle">{feature.subtitle}</p>
          </div>
        </div>
      ))}
    </section>
  );
}
