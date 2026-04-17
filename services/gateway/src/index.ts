import 'reflect-metadata'; // Polyfill loads first, globally.

/**
 * Bootstrap function to start the Gateway Server.
 */
const bootstrap = async () => {
  try {
    // Dynamically import the server. This prevents ESM from hoisting 
    // the GatewayServer (and its decorators) before reflect-metadata is ready.
    const { GatewayServer } = await import('#/core/server.js');

    const server = new GatewayServer();

    await server.start();

    // Handle graceful shutdown
    // We define this inside bootstrap or pass 'server' to a handler 
    // to ensure it has access to the initialized instance.
    const shutdown = async (signal: string) => {
      console.log(`\nReceived ${signal}, initiating graceful shutdown...`);

      const forceExit = setTimeout(() => {
        console.error('Graceful shutdown timed out, forcing exit.');
        process.exit(1);
      }, 5000);

      try {
        await server.stop();
        clearTimeout(forceExit);
        console.log('Successfully shut down services. Goodbye!');
        process.exit(0);
      } catch (err) {
        console.error('Error during shutdown:', err);
        process.exit(1);
      }
    };

    ['SIGINT', 'SIGTERM'].forEach(signal =>
      process.on(signal, () => shutdown(signal))
    );

  } catch (err) {
    console.error('Failed to start Gateway Server:', err);
    process.exit(1);
  }
};

// Let's go
bootstrap();