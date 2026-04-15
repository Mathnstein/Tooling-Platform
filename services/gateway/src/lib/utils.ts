
const apiDomain = process.env.API_DOMAIN;
const user = process.env.MESSENGER_USER;
const pass = process.env.MESSENGER_PASS;

/**
 * Utility function to construct the appropriate URL for either HTTP or AMQP based on the environment and credentials.
 * @param isHttp - A boolean indicating whether to construct an HTTP URL (true) or an AMQP URL (false).
 * @returns The constructed URL as a string.
 */
export const getUrl = (isHttp: boolean, path?: string) => {
    // For HTTP, we want the management API endpoint on port 15672; for AMQP, we want the connection string on port 5672
    if (isHttp) return `http://${apiDomain}:15672/api${path ? `/${path}` : ''}`;
    else return `amqp://${user}:${pass}@${apiDomain}:5672`;
};