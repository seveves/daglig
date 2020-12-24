import Head from 'next/head';
import { useState } from 'react';
import { getSession } from 'next-auth/client';

import { Daglig } from '../models/daglig';
import dbConnect from '../utils/db-connect';
import { ttlExpired } from '../utils/ttl';
import { dagligProps } from '../utils/daglig';

import ProfileHead from '../components/ProfileHead';
import FavoriteListItem from '../components/FavoriteListItem';

import styles from '../styles/favorites.module.css';

const FavoritesPage = ({ daglig, ttl, sessionDaglig }) => {
  const [favorites, setFavorites] = useState(daglig.favorites);

  const onRemoved = (id) => {
    setFavorites(favorites.filter((f) => f.id !== id));
  };

  return (
    <div className="container">
      <Head>
        <title>daglig - {daglig.username} - favorites</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <ProfileHead daglig={daglig} ttl={ttl} sessionDaglig={sessionDaglig} />
        <h1>favorites</h1>
        <ul className={styles.favoriteslist}>
          {favorites.map((f) => (
            <FavoriteListItem key={f.id} favorite={f} removed={onRemoved} />
          ))}
        </ul>
        {favorites.length === 0 && <p><b>you</b> have <u>no</u> starred diaries <i>at the moment</i>. </p>}
      </main>
    </div>
  );
};

export async function getServerSideProps(context) {
  const redirect = {
    redirect: {
      destination: '/',
      permament: false,
    },
  };

  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: '/api/auth/signin',
        permament: false,
      },
    };
  }
  await dbConnect();
  const userid = session.user.id;
  const daglig = await Daglig.findOne({ userid: { $eq: userid } });
  if (!daglig) return redirect;

  const { expired, ttl } = ttlExpired(new Date(), daglig);
  if (expired) {
    await Daglig.findByIdAndDelete(daglig._id);
    return redirect;
  }

  let sessionDaglig = null;
  if (session) {
    const sDaglig = await Daglig.findOne({ userid: { $eq: session.user.id } });
    sessionDaglig = dagligProps(sDaglig);
  }

  return {
    props: {
      ttl,
      daglig: dagligProps(daglig),
      sessionDaglig,
    },
  };
}

export default FavoritesPage;
