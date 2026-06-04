import React from 'react';

import MarkdownContent from '../components/MarkdownContent';
import fs from 'fs';
import matter from 'gray-matter';
import { CONTENT_DIR } from '../config';
import { Box } from '@chakra-ui/react';
import Head from 'next/head';

const MusicPage = (props: any) => {
  const { content } = props;
  const title = 'Music | Ilya Boyandin';
  const description = 'Electronic music, guitar recordings, and sound experiments by Ilya Boyandin.';

  return (
    <Box maxW="7xl" mx="auto" mt={50}>
      <Head>
        <title>{title}</title>
        <meta key="description" name="description" content={description} />
        <meta key="og:title" property="og:title" content={title} />
        <meta key="og:description" property="og:description" content={description} />
      </Head>
      <MarkdownContent content={content} slug={'music'} />
    </Box>
  );
};

export async function getStaticProps({ params }) {
  const fileContents = fs.readFileSync(`${CONTENT_DIR}/music.md`, 'utf8');
  const { content } = matter(fileContents);

  return {
    props: {
      content,
    },
  };
}

export default MusicPage;
