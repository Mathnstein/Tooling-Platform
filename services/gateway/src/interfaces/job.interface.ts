import { JobStatus } from "#/generated/prisma/enums.js";
import { GraphQLJSONObject } from "graphql-type-json";
import { Field, ID, InputType, ObjectType, registerEnumType, } from "type-graphql";
import { User } from './user.interface.js';

registerEnumType(JobStatus, {
    name: "JobStatus",
    description: "The current execution state of a job",
});

@InputType()
export class CreateJobInput {
    @Field(() => String, { description: "The unique identifier of the tool to be executed" })
    toolId: string;

    @Field(() => GraphQLJSONObject, { description: "The input provided to the tool for processing" })
    toolInput: any;

    @Field(() => String, { description: "The user who submitted the job" })
    submittedById: String;
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

    @Field(() => GraphQLJSONObject, { description: "The input provided to the tool for processing" })
    toolInput: any;

    @Field(() => User, { description: "The user who submitted the job" })
    submittedBy: User;

    @Field(() => Date, { description: "The time when the job was submitted" })
    timeSubmitted: Date;

    @Field(() => JobStatus, { description: "The current execution state of the job" })
    status: JobStatus;

    @Field(() => Boolean, { nullable: true, description: "Indicates whether the job has been canceled" })
    isCanceled?: boolean;
}