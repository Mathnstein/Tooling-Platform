export const typeDefs = `#graphql

    enum JobStatus {
        PENDING
        PROCESSING
        COMPLETED
        FAILED
        CANCELED
    }

    type Tool {
        hasAccess: Boolean!
        id: String!
        name: String!
        slug: String!
    }

    type Job {
        id: String!
        status: JobStatus!
        submittedBy: String!
        timeSubmitted: String!
        timeToProcess: Int!
        toolId: String!
        toolInput: String!
        }

    type Query {
        tools: [Tool]
        jobs: [Job]
    }

    input CreateJobInput {
        submittedBy: String!
        timeToProcess: Int!
        toolId: String!
        toolInput: String!
    }

    type Mutation {
        createJob(input: CreateJobInput!): Job
        cancelJob(id: String!): Job
    }
`;