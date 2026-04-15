import { QUEUES } from '#/lib/utility/constants.js';
import { getAmqpUrl } from '#/lib/utility/utils.js';
import amqp, { Channel, ChannelModel } from 'amqplib';

export interface MessageEnvelope {
    payload: string;
    routing_key: string;
    message_count: number;
}

/**
 * Manages the high-performance AMQP connection and channel lifecycle.
 * 
 * The MessengerService is responsible for establishing the binary connection 
 * to the RabbitMQ broker, creating a communication channel, and ensuring 
 * that required queues are created before the application starts.
 * 
 * @remarks
 * This service uses the `amqplib` library and communicates over port 5672 (AMQP).
 */
export class MessengerService {
    private connection: ChannelModel | null = null;
    private channel: Channel | null = null;

    /**
     * Initializes the RabbitMQ connection and asserts the provided queues.
     * @returns A promise resolving to the active AMQP Channel.
     * @throws {Error} If the connection fails or credentials are invalid.
     */
    public async init(): Promise<Channel> {
        try {
            this.connection = await amqp.connect(getAmqpUrl());
            this.channel = await this.connection.createChannel();

            // Ensure each queue
            for (const queueName of Object.values(QUEUES)) {
                await this.channel.assertQueue(queueName, { durable: true });
            }

            console.log('Connected to RabbitMQ');
            return this.channel;
        } catch (err) {
            console.error('Failed to connect to RabbitMQ', err);
            throw err;
        }
    }

    /**
     * Returns the active AMQP channel. 
     * @returns The current RabbitMQ channel.
     * @throws {Error} If called before {@link init} has successfully completed.
     */
    public getChannel(): Channel {
        if (!this.channel) {
            throw new Error('MessengerService not initialized. Call init() first.');
        }
        return this.channel;
    }

    /**
     * Gracefully closes the AMQP channel and the underlying connection.
     * 
     * Should be called during the application's shutdown sequence (SIGINT/SIGTERM)
     * to prevent hanging connections or data loss.
     */
    public async close(): Promise<void> {
        try {
            if (this.channel) await this.channel.close();
            if (this.connection) await this.connection.close();
            console.log('RabbitMQ connection closed');
        } catch (err) {
            console.error('Failed to close RabbitMQ connection', err);
        }
    }
}