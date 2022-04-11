const toml = require('toml');
const rss = require('@11ty/eleventy-plugin-rss');
const toc = require('eleventy-plugin-toc');
const { dateToHuman } = require('./_11ty/filters');

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

  // Set watch targets
  eleventyConfig.addWatchTarget('./_public');

  // Add TOML support for data
  eleventyConfig.addDataExtension('toml', (contents) => toml.parse(contents));

  eleventyConfig.addCollection('notes', (collection) => {
    return collection.getFilteredByGlob('views/notes/*.md');
  });
  eleventyConfig.addCollection('likes', (collection) => {
    return collection.getFilteredByGlob('views/likes/*.md');
  });

  eleventyConfig.addCollection('content', (collection) => {
    return collection.getFilteredByGlob([
      'views/notes/*.md',
      'views/posts/*.md',
      'views/likes/*.md',
    ]);
  });

  eleventyConfig.setDataDeepMerge(true);
  eleventyConfig.setLibrary('md', {
    set: () => {},
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

  return {
    markdownTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
    dir: {
      input: 'views',
      output: 'dist',
      includes: '../_includes',
      layouts: '../_includes/layouts',
      data: '../_data',
    },
  };
};
