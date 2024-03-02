// import { unified } from 'unified';
// import remarkParse from 'remark-parse';
// import remarkHtml from 'remark-html';

export default async function markdownToHtml(markdown) {
  // const result = await unified()
  //   .use(remarkParse)
  //   .use(remarkHtml, {
  //     handlers: {
  //       image(h, node, ...rest) {
  //         console.log(JSON.stringify(rest, null, 2));
  //         const props = { src: normalizeImgSrc(node), alt: node.alt };

  //         if (node.title !== null && node.title !== undefined) {
  //           props.title = node.title;
  //         }

  //         return h(node, 'img', props);
  //       },
  //     },
  //   })
  //   .process(markdown);
  // return result.toString();
}

// function normalizeImgSrc(node) {
//   // console.log(JSON.stringify(node, null, 2));
//   return `./${node.url}`;
// }
