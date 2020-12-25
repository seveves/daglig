import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { fetchPostJSON } from '../utils/fetch';

import styles from '../styles/visitor.module.css';

const Visitor = ({ daglig, sessionDaglig }) => {
  if (!sessionDaglig || sessionDaglig.id === daglig.id) {
    return null;
  }

  const [loading, setLoading] = useState(false);
  const [favorite, setFavorite] = useState(
    sessionDaglig.favorites.some((f) => f.dagligId === daglig.id)
  );

  const toggleFavorite = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetchPostJSON('/api/favorites', {
      dagligId: daglig.id,
      dagligUserName: daglig.username,
    });
    if (res.statusCode === 201) {
      setFavorite(!favorite);
    }
    setLoading(false);
  };

  return (
    <div className={styles.visitor}>
      <Link href={`/${sessionDaglig.username}`}>
        <a className={styles.profilelink}>
          <Image
            src="/caret-left-fill.svg"
            alt="show profile actions"
            width="16"
            height="16"
            title="back to profile"
          />
          <span>back to {sessionDaglig.username}</span>
        </a>
      </Link>
      <button
        type="button"
        className={styles.favorite}
        onClick={toggleFavorite}
        disabled={loading}
      >
        <Image
          src={favorite ? '/star-fill.svg' : '/star.svg'}
          alt="toggle favorite"
          width="16"
          height="16"
          title="toggle favorite"
        />
      </button>
    </div>
  );
};

export default Visitor;
