import { Link } from 'react-router-dom';
import logoFurniro from '../assets/images/logo-furniro.svg';
import styles from '../styles/components/PageHero.module.css';

// Shared "small logo + title + breadcrumb" banner used at the top of most pages.
export default function PageHero({ title }) {
  return (
    <section className={styles.pageHero}>
      <div className={styles.pageHeroContent}>
        <img src={logoFurniro} alt="" className={styles.pageHeroIcon} />
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
