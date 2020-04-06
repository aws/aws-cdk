import * as path from 'path';
import { makeExecutable, shell } from './os';
import { CDKBuildOptions, CompilerOverrides, currentPackageJson, packageCompiler } from './package-info';
import { Timers } from './timer';

/**
 * Run the compiler on the current package
 */
export async function compileCurrentPackage(timers: Timers, options: CDKBuildOptions, compilers: CompilerOverrides = {}): Promise<void> {
  await shell(packageCompiler(compilers), { timers });

  // Find files in bin/ that look like they should be executable, and make them so.
  const scripts = currentPackageJson().bin || {};
  for (const script of Object.values(scripts) as any) {
    await makeExecutable(script);
  }

  // Always call linters

  if (!options.eslint?.disable) {
    await shell([
      compilers.eslint || require.resolve('eslint/bin/eslint'),
      '.',
      '--ext=.js,.ts',
      `--resolve-plugins-relative-to=${__dirname}`,
      ...options.eslint?.["ignore-pattern"]?.map(pattern => `--ignore-pattern=${pattern}`) || []
    ], { timers });
  }

  if (!options.tslint?.disable) {
    await shell([compilers.tslint || require.resolve('tslint/bin/tslint'), '--project', '.'], { timers });
  }

  if (!options.pkglint?.disable) {
    await shell(['pkglint'], { timers });
  }

  await shell([ path.join(__dirname, '..', 'bin', 'cdk-awslint') ], { timers });
}
