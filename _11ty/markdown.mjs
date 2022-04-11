// Various sources of inspiration:
// https://www.11ty.dev/docs/languages/custom/#overriding-an-existing-template-language
// https://github.com/brown-band/website/blob/d32b7561ae0dbf1e687eaac9a694a839b1458344/config/index.js#L22-L28

import { unified } from 'unified';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeShiki from '@retronav/rehype-shiki';
import { getHighlighter } from 'shiki';
import { visit } from 'unist-util-visit';
import { slugifyWithCounter } from '@sindresorhus/slugify';
import { toString } from 'hast-util-to-string';
import rehypeShiftHeading from 'rehype-shift-heading';

const highlighter = await getHighlighter({ theme: 'ayu-dark' });

/**
 * Render markdown to HTML via unified.
 * @returns HTML
 */
export async function render(content) {
  // allowDangerousHtml is set to true to not break templating features
  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeShiki, { highlighter })
    .use(rehypeSlug)
    .use(rehypeShiftHeading, { shift: 1 })
    .use(rehypeStringify, { allowDangerousHtml: true });

  const html = String(await processor.process(content));
  return html;
}

function rehypeSlug() {
  const slugger = slugifyWithCounter();
  return (tree) => {
    slugger.reset();
    visit(tree, 'element', (node) => {
      if (
        /h[1-6]/.test(node.tagName) &&
        node.properties &&
        !node.properties.id
      ) {
        node.properties.id = slugger(toString(node));
      }
    });
  };
}
