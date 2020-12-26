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

const DagligPage = ({ daglig, ttl, owner, sessionDaglig }) => {
  const empty = daglig.posts.length === 0;
  return (
    <div className="container">
      <Head>
        <title>daglig - {daglig.username}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <ProfileHead daglig={daglig} ttl={ttl} sessionDaglig={sessionDaglig} />
        <ul className={styles.postlist}>
          {daglig.posts.map((post) => (
            <PostListItem
              key={post.createdAt}
              post={post}
              owner={owner}
              userId={sessionDaglig?.userid}
              dagligId={daglig?.id}
            />
          ))}
        </ul>
        {empty && owner && (
          <div className={styles.firstpost}>
            <Link href="/write-post">
              <a>
                <span className={'linkbtn ' + styles.postbtn}>post</span>
              </a>
            </Link>
          </div>
        )}
        {empty && !owner && <p>this profile is still empty.</p>}
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

  const name = context.params?.id;
  if (!name) return redirect;

  await dbConnect();
  const daglig = await Daglig.findOne({ username: { $eq: name } });
  if (!daglig) return redirect;

  const { expired, ttl } = ttlExpired(daglig);
  if (expired) {
    await Daglig.findByIdAndDelete(daglig._id);
    return redirect;
  }
  const session = await getSession(context);
  let sessionDaglig = null;
  if (session) {
    const sDaglig = await Daglig.findOne({ userid: { $eq: session.user.id } });
    sessionDaglig = dagligProps(sDaglig);
  }
  return {
    props: {
      ttl,
      daglig: dagligProps(daglig),
      owner: session ? session.user.id === daglig.userid : false,
      sessionDaglig,
    },
  };
}

export default DagligPage;
