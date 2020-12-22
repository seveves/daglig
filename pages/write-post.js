import Head from 'next/head';
import { getSession } from 'next-auth/client';

import { Daglig } from '../models/daglig';
import dbConnect from '../utils/db-connect';
import { ttlExpired } from '../utils/ttl';
import { dagligBack, dagligProps } from '../utils/daglig';

import ProfileHead from '../components/ProfileHead';
import WritePostForm from '../components/WritePostForm';

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
      ttl,
      daglig: dagligProps(daglig),
      back: dagligBack(session, daglig),
    },
  };
}

export default WritePostPage;
