"use strict";
var _a, _b, _c, _d, _e, _f, _g;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetImageCode = exports.EcrImageCode = exports.CfnParametersCode = exports.AssetCode = exports.InlineCode = exports.S3Code = exports.Code = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const ecr_assets = require("@aws-cdk/aws-ecr-assets");
const iam = require("@aws-cdk/aws-iam");
const s3_assets = require("@aws-cdk/aws-s3-assets");
const cdk = require("@aws-cdk/core");
/**
 * Represents the Lambda Handler Code.
 */
class Code {
    /**
     * Lambda handler code as an S3 object.
     * @param bucket The S3 bucket
     * @param key The object key
     * @param objectVersion Optional S3 object version
     */
    static fromBucket(bucket, key, objectVersion) {
        return new S3Code(bucket, key, objectVersion);
    }
    /**
     * DEPRECATED
     * @deprecated use `fromBucket`
     */
    static bucket(bucket, key, objectVersion) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-lambda.Code#bucket", "use `fromBucket`");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.bucket);
            }
            throw error;
        }
        return this.fromBucket(bucket, key, objectVersion);
    }
    /**
     * Inline code for Lambda handler
     * @returns `LambdaInlineCode` with inline code.
     * @param code The actual handler code (limited to 4KiB)
     */
    static fromInline(code) {
        return new InlineCode(code);
    }
    /**
     * DEPRECATED
     * @deprecated use `fromInline`
     */
    static inline(code) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-lambda.Code#inline", "use `fromInline`");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.inline);
            }
            throw error;
        }
        return this.fromInline(code);
    }
    /**
     * Loads the function code from a local disk path.
     *
     * @param path Either a directory with the Lambda code bundle or a .zip file
     */
    static fromAsset(path, options) {
        return new AssetCode(path, options);
    }
    /**
     * Loads the function code from an asset created by a Docker build.
     *
     * By default, the asset is expected to be located at `/asset` in the
     * image.
     *
     * @param path The path to the directory containing the Docker file
     * @param options Docker build options
     */
    static fromDockerBuild(path, options = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_lambda_DockerBuildAssetOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromDockerBuild);
            }
            throw error;
        }
        let imagePath = options.imagePath ?? '/asset/.';
        // ensure imagePath ends with /. to copy the **content** at this path
        if (imagePath.endsWith('/')) {
            imagePath = `${imagePath}.`;
        }
        else if (!imagePath.endsWith('/.')) {
            imagePath = `${imagePath}/.`;
        }
        const assetPath = cdk.DockerImage
            .fromBuild(path, options)
            .cp(imagePath, options.outputPath);
        return new AssetCode(assetPath);
    }
    /**
     * DEPRECATED
     * @deprecated use `fromAsset`
     */
    static asset(path) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-lambda.Code#asset", "use `fromAsset`");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.asset);
            }
            throw error;
        }
        return this.fromAsset(path);
    }
    /**
     * Creates a new Lambda source defined using CloudFormation parameters.
     *
     * @returns a new instance of `CfnParametersCode`
     * @param props optional construction properties of `CfnParametersCode`
     */
    static fromCfnParameters(props) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_lambda_CfnParametersCodeProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromCfnParameters);
            }
            throw error;
        }
        return new CfnParametersCode(props);
    }
    /**
     * DEPRECATED
     * @deprecated use `fromCfnParameters`
     */
    static cfnParameters(props) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-lambda.Code#cfnParameters", "use `fromCfnParameters`");
            jsiiDeprecationWarnings._aws_cdk_aws_lambda_CfnParametersCodeProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.cfnParameters);
            }
            throw error;
        }
        return this.fromCfnParameters(props);
    }
    /**
     * Use an existing ECR image as the Lambda code.
     * @param repository the ECR repository that the image is in
     * @param props properties to further configure the selected image
     */
    static fromEcrImage(repository, props) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_lambda_EcrImageCodeProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromEcrImage);
            }
            throw error;
        }
        return new EcrImageCode(repository, props);
    }
    /**
     * Create an ECR image from the specified asset and bind it as the Lambda code.
     * @param directory the directory from which the asset must be created
     * @param props properties to further configure the selected image
     */
    static fromAssetImage(directory, props = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_lambda_AssetImageCodeProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromAssetImage);
            }
            throw error;
        }
        return new AssetImageCode(directory, props);
    }
    /**
     * Called after the CFN function resource has been created to allow the code
     * class to bind to it. Specifically it's required to allow assets to add
     * metadata for tooling like SAM CLI to be able to find their origins.
     */
    bindToResource(_resource, _options) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_lambda_ResourceBindOptions(_options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.bindToResource);
            }
            throw error;
        }
        return;
    }
}
exports.Code = Code;
_a = JSII_RTTI_SYMBOL_1;
Code[_a] = { fqn: "@aws-cdk/aws-lambda.Code", version: "0.0.0" };
/**
 * Lambda code from an S3 archive.
 */
class S3Code extends Code {
    constructor(bucket, key, objectVersion) {
        super();
        this.key = key;
        this.objectVersion = objectVersion;
        this.isInline = false;
        if (!bucket.bucketName) {
            throw new Error('bucketName is undefined for the provided bucket');
        }
        this.bucketName = bucket.bucketName;
    }
    bind(_scope) {
        return {
            s3Location: {
                bucketName: this.bucketName,
                objectKey: this.key,
                objectVersion: this.objectVersion,
            },
        };
    }
}
exports.S3Code = S3Code;
_b = JSII_RTTI_SYMBOL_1;
S3Code[_b] = { fqn: "@aws-cdk/aws-lambda.S3Code", version: "0.0.0" };
/**
 * Lambda code from an inline string.
 */
class InlineCode extends Code {
    constructor(code) {
        super();
        this.code = code;
        this.isInline = true;
        if (code.length === 0) {
            throw new Error('Lambda inline code cannot be empty');
        }
    }
    bind(_scope) {
        return {
            inlineCode: this.code,
        };
    }
}
exports.InlineCode = InlineCode;
_c = JSII_RTTI_SYMBOL_1;
InlineCode[_c] = { fqn: "@aws-cdk/aws-lambda.InlineCode", version: "0.0.0" };
/**
 * Lambda code from a local directory.
 */
class AssetCode extends Code {
    /**
     * @param path The path to the asset file or directory.
     */
    constructor(path, options = {}) {
        super();
        this.path = path;
        this.options = options;
        this.isInline = false;
    }
    bind(scope) {
        // If the same AssetCode is used multiple times, retain only the first instantiation.
        if (!this.asset) {
            this.asset = new s3_assets.Asset(scope, 'Code', {
                path: this.path,
                ...this.options,
            });
        }
        else if (cdk.Stack.of(this.asset) !== cdk.Stack.of(scope)) {
            throw new Error(`Asset is already associated with another stack '${cdk.Stack.of(this.asset).stackName}'. ` +
                'Create a new Code instance for every stack.');
        }
        if (!this.asset.isZipArchive) {
            throw new Error(`Asset must be a .zip file or a directory (${this.path})`);
        }
        return {
            s3Location: {
                bucketName: this.asset.s3BucketName,
                objectKey: this.asset.s3ObjectKey,
            },
        };
    }
    bindToResource(resource, options = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_lambda_ResourceBindOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.bindToResource);
            }
            throw error;
        }
        if (!this.asset) {
            throw new Error('bindToResource() must be called after bind()');
        }
        const resourceProperty = options.resourceProperty || 'Code';
        // https://github.com/aws/aws-cdk/issues/1432
        this.asset.addResourceMetadata(resource, resourceProperty);
    }
}
exports.AssetCode = AssetCode;
_d = JSII_RTTI_SYMBOL_1;
AssetCode[_d] = { fqn: "@aws-cdk/aws-lambda.AssetCode", version: "0.0.0" };
/**
 * Lambda code defined using 2 CloudFormation parameters.
 * Useful when you don't have access to the code of your Lambda from your CDK code, so you can't use Assets,
 * and you want to deploy the Lambda in a CodePipeline, using CloudFormation Actions -
 * you can fill the parameters using the `#assign` method.
 */
class CfnParametersCode extends Code {
    constructor(props = {}) {
        super();
        this.isInline = false;
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_lambda_CfnParametersCodeProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, CfnParametersCode);
            }
            throw error;
        }
        this._bucketNameParam = props.bucketNameParam;
        this._objectKeyParam = props.objectKeyParam;
    }
    bind(scope) {
        if (!this._bucketNameParam) {
            this._bucketNameParam = new cdk.CfnParameter(scope, 'LambdaSourceBucketNameParameter', {
                type: 'String',
            });
        }
        if (!this._objectKeyParam) {
            this._objectKeyParam = new cdk.CfnParameter(scope, 'LambdaSourceObjectKeyParameter', {
                type: 'String',
            });
        }
        return {
            s3Location: {
                bucketName: this._bucketNameParam.valueAsString,
                objectKey: this._objectKeyParam.valueAsString,
            },
        };
    }
    /**
     * Create a parameters map from this instance's CloudFormation parameters.
     *
     * It returns a map with 2 keys that correspond to the names of the parameters defined in this Lambda code,
     * and as values it contains the appropriate expressions pointing at the provided S3 location
     * (most likely, obtained from a CodePipeline Artifact by calling the `artifact.s3Location` method).
     * The result should be provided to the CloudFormation Action
     * that is deploying the Stack that the Lambda with this code is part of,
     * in the `parameterOverrides` property.
     *
     * @param location the location of the object in S3 that represents the Lambda code
     */
    assign(location) {
        const ret = {};
        ret[this.bucketNameParam] = location.bucketName;
        ret[this.objectKeyParam] = location.objectKey;
        return ret;
    }
    get bucketNameParam() {
        if (this._bucketNameParam) {
            return this._bucketNameParam.logicalId;
        }
        else {
            throw new Error('Pass CfnParametersCode to a Lambda Function before accessing the bucketNameParam property');
        }
    }
    get objectKeyParam() {
        if (this._objectKeyParam) {
            return this._objectKeyParam.logicalId;
        }
        else {
            throw new Error('Pass CfnParametersCode to a Lambda Function before accessing the objectKeyParam property');
        }
    }
}
exports.CfnParametersCode = CfnParametersCode;
_e = JSII_RTTI_SYMBOL_1;
CfnParametersCode[_e] = { fqn: "@aws-cdk/aws-lambda.CfnParametersCode", version: "0.0.0" };
/**
 * Represents a Docker image in ECR that can be bound as Lambda Code.
 */
class EcrImageCode extends Code {
    constructor(repository, props = {}) {
        super();
        this.repository = repository;
        this.props = props;
        this.isInline = false;
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_lambda_EcrImageCodeProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, EcrImageCode);
            }
            throw error;
        }
    }
    bind(_) {
        this.repository.grantPull(new iam.ServicePrincipal('lambda.amazonaws.com'));
        return {
            image: {
                imageUri: this.repository.repositoryUriForTagOrDigest(this.props?.tagOrDigest ?? this.props?.tag ?? 'latest'),
                cmd: this.props.cmd,
                entrypoint: this.props.entrypoint,
                workingDirectory: this.props.workingDirectory,
            },
        };
    }
}
exports.EcrImageCode = EcrImageCode;
_f = JSII_RTTI_SYMBOL_1;
EcrImageCode[_f] = { fqn: "@aws-cdk/aws-lambda.EcrImageCode", version: "0.0.0" };
/**
 * Represents an ECR image that will be constructed from the specified asset and can be bound as Lambda code.
 */
class AssetImageCode extends Code {
    constructor(directory, props) {
        super();
        this.directory = directory;
        this.props = props;
        this.isInline = false;
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_lambda_AssetImageCodeProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, AssetImageCode);
            }
            throw error;
        }
    }
    bind(scope) {
        // If the same AssetImageCode is used multiple times, retain only the first instantiation.
        if (!this.asset) {
            this.asset = new ecr_assets.DockerImageAsset(scope, 'AssetImage', {
                directory: this.directory,
                ...this.props,
            });
            this.asset.repository.grantPull(new iam.ServicePrincipal('lambda.amazonaws.com'));
        }
        else if (cdk.Stack.of(this.asset) !== cdk.Stack.of(scope)) {
            throw new Error(`Asset is already associated with another stack '${cdk.Stack.of(this.asset).stackName}'. ` +
                'Create a new Code instance for every stack.');
        }
        return {
            image: {
                imageUri: this.asset.imageUri,
                entrypoint: this.props.entrypoint,
                cmd: this.props.cmd,
                workingDirectory: this.props.workingDirectory,
            },
        };
    }
    bindToResource(resource, options = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_lambda_ResourceBindOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.bindToResource);
            }
            throw error;
        }
        if (!this.asset) {
            throw new Error('bindToResource() must be called after bind()');
        }
        const resourceProperty = options.resourceProperty || 'Code.ImageUri';
        // https://github.com/aws/aws-cdk/issues/14593
        this.asset.addResourceMetadata(resource, resourceProperty);
    }
}
exports.AssetImageCode = AssetImageCode;
_g = JSII_RTTI_SYMBOL_1;
AssetImageCode[_g] = { fqn: "@aws-cdk/aws-lambda.AssetImageCode", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29kZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNvZGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQ0Esc0RBQXNEO0FBQ3RELHdDQUF3QztBQUV4QyxvREFBb0Q7QUFDcEQscUNBQXFDO0FBR3JDOztHQUVHO0FBQ0gsTUFBc0IsSUFBSTtJQUN4Qjs7Ozs7T0FLRztJQUNJLE1BQU0sQ0FBQyxVQUFVLENBQUMsTUFBa0IsRUFBRSxHQUFXLEVBQUUsYUFBc0I7UUFDOUUsT0FBTyxJQUFJLE1BQU0sQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFLGFBQWEsQ0FBQyxDQUFDO0tBQy9DO0lBRUQ7OztPQUdHO0lBQ0ksTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFrQixFQUFFLEdBQVcsRUFBRSxhQUFzQjs7Ozs7Ozs7OztRQUMxRSxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxhQUFhLENBQUMsQ0FBQztLQUNwRDtJQUVEOzs7O09BSUc7SUFDSSxNQUFNLENBQUMsVUFBVSxDQUFDLElBQVk7UUFDbkMsT0FBTyxJQUFJLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUM3QjtJQUVEOzs7T0FHRztJQUNJLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBWTs7Ozs7Ozs7OztRQUMvQixPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDOUI7SUFFRDs7OztPQUlHO0lBQ0ksTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFZLEVBQUUsT0FBZ0M7UUFDcEUsT0FBTyxJQUFJLFNBQVMsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7S0FDckM7SUFFRDs7Ozs7Ozs7T0FRRztJQUNJLE1BQU0sQ0FBQyxlQUFlLENBQUMsSUFBWSxFQUFFLFVBQW1DLEVBQUU7Ozs7Ozs7Ozs7UUFDL0UsSUFBSSxTQUFTLEdBQUcsT0FBTyxDQUFDLFNBQVMsSUFBSSxVQUFVLENBQUM7UUFFaEQscUVBQXFFO1FBQ3JFLElBQUksU0FBUyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUMzQixTQUFTLEdBQUcsR0FBRyxTQUFTLEdBQUcsQ0FBQztTQUM3QjthQUFNLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQ3BDLFNBQVMsR0FBRyxHQUFHLFNBQVMsSUFBSSxDQUFDO1NBQzlCO1FBRUQsTUFBTSxTQUFTLEdBQUcsR0FBRyxDQUFDLFdBQVc7YUFDOUIsU0FBUyxDQUFDLElBQUksRUFBRSxPQUFPLENBQUM7YUFDeEIsRUFBRSxDQUFDLFNBQVMsRUFBRSxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7UUFFckMsT0FBTyxJQUFJLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQztLQUNqQztJQUVEOzs7T0FHRztJQUNJLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBWTs7Ozs7Ozs7OztRQUM5QixPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDN0I7SUFFRDs7Ozs7T0FLRztJQUNJLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxLQUE4Qjs7Ozs7Ozs7OztRQUM1RCxPQUFPLElBQUksaUJBQWlCLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDckM7SUFFRDs7O09BR0c7SUFDSSxNQUFNLENBQUMsYUFBYSxDQUFDLEtBQThCOzs7Ozs7Ozs7OztRQUN4RCxPQUFPLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUN0QztJQUVEOzs7O09BSUc7SUFDSSxNQUFNLENBQUMsWUFBWSxDQUFDLFVBQTJCLEVBQUUsS0FBeUI7Ozs7Ozs7Ozs7UUFDL0UsT0FBTyxJQUFJLFlBQVksQ0FBQyxVQUFVLEVBQUUsS0FBSyxDQUFDLENBQUM7S0FDNUM7SUFFRDs7OztPQUlHO0lBQ0ksTUFBTSxDQUFDLGNBQWMsQ0FBQyxTQUFpQixFQUFFLFFBQTZCLEVBQUU7Ozs7Ozs7Ozs7UUFDN0UsT0FBTyxJQUFJLGNBQWMsQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDLENBQUM7S0FDN0M7SUFtQkQ7Ozs7T0FJRztJQUNJLGNBQWMsQ0FBQyxTQUEwQixFQUFFLFFBQThCOzs7Ozs7Ozs7O1FBQzlFLE9BQU87S0FDUjs7QUEzSUgsb0JBNElDOzs7QUE0REQ7O0dBRUc7QUFDSCxNQUFhLE1BQU8sU0FBUSxJQUFJO0lBSTlCLFlBQVksTUFBa0IsRUFBVSxHQUFXLEVBQVUsYUFBc0I7UUFDakYsS0FBSyxFQUFFLENBQUM7UUFEOEIsUUFBRyxHQUFILEdBQUcsQ0FBUTtRQUFVLGtCQUFhLEdBQWIsYUFBYSxDQUFTO1FBSG5FLGFBQVEsR0FBRyxLQUFLLENBQUM7UUFNL0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUU7WUFDdEIsTUFBTSxJQUFJLEtBQUssQ0FBQyxpREFBaUQsQ0FBQyxDQUFDO1NBQ3BFO1FBRUQsSUFBSSxDQUFDLFVBQVUsR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDO0tBQ3JDO0lBRU0sSUFBSSxDQUFDLE1BQWlCO1FBQzNCLE9BQU87WUFDTCxVQUFVLEVBQUU7Z0JBQ1YsVUFBVSxFQUFFLElBQUksQ0FBQyxVQUFVO2dCQUMzQixTQUFTLEVBQUUsSUFBSSxDQUFDLEdBQUc7Z0JBQ25CLGFBQWEsRUFBRSxJQUFJLENBQUMsYUFBYTthQUNsQztTQUNGLENBQUM7S0FDSDs7QUF0Qkgsd0JBdUJDOzs7QUFFRDs7R0FFRztBQUNILE1BQWEsVUFBVyxTQUFRLElBQUk7SUFHbEMsWUFBb0IsSUFBWTtRQUM5QixLQUFLLEVBQUUsQ0FBQztRQURVLFNBQUksR0FBSixJQUFJLENBQVE7UUFGaEIsYUFBUSxHQUFHLElBQUksQ0FBQztRQUs5QixJQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1lBQ3JCLE1BQU0sSUFBSSxLQUFLLENBQUMsb0NBQW9DLENBQUMsQ0FBQztTQUN2RDtLQUNGO0lBRU0sSUFBSSxDQUFDLE1BQWlCO1FBQzNCLE9BQU87WUFDTCxVQUFVLEVBQUUsSUFBSSxDQUFDLElBQUk7U0FDdEIsQ0FBQztLQUNIOztBQWZILGdDQWdCQzs7O0FBRUQ7O0dBRUc7QUFDSCxNQUFhLFNBQVUsU0FBUSxJQUFJO0lBSWpDOztPQUVHO0lBQ0gsWUFBNEIsSUFBWSxFQUFtQixVQUFrQyxFQUFHO1FBQzlGLEtBQUssRUFBRSxDQUFDO1FBRGtCLFNBQUksR0FBSixJQUFJLENBQVE7UUFBbUIsWUFBTyxHQUFQLE9BQU8sQ0FBOEI7UUFOaEYsYUFBUSxHQUFHLEtBQUssQ0FBQztLQVFoQztJQUVNLElBQUksQ0FBQyxLQUFnQjtRQUMxQixxRkFBcUY7UUFDckYsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUU7WUFDZixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksU0FBUyxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFO2dCQUM5QyxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUk7Z0JBQ2YsR0FBRyxJQUFJLENBQUMsT0FBTzthQUNoQixDQUFDLENBQUM7U0FDSjthQUFNLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQzNELE1BQU0sSUFBSSxLQUFLLENBQUMsbURBQW1ELEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxTQUFTLEtBQUs7Z0JBQ3hHLDZDQUE2QyxDQUFDLENBQUM7U0FDbEQ7UUFFRCxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLEVBQUU7WUFDNUIsTUFBTSxJQUFJLEtBQUssQ0FBQyw2Q0FBNkMsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLENBQUM7U0FDNUU7UUFFRCxPQUFPO1lBQ0wsVUFBVSxFQUFFO2dCQUNWLFVBQVUsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVk7Z0JBQ25DLFNBQVMsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVc7YUFDbEM7U0FDRixDQUFDO0tBQ0g7SUFFTSxjQUFjLENBQUMsUUFBeUIsRUFBRSxVQUErQixFQUFHOzs7Ozs7Ozs7O1FBQ2pGLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFO1lBQ2YsTUFBTSxJQUFJLEtBQUssQ0FBQyw4Q0FBOEMsQ0FBQyxDQUFDO1NBQ2pFO1FBRUQsTUFBTSxnQkFBZ0IsR0FBRyxPQUFPLENBQUMsZ0JBQWdCLElBQUksTUFBTSxDQUFDO1FBRTVELDZDQUE2QztRQUM3QyxJQUFJLENBQUMsS0FBSyxDQUFDLG1CQUFtQixDQUFDLFFBQVEsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO0tBQzVEOztBQTVDSCw4QkE2Q0M7OztBQWtDRDs7Ozs7R0FLRztBQUNILE1BQWEsaUJBQWtCLFNBQVEsSUFBSTtJQUt6QyxZQUFZLFFBQWdDLEVBQUU7UUFDNUMsS0FBSyxFQUFFLENBQUM7UUFMTSxhQUFRLEdBQUcsS0FBSyxDQUFDOzs7Ozs7K0NBRHRCLGlCQUFpQjs7OztRQVExQixJQUFJLENBQUMsZ0JBQWdCLEdBQUcsS0FBSyxDQUFDLGVBQWUsQ0FBQztRQUM5QyxJQUFJLENBQUMsZUFBZSxHQUFHLEtBQUssQ0FBQyxjQUFjLENBQUM7S0FDN0M7SUFFTSxJQUFJLENBQUMsS0FBZ0I7UUFDMUIsSUFBSSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRTtZQUMxQixJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxHQUFHLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRSxpQ0FBaUMsRUFBRTtnQkFDckYsSUFBSSxFQUFFLFFBQVE7YUFDZixDQUFDLENBQUM7U0FDSjtRQUVELElBQUksQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFO1lBQ3pCLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxHQUFHLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRSxnQ0FBZ0MsRUFBRTtnQkFDbkYsSUFBSSxFQUFFLFFBQVE7YUFDZixDQUFDLENBQUM7U0FDSjtRQUVELE9BQU87WUFDTCxVQUFVLEVBQUU7Z0JBQ1YsVUFBVSxFQUFFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxhQUFhO2dCQUMvQyxTQUFTLEVBQUUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxhQUFhO2FBQzlDO1NBQ0YsQ0FBQztLQUNIO0lBRUQ7Ozs7Ozs7Ozs7O09BV0c7SUFDSSxNQUFNLENBQUMsUUFBcUI7UUFDakMsTUFBTSxHQUFHLEdBQTRCLEVBQUUsQ0FBQztRQUN4QyxHQUFHLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxVQUFVLENBQUM7UUFDaEQsR0FBRyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsR0FBRyxRQUFRLENBQUMsU0FBUyxDQUFDO1FBQzlDLE9BQU8sR0FBRyxDQUFDO0tBQ1o7SUFFRCxJQUFXLGVBQWU7UUFDeEIsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLEVBQUU7WUFDekIsT0FBTyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxDQUFDO1NBQ3hDO2FBQU07WUFDTCxNQUFNLElBQUksS0FBSyxDQUFDLDJGQUEyRixDQUFDLENBQUM7U0FDOUc7S0FDRjtJQUVELElBQVcsY0FBYztRQUN2QixJQUFJLElBQUksQ0FBQyxlQUFlLEVBQUU7WUFDeEIsT0FBTyxJQUFJLENBQUMsZUFBZSxDQUFDLFNBQVMsQ0FBQztTQUN2QzthQUFNO1lBQ0wsTUFBTSxJQUFJLEtBQUssQ0FBQywwRkFBMEYsQ0FBQyxDQUFDO1NBQzdHO0tBQ0Y7O0FBbEVILDhDQW1FQzs7O0FBNkNEOztHQUVHO0FBQ0gsTUFBYSxZQUFhLFNBQVEsSUFBSTtJQUdwQyxZQUE2QixVQUEyQixFQUFtQixRQUEyQixFQUFFO1FBQ3RHLEtBQUssRUFBRSxDQUFDO1FBRG1CLGVBQVUsR0FBVixVQUFVLENBQWlCO1FBQW1CLFVBQUssR0FBTCxLQUFLLENBQXdCO1FBRnhGLGFBQVEsR0FBWSxLQUFLLENBQUM7Ozs7OzsrQ0FEL0IsWUFBWTs7OztLQUt0QjtJQUVNLElBQUksQ0FBQyxDQUFZO1FBQ3RCLElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLElBQUksR0FBRyxDQUFDLGdCQUFnQixDQUFDLHNCQUFzQixDQUFDLENBQUMsQ0FBQztRQUU1RSxPQUFPO1lBQ0wsS0FBSyxFQUFFO2dCQUNMLFFBQVEsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLDJCQUEyQixDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsV0FBVyxJQUFJLElBQUksQ0FBQyxLQUFLLEVBQUUsR0FBRyxJQUFJLFFBQVEsQ0FBQztnQkFDN0csR0FBRyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRztnQkFDbkIsVUFBVSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVTtnQkFDakMsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxnQkFBZ0I7YUFDOUM7U0FDRixDQUFDO0tBQ0g7O0FBbEJILG9DQW1CQzs7O0FBZ0NEOztHQUVHO0FBQ0gsTUFBYSxjQUFlLFNBQVEsSUFBSTtJQUl0QyxZQUE2QixTQUFpQixFQUFtQixLQUEwQjtRQUN6RixLQUFLLEVBQUUsQ0FBQztRQURtQixjQUFTLEdBQVQsU0FBUyxDQUFRO1FBQW1CLFVBQUssR0FBTCxLQUFLLENBQXFCO1FBSDNFLGFBQVEsR0FBWSxLQUFLLENBQUM7Ozs7OzsrQ0FEL0IsY0FBYzs7OztLQU14QjtJQUVNLElBQUksQ0FBQyxLQUFnQjtRQUMxQiwwRkFBMEY7UUFDMUYsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUU7WUFDZixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksVUFBVSxDQUFDLGdCQUFnQixDQUFDLEtBQUssRUFBRSxZQUFZLEVBQUU7Z0JBQ2hFLFNBQVMsRUFBRSxJQUFJLENBQUMsU0FBUztnQkFDekIsR0FBRyxJQUFJLENBQUMsS0FBSzthQUNkLENBQUMsQ0FBQztZQUNILElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLENBQUM7U0FDbkY7YUFBTSxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUMzRCxNQUFNLElBQUksS0FBSyxDQUFDLG1EQUFtRCxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsU0FBUyxLQUFLO2dCQUN4Ryw2Q0FBNkMsQ0FBQyxDQUFDO1NBQ2xEO1FBRUQsT0FBTztZQUNMLEtBQUssRUFBRTtnQkFDTCxRQUFRLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRO2dCQUM3QixVQUFVLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVO2dCQUNqQyxHQUFHLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHO2dCQUNuQixnQkFBZ0IsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLGdCQUFnQjthQUM5QztTQUNGLENBQUM7S0FDSDtJQUVNLGNBQWMsQ0FBQyxRQUF5QixFQUFFLFVBQStCLEVBQUc7Ozs7Ozs7Ozs7UUFDakYsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUU7WUFDZixNQUFNLElBQUksS0FBSyxDQUFDLDhDQUE4QyxDQUFDLENBQUM7U0FDakU7UUFFRCxNQUFNLGdCQUFnQixHQUFHLE9BQU8sQ0FBQyxnQkFBZ0IsSUFBSSxlQUFlLENBQUM7UUFFckUsOENBQThDO1FBQzlDLElBQUksQ0FBQyxLQUFLLENBQUMsbUJBQW1CLENBQUMsUUFBUSxFQUFFLGdCQUFnQixDQUFDLENBQUM7S0FDNUQ7O0FBeENILHdDQXlDQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGVjciBmcm9tICdAYXdzLWNkay9hd3MtZWNyJztcbmltcG9ydCAqIGFzIGVjcl9hc3NldHMgZnJvbSAnQGF3cy1jZGsvYXdzLWVjci1hc3NldHMnO1xuaW1wb3J0ICogYXMgaWFtIGZyb20gJ0Bhd3MtY2RrL2F3cy1pYW0nO1xuaW1wb3J0ICogYXMgczMgZnJvbSAnQGF3cy1jZGsvYXdzLXMzJztcbmltcG9ydCAqIGFzIHMzX2Fzc2V0cyBmcm9tICdAYXdzLWNkay9hd3MtczMtYXNzZXRzJztcbmltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuXG4vKipcbiAqIFJlcHJlc2VudHMgdGhlIExhbWJkYSBIYW5kbGVyIENvZGUuXG4gKi9cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBDb2RlIHtcbiAgLyoqXG4gICAqIExhbWJkYSBoYW5kbGVyIGNvZGUgYXMgYW4gUzMgb2JqZWN0LlxuICAgKiBAcGFyYW0gYnVja2V0IFRoZSBTMyBidWNrZXRcbiAgICogQHBhcmFtIGtleSBUaGUgb2JqZWN0IGtleVxuICAgKiBAcGFyYW0gb2JqZWN0VmVyc2lvbiBPcHRpb25hbCBTMyBvYmplY3QgdmVyc2lvblxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tQnVja2V0KGJ1Y2tldDogczMuSUJ1Y2tldCwga2V5OiBzdHJpbmcsIG9iamVjdFZlcnNpb24/OiBzdHJpbmcpOiBTM0NvZGUge1xuICAgIHJldHVybiBuZXcgUzNDb2RlKGJ1Y2tldCwga2V5LCBvYmplY3RWZXJzaW9uKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBERVBSRUNBVEVEXG4gICAqIEBkZXByZWNhdGVkIHVzZSBgZnJvbUJ1Y2tldGBcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgYnVja2V0KGJ1Y2tldDogczMuSUJ1Y2tldCwga2V5OiBzdHJpbmcsIG9iamVjdFZlcnNpb24/OiBzdHJpbmcpOiBTM0NvZGUge1xuICAgIHJldHVybiB0aGlzLmZyb21CdWNrZXQoYnVja2V0LCBrZXksIG9iamVjdFZlcnNpb24pO1xuICB9XG5cbiAgLyoqXG4gICAqIElubGluZSBjb2RlIGZvciBMYW1iZGEgaGFuZGxlclxuICAgKiBAcmV0dXJucyBgTGFtYmRhSW5saW5lQ29kZWAgd2l0aCBpbmxpbmUgY29kZS5cbiAgICogQHBhcmFtIGNvZGUgVGhlIGFjdHVhbCBoYW5kbGVyIGNvZGUgKGxpbWl0ZWQgdG8gNEtpQilcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZnJvbUlubGluZShjb2RlOiBzdHJpbmcpOiBJbmxpbmVDb2RlIHtcbiAgICByZXR1cm4gbmV3IElubGluZUNvZGUoY29kZSk7XG4gIH1cblxuICAvKipcbiAgICogREVQUkVDQVRFRFxuICAgKiBAZGVwcmVjYXRlZCB1c2UgYGZyb21JbmxpbmVgXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGlubGluZShjb2RlOiBzdHJpbmcpOiBJbmxpbmVDb2RlIHtcbiAgICByZXR1cm4gdGhpcy5mcm9tSW5saW5lKGNvZGUpO1xuICB9XG5cbiAgLyoqXG4gICAqIExvYWRzIHRoZSBmdW5jdGlvbiBjb2RlIGZyb20gYSBsb2NhbCBkaXNrIHBhdGguXG4gICAqXG4gICAqIEBwYXJhbSBwYXRoIEVpdGhlciBhIGRpcmVjdG9yeSB3aXRoIHRoZSBMYW1iZGEgY29kZSBidW5kbGUgb3IgYSAuemlwIGZpbGVcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZnJvbUFzc2V0KHBhdGg6IHN0cmluZywgb3B0aW9ucz86IHMzX2Fzc2V0cy5Bc3NldE9wdGlvbnMpOiBBc3NldENvZGUge1xuICAgIHJldHVybiBuZXcgQXNzZXRDb2RlKHBhdGgsIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIExvYWRzIHRoZSBmdW5jdGlvbiBjb2RlIGZyb20gYW4gYXNzZXQgY3JlYXRlZCBieSBhIERvY2tlciBidWlsZC5cbiAgICpcbiAgICogQnkgZGVmYXVsdCwgdGhlIGFzc2V0IGlzIGV4cGVjdGVkIHRvIGJlIGxvY2F0ZWQgYXQgYC9hc3NldGAgaW4gdGhlXG4gICAqIGltYWdlLlxuICAgKlxuICAgKiBAcGFyYW0gcGF0aCBUaGUgcGF0aCB0byB0aGUgZGlyZWN0b3J5IGNvbnRhaW5pbmcgdGhlIERvY2tlciBmaWxlXG4gICAqIEBwYXJhbSBvcHRpb25zIERvY2tlciBidWlsZCBvcHRpb25zXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21Eb2NrZXJCdWlsZChwYXRoOiBzdHJpbmcsIG9wdGlvbnM6IERvY2tlckJ1aWxkQXNzZXRPcHRpb25zID0ge30pOiBBc3NldENvZGUge1xuICAgIGxldCBpbWFnZVBhdGggPSBvcHRpb25zLmltYWdlUGF0aCA/PyAnL2Fzc2V0Ly4nO1xuXG4gICAgLy8gZW5zdXJlIGltYWdlUGF0aCBlbmRzIHdpdGggLy4gdG8gY29weSB0aGUgKipjb250ZW50KiogYXQgdGhpcyBwYXRoXG4gICAgaWYgKGltYWdlUGF0aC5lbmRzV2l0aCgnLycpKSB7XG4gICAgICBpbWFnZVBhdGggPSBgJHtpbWFnZVBhdGh9LmA7XG4gICAgfSBlbHNlIGlmICghaW1hZ2VQYXRoLmVuZHNXaXRoKCcvLicpKSB7XG4gICAgICBpbWFnZVBhdGggPSBgJHtpbWFnZVBhdGh9Ly5gO1xuICAgIH1cblxuICAgIGNvbnN0IGFzc2V0UGF0aCA9IGNkay5Eb2NrZXJJbWFnZVxuICAgICAgLmZyb21CdWlsZChwYXRoLCBvcHRpb25zKVxuICAgICAgLmNwKGltYWdlUGF0aCwgb3B0aW9ucy5vdXRwdXRQYXRoKTtcblxuICAgIHJldHVybiBuZXcgQXNzZXRDb2RlKGFzc2V0UGF0aCk7XG4gIH1cblxuICAvKipcbiAgICogREVQUkVDQVRFRFxuICAgKiBAZGVwcmVjYXRlZCB1c2UgYGZyb21Bc3NldGBcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgYXNzZXQocGF0aDogc3RyaW5nKTogQXNzZXRDb2RlIHtcbiAgICByZXR1cm4gdGhpcy5mcm9tQXNzZXQocGF0aCk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhIG5ldyBMYW1iZGEgc291cmNlIGRlZmluZWQgdXNpbmcgQ2xvdWRGb3JtYXRpb24gcGFyYW1ldGVycy5cbiAgICpcbiAgICogQHJldHVybnMgYSBuZXcgaW5zdGFuY2Ugb2YgYENmblBhcmFtZXRlcnNDb2RlYFxuICAgKiBAcGFyYW0gcHJvcHMgb3B0aW9uYWwgY29uc3RydWN0aW9uIHByb3BlcnRpZXMgb2YgYENmblBhcmFtZXRlcnNDb2RlYFxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tQ2ZuUGFyYW1ldGVycyhwcm9wcz86IENmblBhcmFtZXRlcnNDb2RlUHJvcHMpOiBDZm5QYXJhbWV0ZXJzQ29kZSB7XG4gICAgcmV0dXJuIG5ldyBDZm5QYXJhbWV0ZXJzQ29kZShwcm9wcyk7XG4gIH1cblxuICAvKipcbiAgICogREVQUkVDQVRFRFxuICAgKiBAZGVwcmVjYXRlZCB1c2UgYGZyb21DZm5QYXJhbWV0ZXJzYFxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBjZm5QYXJhbWV0ZXJzKHByb3BzPzogQ2ZuUGFyYW1ldGVyc0NvZGVQcm9wcyk6IENmblBhcmFtZXRlcnNDb2RlIHtcbiAgICByZXR1cm4gdGhpcy5mcm9tQ2ZuUGFyYW1ldGVycyhwcm9wcyk7XG4gIH1cblxuICAvKipcbiAgICogVXNlIGFuIGV4aXN0aW5nIEVDUiBpbWFnZSBhcyB0aGUgTGFtYmRhIGNvZGUuXG4gICAqIEBwYXJhbSByZXBvc2l0b3J5IHRoZSBFQ1IgcmVwb3NpdG9yeSB0aGF0IHRoZSBpbWFnZSBpcyBpblxuICAgKiBAcGFyYW0gcHJvcHMgcHJvcGVydGllcyB0byBmdXJ0aGVyIGNvbmZpZ3VyZSB0aGUgc2VsZWN0ZWQgaW1hZ2VcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZnJvbUVjckltYWdlKHJlcG9zaXRvcnk6IGVjci5JUmVwb3NpdG9yeSwgcHJvcHM/OiBFY3JJbWFnZUNvZGVQcm9wcykge1xuICAgIHJldHVybiBuZXcgRWNySW1hZ2VDb2RlKHJlcG9zaXRvcnksIHByb3BzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgYW4gRUNSIGltYWdlIGZyb20gdGhlIHNwZWNpZmllZCBhc3NldCBhbmQgYmluZCBpdCBhcyB0aGUgTGFtYmRhIGNvZGUuXG4gICAqIEBwYXJhbSBkaXJlY3RvcnkgdGhlIGRpcmVjdG9yeSBmcm9tIHdoaWNoIHRoZSBhc3NldCBtdXN0IGJlIGNyZWF0ZWRcbiAgICogQHBhcmFtIHByb3BzIHByb3BlcnRpZXMgdG8gZnVydGhlciBjb25maWd1cmUgdGhlIHNlbGVjdGVkIGltYWdlXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21Bc3NldEltYWdlKGRpcmVjdG9yeTogc3RyaW5nLCBwcm9wczogQXNzZXRJbWFnZUNvZGVQcm9wcyA9IHt9KSB7XG4gICAgcmV0dXJuIG5ldyBBc3NldEltYWdlQ29kZShkaXJlY3RvcnksIHByb3BzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZXRlcm1pbmVzIHdoZXRoZXIgdGhpcyBDb2RlIGlzIGlubGluZSBjb2RlIG9yIG5vdC5cbiAgICpcbiAgICogQGRlcHJlY2F0ZWQgdGhpcyB2YWx1ZSBpcyBpZ25vcmVkIHNpbmNlIGlubGluZSBpcyBub3cgZGV0ZXJtaW5lZCBiYXNlZCBvbiB0aGVcbiAgICogdGhlIGBpbmxpbmVDb2RlYCBmaWVsZCBvZiBgQ29kZUNvbmZpZ2AgcmV0dXJuZWQgZnJvbSBgYmluZCgpYC5cbiAgICovXG4gIHB1YmxpYyBhYnN0cmFjdCByZWFkb25seSBpc0lubGluZTogYm9vbGVhbjtcblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIGxhbWJkYSBvciBsYXllciBpcyBpbml0aWFsaXplZCB0byBhbGxvdyB0aGlzIG9iamVjdCB0byBiaW5kXG4gICAqIHRvIHRoZSBzdGFjaywgYWRkIHJlc291cmNlcyBhbmQgaGF2ZSBmdW4uXG4gICAqXG4gICAqIEBwYXJhbSBzY29wZSBUaGUgYmluZGluZyBzY29wZS4gRG9uJ3QgYmUgc21hcnQgYWJvdXQgdHJ5aW5nIHRvIGRvd24tY2FzdCBvclxuICAgKiBhc3N1bWUgaXQncyBpbml0aWFsaXplZC4gWW91IG1heSBqdXN0IHVzZSBpdCBhcyBhIGNvbnN0cnVjdCBzY29wZS5cbiAgICovXG4gIHB1YmxpYyBhYnN0cmFjdCBiaW5kKHNjb3BlOiBDb25zdHJ1Y3QpOiBDb2RlQ29uZmlnO1xuXG4gIC8qKlxuICAgKiBDYWxsZWQgYWZ0ZXIgdGhlIENGTiBmdW5jdGlvbiByZXNvdXJjZSBoYXMgYmVlbiBjcmVhdGVkIHRvIGFsbG93IHRoZSBjb2RlXG4gICAqIGNsYXNzIHRvIGJpbmQgdG8gaXQuIFNwZWNpZmljYWxseSBpdCdzIHJlcXVpcmVkIHRvIGFsbG93IGFzc2V0cyB0byBhZGRcbiAgICogbWV0YWRhdGEgZm9yIHRvb2xpbmcgbGlrZSBTQU0gQ0xJIHRvIGJlIGFibGUgdG8gZmluZCB0aGVpciBvcmlnaW5zLlxuICAgKi9cbiAgcHVibGljIGJpbmRUb1Jlc291cmNlKF9yZXNvdXJjZTogY2RrLkNmblJlc291cmNlLCBfb3B0aW9ucz86IFJlc291cmNlQmluZE9wdGlvbnMpIHtcbiAgICByZXR1cm47XG4gIH1cbn1cblxuLyoqXG4gKiBSZXN1bHQgb2YgYmluZGluZyBgQ29kZWAgaW50byBhIGBGdW5jdGlvbmAuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ29kZUNvbmZpZyB7XG4gIC8qKlxuICAgKiBUaGUgbG9jYXRpb24gb2YgdGhlIGNvZGUgaW4gUzMgKG11dHVhbGx5IGV4Y2x1c2l2ZSB3aXRoIGBpbmxpbmVDb2RlYCBhbmQgYGltYWdlYCkuXG4gICAqIEBkZWZhdWx0IC0gY29kZSBpcyBub3QgYW4gczMgbG9jYXRpb25cbiAgICovXG4gIHJlYWRvbmx5IHMzTG9jYXRpb24/OiBzMy5Mb2NhdGlvbjtcblxuICAvKipcbiAgICogSW5saW5lIGNvZGUgKG11dHVhbGx5IGV4Y2x1c2l2ZSB3aXRoIGBzM0xvY2F0aW9uYCBhbmQgYGltYWdlYCkuXG4gICAqIEBkZWZhdWx0IC0gY29kZSBpcyBub3QgaW5saW5lIGNvZGVcbiAgICovXG4gIHJlYWRvbmx5IGlubGluZUNvZGU/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIERvY2tlciBpbWFnZSBjb25maWd1cmF0aW9uIChtdXR1YWxseSBleGNsdXNpdmUgd2l0aCBgczNMb2NhdGlvbmAgYW5kIGBpbmxpbmVDb2RlYCkuXG4gICAqIEBkZWZhdWx0IC0gY29kZSBpcyBub3QgYW4gRUNSIGNvbnRhaW5lciBpbWFnZVxuICAgKi9cbiAgcmVhZG9ubHkgaW1hZ2U/OiBDb2RlSW1hZ2VDb25maWc7XG59XG5cbi8qKlxuICogUmVzdWx0IG9mIHRoZSBiaW5kIHdoZW4gYW4gRUNSIGltYWdlIGlzIHVzZWQuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ29kZUltYWdlQ29uZmlnIHtcbiAgLyoqXG4gICAqIFVSSSB0byB0aGUgRG9ja2VyIGltYWdlLlxuICAgKi9cbiAgcmVhZG9ubHkgaW1hZ2VVcmk6IHN0cmluZztcblxuICAvKipcbiAgICogU3BlY2lmeSBvciBvdmVycmlkZSB0aGUgQ01EIG9uIHRoZSBzcGVjaWZpZWQgRG9ja2VyIGltYWdlIG9yIERvY2tlcmZpbGUuXG4gICAqIFRoaXMgbmVlZHMgdG8gYmUgaW4gdGhlICdleGVjIGZvcm0nLCB2aXouLCBgWyAnZXhlY3V0YWJsZScsICdwYXJhbTEnLCAncGFyYW0yJyBdYC5cbiAgICogQHNlZSBodHRwczovL2RvY3MuZG9ja2VyLmNvbS9lbmdpbmUvcmVmZXJlbmNlL2J1aWxkZXIvI2NtZFxuICAgKiBAZGVmYXVsdCAtIHVzZSB0aGUgQ01EIHNwZWNpZmllZCBpbiB0aGUgZG9ja2VyIGltYWdlIG9yIERvY2tlcmZpbGUuXG4gICAqL1xuICByZWFkb25seSBjbWQ/OiBzdHJpbmdbXTtcblxuICAvKipcbiAgICogU3BlY2lmeSBvciBvdmVycmlkZSB0aGUgRU5UUllQT0lOVCBvbiB0aGUgc3BlY2lmaWVkIERvY2tlciBpbWFnZSBvciBEb2NrZXJmaWxlLlxuICAgKiBBbiBFTlRSWVBPSU5UIGFsbG93cyB5b3UgdG8gY29uZmlndXJlIGEgY29udGFpbmVyIHRoYXQgd2lsbCBydW4gYXMgYW4gZXhlY3V0YWJsZS5cbiAgICogVGhpcyBuZWVkcyB0byBiZSBpbiB0aGUgJ2V4ZWMgZm9ybScsIHZpei4sIGBbICdleGVjdXRhYmxlJywgJ3BhcmFtMScsICdwYXJhbTInIF1gLlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5kb2NrZXIuY29tL2VuZ2luZS9yZWZlcmVuY2UvYnVpbGRlci8jZW50cnlwb2ludFxuICAgKiBAZGVmYXVsdCAtIHVzZSB0aGUgRU5UUllQT0lOVCBpbiB0aGUgZG9ja2VyIGltYWdlIG9yIERvY2tlcmZpbGUuXG4gICAqL1xuICByZWFkb25seSBlbnRyeXBvaW50Pzogc3RyaW5nW107XG5cbiAgLyoqXG4gICAqIFNwZWNpZnkgb3Igb3ZlcnJpZGUgdGhlIFdPUktESVIgb24gdGhlIHNwZWNpZmllZCBEb2NrZXIgaW1hZ2Ugb3IgRG9ja2VyZmlsZS5cbiAgICogQSBXT1JLRElSIGFsbG93cyB5b3UgdG8gY29uZmlndXJlIHRoZSB3b3JraW5nIGRpcmVjdG9yeSB0aGUgY29udGFpbmVyIHdpbGwgdXNlLlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5kb2NrZXIuY29tL2VuZ2luZS9yZWZlcmVuY2UvYnVpbGRlci8jd29ya2RpclxuICAgKiBAZGVmYXVsdCAtIHVzZSB0aGUgV09SS0RJUiBpbiB0aGUgZG9ja2VyIGltYWdlIG9yIERvY2tlcmZpbGUuXG4gICAqL1xuICByZWFkb25seSB3b3JraW5nRGlyZWN0b3J5Pzogc3RyaW5nO1xufVxuXG4vKipcbiAqIExhbWJkYSBjb2RlIGZyb20gYW4gUzMgYXJjaGl2ZS5cbiAqL1xuZXhwb3J0IGNsYXNzIFMzQ29kZSBleHRlbmRzIENvZGUge1xuICBwdWJsaWMgcmVhZG9ubHkgaXNJbmxpbmUgPSBmYWxzZTtcbiAgcHJpdmF0ZSBidWNrZXROYW1lOiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3IoYnVja2V0OiBzMy5JQnVja2V0LCBwcml2YXRlIGtleTogc3RyaW5nLCBwcml2YXRlIG9iamVjdFZlcnNpb24/OiBzdHJpbmcpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgaWYgKCFidWNrZXQuYnVja2V0TmFtZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdidWNrZXROYW1lIGlzIHVuZGVmaW5lZCBmb3IgdGhlIHByb3ZpZGVkIGJ1Y2tldCcpO1xuICAgIH1cblxuICAgIHRoaXMuYnVja2V0TmFtZSA9IGJ1Y2tldC5idWNrZXROYW1lO1xuICB9XG5cbiAgcHVibGljIGJpbmQoX3Njb3BlOiBDb25zdHJ1Y3QpOiBDb2RlQ29uZmlnIHtcbiAgICByZXR1cm4ge1xuICAgICAgczNMb2NhdGlvbjoge1xuICAgICAgICBidWNrZXROYW1lOiB0aGlzLmJ1Y2tldE5hbWUsXG4gICAgICAgIG9iamVjdEtleTogdGhpcy5rZXksXG4gICAgICAgIG9iamVjdFZlcnNpb246IHRoaXMub2JqZWN0VmVyc2lvbixcbiAgICAgIH0sXG4gICAgfTtcbiAgfVxufVxuXG4vKipcbiAqIExhbWJkYSBjb2RlIGZyb20gYW4gaW5saW5lIHN0cmluZy5cbiAqL1xuZXhwb3J0IGNsYXNzIElubGluZUNvZGUgZXh0ZW5kcyBDb2RlIHtcbiAgcHVibGljIHJlYWRvbmx5IGlzSW5saW5lID0gdHJ1ZTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGNvZGU6IHN0cmluZykge1xuICAgIHN1cGVyKCk7XG5cbiAgICBpZiAoY29kZS5sZW5ndGggPT09IDApIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignTGFtYmRhIGlubGluZSBjb2RlIGNhbm5vdCBiZSBlbXB0eScpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBiaW5kKF9zY29wZTogQ29uc3RydWN0KTogQ29kZUNvbmZpZyB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGlubGluZUNvZGU6IHRoaXMuY29kZSxcbiAgICB9O1xuICB9XG59XG5cbi8qKlxuICogTGFtYmRhIGNvZGUgZnJvbSBhIGxvY2FsIGRpcmVjdG9yeS5cbiAqL1xuZXhwb3J0IGNsYXNzIEFzc2V0Q29kZSBleHRlbmRzIENvZGUge1xuICBwdWJsaWMgcmVhZG9ubHkgaXNJbmxpbmUgPSBmYWxzZTtcbiAgcHJpdmF0ZSBhc3NldD86IHMzX2Fzc2V0cy5Bc3NldDtcblxuICAvKipcbiAgICogQHBhcmFtIHBhdGggVGhlIHBhdGggdG8gdGhlIGFzc2V0IGZpbGUgb3IgZGlyZWN0b3J5LlxuICAgKi9cbiAgY29uc3RydWN0b3IocHVibGljIHJlYWRvbmx5IHBhdGg6IHN0cmluZywgcHJpdmF0ZSByZWFkb25seSBvcHRpb25zOiBzM19hc3NldHMuQXNzZXRPcHRpb25zID0geyB9KSB7XG4gICAgc3VwZXIoKTtcbiAgfVxuXG4gIHB1YmxpYyBiaW5kKHNjb3BlOiBDb25zdHJ1Y3QpOiBDb2RlQ29uZmlnIHtcbiAgICAvLyBJZiB0aGUgc2FtZSBBc3NldENvZGUgaXMgdXNlZCBtdWx0aXBsZSB0aW1lcywgcmV0YWluIG9ubHkgdGhlIGZpcnN0IGluc3RhbnRpYXRpb24uXG4gICAgaWYgKCF0aGlzLmFzc2V0KSB7XG4gICAgICB0aGlzLmFzc2V0ID0gbmV3IHMzX2Fzc2V0cy5Bc3NldChzY29wZSwgJ0NvZGUnLCB7XG4gICAgICAgIHBhdGg6IHRoaXMucGF0aCxcbiAgICAgICAgLi4udGhpcy5vcHRpb25zLFxuICAgICAgfSk7XG4gICAgfSBlbHNlIGlmIChjZGsuU3RhY2sub2YodGhpcy5hc3NldCkgIT09IGNkay5TdGFjay5vZihzY29wZSkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgQXNzZXQgaXMgYWxyZWFkeSBhc3NvY2lhdGVkIHdpdGggYW5vdGhlciBzdGFjayAnJHtjZGsuU3RhY2sub2YodGhpcy5hc3NldCkuc3RhY2tOYW1lfScuIGAgK1xuICAgICAgICAnQ3JlYXRlIGEgbmV3IENvZGUgaW5zdGFuY2UgZm9yIGV2ZXJ5IHN0YWNrLicpO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5hc3NldC5pc1ppcEFyY2hpdmUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgQXNzZXQgbXVzdCBiZSBhIC56aXAgZmlsZSBvciBhIGRpcmVjdG9yeSAoJHt0aGlzLnBhdGh9KWApO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBzM0xvY2F0aW9uOiB7XG4gICAgICAgIGJ1Y2tldE5hbWU6IHRoaXMuYXNzZXQuczNCdWNrZXROYW1lLFxuICAgICAgICBvYmplY3RLZXk6IHRoaXMuYXNzZXQuczNPYmplY3RLZXksXG4gICAgICB9LFxuICAgIH07XG4gIH1cblxuICBwdWJsaWMgYmluZFRvUmVzb3VyY2UocmVzb3VyY2U6IGNkay5DZm5SZXNvdXJjZSwgb3B0aW9uczogUmVzb3VyY2VCaW5kT3B0aW9ucyA9IHsgfSkge1xuICAgIGlmICghdGhpcy5hc3NldCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdiaW5kVG9SZXNvdXJjZSgpIG11c3QgYmUgY2FsbGVkIGFmdGVyIGJpbmQoKScpO1xuICAgIH1cblxuICAgIGNvbnN0IHJlc291cmNlUHJvcGVydHkgPSBvcHRpb25zLnJlc291cmNlUHJvcGVydHkgfHwgJ0NvZGUnO1xuXG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2F3cy9hd3MtY2RrL2lzc3Vlcy8xNDMyXG4gICAgdGhpcy5hc3NldC5hZGRSZXNvdXJjZU1ldGFkYXRhKHJlc291cmNlLCByZXNvdXJjZVByb3BlcnR5KTtcbiAgfVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIFJlc291cmNlQmluZE9wdGlvbnMge1xuICAvKipcbiAgICogVGhlIG5hbWUgb2YgdGhlIENsb3VkRm9ybWF0aW9uIHByb3BlcnR5IHRvIGFubm90YXRlIHdpdGggYXNzZXQgbWV0YWRhdGEuXG4gICAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2F3cy9hd3MtY2RrL2lzc3Vlcy8xNDMyXG4gICAqIEBkZWZhdWx0IENvZGVcbiAgICovXG4gIHJlYWRvbmx5IHJlc291cmNlUHJvcGVydHk/OiBzdHJpbmc7XG59XG5cbi8qKlxuICogQ29uc3RydWN0aW9uIHByb3BlcnRpZXMgZm9yIGBDZm5QYXJhbWV0ZXJzQ29kZWAuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ2ZuUGFyYW1ldGVyc0NvZGVQcm9wcyB7XG4gIC8qKlxuICAgKiBUaGUgQ2xvdWRGb3JtYXRpb24gcGFyYW1ldGVyIHRoYXQgcmVwcmVzZW50cyB0aGUgbmFtZSBvZiB0aGUgUzMgQnVja2V0XG4gICAqIHdoZXJlIHRoZSBMYW1iZGEgY29kZSB3aWxsIGJlIGxvY2F0ZWQgaW4uXG4gICAqIE11c3QgYmUgb2YgdHlwZSAnU3RyaW5nJy5cbiAgICpcbiAgICogQGRlZmF1bHQgYSBuZXcgcGFyYW1ldGVyIHdpbGwgYmUgY3JlYXRlZFxuICAgKi9cbiAgcmVhZG9ubHkgYnVja2V0TmFtZVBhcmFtPzogY2RrLkNmblBhcmFtZXRlcjtcblxuICAvKipcbiAgICogVGhlIENsb3VkRm9ybWF0aW9uIHBhcmFtZXRlciB0aGF0IHJlcHJlc2VudHMgdGhlIHBhdGggaW5zaWRlIHRoZSBTMyBCdWNrZXRcbiAgICogd2hlcmUgdGhlIExhbWJkYSBjb2RlIHdpbGwgYmUgbG9jYXRlZCBhdC5cbiAgICogTXVzdCBiZSBvZiB0eXBlICdTdHJpbmcnLlxuICAgKlxuICAgKiBAZGVmYXVsdCBhIG5ldyBwYXJhbWV0ZXIgd2lsbCBiZSBjcmVhdGVkXG4gICAqL1xuICByZWFkb25seSBvYmplY3RLZXlQYXJhbT86IGNkay5DZm5QYXJhbWV0ZXI7XG59XG5cbi8qKlxuICogTGFtYmRhIGNvZGUgZGVmaW5lZCB1c2luZyAyIENsb3VkRm9ybWF0aW9uIHBhcmFtZXRlcnMuXG4gKiBVc2VmdWwgd2hlbiB5b3UgZG9uJ3QgaGF2ZSBhY2Nlc3MgdG8gdGhlIGNvZGUgb2YgeW91ciBMYW1iZGEgZnJvbSB5b3VyIENESyBjb2RlLCBzbyB5b3UgY2FuJ3QgdXNlIEFzc2V0cyxcbiAqIGFuZCB5b3Ugd2FudCB0byBkZXBsb3kgdGhlIExhbWJkYSBpbiBhIENvZGVQaXBlbGluZSwgdXNpbmcgQ2xvdWRGb3JtYXRpb24gQWN0aW9ucyAtXG4gKiB5b3UgY2FuIGZpbGwgdGhlIHBhcmFtZXRlcnMgdXNpbmcgdGhlIGAjYXNzaWduYCBtZXRob2QuXG4gKi9cbmV4cG9ydCBjbGFzcyBDZm5QYXJhbWV0ZXJzQ29kZSBleHRlbmRzIENvZGUge1xuICBwdWJsaWMgcmVhZG9ubHkgaXNJbmxpbmUgPSBmYWxzZTtcbiAgcHJpdmF0ZSBfYnVja2V0TmFtZVBhcmFtPzogY2RrLkNmblBhcmFtZXRlcjtcbiAgcHJpdmF0ZSBfb2JqZWN0S2V5UGFyYW0/OiBjZGsuQ2ZuUGFyYW1ldGVyO1xuXG4gIGNvbnN0cnVjdG9yKHByb3BzOiBDZm5QYXJhbWV0ZXJzQ29kZVByb3BzID0ge30pIHtcbiAgICBzdXBlcigpO1xuXG4gICAgdGhpcy5fYnVja2V0TmFtZVBhcmFtID0gcHJvcHMuYnVja2V0TmFtZVBhcmFtO1xuICAgIHRoaXMuX29iamVjdEtleVBhcmFtID0gcHJvcHMub2JqZWN0S2V5UGFyYW07XG4gIH1cblxuICBwdWJsaWMgYmluZChzY29wZTogQ29uc3RydWN0KTogQ29kZUNvbmZpZyB7XG4gICAgaWYgKCF0aGlzLl9idWNrZXROYW1lUGFyYW0pIHtcbiAgICAgIHRoaXMuX2J1Y2tldE5hbWVQYXJhbSA9IG5ldyBjZGsuQ2ZuUGFyYW1ldGVyKHNjb3BlLCAnTGFtYmRhU291cmNlQnVja2V0TmFtZVBhcmFtZXRlcicsIHtcbiAgICAgICAgdHlwZTogJ1N0cmluZycsXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuX29iamVjdEtleVBhcmFtKSB7XG4gICAgICB0aGlzLl9vYmplY3RLZXlQYXJhbSA9IG5ldyBjZGsuQ2ZuUGFyYW1ldGVyKHNjb3BlLCAnTGFtYmRhU291cmNlT2JqZWN0S2V5UGFyYW1ldGVyJywge1xuICAgICAgICB0eXBlOiAnU3RyaW5nJyxcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBzM0xvY2F0aW9uOiB7XG4gICAgICAgIGJ1Y2tldE5hbWU6IHRoaXMuX2J1Y2tldE5hbWVQYXJhbS52YWx1ZUFzU3RyaW5nLFxuICAgICAgICBvYmplY3RLZXk6IHRoaXMuX29iamVjdEtleVBhcmFtLnZhbHVlQXNTdHJpbmcsXG4gICAgICB9LFxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIGEgcGFyYW1ldGVycyBtYXAgZnJvbSB0aGlzIGluc3RhbmNlJ3MgQ2xvdWRGb3JtYXRpb24gcGFyYW1ldGVycy5cbiAgICpcbiAgICogSXQgcmV0dXJucyBhIG1hcCB3aXRoIDIga2V5cyB0aGF0IGNvcnJlc3BvbmQgdG8gdGhlIG5hbWVzIG9mIHRoZSBwYXJhbWV0ZXJzIGRlZmluZWQgaW4gdGhpcyBMYW1iZGEgY29kZSxcbiAgICogYW5kIGFzIHZhbHVlcyBpdCBjb250YWlucyB0aGUgYXBwcm9wcmlhdGUgZXhwcmVzc2lvbnMgcG9pbnRpbmcgYXQgdGhlIHByb3ZpZGVkIFMzIGxvY2F0aW9uXG4gICAqIChtb3N0IGxpa2VseSwgb2J0YWluZWQgZnJvbSBhIENvZGVQaXBlbGluZSBBcnRpZmFjdCBieSBjYWxsaW5nIHRoZSBgYXJ0aWZhY3QuczNMb2NhdGlvbmAgbWV0aG9kKS5cbiAgICogVGhlIHJlc3VsdCBzaG91bGQgYmUgcHJvdmlkZWQgdG8gdGhlIENsb3VkRm9ybWF0aW9uIEFjdGlvblxuICAgKiB0aGF0IGlzIGRlcGxveWluZyB0aGUgU3RhY2sgdGhhdCB0aGUgTGFtYmRhIHdpdGggdGhpcyBjb2RlIGlzIHBhcnQgb2YsXG4gICAqIGluIHRoZSBgcGFyYW1ldGVyT3ZlcnJpZGVzYCBwcm9wZXJ0eS5cbiAgICpcbiAgICogQHBhcmFtIGxvY2F0aW9uIHRoZSBsb2NhdGlvbiBvZiB0aGUgb2JqZWN0IGluIFMzIHRoYXQgcmVwcmVzZW50cyB0aGUgTGFtYmRhIGNvZGVcbiAgICovXG4gIHB1YmxpYyBhc3NpZ24obG9jYXRpb246IHMzLkxvY2F0aW9uKTogeyBbbmFtZTogc3RyaW5nXTogYW55IH0ge1xuICAgIGNvbnN0IHJldDogeyBbbmFtZTogc3RyaW5nXTogYW55IH0gPSB7fTtcbiAgICByZXRbdGhpcy5idWNrZXROYW1lUGFyYW1dID0gbG9jYXRpb24uYnVja2V0TmFtZTtcbiAgICByZXRbdGhpcy5vYmplY3RLZXlQYXJhbV0gPSBsb2NhdGlvbi5vYmplY3RLZXk7XG4gICAgcmV0dXJuIHJldDtcbiAgfVxuXG4gIHB1YmxpYyBnZXQgYnVja2V0TmFtZVBhcmFtKCk6IHN0cmluZyB7XG4gICAgaWYgKHRoaXMuX2J1Y2tldE5hbWVQYXJhbSkge1xuICAgICAgcmV0dXJuIHRoaXMuX2J1Y2tldE5hbWVQYXJhbS5sb2dpY2FsSWQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignUGFzcyBDZm5QYXJhbWV0ZXJzQ29kZSB0byBhIExhbWJkYSBGdW5jdGlvbiBiZWZvcmUgYWNjZXNzaW5nIHRoZSBidWNrZXROYW1lUGFyYW0gcHJvcGVydHknKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgZ2V0IG9iamVjdEtleVBhcmFtKCk6IHN0cmluZyB7XG4gICAgaWYgKHRoaXMuX29iamVjdEtleVBhcmFtKSB7XG4gICAgICByZXR1cm4gdGhpcy5fb2JqZWN0S2V5UGFyYW0ubG9naWNhbElkO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Bhc3MgQ2ZuUGFyYW1ldGVyc0NvZGUgdG8gYSBMYW1iZGEgRnVuY3Rpb24gYmVmb3JlIGFjY2Vzc2luZyB0aGUgb2JqZWN0S2V5UGFyYW0gcHJvcGVydHknKTtcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBQcm9wZXJ0aWVzIHRvIGluaXRpYWxpemUgYSBuZXcgRWNySW1hZ2VDb2RlXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgRWNySW1hZ2VDb2RlUHJvcHMge1xuICAvKipcbiAgICogU3BlY2lmeSBvciBvdmVycmlkZSB0aGUgQ01EIG9uIHRoZSBzcGVjaWZpZWQgRG9ja2VyIGltYWdlIG9yIERvY2tlcmZpbGUuXG4gICAqIFRoaXMgbmVlZHMgdG8gYmUgaW4gdGhlICdleGVjIGZvcm0nLCB2aXouLCBgWyAnZXhlY3V0YWJsZScsICdwYXJhbTEnLCAncGFyYW0yJyBdYC5cbiAgICogQHNlZSBodHRwczovL2RvY3MuZG9ja2VyLmNvbS9lbmdpbmUvcmVmZXJlbmNlL2J1aWxkZXIvI2NtZFxuICAgKiBAZGVmYXVsdCAtIHVzZSB0aGUgQ01EIHNwZWNpZmllZCBpbiB0aGUgZG9ja2VyIGltYWdlIG9yIERvY2tlcmZpbGUuXG4gICAqL1xuICByZWFkb25seSBjbWQ/OiBzdHJpbmdbXTtcblxuICAvKipcbiAgICogU3BlY2lmeSBvciBvdmVycmlkZSB0aGUgRU5UUllQT0lOVCBvbiB0aGUgc3BlY2lmaWVkIERvY2tlciBpbWFnZSBvciBEb2NrZXJmaWxlLlxuICAgKiBBbiBFTlRSWVBPSU5UIGFsbG93cyB5b3UgdG8gY29uZmlndXJlIGEgY29udGFpbmVyIHRoYXQgd2lsbCBydW4gYXMgYW4gZXhlY3V0YWJsZS5cbiAgICogVGhpcyBuZWVkcyB0byBiZSBpbiB0aGUgJ2V4ZWMgZm9ybScsIHZpei4sIGBbICdleGVjdXRhYmxlJywgJ3BhcmFtMScsICdwYXJhbTInIF1gLlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5kb2NrZXIuY29tL2VuZ2luZS9yZWZlcmVuY2UvYnVpbGRlci8jZW50cnlwb2ludFxuICAgKiBAZGVmYXVsdCAtIHVzZSB0aGUgRU5UUllQT0lOVCBpbiB0aGUgZG9ja2VyIGltYWdlIG9yIERvY2tlcmZpbGUuXG4gICAqL1xuICByZWFkb25seSBlbnRyeXBvaW50Pzogc3RyaW5nW107XG5cbiAgLyoqXG4gICAqIFNwZWNpZnkgb3Igb3ZlcnJpZGUgdGhlIFdPUktESVIgb24gdGhlIHNwZWNpZmllZCBEb2NrZXIgaW1hZ2Ugb3IgRG9ja2VyZmlsZS5cbiAgICogQSBXT1JLRElSIGFsbG93cyB5b3UgdG8gY29uZmlndXJlIHRoZSB3b3JraW5nIGRpcmVjdG9yeSB0aGUgY29udGFpbmVyIHdpbGwgdXNlLlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5kb2NrZXIuY29tL2VuZ2luZS9yZWZlcmVuY2UvYnVpbGRlci8jd29ya2RpclxuICAgKiBAZGVmYXVsdCAtIHVzZSB0aGUgV09SS0RJUiBpbiB0aGUgZG9ja2VyIGltYWdlIG9yIERvY2tlcmZpbGUuXG4gICAqL1xuICByZWFkb25seSB3b3JraW5nRGlyZWN0b3J5Pzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgaW1hZ2UgdGFnIHRvIHVzZSB3aGVuIHB1bGxpbmcgdGhlIGltYWdlIGZyb20gRUNSLlxuICAgKiBAZGVmYXVsdCAnbGF0ZXN0J1xuICAgKiBAZGVwcmVjYXRlZCB1c2UgYHRhZ09yRGlnZXN0YFxuICAgKi9cbiAgcmVhZG9ubHkgdGFnPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgaW1hZ2UgdGFnIG9yIGRpZ2VzdCB0byB1c2Ugd2hlbiBwdWxsaW5nIHRoZSBpbWFnZSBmcm9tIEVDUiAoZGlnZXN0cyBtdXN0IHN0YXJ0IHdpdGggYHNoYTI1NjpgKS5cbiAgICogQGRlZmF1bHQgJ2xhdGVzdCdcbiAgICovXG4gIHJlYWRvbmx5IHRhZ09yRGlnZXN0Pzogc3RyaW5nO1xufVxuXG4vKipcbiAqIFJlcHJlc2VudHMgYSBEb2NrZXIgaW1hZ2UgaW4gRUNSIHRoYXQgY2FuIGJlIGJvdW5kIGFzIExhbWJkYSBDb2RlLlxuICovXG5leHBvcnQgY2xhc3MgRWNySW1hZ2VDb2RlIGV4dGVuZHMgQ29kZSB7XG4gIHB1YmxpYyByZWFkb25seSBpc0lubGluZTogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgcmVwb3NpdG9yeTogZWNyLklSZXBvc2l0b3J5LCBwcml2YXRlIHJlYWRvbmx5IHByb3BzOiBFY3JJbWFnZUNvZGVQcm9wcyA9IHt9KSB7XG4gICAgc3VwZXIoKTtcbiAgfVxuXG4gIHB1YmxpYyBiaW5kKF86IENvbnN0cnVjdCk6IENvZGVDb25maWcge1xuICAgIHRoaXMucmVwb3NpdG9yeS5ncmFudFB1bGwobmV3IGlhbS5TZXJ2aWNlUHJpbmNpcGFsKCdsYW1iZGEuYW1hem9uYXdzLmNvbScpKTtcblxuICAgIHJldHVybiB7XG4gICAgICBpbWFnZToge1xuICAgICAgICBpbWFnZVVyaTogdGhpcy5yZXBvc2l0b3J5LnJlcG9zaXRvcnlVcmlGb3JUYWdPckRpZ2VzdCh0aGlzLnByb3BzPy50YWdPckRpZ2VzdCA/PyB0aGlzLnByb3BzPy50YWcgPz8gJ2xhdGVzdCcpLFxuICAgICAgICBjbWQ6IHRoaXMucHJvcHMuY21kLFxuICAgICAgICBlbnRyeXBvaW50OiB0aGlzLnByb3BzLmVudHJ5cG9pbnQsXG4gICAgICAgIHdvcmtpbmdEaXJlY3Rvcnk6IHRoaXMucHJvcHMud29ya2luZ0RpcmVjdG9yeSxcbiAgICAgIH0sXG4gICAgfTtcbiAgfVxufVxuXG4vKipcbiAqIFByb3BlcnRpZXMgdG8gaW5pdGlhbGl6ZSBhIG5ldyBBc3NldEltYWdlXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQXNzZXRJbWFnZUNvZGVQcm9wcyBleHRlbmRzIGVjcl9hc3NldHMuRG9ja2VySW1hZ2VBc3NldE9wdGlvbnMge1xuICAvKipcbiAgICogU3BlY2lmeSBvciBvdmVycmlkZSB0aGUgQ01EIG9uIHRoZSBzcGVjaWZpZWQgRG9ja2VyIGltYWdlIG9yIERvY2tlcmZpbGUuXG4gICAqIFRoaXMgbmVlZHMgdG8gYmUgaW4gdGhlICdleGVjIGZvcm0nLCB2aXouLCBgWyAnZXhlY3V0YWJsZScsICdwYXJhbTEnLCAncGFyYW0yJyBdYC5cbiAgICogQHNlZSBodHRwczovL2RvY3MuZG9ja2VyLmNvbS9lbmdpbmUvcmVmZXJlbmNlL2J1aWxkZXIvI2NtZFxuICAgKiBAZGVmYXVsdCAtIHVzZSB0aGUgQ01EIHNwZWNpZmllZCBpbiB0aGUgZG9ja2VyIGltYWdlIG9yIERvY2tlcmZpbGUuXG4gICAqL1xuICByZWFkb25seSBjbWQ/OiBzdHJpbmdbXTtcblxuICAvKipcbiAgICogU3BlY2lmeSBvciBvdmVycmlkZSB0aGUgRU5UUllQT0lOVCBvbiB0aGUgc3BlY2lmaWVkIERvY2tlciBpbWFnZSBvciBEb2NrZXJmaWxlLlxuICAgKiBBbiBFTlRSWVBPSU5UIGFsbG93cyB5b3UgdG8gY29uZmlndXJlIGEgY29udGFpbmVyIHRoYXQgd2lsbCBydW4gYXMgYW4gZXhlY3V0YWJsZS5cbiAgICogVGhpcyBuZWVkcyB0byBiZSBpbiB0aGUgJ2V4ZWMgZm9ybScsIHZpei4sIGBbICdleGVjdXRhYmxlJywgJ3BhcmFtMScsICdwYXJhbTInIF1gLlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5kb2NrZXIuY29tL2VuZ2luZS9yZWZlcmVuY2UvYnVpbGRlci8jZW50cnlwb2ludFxuICAgKiBAZGVmYXVsdCAtIHVzZSB0aGUgRU5UUllQT0lOVCBpbiB0aGUgZG9ja2VyIGltYWdlIG9yIERvY2tlcmZpbGUuXG4gICAqL1xuICByZWFkb25seSBlbnRyeXBvaW50Pzogc3RyaW5nW107XG5cbiAgLyoqXG4gICAqIFNwZWNpZnkgb3Igb3ZlcnJpZGUgdGhlIFdPUktESVIgb24gdGhlIHNwZWNpZmllZCBEb2NrZXIgaW1hZ2Ugb3IgRG9ja2VyZmlsZS5cbiAgICogQSBXT1JLRElSIGFsbG93cyB5b3UgdG8gY29uZmlndXJlIHRoZSB3b3JraW5nIGRpcmVjdG9yeSB0aGUgY29udGFpbmVyIHdpbGwgdXNlLlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5kb2NrZXIuY29tL2VuZ2luZS9yZWZlcmVuY2UvYnVpbGRlci8jd29ya2RpclxuICAgKiBAZGVmYXVsdCAtIHVzZSB0aGUgV09SS0RJUiBpbiB0aGUgZG9ja2VyIGltYWdlIG9yIERvY2tlcmZpbGUuXG4gICAqL1xuICByZWFkb25seSB3b3JraW5nRGlyZWN0b3J5Pzogc3RyaW5nO1xufVxuXG4vKipcbiAqIFJlcHJlc2VudHMgYW4gRUNSIGltYWdlIHRoYXQgd2lsbCBiZSBjb25zdHJ1Y3RlZCBmcm9tIHRoZSBzcGVjaWZpZWQgYXNzZXQgYW5kIGNhbiBiZSBib3VuZCBhcyBMYW1iZGEgY29kZS5cbiAqL1xuZXhwb3J0IGNsYXNzIEFzc2V0SW1hZ2VDb2RlIGV4dGVuZHMgQ29kZSB7XG4gIHB1YmxpYyByZWFkb25seSBpc0lubGluZTogYm9vbGVhbiA9IGZhbHNlO1xuICBwcml2YXRlIGFzc2V0PzogZWNyX2Fzc2V0cy5Eb2NrZXJJbWFnZUFzc2V0O1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgZGlyZWN0b3J5OiBzdHJpbmcsIHByaXZhdGUgcmVhZG9ubHkgcHJvcHM6IEFzc2V0SW1hZ2VDb2RlUHJvcHMpIHtcbiAgICBzdXBlcigpO1xuICB9XG5cbiAgcHVibGljIGJpbmQoc2NvcGU6IENvbnN0cnVjdCk6IENvZGVDb25maWcge1xuICAgIC8vIElmIHRoZSBzYW1lIEFzc2V0SW1hZ2VDb2RlIGlzIHVzZWQgbXVsdGlwbGUgdGltZXMsIHJldGFpbiBvbmx5IHRoZSBmaXJzdCBpbnN0YW50aWF0aW9uLlxuICAgIGlmICghdGhpcy5hc3NldCkge1xuICAgICAgdGhpcy5hc3NldCA9IG5ldyBlY3JfYXNzZXRzLkRvY2tlckltYWdlQXNzZXQoc2NvcGUsICdBc3NldEltYWdlJywge1xuICAgICAgICBkaXJlY3Rvcnk6IHRoaXMuZGlyZWN0b3J5LFxuICAgICAgICAuLi50aGlzLnByb3BzLFxuICAgICAgfSk7XG4gICAgICB0aGlzLmFzc2V0LnJlcG9zaXRvcnkuZ3JhbnRQdWxsKG5ldyBpYW0uU2VydmljZVByaW5jaXBhbCgnbGFtYmRhLmFtYXpvbmF3cy5jb20nKSk7XG4gICAgfSBlbHNlIGlmIChjZGsuU3RhY2sub2YodGhpcy5hc3NldCkgIT09IGNkay5TdGFjay5vZihzY29wZSkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgQXNzZXQgaXMgYWxyZWFkeSBhc3NvY2lhdGVkIHdpdGggYW5vdGhlciBzdGFjayAnJHtjZGsuU3RhY2sub2YodGhpcy5hc3NldCkuc3RhY2tOYW1lfScuIGAgK1xuICAgICAgICAnQ3JlYXRlIGEgbmV3IENvZGUgaW5zdGFuY2UgZm9yIGV2ZXJ5IHN0YWNrLicpO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBpbWFnZToge1xuICAgICAgICBpbWFnZVVyaTogdGhpcy5hc3NldC5pbWFnZVVyaSxcbiAgICAgICAgZW50cnlwb2ludDogdGhpcy5wcm9wcy5lbnRyeXBvaW50LFxuICAgICAgICBjbWQ6IHRoaXMucHJvcHMuY21kLFxuICAgICAgICB3b3JraW5nRGlyZWN0b3J5OiB0aGlzLnByb3BzLndvcmtpbmdEaXJlY3RvcnksXG4gICAgICB9LFxuICAgIH07XG4gIH1cblxuICBwdWJsaWMgYmluZFRvUmVzb3VyY2UocmVzb3VyY2U6IGNkay5DZm5SZXNvdXJjZSwgb3B0aW9uczogUmVzb3VyY2VCaW5kT3B0aW9ucyA9IHsgfSkge1xuICAgIGlmICghdGhpcy5hc3NldCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdiaW5kVG9SZXNvdXJjZSgpIG11c3QgYmUgY2FsbGVkIGFmdGVyIGJpbmQoKScpO1xuICAgIH1cblxuICAgIGNvbnN0IHJlc291cmNlUHJvcGVydHkgPSBvcHRpb25zLnJlc291cmNlUHJvcGVydHkgfHwgJ0NvZGUuSW1hZ2VVcmknO1xuXG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2F3cy9hd3MtY2RrL2lzc3Vlcy8xNDU5M1xuICAgIHRoaXMuYXNzZXQuYWRkUmVzb3VyY2VNZXRhZGF0YShyZXNvdXJjZSwgcmVzb3VyY2VQcm9wZXJ0eSk7XG4gIH1cbn1cblxuLyoqXG4gKiBPcHRpb25zIHdoZW4gY3JlYXRpbmcgYW4gYXNzZXQgZnJvbSBhIERvY2tlciBidWlsZC5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBEb2NrZXJCdWlsZEFzc2V0T3B0aW9ucyBleHRlbmRzIGNkay5Eb2NrZXJCdWlsZE9wdGlvbnMge1xuICAvKipcbiAgICogVGhlIHBhdGggaW4gdGhlIERvY2tlciBpbWFnZSB3aGVyZSB0aGUgYXNzZXQgaXMgbG9jYXRlZCBhZnRlciB0aGUgYnVpbGRcbiAgICogb3BlcmF0aW9uLlxuICAgKlxuICAgKiBAZGVmYXVsdCAvYXNzZXRcbiAgICovXG4gIHJlYWRvbmx5IGltYWdlUGF0aD86IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIHBhdGggb24gdGhlIGxvY2FsIGZpbGVzeXN0ZW0gd2hlcmUgdGhlIGFzc2V0IHdpbGwgYmUgY29waWVkXG4gICAqIHVzaW5nIGBkb2NrZXIgY3BgLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIGEgdW5pcXVlIHRlbXBvcmFyeSBkaXJlY3RvcnkgaW4gdGhlIHN5c3RlbSB0ZW1wIGRpcmVjdG9yeVxuICAgKi9cbiAgcmVhZG9ubHkgb3V0cHV0UGF0aD86IHN0cmluZztcbn1cbiJdfQ==