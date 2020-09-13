import prog from 'caporal';
import {assert} from 'ts-essentials';
import {PassThrough} from 'readable-stream';
import fs from 'fs';
import {Randomizer} from '../randomizer';

export const DEFAULT_WIDTH = 64;

export const DEFAULT_OPTIONS = {
  blocks: 1,
  width: DEFAULT_WIDTH,
};

export function setup() {
  prog
    .command('rand', 'Generate random bytes using provair algorithms')
    .option('-o, --out <file>', 'Output file')
    .option('-b, --binary', 'Output in raw binary format')
    .option(
      '-k, --blocks <1K_Blocks>',
      'Size of output in kilobytes',
      prog.INT,
      1,
    )
    .option(
      '-w, --width [1...256]',
      'Byte per line of output',
      prog.INT,
      DEFAULT_WIDTH,
    )
    .action(handleRandom);
}

export function handleRandom(
  args: Record<string, any>,
  options: Record<string, any>,
  logger: Logger,
) {
  const {out, binary, blocks, width} = Object.assign(
    {},
    DEFAULT_OPTIONS,
    options,
  );

  assert(
    width >= 1 && width <= 256,
    `width should between 1 and 255, but got ${width}`,
  );
  const randomizer = new Randomizer({size: blocks * 1024});
  const normalizer = new Normalizer({hex: binary ? false : width});
  const output = out ? fs.createWriteStream(out) : process.stdout;
  randomizer.pipe(normalizer).pipe(output);
}

export interface NormalizerOptions {
  hex: number | boolean;
}

export class Normalizer extends PassThrough {
  protected binary: boolean;
  protected width: number;

  private cache: Buffer;
  private count: number;

  constructor(options: NormalizerOptions) {
    super();
    this.count = 0;
    this.cache = Buffer.alloc(0);
    this.binary = !options.hex;
    if (options.hex) {
      this.width =
        typeof options.hex === 'number' ? options.hex : DEFAULT_WIDTH;
    }
  }

  _transform<T>(
    chunk: T,
    encoding: BufferEncoding | string | null | undefined,
    callback: (error?: Error, data?: T) => void,
  ) {
    if (this.binary || !Buffer.isBuffer(chunk)) {
      return super._transform(chunk, encoding, callback);
    }

    const bytes = this.width / 2;

    let data = Buffer.concat([this.cache, chunk]);
    while (data.length > bytes) {
      this.push(data.slice(0, bytes).toString('hex') + '\n');
      data = data.slice(bytes);
    }
    this.cache = data;
    callback();
  }
}
