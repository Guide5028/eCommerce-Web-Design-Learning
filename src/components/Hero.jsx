import { Link } from 'react-router-dom';
import { Flex } from 'antd';
import styles from '../styles/components/Hero.module.css';

export default function Hero() {
  return (
    <Flex align="center" component="section" className={styles.hero}>
      <div className={styles.heroContent}>
        <span>New Arrival</span>
        <h1>Discover Our New Collection</h1>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis.</p>
        <Link to="/shop" className="btn btn-buy">BUY NOW</Link>
      </div>
    </Flex>
  );
}
