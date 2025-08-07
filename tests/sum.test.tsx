import { expect, test } from "vitest";
import { sum } from "./utils/sum";

test("adds two numbers", () => {
	expect(sum(1, 2)).toBe(3);
});
