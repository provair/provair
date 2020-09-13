import {expect} from '@loopback/testlab';
import {ARC4Strategy} from '../../strategies/arc4';

const arc4 = new ARC4Strategy();

describe('strategy/arc4', function () {
  it('should calculate number', function () {
    const data = 'F000112345';
    const v1 = arc4.calc(data);
    const v2 = arc4.calc(data);
    expect(v1).equal(v2);
    expect(v1).greaterThanOrEqual(0);
    expect(v1).lessThanOrEqual(100);
  });

  it('should receive both buffer and string', function () {
    const data = 'F000112345';
    const resultWithString = arc4.calc(data.toLowerCase());
    const resultWithBuffer = arc4.calc(Buffer.from(data, 'hex'));
    expect(resultWithBuffer).equal(resultWithString);
  });

  it('should return different value with different cases', function () {
    const data = 'F000112345';
    const resultWithString = arc4.calc(data); // upper case
    const resultWithBuffer = arc4.calc(Buffer.from(data, 'hex')); // lower case
    expect(resultWithBuffer).not.equal(resultWithString);
  });
});
