import { getAllPosts } from '../lib/api';

import { Box, Button, Flex, Heading, Text } from '@chakra-ui/react';
import fs from 'fs';
import matter from 'gray-matter';
import NextLink from 'next/link';
import CardGrid from '../components/CardGrid';
import MarkdownContent from '../components/MarkdownContent';
import { CONTENT_DIR } from '../config';

const NUM_PREVIEW_ITEMS = 12;

const HomePage = (props: any) => {
  const { content, projects, talks } = props;
  return (
    <Box maxW="7xl" mx="auto" mt={50}>
      <Flex flexDir="column" gap={14}>
        <MarkdownContent content={content} slug={'home'} />

        <Flex flexDir="column" gap={5}>
          <NextLink href="/projects" passHref>
            <Heading as="a" fontSize="2xl">
              <Text textColor="#2F4A59">Recent Projects</Text>
            </Heading>
          </NextLink>

          <Box alignSelf="center">
            <CardGrid items={projects} path="projects" linkPath="p" />
          </Box>

          <Box textAlign={'center'} fontSize="lg" mt="10">
            <NextLink href="/projects" passHref>
              <Button variant={'outline'} colorScheme="blue" size="lg">
                More projects
              </Button>
            </NextLink>
          </Box>
        </Flex>

        <Flex flexBasis="50px" />

        <Flex flexDir="column" gap={5} mt={10}>
          <NextLink href="/talks" passHref>
            <Heading as="a" fontSize="2xl">
              <Text textColor="#2F4A59">Recent Talks</Text>
            </Heading>
          </NextLink>{' '}
          <Box alignSelf="center">
            <CardGrid items={talks} path="talks" linkPath="talks" />
          </Box>
          <Box textAlign={'center'} fontSize="lg" mt="10">
            <NextLink href="/talks" passHref>
              <Button variant={'outline'} colorScheme="blue" size="lg">
                More talks
              </Button>
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
