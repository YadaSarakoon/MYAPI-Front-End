export const WEBHOOK_EVENTS = [
  'parcel.created',
  'parcel.picked_up',
  'parcel.in_transit',
  'parcel.delivered',
  'parcel.failed',
  'parcel.returned',
] as const;

export type WebhookEventType = (typeof WEBHOOK_EVENTS)[number];
export type WebhookDeliveryStatus = 'Delivered' | 'Failed';
export type DeliveryFilter = 'all' | WebhookDeliveryStatus;
export type DateFilter = 'all' | 'today' | '7days' | '30days';

export interface WebhookEndpoint {
  id: string;
  name: string;
  url: string;
  events: WebhookEventType[];
  description: string;
  enabled: boolean;
  lastDelivery: string | null;
  createdAt: string;
}

export interface DeliveryAttempt {
  number: number;
  attemptedAt: string;
  statusCode: number | null;
  responseTimeMs: number | null;
}

export interface WebhookDelivery {
  id: string;
  eventId: string;
  eventType: WebhookEventType;
  endpointId: string;
  endpointName: string;
  requestUrl: string;
  timestamp: string;
  statusCode: number | null;
  status: WebhookDeliveryStatus;
  attempts: DeliveryAttempt[];
  responseTimeMs: number | null;
  requestHeaders: Record<string, string>;
  requestPayload: Record<string, unknown>;
  responseBody: Record<string, unknown> | null;
}

export type WebhookEndpointInput = Omit<
  WebhookEndpoint,
  'id' | 'lastDelivery' | 'createdAt'
>;

