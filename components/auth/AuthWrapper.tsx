"use client";

import type { FC, ReactNode } from "react";

type AuthWrapperProps = {
	children?: ReactNode;
};

const AuthWrapper: FC<AuthWrapperProps> = ({ children }) => {
	return <div className="flex justify-center align-top pt-16">{children}</div>;
};

export default AuthWrapper;
