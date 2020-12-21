import Head from 'next/head';
import Link from 'next/link';
import { signOut } from 'next-auth/client';

const SignOutPage = () => {
  return (
    <div className="container">
      <Head>
        <title>daglig - sign out</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="centered">
        <Link href="/">
          <a>
            <h1>daglig</h1>
          </a>
        </Link>
        <p className="welcome">
          do <b>you</b> <u>really</u> want to <i>sign out</i>?
        </p>
        <button
          className="linkbtn invert"
          onClick={() => signOut({ callbackUrl: '/' })}
        >
          sign out
        </button>
      </main>
    </div>
  );
};

export default SignOutPage;
