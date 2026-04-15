export const toolTypeDefs = `#graphql
  type Tool {
    hasAccess: Boolean!
    id: String!
    name: String!
    slug: String!
  }

  type Query {
    tools: [Tool]
  }
`;