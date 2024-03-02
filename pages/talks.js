import React from 'react';
import { Box, Flex, VStack } from '@chakra-ui/react';
import { getAllPosts } from '../lib/api';
import CardGrid from '../components/CardGrid';
import Link from 'next/link';

const TalksPage = ({ talks }) => {
  return (
    <VStack spacing="40px">
      <Flex as="section" flexGrow={1} alignItems="center" mt={10}>
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
