import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { fetchDeleteJSON } from '../utils/fetch';

import styles from '../styles/favorite-list-item.module.css';

const FavoriteListItem = ({ favorite, removed }) => {
  const [loading, setLoading] = useState(false);

  const removeFavorite = async (e, favoriteId) => {
    setLoading(true);
    if (confirm('Really delete this favorite?')) {
      const res = await fetchDeleteJSON(`/api/favorites/${favoriteId}`);
      if (res.statusCode === 201) {
        removed(favoriteId);
      }
    }
    setLoading(false);
  };

  return (
    <li className={styles.favoritelistitem}>
      <Link href={`/${favorite.dagligUserName}`}>
        <a className={styles.favoriteitem}>{favorite.dagligUserName}</a>
      </Link>
      <button
        type="button"
        className={styles.deletebutton}
        disabled={loading}
        onClick={(e) => removeFavorite(e, favorite.id)}
      >
        <Image
          src="/trash.svg"
          alt="remove favorite"
          width="16"
          height="16"
          title="remove favorite"
        />
      </button>
    </li>
  );
};

export default FavoriteListItem;
