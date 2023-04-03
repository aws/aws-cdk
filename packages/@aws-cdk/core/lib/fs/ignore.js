"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DockerIgnoreStrategy = exports.GitIgnoreStrategy = exports.GlobIgnoreStrategy = exports.IgnoreStrategy = void 0;
const path = require("path");
const dockerignore_1 = require("@balena/dockerignore");
const ignore_1 = require("ignore");
const minimatch = require("minimatch");
const options_1 = require("./options");
/**
 * Represents file path ignoring behavior.
 */
class IgnoreStrategy {
    /**
     * Ignores file paths based on simple glob patterns.
     *
     * @returns `GlobIgnorePattern` associated with the given patterns.
     * @param absoluteRootPath the absolute path to the root directory of the paths to be considered
     * @param patterns
     */
    static glob(absoluteRootPath, patterns) {
        return new GlobIgnoreStrategy(absoluteRootPath, patterns);
    }
    /**
     * Ignores file paths based on the [`.gitignore specification`](https://git-scm.com/docs/gitignore).
     *
     * @returns `GitIgnorePattern` associated with the given patterns.
     * @param absoluteRootPath the absolute path to the root directory of the paths to be considered
     * @param patterns
     */
    static git(absoluteRootPath, patterns) {
        return new GitIgnoreStrategy(absoluteRootPath, patterns);
    }
    /**
     * Ignores file paths based on the [`.dockerignore specification`](https://docs.docker.com/engine/reference/builder/#dockerignore-file).
     *
     * @returns `DockerIgnorePattern` associated with the given patterns.
     * @param absoluteRootPath the absolute path to the root directory of the paths to be considered
     * @param patterns
     */
    static docker(absoluteRootPath, patterns) {
        return new DockerIgnoreStrategy(absoluteRootPath, patterns);
    }
    /**
     * Creates an IgnoreStrategy based on the `ignoreMode` and `exclude` in a `CopyOptions`.
     *
     * @returns `IgnoreStrategy` based on the `CopyOptions`
     * @param absoluteRootPath the absolute path to the root directory of the paths to be considered
     * @param options the `CopyOptions` to create the `IgnoreStrategy` from
     */
    static fromCopyOptions(options, absoluteRootPath) {
        const ignoreMode = options.ignoreMode || options_1.IgnoreMode.GLOB;
        const exclude = options.exclude || [];
        switch (ignoreMode) {
            case options_1.IgnoreMode.GLOB:
                return this.glob(absoluteRootPath, exclude);
            case options_1.IgnoreMode.GIT:
                return this.git(absoluteRootPath, exclude);
            case options_1.IgnoreMode.DOCKER:
                return this.docker(absoluteRootPath, exclude);
        }
    }
}
exports.IgnoreStrategy = IgnoreStrategy;
/**
 * Ignores file paths based on simple glob patterns.
 */
class GlobIgnoreStrategy extends IgnoreStrategy {
    constructor(absoluteRootPath, patterns) {
        super();
        if (!path.isAbsolute(absoluteRootPath)) {
            throw new Error('GlobIgnoreStrategy expects an absolute file path');
        }
        this.absoluteRootPath = absoluteRootPath;
        this.patterns = patterns;
    }
    /**
     * Adds another pattern.
     * @params pattern the pattern to add
     */
    add(pattern) {
        this.patterns.push(pattern);
    }
    /**
     * Determines whether a given file path should be ignored or not.
     *
     * @param absoluteFilePath absolute file path to be assessed against the pattern
     * @returns `true` if the file should be ignored
     */
    ignores(absoluteFilePath) {
        if (!path.isAbsolute(absoluteFilePath)) {
            throw new Error('GlobIgnoreStrategy.ignores() expects an absolute path');
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
exports.GlobIgnoreStrategy = GlobIgnoreStrategy;
/**
 * Ignores file paths based on the [`.gitignore specification`](https://git-scm.com/docs/gitignore).
 */
class GitIgnoreStrategy extends IgnoreStrategy {
    constructor(absoluteRootPath, patterns) {
        super();
        if (!path.isAbsolute(absoluteRootPath)) {
            throw new Error('GitIgnoreStrategy expects an absolute file path');
        }
        this.absoluteRootPath = absoluteRootPath;
        this.ignore = (0, ignore_1.default)().add(patterns);
    }
    /**
     * Adds another pattern.
     * @params pattern the pattern to add
     */
    add(pattern) {
        this.ignore.add(pattern);
    }
    /**
     * Determines whether a given file path should be ignored or not.
     *
     * @param absoluteFilePath absolute file path to be assessed against the pattern
     * @returns `true` if the file should be ignored
     */
    ignores(absoluteFilePath) {
        if (!path.isAbsolute(absoluteFilePath)) {
            throw new Error('GitIgnoreStrategy.ignores() expects an absolute path');
        }
        let relativePath = path.relative(this.absoluteRootPath, absoluteFilePath);
        return this.ignore.ignores(relativePath);
    }
}
exports.GitIgnoreStrategy = GitIgnoreStrategy;
/**
 * Ignores file paths based on the [`.dockerignore specification`](https://docs.docker.com/engine/reference/builder/#dockerignore-file).
 */
class DockerIgnoreStrategy extends IgnoreStrategy {
    constructor(absoluteRootPath, patterns) {
        super();
        if (!path.isAbsolute(absoluteRootPath)) {
            throw new Error('DockerIgnoreStrategy expects an absolute file path');
        }
        this.absoluteRootPath = absoluteRootPath;
        this.ignore = (0, dockerignore_1.default)().add(patterns);
    }
    /**
     * Adds another pattern.
     * @params pattern the pattern to add
     */
    add(pattern) {
        this.ignore.add(pattern);
    }
    /**
     * Determines whether a given file path should be ignored or not.
     *
     * @param absoluteFilePath absolute file path to be assessed against the pattern
     * @returns `true` if the file should be ignored
     */
    ignores(absoluteFilePath) {
        if (!path.isAbsolute(absoluteFilePath)) {
            throw new Error('DockerIgnoreStrategy.ignores() expects an absolute path');
        }
        let relativePath = path.relative(this.absoluteRootPath, absoluteFilePath);
        return this.ignore.ignores(relativePath);
    }
}
exports.DockerIgnoreStrategy = DockerIgnoreStrategy;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaWdub3JlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaWdub3JlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDZCQUE2QjtBQUM3Qix1REFBbUU7QUFDbkUsbUNBQStDO0FBQy9DLHVDQUF1QztBQUN2Qyx1Q0FBb0Q7QUFFcEQ7O0dBRUc7QUFDSCxNQUFzQixjQUFjO0lBQ2xDOzs7Ozs7T0FNRztJQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUMsZ0JBQXdCLEVBQUUsUUFBa0I7UUFDN0QsT0FBTyxJQUFJLGtCQUFrQixDQUFDLGdCQUFnQixFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQzVELENBQUM7SUFFRDs7Ozs7O09BTUc7SUFDSSxNQUFNLENBQUMsR0FBRyxDQUFDLGdCQUF3QixFQUFFLFFBQWtCO1FBQzVELE9BQU8sSUFBSSxpQkFBaUIsQ0FBQyxnQkFBZ0IsRUFBRSxRQUFRLENBQUMsQ0FBQztJQUMzRCxDQUFDO0lBRUQ7Ozs7OztPQU1HO0lBQ0ksTUFBTSxDQUFDLE1BQU0sQ0FBQyxnQkFBd0IsRUFBRSxRQUFrQjtRQUMvRCxPQUFPLElBQUksb0JBQW9CLENBQUMsZ0JBQWdCLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDOUQsQ0FBQztJQUVEOzs7Ozs7T0FNRztJQUNJLE1BQU0sQ0FBQyxlQUFlLENBQUMsT0FBb0IsRUFBRSxnQkFBd0I7UUFDMUUsTUFBTSxVQUFVLEdBQUcsT0FBTyxDQUFDLFVBQVUsSUFBSSxvQkFBVSxDQUFDLElBQUksQ0FBQztRQUN6RCxNQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsT0FBTyxJQUFJLEVBQUUsQ0FBQztRQUV0QyxRQUFRLFVBQVUsRUFBRTtZQUNsQixLQUFLLG9CQUFVLENBQUMsSUFBSTtnQkFDbEIsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLGdCQUFnQixFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBRTlDLEtBQUssb0JBQVUsQ0FBQyxHQUFHO2dCQUNqQixPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMs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LE1BQU0sQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7SUFDM0MsQ0FBQztDQUNGO0FBdENELDhDQXNDQztBQUVEOztHQUVHO0FBQ0gsTUFBYSxvQkFBcUIsU0FBUSxjQUFjO0lBSXRELFlBQVksZ0JBQXdCLEVBQUUsUUFBa0I7UUFDdEQsS0FBSyxFQUFFLENBQUM7UUFFUixJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFO1lBQ3RDLE1BQU0sSUFBSSxLQUFLLENBQUMsb0RBQW9ELENBQUMsQ0FBQztTQUN2RTtRQUVELElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxnQkFBZ0IsQ0FBQztRQUN6QyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUEsc0JBQVksR0FBRSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUM3QyxDQUFDO0lBRUQ7OztPQUdHO0lBQ0ksR0FBRyxDQUFDLE9BQWU7UUFDeEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDM0IsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0ksT0FBTyxDQUFDLGdCQUF3QjtRQUNyQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFO1lBQ3RDLE1BQU0sSUFBSSxLQUFLLENBQUMseURBQXlELENBQUMsQ0FBQztTQUM1RTtRQUVELElBQUksWUFBWSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLGdCQUFnQixFQUFFLGdCQUFnQixDQUFDLENBQUM7UUFFMUUsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUMzQyxDQUFDO0NBQ0Y7QUF0Q0Qsb0RBc0NDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBkb2NrZXJJZ25vcmUsICogYXMgRG9ja2VySWdub3JlIGZyb20gJ0BiYWxlbmEvZG9ja2VyaWdub3JlJztcbmltcG9ydCBnaXRJZ25vcmUsICogYXMgR2l0SWdub3JlIGZyb20gJ2lnbm9yZSc7XG5pbXBvcnQgKiBhcyBtaW5pbWF0Y2ggZnJvbSAnbWluaW1hdGNoJztcbmltcG9ydCB7IENvcHlPcHRpb25zLCBJZ25vcmVNb2RlIH0gZnJvbSAnLi9vcHRpb25zJztcblxuLyoqXG4gKiBSZXByZXNlbnRzIGZpbGUgcGF0aCBpZ25vcmluZyBiZWhhdmlvci5cbiAqL1xuZXhwb3J0IGFic3RyYWN0IGNsYXNzIElnbm9yZVN0cmF0ZWd5IHtcbiAgLyoqXG4gICAqIElnbm9yZXMgZmlsZSBwYXRocyBiYXNlZCBvbiBzaW1wbGUgZ2xvYiBwYXR0ZXJucy5cbiAgICpcbiAgICogQHJldHVybnMgYEdsb2JJZ25vcmVQYXR0ZXJuYCBhc3NvY2lhdGVkIHdpdGggdGhlIGdpdmVuIHBhdHRlcm5zLlxuICAgKiBAcGFyYW0gYWJzb2x1dGVSb290UGF0aCB0aGUgYWJzb2x1dGUgcGF0aCB0byB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhlIHBhdGhzIHRvIGJlIGNvbnNpZGVyZWRcbiAgICogQHBhcmFtIHBhdHRlcm5zXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGdsb2IoYWJzb2x1dGVSb290UGF0aDogc3RyaW5nLCBwYXR0ZXJuczogc3RyaW5nW10pOiBHbG9iSWdub3JlU3RyYXRlZ3kge1xuICAgIHJldHVybiBuZXcgR2xvYklnbm9yZVN0cmF0ZWd5KGFic29sdXRlUm9vdFBhdGgsIHBhdHRlcm5zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJZ25vcmVzIGZpbGUgcGF0aHMgYmFzZWQgb24gdGhlIFtgLmdpdGlnbm9yZSBzcGVjaWZpY2F0aW9uYF0oaHR0cHM6Ly9naXQtc2NtLmNvbS9kb2NzL2dpdGlnbm9yZSkuXG4gICAqXG4gICAqIEByZXR1cm5zIGBHaXRJZ25vcmVQYXR0ZXJuYCBhc3NvY2lhdGVkIHdpdGggdGhlIGdpdmVuIHBhdHRlcm5zLlxuICAgKiBAcGFyYW0gYWJzb2x1dGVSb290UGF0aCB0aGUgYWJzb2x1dGUgcGF0aCB0byB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhlIHBhdGhzIHRvIGJlIGNvbnNpZGVyZWRcbiAgICogQHBhcmFtIHBhdHRlcm5zXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGdpdChhYnNvbHV0ZVJvb3RQYXRoOiBzdHJpbmcsIHBhdHRlcm5zOiBzdHJpbmdbXSk6IEdpdElnbm9yZVN0cmF0ZWd5IHtcbiAgICByZXR1cm4gbmV3IEdpdElnbm9yZVN0cmF0ZWd5KGFic29sdXRlUm9vdFBhdGgsIHBhdHRlcm5zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJZ25vcmVzIGZpbGUgcGF0aHMgYmFzZWQgb24gdGhlIFtgLmRvY2tlcmlnbm9yZSBzcGVjaWZpY2F0aW9uYF0oaHR0cHM6Ly9kb2NzLmRvY2tlci5jb20vZW5naW5lL3JlZmVyZW5jZS9idWlsZGVyLyNkb2NrZXJpZ25vcmUtZmlsZSkuXG4gICAqXG4gICAqIEByZXR1cm5zIGBEb2NrZXJJZ25vcmVQYXR0ZXJuYCBhc3NvY2lhdGVkIHdpdGggdGhlIGdpdmVuIHBhdHRlcm5zLlxuICAgKiBAcGFyYW0gYWJzb2x1dGVSb290UGF0aCB0aGUgYWJzb2x1dGUgcGF0aCB0byB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhlIHBhdGhzIHRvIGJlIGNvbnNpZGVyZWRcbiAgICogQHBhcmFtIHBhdHRlcm5zXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGRvY2tlcihhYnNvbHV0ZVJvb3RQYXRoOiBzdHJpbmcsIHBhdHRlcm5zOiBzdHJpbmdbXSk6IERvY2tlcklnbm9yZVN0cmF0ZWd5IHtcbiAgICByZXR1cm4gbmV3IERvY2tlcklnbm9yZVN0cmF0ZWd5KGFic29sdXRlUm9vdFBhdGgsIHBhdHRlcm5zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGFuIElnbm9yZVN0cmF0ZWd5IGJhc2VkIG9uIHRoZSBgaWdub3JlTW9kZWAgYW5kIGBleGNsdWRlYCBpbiBhIGBDb3B5T3B0aW9uc2AuXG4gICAqXG4gICAqIEByZXR1cm5zIGBJZ25vcmVTdHJhdGVneWAgYmFzZWQgb24gdGhlIGBDb3B5T3B0aW9uc2BcbiAgICogQHBhcmFtIGFic29sdXRlUm9vdFBhdGggdGhlIGFic29sdXRlIHBhdGggdG8gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoZSBwYXRocyB0byBiZSBjb25zaWRlcmVkXG4gICAqIEBwYXJhbSBvcHRpb25zIHRoZSBgQ29weU9wdGlvbnNgIHRvIGNyZWF0ZSB0aGUgYElnbm9yZVN0cmF0ZWd5YCBmcm9tXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21Db3B5T3B0aW9ucyhvcHRpb25zOiBDb3B5T3B0aW9ucywgYWJzb2x1dGVSb290UGF0aDogc3RyaW5nKTogSWdub3JlU3RyYXRlZ3kge1xuICAgIGNvbnN0IGlnbm9yZU1vZGUgPSBvcHRpb25zLmlnbm9yZU1vZGUgfHwgSWdub3JlTW9kZS5HTE9CO1xuICAgIGNvbnN0IGV4Y2x1ZGUgPSBvcHRpb25zLmV4Y2x1ZGUgfHwgW107XG5cbiAgICBzd2l0Y2ggKGlnbm9yZU1vZGUpIHtcbiAgICAgIGNhc2UgSWdub3JlTW9kZS5HTE9COlxuICAgICAgICByZXR1cm4gdGhpcy5nbG9iKGFic29sdXRlUm9vdFBhdGgsIGV4Y2x1ZGUpO1xuXG4gICAgICBjYXNlIElnbm9yZU1vZGUuR0lUOlxuICAgICAgICByZXR1cm4gdGhpcy5naXQoYWJzb2x1dGVSb290UGF0aCwgZXhjbHVkZSk7XG5cbiAgICAgIGNhc2UgSWdub3JlTW9kZS5ET0NLRVI6XG4gICAgICAgIHJldHVybiB0aGlzLmRvY2tlcihhYnNvbHV0ZVJvb3RQYXRoLCBleGNsdWRlKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhbm90aGVyIHBhdHRlcm4uXG4gICAqIEBwYXJhbXMgcGF0dGVybiB0aGUgcGF0dGVybiB0byBhZGRcbiAgICovXG4gIHB1YmxpYyBhYnN0cmFjdCBhZGQocGF0dGVybjogc3RyaW5nKTogdm9pZDtcblxuICAvKipcbiAgICogRGV0ZXJtaW5lcyB3aGV0aGVyIGEgZ2l2ZW4gZmlsZSBwYXRoIHNob3VsZCBiZSBpZ25vcmVkIG9yIG5vdC5cbiAgICpcbiAgICogQHBhcmFtIGFic29sdXRlRmlsZVBhdGggYWJzb2x1dGUgZmlsZSBwYXRoIHRvIGJlIGFzc2Vzc2VkIGFnYWluc3QgdGhlIHBhdHRlcm5cbiAgICogQHJldHVybnMgYHRydWVgIGlmIHRoZSBmaWxlIHNob3VsZCBiZSBpZ25vcmVkXG4gICAqL1xuICBwdWJsaWMgYWJzdHJhY3QgaWdub3JlcyhhYnNvbHV0ZUZpbGVQYXRoOiBzdHJpbmcpOiBib29sZWFuO1xufVxuXG4vKipcbiAqIElnbm9yZXMgZmlsZSBwYXRocyBiYXNlZCBvbiBzaW1wbGUgZ2xvYiBwYXR0ZXJucy5cbiAqL1xuZXhwb3J0IGNsYXNzIEdsb2JJZ25vcmVTdHJhdGVneSBleHRlbmRzIElnbm9yZVN0cmF0ZWd5IHtcbiAgcHJpdmF0ZSByZWFkb25seSBhYnNvbHV0ZVJvb3RQYXRoOiBzdHJpbmc7XG4gIHByaXZhdGUgcmVhZG9ubHkgcGF0dGVybnM6IHN0cmluZ1tdO1xuXG4gIGNvbnN0cnVjdG9yKGFic29sdXRlUm9vdFBhdGg6IHN0cmluZywgcGF0dGVybnM6IHN0cmluZ1tdKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIGlmICghcGF0aC5pc0Fic29sdXRlKGFic29sdXRlUm9vdFBhdGgpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0dsb2JJZ25vcmVTdHJhdGVneSBleHBlY3RzIGFuIGFic29sdXRlIGZpbGUgcGF0aCcpO1xuICAgIH1cblxuICAgIHRoaXMuYWJzb2x1dGVSb290UGF0aCA9IGFic29sdXRlUm9vdFBhdGg7XG4gICAgdGhpcy5wYXR0ZXJucyA9IHBhdHRlcm5zO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYW5vdGhlciBwYXR0ZXJuLlxuICAgKiBAcGFyYW1zIHBhdHRlcm4gdGhlIHBhdHRlcm4gdG8gYWRkXG4gICAqL1xuICBwdWJsaWMgYWRkKHBhdHRlcm46IHN0cmluZyk6IHZvaWQge1xuICAgIHRoaXMucGF0dGVybnMucHVzaChwYXR0ZXJuKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZXRlcm1pbmVzIHdoZXRoZXIgYSBnaXZlbiBmaWxlIHBhdGggc2hvdWxkIGJlIGlnbm9yZWQgb3Igbm90LlxuICAgKlxuICAgKiBAcGFyYW0gYWJzb2x1dGVGaWxlUGF0aCBhYnNvbHV0ZSBmaWxlIHBhdGggdG8gYmUgYXNzZXNzZWQgYWdhaW5zdCB0aGUgcGF0dGVyblxuICAgKiBAcmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGZpbGUgc2hvdWxkIGJlIGlnbm9yZWRcbiAgICovXG4gIHB1YmxpYyBpZ25vcmVzKGFic29sdXRlRmlsZVBhdGg6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIGlmICghcGF0aC5pc0Fic29sdXRlKGFic29sdXRlRmlsZVBhdGgpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0dsb2JJZ25vcmVTdHJhdGVneS5pZ25vcmVzKCkgZXhwZWN0cyBhbiBhYnNvbHV0ZSBwYXRoJyk7XG4gICAgfVxuXG4gICAgbGV0IHJlbGF0aXZlUGF0aCA9IHBhdGgucmVsYXRpdmUodGhpcy5hYnNvbHV0ZVJvb3RQYXRoLCBhYnNvbHV0ZUZpbGVQYXRoKTtcbiAgICBsZXQgZXhjbHVkZU91dHB1dCA9IGZhbHNlO1xuXG4gICAgZm9yIChjb25zdCBwYXR0ZXJuIG9mIHRoaXMucGF0dGVybnMpIHtcbiAgICAgIGNvbnN0IG5lZ2F0ZSA9IHBhdHRlcm4uc3RhcnRzV2l0aCgnIScpO1xuICAgICAgY29uc3QgbWF0Y2ggPSBtaW5pbWF0Y2gocmVsYXRpdmVQYXRoLCBwYXR0ZXJuLCB7IG1hdGNoQmFzZTogdHJ1ZSwgZmxpcE5lZ2F0ZTogdHJ1ZSB9KTtcblxuICAgICAgaWYgKCFuZWdhdGUgJiYgbWF0Y2gpIHtcbiAgICAgICAgZXhjbHVkZU91dHB1dCA9IHRydWU7XG4gICAgICB9XG5cbiAgICAgIGlmIChuZWdhdGUgJiYgbWF0Y2gpIHtcbiAgICAgICAgZXhjbHVkZU91dHB1dCA9IGZhbHNlO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBleGNsdWRlT3V0cHV0O1xuICB9XG59XG5cbi8qKlxuICogSWdub3JlcyBmaWxlIHBhdGhzIGJhc2VkIG9uIHRoZSBbYC5naXRpZ25vcmUgc3BlY2lmaWNhdGlvbmBdKGh0dHBzOi8vZ2l0LXNjbS5jb20vZG9jcy9naXRpZ25vcmUpLlxuICovXG5leHBvcnQgY2xhc3MgR2l0SWdub3JlU3RyYXRlZ3kgZXh0ZW5kcyBJZ25vcmVTdHJhdGVneSB7XG4gIHByaXZhdGUgcmVhZG9ubHkgYWJzb2x1dGVSb290UGF0aDogc3RyaW5nO1xuICBwcml2YXRlIHJlYWRvbmx5IGlnbm9yZTogR2l0SWdub3JlLklnbm9yZTtcblxuICBjb25zdHJ1Y3RvcihhYnNvbHV0ZVJvb3RQYXRoOiBzdHJpbmcsIHBhdHRlcm5zOiBzdHJpbmdbXSkge1xuICAgIHN1cGVyKCk7XG5cbiAgICBpZiAoIXBhdGguaXNBYnNvbHV0ZShhYnNvbHV0ZVJvb3RQYXRoKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdHaXRJZ25vcmVTdHJhdGVneSBleHBlY3RzIGFuIGFic29sdXRlIGZpbGUgcGF0aCcpO1xuICAgIH1cblxuICAgIHRoaXMuYWJzb2x1dGVSb290UGF0aCA9IGFic29sdXRlUm9vdFBhdGg7XG4gICAgdGhpcy5pZ25vcmUgPSBnaXRJZ25vcmUoKS5hZGQocGF0dGVybnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYW5vdGhlciBwYXR0ZXJuLlxuICAgKiBAcGFyYW1zIHBhdHRlcm4gdGhlIHBhdHRlcm4gdG8gYWRkXG4gICAqL1xuICBwdWJsaWMgYWRkKHBhdHRlcm46IHN0cmluZyk6IHZvaWQge1xuICAgIHRoaXMuaWdub3JlLmFkZChwYXR0ZXJuKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZXRlcm1pbmVzIHdoZXRoZXIgYSBnaXZlbiBmaWxlIHBhdGggc2hvdWxkIGJlIGlnbm9yZWQgb3Igbm90LlxuICAgKlxuICAgKiBAcGFyYW0gYWJzb2x1dGVGaWxlUGF0aCBhYnNvbHV0ZSBmaWxlIHBhdGggdG8gYmUgYXNzZXNzZWQgYWdhaW5zdCB0aGUgcGF0dGVyblxuICAgKiBAcmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGZpbGUgc2hvdWxkIGJlIGlnbm9yZWRcbiAgICovXG4gIHB1YmxpYyBpZ25vcmVzKGFic29sdXRlRmlsZVBhdGg6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIGlmICghcGF0aC5pc0Fic29sdXRlKGFic29sdXRlRmlsZVBhdGgpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0dpdElnbm9yZVN0cmF0ZWd5Lmlnbm9yZXMoKSBleHBlY3RzIGFuIGFic29sdXRlIHBhdGgnKTtcbiAgICB9XG5cbiAgICBsZXQgcmVsYXRpdmVQYXRoID0gcGF0aC5yZWxhdGl2ZSh0aGlzLmFic29sdXRlUm9vdFBhdGgsIGFic29sdXRlRmlsZVBhdGgpO1xuXG4gICAgcmV0dXJuIHRoaXMuaWdub3JlLmlnbm9yZXMocmVsYXRpdmVQYXRoKTtcbiAgfVxufVxuXG4vKipcbiAqIElnbm9yZXMgZmlsZSBwYXRocyBiYXNlZCBvbiB0aGUgW2AuZG9ja2VyaWdub3JlIHNwZWNpZmljYXRpb25gXShodHRwczovL2RvY3MuZG9ja2VyLmNvbS9lbmdpbmUvcmVmZXJlbmNlL2J1aWxkZXIvI2RvY2tlcmlnbm9yZS1maWxlKS5cbiAqL1xuZXhwb3J0IGNsYXNzIERvY2tlcklnbm9yZVN0cmF0ZWd5IGV4dGVuZHMgSWdub3JlU3RyYXRlZ3kge1xuICBwcml2YXRlIHJlYWRvbmx5IGFic29sdXRlUm9vdFBhdGg6IHN0cmluZztcbiAgcHJpdmF0ZSByZWFkb25seSBpZ25vcmU6IERvY2tlcklnbm9yZS5JZ25vcmU7XG5cbiAgY29uc3RydWN0b3IoYWJzb2x1dGVSb290UGF0aDogc3RyaW5nLCBwYXR0ZXJuczogc3RyaW5nW10pIHtcbiAgICBzdXBlcigpO1xuXG4gICAgaWYgKCFwYXRoLmlzQWJzb2x1dGUoYWJzb2x1dGVSb290UGF0aCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignRG9ja2VySWdub3JlU3RyYXRlZ3kgZXhwZWN0cyBhbiBhYnNvbHV0ZSBmaWxlIHBhdGgnKTtcbiAgICB9XG5cbiAgICB0aGlzLmFic29sdXRlUm9vdFBhdGggPSBhYnNvbHV0ZVJvb3RQYXRoO1xuICAgIHRoaXMuaWdub3JlID0gZG9ja2VySWdub3JlKCkuYWRkKHBhdHRlcm5zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGFub3RoZXIgcGF0dGVybi5cbiAgICogQHBhcmFtcyBwYXR0ZXJuIHRoZSBwYXR0ZXJuIHRvIGFkZFxuICAgKi9cbiAgcHVibGljIGFkZChwYXR0ZXJuOiBzdHJpbmcpOiB2b2lkIHtcbiAgICB0aGlzLmlnbm9yZS5hZGQocGF0dGVybik7XG4gIH1cblxuICAvKipcbiAgICogRGV0ZXJtaW5lcyB3aGV0aGVyIGEgZ2l2ZW4gZmlsZSBwYXRoIHNob3VsZCBiZSBpZ25vcmVkIG9yIG5vdC5cbiAgICpcbiAgICogQHBhcmFtIGFic29sdXRlRmlsZVBhdGggYWJzb2x1dGUgZmlsZSBwYXRoIHRvIGJlIGFzc2Vzc2VkIGFnYWluc3QgdGhlIHBhdHRlcm5cbiAgICogQHJldHVybnMgYHRydWVgIGlmIHRoZSBmaWxlIHNob3VsZCBiZSBpZ25vcmVkXG4gICAqL1xuICBwdWJsaWMgaWdub3JlcyhhYnNvbHV0ZUZpbGVQYXRoOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICBpZiAoIXBhdGguaXNBYnNvbHV0ZShhYnNvbHV0ZUZpbGVQYXRoKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdEb2NrZXJJZ25vcmVTdHJhdGVneS5pZ25vcmVzKCkgZXhwZWN0cyBhbiBhYnNvbHV0ZSBwYXRoJyk7XG4gICAgfVxuXG4gICAgbGV0IHJlbGF0aXZlUGF0aCA9IHBhdGgucmVsYXRpdmUodGhpcy5hYnNvbHV0ZVJvb3RQYXRoLCBhYnNvbHV0ZUZpbGVQYXRoKTtcblxuICAgIHJldHVybiB0aGlzLmlnbm9yZS5pZ25vcmVzKHJlbGF0aXZlUGF0aCk7XG4gIH1cbn1cbiJdfQ==