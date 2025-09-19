import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { DatabaseService } from './database'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // Demo user - simple check for demo purposes
        if (credentials.email === 'oliver@schrader.dk' && credentials.password === 'ko112233') {
          try {
            // Check if user exists in database, create if not
            let user = await DatabaseService.getUserByEmail(credentials.email)
            
            if (!user) {
              user = await DatabaseService.createUser(credentials.email, 'Oliver Schrader', 'super_admin')
            }

            return {
              id: user.id,
              email: user.email,
              name: user.name,
              role: 'super_admin'
            }
          } catch (error) {
            console.error('Database error during login:', error)
            // Fallback to demo user without database
            return {
              id: '550e8400-e29b-41d4-a716-446655440000',
              email: 'oliver@schrader.dk',
              name: 'Oliver Schrader',
              role: 'super_admin'
            }
          }
        }

        return null
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  pages: {
    signIn: '/auth/login'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    }
  },
  secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-for-development'
}
