import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Navbar from './Navbar';
import Footer from './Footer';
import metadata from '../content/metadata.json';
import { Box } from '@chakra-ui/react';
import { SITE_URL } from '../config';
// import { Variants } from 'framer-motion';

// const variants: Variants = {
//   hidden: { opacity: 0 },
//   enter: { opacity: 1 },
//   exit: { opacity: 0 },
// };
const Layout = ({ children }) => {
  // const { title, description, keywords } = metadata.attributes;
  const router = useRouter();
  const path = router.asPath.split(/[?#]/)[0];
  const canonicalPath = path === '/' ? '' : path.replace(/\/$/, '');
  const canonicalUrl = `${SITE_URL}${canonicalPath}`;

  return (
    <>
      <Head>
        <title>{metadata.title}</title>
        <link rel="canonical" href={canonicalUrl} />
        <link rel="shortcut icon" href="/favicon.png" />
        <meta name="description" content={metadata.description} />
        <meta name="keywords" content={metadata.keywords} />
        <meta name="robots" content="index,follow" />
        <meta property="og:site_name" content="Ilya Boyandin" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={metadata.title} />
        <meta property="og:description" content={metadata.description} />
        <meta property="og:url" content={canonicalUrl} />
        <meta
          name="google-site-verification"
          content="bqFGGRdnZTQbjlUfQG7NoYqovZUQA6rg3rxbIUl9HgA"
        />
        <meta name="twitter:card" content="summary" />
      </Head>
      <Navbar />
      <Box px={['30px', '50px']} py={30}>
        {/*<AnimatePresence*/}
        {/*  exitBeforeEnter*/}
        {/*  initial={false}*/}
        {/*  onExitComplete={() => window.scrollTo(0, 0)}*/}
        {/*>*/}
        {/*<Flex as="main" height="100%">*/}
        {/*<motion.main*/}
        {/*  variants={variants} // Pass the variant object into Framer Motion*/}
        {/*  initial="hidden" // Set the initial state to variants.hidden*/}
        {/*  animate="enter" // Animated state to variants.enter*/}
        {/*  exit="exit" // Exit state (used later) to variants.exit*/}
        {/*  transition={{ type: 'linear' }} // Set the transition to linear*/}
        {/*>*/}
        {children}
        {/*</motion.main>*/}
        {/*</Flex>*/}
      </Box>
      <Footer />
      {/*</AnimatePresence>*/}
    </>
  );
};

export default Layout;
