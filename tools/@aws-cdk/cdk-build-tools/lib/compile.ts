import * as fs from 'fs';
import { checkDeclarations, declarationEntryPoints, formatDiagnostics } from './declaration-check';
import { makeExecutable, shell } from './os';
import type { CDKBuildOptions, CompilerOverrides } from './package-info';
import { currentPackageJson, isJsii, packageCompiler } from './package-info';
import type { Timers } from './timer';

/**
 * Run the compiler on the current package
 */
export async function compileCurrentPackage(options: CDKBuildOptions, timers: Timers, compilers: CompilerOverrides = {}): Promise<void> {
  const env = options.env;
  await shell(packageCompiler(compilers, options), { timers, env });

  // Find files in bin/ that look like they should be executable, and make them so.
  const scripts = currentPackageJson().bin || {};
  for (const script of Object.values(scripts) as any) {
    await makeExecutable(script);
  }

  if (isJsii()) {
    checkCurrentPackageDeclarations(timers);
  }
}

/**
 * Fail the build if the declarations consumers can import do not compile for a strict consumer
 *
 * Entry points without a declaration file are skipped: jsii emits
 * `.warnings.jsii.js` without one, and an export can name a file the package
 * does not build.
 */
function checkCurrentPackageDeclarations(timers: Timers): void {
  const entryPoints = declarationEntryPoints(currentPackageJson()).filter((f) => fs.existsSync(f));
  if (entryPoints.length === 0) {
    throw new Error('No declaration files to check: none of the package\'s entry points has a .d.ts file');
  }

  const diagnostics = timers.record('Check declarations', () => checkDeclarations(process.cwd(), entryPoints));
  if (diagnostics.length > 0) {
    throw new Error([
      'Declarations do not compile with strict and exactOptionalPropertyTypes:',
      formatDiagnostics(diagnostics, process.cwd()),
      'If a class holds `undefined` for an optional member of its interface or abstract base class, declare that member as',
      '`x?: T | undefined`. Do not change the class instead: turning a getter into a property breaks subclasses that override it (see #37996).',
    ].join('\n'));
  }
}
