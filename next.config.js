// const fs = require('fs');
// const blogPostsFolder = './content/blogPosts';
// const projectsFolder = './content/projects';

// const getPathsForPosts = (folder, urlPathPrefix) => {
//   return fs
//     .readdirSync(folder)
//     .map((name) => {
//       const trimmedName = name.substring(0, name.length - 3);
//       return {
//         [`${urlPathPrefix}/${trimmedName}`]: {
//           page: `${urlPathPrefix}/[slug]`,
//           query: {
//             slug: trimmedName,
//           },
//         },
//       };
//     })
//     .reduce((acc, curr) => {
//       return { ...acc, ...curr };
//     }, {});
// };

module.exports = {
  experimental: {
    scrollRestoration: true,
  },
  // webpack: (configuration) => {
  //   configuration.module.rules.push(
  //     //   {
  //     //   test: /\.md$/,
  //     //   use: 'frontmatter-markdown-loader',
  //     // }
  //     // {
  //     //   test: /\.md$/,
  //     //   use: [
  //     //     {
  //     //       loader: 'remark-loader',
  //     //       options: {
  //     //         removeFrontMatter: false,
  //     //         remarkOptions: {
  //     //           plugins: [RemarkFrontmatter],
  //     //         },
  //     //       },
  //     //     },
  //     //   ],
  //     // }
  //   );
  //   return configuration;
  // },
  // async exportPathMap(defaultPathMap) {
  //   return {
  //     ...defaultPathMap,
  //     ...getPathsForPosts(projectsFolder, '/p'),
  //   };
  // },
};
