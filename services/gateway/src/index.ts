import { GatewayServer } from '#/core/server.js';

const server = new GatewayServer();

/**
 * Bootstrap function to start the Gateway Server. This function initializes the server and handles any errors that may occur during startup.
 * If the server starts successfully, it will log a message indicating that it is ready. If there is an error during startup, it will log the error and exit the process with a non-zero status code.
 */
const bootstrap = async () => {
  try {
    await server.start();
  } catch (err) {
    console.error('Failed to start Gateway Server:', err);
    process.exit(1);
  }
}

/**
 * Handles graceful shutdown of the Gateway Server. This function is triggered by termination signals (e.g., SIGINT, SIGTERM) and ensures that the server stops gracefully, releasing all resources and closing connections.
 * @param signal The signal that triggered the shutdown.
 */
const shutdown = async (signal: string) => {
  console.log(`\nReceived ${signal}, initiating graceful shutdown...`);

  // Set a forced timeout in case things hang during stop
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

// Listen for termination signals
['SIGINT', 'SIGTERM'].forEach(signal => process.on(signal, () => shutdown(signal)));

// Let's go
bootstrap();