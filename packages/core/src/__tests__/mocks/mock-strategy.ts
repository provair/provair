import {Strategy} from '../../types';

export class MockStrategy implements Strategy {
  calc(hex: Buffer | string): number {
    return 0;
  }
}
