import NextAuth, { CredentialsSignin, User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { SERVER_BASE } from "./app/constants";
import { AdapterUser } from "next-auth/adapters";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        username: {},
        password: {},
      },
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      authorize: async (credentials, req) => {
        let res;

        try {
          res = await fetch(`${SERVER_BASE}/auth/login`, {
            method: "POST",
            body: JSON.stringify(credentials),
            headers: {
              "Content-Type": "application/json",
            },
          });
        } catch (err) {
          throw new CredentialsSignin({ cause: "Something went wrong", err });
        }

        const resData = await res.json();

        if (res.ok && resData && resData?.token) {
          return {
            email: resData?.user?.email,
            name: resData?.user?.username,
            id: resData?.user?._id?.toString(),
          };
        } else {
          throw new CredentialsSignin({ cause: "Invalid Credentials" });
        }
      },
    }),
  ],
  pages: {
    signIn: "/",
    signOut: "/",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ session, user }) {
      return { ...session, ...user };
    },
    async session({ session, token }) {
      session.user = token as unknown as AdapterUser & User;
      return session;
    },
    authorized: async ({ auth }) => {
      return !!auth;
    },
  },
});
