import {expect} from '@loopback/testlab';
import {resolveStrategy} from '../strategies';
import {Strategy} from '../types';
import {MockLoader} from './mocks/mock-loader';

describe('strategies', function () {
  it('should reports helpful error when strategy init throws', function () {
    class ThrowingStrategy implements Strategy {
      constructor() {
        throw new Error('expected test error');
      }

      calc(hex: Buffer | string): number {
        return 0;
      }
    }

    expect(() => resolveStrategy(ThrowingStrategy)).throw(/ThrowingStrategy/);
  });

  it('should report helpful error if module not found', function () {
    expect(() => resolveStrategy('unknown')).throw(/not installed/);
  });

  it('should load strategy with custom loader', function () {
    const strategy = resolveStrategy('mock', MockLoader.load);
    expect(strategy).ok();
  });

  it('should report cannot load strategy if strategy module throw unexpected error when loading', function () {
    expect(() =>
      resolveStrategy('unknown', name => {
        throw new Error('load error');
      }),
    ).throw(/load error/);
  });
});
