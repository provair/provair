import {HashCtor, Strategy, StrategyCtor} from './types';
import {SHA512} from './algs';
import {resolveStrategy} from './strategies';

export interface CalculateOptions {
  alg?: string | HashCtor;
  strategy?: Strategy | StrategyCtor | string;
}

export interface CalculateResult {
  result: number;
  nonce: number;
  serverSeed: string;
  clientSeed: string;
}

const DEFAULT_CALCULATE_OPTIONS = {
  alg: 'sha512',
  strategy: 'classic',
};

export function aggregate(serverSeed: string, clientSeed: string, nonce = 0) {
  const ss = Buffer.from(serverSeed, 'hex');
  // client seed is generic string
  const cs = Buffer.from(`${clientSeed}-${Math.abs(nonce)}`);
  return SHA512.hmac().init(ss).update(cs).final();
}

export function calculate(
  serverSeed: string,
  clientSeed: string,
  nonce = 0,
  options: CalculateOptions = {},
): CalculateResult {
  const opts = Object.assign({}, DEFAULT_CALCULATE_OPTIONS, options);
  const strategy = resolveStrategy(opts.strategy);
  const seed = aggregate(serverSeed, clientSeed, nonce);
  const result = strategy.calc(seed);
  return {result, serverSeed, clientSeed, nonce};
}
