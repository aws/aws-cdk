import * as path from 'path';
import dockerIgnore, * as DockerIgnore from '@balena/dockerignore';
import gitIgnore, * as GitIgnore from 'ignore';
import { CopyOptions, IgnoreMode } from './options';
import { UnscopedValidationError } from '../errors';

// Must be a 'require' to not run afoul of ESM module import rules
// eslint-disable-next-line @typescript-eslint/no-require-imports
const minimatch = require('minimatch');

/**
 * Represents file path ignoring behavior.
 */
export abstract class IgnoreStrategy {
  /**
   * Ignores file paths based on simple glob patterns.
   *
   * @returns `GlobIgnorePattern` associated with the given patterns.
   * @param absoluteRootPath the absolute path to the root directory of the paths to be considered
   */
  public static glob(absoluteRootPath: string, patterns: string[]): GlobIgnoreStrategy {
    return new GlobIgnoreStrategy(absoluteRootPath, patterns);
  }

  /**
   * Ignores file paths based on the [`.gitignore specification`](https://git-scm.com/docs/gitignore).
   *
   * @returns `GitIgnorePattern` associated with the given patterns.
   * @param absoluteRootPath the absolute path to the root directory of the paths to be considered
   */
  public static git(absoluteRootPath: string, patterns: string[]): GitIgnoreStrategy {
    return new GitIgnoreStrategy(absoluteRootPath, patterns);
  }

  /**
   * Ignores file paths based on the [`.dockerignore specification`](https://docs.docker.com/engine/reference/builder/#dockerignore-file).
   *
   * @returns `DockerIgnorePattern` associated with the given patterns.
   * @param absoluteRootPath the absolute path to the root directory of the paths to be considered
   */
  public static docker(absoluteRootPath: string, patterns: string[]): DockerIgnoreStrategy {
    return new DockerIgnoreStrategy(absoluteRootPath, patterns);
  }

  /**
   * Creates an IgnoreStrategy based on the `ignoreMode` and `exclude` in a `CopyOptions`.
   *
   * @returns `IgnoreStrategy` based on the `CopyOptions`
   * @param absoluteRootPath the absolute path to the root directory of the paths to be considered
   * @param options the `CopyOptions` to create the `IgnoreStrategy` from
   */
  public static fromCopyOptions(options: CopyOptions, absoluteRootPath: string): IgnoreStrategy {
    const ignoreMode = options.ignoreMode || IgnoreMode.GLOB;
    const exclude = options.exclude || [];

    switch (ignoreMode) {
      case IgnoreMode.GLOB:
        return this.glob(absoluteRootPath, exclude);

      case IgnoreMode.GIT:
        return this.git(absoluteRootPath, exclude);

      case IgnoreMode.DOCKER:
        return this.docker(absoluteRootPath, exclude);
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
   * @param absoluteFilePath absolute file path to be assessed against the pattern
   * @returns `true` if the file should be ignored
   */
  public abstract ignores(absoluteFilePath: string): boolean;

  /**
   * Determines whether a given file path should be ignored and have all of its children ignored
   * if its a directory.
   *
   * @param absoluteFilePath absolute file path to be assessed against the pattern
   * @returns `true` if the file should be ignored
   */
  public completelyIgnores(absoluteFilePath: string): boolean {
    return this.ignores(absoluteFilePath);
  }
}

/**
 * Ignores file paths based on simple glob patterns.
 */
export class GlobIgnoreStrategy extends IgnoreStrategy {
  private readonly absoluteRootPath: string;
  private readonly patterns: string[];

  constructor(absoluteRootPath: string, patterns: string[]) {
    super();

    if (!path.isAbsolute(absoluteRootPath)) {
      throw new UnscopedValidationError('GlobIgnoreStrategy expects an absolute file path');
    }

    this.absoluteRootPath = absoluteRootPath;
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
   * @param absoluteFilePath absolute file path to be assessed against the pattern
   * @returns `true` if the file should be ignored
   */
  public ignores(absoluteFilePath: string): boolean {
    if (!path.isAbsolute(absoluteFilePath)) {
      throw new UnscopedValidationError('GlobIgnoreStrategy.ignores() expects an absolute path');
    }

    let relativePath = path.relative(this.absoluteRootPath, absoluteFilePath);
    let excludeOutput = false;

    for (const pattern of this.patterns) {
      const negate = pattern.startsWith('!');
      const match = minimatch(relativePath, pattern, { matchBase: true, flipNegate: true });

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
  private readonly absoluteRootPath: string;
  private readonly ignore: GitIgnore.Ignore;

  constructor(absoluteRootPath: string, patterns: string[]) {
    super();

    if (!path.isAbsolute(absoluteRootPath)) {
      throw new UnscopedValidationError('GitIgnoreStrategy expects an absolute file path');
    }

    this.absoluteRootPath = absoluteRootPath;
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
   * @param absoluteFilePath absolute file path to be assessed against the pattern
   * @returns `true` if the file should be ignored
   */
  public ignores(absoluteFilePath: string): boolean {
    if (!path.isAbsolute(absoluteFilePath)) {
      throw new UnscopedValidationError('GitIgnoreStrategy.ignores() expects an absolute path');
    }

    let relativePath = path.relative(this.absoluteRootPath, absoluteFilePath);

    return this.ignore.ignores(relativePath);
  }
}

/**
 * Ignores file paths based on the [`.dockerignore specification`](https://docs.docker.com/engine/reference/builder/#dockerignore-file).
 */
export class DockerIgnoreStrategy extends IgnoreStrategy {
  private readonly absoluteRootPath: string;
  private readonly ignore: DockerIgnore.Ignore;
  private readonly completeIgnore: DockerIgnore.Ignore;
  // Follows negation rules as describe in @balena/dockerignore
  // See https://www.npmjs.com/package/@balena/dockerignore#exclusion-patterns
  private readonly negativeIgnoreRegex = /^\s*(\!|\/\!)(.*)/;

  constructor(absoluteRootPath: string, patterns: string[]) {
    super();

    if (!path.isAbsolute(absoluteRootPath)) {
      throw new UnscopedValidationError('DockerIgnoreStrategy expects an absolute file path');
    }

    this.absoluteRootPath = absoluteRootPath;
    this.completeIgnore = dockerIgnore();
    this.ignore = dockerIgnore();
    for (const pattern of patterns) {
      this.add(pattern);
    }
  }

  /**
   * Adds the pattern to completeIgnore. If its an exclude pattern, it also adds an entry for each parent directory.
   * This is useful in detecting folders that are ignored, but that could have children files which are not ignored.
   *
   * @param pattern pattern to add
   */
  private completelyAdd(pattern: string) {
    this.completeIgnore.add(pattern);

    const negativeMatch = pattern.match(this.negativeIgnoreRegex);
    if (negativeMatch !== null) {
      let dirname: string | undefined = negativeMatch[2]!;
      while (true) {
        dirname = path.dirname(dirname);
        if (dirname === '/' || dirname === '.') {
          break;
        }

        this.completeIgnore.add(negativeMatch[1]+dirname);
      }
    }
  }

  /**
   * Adds another pattern.
   * @params pattern the pattern to add
   */
  public add(pattern: string): void {
    this.ignore.add(pattern);
    this.completelyAdd(pattern);
  }

  private getRelativePath(absoluteFilePath: string): string {
    if (!path.isAbsolute(absoluteFilePath)) {
      throw new UnscopedValidationError('DockerIgnoreStrategy.ignores() expects an absolute path');
    }

    return path.relative(this.absoluteRootPath, absoluteFilePath);
  }

  /**
   * Determines whether a given file path should be ignored or not.
   *
   * @param absoluteFilePath absolute file path to be assessed against the pattern
   * @returns `true` if the file should be ignored
   */
  public ignores(absoluteFilePath: string): boolean {
    return this.ignore.ignores(this.getRelativePath(absoluteFilePath));
  }

  /**
   * Determines whether a given file path should be ignored and have all of its children ignored
   * if its a directory.
   *
   * @param absoluteFilePath absolute file path to be assessed against the pattern
   * @returns `true` if the file should be ignored
   */
  public completelyIgnores(absoluteFilePath: string): boolean {
    const relativePath = this.getRelativePath(absoluteFilePath);
    return this.ignore.ignores(relativePath) && this.completeIgnore.ignores(relativePath);
  }
}
