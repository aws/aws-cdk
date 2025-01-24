import { createRequire } from 'node:module';
import * as path from 'node:path';
import * as esbuild from 'esbuild';
import * as fs from 'fs-extra';

const require = createRequire(import.meta.url);

const cliPackage = path.dirname(require.resolve('aws-cdk/package.json'));
let copyFromCli = (from, to = undefined) => {
  return fs.copy(path.join(cliPackage, ...from), path.join(process.cwd(), ...(to ?? from)));
};

// This is a build script, we are fine
// eslint-disable-next-line @cdklabs/promiseall-no-unbounded-parallelism
await Promise.all([
  copyFromCli(['build-info.json']),
  copyFromCli(['/db.json.gz']),
  copyFromCli(['lib', 'index_bg.wasm']),
]);

// # Copy all resources that aws_cdk/generate.sh produced, and some othersCall the generator for the
// cp -R $aws_cdk/lib/init-templates ./lib/
// mkdir -p ./lib/api/bootstrap/ && cp $aws_cdk/lib/api/bootstrap/bootstrap-template.yaml ./lib/api/bootstrap/

await esbuild.build({
  entryPoints: ['lib/api/aws-cdk.ts'],
  target: 'node18',
  platform: 'node',
  packages: 'external',
  sourcemap: true,
  bundle: true,
  outfile: 'lib/api/aws-cdk.js',
});
