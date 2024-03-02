import React from 'react';
import { getAllPosts } from '../lib/api';

import MarkdownContent from '../components/MarkdownContent';
import fs from 'fs';
import matter from 'gray-matter';
import { CONTENT_DIR } from '../config';
import { Link as ChakraLink, Box, Flex, Heading, Text } from '@chakra-ui/react';
import CardGrid from '../components/CardGrid';
import NextLink from 'next/link';

const NUM_PREVIEW_ITEMS = 12;

const HomePage = (props: any) => {
  const { content, projects, talks } = props;
  return (
    <Box maxW="7xl" mx="auto" mt={50}>
      <Flex flexDir="column" gap={14}>
        <MarkdownContent content={content} slug={'home'} />

        <Flex flexDir="column" gap={5}>
          <Heading as="h2" fontSize="2xl">
            Recent Projects
          </Heading>

          <Box alignSelf="center">
            <CardGrid items={projects} path="projects" linkPath="p" />
          </Box>

          <Box textAlign={'center'} fontSize="lg" mt="10">
            <NextLink href="/projects" passHref>
              More projects
            </NextLink>
          </Box>
        </Flex>

        <Flex flexDir="column" gap={5} mt={10}>
          <Heading as="h2" fontSize="2xl">
            Recent Talks
          </Heading>
          <Box alignSelf="center">
            <CardGrid items={talks} path="talks" linkPath="talks" />
          </Box>
          <Box textAlign={'center'} fontSize="lg" mt="10">
            <NextLink href="/talks" passHref>
              More talks
            </NextLink>
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
};

export async function getStaticProps({ params }) {
  const fileContents = fs.readFileSync(`${CONTENT_DIR}/home.md`, 'utf8');
  const { content } = matter(fileContents);

  return {
    props: {
      content,
      projects: getAllPosts('projects').slice(0, NUM_PREVIEW_ITEMS),
      talks: getAllPosts('talks').slice(0, NUM_PREVIEW_ITEMS),
    },
  };
}

export default HomePage;
