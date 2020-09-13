import prog from 'caporal';

import {rand} from './cmds';

const pkg = require('../package.json');

export async function cli(argv: any[]) {
  prog.version(pkg.version).description('The provair command line tools');

  rand.setup();

  prog.parse(argv);
}

if (require.main === module) {
  cli(process.argv).catch(err => {
    console.error(err);
    process.exit(1);
  });
}
