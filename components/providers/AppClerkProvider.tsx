"use client"

import { FC, ReactNode } from "react"
import { ClerkProvider } from "@clerk/nextjs"

type AppClerkProviderProps = {
    children: ReactNode
}

const AppClerkProvider: FC<AppClerkProviderProps> = ({ children }) => {
    return (
        <ClerkProvider>
            {children}
        </ClerkProvider>
    )
}

export default AppClerkProvider