import amqp from 'amqplib';
import { getUrl } from './utils.js';

let connection: amqp.ChannelModel;
let channel: amqp.Channel;

export const initRabbitMQ = async () => {
    try {
        const url = getUrl(false);
        connection = await amqp.connect(url);
        channel = await connection.createChannel();
        await channel.assertQueue('jobs_queue', { durable: true });
        console.log('Connected to RabbitMQ and channel initialized');
        return channel;
    } catch (err) {
        console.error('Failed to connect to RabbitMQ', err);
        throw err;
    }
}

export const getRabbitMQChannel = () => channel;

export interface RabbitMQEnvelope {
    payload: string;
    routing_key: string;
    message_count: number;
}

export const closeRabbitMQConnection = async () => {
    try {
        if (channel) await channel.close();
        if (connection) await connection.close();
        console.log('RabbitMQ connection closed');
    } catch (err) {
        console.error('Failed to close RabbitMQ connection', err);
    }
}