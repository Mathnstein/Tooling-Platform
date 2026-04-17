import { GQLContext } from "#/interfaces/context.interface.js";
import { CancelJobInput, CreateJobInput, Job, JobStatus, ReenableJobInput } from "#/interfaces/job.interface.js";
import { canceledJobStore } from "#/lib/stores/canceled-job.store.js";
import { QUEUES } from "#/lib/utility/constants.js";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { BaseResolver } from "./base.resolver.js";

/**
 * GraphQL resolvers for job-related queries and mutations.
 * This class extends the BaseResolver to leverage common functionality for interacting with RabbitMQ.
 * It provides resolvers for fetching jobs, creating new jobs, and canceling existing jobs.
 */
@Resolver(() => Job)
export class JobResolvers extends BaseResolver {
    constructor() {
        super(QUEUES.JOB_QUEUE);
    }

    /**
     * Fetches a list of jobs from the RabbitMQ queue.
     * @returns A promise that resolves to an array of jobs. Each job includes an `isCanceled` field that indicates whether the job has been canceled.
     */
    @Query(() => [Job], { name: "jobs", description: "Fetches a list of jobs from the queue. Each job includes an `isCanceled` field that indicates whether the job has been canceled." })
    async getJobs() {
        return this.getAndProcessMessages<Job>(10, (parsed) => ({
            ...parsed,
            isCanceled: canceledJobStore.has(parsed.id),
        }));
    }

    /**
     * Fetches a list of canceled jobs from the store.
     * @returns An array of canceled jobs.
     */
    @Query(() => [Job], { name: "canceledJobs", description: "Fetches a list of canceled jobs from the store." })
    getCanceledJobs() {
        return canceledJobStore.getAll();
    }

    /**
     * Creates a new job and publishes it to the RabbitMQ queue.
     * @param input - The input data for the new job.
     * @param param1 - The GraphQL context containing the AMQP channel.
     * @returns The newly created job.
     */
    @Mutation(() => Job, { name: "createJob", description: "Creates a new job and publishes it to the RabbitMQ queue." })
    async createJob(
        @Arg("input", () => CreateJobInput) input: CreateJobInput,
        @Ctx() { amqpChannel }: GQLContext
    ) {
        // Logic to create a job and publish to RabbitMQ
        const newJob: Job = {
            id: crypto.randomUUID(),
            timeSubmitted: new Date().toISOString(),
            status: JobStatus.PENDING,
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
    @Mutation(() => Boolean, { name: "cancelJob", description: "Cancels a job by adding its ID to the canceled job store." })
    cancelJob(@Arg("input", () => CancelJobInput) input: CancelJobInput) {
        const { id } = input;
        canceledJobStore.add(id);
        return true;
    }

    /**
     * Reenables a job by removing its ID from the canceled job store.
     * @param input - The input data containing the ID of the job to reenable.
     * @returns A boolean indicating whether the job was successfully reenabled.
     */
    @Mutation(() => Boolean, { name: "reenableJob", description: "Reenables a job by removing its ID from the canceled job store." })
    reenableJob(@Arg("input", () => ReenableJobInput) input: ReenableJobInput) {
        const { id } = input;
        canceledJobStore.remove(id);
        return true;
    }
}