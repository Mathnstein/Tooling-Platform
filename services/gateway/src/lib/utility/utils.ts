import { CONFIG } from '#/core/config.js';

/**
 * Generates the Basic Authentication header for the Messenger service.
 * @returns The Basic Authentication header string.
 */
export const getAuthHeader = (): string => {
    const { USER, PASS } = CONFIG.MESSENGER;
    return `Basic ${Buffer.from(`${USER}:${PASS}`).toString('base64')}`;
};

/**
 * Constructs the AMQP connection string for RabbitMQ.
 * @returns The AMQP connection string.
 */
export const getAmqpUrl = (): string => {
    const { USER, PASS, DOMAIN } = CONFIG.MESSENGER;
    const url = new URL(`amqp://${DOMAIN}:5672`);
    url.username = USER;
    url.password = PASS;
    return url.toString();
};

/**
 * Constructs the URL for the RabbitMQ Management HTTP API.
 * Handles path normalization to prevent double slashes.
 * @param path - Optional API endpoint path (e.g., 'queues/%2f/jobs_queue').
 * @returns The full URL to the RabbitMQ Management API endpoint.
 * @remarks If no path is provided, returns the base API URL.
 */
export const getHttpApiUrl = (path?: string): string => {
    const { DOMAIN } = CONFIG.MESSENGER;
    const baseUrl = `http://${DOMAIN}:15672/api`;

    if (!path) return baseUrl;

    // Remove leading slash if provided to prevent 'api//path'
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;

    return `${baseUrl}/${cleanPath}`;
};