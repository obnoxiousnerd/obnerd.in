import crypto from 'crypto';
import Image from '@11ty/eleventy-img';

function constructUrl(email, size) {
  return `https://secure.gravatar.com/avatar/${md5(email)}?s=${size}`;
}

function md5(email) {
  return crypto.createHash('md5').update(email).digest('hex');
}

const stats = await Image(constructUrl('pranav@karawale.in', 512), {
  formats: ['webp'],
  widths: [96, 256],
  urlPath: '/img/',
  outputDir: '_assets/img/',
  filenameFormat: (_id, _src, width, format, _options) =>
    `me${width}.${format}`,
});

console.log(stats);
