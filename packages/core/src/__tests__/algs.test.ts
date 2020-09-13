import {expect} from '@loopback/testlab';
import {getHash, SHA256, SHA512} from '../algs';

describe('algs', function () {
  it('should have correct hash algorithms', function () {
    expect(getHash('sha256')).equal(SHA256);
    expect(getHash('SHA256')).equal(SHA256);
    expect(getHash(SHA256)).equal(SHA256);
    expect(getHash('sha512')).equal(SHA512);
    expect(getHash('SHA512')).equal(SHA512);
    expect(getHash(SHA512)).equal(SHA512);

    expect(() => getHash('MD5')).throw(/Unsupported hash algorithm/);
  });
});
