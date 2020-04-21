import * as path from 'path';
import { shell } from './os';
import { CDKBuildOptions, CompilerOverrides } from './package-info';

export async function lintCurrentPackage(options: CDKBuildOptions, compilers: CompilerOverrides = {}): Promise<void> {
  if (!options.eslint?.disable) {
    await shell([
      compilers.eslint || require.resolve('eslint/bin/eslint'),
      '.',
      '--ext=.ts',
      `--resolve-plugins-relative-to=${__dirname}`,
    ]);
  }

  if (!options.tslint?.disable) {
    await shell([compilers.tslint || require.resolve('tslint/bin/tslint'), '--project', '.']);
  }

  if (!options.pkglint?.disable) {
    await shell(['pkglint']);
  }

  await shell([ path.join(__dirname, '..', 'bin', 'cdk-awslint') ]);
}
