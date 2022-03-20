#!/usr/bin/env node
import { $ } from "zx";
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
	return `${crypto.randomBytes(3).toString("hex")}.md`;
};

switch (type) {
	case "note":
	case "like":
		const ts = new Date();
		const content = NOTE_LIKE_TMPL(url, ts.toISOString());
		await fs.writeFile(`views/${type}s/${randomFilename()}`, content);
		break;
}
