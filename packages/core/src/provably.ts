import {Bucket, Store, StoreOptions} from 'kvs';
import {generateServerSeed} from './seeds';
import {calculate, CalculateOptions, CalculateResult} from './calculator';

export const genkey = (hash: Buffer | string) =>
  `provair:seed:${Buffer.isBuffer(hash) ? hash.toString('hex') : hash}`;

export interface ProvableServerSeed {
  uid: string;
  seed: string;
}

export interface ProvableServerSeedResult {
  uid: string;
  serverSeedHash: string;
  expires: Date;
}

export interface ProvablyServerSeedParams {
  uid?: string;
  expiresIn?: number;
}

export interface ProvablyCalculateParams extends CalculateOptions {
  uid?: string;
  serverSeedHash: string;
  clientSeed: string;
  count?: number;
}

export interface ProvableServerSeedQuery {
  uid?: string;
  serverSeedHash: string;
}

/**
 * The main provair class to generate server hash and calculate the random number
 */
export class Provably {
  readonly bucket: Promise<Bucket>;

  static create(name: string, options?: StoreOptions): Provably;
  static create(store: Store): Provably;
  static create(store: Store | string, options?: StoreOptions) {
    if (typeof store === 'string') {
      store = Store.create(store, options);
    }
    return new Provably(store);
  }

  constructor(readonly store: Store) {
    this.bucket = store.bucket('provair:seed');
  }

  /**
   * Create server seed and save it to kvs store.
   *
   * @param params
   */
  async createServerSeed(
    params: ProvablyServerSeedParams = {},
  ): Promise<ProvableServerSeedResult> {
    const {uid = 'none', expiresIn = 60 * 60} = params;
    const expires = new Date(Date.now() + expiresIn * 1000);
    const {seed, hash} = generateServerSeed();
    const bucket = await this.bucket;
    await bucket.set(genkey(hash), <ProvableServerSeed>{uid, seed}, expiresIn);
    return {uid, serverSeedHash: hash, expires};
  }

  async revokeServerSeed(query: ProvableServerSeedQuery): Promise<boolean> {
    const {uid = 'none', serverSeedHash} = query;
    const bucket = await this.bucket;
    const key = genkey(serverSeedHash);
    const data: ProvableServerSeed = await bucket.get(key);
    if (data?.uid === uid) {
      await bucket.del(key);
      return true;
    }
    return false;
  }

  async exists(query: ProvableServerSeedQuery): Promise<boolean> {
    const {uid = 'none', serverSeedHash} = query;
    const bucket = await this.bucket;
    const key = genkey(serverSeedHash);
    const data: ProvableServerSeed = await bucket.get(key);
    return data?.uid === uid;
  }

  /**
   * Calculator provably number with server seed and client seed
   *
   * @param params
   */
  async calculate(params: ProvablyCalculateParams): Promise<CalculateResult[]> {
    const {
      uid = 'none',
      serverSeedHash,
      clientSeed,
      count = 1,
      ...options
    } = params;
    const bucket = await this.bucket;
    const key = genkey(serverSeedHash);
    const data: ProvableServerSeed = await bucket.get(key);
    if (!data) {
      throw new Error('Invalid serverSeedHash, probably already used');
    }
    if (data.uid !== uid) {
      throw new Error('Provided uid does not match token serverSeed.uid');
    }
    await bucket.del(key);

    const results: CalculateResult[] = [];
    for (let nonce = 0; nonce < count; nonce++) {
      results.push(calculate(data.seed, clientSeed, nonce, options));
    }
    return results;
  }

  verify(
    serverSeed: string,
    clientSeed: string,
    nonce = 0,
    options?: CalculateOptions,
  ) {
    const {hash} = generateServerSeed(serverSeed);
    const answer = calculate(serverSeed, clientSeed, nonce, options);
    return {result: answer.result, serverSeedHash: hash};
  }
}
