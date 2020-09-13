import {HashCtor} from './types';

const SHA256 = <HashCtor>require('bcrypto/lib/sha256');
const SHA512 = <HashCtor>require('bcrypto/lib/sha512');

export {SHA256, SHA512};

export const algs: {
  [name: string]: HashCtor;
} = {
  sha256: SHA256,
  sha512: SHA512,
};

export function getHash(nameOrHash: string | HashCtor): HashCtor {
  if (isHashCtor(nameOrHash)) {
    return nameOrHash;
  }
  const Hash = algs[nameOrHash.toLowerCase()];
  if (!Hash) {
    throw new Error(`Unsupported hash algorithm: ${nameOrHash}`);
  }
  return Hash;
}

export function isHashCtor(x: any): x is HashCtor {
  return typeof x === 'function' && typeof x.digest === 'function';
}
