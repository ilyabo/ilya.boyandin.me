import { ChakraProvider } from '@chakra-ui/react';
import { Analytics } from '@vercel/analytics/react';
import Router, { useRouter } from 'next/router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import React from 'react';
import Layout from '../components/Layout';
import '../css/main.css';
import theme from '../theme';

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

const App = (props) => {
  const { Component, pageProps } = props;

  const router = useRouter();
  if (router.asPath.startsWith('/admin')) {
    return <Component {...pageProps} />;
  }
  return (
    <ChakraProvider theme={theme}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
      <Analytics />
    </ChakraProvider>
  );
};

export default App;
