import {Strategy} from '../types';

import seedrandom = require('seedrandom');

export class ARC4Strategy implements Strategy {
  readonly name = 'arc4';

  calc(data: Buffer | string): number {
    const hex = Buffer.isBuffer(data) ? data.toString('hex') : data;
    const value = seedrandom(hex)() * 100;
    return Math.floor(value * 10000) / 10000;
  }
}

export default ARC4Strategy;
