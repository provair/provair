import {Store} from 'kvs';
import {expect} from '@loopback/testlab';
import {genkey, Provably} from '../provably';
import {Strategy} from '../types';

const clientSeed = 'clientSeed';
const customStrategy: Strategy = {
  calc(hex: Buffer | string): number {
    return 0.5;
  },
};

describe('provably', function () {
  describe('initiation', function () {
    it('should initiate with store name', function () {
      const provably = Provably.create('memory');
      expect(provably).ok();
    });

    it('should initiate with store instance', function () {
      const provably = Provably.create(Store.create('memory'));
      expect(provably).ok();
    });
  });

  describe('genkey', function () {
    it('should genkey with string key', function () {
      expect(genkey('123')).equal('provair:seed:123');
    });
    it('should genkey with buffer key', function () {
      expect(genkey(Buffer.from('123'))).equal('provair:seed:313233');
    });
  });

  describe('functions', function () {
    const store = Store.create('memory');
    const provably = Provably.create(store);

    afterEach(async () => {
      await (await provably.bucket).clear();
    });

    describe('create server seed', function () {
      it('should create server seed hash', async function () {
        const ts = Date.now();
        const result = await provably.createServerSeed();
        expect(result).ok();
        expect(result.uid).equal('none');
        expect(result.serverSeedHash).lengthOf(64);
        expect(result.expires).greaterThanOrEqual(ts + 3600000);
        expect(result.expires).belowOrEqual(Date.now() + 3600000);
      });
    });

    describe('check server seed exists', function () {
      it('should return true if server seed exists', async function () {
        const result = await provably.createServerSeed();
        expect(await provably.exists(result)).true();
      });

      it('should return false if server seed not exists', async function () {
        expect(await provably.exists({serverSeedHash: 'unknown'})).false();
      });

      it('should return false if uid not match', async function () {
        const result = await provably.createServerSeed();
        expect(
          await provably.exists({
            uid: 'unknown',
            serverSeedHash: result.serverSeedHash,
          }),
        ).false();
      });
    });

    describe('revoke server seed', function () {
      it('should return that revoked the server seed that exists', async function () {
        const ss = await provably.createServerSeed();
        expect(await provably.exists(ss)).true();
        const result = await provably.revokeServerSeed(ss);
        expect(result).true();
        expect(await provably.exists(ss)).false();
      });

      it('should return false when trying to revoke the server seed that not exists', async function () {
        const result = await provably.revokeServerSeed({
          serverSeedHash: 'unknown',
        });
        expect(result).false();
      });
    });

    describe('calculate', function () {
      let serverSeedHash: string;
      beforeEach(async () => {
        const result = await provably.createServerSeed();
        serverSeedHash = result.serverSeedHash;
      });
      it('should fail if wrong id', async function () {
        await expect(
          provably.calculate({
            uid: 'other',
            serverSeedHash,
            clientSeed,
            strategy: customStrategy,
          }),
        ).rejectedWith(/Provided uid does not match/);
      });

      it('should fail if redis error', async function () {
        await expect(
          provably.calculate({
            serverSeedHash: 'unknown',
            clientSeed,
            strategy: customStrategy,
          }),
        ).rejectedWith(/Invalid serverSeedHash/);
      });

      it('should fail if same hash', async function () {
        await provably.calculate({
          serverSeedHash,
          clientSeed,
          strategy: customStrategy,
        });
        await expect(
          provably.calculate({
            serverSeedHash,
            clientSeed,
            strategy: customStrategy,
          }),
        ).rejectedWith(/Invalid serverSeedHash/);
      });

      it('should succeed to calculate one result', async function () {
        const [answer] = await provably.calculate({
          serverSeedHash,
          clientSeed,
          strategy: customStrategy,
        });
        expect(answer.result).equal(0.5);
      });

      it('should succeed to calculate multiple results', async function () {
        const answers = await provably.calculate({
          serverSeedHash,
          clientSeed,
          count: 5,
        });
        expect(answers).lengthOf(5);
        for (let i = 0; i < answers.length; i++) {
          expect(answers[i].result).type('number');
          expect(answers[i].nonce).equal(i);
        }
      });
    });

    describe('verifying', function () {
      it('should verify with default nonce', async function () {
        const {serverSeedHash} = await provably.createServerSeed();
        const [calculated] = await provably.calculate({
          serverSeedHash,
          clientSeed,
        });
        const verified = provably.verify(
          calculated.serverSeed,
          calculated.clientSeed,
        );
        expect(calculated.result).equal(verified.result);
      });

      it('should verify multiple results', async function () {
        const {serverSeedHash} = await provably.createServerSeed();
        const answers = await provably.calculate({
          serverSeedHash,
          clientSeed,
          count: 5,
        });

        for (const answer of answers) {
          const verified = provably.verify(
            answer.serverSeed,
            answer.clientSeed,
            answer.nonce,
          );
          expect(answer.result).equal(verified.result);
        }
      });
    });
  });
});
