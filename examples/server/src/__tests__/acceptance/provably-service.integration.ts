import {
  Client,
  createRestAppClient,
  expect,
  givenHttpServerConfig,
} from '@loopback/testlab';
import {ProvablyApplication} from '../..';

const userId = '123';

describe('ProvablyApplication', () => {
  let app: ProvablyApplication;
  let client: Client;

  before(givenRunningApplicationWithCustomConfiguration);
  after(() => app.stop());

  before(() => {
    client = createRestAppClient(app);
  });

  it('create a server seed', async function () {
    const {body} = await client.post(`/seed/${userId}`).expect(200);

    expect(body.uid).equal(userId);
    expect(body.serverSeedHash).type('string');
    expect(body.serverSeedHash).lengthOf(64); // 32 byte
    expect(body.expires).type('string');
    expect(new Date(body.expires)).instanceOf(Date);
  });

  it('calculate provably number', async function () {
    const {
      body: {serverSeedHash},
    } = await client.post(`/seed/${userId}`).expect(200);
    const {body} = await client
      .post(`/calc/${userId}`)
      .send({serverSeedHash, clientSeed: 'hello'})
      .expect(200);

    expect(Array.isArray(body)).true();
    expect(body).lengthOf(1);

    const [answer] = body;
    expect(answer.result).type('number');
    expect(answer.serverSeed).type('string');
    expect(answer.clientSeed).type('string');
    expect(answer.nonce).type('number');
  });

  it('verify result', async function () {
    const {body} = await client
      .post('/verify')
      .send({
        serverSeed: 'fe124b547466b4c28f5af53ea8349b54',
        clientSeed: 'hello',
      })
      .expect(200);
    expect(body.serverSeedHash).type('string');
    expect(body.serverSeedHash).lengthOf(64);
    expect(body.result).type('number');
  });

  async function givenRunningApplicationWithCustomConfiguration() {
    app = new ProvablyApplication({
      rest: givenHttpServerConfig(),
    });

    // Start Application
    await app.main();
  }
});
