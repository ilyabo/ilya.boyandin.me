import React from 'react';
import Head from 'next/head';
import Navbar from './Navbar';
import Footer from './Footer';
import metadata from '../content/metadata.json';
import { Box } from '@chakra-ui/react';
// import { Variants } from 'framer-motion';

// const variants: Variants = {
//   hidden: { opacity: 0 },
//   enter: { opacity: 1 },
//   exit: { opacity: 0 },
// };
const Layout = ({ children }) => {
  // const { title, description, keywords } = metadata.attributes;
  return (
    <>
      <Head>
        <title>{metadata.title}</title>
        <link rel="shortcut icon" href="/favicon.png" />
        <meta name="description" content={metadata.description} />
        <meta name="keywords" content={metadata.keywords} />
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
