import React from 'react';

import MarkdownContent from '../components/MarkdownContent';
import fs from 'fs';
import matter from 'gray-matter';
import { CONTENT_DIR } from '../config';
import { Box } from '@chakra-ui/react';

const MusicPage = (props: any) => {
  const { content } = props;
  return (
    <Box maxW="7xl" mx="auto" mt={50}>
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
