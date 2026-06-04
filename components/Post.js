import { Box, Button, Flex, Heading, VStack } from '@chakra-ui/react';
import ErrorPage from 'next/error';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import formatDate from '../lib/formatDate';
import {
  absoluteUrl,
  creativeWorkJsonLd,
  pageTitle,
  postDescription,
  postImageUrl,
  postUrlPath,
} from '../lib/seo';
import MarkdownContent from './MarkdownContent';

export default function Post({ post }) {
  const router = useRouter();
  if (!router.isFallback && !post?.slug) {
    return <ErrorPage statusCode={404} />;
  }
  const prevNext = (
    <>
      <Button
        size="sm"
        leftIcon={<FaChevronLeft size="16px" />}
        isDisabled={!post.prev}
        onClick={() => router.push(post.prev)}
      >
        Previous
      </Button>
      <Flex grow={1} basis="10px" />
      <Button
        size="sm"
        rightIcon={<FaChevronRight size="16px" />}
        isDisabled={!post.next}
        onClick={() => router.push(post.next)}
      >
        Next
      </Button>
    </>
  );
  return (
    <Box maxW="7xl" mx="auto" mt={50}>
      {router.isFallback ? (
        <Box>Loading…</Box>
      ) : (
        <Box as="article">
          <Head>
            <title>{pageTitle(post.title)}</title>
            <meta key="description" name="description" content={postDescription(post)} />
            <meta key="og:type" property="og:type" content="article" />
            <meta key="og:title" property="og:title" content={pageTitle(post.title)} />
            <meta key="og:description" property="og:description" content={postDescription(post)} />
            <meta key="og:url" property="og:url" content={absoluteUrl(postUrlPath(post))} />
            {postImageUrl(post) ? (
              <>
                <meta key="og:image" property="og:image" content={postImageUrl(post)} />
                <meta key="twitter:card" name="twitter:card" content="summary_large_image" />
                <meta key="twitter:image" name="twitter:image" content={postImageUrl(post)} />
              </>
            ) : null}
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeWorkJsonLd(post)) }}
            />
          </Head>
          <VStack alignItems="flex-start" spacing={5}>
            <Flex flexDir={{ base: 'column', md: 'row' }} alignItems="center" width="100%" gap="1">
              <Heading as="h1" size="2xl" align={{ base: 'center', md: 'left' }}>
                {post.title}
              </Heading>
              <Flex flexBasis={{ base: '10px', md: '30px' }} />
              <Heading size="sm">{formatDate(post.date)}</Heading>
              <Flex grow={1} />
              <Flex grow={0} width={{ base: '100%', md: 'unset' }}>
                {prevNext}
              </Flex>
            </Flex>

            <MarkdownContent {...post} />
            <Flex justifyContent="center" width="100%" pt="10">
              {prevNext}
            </Flex>
          </VStack>
        </Box>
      )}
    </Box>
  );
}
