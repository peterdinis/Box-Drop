import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ScrollToTop } from "@/components/shared/ScrollToTop";

describe("ScrollToTop", () => {
	const originalScrollTo = window.scrollTo;

	beforeEach(() => {
		window.scrollTo = vi.fn();
	});

	afterEach(() => {
		window.scrollTo = originalScrollTo;
		vi.restoreAllMocks();
	});

	it("does not render the button initially", () => {
		render(<ScrollToTop />);
		const button = screen.queryByRole("button");
		expect(button).toBeNull();
	});

	it("renders the button after scrolling past 300px", () => {
		render(<ScrollToTop />);

		// simulate scroll past 300px
		window.pageYOffset = 400;
		fireEvent.scroll(window);

		// wait a tick for useEffect to run
		const button = screen.getByRole("button");
		expect(button).toBeInTheDocument();
	});

	it("calls window.scrollTo on button click", () => {
		render(<ScrollToTop />);

		window.pageYOffset = 400;
		fireEvent.scroll(window);

		const button = screen.getByRole("button");
		fireEvent.click(button);

		expect(window.scrollTo).toHaveBeenCalledWith({
			top: 0,
			behavior: "smooth",
		});
	});
});
