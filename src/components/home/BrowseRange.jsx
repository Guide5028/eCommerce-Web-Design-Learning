import { Row, Col } from 'antd';
import styles from '../../styles/components/home/BrowseRange.module.css';

const RANGES = [
  { image: '/images/category-dining.jpg', alt: 'Dining room table styled with linen and pottery', title: 'Dining' },
  { image: '/images/category-living.jpg', alt: 'Living room armchair with cushions and throw', title: 'Living' },
  { image: '/images/category-bedroom.jpg', alt: 'Bedroom corner with folding screen and plant', title: 'Bedroom' },
];

export default function BrowseRange() {
  return (
    <section className={styles.browseRange}>
      <div className={styles.sectionHeading}>
        <h2>Browse The Range</h2>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
      </div>

      <div className={styles.rangeGrid}>
        <Row gutter={[20, 20]}>
          {RANGES.map((range) => (
            <Col xs={12} md={8} key={range.title}>
              <div className={styles.rangeItem}>
                <img src={range.image} alt={range.alt} />
                <h3>{range.title}</h3>
              </div>
            </Col>
          ))}
        </Row>
      </div>
    </section>
  );
}
