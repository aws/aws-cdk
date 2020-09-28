import * as path from 'path';
import { shell } from './os';
import { CDKBuildOptions, CompilerOverrides } from './package-info';

export async function lintCurrentPackage(options: CDKBuildOptions, compilers: CompilerOverrides & { fix?: boolean } = {}): Promise<void> {
  const env = options.env;
  if (!options.eslint?.disable) {
    await shell([
      compilers.eslint || require.resolve('eslint/bin/eslint'),
      '.',
      '--ext=.ts',
      `--resolve-plugins-relative-to=${__dirname}`,
      ...compilers.fix ? ['--fix'] : [],
    ], { env });
  }

  if (!options.pkglint?.disable) {
    await shell(['pkglint'], { env });
  }

  await shell([path.join(__dirname, '..', 'bin', 'cdk-awslint')], { env });
}
