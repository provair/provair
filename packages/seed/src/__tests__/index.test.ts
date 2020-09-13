import {expect} from '@loopback/testlab';
import {
  DEFAULT_CLIENT_SEED_BYTES,
  DEFAULT_RANDOM_HEX_BYTES,
  DEFAULT_SERVER_SEED_BYTES,
  genClientSeed,
  genServerSeed,
  randomString,
  randomHex,
  AlphabetAndNumberCharacters,
} from '..';

describe('seeds', () => {
  it('should generate ascii', function () {
    const seed = randomString(1024);
    expect(seed).length(1024);
    for (const c of seed) {
      expect(/[0-9a-zA-Z]/.test(c)).true();
    }
  });

  it('should generate correct hex length with default length', function () {
    expect(randomHex()).lengthOf(DEFAULT_RANDOM_HEX_BYTES * 2);
  });

  it('should generate client seed', function () {
    const seed = genClientSeed();
    expect(seed).length(DEFAULT_CLIENT_SEED_BYTES);
    for (const c of seed) {
      expect(AlphabetAndNumberCharacters.includes(c)).true();
    }
  });

  it('should generate server seed', function () {
    const seed = genServerSeed();
    expect(seed).length(DEFAULT_SERVER_SEED_BYTES * 2);
    for (const c of seed) {
      expect(/[0-9A-Fa-f]/.test(c)).true();
    }
  });
});
