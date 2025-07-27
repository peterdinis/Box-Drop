import { type Config, defineConfig } from "drizzle-kit";

export default defineConfig({
	out: "./drizzle",
	schema: "./db/schema.ts",
	dialect: "sqlite",
}) satisfies Config;