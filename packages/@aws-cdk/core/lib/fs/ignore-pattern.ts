import dockerIgnore, * as DockerIgnore from '@balena/dockerignore';
import gitIgnore, * as GitIgnore from 'ignore';
import * as minimatch from 'minimatch';

/**
 * Represents file path ignoring behavior.
 */
export abstract class IgnorePattern {
  /**
   * Ignores file paths based on simple glob patterns.
   *
   * @returns `GlobIgnorePattern` associated with the given patterns.
   * @param patterns
   */
  public static glob(patterns: string[]): GlobIgnorePattern {
    return new GlobIgnorePattern(patterns);
  }

  /**
   * Ignores file paths based on the [`.gitignore specification`](https://git-scm.com/docs/gitignore).
   *
   * @returns `GitIgnorePattern` associated with the given patterns.
   * @param patterns
   */
  public static git(patterns: string[]): GitIgnorePattern {
    return new GitIgnorePattern(patterns);
  }

  /**
   * Ignores file paths based on the [`.dockerignore specification`](https://docs.docker.com/engine/reference/builder/#dockerignore-file).
   *
   * @returns `DockerIgnorePattern` associated with the given patterns.
   * @param patterns
   */
  public static docker(patterns: string[]): DockerIgnorePattern {
    return new DockerIgnorePattern(patterns);
  }

  /**
   * Determines whether a given file path should be ignored or not.
   *
   * @param filePath file path to be assessed against the pattern
   * @returns `true` if the file should be ignored
   */
  public abstract ignores(filePath: string): boolean;
}

/**
 * Ignores file paths based on simple glob patterns.
 */
export class GlobIgnorePattern extends IgnorePattern {
  private readonly patterns: string[];

  constructor(patterns: string[]) {
    super();

    this.patterns = patterns;
  }

  /**
   * Determines whether a given file path should be ignored or not.
   *
   * @param filePath file path to be assessed against the pattern
   * @returns `true` if the file should be ignored
   */
  public ignores(filePath: string): boolean {
    let excludeOutput = false;

    for (const pattern of this.patterns) {
      const negate = pattern.startsWith('!');
      const match = minimatch(filePath, pattern, { matchBase: true, flipNegate: true });

      if (!negate && match) {
        excludeOutput = true;
      }

      if (negate && match) {
        excludeOutput = false;
      }
    }

    return excludeOutput;
  }
}

/**
 * Ignores file paths based on the [`.gitignore specification`](https://git-scm.com/docs/gitignore).
 */
export class GitIgnorePattern extends IgnorePattern {
  private readonly ignore: GitIgnore.Ignore;

  constructor(patterns: string[]) {
    super();

    this.ignore = gitIgnore().add(patterns);
  }

  /**
   * Determines whether a given file path should be ignored or not.
   *
   * @param filePath file path to be assessed against the pattern
   * @returns `true` if the file should be ignored
   */
  public ignores(filePath: string): boolean {
    return this.ignore.ignores(filePath);
  }
}

/**
 * Ignores file paths based on the [`.dockerignore specification`](https://docs.docker.com/engine/reference/builder/#dockerignore-file).
 */
export class DockerIgnorePattern extends IgnorePattern {
  private readonly ignore: DockerIgnore.Ignore;

  constructor(patterns: string[]) {
    super();

    this.ignore = dockerIgnore().add(patterns);
  }

  /**
   * Determines whether a given file path should be ignored or not.
   *
   * @param filePath file path to be assessed against the pattern
   * @returns `true` if the file should be ignored
   */
  public ignores(filePath: string): boolean {
    return this.ignore.ignores(filePath);
  }
}
