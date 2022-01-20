import "../styles/globals.css";
import Head from "next/head";
import "antd/dist/antd.css";
import { useRouter } from "next/router";
import App from "next/app";

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Spacestagram</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} key={router.asPath} />
    </>
  );
}

MyApp.getInitialProps = async (appContext) => {
  // calls page's `getInitialProps` and fills `appProps.pageProps`
  const appProps = await App.getInitialProps(appContext);
  return { ...appProps, message: 2 };
};

export default MyApp;
