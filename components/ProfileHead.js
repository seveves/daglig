import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import styles from '../styles/profile-head.module.css';
import prettyms from 'pretty-ms';
import { ONE_DAY_IN_MS } from '../utils/ttl';

import Visitor from './Visitor';

const ProfileHead = ({ daglig, ttl, sessionDaglig }) => {
  const [more, setMore] = useState(false);

  const toggleMore = () => {
    setMore(!more);
  };

  const prettyttl = prettyms(ttl);
  const prettycreated = prettyms(Date.now() - daglig.createdAt, {
    compact: true,
  });
  const left = Math.round(((ONE_DAY_IN_MS - ttl) / ONE_DAY_IN_MS) * 100);
  const grayscale = {
    WebkitFilter: `grayscale(${left}%)`,
    filter: `grayscale(${left}%)`,
  };

  const owner = sessionDaglig && sessionDaglig.id === daglig.id;

  return (
    <>
      <Visitor daglig={daglig} sessionDaglig={sessionDaglig} />
      <div className={styles.profile}>
        <Link href={`/${daglig.username}`}>
          <a>
            <img style={grayscale} src={daglig.image} alt="Profile Image" />
          </a>
        </Link>
        <div className={styles.profiledetails}>
          <div className={styles.profileinfo}>
            <Link href={`/${daglig.username}`}>
              <a>
                <h1>{daglig.username}</h1>
              </a>
            </Link>
            <div className={styles.profilesub}>
              <h2>{prettyttl} left</h2>
              <h2>created {prettycreated} ago</h2>
            </div>
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
            <Link href="/favorites">
              <a className={styles.moreaction}>favorites</a>
            </Link>
            <Link href="/api/auth/signout">
              <a className={styles.moreaction + ' ' + styles.signout}>
                sign out
              </a>
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default ProfileHead;
