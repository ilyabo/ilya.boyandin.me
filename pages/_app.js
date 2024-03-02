import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import Layout from '../components/Layout';
import theme from '../theme';
import { useRouter } from 'next/router';
import Router from 'next/router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import '../css/main.css';

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
    </ChakraProvider>
  );
};

export default App;
