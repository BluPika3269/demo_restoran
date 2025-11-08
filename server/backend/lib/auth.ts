import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        // For demo purposes, using hardcoded credentials
        // In production, this should check against a database
        if (credentials?.username === 'admin' && credentials?.password === 'nokti2024') {
          return {
            id: '1',
            name: 'Salon Owner',
            email: 'owner@nail-salon.com',
            role: 'owner'
          }
        }
        return null
      }
    })
  ],
  pages: {
    signIn: '/admin/login',
  },
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.role = user.role
      }
      return token
    },
    async session({ session, token }: any) {
      if (token) {
        session.user.role = token.role
      }
      return session
    }
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions)