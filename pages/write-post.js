import Head from 'next/head';
import { getSession } from 'next-auth/client';

import Daglig from '../models/daglig';
import dbConnect from '../utils/db-connect';
import ProfileHead from '../components/ProfileHead';
import WritePostForm from '../components/WritePostForm';
import { ttlExpired } from '../utils/ttl';

const WritePostPage = ({ daglig, ttl, back }) => {
  return (
    <div className="container">
      <Head>
        <title>daglig - {daglig.username} - write post</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <ProfileHead daglig={daglig} ttl={ttl} back={back} />
        <WritePostForm daglig={daglig} />
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

  const { expired, ttl } = ttlExpired(daglig.posts, daglig.createdAt);
  if (expired) {
    await Daglig.findByIdAndDelete(daglig._id);
    return redirect;
  }

  return {
    props: {
      daglig: {
        id: `${daglig._id}`,
        username: daglig.username,
        userid: daglig.userid,
        image: daglig.image,
        posts: daglig.posts
          .map((p) => ({
            createdAt: p.createdAt.getTime(),
            message: p.message,
            likes: p.likes.map((l) => `${l}`),
          }))
          .reverse(),
        createdAt: daglig.createdAt.getTime(),
      },
      ttl,
      back: session
        ? session.user.id !== daglig.userid
          ? session.user.name
          : false
        : false,
    },
  };
}

export default WritePostPage;
