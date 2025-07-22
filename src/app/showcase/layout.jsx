import Link from 'next/link';
import styles from './layout.module.scss';

export default function ShowcaseLayout({ children }) {
  return (
    <div className={styles.layout}>
      <nav className={styles.layout__nav}>
        <Link href="/" className={styles.layout__backLink}>
          ← Back to Home
        </Link>
      </nav>
      {children}
    </div>
  );
}