import {bind, BindingScope, ContextTags, inject} from '@loopback/core';
import {
  CalculateOptions,
  Provably,
  ProvablyCalculateParams,
  ProvablyServerSeedParams,
} from '@provair/core';
import {Store} from 'kvs';
import {PROVABLY_SERVICE} from '../keys';

const defaultConfig = {
  store: {
    name: 'memory',
  },
};

@bind({
  scope: BindingScope.SINGLETON,
  tags: {[ContextTags.KEY]: PROVABLY_SERVICE},
})
export class ProvablyService {
  protected provably: Provably;

  constructor(
    @inject('provably', {optional: true}) config: any = defaultConfig,
  ) {
    this.provably = Provably.create(Store.create(config.store));
  }

  async creatServerSeed(params: ProvablyServerSeedParams) {
    return this.provably.createServerSeed(params);
  }

  async calculate(params: ProvablyCalculateParams) {
    return this.provably.calculate(params);
  }

  async verify(
    serverSeed: string,
    clientSeed: string,
    nonce?: number,
    options?: CalculateOptions,
  ) {
    return this.provably.verify(serverSeed, clientSeed, nonce, options);
  }
}
