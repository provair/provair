import {Strategy} from '../types';

export class ClassicStrategy implements Strategy {
  readonly name = 'classic';

  calc(data: Buffer | string): number {
    const hex = Buffer.isBuffer(data) ? data.toString('hex') : data;

    let answer = Infinity;
    let i = 0;

    while (i < hex.length && answer > 999999) {
      answer = parseInt(hex.slice(i, i + 5).toString(), 16);
      i = Math.min(i + 5, hex.length);
    }
    return answer / 10000;
  }
}

export default ClassicStrategy;
