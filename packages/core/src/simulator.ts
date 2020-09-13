import {genClientSeed} from '@provair/seed';
import {generateServerSeed} from './seeds';
import {aggregate, calculate, CalculateOptions} from './calculator';

/**
 * Simulate provair randoms such as hash or number values.
 *
 */
export class Simulator {
  number(options?: CalculateOptions) {
    const {seed} = generateServerSeed();
    const clientSeed = genClientSeed();
    const {result} = calculate(seed, clientSeed, 0, options);
    return result;
  }

  random() {
    const {seed} = generateServerSeed();
    const clientSeed = genClientSeed();
    return aggregate(seed, clientSeed);
  }
}

export const simulator = new Simulator();
