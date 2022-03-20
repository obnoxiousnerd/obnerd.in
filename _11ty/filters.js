const dateToHuman = (date, includeTime = false) => {
  const opt = {
    dateFormat: "long",
  };
  if (includeTime) {
    opt.hour = "2-digit";
    opt.minute = "2-digit";
  }
  return new Intl.DateTimeFormat("en-GB", opt).format(new Date(date));
};

module.exports = { dateToHuman };
