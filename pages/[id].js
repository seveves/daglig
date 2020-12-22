import Head from 'next/head';
import Link from 'next/link';
import { getSession } from 'next-auth/client';
import insane from 'insane';
import marked from 'marked';
import prettyms from 'pretty-ms';

import styles from '../styles/daglig.module.css';

import Daglig from '../models/daglig';
import dbConnect from '../utils/db-connect';
import { ttlExpired } from '../utils/ttl';
import { dagligBack, dagligProps } from '../utils/daglig';

import ProfileHead from '../components/ProfileHead';
import LikeDisplay from '../components/LikeDisplay';

const DagligPage = ({ daglig, ttl, owner, back, userId }) => {
  const empty = daglig.posts.length == 0;
  const prettycreated = (t) => prettyms(Date.now() - t, { compact: true });
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
            <li key={post.createdAt}>
              <article
                className={styles.message}
                dangerouslySetInnerHTML={{
                  __html: insane(marked(post.message, { gfm: true }), {
                    allowedTags: [
                      'h1',
                      'p',
                      'u',
                      'em',
                      'strong',
                      'code',
                      'pre',
                    ],
                  }),
                }}
              ></article>
              <div className={styles.messageactions}>
                <div className={styles.created}>
                  about {prettycreated(post.createdAt)} ago
                </div>
                <div className={styles.likes}>
                  <LikeDisplay
                    likes={post.likes}
                    owner={owner}
                    postId={post.id}
                    dagligId={daglig.id}
                    userId={userId}
                  />
                </div>
              </div>
            </li>
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
