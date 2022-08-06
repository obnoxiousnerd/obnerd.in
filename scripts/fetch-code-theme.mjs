import fs from 'fs/promises';
import fetch from 'node-fetch';
import stripJsonComments from 'strip-json-comments';

const themes = ['gruvbox-dark-hard'];

themes.forEach(async (theme) => {
  const response = await fetch(`
  https://raw.githubusercontent.com/jdinhify/vscode-theme-gruvbox/main/themes/${theme}.json  
  `);
  const data = JSON.parse(stripJsonComments(await response.text()));
  await fs.writeFile(
    `./node_modules/shiki/themes/${theme}.json`,
    JSON.stringify(data, null, 2)
  );
});
