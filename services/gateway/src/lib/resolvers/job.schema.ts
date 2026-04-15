export const jobTypeDefs = `#graphql
  type Job {
    id: ID!
    status: String!
    timeSubmitted: String!
    submittedBy: String
    isCanceled: Boolean
  }

  input CreateJobInput {
    submittedBy: String
    # ... other fields
  }

  input CancelJobInput {
    id: ID!
  }

  type Query {
    jobs: [Job!]!
    canceledJobs: [ID!]!
  }

  type Mutation {
    createJob(input: CreateJobInput!): Job!
    cancelJob(input: CancelJobInput!): Boolean!
  }
`;