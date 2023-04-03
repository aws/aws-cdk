"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DockerVolumeConsistency = exports.DockerImage = exports.BundlingDockerImage = exports.BundlingFileAccess = exports.BundlingOutput = exports.DockerBuildSecret = void 0;
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
     * it will be used as the bundle output as-is. Otherwise, all the files in the bundling output directory will be zipped.
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
        return DockerImage.fromBuild(path, options);
    }
    /** @param image The Docker image */
    constructor(image, _imageHash) {
        this.image = image;
        this._imageHash = _imageHash;
    }
    /**
     * Provides a stable representation of this image for JSON serialization.
     *
     * @return The overridden image name if set or image hash name in that order
     */
    toJSON() {
        return this._imageHash ?? this.image;
    }
    /**
     * Runs a Docker image
     */
    run(options = {}) {
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
        // It is preferable for the deprecated class to inherit a non-deprecated class.
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
        // It is preferable for the deprecated class to inherit a non-deprecated class.
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
        // It is preferable for the deprecated class to inherit a non-deprecated class.
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
        // It is preferable for the deprecated class to inherit a non-deprecated class.
        // However, in this case, the opposite has occurred which is incompatible with
        // a deprecation feature. See https://github.com/aws/jsii/issues/3102.
        const deprecated = (0, jsii_deprecated_1.quiet)();
        const result = super.cp(imagePath, outputPath);
        (0, jsii_deprecated_1.reset)(deprecated);
        return result;
    }
}
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxpbmcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJidW5kbGluZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxpREFBMEM7QUFDMUMsaUNBQWlDO0FBQ2pDLCtCQUF3QztBQUN4Qyw2QkFBa0M7QUFDbEMsMkRBQXFEO0FBQ3JELCtEQUF5RDtBQUV6RDs7Ozs7O0dBTUc7QUFDSCxNQUFhLGlCQUFpQjtJQUM1Qjs7OztPQUlHO0lBQ0ksTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFXO1FBQy9CLE9BQU8sT0FBTyxHQUFHLEVBQUUsQ0FBQztJQUN0QixDQUFDO0NBQ0Y7QUFURCw4Q0FTQztBQWtIRDs7O0dBR0c7QUFDSCxJQUFZLGNBbUJYO0FBbkJELFdBQVksY0FBYztJQUN4Qjs7OztPQUlHO0lBQ0gsdUNBQXFCLENBQUE7SUFFckI7OztPQUdHO0lBQ0gsK0NBQTZCLENBQUE7SUFFN0I7OztPQUdHO0lBQ0gsaURBQStCLENBQUE7QUFDakMsQ0FBQyxFQW5CVyxjQUFjLEdBQWQsc0JBQWMsS0FBZCxzQkFBYyxRQW1CekI7QUFrQkQ7O0dBRUc7QUFDSCxJQUFZLGtCQVlYO0FBWkQsV0FBWSxrQkFBa0I7SUFDNUI7OztPQUdHO0lBQ0gsaURBQTJCLENBQUE7SUFFM0I7OztPQUdHO0lBQ0gsK0NBQXlCLENBQUE7QUFDM0IsQ0FBQyxFQVpXLGtCQUFrQixHQUFsQiwwQkFBa0IsS0FBbEIsMEJBQWtCLFFBWTdCO0FBRUQ7Ozs7R0FJRztBQUNILE1BQWEsbUJBQW1CO0lBQzlCOzs7O09BSUc7SUFDSSxNQUFNLENBQUMsWUFBWSxDQUFDLEtBQWE7UUFDdEMsT0FBTyxJQUFJLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNoQyxDQUFDO0lBRUQ7Ozs7Ozs7T0FPRztJQUNJLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBWSxFQUFFLFVBQThCLEVBQUU7UUFDcEUsT0FBTyxXQUFXLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMs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O0lBQ2hCLElBQUksT0FBTyxDQUFDLFFBQVEsSUFBSSxPQUFPLEVBQUU7UUFDL0IsT0FBTyxLQUFLLENBQUM7S0FDZDtJQUNELE1BQU0sSUFBSSxHQUFHLGdCQUFnQixDQUFDO0lBQzlCLE1BQU0sSUFBSSxHQUFHLElBQUEseUJBQVMsRUFBQyxJQUFJLEVBQUUsRUFBRSxFQUFFO1FBQy9CLEtBQUssRUFBRTtZQUNMLE1BQU07WUFDTixPQUFPLENBQUMsTUFBTTtZQUNkLFNBQVMsRUFBRSxpQkFBaUI7U0FDN0I7S0FDRixDQUFDLENBQUM7SUFDSCxJQUFJLElBQUksQ0FBQyxLQUFLLEVBQUU7UUFDZCw0REFBNEQ7UUFDNUQsT0FBTyxLQUFLLENBQUM7S0FDZDtJQUNELElBQUksSUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFDLEVBQUU7UUFDcEIsa0JBQWtCO1FBQ2xCLE9BQU8sSUFBSSxDQUFDO0tBQ2I7U0FBTTtRQUNMLHNCQUFzQjtRQUN0QixPQUFPLEtBQUssQ0FBQztLQUNkO0FBQ0gsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHNwYXduU3luYyB9IGZyb20gJ2NoaWxkX3Byb2Nlc3MnO1xuaW1wb3J0ICogYXMgY3J5cHRvIGZyb20gJ2NyeXB0byc7XG5pbXBvcnQgeyBpc0Fic29sdXRlLCBqb2luIH0gZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBGaWxlU3lzdGVtIH0gZnJvbSAnLi9mcyc7XG5pbXBvcnQgeyBkb2NrZXJFeGVjIH0gZnJvbSAnLi9wcml2YXRlL2Fzc2V0LXN0YWdpbmcnO1xuaW1wb3J0IHsgcXVpZXQsIHJlc2V0IH0gZnJvbSAnLi9wcml2YXRlL2pzaWktZGVwcmVjYXRlZCc7XG5cbi8qKlxuICogTWV0aG9kcyB0byBidWlsZCBEb2NrZXIgQ0xJIGFyZ3VtZW50cyBmb3IgYnVpbGRzIHVzaW5nIHNlY3JldHMuXG4gKlxuICogRG9ja2VyIEJ1aWxkS2l0IG11c3QgYmUgZW5hYmxlZCB0byB1c2UgYnVpbGQgc2VjcmV0cy5cbiAqXG4gKiBAc2VlIGh0dHBzOi8vZG9jcy5kb2NrZXIuY29tL2J1aWxkL2J1aWxka2l0L1xuICovXG5leHBvcnQgY2xhc3MgRG9ja2VyQnVpbGRTZWNyZXQge1xuICAvKipcbiAgICogQSBEb2NrZXIgYnVpbGQgc2VjcmV0IGZyb20gYSBmaWxlIHNvdXJjZVxuICAgKiBAcGFyYW0gc3JjIFRoZSBwYXRoIHRvIHRoZSBzb3VyY2UgZmlsZSwgcmVsYXRpdmUgdG8gdGhlIGJ1aWxkIGRpcmVjdG9yeS5cbiAgICogQHJldHVybnMgVGhlIGxhdHRlciBoYWxmIHJlcXVpcmVkIGZvciBgLS1zZWNyZXRgXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21TcmMoc3JjOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIHJldHVybiBgc3JjPSR7c3JjfWA7XG4gIH1cbn1cblxuLyoqXG4gKiBCdW5kbGluZyBvcHRpb25zXG4gKlxuICovXG5leHBvcnQgaW50ZXJmYWNlIEJ1bmRsaW5nT3B0aW9ucyB7XG4gIC8qKlxuICAgKiBUaGUgRG9ja2VyIGltYWdlIHdoZXJlIHRoZSBjb21tYW5kIHdpbGwgcnVuLlxuICAgKi9cbiAgcmVhZG9ubHkgaW1hZ2U6IERvY2tlckltYWdlO1xuXG4gIC8qKlxuICAgKiBUaGUgZW50cnlwb2ludCB0byBydW4gaW4gdGhlIERvY2tlciBjb250YWluZXIuXG4gICAqXG4gICAqIEV4YW1wbGUgdmFsdWU6IGBbJy9iaW4vc2gnLCAnLWMnXWBcbiAgICpcbiAgICogQHNlZSBodHRwczovL2RvY3MuZG9ja2VyLmNvbS9lbmdpbmUvcmVmZXJlbmNlL2J1aWxkZXIvI2VudHJ5cG9pbnRcbiAgICpcbiAgICogQGRlZmF1bHQgLSBydW4gdGhlIGVudHJ5cG9pbnQgZGVmaW5lZCBpbiB0aGUgaW1hZ2VcbiAgICovXG4gIHJlYWRvbmx5IGVudHJ5cG9pbnQ/OiBzdHJpbmdbXTtcblxuICAvKipcbiAgICogVGhlIGNvbW1hbmQgdG8gcnVuIGluIHRoZSBEb2NrZXIgY29udGFpbmVyLlxuICAgKlxuICAgKiBFeGFtcGxlIHZhbHVlOiBgWyducG0nLCAnaW5zdGFsbCddYFxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5kb2NrZXIuY29tL2VuZ2luZS9yZWZlcmVuY2UvcnVuL1xuICAgKlxuICAgKiBAZGVmYXVsdCAtIHJ1biB0aGUgY29tbWFuZCBkZWZpbmVkIGluIHRoZSBpbWFnZVxuICAgKi9cbiAgcmVhZG9ubHkgY29tbWFuZD86IHN0cmluZ1tdO1xuXG4gIC8qKlxuICAgKiBBZGRpdGlvbmFsIERvY2tlciB2b2x1bWVzIHRvIG1vdW50LlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIG5vIGFkZGl0aW9uYWwgdm9sdW1lcyBhcmUgbW91bnRlZFxuICAgKi9cbiAgcmVhZG9ubHkgdm9sdW1lcz86IERvY2tlclZvbHVtZVtdO1xuXG4gIC8qKlxuICAgKiBXaGVyZSB0byBtb3VudCB0aGUgc3BlY2lmaWVkIHZvbHVtZXMgZnJvbVxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5kb2NrZXIuY29tL2VuZ2luZS9yZWZlcmVuY2UvY29tbWFuZGxpbmUvcnVuLyNtb3VudC12b2x1bWVzLWZyb20tY29udGFpbmVyLS0tdm9sdW1lcy1mcm9tXG4gICAqIEBkZWZhdWx0IC0gbm8gY29udGFpbmVycyBhcmUgc3BlY2lmaWVkIHRvIG1vdW50IHZvbHVtZXMgZnJvbVxuICAgKi9cbiAgcmVhZG9ubHkgdm9sdW1lc0Zyb20/OiBzdHJpbmdbXTtcblxuICAvKipcbiAgICogVGhlIGVudmlyb25tZW50IHZhcmlhYmxlcyB0byBwYXNzIHRvIHRoZSBEb2NrZXIgY29udGFpbmVyLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIG5vIGVudmlyb25tZW50IHZhcmlhYmxlcy5cbiAgICovXG4gIHJlYWRvbmx5IGVudmlyb25tZW50PzogeyBba2V5OiBzdHJpbmddOiBzdHJpbmc7IH07XG5cbiAgLyoqXG4gICAqIFdvcmtpbmcgZGlyZWN0b3J5IGluc2lkZSB0aGUgRG9ja2VyIGNvbnRhaW5lci5cbiAgICpcbiAgICogQGRlZmF1bHQgL2Fzc2V0LWlucHV0XG4gICAqL1xuICByZWFkb25seSB3b3JraW5nRGlyZWN0b3J5Pzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgdXNlciB0byB1c2Ugd2hlbiBydW5uaW5nIHRoZSBEb2NrZXIgY29udGFpbmVyLlxuICAgKlxuICAgKiAgIHVzZXIgfCB1c2VyOmdyb3VwIHwgdWlkIHwgdWlkOmdpZCB8IHVzZXI6Z2lkIHwgdWlkOmdyb3VwXG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmRvY2tlci5jb20vZW5naW5lL3JlZmVyZW5jZS9ydW4vI3VzZXJcbiAgICpcbiAgICogQGRlZmF1bHQgLSB1aWQ6Z2lkIG9mIHRoZSBjdXJyZW50IHVzZXIgb3IgMTAwMDoxMDAwIG9uIFdpbmRvd3NcbiAgICovXG4gIHJlYWRvbmx5IHVzZXI/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIExvY2FsIGJ1bmRsaW5nIHByb3ZpZGVyLlxuICAgKlxuICAgKiBUaGUgcHJvdmlkZXIgaW1wbGVtZW50cyBhIG1ldGhvZCBgdHJ5QnVuZGxlKClgIHdoaWNoIHNob3VsZCByZXR1cm4gYHRydWVgXG4gICAqIGlmIGxvY2FsIGJ1bmRsaW5nIHdhcyBwZXJmb3JtZWQuIElmIGBmYWxzZWAgaXMgcmV0dXJuZWQsIGRvY2tlciBidW5kbGluZ1xuICAgKiB3aWxsIGJlIGRvbmUuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gYnVuZGxpbmcgd2lsbCBvbmx5IGJlIHBlcmZvcm1lZCBpbiBhIERvY2tlciBjb250YWluZXJcbiAgICpcbiAgICovXG4gIHJlYWRvbmx5IGxvY2FsPzogSUxvY2FsQnVuZGxpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSB0eXBlIG9mIG91dHB1dCB0aGF0IHRoaXMgYnVuZGxpbmcgb3BlcmF0aW9uIGlzIHByb2R1Y2luZy5cbiAgICpcbiAgICogQGRlZmF1bHQgQnVuZGxpbmdPdXRwdXQuQVVUT19ESVNDT1ZFUlxuICAgKlxuICAgKi9cbiAgcmVhZG9ubHkgb3V0cHV0VHlwZT86IEJ1bmRsaW5nT3V0cHV0O1xuXG4gIC8qKlxuICAgKiBbU2VjdXJpdHkgY29uZmlndXJhdGlvbl0oaHR0cHM6Ly9kb2NzLmRvY2tlci5jb20vZW5naW5lL3JlZmVyZW5jZS9ydW4vI3NlY3VyaXR5LWNvbmZpZ3VyYXRpb24pXG4gICAqIHdoZW4gcnVubmluZyB0aGUgZG9ja2VyIGNvbnRhaW5lci5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBubyBzZWN1cml0eSBvcHRpb25zXG4gICAqL1xuICByZWFkb25seSBzZWN1cml0eU9wdD86IHN0cmluZztcbiAgLyoqXG4gICAqIERvY2tlciBbTmV0d29ya2luZyBvcHRpb25zXShodHRwczovL2RvY3MuZG9ja2VyLmNvbS9lbmdpbmUvcmVmZXJlbmNlL2NvbW1hbmRsaW5lL3J1bi8jY29ubmVjdC1hLWNvbnRhaW5lci10by1hLW5ldHdvcmstLS1uZXR3b3JrKVxuICAgKlxuICAgKiBAZGVmYXVsdCAtIG5vIG5ldHdvcmtpbmcgb3B0aW9uc1xuICAgKi9cbiAgcmVhZG9ubHkgbmV0d29yaz86IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIGFjY2VzcyBtZWNoYW5pc20gdXNlZCB0byBtYWtlIHNvdXJjZSBmaWxlcyBhdmFpbGFibGUgdG8gdGhlIGJ1bmRsaW5nIGNvbnRhaW5lciBhbmQgdG8gcmV0dXJuIHRoZSBidW5kbGluZyBvdXRwdXQgYmFjayB0byB0aGUgaG9zdC5cbiAgICogQGRlZmF1bHQgLSBCdW5kbGluZ0ZpbGVBY2Nlc3MuQklORF9NT1VOVFxuICAgKi9cbiAgcmVhZG9ubHkgYnVuZGxpbmdGaWxlQWNjZXNzPzogQnVuZGxpbmdGaWxlQWNjZXNzO1xufVxuXG4vKipcbiAqIFRoZSB0eXBlIG9mIG91dHB1dCB0aGF0IGEgYnVuZGxpbmcgb3BlcmF0aW9uIGlzIHByb2R1Y2luZy5cbiAqXG4gKi9cbmV4cG9ydCBlbnVtIEJ1bmRsaW5nT3V0cHV0IHtcbiAgLyoqXG4gICAqIFRoZSBidW5kbGluZyBvdXRwdXQgZGlyZWN0b3J5IGluY2x1ZGVzIGEgc2luZ2xlIC56aXAgb3IgLmphciBmaWxlIHdoaWNoXG4gICAqIHdpbGwgYmUgdXNlZCBhcyB0aGUgZmluYWwgYnVuZGxlLiBJZiB0aGUgb3V0cHV0IGRpcmVjdG9yeSBkb2VzIG5vdFxuICAgKiBpbmNsdWRlIGV4YWN0bHkgYSBzaW5nbGUgYXJjaGl2ZSwgYnVuZGxpbmcgd2lsbCBmYWlsLlxuICAgKi9cbiAgQVJDSElWRUQgPSAnYXJjaGl2ZWQnLFxuXG4gIC8qKlxuICAgKiBUaGUgYnVuZGxpbmcgb3V0cHV0IGRpcmVjdG9yeSBjb250YWlucyBvbmUgb3IgbW9yZSBmaWxlcyB3aGljaCB3aWxsIGJlXG4gICAqIGFyY2hpdmVkIGFuZCB1cGxvYWRlZCBhcyBhIC56aXAgZmlsZSB0byBTMy5cbiAgICovXG4gIE5PVF9BUkNISVZFRCA9ICdub3QtYXJjaGl2ZWQnLFxuXG4gIC8qKlxuICAgKiBJZiB0aGUgYnVuZGxpbmcgb3V0cHV0IGRpcmVjdG9yeSBjb250YWlucyBhIHNpbmdsZSBhcmNoaXZlIGZpbGUgKHppcCBvciBqYXIpXG4gICAqIGl0IHdpbGwgYmUgdXNlZCBhcyB0aGUgYnVuZGxlIG91dHB1dCBhcy1pcy4gT3RoZXJ3aXNlLCBhbGwgdGhlIGZpbGVzIGluIHRoZSBidW5kbGluZyBvdXRwdXQgZGlyZWN0b3J5IHdpbGwgYmUgemlwcGVkLlxuICAgKi9cbiAgQVVUT19ESVNDT1ZFUiA9ICdhdXRvLWRpc2NvdmVyJyxcbn1cblxuLyoqXG4gKiBMb2NhbCBidW5kbGluZ1xuICpcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBJTG9jYWxCdW5kbGluZyB7XG4gIC8qKlxuICAgKiBUaGlzIG1ldGhvZCBpcyBjYWxsZWQgYmVmb3JlIGF0dGVtcHRpbmcgZG9ja2VyIGJ1bmRsaW5nIHRvIGFsbG93IHRoZVxuICAgKiBidW5kbGVyIHRvIGJlIGV4ZWN1dGVkIGxvY2FsbHkuIElmIHRoZSBsb2NhbCBidW5kbGVyIGV4aXN0cywgYW5kIGJ1bmRsaW5nXG4gICAqIHdhcyBwZXJmb3JtZWQgbG9jYWxseSwgcmV0dXJuIGB0cnVlYC4gT3RoZXJ3aXNlLCByZXR1cm4gYGZhbHNlYC5cbiAgICpcbiAgICogQHBhcmFtIG91dHB1dERpciB0aGUgZGlyZWN0b3J5IHdoZXJlIHRoZSBidW5kbGVkIGFzc2V0IHNob3VsZCBiZSBvdXRwdXRcbiAgICogQHBhcmFtIG9wdGlvbnMgYnVuZGxpbmcgb3B0aW9ucyBmb3IgdGhpcyBhc3NldFxuICAgKi9cbiAgdHJ5QnVuZGxlKG91dHB1dERpcjogc3RyaW5nLCBvcHRpb25zOiBCdW5kbGluZ09wdGlvbnMpOiBib29sZWFuO1xufVxuXG4vKipcbiAqIFRoZSBhY2Nlc3MgbWVjaGFuaXNtIHVzZWQgdG8gbWFrZSBzb3VyY2UgZmlsZXMgYXZhaWxhYmxlIHRvIHRoZSBidW5kbGluZyBjb250YWluZXIgYW5kIHRvIHJldHVybiB0aGUgYnVuZGxpbmcgb3V0cHV0IGJhY2sgdG8gdGhlIGhvc3RcbiAqL1xuZXhwb3J0IGVudW0gQnVuZGxpbmdGaWxlQWNjZXNzIHtcbiAgLyoqXG4gICAqIENyZWF0ZXMgdGVtcG9yYXJ5IHZvbHVtZXMgYW5kIGNvbnRhaW5lcnMgdG8gY29weSBmaWxlcyBmcm9tIHRoZSBob3N0IHRvIHRoZSBidW5kbGluZyBjb250YWluZXIgYW5kIGJhY2suXG4gICAqIFRoaXMgaXMgc2xvd2VyLCBidXQgd29ya3MgYWxzbyBpbiBtb3JlIGNvbXBsZXggc2l0dWF0aW9ucyB3aXRoIHJlbW90ZSBvciBzaGFyZWQgZG9ja2VyIHNvY2tldHMuXG4gICAqL1xuICBWT0xVTUVfQ09QWSA9ICdWT0xVTUVfQ09QWScsXG5cbiAgLyoqXG4gICAqIFRoZSBzb3VyY2UgYW5kIG91dHB1dCBmb2xkZXJzIHdpbGwgYmUgbW91bnRlZCBhcyBiaW5kIG1vdW50IGZyb20gdGhlIGhvc3Qgc3lzdGVtXG4gICAqIFRoaXMgaXMgZmFzdGVyIGFuZCBzaW1wbGVyLCBidXQgbGVzcyBwb3J0YWJsZSB0aGFuIGBWT0xVTUVfQ09QWWAuXG4gICAqL1xuICBCSU5EX01PVU5UID0gJ0JJTkRfTU9VTlQnLFxufVxuXG4vKipcbiAqIEEgRG9ja2VyIGltYWdlIHVzZWQgZm9yIGFzc2V0IGJ1bmRsaW5nXG4gKlxuICogQGRlcHJlY2F0ZWQgdXNlIERvY2tlckltYWdlXG4gKi9cbmV4cG9ydCBjbGFzcyBCdW5kbGluZ0RvY2tlckltYWdlIHtcbiAgLyoqXG4gICAqIFJlZmVyZW5jZSBhbiBpbWFnZSBvbiBEb2NrZXJIdWIgb3IgYW5vdGhlciBvbmxpbmUgcmVnaXN0cnkuXG4gICAqXG4gICAqIEBwYXJhbSBpbWFnZSB0aGUgaW1hZ2UgbmFtZVxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tUmVnaXN0cnkoaW1hZ2U6IHN0cmluZykge1xuICAgIHJldHVybiBuZXcgRG9ja2VySW1hZ2UoaW1hZ2UpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZmVyZW5jZSBhbiBpbWFnZSB0aGF0J3MgYnVpbHQgZGlyZWN0bHkgZnJvbSBzb3VyY2VzIG9uIGRpc2suXG4gICAqXG4gICAqIEBwYXJhbSBwYXRoIFRoZSBwYXRoIHRvIHRoZSBkaXJlY3RvcnkgY29udGFpbmluZyB0aGUgRG9ja2VyIGZpbGVcbiAgICogQHBhcmFtIG9wdGlvbnMgRG9ja2VyIGJ1aWxkIG9wdGlvbnNcbiAgICpcbiAgICogQGRlcHJlY2F0ZWQgdXNlIERvY2tlckltYWdlLmZyb21CdWlsZCgpXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21Bc3NldChwYXRoOiBzdHJpbmcsIG9wdGlvbnM6IERvY2tlckJ1aWxkT3B0aW9ucyA9IHt9KTogQnVuZGxpbmdEb2NrZXJJbWFnZSB7XG4gICAgcmV0dXJuIERvY2tlckltYWdlLmZyb21CdWlsZChwYXRoLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKiBAcGFyYW0gaW1hZ2UgVGhlIERvY2tlciBpbWFnZSAqL1xuICBwcm90ZWN0ZWQgY29uc3RydWN0b3IocHVibGljIHJlYWRvbmx5IGltYWdlOiBzdHJpbmcsIHByaXZhdGUgcmVhZG9ubHkgX2ltYWdlSGFzaD86IHN0cmluZykge31cblxuICAvKipcbiAgICogUHJvdmlkZXMgYSBzdGFibGUgcmVwcmVzZW50YXRpb24gb2YgdGhpcyBpbWFnZSBmb3IgSlNPTiBzZXJpYWxpemF0aW9uLlxuICAgKlxuICAgKiBAcmV0dXJuIFRoZSBvdmVycmlkZGVuIGltYWdlIG5hbWUgaWYgc2V0IG9yIGltYWdlIGhhc2ggbmFtZSBpbiB0aGF0IG9yZGVyXG4gICAqL1xuICBwdWJsaWMgdG9KU09OKCkge1xuICAgIHJldHVybiB0aGlzLl9pbWFnZUhhc2ggPz8gdGhpcy5pbWFnZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSdW5zIGEgRG9ja2VyIGltYWdlXG4gICAqL1xuICBwdWJsaWMgcnVuKG9wdGlvbnM6IERvY2tlclJ1bk9wdGlvbnMgPSB7fSkge1xuICAgIGNvbnN0IHZvbHVtZXMgPSBvcHRpb25zLnZvbHVtZXMgfHwgW107XG4gICAgY29uc3QgZW52aXJvbm1lbnQgPSBvcHRpb25zLmVudmlyb25tZW50IHx8IHt9O1xuICAgIGNvbnN0IGVudHJ5cG9pbnQgPSBvcHRpb25zLmVudHJ5cG9pbnQ/LlswXSB8fCBudWxsO1xuICAgIGNvbnN0IGNvbW1hbmQgPSBbXG4gICAgICAuLi5vcHRpb25zLmVudHJ5cG9pbnQ/LlsxXVxuICAgICAgICA/IFsuLi5vcHRpb25zLmVudHJ5cG9pbnQuc2xpY2UoMSldXG4gICAgICAgIDogW10sXG4gICAgICAuLi5vcHRpb25zLmNvbW1hbmRcbiAgICAgICAgPyBbLi4ub3B0aW9ucy5jb21tYW5kXVxuICAgICAgICA6IFtdLFxuICAgIF07XG5cbiAgICBjb25zdCBkb2NrZXJBcmdzOiBzdHJpbmdbXSA9IFtcbiAgICAgICdydW4nLCAnLS1ybScsXG4gICAgICAuLi5vcHRpb25zLnNlY3VyaXR5T3B0XG4gICAgICAgID8gWyctLXNlY3VyaXR5LW9wdCcsIG9wdGlvbnMuc2VjdXJpdHlPcHRdXG4gICAgICAgIDogW10sXG4gICAgICAuLi5vcHRpb25zLm5ldHdvcmtcbiAgICAgICAgPyBbJy0tbmV0d29yaycsIG9wdGlvbnMubmV0d29ya11cbiAgICAgICAgOiBbXSxcbiAgICAgIC4uLm9wdGlvbnMudXNlclxuICAgICAgICA/IFsnLXUnLCBvcHRpb25zLnVzZXJdXG4gICAgICAgIDogW10sXG4gICAgICAuLi5vcHRpb25zLnZvbHVtZXNGcm9tXG4gICAgICAgID8gZmxhdHRlbihvcHRpb25zLnZvbHVtZXNGcm9tLm1hcCh2ID0+IFsnLS12b2x1bWVzLWZyb20nLCB2XSkpXG4gICAgICAgIDogW10sXG4gICAgICAuLi5mbGF0dGVuKHZvbHVtZXMubWFwKHYgPT4gWyctdicsIGAke3YuaG9zdFBhdGh9OiR7di5jb250YWluZXJQYXRofToke2lzU2VMaW51eCgpID8gJ3osJyA6ICcnfSR7di5jb25zaXN0ZW5jeSA/PyBEb2NrZXJWb2x1bWVDb25zaXN0ZW5jeS5ERUxFR0FURUR9YF0pKSxcbiAgICAgIC4uLmZsYXR0ZW4oT2JqZWN0LmVudHJpZXMoZW52aXJvbm1lbnQpLm1hcCgoW2ssIHZdKSA9PiBbJy0tZW52JywgYCR7a309JHt2fWBdKSksXG4gICAgICAuLi5vcHRpb25zLndvcmtpbmdEaXJlY3RvcnlcbiAgICAgICAgPyBbJy13Jywgb3B0aW9ucy53b3JraW5nRGlyZWN0b3J5XVxuICAgICAgICA6IFtdLFxuICAgICAgLi4uZW50cnlwb2ludFxuICAgICAgICA/IFsnLS1lbnRyeXBvaW50JywgZW50cnlwb2ludF1cbiAgICAgICAgOiBbXSxcbiAgICAgIHRoaXMuaW1hZ2UsXG4gICAgICAuLi5jb21tYW5kLFxuICAgIF07XG5cbiAgICBkb2NrZXJFeGVjKGRvY2tlckFyZ3MpO1xuICB9XG5cbiAgLyoqXG4gICAqIENvcGllcyBhIGZpbGUgb3IgZGlyZWN0b3J5IG91dCBvZiB0aGUgRG9ja2VyIGltYWdlIHRvIHRoZSBsb2NhbCBmaWxlc3lzdGVtLlxuICAgKlxuICAgKiBJZiBgb3V0cHV0UGF0aGAgaXMgb21pdHRlZCB0aGUgZGVzdGluYXRpb24gcGF0aCBpcyBhIHRlbXBvcmFyeSBkaXJlY3RvcnkuXG4gICAqXG4gICAqIEBwYXJhbSBpbWFnZVBhdGggdGhlIHBhdGggaW4gdGhlIERvY2tlciBpbWFnZVxuICAgKiBAcGFyYW0gb3V0cHV0UGF0aCB0aGUgZGVzdGluYXRpb24gcGF0aCBmb3IgdGhlIGNvcHkgb3BlcmF0aW9uXG4gICAqIEByZXR1cm5zIHRoZSBkZXN0aW5hdGlvbiBwYXRoXG4gICAqL1xuICBwdWJsaWMgY3AoaW1hZ2VQYXRoOiBzdHJpbmcsIG91dHB1dFBhdGg/OiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIGNvbnN0IHsgc3Rkb3V0IH0gPSBkb2NrZXJFeGVjKFsnY3JlYXRlJywgdGhpcy5pbWFnZV0sIHt9KTsgLy8gRW1wdHkgb3B0aW9ucyB0byBhdm9pZCBzdGRvdXQgcmVkaXJlY3QgaGVyZVxuICAgIGNvbnN0IG1hdGNoID0gc3Rkb3V0LnRvU3RyaW5nKCkubWF0Y2goLyhbMC05YS1mXXsxNix9KS8pO1xuICAgIGlmICghbWF0Y2gpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignRmFpbGVkIHRvIGV4dHJhY3QgY29udGFpbmVyIElEIGZyb20gRG9ja2VyIGNyZWF0ZSBvdXRwdXQnKTtcbiAgICB9XG5cbiAgICBjb25zdCBjb250YWluZXJJZCA9IG1hdGNoWzFdO1xuICAgIGNvbnN0IGNvbnRhaW5lclBhdGggPSBgJHtjb250YWluZXJJZH06JHtpbWFnZVBhdGh9YDtcbiAgICBjb25zdCBkZXN0UGF0aCA9IG91dHB1dFBhdGggPz8gRmlsZVN5c3RlbS5ta2R0ZW1wKCdjZGstZG9ja2VyLWNwLScpO1xuICAgIHRyeSB7XG4gICAgICBkb2NrZXJFeGVjKFsnY3AnLCBjb250YWluZXJQYXRoLCBkZXN0UGF0aF0pO1xuICAgICAgcmV0dXJuIGRlc3RQYXRoO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBGYWlsZWQgdG8gY29weSBmaWxlcyBmcm9tICR7Y29udGFpbmVyUGF0aH0gdG8gJHtkZXN0UGF0aH06ICR7ZXJyfWApO1xuICAgIH0gZmluYWxseSB7XG4gICAgICBkb2NrZXJFeGVjKFsncm0nLCAnLXYnLCBjb250YWluZXJJZF0pO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIEEgRG9ja2VyIGltYWdlXG4gKi9cbmV4cG9ydCBjbGFzcyBEb2NrZXJJbWFnZSBleHRlbmRzIEJ1bmRsaW5nRG9ja2VySW1hZ2Uge1xuICAvKipcbiAgICogQnVpbGRzIGEgRG9ja2VyIGltYWdlXG4gICAqXG4gICAqIEBwYXJhbSBwYXRoIFRoZSBwYXRoIHRvIHRoZSBkaXJlY3RvcnkgY29udGFpbmluZyB0aGUgRG9ja2VyIGZpbGVcbiAgICogQHBhcmFtIG9wdGlvbnMgRG9ja2VyIGJ1aWxkIG9wdGlvbnNcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZnJvbUJ1aWxkKHBhdGg6IHN0cmluZywgb3B0aW9uczogRG9ja2VyQnVpbGRPcHRpb25zID0ge30pIHtcbiAgICBjb25zdCBidWlsZEFyZ3MgPSBvcHRpb25zLmJ1aWxkQXJncyB8fCB7fTtcblxuICAgIGlmIChvcHRpb25zLmZpbGUgJiYgaXNBYnNvbHV0ZShvcHRpb25zLmZpbGUpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFwiZmlsZVwiIG11c3QgYmUgcmVsYXRpdmUgdG8gdGhlIGRvY2tlciBidWlsZCBkaXJlY3RvcnkuIEdvdCAke29wdGlvbnMuZmlsZX1gKTtcbiAgICB9XG5cbiAgICAvLyBJbWFnZSB0YWcgZGVyaXZlZCBmcm9tIHBhdGggYW5kIGJ1aWxkIG9wdGlvbnNcbiAgICBjb25zdCBpbnB1dCA9IEpTT04uc3RyaW5naWZ5KHsgcGF0aCwgLi4ub3B0aW9ucyB9KTtcbiAgICBjb25zdCB0YWdIYXNoID0gY3J5cHRvLmNyZWF0ZUhhc2goJ3NoYTI1NicpLnVwZGF0ZShpbnB1dCkuZGlnZXN0KCdoZXgnKTtcbiAgICBjb25zdCB0YWcgPSBgY2RrLSR7dGFnSGFzaH1gO1xuXG4gICAgY29uc3QgZG9ja2VyQXJnczogc3RyaW5nW10gPSBbXG4gICAgICAnYnVpbGQnLCAnLXQnLCB0YWcsXG4gICAgICAuLi4ob3B0aW9ucy5maWxlID8gWyctZicsIGpvaW4ocGF0aCwgb3B0aW9ucy5maWxlKV0gOiBbXSksXG4gICAgICAuLi4ob3B0aW9ucy5wbGF0Zm9ybSA/IFsnLS1wbGF0Zm9ybScsIG9wdGlvbnMucGxhdGZvcm1dIDogW10pLFxuICAgICAgLi4uKG9wdGlvbnMudGFyZ2V0U3RhZ2UgPyBbJy0tdGFyZ2V0Jywgb3B0aW9ucy50YXJnZXRTdGFnZV0gOiBbXSksXG4gICAgICAuLi5mbGF0dGVuKE9iamVjdC5lbnRyaWVzKGJ1aWxkQXJncykubWFwKChbaywgdl0pID0+IFsnLS1idWlsZC1hcmcnLCBgJHtrfT0ke3Z9YF0pKSxcbiAgICAgIHBhdGgsXG4gICAgXTtcblxuICAgIGRvY2tlckV4ZWMoZG9ja2VyQXJncyk7XG5cbiAgICAvLyBGaW5nZXJwcmludHMgdGhlIGRpcmVjdG9yeSBjb250YWluaW5nIHRoZSBEb2NrZXJmaWxlIHdlJ3JlIGJ1aWxkaW5nIGFuZFxuICAgIC8vIGRpZmZlcmVudGlhdGVzIHRoZSBmaW5nZXJwcmludCBiYXNlZCBvbiBidWlsZCBhcmd1bWVudHMuIFdlIGRvIHRoaXMgc29cbiAgICAvLyB3ZSBjYW4gcHJvdmlkZSBhIHN0YWJsZSBpbWFnZSBoYXNoLiBPdGhlcndpc2UsIHRoZSBpbWFnZSBJRCB3aWxsIGJlXG4gICAgLy8gZGlmZmVyZW50IGV2ZXJ5IHRpbWUgdGhlIERvY2tlciBsYXllciBjYWNoZSBpcyBjbGVhcmVkLCBkdWUgcHJpbWFyaWx5IHRvXG4gICAgLy8gdGltZXN0YW1wcy5cbiAgICBjb25zdCBoYXNoID0gRmlsZVN5c3RlbS5maW5nZXJwcmludChwYXRoLCB7IGV4dHJhSGFzaDogSlNPTi5zdHJpbmdpZnkob3B0aW9ucykgfSk7XG4gICAgcmV0dXJuIG5ldyBEb2NrZXJJbWFnZSh0YWcsIGhhc2gpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZmVyZW5jZSBhbiBpbWFnZSBvbiBEb2NrZXJIdWIgb3IgYW5vdGhlciBvbmxpbmUgcmVnaXN0cnkuXG4gICAqXG4gICAqIEBwYXJhbSBpbWFnZSB0aGUgaW1hZ2UgbmFtZVxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBvdmVycmlkZSBmcm9tUmVnaXN0cnkoaW1hZ2U6IHN0cmluZykge1xuICAgIHJldHVybiBuZXcgRG9ja2VySW1hZ2UoaW1hZ2UpO1xuICB9XG5cbiAgLyoqIFRoZSBEb2NrZXIgaW1hZ2UgKi9cbiAgcHVibGljIHJlYWRvbmx5IGltYWdlOiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3IoaW1hZ2U6IHN0cmluZywgX2ltYWdlSGFzaD86IHN0cmluZykge1xuICAgIC8vIEl0IGlzIHByZWZlcmFibGUgZm9yIHRoZSBkZXByZWNhdGVkIGNsYXNzIHRvIGluaGVyaXQgYSBub24tZGVwcmVjYXRlZCBjbGFzcy5cbiAgICAvLyBIb3dldmVyLCBpbiB0aGlzIGNhc2UsIHRoZSBvcHBvc2l0ZSBoYXMgb2NjdXJyZWQgd2hpY2ggaXMgaW5jb21wYXRpYmxlIHdpdGhcbiAgICAvLyBhIGRlcHJlY2F0aW9uIGZlYXR1cmUuIFNlZSBodHRwczovL2dpdGh1Yi5jb20vYXdzL2pzaWkvaXNzdWVzLzMxMDIuXG4gICAgY29uc3QgZGVwcmVjYXRlZCA9IHF1aWV0KCk7XG5cbiAgICBzdXBlcihpbWFnZSwgX2ltYWdlSGFzaCk7XG5cbiAgICByZXNldChkZXByZWNhdGVkKTtcbiAgICB0aGlzLmltYWdlID0gaW1hZ2U7XG4gIH1cblxuICAvKipcbiAgICogUHJvdmlkZXMgYSBzdGFibGUgcmVwcmVzZW50YXRpb24gb2YgdGhpcyBpbWFnZSBmb3IgSlNPTiBzZXJpYWxpemF0aW9uLlxuICAgKlxuICAgKiBAcmV0dXJuIFRoZSBvdmVycmlkZGVuIGltYWdlIG5hbWUgaWYgc2V0IG9yIGltYWdlIGhhc2ggbmFtZSBpbiB0aGF0IG9yZGVyXG4gICAqL1xuICBwdWJsaWMgdG9KU09OKCkge1xuICAgIC8vIEl0IGlzIHByZWZlcmFibGUgZm9yIHRoZSBkZXByZWNhdGVkIGNsYXNzIHRvIGluaGVyaXQgYSBub24tZGVwcmVjYXRlZCBjbGFzcy5cbiAgICAvLyBIb3dldmVyLCBpbiB0aGlzIGNhc2UsIHRoZSBvcHBvc2l0ZSBoYXMgb2NjdXJyZWQgd2hpY2ggaXMgaW5jb21wYXRpYmxlIHdpdGhcbiAgICAvLyBhIGRlcHJlY2F0aW9uIGZlYXR1cmUuIFNlZSBodHRwczovL2dpdGh1Yi5jb20vYXdzL2pzaWkvaXNzdWVzLzMxMDIuXG4gICAgY29uc3QgZGVwcmVjYXRlZCA9IHF1aWV0KCk7XG5cbiAgICBjb25zdCBqc29uID0gc3VwZXIudG9KU09OKCk7XG5cbiAgICByZXNldChkZXByZWNhdGVkKTtcbiAgICByZXR1cm4ganNvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBSdW5zIGEgRG9ja2VyIGltYWdlXG4gICAqL1xuICBwdWJsaWMgcnVuKG9wdGlvbnM6IERvY2tlclJ1bk9wdGlvbnMgPSB7fSkge1xuICAgIC8vIEl0IGlzIHByZWZlcmFibGUgZm9yIHRoZSBkZXByZWNhdGVkIGNsYXNzIHRvIGluaGVyaXQgYSBub24tZGVwcmVjYXRlZCBjbGFzcy5cbiAgICAvLyBIb3dldmVyLCBpbiB0aGlzIGNhc2UsIHRoZSBvcHBvc2l0ZSBoYXMgb2NjdXJyZWQgd2hpY2ggaXMgaW5jb21wYXRpYmxlIHdpdGhcbiAgICAvLyBhIGRlcHJlY2F0aW9uIGZlYXR1cmUuIFNlZSBodHRwczovL2dpdGh1Yi5jb20vYXdzL2pzaWkvaXNzdWVzLzMxMDIuXG4gICAgY29uc3QgZGVwcmVjYXRlZCA9IHF1aWV0KCk7XG5cbiAgICBjb25zdCByZXN1bHQgPSBzdXBlci5ydW4ob3B0aW9ucyk7XG5cbiAgICByZXNldChkZXByZWNhdGVkKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgLyoqXG4gICAqIENvcGllcyBhIGZpbGUgb3IgZGlyZWN0b3J5IG91dCBvZiB0aGUgRG9ja2VyIGltYWdlIHRvIHRoZSBsb2NhbCBmaWxlc3lzdGVtLlxuICAgKlxuICAgKiBJZiBgb3V0cHV0UGF0aGAgaXMgb21pdHRlZCB0aGUgZGVzdGluYXRpb24gcGF0aCBpcyBhIHRlbXBvcmFyeSBkaXJlY3RvcnkuXG4gICAqXG4gICAqIEBwYXJhbSBpbWFnZVBhdGggdGhlIHBhdGggaW4gdGhlIERvY2tlciBpbWFnZVxuICAgKiBAcGFyYW0gb3V0cHV0UGF0aCB0aGUgZGVzdGluYXRpb24gcGF0aCBmb3IgdGhlIGNvcHkgb3BlcmF0aW9uXG4gICAqIEByZXR1cm5zIHRoZSBkZXN0aW5hdGlvbiBwYXRoXG4gICAqL1xuICBwdWJsaWMgY3AoaW1hZ2VQYXRoOiBzdHJpbmcsIG91dHB1dFBhdGg/OiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIC8vIEl0IGlzIHByZWZlcmFibGUgZm9yIHRoZSBkZXByZWNhdGVkIGNsYXNzIHRvIGluaGVyaXQgYSBub24tZGVwcmVjYXRlZCBjbGFzcy5cbiAgICAvLyBIb3dldmVyLCBpbiB0aGlzIGNhc2UsIHRoZSBvcHBvc2l0ZSBoYXMgb2NjdXJyZWQgd2hpY2ggaXMgaW5jb21wYXRpYmxlIHdpdGhcbiAgICAvLyBhIGRlcHJlY2F0aW9uIGZlYXR1cmUuIFNlZSBodHRwczovL2dpdGh1Yi5jb20vYXdzL2pzaWkvaXNzdWVzLzMxMDIuXG4gICAgY29uc3QgZGVwcmVjYXRlZCA9IHF1aWV0KCk7XG5cbiAgICBjb25zdCByZXN1bHQgPSBzdXBlci5jcChpbWFnZVBhdGgsIG91dHB1dFBhdGgpO1xuXG4gICAgcmVzZXQoZGVwcmVjYXRlZCk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuXG4vKipcbiAqIEEgRG9ja2VyIHZvbHVtZVxuICovXG5leHBvcnQgaW50ZXJmYWNlIERvY2tlclZvbHVtZSB7XG4gIC8qKlxuICAgKiBUaGUgcGF0aCB0byB0aGUgZmlsZSBvciBkaXJlY3Rvcnkgb24gdGhlIGhvc3QgbWFjaGluZVxuICAgKi9cbiAgcmVhZG9ubHkgaG9zdFBhdGg6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIHBhdGggd2hlcmUgdGhlIGZpbGUgb3IgZGlyZWN0b3J5IGlzIG1vdW50ZWQgaW4gdGhlIGNvbnRhaW5lclxuICAgKi9cbiAgcmVhZG9ubHkgY29udGFpbmVyUGF0aDogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBNb3VudCBjb25zaXN0ZW5jeS4gT25seSBhcHBsaWNhYmxlIGZvciBtYWNPU1xuICAgKlxuICAgKiBAZGVmYXVsdCBEb2NrZXJDb25zaXN0ZW5jeS5ERUxFR0FURURcbiAgICogQHNlZSBodHRwczovL2RvY3MuZG9ja2VyLmNvbS9zdG9yYWdlL2JpbmQtbW91bnRzLyNjb25maWd1cmUtbW91bnQtY29uc2lzdGVuY3ktZm9yLW1hY29zXG4gICAqL1xuICByZWFkb25seSBjb25zaXN0ZW5jeT86IERvY2tlclZvbHVtZUNvbnNpc3RlbmN5O1xufVxuXG4vKipcbiAqIFN1cHBvcnRlZCBEb2NrZXIgdm9sdW1lIGNvbnNpc3RlbmN5IHR5cGVzLiBPbmx5IHZhbGlkIG9uIG1hY09TIGR1ZSB0byB0aGUgd2F5IGZpbGUgc3RvcmFnZSB3b3JrcyBvbiBNYWNcbiAqL1xuZXhwb3J0IGVudW0gRG9ja2VyVm9sdW1lQ29uc2lzdGVuY3kge1xuICAvKipcbiAgICogUmVhZC93cml0ZSBvcGVyYXRpb25zIGluc2lkZSB0aGUgRG9ja2VyIGNvbnRhaW5lciBhcmUgYXBwbGllZCBpbW1lZGlhdGVseSBvbiB0aGUgbW91bnRlZCBob3N0IG1hY2hpbmUgdm9sdW1lc1xuICAgKi9cbiAgQ09OU0lTVEVOVCA9ICdjb25zaXN0ZW50JyxcbiAgLyoqXG4gICAqIFJlYWQvd3JpdGUgb3BlcmF0aW9ucyBvbiBtb3VudGVkIERvY2tlciB2b2x1bWVzIGFyZSBmaXJzdCB3cml0dGVuIGluc2lkZSB0aGUgY29udGFpbmVyIGFuZCB0aGVuIHN5bmNocm9uaXplZCB0byB0aGUgaG9zdCBtYWNoaW5lXG4gICAqL1xuICBERUxFR0FURUQgPSAnZGVsZWdhdGVkJyxcbiAgLyoqXG4gICAqIFJlYWQvd3JpdGUgb3BlcmF0aW9ucyBvbiBtb3VudGVkIERvY2tlciB2b2x1bWVzIGFyZSBmaXJzdCBhcHBsaWVkIG9uIHRoZSBob3N0IG1hY2hpbmUgYW5kIHRoZW4gc3luY2hyb25pemVkIHRvIHRoZSBjb250YWluZXJcbiAgICovXG4gIENBQ0hFRCA9ICdjYWNoZWQnLFxufVxuXG4vKipcbiAqIERvY2tlciBydW4gb3B0aW9uc1xuICovXG5leHBvcnQgaW50ZXJmYWNlIERvY2tlclJ1bk9wdGlvbnMge1xuICAvKipcbiAgICogVGhlIGVudHJ5cG9pbnQgdG8gcnVuIGluIHRoZSBjb250YWluZXIuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gcnVuIHRoZSBlbnRyeXBvaW50IGRlZmluZWQgaW4gdGhlIGltYWdlXG4gICAqL1xuICByZWFkb25seSBlbnRyeXBvaW50Pzogc3RyaW5nW107XG5cbiAgLyoqXG4gICAqIFRoZSBjb21tYW5kIHRvIHJ1biBpbiB0aGUgY29udGFpbmVyLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIHJ1biB0aGUgY29tbWFuZCBkZWZpbmVkIGluIHRoZSBpbWFnZVxuICAgKi9cbiAgcmVhZG9ubHkgY29tbWFuZD86IHN0cmluZ1tdO1xuXG4gIC8qKlxuICAgKiBEb2NrZXIgdm9sdW1lcyB0byBtb3VudC5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBubyB2b2x1bWVzIGFyZSBtb3VudGVkXG4gICAqL1xuICByZWFkb25seSB2b2x1bWVzPzogRG9ja2VyVm9sdW1lW107XG5cbiAgLyoqXG4gICAqIFdoZXJlIHRvIG1vdW50IHRoZSBzcGVjaWZpZWQgdm9sdW1lcyBmcm9tXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmRvY2tlci5jb20vZW5naW5lL3JlZmVyZW5jZS9jb21tYW5kbGluZS9ydW4vI21vdW50LXZvbHVtZXMtZnJvbS1jb250YWluZXItLS12b2x1bWVzLWZyb21cbiAgICogQGRlZmF1bHQgLSBubyBjb250YWluZXJzIGFyZSBzcGVjaWZpZWQgdG8gbW91bnQgdm9sdW1lcyBmcm9tXG4gICAqL1xuICByZWFkb25seSB2b2x1bWVzRnJvbT86IHN0cmluZ1tdO1xuXG4gIC8qKlxuICAgKiBUaGUgZW52aXJvbm1lbnQgdmFyaWFibGVzIHRvIHBhc3MgdG8gdGhlIGNvbnRhaW5lci5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBubyBlbnZpcm9ubWVudCB2YXJpYWJsZXMuXG4gICAqL1xuICByZWFkb25seSBlbnZpcm9ubWVudD86IHsgW2tleTogc3RyaW5nXTogc3RyaW5nOyB9O1xuXG4gIC8qKlxuICAgKiBXb3JraW5nIGRpcmVjdG9yeSBpbnNpZGUgdGhlIGNvbnRhaW5lci5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBpbWFnZSBkZWZhdWx0XG4gICAqL1xuICByZWFkb25seSB3b3JraW5nRGlyZWN0b3J5Pzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgdXNlciB0byB1c2Ugd2hlbiBydW5uaW5nIHRoZSBjb250YWluZXIuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gcm9vdCBvciBpbWFnZSBkZWZhdWx0XG4gICAqL1xuICByZWFkb25seSB1c2VyPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBbU2VjdXJpdHkgY29uZmlndXJhdGlvbl0oaHR0cHM6Ly9kb2NzLmRvY2tlci5jb20vZW5naW5lL3JlZmVyZW5jZS9ydW4vI3NlY3VyaXR5LWNvbmZpZ3VyYXRpb24pXG4gICAqIHdoZW4gcnVubmluZyB0aGUgZG9ja2VyIGNvbnRhaW5lci5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBubyBzZWN1cml0eSBvcHRpb25zXG4gICAqL1xuICByZWFkb25seSBzZWN1cml0eU9wdD86IHN0cmluZztcblxuICAvKipcbiAgICogRG9ja2VyIFtOZXR3b3JraW5nIG9wdGlvbnNdKGh0dHBzOi8vZG9jcy5kb2NrZXIuY29tL2VuZ2luZS9yZWZlcmVuY2UvY29tbWFuZGxpbmUvcnVuLyNjb25uZWN0LWEtY29udGFpbmVyLXRvLWEtbmV0d29yay0tLW5ldHdvcmspXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gbm8gbmV0d29ya2luZyBvcHRpb25zXG4gICAqL1xuICByZWFkb25seSBuZXR3b3JrPzogc3RyaW5nO1xufVxuXG4vKipcbiAqIERvY2tlciBidWlsZCBvcHRpb25zXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgRG9ja2VyQnVpbGRPcHRpb25zIHtcbiAgLyoqXG4gICAqIEJ1aWxkIGFyZ3NcbiAgICpcbiAgICogQGRlZmF1bHQgLSBubyBidWlsZCBhcmdzXG4gICAqL1xuICByZWFkb25seSBidWlsZEFyZ3M/OiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB9O1xuXG4gIC8qKlxuICAgKiBOYW1lIG9mIHRoZSBEb2NrZXJmaWxlLCBtdXN0IHJlbGF0aXZlIHRvIHRoZSBkb2NrZXIgYnVpbGQgcGF0aC5cbiAgICpcbiAgICogQGRlZmF1bHQgYERvY2tlcmZpbGVgXG4gICAqL1xuICByZWFkb25seSBmaWxlPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBTZXQgcGxhdGZvcm0gaWYgc2VydmVyIGlzIG11bHRpLXBsYXRmb3JtIGNhcGFibGUuIF9SZXF1aXJlcyBEb2NrZXIgRW5naW5lIEFQSSB2MS4zOCtfLlxuICAgKlxuICAgKiBFeGFtcGxlIHZhbHVlOiBgbGludXgvYW1kNjRgXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gbm8gcGxhdGZvcm0gc3BlY2lmaWVkXG4gICAqL1xuICByZWFkb25seSBwbGF0Zm9ybT86IHN0cmluZztcblxuICAvKipcbiAgICogU2V0IGJ1aWxkIHRhcmdldCBmb3IgbXVsdGktc3RhZ2UgY29udGFpbmVyIGJ1aWxkcy4gQW55IHN0YWdlIGRlZmluZWQgYWZ0ZXJ3YXJkcyB3aWxsIGJlIGlnbm9yZWQuXG4gICAqXG4gICAqIEV4YW1wbGUgdmFsdWU6IGBidWlsZC1lbnZgXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gQnVpbGQgYWxsIHN0YWdlcyBkZWZpbmVkIGluIHRoZSBEb2NrZXJmaWxlXG4gICAqL1xuICByZWFkb25seSB0YXJnZXRTdGFnZT86IHN0cmluZztcbn1cblxuZnVuY3Rpb24gZmxhdHRlbih4OiBzdHJpbmdbXVtdKSB7XG4gIHJldHVybiBBcnJheS5wcm90b3R5cGUuY29uY2F0KFtdLCAuLi54KTtcbn1cblxuZnVuY3Rpb24gaXNTZUxpbnV4KCkgOiBib29sZWFuIHtcbiAgaWYgKHByb2Nlc3MucGxhdGZvcm0gIT0gJ2xpbnV4Jykge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBjb25zdCBwcm9nID0gJ3NlbGludXhlbmFibGVkJztcbiAgY29uc3QgcHJvYyA9IHNwYXduU3luYyhwcm9nLCBbXSwge1xuICAgIHN0ZGlvOiBbIC8vIHNob3cgc2VsaW51eCBzdGF0dXMgb3V0cHV0XG4gICAgICAncGlwZScsIC8vIGdldCB2YWx1ZSBvZiBzdGRpb1xuICAgICAgcHJvY2Vzcy5zdGRlcnIsIC8vIHJlZGlyZWN0IHN0ZG91dCB0byBzdGRlcnJcbiAgICAgICdpbmhlcml0JywgLy8gaW5oZXJpdCBzdGRlcnJcbiAgICBdLFxuICB9KTtcbiAgaWYgKHByb2MuZXJyb3IpIHtcbiAgICAvLyBzZWxpbnV4ZW5hYmxlZCBub3QgYSB2YWxpZCBjb21tYW5kLCB0aGVyZWZvcmUgbm90IGVuYWJsZWRcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgaWYgKHByb2Muc3RhdHVzID09IDApIHtcbiAgICAvLyBzZWxpbnV4IGVuYWJsZWRcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSBlbHNlIHtcbiAgICAvLyBzZWxpbnV4IG5vdCBlbmFibGVkXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG4iXX0=