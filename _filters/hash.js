const blake3 = require("blake3");

module.exports = (length) => (thing) => {
  const hashed = blake3.hash(thing, { length });
  return hashed.map(base62).join("");
};

// copied from https://github.com/base62/base62.js/blob/master/lib/ascii.js
function base62(int) {
  var CHARSET =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  if (int === 0) {
    return CHARSET[0];
  }

  var res = "";
  while (int > 0) {
    res = CHARSET[int % 62] + res;
    int = Math.floor(int / 62);
  }
  return res;
}
