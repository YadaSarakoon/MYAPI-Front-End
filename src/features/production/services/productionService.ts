import type { ProductionStatus } from '../types';

export interface ProductionService {
  getAccessStatus(signal?: AbortSignal): Promise<ProductionStatus>;
  requestProductionAccess(signal?: AbortSignal): Promise<void>;
}

// No HTTP adapter is implemented until Production access contracts are confirmed.
