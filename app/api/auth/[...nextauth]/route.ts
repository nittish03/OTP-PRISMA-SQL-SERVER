import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcryptjs from "bcryptjs";
import connectDb from "@/mongoDb/connectDb";
import jwt from 'jsonwebtoken'
import { PrismaAdapter } from "@auth/prisma-adapter";

import { prismaDB } from "@/lib/prismaDB";


export const authoptions = NextAuth({
  adapter: PrismaAdapter(prismaDB),
  providers: [
    CredentialsProvider({
      
      name: "credentials",
      credentials: {
          email: { label: "Email", type: "text" },
          password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Ensure credentials are properly typed
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Enter credentials");
        }

        const user = await prismaDB.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          throw new Error("User not found");
        }

        const passwordMatch = await bcryptjs.compare(
          credentials.password,
          user.hashedPassword || ""
        );

        if (!passwordMatch) {
          throw new Error("Invalid password");
        }

        // Convert `id` to a string if required by NextAuth
        return { ...user, id: user.id.toString() };
      },
      }),    
  GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
],
callbacks: {
  async jwt({ token, user }) {

    if (user) {
      token.id = user.id;
      // token.role = user.role; // Assuming user has a role field
    }
    return token
  },
  async session({ session, token }) {
if(token && session.user){
        // // Add extra fields to the session object
        // session.user.id = token.id;
        // session.user.role = token.role;
        // session.user.some = "something"
}
    return session
  }
},
  session: {
    strategy: "jwt",
  },
  jwt: {
    secret: process.env.NEXTAUTH_JWT_SECRET,
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
});

export { authoptions as GET, authoptions as POST };
