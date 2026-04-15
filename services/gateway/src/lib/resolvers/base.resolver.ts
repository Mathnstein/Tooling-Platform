import { GQLContext } from '#/interfaces/context.interface.js';
import { QueueClientService } from '#/lib/services/queue-client.service.js';
import { IResolvers } from '@graphql-tools/utils';

/**
 * Abstract Base class for all GraphQL resolvers.
 * Provides access to shared utilities and standardizes the resolver format.
 */
export abstract class BaseResolver {
    protected readonly queueClient = new QueueClientService();
    protected readonly queueName: string | undefined;

    constructor(queueName?: string) {
        this.queueName = queueName;
    }

    /**
     * Safe getter for children that require a queue.
     */
    protected getQueueName(): string {
        if (!this.queueName) {
            throw new Error(`[${this.constructor.name}] accessed a queue but none was defined in constructor.`);
        }
        return this.queueName;
    }

    /**
     * Retrieves and processes messages from the queue.
     * @param count - The number of messages to retrieve.
     * @param mapper - An optional function to transform the parsed JSON into your target type.
     * @returns An array of processed messages of type T.
     */
    protected async getAndProcessMessages<T>(
        count: number,
        mapper?: (parsed: any) => T
    ): Promise<T[]> {
        const queue = this.getQueueName();
        const rawMessages = await this.queueClient.getMessages(queue, count);

        return this.processMessages<T>(rawMessages, mapper);
    }

    /**
     * Generically parses RabbitMQ messages and filters out failures.
     * @param messages - The raw message array from QueueClient.
     * @param mapper - A function to transform the parsed JSON into your target type. Defaults to the identity function.
     */
    protected processMessages<T>(
        messages: any[],
        mapper?: (parsed: any) => T
    ): T[] {
        return messages
            .map((msg): T | null => {
                try {
                    // 1. Basic JSON validation
                    if (!msg.payload) return null;
                    const parsed = JSON.parse(msg.payload);

                    // 2. Delegate the specific mapping/soft-fails to the child
                    return mapper ? mapper(parsed) : (parsed as T);
                } catch (e) {
                    console.error(`[${this.constructor.name}] Failed to parse message:`, e);
                    return null;
                }
            })
            .filter((item): item is T => item !== null);
    }

    /**
     * Returns resolvers formatted for Apollo
     */
    public abstract getResolvers(): IResolvers<any, GQLContext>


}