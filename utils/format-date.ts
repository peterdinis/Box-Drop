import { format } from "date-fns";

export function formatDate(value: unknown): string {
	if (!value) return "-";

	let date: Date;

	if (typeof value === "number") {
		date = new Date(value < 10_000_000_000 ? value * 1000 : value);
	} else if (typeof value === "string" || value instanceof Date) {
		date = new Date(value);
	} else {
		return "-";
	}

	if (isNaN(date.getTime())) return "-";

	return format(date, "dd.MM.yyyy");
}
