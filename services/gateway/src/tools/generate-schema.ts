import "reflect-metadata"; // Must be the first import for type-graphql to work properly

async function generate() {
    console.log("Generating GraphQL schema...");
    const { GatewayServer } = await import('#/core/server.js');
    await new GatewayServer().buildSchema();
    console.log("✅ Schema generated successfully!");
    process.exit(0);
}

generate().catch((err) => {
    console.error(err);
    process.exit(1);
});