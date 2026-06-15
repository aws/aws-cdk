import type { ExecSyncOptionsWithStringEncoding } from 'child_process';
import { execSync } from 'child_process';
import type { IConstruct } from 'constructs';
import { Annotations } from './annotations';
import { UnscopedValidationError } from './errors';
import { lit } from './private/literal-string';

const ENABLE_GIT_SOURCE_CONTEXT = '@aws-cdk/core:enableGitSource';

let detectAttempted = false;
let cached: GitSource | undefined;

/**
 * Provides access to the git source information (repository URL and commit hash)
 * for the current CDK application.
 *
 * The git source is detected automatically from the environment when the
 * `@aws-cdk/core:enableGitSource` context flag is enabled.
 *
 * @example
 *
 * if (GitSource.isEnabledFor(this)) {
 *   const gitSource = GitSource.of(this);
 *   if (gitSource) {
 *     Tags.of(this).add('git:commit', gitSource.commit);
 *   }
 * }
 */
export class GitSource {
  /**
   * Returns whether git source detection is enabled for the given scope.
   *
   * This checks the `@aws-cdk/core:enableGitSource` context flag.
   */
  public static isEnabledFor(scope: IConstruct): boolean {
    const value = scope.node.tryGetContext(ENABLE_GIT_SOURCE_CONTEXT);
    return value === true || value === 'true';
  }

  /**
   * Returns the git source information for the current repository, or `undefined`
   * if git information could not be detected.
   *
   * If detection fails (e.g., git is not installed, the directory is not a git
   * repository, or the output fails validation), a warning is emitted on the
   * given scope and `undefined` is returned.
   */
  public static of(scope: IConstruct): GitSource | undefined {
    if (detectAttempted) {
      // If we have already attempted to detect the git source once, there is no
      // need to attempt again. Just return whatever we got the first time around,
      // whether it is a proper value or undefined (if it has failed before, it will
      // fail again now).
      return cached;
    }

    detectAttempted = true;
    try {
      const result = detectGitSource();
      cached = new GitSource(result.repository, result.commit);
      return cached;
    } catch (e) {
      const message = `Failed to detect git source information: ${e instanceof Error ? e.message : String(e)}`;
      Annotations.of(scope).addWarningV2('@aws-cdk/core:gitSourceDetectionFailed', message);
      return undefined;
    }
  }

  /**
   * Clears the cached git source information. Subsequent calls to `of()` will
   * re-detect the git source from the environment.
   *
   * @internal
   */
  public static _clearCache() {
    detectAttempted = false;
    cached = undefined;
  }

  private constructor(
    /**
     * The remote repository URL.
     */
    public readonly repository: string,
    /**
     * The commit hash (SHA-1 or SHA-256).
     */
    public readonly commit: string,
  ) {}
}

function detectGitSource(): { repository: string; commit: string } {
  const opts: ExecSyncOptionsWithStringEncoding = {
    encoding: 'utf-8',
    stdio: ['pipe', 'pipe', 'pipe'],
    timeout: 5000,
    cwd: process.cwd(),
  };

  const rawRepository = execSync('git config --get remote.origin.url', opts).trim();
  const commit = execSync('git rev-parse HEAD', opts).trim();

  // Validate commit hash format (40 hex chars for SHA-1, 64 for SHA-256)
  if (!commit || !/^[a-f0-9]{40}([a-f0-9]{24})?$/i.test(commit)) {
    throw new UnscopedValidationError(lit`InvalidCommitHash`,
      'git rev-parse HEAD returned an unexpected value. '
      + 'Expected a 40 or 64 character hex string. '
      + `Got: ${JSON.stringify(commit)}`,
    );
  }

  // Validate URL format and reject control characters
  const urlRegex = /^(https?:\/\/|git@|git:\/\/|ssh:\/\/)[^\s<>"|{}^`\[\]\\]+$/;
  if (!rawRepository || /[\x00-\x1F\x7F]/.test(rawRepository) || !urlRegex.test(rawRepository)) {
    throw new UnscopedValidationError(lit`InvalidRepositoryUrl`,
      'git config --get remote.origin.url returned a URL with unexpected content. '
      + `Got: ${JSON.stringify(rawRepository)}`,
    );
  }

  // Sanitize repository URL to remove embedded credentials (only in the authority portion)
  const repository = rawRepository.replace(/^((?:https?|ssh|git):\/\/)[^/@]+@/, '$1');

  return { repository, commit };
}
