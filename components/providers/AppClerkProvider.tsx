"use client";

import { ClerkProvider } from "@clerk/nextjs";
import type { FC, ReactNode } from "react";

type AppClerkProviderProps = {
	children: ReactNode;
};

const AppClerkProvider: FC<AppClerkProviderProps> = ({ children }) => {
	return <ClerkProvider>{children}</ClerkProvider>;
};

export default AppClerkProvider;
