import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { User } from "@/models/userModel";
import connectDB from "@/libs/db/mongodb";
import bcrypt from "bcrypt";
import { User as NextAuthUser } from "next-auth";
import { JWT } from "next-auth/jwt";
import { Session } from "next-auth";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      // Ensures credentials is an object with string keys or undefined
      async authorize(credentials: Record<string, string> | undefined) {

        // Connect to db to verify the user credentials
        await connectDB();

        // Retrieve the email and password from the credentials
        const { email, password } = credentials || {}; // Use empty object if credentials is undefined

        if (!email || !password) {
          throw new Error("Email and password is required");
        }

        const user = await User.findOne({ email });
        if (!user) {
          throw new Error("No user found with this email");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          throw new Error("Invalid email or password");
        }

        return { id: user._id.toString(), email: user.email, name: user.name };
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },

  session: {
    strategy: "jwt", // (JSON Web token for session handling)
    maxAge: 30 * 24 * 60 * 60,
  },

  // Allow customization of the session and JWt behavior
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: NextAuthUser | null }) {
      // If user is logged in and user data is availablem add the user id to the token
      if (user) {
        token.id = user.id; // Ensures user has an "id" property
      }

      return token;
    },

    async session({ session, token }: { session: Session; token: JWT }) {
      // If session and session.user exist, add the user id to the session object
      if (session?.user) {
        session.user.id = token.id as string; // Ensures id is treated as a string
      }

      return session;
    },
  },
  secret: process.env.JWT_SECRET,
};



