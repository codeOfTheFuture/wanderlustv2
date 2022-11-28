import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { wrapper } from "../store";
import { useRouter } from "next/router";
import AuthLayout from "../components/layouts/AuthLayout";
import Layout from "../components/layouts/Layout";

const App = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps): JSX.Element => {
  const router = useRouter();

  return (
    <SessionProvider session={session}>
      {router.pathname === "/auth/signup" ||
      router.pathname === "/auth/signin" ? (
        <AuthLayout>
          <Component {...pageProps} />
        </AuthLayout>
      ) : (
        <Layout>
          <Component {...pageProps} />
        </Layout>
      )}
    </SessionProvider>
  );
};

export default wrapper.withRedux(App);
