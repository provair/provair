import {expect} from '@loopback/testlab';
import {
  DEFAULT_RANDOM_HEX_BYTES,
  DEFAULT_RANDOM_HEX_STRING_BYTES,
  randomHex,
  randomHexStr,
} from '../utils';

describe('utils', function () {
  it('should random hex', function () {
    const hex = randomHex(21);
    expect(hex).lengthOf(21);
  });

  it('should random hex string', function () {
    const hex = randomHexStr(12);
    expect(hex).lengthOf(24);
  });

  it('should random hex with default length', function () {
    const hex = randomHex();
    expect(hex).lengthOf(DEFAULT_RANDOM_HEX_BYTES);
  });

  it('should random hex string with default length', function () {
    const hex = randomHexStr();
    expect(hex).lengthOf(DEFAULT_RANDOM_HEX_STRING_BYTES * 2);
  });
});
