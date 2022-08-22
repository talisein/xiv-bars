/* eslint-disable jsx-a11y/anchor-is-valid */

import Link from 'next/link';
import UserNav from 'components/UserNav';
import styles from './GlobalHeader.module.scss';

export function GlobalHeader() {
  return (
    <div className={styles.container}>
      <Link href="/">
        <a className={styles.branding}>
          <div className={styles.logo}>
            <img
              src="/icons/favicon-96x96.png"
              alt="XIVBARS Logo"
              height={24}
              width={24}
            />
          </div>
          <div className={styles.title}>XIVBARS</div>
        </a>
      </Link>

      <UserNav />
    </div>
  );
}

export default GlobalHeader;