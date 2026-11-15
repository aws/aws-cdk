import * as fs from 'fs';
import { checkDeclarations, formatDiagnostics } from './declaration-check';
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
 * The entry points are the `.js` targets of the package's `exports` map, or its
 * `types`/`main` entry when it has none.
 */
function checkCurrentPackageDeclarations(timers: Timers): void {
  const { exports, types, main } = currentPackageJson();
  const targets: unknown[] = exports ? Object.values(exports) : [types ?? main];
  const entryPoints = targets
    .filter((t): t is string => typeof t === 'string' && /\.(js|d\.ts)$/.test(t))
    .map((t) => t.replace(/\.js$/, '.d.ts'))
    .filter((t) => fs.existsSync(t));
  if (entryPoints.length === 0) {
    throw new Error('No declaration files to check: none of the package\'s entry points has a .d.ts file');
  }

  const diagnostics = timers.record('Check declarations', () => checkDeclarations(process.cwd(), entryPoints));
  if (diagnostics.length > 0) {
    throw new Error(`Declarations do not compile with strict and exactOptionalPropertyTypes:\n${formatDiagnostics(diagnostics, process.cwd())}`);
  }
}
