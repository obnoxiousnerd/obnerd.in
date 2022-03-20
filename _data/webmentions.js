const dotenv = require('dotenv');
const fetch = require('node-fetch');
const { AssetCache } = require('@11ty/eleventy-fetch');

dotenv.config();

module.exports = async () => {
  const asset = new AssetCache('webmentions');
  const url = `https://webmention.io/api/mentions.jf2?token=${process.env.WEBMENTION_IO_TOKEN}&per-page=10000`;

  if (asset.isCacheValid('4h')) {
    return asset.getCachedValue();
  }

  const req = await fetch(url, {
    duration: '4h',
    type: 'json',
  });

  if (!req.ok) {
    // Probably a bad idea
    throw new Error(`Request returned ${req.status}`);
  }

  const mentions = await req.json();
  await asset.save(mentions, 'json');
  return mentions;
};
