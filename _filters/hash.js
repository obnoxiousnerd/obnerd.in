const blake3 = require("blake3");

module.exports = (length) => (thing) => {
	const hasher = blake3.createHash();
	return hasher.update(thing, "utf8").digest("base64url", { length });
};
