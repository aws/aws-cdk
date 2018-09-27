import yargs = require('yargs');
import { shell } from '../lib/os';
import { packageCompiler } from '../lib/package-info';

interface Arguments extends yargs.Arguments {
  jsii?: string;
  tsc?: string;
}

async function main() {
  const args: Arguments = yargs
    .env('CDK_WATCH')
    .usage('Usage: cdk-watch')
    .option('jsii', {
      type: 'string',
      desc: 'Specify a different jsii executable',
      defaultDescription: 'jsii provided by node dependencies'
    })
    .option('tsc', {
      type: 'string',
      desc: 'Specify a different tsc executable',
      defaultDescription: 'tsc provided by node dependencies'
    })
    .argv as any;

  await shell([packageCompiler({ jsii: args.jsii, tsc: args.tsc }), '-w']);
}

main().catch(e => {
  process.stderr.write(`${e.toString()}\n`);
  process.exit(1);
});
