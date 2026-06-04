import { getAllPosts } from '../lib/api';

import { Box, Button, Flex, Heading, Text } from '@chakra-ui/react';
import fs from 'fs';
import matter from 'gray-matter';
import Head from 'next/head';
import NextLink from 'next/link';
import CardGrid from '../components/CardGrid';
import MarkdownContent from '../components/MarkdownContent';
import { CONTENT_DIR, SITE_URL } from '../config';

const NUM_PREVIEW_ITEMS = 12;

const HomePage = (props: any) => {
  const { content, projects, talks } = props;
  const personJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Ilya Boyandin',
    url: SITE_URL,
    jobTitle: 'Data Visualization Engineer',
    email: 'mailto:ilya@boyandin.me',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'CH',
    },
    sameAs: [
      'https://github.com/ilyabo',
      'https://www.linkedin.com/in/ilyabo/',
      'https://twitter.com/ilyabo',
      'https://flowmap.blue',
    ],
    knowsAbout: [
      'data visualization',
      'geographic data visualization',
      'interactive maps',
      'flow maps',
      'mobility data analysis',
    ],
  };

  return (
    <Box maxW="7xl" mx="auto" mt={50}>
      <Head>
        <meta
          key="description"
          name="description"
          content="Ilya Boyandin is a data visualization engineer building interactive maps, geospatial analytics tools, flow maps, and browser-based data applications."
        />
        <meta
          key="og:description"
          property="og:description"
          content="Ilya Boyandin is a data visualization engineer building interactive maps, geospatial analytics tools, flow maps, and browser-based data applications."
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </Head>
      <Flex flexDir="column" gap={14}>
        <Box>
          <Heading as="h1" size="2xl" mb={2}>
            Ilya Boyandin
          </Heading>
          <Text fontSize="xl" color="#2F4A59">
            Data Visualization Engineer
          </Text>
        </Box>
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
