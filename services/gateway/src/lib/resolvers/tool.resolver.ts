import { Tool } from '#/interfaces/context.interface.js';
import { Query } from 'type-graphql';
import { BaseResolver } from './base.resolver.js';

/**
 * GraphQL resolvers for tool-related queries and mutations.
 * This class extends the BaseResolver to leverage common functionality for interacting with RabbitMQ.
 * It provides resolvers for fetching tools and performing tool-related mutations.
 */
export class ToolResolvers extends BaseResolver {

    /**
     * TODO: Implement actual logic to fetch tools
     * Gets a list of tools available to the user.
     * @returns An array of Tool objects representing the available tools.
     */
    @Query(() => [Tool], { name: "tools", description: "Gets a list of tools available to the user." })
    getTools() {
        // Logic to fetch tools, potentially from RabbitMQ or another data source
        return [{ id: '1', name: 'Example Tool', slug: 'example-tool', hasAccess: true }];
    }
}