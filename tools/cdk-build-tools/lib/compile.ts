import path = require('path');
import { makeExecutable, shell } from "./os";
import { CompilerOverrides, currentPackageJson, packageCompiler } from "./package-info";
import { Timers } from "./timer";

/**
 * Run the compiler on the current package
 */
export async function compileCurrentPackage(timers: Timers, compilers: CompilerOverrides = {}): Promise<void> {
  await shell(packageCompiler(compilers), { timers });

  // Find files in bin/ that look like they should be executable, and make them so.
  const scripts = currentPackageJson().bin || {};
  for (const script of Object.values(scripts) as any) {
    await makeExecutable(script);
  }

  // Always call linters
  await shell([compilers.eslint || require.resolve('eslint/bin/eslint'), '.', '--ext .ts,.js', ' --ignore-path .gitignore'], { timers });
  await shell(['pkglint'], { timers });
  await shell([ path.join(__dirname, '..', 'bin', 'cdk-awslint') ], { timers });
}
