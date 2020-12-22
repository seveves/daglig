import Head from 'next/head';
import Link from 'next/link';
import { getSession } from 'next-auth/client';
import dbConnect from '../utils/db-connect';
import { Daglig } from '../models/daglig';

const IndexPage = () => {
  return (
    <div className="container">
      <Head>
        <title>daglig</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="centered">
        <h1>daglig</h1>
        <p className="welcome">welcome to daglig. a <b>diary</b> where you <u>have</u> to write at least one post a day. if not the whole diary will be <i>deleted</i>.
        but <b>every like</b> of your <u>latest post</u> will give you <i>one more minute</i> of extra lifetime.</p>
        <Link href="/auth/signin">
          <a className="linkbtn invert">sign in</a>
        </Link>
      </main>
    </div>
  );
};

export async function getServerSideProps(context) {
  const redirect = {
    redirect: {
      destination: '/auth/signin',
      permament: false,
    },
  };
  const session = await getSession(context);
  if (!session)
    return {
      props: {},
    };

  await dbConnect();
  const daglig = await Daglig.findOne({ userid: { $eq: session.user.id } });
  if (!daglig) return redirect;

  return {
    redirect: {
      destination: `/${daglig.username}`,
      permament: false,
    },
  };
}

export default IndexPage;
