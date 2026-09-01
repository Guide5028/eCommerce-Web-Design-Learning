import { Link } from 'react-router-dom';
import styles from './PageHero.module.css';

// The identical "small logo + title + breadcrumb" banner that Cart, Checkout,
// Favorite, Login, About, and Contact all used to duplicate (markup AND CSS).
export default function PageHero({ title }) {
  return (
    <section className={styles.pageHero}>
      <div className={styles.pageHeroContent}>
        <img src="/images/logo-furniro.svg" alt="" className={styles.pageHeroIcon} />
        <h1>{title}</h1>
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span className="breadcrumb-sep">&rsaquo;</span>
          <span aria-current="page">{title}</span>
        </nav>
      </div>
    </section>
  );
}
