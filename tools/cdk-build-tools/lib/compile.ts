import path = require('path');
import { makeExecutable, shell } from "./os";
import { CompilerOverrides, currentPackageJson, packageCompiler } from "./package-info";
import { Timers } from "./timer";

/**
 * Run the compiler on the current package
 */
export async function compileCurrentPackage(timers: Timers, compilers: CompilerOverrides = {}): Promise<void> {
  const stdout = await shell(packageCompiler(compilers), { timers });

  // WORKAROUND: jsii 0.8.2 does not exit with non-zero on compilation errors
  // until this is released: https://github.com/aws/jsii/pull/442
  if (stdout.trim()) {
    throw new Error(`Compilation failed`);
  }

  // Find files in bin/ that look like they should be executable, and make them so.
  const scripts = currentPackageJson().bin || {};
  for (const script of Object.values(scripts) as any) {
    await makeExecutable(script);
  }

  // Always call linters
  await shell([compilers.tslint || require.resolve('tslint/bin/tslint'), '--project', '.'], { timers });
  await shell(['pkglint'], { timers });
  await shell([ path.join(__dirname, '..', 'bin', 'cdk-awslint') ], { timers });
}
