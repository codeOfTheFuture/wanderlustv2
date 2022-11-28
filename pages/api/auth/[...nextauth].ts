import NextAuth, { NextAuthOptions } from "next-auth";
import { connectToDatabase } from "../../../lib/mongodb";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import FacebookProvider from "next-auth/providers/facebook";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { User } from "../../../types/typings";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  adapter: MongoDBAdapter(
    (async () => {
      const { client } = await connectToDatabase();
      return client;
    })(),
    {}
  ),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      type: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { db } = await connectToDatabase();

        const user = (await db
          .collection("users")
          .findOne({ email: credentials?.email })) as User;

        if (!user) {
          throw new Error("Email incorrect");
        }

        const checkPassword = await compare(
          credentials?.password as string,
          user.password as string
        );

        if (!checkPassword) {
          throw new Error("Password incorrect");
        }

        return JSON.parse(JSON.stringify(user));
      },
    }),

    FacebookProvider({
      clientId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID as string,
      clientSecret: process.env.NEXT_PUBLIC_FACEBOOK_APP_SECRET as string,
    }),
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_APP_ID as string,
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_APP_SECRET as string,
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    newUser: "/auth/signup",
  },

  callbacks: {
    async signIn({ user }: any) {
      if (user.signedInBefore == null) {
        user.profileImage = {
          secure_url: user.image,
        };
        user.streetAddress = null;
        user.city = null;
        user.state = null;
        user.zipCode = null;
        user.phoneNumber = null;
        user.registerAsGuide = false;
        user.favoriteTours = [];
        user.bookedTours = [];
        user.messages = [];
        user.signedInBefore = true;
      }
      return true;
    },
    async jwt({ token, account, profile }: any) {
      if (account) {
        token.accessToken = account.access_token;
        token.id = profile?.id;
      }
      return token;
    },
    async session({ session }) {
      return session;
    },
  },

  secret: process.env.NEXT_PUBLIC_AUTH_SECRET as string,
};

export default NextAuth(authOptions);
