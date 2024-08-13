import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs-extra';
import { IPackageSourceSetup, IPackageSource } from './source';
import { findUp } from '../files';
import { shell, addToShellPath } from '../shell';

export class RepoPackageSourceSetup implements IPackageSourceSetup {
  readonly name = 'repo';
  readonly description = `repo(${this.repoRoot})`;

  constructor(private readonly repoRoot: string) {
  }

  public async prepare(): Promise<void> {
    if (!await fs.pathExists(path.join(this.repoRoot, 'package.json')) || !await fs.pathExists(path.join(this.repoRoot, 'yarn.lock'))) {
      throw new Error(`${this.repoRoot}: does not look like the repository root`);
    }

    process.env.REPO_ROOT = this.repoRoot;
    process.env.REPO_PACKAGE_MAP = await writePackageMap(this.repoRoot);
    addToShellPath(path.resolve(__dirname, 'repo-tools'));
  }

  public async cleanup(): Promise<void> {
  }
}

export class RepoPackageSource implements IPackageSource {
  private readonly repoRoot: string;

  constructor() {
    this.repoRoot = process.env.REPO_ROOT as string;
  }

  public async makeCliAvailable() {
    addToShellPath(path.join(this.repoRoot, 'packages', 'aws-cdk', 'bin'));
  }

  public assertJsiiPackagesAvailable() {
    throw new Error('jsii client packages are not available when using REPO source');
  }

  public async initializeDotnetPackages() {
  }

  public majorVersion() {
    const releaseJson = fs.readJsonSync(path.resolve(this.repoRoot, 'release.json'));
    return releaseJson.majorVersion;
  }

  public requestedFrameworkVersion(): string {
    return '*';
  }

  public requestedAlphaVersion(): string {
    return '*';
  }
}

async function writePackageMap(repoRoot: string): Promise<string> {
  const packages = await findYarnPackages(repoRoot);
  const fileName = path.join(os.tmpdir(), 'package-map.json');
  await fs.writeJson(fileName, packages);
  return fileName;
}

/**
 * Cache monorepo discovery results, we only want to do this once per run
 */
const YARN_MONOREPO_CACHE: Record<string, any> = {};

/**
  * Return a { name -> directory } packages found in a Yarn monorepo
  *
  * Cached in YARN_MONOREPO_CACHE.
  */
async function findYarnPackages(root: string): Promise<Record<string, string>> {
  if (!(root in YARN_MONOREPO_CACHE)) {
    const output: YarnWorkspacesOutput = JSON.parse(await shell(['yarn', 'workspaces', '--silent', 'info'], {
      captureStderr: false,
      cwd: root,
      show: 'error',
    }));

    const ret: Record<string, string> = {};
    for (const [k, v] of Object.entries(output)) {
      ret[k] = path.join(root, v.location);
    }
    YARN_MONOREPO_CACHE[root] = ret;
  }
  return YARN_MONOREPO_CACHE[root];
}

/**
 * Find the root directory of the repo from the current directory
 */
export async function autoFindRoot() {
  const found = await findUp('release.json');
  if (!found) {
    throw new Error(`Could not determine repository root: 'release.json' not found from ${process.cwd()}`);
  }
  return path.dirname(found);
}

type YarnWorkspacesOutput = Record<string, { location: string }>;
