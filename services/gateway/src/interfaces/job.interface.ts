import { Field, ID, InputType, Int, ObjectType, registerEnumType } from "type-graphql";

export enum JobStatus {
    PENDING = 'PENDING',
    PROCESSING = 'PROCESSING',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED',
    CANCELED = 'CANCELED',
}

registerEnumType(JobStatus, {
    name: "JobStatus",
    description: "The current execution state of a job",
});

@InputType()
export class CreateJobInput {
    @Field(() => String, { description: "The unique identifier of the tool to be executed" })
    toolId: string;

    @Field(() => String, { description: "The input provided to the tool for processing" })
    toolInput: string;

    @Field(() => Int, { description: "The time allocated for the job to process" })
    timeToProcess: number;

    @Field(() => String, { description: "The user who submitted the job" })
    submittedBy: string;
}

@InputType()
export class CancelJobInput {
    @Field(() => ID, { description: "The unique identifier of the job to be canceled" })
    id: string;
}

@InputType()
export class ReenableJobInput {
    @Field(() => ID, { description: "The unique identifier of the job to be reenabled" })
    id: string;
}

@ObjectType({ description: "Represents a job submitted to the system for processing. Contains details about the job's parameters, status, and metadata." })
export class Job {
    @Field(() => ID, { description: "The unique identifier of the job" })
    id: string;

    @Field(() => String, { description: "The unique identifier of the tool associated with the job" })
    toolId: string;

    @Field(() => String, { description: "The input provided to the tool for processing" })
    toolInput: string;

    @Field(() => Int, { description: "The time allocated for the job to process" })
    timeToProcess: number;

    @Field(() => String, { description: "The user who submitted the job" })
    submittedBy: string;

    @Field(() => String, { description: "The time when the job was submitted" })
    timeSubmitted: string;

    @Field(() => JobStatus, { description: "The current execution state of the job" })
    status: JobStatus;

    @Field(() => Boolean, { nullable: true, description: "Indicates whether the job has been canceled" })
    isCanceled?: boolean;
}