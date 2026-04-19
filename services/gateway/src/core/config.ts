import 'dotenv/config';

const getEnv = (key: string, defaultValue?: string): string => {
    const value = process.env[key] || defaultValue;
    if (value === undefined) {
        throw new Error(`Config Error: Missing required environment variable "${key}"`);
    }
    return value;
};

/**
 * Centralized configuration object for the Gateway service.
 * 
 * This object gathers all configuration values from environment variables,
 * providing a single source of truth for the application's configuration.
 * @remarks
 * This configuration object is read-only and should not be modified at runtime.
 */
export const CONFIG = {
    PORT: parseInt(getEnv('PORT', '4000'), 10),
    MESSENGER: {
        USER: getEnv('MESSENGER_USER'),
        PASS: getEnv('MESSENGER_PASS'),
        DOMAIN: getEnv('API_DOMAIN', 'localhost'),
    },
    DATABASE_URL: getEnv('DATABASE_URL'),
    API_IN_CLUSTER: getEnv('API_IN_CLUSTER') === 'true',
    IS_DEV: getEnv('NODE_ENV') === 'development',
} as const; // 'as const' makes the config read-only