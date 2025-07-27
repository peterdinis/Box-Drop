import { type Config, defineConfig } from "drizzle-kit";

export default defineConfig({
	out: "./drizzle",
	schema: "./db/schema.ts",
	dialect: "sqlite",
	dbCredentials: {
		url: "db.sqlite"
	}
}) satisfies Config;
