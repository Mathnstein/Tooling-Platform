'use client';

import { ApolloLink, HttpLink } from "@apollo/client";
import { ApolloClient, ApolloNextAppProvider, InMemoryCache, SSRMultipartLink } from "@apollo/client-integration-nextjs";

function makeClient() {
  const uri = `http://localhost:${
      process.env.API_IN_CLUSTER === 'true' 
        ? process.env.NEXT_PUBLIC_CLUSTER_PORT 
        : process.env.NEXT_PUBLIC_LOCAL_PORT
    }/graphql`;
  const httpLink = new HttpLink({uri});
  console.log("Connecting to API at:", uri);

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