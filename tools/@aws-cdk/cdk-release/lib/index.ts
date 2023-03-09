import { getConventionalCommitsFromGitHistory } from './conventional-commits';
import { defaults } from './defaults';
import { bump } from './lifecycles/bump';
import { runBumpHooks } from './lifecycles/bumphooks';
import { writeChangelogs } from './lifecycles/changelog';
import { commit } from './lifecycles/commit';
import { debug, debugObject } from './private/print';
import { PackageInfo, ReleaseOptions } from './types';
import { readVersion } from './versions';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const lerna_project = require('@lerna/project');

export * from './release-notes';

export async function createRelease(opts: ReleaseOptions): Promise<void> {
  // handle the default options
  const args: ReleaseOptions = {
    ...defaults,
    ...opts,
  };
  debugObject(args, 'options are (including defaults)', args);

  if (!args.repoRoot) {
    throw new Error('repoRoot is required');
  }

  const currentVersion = readVersion(args.versionFile);
  debugObject(args, 'Current version info', currentVersion);

  const newVersion = await bump(args, currentVersion);
  debugObject(args, 'New version is', newVersion);

  debug(args, 'Reading Git commits');
  const commits = await getConventionalCommitsFromGitHistory(args, `v${currentVersion.stableVersion}`);

  const packages = getProjectPackageInfos();

  debug(args, 'Writing Changelog');
  const changelogResults = await writeChangelogs({ ...args, currentVersion, newVersion, commits, packages });

  debug(args, 'Running "on-bump" hooks');
  const bumpHookedFiles = await runBumpHooks({ ...args, packages });

  debug(args, 'Committing result');
  await commit(args, newVersion.stableVersion, [
    args.versionFile,
    ...changelogResults.map(r => r.filePath),
    ...bumpHookedFiles,
  ]);
};

function getProjectPackageInfos(): PackageInfo[] {
  const packages = lerna_project.Project.getPackagesSync();

  return packages.map((pkg: any) => {
    const maturity = pkg.get('maturity');
    const alpha = pkg.name.startsWith('@aws-cdk/')
      && (maturity === 'experimental' || maturity === 'developer-preview');

    return {
      name: pkg.name,
      location: pkg.location,
      alpha,
    };
  });
}
