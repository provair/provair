import {BufferWriter} from 'memstreams';
import {expect} from '@loopback/testlab';
import {Randomizer} from '../randomizer';

describe('randomizer', function () {
  it('should generate default size random bytes', async function () {
    const data = await new Promise(resolve => {
      const randomizer = new Randomizer();
      const writer = new BufferWriter();
      randomizer.pipe(writer);
      writer.on('finish', () => {
        resolve(writer.data);
      });
    });
    expect(data).lengthOf(1024);
  });

  it('should generate specified size random bytes', async function () {
    const data = await new Promise(resolve => {
      const randomizer = new Randomizer({size: 2048});
      const writer = new BufferWriter();
      randomizer.pipe(writer);
      writer.on('finish', () => {
        resolve(writer.data);
      });
    });
    expect(data).lengthOf(2048);
  });

  it('should work with low high water mark', async function () {
    const data = await new Promise(resolve => {
      const randomizer = new Randomizer({highWaterMark: 199});
      const writer = new BufferWriter();
      randomizer.pipe(writer);
      writer.on('finish', () => {
        resolve(writer.data);
      });
    });
    expect(data).lengthOf(1024);
  });
});
