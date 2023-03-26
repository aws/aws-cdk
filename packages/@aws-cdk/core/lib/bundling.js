"use strict";
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DockerVolumeConsistency = exports.DockerImage = exports.BundlingDockerImage = exports.BundlingFileAccess = exports.BundlingOutput = exports.DockerBuildSecret = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const child_process_1 = require("child_process");
const crypto = require("crypto");
const path_1 = require("path");
const fs_1 = require("./fs");
const asset_staging_1 = require("./private/asset-staging");
const jsii_deprecated_1 = require("./private/jsii-deprecated");
/**
 * Methods to build Docker CLI arguments for builds using secrets.
 *
 * Docker BuildKit must be enabled to use build secrets.
 *
 * @see https://docs.docker.com/build/buildkit/
 */
class DockerBuildSecret {
    /**
     * A Docker build secret from a file source
     * @param src The path to the source file, relative to the build directory.
     * @returns The latter half required for `--secret`
     */
    static fromSrc(src) {
        return `src=${src}`;
    }
    /**
     * A Docker build secret from the build environment
     * @param environmentVariable The environment variable name
     * @returns The latter half required for `--secret`
     */
    static fromEnvironment(environmentVariable) {
        const value = process.env[environmentVariable];
        if (value) {
            return `env=${environmentVariable}`;
        }
        else {
            throw new Error(`Environment variable ${environmentVariable} is not set`);
        }
    }
}
_a = JSII_RTTI_SYMBOL_1;
DockerBuildSecret[_a] = { fqn: "@aws-cdk/core.DockerBuildSecret", version: "0.0.0" };
exports.DockerBuildSecret = DockerBuildSecret;
/**
 * The type of output that a bundling operation is producing.
 *
 */
var BundlingOutput;
(function (BundlingOutput) {
    /**
     * The bundling output directory includes a single .zip or .jar file which
     * will be used as the final bundle. If the output directory does not
     * include exactly a single archive, bundling will fail.
     */
    BundlingOutput["ARCHIVED"] = "archived";
    /**
     * The bundling output directory contains one or more files which will be
     * archived and uploaded as a .zip file to S3.
     */
    BundlingOutput["NOT_ARCHIVED"] = "not-archived";
    /**
     * If the bundling output directory contains a single archive file (zip or jar)
     * it will be used as the bundle output as-is. Otherwise all the files in the bundling output directory will be zipped.
     */
    BundlingOutput["AUTO_DISCOVER"] = "auto-discover";
})(BundlingOutput = exports.BundlingOutput || (exports.BundlingOutput = {}));
/**
 * The access mechanism used to make source files available to the bundling container and to return the bundling output back to the host
 */
var BundlingFileAccess;
(function (BundlingFileAccess) {
    /**
     * Creates temporary volumes and containers to copy files from the host to the bundling container and back.
     * This is slower, but works also in more complex situations with remote or shared docker sockets.
     */
    BundlingFileAccess["VOLUME_COPY"] = "VOLUME_COPY";
    /**
     * The source and output folders will be mounted as bind mount from the host system
     * This is faster and simpler, but less portable than `VOLUME_COPY`.
     */
    BundlingFileAccess["BIND_MOUNT"] = "BIND_MOUNT";
})(BundlingFileAccess = exports.BundlingFileAccess || (exports.BundlingFileAccess = {}));
/**
 * A Docker image used for asset bundling
 *
 * @deprecated use DockerImage
 */
class BundlingDockerImage {
    /**
     * Reference an image on DockerHub or another online registry.
     *
     * @param image the image name
     */
    static fromRegistry(image) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/core.BundlingDockerImage#fromRegistry", "use DockerImage");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromRegistry);
            }
            throw error;
        }
        return new DockerImage(image);
    }
    /**
     * Reference an image that's built directly from sources on disk.
     *
     * @param path The path to the directory containing the Docker file
     * @param options Docker build options
     *
     * @deprecated use DockerImage.fromBuild()
     */
    static fromAsset(path, options = {}) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/core.BundlingDockerImage#fromAsset", "use DockerImage.fromBuild()");
            jsiiDeprecationWarnings._aws_cdk_core_DockerBuildOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromAsset);
            }
            throw error;
        }
        return DockerImage.fromBuild(path, options);
    }
    /** @param image The Docker image */
    constructor(image, _imageHash) {
        this.image = image;
        this._imageHash = _imageHash;
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/core.BundlingDockerImage", "use DockerImage");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, BundlingDockerImage);
            }
            throw error;
        }
    }
    /**
     * Provides a stable representation of this image for JSON serialization.
     *
     * @return The overridden image name if set or image hash name in that order
     */
    toJSON() {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/core.BundlingDockerImage#toJSON", "use DockerImage");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.toJSON);
            }
            throw error;
        }
        return this._imageHash ?? this.image;
    }
    /**
     * Runs a Docker image
     */
    run(options = {}) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/core.BundlingDockerImage#run", "use DockerImage");
            jsiiDeprecationWarnings._aws_cdk_core_DockerRunOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.run);
            }
            throw error;
        }
        const volumes = options.volumes || [];
        const environment = options.environment || {};
        const entrypoint = options.entrypoint?.[0] || null;
        const command = [
            ...options.entrypoint?.[1]
                ? [...options.entrypoint.slice(1)]
                : [],
            ...options.command
                ? [...options.command]
                : [],
        ];
        const dockerArgs = [
            'run', '--rm',
            ...options.securityOpt
                ? ['--security-opt', options.securityOpt]
                : [],
            ...options.network
                ? ['--network', options.network]
                : [],
            ...options.user
                ? ['-u', options.user]
                : [],
            ...options.volumesFrom
                ? flatten(options.volumesFrom.map(v => ['--volumes-from', v]))
                : [],
            ...flatten(volumes.map(v => ['-v', `${v.hostPath}:${v.containerPath}:${isSeLinux() ? 'z,' : ''}${v.consistency ?? DockerVolumeConsistency.DELEGATED}`])),
            ...flatten(Object.entries(environment).map(([k, v]) => ['--env', `${k}=${v}`])),
            ...options.workingDirectory
                ? ['-w', options.workingDirectory]
                : [],
            ...entrypoint
                ? ['--entrypoint', entrypoint]
                : [],
            this.image,
            ...command,
        ];
        (0, asset_staging_1.dockerExec)(dockerArgs);
    }
    /**
     * Copies a file or directory out of the Docker image to the local filesystem.
     *
     * If `outputPath` is omitted the destination path is a temporary directory.
     *
     * @param imagePath the path in the Docker image
     * @param outputPath the destination path for the copy operation
     * @returns the destination path
     */
    cp(imagePath, outputPath) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/core.BundlingDockerImage#cp", "use DockerImage");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.cp);
            }
            throw error;
        }
        const { stdout } = (0, asset_staging_1.dockerExec)(['create', this.image], {}); // Empty options to avoid stdout redirect here
        const match = stdout.toString().match(/([0-9a-f]{16,})/);
        if (!match) {
            throw new Error('Failed to extract container ID from Docker create output');
        }
        const containerId = match[1];
        const containerPath = `${containerId}:${imagePath}`;
        const destPath = outputPath ?? fs_1.FileSystem.mkdtemp('cdk-docker-cp-');
        try {
            (0, asset_staging_1.dockerExec)(['cp', containerPath, destPath]);
            return destPath;
        }
        catch (err) {
            throw new Error(`Failed to copy files from ${containerPath} to ${destPath}: ${err}`);
        }
        finally {
            (0, asset_staging_1.dockerExec)(['rm', '-v', containerId]);
        }
    }
}
_b = JSII_RTTI_SYMBOL_1;
BundlingDockerImage[_b] = { fqn: "@aws-cdk/core.BundlingDockerImage", version: "0.0.0" };
exports.BundlingDockerImage = BundlingDockerImage;
/**
 * A Docker image
 */
class DockerImage extends BundlingDockerImage {
    /**
     * Builds a Docker image
     *
     * @param path The path to the directory containing the Docker file
     * @param options Docker build options
     */
    static fromBuild(path, options = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_core_DockerBuildOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromBuild);
            }
            throw error;
        }
        const buildArgs = options.buildArgs || {};
        if (options.file && (0, path_1.isAbsolute)(options.file)) {
            throw new Error(`"file" must be relative to the docker build directory. Got ${options.file}`);
        }
        // Image tag derived from path and build options
        const input = JSON.stringify({ path, ...options });
        const tagHash = crypto.createHash('sha256').update(input).digest('hex');
        const tag = `cdk-${tagHash}`;
        const dockerArgs = [
            'build', '-t', tag,
            ...(options.file ? ['-f', (0, path_1.join)(path, options.file)] : []),
            ...(options.platform ? ['--platform', options.platform] : []),
            ...(options.targetStage ? ['--target', options.targetStage] : []),
            ...flatten(Object.entries(buildArgs).map(([k, v]) => ['--build-arg', `${k}=${v}`])),
            path,
        ];
        (0, asset_staging_1.dockerExec)(dockerArgs);
        // Fingerprints the directory containing the Dockerfile we're building and
        // differentiates the fingerprint based on build arguments. We do this so
        // we can provide a stable image hash. Otherwise, the image ID will be
        // different every time the Docker layer cache is cleared, due primarily to
        // timestamps.
        const hash = fs_1.FileSystem.fingerprint(path, { extraHash: JSON.stringify(options) });
        return new DockerImage(tag, hash);
    }
    /**
     * Reference an image on DockerHub or another online registry.
     *
     * @param image the image name
     */
    static fromRegistry(image) {
        return new DockerImage(image);
    }
    constructor(image, _imageHash) {
        // It is preferrable for the deprecated class to inherit a non-deprecated class.
        // However, in this case, the opposite has occurred which is incompatible with
        // a deprecation feature. See https://github.com/aws/jsii/issues/3102.
        const deprecated = (0, jsii_deprecated_1.quiet)();
        super(image, _imageHash);
        (0, jsii_deprecated_1.reset)(deprecated);
        this.image = image;
    }
    /**
     * Provides a stable representation of this image for JSON serialization.
     *
     * @return The overridden image name if set or image hash name in that order
     */
    toJSON() {
        // It is preferrable for the deprecated class to inherit a non-deprecated class.
        // However, in this case, the opposite has occurred which is incompatible with
        // a deprecation feature. See https://github.com/aws/jsii/issues/3102.
        const deprecated = (0, jsii_deprecated_1.quiet)();
        const json = super.toJSON();
        (0, jsii_deprecated_1.reset)(deprecated);
        return json;
    }
    /**
     * Runs a Docker image
     */
    run(options = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_core_DockerRunOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.run);
            }
            throw error;
        }
        // It is preferrable for the deprecated class to inherit a non-deprecated class.
        // However, in this case, the opposite has occurred which is incompatible with
        // a deprecation feature. See https://github.com/aws/jsii/issues/3102.
        const deprecated = (0, jsii_deprecated_1.quiet)();
        const result = super.run(options);
        (0, jsii_deprecated_1.reset)(deprecated);
        return result;
    }
    /**
     * Copies a file or directory out of the Docker image to the local filesystem.
     *
     * If `outputPath` is omitted the destination path is a temporary directory.
     *
     * @param imagePath the path in the Docker image
     * @param outputPath the destination path for the copy operation
     * @returns the destination path
     */
    cp(imagePath, outputPath) {
        // It is preferrable for the deprecated class to inherit a non-deprecated class.
        // However, in this case, the opposite has occurred which is incompatible with
        // a deprecation feature. See https://github.com/aws/jsii/issues/3102.
        const deprecated = (0, jsii_deprecated_1.quiet)();
        const result = super.cp(imagePath, outputPath);
        (0, jsii_deprecated_1.reset)(deprecated);
        return result;
    }
}
_c = JSII_RTTI_SYMBOL_1;
DockerImage[_c] = { fqn: "@aws-cdk/core.DockerImage", version: "0.0.0" };
exports.DockerImage = DockerImage;
/**
 * Supported Docker volume consistency types. Only valid on macOS due to the way file storage works on Mac
 */
var DockerVolumeConsistency;
(function (DockerVolumeConsistency) {
    /**
     * Read/write operations inside the Docker container are applied immediately on the mounted host machine volumes
     */
    DockerVolumeConsistency["CONSISTENT"] = "consistent";
    /**
     * Read/write operations on mounted Docker volumes are first written inside the container and then synchronized to the host machine
     */
    DockerVolumeConsistency["DELEGATED"] = "delegated";
    /**
     * Read/write operations on mounted Docker volumes are first applied on the host machine and then synchronized to the container
     */
    DockerVolumeConsistency["CACHED"] = "cached";
})(DockerVolumeConsistency = exports.DockerVolumeConsistency || (exports.DockerVolumeConsistency = {}));
function flatten(x) {
    return Array.prototype.concat([], ...x);
}
function isSeLinux() {
    if (process.platform != 'linux') {
        return false;
    }
    const prog = 'selinuxenabled';
    const proc = (0, child_process_1.spawnSync)(prog, [], {
        stdio: [
            'pipe',
            process.stderr,
            'inherit', // inherit stderr
        ],
    });
    if (proc.error) {
        // selinuxenabled not a valid command, therefore not enabled
        return false;
    }
    if (proc.status == 0) {
        // selinux enabled
        return true;
    }
    else {
        // selinux not enabled
        return false;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxpbmcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJidW5kbGluZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxpREFBMEM7QUFDMUMsaUNBQWlDO0FBQ2pDLCtCQUF3QztBQUN4Qyw2QkFBa0M7QUFDbEMsMkRBQXFEO0FBQ3JELCtEQUF5RDtBQUV6RDs7Ozs7O0dBTUc7QUFDSCxNQUFhLGlCQUFpQjtJQUM1Qjs7OztPQUlHO0lBQ0ksTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFXO1FBQy9CLE9BQU8sT0FBTyxHQUFHLEVBQUUsQ0FBQztLQUNyQjtJQUVEOzs7O09BSUc7SUFDSSxNQUFNLENBQUMsZUFBZSxDQUFDLG1CQUEyQjtRQUN2RCxNQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLG1CQUFtQixDQUFDLENBQUM7UUFFL0MsSUFBSSxLQUFLLEVBQUU7WUFDVCxPQUFPLE9BQU8sbUJBQW1CLEVBQUUsQ0FBQztTQUNyQzthQUFNO1lBQ0wsTUFBTSxJQUFJLEtBQUssQ0FBQyx3QkFBd0IsbUJBQW1CLGFBQWEsQ0FBQyxDQUFDO1NBQzNFO0tBQ0Y7Ozs7QUF2QlUsOENBQWlCO0FBMEk5Qjs7O0dBR0c7QUFDSCxJQUFZLGNBbUJYO0FBbkJELFdBQVksY0FBYztJQUN4Qjs7OztPQUlHO0lBQ0gsdUNBQXFCLENBQUE7SUFFckI7OztPQUdHO0lBQ0gsK0NBQTZCLENBQUE7SUFFN0I7OztPQUdHO0lBQ0gsaURBQStCLENBQUE7QUFDakMsQ0FBQyxFQW5CVyxjQUFjLEdBQWQsc0JBQWMsS0FBZCxzQkFBYyxRQW1CekI7QUFrQkQ7O0dBRUc7QUFDSCxJQUFZLGtCQVlYO0FBWkQsV0FBWSxrQkFBa0I7SUFDNUI7OztPQUdHO0lBQ0gsaURBQTJCLENBQUE7SUFFM0I7OztPQUdHO0lBQ0gsK0NBQXlCLENBQUE7QUFDM0IsQ0FBQyxFQVpXLGtCQUFrQixHQUFsQiwwQkFBa0IsS0FBbEIsMEJBQWtCLFFBWTdCO0FBRUQ7Ozs7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T0FFRztJQUNILG9EQUF5QixDQUFBO0lBQ3pCOztPQUVHO0lBQ0gsa0RBQXVCLENBQUE7SUFDdkI7O09BRUc7SUFDSCw0Q0FBaUIsQ0FBQTtBQUNuQixDQUFDLEVBYlcsdUJBQXVCLEdBQXZCLCtCQUF1QixLQUF2QiwrQkFBdUIsUUFhbEM7QUE0R0QsU0FBUyxPQUFPLENBQUMsQ0FBYTtJQUM1QixPQUFPLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQzFDLENBQUM7QUFFRCxTQUFTLFNBQVM7SUFDaEIsSUFBSSxPQUFPLENBQUMsUUFBUSxJQUFJLE9BQU8sRUFBRTtRQUMvQixPQUFPLEtBQUssQ0FBQztLQUNkO0lBQ0QsTUFBTSxJQUFJLEdBQUcsZ0JBQWdCLENBQUM7SUFDOUIsTUFBTSxJQUFJLEdBQUcsSUFBQSx5QkFBUyxFQUFDLElBQUksRUFBRSxFQUFFLEVBQUU7UUFDL0IsS0FBSyxFQUFFO1lBQ0wsTUFBTTtZQUNOLE9BQU8sQ0FBQyxNQUFNO1lBQ2QsU0FBUyxFQUFFLGlCQUFpQjtTQUM3QjtLQUNGLENBQUMsQ0FBQztJQUNILElBQUksSUFBSSxDQUFDLEtBQUssRUFBRTtRQUNkLDREQUE0RDtRQUM1RCxPQUFPLEtBQUssQ0FBQztLQUNkO0lBQ0QsSUFBSSxJQUFJLENBQUMsTUFBTSxJQUFJLENBQUMsRUFBRTtRQUNwQixrQkFBa0I7UUFDbEIsT0FBTyxJQUFJLENBQUM7S0FDYjtTQUFNO1FBQ0wsc0JBQXNCO1FBQ3RCLE9BQU8sS0FBSyxDQUFDO0tBQ2Q7QUFDSCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgc3Bhd25TeW5jIH0gZnJvbSAnY2hpbGRfcHJvY2Vzcyc7XG5pbXBvcnQgKiBhcyBjcnlwdG8gZnJvbSAnY3J5cHRvJztcbmltcG9ydCB7IGlzQWJzb2x1dGUsIGpvaW4gfSBmcm9tICdwYXRoJztcbmltcG9ydCB7IEZpbGVTeXN0ZW0gfSBmcm9tICcuL2ZzJztcbmltcG9ydCB7IGRvY2tlckV4ZWMgfSBmcm9tICcuL3ByaXZhdGUvYXNzZXQtc3RhZ2luZyc7XG5pbXBvcnQgeyBxdWlldCwgcmVzZXQgfSBmcm9tICcuL3ByaXZhdGUvanNpaS1kZXByZWNhdGVkJztcblxuLyoqXG4gKiBNZXRob2RzIHRvIGJ1aWxkIERvY2tlciBDTEkgYXJndW1lbnRzIGZvciBidWlsZHMgdXNpbmcgc2VjcmV0cy5cbiAqXG4gKiBEb2NrZXIgQnVpbGRLaXQgbXVzdCBiZSBlbmFibGVkIHRvIHVzZSBidWlsZCBzZWNyZXRzLlxuICpcbiAqIEBzZWUgaHR0cHM6Ly9kb2NzLmRvY2tlci5jb20vYnVpbGQvYnVpbGRraXQvXG4gKi9cbmV4cG9ydCBjbGFzcyBEb2NrZXJCdWlsZFNlY3JldCB7XG4gIC8qKlxuICAgKiBBIERvY2tlciBidWlsZCBzZWNyZXQgZnJvbSBhIGZpbGUgc291cmNlXG4gICAqIEBwYXJhbSBzcmMgVGhlIHBhdGggdG8gdGhlIHNvdXJjZSBmaWxlLCByZWxhdGl2ZSB0byB0aGUgYnVpbGQgZGlyZWN0b3J5LlxuICAgKiBAcmV0dXJucyBUaGUgbGF0dGVyIGhhbGYgcmVxdWlyZWQgZm9yIGAtLXNlY3JldGBcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZnJvbVNyYyhzcmM6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgcmV0dXJuIGBzcmM9JHtzcmN9YDtcbiAgfVxuXG4gIC8qKlxuICAgKiBBIERvY2tlciBidWlsZCBzZWNyZXQgZnJvbSB0aGUgYnVpbGQgZW52aXJvbm1lbnRcbiAgICogQHBhcmFtIGVudmlyb25tZW50VmFyaWFibGUgVGhlIGVudmlyb25tZW50IHZhcmlhYmxlIG5hbWVcbiAgICogQHJldHVybnMgVGhlIGxhdHRlciBoYWxmIHJlcXVpcmVkIGZvciBgLS1zZWNyZXRgXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21FbnZpcm9ubWVudChlbnZpcm9ubWVudFZhcmlhYmxlOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIGNvbnN0IHZhbHVlID0gcHJvY2Vzcy5lbnZbZW52aXJvbm1lbnRWYXJpYWJsZV07XG5cbiAgICBpZiAodmFsdWUpIHtcbiAgICAgIHJldHVybiBgZW52PSR7ZW52aXJvbm1lbnRWYXJpYWJsZX1gO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEVudmlyb25tZW50IHZhcmlhYmxlICR7ZW52aXJvbm1lbnRWYXJpYWJsZX0gaXMgbm90IHNldGApO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIEJ1bmRsaW5nIG9wdGlvbnNcbiAqXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQnVuZGxpbmdPcHRpb25zIHtcbiAgLyoqXG4gICAqIFRoZSBEb2NrZXIgaW1hZ2Ugd2hlcmUgdGhlIGNvbW1hbmQgd2lsbCBydW4uXG4gICAqL1xuICByZWFkb25seSBpbWFnZTogRG9ja2VySW1hZ2U7XG5cbiAgLyoqXG4gICAqIFRoZSBlbnRyeXBvaW50IHRvIHJ1biBpbiB0aGUgRG9ja2VyIGNvbnRhaW5lci5cbiAgICpcbiAgICogRXhhbXBsZSB2YWx1ZTogYFsnL2Jpbi9zaCcsICctYyddYFxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5kb2NrZXIuY29tL2VuZ2luZS9yZWZlcmVuY2UvYnVpbGRlci8jZW50cnlwb2ludFxuICAgKlxuICAgKiBAZGVmYXVsdCAtIHJ1biB0aGUgZW50cnlwb2ludCBkZWZpbmVkIGluIHRoZSBpbWFnZVxuICAgKi9cbiAgcmVhZG9ubHkgZW50cnlwb2ludD86IHN0cmluZ1tdO1xuXG4gIC8qKlxuICAgKiBUaGUgY29tbWFuZCB0byBydW4gaW4gdGhlIERvY2tlciBjb250YWluZXIuXG4gICAqXG4gICAqIEV4YW1wbGUgdmFsdWU6IGBbJ25wbScsICdpbnN0YWxsJ11gXG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmRvY2tlci5jb20vZW5naW5lL3JlZmVyZW5jZS9ydW4vXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gcnVuIHRoZSBjb21tYW5kIGRlZmluZWQgaW4gdGhlIGltYWdlXG4gICAqL1xuICByZWFkb25seSBjb21tYW5kPzogc3RyaW5nW107XG5cbiAgLyoqXG4gICAqIEFkZGl0aW9uYWwgRG9ja2VyIHZvbHVtZXMgdG8gbW91bnQuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gbm8gYWRkaXRpb25hbCB2b2x1bWVzIGFyZSBtb3VudGVkXG4gICAqL1xuICByZWFkb25seSB2b2x1bWVzPzogRG9ja2VyVm9sdW1lW107XG5cbiAgLyoqXG4gICAqIFdoZXJlIHRvIG1vdW50IHRoZSBzcGVjaWZpZWQgdm9sdW1lcyBmcm9tXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmRvY2tlci5jb20vZW5naW5lL3JlZmVyZW5jZS9jb21tYW5kbGluZS9ydW4vI21vdW50LXZvbHVtZXMtZnJvbS1jb250YWluZXItLS12b2x1bWVzLWZyb21cbiAgICogQGRlZmF1bHQgLSBubyBjb250YWluZXJzIGFyZSBzcGVjaWZpZWQgdG8gbW91bnQgdm9sdW1lcyBmcm9tXG4gICAqL1xuICByZWFkb25seSB2b2x1bWVzRnJvbT86IHN0cmluZ1tdO1xuXG4gIC8qKlxuICAgKiBUaGUgZW52aXJvbm1lbnQgdmFyaWFibGVzIHRvIHBhc3MgdG8gdGhlIERvY2tlciBjb250YWluZXIuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gbm8gZW52aXJvbm1lbnQgdmFyaWFibGVzLlxuICAgKi9cbiAgcmVhZG9ubHkgZW52aXJvbm1lbnQ/OiB7IFtrZXk6IHN0cmluZ106IHN0cmluZzsgfTtcblxuICAvKipcbiAgICogV29ya2luZyBkaXJlY3RvcnkgaW5zaWRlIHRoZSBEb2NrZXIgY29udGFpbmVyLlxuICAgKlxuICAgKiBAZGVmYXVsdCAvYXNzZXQtaW5wdXRcbiAgICovXG4gIHJlYWRvbmx5IHdvcmtpbmdEaXJlY3Rvcnk/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSB1c2VyIHRvIHVzZSB3aGVuIHJ1bm5pbmcgdGhlIERvY2tlciBjb250YWluZXIuXG4gICAqXG4gICAqICAgdXNlciB8IHVzZXI6Z3JvdXAgfCB1aWQgfCB1aWQ6Z2lkIHwgdXNlcjpnaWQgfCB1aWQ6Z3JvdXBcbiAgICpcbiAgICogQHNlZSBodHRwczovL2RvY3MuZG9ja2VyLmNvbS9lbmdpbmUvcmVmZXJlbmNlL3J1bi8jdXNlclxuICAgKlxuICAgKiBAZGVmYXVsdCAtIHVpZDpnaWQgb2YgdGhlIGN1cnJlbnQgdXNlciBvciAxMDAwOjEwMDAgb24gV2luZG93c1xuICAgKi9cbiAgcmVhZG9ubHkgdXNlcj86IHN0cmluZztcblxuICAvKipcbiAgICogTG9jYWwgYnVuZGxpbmcgcHJvdmlkZXIuXG4gICAqXG4gICAqIFRoZSBwcm92aWRlciBpbXBsZW1lbnRzIGEgbWV0aG9kIGB0cnlCdW5kbGUoKWAgd2hpY2ggc2hvdWxkIHJldHVybiBgdHJ1ZWBcbiAgICogaWYgbG9jYWwgYnVuZGxpbmcgd2FzIHBlcmZvcm1lZC4gSWYgYGZhbHNlYCBpcyByZXR1cm5lZCwgZG9ja2VyIGJ1bmRsaW5nXG4gICAqIHdpbGwgYmUgZG9uZS5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBidW5kbGluZyB3aWxsIG9ubHkgYmUgcGVyZm9ybWVkIGluIGEgRG9ja2VyIGNvbnRhaW5lclxuICAgKlxuICAgKi9cbiAgcmVhZG9ubHkgbG9jYWw/OiBJTG9jYWxCdW5kbGluZztcblxuICAvKipcbiAgICogVGhlIHR5cGUgb2Ygb3V0cHV0IHRoYXQgdGhpcyBidW5kbGluZyBvcGVyYXRpb24gaXMgcHJvZHVjaW5nLlxuICAgKlxuICAgKiBAZGVmYXVsdCBCdW5kbGluZ091dHB1dC5BVVRPX0RJU0NPVkVSXG4gICAqXG4gICAqL1xuICByZWFkb25seSBvdXRwdXRUeXBlPzogQnVuZGxpbmdPdXRwdXQ7XG5cbiAgLyoqXG4gICAqIFtTZWN1cml0eSBjb25maWd1cmF0aW9uXShodHRwczovL2RvY3MuZG9ja2VyLmNvbS9lbmdpbmUvcmVmZXJlbmNlL3J1bi8jc2VjdXJpdHktY29uZmlndXJhdGlvbilcbiAgICogd2hlbiBydW5uaW5nIHRoZSBkb2NrZXIgY29udGFpbmVyLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIG5vIHNlY3VyaXR5IG9wdGlvbnNcbiAgICovXG4gIHJlYWRvbmx5IHNlY3VyaXR5T3B0Pzogc3RyaW5nO1xuICAvKipcbiAgICogRG9ja2VyIFtOZXR3b3JraW5nIG9wdGlvbnNdKGh0dHBzOi8vZG9jcy5kb2NrZXIuY29tL2VuZ2luZS9yZWZlcmVuY2UvY29tbWFuZGxpbmUvcnVuLyNjb25uZWN0LWEtY29udGFpbmVyLXRvLWEtbmV0d29yay0tLW5ldHdvcmspXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gbm8gbmV0d29ya2luZyBvcHRpb25zXG4gICAqL1xuICByZWFkb25seSBuZXR3b3JrPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgYWNjZXNzIG1lY2hhbmlzbSB1c2VkIHRvIG1ha2Ugc291cmNlIGZpbGVzIGF2YWlsYWJsZSB0byB0aGUgYnVuZGxpbmcgY29udGFpbmVyIGFuZCB0byByZXR1cm4gdGhlIGJ1bmRsaW5nIG91dHB1dCBiYWNrIHRvIHRoZSBob3N0LlxuICAgKiBAZGVmYXVsdCAtIEJ1bmRsaW5nRmlsZUFjY2Vzcy5CSU5EX01PVU5UXG4gICAqL1xuICByZWFkb25seSBidW5kbGluZ0ZpbGVBY2Nlc3M/OiBCdW5kbGluZ0ZpbGVBY2Nlc3M7XG59XG5cbi8qKlxuICogVGhlIHR5cGUgb2Ygb3V0cHV0IHRoYXQgYSBidW5kbGluZyBvcGVyYXRpb24gaXMgcHJvZHVjaW5nLlxuICpcbiAqL1xuZXhwb3J0IGVudW0gQnVuZGxpbmdPdXRwdXQge1xuICAvKipcbiAgICogVGhlIGJ1bmRsaW5nIG91dHB1dCBkaXJlY3RvcnkgaW5jbHVkZXMgYSBzaW5nbGUgLnppcCBvciAuamFyIGZpbGUgd2hpY2hcbiAgICogd2lsbCBiZSB1c2VkIGFzIHRoZSBmaW5hbCBidW5kbGUuIElmIHRoZSBvdXRwdXQgZGlyZWN0b3J5IGRvZXMgbm90XG4gICAqIGluY2x1ZGUgZXhhY3RseSBhIHNpbmdsZSBhcmNoaXZlLCBidW5kbGluZyB3aWxsIGZhaWwuXG4gICAqL1xuICBBUkNISVZFRCA9ICdhcmNoaXZlZCcsXG5cbiAgLyoqXG4gICAqIFRoZSBidW5kbGluZyBvdXRwdXQgZGlyZWN0b3J5IGNvbnRhaW5zIG9uZSBvciBtb3JlIGZpbGVzIHdoaWNoIHdpbGwgYmVcbiAgICogYXJjaGl2ZWQgYW5kIHVwbG9hZGVkIGFzIGEgLnppcCBmaWxlIHRvIFMzLlxuICAgKi9cbiAgTk9UX0FSQ0hJVkVEID0gJ25vdC1hcmNoaXZlZCcsXG5cbiAgLyoqXG4gICAqIElmIHRoZSBidW5kbGluZyBvdXRwdXQgZGlyZWN0b3J5IGNvbnRhaW5zIGEgc2luZ2xlIGFyY2hpdmUgZmlsZSAoemlwIG9yIGphcilcbiAgICogaXQgd2lsbCBiZSB1c2VkIGFzIHRoZSBidW5kbGUgb3V0cHV0IGFzLWlzLiBPdGhlcndpc2UgYWxsIHRoZSBmaWxlcyBpbiB0aGUgYnVuZGxpbmcgb3V0cHV0IGRpcmVjdG9yeSB3aWxsIGJlIHppcHBlZC5cbiAgICovXG4gIEFVVE9fRElTQ09WRVIgPSAnYXV0by1kaXNjb3ZlcicsXG59XG5cbi8qKlxuICogTG9jYWwgYnVuZGxpbmdcbiAqXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSUxvY2FsQnVuZGxpbmcge1xuICAvKipcbiAgICogVGhpcyBtZXRob2QgaXMgY2FsbGVkIGJlZm9yZSBhdHRlbXB0aW5nIGRvY2tlciBidW5kbGluZyB0byBhbGxvdyB0aGVcbiAgICogYnVuZGxlciB0byBiZSBleGVjdXRlZCBsb2NhbGx5LiBJZiB0aGUgbG9jYWwgYnVuZGxlciBleGlzdHMsIGFuZCBidW5kbGluZ1xuICAgKiB3YXMgcGVyZm9ybWVkIGxvY2FsbHksIHJldHVybiBgdHJ1ZWAuIE90aGVyd2lzZSwgcmV0dXJuIGBmYWxzZWAuXG4gICAqXG4gICAqIEBwYXJhbSBvdXRwdXREaXIgdGhlIGRpcmVjdG9yeSB3aGVyZSB0aGUgYnVuZGxlZCBhc3NldCBzaG91bGQgYmUgb3V0cHV0XG4gICAqIEBwYXJhbSBvcHRpb25zIGJ1bmRsaW5nIG9wdGlvbnMgZm9yIHRoaXMgYXNzZXRcbiAgICovXG4gIHRyeUJ1bmRsZShvdXRwdXREaXI6IHN0cmluZywgb3B0aW9uczogQnVuZGxpbmdPcHRpb25zKTogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBUaGUgYWNjZXNzIG1lY2hhbmlzbSB1c2VkIHRvIG1ha2Ugc291cmNlIGZpbGVzIGF2YWlsYWJsZSB0byB0aGUgYnVuZGxpbmcgY29udGFpbmVyIGFuZCB0byByZXR1cm4gdGhlIGJ1bmRsaW5nIG91dHB1dCBiYWNrIHRvIHRoZSBob3N0XG4gKi9cbmV4cG9ydCBlbnVtIEJ1bmRsaW5nRmlsZUFjY2VzcyB7XG4gIC8qKlxuICAgKiBDcmVhdGVzIHRlbXBvcmFyeSB2b2x1bWVzIGFuZCBjb250YWluZXJzIHRvIGNvcHkgZmlsZXMgZnJvbSB0aGUgaG9zdCB0byB0aGUgYnVuZGxpbmcgY29udGFpbmVyIGFuZCBiYWNrLlxuICAgKiBUaGlzIGlzIHNsb3dlciwgYnV0IHdvcmtzIGFsc28gaW4gbW9yZSBjb21wbGV4IHNpdHVhdGlvbnMgd2l0aCByZW1vdGUgb3Igc2hhcmVkIGRvY2tlciBzb2NrZXRzLlxuICAgKi9cbiAgVk9MVU1FX0NPUFkgPSAnVk9MVU1FX0NPUFknLFxuXG4gIC8qKlxuICAgKiBUaGUgc291cmNlIGFuZCBvdXRwdXQgZm9sZGVycyB3aWxsIGJlIG1vdW50ZWQgYXMgYmluZCBtb3VudCBmcm9tIHRoZSBob3N0IHN5c3RlbVxuICAgKiBUaGlzIGlzIGZhc3RlciBhbmQgc2ltcGxlciwgYnV0IGxlc3MgcG9ydGFibGUgdGhhbiBgVk9MVU1FX0NPUFlgLlxuICAgKi9cbiAgQklORF9NT1VOVCA9ICdCSU5EX01PVU5UJyxcbn1cblxuLyoqXG4gKiBBIERvY2tlciBpbWFnZSB1c2VkIGZvciBhc3NldCBidW5kbGluZ1xuICpcbiAqIEBkZXByZWNhdGVkIHVzZSBEb2NrZXJJbWFnZVxuICovXG5leHBvcnQgY2xhc3MgQnVuZGxpbmdEb2NrZXJJbWFnZSB7XG4gIC8qKlxuICAgKiBSZWZlcmVuY2UgYW4gaW1hZ2Ugb24gRG9ja2VySHViIG9yIGFub3RoZXIgb25saW5lIHJlZ2lzdHJ5LlxuICAgKlxuICAgKiBAcGFyYW0gaW1hZ2UgdGhlIGltYWdlIG5hbWVcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZnJvbVJlZ2lzdHJ5KGltYWdlOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gbmV3IERvY2tlckltYWdlKGltYWdlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWZlcmVuY2UgYW4gaW1hZ2UgdGhhdCdzIGJ1aWx0IGRpcmVjdGx5IGZyb20gc291cmNlcyBvbiBkaXNrLlxuICAgKlxuICAgKiBAcGFyYW0gcGF0aCBUaGUgcGF0aCB0byB0aGUgZGlyZWN0b3J5IGNvbnRhaW5pbmcgdGhlIERvY2tlciBmaWxlXG4gICAqIEBwYXJhbSBvcHRpb25zIERvY2tlciBidWlsZCBvcHRpb25zXG4gICAqXG4gICAqIEBkZXByZWNhdGVkIHVzZSBEb2NrZXJJbWFnZS5mcm9tQnVpbGQoKVxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tQXNzZXQocGF0aDogc3RyaW5nLCBvcHRpb25zOiBEb2NrZXJCdWlsZE9wdGlvbnMgPSB7fSk6IEJ1bmRsaW5nRG9ja2VySW1hZ2Uge1xuICAgIHJldHVybiBEb2NrZXJJbWFnZS5mcm9tQnVpbGQocGF0aCwgb3B0aW9ucyk7XG4gIH1cblxuICAvKiogQHBhcmFtIGltYWdlIFRoZSBEb2NrZXIgaW1hZ2UgKi9cbiAgcHJvdGVjdGVkIGNvbnN0cnVjdG9yKHB1YmxpYyByZWFkb25seSBpbWFnZTogc3RyaW5nLCBwcml2YXRlIHJlYWRvbmx5IF9pbWFnZUhhc2g/OiBzdHJpbmcpIHt9XG5cbiAgLyoqXG4gICAqIFByb3ZpZGVzIGEgc3RhYmxlIHJlcHJlc2VudGF0aW9uIG9mIHRoaXMgaW1hZ2UgZm9yIEpTT04gc2VyaWFsaXphdGlvbi5cbiAgICpcbiAgICogQHJldHVybiBUaGUgb3ZlcnJpZGRlbiBpbWFnZSBuYW1lIGlmIHNldCBvciBpbWFnZSBoYXNoIG5hbWUgaW4gdGhhdCBvcmRlclxuICAgKi9cbiAgcHVibGljIHRvSlNPTigpIHtcbiAgICByZXR1cm4gdGhpcy5faW1hZ2VIYXNoID8/IHRoaXMuaW1hZ2U7XG4gIH1cblxuICAvKipcbiAgICogUnVucyBhIERvY2tlciBpbWFnZVxuICAgKi9cbiAgcHVibGljIHJ1bihvcHRpb25zOiBEb2NrZXJSdW5PcHRpb25zID0ge30pIHtcbiAgICBjb25zdCB2b2x1bWVzID0gb3B0aW9ucy52b2x1bWVzIHx8IFtdO1xuICAgIGNvbnN0IGVudmlyb25tZW50ID0gb3B0aW9ucy5lbnZpcm9ubWVudCB8fCB7fTtcbiAgICBjb25zdCBlbnRyeXBvaW50ID0gb3B0aW9ucy5lbnRyeXBvaW50Py5bMF0gfHwgbnVsbDtcbiAgICBjb25zdCBjb21tYW5kID0gW1xuICAgICAgLi4ub3B0aW9ucy5lbnRyeXBvaW50Py5bMV1cbiAgICAgICAgPyBbLi4ub3B0aW9ucy5lbnRyeXBvaW50LnNsaWNlKDEpXVxuICAgICAgICA6IFtdLFxuICAgICAgLi4ub3B0aW9ucy5jb21tYW5kXG4gICAgICAgID8gWy4uLm9wdGlvbnMuY29tbWFuZF1cbiAgICAgICAgOiBbXSxcbiAgICBdO1xuXG4gICAgY29uc3QgZG9ja2VyQXJnczogc3RyaW5nW10gPSBbXG4gICAgICAncnVuJywgJy0tcm0nLFxuICAgICAgLi4ub3B0aW9ucy5zZWN1cml0eU9wdFxuICAgICAgICA/IFsnLS1zZWN1cml0eS1vcHQnLCBvcHRpb25zLnNlY3VyaXR5T3B0XVxuICAgICAgICA6IFtdLFxuICAgICAgLi4ub3B0aW9ucy5uZXR3b3JrXG4gICAgICAgID8gWyctLW5ldHdvcmsnLCBvcHRpb25zLm5ldHdvcmtdXG4gICAgICAgIDogW10sXG4gICAgICAuLi5vcHRpb25zLnVzZXJcbiAgICAgICAgPyBbJy11Jywgb3B0aW9ucy51c2VyXVxuICAgICAgICA6IFtdLFxuICAgICAgLi4ub3B0aW9ucy52b2x1bWVzRnJvbVxuICAgICAgICA/IGZsYXR0ZW4ob3B0aW9ucy52b2x1bWVzRnJvbS5tYXAodiA9PiBbJy0tdm9sdW1lcy1mcm9tJywgdl0pKVxuICAgICAgICA6IFtdLFxuICAgICAgLi4uZmxhdHRlbih2b2x1bWVzLm1hcCh2ID0+IFsnLXYnLCBgJHt2Lmhvc3RQYXRofToke3YuY29udGFpbmVyUGF0aH06JHtpc1NlTGludXgoKSA/ICd6LCcgOiAnJ30ke3YuY29uc2lzdGVuY3kgPz8gRG9ja2VyVm9sdW1lQ29uc2lzdGVuY3kuREVMRUdBVEVEfWBdKSksXG4gICAgICAuLi5mbGF0dGVuKE9iamVjdC5lbnRyaWVzKGVudmlyb25tZW50KS5tYXAoKFtrLCB2XSkgPT4gWyctLWVudicsIGAke2t9PSR7dn1gXSkpLFxuICAgICAgLi4ub3B0aW9ucy53b3JraW5nRGlyZWN0b3J5XG4gICAgICAgID8gWyctdycsIG9wdGlvbnMud29ya2luZ0RpcmVjdG9yeV1cbiAgICAgICAgOiBbXSxcbiAgICAgIC4uLmVudHJ5cG9pbnRcbiAgICAgICAgPyBbJy0tZW50cnlwb2ludCcsIGVudHJ5cG9pbnRdXG4gICAgICAgIDogW10sXG4gICAgICB0aGlzLmltYWdlLFxuICAgICAgLi4uY29tbWFuZCxcbiAgICBdO1xuXG4gICAgZG9ja2VyRXhlYyhkb2NrZXJBcmdzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb3BpZXMgYSBmaWxlIG9yIGRpcmVjdG9yeSBvdXQgb2YgdGhlIERvY2tlciBpbWFnZSB0byB0aGUgbG9jYWwgZmlsZXN5c3RlbS5cbiAgICpcbiAgICogSWYgYG91dHB1dFBhdGhgIGlzIG9taXR0ZWQgdGhlIGRlc3RpbmF0aW9uIHBhdGggaXMgYSB0ZW1wb3JhcnkgZGlyZWN0b3J5LlxuICAgKlxuICAgKiBAcGFyYW0gaW1hZ2VQYXRoIHRoZSBwYXRoIGluIHRoZSBEb2NrZXIgaW1hZ2VcbiAgICogQHBhcmFtIG91dHB1dFBhdGggdGhlIGRlc3RpbmF0aW9uIHBhdGggZm9yIHRoZSBjb3B5IG9wZXJhdGlvblxuICAgKiBAcmV0dXJucyB0aGUgZGVzdGluYXRpb24gcGF0aFxuICAgKi9cbiAgcHVibGljIGNwKGltYWdlUGF0aDogc3RyaW5nLCBvdXRwdXRQYXRoPzogc3RyaW5nKTogc3RyaW5nIHtcbiAgICBjb25zdCB7IHN0ZG91dCB9ID0gZG9ja2VyRXhlYyhbJ2NyZWF0ZScsIHRoaXMuaW1hZ2VdLCB7fSk7IC8vIEVtcHR5IG9wdGlvbnMgdG8gYXZvaWQgc3Rkb3V0IHJlZGlyZWN0IGhlcmVcbiAgICBjb25zdCBtYXRjaCA9IHN0ZG91dC50b1N0cmluZygpLm1hdGNoKC8oWzAtOWEtZl17MTYsfSkvKTtcbiAgICBpZiAoIW1hdGNoKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ZhaWxlZCB0byBleHRyYWN0IGNvbnRhaW5lciBJRCBmcm9tIERvY2tlciBjcmVhdGUgb3V0cHV0Jyk7XG4gICAgfVxuXG4gICAgY29uc3QgY29udGFpbmVySWQgPSBtYXRjaFsxXTtcbiAgICBjb25zdCBjb250YWluZXJQYXRoID0gYCR7Y29udGFpbmVySWR9OiR7aW1hZ2VQYXRofWA7XG4gICAgY29uc3QgZGVzdFBhdGggPSBvdXRwdXRQYXRoID8/IEZpbGVTeXN0ZW0ubWtkdGVtcCgnY2RrLWRvY2tlci1jcC0nKTtcbiAgICB0cnkge1xuICAgICAgZG9ja2VyRXhlYyhbJ2NwJywgY29udGFpbmVyUGF0aCwgZGVzdFBhdGhdKTtcbiAgICAgIHJldHVybiBkZXN0UGF0aDtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgRmFpbGVkIHRvIGNvcHkgZmlsZXMgZnJvbSAke2NvbnRhaW5lclBhdGh9IHRvICR7ZGVzdFBhdGh9OiAke2Vycn1gKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgZG9ja2VyRXhlYyhbJ3JtJywgJy12JywgY29udGFpbmVySWRdKTtcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBBIERvY2tlciBpbWFnZVxuICovXG5leHBvcnQgY2xhc3MgRG9ja2VySW1hZ2UgZXh0ZW5kcyBCdW5kbGluZ0RvY2tlckltYWdlIHtcbiAgLyoqXG4gICAqIEJ1aWxkcyBhIERvY2tlciBpbWFnZVxuICAgKlxuICAgKiBAcGFyYW0gcGF0aCBUaGUgcGF0aCB0byB0aGUgZGlyZWN0b3J5IGNvbnRhaW5pbmcgdGhlIERvY2tlciBmaWxlXG4gICAqIEBwYXJhbSBvcHRpb25zIERvY2tlciBidWlsZCBvcHRpb25zXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21CdWlsZChwYXRoOiBzdHJpbmcsIG9wdGlvbnM6IERvY2tlckJ1aWxkT3B0aW9ucyA9IHt9KSB7XG4gICAgY29uc3QgYnVpbGRBcmdzID0gb3B0aW9ucy5idWlsZEFyZ3MgfHwge307XG5cbiAgICBpZiAob3B0aW9ucy5maWxlICYmIGlzQWJzb2x1dGUob3B0aW9ucy5maWxlKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBcImZpbGVcIiBtdXN0IGJlIHJlbGF0aXZlIHRvIHRoZSBkb2NrZXIgYnVpbGQgZGlyZWN0b3J5LiBHb3QgJHtvcHRpb25zLmZpbGV9YCk7XG4gICAgfVxuXG4gICAgLy8gSW1hZ2UgdGFnIGRlcml2ZWQgZnJvbSBwYXRoIGFuZCBidWlsZCBvcHRpb25zXG4gICAgY29uc3QgaW5wdXQgPSBKU09OLnN0cmluZ2lmeSh7IHBhdGgsIC4uLm9wdGlvbnMgfSk7XG4gICAgY29uc3QgdGFnSGFzaCA9IGNyeXB0by5jcmVhdGVIYXNoKCdzaGEyNTYnKS51cGRhdGUoaW5wdXQpLmRpZ2VzdCgnaGV4Jyk7XG4gICAgY29uc3QgdGFnID0gYGNkay0ke3RhZ0hhc2h9YDtcblxuICAgIGNvbnN0IGRvY2tlckFyZ3M6IHN0cmluZ1tdID0gW1xuICAgICAgJ2J1aWxkJywgJy10JywgdGFnLFxuICAgICAgLi4uKG9wdGlvbnMuZmlsZSA/IFsnLWYnLCBqb2luKHBhdGgsIG9wdGlvbnMuZmlsZSldIDogW10pLFxuICAgICAgLi4uKG9wdGlvbnMucGxhdGZvcm0gPyBbJy0tcGxhdGZvcm0nLCBvcHRpb25zLnBsYXRmb3JtXSA6IFtdKSxcbiAgICAgIC4uLihvcHRpb25zLnRhcmdldFN0YWdlID8gWyctLXRhcmdldCcsIG9wdGlvbnMudGFyZ2V0U3RhZ2VdIDogW10pLFxuICAgICAgLi4uZmxhdHRlbihPYmplY3QuZW50cmllcyhidWlsZEFyZ3MpLm1hcCgoW2ssIHZdKSA9PiBbJy0tYnVpbGQtYXJnJywgYCR7a309JHt2fWBdKSksXG4gICAgICBwYXRoLFxuICAgIF07XG5cbiAgICBkb2NrZXJFeGVjKGRvY2tlckFyZ3MpO1xuXG4gICAgLy8gRmluZ2VycHJpbnRzIHRoZSBkaXJlY3RvcnkgY29udGFpbmluZyB0aGUgRG9ja2VyZmlsZSB3ZSdyZSBidWlsZGluZyBhbmRcbiAgICAvLyBkaWZmZXJlbnRpYXRlcyB0aGUgZmluZ2VycHJpbnQgYmFzZWQgb24gYnVpbGQgYXJndW1lbnRzLiBXZSBkbyB0aGlzIHNvXG4gICAgLy8gd2UgY2FuIHByb3ZpZGUgYSBzdGFibGUgaW1hZ2UgaGFzaC4gT3RoZXJ3aXNlLCB0aGUgaW1hZ2UgSUQgd2lsbCBiZVxuICAgIC8vIGRpZmZlcmVudCBldmVyeSB0aW1lIHRoZSBEb2NrZXIgbGF5ZXIgY2FjaGUgaXMgY2xlYXJlZCwgZHVlIHByaW1hcmlseSB0b1xuICAgIC8vIHRpbWVzdGFtcHMuXG4gICAgY29uc3QgaGFzaCA9IEZpbGVTeXN0ZW0uZmluZ2VycHJpbnQocGF0aCwgeyBleHRyYUhhc2g6IEpTT04uc3RyaW5naWZ5KG9wdGlvbnMpIH0pO1xuICAgIHJldHVybiBuZXcgRG9ja2VySW1hZ2UodGFnLCBoYXNoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWZlcmVuY2UgYW4gaW1hZ2Ugb24gRG9ja2VySHViIG9yIGFub3RoZXIgb25saW5lIHJlZ2lzdHJ5LlxuICAgKlxuICAgKiBAcGFyYW0gaW1hZ2UgdGhlIGltYWdlIG5hbWVcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgb3ZlcnJpZGUgZnJvbVJlZ2lzdHJ5KGltYWdlOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gbmV3IERvY2tlckltYWdlKGltYWdlKTtcbiAgfVxuXG4gIC8qKiBUaGUgRG9ja2VyIGltYWdlICovXG4gIHB1YmxpYyByZWFkb25seSBpbWFnZTogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKGltYWdlOiBzdHJpbmcsIF9pbWFnZUhhc2g/OiBzdHJpbmcpIHtcbiAgICAvLyBJdCBpcyBwcmVmZXJyYWJsZSBmb3IgdGhlIGRlcHJlY2F0ZWQgY2xhc3MgdG8gaW5oZXJpdCBhIG5vbi1kZXByZWNhdGVkIGNsYXNzLlxuICAgIC8vIEhvd2V2ZXIsIGluIHRoaXMgY2FzZSwgdGhlIG9wcG9zaXRlIGhhcyBvY2N1cnJlZCB3aGljaCBpcyBpbmNvbXBhdGlibGUgd2l0aFxuICAgIC8vIGEgZGVwcmVjYXRpb24gZmVhdHVyZS4gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9hd3MvanNpaS9pc3N1ZXMvMzEwMi5cbiAgICBjb25zdCBkZXByZWNhdGVkID0gcXVpZXQoKTtcblxuICAgIHN1cGVyKGltYWdlLCBfaW1hZ2VIYXNoKTtcblxuICAgIHJlc2V0KGRlcHJlY2F0ZWQpO1xuICAgIHRoaXMuaW1hZ2UgPSBpbWFnZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQcm92aWRlcyBhIHN0YWJsZSByZXByZXNlbnRhdGlvbiBvZiB0aGlzIGltYWdlIGZvciBKU09OIHNlcmlhbGl6YXRpb24uXG4gICAqXG4gICAqIEByZXR1cm4gVGhlIG92ZXJyaWRkZW4gaW1hZ2UgbmFtZSBpZiBzZXQgb3IgaW1hZ2UgaGFzaCBuYW1lIGluIHRoYXQgb3JkZXJcbiAgICovXG4gIHB1YmxpYyB0b0pTT04oKSB7XG4gICAgLy8gSXQgaXMgcHJlZmVycmFibGUgZm9yIHRoZSBkZXByZWNhdGVkIGNsYXNzIHRvIGluaGVyaXQgYSBub24tZGVwcmVjYXRlZCBjbGFzcy5cbiAgICAvLyBIb3dldmVyLCBpbiB0aGlzIGNhc2UsIHRoZSBvcHBvc2l0ZSBoYXMgb2NjdXJyZWQgd2hpY2ggaXMgaW5jb21wYXRpYmxlIHdpdGhcbiAgICAvLyBhIGRlcHJlY2F0aW9uIGZlYXR1cmUuIFNlZSBodHRwczovL2dpdGh1Yi5jb20vYXdzL2pzaWkvaXNzdWVzLzMxMDIuXG4gICAgY29uc3QgZGVwcmVjYXRlZCA9IHF1aWV0KCk7XG5cbiAgICBjb25zdCBqc29uID0gc3VwZXIudG9KU09OKCk7XG5cbiAgICByZXNldChkZXByZWNhdGVkKTtcbiAgICByZXR1cm4ganNvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBSdW5zIGEgRG9ja2VyIGltYWdlXG4gICAqL1xuICBwdWJsaWMgcnVuKG9wdGlvbnM6IERvY2tlclJ1bk9wdGlvbnMgPSB7fSkge1xuICAgIC8vIEl0IGlzIHByZWZlcnJhYmxlIGZvciB0aGUgZGVwcmVjYXRlZCBjbGFzcyB0byBpbmhlcml0IGEgbm9uLWRlcHJlY2F0ZWQgY2xhc3MuXG4gICAgLy8gSG93ZXZlciwgaW4gdGhpcyBjYXNlLCB0aGUgb3Bwb3NpdGUgaGFzIG9jY3VycmVkIHdoaWNoIGlzIGluY29tcGF0aWJsZSB3aXRoXG4gICAgLy8gYSBkZXByZWNhdGlvbiBmZWF0dXJlLiBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2F3cy9qc2lpL2lzc3Vlcy8zMTAyLlxuICAgIGNvbnN0IGRlcHJlY2F0ZWQgPSBxdWlldCgpO1xuXG4gICAgY29uc3QgcmVzdWx0ID0gc3VwZXIucnVuKG9wdGlvbnMpO1xuXG4gICAgcmVzZXQoZGVwcmVjYXRlZCk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb3BpZXMgYSBmaWxlIG9yIGRpcmVjdG9yeSBvdXQgb2YgdGhlIERvY2tlciBpbWFnZSB0byB0aGUgbG9jYWwgZmlsZXN5c3RlbS5cbiAgICpcbiAgICogSWYgYG91dHB1dFBhdGhgIGlzIG9taXR0ZWQgdGhlIGRlc3RpbmF0aW9uIHBhdGggaXMgYSB0ZW1wb3JhcnkgZGlyZWN0b3J5LlxuICAgKlxuICAgKiBAcGFyYW0gaW1hZ2VQYXRoIHRoZSBwYXRoIGluIHRoZSBEb2NrZXIgaW1hZ2VcbiAgICogQHBhcmFtIG91dHB1dFBhdGggdGhlIGRlc3RpbmF0aW9uIHBhdGggZm9yIHRoZSBjb3B5IG9wZXJhdGlvblxuICAgKiBAcmV0dXJucyB0aGUgZGVzdGluYXRpb24gcGF0aFxuICAgKi9cbiAgcHVibGljIGNwKGltYWdlUGF0aDogc3RyaW5nLCBvdXRwdXRQYXRoPzogc3RyaW5nKTogc3RyaW5nIHtcbiAgICAvLyBJdCBpcyBwcmVmZXJyYWJsZSBmb3IgdGhlIGRlcHJlY2F0ZWQgY2xhc3MgdG8gaW5oZXJpdCBhIG5vbi1kZXByZWNhdGVkIGNsYXNzLlxuICAgIC8vIEhvd2V2ZXIsIGluIHRoaXMgY2FzZSwgdGhlIG9wcG9zaXRlIGhhcyBvY2N1cnJlZCB3aGljaCBpcyBpbmNvbXBhdGlibGUgd2l0aFxuICAgIC8vIGEgZGVwcmVjYXRpb24gZmVhdHVyZS4gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9hd3MvanNpaS9pc3N1ZXMvMzEwMi5cbiAgICBjb25zdCBkZXByZWNhdGVkID0gcXVpZXQoKTtcblxuICAgIGNvbnN0IHJlc3VsdCA9IHN1cGVyLmNwKGltYWdlUGF0aCwgb3V0cHV0UGF0aCk7XG5cbiAgICByZXNldChkZXByZWNhdGVkKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG5cbi8qKlxuICogQSBEb2NrZXIgdm9sdW1lXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgRG9ja2VyVm9sdW1lIHtcbiAgLyoqXG4gICAqIFRoZSBwYXRoIHRvIHRoZSBmaWxlIG9yIGRpcmVjdG9yeSBvbiB0aGUgaG9zdCBtYWNoaW5lXG4gICAqL1xuICByZWFkb25seSBob3N0UGF0aDogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgcGF0aCB3aGVyZSB0aGUgZmlsZSBvciBkaXJlY3RvcnkgaXMgbW91bnRlZCBpbiB0aGUgY29udGFpbmVyXG4gICAqL1xuICByZWFkb25seSBjb250YWluZXJQYXRoOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIE1vdW50IGNvbnNpc3RlbmN5LiBPbmx5IGFwcGxpY2FibGUgZm9yIG1hY09TXG4gICAqXG4gICAqIEBkZWZhdWx0IERvY2tlckNvbnNpc3RlbmN5LkRFTEVHQVRFRFxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5kb2NrZXIuY29tL3N0b3JhZ2UvYmluZC1tb3VudHMvI2NvbmZpZ3VyZS1tb3VudC1jb25zaXN0ZW5jeS1mb3ItbWFjb3NcbiAgICovXG4gIHJlYWRvbmx5IGNvbnNpc3RlbmN5PzogRG9ja2VyVm9sdW1lQ29uc2lzdGVuY3k7XG59XG5cbi8qKlxuICogU3VwcG9ydGVkIERvY2tlciB2b2x1bWUgY29uc2lzdGVuY3kgdHlwZXMuIE9ubHkgdmFsaWQgb24gbWFjT1MgZHVlIHRvIHRoZSB3YXkgZmlsZSBzdG9yYWdlIHdvcmtzIG9uIE1hY1xuICovXG5leHBvcnQgZW51bSBEb2NrZXJWb2x1bWVDb25zaXN0ZW5jeSB7XG4gIC8qKlxuICAgKiBSZWFkL3dyaXRlIG9wZXJhdGlvbnMgaW5zaWRlIHRoZSBEb2NrZXIgY29udGFpbmVyIGFyZSBhcHBsaWVkIGltbWVkaWF0ZWx5IG9uIHRoZSBtb3VudGVkIGhvc3QgbWFjaGluZSB2b2x1bWVzXG4gICAqL1xuICBDT05TSVNURU5UID0gJ2NvbnNpc3RlbnQnLFxuICAvKipcbiAgICogUmVhZC93cml0ZSBvcGVyYXRpb25zIG9uIG1vdW50ZWQgRG9ja2VyIHZvbHVtZXMgYXJlIGZpcnN0IHdyaXR0ZW4gaW5zaWRlIHRoZSBjb250YWluZXIgYW5kIHRoZW4gc3luY2hyb25pemVkIHRvIHRoZSBob3N0IG1hY2hpbmVcbiAgICovXG4gIERFTEVHQVRFRCA9ICdkZWxlZ2F0ZWQnLFxuICAvKipcbiAgICogUmVhZC93cml0ZSBvcGVyYXRpb25zIG9uIG1vdW50ZWQgRG9ja2VyIHZvbHVtZXMgYXJlIGZpcnN0IGFwcGxpZWQgb24gdGhlIGhvc3QgbWFjaGluZSBhbmQgdGhlbiBzeW5jaHJvbml6ZWQgdG8gdGhlIGNvbnRhaW5lclxuICAgKi9cbiAgQ0FDSEVEID0gJ2NhY2hlZCcsXG59XG5cbi8qKlxuICogRG9ja2VyIHJ1biBvcHRpb25zXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgRG9ja2VyUnVuT3B0aW9ucyB7XG4gIC8qKlxuICAgKiBUaGUgZW50cnlwb2ludCB0byBydW4gaW4gdGhlIGNvbnRhaW5lci5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBydW4gdGhlIGVudHJ5cG9pbnQgZGVmaW5lZCBpbiB0aGUgaW1hZ2VcbiAgICovXG4gIHJlYWRvbmx5IGVudHJ5cG9pbnQ/OiBzdHJpbmdbXTtcblxuICAvKipcbiAgICogVGhlIGNvbW1hbmQgdG8gcnVuIGluIHRoZSBjb250YWluZXIuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gcnVuIHRoZSBjb21tYW5kIGRlZmluZWQgaW4gdGhlIGltYWdlXG4gICAqL1xuICByZWFkb25seSBjb21tYW5kPzogc3RyaW5nW107XG5cbiAgLyoqXG4gICAqIERvY2tlciB2b2x1bWVzIHRvIG1vdW50LlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIG5vIHZvbHVtZXMgYXJlIG1vdW50ZWRcbiAgICovXG4gIHJlYWRvbmx5IHZvbHVtZXM/OiBEb2NrZXJWb2x1bWVbXTtcblxuICAvKipcbiAgICogV2hlcmUgdG8gbW91bnQgdGhlIHNwZWNpZmllZCB2b2x1bWVzIGZyb21cbiAgICogQHNlZSBodHRwczovL2RvY3MuZG9ja2VyLmNvbS9lbmdpbmUvcmVmZXJlbmNlL2NvbW1hbmRsaW5lL3J1bi8jbW91bnQtdm9sdW1lcy1mcm9tLWNvbnRhaW5lci0tLXZvbHVtZXMtZnJvbVxuICAgKiBAZGVmYXVsdCAtIG5vIGNvbnRhaW5lcnMgYXJlIHNwZWNpZmllZCB0byBtb3VudCB2b2x1bWVzIGZyb21cbiAgICovXG4gIHJlYWRvbmx5IHZvbHVtZXNGcm9tPzogc3RyaW5nW107XG5cbiAgLyoqXG4gICAqIFRoZSBlbnZpcm9ubWVudCB2YXJpYWJsZXMgdG8gcGFzcyB0byB0aGUgY29udGFpbmVyLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIG5vIGVudmlyb25tZW50IHZhcmlhYmxlcy5cbiAgICovXG4gIHJlYWRvbmx5IGVudmlyb25tZW50PzogeyBba2V5OiBzdHJpbmddOiBzdHJpbmc7IH07XG5cbiAgLyoqXG4gICAqIFdvcmtpbmcgZGlyZWN0b3J5IGluc2lkZSB0aGUgY29udGFpbmVyLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIGltYWdlIGRlZmF1bHRcbiAgICovXG4gIHJlYWRvbmx5IHdvcmtpbmdEaXJlY3Rvcnk/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSB1c2VyIHRvIHVzZSB3aGVuIHJ1bm5pbmcgdGhlIGNvbnRhaW5lci5cbiAgICpcbiAgICogQGRlZmF1bHQgLSByb290IG9yIGltYWdlIGRlZmF1bHRcbiAgICovXG4gIHJlYWRvbmx5IHVzZXI/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFtTZWN1cml0eSBjb25maWd1cmF0aW9uXShodHRwczovL2RvY3MuZG9ja2VyLmNvbS9lbmdpbmUvcmVmZXJlbmNlL3J1bi8jc2VjdXJpdHktY29uZmlndXJhdGlvbilcbiAgICogd2hlbiBydW5uaW5nIHRoZSBkb2NrZXIgY29udGFpbmVyLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIG5vIHNlY3VyaXR5IG9wdGlvbnNcbiAgICovXG4gIHJlYWRvbmx5IHNlY3VyaXR5T3B0Pzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBEb2NrZXIgW05ldHdvcmtpbmcgb3B0aW9uc10oaHR0cHM6Ly9kb2NzLmRvY2tlci5jb20vZW5naW5lL3JlZmVyZW5jZS9jb21tYW5kbGluZS9ydW4vI2Nvbm5lY3QtYS1jb250YWluZXItdG8tYS1uZXR3b3JrLS0tbmV0d29yaylcbiAgICpcbiAgICogQGRlZmF1bHQgLSBubyBuZXR3b3JraW5nIG9wdGlvbnNcbiAgICovXG4gIHJlYWRvbmx5IG5ldHdvcms/OiBzdHJpbmc7XG59XG5cbi8qKlxuICogRG9ja2VyIGJ1aWxkIG9wdGlvbnNcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBEb2NrZXJCdWlsZE9wdGlvbnMge1xuICAvKipcbiAgICogQnVpbGQgYXJnc1xuICAgKlxuICAgKiBAZGVmYXVsdCAtIG5vIGJ1aWxkIGFyZ3NcbiAgICovXG4gIHJlYWRvbmx5IGJ1aWxkQXJncz86IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH07XG5cbiAgLyoqXG4gICAqIE5hbWUgb2YgdGhlIERvY2tlcmZpbGUsIG11c3QgcmVsYXRpdmUgdG8gdGhlIGRvY2tlciBidWlsZCBwYXRoLlxuICAgKlxuICAgKiBAZGVmYXVsdCBgRG9ja2VyZmlsZWBcbiAgICovXG4gIHJlYWRvbmx5IGZpbGU/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFNldCBwbGF0Zm9ybSBpZiBzZXJ2ZXIgaXMgbXVsdGktcGxhdGZvcm0gY2FwYWJsZS4gX1JlcXVpcmVzIERvY2tlciBFbmdpbmUgQVBJIHYxLjM4K18uXG4gICAqXG4gICAqIEV4YW1wbGUgdmFsdWU6IGBsaW51eC9hbWQ2NGBcbiAgICpcbiAgICogQGRlZmF1bHQgLSBubyBwbGF0Zm9ybSBzcGVjaWZpZWRcbiAgICovXG4gIHJlYWRvbmx5IHBsYXRmb3JtPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBTZXQgYnVpbGQgdGFyZ2V0IGZvciBtdWx0aS1zdGFnZSBjb250YWluZXIgYnVpbGRzLiBBbnkgc3RhZ2UgZGVmaW5lZCBhZnRlcndhcmRzIHdpbGwgYmUgaWdub3JlZC5cbiAgICpcbiAgICogRXhhbXBsZSB2YWx1ZTogYGJ1aWxkLWVudmBcbiAgICpcbiAgICogQGRlZmF1bHQgLSBCdWlsZCBhbGwgc3RhZ2VzIGRlZmluZWQgaW4gdGhlIERvY2tlcmZpbGVcbiAgICovXG4gIHJlYWRvbmx5IHRhcmdldFN0YWdlPzogc3RyaW5nO1xufVxuXG5mdW5jdGlvbiBmbGF0dGVuKHg6IHN0cmluZ1tdW10pIHtcbiAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5jb25jYXQoW10sIC4uLngpO1xufVxuXG5mdW5jdGlvbiBpc1NlTGludXgoKSA6IGJvb2xlYW4ge1xuICBpZiAocHJvY2Vzcy5wbGF0Zm9ybSAhPSAnbGludXgnKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGNvbnN0IHByb2cgPSAnc2VsaW51eGVuYWJsZWQnO1xuICBjb25zdCBwcm9jID0gc3Bhd25TeW5jKHByb2csIFtdLCB7XG4gICAgc3RkaW86IFsgLy8gc2hvdyBzZWxpbnV4IHN0YXR1cyBvdXRwdXRcbiAgICAgICdwaXBlJywgLy8gZ2V0IHZhbHVlIG9mIHN0ZGlvXG4gICAgICBwcm9jZXNzLnN0ZGVyciwgLy8gcmVkaXJlY3Qgc3Rkb3V0IHRvIHN0ZGVyclxuICAgICAgJ2luaGVyaXQnLCAvLyBpbmhlcml0IHN0ZGVyclxuICAgIF0sXG4gIH0pO1xuICBpZiAocHJvYy5lcnJvcikge1xuICAgIC8vIHNlbGludXhlbmFibGVkIG5vdCBhIHZhbGlkIGNvbW1hbmQsIHRoZXJlZm9yZSBub3QgZW5hYmxlZFxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBpZiAocHJvYy5zdGF0dXMgPT0gMCkge1xuICAgIC8vIHNlbGludXggZW5hYmxlZFxuICAgIHJldHVybiB0cnVlO1xuICB9IGVsc2Uge1xuICAgIC8vIHNlbGludXggbm90IGVuYWJsZWRcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cbiJdfQ==