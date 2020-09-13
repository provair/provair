const random = require('bcrypto/lib/random');

export const DEFAULT_RANDOM_HEX_BYTES = 16;
export const DEFAULT_CLIENT_SEED_BYTES = 21;
export const DEFAULT_SERVER_SEED_BYTES = 16;

export const AlphabetCharacters =
  'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

export const NumberCharacters = '0123456789';

export const AlphabetAndNumberCharacters =
  AlphabetCharacters + NumberCharacters;

export function randomString(
  length: number,
  characters = AlphabetAndNumberCharacters,
) {
  let string = '';
  // Generate the string
  const charsLen = characters.length;
  const maxByte = 256 - (256 % charsLen);
  while (length > 0) {
    const buf = random.randomBytes(Math.ceil((length * 256) / maxByte));
    for (let i = 0; i < buf.length && length > 0; i++) {
      const randomByte = buf.readUInt8(i);
      if (randomByte < maxByte) {
        string += characters[randomByte % charsLen];
        length--;
      }
    }
  }

  return string;
}

export function randomHex(bytes = DEFAULT_RANDOM_HEX_BYTES) {
  return random.randomBytes(bytes).toString('hex').slice();
}

export function genClientSeed(length = DEFAULT_CLIENT_SEED_BYTES) {
  return randomString(length);
}

export function genServerSeed(bytes = DEFAULT_SERVER_SEED_BYTES) {
  return randomHex(bytes);
}
