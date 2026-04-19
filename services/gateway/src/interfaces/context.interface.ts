import { PrismaClient } from '#/generated/prisma/client.js';
import { Channel } from 'amqplib';

export * from './job.interface.js';
export * from './tool.interface.js';

export class GQLContext {
    amqpChannel: Channel;
    prisma: PrismaClient;
}