import {BindingKey} from '@loopback/core';
import {ProvablyService} from './services';

/**
 * Strongly-typed binding key for CachingService
 */
export const PROVABLY_SERVICE = BindingKey.create<ProvablyService>(
  'services.ProvablyService',
);
