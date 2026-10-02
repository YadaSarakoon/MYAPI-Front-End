import { WEBHOOK_DELIVERIES_DEMO, WEBHOOK_ENDPOINTS_DEMO } from '../data';
import type { WebhookDelivery, WebhookEndpoint, WebhookEndpointInput } from '../types';

export interface WebhookService {
  listEndpoints(): Promise<WebhookEndpoint[]>;
  listDeliveries(): Promise<WebhookDelivery[]>;
  saveEndpoint(input: WebhookEndpointInput, id?: string): Promise<WebhookEndpoint>;
  setEndpointEnabled(id: string, enabled: boolean): Promise<void>;
  deleteEndpoint(id: string): Promise<void>;
}

// Local-only adapter. Replace it after the Backend contract is confirmed.
const endpoints = WEBHOOK_ENDPOINTS_DEMO.map((endpoint) => ({ ...endpoint, events: [...endpoint.events] }));

export const demoWebhookService: WebhookService = {
  async listEndpoints() {
    return endpoints.map((endpoint) => ({ ...endpoint, events: [...endpoint.events] }));
  },
  async listDeliveries() {
    return WEBHOOK_DELIVERIES_DEMO.map((delivery) => ({ ...delivery }));
  },
  async saveEndpoint(input, id) {
    const existing = endpoints.find((endpoint) => endpoint.id === id);
    if (existing) {
      Object.assign(existing, input);
      return { ...existing, events: [...existing.events] };
    }
    const endpoint: WebhookEndpoint = {
      ...input,
      id: `demo-endpoint-${Date.now()}`,
      lastDelivery: null,
      createdAt: new Date().toISOString(),
    };
    endpoints.unshift(endpoint);
    return { ...endpoint, events: [...endpoint.events] };
  },
  async setEndpointEnabled(id, enabled) {
    const endpoint = endpoints.find((item) => item.id === id);
    if (endpoint) endpoint.enabled = enabled;
  },
  async deleteEndpoint(id) {
    const index = endpoints.findIndex((endpoint) => endpoint.id === id);
    if (index >= 0) endpoints.splice(index, 1);
  },
};

