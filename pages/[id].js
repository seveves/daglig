import Head from 'next/head';
import Link from 'next/link';
import { getSession } from 'next-auth/client';

import styles from '../styles/daglig.module.css';

import { Daglig } from '../models/daglig';
import dbConnect from '../utils/db-connect';
import { ttlExpired } from '../utils/ttl';
import { dagligBack, dagligProps } from '../utils/daglig';

import ProfileHead from '../components/ProfileHead';
import PostListItem from '../components/PostListItem';

const DagligPage = ({ daglig, ttl, owner, back, userId }) => {
  const empty = daglig.posts.length == 0;
  return (
    <div className="container">
      <Head>
        <title>daglig - {daglig.username}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <ProfileHead daglig={daglig} ttl={ttl} back={back} />
        <ul className={styles.postlist}>
          {daglig.posts.map((post) => (
            <PostListItem
              key={post.createdAt}
              post={post}
              owner={owner}
              userId={userId}
              daglig={daglig}
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
            <p>you have {prettyttl} left to create your first post.</p>
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

  const { expired, ttl } = ttlExpired(daglig.posts, daglig.createdAt);
  if (expired) {
    await Daglig.findByIdAndDelete(daglig._id);
    return redirect;
  }
  const session = await getSession(context);
  return {
    props: {
      ttl,
      daglig: dagligProps(daglig),
      back: dagligBack(session, daglig),
      userId: session?.user?.id || null,
      owner: session ? session.user.id === daglig.userid : false,
    },
  };
}

export default DagligPage;
