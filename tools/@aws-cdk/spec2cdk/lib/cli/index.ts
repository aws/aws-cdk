import { main, shortHelp } from './cli';
import { log } from '../util';

main(process.argv.splice(2)).catch((e) => {
  process.exitCode = 1;

  if (e instanceof EvalError) {
    log.error(`Error: ${e.message}\n`);
    shortHelp();
  } else {
    log.error(e);
  }
});
