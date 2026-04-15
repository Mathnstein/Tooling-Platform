import { mergeResolvers, mergeTypeDefs } from '@graphql-tools/merge';
import { JobResolvers } from "./job.resolver.js";
import { jobTypeDefs } from "./job.schema.js";
import { ToolResolvers } from "./tool.resolver.js";
import { toolTypeDefs } from "./tool.schema.js";

const jobResolvers = new JobResolvers();
const toolResolvers = new ToolResolvers();

/**
 * Merges all individual resolver instances into a single resolver object for the GraphQL server.
 * 
 * This allows the server to have a unified set of resolvers that can handle queries and mutations for all defined types.
 * 
 * Each resolver instance corresponds to a specific domain (e.g., jobs, tools) and is responsible for handling the logic related to that domain.
 */
export const resolvers = mergeResolvers([
    jobResolvers.getResolvers(),
    toolResolvers.getResolvers(),
]);

/**
 * Merges all individual type definitions into a single schema definition for the GraphQL server.
 * 
 * This allows the server to have a unified schema that defines all the types, queries, and mutations available to clients.
 * 
 * Each type definition corresponds to a specific domain (e.g., jobs, tools) and defines the structure of the data and operations related to that domain.
 */
export const typeDefs = mergeTypeDefs([
    jobTypeDefs,
    toolTypeDefs
]);