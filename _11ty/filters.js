const dateToHuman = (date) =>
	new Intl.DateTimeFormat("en-GB", {
		year: "numeric",
		month: "long",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
	}).format(new Date(date));

module.exports = { dateToHuman };
