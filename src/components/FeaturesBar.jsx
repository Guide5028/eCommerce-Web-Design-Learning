import { Row, Col, Flex, theme } from 'antd';
import iconTrophy from '../assets/images/icon/trophy.jpg';
import iconGuarantee from '../assets/images/icon/guarantee.jpg';
import iconShipping from '../assets/images/icon/shipping.jpg';
import iconSupport from '../assets/images/icon/customer-support.jpg';
import styles from '../styles/components/FeaturesBar.module.css';

const FEATURES = [
  { icon: iconTrophy, alt: 'Trophy icon', title: 'High Quality', subtitle: 'crafted from top materials' },
  { icon: iconGuarantee, alt: 'Warranty shield icon', title: 'Warranty Protection', subtitle: 'Over 2 years' },
  { icon: iconShipping, alt: 'Shipping icon', title: 'Free Shipping', subtitle: 'Order over 150 $' },
  { icon: iconSupport, alt: 'Support headset icon', title: '24 / 7 Support', subtitle: 'Dedicated support' },
];

// The 4-icon "High Quality / Warranty / Shipping / Support" strip reused across pages.
export default function FeaturesBar() {
  const { token } = theme.useToken();

  return (
    <section className={styles.featuresBar}>
      <Row gutter={[24, 32]}>
        {FEATURES.map((feature) => (
          <Col xs={24} sm={12} md={6} key={feature.title}>
            <Flex align="center" justify="center" gap={20} className={styles.featureItem}>
              <img className={styles.featureIcon} src={feature.icon} alt={feature.alt} width="40" height="40" />
              <div className="feature-text">
                <h3 className={styles.featureTitle} style={{ color: token.colorText }}>{feature.title}</h3>
                <p className={styles.featureSubtitle}>{feature.subtitle}</p>
              </div>
            </Flex>
          </Col>
        ))}
      </Row>
    </section>
  );
}
