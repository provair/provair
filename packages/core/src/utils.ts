const random = require('bcrypto/lib/random');

export const DEFAULT_RANDOM_HEX_BYTES = 16;
export const DEFAULT_RANDOM_HEX_STRING_BYTES = 16;

export function randomHex(bytes = DEFAULT_RANDOM_HEX_BYTES) {
  return random.randomBytes(bytes);
}

export function randomHexStr(bytes = DEFAULT_RANDOM_HEX_STRING_BYTES) {
  return randomHex(bytes).toString('hex').slice();
}
