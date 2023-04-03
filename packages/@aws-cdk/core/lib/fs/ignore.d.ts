import { CopyOptions } from './options';
/**
 * Represents file path ignoring behavior.
 */
export declare abstract class IgnoreStrategy {
    /**
     * Ignores file paths based on simple glob patterns.
     *
     * @returns `GlobIgnorePattern` associated with the given patterns.
     * @param absoluteRootPath the absolute path to the root directory of the paths to be considered
     * @param patterns
     */
    static glob(absoluteRootPath: string, patterns: string[]): GlobIgnoreStrategy;
    /**
     * Ignores file paths based on the [`.gitignore specification`](https://git-scm.com/docs/gitignore).
     *
     * @returns `GitIgnorePattern` associated with the given patterns.
     * @param absoluteRootPath the absolute path to the root directory of the paths to be considered
     * @param patterns
     */
    static git(absoluteRootPath: string, patterns: string[]): GitIgnoreStrategy;
    /**
     * Ignores file paths based on the [`.dockerignore specification`](https://docs.docker.com/engine/reference/builder/#dockerignore-file).
     *
     * @returns `DockerIgnorePattern` associated with the given patterns.
     * @param absoluteRootPath the absolute path to the root directory of the paths to be considered
     * @param patterns
     */
    static docker(absoluteRootPath: string, patterns: string[]): DockerIgnoreStrategy;
    /**
     * Creates an IgnoreStrategy based on the `ignoreMode` and `exclude` in a `CopyOptions`.
     *
     * @returns `IgnoreStrategy` based on the `CopyOptions`
     * @param absoluteRootPath the absolute path to the root directory of the paths to be considered
     * @param options the `CopyOptions` to create the `IgnoreStrategy` from
     */
    static fromCopyOptions(options: CopyOptions, absoluteRootPath: string): IgnoreStrategy;
    /**
     * Adds another pattern.
     * @params pattern the pattern to add
     */
    abstract add(pattern: string): void;
    /**
     * Determines whether a given file path should be ignored or not.
     *
     * @param absoluteFilePath absolute file path to be assessed against the pattern
     * @returns `true` if the file should be ignored
     */
    abstract ignores(absoluteFilePath: string): boolean;
}
/**
 * Ignores file paths based on simple glob patterns.
 */
export declare class GlobIgnoreStrategy extends IgnoreStrategy {
    private readonly absoluteRootPath;
    private readonly patterns;
    constructor(absoluteRootPath: string, patterns: string[]);
    /**
     * Adds another pattern.
     * @params pattern the pattern to add
     */
    add(pattern: string): void;
    /**
     * Determines whether a given file path should be ignored or not.
     *
     * @param absoluteFilePath absolute file path to be assessed against the pattern
     * @returns `true` if the file should be ignored
     */
    ignores(absoluteFilePath: string): boolean;
}
/**
 * Ignores file paths based on the [`.gitignore specification`](https://git-scm.com/docs/gitignore).
 */
export declare class GitIgnoreStrategy extends IgnoreStrategy {
    private readonly absoluteRootPath;
    private readonly ignore;
    constructor(absoluteRootPath: string, patterns: string[]);
    /**
     * Adds another pattern.
     * @params pattern the pattern to add
     */
    add(pattern: string): void;
    /**
     * Determines whether a given file path should be ignored or not.
     *
     * @param absoluteFilePath absolute file path to be assessed against the pattern
     * @returns `true` if the file should be ignored
     */
    ignores(absoluteFilePath: string): boolean;
}
/**
 * Ignores file paths based on the [`.dockerignore specification`](https://docs.docker.com/engine/reference/builder/#dockerignore-file).
 */
export declare class DockerIgnoreStrategy extends IgnoreStrategy {
    private readonly absoluteRootPath;
    private readonly ignore;
    constructor(absoluteRootPath: string, patterns: string[]);
    /**
     * Adds another pattern.
     * @params pattern the pattern to add
     */
    add(pattern: string): void;
    /**
     * Determines whether a given file path should be ignored or not.
     *
     * @param absoluteFilePath absolute file path to be assessed against the pattern
     * @returns `true` if the file should be ignored
     */
    ignores(absoluteFilePath: string): boolean;
}
