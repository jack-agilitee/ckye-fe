import NextAuth from 'next-auth';
import AzureADProvider from 'next-auth/providers/azure-ad';

const handler = NextAuth({
  providers: [
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET,
      tenantId: process.env.AZURE_AD_TENANT_ID,
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      // Persist the OAuth access_token and user profile to the token right after signin
      if (account) {
        token.accessToken = account.access_token;
        token.email = profile?.email;
        token.name = profile?.name;
      }
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client
      session.accessToken = token.accessToken;
      session.user.email = token.email;
      session.user.name = token.name;
      return session;
    },
    async signIn({ user, profile }) {
      // Only allow Agilitee email addresses
      const email = user?.email || profile?.email;
      if (email && email.endsWith('@agilitee.com')) {
        return true;
      }
      return false;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
  },
});

export { handler as GET, handler as POST };