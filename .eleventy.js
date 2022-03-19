const toml = require("toml");
const md = require("markdown-it");
const anchor = require("markdown-it-anchor");
const rss = require("@11ty/eleventy-plugin-rss");
const shiki = require("markdown-it-shiki").default;
const toc = require("eleventy-plugin-toc");

const contentHash = require("./_11ty/filters");

/**
 *
 * @param {import("@11ty/eleventy/src/UserConfig")} eleventyConfig
 */
module.exports = function (eleventyConfig) {
	eleventyConfig.setUseGitIgnore(false);
	eleventyConfig.addPassthroughCopy({ _assets: "." });

	// Set watch targets
	eleventyConfig.addWatchTarget("./_public");

	// Add TOML support for data
	eleventyConfig.addDataExtension("toml", (contents) => toml.parse(contents));

	eleventyConfig.addCollection("notes", (collection) => {
		return collection.getFilteredByGlob("views/notes/*.md");
	});

	eleventyConfig.addCollection("content", (collection) => {
		return [
			...collection.getFilteredByTag("likes"),
			...collection.getFilteredByGlob(["views/notes/*.md", "views/posts/*.md"]),
		];
	});

	eleventyConfig.setDataDeepMerge(true);

	// Markdown plugins!
	const mdFactory = md({ html: true })
		.use(anchor, {
			levels: [1, 2, 3, 4, 5],
			slugify: require("slug"),
		})
		.use(shiki, {
			theme: "ayu-dark",
		});
	eleventyConfig.setLibrary("md", mdFactory);

	// Table of contents
	eleventyConfig.addPlugin(toc, {
		ul: true,
		tags: ["h1", "h2", "h3", "h4"],
	});

	// Add rss
	eleventyConfig.addPlugin(rss);

	// Add filters
	eleventyConfig.addFilter("dateToHuman", (date) =>
		new Intl.DateTimeFormat("en-US", {
			year: "numeric",
			month: "long",
			day: "2-digit",
		}).format(new Date(date))
	);
	eleventyConfig.addFilter("contentHash", contentHash(4));

	return {
		markdownTemplateEngine: "njk",
		htmlTemplateEngine: "njk",
		dir: {
			input: "views",
			output: "dist",
			includes: "../_includes",
			layouts: "../_includes/layouts",
			data: "../_data",
		},
	};
};
