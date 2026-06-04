import { Box, Flex, Heading, VStack } from '@chakra-ui/react';
import Head from 'next/head';
import Link from 'next/link';
import React from 'react';
import CardGrid from '../components/CardGrid';
import { getAllPosts } from '../lib/api';

const TalksPage = ({ talks }) => {
  const title = 'Talks | Ilya Boyandin';
  const description =
    'Conference talks, meetups, guest lectures, and presentations by Ilya Boyandin about data visualization, geospatial analytics, and web tools.';

  return (
    <VStack spacing="40px">
      <Head>
        <title>{title}</title>
        <meta key="description" name="description" content={description} />
        <meta key="og:title" property="og:title" content={title} />
        <meta key="og:description" property="og:description" content={description} />
      </Head>
      <Heading as="h1" size="2xl" alignSelf="flex-start" mt={10}>
        Talks
      </Heading>
      <Flex as="section" flexGrow={1} alignItems="center">
        <CardGrid items={talks} path="talks" linkPath="talks" />
      </Flex>
      <Box>
        <Link href="/resume/#talks">Full list of talks</Link>
      </Box>
    </VStack>
  );
};

export async function getStaticProps() {
  const talks = getAllPosts('talks');
  return {
    props: { talks },
  };
}

export default TalksPage;
