import * as path from 'path';
import type * as DockerIgnore from '@balena/dockerignore';
import dockerIgnore from '@balena/dockerignore';
import type * as GitIgnore from 'ignore';
import gitIgnore from 'ignore';
import type { CopyOptions } from './options';
import { IgnoreMode } from './options';
import { UnscopedValidationError } from '../errors';
import { lit } from '../private/literal-string';

// Must be a 'require' to not run afoul of ESM module import rules
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { minimatch } = require('minimatch');

// Negation rules as described in @balena/dockerignore.
// See https://www.npmjs.com/package/@balena/dockerignore#exclusion-patterns
const DOCKER_NEGATIVE_PATTERN = /^\s*(\!|\/\!)(.*)/;

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
   * Determines whether a given directory path should be ignored and have all of its children ignored.
   *
   * @param absoluteDirectoryPath absolute directory path to be assessed against the pattern
   * @returns `true` if the directory and all of its children should be ignored
   */
  public completelyIgnores(absoluteDirectoryPath: string): boolean {
    return this.ignores(absoluteDirectoryPath);
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
      throw new UnscopedValidationError(lit`GlobIgnoreStrategyExpectsAbsolute`, 'GlobIgnoreStrategy expects an absolute file path');
    }

    this.absoluteRootPath = absoluteRootPath;
    this.patterns = patterns;
  }

  public add(pattern: string): void {
    this.patterns.push(pattern);
  }

  public ignores(absoluteFilePath: string): boolean {
    if (!path.isAbsolute(absoluteFilePath)) {
      throw new UnscopedValidationError(lit`GlobIgnoreStrategyIgnoresExpects`, 'GlobIgnoreStrategy.ignores() expects an absolute path');
    }

    const relativePath = path.relative(this.absoluteRootPath, absoluteFilePath);
    let excludeOutput = false;

    // Last matching pattern wins, and a `!` pattern re-includes.
    for (const pattern of this.patterns) {
      if (minimatch(relativePath, pattern, { matchBase: true, flipNegate: true })) {
        excludeOutput = !pattern.startsWith('!');
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
      throw new UnscopedValidationError(lit`GitIgnoreStrategyExpectsAbsolute`, 'GitIgnoreStrategy expects an absolute file path');
    }

    this.absoluteRootPath = absoluteRootPath;
    this.ignore = gitIgnore().add(patterns);
  }

  public add(pattern: string): void {
    this.ignore.add(pattern);
  }

  public ignores(absoluteFilePath: string): boolean {
    if (!path.isAbsolute(absoluteFilePath)) {
      throw new UnscopedValidationError(lit`GitIgnoreStrategyIgnoresExpects`, 'GitIgnoreStrategy.ignores() expects an absolute path');
    }

    return this.ignore.ignores(path.relative(this.absoluteRootPath, absoluteFilePath));
  }

  public completelyIgnores(absoluteDirectoryPath: string): boolean {
    if (!path.isAbsolute(absoluteDirectoryPath)) {
      throw new UnscopedValidationError(lit`GitIgnoreStrategyCompletelyIgnores`, 'GitIgnoreStrategy.completelyIgnores() expects an absolute path');
    }

    // A trailing separator tells gitignore this is a directory.
    const relativePath = path.relative(this.absoluteRootPath, absoluteDirectoryPath);
    const asDirectory = relativePath.endsWith(path.sep) ? relativePath : relativePath + path.sep;

    return this.ignore.ignores(asDirectory);
  }
}

/**
 * Ignores file paths based on the [`.dockerignore specification`](https://docs.docker.com/engine/reference/builder/#dockerignore-file).
 */
export class DockerIgnoreStrategy extends IgnoreStrategy {
  private readonly absoluteRootPath: string;
  private readonly ignore: DockerIgnore.Ignore;
  private readonly completeIgnore: DockerIgnore.Ignore;

  constructor(absoluteRootPath: string, patterns: string[]) {
    super();

    if (!path.isAbsolute(absoluteRootPath)) {
      throw new UnscopedValidationError(lit`DockerIgnoreStrategyExpectsAbsolute`, 'DockerIgnoreStrategy expects an absolute file path');
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

    const negativeMatch = pattern.match(DOCKER_NEGATIVE_PATTERN);
    if (negativeMatch === null) {
      return;
    }

    const [, negation, negatedPath] = negativeMatch;
    for (let dir = path.dirname(negatedPath); dir !== '/' && dir !== '.'; dir = path.dirname(dir)) {
      this.completeIgnore.add(negation + dir);
    }
  }

  public add(pattern: string): void {
    this.ignore.add(pattern);
    this.completelyAdd(pattern);
  }

  private getRelativePath(absoluteFilePath: string): string {
    if (!path.isAbsolute(absoluteFilePath)) {
      throw new UnscopedValidationError(lit`DockerIgnoreStrategyIgnoresExpects`, 'DockerIgnoreStrategy.ignores() expects an absolute path');
    }

    return path.relative(this.absoluteRootPath, absoluteFilePath);
  }

  public ignores(absoluteFilePath: string): boolean {
    return this.ignore.ignores(this.getRelativePath(absoluteFilePath));
  }

  public completelyIgnores(absoluteDirectoryPath: string): boolean {
    const relativePath = this.getRelativePath(absoluteDirectoryPath);
    return this.ignore.ignores(relativePath) && this.completeIgnore.ignores(relativePath);
  }
}
