import type { ExecSyncOptionsWithStringEncoding } from 'child_process';
import { execSync } from 'child_process';
import * as path from 'path';
import type { IConstruct } from 'constructs';
import { Annotations } from './annotations';

const ENABLE_GIT_SOURCE_CONTEXT = '@aws-cdk/core:enableGitSource';

let cached: { value: GitSource | undefined; warning: Error | undefined; securityError: GitSourceSecurityError | undefined } | undefined;

/**
 * Provides access to the git source information (repository URL and commit hash)
 * for the current CDK application.
 *
 * The git source is detected automatically from the environment when the
 * `@aws-cdk/core:enableGitSource` context flag is enabled.
 *
 * @example
 *
 * if (GitSource.isEnabled(this)) {
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
    return scope.node.tryGetContext(ENABLE_GIT_SOURCE_CONTEXT) === true;
  }

  /**
   * Returns the git source information for the current repository, or `undefined`
   * if git information could not be detected.
   *
   * If detection fails for non-security reasons (e.g., git is not installed or the
   * directory is not a git repository), a warning is emitted on the given scope and
   * `undefined` is returned.
   *
   * If detection fails due to a security concern (e.g., the commit hash or repository
   * URL contains unexpected content), an error is thrown.
   */
  public static of(scope: IConstruct): GitSource | undefined {
    if (cached) {
      if (cached.securityError) {
        throw cached.securityError;
      }
      if (cached.warning) {
        Annotations.of(scope).addWarningV2('@aws-cdk/core:gitSourceDetectionFailed', cached.warning.message);
      }
      return cached.value;
    }

    try {
      const result = detectGitSource();
      const value = new GitSource(result.repository, result.commit);
      cached = { value, warning: undefined, securityError: undefined };
      return value;
    } catch (e) {
      if (e instanceof GitSourceSecurityError) {
        cached = { value: undefined, warning: undefined, securityError: e };
        throw e;
      }
      const message = `Failed to detect git source information: ${e instanceof Error ? e.message : String(e)}`;
      cached = { value: undefined, warning: new Error(message), securityError: undefined };
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
    cached = undefined;
  }

  private constructor(
    /**
     * The remote repository URL.
     */
    public readonly repository: string,
    /**
     * The commit hash (SHA-1).
     */
    public readonly commit: string,
  ) {}
}

/**
 * Thrown when git source detection encounters output that indicates
 * a security issue (e.g., credentials in the URL or unexpected content
 * in the commit hash).
 */
export class GitSourceSecurityError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'GitSourceSecurityError';
  }
}

function detectGitSource(): { repository: string; commit: string } {
  const appDir = process.argv[1] ? path.dirname(path.resolve(process.argv[1])) : process.cwd();
  const opts: ExecSyncOptionsWithStringEncoding = {
    encoding: 'utf-8',
    stdio: ['pipe', 'pipe', 'pipe'],
    timeout: 5000,
    cwd: appDir,
  };

  const rawRepository = execSync('git ls-remote --get-url', opts).trim();
  const commit = execSync('git rev-parse HEAD', opts).trim();

  // Validate commit hash format (40 hex characters for SHA-1)
  if (!commit || !/^[a-f0-9]{40}$/i.test(commit)) {
    throw new GitSourceSecurityError(
      'git rev-parse HEAD returned an unexpected value. '
      + 'This may indicate that the git output has been tampered with or contains injected content. '
      + `Got: ${JSON.stringify(commit)}`,
    );
  }

  // Validate URL format and reject control characters
  const urlRegex = /^(https?:\/\/|git@|git:\/\/|ssh:\/\/)[^\s<>"|{}^`\[\]\\]+$/;
  if (!rawRepository || /[\x00-\x1F\x7F]/.test(rawRepository) || !urlRegex.test(rawRepository)) {
    throw new GitSourceSecurityError(
      'git ls-remote --get-url returned a URL with unexpected content. '
      + 'This may indicate that the repository URL contains embedded credentials or injected content. '
      + `Got: ${JSON.stringify(rawRepository)}`,
    );
  }

  // Sanitize repository URL to remove embedded credentials
  const repository = rawRepository.replace(/^(https?:\/\/)[^@]+@/i, '$1');

  return { repository, commit };
}
