const toml = require('toml');
const rss = require('@11ty/eleventy-plugin-rss');
const toc = require('eleventy-plugin-toc');
const { dateToHuman } = require('./_11ty/filters');
const minifyXML = require('minify-xml').minify;

/**
 *
 * @param {import("@11ty/eleventy/src/UserConfig")} eleventyConfig
 */
module.exports = function (eleventyConfig) {
  eleventyConfig.setUseGitIgnore(false);
  eleventyConfig.addPassthroughCopy({
    _assets: '.',
    '_public/fonts': 'fonts/',
    'node_modules/@fontsource/cabin/files/cabin-latin-variable-wghtOnly-normal.woff2':
      'fonts/cabin-latin-variable-wghtOnly-normal.woff2',
  });
  eleventyConfig.setServerPassthroughCopyBehavior('copy');

  // Set watch targets
  eleventyConfig.addWatchTarget('./_public');

  // Add TOML support for data
  eleventyConfig.addDataExtension('toml', (contents) => toml.parse(contents));

  eleventyConfig.addCollection('posts', (collection) => {
    return collection
      .getFilteredByTag('posts')
      .filter((post) => !post?.data?.draft);
  });

  eleventyConfig.addCollection('activity', (collection) => {
    return [
      ...collection.getFilteredByTag('notes'),
      ...collection.getFilteredByTag('likes'),
    ].filter((post) => !post?.data?.draft);
  });

  eleventyConfig.setLibrary('md', {
    set: () => {},
    disable: () => {},
    render: (str) =>
      import('./_11ty/markdown.mjs').then(({ render }) => render(str)),
  });

  // Table of contents
  eleventyConfig.addPlugin(toc, {
    ul: true,
    tags: ['h1', 'h2', 'h3', 'h4'],
  });

  // Add rss
  eleventyConfig.addPlugin(rss);

  // Add filters
  eleventyConfig.addFilter('dateToHuman', dateToHuman);
  eleventyConfig.addFilter('absoluteUrl', rss.absoluteUrl);
  eleventyConfig.addFilter('getNewestItemDate', (data) => {
    const getDate = (data) => data?.data?.updated || data.date;
    return new Date(
      getDate(data.sort((a, b) => getDate(b) - getDate(a)).shift())
    );
  });
  eleventyConfig.addFilter('sortByDate', (data) => {
    const getDate = (data) => data?.data?.updated || data.date;
    return data.sort((a, b) => getDate(b) - getDate(a));
  });

  eleventyConfig.addTransform('rssmin', (content, outputPath) => {
    if (outputPath.endsWith('.xml')) {
      return minifyXML(content, {
        trimWhitespaceFromTexts: true
      });
    }
    return content;
  });

  return {
    markdownTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
    dir: {
      input: 'content',
      output: 'dist',
      includes: '../_includes',
      layouts: '../_includes/layouts',
      data: '../_data',
    },
  };
};
