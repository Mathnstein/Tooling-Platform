import { CONFIG } from '#/core/config.js';
import { GQLContext } from '#/interfaces/context.interface.js';
import { JobResolvers } from '#/lib/resolvers/job.resolver.js';
import { ToolResolvers } from '#/lib/resolvers/tool.resolver.js';
import { MessengerService } from '#/lib/services/messenger.service.js';
import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { expressMiddleware } from '@as-integrations/express5';
import cors from 'cors';
import express, { Application } from 'express';
import http from 'http';
import 'reflect-metadata'; // Must be the first import for type-graphql to work properly
import { buildSchema } from 'type-graphql';


/**
 * GatewayServer is responsible for setting up and managing the GraphQL server that serves as the entry point for clients to interact with the system.
 * 
 * It initializes the Apollo Server with the defined type definitions and resolvers, sets up the Express application, and manages the lifecycle of the server.
 * 
 * The GatewayServer also integrates with the MessengerService to handle communication with RabbitMQ, allowing it to process messages as part of GraphQL queries and mutations.
 */
export class GatewayServer {
    private app: Application;
    private httpServer: http.Server;
    private apolloServer: ApolloServer<GQLContext>;
    private messengerService: MessengerService;
    private port: number;

    constructor() {
        this.port = CONFIG.PORT;
        this.app = express();
        this.httpServer = http.createServer(this.app);
        this.messengerService = new MessengerService();
    }

    public async buildSchema() {
        return buildSchema({
            resolvers: [JobResolvers, ToolResolvers], // Register your resolver classes here
            emitSchemaFile: !CONFIG.API_IN_CLUSTER,
            validate: false,
        });
    }

    public async start(): Promise<void> {
        const channel = await this.messengerService.init();
        const schema = await this.buildSchema();
        // TODO: In production, consider disabling introspection and the landing page for security hardening. You can use the `isDev` flag to conditionally enable these features.
        const isDev = CONFIG.IS_DEV;
        this.apolloServer = new ApolloServer<GQLContext>({
            schema,
            introspection: true, // Allow tools to query the schema in development, disable in production for security
            plugins: [
                ApolloServerPluginDrainHttpServer({ httpServer: this.httpServer }),
                ApolloServerPluginLandingPageLocalDefault({ embed: true })
                // TODO: DISABLE LANDING PAGE IN PROD
                // isDev
                //     ? ApolloServerPluginLandingPageLocalDefault({ embed: true })
                //     : ApolloServerPluginLandingPageDisabled(),
            ],
        });

        await this.apolloServer.start();

        this.app.use(
            '/graphql',
            cors(),
            express.json(),
            expressMiddleware<GQLContext>(this.apolloServer, {
                context: async () => ({ amqpChannel: channel }),
            })
        );

        return new Promise((resolve) => {
            this.httpServer.listen(this.port, '0.0.0.0', () => {
                console.log(`Gateway ready at http://localhost:${this.port}/graphql`);
                resolve();
            });
        });
    }

    public async stop(): Promise<void> {
        await this.messengerService.close();
        return new Promise((resolve, reject) => {
            this.httpServer.close((err) => {
                if (err) return reject(err);
                console.log('HTTP server stopped.');
                resolve();
            });
        });
    }
}