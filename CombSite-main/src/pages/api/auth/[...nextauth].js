import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import VkProvider from 'next-auth/providers/vk';

export const authOptions = {
  session: {
    strategy: 'jwt',
  },
  secret: process.env.AUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      id: 'email-login',
      credentials: {
        email: { label: 'Email', type: 'text', placeholder: 'yoao21' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const { email, password } = credentials;
        if (!email && !password) {
          throw new Error('Не введены данные учётной записи!');
        } else if (!password) {
          throw new Error('Не введён пароль учётной записи!');
        } else if (!email) {
          throw new Error('Не введён адрес электронной почты!');
        }
        const res = await fetch(`${process.env.APP_DOMAIN}/api/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password,
          }),
        });
        const user = await res.json();

        if (res.status == 401) {
          throw new Error('Неверные данные авторизации');
        } else if (res.status == 200) {
          return {
            Id: user.Id,
            FirstName: user.FirstName,
            LastName: user.LastName,
            Phone: user.Phone,
            Email: user.Email,
            Birthday: user.Birthday,
          };
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session?.user) {
        session.user.Id = token.Id;
        session.user.FirstName = token.FirstName;
        session.user.LastName = token.LastName;
        session.user.Phone = token.Phone;
        session.user.Email = token.Email;
        session.user.Birthday = token.Birthday;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.Id = user.Id;
        token.FirstName = user.FirstName;
        token.LastName = user.LastName;
        token.Phone = user.Phone;
        token.Email = user.Email;
        token.Birthday = user.Birthday;
      }
      return token;
    },
  },
  pages: {
    signIn: '/auth/authorization',
  },
};

export default NextAuth(authOptions);
