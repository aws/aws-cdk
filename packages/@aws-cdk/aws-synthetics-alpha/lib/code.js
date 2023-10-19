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
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-synthetics-alpha.Code#fromInline", "");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromInline);
            }
            throw error;
        }
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
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-synthetics-alpha.Code#fromAsset", "");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromAsset);
            }
            throw error;
        }
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
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-synthetics-alpha.Code#fromBucket", "");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromBucket);
            }
            throw error;
        }
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
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-synthetics-alpha.AssetCode", "");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, AssetCode);
            }
            throw error;
        }
        if (!fs.existsSync(this.assetPath)) {
            throw new Error(`${this.assetPath} is not a valid path`);
        }
    }
    bind(scope, handler, family) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-synthetics-alpha.AssetCode#bind", "");
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
        // `this.asset.assetPath` is relative to the `outdir`, not the `assetOutDir`.
        const asmManifestDir = core_1.Stage.of(scope)?.outdir;
        const assetPath = asmManifestDir ? path.join(asmManifestDir, this.asset.assetPath) : this.assetPath;
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
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-synthetics-alpha.InlineCode", "");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, InlineCode);
            }
            throw error;
        }
        if (code.length === 0) {
            throw new Error('Canary inline code cannot be empty');
        }
    }
    bind(_scope, handler, _family) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-synthetics-alpha.InlineCode#bind", "");
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
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-synthetics-alpha.S3Code", "");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, S3Code);
            }
            throw error;
        }
    }
    bind(_scope, _handler, _family) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-synthetics-alpha.S3Code#bind", "");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29kZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNvZGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEseUJBQXlCO0FBQ3pCLDZCQUE2QjtBQUU3Qix1REFBdUQ7QUFFdkQsdUNBQTBDO0FBQzFDLDJDQUF5QztBQUV6Qzs7R0FFRztBQUNILE1BQXNCLElBQUk7SUFFeEI7Ozs7OztPQU1HO0lBQ0ksTUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFZOzs7Ozs7Ozs7O1FBQ25DLE9BQU8sSUFBSSxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDN0I7SUFFRDs7Ozs7OztPQU9HO0lBQ0ksTUFBTSxDQUFDLFNBQVMsQ0FBQyxTQUFpQixFQUFFLE9BQWdDOzs7Ozs7Ozs7O1FBQ3pFLE9BQU8sSUFBSSxTQUFTLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0tBQzFDO0lBRUQ7Ozs7Ozs7Ozs7T0FVRztJQUNJLE1BQU0sQ0FBQyxVQUFVLENBQUMsTUFBa0IsRUFBRSxHQUFXLEVBQUUsYUFBc0I7Ozs7Ozs7Ozs7UUFDOUUsT0FBTyxJQUFJLE1BQU0sQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFLGFBQWEsQ0FBQyxDQUFDO0tBQy9DOztBQXRDSCxvQkFrREM7OztBQXFCRDs7R0FFRztBQUNILE1BQWEsU0FBVSxTQUFRLElBQUk7SUFHakM7O09BRUc7SUFDSCxZQUEyQixTQUFpQixFQUFVLE9BQWdDO1FBQ3BGLEtBQUssRUFBRSxDQUFDO1FBRGlCLGNBQVMsR0FBVCxTQUFTLENBQVE7UUFBVSxZQUFPLEdBQVAsT0FBTyxDQUF5Qjs7Ozs7OytDQU4zRSxTQUFTOzs7O1FBU2xCLElBQUksQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRTtZQUNsQyxNQUFNLElBQUksS0FBSyxDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsc0JBQXNCLENBQUMsQ0FBQztTQUMxRDtLQUNGO0lBRU0sSUFBSSxDQUFDLEtB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QUFDO1NBQ3ZEO0tBQ0Y7SUFFTSxJQUFJLENBQUMsTUFBaUIsRUFBRSxPQUFlLEVBQUUsT0FBc0I7Ozs7Ozs7Ozs7O1FBRXBFLElBQUksT0FBTyxLQUFLLGVBQWUsRUFBRTtZQUMvQixNQUFNLElBQUksS0FBSyxDQUFDLDZEQUE2RCxPQUFPLElBQUksQ0FBQyxDQUFDO1NBQzNGO1FBRUQsT0FBTztZQUNMLFVBQVUsRUFBRSxJQUFJLENBQUMsSUFBSTtTQUN0QixDQUFDO0tBQ0g7O0FBbEJILGdDQW1CQzs7O0FBRUQ7O0dBRUc7QUFDSCxNQUFhLE1BQU8sU0FBUSxJQUFJO0lBQzlCLFlBQTJCLE1BQWtCLEVBQVUsR0FBVyxFQUFVLGFBQXNCO1FBQ2hHLEtBQUssRUFBRSxDQUFDO1FBRGlCLFdBQU0sR0FBTixNQUFNLENBQVk7UUFBVSxRQUFHLEdBQUgsR0FBRyxDQUFRO1FBQVUsa0JBQWEsR0FBYixhQUFhLENBQVM7Ozs7OzsrQ0FEdkYsTUFBTTs7OztLQUdoQjtJQUVNLElBQUksQ0FBQyxNQUFpQixFQUFFLFFBQWdCLEVBQUUsT0FBc0I7Ozs7Ozs7Ozs7O1FBQ3JFLE9BQU87WUFDTCxVQUFVLEVBQUU7Z0JBQ1YsVUFBVSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVTtnQkFDbEMsU0FBUyxFQUFFLElBQUksQ0FBQyxHQUFHO2dCQUNuQixhQUFhLEVBQUUsSUFBSSxDQUFDLGFBQWE7YUFDbEM7U0FDRixDQUFDO0tBQ0g7O0FBYkgsd0JBY0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBmcyBmcm9tICdmcyc7XG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0ICogYXMgczMgZnJvbSAnYXdzLWNkay1saWIvYXdzLXMzJztcbmltcG9ydCAqIGFzIHMzX2Fzc2V0cyBmcm9tICdhd3MtY2RrLWxpYi9hd3MtczMtYXNzZXRzJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgUnVudGltZUZhbWlseSB9IGZyb20gJy4vcnVudGltZSc7XG5pbXBvcnQgeyBTdGFnZSB9IGZyb20gJ2F3cy1jZGstbGliL2NvcmUnO1xuXG4vKipcbiAqIFRoZSBjb2RlIHRoZSBjYW5hcnkgc2hvdWxkIGV4ZWN1dGVcbiAqL1xuZXhwb3J0IGFic3RyYWN0IGNsYXNzIENvZGUge1xuXG4gIC8qKlxuICAgKiBTcGVjaWZ5IGNvZGUgaW5saW5lLlxuICAgKlxuICAgKiBAcGFyYW0gY29kZSBUaGUgYWN0dWFsIGhhbmRsZXIgY29kZSAobGltaXRlZCB0byA1TUIpXG4gICAqXG4gICAqIEByZXR1cm5zIGBJbmxpbmVDb2RlYCB3aXRoIGlubGluZSBjb2RlLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tSW5saW5lKGNvZGU6IHN0cmluZyk6IElubGluZUNvZGUge1xuICAgIHJldHVybiBuZXcgSW5saW5lQ29kZShjb2RlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTcGVjaWZ5IGNvZGUgZnJvbSBhIGxvY2FsIHBhdGguIFBhdGggbXVzdCBpbmNsdWRlIHRoZSBmb2xkZXIgc3RydWN0dXJlIGBub2RlanMvbm9kZV9tb2R1bGVzL215Q2FuYXJ5RmlsZW5hbWUuanNgLlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BbWF6b25DbG91ZFdhdGNoL2xhdGVzdC9tb25pdG9yaW5nL0Nsb3VkV2F0Y2hfU3ludGhldGljc19DYW5hcmllc19Xcml0aW5nQ2FuYXJ5Lmh0bWwjQ2xvdWRXYXRjaF9TeW50aGV0aWNzX0NhbmFyaWVzX3dyaXRlX2Zyb21fc2NyYXRjaFxuICAgKlxuICAgKiBAcGFyYW0gYXNzZXRQYXRoIEVpdGhlciBhIGRpcmVjdG9yeSBvciBhIC56aXAgZmlsZVxuICAgKlxuICAgKiBAcmV0dXJucyBgQXNzZXRDb2RlYCBhc3NvY2lhdGVkIHdpdGggdGhlIHNwZWNpZmllZCBwYXRoLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tQXNzZXQoYXNzZXRQYXRoOiBzdHJpbmcsIG9wdGlvbnM/OiBzM19hc3NldHMuQXNzZXRPcHRpb25zKTogQXNzZXRDb2RlIHtcbiAgICByZXR1cm4gbmV3IEFzc2V0Q29kZShhc3NldFBhdGgsIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNwZWNpZnkgY29kZSBmcm9tIGFuIHMzIGJ1Y2tldC4gVGhlIG9iamVjdCBpbiB0aGUgczMgYnVja2V0IG11c3QgYmUgYSAuemlwIGZpbGUgdGhhdCBjb250YWluc1xuICAgKiB0aGUgc3RydWN0dXJlIGBub2RlanMvbm9kZV9tb2R1bGVzL215Q2FuYXJ5RmlsZW5hbWUuanNgLlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BbWF6b25DbG91ZFdhdGNoL2xhdGVzdC9tb25pdG9yaW5nL0Nsb3VkV2F0Y2hfU3ludGhldGljc19DYW5hcmllc19Xcml0aW5nQ2FuYXJ5Lmh0bWwjQ2xvdWRXYXRjaF9TeW50aGV0aWNzX0NhbmFyaWVzX3dyaXRlX2Zyb21fc2NyYXRjaFxuICAgKlxuICAgKiBAcGFyYW0gYnVja2V0IFRoZSBTMyBidWNrZXRcbiAgICogQHBhcmFtIGtleSBUaGUgb2JqZWN0IGtleVxuICAgKiBAcGFyYW0gb2JqZWN0VmVyc2lvbiBPcHRpb25hbCBTMyBvYmplY3QgdmVyc2lvblxuICAgKlxuICAgKiBAcmV0dXJucyBgUzNDb2RlYCBhc3NvY2lhdGVkIHdpdGggdGhlIHNwZWNpZmllZCBTMyBvYmplY3QuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21CdWNrZXQoYnVja2V0OiBzMy5JQnVja2V0LCBrZXk6IHN0cmluZywgb2JqZWN0VmVyc2lvbj86IHN0cmluZyk6IFMzQ29kZSB7XG4gICAgcmV0dXJuIG5ldyBTM0NvZGUoYnVja2V0LCBrZXksIG9iamVjdFZlcnNpb24pO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIHRoZSBjYW5hcnkgaXMgaW5pdGlhbGl6ZWQgdG8gYWxsb3cgdGhpcyBvYmplY3QgdG8gYmluZFxuICAgKiB0byB0aGUgc3RhY2ssIGFkZCByZXNvdXJjZXMgYW5kIGhhdmUgZnVuLlxuICAgKlxuICAgKiBAcGFyYW0gc2NvcGUgVGhlIGJpbmRpbmcgc2NvcGUuIERvbid0IGJlIHNtYXJ0IGFib3V0IHRyeWluZyB0byBkb3duLWNhc3Qgb3JcbiAgICogICAgICAgICAgICAgIGFzc3VtZSBpdCdzIGluaXRpYWxpemVkLiBZb3UgbWF5IGp1c3QgdXNlIGl0IGFzIGEgY29uc3RydWN0IHNjb3BlLlxuICAgKlxuICAgKiBAcmV0dXJucyBhIGJvdW5kIGBDb2RlQ29uZmlnYC5cbiAgICovXG4gIHB1YmxpYyBhYnN0cmFjdCBiaW5kKHNjb3BlOiBDb25zdHJ1Y3QsIGhhbmRsZXI6IHN0cmluZywgZmFtaWx5OiBSdW50aW1lRmFtaWx5KTogQ29kZUNvbmZpZztcbn1cblxuLyoqXG4gKiBDb25maWd1cmF0aW9uIG9mIHRoZSBjb2RlIGNsYXNzXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ29kZUNvbmZpZyB7XG4gIC8qKlxuICAgKiBUaGUgbG9jYXRpb24gb2YgdGhlIGNvZGUgaW4gUzMgKG11dHVhbGx5IGV4Y2x1c2l2ZSB3aXRoIGBpbmxpbmVDb2RlYCkuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gbm9uZVxuICAgKi9cbiAgcmVhZG9ubHkgczNMb2NhdGlvbj86IHMzLkxvY2F0aW9uO1xuXG4gIC8qKlxuICAgKiBJbmxpbmUgY29kZSAobXV0dWFsbHkgZXhjbHVzaXZlIHdpdGggYHMzTG9jYXRpb25gKS5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBub25lXG4gICAqL1xuICByZWFkb25seSBpbmxpbmVDb2RlPzogc3RyaW5nO1xufVxuXG4vKipcbiAqIENhbmFyeSBjb2RlIGZyb20gYW4gQXNzZXRcbiAqL1xuZXhwb3J0IGNsYXNzIEFzc2V0Q29kZSBleHRlbmRzIENvZGUge1xuICBwcml2YXRlIGFzc2V0PzogczNfYXNzZXRzLkFzc2V0O1xuXG4gIC8qKlxuICAgKiBAcGFyYW0gYXNzZXRQYXRoIFRoZSBwYXRoIHRvIHRoZSBhc3NldCBmaWxlIG9yIGRpcmVjdG9yeS5cbiAgICovXG4gIHB1YmxpYyBjb25zdHJ1Y3Rvcihwcml2YXRlIGFzc2V0UGF0aDogc3RyaW5nLCBwcml2YXRlIG9wdGlvbnM/OiBzM19hc3NldHMuQXNzZXRPcHRpb25zKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIGlmICghZnMuZXhpc3RzU3luYyh0aGlzLmFzc2V0UGF0aCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgJHt0aGlzLmFzc2V0UGF0aH0gaXMgbm90IGEgdmFsaWQgcGF0aGApO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBiaW5kKHNjb3BlOiBDb25zdHJ1Y3QsIGhhbmRsZXI6IHN0cmluZywgZmFtaWx5OiBSdW50aW1lRmFtaWx5KTogQ29kZUNvbmZpZyB7XG4gICAgLy8gSWYgdGhlIHNhbWUgQXNzZXRDb2RlIGlzIHVzZWQgbXVsdGlwbGUgdGltZXMsIHJldGFpbiBvbmx5IHRoZSBmaXJzdCBpbnN0YW50aWF0aW9uLlxuICAgIGlmICghdGhpcy5hc3NldCkge1xuICAgICAgdGhpcy5hc3NldCA9IG5ldyBzM19hc3NldHMuQXNzZXQoc2NvcGUsICdDb2RlJywge1xuICAgICAgICBwYXRoOiB0aGlzLmFzc2V0UGF0aCxcbiAgICAgICAgLi4udGhpcy5vcHRpb25zLFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgdGhpcy52YWxpZGF0ZUNhbmFyeUFzc2V0KHNjb3BlLCBoYW5kbGVyLCBmYW1pbHkpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIHMzTG9jYXRpb246IHtcbiAgICAgICAgYnVja2V0TmFtZTogdGhpcy5hc3NldC5zM0J1Y2tldE5hbWUsXG4gICAgICAgIG9iamVjdEtleTogdGhpcy5hc3NldC5zM09iamVjdEtleSxcbiAgICAgIH0sXG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBWYWxpZGF0ZXMgcmVxdWlyZW1lbnRzIHNwZWNpZmllZCBieSB0aGUgY2FuYXJ5IHJlc291cmNlLiBGb3IgZXhhbXBsZSwgdGhlIGNhbmFyeSBjb2RlIHdpdGggaGFuZGxlciBgaW5kZXguaGFuZGxlcmBcbiAgICogbXVzdCBiZSBmb3VuZCBpbiB0aGUgZmlsZSBzdHJ1Y3R1cmUgYG5vZGVqcy9ub2RlX21vZHVsZXMvaW5kZXguanNgLlxuICAgKlxuICAgKiBSZXF1aXJlcyBwYXRoIHRvIGJlIGVpdGhlciB6aXAgZmlsZSBvciBkaXJlY3RvcnkuXG4gICAqIFJlcXVpcmVzIGFzc2V0IGRpcmVjdG9yeSB0byBoYXZlIHRoZSBzdHJ1Y3R1cmUgJ25vZGVqcy9ub2RlX21vZHVsZXMnLlxuICAgKiBSZXF1aXJlcyBjYW5hcnkgZmlsZSB0byBiZSBkaXJlY3RseSBpbnNpZGUgbm9kZV9tb2R1bGVzIGZvbGRlci5cbiAgICogUmVxdWlyZXMgY2FuYXJ5IGZpbGUgbmFtZSBtYXRjaGVzIHRoZSBoYW5kbGVyIG5hbWUuXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FtYXpvbkNsb3VkV2F0Y2gvbGF0ZXN0L21vbml0b3JpbmcvQ2xvdWRXYXRjaF9TeW50aGV0aWNzX0NhbmFyaWVzX1dyaXRpbmdDYW5hcnkuaHRtbFxuICAgKi9cbiAgcHJpdmF0ZSB2YWxpZGF0ZUNhbmFyeUFzc2V0KHNjb3BlOiBDb25zdHJ1Y3QsIGhhbmRsZXI6IHN0cmluZywgZmFtaWx5OiBSdW50aW1lRmFtaWx5KSB7XG4gICAgaWYgKCF0aGlzLmFzc2V0KSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCIndmFsaWRhdGVDYW5hcnlBc3NldCcgbXVzdCBiZSBjYWxsZWQgYWZ0ZXIgJ3RoaXMuYXNzZXQnIGlzIGluc3RhbnRpYXRlZFwiKTtcbiAgICB9XG5cbiAgICAvLyBHZXQgdGhlIHN0YWdlZCAob3IgY29waWVkKSBhc3NldCBwYXRoLlxuICAgIC8vIGB0aGlzLmFzc2V0LmFzc2V0UGF0aGAgaXMgcmVsYXRpdmUgdG8gdGhlIGBvdXRkaXJgLCBub3QgdGhlIGBhc3NldE91dERpcmAuXG4gICAgY29uc3QgYXNtTWFuaWZlc3REaXIgPSBTdGFnZS5vZihzY29wZSk/Lm91dGRpcjtcbiAgICBjb25zdCBhc3NldFBhdGggPSBhc21NYW5pZmVzdERpciA/IHBhdGguam9pbihhc21NYW5pZmVzdERpciwgdGhpcy5hc3NldC5hc3NldFBhdGgpOiB0aGlzLmFzc2V0UGF0aDtcblxuICAgIGlmIChwYXRoLmV4dG5hbWUoYXNzZXRQYXRoKSAhPT0gJy56aXAnKSB7XG4gICAgICBpZiAoIWZzLmxzdGF0U3luYyhhc3NldFBhdGgpLmlzRGlyZWN0b3J5KCkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBBc3NldCBtdXN0IGJlIGEgLnppcCBmaWxlIG9yIGEgZGlyZWN0b3J5ICgke3RoaXMuYXNzZXRQYXRofSlgKTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGZpbGVuYW1lID0gaGFuZGxlci5zcGxpdCgnLicpWzBdO1xuICAgICAgY29uc3Qgbm9kZUZpbGVuYW1lID0gYCR7ZmlsZW5hbWV9LmpzYDtcbiAgICAgIGNvbnN0IHB5dGhvbkZpbGVuYW1lID0gYCR7ZmlsZW5hbWV9LnB5YDtcbiAgICAgIGlmIChmYW1pbHkgPT09IFJ1bnRpbWVGYW1pbHkuTk9ERUpTICYmICFmcy5leGlzdHNTeW5jKHBhdGguam9pbihhc3NldFBhdGgsICdub2RlanMnLCAnbm9kZV9tb2R1bGVzJywgbm9kZUZpbGVuYW1lKSkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBUaGUgY2FuYXJ5IHJlc291cmNlIHJlcXVpcmVzIHRoYXQgdGhlIGhhbmRsZXIgaXMgcHJlc2VudCBhdCBcIm5vZGVqcy9ub2RlX21vZHVsZXMvJHtub2RlRmlsZW5hbWV9XCIgYnV0IG5vdCBmb3VuZCBhdCAke3RoaXMuYXNzZXRQYXRofSAoaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FtYXpvbkNsb3VkV2F0Y2gvbGF0ZXN0L21vbml0b3JpbmcvQ2xvdWRXYXRjaF9TeW50aGV0aWNzX0NhbmFyaWVzX1dyaXRpbmdDYW5hcnlfTm9kZWpzLmh0bWwpYCk7XG4gICAgICB9XG4gICAgICBpZiAoZmFtaWx5ID09PSBSdW50aW1lRmFtaWx5LlBZVEhPTiAmJiAhZnMuZXhpc3RzU3luYyhwYXRoLmpvaW4oYXNzZXRQYXRoLCAncHl0aG9uJywgcHl0aG9uRmlsZW5hbWUpKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFRoZSBjYW5hcnkgcmVzb3VyY2UgcmVxdWlyZXMgdGhhdCB0aGUgaGFuZGxlciBpcyBwcmVzZW50IGF0IFwicHl0aG9uLyR7cHl0aG9uRmlsZW5hbWV9XCIgYnV0IG5vdCBmb3VuZCBhdCAke3RoaXMuYXNzZXRQYXRofSAoaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FtYXpvbkNsb3VkV2F0Y2gvbGF0ZXN0L21vbml0b3JpbmcvQ2xvdWRXYXRjaF9TeW50aGV0aWNzX0NhbmFyaWVzX1dyaXRpbmdDYW5hcnlfUHl0aG9uLmh0bWwpYCk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogQ2FuYXJ5IGNvZGUgZnJvbSBhbiBpbmxpbmUgc3RyaW5nLlxuICovXG5leHBvcnQgY2xhc3MgSW5saW5lQ29kZSBleHRlbmRzIENvZGUge1xuICBwdWJsaWMgY29uc3RydWN0b3IocHJpdmF0ZSBjb2RlOiBzdHJpbmcpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgaWYgKGNvZGUubGVuZ3RoID09PSAwKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0NhbmFyeSBpbmxpbmUgY29kZSBjYW5ub3QgYmUgZW1wdHknKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgYmluZChfc2NvcGU6IENvbnN0cnVjdCwgaGFuZGxlcjogc3RyaW5nLCBfZmFtaWx5OiBSdW50aW1lRmFtaWx5KTogQ29kZUNvbmZpZyB7XG5cbiAgICBpZiAoaGFuZGxlciAhPT0gJ2luZGV4LmhhbmRsZXInKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFRoZSBoYW5kbGVyIGZvciBpbmxpbmUgY29kZSBtdXN0IGJlIFwiaW5kZXguaGFuZGxlclwiIChnb3QgXCIke2hhbmRsZXJ9XCIpYCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIGlubGluZUNvZGU6IHRoaXMuY29kZSxcbiAgICB9O1xuICB9XG59XG5cbi8qKlxuICogUzMgYnVja2V0IHBhdGggdG8gdGhlIGNvZGUgemlwIGZpbGVcbiAqL1xuZXhwb3J0IGNsYXNzIFMzQ29kZSBleHRlbmRzIENvZGUge1xuICBwdWJsaWMgY29uc3RydWN0b3IocHJpdmF0ZSBidWNrZXQ6IHMzLklCdWNrZXQsIHByaXZhdGUga2V5OiBzdHJpbmcsIHByaXZhdGUgb2JqZWN0VmVyc2lvbj86IHN0cmluZykge1xuICAgIHN1cGVyKCk7XG4gIH1cblxuICBwdWJsaWMgYmluZChfc2NvcGU6IENvbnN0cnVjdCwgX2hhbmRsZXI6IHN0cmluZywgX2ZhbWlseTogUnVudGltZUZhbWlseSk6IENvZGVDb25maWcge1xuICAgIHJldHVybiB7XG4gICAgICBzM0xvY2F0aW9uOiB7XG4gICAgICAgIGJ1Y2tldE5hbWU6IHRoaXMuYnVja2V0LmJ1Y2tldE5hbWUsXG4gICAgICAgIG9iamVjdEtleTogdGhpcy5rZXksXG4gICAgICAgIG9iamVjdFZlcnNpb246IHRoaXMub2JqZWN0VmVyc2lvbixcbiAgICAgIH0sXG4gICAgfTtcbiAgfVxufVxuIl19