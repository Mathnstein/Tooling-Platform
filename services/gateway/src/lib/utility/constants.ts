/**
 * Defines the queues used by the Gateway service to communicate with rabbitMQ.
 * Each queue corresponds to a specific type of message or task that the service handles.
 * @remarks
 * These constants should be used throughout the application to ensure consistency and avoid hardcoding queue names.
 */
export const QUEUES = {
    JOB_QUEUE: 'job_queue'
};