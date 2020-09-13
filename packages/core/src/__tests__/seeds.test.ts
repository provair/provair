import {expect} from '@loopback/testlab';
import {randomHex} from '../utils';
import {generateServerSeed} from '../seeds';

describe('seeds', () => {
  describe('server seed', function () {
    it('should generate server seed with length', () => {
      const {seed, hash} = generateServerSeed(12);
      expect(seed).type('string');
      expect(hash).type('string');
      expect(seed).lengthOf(24);
      expect(hash).lengthOf(64);
    });

    it('should generate server seed with default', function () {
      const {seed, hash} = generateServerSeed();
      expect(seed).type('string');
      expect(hash).type('string');
      expect(seed).lengthOf(32);
      expect(hash).lengthOf(64);
    });

    it('should generate server seed with an existing seed', function () {
      const {seed, hash} = generateServerSeed(randomHex(12));
      expect(seed).type('string');
      expect(hash).type('string');
      expect(seed).lengthOf(24);
      expect(hash).lengthOf(64);
    });
  });
});
