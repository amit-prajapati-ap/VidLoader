import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "./db";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";

const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: {label: 'Email',type: 'text'},
        password: {label: 'Password',type: 'password'}
      },
      async authorize(credentials) {
        if (!credentials?.email || credentials?.password) {
          throw new Error('Invalid or Missing credentials')
        }
        await connectDB()
        try {
          const user = await User.findOne({email: credentials.email})

          if (!user) {
            throw new Error('User not found')
          }

          const isValid: boolean = await bcrypt.compare(credentials.password, user.password)

          if (!isValid) {
            throw new Error('Invalid password')
          }

          return {
            id: user._id.toString(),
            email: user.email
          }
        } catch (error) {
          console.log('Error logging in', error)
          throw new Error('Something went wrong while logging in')
        }
      }
    })
  ],
  callbacks: {
    async jwt({token, user}) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({session, token}) {
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    },
    async redirect({url, baseUrl}) {
      if (url.startsWith('/')) {
        return `${baseUrl}${url}`
      }
      return url
    }
  },
  pages: {
    signIn: '/login',
    error: '/login'
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60
  },
  secret: NEXTAUTH_SECRET
}