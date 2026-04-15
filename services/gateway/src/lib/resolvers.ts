import { CreateJobInput, Job, JobGQLContext } from "@/interfaces/job.interface.js";
import { Tool } from "@/interfaces/tool.interface.js";
import { RabbitMQEnvelope } from "./rabbitmq.js";
import { getUrl } from "./utils.js";

const jobQueueName = 'jobs_queue';
// TODO: We will handle passing this to the workers and they will look when a job has started to then cancel
const canceledJobs = new Set<string>();

export const resolvers = {
    Query: {
        tools: (): Tool[] => [],
        jobs: async () => {
            const user = process.env.MESSENGER_USER;
            const pass = process.env.MESSENGER_PASS;

            if (!user || !pass) {
                console.error("Messenger credentials missing from environment!");
                return [];
            }

            const auth = Buffer.from(`${user}:${pass}`).toString('base64');

            try {
                const url = getUrl(true, `queues/%2f/${jobQueueName}/get`);
                const res = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Basic ${auth}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        count: 50,
                        ackmode: 'ack_requeue_true',
                        encoding: 'auto'
                    })
                });

                if (!res.ok) return [];

                const messages = (await res.json()) as RabbitMQEnvelope[];

                const jobs = messages.map((msg: any): Job | null => {
                    try {
                        const parsed = JSON.parse(msg.payload) as Job;

                        return { ...parsed };
                    } catch (e) {
                        return null;
                    }
                }).filter((job): job is Job => job !== null);

                return jobs;
            } catch (err) {
                console.error("Failed to fetch jobs:", err);
                return [];
            }
        }
    },
    Mutation: {
        createJob: async (_: any, { input }: { input: CreateJobInput }, { amqpChannel }: JobGQLContext) => {
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
            amqpChannel.sendToQueue(jobQueueName, payload, { persistent: true });
            console.log(`Published job ${newJob.id} to RabbitMQ`);
            return newJob;
        },
        cancelJob: async (_: any, { id }: { id: string }) => {
            canceledJobs.add(id);
            console.log(`Job ${id} marked as canceled.`);
            return true;
        },
    }
};