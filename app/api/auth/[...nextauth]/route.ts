import NextAuth, { NextAuthOptions, Account } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";
import { User as NextAuthUser } from "next-auth";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/user";
import { Account as UserAccount } from "@/models/account";

// Add custom fields to Next Auth User
interface ExtendedUser extends Omit<NextAuthUser, 'id'> {
  id: string;
}

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error", // Custom error page
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      // Connect to the MongoDB database
      await connectToDatabase();
      
      // Check if user exists
      if (user?.email) {
        // Check if a user with this email exists but with a different provider
        const existingUser = await User.findOne({ email: user.email });
        
        if (existingUser) {
          // User exists, check if they're trying to sign in with a new provider
          const existingAccount = await UserAccount.findOne({
            userId: existingUser._id,
            provider: account?.provider
          });
          
          if (!existingAccount) {
            // User exists but is using a different provider
            // Store the error in a custom session variable
            // This will be displayed as a toast in the UI
            return `/auth/error?error=duplicate_email&provider=${account?.provider}`;
          }
        }
      }
      
      return true;
    },
    async session({ session, user }) {
      // Add user ID to the session
      if (session.user && user) {
        (session.user as ExtendedUser).id = user.id;
      }
      return session;
    },
    async jwt({ token, user, account }) {
      // Add user ID to the token when first signing in
      if (user) {
        token.userId = user.id;
      }
      return token;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };