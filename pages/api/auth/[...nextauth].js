import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';

import Daglig from '../../../models/daglig';
import dbConnect from '../../../utils/db-connect';

const options = {
  providers: [
    Providers.GitHub({
      clientId: process.env.DAGLIG_GITHUB_ID,
      clientSecret: process.env.DAGLIG_GITHUB_SECRET,
    }),
    Providers.Twitter({
      clientId: process.env.DAGLIG_TWITTER_API_KEY,
      clientSecret: process.env.DAGLIG_TWIITER_SECRET_KEY,
    })
  ],
  secret: process.env.DAGLIG_AUTH_SECRET,
  session: {
    jwt: true,
    maxAge: 2 * 24 * 60 * 60, // 2 days
    updateAge: 24 * 60 * 60 // 24 hours
  },
  jwt: {
    secret: process.env.DAGLIG_JWT_SECRET,
  },
  callbacks: {
    session: async (session, user) => {
      session.user.id = user.userid;
      return Promise.resolve(session);
    },
    jwt: async (token, user, account, profile, isNewUser) => {
      const isSignIn = !!user;
      if (isSignIn) {
        const isGithub = account.provider === 'github';
        const prefix = isGithub ? 'gh_' : 'tw_';
        console.log(profile);
        const userid = `${prefix}${profile.id}`;
        token.userid = userid;

        await dbConnect();
        const exists = await Daglig.findOne({ userid: { $eq: userid } });
        if (!exists) {
          let username = isGithub ? profile.login : profile.screen_name;
          const nameExists = await Daglig.findOne({ username: { $eq: username }});
          if (nameExists) {
            username = `${username}_`;
          }
          const daglig = new Daglig({
            username,
            userid: userid,
            image: user.image,
            posts: [],
          });
          await daglig.save();
        }
      }
      return Promise.resolve(token);
    },
  },
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
  },
};

export default (req, res) => NextAuth(req, res, options);
