import * as path from 'path';
import * as process from 'process';
import * as fs from 'fs-extra';
import { shell, escape } from './os';
import { CDKBuildOptions, CompilerOverrides } from './package-info';
import { Timers } from './timer';

export async function lintCurrentPackage(
  options: CDKBuildOptions,
  timers: Timers,
  compilers: CompilerOverrides & { fix?: boolean } = {}): Promise<void> {
  const env = options.env;
  const fixOption = compilers.fix ? ['--fix'] : [];

  if (!options.eslint?.disable) {
    await shell([
      compilers.eslint || require.resolve('eslint/bin/eslint'),
      '.',
      '--ext=.ts',
      `--resolve-plugins-relative-to=${__dirname}`,
      ...fixOption,
    ], { timers, env });
  }

  if (!options.pkglint?.disable) {
    await shell([
      'pkglint',
      ...fixOption,
    ], { timers, env });
  }

  if (await fs.pathExists('README.md')) {
    await shell([
      escape(process.execPath),
      ...process.execArgv,
      '--',
      require.resolve('markdownlint-cli'),
      '--config', path.resolve(__dirname, '..', 'config', 'markdownlint.json'),
      ...fixOption,
      'README.md',
    ], { timers });
  }

  await shell([path.join(__dirname, '..', 'bin', 'cdk-awslint')], { timers, env });
}
