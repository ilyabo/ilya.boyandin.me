import Post from '../../components/Post';
import { getAllPosts, getPostBySlug } from '../../lib/api';

export default function ProjectPost({ post }) {
  return <Post post={post} />;
}

export async function getStaticProps({ params }) {
  const post = getPostBySlug('talks', params.slug, { includePrevNext: true });
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
  const posts = getAllPosts('talks');

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
