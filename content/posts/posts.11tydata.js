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
    },
  };
};
