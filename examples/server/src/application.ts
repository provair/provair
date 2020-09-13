import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {RestApplication} from '@loopback/rest';
import {RestExplorerComponent} from '@loopback/rest-explorer';

export class ProvablyApplication extends BootMixin(RestApplication) {
  constructor(config: ApplicationConfig = {}) {
    super(config);
    this.projectRoot = __dirname;

    this.component(RestExplorerComponent);

    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js', '.controller.ts'],
        nested: true,
      },
      services: {
        // Customize ServiceBooter Conventions here
        dirs: ['services'],
        extensions: ['.service.js', '.service.ts'],
        nested: true,
      },
    };
  }

  async main() {
    await this.boot();
    await this.start();
  }
}
