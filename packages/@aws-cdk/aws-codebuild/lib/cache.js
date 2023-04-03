"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cache = exports.LocalCacheMode = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const core_1 = require("@aws-cdk/core");
/**
 * Local cache modes to enable for the CodeBuild Project
 */
var LocalCacheMode;
(function (LocalCacheMode) {
    /**
     * Caches Git metadata for primary and secondary sources
     */
    LocalCacheMode["SOURCE"] = "LOCAL_SOURCE_CACHE";
    /**
     * Caches existing Docker layers
     */
    LocalCacheMode["DOCKER_LAYER"] = "LOCAL_DOCKER_LAYER_CACHE";
    /**
     * Caches directories you specify in the buildspec file
     */
    LocalCacheMode["CUSTOM"] = "LOCAL_CUSTOM_CACHE";
})(LocalCacheMode = exports.LocalCacheMode || (exports.LocalCacheMode = {}));
/**
 * Cache options for CodeBuild Project.
 * A cache can store reusable pieces of your build environment and use them across multiple builds.
 * @see https://docs.aws.amazon.com/codebuild/latest/userguide/build-caching.html
 */
class Cache {
    static none() {
        return {
            _toCloudFormation() {
                return { type: 'NO_CACHE' };
            },
            _bind() {
            },
        };
    }
    /**
     * Create a local caching strategy.
     * @param modes the mode(s) to enable for local caching
     */
    static local(...modes) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_codebuild_LocalCacheMode(modes);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.local);
            }
            throw error;
        }
        return {
            _toCloudFormation: () => ({
                type: 'LOCAL',
                modes,
            }),
            _bind: () => { return; },
        };
    }
    /**
     * Create an S3 caching strategy.
     * @param bucket the S3 bucket to use for caching
     * @param options additional options to pass to the S3 caching
     */
    static bucket(bucket, options) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_codebuild_BucketCacheOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.bucket);
            }
            throw error;
        }
        return {
            _toCloudFormation: () => ({
                type: 'S3',
                location: core_1.Fn.join('/', [bucket.bucketName, options && options.prefix || core_1.Aws.NO_VALUE]),
            }),
            _bind: (project) => {
                bucket.grantReadWrite(project);
            },
        };
    }
}
exports.Cache = Cache;
_a = JSII_RTTI_SYMBOL_1;
Cache[_a] = { fqn: "@aws-cdk/aws-codebuild.Cache", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FjaGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjYWNoZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFDQSx3Q0FBd0M7QUFXeEM7O0dBRUc7QUFDSCxJQUFZLGNBZVg7QUFmRCxXQUFZLGNBQWM7SUFDeEI7O09BRUc7SUFDSCwrQ0FBNkIsQ0FBQTtJQUU3Qjs7T0FFRztJQUNILDJEQUF5QyxDQUFBO0lBRXpDOztPQUVHO0lBQ0gsK0NBQTZCLENBQUE7QUFDL0IsQ0FBQyxFQWZXLGNBQWMsR0FBZCxzQkFBYyxLQUFkLHNCQUFjLFFBZXpCO0FBRUQ7Ozs7R0FJRztBQUNILE1BQXNCLEtBQUs7SUFDbEIsTUFBTSxDQUFDLElBQUk7UUFDaEIsT0FBTztZQUNMLGlCQUFpQjtnQkFDZixPQUFPLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxDQUFDO1lBQzlCLENBQUM7WUFDRCxLQUFLO1lBQ0wsQ0FBQztTQUNGLENBQUM7S0FDSDtJQUVEOzs7T0FHRztJQUNJLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxLQUF1Qjs7Ozs7Ozs7OztRQUM1QyxPQUFPO1lBQ0wsaUJBQWlCLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztnQkFDeEIsSUFBSSxFQUFFLE9BQU87Z0JBQ2IsS0FBSzthQUNOLENBQUM7WUFDRixLQUFLLEVBQUUsR0FBRyxFQUFFLEdBQUcsT0FBTyxDQUFDLENBQUM7U0FDekIsQ0FBQztLQUNIO0lBRUQ7Ozs7T0FJRztJQUNJLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBZSxFQUFFLE9BQTRCOzs7Ozs7Ozs7O1FBQ2hFLE9BQU87WUFDTCxpQkFBaUIsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO2dCQUN4QixJQUFJLEVBQUUsSUFBSTtnQkFDVixRQUFRLEVBQUUsU0FBRSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFLE9BQU8sSUFBSSxPQUFPLENBQUMsTUFBTSxJQUFJLFVBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQzthQUN2RixDQUFDO1lBQ0YsS0FBSyxFQUFFLENBQUMsT0FBTyxFQUFFLEVBQUU7Z0JBQ2pCLE1BQU0sQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDakMsQ0FBQztTQUNGLENBQUM7S0FDSDs7QUF4Q0gsc0JBbURDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSUJ1Y2tldCB9IGZyb20gJ0Bhd3MtY2RrL2F3cy1zMyc7XG5pbXBvcnQgeyBBd3MsIEZuIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBDZm5Qcm9qZWN0IH0gZnJvbSAnLi9jb2RlYnVpbGQuZ2VuZXJhdGVkJztcbmltcG9ydCB7IElQcm9qZWN0IH0gZnJvbSAnLi9wcm9qZWN0JztcblxuZXhwb3J0IGludGVyZmFjZSBCdWNrZXRDYWNoZU9wdGlvbnMge1xuICAvKipcbiAgICogVGhlIHByZWZpeCB0byB1c2UgdG8gc3RvcmUgdGhlIGNhY2hlIGluIHRoZSBidWNrZXRcbiAgICovXG4gIHJlYWRvbmx5IHByZWZpeD86IHN0cmluZztcbn1cblxuLyoqXG4gKiBMb2NhbCBjYWNoZSBtb2RlcyB0byBlbmFibGUgZm9yIHRoZSBDb2RlQnVpbGQgUHJvamVjdFxuICovXG5leHBvcnQgZW51bSBMb2NhbENhY2hlTW9kZSB7XG4gIC8qKlxuICAgKiBDYWNoZXMgR2l0IG1ldGFkYXRhIGZvciBwcmltYXJ5IGFuZCBzZWNvbmRhcnkgc291cmNlc1xuICAgKi9cbiAgU09VUkNFID0gJ0xPQ0FMX1NPVVJDRV9DQUNIRScsXG5cbiAgLyoqXG4gICAqIENhY2hlcyBleGlzdGluZyBEb2NrZXIgbGF5ZXJzXG4gICAqL1xuICBET0NLRVJfTEFZRVIgPSAnTE9DQUxfRE9DS0VSX0xBWUVSX0NBQ0hFJyxcblxuICAvKipcbiAgICogQ2FjaGVzIGRpcmVjdG9yaWVzIHlvdSBzcGVjaWZ5IGluIHRoZSBidWlsZHNwZWMgZmlsZVxuICAgKi9cbiAgQ1VTVE9NID0gJ0xPQ0FMX0NVU1RPTV9DQUNIRScsXG59XG5cbi8qKlxuICogQ2FjaGUgb3B0aW9ucyBmb3IgQ29kZUJ1aWxkIFByb2plY3QuXG4gKiBBIGNhY2hlIGNhbiBzdG9yZSByZXVzYWJsZSBwaWVjZXMgb2YgeW91ciBidWlsZCBlbnZpcm9ubWVudCBhbmQgdXNlIHRoZW0gYWNyb3NzIG11bHRpcGxlIGJ1aWxkcy5cbiAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2NvZGVidWlsZC9sYXRlc3QvdXNlcmd1aWRlL2J1aWxkLWNhY2hpbmcuaHRtbFxuICovXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgQ2FjaGUge1xuICBwdWJsaWMgc3RhdGljIG5vbmUoKTogQ2FjaGUge1xuICAgIHJldHVybiB7XG4gICAgICBfdG9DbG91ZEZvcm1hdGlvbigpOiBDZm5Qcm9qZWN0LlByb2plY3RDYWNoZVByb3BlcnR5IHwgdW5kZWZpbmVkIHtcbiAgICAgICAgcmV0dXJuIHsgdHlwZTogJ05PX0NBQ0hFJyB9O1xuICAgICAgfSxcbiAgICAgIF9iaW5kKCk6IHZvaWQge1xuICAgICAgfSxcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIGxvY2FsIGNhY2hpbmcgc3RyYXRlZ3kuXG4gICAqIEBwYXJhbSBtb2RlcyB0aGUgbW9kZShzKSB0byBlbmFibGUgZm9yIGxvY2FsIGNhY2hpbmdcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgbG9jYWwoLi4ubW9kZXM6IExvY2FsQ2FjaGVNb2RlW10pOiBDYWNoZSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIF90b0Nsb3VkRm9ybWF0aW9uOiAoKSA9PiAoe1xuICAgICAgICB0eXBlOiAnTE9DQUwnLFxuICAgICAgICBtb2RlcyxcbiAgICAgIH0pLFxuICAgICAgX2JpbmQ6ICgpID0+IHsgcmV0dXJuOyB9LFxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIGFuIFMzIGNhY2hpbmcgc3RyYXRlZ3kuXG4gICAqIEBwYXJhbSBidWNrZXQgdGhlIFMzIGJ1Y2tldCB0byB1c2UgZm9yIGNhY2hpbmdcbiAgICogQHBhcmFtIG9wdGlvbnMgYWRkaXRpb25hbCBvcHRpb25zIHRvIHBhc3MgdG8gdGhlIFMzIGNhY2hpbmdcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgYnVja2V0KGJ1Y2tldDogSUJ1Y2tldCwgb3B0aW9ucz86IEJ1Y2tldENhY2hlT3B0aW9ucyk6IENhY2hlIHtcbiAgICByZXR1cm4ge1xuICAgICAgX3RvQ2xvdWRGb3JtYXRpb246ICgpID0+ICh7XG4gICAgICAgIHR5cGU6ICdTMycsXG4gICAgICAgIGxvY2F0aW9uOiBGbi5qb2luKCcvJywgW2J1Y2tldC5idWNrZXROYW1lLCBvcHRpb25zICYmIG9wdGlvbnMucHJlZml4IHx8IEF3cy5OT19WQUxVRV0pLFxuICAgICAgfSksXG4gICAgICBfYmluZDogKHByb2plY3QpID0+IHtcbiAgICAgICAgYnVja2V0LmdyYW50UmVhZFdyaXRlKHByb2plY3QpO1xuICAgICAgfSxcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgcHVibGljIGFic3RyYWN0IF90b0Nsb3VkRm9ybWF0aW9uKCk6IENmblByb2plY3QuUHJvamVjdENhY2hlUHJvcGVydHkgfCB1bmRlZmluZWQ7XG5cbiAgLyoqXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgcHVibGljIGFic3RyYWN0IF9iaW5kKHByb2plY3Q6IElQcm9qZWN0KTogdm9pZDtcbn1cbiJdfQ==