declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: 'development' | 'production';
            DISCORD_TOKEN: string;
            MONGODB_SRV: string;
            SAFE_BROWSING_KEY: string;
            MAIN_SERVER_ID: string;
        }
    }
}

export { }