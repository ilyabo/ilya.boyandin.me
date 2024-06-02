import Post from '../../components/Post';
import { getAllPosts, getPostBySlug } from '../../lib/api';

export default function ProjectPost({ post }) {
  return (
    <div>
      {post.index}
      <Post post={post} />
    </div>
  );
  // const router = useRouter();
  // if (!router.isFallback && !post?.slug) {
  //   return <ErrorPage statusCode={404} />;
  // }
  // return (
  //   <Box maxW="7xl" mx="auto" mt={50}>
  //     {router.isFallback ? (
  //       <Box>Loading…</Box>
  //     ) : (
  //       <Box as="article">
  //         <Head>
  //           <title>{`${post.title} | Ilya Boyandin`}</title>
  //           {/*<meta property="og:image" content={post.ogImage.url} />*/}
  //         </Head>
  //         <VStack alignItems="flex-start" spacing={5}>
  //           <Heading as="h1" size="2xl">
  //             {post.title}
  //           </Heading>
  //           <Heading size="sm">{formatDate(post.date)}</Heading>
  //           <MarkdownContent {...post} />
  //         </VStack>
  //       </Box>
  //     )}
  //   </Box>
  // );
}

export async function getStaticProps({ params }) {
  const post = getPostBySlug('projects', params.slug, { includePrevNext: true, urlPath: 'p' });
  const content = post.content;

  return {
    props: {
      post: {
        ...post,
        content,
      },
    },
  };
}

export async function getStaticPaths() {
  const posts = getAllPosts('projects');

  return {
    paths: posts.map((post) => {
      return {
        params: {
          slug: post.slug,
        },
      };
    }),
    fallback: false,
  };
}
