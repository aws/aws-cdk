"use strict";
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Expires = exports.StorageClass = exports.ServerSideEncryption = exports.CacheControl = exports.BucketDeployment = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const path = require("path");
const efs = require("@aws-cdk/aws-efs");
const iam = require("@aws-cdk/aws-iam");
const lambda = require("@aws-cdk/aws-lambda");
const s3 = require("@aws-cdk/aws-s3");
const cdk = require("@aws-cdk/core");
const lambda_layer_awscli_1 = require("@aws-cdk/lambda-layer-awscli");
const case_1 = require("case");
const constructs_1 = require("constructs");
// tag key has a limit of 128 characters
const CUSTOM_RESOURCE_OWNER_TAG = 'aws-cdk:cr-owned';
/**
 * `BucketDeployment` populates an S3 bucket with the contents of .zip files from
 * other S3 buckets or from local disk
 */
class BucketDeployment extends constructs_1.Construct {
    constructor(scope, id, props) {
        super(scope, id);
        this.requestDestinationArn = false;
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_s3_deployment_BucketDeploymentProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, BucketDeployment);
            }
            throw error;
        }
        if (props.distributionPaths) {
            if (!props.distribution) {
                throw new Error('Distribution must be specified if distribution paths are specified');
            }
            if (!cdk.Token.isUnresolved(props.distributionPaths)) {
                if (!props.distributionPaths.every(distributionPath => cdk.Token.isUnresolved(distributionPath) || distributionPath.startsWith('/'))) {
                    throw new Error('Distribution paths must start with "/"');
                }
            }
        }
        if (props.useEfs && !props.vpc) {
            throw new Error('Vpc must be specified if useEfs is set');
        }
        this.destinationBucket = props.destinationBucket;
        const accessPointPath = '/lambda';
        let accessPoint;
        if (props.useEfs && props.vpc) {
            const accessMode = '0777';
            const fileSystem = this.getOrCreateEfsFileSystem(scope, {
                vpc: props.vpc,
                removalPolicy: cdk.RemovalPolicy.DESTROY,
            });
            accessPoint = fileSystem.addAccessPoint('AccessPoint', {
                path: accessPointPath,
                createAcl: {
                    ownerUid: '1001',
                    ownerGid: '1001',
                    permissions: accessMode,
                },
                posixUser: {
                    uid: '1001',
                    gid: '1001',
                },
            });
            accessPoint.node.addDependency(fileSystem.mountTargetsAvailable);
        }
        // Making VPC dependent on BucketDeployment so that CFN stack deletion is smooth.
        // Refer comments on https://github.com/aws/aws-cdk/pull/15220 for more details.
        if (props.vpc) {
            this.node.addDependency(props.vpc);
        }
        const mountPath = `/mnt${accessPointPath}`;
        const handler = new lambda.SingletonFunction(this, 'CustomResourceHandler', {
            uuid: this.renderSingletonUuid(props.memoryLimit, props.ephemeralStorageSize, props.vpc),
            code: lambda.Code.fromAsset(path.join(__dirname, 'lambda')),
            layers: [new lambda_layer_awscli_1.AwsCliLayer(this, 'AwsCliLayer')],
            runtime: lambda.Runtime.PYTHON_3_9,
            environment: props.useEfs ? {
                MOUNT_PATH: mountPath,
            } : undefined,
            handler: 'index.handler',
            lambdaPurpose: 'Custom::CDKBucketDeployment',
            timeout: cdk.Duration.minutes(15),
            role: props.role,
            memorySize: props.memoryLimit,
            ephemeralStorageSize: props.ephemeralStorageSize,
            vpc: props.vpc,
            vpcSubnets: props.vpcSubnets,
            filesystem: accessPoint ? lambda.FileSystem.fromEfsAccessPoint(accessPoint, mountPath) : undefined,
            logRetention: props.logRetention,
        });
        const handlerRole = handler.role;
        if (!handlerRole) {
            throw new Error('lambda.SingletonFunction should have created a Role');
        }
        this.handlerRole = handlerRole;
        this.sources = props.sources.map((source) => source.bind(this, { handlerRole: this.handlerRole }));
        this.destinationBucket.grantReadWrite(handler);
        if (props.accessControl) {
            this.destinationBucket.grantPutAcl(handler);
        }
        if (props.distribution) {
            handler.addToRolePolicy(new iam.PolicyStatement({
                effect: iam.Effect.ALLOW,
                actions: ['cloudfront:GetInvalidation', 'cloudfront:CreateInvalidation'],
                resources: ['*'],
            }));
        }
        // Markers are not replaced if zip sources are not extracted, so throw an error
        // if extraction is not wanted and sources have markers.
        const _this = this;
        this.node.addValidation({
            validate() {
                if (_this.sources.some(source => source.markers) && props.extract == false) {
                    return ['Some sources are incompatible with extract=false; sources with deploy-time values (such as \'snsTopic.topicArn\') must be extracted.'];
                }
                return [];
            },
        });
        const crUniqueId = `CustomResource${this.renderUniqueId(props.memoryLimit, props.ephemeralStorageSize, props.vpc)}`;
        this.cr = new cdk.CustomResource(this, crUniqueId, {
            serviceToken: handler.functionArn,
            resourceType: 'Custom::CDKBucketDeployment',
            properties: {
                SourceBucketNames: cdk.Lazy.list({ produce: () => this.sources.map(source => source.bucket.bucketName) }),
                SourceObjectKeys: cdk.Lazy.list({ produce: () => this.sources.map(source => source.zipObjectKey) }),
                SourceMarkers: cdk.Lazy.any({
                    produce: () => {
                        return this.sources.reduce((acc, source) => {
                            if (source.markers) {
                                acc.push(source.markers);
                                // if there are more than 1 source, then all sources
                                // require markers (custom resource will throw an error otherwise)
                            }
                            else if (this.sources.length > 1) {
                                acc.push({});
                            }
                            return acc;
                        }, []);
                    },
                }, { omitEmptyArray: true }),
                DestinationBucketName: this.destinationBucket.bucketName,
                DestinationBucketKeyPrefix: props.destinationKeyPrefix,
                RetainOnDelete: props.retainOnDelete,
                Extract: props.extract,
                Prune: props.prune ?? true,
                Exclude: props.exclude,
                Include: props.include,
                UserMetadata: props.metadata ? mapUserMetadata(props.metadata) : undefined,
                SystemMetadata: mapSystemMetadata(props),
                DistributionId: props.distribution?.distributionId,
                DistributionPaths: props.distributionPaths,
                // Passing through the ARN sequences dependency on the deployment
                DestinationBucketArn: cdk.Lazy.string({ produce: () => this.requestDestinationArn ? this.destinationBucket.bucketArn : undefined }),
            },
        });
        let prefix = props.destinationKeyPrefix ?
            `:${props.destinationKeyPrefix}` :
            '';
        prefix += `:${this.cr.node.addr.slice(-8)}`;
        const tagKey = CUSTOM_RESOURCE_OWNER_TAG + prefix;
        // destinationKeyPrefix can be 104 characters before we hit
        // the tag key limit of 128
        // '/this/is/a/random/key/prefix/that/is/a/lot/of/characters/do/we/think/that/it/will/ever/be/this/long?????'
        // better to throw an error here than wait for CloudFormation to fail
        if (!cdk.Token.isUnresolved(tagKey) && tagKey.length > 128) {
            throw new Error('The BucketDeployment construct requires that the "destinationKeyPrefix" be <=104 characters.');
        }
        /*
         * This will add a tag to the deployment bucket in the format of
         * `aws-cdk:cr-owned:{keyPrefix}:{uniqueHash}`
         *
         * For example:
         * {
         *   Key: 'aws-cdk:cr-owned:deploy/here/:240D17B3',
         *   Value: 'true',
         * }
         *
         * This will allow for scenarios where there is a single S3 Bucket that has multiple
         * BucketDeployment resources deploying to it. Each bucket + keyPrefix can be "owned" by
         * 1 or more BucketDeployment resources. Since there are some scenarios where multiple BucketDeployment
         * resources can deploy to the same bucket and key prefix (e.g. using include/exclude) we
         * also append part of the id to make the key unique.
         *
         * As long as a bucket + keyPrefix is "owned" by a BucketDeployment resource, another CR
         * cannot delete data. There are a couple of scenarios where this comes into play.
         *
         * 1. If the LogicalResourceId of the CustomResource changes (e.g. the crUniqueId changes)
         * CloudFormation will first issue a 'Create' to create the new CustomResource and will
         * update the Tag on the bucket. CloudFormation will then issue a 'Delete' on the old CustomResource
         * and since the new CR "owns" the Bucket+keyPrefix it will not delete the contents of the bucket
         *
         * 2. If the BucketDeployment resource is deleted _and_ it is the only CR for that bucket+keyPrefix
         * then CloudFormation will first remove the tag from the bucket and then issue a "Delete" to the
         * CR. Since there are no tags indicating that this bucket+keyPrefix is "owned" then it will delete
         * the contents.
         *
         * 3. If the BucketDeployment resource is deleted _and_ it is *not* the only CR for that bucket:keyPrefix
         * then CloudFormation will first remove the tag from the bucket and then issue a "Delete" to the CR.
         * Since there are other CRs that also "own" that bucket+keyPrefix there will still be a tag on the bucket
         * and the contents will not be removed.
         *
         * 4. If the BucketDeployment resource _and_ the S3 Bucket are both removed, then CloudFormation will first
         * issue a "Delete" to the CR and since there is a tag on the bucket the contents will not be removed. If you
         * want the contents of the bucket to be removed on bucket deletion, then `autoDeleteObjects` property should
         * be set to true on the Bucket.
         */
        cdk.Tags.of(this.destinationBucket).add(tagKey, 'true');
    }
    /**
     * The bucket after the deployment
     *
     * If you want to reference the destination bucket in another construct and make sure the
     * bucket deployment has happened before the next operation is started, pass the other construct
     * a reference to `deployment.deployedBucket`.
     *
     * Note that this only returns an immutable reference to the destination bucket.
     * If sequenced access to the original destination bucket is required, you may add a dependency
     * on the bucket deployment instead: `otherResource.node.addDependency(deployment)`
     */
    get deployedBucket() {
        this.requestDestinationArn = true;
        this._deployedBucket = this._deployedBucket ?? s3.Bucket.fromBucketAttributes(this, 'DestinationBucket', {
            bucketArn: cdk.Token.asString(this.cr.getAtt('DestinationBucketArn')),
            region: this.destinationBucket.env.region,
            account: this.destinationBucket.env.account,
            isWebsite: this.destinationBucket.isWebsite,
        });
        return this._deployedBucket;
    }
    /**
     * The object keys for the sources deployed to the S3 bucket.
     *
     * This returns a list of tokenized object keys for source files that are deployed to the bucket.
     *
     * This can be useful when using `BucketDeployment` with `extract` set to `false` and you need to reference
     * the object key that resides in the bucket for that zip source file somewhere else in your CDK
     * application, such as in a CFN output.
     *
     * For example, use `Fn.select(0, myBucketDeployment.objectKeys)` to reference the object key of the
     * first source file in your bucket deployment.
     */
    get objectKeys() {
        const objectKeys = cdk.Token.asList(this.cr.getAtt('SourceObjectKeys'));
        return objectKeys;
    }
    /**
     * Add an additional source to the bucket deployment
     *
     * @example
     * declare const websiteBucket: s3.IBucket;
     * const deployment = new s3deploy.BucketDeployment(this, 'Deployment', {
     *   sources: [s3deploy.Source.asset('./website-dist')],
     *   destinationBucket: websiteBucket,
     * });
     *
     * deployment.addSource(s3deploy.Source.asset('./another-asset'));
     */
    addSource(source) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_s3_deployment_ISource(source);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addSource);
            }
            throw error;
        }
        this.sources.push(source.bind(this, { handlerRole: this.handlerRole }));
    }
    renderUniqueId(memoryLimit, ephemeralStorageSize, vpc) {
        let uuid = '';
        // if the user specifes a custom memory limit, we define another singleton handler
        // with this configuration. otherwise, it won't be possible to use multiple
        // configurations since we have a singleton.
        if (memoryLimit) {
            if (cdk.Token.isUnresolved(memoryLimit)) {
                throw new Error("Can't use tokens when specifying 'memoryLimit' since we use it to identify the singleton custom resource handler.");
            }
            uuid += `-${memoryLimit.toString()}MiB`;
        }
        // if the user specifies a custom ephemeral storage size, we define another singleton handler
        // with this configuration. otherwise, it won't be possible to use multiple
        // configurations since we have a singleton.
        if (ephemeralStorageSize) {
            if (ephemeralStorageSize.isUnresolved()) {
                throw new Error("Can't use tokens when specifying 'ephemeralStorageSize' since we use it to identify the singleton custom resource handler.");
            }
            uuid += `-${ephemeralStorageSize.toMebibytes().toString()}MiB`;
        }
        // if the user specifies a VPC, we define another singleton handler
        // with this configuration. otherwise, it won't be possible to use multiple
        // configurations since we have a singleton.
        // A VPC is a must if EFS storage is used and that's why we are only using VPC in uuid.
        if (vpc) {
            uuid += `-${vpc.node.addr}`;
        }
        return uuid;
    }
    renderSingletonUuid(memoryLimit, ephemeralStorageSize, vpc) {
        let uuid = '8693BB64-9689-44B6-9AAF-B0CC9EB8756C';
        uuid += this.renderUniqueId(memoryLimit, ephemeralStorageSize, vpc);
        return uuid;
    }
    /**
     * Function to get/create a stack singleton instance of EFS FileSystem per vpc.
     *
     * @param scope Construct
     * @param fileSystemProps EFS FileSystemProps
     */
    getOrCreateEfsFileSystem(scope, fileSystemProps) {
        const stack = cdk.Stack.of(scope);
        const uuid = `BucketDeploymentEFS-VPC-${fileSystemProps.vpc.node.addr}`;
        return stack.node.tryFindChild(uuid) ?? new efs.FileSystem(scope, uuid, fileSystemProps);
    }
}
exports.BucketDeployment = BucketDeployment;
_a = JSII_RTTI_SYMBOL_1;
BucketDeployment[_a] = { fqn: "@aws-cdk/aws-s3-deployment.BucketDeployment", version: "0.0.0" };
/**
 * Metadata
 */
function mapUserMetadata(metadata) {
    const mapKey = (key) => key.toLowerCase();
    return Object.keys(metadata).reduce((o, key) => ({ ...o, [mapKey(key)]: metadata[key] }), {});
}
function mapSystemMetadata(metadata) {
    const res = {};
    if (metadata.cacheControl) {
        res['cache-control'] = metadata.cacheControl.map(c => c.value).join(', ');
    }
    if (metadata.expires) {
        res.expires = metadata.expires.date.toUTCString();
    }
    if (metadata.contentDisposition) {
        res['content-disposition'] = metadata.contentDisposition;
    }
    if (metadata.contentEncoding) {
        res['content-encoding'] = metadata.contentEncoding;
    }
    if (metadata.contentLanguage) {
        res['content-language'] = metadata.contentLanguage;
    }
    if (metadata.contentType) {
        res['content-type'] = metadata.contentType;
    }
    if (metadata.serverSideEncryption) {
        res.sse = metadata.serverSideEncryption;
    }
    if (metadata.storageClass) {
        res['storage-class'] = metadata.storageClass;
    }
    if (metadata.websiteRedirectLocation) {
        res['website-redirect'] = metadata.websiteRedirectLocation;
    }
    if (metadata.serverSideEncryptionAwsKmsKeyId) {
        res['sse-kms-key-id'] = metadata.serverSideEncryptionAwsKmsKeyId;
    }
    if (metadata.serverSideEncryptionCustomerAlgorithm) {
        res['sse-c-copy-source'] = metadata.serverSideEncryptionCustomerAlgorithm;
    }
    if (metadata.accessControl) {
        res.acl = case_1.kebab(metadata.accessControl.toString());
    }
    return Object.keys(res).length === 0 ? undefined : res;
}
/**
 * Used for HTTP cache-control header, which influences downstream caches.
 * @see https://docs.aws.amazon.com/AmazonS3/latest/dev/UsingMetadata.html#SysMetadata
 */
class CacheControl {
    constructor(
    /**
     * The raw cache control setting.
     */
    value) {
        this.value = value;
    }
    /**
     * Sets 'must-revalidate'.
     */
    static mustRevalidate() { return new CacheControl('must-revalidate'); }
    /**
     * Sets 'no-cache'.
     */
    static noCache() { return new CacheControl('no-cache'); }
    /**
     * Sets 'no-transform'.
     */
    static noTransform() { return new CacheControl('no-transform'); }
    /**
     * Sets 'public'.
     */
    static setPublic() { return new CacheControl('public'); }
    /**
     * Sets 'private'.
     */
    static setPrivate() { return new CacheControl('private'); }
    /**
     * Sets 'proxy-revalidate'.
     */
    static proxyRevalidate() { return new CacheControl('proxy-revalidate'); }
    /**
     * Sets 'max-age=<duration-in-seconds>'.
     */
    static maxAge(t) { return new CacheControl(`max-age=${t.toSeconds()}`); }
    /**
     * Sets 's-maxage=<duration-in-seconds>'.
     */
    static sMaxAge(t) { return new CacheControl(`s-maxage=${t.toSeconds()}`); }
    /**
     * Constructs a custom cache control key from the literal value.
     */
    static fromString(s) { return new CacheControl(s); }
}
exports.CacheControl = CacheControl;
_b = JSII_RTTI_SYMBOL_1;
CacheControl[_b] = { fqn: "@aws-cdk/aws-s3-deployment.CacheControl", version: "0.0.0" };
/**
 * Indicates whether server-side encryption is enabled for the object, and whether that encryption is
 * from the AWS Key Management Service (AWS KMS) or from Amazon S3 managed encryption (SSE-S3).
 * @see https://docs.aws.amazon.com/AmazonS3/latest/dev/UsingMetadata.html#SysMetadata
 */
var ServerSideEncryption;
(function (ServerSideEncryption) {
    /**
     * 'AES256'
     */
    ServerSideEncryption["AES_256"] = "AES256";
    /**
     * 'aws:kms'
     */
    ServerSideEncryption["AWS_KMS"] = "aws:kms";
})(ServerSideEncryption = exports.ServerSideEncryption || (exports.ServerSideEncryption = {}));
/**
 * Storage class used for storing the object.
 * @see https://docs.aws.amazon.com/AmazonS3/latest/dev/UsingMetadata.html#SysMetadata
 */
var StorageClass;
(function (StorageClass) {
    /**
     * 'STANDARD'
     */
    StorageClass["STANDARD"] = "STANDARD";
    /**
     * 'REDUCED_REDUNDANCY'
     */
    StorageClass["REDUCED_REDUNDANCY"] = "REDUCED_REDUNDANCY";
    /**
     * 'STANDARD_IA'
     */
    StorageClass["STANDARD_IA"] = "STANDARD_IA";
    /**
     * 'ONEZONE_IA'
     */
    StorageClass["ONEZONE_IA"] = "ONEZONE_IA";
    /**
     * 'INTELLIGENT_TIERING'
     */
    StorageClass["INTELLIGENT_TIERING"] = "INTELLIGENT_TIERING";
    /**
     * 'GLACIER'
     */
    StorageClass["GLACIER"] = "GLACIER";
    /**
     * 'DEEP_ARCHIVE'
     */
    StorageClass["DEEP_ARCHIVE"] = "DEEP_ARCHIVE";
})(StorageClass = exports.StorageClass || (exports.StorageClass = {}));
/**
 * Used for HTTP expires header, which influences downstream caches. Does NOT influence deletion of the object.
 * @see https://docs.aws.amazon.com/AmazonS3/latest/dev/UsingMetadata.html#SysMetadata
 *
 * @deprecated use core.Expiration
 */
class Expires {
    constructor(
    /**
     * The raw expiration date expression.
     */
    value) {
        this.value = value;
    }
    /**
     * Expire at the specified date
     * @param d date to expire at
     */
    static atDate(d) { try {
        jsiiDeprecationWarnings.print("@aws-cdk/aws-s3-deployment.Expires#atDate", "use core.Expiration");
    }
    catch (error) {
        if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
            Error.captureStackTrace(error, this.atDate);
        }
        throw error;
    } return new Expires(d.toUTCString()); }
    /**
     * Expire at the specified timestamp
     * @param t timestamp in unix milliseconds
     */
    static atTimestamp(t) { try {
        jsiiDeprecationWarnings.print("@aws-cdk/aws-s3-deployment.Expires#atTimestamp", "use core.Expiration");
    }
    catch (error) {
        if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
            Error.captureStackTrace(error, this.atTimestamp);
        }
        throw error;
    } return Expires.atDate(new Date(t)); }
    /**
     * Expire once the specified duration has passed since deployment time
     * @param t the duration to wait before expiring
     */
    static after(t) { try {
        jsiiDeprecationWarnings.print("@aws-cdk/aws-s3-deployment.Expires#after", "use core.Expiration");
    }
    catch (error) {
        if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
            Error.captureStackTrace(error, this.after);
        }
        throw error;
    } return Expires.atDate(new Date(Date.now() + t.toMilliseconds())); }
    /**
     * Create an expiration date from a raw date string.
     */
    static fromString(s) { try {
        jsiiDeprecationWarnings.print("@aws-cdk/aws-s3-deployment.Expires#fromString", "use core.Expiration");
    }
    catch (error) {
        if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
            Error.captureStackTrace(error, this.fromString);
        }
        throw error;
    } return new Expires(s); }
}
exports.Expires = Expires;
_c = JSII_RTTI_SYMBOL_1;
Expires[_c] = { fqn: "@aws-cdk/aws-s3-deployment.Expires", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVja2V0LWRlcGxveW1lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJidWNrZXQtZGVwbG95bWVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSw2QkFBNkI7QUFHN0Isd0NBQXdDO0FBQ3hDLHdDQUF3QztBQUN4Qyw4Q0FBOEM7QUFFOUMsc0NBQXNDO0FBQ3RDLHFDQUFxQztBQUNyQyxzRUFBMkQ7QUFDM0QsK0JBQTRDO0FBQzVDLDJDQUF1QztBQUd2Qyx3Q0FBd0M7QUFDeEMsTUFBTSx5QkFBeUIsR0FBRyxrQkFBa0IsQ0FBQztBQXdPckQ7OztHQUdHO0FBQ0gsTUFBYSxnQkFBaUIsU0FBUSxzQkFBUztJQVE3QyxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQTRCO1FBQ3BFLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFOWCwwQkFBcUIsR0FBWSxLQUFLLENBQUM7Ozs7OzsrQ0FIcEMsZ0JBQWdCOzs7O1FBV3pCLElBQUksS0FBSyxDQUFDLGlCQUFpQixFQUFFO1lBQzNCLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxFQUFFO2dCQUN2QixNQUFNLElBQUksS0FBSyxDQUFDLG9FQUFvRSxDQUFDLENBQUM7YUFDdkY7WUFDRCxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLGlCQUFpQixDQUFDLEVBQUU7Z0JBQ3BELElBQUksQ0FBQyxLQUFLLENBQUMsaUJBQWlCLENBQUMsS0FBSyxDQUFDLGdCQUFnQixDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLGdCQUFnQixDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFO29CQUNwSSxNQUFNLElBQUksS0FBSyxDQUFDLHdDQUF3QyxDQUFDLENBQUM7aUJBQzNEO2FBQ0Y7U0FDRjtRQUVELElBQUksS0FBSyxDQUFDLE1BQU0sSUFBSSxD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RztJQUNILDJEQUEyQyxDQUFBO0lBRTNDOztPQUVHO0lBQ0gsbUNBQW1CLENBQUE7SUFFbkI7O09BRUc7SUFDSCw2Q0FBNkIsQ0FBQTtBQUMvQixDQUFDLEVBcENXLFlBQVksR0FBWixvQkFBWSxLQUFaLG9CQUFZLFFBb0N2QjtBQUVEOzs7OztHQUtHO0FBQ0gsTUFBYSxPQUFPO0lBd0JsQjtJQUNFOztPQUVHO0lBQ2EsS0FBVTtRQUFWLFVBQUssR0FBTCxLQUFLLENBQUs7S0FDdkI7SUE1Qkw7OztPQUdHO0lBQ0ksTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFPOzs7Ozs7OztNQUFJLE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsRUFBRTtJQUV0RTs7O09BR0c7SUFDSSxNQUFNLENBQUMsV0FBVyxDQUFDLENBQVM7Ozs7Ozs7O01BQUksT0FBTyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtJQUU1RTs7O09BR0c7SUFDSSxNQUFNLENBQUMsS0FBSyxDQUFDLENBQWU7Ozs7Ozs7O01BQUksT0FBTyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsY0FBYyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUU7SUFFMUc7O09BRUc7SUFDSSxNQUFNLENBQUMsVUFBVSxDQUFDLENBQVM7Ozs7Ozs7O01BQUksT0FBTyxJQUFJLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFOztBQXRCaEUsMEJBOEJDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCAqIGFzIGNsb3VkZnJvbnQgZnJvbSAnQGF3cy1jZGsvYXdzLWNsb3VkZnJvbnQnO1xuaW1wb3J0ICogYXMgZWMyIGZyb20gJ0Bhd3MtY2RrL2F3cy1lYzInO1xuaW1wb3J0ICogYXMgZWZzIGZyb20gJ0Bhd3MtY2RrL2F3cy1lZnMnO1xuaW1wb3J0ICogYXMgaWFtIGZyb20gJ0Bhd3MtY2RrL2F3cy1pYW0nO1xuaW1wb3J0ICogYXMgbGFtYmRhIGZyb20gJ0Bhd3MtY2RrL2F3cy1sYW1iZGEnO1xuaW1wb3J0ICogYXMgbG9ncyBmcm9tICdAYXdzLWNkay9hd3MtbG9ncyc7XG5pbXBvcnQgKiBhcyBzMyBmcm9tICdAYXdzLWNkay9hd3MtczMnO1xuaW1wb3J0ICogYXMgY2RrIGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgQXdzQ2xpTGF5ZXIgfSBmcm9tICdAYXdzLWNkay9sYW1iZGEtbGF5ZXItYXdzY2xpJztcbmltcG9ydCB7IGtlYmFiIGFzIHRvS2ViYWJDYXNlIH0gZnJvbSAnY2FzZSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IElTb3VyY2UsIFNvdXJjZUNvbmZpZyB9IGZyb20gJy4vc291cmNlJztcblxuLy8gdGFnIGtleSBoYXMgYSBsaW1pdCBvZiAxMjggY2hhcmFjdGVyc1xuY29uc3QgQ1VTVE9NX1JFU09VUkNFX09XTkVSX1RBRyA9ICdhd3MtY2RrOmNyLW93bmVkJztcblxuLyoqXG4gKiBQcm9wZXJ0aWVzIGZvciBgQnVja2V0RGVwbG95bWVudGAuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQnVja2V0RGVwbG95bWVudFByb3BzIHtcbiAgLyoqXG4gICAqIFRoZSBzb3VyY2VzIGZyb20gd2hpY2ggdG8gZGVwbG95IHRoZSBjb250ZW50cyBvZiB0aGlzIGJ1Y2tldC5cbiAgICovXG4gIHJlYWRvbmx5IHNvdXJjZXM6IElTb3VyY2VbXTtcblxuICAvKipcbiAgICogVGhlIFMzIGJ1Y2tldCB0byBzeW5jIHRoZSBjb250ZW50cyBvZiB0aGUgemlwIGZpbGUgdG8uXG4gICAqL1xuICByZWFkb25seSBkZXN0aW5hdGlvbkJ1Y2tldDogczMuSUJ1Y2tldDtcblxuICAvKipcbiAgICogS2V5IHByZWZpeCBpbiB0aGUgZGVzdGluYXRpb24gYnVja2V0LlxuICAgKlxuICAgKiBNdXN0IGJlIDw9MTA0IGNoYXJhY3RlcnNcbiAgICpcbiAgICogQGRlZmF1bHQgXCIvXCIgKHVuemlwIHRvIHJvb3Qgb2YgdGhlIGRlc3RpbmF0aW9uIGJ1Y2tldClcbiAgICovXG4gIHJlYWRvbmx5IGRlc3RpbmF0aW9uS2V5UHJlZml4Pzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBJZiB0aGlzIGlzIHNldCwgdGhlIHppcCBmaWxlIHdpbGwgYmUgc3luY2VkIHRvIHRoZSBkZXN0aW5hdGlvbiBTMyBidWNrZXQgYW5kIGV4dHJhY3RlZC5cbiAgICogSWYgZmFsc2UsIHRoZSBmaWxlIHdpbGwgcmVtYWluIHppcHBlZCBpbiB0aGUgZGVzdGluYXRpb24gYnVja2V0LlxuICAgKiBAZGVmYXVsdCB0cnVlXG4gICAqL1xuICByZWFkb25seSBleHRyYWN0PzogYm9vbGVhbjtcblxuICAvKipcbiAgICogSWYgdGhpcyBpcyBzZXQsIG1hdGNoaW5nIGZpbGVzIG9yIG9iamVjdHMgd2lsbCBiZSBleGNsdWRlZCBmcm9tIHRoZSBkZXBsb3ltZW50J3Mgc3luY1xuICAgKiBjb21tYW5kLiBUaGlzIGNhbiBiZSB1c2VkIHRvIGV4Y2x1ZGUgYSBmaWxlIGZyb20gYmVpbmcgcHJ1bmVkIGluIHRoZSBkZXN0aW5hdGlvbiBidWNrZXQuXG4gICAqXG4gICAqIElmIHlvdSB3YW50IHRvIGp1c3QgZXhjbHVkZSBmaWxlcyBmcm9tIHRoZSBkZXBsb3ltZW50IHBhY2thZ2UgKHdoaWNoIGV4Y2x1ZGVzIHRoZXNlIGZpbGVzXG4gICAqIGV2YWx1YXRlZCB3aGVuIGludmFsaWRhdGluZyB0aGUgYXNzZXQpLCB5b3Ugc2hvdWxkIGxldmVyYWdlIHRoZSBgZXhjbHVkZWAgcHJvcGVydHkgb2ZcbiAgICogYEFzc2V0T3B0aW9uc2Agd2hlbiBkZWZpbmluZyB5b3VyIHNvdXJjZS5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBObyBleGNsdWRlIGZpbHRlcnMgYXJlIHVzZWRcbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vY2xpL2xhdGVzdC9yZWZlcmVuY2UvczMvaW5kZXguaHRtbCN1c2Utb2YtZXhjbHVkZS1hbmQtaW5jbHVkZS1maWx0ZXJzXG4gICAqL1xuICByZWFkb25seSBleGNsdWRlPzogc3RyaW5nW11cblxuICAvKipcbiAgICogSWYgdGhpcyBpcyBzZXQsIG1hdGNoaW5nIGZpbGVzIG9yIG9iamVjdHMgd2lsbCBiZSBpbmNsdWRlZCB3aXRoIHRoZSBkZXBsb3ltZW50J3Mgc3luY1xuICAgKiBjb21tYW5kLiBTaW5jZSBhbGwgZmlsZXMgZnJvbSB0aGUgZGVwbG95bWVudCBwYWNrYWdlIGFyZSBpbmNsdWRlZCBieSBkZWZhdWx0LCB0aGlzIHByb3BlcnR5XG4gICAqIGlzIHVzdWFsbHkgbGV2ZXJhZ2VkIGFsb25nc2lkZSBhbiBgZXhjbHVkZWAgZmlsdGVyLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vIGluY2x1ZGUgZmlsdGVycyBhcmUgdXNlZCBhbmQgYWxsIGZpbGVzIGFyZSBpbmNsdWRlZCB3aXRoIHRoZSBzeW5jIGNvbW1hbmRcbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vY2xpL2xhdGVzdC9yZWZlcmVuY2UvczMvaW5kZXguaHRtbCN1c2Utb2YtZXhjbHVkZS1hbmQtaW5jbHVkZS1maWx0ZXJzXG4gICAqL1xuICByZWFkb25seSBpbmNsdWRlPzogc3RyaW5nW11cblxuICAvKipcbiAgICogSWYgdGhpcyBpcyBzZXQgdG8gZmFsc2UsIGZpbGVzIGluIHRoZSBkZXN0aW5hdGlvbiBidWNrZXQgdGhhdFxuICAgKiBkbyBub3QgZXhpc3QgaW4gdGhlIGFzc2V0LCB3aWxsIE5PVCBiZSBkZWxldGVkIGR1cmluZyBkZXBsb3ltZW50IChjcmVhdGUvdXBkYXRlKS5cbiAgICpcbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vY2xpL2xhdGVzdC9yZWZlcmVuY2UvczMvc3luYy5odG1sXG4gICAqXG4gICAqIEBkZWZhdWx0IHRydWVcbiAgICovXG4gIHJlYWRvbmx5IHBydW5lPzogYm9vbGVhblxuXG4gIC8qKlxuICAgKiBJZiB0aGlzIGlzIHNldCB0byBcImZhbHNlXCIsIHRoZSBkZXN0aW5hdGlvbiBmaWxlcyB3aWxsIGJlIGRlbGV0ZWQgd2hlbiB0aGVcbiAgICogcmVzb3VyY2UgaXMgZGVsZXRlZCBvciB0aGUgZGVzdGluYXRpb24gaXMgdXBkYXRlZC5cbiAgICpcbiAgICogTk9USUNFOiBDb25maWd1cmluZyB0aGlzIHRvIFwiZmFsc2VcIiBtaWdodCBoYXZlIG9wZXJhdGlvbmFsIGltcGxpY2F0aW9ucy4gUGxlYXNlXG4gICAqIHZpc2l0IHRvIHRoZSBwYWNrYWdlIGRvY3VtZW50YXRpb24gcmVmZXJyZWQgYmVsb3cgdG8gbWFrZSBzdXJlIHlvdSBmdWxseSB1bmRlcnN0YW5kIHRob3NlIGltcGxpY2F0aW9ucy5cbiAgICpcbiAgICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vYXdzL2F3cy1jZGsvdHJlZS9tYWluL3BhY2thZ2VzLyU0MGF3cy1jZGsvYXdzLXMzLWRlcGxveW1lbnQjcmV0YWluLW9uLWRlbGV0ZVxuICAgKiBAZGVmYXVsdCB0cnVlIC0gd2hlbiByZXNvdXJjZSBpcyBkZWxldGVkL3VwZGF0ZWQsIGZpbGVzIGFyZSByZXRhaW5lZFxuICAgKi9cbiAgcmVhZG9ubHkgcmV0YWluT25EZWxldGU/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBUaGUgQ2xvdWRGcm9udCBkaXN0cmlidXRpb24gdXNpbmcgdGhlIGRlc3RpbmF0aW9uIGJ1Y2tldCBhcyBhbiBvcmlnaW4uXG4gICAqIEZpbGVzIGluIHRoZSBkaXN0cmlidXRpb24ncyBlZGdlIGNhY2hlcyB3aWxsIGJlIGludmFsaWRhdGVkIGFmdGVyXG4gICAqIGZpbGVzIGFyZSB1cGxvYWRlZCB0byB0aGUgZGVzdGluYXRpb24gYnVja2V0LlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vIGludmFsaWRhdGlvbiBvY2N1cnNcbiAgICovXG4gIHJlYWRvbmx5IGRpc3RyaWJ1dGlvbj86IGNsb3VkZnJvbnQuSURpc3RyaWJ1dGlvbjtcblxuICAvKipcbiAgICogVGhlIGZpbGUgcGF0aHMgdG8gaW52YWxpZGF0ZSBpbiB0aGUgQ2xvdWRGcm9udCBkaXN0cmlidXRpb24uXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gQWxsIGZpbGVzIHVuZGVyIHRoZSBkZXN0aW5hdGlvbiBidWNrZXQga2V5IHByZWZpeCB3aWxsIGJlIGludmFsaWRhdGVkLlxuICAgKi9cbiAgcmVhZG9ubHkgZGlzdHJpYnV0aW9uUGF0aHM/OiBzdHJpbmdbXTtcblxuXG4gIC8qKlxuICAgKiBUaGUgbnVtYmVyIG9mIGRheXMgdGhhdCB0aGUgbGFtYmRhIGZ1bmN0aW9uJ3MgbG9nIGV2ZW50cyBhcmUga2VwdCBpbiBDbG91ZFdhdGNoIExvZ3MuXG4gICAqXG4gICAqIEBkZWZhdWx0IGxvZ3MuUmV0ZW50aW9uRGF5cy5JTkZJTklURVxuICAgKi9cbiAgcmVhZG9ubHkgbG9nUmV0ZW50aW9uPzogbG9ncy5SZXRlbnRpb25EYXlzO1xuXG4gIC8qKlxuICAgKiBUaGUgYW1vdW50IG9mIG1lbW9yeSAoaW4gTWlCKSB0byBhbGxvY2F0ZSB0byB0aGUgQVdTIExhbWJkYSBmdW5jdGlvbiB3aGljaFxuICAgKiByZXBsaWNhdGVzIHRoZSBmaWxlcyBmcm9tIHRoZSBDREsgYnVja2V0IHRvIHRoZSBkZXN0aW5hdGlvbiBidWNrZXQuXG4gICAqXG4gICAqIElmIHlvdSBhcmUgZGVwbG95aW5nIGxhcmdlIGZpbGVzLCB5b3Ugd2lsbCBuZWVkIHRvIGluY3JlYXNlIHRoaXMgbnVtYmVyXG4gICAqIGFjY29yZGluZ2x5LlxuICAgKlxuICAgKiBAZGVmYXVsdCAxMjhcbiAgICovXG4gIHJlYWRvbmx5IG1lbW9yeUxpbWl0PzogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBUaGUgc2l6ZSBvZiB0aGUgQVdTIExhbWJkYSBmdW5jdGlvbuKAmXMgL3RtcCBkaXJlY3RvcnkgaW4gTWlCLlxuICAgKlxuICAgKiBAZGVmYXVsdCA1MTIgTWlCXG4gICAqL1xuICByZWFkb25seSBlcGhlbWVyYWxTdG9yYWdlU2l6ZT86IGNkay5TaXplO1xuXG4gIC8qKlxuICAgKiAgTW91bnQgYW4gRUZTIGZpbGUgc3lzdGVtLiBFbmFibGUgdGhpcyBpZiB5b3VyIGFzc2V0cyBhcmUgbGFyZ2UgYW5kIHlvdSBlbmNvdW50ZXIgZGlzayBzcGFjZSBlcnJvcnMuXG4gICAqICBFbmFibGluZyB0aGlzIG9wdGlvbiB3aWxsIHJlcXVpcmUgYSBWUEMgdG8gYmUgc3BlY2lmaWVkLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vIEVGUy4gTGFtYmRhIGhhcyBhY2Nlc3Mgb25seSB0byA1MTJNQiBvZiBkaXNrIHNwYWNlLlxuICAgKi9cbiAgcmVhZG9ubHkgdXNlRWZzPzogYm9vbGVhblxuXG4gIC8qKlxuICAgKiBFeGVjdXRpb24gcm9sZSBhc3NvY2lhdGVkIHdpdGggdGhpcyBmdW5jdGlvblxuICAgKlxuICAgKiBAZGVmYXVsdCAtIEEgcm9sZSBpcyBhdXRvbWF0aWNhbGx5IGNyZWF0ZWRcbiAgICovXG4gIHJlYWRvbmx5IHJvbGU/OiBpYW0uSVJvbGU7XG5cbiAgLyoqXG4gICAqIFVzZXItZGVmaW5lZCBvYmplY3QgbWV0YWRhdGEgdG8gYmUgc2V0IG9uIGFsbCBvYmplY3RzIGluIHRoZSBkZXBsb3ltZW50XG4gICAqIEBkZWZhdWx0IC0gTm8gdXNlciBtZXRhZGF0YSBpcyBzZXRcbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQW1hem9uUzMvbGF0ZXN0L2Rldi9Vc2luZ01ldGFkYXRhLmh0bWwjVXNlck1ldGFkYXRhXG4gICAqL1xuICByZWFkb25seSBtZXRhZGF0YT86IFVzZXJEZWZpbmVkT2JqZWN0TWV0YWRhdGE7XG5cbiAgLyoqXG4gICAqIFN5c3RlbS1kZWZpbmVkIGNhY2hlLWNvbnRyb2wgbWV0YWRhdGEgdG8gYmUgc2V0IG9uIGFsbCBvYmplY3RzIGluIHRoZSBkZXBsb3ltZW50LlxuICAgKiBAZGVmYXVsdCAtIE5vdCBzZXQuXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FtYXpvblMzL2xhdGVzdC9kZXYvVXNpbmdNZXRhZGF0YS5odG1sI1N5c01ldGFkYXRhXG4gICAqL1xuICByZWFkb25seSBjYWNoZUNvbnRyb2w/OiBDYWNoZUNvbnRyb2xbXTtcbiAgLyoqXG4gICAqIFN5c3RlbS1kZWZpbmVkIGNhY2hlLWRpc3Bvc2l0aW9uIG1ldGFkYXRhIHRvIGJlIHNldCBvbiBhbGwgb2JqZWN0cyBpbiB0aGUgZGVwbG95bWVudC5cbiAgICogQGRlZmF1bHQgLSBOb3Qgc2V0LlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BbWF6b25TMy9sYXRlc3QvZGV2L1VzaW5nTWV0YWRhdGEuaHRtbCNTeXNNZXRhZGF0YVxuICAgKi9cbiAgcmVhZG9ubHkgY29udGVudERpc3Bvc2l0aW9uPzogc3RyaW5nO1xuICAvKipcbiAgICogU3lzdGVtLWRlZmluZWQgY29udGVudC1lbmNvZGluZyBtZXRhZGF0YSB0byBiZSBzZXQgb24gYWxsIG9iamVjdHMgaW4gdGhlIGRlcGxveW1lbnQuXG4gICAqIEBkZWZhdWx0IC0gTm90IHNldC5cbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQW1hem9uUzMvbGF0ZXN0L2Rldi9Vc2luZ01ldGFkYXRhLmh0bWwjU3lzTWV0YWRhdGFcbiAgICovXG4gIHJlYWRvbmx5IGNvbnRlbnRFbmNvZGluZz86IHN0cmluZztcbiAgLyoqXG4gICAqIFN5c3RlbS1kZWZpbmVkIGNvbnRlbnQtbGFuZ3VhZ2UgbWV0YWRhdGEgdG8gYmUgc2V0IG9uIGFsbCBvYmplY3RzIGluIHRoZSBkZXBsb3ltZW50LlxuICAgKiBAZGVmYXVsdCAtIE5vdCBzZXQuXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FtYXpvblMzL2xhdGVzdC9kZXYvVXNpbmdNZXRhZGF0YS5odG1sI1N5c01ldGFkYXRhXG4gICAqL1xuICByZWFkb25seSBjb250ZW50TGFuZ3VhZ2U/OiBzdHJpbmc7XG4gIC8qKlxuICAgKiBTeXN0ZW0tZGVmaW5lZCBjb250ZW50LXR5cGUgbWV0YWRhdGEgdG8gYmUgc2V0IG9uIGFsbCBvYmplY3RzIGluIHRoZSBkZXBsb3ltZW50LlxuICAgKiBAZGVmYXVsdCAtIE5vdCBzZXQuXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FtYXpvblMzL2xhdGVzdC9kZXYvVXNpbmdNZXRhZGF0YS5odG1sI1N5c01ldGFkYXRhXG4gICAqL1xuICByZWFkb25seSBjb250ZW50VHlwZT86IHN0cmluZztcbiAgLyoqXG4gICAqIFN5c3RlbS1kZWZpbmVkIGV4cGlyZXMgbWV0YWRhdGEgdG8gYmUgc2V0IG9uIGFsbCBvYmplY3RzIGluIHRoZSBkZXBsb3ltZW50LlxuICAgKiBAZGVmYXVsdCAtIFRoZSBvYmplY3RzIGluIHRoZSBkaXN0cmlidXRpb24gd2lsbCBub3QgZXhwaXJlLlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BbWF6b25TMy9sYXRlc3QvZGV2L1VzaW5nTWV0YWRhdGEuaHRtbCNTeXNNZXRhZGF0YVxuICAgKi9cbiAgcmVhZG9ubHkgZXhwaXJlcz86IGNkay5FeHBpcmF0aW9uO1xuICAvKipcbiAgICogU3lzdGVtLWRlZmluZWQgeC1hbXotc2VydmVyLXNpZGUtZW5jcnlwdGlvbiBtZXRhZGF0YSB0byBiZSBzZXQgb24gYWxsIG9iamVjdHMgaW4gdGhlIGRlcGxveW1lbnQuXG4gICAqIEBkZWZhdWx0IC0gU2VydmVyIHNpZGUgZW5jcnlwdGlvbiBpcyBub3QgdXNlZC5cbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQW1hem9uUzMvbGF0ZXN0L2Rldi9Vc2luZ01ldGFkYXRhLmh0bWwjU3lzTWV0YWRhdGFcbiAgICovXG4gIHJlYWRvbmx5IHNlcnZlclNpZGVFbmNyeXB0aW9uPzogU2VydmVyU2lkZUVuY3J5cHRpb247XG4gIC8qKlxuICAgKiBTeXN0ZW0tZGVmaW5lZCB4LWFtei1zdG9yYWdlLWNsYXNzIG1ldGFkYXRhIHRvIGJlIHNldCBvbiBhbGwgb2JqZWN0cyBpbiB0aGUgZGVwbG95bWVudC5cbiAgICogQGRlZmF1bHQgLSBEZWZhdWx0IHN0b3JhZ2UtY2xhc3MgZm9yIHRoZSBidWNrZXQgaXMgdXNlZC5cbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQW1hem9uUzMvbGF0ZXN0L2Rldi9Vc2luZ01ldGFkYXRhLmh0bWwjU3lzTWV0YWRhdGFcbiAgICovXG4gIHJlYWRvbmx5IHN0b3JhZ2VDbGFzcz86IFN0b3JhZ2VDbGFzcztcbiAgLyoqXG4gICAqIFN5c3RlbS1kZWZpbmVkIHgtYW16LXdlYnNpdGUtcmVkaXJlY3QtbG9jYXRpb24gbWV0YWRhdGEgdG8gYmUgc2V0IG9uIGFsbCBvYmplY3RzIGluIHRoZSBkZXBsb3ltZW50LlxuICAgKiBAZGVmYXVsdCAtIE5vIHdlYnNpdGUgcmVkaXJlY3Rpb24uXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FtYXpvblMzL2xhdGVzdC9kZXYvVXNpbmdNZXRhZGF0YS5odG1sI1N5c01ldGFkYXRhXG4gICAqL1xuICByZWFkb25seSB3ZWJzaXRlUmVkaXJlY3RMb2NhdGlvbj86IHN0cmluZztcbiAgLyoqXG4gICAqIFN5c3RlbS1kZWZpbmVkIHgtYW16LXNlcnZlci1zaWRlLWVuY3J5cHRpb24tYXdzLWttcy1rZXktaWQgbWV0YWRhdGEgdG8gYmUgc2V0IG9uIGFsbCBvYmplY3RzIGluIHRoZSBkZXBsb3ltZW50LlxuICAgKiBAZGVmYXVsdCAtIE5vdCBzZXQuXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FtYXpvblMzL2xhdGVzdC9kZXYvVXNpbmdNZXRhZGF0YS5odG1sI1N5c01ldGFkYXRhXG4gICAqL1xuICByZWFkb25seSBzZXJ2ZXJTaWRlRW5jcnlwdGlvbkF3c0ttc0tleUlkPzogc3RyaW5nO1xuICAvKipcbiAgICogU3lzdGVtLWRlZmluZWQgeC1hbXotc2VydmVyLXNpZGUtZW5jcnlwdGlvbi1jdXN0b21lci1hbGdvcml0aG0gbWV0YWRhdGEgdG8gYmUgc2V0IG9uIGFsbCBvYmplY3RzIGluIHRoZSBkZXBsb3ltZW50LlxuICAgKiBXYXJuaW5nOiBUaGlzIGlzIG5vdCBhIHVzZWZ1bCBwYXJhbWV0ZXIgdW50aWwgdGhpcyBidWcgaXMgZml4ZWQ6IGh0dHBzOi8vZ2l0aHViLmNvbS9hd3MvYXdzLWNkay9pc3N1ZXMvNjA4MFxuICAgKiBAZGVmYXVsdCAtIE5vdCBzZXQuXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FtYXpvblMzL2xhdGVzdC9kZXYvU2VydmVyU2lkZUVuY3J5cHRpb25DdXN0b21lcktleXMuaHRtbCNzc2UtYy1ob3ctdG8tcHJvZ3JhbW1hdGljYWxseS1pbnRyb1xuICAgKi9cbiAgcmVhZG9ubHkgc2VydmVyU2lkZUVuY3J5cHRpb25DdXN0b21lckFsZ29yaXRobT86IHN0cmluZztcbiAgLyoqXG4gICAqIFN5c3RlbS1kZWZpbmVkIHgtYW16LWFjbCBtZXRhZGF0YSB0byBiZSBzZXQgb24gYWxsIG9iamVjdHMgaW4gdGhlIGRlcGxveW1lbnQuXG4gICAqIEBkZWZhdWx0IC0gTm90IHNldC5cbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQW1hem9uUzMvbGF0ZXN0L3VzZXJndWlkZS9hY2wtb3ZlcnZpZXcuaHRtbCNjYW5uZWQtYWNsXG4gICAqL1xuICByZWFkb25seSBhY2Nlc3NDb250cm9sPzogczMuQnVja2V0QWNjZXNzQ29udHJvbDtcblxuICAvKipcbiAgICogVGhlIFZQQyBuZXR3b3JrIHRvIHBsYWNlIHRoZSBkZXBsb3ltZW50IGxhbWJkYSBoYW5kbGVyIGluLlxuICAgKiBUaGlzIGlzIHJlcXVpcmVkIGlmIGB1c2VFZnNgIGlzIHNldC5cbiAgICpcbiAgICogQGRlZmF1bHQgTm9uZVxuICAgKi9cbiAgcmVhZG9ubHkgdnBjPzogZWMyLklWcGM7XG5cbiAgLyoqXG4gICAqIFdoZXJlIGluIHRoZSBWUEMgdG8gcGxhY2UgdGhlIGRlcGxveW1lbnQgbGFtYmRhIGhhbmRsZXIuXG4gICAqIE9ubHkgdXNlZCBpZiAndnBjJyBpcyBzdXBwbGllZC5cbiAgICpcbiAgICogQGRlZmF1bHQgLSB0aGUgVnBjIGRlZmF1bHQgc3RyYXRlZ3kgaWYgbm90IHNwZWNpZmllZFxuICAgKi9cbiAgcmVhZG9ubHkgdnBjU3VibmV0cz86IGVjMi5TdWJuZXRTZWxlY3Rpb247XG59XG5cbi8qKlxuICogYEJ1Y2tldERlcGxveW1lbnRgIHBvcHVsYXRlcyBhbiBTMyBidWNrZXQgd2l0aCB0aGUgY29udGVudHMgb2YgLnppcCBmaWxlcyBmcm9tXG4gKiBvdGhlciBTMyBidWNrZXRzIG9yIGZyb20gbG9jYWwgZGlza1xuICovXG5leHBvcnQgY2xhc3MgQnVja2V0RGVwbG95bWVudCBleHRlbmRzIENvbnN0cnVjdCB7XG4gIHByaXZhdGUgcmVhZG9ubHkgY3I6IGNkay5DdXN0b21SZXNvdXJjZTtcbiAgcHJpdmF0ZSBfZGVwbG95ZWRCdWNrZXQ/OiBzMy5JQnVja2V0O1xuICBwcml2YXRlIHJlcXVlc3REZXN0aW5hdGlvbkFybjogYm9vbGVhbiA9IGZhbHNlO1xuICBwcml2YXRlIHJlYWRvbmx5IGRlc3RpbmF0aW9uQnVja2V0OiBzMy5JQnVja2V0O1xuICBwcml2YXRlIHJlYWRvbmx5IHNvdXJjZXM6IFNvdXJjZUNvbmZpZ1tdO1xuICBwcml2YXRlIHJlYWRvbmx5IGhhbmRsZXJSb2xlOiBpYW0uSVJvbGU7XG5cbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IEJ1Y2tldERlcGxveW1lbnRQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG5cbiAgICBpZiAocHJvcHMuZGlzdHJpYnV0aW9uUGF0aHMpIHtcbiAgICAgIGlmICghcHJvcHMuZGlzdHJpYnV0aW9uKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignRGlzdHJpYnV0aW9uIG11c3QgYmUgc3BlY2lmaWVkIGlmIGRpc3RyaWJ1dGlvbiBwYXRocyBhcmUgc3BlY2lmaWVkJyk7XG4gICAgICB9XG4gICAgICBpZiAoIWNkay5Ub2tlbi5pc1VucmVzb2x2ZWQocHJvcHMuZGlzdHJpYnV0aW9uUGF0aHMpKSB7XG4gICAgICAgIGlmICghcHJvcHMuZGlzdHJpYnV0aW9uUGF0aHMuZXZlcnkoZGlzdHJpYnV0aW9uUGF0aCA9PiBjZGsuVG9rZW4uaXNVbnJlc29sdmVkKGRpc3RyaWJ1dGlvblBhdGgpIHx8IGRpc3RyaWJ1dGlvblBhdGguc3RhcnRzV2l0aCgnLycpKSkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignRGlzdHJpYnV0aW9uIHBhdGhzIG11c3Qgc3RhcnQgd2l0aCBcIi9cIicpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHByb3BzLnVzZUVmcyAmJiAhcHJvcHMudnBjKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1ZwYyBtdXN0IGJlIHNwZWNpZmllZCBpZiB1c2VFZnMgaXMgc2V0Jyk7XG4gICAgfVxuXG4gICAgdGhpcy5kZXN0aW5hdGlvbkJ1Y2tldCA9IHByb3BzLmRlc3RpbmF0aW9uQnVja2V0O1xuXG4gICAgY29uc3QgYWNjZXNzUG9pbnRQYXRoID0gJy9sYW1iZGEnO1xuICAgIGxldCBhY2Nlc3NQb2ludDtcbiAgICBpZiAocHJvcHMudXNlRWZzICYmIHByb3BzLnZwYykge1xuICAgICAgY29uc3QgYWNjZXNzTW9kZSA9ICcwNzc3JztcbiAgICAgIGNvbnN0IGZpbGVTeXN0ZW0gPSB0aGlzLmdldE9yQ3JlYXRlRWZzRmlsZVN5c3RlbShzY29wZSwge1xuICAgICAgICB2cGM6IHByb3BzLnZwYyxcbiAgICAgICAgcmVtb3ZhbFBvbGljeTogY2RrLlJlbW92YWxQb2xpY3kuREVTVFJPWSxcbiAgICAgIH0pO1xuICAgICAgYWNjZXNzUG9pbnQgPSBmaWxlU3lzdGVtLmFkZEFjY2Vzc1BvaW50KCdBY2Nlc3NQb2ludCcsIHtcbiAgICAgICAgcGF0aDogYWNjZXNzUG9pbnRQYXRoLFxuICAgICAgICBjcmVhdGVBY2w6IHtcbiAgICAgICAgICBvd25lclVpZDogJzEwMDEnLFxuICAgICAgICAgIG93bmVyR2lkOiAnMTAwMScsXG4gICAgICAgICAgcGVybWlzc2lvbnM6IGFjY2Vzc01vZGUsXG4gICAgICAgIH0sXG4gICAgICAgIHBvc2l4VXNlcjoge1xuICAgICAgICAgIHVpZDogJzEwMDEnLFxuICAgICAgICAgIGdpZDogJzEwMDEnLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgICBhY2Nlc3NQb2ludC5ub2RlLmFkZERlcGVuZGVuY3koZmlsZVN5c3RlbS5tb3VudFRhcmdldHNBdmFpbGFibGUpO1xuICAgIH1cblxuICAgIC8vIE1ha2luZyBWUEMgZGVwZW5kZW50IG9uIEJ1Y2tldERlcGxveW1lbnQgc28gdGhhdCBDRk4gc3RhY2sgZGVsZXRpb24gaXMgc21vb3RoLlxuICAgIC8vIFJlZmVyIGNvbW1lbnRzIG9uIGh0dHBzOi8vZ2l0aHViLmNvbS9hd3MvYXdzLWNkay9wdWxsLzE1MjIwIGZvciBtb3JlIGRldGFpbHMuXG4gICAgaWYgKHByb3BzLnZwYykge1xuICAgICAgdGhpcy5ub2RlLmFkZERlcGVuZGVuY3kocHJvcHMudnBjKTtcbiAgICB9XG5cbiAgICBjb25zdCBtb3VudFBhdGggPSBgL21udCR7YWNjZXNzUG9pbnRQYXRofWA7XG4gICAgY29uc3QgaGFuZGxlciA9IG5ldyBsYW1iZGEuU2luZ2xldG9uRnVuY3Rpb24odGhpcywgJ0N1c3RvbVJlc291cmNlSGFuZGxlcicsIHtcbiAgICAgIHV1aWQ6IHRoaXMucmVuZGVyU2luZ2xldG9uVXVpZChwcm9wcy5tZW1vcnlMaW1pdCwgcHJvcHMuZXBoZW1lcmFsU3RvcmFnZVNpemUsIHByb3BzLnZwYyksXG4gICAgICBjb2RlOiBsYW1iZGEuQ29kZS5mcm9tQXNzZXQocGF0aC5qb2luKF9fZGlybmFtZSwgJ2xhbWJkYScpKSxcbiAgICAgIGxheWVyczogW25ldyBBd3NDbGlMYXllcih0aGlzLCAnQXdzQ2xpTGF5ZXInKV0sXG4gICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5QWVRIT05fM185LFxuICAgICAgZW52aXJvbm1lbnQ6IHByb3BzLnVzZUVmcyA/IHtcbiAgICAgICAgTU9VTlRfUEFUSDogbW91bnRQYXRoLFxuICAgICAgfSA6IHVuZGVmaW5lZCxcbiAgICAgIGhhbmRsZXI6ICdpbmRleC5oYW5kbGVyJyxcbiAgICAgIGxhbWJkYVB1cnBvc2U6ICdDdXN0b206OkNES0J1Y2tldERlcGxveW1lbnQnLFxuICAgICAgdGltZW91dDogY2RrLkR1cmF0aW9uLm1pbnV0ZXMoMTUpLFxuICAgICAgcm9sZTogcHJvcHMucm9sZSxcbiAgICAgIG1lbW9yeVNpemU6IHByb3BzLm1lbW9yeUxpbWl0LFxuICAgICAgZXBoZW1lcmFsU3RvcmFnZVNpemU6IHByb3BzLmVwaGVtZXJhbFN0b3JhZ2VTaXplLFxuICAgICAgdnBjOiBwcm9wcy52cGMsXG4gICAgICB2cGNTdWJuZXRzOiBwcm9wcy52cGNTdWJuZXRzLFxuICAgICAgZmlsZXN5c3RlbTogYWNjZXNzUG9pbnQgPyBsYW1iZGEuRmlsZVN5c3RlbS5mcm9tRWZzQWNjZXNzUG9pbnQoXG4gICAgICAgIGFjY2Vzc1BvaW50LFxuICAgICAgICBtb3VudFBhdGgsXG4gICAgICApIDogdW5kZWZpbmVkLFxuICAgICAgbG9nUmV0ZW50aW9uOiBwcm9wcy5sb2dSZXRlbnRpb24sXG4gICAgfSk7XG5cbiAgICBjb25zdCBoYW5kbGVyUm9sZSA9IGhhbmRsZXIucm9sZTtcbiAgICBpZiAoIWhhbmRsZXJSb2xlKSB7IHRocm93IG5ldyBFcnJvcignbGFtYmRhLlNpbmdsZXRvbkZ1bmN0aW9uIHNob3VsZCBoYXZlIGNyZWF0ZWQgYSBSb2xlJyk7IH1cbiAgICB0aGlzLmhhbmRsZXJSb2xlID0gaGFuZGxlclJvbGU7XG5cbiAgICB0aGlzLnNvdXJjZXMgPSBwcm9wcy5zb3VyY2VzLm1hcCgoc291cmNlOiBJU291cmNlKSA9PiBzb3VyY2UuYmluZCh0aGlzLCB7IGhhbmRsZXJSb2xlOiB0aGlzLmhhbmRsZXJSb2xlIH0pKTtcblxuICAgIHRoaXMuZGVzdGluYXRpb25CdWNrZXQuZ3JhbnRSZWFkV3JpdGUoaGFuZGxlcik7XG4gICAgaWYgKHByb3BzLmFjY2Vzc0NvbnRyb2wpIHtcbiAgICAgIHRoaXMuZGVzdGluYXRpb25CdWNrZXQuZ3JhbnRQdXRBY2woaGFuZGxlcik7XG4gICAgfVxuICAgIGlmIChwcm9wcy5kaXN0cmlidXRpb24pIHtcbiAgICAgIGhhbmRsZXIuYWRkVG9Sb2xlUG9saWN5KG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcbiAgICAgICAgZWZmZWN0OiBpYW0uRWZmZWN0LkFMTE9XLFxuICAgICAgICBhY3Rpb25zOiBbJ2Nsb3VkZnJvbnQ6R2V0SW52YWxpZGF0aW9uJywgJ2Nsb3VkZnJvbnQ6Q3JlYXRlSW52YWxpZGF0aW9uJ10sXG4gICAgICAgIHJlc291cmNlczogWycqJ10sXG4gICAgICB9KSk7XG4gICAgfVxuXG4gICAgLy8gTWFya2VycyBhcmUgbm90IHJlcGxhY2VkIGlmIHppcCBzb3VyY2VzIGFyZSBub3QgZXh0cmFjdGVkLCBzbyB0aHJvdyBhbiBlcnJvclxuICAgIC8vIGlmIGV4dHJhY3Rpb24gaXMgbm90IHdhbnRlZCBhbmQgc291cmNlcyBoYXZlIG1hcmtlcnMuXG4gICAgY29uc3QgX3RoaXMgPSB0aGlzO1xuICAgIHRoaXMubm9kZS5hZGRWYWxpZGF0aW9uKHtcbiAgICAgIHZhbGlkYXRlKCk6IHN0cmluZ1tdIHtcbiAgICAgICAgaWYgKF90aGlzLnNvdXJjZXMuc29tZShzb3VyY2UgPT4gc291cmNlLm1hcmtlcnMpICYmIHByb3BzLmV4dHJhY3QgPT0gZmFsc2UpIHtcbiAgICAgICAgICByZXR1cm4gWydTb21lIHNvdXJjZXMgYXJlIGluY29tcGF0aWJsZSB3aXRoIGV4dHJhY3Q9ZmFsc2U7IHNvdXJjZXMgd2l0aCBkZXBsb3ktdGltZSB2YWx1ZXMgKHN1Y2ggYXMgXFwnc25zVG9waWMudG9waWNBcm5cXCcpIG11c3QgYmUgZXh0cmFjdGVkLiddO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBbXTtcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBjb25zdCBjclVuaXF1ZUlkID0gYEN1c3RvbVJlc291cmNlJHt0aGlzLnJlbmRlclVuaXF1ZUlkKHByb3BzLm1lbW9yeUxpbWl0LCBwcm9wcy5lcGhlbWVyYWxTdG9yYWdlU2l6ZSwgcHJvcHMudnBjKX1gO1xuICAgIHRoaXMuY3IgPSBuZXcgY2RrLkN1c3RvbVJlc291cmNlKHRoaXMsIGNyVW5pcXVlSWQsIHtcbiAgICAgIHNlcnZpY2VUb2tlbjogaGFuZGxlci5mdW5jdGlvbkFybixcbiAgICAgIHJlc291cmNlVHlwZTogJ0N1c3RvbTo6Q0RLQnVja2V0RGVwbG95bWVudCcsXG4gICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIFNvdXJjZUJ1Y2tldE5hbWVzOiBjZGsuTGF6eS5saXN0KHsgcHJvZHVjZTogKCkgPT4gdGhpcy5zb3VyY2VzLm1hcChzb3VyY2UgPT4gc291cmNlLmJ1Y2tldC5idWNrZXROYW1lKSB9KSxcbiAgICAgICAgU291cmNlT2JqZWN0S2V5czogY2RrLkxhenkubGlzdCh7IHByb2R1Y2U6ICgpID0+IHRoaXMuc291cmNlcy5tYXAoc291cmNlID0+IHNvdXJjZS56aXBPYmplY3RLZXkpIH0pLFxuICAgICAgICBTb3VyY2VNYXJrZXJzOiBjZGsuTGF6eS5hbnkoe1xuICAgICAgICAgIHByb2R1Y2U6ICgpID0+IHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNvdXJjZXMucmVkdWNlKChhY2MsIHNvdXJjZSkgPT4ge1xuICAgICAgICAgICAgICBpZiAoc291cmNlLm1hcmtlcnMpIHtcbiAgICAgICAgICAgICAgICBhY2MucHVzaChzb3VyY2UubWFya2Vycyk7XG4gICAgICAgICAgICAgICAgLy8gaWYgdGhlcmUgYXJlIG1vcmUgdGhhbiAxIHNvdXJjZSwgdGhlbiBhbGwgc291cmNlc1xuICAgICAgICAgICAgICAgIC8vIHJlcXVpcmUgbWFya2VycyAoY3VzdG9tIHJlc291cmNlIHdpbGwgdGhyb3cgYW4gZXJyb3Igb3RoZXJ3aXNlKVxuICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuc291cmNlcy5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICAgICAgYWNjLnB1c2goe30pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHJldHVybiBhY2M7XG4gICAgICAgICAgICB9LCBbXSBhcyBBcnJheTxSZWNvcmQ8c3RyaW5nLCBhbnk+Pik7XG4gICAgICAgICAgfSxcbiAgICAgICAgfSwgeyBvbWl0RW1wdHlBcnJheTogdHJ1ZSB9KSxcbiAgICAgICAgRGVzdGluYXRpb25CdWNrZXROYW1lOiB0aGlzLmRlc3RpbmF0aW9uQnVja2V0LmJ1Y2tldE5hbWUsXG4gICAgICAgIERlc3RpbmF0aW9uQnVja2V0S2V5UHJlZml4OiBwcm9wcy5kZXN0aW5hdGlvbktleVByZWZpeCxcbiAgICAgICAgUmV0YWluT25EZWxldGU6IHByb3BzLnJldGFpbk9uRGVsZXRlLFxuICAgICAgICBFeHRyYWN0OiBwcm9wcy5leHRyYWN0LFxuICAgICAgICBQcnVuZTogcHJvcHMucHJ1bmUgPz8gdHJ1ZSxcbiAgICAgICAgRXhjbHVkZTogcHJvcHMuZXhjbHVkZSxcbiAgICAgICAgSW5jbHVkZTogcHJvcHMuaW5jbHVkZSxcbiAgICAgICAgVXNlck1ldGFkYXRhOiBwcm9wcy5tZXRhZGF0YSA/IG1hcFVzZXJNZXRhZGF0YShwcm9wcy5tZXRhZGF0YSkgOiB1bmRlZmluZWQsXG4gICAgICAgIFN5c3RlbU1ldGFkYXRhOiBtYXBTeXN0ZW1NZXRhZGF0YShwcm9wcyksXG4gICAgICAgIERpc3RyaWJ1dGlvbklkOiBwcm9wcy5kaXN0cmlidXRpb24/LmRpc3RyaWJ1dGlvbklkLFxuICAgICAgICBEaXN0cmlidXRpb25QYXRoczogcHJvcHMuZGlzdHJpYnV0aW9uUGF0aHMsXG4gICAgICAgIC8vIFBhc3NpbmcgdGhyb3VnaCB0aGUgQVJOIHNlcXVlbmNlcyBkZXBlbmRlbmN5IG9uIHRoZSBkZXBsb3ltZW50XG4gICAgICAgIERlc3RpbmF0aW9uQnVja2V0QXJuOiBjZGsuTGF6eS5zdHJpbmcoeyBwcm9kdWNlOiAoKSA9PiB0aGlzLnJlcXVlc3REZXN0aW5hdGlvbkFybiA/IHRoaXMuZGVzdGluYXRpb25CdWNrZXQuYnVja2V0QXJuIDogdW5kZWZpbmVkIH0pLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIGxldCBwcmVmaXg6IHN0cmluZyA9IHByb3BzLmRlc3RpbmF0aW9uS2V5UHJlZml4ID9cbiAgICAgIGA6JHtwcm9wcy5kZXN0aW5hdGlvbktleVByZWZpeH1gIDpcbiAgICAgICcnO1xuICAgIHByZWZpeCArPSBgOiR7dGhpcy5jci5ub2RlLmFkZHIuc2xpY2UoLTgpfWA7XG4gICAgY29uc3QgdGFnS2V5ID0gQ1VTVE9NX1JFU09VUkNFX09XTkVSX1RBRyArIHByZWZpeDtcblxuICAgIC8vIGRlc3RpbmF0aW9uS2V5UHJlZml4IGNhbiBiZSAxMDQgY2hhcmFjdGVycyBiZWZvcmUgd2UgaGl0XG4gICAgLy8gdGhlIHRhZyBrZXkgbGltaXQgb2YgMTI4XG4gICAgLy8gJy90aGlzL2lzL2EvcmFuZG9tL2tleS9wcmVmaXgvdGhhdC9pcy9hL2xvdC9vZi9jaGFyYWN0ZXJzL2RvL3dlL3RoaW5rL3RoYXQvaXQvd2lsbC9ldmVyL2JlL3RoaXMvbG9uZz8/Pz8/J1xuICAgIC8vIGJldHRlciB0byB0aHJvdyBhbiBlcnJvciBoZXJlIHRoYW4gd2FpdCBmb3IgQ2xvdWRGb3JtYXRpb24gdG8gZmFpbFxuICAgIGlmICghY2RrLlRva2VuLmlzVW5yZXNvbHZlZCh0YWdLZXkpICYmIHRhZ0tleS5sZW5ndGggPiAxMjgpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignVGhlIEJ1Y2tldERlcGxveW1lbnQgY29uc3RydWN0IHJlcXVpcmVzIHRoYXQgdGhlIFwiZGVzdGluYXRpb25LZXlQcmVmaXhcIiBiZSA8PTEwNCBjaGFyYWN0ZXJzLicpO1xuICAgIH1cblxuICAgIC8qXG4gICAgICogVGhpcyB3aWxsIGFkZCBhIHRhZyB0byB0aGUgZGVwbG95bWVudCBidWNrZXQgaW4gdGhlIGZvcm1hdCBvZlxuICAgICAqIGBhd3MtY2RrOmNyLW93bmVkOntrZXlQcmVmaXh9Ont1bmlxdWVIYXNofWBcbiAgICAgKlxuICAgICAqIEZvciBleGFtcGxlOlxuICAgICAqIHtcbiAgICAgKiAgIEtleTogJ2F3cy1jZGs6Y3Itb3duZWQ6ZGVwbG95L2hlcmUvOjI0MEQxN0IzJyxcbiAgICAgKiAgIFZhbHVlOiAndHJ1ZScsXG4gICAgICogfVxuICAgICAqXG4gICAgICogVGhpcyB3aWxsIGFsbG93IGZvciBzY2VuYXJpb3Mgd2hlcmUgdGhlcmUgaXMgYSBzaW5nbGUgUzMgQnVja2V0IHRoYXQgaGFzIG11bHRpcGxlXG4gICAgICogQnVja2V0RGVwbG95bWVudCByZXNvdXJjZXMgZGVwbG95aW5nIHRvIGl0LiBFYWNoIGJ1Y2tldCArIGtleVByZWZpeCBjYW4gYmUgXCJvd25lZFwiIGJ5XG4gICAgICogMSBvciBtb3JlIEJ1Y2tldERlcGxveW1lbnQgcmVzb3VyY2VzLiBTaW5jZSB0aGVyZSBhcmUgc29tZSBzY2VuYXJpb3Mgd2hlcmUgbXVsdGlwbGUgQnVja2V0RGVwbG95bWVudFxuICAgICAqIHJlc291cmNlcyBjYW4gZGVwbG95IHRvIHRoZSBzYW1lIGJ1Y2tldCBhbmQga2V5IHByZWZpeCAoZS5nLiB1c2luZyBpbmNsdWRlL2V4Y2x1ZGUpIHdlXG4gICAgICogYWxzbyBhcHBlbmQgcGFydCBvZiB0aGUgaWQgdG8gbWFrZSB0aGUga2V5IHVuaXF1ZS5cbiAgICAgKlxuICAgICAqIEFzIGxvbmcgYXMgYSBidWNrZXQgKyBrZXlQcmVmaXggaXMgXCJvd25lZFwiIGJ5IGEgQnVja2V0RGVwbG95bWVudCByZXNvdXJjZSwgYW5vdGhlciBDUlxuICAgICAqIGNhbm5vdCBkZWxldGUgZGF0YS4gVGhlcmUgYXJlIGEgY291cGxlIG9mIHNjZW5hcmlvcyB3aGVyZSB0aGlzIGNvbWVzIGludG8gcGxheS5cbiAgICAgKlxuICAgICAqIDEuIElmIHRoZSBMb2dpY2FsUmVzb3VyY2VJZCBvZiB0aGUgQ3VzdG9tUmVzb3VyY2UgY2hhbmdlcyAoZS5nLiB0aGUgY3JVbmlxdWVJZCBjaGFuZ2VzKVxuICAgICAqIENsb3VkRm9ybWF0aW9uIHdpbGwgZmlyc3QgaXNzdWUgYSAnQ3JlYXRlJyB0byBjcmVhdGUgdGhlIG5ldyBDdXN0b21SZXNvdXJjZSBhbmQgd2lsbFxuICAgICAqIHVwZGF0ZSB0aGUgVGFnIG9uIHRoZSBidWNrZXQuIENsb3VkRm9ybWF0aW9uIHdpbGwgdGhlbiBpc3N1ZSBhICdEZWxldGUnIG9uIHRoZSBvbGQgQ3VzdG9tUmVzb3VyY2VcbiAgICAgKiBhbmQgc2luY2UgdGhlIG5ldyBDUiBcIm93bnNcIiB0aGUgQnVja2V0K2tleVByZWZpeCBpdCB3aWxsIG5vdCBkZWxldGUgdGhlIGNvbnRlbnRzIG9mIHRoZSBidWNrZXRcbiAgICAgKlxuICAgICAqIDIuIElmIHRoZSBCdWNrZXREZXBsb3ltZW50IHJlc291cmNlIGlzIGRlbGV0ZWQgX2FuZF8gaXQgaXMgdGhlIG9ubHkgQ1IgZm9yIHRoYXQgYnVja2V0K2tleVByZWZpeFxuICAgICAqIHRoZW4gQ2xvdWRGb3JtYXRpb24gd2lsbCBmaXJzdCByZW1vdmUgdGhlIHRhZyBmcm9tIHRoZSBidWNrZXQgYW5kIHRoZW4gaXNzdWUgYSBcIkRlbGV0ZVwiIHRvIHRoZVxuICAgICAqIENSLiBTaW5jZSB0aGVyZSBhcmUgbm8gdGFncyBpbmRpY2F0aW5nIHRoYXQgdGhpcyBidWNrZXQra2V5UHJlZml4IGlzIFwib3duZWRcIiB0aGVuIGl0IHdpbGwgZGVsZXRlXG4gICAgICogdGhlIGNvbnRlbnRzLlxuICAgICAqXG4gICAgICogMy4gSWYgdGhlIEJ1Y2tldERlcGxveW1lbnQgcmVzb3VyY2UgaXMgZGVsZXRlZCBfYW5kXyBpdCBpcyAqbm90KiB0aGUgb25seSBDUiBmb3IgdGhhdCBidWNrZXQ6a2V5UHJlZml4XG4gICAgICogdGhlbiBDbG91ZEZvcm1hdGlvbiB3aWxsIGZpcnN0IHJlbW92ZSB0aGUgdGFnIGZyb20gdGhlIGJ1Y2tldCBhbmQgdGhlbiBpc3N1ZSBhIFwiRGVsZXRlXCIgdG8gdGhlIENSLlxuICAgICAqIFNpbmNlIHRoZXJlIGFyZSBvdGhlciBDUnMgdGhhdCBhbHNvIFwib3duXCIgdGhhdCBidWNrZXQra2V5UHJlZml4IHRoZXJlIHdpbGwgc3RpbGwgYmUgYSB0YWcgb24gdGhlIGJ1Y2tldFxuICAgICAqIGFuZCB0aGUgY29udGVudHMgd2lsbCBub3QgYmUgcmVtb3ZlZC5cbiAgICAgKlxuICAgICAqIDQuIElmIHRoZSBCdWNrZXREZXBsb3ltZW50IHJlc291cmNlIF9hbmRfIHRoZSBTMyBCdWNrZXQgYXJlIGJvdGggcmVtb3ZlZCwgdGhlbiBDbG91ZEZvcm1hdGlvbiB3aWxsIGZpcnN0XG4gICAgICogaXNzdWUgYSBcIkRlbGV0ZVwiIHRvIHRoZSBDUiBhbmQgc2luY2UgdGhlcmUgaXMgYSB0YWcgb24gdGhlIGJ1Y2tldCB0aGUgY29udGVudHMgd2lsbCBub3QgYmUgcmVtb3ZlZC4gSWYgeW91XG4gICAgICogd2FudCB0aGUgY29udGVudHMgb2YgdGhlIGJ1Y2tldCB0byBiZSByZW1vdmVkIG9uIGJ1Y2tldCBkZWxldGlvbiwgdGhlbiBgYXV0b0RlbGV0ZU9iamVjdHNgIHByb3BlcnR5IHNob3VsZFxuICAgICAqIGJlIHNldCB0byB0cnVlIG9uIHRoZSBCdWNrZXQuXG4gICAgICovXG4gICAgY2RrLlRhZ3Mub2YodGhpcy5kZXN0aW5hdGlvbkJ1Y2tldCkuYWRkKHRhZ0tleSwgJ3RydWUnKTtcblxuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBidWNrZXQgYWZ0ZXIgdGhlIGRlcGxveW1lbnRcbiAgICpcbiAgICogSWYgeW91IHdhbnQgdG8gcmVmZXJlbmNlIHRoZSBkZXN0aW5hdGlvbiBidWNrZXQgaW4gYW5vdGhlciBjb25zdHJ1Y3QgYW5kIG1ha2Ugc3VyZSB0aGVcbiAgICogYnVja2V0IGRlcGxveW1lbnQgaGFzIGhhcHBlbmVkIGJlZm9yZSB0aGUgbmV4dCBvcGVyYXRpb24gaXMgc3RhcnRlZCwgcGFzcyB0aGUgb3RoZXIgY29uc3RydWN0XG4gICAqIGEgcmVmZXJlbmNlIHRvIGBkZXBsb3ltZW50LmRlcGxveWVkQnVja2V0YC5cbiAgICpcbiAgICogTm90ZSB0aGF0IHRoaXMgb25seSByZXR1cm5zIGFuIGltbXV0YWJsZSByZWZlcmVuY2UgdG8gdGhlIGRlc3RpbmF0aW9uIGJ1Y2tldC5cbiAgICogSWYgc2VxdWVuY2VkIGFjY2VzcyB0byB0aGUgb3JpZ2luYWwgZGVzdGluYXRpb24gYnVja2V0IGlzIHJlcXVpcmVkLCB5b3UgbWF5IGFkZCBhIGRlcGVuZGVuY3lcbiAgICogb24gdGhlIGJ1Y2tldCBkZXBsb3ltZW50IGluc3RlYWQ6IGBvdGhlclJlc291cmNlLm5vZGUuYWRkRGVwZW5kZW5jeShkZXBsb3ltZW50KWBcbiAgICovXG4gIHB1YmxpYyBnZXQgZGVwbG95ZWRCdWNrZXQoKTogczMuSUJ1Y2tldCB7XG4gICAgdGhpcy5yZXF1ZXN0RGVzdGluYXRpb25Bcm4gPSB0cnVlO1xuICAgIHRoaXMuX2RlcGxveWVkQnVja2V0ID0gdGhpcy5fZGVwbG95ZWRCdWNrZXQgPz8gczMuQnVja2V0LmZyb21CdWNrZXRBdHRyaWJ1dGVzKHRoaXMsICdEZXN0aW5hdGlvbkJ1Y2tldCcsIHtcbiAgICAgIGJ1Y2tldEFybjogY2RrLlRva2VuLmFzU3RyaW5nKHRoaXMuY3IuZ2V0QXR0KCdEZXN0aW5hdGlvbkJ1Y2tldEFybicpKSxcbiAgICAgIHJlZ2lvbjogdGhpcy5kZXN0aW5hdGlvbkJ1Y2tldC5lbnYucmVnaW9uLFxuICAgICAgYWNjb3VudDogdGhpcy5kZXN0aW5hdGlvbkJ1Y2tldC5lbnYuYWNjb3VudCxcbiAgICAgIGlzV2Vic2l0ZTogdGhpcy5kZXN0aW5hdGlvbkJ1Y2tldC5pc1dlYnNpdGUsXG4gICAgfSk7XG4gICAgcmV0dXJuIHRoaXMuX2RlcGxveWVkQnVja2V0O1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBvYmplY3Qga2V5cyBmb3IgdGhlIHNvdXJjZXMgZGVwbG95ZWQgdG8gdGhlIFMzIGJ1Y2tldC5cbiAgICpcbiAgICogVGhpcyByZXR1cm5zIGEgbGlzdCBvZiB0b2tlbml6ZWQgb2JqZWN0IGtleXMgZm9yIHNvdXJjZSBmaWxlcyB0aGF0IGFyZSBkZXBsb3llZCB0byB0aGUgYnVja2V0LlxuICAgKlxuICAgKiBUaGlzIGNhbiBiZSB1c2VmdWwgd2hlbiB1c2luZyBgQnVja2V0RGVwbG95bWVudGAgd2l0aCBgZXh0cmFjdGAgc2V0IHRvIGBmYWxzZWAgYW5kIHlvdSBuZWVkIHRvIHJlZmVyZW5jZVxuICAgKiB0aGUgb2JqZWN0IGtleSB0aGF0IHJlc2lkZXMgaW4gdGhlIGJ1Y2tldCBmb3IgdGhhdCB6aXAgc291cmNlIGZpbGUgc29tZXdoZXJlIGVsc2UgaW4geW91ciBDREtcbiAgICogYXBwbGljYXRpb24sIHN1Y2ggYXMgaW4gYSBDRk4gb3V0cHV0LlxuICAgKlxuICAgKiBGb3IgZXhhbXBsZSwgdXNlIGBGbi5zZWxlY3QoMCwgbXlCdWNrZXREZXBsb3ltZW50Lm9iamVjdEtleXMpYCB0byByZWZlcmVuY2UgdGhlIG9iamVjdCBrZXkgb2YgdGhlXG4gICAqIGZpcnN0IHNvdXJjZSBmaWxlIGluIHlvdXIgYnVja2V0IGRlcGxveW1lbnQuXG4gICAqL1xuICBwdWJsaWMgZ2V0IG9iamVjdEtleXMoKTogc3RyaW5nW10ge1xuICAgIGNvbnN0IG9iamVjdEtleXMgPSBjZGsuVG9rZW4uYXNMaXN0KHRoaXMuY3IuZ2V0QXR0KCdTb3VyY2VPYmplY3RLZXlzJykpO1xuICAgIHJldHVybiBvYmplY3RLZXlzO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBhbiBhZGRpdGlvbmFsIHNvdXJjZSB0byB0aGUgYnVja2V0IGRlcGxveW1lbnRcbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICogZGVjbGFyZSBjb25zdCB3ZWJzaXRlQnVja2V0OiBzMy5JQnVja2V0O1xuICAgKiBjb25zdCBkZXBsb3ltZW50ID0gbmV3IHMzZGVwbG95LkJ1Y2tldERlcGxveW1lbnQodGhpcywgJ0RlcGxveW1lbnQnLCB7XG4gICAqICAgc291cmNlczogW3MzZGVwbG95LlNvdXJjZS5hc3NldCgnLi93ZWJzaXRlLWRpc3QnKV0sXG4gICAqICAgZGVzdGluYXRpb25CdWNrZXQ6IHdlYnNpdGVCdWNrZXQsXG4gICAqIH0pO1xuICAgKlxuICAgKiBkZXBsb3ltZW50LmFkZFNvdXJjZShzM2RlcGxveS5Tb3VyY2UuYXNzZXQoJy4vYW5vdGhlci1hc3NldCcpKTtcbiAgICovXG4gIHB1YmxpYyBhZGRTb3VyY2Uoc291cmNlOiBJU291cmNlKTogdm9pZCB7XG4gICAgdGhpcy5zb3VyY2VzLnB1c2goc291cmNlLmJpbmQodGhpcywgeyBoYW5kbGVyUm9sZTogdGhpcy5oYW5kbGVyUm9sZSB9KSk7XG4gIH1cblxuICBwcml2YXRlIHJlbmRlclVuaXF1ZUlkKG1lbW9yeUxpbWl0PzogbnVtYmVyLCBlcGhlbWVyYWxTdG9yYWdlU2l6ZT86IGNkay5TaXplLCB2cGM/OiBlYzIuSVZwYykge1xuICAgIGxldCB1dWlkID0gJyc7XG5cbiAgICAvLyBpZiB0aGUgdXNlciBzcGVjaWZlcyBhIGN1c3RvbSBtZW1vcnkgbGltaXQsIHdlIGRlZmluZSBhbm90aGVyIHNpbmdsZXRvbiBoYW5kbGVyXG4gICAgLy8gd2l0aCB0aGlzIGNvbmZpZ3VyYXRpb24uIG90aGVyd2lzZSwgaXQgd29uJ3QgYmUgcG9zc2libGUgdG8gdXNlIG11bHRpcGxlXG4gICAgLy8gY29uZmlndXJhdGlvbnMgc2luY2Ugd2UgaGF2ZSBhIHNpbmdsZXRvbi5cbiAgICBpZiAobWVtb3J5TGltaXQpIHtcbiAgICAgIGlmIChjZGsuVG9rZW4uaXNVbnJlc29sdmVkKG1lbW9yeUxpbWl0KSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYW4ndCB1c2UgdG9rZW5zIHdoZW4gc3BlY2lmeWluZyAnbWVtb3J5TGltaXQnIHNpbmNlIHdlIHVzZSBpdCB0byBpZGVudGlmeSB0aGUgc2luZ2xldG9uIGN1c3RvbSByZXNvdXJjZSBoYW5kbGVyLlwiKTtcbiAgICAgIH1cblxuICAgICAgdXVpZCArPSBgLSR7bWVtb3J5TGltaXQudG9TdHJpbmcoKX1NaUJgO1xuICAgIH1cblxuICAgIC8vIGlmIHRoZSB1c2VyIHNwZWNpZmllcyBhIGN1c3RvbSBlcGhlbWVyYWwgc3RvcmFnZSBzaXplLCB3ZSBkZWZpbmUgYW5vdGhlciBzaW5nbGV0b24gaGFuZGxlclxuICAgIC8vIHdpdGggdGhpcyBjb25maWd1cmF0aW9uLiBvdGhlcndpc2UsIGl0IHdvbid0IGJlIHBvc3NpYmxlIHRvIHVzZSBtdWx0aXBsZVxuICAgIC8vIGNvbmZpZ3VyYXRpb25zIHNpbmNlIHdlIGhhdmUgYSBzaW5nbGV0b24uXG4gICAgaWYgKGVwaGVtZXJhbFN0b3JhZ2VTaXplKSB7XG4gICAgICBpZiAoZXBoZW1lcmFsU3RvcmFnZVNpemUuaXNVbnJlc29sdmVkKCkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ2FuJ3QgdXNlIHRva2VucyB3aGVuIHNwZWNpZnlpbmcgJ2VwaGVtZXJhbFN0b3JhZ2VTaXplJyBzaW5jZSB3ZSB1c2UgaXQgdG8gaWRlbnRpZnkgdGhlIHNpbmdsZXRvbiBjdXN0b20gcmVzb3VyY2UgaGFuZGxlci5cIik7XG4gICAgICB9XG5cbiAgICAgIHV1aWQgKz0gYC0ke2VwaGVtZXJhbFN0b3JhZ2VTaXplLnRvTWViaWJ5dGVzKCkudG9TdHJpbmcoKX1NaUJgO1xuICAgIH1cblxuICAgIC8vIGlmIHRoZSB1c2VyIHNwZWNpZmllcyBhIFZQQywgd2UgZGVmaW5lIGFub3RoZXIgc2luZ2xldG9uIGhhbmRsZXJcbiAgICAvLyB3aXRoIHRoaXMgY29uZmlndXJhdGlvbi4gb3RoZXJ3aXNlLCBpdCB3b24ndCBiZSBwb3NzaWJsZSB0byB1c2UgbXVsdGlwbGVcbiAgICAvLyBjb25maWd1cmF0aW9ucyBzaW5jZSB3ZSBoYXZlIGEgc2luZ2xldG9uLlxuICAgIC8vIEEgVlBDIGlzIGEgbXVzdCBpZiBFRlMgc3RvcmFnZSBpcyB1c2VkIGFuZCB0aGF0J3Mgd2h5IHdlIGFyZSBvbmx5IHVzaW5nIFZQQyBpbiB1dWlkLlxuICAgIGlmICh2cGMpIHtcbiAgICAgIHV1aWQgKz0gYC0ke3ZwYy5ub2RlLmFkZHJ9YDtcbiAgICB9XG5cbiAgICByZXR1cm4gdXVpZDtcbiAgfVxuXG4gIHByaXZhdGUgcmVuZGVyU2luZ2xldG9uVXVpZChtZW1vcnlMaW1pdD86IG51bWJlciwgZXBoZW1lcmFsU3RvcmFnZVNpemU/OiBjZGsuU2l6ZSwgdnBjPzogZWMyLklWcGMpIHtcbiAgICBsZXQgdXVpZCA9ICc4NjkzQkI2NC05Njg5LTQ0QjYtOUFBRi1CMENDOUVCODc1NkMnO1xuXG4gICAgdXVpZCArPSB0aGlzLnJlbmRlclVuaXF1ZUlkKG1lbW9yeUxpbWl0LCBlcGhlbWVyYWxTdG9yYWdlU2l6ZSwgdnBjKTtcblxuICAgIHJldHVybiB1dWlkO1xuICB9XG5cbiAgLyoqXG4gICAqIEZ1bmN0aW9uIHRvIGdldC9jcmVhdGUgYSBzdGFjayBzaW5nbGV0b24gaW5zdGFuY2Ugb2YgRUZTIEZpbGVTeXN0ZW0gcGVyIHZwYy5cbiAgICpcbiAgICogQHBhcmFtIHNjb3BlIENvbnN0cnVjdFxuICAgKiBAcGFyYW0gZmlsZVN5c3RlbVByb3BzIEVGUyBGaWxlU3lzdGVtUHJvcHNcbiAgICovXG4gIHByaXZhdGUgZ2V0T3JDcmVhdGVFZnNGaWxlU3lzdGVtKHNjb3BlOiBDb25zdHJ1Y3QsIGZpbGVTeXN0ZW1Qcm9wczogZWZzLkZpbGVTeXN0ZW1Qcm9wcyk6IGVmcy5GaWxlU3lzdGVtIHtcbiAgICBjb25zdCBzdGFjayA9IGNkay5TdGFjay5vZihzY29wZSk7XG4gICAgY29uc3QgdXVpZCA9IGBCdWNrZXREZXBsb3ltZW50RUZTLVZQQy0ke2ZpbGVTeXN0ZW1Qcm9wcy52cGMubm9kZS5hZGRyfWA7XG4gICAgcmV0dXJuIHN0YWNrLm5vZGUudHJ5RmluZENoaWxkKHV1aWQpIGFzIGVmcy5GaWxlU3lzdGVtID8/IG5ldyBlZnMuRmlsZVN5c3RlbShzY29wZSwgdXVpZCwgZmlsZVN5c3RlbVByb3BzKTtcbiAgfVxufVxuXG4vKipcbiAqIE1ldGFkYXRhXG4gKi9cblxuZnVuY3Rpb24gbWFwVXNlck1ldGFkYXRhKG1ldGFkYXRhOiBVc2VyRGVmaW5lZE9iamVjdE1ldGFkYXRhKSB7XG4gIGNvbnN0IG1hcEtleSA9IChrZXk6IHN0cmluZykgPT4ga2V5LnRvTG93ZXJDYXNlKCk7XG5cbiAgcmV0dXJuIE9iamVjdC5rZXlzKG1ldGFkYXRhKS5yZWR1Y2UoKG8sIGtleSkgPT4gKHsgLi4ubywgW21hcEtleShrZXkpXTogbWV0YWRhdGFba2V5XSB9KSwge30pO1xufVxuXG5mdW5jdGlvbiBtYXBTeXN0ZW1NZXRhZGF0YShtZXRhZGF0YTogQnVja2V0RGVwbG95bWVudFByb3BzKSB7XG4gIGNvbnN0IHJlczogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfSA9IHt9O1xuXG4gIGlmIChtZXRhZGF0YS5jYWNoZUNvbnRyb2wpIHsgcmVzWydjYWNoZS1jb250cm9sJ10gPSBtZXRhZGF0YS5jYWNoZUNvbnRyb2wubWFwKGMgPT4gYy52YWx1ZSkuam9pbignLCAnKTsgfVxuICBpZiAobWV0YWRhdGEuZXhwaXJlcykgeyByZXMuZXhwaXJlcyA9IG1ldGFkYXRhLmV4cGlyZXMuZGF0ZS50b1VUQ1N0cmluZygpOyB9XG4gIGlmIChtZXRhZGF0YS5jb250ZW50RGlzcG9zaXRpb24pIHsgcmVzWydjb250ZW50LWRpc3Bvc2l0aW9uJ10gPSBtZXRhZGF0YS5jb250ZW50RGlzcG9zaXRpb247IH1cbiAgaWYgKG1ldGFkYXRhLmNvbnRlbnRFbmNvZGluZykgeyByZXNbJ2NvbnRlbnQtZW5jb2RpbmcnXSA9IG1ldGFkYXRhLmNvbnRlbnRFbmNvZGluZzsgfVxuICBpZiAobWV0YWRhdGEuY29udGVudExhbmd1YWdlKSB7IHJlc1snY29udGVudC1sYW5ndWFnZSddID0gbWV0YWRhdGEuY29udGVudExhbmd1YWdlOyB9XG4gIGlmIChtZXRhZGF0YS5jb250ZW50VHlwZSkgeyByZXNbJ2NvbnRlbnQtdHlwZSddID0gbWV0YWRhdGEuY29udGVudFR5cGU7IH1cbiAgaWYgKG1ldGFkYXRhLnNlcnZlclNpZGVFbmNyeXB0aW9uKSB7IHJlcy5zc2UgPSBtZXRhZGF0YS5zZXJ2ZXJTaWRlRW5jcnlwdGlvbjsgfVxuICBpZiAobWV0YWRhdGEuc3RvcmFnZUNsYXNzKSB7IHJlc1snc3RvcmFnZS1jbGFzcyddID0gbWV0YWRhdGEuc3RvcmFnZUNsYXNzOyB9XG4gIGlmIChtZXRhZGF0YS53ZWJzaXRlUmVkaXJlY3RMb2NhdGlvbikgeyByZXNbJ3dlYnNpdGUtcmVkaXJlY3QnXSA9IG1ldGFkYXRhLndlYnNpdGVSZWRpcmVjdExvY2F0aW9uOyB9XG4gIGlmIChtZXRhZGF0YS5zZXJ2ZXJTaWRlRW5jcnlwdGlvbkF3c0ttc0tleUlkKSB7IHJlc1snc3NlLWttcy1rZXktaWQnXSA9IG1ldGFkYXRhLnNlcnZlclNpZGVFbmNyeXB0aW9uQXdzS21zS2V5SWQ7IH1cbiAgaWYgKG1ldGFkYXRhLnNlcnZlclNpZGVFbmNyeXB0aW9uQ3VzdG9tZXJBbGdvcml0aG0pIHsgcmVzWydzc2UtYy1jb3B5LXNvdXJjZSddID0gbWV0YWRhdGEuc2VydmVyU2lkZUVuY3J5cHRpb25DdXN0b21lckFsZ29yaXRobTsgfVxuICBpZiAobWV0YWRhdGEuYWNjZXNzQ29udHJvbCkgeyByZXMuYWNsID0gdG9LZWJhYkNhc2UobWV0YWRhdGEuYWNjZXNzQ29udHJvbC50b1N0cmluZygpKTsgfVxuXG4gIHJldHVybiBPYmplY3Qua2V5cyhyZXMpLmxlbmd0aCA9PT0gMCA/IHVuZGVmaW5lZCA6IHJlcztcbn1cblxuLyoqXG4gKiBVc2VkIGZvciBIVFRQIGNhY2hlLWNvbnRyb2wgaGVhZGVyLCB3aGljaCBpbmZsdWVuY2VzIGRvd25zdHJlYW0gY2FjaGVzLlxuICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQW1hem9uUzMvbGF0ZXN0L2Rldi9Vc2luZ01ldGFkYXRhLmh0bWwjU3lzTWV0YWRhdGFcbiAqL1xuZXhwb3J0IGNsYXNzIENhY2hlQ29udHJvbCB7XG5cbiAgLyoqXG4gICAqIFNldHMgJ211c3QtcmV2YWxpZGF0ZScuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIG11c3RSZXZhbGlkYXRlKCkgeyByZXR1cm4gbmV3IENhY2hlQ29udHJvbCgnbXVzdC1yZXZhbGlkYXRlJyk7IH1cblxuICAvKipcbiAgICogU2V0cyAnbm8tY2FjaGUnLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBub0NhY2hlKCkgeyByZXR1cm4gbmV3IENhY2hlQ29udHJvbCgnbm8tY2FjaGUnKTsgfVxuXG4gIC8qKlxuICAgKiBTZXRzICduby10cmFuc2Zvcm0nLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBub1RyYW5zZm9ybSgpIHsgcmV0dXJuIG5ldyBDYWNoZUNvbnRyb2woJ25vLXRyYW5zZm9ybScpOyB9XG5cbiAgLyoqXG4gICAqIFNldHMgJ3B1YmxpYycuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHNldFB1YmxpYygpIHsgcmV0dXJuIG5ldyBDYWNoZUNvbnRyb2woJ3B1YmxpYycpOyB9XG5cbiAgLyoqXG4gICAqIFNldHMgJ3ByaXZhdGUnLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBzZXRQcml2YXRlKCkgeyByZXR1cm4gbmV3IENhY2hlQ29udHJvbCgncHJpdmF0ZScpOyB9XG5cbiAgLyoqXG4gICAqIFNldHMgJ3Byb3h5LXJldmFsaWRhdGUnLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBwcm94eVJldmFsaWRhdGUoKSB7IHJldHVybiBuZXcgQ2FjaGVDb250cm9sKCdwcm94eS1yZXZhbGlkYXRlJyk7IH1cblxuICAvKipcbiAgICogU2V0cyAnbWF4LWFnZT08ZHVyYXRpb24taW4tc2Vjb25kcz4nLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBtYXhBZ2UodDogY2RrLkR1cmF0aW9uKSB7IHJldHVybiBuZXcgQ2FjaGVDb250cm9sKGBtYXgtYWdlPSR7dC50b1NlY29uZHMoKX1gKTsgfVxuXG4gIC8qKlxuICAgKiBTZXRzICdzLW1heGFnZT08ZHVyYXRpb24taW4tc2Vjb25kcz4nLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBzTWF4QWdlKHQ6IGNkay5EdXJhdGlvbikgeyByZXR1cm4gbmV3IENhY2hlQ29udHJvbChgcy1tYXhhZ2U9JHt0LnRvU2Vjb25kcygpfWApOyB9XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdHMgYSBjdXN0b20gY2FjaGUgY29udHJvbCBrZXkgZnJvbSB0aGUgbGl0ZXJhbCB2YWx1ZS5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZnJvbVN0cmluZyhzOiBzdHJpbmcpIHsgcmV0dXJuIG5ldyBDYWNoZUNvbnRyb2wocyk7IH1cblxuICBwcml2YXRlIGNvbnN0cnVjdG9yKFxuICAgIC8qKlxuICAgICAqIFRoZSByYXcgY2FjaGUgY29udHJvbCBzZXR0aW5nLlxuICAgICAqL1xuICAgIHB1YmxpYyByZWFkb25seSB2YWx1ZTogYW55LFxuICApIHsgfVxufVxuXG4vKipcbiAqIEluZGljYXRlcyB3aGV0aGVyIHNlcnZlci1zaWRlIGVuY3J5cHRpb24gaXMgZW5hYmxlZCBmb3IgdGhlIG9iamVjdCwgYW5kIHdoZXRoZXIgdGhhdCBlbmNyeXB0aW9uIGlzXG4gKiBmcm9tIHRoZSBBV1MgS2V5IE1hbmFnZW1lbnQgU2VydmljZSAoQVdTIEtNUykgb3IgZnJvbSBBbWF6b24gUzMgbWFuYWdlZCBlbmNyeXB0aW9uIChTU0UtUzMpLlxuICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQW1hem9uUzMvbGF0ZXN0L2Rldi9Vc2luZ01ldGFkYXRhLmh0bWwjU3lzTWV0YWRhdGFcbiAqL1xuZXhwb3J0IGVudW0gU2VydmVyU2lkZUVuY3J5cHRpb24ge1xuXG4gIC8qKlxuICAgKiAnQUVTMjU2J1xuICAgKi9cbiAgQUVTXzI1NiA9ICdBRVMyNTYnLFxuXG4gIC8qKlxuICAgKiAnYXdzOmttcydcbiAgICovXG4gIEFXU19LTVMgPSAnYXdzOmttcydcbn1cblxuLyoqXG4gKiBTdG9yYWdlIGNsYXNzIHVzZWQgZm9yIHN0b3JpbmcgdGhlIG9iamVjdC5cbiAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FtYXpvblMzL2xhdGVzdC9kZXYvVXNpbmdNZXRhZGF0YS5odG1sI1N5c01ldGFkYXRhXG4gKi9cbmV4cG9ydCBlbnVtIFN0b3JhZ2VDbGFzcyB7XG5cbiAgLyoqXG4gICAqICdTVEFOREFSRCdcbiAgICovXG4gIFNUQU5EQVJEID0gJ1NUQU5EQVJEJyxcblxuICAvKipcbiAgICogJ1JFRFVDRURfUkVEVU5EQU5DWSdcbiAgICovXG4gIFJFRFVDRURfUkVEVU5EQU5DWSA9ICdSRURVQ0VEX1JFRFVOREFOQ1knLFxuXG4gIC8qKlxuICAgKiAnU1RBTkRBUkRfSUEnXG4gICAqL1xuICBTVEFOREFSRF9JQSA9ICdTVEFOREFSRF9JQScsXG5cbiAgLyoqXG4gICAqICdPTkVaT05FX0lBJ1xuICAgKi9cbiAgT05FWk9ORV9JQSA9ICdPTkVaT05FX0lBJyxcblxuICAvKipcbiAgICogJ0lOVEVMTElHRU5UX1RJRVJJTkcnXG4gICAqL1xuICBJTlRFTExJR0VOVF9USUVSSU5HID0gJ0lOVEVMTElHRU5UX1RJRVJJTkcnLFxuXG4gIC8qKlxuICAgKiAnR0xBQ0lFUidcbiAgICovXG4gIEdMQUNJRVIgPSAnR0xBQ0lFUicsXG5cbiAgLyoqXG4gICAqICdERUVQX0FSQ0hJVkUnXG4gICAqL1xuICBERUVQX0FSQ0hJVkUgPSAnREVFUF9BUkNISVZFJ1xufVxuXG4vKipcbiAqIFVzZWQgZm9yIEhUVFAgZXhwaXJlcyBoZWFkZXIsIHdoaWNoIGluZmx1ZW5jZXMgZG93bnN0cmVhbSBjYWNoZXMuIERvZXMgTk9UIGluZmx1ZW5jZSBkZWxldGlvbiBvZiB0aGUgb2JqZWN0LlxuICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQW1hem9uUzMvbGF0ZXN0L2Rldi9Vc2luZ01ldGFkYXRhLmh0bWwjU3lzTWV0YWRhdGFcbiAqXG4gKiBAZGVwcmVjYXRlZCB1c2UgY29yZS5FeHBpcmF0aW9uXG4gKi9cbmV4cG9ydCBjbGFzcyBFeHBpcmVzIHtcbiAgLyoqXG4gICAqIEV4cGlyZSBhdCB0aGUgc3BlY2lmaWVkIGRhdGVcbiAgICogQHBhcmFtIGQgZGF0ZSB0byBleHBpcmUgYXRcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgYXREYXRlKGQ6IERhdGUpIHsgcmV0dXJuIG5ldyBFeHBpcmVzKGQudG9VVENTdHJpbmcoKSk7IH1cblxuICAvKipcbiAgICogRXhwaXJlIGF0IHRoZSBzcGVjaWZpZWQgdGltZXN0YW1wXG4gICAqIEBwYXJhbSB0IHRpbWVzdGFtcCBpbiB1bml4IG1pbGxpc2Vjb25kc1xuICAgKi9cbiAgcHVibGljIHN0YXRpYyBhdFRpbWVzdGFtcCh0OiBudW1iZXIpIHsgcmV0dXJuIEV4cGlyZXMuYXREYXRlKG5ldyBEYXRlKHQpKTsgfVxuXG4gIC8qKlxuICAgKiBFeHBpcmUgb25jZSB0aGUgc3BlY2lmaWVkIGR1cmF0aW9uIGhhcyBwYXNzZWQgc2luY2UgZGVwbG95bWVudCB0aW1lXG4gICAqIEBwYXJhbSB0IHRoZSBkdXJhdGlvbiB0byB3YWl0IGJlZm9yZSBleHBpcmluZ1xuICAgKi9cbiAgcHVibGljIHN0YXRpYyBhZnRlcih0OiBjZGsuRHVyYXRpb24pIHsgcmV0dXJuIEV4cGlyZXMuYXREYXRlKG5ldyBEYXRlKERhdGUubm93KCkgKyB0LnRvTWlsbGlzZWNvbmRzKCkpKTsgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgYW4gZXhwaXJhdGlvbiBkYXRlIGZyb20gYSByYXcgZGF0ZSBzdHJpbmcuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21TdHJpbmcoczogc3RyaW5nKSB7IHJldHVybiBuZXcgRXhwaXJlcyhzKTsgfVxuXG4gIHByaXZhdGUgY29uc3RydWN0b3IoXG4gICAgLyoqXG4gICAgICogVGhlIHJhdyBleHBpcmF0aW9uIGRhdGUgZXhwcmVzc2lvbi5cbiAgICAgKi9cbiAgICBwdWJsaWMgcmVhZG9ubHkgdmFsdWU6IGFueSxcbiAgKSB7IH1cbn1cblxuLyoqXG4gKiBDdXN0b20gdXNlciBkZWZpbmVkIG1ldGFkYXRhLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIFVzZXJEZWZpbmVkT2JqZWN0TWV0YWRhdGEge1xuICAvKipcbiAgICogQXJiaXRyYXJ5IG1ldGFkYXRhIGtleS12YWx1ZXNcbiAgICogVGhlIGB4LWFtei1tZXRhLWAgcHJlZml4IHdpbGwgYXV0b21hdGljYWxseSBiZSBhZGRlZCB0byBrZXlzLlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BbWF6b25TMy9sYXRlc3QvZGV2L1VzaW5nTWV0YWRhdGEuaHRtbCNVc2VyTWV0YWRhdGFcbiAgICovXG4gIHJlYWRvbmx5IFtrZXk6IHN0cmluZ106IHN0cmluZztcbn1cbiJdfQ==