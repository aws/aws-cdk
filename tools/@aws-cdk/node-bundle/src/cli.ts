import { cliMain } from './cli-main';

cliMain(process.argv.slice(2))
  .catch((err: Error) => {
    console.error(`Error: ${err.message}`);
    process.exitCode = 1;
  });
