// Copyright IBM Corp. 2019,2020. All Rights Reserved.
// Node module: @loopback/example-greeting-app
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

export * from './application';
export * from './keys';

import {ProvablyApplication} from './application';

export async function main() {
  const config = {
    rest: {
      port: +(process.env.PORT ?? 3000),
      host: process.env.HOST ?? '127.0.0.1',
      openApiSpec: {
        // useful when used with OpenAPI-to-GraphQL to locate your application
        setServersFromRequest: true,
      },
    },
  };
  const app = new ProvablyApplication(config);
  await app.main();
  const url = app.restServer.url;
  console.log(`The service is running at ${url}`);
  console.log(`The service explorer is running at ${url}/explorer`);
}

if (require.main === module) {
  main().catch(err => {
    console.error('Cannot start the application.', err);
    process.exit(1);
  });
}
