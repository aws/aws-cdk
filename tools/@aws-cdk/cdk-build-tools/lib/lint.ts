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
    let eslintPath = compilers.eslint;
    if (!eslintPath) {
      const eslintPj = require.resolve('eslint/package.json');
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      eslintPath = path.resolve(eslintPj, '..', require(eslintPj).bin.eslint);
    }

    await shell([
      eslintPath,
      ...fixOption,
    ], { timers, env, trace: { command: 'eslint', pkg: options.currentPackageName } });
  }

  if (!options.pkglint?.disable) {
    await shell([
      'pkglint',
      ...fixOption,
    ], { timers, env, trace: { command: 'pkglint', pkg: options.currentPackageName } });
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

  await shell([path.join(__dirname, '..', 'bin', 'cdk-awslint')], { timers, env, trace: { command: 'awslint', pkg: options.currentPackageName } });
}
