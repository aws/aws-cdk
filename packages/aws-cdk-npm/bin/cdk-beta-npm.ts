import { execCdkBetaNpm } from '../lib/index';

execCdkBetaNpm(...process.argv.slice(2)).then(exitCode => process.exit(exitCode))
      .catch(error => {
          // tslint:disable-next-line:no-console
          console.error(error.stack);
          process.exit(-1);
      });
