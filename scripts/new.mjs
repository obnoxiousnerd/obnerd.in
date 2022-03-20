#!/usr/bin/env node
import { $ } from "zx";
import dayjs from "dayjs";
import crypto from "crypto";
import fs from "fs/promises";

const type = process.argv[2];
const url = process.argv[3] ?? "";

if (type === null) {
  console.error("Usage: new.mjs note/like [url (OPTIONAL)]");
  process.exit(2);
}

const NOTE_LIKE_TMPL = (url, ts) => `---
${url && `url: ${url}\n`}date: ${ts}
---
`;

const randomFilename = () => {
  return `${crypto.randomBytes(3).toString("hex")}`;
};

const ts = new Date();
let content = NOTE_LIKE_TMPL(url, ts.toISOString());

switch (type) {
  case "note": {
    await fs.writeFile(
      `views/notes/${dayjs(ts).format("YYYY-MM-DD-HH-mm")}.md`,
      content
    );
  }
  case "like":
    await fs.writeFile(`views/likes/${randomFilename()}.md`, content);
    break;
  default:
    console.error("¯\\_(ツ)_/¯");
    process.exit(1);
}
