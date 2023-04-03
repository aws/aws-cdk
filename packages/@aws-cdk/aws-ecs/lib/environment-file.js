"use strict";
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnvironmentFileType = exports.S3EnvironmentFile = exports.AssetEnvironmentFile = exports.EnvironmentFile = void 0;
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const aws_s3_assets_1 = require("@aws-cdk/aws-s3-assets");
/**
 * Constructs for types of environment files
 */
class EnvironmentFile {
    /**
     * Loads the environment file from a local disk path.
     *
     * @param path Local disk path
     * @param options
     */
    static fromAsset(path, options) {
        return new AssetEnvironmentFile(path, options);
    }
    /**
     * Loads the environment file from an S3 bucket.
     *
     * @returns `S3EnvironmentFile` associated with the specified S3 object.
     * @param bucket The S3 bucket
     * @param key The object key
     * @param objectVersion Optional S3 object version
     */
    static fromBucket(bucket, key, objectVersion) {
        return new S3EnvironmentFile(bucket, key, objectVersion);
    }
}
exports.EnvironmentFile = EnvironmentFile;
_a = JSII_RTTI_SYMBOL_1;
EnvironmentFile[_a] = { fqn: "@aws-cdk/aws-ecs.EnvironmentFile", version: "0.0.0" };
/**
 * Environment file from a local directory.
 */
class AssetEnvironmentFile extends EnvironmentFile {
    /**
     * @param path The path to the asset file or directory.
     * @param options
     */
    constructor(path, options = {}) {
        super();
        this.path = path;
        this.options = options;
    }
    bind(scope) {
        // If the same AssetCode is used multiple times, retain only the first instantiation.
        if (!this.asset) {
            this.asset = new aws_s3_assets_1.Asset(scope, 'EnvironmentFile', {
                path: this.path,
                ...this.options,
            });
        }
        if (!this.asset.isFile) {
            throw new Error(`Asset must be a single file (${this.path})`);
        }
        return {
            fileType: EnvironmentFileType.S3,
            s3Location: {
                bucketName: this.asset.s3BucketName,
                objectKey: this.asset.s3ObjectKey,
            },
        };
    }
}
exports.AssetEnvironmentFile = AssetEnvironmentFile;
_b = JSII_RTTI_SYMBOL_1;
AssetEnvironmentFile[_b] = { fqn: "@aws-cdk/aws-ecs.AssetEnvironmentFile", version: "0.0.0" };
/**
 * Environment file from S3.
 */
class S3EnvironmentFile extends EnvironmentFile {
    constructor(bucket, key, objectVersion) {
        super();
        this.key = key;
        this.objectVersion = objectVersion;
        if (!bucket.bucketName) {
            throw new Error('bucketName is undefined for the provided bucket');
        }
        this.bucketName = bucket.bucketName;
    }
    bind(_scope) {
        return {
            fileType: EnvironmentFileType.S3,
            s3Location: {
                bucketName: this.bucketName,
                objectKey: this.key,
                objectVersion: this.objectVersion,
            },
        };
    }
}
exports.S3EnvironmentFile = S3EnvironmentFile;
_c = JSII_RTTI_SYMBOL_1;
S3EnvironmentFile[_c] = { fqn: "@aws-cdk/aws-ecs.S3EnvironmentFile", version: "0.0.0" };
/**
 * Type of environment file to be included in the container definition
 */
var EnvironmentFileType;
(function (EnvironmentFileType) {
    /**
     * Environment file hosted on S3, referenced by object ARN
     */
    EnvironmentFileType["S3"] = "s3";
})(EnvironmentFileType = exports.EnvironmentFileType || (exports.EnvironmentFileType = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW52aXJvbm1lbnQtZmlsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImVudmlyb25tZW50LWZpbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFDQSwwREFBNkQ7QUFHN0Q7O0dBRUc7QUFDSCxNQUFzQixlQUFlO0lBQ25DOzs7OztPQUtHO0lBQ0ksTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFZLEVBQUUsT0FBc0I7UUFDMUQsT0FBTyxJQUFJLG9CQUFvQixDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztLQUNoRDtJQUVEOzs7Ozs7O09BT0c7SUFDSSxNQUFNLENBQUMsVUFBVSxDQUFDLE1BQWUsRUFBRSxHQUFXLEVBQUUsYUFBc0I7UUFDM0UsT0FBTyxJQUFJLGlCQUFpQixDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUUsYUFBYSxDQUFDLENBQUM7S0FDMUQ7O0FBckJILDBDQThCQzs7O0FBRUQ7O0dBRUc7QUFDSCxNQUFhLG9CQUFxQixTQUFRLGVBQWU7SUFHdkQ7OztPQUdHO0lBQ0gsWUFBNEIsSUFBWSxFQUFtQixVQUF3QixFQUFHO1FBQ3BGLEtBQUssRUFBRSxDQUFDO1FBRGtCLFNBQUksR0FBSixJQUFJLENBQVE7UUFBbUIsWUFBTyxHQUFQLE9BQU8sQ0FBb0I7S0FFckY7SUFFTSxJQUFJLENBQUMsS0FBZ0I7UUFDMUIscUZBQXFGO1FBQ3JGLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFO1lBQ2YsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLHFCQUFLLENBQUMsS0FBSyxFQUFFLGlCQUFpQixFQUFFO2dCQUMvQyxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUk7Z0JBQ2YsR0FBRyxJQUFJLENBQUMsT0FBTzthQUNoQixDQUFDLENBQUM7U0FDSjtRQUVELElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRTtZQUN0QixNQUFNLElBQUksS0FBSyxDQUFDLGdDQUFnQyxJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQztTQUMvRDtRQUVELE9BQU87WUFDTCxRQUFRLEVBQUUsbUJBQW1CLENBQUMsRUFBRTtZQUNoQyxVQUFVLEVBQUU7Z0JBQ1YsVUFBVSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWTtnQkFDbkMsU0FBUyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVzthQUNsQztTQUNGLENBQUM7S0FDSDs7QUEvQkgsb0RBZ0NDOzs7QUFFRDs7R0FFRztBQUNILE1BQWEsaUJBQWtCLFNBQVEsZUFBZTtJQUdwRCxZQUFZLE1BQWUsRUFBVSxHQUFXLEVBQVUsYUFBc0I7UUFDOUUsS0FBSyxFQUFFLENBQUM7UUFEMkIsUUFBRyxHQUFILEdBQUcsQ0FBUTtRQUFVLGtCQUFhLEdBQWIsYUFBYSxDQUFTO1FBRzlFLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFO1lBQ3RCLE1BQU0sSUFBSSxLQUFLLENBQUMsaURBQWlELENBQUMsQ0FBQztTQUNwRTtRQUVELElBQUksQ0FBQyxVQUFVLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQztLQUNyQztJQUVNLElBQUksQ0FBQyxNQUFpQjtRQUMzQixPQUFPO1lBQ0wsUUFBUSxFQUFFLG1CQUFtQixDQUFDLEVBQUU7WUFDaEMsVUFBVSxFQUFFO2dCQUNWLFVBQVUsRUFBRSxJQUFJLENBQUMsVUFBVTtnQkFDM0IsU0FBUyxFQUFFLElBQUksQ0FBQyxHQUFHO2dCQUNuQixhQUFhLEVBQUUsSUFBSSxDQUFDLGFBQWE7YUFDbEM7U0FDRixDQUFDO0tBQ0g7O0FBdEJILDhDQXVCQzs7O0FBaUJEOztHQUVHO0FBQ0gsSUFBWSxtQkFLWDtBQUxELFdBQVksbUJBQW1CO0lBQzdCOztPQUVHO0lBQ0gsZ0NBQVMsQ0FBQTtBQUNYLENBQUMsRUFMVyxtQkFBbUIsR0FBbkIsMkJBQW1CLEtBQW5CLDJCQUFtQixRQUs5QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IElCdWNrZXQsIExvY2F0aW9uIH0gZnJvbSAnQGF3cy1jZGsvYXdzLXMzJztcbmltcG9ydCB7IEFzc2V0LCBBc3NldE9wdGlvbnMgfSBmcm9tICdAYXdzLWNkay9hd3MtczMtYXNzZXRzJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuXG4vKipcbiAqIENvbnN0cnVjdHMgZm9yIHR5cGVzIG9mIGVudmlyb25tZW50IGZpbGVzXG4gKi9cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBFbnZpcm9ubWVudEZpbGUge1xuICAvKipcbiAgICogTG9hZHMgdGhlIGVudmlyb25tZW50IGZpbGUgZnJvbSBhIGxvY2FsIGRpc2sgcGF0aC5cbiAgICpcbiAgICogQHBhcmFtIHBhdGggTG9jYWwgZGlzayBwYXRoXG4gICAqIEBwYXJhbSBvcHRpb25zXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21Bc3NldChwYXRoOiBzdHJpbmcsIG9wdGlvbnM/OiBBc3NldE9wdGlvbnMpOiBBc3NldEVudmlyb25tZW50RmlsZSB7XG4gICAgcmV0dXJuIG5ldyBBc3NldEVudmlyb25tZW50RmlsZShwYXRoLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBMb2FkcyB0aGUgZW52aXJvbm1lbnQgZmlsZSBmcm9tIGFuIFMzIGJ1Y2tldC5cbiAgICpcbiAgICogQHJldHVybnMgYFMzRW52aXJvbm1lbnRGaWxlYCBhc3NvY2lhdGVkIHdpdGggdGhlIHNwZWNpZmllZCBTMyBvYmplY3QuXG4gICAqIEBwYXJhbSBidWNrZXQgVGhlIFMzIGJ1Y2tldFxuICAgKiBAcGFyYW0ga2V5IFRoZSBvYmplY3Qga2V5XG4gICAqIEBwYXJhbSBvYmplY3RWZXJzaW9uIE9wdGlvbmFsIFMzIG9iamVjdCB2ZXJzaW9uXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21CdWNrZXQoYnVja2V0OiBJQnVja2V0LCBrZXk6IHN0cmluZywgb2JqZWN0VmVyc2lvbj86IHN0cmluZyk6IFMzRW52aXJvbm1lbnRGaWxlIHtcbiAgICByZXR1cm4gbmV3IFMzRW52aXJvbm1lbnRGaWxlKGJ1Y2tldCwga2V5LCBvYmplY3RWZXJzaW9uKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiB0aGUgY29udGFpbmVyIGlzIGluaXRpYWxpemVkIHRvIGFsbG93IHRoaXMgb2JqZWN0IHRvIGJpbmRcbiAgICogdG8gdGhlIHN0YWNrLlxuICAgKlxuICAgKiBAcGFyYW0gc2NvcGUgVGhlIGJpbmRpbmcgc2NvcGVcbiAgICovXG4gIHB1YmxpYyBhYnN0cmFjdCBiaW5kKHNjb3BlOiBDb25zdHJ1Y3QpOiBFbnZpcm9ubWVudEZpbGVDb25maWc7XG59XG5cbi8qKlxuICogRW52aXJvbm1lbnQgZmlsZSBmcm9tIGEgbG9jYWwgZGlyZWN0b3J5LlxuICovXG5leHBvcnQgY2xhc3MgQXNzZXRFbnZpcm9ubWVudEZpbGUgZXh0ZW5kcyBFbnZpcm9ubWVudEZpbGUge1xuICBwcml2YXRlIGFzc2V0PzogQXNzZXQ7XG5cbiAgLyoqXG4gICAqIEBwYXJhbSBwYXRoIFRoZSBwYXRoIHRvIHRoZSBhc3NldCBmaWxlIG9yIGRpcmVjdG9yeS5cbiAgICogQHBhcmFtIG9wdGlvbnNcbiAgICovXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyByZWFkb25seSBwYXRoOiBzdHJpbmcsIHByaXZhdGUgcmVhZG9ubHkgb3B0aW9uczogQXNzZXRPcHRpb25zID0geyB9KSB7XG4gICAgc3VwZXIoKTtcbiAgfVxuXG4gIHB1YmxpYyBiaW5kKHNjb3BlOiBDb25zdHJ1Y3QpOiBFbnZpcm9ubWVudEZpbGVDb25maWcge1xuICAgIC8vIElmIHRoZSBzYW1lIEFzc2V0Q29kZSBpcyB1c2VkIG11bHRpcGxlIHRpbWVzLCByZXRhaW4gb25seSB0aGUgZmlyc3QgaW5zdGFudGlhdGlvbi5cbiAgICBpZiAoIXRoaXMuYXNzZXQpIHtcbiAgICAgIHRoaXMuYXNzZXQgPSBuZXcgQXNzZXQoc2NvcGUsICdFbnZpcm9ubWVudEZpbGUnLCB7XG4gICAgICAgIHBhdGg6IHRoaXMucGF0aCxcbiAgICAgICAgLi4udGhpcy5vcHRpb25zLFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLmFzc2V0LmlzRmlsZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBBc3NldCBtdXN0IGJlIGEgc2luZ2xlIGZpbGUgKCR7dGhpcy5wYXRofSlgKTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgZmlsZVR5cGU6IEVudmlyb25tZW50RmlsZVR5cGUuUzMsXG4gICAgICBzM0xvY2F0aW9uOiB7XG4gICAgICAgIGJ1Y2tldE5hbWU6IHRoaXMuYXNzZXQuczNCdWNrZXROYW1lLFxuICAgICAgICBvYmplY3RLZXk6IHRoaXMuYXNzZXQuczNPYmplY3RLZXksXG4gICAgICB9LFxuICAgIH07XG4gIH1cbn1cblxuLyoqXG4gKiBFbnZpcm9ubWVudCBmaWxlIGZyb20gUzMuXG4gKi9cbmV4cG9ydCBjbGFzcyBTM0Vudmlyb25tZW50RmlsZSBleHRlbmRzIEVudmlyb25tZW50RmlsZSB7XG4gIHByaXZhdGUgcmVhZG9ubHkgYnVja2V0TmFtZTogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKGJ1Y2tldDogSUJ1Y2tldCwgcHJpdmF0ZSBrZXk6IHN0cmluZywgcHJpdmF0ZSBvYmplY3RWZXJzaW9uPzogc3RyaW5nKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIGlmICghYnVja2V0LmJ1Y2tldE5hbWUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignYnVja2V0TmFtZSBpcyB1bmRlZmluZWQgZm9yIHRoZSBwcm92aWRlZCBidWNrZXQnKTtcbiAgICB9XG5cbiAgICB0aGlzLmJ1Y2tldE5hbWUgPSBidWNrZXQuYnVja2V0TmFtZTtcbiAgfVxuXG4gIHB1YmxpYyBiaW5kKF9zY29wZTogQ29uc3RydWN0KTogRW52aXJvbm1lbnRGaWxlQ29uZmlnIHtcbiAgICByZXR1cm4ge1xuICAgICAgZmlsZVR5cGU6IEVudmlyb25tZW50RmlsZVR5cGUuUzMsXG4gICAgICBzM0xvY2F0aW9uOiB7XG4gICAgICAgIGJ1Y2tldE5hbWU6IHRoaXMuYnVja2V0TmFtZSxcbiAgICAgICAgb2JqZWN0S2V5OiB0aGlzLmtleSxcbiAgICAgICAgb2JqZWN0VmVyc2lvbjogdGhpcy5vYmplY3RWZXJzaW9uLFxuICAgICAgfSxcbiAgICB9O1xuICB9XG59XG5cbi8qKlxuICogQ29uZmlndXJhdGlvbiBmb3IgdGhlIGVudmlyb25tZW50IGZpbGVcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBFbnZpcm9ubWVudEZpbGVDb25maWcge1xuICAvKipcbiAgICogVGhlIHR5cGUgb2YgZW52aXJvbm1lbnQgZmlsZVxuICAgKi9cbiAgcmVhZG9ubHkgZmlsZVR5cGU6IEVudmlyb25tZW50RmlsZVR5cGU7XG5cbiAgLyoqXG4gICAqIFRoZSBsb2NhdGlvbiBvZiB0aGUgZW52aXJvbm1lbnQgZmlsZSBpbiBTM1xuICAgKi9cbiAgcmVhZG9ubHkgczNMb2NhdGlvbjogTG9jYXRpb247XG59XG5cbi8qKlxuICogVHlwZSBvZiBlbnZpcm9ubWVudCBmaWxlIHRvIGJlIGluY2x1ZGVkIGluIHRoZSBjb250YWluZXIgZGVmaW5pdGlvblxuICovXG5leHBvcnQgZW51bSBFbnZpcm9ubWVudEZpbGVUeXBlIHtcbiAgLyoqXG4gICAqIEVudmlyb25tZW50IGZpbGUgaG9zdGVkIG9uIFMzLCByZWZlcmVuY2VkIGJ5IG9iamVjdCBBUk5cbiAgICovXG4gIFMzID0gJ3MzJyxcbn1cbiJdfQ==