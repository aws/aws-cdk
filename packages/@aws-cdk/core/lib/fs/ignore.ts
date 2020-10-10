import dockerIgnore, * as DockerIgnore from '@balena/dockerignore';
import gitIgnore, * as GitIgnore from 'ignore';
import * as minimatch from 'minimatch';
import { CopyOptions, IgnoreMode } from './options';

/**
 * Represents file path ignoring behavior.
 */
export abstract class IgnoreStrategy {
  /**
   * Ignores file paths based on simple glob patterns.
   *
   * @returns `GlobIgnorePattern` associated with the given patterns.
   * @param patterns
   */
  public static glob(patterns: string[]): GlobIgnoreStrategy {
    return new GlobIgnoreStrategy(patterns);
  }

  /**
   * Ignores file paths based on the [`.gitignore specification`](https://git-scm.com/docs/gitignore).
   *
   * @returns `GitIgnorePattern` associated with the given patterns.
   * @param patterns
   */
  public static git(patterns: string[]): GitIgnoreStrategy {
    return new GitIgnoreStrategy(patterns);
  }

  /**
   * Ignores file paths based on the [`.dockerignore specification`](https://docs.docker.com/engine/reference/builder/#dockerignore-file).
   *
   * @returns `DockerIgnorePattern` associated with the given patterns.
   * @param patterns
   */
  public static docker(patterns: string[]): DockerIgnoreStrategy {
    return new DockerIgnoreStrategy(patterns);
  }

  /**
   * Creates an IgnoreStrategy based on the `ignoreMode` and `exclude` in a `CopyOptions`.
   *
   * @returns `IgnoreStrategy` based on the `CopyOptions`
   * @param options the `CopyOptions` to create the `IgnoreStrategy` from
   */
  public static fromCopyOptions(options: CopyOptions): IgnoreStrategy {
    const ignoreMode = options.ignoreMode || IgnoreMode.GLOB;
    const exclude = options.exclude || [];

    switch (ignoreMode) {
      case IgnoreMode.GLOB:
        return this.glob(exclude);

      case IgnoreMode.GIT:
        return this.git(exclude);

      case IgnoreMode.DOCKER:
        return this.docker(exclude);
    }
  }

  /**
   * Adds another pattern.
   * @params pattern the pattern to add
   */
  public abstract add(pattern: string): void;

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
export class GlobIgnoreStrategy extends IgnoreStrategy {
  private readonly patterns: string[];

  constructor(patterns: string[]) {
    super();

    this.patterns = patterns;
  }

  /**
   * Adds another pattern.
   * @params pattern the pattern to add
   */
  public add(pattern: string): void {
    this.patterns.push(pattern);
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
export class GitIgnoreStrategy extends IgnoreStrategy {
  private readonly ignore: GitIgnore.Ignore;

  constructor(patterns: string[]) {
    super();

    this.ignore = gitIgnore().add(patterns);
  }

  /**
   * Adds another pattern.
   * @params pattern the pattern to add
   */
  public add(pattern: string): void {
    this.ignore.add(pattern);
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
export class DockerIgnoreStrategy extends IgnoreStrategy {
  private readonly ignore: DockerIgnore.Ignore;

  constructor(patterns: string[]) {
    super();

    this.ignore = dockerIgnore().add(patterns);
  }

  /**
   * Adds another pattern.
   * @params pattern the pattern to add
   */
  public add(pattern: string): void {
    this.ignore.add(pattern);
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
