"use strict";
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DockerIgnoreStrategy = exports.GitIgnoreStrategy = exports.GlobIgnoreStrategy = exports.IgnoreStrategy = void 0;
const jsiiDeprecationWarnings = require("../../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
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
        try {
            jsiiDeprecationWarnings._aws_cdk_core_CopyOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromCopyOptions);
            }
            throw error;
        }
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
_a = JSII_RTTI_SYMBOL_1;
IgnoreStrategy[_a] = { fqn: "@aws-cdk/core.IgnoreStrategy", version: "0.0.0" };
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
_b = JSII_RTTI_SYMBOL_1;
GlobIgnoreStrategy[_b] = { fqn: "@aws-cdk/core.GlobIgnoreStrategy", version: "0.0.0" };
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
_c = JSII_RTTI_SYMBOL_1;
GitIgnoreStrategy[_c] = { fqn: "@aws-cdk/core.GitIgnoreStrategy", version: "0.0.0" };
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
_d = JSII_RTTI_SYMBOL_1;
DockerIgnoreStrategy[_d] = { fqn: "@aws-cdk/core.DockerIgnoreStrategy", version: "0.0.0" };
exports.DockerIgnoreStrategy = DockerIgnoreStrategy;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaWdub3JlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaWdub3JlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLDZCQUE2QjtBQUM3Qix1REFBbUU7QUFDbkUsbUNBQStDO0FBQy9DLHVDQUF1QztBQUN2Qyx1Q0FBb0Q7QUFFcEQ7O0dBRUc7QUFDSCxNQUFzQixjQUFjO0lBQ2xDOzs7Ozs7T0FNRztJQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUMsZ0JBQXdCLEVBQUUsUUFBa0I7UUFDN0QsT0FBTyxJQUFJLGtCQUFrQixDQUFDLGdCQUFnQixFQUFFLFFBQVEsQ0FBQyxDQUFDO0tBQzNEO0lBRUQ7Ozs7OztPQU1HO0lBQ0ksTUFBTSxDQUFDLEdBQUcsQ0FBQyxnQkFBd0IsRUFBRSxRQUFrQjtRQUM1RCxPQUFPLElBQUksaUJBQWlCLENBQUMsZ0JBQWdCLEVBQUUsUUFBUSxDQUFDLENBQUM7S0FDMUQ7SUFFRDs7Ozs7O09BTUc7SUFDSSxNQUFNLENBQUMsTUFBTSxDQUFDLGdCQUF3QixFQUFFLFFBQWtCO1FBQy9ELE9BQU8sSUFBSSxvQkFBb0IsQ0FBQyxnQkFBZ0IsRUFBRSxRQUFRLENBQUMsQ0FBQztLQUM3RDtJQUVEOzs7Ozs7T0FNRztJQUNJLE1BQU0sQ0FBQyxlQUFlLENBQUMsT0FBb0IsRUFBRSxnQkFBd0I7Ozs7Ozs7Ozs7UUFDMUUsTUFBTSxVQUFVLEdBQUcsT0FBTyxDQUFDLFVBQVUsSUFBSSxvQkFBVSxDQUFDLElBQUksQ0FBQztRQUN6RCxNQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsT0FBTyxJQUFJLEVBQUUsQ0FBQztRQUV0QyxRQUFRLFVBQVUsRUFBRTtZQUNsQixLQUFLLG9CQUFVLENBQUMsSUFBSTtnQkFDbEIsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLGdCQUFnQixFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBRTlDLEtBQUssb0JBQVUsQ0FBQyxHQUFHO2dCQUNqQixPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsZ0JB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QUM7S0FDMUM7Ozs7QUFyQ1UsOENBQWlCO0FBd0M5Qjs7R0FFRztBQUNILE1BQWEsb0JBQXFCLFNBQVEsY0FBYztJQUl0RCxZQUFZLGdCQUF3QixFQUFFLFFBQWtCO1FBQ3RELEtBQUssRUFBRSxDQUFDO1FBRVIsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsZ0JBQWdCLENBQUMsRUFBRTtZQUN0QyxNQUFNLElBQUksS0FBSyxDQUFDLG9EQUFvRCxDQUFDLENBQUM7U0FDdkU7UUFFRCxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsZ0JBQWdCLENBQUM7UUFDekMsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFBLHNCQUFZLEdBQUUsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7S0FDNUM7SUFFRDs7O09BR0c7SUFDSSxHQUFHLENBQUMsT0FBZTtRQUN4QixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztLQUMxQjtJQUVEOzs7OztPQUtHO0lBQ0ksT0FBTyxDQUFDLGdCQUF3QjtRQUNyQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFO1lBQ3RDLE1BQU0sSUFBSSxLQUFLLENBQUMseURBQXlELENBQUMsQ0FBQztTQUM1RTtRQUVELElBQUksWUFBWSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLGdCQUFnQixFQUFFLGdCQUFnQixDQUFDLENBQUM7UUFFMUUsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQztLQUMxQzs7OztBQXJDVSxvREFBb0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IGRvY2tlcklnbm9yZSwgKiBhcyBEb2NrZXJJZ25vcmUgZnJvbSAnQGJhbGVuYS9kb2NrZXJpZ25vcmUnO1xuaW1wb3J0IGdpdElnbm9yZSwgKiBhcyBHaXRJZ25vcmUgZnJvbSAnaWdub3JlJztcbmltcG9ydCAqIGFzIG1pbmltYXRjaCBmcm9tICdtaW5pbWF0Y2gnO1xuaW1wb3J0IHsgQ29weU9wdGlvbnMsIElnbm9yZU1vZGUgfSBmcm9tICcuL29wdGlvbnMnO1xuXG4vKipcbiAqIFJlcHJlc2VudHMgZmlsZSBwYXRoIGlnbm9yaW5nIGJlaGF2aW9yLlxuICovXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgSWdub3JlU3RyYXRlZ3kge1xuICAvKipcbiAgICogSWdub3JlcyBmaWxlIHBhdGhzIGJhc2VkIG9uIHNpbXBsZSBnbG9iIHBhdHRlcm5zLlxuICAgKlxuICAgKiBAcmV0dXJucyBgR2xvYklnbm9yZVBhdHRlcm5gIGFzc29jaWF0ZWQgd2l0aCB0aGUgZ2l2ZW4gcGF0dGVybnMuXG4gICAqIEBwYXJhbSBhYnNvbHV0ZVJvb3RQYXRoIHRoZSBhYnNvbHV0ZSBwYXRoIHRvIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGUgcGF0aHMgdG8gYmUgY29uc2lkZXJlZFxuICAgKiBAcGFyYW0gcGF0dGVybnNcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZ2xvYihhYnNvbHV0ZVJvb3RQYXRoOiBzdHJpbmcsIHBhdHRlcm5zOiBzdHJpbmdbXSk6IEdsb2JJZ25vcmVTdHJhdGVneSB7XG4gICAgcmV0dXJuIG5ldyBHbG9iSWdub3JlU3RyYXRlZ3koYWJzb2x1dGVSb290UGF0aCwgcGF0dGVybnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIElnbm9yZXMgZmlsZSBwYXRocyBiYXNlZCBvbiB0aGUgW2AuZ2l0aWdub3JlIHNwZWNpZmljYXRpb25gXShodHRwczovL2dpdC1zY20uY29tL2RvY3MvZ2l0aWdub3JlKS5cbiAgICpcbiAgICogQHJldHVybnMgYEdpdElnbm9yZVBhdHRlcm5gIGFzc29jaWF0ZWQgd2l0aCB0aGUgZ2l2ZW4gcGF0dGVybnMuXG4gICAqIEBwYXJhbSBhYnNvbHV0ZVJvb3RQYXRoIHRoZSBhYnNvbHV0ZSBwYXRoIHRvIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGUgcGF0aHMgdG8gYmUgY29uc2lkZXJlZFxuICAgKiBAcGFyYW0gcGF0dGVybnNcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZ2l0KGFic29sdXRlUm9vdFBhdGg6IHN0cmluZywgcGF0dGVybnM6IHN0cmluZ1tdKTogR2l0SWdub3JlU3RyYXRlZ3kge1xuICAgIHJldHVybiBuZXcgR2l0SWdub3JlU3RyYXRlZ3koYWJzb2x1dGVSb290UGF0aCwgcGF0dGVybnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIElnbm9yZXMgZmlsZSBwYXRocyBiYXNlZCBvbiB0aGUgW2AuZG9ja2VyaWdub3JlIHNwZWNpZmljYXRpb25gXShodHRwczovL2RvY3MuZG9ja2VyLmNvbS9lbmdpbmUvcmVmZXJlbmNlL2J1aWxkZXIvI2RvY2tlcmlnbm9yZS1maWxlKS5cbiAgICpcbiAgICogQHJldHVybnMgYERvY2tlcklnbm9yZVBhdHRlcm5gIGFzc29jaWF0ZWQgd2l0aCB0aGUgZ2l2ZW4gcGF0dGVybnMuXG4gICAqIEBwYXJhbSBhYnNvbHV0ZVJvb3RQYXRoIHRoZSBhYnNvbHV0ZSBwYXRoIHRvIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGUgcGF0aHMgdG8gYmUgY29uc2lkZXJlZFxuICAgKiBAcGFyYW0gcGF0dGVybnNcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZG9ja2VyKGFic29sdXRlUm9vdFBhdGg6IHN0cmluZywgcGF0dGVybnM6IHN0cmluZ1tdKTogRG9ja2VySWdub3JlU3RyYXRlZ3kge1xuICAgIHJldHVybiBuZXcgRG9ja2VySWdub3JlU3RyYXRlZ3koYWJzb2x1dGVSb290UGF0aCwgcGF0dGVybnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYW4gSWdub3JlU3RyYXRlZ3kgYmFzZWQgb24gdGhlIGBpZ25vcmVNb2RlYCBhbmQgYGV4Y2x1ZGVgIGluIGEgYENvcHlPcHRpb25zYC5cbiAgICpcbiAgICogQHJldHVybnMgYElnbm9yZVN0cmF0ZWd5YCBiYXNlZCBvbiB0aGUgYENvcHlPcHRpb25zYFxuICAgKiBAcGFyYW0gYWJzb2x1dGVSb290UGF0aCB0aGUgYWJzb2x1dGUgcGF0aCB0byB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhlIHBhdGhzIHRvIGJlIGNvbnNpZGVyZWRcbiAgICogQHBhcmFtIG9wdGlvbnMgdGhlIGBDb3B5T3B0aW9uc2AgdG8gY3JlYXRlIHRoZSBgSWdub3JlU3RyYXRlZ3lgIGZyb21cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZnJvbUNvcHlPcHRpb25zKG9wdGlvbnM6IENvcHlPcHRpb25zLCBhYnNvbHV0ZVJvb3RQYXRoOiBzdHJpbmcpOiBJZ25vcmVTdHJhdGVneSB7XG4gICAgY29uc3QgaWdub3JlTW9kZSA9IG9wdGlvbnMuaWdub3JlTW9kZSB8fCBJZ25vcmVNb2RlLkdMT0I7XG4gICAgY29uc3QgZXhjbHVkZSA9IG9wdGlvbnMuZXhjbHVkZSB8fCBbXTtcblxuICAgIHN3aXRjaCAoaWdub3JlTW9kZSkge1xuICAgICAgY2FzZSBJZ25vcmVNb2RlLkdMT0I6XG4gICAgICAgIHJldHVybiB0aGlzLmdsb2IoYWJzb2x1dGVSb290UGF0aCwgZXhjbHVkZSk7XG5cbiAgICAgIGNhc2UgSWdub3JlTW9kZS5HSVQ6XG4gICAgICAgIHJldHVybiB0aGlzLmdpdChhYnNvbHV0ZVJvb3RQYXRoLCBleGNsdWRlKTtcblxuICAgICAgY2FzZSBJZ25vcmVNb2RlLkRPQ0tFUjpcbiAgICAgICAgcmV0dXJuIHRoaXMuZG9ja2VyKGFic29sdXRlUm9vdFBhdGgsIGV4Y2x1ZGUpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGFub3RoZXIgcGF0dGVybi5cbiAgICogQHBhcmFtcyBwYXR0ZXJuIHRoZSBwYXR0ZXJuIHRvIGFkZFxuICAgKi9cbiAgcHVibGljIGFic3RyYWN0IGFkZChwYXR0ZXJuOiBzdHJpbmcpOiB2b2lkO1xuXG4gIC8qKlxuICAgKiBEZXRlcm1pbmVzIHdoZXRoZXIgYSBnaXZlbiBmaWxlIHBhdGggc2hvdWxkIGJlIGlnbm9yZWQgb3Igbm90LlxuICAgKlxuICAgKiBAcGFyYW0gYWJzb2x1dGVGaWxlUGF0aCBhYnNvbHV0ZSBmaWxlIHBhdGggdG8gYmUgYXNzZXNzZWQgYWdhaW5zdCB0aGUgcGF0dGVyblxuICAgKiBAcmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGZpbGUgc2hvdWxkIGJlIGlnbm9yZWRcbiAgICovXG4gIHB1YmxpYyBhYnN0cmFjdCBpZ25vcmVzKGFic29sdXRlRmlsZVBhdGg6IHN0cmluZyk6IGJvb2xlYW47XG59XG5cbi8qKlxuICogSWdub3JlcyBmaWxlIHBhdGhzIGJhc2VkIG9uIHNpbXBsZSBnbG9iIHBhdHRlcm5zLlxuICovXG5leHBvcnQgY2xhc3MgR2xvYklnbm9yZVN0cmF0ZWd5IGV4dGVuZHMgSWdub3JlU3RyYXRlZ3kge1xuICBwcml2YXRlIHJlYWRvbmx5IGFic29sdXRlUm9vdFBhdGg6IHN0cmluZztcbiAgcHJpdmF0ZSByZWFkb25seSBwYXR0ZXJuczogc3RyaW5nW107XG5cbiAgY29uc3RydWN0b3IoYWJzb2x1dGVSb290UGF0aDogc3RyaW5nLCBwYXR0ZXJuczogc3RyaW5nW10pIHtcbiAgICBzdXBlcigpO1xuXG4gICAgaWYgKCFwYXRoLmlzQWJzb2x1dGUoYWJzb2x1dGVSb290UGF0aCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignR2xvYklnbm9yZVN0cmF0ZWd5IGV4cGVjdHMgYW4gYWJzb2x1dGUgZmlsZSBwYXRoJyk7XG4gICAgfVxuXG4gICAgdGhpcy5hYnNvbHV0ZVJvb3RQYXRoID0gYWJzb2x1dGVSb290UGF0aDtcbiAgICB0aGlzLnBhdHRlcm5zID0gcGF0dGVybnM7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhbm90aGVyIHBhdHRlcm4uXG4gICAqIEBwYXJhbXMgcGF0dGVybiB0aGUgcGF0dGVybiB0byBhZGRcbiAgICovXG4gIHB1YmxpYyBhZGQocGF0dGVybjogc3RyaW5nKTogdm9pZCB7XG4gICAgdGhpcy5wYXR0ZXJucy5wdXNoKHBhdHRlcm4pO1xuICB9XG5cbiAgLyoqXG4gICAqIERldGVybWluZXMgd2hldGhlciBhIGdpdmVuIGZpbGUgcGF0aCBzaG91bGQgYmUgaWdub3JlZCBvciBub3QuXG4gICAqXG4gICAqIEBwYXJhbSBhYnNvbHV0ZUZpbGVQYXRoIGFic29sdXRlIGZpbGUgcGF0aCB0byBiZSBhc3Nlc3NlZCBhZ2FpbnN0IHRoZSBwYXR0ZXJuXG4gICAqIEByZXR1cm5zIGB0cnVlYCBpZiB0aGUgZmlsZSBzaG91bGQgYmUgaWdub3JlZFxuICAgKi9cbiAgcHVibGljIGlnbm9yZXMoYWJzb2x1dGVGaWxlUGF0aDogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgaWYgKCFwYXRoLmlzQWJzb2x1dGUoYWJzb2x1dGVGaWxlUGF0aCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignR2xvYklnbm9yZVN0cmF0ZWd5Lmlnbm9yZXMoKSBleHBlY3RzIGFuIGFic29sdXRlIHBhdGgnKTtcbiAgICB9XG5cbiAgICBsZXQgcmVsYXRpdmVQYXRoID0gcGF0aC5yZWxhdGl2ZSh0aGlzLmFic29sdXRlUm9vdFBhdGgsIGFic29sdXRlRmlsZVBhdGgpO1xuICAgIGxldCBleGNsdWRlT3V0cHV0ID0gZmFsc2U7XG5cbiAgICBmb3IgKGNvbnN0IHBhdHRlcm4gb2YgdGhpcy5wYXR0ZXJucykge1xuICAgICAgY29uc3QgbmVnYXRlID0gcGF0dGVybi5zdGFydHNXaXRoKCchJyk7XG4gICAgICBjb25zdCBtYXRjaCA9IG1pbmltYXRjaChyZWxhdGl2ZVBhdGgsIHBhdHRlcm4sIHsgbWF0Y2hCYXNlOiB0cnVlLCBmbGlwTmVnYXRlOiB0cnVlIH0pO1xuXG4gICAgICBpZiAoIW5lZ2F0ZSAmJiBtYXRjaCkge1xuICAgICAgICBleGNsdWRlT3V0cHV0ID0gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKG5lZ2F0ZSAmJiBtYXRjaCkge1xuICAgICAgICBleGNsdWRlT3V0cHV0ID0gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGV4Y2x1ZGVPdXRwdXQ7XG4gIH1cbn1cblxuLyoqXG4gKiBJZ25vcmVzIGZpbGUgcGF0aHMgYmFzZWQgb24gdGhlIFtgLmdpdGlnbm9yZSBzcGVjaWZpY2F0aW9uYF0oaHR0cHM6Ly9naXQtc2NtLmNvbS9kb2NzL2dpdGlnbm9yZSkuXG4gKi9cbmV4cG9ydCBjbGFzcyBHaXRJZ25vcmVTdHJhdGVneSBleHRlbmRzIElnbm9yZVN0cmF0ZWd5IHtcbiAgcHJpdmF0ZSByZWFkb25seSBhYnNvbHV0ZVJvb3RQYXRoOiBzdHJpbmc7XG4gIHByaXZhdGUgcmVhZG9ubHkgaWdub3JlOiBHaXRJZ25vcmUuSWdub3JlO1xuXG4gIGNvbnN0cnVjdG9yKGFic29sdXRlUm9vdFBhdGg6IHN0cmluZywgcGF0dGVybnM6IHN0cmluZ1tdKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIGlmICghcGF0aC5pc0Fic29sdXRlKGFic29sdXRlUm9vdFBhdGgpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0dpdElnbm9yZVN0cmF0ZWd5IGV4cGVjdHMgYW4gYWJzb2x1dGUgZmlsZSBwYXRoJyk7XG4gICAgfVxuXG4gICAgdGhpcy5hYnNvbHV0ZVJvb3RQYXRoID0gYWJzb2x1dGVSb290UGF0aDtcbiAgICB0aGlzLmlnbm9yZSA9IGdpdElnbm9yZSgpLmFkZChwYXR0ZXJucyk7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhbm90aGVyIHBhdHRlcm4uXG4gICAqIEBwYXJhbXMgcGF0dGVybiB0aGUgcGF0dGVybiB0byBhZGRcbiAgICovXG4gIHB1YmxpYyBhZGQocGF0dGVybjogc3RyaW5nKTogdm9pZCB7XG4gICAgdGhpcy5pZ25vcmUuYWRkKHBhdHRlcm4pO1xuICB9XG5cbiAgLyoqXG4gICAqIERldGVybWluZXMgd2hldGhlciBhIGdpdmVuIGZpbGUgcGF0aCBzaG91bGQgYmUgaWdub3JlZCBvciBub3QuXG4gICAqXG4gICAqIEBwYXJhbSBhYnNvbHV0ZUZpbGVQYXRoIGFic29sdXRlIGZpbGUgcGF0aCB0byBiZSBhc3Nlc3NlZCBhZ2FpbnN0IHRoZSBwYXR0ZXJuXG4gICAqIEByZXR1cm5zIGB0cnVlYCBpZiB0aGUgZmlsZSBzaG91bGQgYmUgaWdub3JlZFxuICAgKi9cbiAgcHVibGljIGlnbm9yZXMoYWJzb2x1dGVGaWxlUGF0aDogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgaWYgKCFwYXRoLmlzQWJzb2x1dGUoYWJzb2x1dGVGaWxlUGF0aCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignR2l0SWdub3JlU3RyYXRlZ3kuaWdub3JlcygpIGV4cGVjdHMgYW4gYWJzb2x1dGUgcGF0aCcpO1xuICAgIH1cblxuICAgIGxldCByZWxhdGl2ZVBhdGggPSBwYXRoLnJlbGF0aXZlKHRoaXMuYWJzb2x1dGVSb290UGF0aCwgYWJzb2x1dGVGaWxlUGF0aCk7XG5cbiAgICByZXR1cm4gdGhpcy5pZ25vcmUuaWdub3JlcyhyZWxhdGl2ZVBhdGgpO1xuICB9XG59XG5cbi8qKlxuICogSWdub3JlcyBmaWxlIHBhdGhzIGJhc2VkIG9uIHRoZSBbYC5kb2NrZXJpZ25vcmUgc3BlY2lmaWNhdGlvbmBdKGh0dHBzOi8vZG9jcy5kb2NrZXIuY29tL2VuZ2luZS9yZWZlcmVuY2UvYnVpbGRlci8jZG9ja2VyaWdub3JlLWZpbGUpLlxuICovXG5leHBvcnQgY2xhc3MgRG9ja2VySWdub3JlU3RyYXRlZ3kgZXh0ZW5kcyBJZ25vcmVTdHJhdGVneSB7XG4gIHByaXZhdGUgcmVhZG9ubHkgYWJzb2x1dGVSb290UGF0aDogc3RyaW5nO1xuICBwcml2YXRlIHJlYWRvbmx5IGlnbm9yZTogRG9ja2VySWdub3JlLklnbm9yZTtcblxuICBjb25zdHJ1Y3RvcihhYnNvbHV0ZVJvb3RQYXRoOiBzdHJpbmcsIHBhdHRlcm5zOiBzdHJpbmdbXSkge1xuICAgIHN1cGVyKCk7XG5cbiAgICBpZiAoIXBhdGguaXNBYnNvbHV0ZShhYnNvbHV0ZVJvb3RQYXRoKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdEb2NrZXJJZ25vcmVTdHJhdGVneSBleHBlY3RzIGFuIGFic29sdXRlIGZpbGUgcGF0aCcpO1xuICAgIH1cblxuICAgIHRoaXMuYWJzb2x1dGVSb290UGF0aCA9IGFic29sdXRlUm9vdFBhdGg7XG4gICAgdGhpcy5pZ25vcmUgPSBkb2NrZXJJZ25vcmUoKS5hZGQocGF0dGVybnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYW5vdGhlciBwYXR0ZXJuLlxuICAgKiBAcGFyYW1zIHBhdHRlcm4gdGhlIHBhdHRlcm4gdG8gYWRkXG4gICAqL1xuICBwdWJsaWMgYWRkKHBhdHRlcm46IHN0cmluZyk6IHZvaWQge1xuICAgIHRoaXMuaWdub3JlLmFkZChwYXR0ZXJuKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZXRlcm1pbmVzIHdoZXRoZXIgYSBnaXZlbiBmaWxlIHBhdGggc2hvdWxkIGJlIGlnbm9yZWQgb3Igbm90LlxuICAgKlxuICAgKiBAcGFyYW0gYWJzb2x1dGVGaWxlUGF0aCBhYnNvbHV0ZSBmaWxlIHBhdGggdG8gYmUgYXNzZXNzZWQgYWdhaW5zdCB0aGUgcGF0dGVyblxuICAgKiBAcmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGZpbGUgc2hvdWxkIGJlIGlnbm9yZWRcbiAgICovXG4gIHB1YmxpYyBpZ25vcmVzKGFic29sdXRlRmlsZVBhdGg6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIGlmICghcGF0aC5pc0Fic29sdXRlKGFic29sdXRlRmlsZVBhdGgpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0RvY2tlcklnbm9yZVN0cmF0ZWd5Lmlnbm9yZXMoKSBleHBlY3RzIGFuIGFic29sdXRlIHBhdGgnKTtcbiAgICB9XG5cbiAgICBsZXQgcmVsYXRpdmVQYXRoID0gcGF0aC5yZWxhdGl2ZSh0aGlzLmFic29sdXRlUm9vdFBhdGgsIGFic29sdXRlRmlsZVBhdGgpO1xuXG4gICAgcmV0dXJuIHRoaXMuaWdub3JlLmlnbm9yZXMocmVsYXRpdmVQYXRoKTtcbiAgfVxufVxuIl19