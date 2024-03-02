import { useRouter } from 'next/router';
import ErrorPage from 'next/error';
import { Box, Heading, VStack } from '@chakra-ui/react';
import formatDate from '../lib/formatDate';
import MarkdownContent from './MarkdownContent';
import Head from 'next/head';

export default function Post({ post }) {
  const router = useRouter();
  if (!router.isFallback && !post?.slug) {
    return <ErrorPage statusCode={404} />;
  }
  return (
    <Box maxW="7xl" mx="auto" mt={50}>
      {router.isFallback ? (
        <Box>Loading…</Box>
      ) : (
        <Box as="article">
          <Head>
            <title>{`${post.title} | Ilya Boyandin`}</title>
            {/*<meta property="og:image" content={post.ogImage.url} />*/}
          </Head>
          <VStack alignItems="flex-start" spacing={5}>
            <Heading as="h1" size="2xl">
              {post.title}
            </Heading>
            <Heading size="sm">{formatDate(post.date)}</Heading>
            <MarkdownContent {...post} />
          </VStack>
        </Box>
      )}
    </Box>
  );
}
