import type { ExecSyncOptionsWithStringEncoding } from 'child_process';
import { execSync } from 'child_process';
import * as path from 'path';

/**
 * Retrieves git source information (remote URL and latest commit) for the current repository.
 * Uses the CDK app entry point to determine the correct git repository.
 * Returns undefined if git is not available, the app is not in a git repo,
 * or CDK_DISABLE_GIT_SOURCE is set.
 */
export function getGitSource(): { repository: string; commit: string } | undefined {
  if (process.env.CDK_DISABLE_GIT_SOURCE == '1' || process.env.CDK_DISABLE_GIT_SOURCE == 'true') {
    return undefined;
  }
  try {
    const appDir = process.argv[1] ? path.dirname(path.resolve(process.argv[1])) : process.cwd();
    const opts: ExecSyncOptionsWithStringEncoding = {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe'],
      cwd: appDir,
    };
    const repository = execSync('git ls-remote --get-url', opts).trim();
    const commit = execSync('git rev-parse HEAD', opts).trim();
    if (!repository || !commit) {
      return undefined;
    }
    return { repository, commit };
  } catch {
    return undefined;
  }
}
