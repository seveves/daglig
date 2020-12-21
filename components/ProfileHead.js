import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import styles from '../styles/profile-head.module.css';

const ProfileHead = ({ daglig, ttl, back, owner }) => {
  const [more, setMore] = useState(false);

  const toggleMore = () => {
    setMore(!more);
  };

  const empty = daglig?.posts?.length === 0;

  return (
    <div className={styles.profile}>
      <Link href={back}>
        <a>
          <img src={daglig.image} alt="Profile Image" />
        </a>
      </Link>
      <div className={styles.profiledetails}>
        <div className={styles.profileinfo}>
          <Link href={`/${daglig.username}`}>
            <a>
              <h1>{daglig.username}</h1>
            </a>
          </Link>
          <h2>{ttl}</h2>
        </div>
        {owner && (
          <button className={styles.more} onClick={toggleMore}>
            <Image
              src="/three-dots-vertical.svg"
              alt="show profile actions"
              width="32"
              height="32"
              title="show profile actions"
            />
          </button>
        )}
      </div>
      {more && owner && (
        <div className={styles.moremenu}>
          <Link href="/write-post">
            <a className={styles.moreaction}>post</a>
          </Link>
          <Link href="/api/auth/signout">
            <a className={styles.moreaction + ' ' + styles.signout}>sign out</a>
          </Link>
        </div>
      )}
    </div>
  );
};

export default ProfileHead;
