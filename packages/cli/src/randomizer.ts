import {Readable, ReadableOptions} from 'readable-stream';
import {simulator} from '@provair/core';

export type RandomizerOptions = ReadableOptions & {
  size?: number;
};

export class Randomizer extends Readable {
  protected readCount: number;
  protected size: number;

  protected buf: Buffer;

  constructor(options?: RandomizerOptions) {
    super(options);
    this.readCount = 0;
    this.size = options?.size ?? 1024;
  }

  _read(size: number) {
    let shouldEnd = false;
    if (size >= this.size - this.readCount) {
      size = this.size - this.readCount;
      shouldEnd = true;
    }

    if (size > 0) {
      while (!this.buf || this.buf.length < size) {
        const generated = simulator.random();
        this.buf = this.buf ? Buffer.concat([this.buf, generated]) : generated;
      }
      this.push(this.buf.slice(0, size));
      this.buf = this.buf.slice(size);
      this.readCount += size;
    }

    if (shouldEnd) {
      this.push(null);
    }
  }
}
