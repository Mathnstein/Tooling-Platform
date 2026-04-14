import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginLandingPageDisabled } from '@apollo/server/plugin/disabled';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { startStandaloneServer } from '@apollo/server/standalone';
import 'dotenv/config';

interface Tool {
  id: string;
  name: string;
  slug: string;
  hasAccess: boolean;
}

interface Job {
  id: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  queue: string;
}



const typeDefs = `#graphql
  type Tool {
    id: ID!
    name: String!
    slug: String!
    hasAccess: Boolean!
  }

  type Job {
    id: ID!
    status: String!
    queue: String!
  }

  type Query {
    tools: [Tool]
    jobs: [Job]
  }
`;

const resolvers = {
  Query: {
    tools: (): Tool[] => [
      { id: '1', name: 'Network Scanner', slug: 'network-scanner', hasAccess: true },
    ],
    jobs: async () => {
      const user = process.env.MESSENGER_USER;
      const pass = process.env.MESSENGER_PASS;

      if (!user || !pass) {
        console.error("Messenger credentials missing from environment!");
        return [];
      }

      const auth = Buffer.from(`${user}:${pass}`).toString('base64');

      try {
        const res = await fetch('http://messenger-service:15672/api/queues', {
          headers: { 'Authorization': `Basic ${auth}` }
        });
        // ... rest of logic
      } catch (err) {
        console.error(err);
        return [];
      }
    }
  },
};

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
  listen: { port }
});

console.log(`🚀 Gateway ready at: ${url}`);