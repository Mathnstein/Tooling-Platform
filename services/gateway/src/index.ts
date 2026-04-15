import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginLandingPageDisabled } from '@apollo/server/plugin/disabled';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { startStandaloneServer } from '@apollo/server/standalone';
import 'dotenv/config';
import { closeRabbitMQConnection, initRabbitMQ } from './lib/rabbitmq.js';
import { resolvers } from './lib/resolvers.js';
import { typeDefs } from './schema/index.js';

const channel = await initRabbitMQ();

const isDevelopment = process.env.NODE_ENV === 'development';
const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: isDevelopment, // Enable introspection in development for tools like GraphQL Playground
  plugins: [
    isDevelopment
      ? ApolloServerPluginLandingPageLocalDefault({ embed: true }) // Use GraphQL Playground in development
      : ApolloServerPluginLandingPageDisabled() // Disable landing page in production
  ]
});

// Pull port from env, default to 4000
const port = parseInt(process.env.PORT || '4000', 10);

// Start the server
const { url } = await startStandaloneServer(server, {
  listen: { port },
  context: async () => {
    // Create and return the context for each request
    const amqpChannel = channel; // Use the initialized AMQP channel
    return { amqpChannel };
  }
});

console.log(`Gateway ready at: ${url}`);

const shutdown = async (signal: string) => {
  console.log(`Received ${signal}, shutting down...`);
  await closeRabbitMQConnection();
  process.exit(0);
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));