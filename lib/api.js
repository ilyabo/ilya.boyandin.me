import fs from 'fs';
import matter from 'gray-matter';
import { join } from 'path';
import { CONTENT_DIR } from '../config';

export function getPostSlugs(path) {
  const fullPath = `${CONTENT_DIR}/${path}`;
  return fs
    .readdirSync(join(process.cwd(), fullPath))
    .filter((fname) => fs.lstatSync(`${fullPath}/${fname}`).isDirectory());
}

function getOrderDate(postMatter) {
  return postMatter.orderDate
    ? new Date(postMatter.orderDate).getTime()
    : new Date(postMatter.date).getTime();
}

function getPostData(path, realSlug) {
  const fullPath = join(process.cwd(), `${CONTENT_DIR}/${path}`, `${realSlug}/index.md`);
  if (!fs.existsSync(fullPath)) {
    console.log(`${fullPath} not found`);
    return undefined;
  }
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  return {
    slug: realSlug,
    ...matter(fileContents),
  };
}

export function getPostBySlug(path, slug, opts = {}) {
  const { includePrevNext = false, urlPath = path } = opts;
  const realSlug = slug.replace(/\.md$/, '');
  const { data: postMatter, content } = getPostData(path, realSlug);
  const date = new Date(postMatter.date).getTime();
  return {
    ...postMatter,
    path,
    date: date,
    orderDate: getOrderDate(postMatter),
    slug: realSlug,
    content,
    ...(includePrevNext ? getPrevNext(path, urlPath, realSlug) : {}),
  };
}

function getPrevNext(path, urlPath, slug) {
  const slugs = getSortedPostsSlugs(path);
  const index = slugs.indexOf(slug);
  const prevSlug = index > 0 ? slugs[index - 1] : null;
  const nextSlug = index < slugs.length - 1 ? slugs[index + 1] : null;
  return {
    prev: prevSlug ? `/${urlPath}/${prevSlug}` : null,
    next: nextSlug ? `/${urlPath}/${nextSlug}` : null,
  };
}

function getSortedPostsSlugs(path) {
  const posts = getPostSlugs(path).map((slug) => getPostData(path, slug));
  const slugs = posts
    .sort((post1, post2) => getOrderDate(post2.data) - getOrderDate(post1.data))
    .map((post) => post.slug);
  return slugs;
}

export function getAllPosts(path) {
  const slugs = getPostSlugs(path);

  const posts = slugs
    .map((slug, index) => getPostBySlug(path, slug, index))
    .filter((post) => post !== undefined)
    // sort posts by date in descending order
    .sort((post1, post2) => post2.orderDate - post1.orderDate);
  return posts;
}
