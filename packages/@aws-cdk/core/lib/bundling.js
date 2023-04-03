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
}
exports.DockerBuildSecret = DockerBuildSecret;
_a = JSII_RTTI_SYMBOL_1;
DockerBuildSecret[_a] = { fqn: "@aws-cdk/core.DockerBuildSecret", version: "0.0.0" };
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
        asset_staging_1.dockerExec(dockerArgs);
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
        const { stdout } = asset_staging_1.dockerExec(['create', this.image], {}); // Empty options to avoid stdout redirect here
        const match = stdout.toString().match(/([0-9a-f]{16,})/);
        if (!match) {
            throw new Error('Failed to extract container ID from Docker create output');
        }
        const containerId = match[1];
        const containerPath = `${containerId}:${imagePath}`;
        const destPath = outputPath ?? fs_1.FileSystem.mkdtemp('cdk-docker-cp-');
        try {
            asset_staging_1.dockerExec(['cp', containerPath, destPath]);
            return destPath;
        }
        catch (err) {
            throw new Error(`Failed to copy files from ${containerPath} to ${destPath}: ${err}`);
        }
        finally {
            asset_staging_1.dockerExec(['rm', '-v', containerId]);
        }
    }
}
exports.BundlingDockerImage = BundlingDockerImage;
_b = JSII_RTTI_SYMBOL_1;
BundlingDockerImage[_b] = { fqn: "@aws-cdk/core.BundlingDockerImage", version: "0.0.0" };
/**
 * A Docker image
 */
class DockerImage extends BundlingDockerImage {
    constructor(image, _imageHash) {
        // It is preferrable for the deprecated class to inherit a non-deprecated class.
        // However, in this case, the opposite has occurred which is incompatible with
        // a deprecation feature. See https://github.com/aws/jsii/issues/3102.
        const deprecated = jsii_deprecated_1.quiet();
        super(image, _imageHash);
        jsii_deprecated_1.reset(deprecated);
        this.image = image;
    }
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
        if (options.file && path_1.isAbsolute(options.file)) {
            throw new Error(`"file" must be relative to the docker build directory. Got ${options.file}`);
        }
        // Image tag derived from path and build options
        const input = JSON.stringify({ path, ...options });
        const tagHash = crypto.createHash('sha256').update(input).digest('hex');
        const tag = `cdk-${tagHash}`;
        const dockerArgs = [
            'build', '-t', tag,
            ...(options.file ? ['-f', path_1.join(path, options.file)] : []),
            ...(options.platform ? ['--platform', options.platform] : []),
            ...(options.targetStage ? ['--target', options.targetStage] : []),
            ...flatten(Object.entries(buildArgs).map(([k, v]) => ['--build-arg', `${k}=${v}`])),
            path,
        ];
        asset_staging_1.dockerExec(dockerArgs);
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
    /**
     * Provides a stable representation of this image for JSON serialization.
     *
     * @return The overridden image name if set or image hash name in that order
     */
    toJSON() {
        // It is preferrable for the deprecated class to inherit a non-deprecated class.
        // However, in this case, the opposite has occurred which is incompatible with
        // a deprecation feature. See https://github.com/aws/jsii/issues/3102.
        const deprecated = jsii_deprecated_1.quiet();
        const json = super.toJSON();
        jsii_deprecated_1.reset(deprecated);
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
        const deprecated = jsii_deprecated_1.quiet();
        const result = super.run(options);
        jsii_deprecated_1.reset(deprecated);
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
        const deprecated = jsii_deprecated_1.quiet();
        const result = super.cp(imagePath, outputPath);
        jsii_deprecated_1.reset(deprecated);
        return result;
    }
}
exports.DockerImage = DockerImage;
_c = JSII_RTTI_SYMBOL_1;
DockerImage[_c] = { fqn: "@aws-cdk/core.DockerImage", version: "0.0.0" };
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
    const proc = child_process_1.spawnSync(prog, [], {
        stdio: [
            'pipe',
            process.stderr,
            'inherit',
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxpbmcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJidW5kbGluZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxpREFBMEM7QUFDMUMsaUNBQWlDO0FBQ2pDLCtCQUF3QztBQUN4Qyw2QkFBa0M7QUFDbEMsMkRBQXFEO0FBQ3JELCtEQUF5RDtBQUV6RDs7Ozs7O0dBTUc7QUFDSCxNQUFhLGlCQUFpQjtJQUM1Qjs7OztPQUlHO0lBQ0ksTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFXO1FBQy9CLE9BQU8sT0FBTyxHQUFHLEVBQUUsQ0FBQztLQUNyQjs7QUFSSCw4Q0FTQzs7O0FBa0hEOzs7R0FHRztBQUNILElBQVksY0FtQlg7QUFuQkQsV0FBWSxjQUFjO0lBQ3hCOzs7O09BSUc7SUFDSCx1Q0FBcUIsQ0FBQTtJQUVyQjs7O09BR0c7SUFDSCwrQ0FBNkIsQ0FBQTtJQUU3Qjs7O09BR0c7SUFDSCxpREFBK0IsQ0FBQTtBQUNqQyxDQUFDLEVBbkJXLGNBQWMsR0FBZCxzQkFBYyxLQUFkLHNCQUFjLFFBbUJ6QjtBQWtCRDs7R0FFRztBQUNILElBQVksa0JBWVg7QUFaRCxXQUFZLGtCQUFrQjtJQUM1Qjs7O09BR0c7SUFDSCxpREFBMkIsQ0FBQTtJQUUzQjs7O09BR0c7SUFDSCwrQ0FBeUIsQ0FBQTtBQUMzQixDQUFDLEVBWlcsa0JBQWtCLEdBQWxCLDBCQUFrQixLQUFsQiwwQkFBa0IsUUFZN0I7QUFFRDs7OztHQUlHO0FBQ0gsTUFBYSxtQkFBbUI7SUFzQjlCLG9DQUFvQztJQUNwQyxZQUFzQyxLQUFhLEVBQW1CLFVBQW1CO1FBQW5ELFVBQUssR0FBTCxLQUFLLENBQVE7UUFBbUIsZUFBVSxHQUFWLFVBQVUsQ0FBUzs7Ozs7OytDQXZCOUUsbUJBQW1COzs7O0tBdUIrRDtJQXRCN0Y7Ozs7T0FJRztJQUNJLE1BQU0sQ0FBQyxZQUFZLENBQUMsS0FBYTs7Ozs7Ozs7OztRQUN0QyxPQUFPLElBQUksV0FBVyxDQUFDLEtBQUssQ0FB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QU8sS0FBSyxDQUFDO0tBQ2Q7SUFDRCxNQUFNLElBQUksR0FBRyxnQkFBZ0IsQ0FBQztJQUM5QixNQUFNLElBQUksR0FBRyx5QkFBUyxDQUFDLElBQUksRUFBRSxFQUFFLEVBQUU7UUFDL0IsS0FBSyxFQUFFO1lBQ0wsTUFBTTtZQUNOLE9BQU8sQ0FBQyxNQUFNO1lBQ2QsU0FBUztTQUNWO0tBQ0YsQ0FBQyxDQUFDO0lBQ0gsSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFO1FBQ2QsNERBQTREO1FBQzVELE9BQU8sS0FBSyxDQUFDO0tBQ2Q7SUFDRCxJQUFJLElBQUksQ0FBQyxNQUFNLElBQUksQ0FBQyxFQUFFO1FBQ3BCLGtCQUFrQjtRQUNsQixPQUFPLElBQUksQ0FBQztLQUNiO1NBQU07UUFDTCxzQkFBc0I7UUFDdEIsT0FBTyxLQUFLLENBQUM7S0FDZDtBQUNILENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBzcGF3blN5bmMgfSBmcm9tICdjaGlsZF9wcm9jZXNzJztcbmltcG9ydCAqIGFzIGNyeXB0byBmcm9tICdjcnlwdG8nO1xuaW1wb3J0IHsgaXNBYnNvbHV0ZSwgam9pbiB9IGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgRmlsZVN5c3RlbSB9IGZyb20gJy4vZnMnO1xuaW1wb3J0IHsgZG9ja2VyRXhlYyB9IGZyb20gJy4vcHJpdmF0ZS9hc3NldC1zdGFnaW5nJztcbmltcG9ydCB7IHF1aWV0LCByZXNldCB9IGZyb20gJy4vcHJpdmF0ZS9qc2lpLWRlcHJlY2F0ZWQnO1xuXG4vKipcbiAqIE1ldGhvZHMgdG8gYnVpbGQgRG9ja2VyIENMSSBhcmd1bWVudHMgZm9yIGJ1aWxkcyB1c2luZyBzZWNyZXRzLlxuICpcbiAqIERvY2tlciBCdWlsZEtpdCBtdXN0IGJlIGVuYWJsZWQgdG8gdXNlIGJ1aWxkIHNlY3JldHMuXG4gKlxuICogQHNlZSBodHRwczovL2RvY3MuZG9ja2VyLmNvbS9idWlsZC9idWlsZGtpdC9cbiAqL1xuZXhwb3J0IGNsYXNzIERvY2tlckJ1aWxkU2VjcmV0IHtcbiAgLyoqXG4gICAqIEEgRG9ja2VyIGJ1aWxkIHNlY3JldCBmcm9tIGEgZmlsZSBzb3VyY2VcbiAgICogQHBhcmFtIHNyYyBUaGUgcGF0aCB0byB0aGUgc291cmNlIGZpbGUsIHJlbGF0aXZlIHRvIHRoZSBidWlsZCBkaXJlY3RvcnkuXG4gICAqIEByZXR1cm5zIFRoZSBsYXR0ZXIgaGFsZiByZXF1aXJlZCBmb3IgYC0tc2VjcmV0YFxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tU3JjKHNyYzogc3RyaW5nKTogc3RyaW5nIHtcbiAgICByZXR1cm4gYHNyYz0ke3NyY31gO1xuICB9XG59XG5cbi8qKlxuICogQnVuZGxpbmcgb3B0aW9uc1xuICpcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBCdW5kbGluZ09wdGlvbnMge1xuICAvKipcbiAgICogVGhlIERvY2tlciBpbWFnZSB3aGVyZSB0aGUgY29tbWFuZCB3aWxsIHJ1bi5cbiAgICovXG4gIHJlYWRvbmx5IGltYWdlOiBEb2NrZXJJbWFnZTtcblxuICAvKipcbiAgICogVGhlIGVudHJ5cG9pbnQgdG8gcnVuIGluIHRoZSBEb2NrZXIgY29udGFpbmVyLlxuICAgKlxuICAgKiBFeGFtcGxlIHZhbHVlOiBgWycvYmluL3NoJywgJy1jJ11gXG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmRvY2tlci5jb20vZW5naW5lL3JlZmVyZW5jZS9idWlsZGVyLyNlbnRyeXBvaW50XG4gICAqXG4gICAqIEBkZWZhdWx0IC0gcnVuIHRoZSBlbnRyeXBvaW50IGRlZmluZWQgaW4gdGhlIGltYWdlXG4gICAqL1xuICByZWFkb25seSBlbnRyeXBvaW50Pzogc3RyaW5nW107XG5cbiAgLyoqXG4gICAqIFRoZSBjb21tYW5kIHRvIHJ1biBpbiB0aGUgRG9ja2VyIGNvbnRhaW5lci5cbiAgICpcbiAgICogRXhhbXBsZSB2YWx1ZTogYFsnbnBtJywgJ2luc3RhbGwnXWBcbiAgICpcbiAgICogQHNlZSBodHRwczovL2RvY3MuZG9ja2VyLmNvbS9lbmdpbmUvcmVmZXJlbmNlL3J1bi9cbiAgICpcbiAgICogQGRlZmF1bHQgLSBydW4gdGhlIGNvbW1hbmQgZGVmaW5lZCBpbiB0aGUgaW1hZ2VcbiAgICovXG4gIHJlYWRvbmx5IGNvbW1hbmQ/OiBzdHJpbmdbXTtcblxuICAvKipcbiAgICogQWRkaXRpb25hbCBEb2NrZXIgdm9sdW1lcyB0byBtb3VudC5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBubyBhZGRpdGlvbmFsIHZvbHVtZXMgYXJlIG1vdW50ZWRcbiAgICovXG4gIHJlYWRvbmx5IHZvbHVtZXM/OiBEb2NrZXJWb2x1bWVbXTtcblxuICAvKipcbiAgICogV2hlcmUgdG8gbW91bnQgdGhlIHNwZWNpZmllZCB2b2x1bWVzIGZyb21cbiAgICogQHNlZSBodHRwczovL2RvY3MuZG9ja2VyLmNvbS9lbmdpbmUvcmVmZXJlbmNlL2NvbW1hbmRsaW5lL3J1bi8jbW91bnQtdm9sdW1lcy1mcm9tLWNvbnRhaW5lci0tLXZvbHVtZXMtZnJvbVxuICAgKiBAZGVmYXVsdCAtIG5vIGNvbnRhaW5lcnMgYXJlIHNwZWNpZmllZCB0byBtb3VudCB2b2x1bWVzIGZyb21cbiAgICovXG4gIHJlYWRvbmx5IHZvbHVtZXNGcm9tPzogc3RyaW5nW107XG5cbiAgLyoqXG4gICAqIFRoZSBlbnZpcm9ubWVudCB2YXJpYWJsZXMgdG8gcGFzcyB0byB0aGUgRG9ja2VyIGNvbnRhaW5lci5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBubyBlbnZpcm9ubWVudCB2YXJpYWJsZXMuXG4gICAqL1xuICByZWFkb25seSBlbnZpcm9ubWVudD86IHsgW2tleTogc3RyaW5nXTogc3RyaW5nOyB9O1xuXG4gIC8qKlxuICAgKiBXb3JraW5nIGRpcmVjdG9yeSBpbnNpZGUgdGhlIERvY2tlciBjb250YWluZXIuXG4gICAqXG4gICAqIEBkZWZhdWx0IC9hc3NldC1pbnB1dFxuICAgKi9cbiAgcmVhZG9ubHkgd29ya2luZ0RpcmVjdG9yeT86IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIHVzZXIgdG8gdXNlIHdoZW4gcnVubmluZyB0aGUgRG9ja2VyIGNvbnRhaW5lci5cbiAgICpcbiAgICogICB1c2VyIHwgdXNlcjpncm91cCB8IHVpZCB8IHVpZDpnaWQgfCB1c2VyOmdpZCB8IHVpZDpncm91cFxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5kb2NrZXIuY29tL2VuZ2luZS9yZWZlcmVuY2UvcnVuLyN1c2VyXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gdWlkOmdpZCBvZiB0aGUgY3VycmVudCB1c2VyIG9yIDEwMDA6MTAwMCBvbiBXaW5kb3dzXG4gICAqL1xuICByZWFkb25seSB1c2VyPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBMb2NhbCBidW5kbGluZyBwcm92aWRlci5cbiAgICpcbiAgICogVGhlIHByb3ZpZGVyIGltcGxlbWVudHMgYSBtZXRob2QgYHRyeUJ1bmRsZSgpYCB3aGljaCBzaG91bGQgcmV0dXJuIGB0cnVlYFxuICAgKiBpZiBsb2NhbCBidW5kbGluZyB3YXMgcGVyZm9ybWVkLiBJZiBgZmFsc2VgIGlzIHJldHVybmVkLCBkb2NrZXIgYnVuZGxpbmdcbiAgICogd2lsbCBiZSBkb25lLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIGJ1bmRsaW5nIHdpbGwgb25seSBiZSBwZXJmb3JtZWQgaW4gYSBEb2NrZXIgY29udGFpbmVyXG4gICAqXG4gICAqL1xuICByZWFkb25seSBsb2NhbD86IElMb2NhbEJ1bmRsaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgdHlwZSBvZiBvdXRwdXQgdGhhdCB0aGlzIGJ1bmRsaW5nIG9wZXJhdGlvbiBpcyBwcm9kdWNpbmcuXG4gICAqXG4gICAqIEBkZWZhdWx0IEJ1bmRsaW5nT3V0cHV0LkFVVE9fRElTQ09WRVJcbiAgICpcbiAgICovXG4gIHJlYWRvbmx5IG91dHB1dFR5cGU/OiBCdW5kbGluZ091dHB1dDtcblxuICAvKipcbiAgICogW1NlY3VyaXR5IGNvbmZpZ3VyYXRpb25dKGh0dHBzOi8vZG9jcy5kb2NrZXIuY29tL2VuZ2luZS9yZWZlcmVuY2UvcnVuLyNzZWN1cml0eS1jb25maWd1cmF0aW9uKVxuICAgKiB3aGVuIHJ1bm5pbmcgdGhlIGRvY2tlciBjb250YWluZXIuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gbm8gc2VjdXJpdHkgb3B0aW9uc1xuICAgKi9cbiAgcmVhZG9ubHkgc2VjdXJpdHlPcHQ/OiBzdHJpbmc7XG4gIC8qKlxuICAgKiBEb2NrZXIgW05ldHdvcmtpbmcgb3B0aW9uc10oaHR0cHM6Ly9kb2NzLmRvY2tlci5jb20vZW5naW5lL3JlZmVyZW5jZS9jb21tYW5kbGluZS9ydW4vI2Nvbm5lY3QtYS1jb250YWluZXItdG8tYS1uZXR3b3JrLS0tbmV0d29yaylcbiAgICpcbiAgICogQGRlZmF1bHQgLSBubyBuZXR3b3JraW5nIG9wdGlvbnNcbiAgICovXG4gIHJlYWRvbmx5IG5ldHdvcms/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBhY2Nlc3MgbWVjaGFuaXNtIHVzZWQgdG8gbWFrZSBzb3VyY2UgZmlsZXMgYXZhaWxhYmxlIHRvIHRoZSBidW5kbGluZyBjb250YWluZXIgYW5kIHRvIHJldHVybiB0aGUgYnVuZGxpbmcgb3V0cHV0IGJhY2sgdG8gdGhlIGhvc3QuXG4gICAqIEBkZWZhdWx0IC0gQnVuZGxpbmdGaWxlQWNjZXNzLkJJTkRfTU9VTlRcbiAgICovXG4gIHJlYWRvbmx5IGJ1bmRsaW5nRmlsZUFjY2Vzcz86IEJ1bmRsaW5nRmlsZUFjY2Vzcztcbn1cblxuLyoqXG4gKiBUaGUgdHlwZSBvZiBvdXRwdXQgdGhhdCBhIGJ1bmRsaW5nIG9wZXJhdGlvbiBpcyBwcm9kdWNpbmcuXG4gKlxuICovXG5leHBvcnQgZW51bSBCdW5kbGluZ091dHB1dCB7XG4gIC8qKlxuICAgKiBUaGUgYnVuZGxpbmcgb3V0cHV0IGRpcmVjdG9yeSBpbmNsdWRlcyBhIHNpbmdsZSAuemlwIG9yIC5qYXIgZmlsZSB3aGljaFxuICAgKiB3aWxsIGJlIHVzZWQgYXMgdGhlIGZpbmFsIGJ1bmRsZS4gSWYgdGhlIG91dHB1dCBkaXJlY3RvcnkgZG9lcyBub3RcbiAgICogaW5jbHVkZSBleGFjdGx5IGEgc2luZ2xlIGFyY2hpdmUsIGJ1bmRsaW5nIHdpbGwgZmFpbC5cbiAgICovXG4gIEFSQ0hJVkVEID0gJ2FyY2hpdmVkJyxcblxuICAvKipcbiAgICogVGhlIGJ1bmRsaW5nIG91dHB1dCBkaXJlY3RvcnkgY29udGFpbnMgb25lIG9yIG1vcmUgZmlsZXMgd2hpY2ggd2lsbCBiZVxuICAgKiBhcmNoaXZlZCBhbmQgdXBsb2FkZWQgYXMgYSAuemlwIGZpbGUgdG8gUzMuXG4gICAqL1xuICBOT1RfQVJDSElWRUQgPSAnbm90LWFyY2hpdmVkJyxcblxuICAvKipcbiAgICogSWYgdGhlIGJ1bmRsaW5nIG91dHB1dCBkaXJlY3RvcnkgY29udGFpbnMgYSBzaW5nbGUgYXJjaGl2ZSBmaWxlICh6aXAgb3IgamFyKVxuICAgKiBpdCB3aWxsIGJlIHVzZWQgYXMgdGhlIGJ1bmRsZSBvdXRwdXQgYXMtaXMuIE90aGVyd2lzZSBhbGwgdGhlIGZpbGVzIGluIHRoZSBidW5kbGluZyBvdXRwdXQgZGlyZWN0b3J5IHdpbGwgYmUgemlwcGVkLlxuICAgKi9cbiAgQVVUT19ESVNDT1ZFUiA9ICdhdXRvLWRpc2NvdmVyJyxcbn1cblxuLyoqXG4gKiBMb2NhbCBidW5kbGluZ1xuICpcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBJTG9jYWxCdW5kbGluZyB7XG4gIC8qKlxuICAgKiBUaGlzIG1ldGhvZCBpcyBjYWxsZWQgYmVmb3JlIGF0dGVtcHRpbmcgZG9ja2VyIGJ1bmRsaW5nIHRvIGFsbG93IHRoZVxuICAgKiBidW5kbGVyIHRvIGJlIGV4ZWN1dGVkIGxvY2FsbHkuIElmIHRoZSBsb2NhbCBidW5kbGVyIGV4aXN0cywgYW5kIGJ1bmRsaW5nXG4gICAqIHdhcyBwZXJmb3JtZWQgbG9jYWxseSwgcmV0dXJuIGB0cnVlYC4gT3RoZXJ3aXNlLCByZXR1cm4gYGZhbHNlYC5cbiAgICpcbiAgICogQHBhcmFtIG91dHB1dERpciB0aGUgZGlyZWN0b3J5IHdoZXJlIHRoZSBidW5kbGVkIGFzc2V0IHNob3VsZCBiZSBvdXRwdXRcbiAgICogQHBhcmFtIG9wdGlvbnMgYnVuZGxpbmcgb3B0aW9ucyBmb3IgdGhpcyBhc3NldFxuICAgKi9cbiAgdHJ5QnVuZGxlKG91dHB1dERpcjogc3RyaW5nLCBvcHRpb25zOiBCdW5kbGluZ09wdGlvbnMpOiBib29sZWFuO1xufVxuXG4vKipcbiAqIFRoZSBhY2Nlc3MgbWVjaGFuaXNtIHVzZWQgdG8gbWFrZSBzb3VyY2UgZmlsZXMgYXZhaWxhYmxlIHRvIHRoZSBidW5kbGluZyBjb250YWluZXIgYW5kIHRvIHJldHVybiB0aGUgYnVuZGxpbmcgb3V0cHV0IGJhY2sgdG8gdGhlIGhvc3RcbiAqL1xuZXhwb3J0IGVudW0gQnVuZGxpbmdGaWxlQWNjZXNzIHtcbiAgLyoqXG4gICAqIENyZWF0ZXMgdGVtcG9yYXJ5IHZvbHVtZXMgYW5kIGNvbnRhaW5lcnMgdG8gY29weSBmaWxlcyBmcm9tIHRoZSBob3N0IHRvIHRoZSBidW5kbGluZyBjb250YWluZXIgYW5kIGJhY2suXG4gICAqIFRoaXMgaXMgc2xvd2VyLCBidXQgd29ya3MgYWxzbyBpbiBtb3JlIGNvbXBsZXggc2l0dWF0aW9ucyB3aXRoIHJlbW90ZSBvciBzaGFyZWQgZG9ja2VyIHNvY2tldHMuXG4gICAqL1xuICBWT0xVTUVfQ09QWSA9ICdWT0xVTUVfQ09QWScsXG5cbiAgLyoqXG4gICAqIFRoZSBzb3VyY2UgYW5kIG91dHB1dCBmb2xkZXJzIHdpbGwgYmUgbW91bnRlZCBhcyBiaW5kIG1vdW50IGZyb20gdGhlIGhvc3Qgc3lzdGVtXG4gICAqIFRoaXMgaXMgZmFzdGVyIGFuZCBzaW1wbGVyLCBidXQgbGVzcyBwb3J0YWJsZSB0aGFuIGBWT0xVTUVfQ09QWWAuXG4gICAqL1xuICBCSU5EX01PVU5UID0gJ0JJTkRfTU9VTlQnLFxufVxuXG4vKipcbiAqIEEgRG9ja2VyIGltYWdlIHVzZWQgZm9yIGFzc2V0IGJ1bmRsaW5nXG4gKlxuICogQGRlcHJlY2F0ZWQgdXNlIERvY2tlckltYWdlXG4gKi9cbmV4cG9ydCBjbGFzcyBCdW5kbGluZ0RvY2tlckltYWdlIHtcbiAgLyoqXG4gICAqIFJlZmVyZW5jZSBhbiBpbWFnZSBvbiBEb2NrZXJIdWIgb3IgYW5vdGhlciBvbmxpbmUgcmVnaXN0cnkuXG4gICAqXG4gICAqIEBwYXJhbSBpbWFnZSB0aGUgaW1hZ2UgbmFtZVxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tUmVnaXN0cnkoaW1hZ2U6IHN0cmluZykge1xuICAgIHJldHVybiBuZXcgRG9ja2VySW1hZ2UoaW1hZ2UpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZmVyZW5jZSBhbiBpbWFnZSB0aGF0J3MgYnVpbHQgZGlyZWN0bHkgZnJvbSBzb3VyY2VzIG9uIGRpc2suXG4gICAqXG4gICAqIEBwYXJhbSBwYXRoIFRoZSBwYXRoIHRvIHRoZSBkaXJlY3RvcnkgY29udGFpbmluZyB0aGUgRG9ja2VyIGZpbGVcbiAgICogQHBhcmFtIG9wdGlvbnMgRG9ja2VyIGJ1aWxkIG9wdGlvbnNcbiAgICpcbiAgICogQGRlcHJlY2F0ZWQgdXNlIERvY2tlckltYWdlLmZyb21CdWlsZCgpXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21Bc3NldChwYXRoOiBzdHJpbmcsIG9wdGlvbnM6IERvY2tlckJ1aWxkT3B0aW9ucyA9IHt9KTogQnVuZGxpbmdEb2NrZXJJbWFnZSB7XG4gICAgcmV0dXJuIERvY2tlckltYWdlLmZyb21CdWlsZChwYXRoLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKiBAcGFyYW0gaW1hZ2UgVGhlIERvY2tlciBpbWFnZSAqL1xuICBwcm90ZWN0ZWQgY29uc3RydWN0b3IocHVibGljIHJlYWRvbmx5IGltYWdlOiBzdHJpbmcsIHByaXZhdGUgcmVhZG9ubHkgX2ltYWdlSGFzaD86IHN0cmluZykge31cblxuICAvKipcbiAgICogUHJvdmlkZXMgYSBzdGFibGUgcmVwcmVzZW50YXRpb24gb2YgdGhpcyBpbWFnZSBmb3IgSlNPTiBzZXJpYWxpemF0aW9uLlxuICAgKlxuICAgKiBAcmV0dXJuIFRoZSBvdmVycmlkZGVuIGltYWdlIG5hbWUgaWYgc2V0IG9yIGltYWdlIGhhc2ggbmFtZSBpbiB0aGF0IG9yZGVyXG4gICAqL1xuICBwdWJsaWMgdG9KU09OKCkge1xuICAgIHJldHVybiB0aGlzLl9pbWFnZUhhc2ggPz8gdGhpcy5pbWFnZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSdW5zIGEgRG9ja2VyIGltYWdlXG4gICAqL1xuICBwdWJsaWMgcnVuKG9wdGlvbnM6IERvY2tlclJ1bk9wdGlvbnMgPSB7fSkge1xuICAgIGNvbnN0IHZvbHVtZXMgPSBvcHRpb25zLnZvbHVtZXMgfHwgW107XG4gICAgY29uc3QgZW52aXJvbm1lbnQgPSBvcHRpb25zLmVudmlyb25tZW50IHx8IHt9O1xuICAgIGNvbnN0IGVudHJ5cG9pbnQgPSBvcHRpb25zLmVudHJ5cG9pbnQ/LlswXSB8fCBudWxsO1xuICAgIGNvbnN0IGNvbW1hbmQgPSBbXG4gICAgICAuLi5vcHRpb25zLmVudHJ5cG9pbnQ/LlsxXVxuICAgICAgICA/IFsuLi5vcHRpb25zLmVudHJ5cG9pbnQuc2xpY2UoMSldXG4gICAgICAgIDogW10sXG4gICAgICAuLi5vcHRpb25zLmNvbW1hbmRcbiAgICAgICAgPyBbLi4ub3B0aW9ucy5jb21tYW5kXVxuICAgICAgICA6IFtdLFxuICAgIF07XG5cbiAgICBjb25zdCBkb2NrZXJBcmdzOiBzdHJpbmdbXSA9IFtcbiAgICAgICdydW4nLCAnLS1ybScsXG4gICAgICAuLi5vcHRpb25zLnNlY3VyaXR5T3B0XG4gICAgICAgID8gWyctLXNlY3VyaXR5LW9wdCcsIG9wdGlvbnMuc2VjdXJpdHlPcHRdXG4gICAgICAgIDogW10sXG4gICAgICAuLi5vcHRpb25zLm5ldHdvcmtcbiAgICAgICAgPyBbJy0tbmV0d29yaycsIG9wdGlvbnMubmV0d29ya11cbiAgICAgICAgOiBbXSxcbiAgICAgIC4uLm9wdGlvbnMudXNlclxuICAgICAgICA/IFsnLXUnLCBvcHRpb25zLnVzZXJdXG4gICAgICAgIDogW10sXG4gICAgICAuLi5vcHRpb25zLnZvbHVtZXNGcm9tXG4gICAgICAgID8gZmxhdHRlbihvcHRpb25zLnZvbHVtZXNGcm9tLm1hcCh2ID0+IFsnLS12b2x1bWVzLWZyb20nLCB2XSkpXG4gICAgICAgIDogW10sXG4gICAgICAuLi5mbGF0dGVuKHZvbHVtZXMubWFwKHYgPT4gWyctdicsIGAke3YuaG9zdFBhdGh9OiR7di5jb250YWluZXJQYXRofToke2lzU2VMaW51eCgpID8gJ3osJyA6ICcnfSR7di5jb25zaXN0ZW5jeSA/PyBEb2NrZXJWb2x1bWVDb25zaXN0ZW5jeS5ERUxFR0FURUR9YF0pKSxcbiAgICAgIC4uLmZsYXR0ZW4oT2JqZWN0LmVudHJpZXMoZW52aXJvbm1lbnQpLm1hcCgoW2ssIHZdKSA9PiBbJy0tZW52JywgYCR7a309JHt2fWBdKSksXG4gICAgICAuLi5vcHRpb25zLndvcmtpbmdEaXJlY3RvcnlcbiAgICAgICAgPyBbJy13Jywgb3B0aW9ucy53b3JraW5nRGlyZWN0b3J5XVxuICAgICAgICA6IFtdLFxuICAgICAgLi4uZW50cnlwb2ludFxuICAgICAgICA/IFsnLS1lbnRyeXBvaW50JywgZW50cnlwb2ludF1cbiAgICAgICAgOiBbXSxcbiAgICAgIHRoaXMuaW1hZ2UsXG4gICAgICAuLi5jb21tYW5kLFxuICAgIF07XG5cbiAgICBkb2NrZXJFeGVjKGRvY2tlckFyZ3MpO1xuICB9XG5cbiAgLyoqXG4gICAqIENvcGllcyBhIGZpbGUgb3IgZGlyZWN0b3J5IG91dCBvZiB0aGUgRG9ja2VyIGltYWdlIHRvIHRoZSBsb2NhbCBmaWxlc3lzdGVtLlxuICAgKlxuICAgKiBJZiBgb3V0cHV0UGF0aGAgaXMgb21pdHRlZCB0aGUgZGVzdGluYXRpb24gcGF0aCBpcyBhIHRlbXBvcmFyeSBkaXJlY3RvcnkuXG4gICAqXG4gICAqIEBwYXJhbSBpbWFnZVBhdGggdGhlIHBhdGggaW4gdGhlIERvY2tlciBpbWFnZVxuICAgKiBAcGFyYW0gb3V0cHV0UGF0aCB0aGUgZGVzdGluYXRpb24gcGF0aCBmb3IgdGhlIGNvcHkgb3BlcmF0aW9uXG4gICAqIEByZXR1cm5zIHRoZSBkZXN0aW5hdGlvbiBwYXRoXG4gICAqL1xuICBwdWJsaWMgY3AoaW1hZ2VQYXRoOiBzdHJpbmcsIG91dHB1dFBhdGg/OiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIGNvbnN0IHsgc3Rkb3V0IH0gPSBkb2NrZXJFeGVjKFsnY3JlYXRlJywgdGhpcy5pbWFnZV0sIHt9KTsgLy8gRW1wdHkgb3B0aW9ucyB0byBhdm9pZCBzdGRvdXQgcmVkaXJlY3QgaGVyZVxuICAgIGNvbnN0IG1hdGNoID0gc3Rkb3V0LnRvU3RyaW5nKCkubWF0Y2goLyhbMC05YS1mXXsxNix9KS8pO1xuICAgIGlmICghbWF0Y2gpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignRmFpbGVkIHRvIGV4dHJhY3QgY29udGFpbmVyIElEIGZyb20gRG9ja2VyIGNyZWF0ZSBvdXRwdXQnKTtcbiAgICB9XG5cbiAgICBjb25zdCBjb250YWluZXJJZCA9IG1hdGNoWzFdO1xuICAgIGNvbnN0IGNvbnRhaW5lclBhdGggPSBgJHtjb250YWluZXJJZH06JHtpbWFnZVBhdGh9YDtcbiAgICBjb25zdCBkZXN0UGF0aCA9IG91dHB1dFBhdGggPz8gRmlsZVN5c3RlbS5ta2R0ZW1wKCdjZGstZG9ja2VyLWNwLScpO1xuICAgIHRyeSB7XG4gICAgICBkb2NrZXJFeGVjKFsnY3AnLCBjb250YWluZXJQYXRoLCBkZXN0UGF0aF0pO1xuICAgICAgcmV0dXJuIGRlc3RQYXRoO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBGYWlsZWQgdG8gY29weSBmaWxlcyBmcm9tICR7Y29udGFpbmVyUGF0aH0gdG8gJHtkZXN0UGF0aH06ICR7ZXJyfWApO1xuICAgIH0gZmluYWxseSB7XG4gICAgICBkb2NrZXJFeGVjKFsncm0nLCAnLXYnLCBjb250YWluZXJJZF0pO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIEEgRG9ja2VyIGltYWdlXG4gKi9cbmV4cG9ydCBjbGFzcyBEb2NrZXJJbWFnZSBleHRlbmRzIEJ1bmRsaW5nRG9ja2VySW1hZ2Uge1xuICAvKipcbiAgICogQnVpbGRzIGEgRG9ja2VyIGltYWdlXG4gICAqXG4gICAqIEBwYXJhbSBwYXRoIFRoZSBwYXRoIHRvIHRoZSBkaXJlY3RvcnkgY29udGFpbmluZyB0aGUgRG9ja2VyIGZpbGVcbiAgICogQHBhcmFtIG9wdGlvbnMgRG9ja2VyIGJ1aWxkIG9wdGlvbnNcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZnJvbUJ1aWxkKHBhdGg6IHN0cmluZywgb3B0aW9uczogRG9ja2VyQnVpbGRPcHRpb25zID0ge30pIHtcbiAgICBjb25zdCBidWlsZEFyZ3MgPSBvcHRpb25zLmJ1aWxkQXJncyB8fCB7fTtcblxuICAgIGlmIChvcHRpb25zLmZpbGUgJiYgaXNBYnNvbHV0ZShvcHRpb25zLmZpbGUpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFwiZmlsZVwiIG11c3QgYmUgcmVsYXRpdmUgdG8gdGhlIGRvY2tlciBidWlsZCBkaXJlY3RvcnkuIEdvdCAke29wdGlvbnMuZmlsZX1gKTtcbiAgICB9XG5cbiAgICAvLyBJbWFnZSB0YWcgZGVyaXZlZCBmcm9tIHBhdGggYW5kIGJ1aWxkIG9wdGlvbnNcbiAgICBjb25zdCBpbnB1dCA9IEpTT04uc3RyaW5naWZ5KHsgcGF0aCwgLi4ub3B0aW9ucyB9KTtcbiAgICBjb25zdCB0YWdIYXNoID0gY3J5cHRvLmNyZWF0ZUhhc2goJ3NoYTI1NicpLnVwZGF0ZShpbnB1dCkuZGlnZXN0KCdoZXgnKTtcbiAgICBjb25zdCB0YWcgPSBgY2RrLSR7dGFnSGFzaH1gO1xuXG4gICAgY29uc3QgZG9ja2VyQXJnczogc3RyaW5nW10gPSBbXG4gICAgICAnYnVpbGQnLCAnLXQnLCB0YWcsXG4gICAgICAuLi4ob3B0aW9ucy5maWxlID8gWyctZicsIGpvaW4ocGF0aCwgb3B0aW9ucy5maWxlKV0gOiBbXSksXG4gICAgICAuLi4ob3B0aW9ucy5wbGF0Zm9ybSA/IFsnLS1wbGF0Zm9ybScsIG9wdGlvbnMucGxhdGZvcm1dIDogW10pLFxuICAgICAgLi4uKG9wdGlvbnMudGFyZ2V0U3RhZ2UgPyBbJy0tdGFyZ2V0Jywgb3B0aW9ucy50YXJnZXRTdGFnZV0gOiBbXSksXG4gICAgICAuLi5mbGF0dGVuKE9iamVjdC5lbnRyaWVzKGJ1aWxkQXJncykubWFwKChbaywgdl0pID0+IFsnLS1idWlsZC1hcmcnLCBgJHtrfT0ke3Z9YF0pKSxcbiAgICAgIHBhdGgsXG4gICAgXTtcblxuICAgIGRvY2tlckV4ZWMoZG9ja2VyQXJncyk7XG5cbiAgICAvLyBGaW5nZXJwcmludHMgdGhlIGRpcmVjdG9yeSBjb250YWluaW5nIHRoZSBEb2NrZXJmaWxlIHdlJ3JlIGJ1aWxkaW5nIGFuZFxuICAgIC8vIGRpZmZlcmVudGlhdGVzIHRoZSBmaW5nZXJwcmludCBiYXNlZCBvbiBidWlsZCBhcmd1bWVudHMuIFdlIGRvIHRoaXMgc29cbiAgICAvLyB3ZSBjYW4gcHJvdmlkZSBhIHN0YWJsZSBpbWFnZSBoYXNoLiBPdGhlcndpc2UsIHRoZSBpbWFnZSBJRCB3aWxsIGJlXG4gICAgLy8gZGlmZmVyZW50IGV2ZXJ5IHRpbWUgdGhlIERvY2tlciBsYXllciBjYWNoZSBpcyBjbGVhcmVkLCBkdWUgcHJpbWFyaWx5IHRvXG4gICAgLy8gdGltZXN0YW1wcy5cbiAgICBjb25zdCBoYXNoID0gRmlsZVN5c3RlbS5maW5nZXJwcmludChwYXRoLCB7IGV4dHJhSGFzaDogSlNPTi5zdHJpbmdpZnkob3B0aW9ucykgfSk7XG4gICAgcmV0dXJuIG5ldyBEb2NrZXJJbWFnZSh0YWcsIGhhc2gpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZmVyZW5jZSBhbiBpbWFnZSBvbiBEb2NrZXJIdWIgb3IgYW5vdGhlciBvbmxpbmUgcmVnaXN0cnkuXG4gICAqXG4gICAqIEBwYXJhbSBpbWFnZSB0aGUgaW1hZ2UgbmFtZVxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tUmVnaXN0cnkoaW1hZ2U6IHN0cmluZykge1xuICAgIHJldHVybiBuZXcgRG9ja2VySW1hZ2UoaW1hZ2UpO1xuICB9XG5cbiAgLyoqIFRoZSBEb2NrZXIgaW1hZ2UgKi9cbiAgcHVibGljIHJlYWRvbmx5IGltYWdlOiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3IoaW1hZ2U6IHN0cmluZywgX2ltYWdlSGFzaD86IHN0cmluZykge1xuICAgIC8vIEl0IGlzIHByZWZlcnJhYmxlIGZvciB0aGUgZGVwcmVjYXRlZCBjbGFzcyB0byBpbmhlcml0IGEgbm9uLWRlcHJlY2F0ZWQgY2xhc3MuXG4gICAgLy8gSG93ZXZlciwgaW4gdGhpcyBjYXNlLCB0aGUgb3Bwb3NpdGUgaGFzIG9jY3VycmVkIHdoaWNoIGlzIGluY29tcGF0aWJsZSB3aXRoXG4gICAgLy8gYSBkZXByZWNhdGlvbiBmZWF0dXJlLiBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2F3cy9qc2lpL2lzc3Vlcy8zMTAyLlxuICAgIGNvbnN0IGRlcHJlY2F0ZWQgPSBxdWlldCgpO1xuXG4gICAgc3VwZXIoaW1hZ2UsIF9pbWFnZUhhc2gpO1xuXG4gICAgcmVzZXQoZGVwcmVjYXRlZCk7XG4gICAgdGhpcy5pbWFnZSA9IGltYWdlO1xuICB9XG5cbiAgLyoqXG4gICAqIFByb3ZpZGVzIGEgc3RhYmxlIHJlcHJlc2VudGF0aW9uIG9mIHRoaXMgaW1hZ2UgZm9yIEpTT04gc2VyaWFsaXphdGlvbi5cbiAgICpcbiAgICogQHJldHVybiBUaGUgb3ZlcnJpZGRlbiBpbWFnZSBuYW1lIGlmIHNldCBvciBpbWFnZSBoYXNoIG5hbWUgaW4gdGhhdCBvcmRlclxuICAgKi9cbiAgcHVibGljIHRvSlNPTigpIHtcbiAgICAvLyBJdCBpcyBwcmVmZXJyYWJsZSBmb3IgdGhlIGRlcHJlY2F0ZWQgY2xhc3MgdG8gaW5oZXJpdCBhIG5vbi1kZXByZWNhdGVkIGNsYXNzLlxuICAgIC8vIEhvd2V2ZXIsIGluIHRoaXMgY2FzZSwgdGhlIG9wcG9zaXRlIGhhcyBvY2N1cnJlZCB3aGljaCBpcyBpbmNvbXBhdGlibGUgd2l0aFxuICAgIC8vIGEgZGVwcmVjYXRpb24gZmVhdHVyZS4gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9hd3MvanNpaS9pc3N1ZXMvMzEwMi5cbiAgICBjb25zdCBkZXByZWNhdGVkID0gcXVpZXQoKTtcblxuICAgIGNvbnN0IGpzb24gPSBzdXBlci50b0pTT04oKTtcblxuICAgIHJlc2V0KGRlcHJlY2F0ZWQpO1xuICAgIHJldHVybiBqc29uO1xuICB9XG5cbiAgLyoqXG4gICAqIFJ1bnMgYSBEb2NrZXIgaW1hZ2VcbiAgICovXG4gIHB1YmxpYyBydW4ob3B0aW9uczogRG9ja2VyUnVuT3B0aW9ucyA9IHt9KSB7XG4gICAgLy8gSXQgaXMgcHJlZmVycmFibGUgZm9yIHRoZSBkZXByZWNhdGVkIGNsYXNzIHRvIGluaGVyaXQgYSBub24tZGVwcmVjYXRlZCBjbGFzcy5cbiAgICAvLyBIb3dldmVyLCBpbiB0aGlzIGNhc2UsIHRoZSBvcHBvc2l0ZSBoYXMgb2NjdXJyZWQgd2hpY2ggaXMgaW5jb21wYXRpYmxlIHdpdGhcbiAgICAvLyBhIGRlcHJlY2F0aW9uIGZlYXR1cmUuIFNlZSBodHRwczovL2dpdGh1Yi5jb20vYXdzL2pzaWkvaXNzdWVzLzMxMDIuXG4gICAgY29uc3QgZGVwcmVjYXRlZCA9IHF1aWV0KCk7XG5cbiAgICBjb25zdCByZXN1bHQgPSBzdXBlci5ydW4ob3B0aW9ucyk7XG5cbiAgICByZXNldChkZXByZWNhdGVkKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgLyoqXG4gICAqIENvcGllcyBhIGZpbGUgb3IgZGlyZWN0b3J5IG91dCBvZiB0aGUgRG9ja2VyIGltYWdlIHRvIHRoZSBsb2NhbCBmaWxlc3lzdGVtLlxuICAgKlxuICAgKiBJZiBgb3V0cHV0UGF0aGAgaXMgb21pdHRlZCB0aGUgZGVzdGluYXRpb24gcGF0aCBpcyBhIHRlbXBvcmFyeSBkaXJlY3RvcnkuXG4gICAqXG4gICAqIEBwYXJhbSBpbWFnZVBhdGggdGhlIHBhdGggaW4gdGhlIERvY2tlciBpbWFnZVxuICAgKiBAcGFyYW0gb3V0cHV0UGF0aCB0aGUgZGVzdGluYXRpb24gcGF0aCBmb3IgdGhlIGNvcHkgb3BlcmF0aW9uXG4gICAqIEByZXR1cm5zIHRoZSBkZXN0aW5hdGlvbiBwYXRoXG4gICAqL1xuICBwdWJsaWMgY3AoaW1hZ2VQYXRoOiBzdHJpbmcsIG91dHB1dFBhdGg/OiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIC8vIEl0IGlzIHByZWZlcnJhYmxlIGZvciB0aGUgZGVwcmVjYXRlZCBjbGFzcyB0byBpbmhlcml0IGEgbm9uLWRlcHJlY2F0ZWQgY2xhc3MuXG4gICAgLy8gSG93ZXZlciwgaW4gdGhpcyBjYXNlLCB0aGUgb3Bwb3NpdGUgaGFzIG9jY3VycmVkIHdoaWNoIGlzIGluY29tcGF0aWJsZSB3aXRoXG4gICAgLy8gYSBkZXByZWNhdGlvbiBmZWF0dXJlLiBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2F3cy9qc2lpL2lzc3Vlcy8zMTAyLlxuICAgIGNvbnN0IGRlcHJlY2F0ZWQgPSBxdWlldCgpO1xuXG4gICAgY29uc3QgcmVzdWx0ID0gc3VwZXIuY3AoaW1hZ2VQYXRoLCBvdXRwdXRQYXRoKTtcblxuICAgIHJlc2V0KGRlcHJlY2F0ZWQpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cblxuLyoqXG4gKiBBIERvY2tlciB2b2x1bWVcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBEb2NrZXJWb2x1bWUge1xuICAvKipcbiAgICogVGhlIHBhdGggdG8gdGhlIGZpbGUgb3IgZGlyZWN0b3J5IG9uIHRoZSBob3N0IG1hY2hpbmVcbiAgICovXG4gIHJlYWRvbmx5IGhvc3RQYXRoOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBwYXRoIHdoZXJlIHRoZSBmaWxlIG9yIGRpcmVjdG9yeSBpcyBtb3VudGVkIGluIHRoZSBjb250YWluZXJcbiAgICovXG4gIHJlYWRvbmx5IGNvbnRhaW5lclBhdGg6IHN0cmluZztcblxuICAvKipcbiAgICogTW91bnQgY29uc2lzdGVuY3kuIE9ubHkgYXBwbGljYWJsZSBmb3IgbWFjT1NcbiAgICpcbiAgICogQGRlZmF1bHQgRG9ja2VyQ29uc2lzdGVuY3kuREVMRUdBVEVEXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmRvY2tlci5jb20vc3RvcmFnZS9iaW5kLW1vdW50cy8jY29uZmlndXJlLW1vdW50LWNvbnNpc3RlbmN5LWZvci1tYWNvc1xuICAgKi9cbiAgcmVhZG9ubHkgY29uc2lzdGVuY3k/OiBEb2NrZXJWb2x1bWVDb25zaXN0ZW5jeTtcbn1cblxuLyoqXG4gKiBTdXBwb3J0ZWQgRG9ja2VyIHZvbHVtZSBjb25zaXN0ZW5jeSB0eXBlcy4gT25seSB2YWxpZCBvbiBtYWNPUyBkdWUgdG8gdGhlIHdheSBmaWxlIHN0b3JhZ2Ugd29ya3Mgb24gTWFjXG4gKi9cbmV4cG9ydCBlbnVtIERvY2tlclZvbHVtZUNvbnNpc3RlbmN5IHtcbiAgLyoqXG4gICAqIFJlYWQvd3JpdGUgb3BlcmF0aW9ucyBpbnNpZGUgdGhlIERvY2tlciBjb250YWluZXIgYXJlIGFwcGxpZWQgaW1tZWRpYXRlbHkgb24gdGhlIG1vdW50ZWQgaG9zdCBtYWNoaW5lIHZvbHVtZXNcbiAgICovXG4gIENPTlNJU1RFTlQgPSAnY29uc2lzdGVudCcsXG4gIC8qKlxuICAgKiBSZWFkL3dyaXRlIG9wZXJhdGlvbnMgb24gbW91bnRlZCBEb2NrZXIgdm9sdW1lcyBhcmUgZmlyc3Qgd3JpdHRlbiBpbnNpZGUgdGhlIGNvbnRhaW5lciBhbmQgdGhlbiBzeW5jaHJvbml6ZWQgdG8gdGhlIGhvc3QgbWFjaGluZVxuICAgKi9cbiAgREVMRUdBVEVEID0gJ2RlbGVnYXRlZCcsXG4gIC8qKlxuICAgKiBSZWFkL3dyaXRlIG9wZXJhdGlvbnMgb24gbW91bnRlZCBEb2NrZXIgdm9sdW1lcyBhcmUgZmlyc3QgYXBwbGllZCBvbiB0aGUgaG9zdCBtYWNoaW5lIGFuZCB0aGVuIHN5bmNocm9uaXplZCB0byB0aGUgY29udGFpbmVyXG4gICAqL1xuICBDQUNIRUQgPSAnY2FjaGVkJyxcbn1cblxuLyoqXG4gKiBEb2NrZXIgcnVuIG9wdGlvbnNcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBEb2NrZXJSdW5PcHRpb25zIHtcbiAgLyoqXG4gICAqIFRoZSBlbnRyeXBvaW50IHRvIHJ1biBpbiB0aGUgY29udGFpbmVyLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIHJ1biB0aGUgZW50cnlwb2ludCBkZWZpbmVkIGluIHRoZSBpbWFnZVxuICAgKi9cbiAgcmVhZG9ubHkgZW50cnlwb2ludD86IHN0cmluZ1tdO1xuXG4gIC8qKlxuICAgKiBUaGUgY29tbWFuZCB0byBydW4gaW4gdGhlIGNvbnRhaW5lci5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBydW4gdGhlIGNvbW1hbmQgZGVmaW5lZCBpbiB0aGUgaW1hZ2VcbiAgICovXG4gIHJlYWRvbmx5IGNvbW1hbmQ/OiBzdHJpbmdbXTtcblxuICAvKipcbiAgICogRG9ja2VyIHZvbHVtZXMgdG8gbW91bnQuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gbm8gdm9sdW1lcyBhcmUgbW91bnRlZFxuICAgKi9cbiAgcmVhZG9ubHkgdm9sdW1lcz86IERvY2tlclZvbHVtZVtdO1xuXG4gIC8qKlxuICAgKiBXaGVyZSB0byBtb3VudCB0aGUgc3BlY2lmaWVkIHZvbHVtZXMgZnJvbVxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5kb2NrZXIuY29tL2VuZ2luZS9yZWZlcmVuY2UvY29tbWFuZGxpbmUvcnVuLyNtb3VudC12b2x1bWVzLWZyb20tY29udGFpbmVyLS0tdm9sdW1lcy1mcm9tXG4gICAqIEBkZWZhdWx0IC0gbm8gY29udGFpbmVycyBhcmUgc3BlY2lmaWVkIHRvIG1vdW50IHZvbHVtZXMgZnJvbVxuICAgKi9cbiAgcmVhZG9ubHkgdm9sdW1lc0Zyb20/OiBzdHJpbmdbXTtcblxuICAvKipcbiAgICogVGhlIGVudmlyb25tZW50IHZhcmlhYmxlcyB0byBwYXNzIHRvIHRoZSBjb250YWluZXIuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gbm8gZW52aXJvbm1lbnQgdmFyaWFibGVzLlxuICAgKi9cbiAgcmVhZG9ubHkgZW52aXJvbm1lbnQ/OiB7IFtrZXk6IHN0cmluZ106IHN0cmluZzsgfTtcblxuICAvKipcbiAgICogV29ya2luZyBkaXJlY3RvcnkgaW5zaWRlIHRoZSBjb250YWluZXIuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gaW1hZ2UgZGVmYXVsdFxuICAgKi9cbiAgcmVhZG9ubHkgd29ya2luZ0RpcmVjdG9yeT86IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIHVzZXIgdG8gdXNlIHdoZW4gcnVubmluZyB0aGUgY29udGFpbmVyLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIHJvb3Qgb3IgaW1hZ2UgZGVmYXVsdFxuICAgKi9cbiAgcmVhZG9ubHkgdXNlcj86IHN0cmluZztcblxuICAvKipcbiAgICogW1NlY3VyaXR5IGNvbmZpZ3VyYXRpb25dKGh0dHBzOi8vZG9jcy5kb2NrZXIuY29tL2VuZ2luZS9yZWZlcmVuY2UvcnVuLyNzZWN1cml0eS1jb25maWd1cmF0aW9uKVxuICAgKiB3aGVuIHJ1bm5pbmcgdGhlIGRvY2tlciBjb250YWluZXIuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gbm8gc2VjdXJpdHkgb3B0aW9uc1xuICAgKi9cbiAgcmVhZG9ubHkgc2VjdXJpdHlPcHQ/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIERvY2tlciBbTmV0d29ya2luZyBvcHRpb25zXShodHRwczovL2RvY3MuZG9ja2VyLmNvbS9lbmdpbmUvcmVmZXJlbmNlL2NvbW1hbmRsaW5lL3J1bi8jY29ubmVjdC1hLWNvbnRhaW5lci10by1hLW5ldHdvcmstLS1uZXR3b3JrKVxuICAgKlxuICAgKiBAZGVmYXVsdCAtIG5vIG5ldHdvcmtpbmcgb3B0aW9uc1xuICAgKi9cbiAgcmVhZG9ubHkgbmV0d29yaz86IHN0cmluZztcbn1cblxuLyoqXG4gKiBEb2NrZXIgYnVpbGQgb3B0aW9uc1xuICovXG5leHBvcnQgaW50ZXJmYWNlIERvY2tlckJ1aWxkT3B0aW9ucyB7XG4gIC8qKlxuICAgKiBCdWlsZCBhcmdzXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gbm8gYnVpbGQgYXJnc1xuICAgKi9cbiAgcmVhZG9ubHkgYnVpbGRBcmdzPzogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfTtcblxuICAvKipcbiAgICogTmFtZSBvZiB0aGUgRG9ja2VyZmlsZSwgbXVzdCByZWxhdGl2ZSB0byB0aGUgZG9ja2VyIGJ1aWxkIHBhdGguXG4gICAqXG4gICAqIEBkZWZhdWx0IGBEb2NrZXJmaWxlYFxuICAgKi9cbiAgcmVhZG9ubHkgZmlsZT86IHN0cmluZztcblxuICAvKipcbiAgICogU2V0IHBsYXRmb3JtIGlmIHNlcnZlciBpcyBtdWx0aS1wbGF0Zm9ybSBjYXBhYmxlLiBfUmVxdWlyZXMgRG9ja2VyIEVuZ2luZSBBUEkgdjEuMzgrXy5cbiAgICpcbiAgICogRXhhbXBsZSB2YWx1ZTogYGxpbnV4L2FtZDY0YFxuICAgKlxuICAgKiBAZGVmYXVsdCAtIG5vIHBsYXRmb3JtIHNwZWNpZmllZFxuICAgKi9cbiAgcmVhZG9ubHkgcGxhdGZvcm0/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFNldCBidWlsZCB0YXJnZXQgZm9yIG11bHRpLXN0YWdlIGNvbnRhaW5lciBidWlsZHMuIEFueSBzdGFnZSBkZWZpbmVkIGFmdGVyd2FyZHMgd2lsbCBiZSBpZ25vcmVkLlxuICAgKlxuICAgKiBFeGFtcGxlIHZhbHVlOiBgYnVpbGQtZW52YFxuICAgKlxuICAgKiBAZGVmYXVsdCAtIEJ1aWxkIGFsbCBzdGFnZXMgZGVmaW5lZCBpbiB0aGUgRG9ja2VyZmlsZVxuICAgKi9cbiAgcmVhZG9ubHkgdGFyZ2V0U3RhZ2U/OiBzdHJpbmc7XG59XG5cbmZ1bmN0aW9uIGZsYXR0ZW4oeDogc3RyaW5nW11bXSkge1xuICByZXR1cm4gQXJyYXkucHJvdG90eXBlLmNvbmNhdChbXSwgLi4ueCk7XG59XG5cbmZ1bmN0aW9uIGlzU2VMaW51eCgpIDogYm9vbGVhbiB7XG4gIGlmIChwcm9jZXNzLnBsYXRmb3JtICE9ICdsaW51eCcpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgY29uc3QgcHJvZyA9ICdzZWxpbnV4ZW5hYmxlZCc7XG4gIGNvbnN0IHByb2MgPSBzcGF3blN5bmMocHJvZywgW10sIHtcbiAgICBzdGRpbzogWyAvLyBzaG93IHNlbGludXggc3RhdHVzIG91dHB1dFxuICAgICAgJ3BpcGUnLCAvLyBnZXQgdmFsdWUgb2Ygc3RkaW9cbiAgICAgIHByb2Nlc3Muc3RkZXJyLCAvLyByZWRpcmVjdCBzdGRvdXQgdG8gc3RkZXJyXG4gICAgICAnaW5oZXJpdCcsIC8vIGluaGVyaXQgc3RkZXJyXG4gICAgXSxcbiAgfSk7XG4gIGlmIChwcm9jLmVycm9yKSB7XG4gICAgLy8gc2VsaW51eGVuYWJsZWQgbm90IGEgdmFsaWQgY29tbWFuZCwgdGhlcmVmb3JlIG5vdCBlbmFibGVkXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGlmIChwcm9jLnN0YXR1cyA9PSAwKSB7XG4gICAgLy8gc2VsaW51eCBlbmFibGVkXG4gICAgcmV0dXJuIHRydWU7XG4gIH0gZWxzZSB7XG4gICAgLy8gc2VsaW51eCBub3QgZW5hYmxlZFxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuIl19