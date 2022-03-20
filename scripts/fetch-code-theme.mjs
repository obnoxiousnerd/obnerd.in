import fs from 'fs/promises';
import fetch from 'node-fetch';

const themes = ['ayu-dark', 'ayu-light'];

themes.forEach(async (theme) => {
  const response = await fetch(`
    https://raw.githubusercontent.com/ayu-theme/vscode-ayu/master/${theme}.json
  `);
  const data = await response.json();
  await fs.writeFile(
    `./node_modules/shiki/themes/${theme}.json`,
    JSON.stringify(data, null, 2)
  );
});
