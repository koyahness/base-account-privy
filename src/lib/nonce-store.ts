// Simple in-memory nonce store
// In production, use Redis or a database for persistence across server restarts
class NonceStore {
  private nonces = new Set<string>();
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    // Clean up old nonces every 10 minutes to prevent memory leaks
    this.cleanupInterval = setInterval(() => {
      this.nonces.clear();
    }, 10 * 60 * 1000);
  }

  add(nonce: string): void {
    this.nonces.add(nonce);
  }

  // Returns true if nonce existed and was deleted, false if it didn't exist
  consume(nonce: string): boolean {
    return this.nonces.delete(nonce);
  }

  has(nonce: string): boolean {
    return this.nonces.has(nonce);
  }

  clear(): void {
    this.nonces.clear();
  }

  size(): number {
    return this.nonces.size;
  }

  destroy(): void {
    clearInterval(this.cleanupInterval);
    this.nonces.clear();
  }
}

// Export a singleton instance
export const nonceStore = new NonceStore();
