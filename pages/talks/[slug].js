import { getAllPosts, getPostBySlug } from '../../lib/api';
import Post from '../../components/Post';

export default function ProjectPost({ post }) {
  return <Post post={post} />;
}

export async function getStaticProps({ params }) {
  const post = getPostBySlug('talks', params.slug);
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
