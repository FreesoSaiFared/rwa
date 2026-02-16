
import { BusHandler } from './types';

class InternalBus {
  private subscribers: Map<string, Set<BusHandler>> = new Map();

  subscribe(event: string, handler: BusHandler): () => void {
    if (!this.subscribers.has(event)) {
      this.subscribers.set(event, new Set());
    }
    this.subscribers.get(event)!.add(handler);
    
    return () => {
      this.subscribers.get(event)?.delete(handler);
    };
  }

  publish(event: string, data: any): void {
    const handlers = this.subscribers.get(event);
    if (handlers) {
      handlers.forEach(handler => handler(data));
    }
  }
}

export const Bus = new InternalBus();
