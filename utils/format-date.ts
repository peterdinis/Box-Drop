import { format } from "date-fns";

export function formatDate(value: unknown): string {
	if (!value) return "-";

	try {
		let date: Date;

		if (typeof value === "number") {
			date = new Date(value > 1e12 ? value : value * 1000);
		} else if (typeof value === "string" || value instanceof Date) {
			date = new Date(value);
		} else {
			return "-";
		}

		if (isNaN(date.getTime())) return "-";

		const year = date.getFullYear();
		if (year < 1970 || year > 2100) return "-";

		return format(date, "dd.MM.yyyy");
	} catch {
		return "-";
	}
}
