import { ChangeDetector } from "merkle-build";
import ignoreList = require('./ignore-list');
import { makeExecutable, shell } from "./os";
import { CompilerOverrides, currentPackageJson, packageCompiler } from "./package-info";
import { Timers } from "./timer";

/**
 * Run the compiler on the current package
 */
export async function compileCurrentPackage(timers: Timers, compilers: CompilerOverrides = {}, force?: boolean): Promise<void> {
  // We don't need to do the rest if the folder hash didn't change
  // NOTE: This happens post-cfn2ts on purpose, since a change in cfn2ts or the spec might lead
  // to different generated sources, in which case we DO need to recompile.
  //
  // Otherwise, we assume that changes in the compiler don't affect the output too much.
  //
  // (Which might be false in case the compiler is jsii, but what can we do?)
  const detector = new ChangeDetector('.', {
    ignore: ignoreList
  });

  const isChanged = await timers.recordAsync('detectChanges', () => detector.isChanged());
  if (!isChanged && !force) {
    process.stdout.write('Sources and dependencies unchanged since last build; skipping.\n');
    return;
  }

  await shell([packageCompiler(compilers)], timers);

  // Find files in bin/ that look like they should be executable, and make them so.
  const scripts = currentPackageJson().bin || {};
  for (const script of Object.values(scripts) as any) {
    await makeExecutable(script);
  }

  // Always call linters
  await shell(['tslint', '--project', '.'], timers);
  await shell(['pkglint'], timers);

  await timers.recordAsync('markBuilt', () => detector.markClean());
}
