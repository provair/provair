import {SHA256} from './algs';
import {randomHex} from './utils';

export function generateServerSeed(
  seedOrLength: Buffer | string | number = randomHex(16),
) {
  let seed: Buffer;
  if (typeof seedOrLength === 'number') {
    seed = randomHex(seedOrLength);
  } else if (typeof seedOrLength === 'string') {
    seed = Buffer.from(seedOrLength, 'hex');
  } else {
    seed = seedOrLength;
  }
  const hash = SHA256.digest(seed).toString('hex');
  return {seed: seed.toString('hex'), hash};
}
