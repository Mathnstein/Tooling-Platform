import { GQLContext } from '#/interfaces/context.interface.js';
import { IResolvers } from '@graphql-tools/utils';
import { BaseResolver } from './base.resolver.js';

/**
 * GraphQL resolvers for tool-related queries and mutations.
 * This class extends the BaseResolver to leverage common functionality for interacting with RabbitMQ.
 * It provides resolvers for fetching tools and performing tool-related mutations.
 */
export class ToolResolvers extends BaseResolver {
    public getResolvers(): IResolvers<any, GQLContext> {
        return {
            Query: {
                tools: () => [{ id: '1', name: 'Example Tool' }],
            },
            Mutation: {}
        };
    }
}