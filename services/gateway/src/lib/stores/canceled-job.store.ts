/**
 * A simple in-memory store to keep track of canceled job IDs.
 * This allows us to quickly check if a job has been canceled without needing to query RabbitMQ or a database.
 * Note: This store is not persistent and will be reset if the server restarts. For a production system, consider using a more robust solution (e.g., Redis).
 */
export class CanceledJobStore {
    // Use a Set for O(1) lookups
    private store = new Set<string>();

    /**
     * Adds a job ID to the canceled list.
     */
    public add(id: string): void {
        this.store.add(id);
        console.log(`[Store] Job ${id} cached as canceled.`);
    }

    /**
     * Checks if a job has been canceled.
     */
    public has(id: string): boolean {
        return this.store.has(id);
    }

    /**
     * Returns all canceled job IDs.
     */
    public getAll(): string[] {
        return Array.from(this.store);
    }

    /**
     * Optional: Clear the store (useful for testing)
     */
    public clear(): void {
        this.store.clear();
    }
}

// Export a singleton instance
export const canceledJobStore = new CanceledJobStore();