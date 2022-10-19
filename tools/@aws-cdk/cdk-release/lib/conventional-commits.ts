import { ReleaseOptions } from './types';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const conventionalCommitsParser = require('conventional-commits-parser');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const gitRawCommits = require('git-raw-commits');

/**
 * The optional notes in the commit message.
 * Today, the only notes are 'BREAKING CHANGES'.
 */
export interface ConventionalCommitNote {
  /** Today, always 'BREAKING CHANGE'. */
  readonly title: string;

  /** The body of the note. */
  readonly text: string;
}

/** For now, only needed for unit tests. */
export interface ConventionalCommitReference {
}

export interface ConventionalCommit {
  /** The type of the commit ('feat', 'fix', etc.). */
  readonly type: string;

  /** The optional scope of the change ('core', 'aws-s3', 's3', etc.). */
  readonly scope?: string;

  /** The subject is the remaining part of the first line without 'type' and 'scope'. */
  readonly subject: string;

  /**
   * The header is the entire first line of the commit
   * (<type>(<scope>): <subject>).
   */
  readonly header: string;

  /**
   * The optional notes in the commit message.
   * Today, the only notes are 'BREAKING CHANGES'.
   */
  readonly notes: ConventionalCommitNote[];

  /**
   * References inside the commit body
   * (for example, to issues or Pull Requests that this commit is linked to).
   */
  readonly references: ConventionalCommitReference[];
}

/**
 * Returns a list of all Conventional Commits in the Git repository since the tag `gitTag`.
 * The commits will be sorted in chronologically descending order
 * (that is, later/newer commits will be earlier in the array).
 *
 * @param gitTag the string representing the Git tag,
 *   will be used to limit the returned commits to only those added after that tag
 */
export async function getConventionalCommitsFromGitHistory(args: ReleaseOptions, gitTag: string): Promise<ConventionalCommit[]> {
  // Since the commits are needed mainly for the Changelog generation,
  // skip getting them if skipChangelog is `true`.
  // This is needed to make our build succeed in environments without a Git repository,
  // like CodeBuild in CodePipeline
  if (args.skip?.changelog) {
    return [];
  }

  const ret = new Array<any>();
  return new Promise((resolve, reject) => {
    const conventionalCommitsStream = gitRawCommits({
      // Raw body (subject + body) + '\n-hash-\n' + commit hash
      format: '%B%n-hash-%n%H',
      // our tags have the 'v' prefix
      from: gitTag,
    }).pipe(conventionalCommitsParser());

    conventionalCommitsStream.on('data', function (data: any) {
      // filter out all commits that don't conform to the Conventional Commits standard
      // (they will have an empty 'type' property)
      if (data.type) {
        ret.push(data);
      }
    });
    conventionalCommitsStream.on('end', function () {
      resolve(ret);
    });
    conventionalCommitsStream.on('error', function (err: any) {
      reject(err);
    });
  });
}

/**
 * Options for filterCommits
 */
export interface FilterCommitsOptions {
  /**
   * Scopes matching these package names (and variants) will be excluded from the commits returned.
   * @default - No packages are excluded.
   **/
  excludePackages?: string[];

  /**
   * If provided, scopes matching these package names (and variants) will be the *only commits* considered.
   * @default - All packages are included.
   **/
  includePackages?: string[];
}

/**
 * Filters commits based on package scopes and inclusion/exclusion criteria.
 * If `opts.includePackages` is provided, commits without scopes will not be included.
 *
 * @param commits the array of Conventional Commits to filter
 * @param opts filtering options; if none are provided, all commits are returned.
 */
export function filterCommits(commits: ConventionalCommit[], opts: FilterCommitsOptions = {}): ConventionalCommit[] {
  const excludeScopes = createScopeVariations(opts.excludePackages ?? []);
  const includeScopes = createScopeVariations(opts.includePackages ?? []);

  return commits
    .filter(commit => includeScopes.length === 0 || (commit.scope && includeScopes.includes(commit.scope)))
    .filter(commit => excludeScopes.length === 0 || !commit.scope || !excludeScopes.includes(commit.scope));
}

function createScopeVariations(names: string[]) {
  const simplifiedNames = names.map(n => n.replace(/^@aws-cdk\//, ''));

  return flatMap(simplifiedNames, (pkgName) => [
    pkgName,
    ...(pkgName.startsWith('aws-')
      ? [
        // if the package name starts with 'aws', like 'aws-s3',
        // also include in the scopes variants without the prefix,
        // and without the '-' in the prefix
        // (so, 's3' and 'awss3')
        pkgName.slice('aws-'.length),
        pkgName.replace(/^aws-/, 'aws'),
      ]
      : []
    ),
  ]);
}

function flatMap<T, U>(xs: T[], fn: (x: T) => U[]): U[] {
  const ret = new Array<U>();
  for (const x of xs) {
    ret.push(...fn(x));
  }
  return ret;
}
