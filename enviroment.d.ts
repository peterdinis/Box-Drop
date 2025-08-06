declare global {
    namespace NodeJS {
        interface ProcessEnv {
           NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: string;
           CLERK_SECRET_KEY: string;
           NEXT_PUBLIC_CLERK_SIGN_IN_URL: string;
           NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL: string;
           NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL: string;
           UPLOADTHING_TOKEN: string;
           UPSTASH_REDIS_REST_URL: string;
           UPSTASH_REDIS_REST_TOKEN: string;
        }
    }
}

export {};