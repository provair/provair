import {expect} from '@loopback/testlab';
import {genClientSeed} from '../../../seed';
import {generateServerSeed} from '../seeds';
import {calculate} from '../calculator';

describe('calculator', () => {
  it('should calc', function () {
    const {seed} = generateServerSeed();
    const clientSeed = genClientSeed();
    const {nonce, result} = calculate(seed, clientSeed);
    expect(nonce).equal(0);
    expect(result).greaterThanOrEqual(0);
    expect(result).lessThanOrEqual(100);
  });
});
