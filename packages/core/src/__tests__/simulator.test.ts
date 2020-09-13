import {expect} from '@loopback/testlab';
import {simulator} from '../simulator';

describe('simulator', function () {
  it('should simulate number', function () {
    const num = simulator.number();
    expect(num).type('number');
    expect(num).lessThanOrEqual(100);
    expect(num).greaterThanOrEqual(0);
  });

  it('should simulate random', function () {
    const data = simulator.random();
    expect(Buffer.isBuffer(data)).ok();
    expect(data).lengthOf(64);
  });
});
