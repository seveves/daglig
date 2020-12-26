import Head from 'next/head';
import Link from 'next/link';
import { getSession } from 'next-auth/client';

import styles from '../styles/daglig.module.css';

import { Daglig } from '../models/daglig';
import dbConnect from '../utils/db-connect';
import { ttlExpired } from '../utils/ttl';
import { dagligProps } from '../utils/daglig';

import ProfileHead from '../components/ProfileHead';
import PostListItem from '../components/PostListItem';

const BrowsePage = ({ daglig, ttl, posts }) => {
  const empty = posts.length === 0;
  return (
    <div className="container">
      <Head>
        <title>daglig - browse</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        {!daglig && (
          <div className="centered">
            <Link href="/">
              <a>
                <h1>daglig</h1>
              </a>
            </Link>
            <div className="signin">
              <Link href="/auth/signin">
                <a className="linkbtn invert mwbtn">sign in</a>
              </Link>
            </div>
          </div>
        )}
        <ProfileHead daglig={daglig} ttl={ttl} sessionDaglig={daglig} />
        <h1>browse</h1>
        <ul className={styles.postlist}>
          {posts.map((post) => (
            <PostListItem
              key={post.createdAt}
              post={post}
              owner={post.user.userid === daglig?.userid}
              userId={daglig?.userid}
              dagligId={post.user.id}
            />
          ))}
        </ul>
        {empty && (
          <p>
            <b>no</b> one has <u>written</u> anything <i>yet</i>.
          </p>
        )}
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

  await dbConnect();

  const dagligs = await Daglig.find({});
  if (!dagligs) return redirect;

  const posts = dagligs
    .map((d) => ({ ...dagligProps(d), ttlExpired: ttlExpired(d) }))
    .filter((d) => d.posts.length > 0)
    .map(
      (d) =>
        d.posts.map((p) => ({
          ...p,
          user: {
            id: d.id,
            userid: d.userid,
            username: d.username,
            image: d.image,
            ttlExpired: d.ttlExpired,
          },
        }))[d.posts.length - 1]
    )
    .filter((p) => !p.user.ttlExpired.expired)
    .reduce((p, c) => [...p, c], []);

  posts.sort((a, b) =>
    a.createdAt > b.createdAt ? -1 : a.createdAt < b.createdAt ? 1 : 0
  );

  const session = await getSession(context);
  let daglig = null;
  let sessionTtl = 0;
  if (session) {
    const sDaglig = await Daglig.findOne({ userid: { $eq: session.user.id } });
    const { expired, ttl } = ttlExpired(sDaglig);
    if (expired) {
      await Daglig.findByIdAndDelete(sDaglig._id);
      return redirect;
    }
    daglig = dagligProps(sDaglig);
    sessionTtl = ttl;
  }
  return {
    props: {
      posts,
      daglig,
      ttl: sessionTtl,
    },
  };
}

export default BrowsePage;
