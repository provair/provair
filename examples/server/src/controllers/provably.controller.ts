import {inject} from '@loopback/core';

import {param, post, Request, requestBody, RestBindings} from '@loopback/rest';
import {PROVABLY_SERVICE} from '../keys';
import {ProvablyService} from '../services';
import {ProvableServerSeedResult, ProvablyCalculateParams} from '@provair/core';

export class ProvablyController {
  constructor(
    @inject(PROVABLY_SERVICE) private provablyService: ProvablyService,
    @inject(RestBindings.Http.REQUEST) private request: Request,
  ) {}

  @post('/seed/{uid}', {
    responses: {
      200: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                uid: 'string',
                serverSeedHash: 'string',
                expires: {
                  type: 'string',
                  format: 'date-time',
                },
              },
            },
          },
        },
        description: 'Server seed hash',
      },
    },
  })
  async createServerSeed(
    @param.path.string('uid') uid: string,
  ): Promise<ProvableServerSeedResult> {
    return this.provablyService.creatServerSeed({uid});
  }

  @post('/calc/{uid}', {
    responses: {
      200: {
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  result: 'number',
                  serverSeed: 'string',
                  clientSeed: 'string',
                  nonce: 'number',
                },
              },
            },
          },
        },
        description: 'The calculated result',
      },
    },
  })
  async calculate(
    @param.path.string('uid') uid: string,
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              serverSeedHash: {
                type: 'string',
              },
              clientSeed: {
                type: 'string',
              },
              count: {
                type: 'number',
              },
            },
            required: ['serverSeedHash', 'clientSeed'],
          },
        },
      },
    })
    params: ProvablyCalculateParams,
  ) {
    return this.provablyService.calculate({uid, ...params});
  }

  @post('/verify', {
    responses: {
      200: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                serverSeedHash: 'string',
                result: 'number',
              },
            },
          },
        },
        description: 'The calculated result',
      },
    },
  })
  async verify(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              serverSeed: {
                type: 'string',
              },
              clientSeed: {
                type: 'string',
              },
              nonce: {
                type: 'number',
              },
            },
          },
        },
      },
    })
    {
      serverSeed,
      clientSeed,
      nonce,
    }: {
      serverSeed: string;
      clientSeed: string;
      nonce?: number;
    },
  ) {
    return this.provablyService.verify(serverSeed, clientSeed, nonce);
  }
}
