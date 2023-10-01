"use strict";
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3Code = exports.InlineCode = exports.AssetCode = exports.Code = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const fs = require("fs");
const path = require("path");
const s3_assets = require("aws-cdk-lib/aws-s3-assets");
const runtime_1 = require("./runtime");
const core_1 = require("aws-cdk-lib/core");
/**
 * The code the canary should execute
 */
class Code {
    /**
     * Specify code inline.
     *
     * @param code The actual handler code (limited to 5MB)
     *
     * @returns `InlineCode` with inline code.
     */
    static fromInline(code) {
        return new InlineCode(code);
    }
    /**
     * Specify code from a local path. Path must include the folder structure `nodejs/node_modules/myCanaryFilename.js`.
     * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Canaries_WritingCanary.html#CloudWatch_Synthetics_Canaries_write_from_scratch
     *
     * @param assetPath Either a directory or a .zip file
     *
     * @returns `AssetCode` associated with the specified path.
     */
    static fromAsset(assetPath, options) {
        return new AssetCode(assetPath, options);
    }
    /**
     * Specify code from an s3 bucket. The object in the s3 bucket must be a .zip file that contains
     * the structure `nodejs/node_modules/myCanaryFilename.js`.
     * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Canaries_WritingCanary.html#CloudWatch_Synthetics_Canaries_write_from_scratch
     *
     * @param bucket The S3 bucket
     * @param key The object key
     * @param objectVersion Optional S3 object version
     *
     * @returns `S3Code` associated with the specified S3 object.
     */
    static fromBucket(bucket, key, objectVersion) {
        return new S3Code(bucket, key, objectVersion);
    }
}
exports.Code = Code;
_a = JSII_RTTI_SYMBOL_1;
Code[_a] = { fqn: "@aws-cdk/aws-synthetics-alpha.Code", version: "0.0.0" };
/**
 * Canary code from an Asset
 */
class AssetCode extends Code {
    /**
     * @param assetPath The path to the asset file or directory.
     */
    constructor(assetPath, options) {
        super();
        this.assetPath = assetPath;
        this.options = options;
        if (!fs.existsSync(this.assetPath)) {
            throw new Error(`${this.assetPath} is not a valid path`);
        }
    }
    bind(scope, handler, family) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_synthetics_alpha_RuntimeFamily(family);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.bind);
            }
            throw error;
        }
        // If the same AssetCode is used multiple times, retain only the first instantiation.
        if (!this.asset) {
            this.asset = new s3_assets.Asset(scope, 'Code', {
                path: this.assetPath,
                ...this.options,
            });
        }
        this.validateCanaryAsset(scope, handler, family);
        return {
            s3Location: {
                bucketName: this.asset.s3BucketName,
                objectKey: this.asset.s3ObjectKey,
            },
        };
    }
    /**
     * Validates requirements specified by the canary resource. For example, the canary code with handler `index.handler`
     * must be found in the file structure `nodejs/node_modules/index.js`.
     *
     * Requires path to be either zip file or directory.
     * Requires asset directory to have the structure 'nodejs/node_modules'.
     * Requires canary file to be directly inside node_modules folder.
     * Requires canary file name matches the handler name.
     * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Canaries_WritingCanary.html
     */
    validateCanaryAsset(scope, handler, family) {
        if (!this.asset) {
            throw new Error("'validateCanaryAsset' must be called after 'this.asset' is instantiated");
        }
        // Get the staged (or copied) asset path.
        const assetOutDir = core_1.Stage.of(scope)?.assetOutdir;
        const assetPath = assetOutDir ? path.join(assetOutDir, this.asset.assetPath) : this.assetPath;
        if (path.extname(assetPath) !== '.zip') {
            if (!fs.lstatSync(assetPath).isDirectory()) {
                throw new Error(`Asset must be a .zip file or a directory (${this.assetPath})`);
            }
            const filename = handler.split('.')[0];
            const nodeFilename = `${filename}.js`;
            const pythonFilename = `${filename}.py`;
            if (family === runtime_1.RuntimeFamily.NODEJS && !fs.existsSync(path.join(assetPath, 'nodejs', 'node_modules', nodeFilename))) {
                throw new Error(`The canary resource requires that the handler is present at "nodejs/node_modules/${nodeFilename}" but not found at ${this.assetPath} (https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Canaries_WritingCanary_Nodejs.html)`);
            }
            if (family === runtime_1.RuntimeFamily.PYTHON && !fs.existsSync(path.join(assetPath, 'python', pythonFilename))) {
                throw new Error(`The canary resource requires that the handler is present at "python/${pythonFilename}" but not found at ${this.assetPath} (https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Canaries_WritingCanary_Python.html)`);
            }
        }
    }
}
exports.AssetCode = AssetCode;
_b = JSII_RTTI_SYMBOL_1;
AssetCode[_b] = { fqn: "@aws-cdk/aws-synthetics-alpha.AssetCode", version: "0.0.0" };
/**
 * Canary code from an inline string.
 */
class InlineCode extends Code {
    constructor(code) {
        super();
        this.code = code;
        if (code.length === 0) {
            throw new Error('Canary inline code cannot be empty');
        }
    }
    bind(_scope, handler, _family) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_synthetics_alpha_RuntimeFamily(_family);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.bind);
            }
            throw error;
        }
        if (handler !== 'index.handler') {
            throw new Error(`The handler for inline code must be "index.handler" (got "${handler}")`);
        }
        return {
            inlineCode: this.code,
        };
    }
}
exports.InlineCode = InlineCode;
_c = JSII_RTTI_SYMBOL_1;
InlineCode[_c] = { fqn: "@aws-cdk/aws-synthetics-alpha.InlineCode", version: "0.0.0" };
/**
 * S3 bucket path to the code zip file
 */
class S3Code extends Code {
    constructor(bucket, key, objectVersion) {
        super();
        this.bucket = bucket;
        this.key = key;
        this.objectVersion = objectVersion;
    }
    bind(_scope, _handler, _family) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_synthetics_alpha_RuntimeFamily(_family);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.bind);
            }
            throw error;
        }
        return {
            s3Location: {
                bucketName: this.bucket.bucketName,
                objectKey: this.key,
                objectVersion: this.objectVersion,
            },
        };
    }
}
exports.S3Code = S3Code;
_d = JSII_RTTI_SYMBOL_1;
S3Code[_d] = { fqn: "@aws-cdk/aws-synthetics-alpha.S3Code", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29kZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNvZGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEseUJBQXlCO0FBQ3pCLDZCQUE2QjtBQUU3Qix1REFBdUQ7QUFFdkQsdUNBQTBDO0FBQzFDLDJDQUF5QztBQUV6Qzs7R0FFRztBQUNILE1BQXNCLElBQUk7SUFFeEI7Ozs7OztPQU1HO0lBQ0ksTUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFZO1FBQ25DLE9BQU8sSUFBSSxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDN0I7SUFFRDs7Ozs7OztPQU9HO0lBQ0ksTUFBTSxDQUFDLFNBQVMsQ0FBQyxTQUFpQixFQUFFLE9BQWdDO1FBQ3pFLE9BQU8sSUFBSSxTQUFTLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0tBQzFDO0lBRUQ7Ozs7Ozs7Ozs7T0FVRztJQUNJLE1BQU0sQ0FBQyxVQUFVLENBQUMsTUFBa0IsRUFBRSxHQUFXLEVBQUUsYUFBc0I7UUFDOUUsT0FBTyxJQUFJLE1BQU0sQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFLGFBQWEsQ0FBQyxDQUFDO0tBQy9DOztBQXRDSCxvQkFrREM7OztBQXFCRDs7R0FFRztBQUNILE1BQWEsU0FBVSxTQUFRLElBQUk7SUFHakM7O09BRUc7SUFDSCxZQUEyQixTQUFpQixFQUFVLE9BQWdDO1FBQ3BGLEtBQUssRUFBRSxDQUFDO1FBRGlCLGNBQVMsR0FBVCxTQUFTLENBQVE7UUFBVSxZQUFPLEdBQVAsT0FBTyxDQUF5QjtRQUdwRixJQUFJLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUU7WUFDbEMsTUFBTSxJQUFJLEtBQUssQ0FBQyxHQUFHLElBQUksQ0FBQyxTQUFTLHNCQUFzQixDQUFDLENBQUM7U0FDMUQ7S0FDRjtJQUVNLElBQUksQ0FBQyxLQUFnQixFQUFFLE9BQWUsRUFBRSxNQUFxQjs7Ozs7Ozs7OztRQUNsRSxxRkFBcUY7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LEtBQUssZUFBZSxFQUFFO1lBQy9CLE1BQU0sSUFBSSxLQUFLLENBQUMsNkRBQTZELE9BQU8sSUFBSSxDQUFDLENBQUM7U0FDM0Y7UUFFRCxPQUFPO1lBQ0wsVUFBVSxFQUFFLElBQUksQ0FBQyxJQUFJO1NBQ3RCLENBQUM7S0FDSDs7QUFsQkgsZ0NBbUJDOzs7QUFFRDs7R0FFRztBQUNILE1BQWEsTUFBTyxTQUFRLElBQUk7SUFDOUIsWUFBMkIsTUFBa0IsRUFBVSxHQUFXLEVBQVUsYUFBc0I7UUFDaEcsS0FBSyxFQUFFLENBQUM7UUFEaUIsV0FBTSxHQUFOLE1BQU0sQ0FBWTtRQUFVLFFBQUcsR0FBSCxHQUFHLENBQVE7UUFBVSxrQkFBYSxHQUFiLGFBQWEsQ0FBUztLQUVqRztJQUVNLElBQUksQ0FBQyxNQUFpQixFQUFFLFFBQWdCLEVBQUUsT0FBc0I7Ozs7Ozs7Ozs7UUFDckUsT0FBTztZQUNMLFVBQVUsRUFBRTtnQkFDVixVQUFVLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVO2dCQUNsQyxTQUFTLEVBQUUsSUFBSSxDQUFDLEdBQUc7Z0JBQ25CLGFBQWEsRUFBRSxJQUFJLENBQUMsYUFBYTthQUNsQztTQUNGLENBQUM7S0FDSDs7QUFiSCx3QkFjQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGZzIGZyb20gJ2ZzJztcbmltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgKiBhcyBzMyBmcm9tICdhd3MtY2RrLWxpYi9hd3MtczMnO1xuaW1wb3J0ICogYXMgczNfYXNzZXRzIGZyb20gJ2F3cy1jZGstbGliL2F3cy1zMy1hc3NldHMnO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBSdW50aW1lRmFtaWx5IH0gZnJvbSAnLi9ydW50aW1lJztcbmltcG9ydCB7IFN0YWdlIH0gZnJvbSAnYXdzLWNkay1saWIvY29yZSc7XG5cbi8qKlxuICogVGhlIGNvZGUgdGhlIGNhbmFyeSBzaG91bGQgZXhlY3V0ZVxuICovXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgQ29kZSB7XG5cbiAgLyoqXG4gICAqIFNwZWNpZnkgY29kZSBpbmxpbmUuXG4gICAqXG4gICAqIEBwYXJhbSBjb2RlIFRoZSBhY3R1YWwgaGFuZGxlciBjb2RlIChsaW1pdGVkIHRvIDVNQilcbiAgICpcbiAgICogQHJldHVybnMgYElubGluZUNvZGVgIHdpdGggaW5saW5lIGNvZGUuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21JbmxpbmUoY29kZTogc3RyaW5nKTogSW5saW5lQ29kZSB7XG4gICAgcmV0dXJuIG5ldyBJbmxpbmVDb2RlKGNvZGUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNwZWNpZnkgY29kZSBmcm9tIGEgbG9jYWwgcGF0aC4gUGF0aCBtdXN0IGluY2x1ZGUgdGhlIGZvbGRlciBzdHJ1Y3R1cmUgYG5vZGVqcy9ub2RlX21vZHVsZXMvbXlDYW5hcnlGaWxlbmFtZS5qc2AuXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FtYXpvbkNsb3VkV2F0Y2gvbGF0ZXN0L21vbml0b3JpbmcvQ2xvdWRXYXRjaF9TeW50aGV0aWNzX0NhbmFyaWVzX1dyaXRpbmdDYW5hcnkuaHRtbCNDbG91ZFdhdGNoX1N5bnRoZXRpY3NfQ2FuYXJpZXNfd3JpdGVfZnJvbV9zY3JhdGNoXG4gICAqXG4gICAqIEBwYXJhbSBhc3NldFBhdGggRWl0aGVyIGEgZGlyZWN0b3J5IG9yIGEgLnppcCBmaWxlXG4gICAqXG4gICAqIEByZXR1cm5zIGBBc3NldENvZGVgIGFzc29jaWF0ZWQgd2l0aCB0aGUgc3BlY2lmaWVkIHBhdGguXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21Bc3NldChhc3NldFBhdGg6IHN0cmluZywgb3B0aW9ucz86IHMzX2Fzc2V0cy5Bc3NldE9wdGlvbnMpOiBBc3NldENvZGUge1xuICAgIHJldHVybiBuZXcgQXNzZXRDb2RlKGFzc2V0UGF0aCwgb3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogU3BlY2lmeSBjb2RlIGZyb20gYW4gczMgYnVja2V0LiBUaGUgb2JqZWN0IGluIHRoZSBzMyBidWNrZXQgbXVzdCBiZSBhIC56aXAgZmlsZSB0aGF0IGNvbnRhaW5zXG4gICAqIHRoZSBzdHJ1Y3R1cmUgYG5vZGVqcy9ub2RlX21vZHVsZXMvbXlDYW5hcnlGaWxlbmFtZS5qc2AuXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FtYXpvbkNsb3VkV2F0Y2gvbGF0ZXN0L21vbml0b3JpbmcvQ2xvdWRXYXRjaF9TeW50aGV0aWNzX0NhbmFyaWVzX1dyaXRpbmdDYW5hcnkuaHRtbCNDbG91ZFdhdGNoX1N5bnRoZXRpY3NfQ2FuYXJpZXNfd3JpdGVfZnJvbV9zY3JhdGNoXG4gICAqXG4gICAqIEBwYXJhbSBidWNrZXQgVGhlIFMzIGJ1Y2tldFxuICAgKiBAcGFyYW0ga2V5IFRoZSBvYmplY3Qga2V5XG4gICAqIEBwYXJhbSBvYmplY3RWZXJzaW9uIE9wdGlvbmFsIFMzIG9iamVjdCB2ZXJzaW9uXG4gICAqXG4gICAqIEByZXR1cm5zIGBTM0NvZGVgIGFzc29jaWF0ZWQgd2l0aCB0aGUgc3BlY2lmaWVkIFMzIG9iamVjdC5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZnJvbUJ1Y2tldChidWNrZXQ6IHMzLklCdWNrZXQsIGtleTogc3RyaW5nLCBvYmplY3RWZXJzaW9uPzogc3RyaW5nKTogUzNDb2RlIHtcbiAgICByZXR1cm4gbmV3IFMzQ29kZShidWNrZXQsIGtleSwgb2JqZWN0VmVyc2lvbik7XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIGNhbmFyeSBpcyBpbml0aWFsaXplZCB0byBhbGxvdyB0aGlzIG9iamVjdCB0byBiaW5kXG4gICAqIHRvIHRoZSBzdGFjaywgYWRkIHJlc291cmNlcyBhbmQgaGF2ZSBmdW4uXG4gICAqXG4gICAqIEBwYXJhbSBzY29wZSBUaGUgYmluZGluZyBzY29wZS4gRG9uJ3QgYmUgc21hcnQgYWJvdXQgdHJ5aW5nIHRvIGRvd24tY2FzdCBvclxuICAgKiAgICAgICAgICAgICAgYXNzdW1lIGl0J3MgaW5pdGlhbGl6ZWQuIFlvdSBtYXkganVzdCB1c2UgaXQgYXMgYSBjb25zdHJ1Y3Qgc2NvcGUuXG4gICAqXG4gICAqIEByZXR1cm5zIGEgYm91bmQgYENvZGVDb25maWdgLlxuICAgKi9cbiAgcHVibGljIGFic3RyYWN0IGJpbmQoc2NvcGU6IENvbnN0cnVjdCwgaGFuZGxlcjogc3RyaW5nLCBmYW1pbHk6IFJ1bnRpbWVGYW1pbHkpOiBDb2RlQ29uZmlnO1xufVxuXG4vKipcbiAqIENvbmZpZ3VyYXRpb24gb2YgdGhlIGNvZGUgY2xhc3NcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBDb2RlQ29uZmlnIHtcbiAgLyoqXG4gICAqIFRoZSBsb2NhdGlvbiBvZiB0aGUgY29kZSBpbiBTMyAobXV0dWFsbHkgZXhjbHVzaXZlIHdpdGggYGlubGluZUNvZGVgKS5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBub25lXG4gICAqL1xuICByZWFkb25seSBzM0xvY2F0aW9uPzogczMuTG9jYXRpb247XG5cbiAgLyoqXG4gICAqIElubGluZSBjb2RlIChtdXR1YWxseSBleGNsdXNpdmUgd2l0aCBgczNMb2NhdGlvbmApLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIG5vbmVcbiAgICovXG4gIHJlYWRvbmx5IGlubGluZUNvZGU/OiBzdHJpbmc7XG59XG5cbi8qKlxuICogQ2FuYXJ5IGNvZGUgZnJvbSBhbiBBc3NldFxuICovXG5leHBvcnQgY2xhc3MgQXNzZXRDb2RlIGV4dGVuZHMgQ29kZSB7XG4gIHByaXZhdGUgYXNzZXQ/OiBzM19hc3NldHMuQXNzZXQ7XG5cbiAgLyoqXG4gICAqIEBwYXJhbSBhc3NldFBhdGggVGhlIHBhdGggdG8gdGhlIGFzc2V0IGZpbGUgb3IgZGlyZWN0b3J5LlxuICAgKi9cbiAgcHVibGljIGNvbnN0cnVjdG9yKHByaXZhdGUgYXNzZXRQYXRoOiBzdHJpbmcsIHByaXZhdGUgb3B0aW9ucz86IHMzX2Fzc2V0cy5Bc3NldE9wdGlvbnMpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgaWYgKCFmcy5leGlzdHNTeW5jKHRoaXMuYXNzZXRQYXRoKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGAke3RoaXMuYXNzZXRQYXRofSBpcyBub3QgYSB2YWxpZCBwYXRoYCk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGJpbmQoc2NvcGU6IENvbnN0cnVjdCwgaGFuZGxlcjogc3RyaW5nLCBmYW1pbHk6IFJ1bnRpbWVGYW1pbHkpOiBDb2RlQ29uZmlnIHtcbiAgICAvLyBJZiB0aGUgc2FtZSBBc3NldENvZGUgaXMgdXNlZCBtdWx0aXBsZSB0aW1lcywgcmV0YWluIG9ubHkgdGhlIGZpcnN0IGluc3RhbnRpYXRpb24uXG4gICAgaWYgKCF0aGlzLmFzc2V0KSB7XG4gICAgICB0aGlzLmFzc2V0ID0gbmV3IHMzX2Fzc2V0cy5Bc3NldChzY29wZSwgJ0NvZGUnLCB7XG4gICAgICAgIHBhdGg6IHRoaXMuYXNzZXRQYXRoLFxuICAgICAgICAuLi50aGlzLm9wdGlvbnMsXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICB0aGlzLnZhbGlkYXRlQ2FuYXJ5QXNzZXQoc2NvcGUsIGhhbmRsZXIsIGZhbWlseSk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgczNMb2NhdGlvbjoge1xuICAgICAgICBidWNrZXROYW1lOiB0aGlzLmFzc2V0LnMzQnVja2V0TmFtZSxcbiAgICAgICAgb2JqZWN0S2V5OiB0aGlzLmFzc2V0LnMzT2JqZWN0S2V5LFxuICAgICAgfSxcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIFZhbGlkYXRlcyByZXF1aXJlbWVudHMgc3BlY2lmaWVkIGJ5IHRoZSBjYW5hcnkgcmVzb3VyY2UuIEZvciBleGFtcGxlLCB0aGUgY2FuYXJ5IGNvZGUgd2l0aCBoYW5kbGVyIGBpbmRleC5oYW5kbGVyYFxuICAgKiBtdXN0IGJlIGZvdW5kIGluIHRoZSBmaWxlIHN0cnVjdHVyZSBgbm9kZWpzL25vZGVfbW9kdWxlcy9pbmRleC5qc2AuXG4gICAqXG4gICAqIFJlcXVpcmVzIHBhdGggdG8gYmUgZWl0aGVyIHppcCBmaWxlIG9yIGRpcmVjdG9yeS5cbiAgICogUmVxdWlyZXMgYXNzZXQgZGlyZWN0b3J5IHRvIGhhdmUgdGhlIHN0cnVjdHVyZSAnbm9kZWpzL25vZGVfbW9kdWxlcycuXG4gICAqIFJlcXVpcmVzIGNhbmFyeSBmaWxlIHRvIGJlIGRpcmVjdGx5IGluc2lkZSBub2RlX21vZHVsZXMgZm9sZGVyLlxuICAgKiBSZXF1aXJlcyBjYW5hcnkgZmlsZSBuYW1lIG1hdGNoZXMgdGhlIGhhbmRsZXIgbmFtZS5cbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQW1hem9uQ2xvdWRXYXRjaC9sYXRlc3QvbW9uaXRvcmluZy9DbG91ZFdhdGNoX1N5bnRoZXRpY3NfQ2FuYXJpZXNfV3JpdGluZ0NhbmFyeS5odG1sXG4gICAqL1xuICBwcml2YXRlIHZhbGlkYXRlQ2FuYXJ5QXNzZXQoc2NvcGU6IENvbnN0cnVjdCwgaGFuZGxlcjogc3RyaW5nLCBmYW1pbHk6IFJ1bnRpbWVGYW1pbHkpIHtcbiAgICBpZiAoIXRoaXMuYXNzZXQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIid2YWxpZGF0ZUNhbmFyeUFzc2V0JyBtdXN0IGJlIGNhbGxlZCBhZnRlciAndGhpcy5hc3NldCcgaXMgaW5zdGFudGlhdGVkXCIpO1xuICAgIH1cblxuICAgIC8vIEdldCB0aGUgc3RhZ2VkIChvciBjb3BpZWQpIGFzc2V0IHBhdGguXG4gICAgY29uc3QgYXNzZXRPdXREaXIgPSBTdGFnZS5vZihzY29wZSk/LmFzc2V0T3V0ZGlyO1xuICAgIGNvbnN0IGFzc2V0UGF0aCA9IGFzc2V0T3V0RGlyID8gcGF0aC5qb2luKGFzc2V0T3V0RGlyLCB0aGlzLmFzc2V0LmFzc2V0UGF0aCk6IHRoaXMuYXNzZXRQYXRoO1xuXG4gICAgaWYgKHBhdGguZXh0bmFtZShhc3NldFBhdGgpICE9PSAnLnppcCcpIHtcbiAgICAgIGlmICghZnMubHN0YXRTeW5jKGFzc2V0UGF0aCkuaXNEaXJlY3RvcnkoKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEFzc2V0IG11c3QgYmUgYSAuemlwIGZpbGUgb3IgYSBkaXJlY3RvcnkgKCR7dGhpcy5hc3NldFBhdGh9KWApO1xuICAgICAgfVxuICAgICAgY29uc3QgZmlsZW5hbWUgPSBoYW5kbGVyLnNwbGl0KCcuJylbMF07XG4gICAgICBjb25zdCBub2RlRmlsZW5hbWUgPSBgJHtmaWxlbmFtZX0uanNgO1xuICAgICAgY29uc3QgcHl0aG9uRmlsZW5hbWUgPSBgJHtmaWxlbmFtZX0ucHlgO1xuICAgICAgaWYgKGZhbWlseSA9PT0gUnVudGltZUZhbWlseS5OT0RFSlMgJiYgIWZzLmV4aXN0c1N5bmMocGF0aC5qb2luKGFzc2V0UGF0aCwgJ25vZGVqcycsICdub2RlX21vZHVsZXMnLCBub2RlRmlsZW5hbWUpKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFRoZSBjYW5hcnkgcmVzb3VyY2UgcmVxdWlyZXMgdGhhdCB0aGUgaGFuZGxlciBpcyBwcmVzZW50IGF0IFwibm9kZWpzL25vZGVfbW9kdWxlcy8ke25vZGVGaWxlbmFtZX1cIiBidXQgbm90IGZvdW5kIGF0ICR7dGhpcy5hc3NldFBhdGh9IChodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQW1hem9uQ2xvdWRXYXRjaC9sYXRlc3QvbW9uaXRvcmluZy9DbG91ZFdhdGNoX1N5bnRoZXRpY3NfQ2FuYXJpZXNfV3JpdGluZ0NhbmFyeV9Ob2RlanMuaHRtbClgKTtcbiAgICAgIH1cbiAgICAgIGlmIChmYW1pbHkgPT09IFJ1bnRpbWVGYW1pbHkuUFlUSE9OICYmICFmcy5leGlzdHNTeW5jKHBhdGguam9pbihhc3NldFBhdGgsICdweXRob24nLCBweXRob25GaWxlbmFtZSkpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgVGhlIGNhbmFyeSByZXNvdXJjZSByZXF1aXJlcyB0aGF0IHRoZSBoYW5kbGVyIGlzIHByZXNlbnQgYXQgXCJweXRob24vJHtweXRob25GaWxlbmFtZX1cIiBidXQgbm90IGZvdW5kIGF0ICR7dGhpcy5hc3NldFBhdGh9IChodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQW1hem9uQ2xvdWRXYXRjaC9sYXRlc3QvbW9uaXRvcmluZy9DbG91ZFdhdGNoX1N5bnRoZXRpY3NfQ2FuYXJpZXNfV3JpdGluZ0NhbmFyeV9QeXRob24uaHRtbClgKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBDYW5hcnkgY29kZSBmcm9tIGFuIGlubGluZSBzdHJpbmcuXG4gKi9cbmV4cG9ydCBjbGFzcyBJbmxpbmVDb2RlIGV4dGVuZHMgQ29kZSB7XG4gIHB1YmxpYyBjb25zdHJ1Y3Rvcihwcml2YXRlIGNvZGU6IHN0cmluZykge1xuICAgIHN1cGVyKCk7XG5cbiAgICBpZiAoY29kZS5sZW5ndGggPT09IDApIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQ2FuYXJ5IGlubGluZSBjb2RlIGNhbm5vdCBiZSBlbXB0eScpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBiaW5kKF9zY29wZTogQ29uc3RydWN0LCBoYW5kbGVyOiBzdHJpbmcsIF9mYW1pbHk6IFJ1bnRpbWVGYW1pbHkpOiBDb2RlQ29uZmlnIHtcblxuICAgIGlmIChoYW5kbGVyICE9PSAnaW5kZXguaGFuZGxlcicpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgVGhlIGhhbmRsZXIgZm9yIGlubGluZSBjb2RlIG11c3QgYmUgXCJpbmRleC5oYW5kbGVyXCIgKGdvdCBcIiR7aGFuZGxlcn1cIilgKTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgaW5saW5lQ29kZTogdGhpcy5jb2RlLFxuICAgIH07XG4gIH1cbn1cblxuLyoqXG4gKiBTMyBidWNrZXQgcGF0aCB0byB0aGUgY29kZSB6aXAgZmlsZVxuICovXG5leHBvcnQgY2xhc3MgUzNDb2RlIGV4dGVuZHMgQ29kZSB7XG4gIHB1YmxpYyBjb25zdHJ1Y3Rvcihwcml2YXRlIGJ1Y2tldDogczMuSUJ1Y2tldCwgcHJpdmF0ZSBrZXk6IHN0cmluZywgcHJpdmF0ZSBvYmplY3RWZXJzaW9uPzogc3RyaW5nKSB7XG4gICAgc3VwZXIoKTtcbiAgfVxuXG4gIHB1YmxpYyBiaW5kKF9zY29wZTogQ29uc3RydWN0LCBfaGFuZGxlcjogc3RyaW5nLCBfZmFtaWx5OiBSdW50aW1lRmFtaWx5KTogQ29kZUNvbmZpZyB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHMzTG9jYXRpb246IHtcbiAgICAgICAgYnVja2V0TmFtZTogdGhpcy5idWNrZXQuYnVja2V0TmFtZSxcbiAgICAgICAgb2JqZWN0S2V5OiB0aGlzLmtleSxcbiAgICAgICAgb2JqZWN0VmVyc2lvbjogdGhpcy5vYmplY3RWZXJzaW9uLFxuICAgICAgfSxcbiAgICB9O1xuICB9XG59XG4iXX0=