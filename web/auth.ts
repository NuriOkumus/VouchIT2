import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      authorization: { params: { scope: "read:user user:email repo" } },
    }),
  ],
  pages: { signIn: "/" },
  callbacks: {
    jwt({ token, account }) {
      if (account?.access_token) token.accessToken = account.access_token
      return token
    },
    session({ session, token }) {
      session.accessToken = token.accessToken
      return session
    },
  },
})
