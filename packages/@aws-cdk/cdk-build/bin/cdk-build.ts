import { Build } from '../lib/build';

// tslint:disable:no-console

async function main() {
  const rootdir = process.argv[2];
  if (!rootdir || process.argv.length !== 3) {
    console.error('Usage: cdk-build <outdir>');
    process.exit(1);
    return;
  }

  const build = new Build({ root: rootdir });
  await build.build();
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
