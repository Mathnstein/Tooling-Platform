'use client';

import { ApolloLink, HttpLink } from "@apollo/client";
import { ApolloClient, ApolloNextAppProvider, InMemoryCache, SSRMultipartLink } from "@apollo/client-integration-nextjs";


function makeClient() {
  const httpLink = new HttpLink({
    // We use the environment variables from your generated .env
    uri: `http://localhost:${
      process.env.NEXT_PUBLIC_API_MODE === 'local' 
        ? process.env.NEXT_PUBLIC_LOCAL_PORT 
        : process.env.NEXT_PUBLIC_CLUSTER_PORT
    }/graphql`,
  });

  return new ApolloClient({
    cache: new InMemoryCache(),
    link:
      typeof window === "undefined"
        ? ApolloLink.from([
            new SSRMultipartLink({ stripDefer: true }),
            httpLink,
          ])
        : httpLink,
  });
}

export function ApolloWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ApolloNextAppProvider makeClient={makeClient}>
      {children}
    </ApolloNextAppProvider>
  );
}