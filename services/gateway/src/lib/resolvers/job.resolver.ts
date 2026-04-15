import { GQLContext } from "#/interfaces/context.interface.js";
import { CancelJobInput, CreateJobInput, Job } from "#/interfaces/job.interface.js";
import { canceledJobStore } from "#/lib/stores/canceled-job.store.js";
import { QUEUES } from "#/lib/utility/constants.js";
import { IResolvers } from "@graphql-tools/utils";
import { BaseResolver } from "./base.resolver.js";

/**
 * GraphQL resolvers for job-related queries and mutations.
 * This class extends the BaseResolver to leverage common functionality for interacting with RabbitMQ.
 * It provides resolvers for fetching jobs, creating new jobs, and canceling existing jobs.
 */
export class JobResolvers extends BaseResolver {
    constructor() {
        super(QUEUES.JOB_QUEUE);
    }

    public getResolvers(): IResolvers<any, GQLContext> {
        return {
            Query: {
                jobs: () => this.getJobs(),
                canceledJobs: () => this.getCanceledJobs(),
            },
            Mutation: {
                createJob: (_, { input }, context) => this.createJob(input, context),
                cancelJob: (_, { input }) => this.cancelJob(input),
            }
        };
    }

    /**
     * Fetches a list of jobs from the RabbitMQ queue.
     * @returns A promise that resolves to an array of jobs. Each job includes an `isCanceled` field that indicates whether the job has been canceled.
     */
    private async getJobs() {
        return this.getAndProcessMessages<Job>(10, (parsed) => ({
            ...parsed,
            isCanceled: canceledJobStore.has(parsed.id),
        }));
    }

    /**
     * Fetches a list of canceled jobs from the store.
     * @returns An array of canceled jobs.
     */
    private getCanceledJobs() {
        return canceledJobStore.getAll();
    }

    /**
     * Creates a new job and publishes it to the RabbitMQ queue.
     * @param input - The input data for the new job.
     * @param param1 - The GraphQL context containing the AMQP channel.
     * @returns The newly created job.
     */
    private async createJob(input: CreateJobInput, { amqpChannel }: GQLContext) {
        // Logic to create a job and publish to RabbitMQ
        const newJob: Job = {
            id: crypto.randomUUID(),
            timeSubmitted: new Date().toISOString(),
            status: 'PENDING',
            ...input
        };

        if (!amqpChannel) {
            console.error('AMQP channel not available in context!');
            return newJob; // Return job even if we can't publish, or handle as needed
        }

        // Publish to RabbitMQ using context.amqpChannel
        const payload = Buffer.from(JSON.stringify(newJob));
        const wasSent = amqpChannel.sendToQueue(this.getQueueName(), payload, { persistent: true });
        if (wasSent) {
            console.log(`Published job ${newJob.id} to RabbitMQ`);
        } else {
            console.error(`Failed to publish job ${newJob.id} to RabbitMQ`);
        }
        return newJob;
    }

    /**
     * Cancels a job by adding its ID to the canceled job store.
     * @param input - The input data containing the ID of the job to cancel.
     * @returns A boolean indicating whether the job was successfully canceled.
     */
    private cancelJob(input: CancelJobInput) {
        const { id } = input;
        canceledJobStore.add(id);
        return true;
    }
}