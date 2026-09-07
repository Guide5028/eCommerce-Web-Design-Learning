import { Row, Col, Flex } from 'antd';
import categoryDining from '../assets/images/category-dining.jpg';
import categoryLiving from '../assets/images/category-living.jpg';
import categoryBedroom from '../assets/images/category-bedroom.jpg';
import styles from '../styles/components/BrowseRange.module.css';

const RANGES = [
  { image: categoryDining, alt: 'Dining room table styled with linen and pottery', title: 'Dining' },
  { image: categoryLiving, alt: 'Living room armchair with cushions and throw', title: 'Living' },
  { image: categoryBedroom, alt: 'Bedroom corner with folding screen and plant', title: 'Bedroom' },
];

export default function BrowseRange() {
  return (
    <Flex vertical justify="center" align="center" component="section" className={styles.browseRange}>
      <div className={styles.sectionHeading}>
        <h2>Browse The Range</h2>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
      </div>

      <div className={styles.rangeGrid}>
        <Row gutter={[20, 20]}>
          {RANGES.map((range) => (
            <Col xs={12} md={8} key={range.title}>
              <Flex vertical align="center" className={styles.rangeItem}>
                <img src={range.image} alt={range.alt} />
                <h3>{range.title}</h3>
              </Flex>
            </Col>
          ))}
        </Row>
      </div>
    </Flex>
  );
}
