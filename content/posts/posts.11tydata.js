module.exports = function () {
  return {
    eleventyComputed: {
      eleventyExcludeFromCollections: function (data) {
        if (Boolean(data?.draft)) {
          return true;
        } else {
          return data.eleventyExcludeFromCollections;
        }
      },
      permalink: function (data) {
        if (Boolean(data?.draft)) {
          return false;
        } else {
          return data.permalink;
        }
      },
      nextPost: function (data) {
        const i = data.collections.posts.findIndex(
          (v) => v.outputPath === data.page.outputPath
        );
        if (i > 0 && i + 1 < data.collections.posts.length)
          return data.collections.posts[i + 1];
      },
      previousPost: function (data) {
        const i = data.collections.posts.findIndex(
          (v) => v.outputPath === data.page.outputPath
        );
        if (i > 0 && i - 1 < data.collections.posts.length)
          return data.collections.posts[i - 1];
      },
    },
  };
};
