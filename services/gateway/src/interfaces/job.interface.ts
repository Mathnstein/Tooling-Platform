import amqp from 'amqplib';

export type JobStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELED';

export interface CreateJobInput {
    toolId: string;
    toolInput: string; // Input data for the tool, can be extended as needed
    timeToProcess: number; // Time in seconds for a fake delay
    submittedBy: string; // User who submitted the job
}

export interface Job extends CreateJobInput {
    id: string;
    timeSubmitted: string;
    status: JobStatus;
}

export interface JobGQLContext {
    amqpChannel: amqp.Channel;
}