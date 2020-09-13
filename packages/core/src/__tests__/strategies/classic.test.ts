import {expect} from '@loopback/testlab';
import {ClassicStrategy} from '../../strategies/classic';

const classic = new ClassicStrategy();

describe('strategy/classic', function () {
  it('should calculate number with fist 5 characters', function () {
    const hex = 'F000112345';
    const answer = classic.calc(hex);
    expect(answer).equal(parseInt('F0001', 16) / 10000);
  });

  it('should calculate number with second 5 characters', function () {
    const hex = 'FFFFF12345';
    const answer = classic.calc(hex);
    expect(answer).equal(parseInt('12345', 16) / 10000);
  });

  it('should calculate number with last characters', function () {
    const hex = 'FFFFF1234';
    const answer = classic.calc(hex);
    expect(answer).equal(parseInt('1234', 16) / 10000);
  });
});
