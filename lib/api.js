import fs from 'fs';
import { join } from 'path';
import matter from 'gray-matter';
import { CONTENT_DIR } from '../config';

export function getPostSlugs(path) {
  const fullPath = `${CONTENT_DIR}/${path}`;
  return fs
    .readdirSync(join(process.cwd(), fullPath))
    .filter((fname) => fs.lstatSync(`${fullPath}/${fname}`).isDirectory());
}

export function getPostBySlug(path, slug) {
  const realSlug = slug.replace(/\.md$/, '');
  const fullPath = join(process.cwd(), `${CONTENT_DIR}/${path}`, `${realSlug}/index.md`);
  if (!fs.existsSync(fullPath)) {
    console.log(`${fullPath} not found`);
    return undefined;
  }
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);
  const date = new Date(data.date).getTime();
  return {
    ...data,
    path,
    date: date,
    orderDate: data.orderDate ? new Date(data.orderDate).getTime() : date,
    slug: realSlug,
    content,
  };
}

export function getAllPosts(path) {
  const slugs = getPostSlugs(path);

  const posts = slugs
    .map((slug) => getPostBySlug(path, slug))
    .filter((post) => post !== undefined)
    // sort posts by date in descending order
    .sort((post1, post2) => post2.orderDate - post1.orderDate);
  return posts;
}
