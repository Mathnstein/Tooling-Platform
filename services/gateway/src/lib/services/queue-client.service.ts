import { getAuthHeader, getHttpApiUrl } from '#/lib/utility/utils.js';
import { MessageEnvelope } from './messenger.service.js';

/**
 * A specialized HTTP client for interacting with the RabbitMQ Management API.
 * 
 * This service handles authorized REST requests to inspect queues, fetch messages,
 * and retrieve broker statistics using Basic Authentication.
 *  @remarks
 * This client communicates over port 15672 (HTTP) and is intended for 
 * management/inspection tasks, not high-frequency message publishing.
 */
export class QueueClientService {
    /**
     * Pre-encoded Basic Auth header for RabbitMQ Management API requests.
     */
    private readonly authHeader = getAuthHeader();

    /**
     * Internal helper to execute authorized fetch requests to the Management API.
     * @template T - The expected return type of the JSON response.
     * @param path - The API endpoint path (e.g., 'queues/%2f/jobs_queue').
     * @param options - Standard RequestInit options for fetch.
     * @returns The parsed JSON response of type T.
     */
    private async request<T>(path?: string, options: RequestInit = {}): Promise<T> {
        const url = getHttpApiUrl(path);

        const response = await fetch(url, {
            ...options,
            headers: {
                'Authorization': this.authHeader,
                'Content-Type': 'application/json',
                ...options.headers,
            },
        });

        if (!response.ok) {
            throw new Error(`QueueClient Error: [${response.status}] ${response.statusText}`);
        }

        return response.json() as Promise<T>;
    }

    /**
     * Retrieves a batch of messages from a specific queue without consuming them.
     * @param queueName - The name of the RabbitMQ queue (e.g., 'jobs_queue').
     * @param count - The maximum number of messages to retrieve. Defaults to 10.
     * @returns A promise resolving to an array of raw message objects from the queue.
     * @throws {Error} If the API responds with a non-200 status code.
     */
    public async getMessages(queueName: string, count: number = 10): Promise<MessageEnvelope[]> {
        return this.request<MessageEnvelope[]>(`queues/%2f/${queueName}/get`, {
            method: 'POST',
            body: JSON.stringify({
                count,
                ackmode: 'ack_requeue_true', // Keeps messages in queue for workers
                encoding: 'auto',
            }),
        });
    }

    /**
     * Get queue statistics (depth, consumers, etc.)
     * @param queueName - The name of the RabbitMQ queue to inspect.
     * @returns A promise resolving to the queue information object.
     */
    public async getQueueInfo(queueName: string) {
        return this.request(`queues/%2f/${queueName}`);
    }
}