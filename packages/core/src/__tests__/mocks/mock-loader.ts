import {StrategyCtor} from '../../types';
import {MockStrategy} from './mock-strategy';

export namespace MockLoader {
  const strategies: Record<string, any> = {};

  export function register(name: string, strategy: StrategyCtor) {
    strategies[name] = strategy;
  }

  export function load(name: string) {
    if (strategies[name]) {
      return strategies[name];
    }
    const err = <any>new Error(`Cannot find module ${name}.`);
    err.code = 'MODULE_NOT_FOUND';
    throw err;
  }
}

MockLoader.register('provair-strategy-mock', MockStrategy);
