import { Row, Col } from 'antd';
import styles from '../../styles/components/layout/FeaturesBar.module.css';

const FEATURES = [
  { icon: '/images/icon/trophy.jpg', alt: 'Trophy icon', title: 'High Quality', subtitle: 'crafted from top materials' },
  { icon: '/images/icon/guarantee.jpg', alt: 'Warranty shield icon', title: 'Warranty Protection', subtitle: 'Over 2 years' },
  { icon: '/images/icon/shipping.jpg', alt: 'Shipping icon', title: 'Free Shipping', subtitle: 'Order over 150 $' },
  { icon: '/images/icon/customer-support.jpg', alt: 'Support headset icon', title: '24 / 7 Support', subtitle: 'Dedicated support' },
];

// The grid itself (4 -> 2 -> 1 columns as the screen shrinks) is AntD's Row/Col,
// using their built-in responsive breakpoints instead of 3 hand-written CSS
// media-query blocks. Only the item's own look (.featureItem etc.) stays custom CSS.
export default function FeaturesBar() {
  return (
    <section className={styles.featuresBar}>
      <Row gutter={[24, 32]}>
        {FEATURES.map((feature) => (
          <Col xs={24} sm={12} md={6} key={feature.title}>
            <div className={styles.featureItem}>
              <img className={styles.featureIcon} src={feature.icon} alt={feature.alt} width="40" height="40" />
              <div className="feature-text">
                <h3 className={styles.featureTitle}>{feature.title}</h3>
                <p className={styles.featureSubtitle}>{feature.subtitle}</p>
              </div>
            </div>
          </Col>
        ))}
      </Row>
    </section>
  );
}
