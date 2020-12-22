import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { providers, signIn, getSession } from 'next-auth/client';
import { Daglig } from '../../models/daglig';
import dbConnect from '../../utils/db-connect';
import styles from '../../styles/signin.module.css';

const SignInPage = ({ providers }) => {
  return (
    <div className="container">
      <Head>
        <title>daglig - sign in</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.signin}>
        <Link href="/">
          <a>
            <h1>daglig</h1>
          </a>
        </Link>
        <p className="welcome">sign in to daglig with one of the following options. we are <b>only</b> using your <u>profile identifier</u> and <i>username</i>.</p>
        {Object.values(providers).map((provider) => (
          <div key={provider.name}>
            <button
              className={'linkbtn invert ' + styles.providerbtn}
              onClick={() => signIn(provider.id)}
            >
              <div className="d-flex align-items-center">
                <Image
                  src={`/${provider.name.toLowerCase()}.svg`}
                  alt={`sign in with ${provider.name}`}
                  width="32"
                  height="32"
                  title={provider.name}
                />
                <span className={styles.providername}>
                  sign in with {provider.name}
                </span>
              </div>
            </button>
          </div>
        ))}
      </main>
    </div>
  );
};

export async function getServerSideProps(context) {
  const props = {
    props: {
      providers: await providers(context),
    },
  };
  const session = await getSession(context);
  if (!session) {
    return props;
  };
  
  await dbConnect();
  const daglig = await Daglig.findOne({ userid: { $eq: session.user.id } });
  if (!daglig) {
    return props;
  };

  return {
    redirect: {
      destination: `/${daglig.username}`,
      permament: false,
    },
  };
}

export default SignInPage;
