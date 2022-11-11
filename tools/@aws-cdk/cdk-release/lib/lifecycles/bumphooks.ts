import * as path from 'path';
import * as fs from 'fs-extra';
import { notify } from '../private/print';
import { runExecFile } from '../private/run-exec-file';
import { LifecyclesSkip, PackageInfo } from '../types';

export interface BumpOptions {
  skip?: LifecyclesSkip;

  dryRun?: boolean;
  verbose?: boolean;
  silent?: boolean;
  packages: PackageInfo[];
  repoRoot: string;
}

/**
 * For all  packages, if they have an "on-bump" script in their 'package.json', buildup and run it
 */
export async function runBumpHooks(args: BumpOptions): Promise<Set<string>> {
  if (args.skip?.bumpHooks) {
    return new Set();
  }

  const changedFiles = new Set<string>();

  for (const pkg of args.packages) {
    const pj: any = JSON.parse(await fs.readFile(path.join(pkg.location, 'package.json'), { encoding: 'utf-8' }));
    if (pj?.scripts?.['on-bump']) {
      notify(args, '%s: on-bump: %s', [pkg.name, pj?.scripts?.['on-bump']]);

      // Build up to this package
      await runExecFile(args, 'npx', ['lerna', 'run', 'build', '--include-dependencies', '--scope', pkg.name], {
        cwd: args.repoRoot,
      });

      // Run the on-bump script
      await runExecFile(args, 'yarn', ['on-bump'], {
        cwd: pkg.location,
      });

      // Find changed files
      const gitStatus = await runExecFile(args, 'git', ['status', '--porcelain=v1', pkg.location], {
        cwd: args.repoRoot,
      });
      if (gitStatus) {
        for (const line of gitStatus.split('\n')) {
          const status = line.substring(0, 2);
          const filename = line.substring(3);

          // Only modified files
          if (status === ' M') {
            notify(args, '%s: on-bump: %s changed', [pkg.name, filename]);
            changedFiles.add(filename);
          }
        }
      }
    }
  }

  return changedFiles;
}
