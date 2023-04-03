"use strict";
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectLockRetention = exports.ObjectLockMode = exports.ReplaceKey = exports.BucketAccessControl = exports.EventType = exports.BucketEncryption = exports.Bucket = exports.ObjectOwnership = exports.InventoryObjectVersion = exports.InventoryFrequency = exports.InventoryFormat = exports.RedirectProtocol = exports.HttpMethods = exports.BlockPublicAccess = exports.BucketBase = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const os_1 = require("os");
const path = require("path");
const events = require("@aws-cdk/aws-events");
const iam = require("@aws-cdk/aws-iam");
const kms = require("@aws-cdk/aws-kms");
const core_1 = require("@aws-cdk/core");
const cfn_reference_1 = require("@aws-cdk/core/lib/private/cfn-reference");
const cxapi = require("@aws-cdk/cx-api");
const regionInformation = require("@aws-cdk/region-info");
const bucket_policy_1 = require("./bucket-policy");
const notifications_resource_1 = require("./notifications-resource");
const perms = require("./perms");
const s3_generated_1 = require("./s3.generated");
const util_1 = require("./util");
const AUTO_DELETE_OBJECTS_RESOURCE_TYPE = 'Custom::S3AutoDeleteObjects';
const AUTO_DELETE_OBJECTS_TAG = 'aws-cdk:auto-delete-objects';
/**
 * Represents an S3 Bucket.
 *
 * Buckets can be either defined within this stack:
 *
 *   new Bucket(this, 'MyBucket', { props });
 *
 * Or imported from an existing bucket:
 *
 *   Bucket.import(this, 'MyImportedBucket', { bucketArn: ... });
 *
 * You can also export a bucket and import it into another stack:
 *
 *   const ref = myBucket.export();
 *   Bucket.import(this, 'MyImportedBucket', ref);
 *
 */
class BucketBase extends core_1.Resource {
    constructor(scope, id, props = {}) {
        super(scope, id, props);
        this.node.addValidation({ validate: () => this.policy?.document.validateForResourcePolicy() ?? [] });
    }
    /**
     * Define a CloudWatch event that triggers when something happens to this repository
     *
     * Requires that there exists at least one CloudTrail Trail in your account
     * that captures the event. This method will not create the Trail.
     *
     * @param id The id of the rule
     * @param options Options for adding the rule
     */
    onCloudTrailEvent(id, options = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_s3_OnCloudTrailBucketEventOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.onCloudTrailEvent);
            }
            throw error;
        }
        const rule = new events.Rule(this, id, options);
        rule.addTarget(options.target);
        rule.addEventPattern({
            source: ['aws.s3'],
            detailType: ['AWS API Call via CloudTrail'],
            detail: {
                resources: {
                    ARN: options.paths?.map(p => this.arnForObjects(p)) ?? [this.bucketArn],
                },
            },
        });
        return rule;
    }
    /**
     * Defines an AWS CloudWatch event that triggers when an object is uploaded
     * to the specified paths (keys) in this bucket using the PutObject API call.
     *
     * Note that some tools like `aws s3 cp` will automatically use either
     * PutObject or the multipart upload API depending on the file size,
     * so using `onCloudTrailWriteObject` may be preferable.
     *
     * Requires that there exists at least one CloudTrail Trail in your account
     * that captures the event. This method will not create the Trail.
     *
     * @param id The id of the rule
     * @param options Options for adding the rule
     */
    onCloudTrailPutObject(id, options = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_s3_OnCloudTrailBucketEventOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.onCloudTrailPutObject);
            }
            throw error;
        }
        const rule = this.onCloudTrailEvent(id, options);
        rule.addEventPattern({
            detail: {
                eventName: ['PutObject'],
            },
        });
        return rule;
    }
    /**
     * Defines an AWS CloudWatch event that triggers when an object at the
     * specified paths (keys) in this bucket are written to.  This includes
     * the events PutObject, CopyObject, and CompleteMultipartUpload.
     *
     * Note that some tools like `aws s3 cp` will automatically use either
     * PutObject or the multipart upload API depending on the file size,
     * so using this method may be preferable to `onCloudTrailPutObject`.
     *
     * Requires that there exists at least one CloudTrail Trail in your account
     * that captures the event. This method will not create the Trail.
     *
     * @param id The id of the rule
     * @param options Options for adding the rule
     */
    onCloudTrailWriteObject(id, options = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_s3_OnCloudTrailBucketEventOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.onCloudTrailWriteObject);
            }
            throw error;
        }
        const rule = this.onCloudTrailEvent(id, options);
        rule.addEventPattern({
            detail: {
                eventName: [
                    'CompleteMultipartUpload',
                    'CopyObject',
                    'PutObject',
                ],
                requestParameters: {
                    bucketName: [this.bucketName],
                    key: options.paths,
                },
            },
        });
        return rule;
    }
    /**
     * Adds a statement to the resource policy for a principal (i.e.
     * account/role/service) to perform actions on this bucket and/or its
     * contents. Use `bucketArn` and `arnForObjects(keys)` to obtain ARNs for
     * this bucket or objects.
     *
     * Note that the policy statement may or may not be added to the policy.
     * For example, when an `IBucket` is created from an existing bucket,
     * it's not possible to tell whether the bucket already has a policy
     * attached, let alone to re-use that policy to add more statements to it.
     * So it's safest to do nothing in these cases.
     *
     * @param permission the policy statement to be added to the bucket's
     * policy.
     * @returns metadata about the execution of this method. If the policy
     * was not added, the value of `statementAdded` will be `false`. You
     * should always check this value to make sure that the operation was
     * actually carried out. Otherwise, synthesis and deploy will terminate
     * silently, which may be confusing.
     */
    addToResourcePolicy(permission) {
        if (!this.policy && this.autoCreatePolicy) {
            this.policy = new bucket_policy_1.BucketPolicy(this, 'Policy', { bucket: this });
        }
        if (this.policy) {
            this.policy.document.addStatements(permission);
            return { statementAdded: true, policyDependable: this.policy };
        }
        return { statementAdded: false };
    }
    /**
     * The https URL of an S3 object. Specify `regional: false` at the options
     * for non-regional URLs. For example:
     *
     * - `https://s3.us-west-1.amazonaws.com/onlybucket`
     * - `https://s3.us-west-1.amazonaws.com/bucket/key`
     * - `https://s3.cn-north-1.amazonaws.com.cn/china-bucket/mykey`
     *
     * @param key The S3 key of the object. If not specified, the URL of the
     *      bucket is returned.
     * @returns an ObjectS3Url token
     */
    urlForObject(key) {
        const stack = core_1.Stack.of(this);
        const prefix = `https://s3.${this.env.region}.${stack.urlSuffix}/`;
        if (typeof key !== 'string') {
            return this.urlJoin(prefix, this.bucketName);
        }
        return this.urlJoin(prefix, this.bucketName, key);
    }
    /**
     * The https Transfer Acceleration URL of an S3 object. Specify `dualStack: true` at the options
     * for dual-stack endpoint (connect to the bucket over IPv6). For example:
     *
     * - `https://bucket.s3-accelerate.amazonaws.com`
     * - `https://bucket.s3-accelerate.amazonaws.com/key`
     *
     * @param key The S3 key of the object. If not specified, the URL of the
     *      bucket is returned.
     * @param options Options for generating URL.
     * @returns an TransferAccelerationUrl token
     */
    transferAccelerationUrlForObject(key, options) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_s3_TransferAccelerationUrlOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.transferAccelerationUrlForObject);
            }
            throw error;
        }
        const dualStack = options?.dualStack ? '.dualstack' : '';
        const prefix = `https://${this.bucketName}.s3-accelerate${dualStack}.amazonaws.com/`;
        if (typeof key !== 'string') {
            return this.urlJoin(prefix);
        }
        return this.urlJoin(prefix, key);
    }
    /**
     * The virtual hosted-style URL of an S3 object. Specify `regional: false` at
     * the options for non-regional URL. For example:
     *
     * - `https://only-bucket.s3.us-west-1.amazonaws.com`
     * - `https://bucket.s3.us-west-1.amazonaws.com/key`
     * - `https://bucket.s3.amazonaws.com/key`
     * - `https://china-bucket.s3.cn-north-1.amazonaws.com.cn/mykey`
     *
     * @param key The S3 key of the object. If not specified, the URL of the
     *      bucket is returned.
     * @param options Options for generating URL.
     * @returns an ObjectS3Url token
     */
    virtualHostedUrlForObject(key, options) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_s3_VirtualHostedStyleUrlOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.virtualHostedUrlForObject);
            }
            throw error;
        }
        const domainName = options?.regional ?? true ? this.bucketRegionalDomainName : this.bucketDomainName;
        const prefix = `https://${domainName}`;
        if (typeof key !== 'string') {
            return prefix;
        }
        return this.urlJoin(prefix, key);
    }
    /**
     * The S3 URL of an S3 object. For example:
     *
     * - `s3://onlybucket`
     * - `s3://bucket/key`
     *
     * @param key The S3 key of the object. If not specified, the S3 URL of the
     *      bucket is returned.
     * @returns an ObjectS3Url token
     */
    s3UrlForObject(key) {
        const prefix = 's3://';
        if (typeof key !== 'string') {
            return this.urlJoin(prefix, this.bucketName);
        }
        return this.urlJoin(prefix, this.bucketName, key);
    }
    /**
     * Returns an ARN that represents all objects within the bucket that match
     * the key pattern specified. To represent all keys, specify ``"*"``.
     *
     * If you need to specify a keyPattern with multiple components, concatenate them into a single string, e.g.:
     *
     *   arnForObjects(`home/${team}/${user}/*`)
     *
     */
    arnForObjects(keyPattern) {
        return `${this.bucketArn}/${keyPattern}`;
    }
    /**
     * Grant read permissions for this bucket and it's contents to an IAM
     * principal (Role/Group/User).
     *
     * If encryption is used, permission to use the key to decrypt the contents
     * of the bucket will also be granted to the same principal.
     *
     * @param identity The principal
     * @param objectsKeyPattern Restrict the permission to a certain key pattern (default '*')
     */
    grantRead(identity, objectsKeyPattern = '*') {
        return this.grant(identity, perms.BUCKET_READ_ACTIONS, perms.KEY_READ_ACTIONS, this.bucketArn, this.arnForObjects(objectsKeyPattern));
    }
    grantWrite(identity, objectsKeyPattern = '*', allowedActionPatterns = []) {
        const grantedWriteActions = allowedActionPatterns.length > 0 ? allowedActionPatterns : this.writeActions;
        return this.grant(identity, grantedWriteActions, perms.KEY_WRITE_ACTIONS, this.bucketArn, this.arnForObjects(objectsKeyPattern));
    }
    /**
     * Grants s3:PutObject* and s3:Abort* permissions for this bucket to an IAM principal.
     *
     * If encryption is used, permission to use the key to encrypt the contents
     * of written files will also be granted to the same principal.
     * @param identity The principal
     * @param objectsKeyPattern Restrict the permission to a certain key pattern (default '*')
     */
    grantPut(identity, objectsKeyPattern = '*') {
        return this.grant(identity, this.putActions, perms.KEY_WRITE_ACTIONS, this.arnForObjects(objectsKeyPattern));
    }
    grantPutAcl(identity, objectsKeyPattern = '*') {
        return this.grant(identity, perms.BUCKET_PUT_ACL_ACTIONS, [], this.arnForObjects(objectsKeyPattern));
    }
    /**
     * Grants s3:DeleteObject* permission to an IAM principal for objects
     * in this bucket.
     *
     * @param identity The principal
     * @param objectsKeyPattern Restrict the permission to a certain key pattern (default '*')
     */
    grantDelete(identity, objectsKeyPattern = '*') {
        return this.grant(identity, perms.BUCKET_DELETE_ACTIONS, [], this.arnForObjects(objectsKeyPattern));
    }
    grantReadWrite(identity, objectsKeyPattern = '*') {
        const bucketActions = perms.BUCKET_READ_ACTIONS.concat(this.writeActions);
        // we need unique permissions because some permissions are common between read and write key actions
        const keyActions = [...new Set([...perms.KEY_READ_ACTIONS, ...perms.KEY_WRITE_ACTIONS])];
        return this.grant(identity, bucketActions, keyActions, this.bucketArn, this.arnForObjects(objectsKeyPattern));
    }
    /**
     * Allows unrestricted access to objects from this bucket.
     *
     * IMPORTANT: This permission allows anyone to perform actions on S3 objects
     * in this bucket, which is useful for when you configure your bucket as a
     * website and want everyone to be able to read objects in the bucket without
     * needing to authenticate.
     *
     * Without arguments, this method will grant read ("s3:GetObject") access to
     * all objects ("*") in the bucket.
     *
     * The method returns the `iam.Grant` object, which can then be modified
     * as needed. For example, you can add a condition that will restrict access only
     * to an IPv4 range like this:
     *
     *     const grant = bucket.grantPublicAccess();
     *     grant.resourceStatement!.addCondition(‘IpAddress’, { “aws:SourceIp”: “54.240.143.0/24” });
     *
     * Note that if this `IBucket` refers to an existing bucket, possibly not
     * managed by CloudFormation, this method will have no effect, since it's
     * impossible to modify the policy of an existing bucket.
     *
     * @param keyPrefix the prefix of S3 object keys (e.g. `home/*`). Default is "*".
     * @param allowedActions the set of S3 actions to allow. Default is "s3:GetObject".
     */
    grantPublicAccess(keyPrefix = '*', ...allowedActions) {
        if (this.disallowPublicAccess) {
            throw new Error("Cannot grant public access when 'blockPublicPolicy' is enabled");
        }
        allowedActions = allowedActions.length > 0 ? allowedActions : ['s3:GetObject'];
        return iam.Grant.addToPrincipalOrResource({
            actions: allowedActions,
            resourceArns: [this.arnForObjects(keyPrefix)],
            grantee: new iam.AnyPrincipal(),
            resource: this,
        });
    }
    /**
     * Adds a bucket notification event destination.
     * @param event The event to trigger the notification
     * @param dest The notification destination (Lambda, SNS Topic or SQS Queue)
     *
     * @param filters S3 object key filter rules to determine which objects
     * trigger this event. Each filter must include a `prefix` and/or `suffix`
     * that will be matched against the s3 object key. Refer to the S3 Developer Guide
     * for details about allowed filter rules.
     *
     * @see https://docs.aws.amazon.com/AmazonS3/latest/dev/NotificationHowTo.html#notification-how-to-filtering
     *
     * @example
     *
     *    declare const myLambda: lambda.Function;
     *    const bucket = new s3.Bucket(this, 'MyBucket');
     *    bucket.addEventNotification(s3.EventType.OBJECT_CREATED, new s3n.LambdaDestination(myLambda), {prefix: 'home/myusername/*'});
     *
     * @see
     * https://docs.aws.amazon.com/AmazonS3/latest/dev/NotificationHowTo.html
     */
    addEventNotification(event, dest, ...filters) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_s3_EventType(event);
            jsiiDeprecationWarnings._aws_cdk_aws_s3_IBucketNotificationDestination(dest);
            jsiiDeprecationWarnings._aws_cdk_aws_s3_NotificationKeyFilter(filters);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addEventNotification);
            }
            throw error;
        }
        this.withNotifications(notifications => notifications.addNotification(event, dest, ...filters));
    }
    withNotifications(cb) {
        if (!this.notifications) {
            this.notifications = new notifications_resource_1.BucketNotifications(this, 'Notifications', {
                bucket: this,
                handlerRole: this.notificationsHandlerRole,
            });
        }
        cb(this.notifications);
    }
    /**
     * Subscribes a destination to receive notifications when an object is
     * created in the bucket. This is identical to calling
     * `onEvent(EventType.OBJECT_CREATED)`.
     *
     * @param dest The notification destination (see onEvent)
     * @param filters Filters (see onEvent)
     */
    addObjectCreatedNotification(dest, ...filters) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_s3_IBucketNotificationDestination(dest);
            jsiiDeprecationWarnings._aws_cdk_aws_s3_NotificationKeyFilter(filters);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addObjectCreatedNotification);
            }
            throw error;
        }
        return this.addEventNotification(EventType.OBJECT_CREATED, dest, ...filters);
    }
    /**
     * Subscribes a destination to receive notifications when an object is
     * removed from the bucket. This is identical to calling
     * `onEvent(EventType.OBJECT_REMOVED)`.
     *
     * @param dest The notification destination (see onEvent)
     * @param filters Filters (see onEvent)
     */
    addObjectRemovedNotification(dest, ...filters) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_s3_IBucketNotificationDestination(dest);
            jsiiDeprecationWarnings._aws_cdk_aws_s3_NotificationKeyFilter(filters);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addObjectRemovedNotification);
            }
            throw error;
        }
        return this.addEventNotification(EventType.OBJECT_REMOVED, dest, ...filters);
    }
    /**
     * Enables event bridge notification, causing all events below to be sent to EventBridge:
     *
     * - Object Deleted (DeleteObject)
     * - Object Deleted (Lifecycle expiration)
     * - Object Restore Initiated
     * - Object Restore Completed
     * - Object Restore Expired
     * - Object Storage Class Changed
     * - Object Access Tier Changed
     * - Object ACL Updated
     * - Object Tags Added
     * - Object Tags Deleted
     */
    enableEventBridgeNotification() {
        this.withNotifications(notifications => notifications.enableEventBridgeNotification());
    }
    get writeActions() {
        return [
            ...perms.BUCKET_DELETE_ACTIONS,
            ...this.putActions,
        ];
    }
    get putActions() {
        return core_1.FeatureFlags.of(this).isEnabled(cxapi.S3_GRANT_WRITE_WITHOUT_ACL)
            ? perms.BUCKET_PUT_ACTIONS
            : perms.LEGACY_BUCKET_PUT_ACTIONS;
    }
    urlJoin(...components) {
        return components.reduce((result, component) => {
            if (result.endsWith('/')) {
                result = result.slice(0, -1);
            }
            if (component.startsWith('/')) {
                component = component.slice(1);
            }
            return `${result}/${component}`;
        });
    }
    grant(grantee, bucketActions, keyActions, resourceArn, ...otherResourceArns) {
        const resources = [resourceArn, ...otherResourceArns];
        const ret = iam.Grant.addToPrincipalOrResource({
            grantee,
            actions: bucketActions,
            resourceArns: resources,
            resource: this,
        });
        if (this.encryptionKey && keyActions && keyActions.length !== 0) {
            this.encryptionKey.grant(grantee, ...keyActions);
        }
        return ret;
    }
}
_a = JSII_RTTI_SYMBOL_1;
BucketBase[_a] = { fqn: "@aws-cdk/aws-s3.BucketBase", version: "0.0.0" };
exports.BucketBase = BucketBase;
class BlockPublicAccess {
    constructor(options) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_s3_BlockPublicAccessOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, BlockPublicAccess);
            }
            throw error;
        }
        this.blockPublicAcls = options.blockPublicAcls;
        this.blockPublicPolicy = options.blockPublicPolicy;
        this.ignorePublicAcls = options.ignorePublicAcls;
        this.restrictPublicBuckets = options.restrictPublicBuckets;
    }
}
_b = JSII_RTTI_SYMBOL_1;
BlockPublicAccess[_b] = { fqn: "@aws-cdk/aws-s3.BlockPublicAccess", version: "0.0.0" };
BlockPublicAccess.BLOCK_ALL = new BlockPublicAccess({
    blockPublicAcls: true,
    blockPublicPolicy: true,
    ignorePublicAcls: true,
    restrictPublicBuckets: true,
});
BlockPublicAccess.BLOCK_ACLS = new BlockPublicAccess({
    blockPublicAcls: true,
    ignorePublicAcls: true,
});
exports.BlockPublicAccess = BlockPublicAccess;
/**
 * All http request methods
 */
var HttpMethods;
(function (HttpMethods) {
    /**
     * The GET method requests a representation of the specified resource.
     */
    HttpMethods["GET"] = "GET";
    /**
     * The PUT method replaces all current representations of the target resource with the request payload.
     */
    HttpMethods["PUT"] = "PUT";
    /**
     * The HEAD method asks for a response identical to that of a GET request, but without the response body.
     */
    HttpMethods["HEAD"] = "HEAD";
    /**
     * The POST method is used to submit an entity to the specified resource, often causing a change in state or side effects on the server.
     */
    HttpMethods["POST"] = "POST";
    /**
     * The DELETE method deletes the specified resource.
     */
    HttpMethods["DELETE"] = "DELETE";
})(HttpMethods = exports.HttpMethods || (exports.HttpMethods = {}));
/**
 * All http request methods
 */
var RedirectProtocol;
(function (RedirectProtocol) {
    RedirectProtocol["HTTP"] = "http";
    RedirectProtocol["HTTPS"] = "https";
})(RedirectProtocol = exports.RedirectProtocol || (exports.RedirectProtocol = {}));
/**
 * All supported inventory list formats.
 */
var InventoryFormat;
(function (InventoryFormat) {
    /**
     * Generate the inventory list as CSV.
     */
    InventoryFormat["CSV"] = "CSV";
    /**
     * Generate the inventory list as Parquet.
     */
    InventoryFormat["PARQUET"] = "Parquet";
    /**
     * Generate the inventory list as ORC.
     */
    InventoryFormat["ORC"] = "ORC";
})(InventoryFormat = exports.InventoryFormat || (exports.InventoryFormat = {}));
/**
 * All supported inventory frequencies.
 */
var InventoryFrequency;
(function (InventoryFrequency) {
    /**
     * A report is generated every day.
     */
    InventoryFrequency["DAILY"] = "Daily";
    /**
     * A report is generated every Sunday (UTC timezone) after the initial report.
     */
    InventoryFrequency["WEEKLY"] = "Weekly";
})(InventoryFrequency = exports.InventoryFrequency || (exports.InventoryFrequency = {}));
/**
 * Inventory version support.
 */
var InventoryObjectVersion;
(function (InventoryObjectVersion) {
    /**
     * Includes all versions of each object in the report.
     */
    InventoryObjectVersion["ALL"] = "All";
    /**
     * Includes only the current version of each object in the report.
     */
    InventoryObjectVersion["CURRENT"] = "Current";
})(InventoryObjectVersion = exports.InventoryObjectVersion || (exports.InventoryObjectVersion = {}));
/**
   * The ObjectOwnership of the bucket.
   *
   * @see https://docs.aws.amazon.com/AmazonS3/latest/dev/about-object-ownership.html
   *
   */
var ObjectOwnership;
(function (ObjectOwnership) {
    /**
     * ACLs are disabled, and the bucket owner automatically owns
     * and has full control over every object in the bucket.
     * ACLs no longer affect permissions to data in the S3 bucket.
     * The bucket uses policies to define access control.
     */
    ObjectOwnership["BUCKET_OWNER_ENFORCED"] = "BucketOwnerEnforced";
    /**
     * Objects uploaded to the bucket change ownership to the bucket owner .
     */
    ObjectOwnership["BUCKET_OWNER_PREFERRED"] = "BucketOwnerPreferred";
    /**
     * The uploading account will own the object.
     */
    ObjectOwnership["OBJECT_WRITER"] = "ObjectWriter";
})(ObjectOwnership = exports.ObjectOwnership || (exports.ObjectOwnership = {}));
/**
 * An S3 bucket with associated policy objects
 *
 * This bucket does not yet have all features that exposed by the underlying
 * BucketResource.
 *
 * @example
 *
 * new Bucket(scope, 'Bucket', {
 *   blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
 *   encryption: BucketEncryption.S3_MANAGED,
 *   enforceSSL: true,
 *   versioned: true,
 *   removalPolicy: RemovalPolicy.RETAIN,
 * });
 *
 */
class Bucket extends BucketBase {
    static fromBucketArn(scope, id, bucketArn) {
        return Bucket.fromBucketAttributes(scope, id, { bucketArn });
    }
    static fromBucketName(scope, id, bucketName) {
        return Bucket.fromBucketAttributes(scope, id, { bucketName });
    }
    /**
     * Creates a Bucket construct that represents an external bucket.
     *
     * @param scope The parent creating construct (usually `this`).
     * @param id The construct's name.
     * @param attrs A `BucketAttributes` object. Can be obtained from a call to
     * `bucket.export()` or manually created.
     */
    static fromBucketAttributes(scope, id, attrs) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_s3_BucketAttributes(attrs);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromBucketAttributes);
            }
            throw error;
        }
        const stack = core_1.Stack.of(scope);
        const region = attrs.region ?? stack.region;
        const regionInfo = regionInformation.RegionInfo.get(region);
        const urlSuffix = regionInfo.domainSuffix ?? stack.urlSuffix;
        const bucketName = (0, util_1.parseBucketName)(scope, attrs);
        if (!bucketName) {
            throw new Error('Bucket name is required');
        }
        Bucket.validateBucketName(bucketName);
        const oldEndpoint = `s3-website-${region}.${urlSuffix}`;
        const newEndpoint = `s3-website.${region}.${urlSuffix}`;
        let staticDomainEndpoint = regionInfo.s3StaticWebsiteEndpoint
            ?? core_1.Lazy.string({ produce: () => stack.regionalFact(regionInformation.FactName.S3_STATIC_WEBSITE_ENDPOINT, newEndpoint) });
        // Deprecated use of bucketWebsiteNewUrlFormat
        if (attrs.bucketWebsiteNewUrlFormat !== undefined) {
            staticDomainEndpoint = attrs.bucketWebsiteNewUrlFormat ? newEndpoint : oldEndpoint;
        }
        const websiteDomain = `${bucketName}.${staticDomainEndpoint}`;
        class Import extends BucketBase {
            constructor() {
                super(...arguments);
                this.bucketName = bucketName;
                this.bucketArn = (0, util_1.parseBucketArn)(scope, attrs);
                this.bucketDomainName = attrs.bucketDomainName || `${bucketName}.s3.${urlSuffix}`;
                this.bucketWebsiteUrl = attrs.bucketWebsiteUrl || `http://${websiteDomain}`;
                this.bucketWebsiteDomainName = attrs.bucketWebsiteUrl ? core_1.Fn.select(2, core_1.Fn.split('/', attrs.bucketWebsiteUrl)) : websiteDomain;
                this.bucketRegionalDomainName = attrs.bucketRegionalDomainName || `${bucketName}.s3.${region}.${urlSuffix}`;
                this.bucketDualStackDomainName = attrs.bucketDualStackDomainName || `${bucketName}.s3.dualstack.${region}.${urlSuffix}`;
                this.bucketWebsiteNewUrlFormat = attrs.bucketWebsiteNewUrlFormat ?? false;
                this.encryptionKey = attrs.encryptionKey;
                this.isWebsite = attrs.isWebsite ?? false;
                this.policy = undefined;
                this.autoCreatePolicy = false;
                this.disallowPublicAccess = false;
                this.notificationsHandlerRole = attrs.notificationsHandlerRole;
            }
            /**
             * Exports this bucket from the stack.
             */
            export() {
                return attrs;
            }
        }
        return new Import(scope, id, {
            account: attrs.account,
            region: attrs.region,
        });
    }
    /**
     * Create a mutable `IBucket` based on a low-level `CfnBucket`.
     */
    static fromCfnBucket(cfnBucket) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_s3_CfnBucket(cfnBucket);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromCfnBucket);
            }
            throw error;
        }
        // use a "weird" id that has a higher chance of being unique
        const id = '@FromCfnBucket';
        // if fromCfnBucket() was already called on this cfnBucket,
        // return the same L2
        // (as different L2s would conflict, because of the mutation of the policy property of the L1 below)
        const existing = cfnBucket.node.tryFindChild(id);
        if (existing) {
            return existing;
        }
        // handle the KMS Key if the Bucket references one
        let encryptionKey;
        if (cfnBucket.bucketEncryption) {
            const serverSideEncryptionConfiguration = cfnBucket.bucketEncryption.serverSideEncryptionConfiguration;
            if (Array.isArray(serverSideEncryptionConfiguration) && serverSideEncryptionConfiguration.length === 1) {
                const serverSideEncryptionRuleProperty = serverSideEncryptionConfiguration[0];
                const serverSideEncryptionByDefault = serverSideEncryptionRuleProperty.serverSideEncryptionByDefault;
                if (serverSideEncryptionByDefault && core_1.Token.isUnresolved(serverSideEncryptionByDefault.kmsMasterKeyId)) {
                    const kmsIResolvable = core_1.Tokenization.reverse(serverSideEncryptionByDefault.kmsMasterKeyId);
                    if (kmsIResolvable instanceof cfn_reference_1.CfnReference) {
                        const cfnElement = kmsIResolvable.target;
                        if (cfnElement instanceof kms.CfnKey) {
                            encryptionKey = kms.Key.fromCfnKey(cfnElement);
                        }
                    }
                }
            }
        }
        return new class extends BucketBase {
            constructor() {
                super(cfnBucket, id);
                this.bucketArn = cfnBucket.attrArn;
                this.bucketName = cfnBucket.ref;
                this.bucketDomainName = cfnBucket.attrDomainName;
                this.bucketDualStackDomainName = cfnBucket.attrDualStackDomainName;
                this.bucketRegionalDomainName = cfnBucket.attrRegionalDomainName;
                this.bucketWebsiteUrl = cfnBucket.attrWebsiteUrl;
                this.bucketWebsiteDomainName = core_1.Fn.select(2, core_1.Fn.split('/', cfnBucket.attrWebsiteUrl));
                this.encryptionKey = encryptionKey;
                this.isWebsite = cfnBucket.websiteConfiguration !== undefined;
                this.policy = undefined;
                this.autoCreatePolicy = true;
                this.disallowPublicAccess = cfnBucket.publicAccessBlockConfiguration &&
                    cfnBucket.publicAccessBlockConfiguration.blockPublicPolicy;
                this.node.defaultChild = cfnBucket;
            }
        }();
    }
    /**
     * Thrown an exception if the given bucket name is not valid.
     *
     * @param physicalName name of the bucket.
     */
    static validateBucketName(physicalName) {
        const bucketName = physicalName;
        if (!bucketName || core_1.Token.isUnresolved(bucketName)) {
            // the name is a late-bound value, not a defined string,
            // so skip validation
            return;
        }
        const errors = [];
        // Rules codified from https://docs.aws.amazon.com/AmazonS3/latest/dev/BucketRestrictions.html
        if (bucketName.length < 3 || bucketName.length > 63) {
            errors.push('Bucket name must be at least 3 and no more than 63 characters');
        }
        const charsetMatch = bucketName.match(/[^a-z0-9.-]/);
        if (charsetMatch) {
            errors.push('Bucket name must only contain lowercase characters and the symbols, period (.) and dash (-) '
                + `(offset: ${charsetMatch.index})`);
        }
        if (!/[a-z0-9]/.test(bucketName.charAt(0))) {
            errors.push('Bucket name must start and end with a lowercase character or number '
                + '(offset: 0)');
        }
        if (!/[a-z0-9]/.test(bucketName.charAt(bucketName.length - 1))) {
            errors.push('Bucket name must start and end with a lowercase character or number '
                + `(offset: ${bucketName.length - 1})`);
        }
        const consecSymbolMatch = bucketName.match(/\.-|-\.|\.\./);
        if (consecSymbolMatch) {
            errors.push('Bucket name must not have dash next to period, or period next to dash, or consecutive periods '
                + `(offset: ${consecSymbolMatch.index})`);
        }
        if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(bucketName)) {
            errors.push('Bucket name must not resemble an IP address');
        }
        if (errors.length > 0) {
            throw new Error(`Invalid S3 bucket name (value: ${bucketName})${os_1.EOL}${errors.join(os_1.EOL)}`);
        }
    }
    constructor(scope, id, props = {}) {
        super(scope, id, {
            physicalName: props.bucketName,
        });
        this.autoCreatePolicy = true;
        this.lifecycleRules = [];
        this.metrics = [];
        this.cors = [];
        this.inventories = [];
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_s3_BucketProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, Bucket);
            }
            throw error;
        }
        this.notificationsHandlerRole = props.notificationsHandlerRole;
        const { bucketEncryption, encryptionKey } = this.parseEncryption(props);
        Bucket.validateBucketName(this.physicalName);
        const websiteConfiguration = this.renderWebsiteConfiguration(props);
        this.isWebsite = (websiteConfiguration !== undefined);
        const objectLockConfiguration = this.parseObjectLockConfig(props);
        const resource = new s3_generated_1.CfnBucket(this, 'Resource', {
            bucketName: this.physicalName,
            bucketEncryption,
            versioningConfiguration: props.versioned ? { status: 'Enabled' } : undefined,
            lifecycleConfiguration: core_1.Lazy.any({ produce: () => this.parseLifecycleConfiguration() }),
            websiteConfiguration,
            publicAccessBlockConfiguration: props.blockPublicAccess,
            metricsConfigurations: core_1.Lazy.any({ produce: () => this.parseMetricConfiguration() }),
            corsConfiguration: core_1.Lazy.any({ produce: () => this.parseCorsConfiguration() }),
            accessControl: core_1.Lazy.string({ produce: () => this.accessControl }),
            loggingConfiguration: this.parseServerAccessLogs(props),
            inventoryConfigurations: core_1.Lazy.any({ produce: () => this.parseInventoryConfiguration() }),
            ownershipControls: this.parseOwnershipControls(props),
            accelerateConfiguration: props.transferAcceleration ? { accelerationStatus: 'Enabled' } : undefined,
            intelligentTieringConfigurations: this.parseTieringConfig(props),
            objectLockEnabled: objectLockConfiguration ? true : props.objectLockEnabled,
            objectLockConfiguration: objectLockConfiguration,
        });
        this._resource = resource;
        resource.applyRemovalPolicy(props.removalPolicy);
        this.encryptionKey = encryptionKey;
        this.eventBridgeEnabled = props.eventBridgeEnabled;
        this.bucketName = this.getResourceNameAttribute(resource.ref);
        this.bucketArn = this.getResourceArnAttribute(resource.attrArn, {
            region: '',
            account: '',
            service: 's3',
            resource: this.physicalName,
        });
        this.bucketDomainName = resource.attrDomainName;
        this.bucketWebsiteUrl = resource.attrWebsiteUrl;
        this.bucketWebsiteDomainName = core_1.Fn.select(2, core_1.Fn.split('/', this.bucketWebsiteUrl));
        this.bucketDualStackDomainName = resource.attrDualStackDomainName;
        this.bucketRegionalDomainName = resource.attrRegionalDomainName;
        this.disallowPublicAccess = props.blockPublicAccess && props.blockPublicAccess.blockPublicPolicy;
        this.accessControl = props.accessControl;
        // Enforce AWS Foundational Security Best Practice
        if (props.enforceSSL) {
            this.enforceSSLStatement();
        }
        if (props.serverAccessLogsBucket instanceof Bucket) {
            props.serverAccessLogsBucket.allowLogDelivery(this, props.serverAccessLogsPrefix);
            // It is possible that `serverAccessLogsBucket` was specified but is some other `IBucket`
            // that cannot have the ACLs or bucket policy applied. In that scenario, we should only
            // setup log delivery permissions to `this` if a bucket was not specified at all, as documented.
            // For example, we should not allow log delivery to `this` if given an imported bucket or
            // another situation that causes `instanceof` to fail
        }
        else if (!props.serverAccessLogsBucket && props.serverAccessLogsPrefix) {
            this.allowLogDelivery(this, props.serverAccessLogsPrefix);
        }
        else if (props.serverAccessLogsBucket) {
            // A `serverAccessLogsBucket` was provided but it is not a concrete `Bucket` and it
            // may not be possible to configure the ACLs or bucket policy as required.
            core_1.Annotations.of(this).addWarning(`Unable to add necessary logging permissions to imported target bucket: ${props.serverAccessLogsBucket}`);
        }
        for (const inventory of props.inventories ?? []) {
            this.addInventory(inventory);
        }
        // Add all bucket metric configurations rules
        (props.metrics || []).forEach(this.addMetric.bind(this));
        // Add all cors configuration rules
        (props.cors || []).forEach(this.addCorsRule.bind(this));
        // Add all lifecycle rules
        (props.lifecycleRules || []).forEach(this.addLifecycleRule.bind(this));
        if (props.publicReadAccess) {
            this.grantPublicAccess();
        }
        if (props.autoDeleteObjects) {
            if (props.removalPolicy !== core_1.RemovalPolicy.DESTROY) {
                throw new Error('Cannot use \'autoDeleteObjects\' property on a bucket without setting removal policy to \'DESTROY\'.');
            }
            this.enableAutoDeleteObjects();
        }
        if (this.eventBridgeEnabled) {
            this.enableEventBridgeNotification();
        }
    }
    /**
     * Add a lifecycle rule to the bucket
     *
     * @param rule The rule to add
     */
    addLifecycleRule(rule) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_s3_LifecycleRule(rule);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addLifecycleRule);
            }
            throw error;
        }
        this.lifecycleRules.push(rule);
    }
    /**
     * Adds a metrics configuration for the CloudWatch request metrics from the bucket.
     *
     * @param metric The metric configuration to add
     */
    addMetric(metric) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_s3_BucketMetrics(metric);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addMetric);
            }
            throw error;
        }
        this.metrics.push(metric);
    }
    /**
     * Adds a cross-origin access configuration for objects in an Amazon S3 bucket
     *
     * @param rule The CORS configuration rule to add
     */
    addCorsRule(rule) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_s3_CorsRule(rule);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addCorsRule);
            }
            throw error;
        }
        this.cors.push(rule);
    }
    /**
     * Add an inventory configuration.
     *
     * @param inventory configuration to add
     */
    addInventory(inventory) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_s3_Inventory(inventory);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addInventory);
            }
            throw error;
        }
        this.inventories.push(inventory);
    }
    /**
     * Adds an iam statement to enforce SSL requests only.
     */
    enforceSSLStatement() {
        const statement = new iam.PolicyStatement({
            actions: ['s3:*'],
            conditions: {
                Bool: { 'aws:SecureTransport': 'false' },
            },
            effect: iam.Effect.DENY,
            resources: [
                this.bucketArn,
                this.arnForObjects('*'),
            ],
            principals: [new iam.AnyPrincipal()],
        });
        this.addToResourcePolicy(statement);
    }
    /**
     * Set up key properties and return the Bucket encryption property from the
     * user's configuration.
     */
    parseEncryption(props) {
        // default based on whether encryptionKey is specified
        let encryptionType = props.encryption;
        if (encryptionType === undefined) {
            encryptionType = props.encryptionKey ? BucketEncryption.KMS : BucketEncryption.UNENCRYPTED;
        }
        // if encryption key is set, encryption must be set to KMS.
        if (encryptionType !== BucketEncryption.KMS && props.encryptionKey) {
            throw new Error(`encryptionKey is specified, so 'encryption' must be set to KMS (value: ${encryptionType})`);
        }
        // if bucketKeyEnabled is set, encryption must be set to KMS.
        if (props.bucketKeyEnabled && ![BucketEncryption.KMS, BucketEncryption.KMS_MANAGED].includes(encryptionType)) {
            throw new Error(`bucketKeyEnabled is specified, so 'encryption' must be set to KMS (value: ${encryptionType})`);
        }
        if (encryptionType === BucketEncryption.UNENCRYPTED) {
            return { bucketEncryption: undefined, encryptionKey: undefined };
        }
        if (encryptionType === BucketEncryption.KMS) {
            const encryptionKey = props.encryptionKey || new kms.Key(this, 'Key', {
                description: `Created by ${this.node.path}`,
            });
            const bucketEncryption = {
                serverSideEncryptionConfiguration: [
                    {
                        bucketKeyEnabled: props.bucketKeyEnabled,
                        serverSideEncryptionByDefault: {
                            sseAlgorithm: 'aws:kms',
                            kmsMasterKeyId: encryptionKey.keyArn,
                        },
                    },
                ],
            };
            return { encryptionKey, bucketEncryption };
        }
        if (encryptionType === BucketEncryption.S3_MANAGED) {
            const bucketEncryption = {
                serverSideEncryptionConfiguration: [
                    { serverSideEncryptionByDefault: { sseAlgorithm: 'AES256' } },
                ],
            };
            return { bucketEncryption };
        }
        if (encryptionType === BucketEncryption.KMS_MANAGED) {
            const bucketEncryption = {
                serverSideEncryptionConfiguration: [
                    {
                        bucketKeyEnabled: props.bucketKeyEnabled,
                        serverSideEncryptionByDefault: { sseAlgorithm: 'aws:kms' },
                    },
                ],
            };
            return { bucketEncryption };
        }
        throw new Error(`Unexpected 'encryptionType': ${encryptionType}`);
    }
    /**
     * Parse the lifecycle configuration out of the bucket props
     * @param props Par
     */
    parseLifecycleConfiguration() {
        if (!this.lifecycleRules || this.lifecycleRules.length === 0) {
            return undefined;
        }
        const self = this;
        return { rules: this.lifecycleRules.map(parseLifecycleRule) };
        function parseLifecycleRule(rule) {
            const enabled = rule.enabled ?? true;
            const x = {
                // eslint-disable-next-line max-len
                abortIncompleteMultipartUpload: rule.abortIncompleteMultipartUploadAfter !== undefined ? { daysAfterInitiation: rule.abortIncompleteMultipartUploadAfter.toDays() } : undefined,
                expirationDate: rule.expirationDate,
                expirationInDays: rule.expiration?.toDays(),
                id: rule.id,
                noncurrentVersionExpiration: rule.noncurrentVersionExpiration && {
                    noncurrentDays: rule.noncurrentVersionExpiration.toDays(),
                    newerNoncurrentVersions: rule.noncurrentVersionsToRetain,
                },
                noncurrentVersionTransitions: mapOrUndefined(rule.noncurrentVersionTransitions, t => ({
                    storageClass: t.storageClass.value,
                    transitionInDays: t.transitionAfter.toDays(),
                    newerNoncurrentVersions: t.noncurrentVersionsToRetain,
                })),
                prefix: rule.prefix,
                status: enabled ? 'Enabled' : 'Disabled',
                transitions: mapOrUndefined(rule.transitions, t => ({
                    storageClass: t.storageClass.value,
                    transitionDate: t.transitionDate,
                    transitionInDays: t.transitionAfter && t.transitionAfter.toDays(),
                })),
                expiredObjectDeleteMarker: rule.expiredObjectDeleteMarker,
                tagFilters: self.parseTagFilters(rule.tagFilters),
                objectSizeLessThan: rule.objectSizeLessThan,
                objectSizeGreaterThan: rule.objectSizeGreaterThan,
            };
            return x;
        }
    }
    parseServerAccessLogs(props) {
        if (!props.serverAccessLogsBucket && !props.serverAccessLogsPrefix) {
            return undefined;
        }
        if (
        // KMS can't be used for logging since the logging service can't use the key - logs don't write
        // KMS_MANAGED can't be used for logging since the account can't access the logging service key - account can't read logs
        (!props.serverAccessLogsBucket && (props.encryptionKey ||
            props.encryption === BucketEncryption.KMS_MANAGED ||
            props.encryption === BucketEncryption.KMS)) ||
            // Another bucket is being used that is configured for default SSE-KMS
            props.serverAccessLogsBucket?.encryptionKey) {
            throw new Error('SSE-S3 is the only supported default bucket encryption for Server Access Logging target buckets');
        }
        return {
            destinationBucketName: props.serverAccessLogsBucket?.bucketName,
            logFilePrefix: props.serverAccessLogsPrefix,
        };
    }
    parseMetricConfiguration() {
        if (!this.metrics || this.metrics.length === 0) {
            return undefined;
        }
        const self = this;
        return this.metrics.map(parseMetric);
        function parseMetric(metric) {
            return {
                id: metric.id,
                prefix: metric.prefix,
                tagFilters: self.parseTagFilters(metric.tagFilters),
            };
        }
    }
    parseCorsConfiguration() {
        if (!this.cors || this.cors.length === 0) {
            return undefined;
        }
        return { corsRules: this.cors.map(parseCors) };
        function parseCors(rule) {
            return {
                id: rule.id,
                maxAge: rule.maxAge,
                allowedHeaders: rule.allowedHeaders,
                allowedMethods: rule.allowedMethods,
                allowedOrigins: rule.allowedOrigins,
                exposedHeaders: rule.exposedHeaders,
            };
        }
    }
    parseTagFilters(tagFilters) {
        if (!tagFilters || tagFilters.length === 0) {
            return undefined;
        }
        return Object.keys(tagFilters).map(tag => ({
            key: tag,
            value: tagFilters[tag],
        }));
    }
    parseOwnershipControls({ objectOwnership }) {
        if (!objectOwnership) {
            return undefined;
        }
        return {
            rules: [{
                    objectOwnership,
                }],
        };
    }
    parseTieringConfig({ intelligentTieringConfigurations }) {
        if (!intelligentTieringConfigurations) {
            return undefined;
        }
        return intelligentTieringConfigurations.map(config => {
            const tierings = [];
            if (config.archiveAccessTierTime) {
                tierings.push({
                    accessTier: 'ARCHIVE_ACCESS',
                    days: config.archiveAccessTierTime.toDays({ integral: true }),
                });
            }
            if (config.deepArchiveAccessTierTime) {
                tierings.push({
                    accessTier: 'DEEP_ARCHIVE_ACCESS',
                    days: config.deepArchiveAccessTierTime.toDays({ integral: true }),
                });
            }
            return {
                id: config.name,
                prefix: config.prefix,
                status: 'Enabled',
                tagFilters: config.tags,
                tierings: tierings,
            };
        });
    }
    parseObjectLockConfig(props) {
        const { objectLockEnabled, objectLockDefaultRetention } = props;
        if (!objectLockDefaultRetention) {
            return undefined;
        }
        if (objectLockEnabled === false && objectLockDefaultRetention) {
            throw new Error('Object Lock must be enabled to configure default retention settings');
        }
        return {
            objectLockEnabled: 'Enabled',
            rule: {
                defaultRetention: {
                    days: objectLockDefaultRetention.duration.toDays(),
                    mode: objectLockDefaultRetention.mode,
                },
            },
        };
    }
    renderWebsiteConfiguration(props) {
        if (!props.websiteErrorDocument && !props.websiteIndexDocument && !props.websiteRedirect && !props.websiteRoutingRules) {
            return undefined;
        }
        if (props.websiteErrorDocument && !props.websiteIndexDocument) {
            throw new Error('"websiteIndexDocument" is required if "websiteErrorDocument" is set');
        }
        if (props.websiteRedirect && (props.websiteErrorDocument || props.websiteIndexDocument || props.websiteRoutingRules)) {
            throw new Error('"websiteIndexDocument", "websiteErrorDocument" and, "websiteRoutingRules" cannot be set if "websiteRedirect" is used');
        }
        const routingRules = props.websiteRoutingRules ? props.websiteRoutingRules.map((rule) => {
            if (rule.condition && !rule.condition.httpErrorCodeReturnedEquals && !rule.condition.keyPrefixEquals) {
                throw new Error('The condition property cannot be an empty object');
            }
            return {
                redirectRule: {
                    hostName: rule.hostName,
                    httpRedirectCode: rule.httpRedirectCode,
                    protocol: rule.protocol,
                    replaceKeyWith: rule.replaceKey && rule.replaceKey.withKey,
                    replaceKeyPrefixWith: rule.replaceKey && rule.replaceKey.prefixWithKey,
                },
                routingRuleCondition: rule.condition,
            };
        }) : undefined;
        return {
            indexDocument: props.websiteIndexDocument,
            errorDocument: props.websiteErrorDocument,
            redirectAllRequestsTo: props.websiteRedirect,
            routingRules,
        };
    }
    /**
     * Allows Log Delivery to the S3 bucket, using a Bucket Policy if the relevant feature
     * flag is enabled, otherwise the canned ACL is used.
     *
     * If log delivery is to be allowed using the ACL and an ACL has already been set, this fails.
     *
     * @see
     * https://docs.aws.amazon.com/AmazonS3/latest/userguide/enable-server-access-logging.html
     */
    allowLogDelivery(from, prefix) {
        if (core_1.FeatureFlags.of(this).isEnabled(cxapi.S3_SERVER_ACCESS_LOGS_USE_BUCKET_POLICY)) {
            let conditions = undefined;
            // The conditions for the bucket policy can be applied only when the buckets are in
            // the same stack and a concrete bucket instance (not imported). Otherwise, the
            // necessary imports may result in a cyclic dependency between the stacks.
            if (from instanceof Bucket && core_1.Stack.of(this) === core_1.Stack.of(from)) {
                conditions = {
                    ArnLike: {
                        'aws:SourceArn': from.bucketArn,
                    },
                    StringEquals: {
                        'aws:SourceAccount': from.env.account,
                    },
                };
            }
            this.addToResourcePolicy(new iam.PolicyStatement({
                effect: iam.Effect.ALLOW,
                principals: [new iam.ServicePrincipal('logging.s3.amazonaws.com')],
                actions: ['s3:PutObject'],
                resources: [this.arnForObjects(prefix ? `${prefix}*` : '*')],
                conditions: conditions,
            }));
        }
        else if (this.accessControl && this.accessControl !== BucketAccessControl.LOG_DELIVERY_WRITE) {
            throw new Error("Cannot enable log delivery to this bucket because the bucket's ACL has been set and can't be changed");
        }
        else {
            this.accessControl = BucketAccessControl.LOG_DELIVERY_WRITE;
        }
    }
    parseInventoryConfiguration() {
        if (!this.inventories || this.inventories.length === 0) {
            return undefined;
        }
        return this.inventories.map((inventory, index) => {
            const format = inventory.format ?? InventoryFormat.CSV;
            const frequency = inventory.frequency ?? InventoryFrequency.WEEKLY;
            const id = inventory.inventoryId ?? `${this.node.id}Inventory${index}`;
            if (inventory.destination.bucket instanceof Bucket) {
                inventory.destination.bucket.addToResourcePolicy(new iam.PolicyStatement({
                    effect: iam.Effect.ALLOW,
                    actions: ['s3:PutObject'],
                    resources: [
                        inventory.destination.bucket.bucketArn,
                        inventory.destination.bucket.arnForObjects(`${inventory.destination.prefix ?? ''}*`),
                    ],
                    principals: [new iam.ServicePrincipal('s3.amazonaws.com')],
                    conditions: {
                        ArnLike: {
                            'aws:SourceArn': this.bucketArn,
                        },
                    },
                }));
            }
            return {
                id,
                destination: {
                    bucketArn: inventory.destination.bucket.bucketArn,
                    bucketAccountId: inventory.destination.bucketOwner,
                    prefix: inventory.destination.prefix,
                    format,
                },
                enabled: inventory.enabled ?? true,
                includedObjectVersions: inventory.includeObjectVersions ?? InventoryObjectVersion.ALL,
                scheduleFrequency: frequency,
                optionalFields: inventory.optionalFields,
                prefix: inventory.objectsPrefix,
            };
        });
    }
    enableAutoDeleteObjects() {
        const provider = core_1.CustomResourceProvider.getOrCreateProvider(this, AUTO_DELETE_OBJECTS_RESOURCE_TYPE, {
            codeDirectory: path.join(__dirname, 'auto-delete-objects-handler'),
            runtime: core_1.CustomResourceProviderRuntime.NODEJS_14_X,
            description: `Lambda function for auto-deleting objects in ${this.bucketName} S3 bucket.`,
        });
        // Use a bucket policy to allow the custom resource to delete
        // objects in the bucket
        this.addToResourcePolicy(new iam.PolicyStatement({
            actions: [
                // list objects
                ...perms.BUCKET_READ_METADATA_ACTIONS,
                ...perms.BUCKET_DELETE_ACTIONS, // and then delete them
            ],
            resources: [
                this.bucketArn,
                this.arnForObjects('*'),
            ],
            principals: [new iam.ArnPrincipal(provider.roleArn)],
        }));
        const customResource = new core_1.CustomResource(this, 'AutoDeleteObjectsCustomResource', {
            resourceType: AUTO_DELETE_OBJECTS_RESOURCE_TYPE,
            serviceToken: provider.serviceToken,
            properties: {
                BucketName: this.bucketName,
            },
        });
        // Ensure bucket policy is deleted AFTER the custom resource otherwise
        // we don't have permissions to list and delete in the bucket.
        // (add a `if` to make TS happy)
        if (this.policy) {
            customResource.node.addDependency(this.policy);
        }
        // We also tag the bucket to record the fact that we want it autodeleted.
        // The custom resource will check this tag before actually doing the delete.
        // Because tagging and untagging will ALWAYS happen before the CR is deleted,
        // we can set `autoDeleteObjects: false` without the removal of the CR emptying
        // the bucket as a side effect.
        core_1.Tags.of(this._resource).add(AUTO_DELETE_OBJECTS_TAG, 'true');
    }
}
_c = JSII_RTTI_SYMBOL_1;
Bucket[_c] = { fqn: "@aws-cdk/aws-s3.Bucket", version: "0.0.0" };
exports.Bucket = Bucket;
/**
 * What kind of server-side encryption to apply to this bucket
 */
var BucketEncryption;
(function (BucketEncryption) {
    /**
     * Objects in the bucket are not encrypted.
     */
    BucketEncryption["UNENCRYPTED"] = "UNENCRYPTED";
    /**
     * Server-side KMS encryption with a master key managed by KMS.
     */
    BucketEncryption["KMS_MANAGED"] = "KMS_MANAGED";
    /**
     * Server-side encryption with a master key managed by S3.
     */
    BucketEncryption["S3_MANAGED"] = "S3_MANAGED";
    /**
     * Server-side encryption with a KMS key managed by the user.
     * If `encryptionKey` is specified, this key will be used, otherwise, one will be defined.
     */
    BucketEncryption["KMS"] = "KMS";
})(BucketEncryption = exports.BucketEncryption || (exports.BucketEncryption = {}));
/**
 * Notification event types.
 * @link https://docs.aws.amazon.com/AmazonS3/latest/userguide/notification-how-to-event-types-and-destinations.html#supported-notification-event-types
 */
var EventType;
(function (EventType) {
    /**
     * Amazon S3 APIs such as PUT, POST, and COPY can create an object. Using
     * these event types, you can enable notification when an object is created
     * using a specific API, or you can use the s3:ObjectCreated:* event type to
     * request notification regardless of the API that was used to create an
     * object.
     */
    EventType["OBJECT_CREATED"] = "s3:ObjectCreated:*";
    /**
     * Amazon S3 APIs such as PUT, POST, and COPY can create an object. Using
     * these event types, you can enable notification when an object is created
     * using a specific API, or you can use the s3:ObjectCreated:* event type to
     * request notification regardless of the API that was used to create an
     * object.
     */
    EventType["OBJECT_CREATED_PUT"] = "s3:ObjectCreated:Put";
    /**
     * Amazon S3 APIs such as PUT, POST, and COPY can create an object. Using
     * these event types, you can enable notification when an object is created
     * using a specific API, or you can use the s3:ObjectCreated:* event type to
     * request notification regardless of the API that was used to create an
     * object.
     */
    EventType["OBJECT_CREATED_POST"] = "s3:ObjectCreated:Post";
    /**
     * Amazon S3 APIs such as PUT, POST, and COPY can create an object. Using
     * these event types, you can enable notification when an object is created
     * using a specific API, or you can use the s3:ObjectCreated:* event type to
     * request notification regardless of the API that was used to create an
     * object.
     */
    EventType["OBJECT_CREATED_COPY"] = "s3:ObjectCreated:Copy";
    /**
     * Amazon S3 APIs such as PUT, POST, and COPY can create an object. Using
     * these event types, you can enable notification when an object is created
     * using a specific API, or you can use the s3:ObjectCreated:* event type to
     * request notification regardless of the API that was used to create an
     * object.
     */
    EventType["OBJECT_CREATED_COMPLETE_MULTIPART_UPLOAD"] = "s3:ObjectCreated:CompleteMultipartUpload";
    /**
     * By using the ObjectRemoved event types, you can enable notification when
     * an object or a batch of objects is removed from a bucket.
     *
     * You can request notification when an object is deleted or a versioned
     * object is permanently deleted by using the s3:ObjectRemoved:Delete event
     * type. Or you can request notification when a delete marker is created for
     * a versioned object by using s3:ObjectRemoved:DeleteMarkerCreated. For
     * information about deleting versioned objects, see Deleting Object
     * Versions. You can also use a wildcard s3:ObjectRemoved:* to request
     * notification anytime an object is deleted.
     *
     * You will not receive event notifications from automatic deletes from
     * lifecycle policies or from failed operations.
     */
    EventType["OBJECT_REMOVED"] = "s3:ObjectRemoved:*";
    /**
     * By using the ObjectRemoved event types, you can enable notification when
     * an object or a batch of objects is removed from a bucket.
     *
     * You can request notification when an object is deleted or a versioned
     * object is permanently deleted by using the s3:ObjectRemoved:Delete event
     * type. Or you can request notification when a delete marker is created for
     * a versioned object by using s3:ObjectRemoved:DeleteMarkerCreated. For
     * information about deleting versioned objects, see Deleting Object
     * Versions. You can also use a wildcard s3:ObjectRemoved:* to request
     * notification anytime an object is deleted.
     *
     * You will not receive event notifications from automatic deletes from
     * lifecycle policies or from failed operations.
     */
    EventType["OBJECT_REMOVED_DELETE"] = "s3:ObjectRemoved:Delete";
    /**
     * By using the ObjectRemoved event types, you can enable notification when
     * an object or a batch of objects is removed from a bucket.
     *
     * You can request notification when an object is deleted or a versioned
     * object is permanently deleted by using the s3:ObjectRemoved:Delete event
     * type. Or you can request notification when a delete marker is created for
     * a versioned object by using s3:ObjectRemoved:DeleteMarkerCreated. For
     * information about deleting versioned objects, see Deleting Object
     * Versions. You can also use a wildcard s3:ObjectRemoved:* to request
     * notification anytime an object is deleted.
     *
     * You will not receive event notifications from automatic deletes from
     * lifecycle policies or from failed operations.
     */
    EventType["OBJECT_REMOVED_DELETE_MARKER_CREATED"] = "s3:ObjectRemoved:DeleteMarkerCreated";
    /**
     * Using restore object event types you can receive notifications for
     * initiation and completion when restoring objects from the S3 Glacier
     * storage class.
     *
     * You use s3:ObjectRestore:Post to request notification of object restoration
     * initiation.
     */
    EventType["OBJECT_RESTORE_POST"] = "s3:ObjectRestore:Post";
    /**
     * Using restore object event types you can receive notifications for
     * initiation and completion when restoring objects from the S3 Glacier
     * storage class.
     *
     * You use s3:ObjectRestore:Completed to request notification of
     * restoration completion.
     */
    EventType["OBJECT_RESTORE_COMPLETED"] = "s3:ObjectRestore:Completed";
    /**
     * Using restore object event types you can receive notifications for
     * initiation and completion when restoring objects from the S3 Glacier
     * storage class.
     *
     * You use s3:ObjectRestore:Delete to request notification of
     * restoration completion.
     */
    EventType["OBJECT_RESTORE_DELETE"] = "s3:ObjectRestore:Delete";
    /**
     * You can use this event type to request Amazon S3 to send a notification
     * message when Amazon S3 detects that an object of the RRS storage class is
     * lost.
     */
    EventType["REDUCED_REDUNDANCY_LOST_OBJECT"] = "s3:ReducedRedundancyLostObject";
    /**
     * You receive this notification event when an object that was eligible for
     * replication using Amazon S3 Replication Time Control failed to replicate.
     */
    EventType["REPLICATION_OPERATION_FAILED_REPLICATION"] = "s3:Replication:OperationFailedReplication";
    /**
     * You receive this notification event when an object that was eligible for
     * replication using Amazon S3 Replication Time Control exceeded the 15-minute
     * threshold for replication.
     */
    EventType["REPLICATION_OPERATION_MISSED_THRESHOLD"] = "s3:Replication:OperationMissedThreshold";
    /**
     * You receive this notification event for an object that was eligible for
     * replication using the Amazon S3 Replication Time Control feature replicated
     * after the 15-minute threshold.
     */
    EventType["REPLICATION_OPERATION_REPLICATED_AFTER_THRESHOLD"] = "s3:Replication:OperationReplicatedAfterThreshold";
    /**
     * You receive this notification event for an object that was eligible for
     * replication using Amazon S3 Replication Time Control but is no longer tracked
     * by replication metrics.
     */
    EventType["REPLICATION_OPERATION_NOT_TRACKED"] = "s3:Replication:OperationNotTracked";
    /**
     * By using the LifecycleExpiration event types, you can receive a notification
     * when Amazon S3 deletes an object based on your S3 Lifecycle configuration.
     */
    EventType["LIFECYCLE_EXPIRATION"] = "s3:LifecycleExpiration:*";
    /**
     * The s3:LifecycleExpiration:Delete event type notifies you when an object
     * in an unversioned bucket is deleted.
     * It also notifies you when an object version is permanently deleted by an
     * S3 Lifecycle configuration.
     */
    EventType["LIFECYCLE_EXPIRATION_DELETE"] = "s3:LifecycleExpiration:Delete";
    /**
     * The s3:LifecycleExpiration:DeleteMarkerCreated event type notifies you
     * when S3 Lifecycle creates a delete marker when a current version of an
     * object in versioned bucket is deleted.
     */
    EventType["LIFECYCLE_EXPIRATION_DELETE_MARKER_CREATED"] = "s3:LifecycleExpiration:DeleteMarkerCreated";
    /**
     * You receive this notification event when an object is transitioned to
     * another Amazon S3 storage class by an S3 Lifecycle configuration.
     */
    EventType["LIFECYCLE_TRANSITION"] = "s3:LifecycleTransition";
    /**
     * You receive this notification event when an object within the
     * S3 Intelligent-Tiering storage class moved to the Archive Access tier or
     * Deep Archive Access tier.
     */
    EventType["INTELLIGENT_TIERING"] = "s3:IntelligentTiering";
    /**
     * By using the ObjectTagging event types, you can enable notification when
     * an object tag is added or deleted from an object.
     */
    EventType["OBJECT_TAGGING"] = "s3:ObjectTagging:*";
    /**
     * The s3:ObjectTagging:Put event type notifies you when a tag is PUT on an
     * object or an existing tag is updated.
  
     */
    EventType["OBJECT_TAGGING_PUT"] = "s3:ObjectTagging:Put";
    /**
     * The s3:ObjectTagging:Delete event type notifies you when a tag is removed
     * from an object.
     */
    EventType["OBJECT_TAGGING_DELETE"] = "s3:ObjectTagging:Delete";
    /**
     * You receive this notification event when an ACL is PUT on an object or when
     * an existing ACL is changed.
     * An event is not generated when a request results in no change to an
     * object’s ACL.
     */
    EventType["OBJECT_ACL_PUT"] = "s3:ObjectAcl:Put";
})(EventType = exports.EventType || (exports.EventType = {}));
/**
 * Default bucket access control types.
 *
 * @see https://docs.aws.amazon.com/AmazonS3/latest/dev/acl-overview.html
 */
var BucketAccessControl;
(function (BucketAccessControl) {
    /**
     * Owner gets FULL_CONTROL. No one else has access rights.
     */
    BucketAccessControl["PRIVATE"] = "Private";
    /**
     * Owner gets FULL_CONTROL. The AllUsers group gets READ access.
     */
    BucketAccessControl["PUBLIC_READ"] = "PublicRead";
    /**
     * Owner gets FULL_CONTROL. The AllUsers group gets READ and WRITE access.
     * Granting this on a bucket is generally not recommended.
     */
    BucketAccessControl["PUBLIC_READ_WRITE"] = "PublicReadWrite";
    /**
     * Owner gets FULL_CONTROL. The AuthenticatedUsers group gets READ access.
     */
    BucketAccessControl["AUTHENTICATED_READ"] = "AuthenticatedRead";
    /**
     * The LogDelivery group gets WRITE and READ_ACP permissions on the bucket.
     * @see https://docs.aws.amazon.com/AmazonS3/latest/dev/ServerLogs.html
     */
    BucketAccessControl["LOG_DELIVERY_WRITE"] = "LogDeliveryWrite";
    /**
     * Object owner gets FULL_CONTROL. Bucket owner gets READ access.
     * If you specify this canned ACL when creating a bucket, Amazon S3 ignores it.
     */
    BucketAccessControl["BUCKET_OWNER_READ"] = "BucketOwnerRead";
    /**
     * Both the object owner and the bucket owner get FULL_CONTROL over the object.
     * If you specify this canned ACL when creating a bucket, Amazon S3 ignores it.
     */
    BucketAccessControl["BUCKET_OWNER_FULL_CONTROL"] = "BucketOwnerFullControl";
    /**
     * Owner gets FULL_CONTROL. Amazon EC2 gets READ access to GET an Amazon Machine Image (AMI) bundle from Amazon S3.
     */
    BucketAccessControl["AWS_EXEC_READ"] = "AwsExecRead";
})(BucketAccessControl = exports.BucketAccessControl || (exports.BucketAccessControl = {}));
class ReplaceKey {
    /**
     * The specific object key to use in the redirect request
     */
    static with(keyReplacement) {
        return new this(keyReplacement);
    }
    /**
     * The object key prefix to use in the redirect request
     */
    static prefixWith(keyReplacement) {
        return new this(undefined, keyReplacement);
    }
    constructor(withKey, prefixWithKey) {
        this.withKey = withKey;
        this.prefixWithKey = prefixWithKey;
    }
}
_d = JSII_RTTI_SYMBOL_1;
ReplaceKey[_d] = { fqn: "@aws-cdk/aws-s3.ReplaceKey", version: "0.0.0" };
exports.ReplaceKey = ReplaceKey;
/**
 * Modes in which S3 Object Lock retention can be configured.
 *
 * @see https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lock-overview.html#object-lock-retention-modes
 */
var ObjectLockMode;
(function (ObjectLockMode) {
    /**
     * The Governance retention mode.
     *
     * With governance mode, you protect objects against being deleted by most users, but you can
     * still grant some users permission to alter the retention settings or delete the object if
     * necessary. You can also use governance mode to test retention-period settings before
     * creating a compliance-mode retention period.
     */
    ObjectLockMode["GOVERNANCE"] = "GOVERNANCE";
    /**
     * The Compliance retention mode.
     *
     * When an object is locked in compliance mode, its retention mode can't be changed, and
     * its retention period can't be shortened. Compliance mode helps ensure that an object
     * version can't be overwritten or deleted for the duration of the retention period.
     */
    ObjectLockMode["COMPLIANCE"] = "COMPLIANCE";
})(ObjectLockMode = exports.ObjectLockMode || (exports.ObjectLockMode = {}));
/**
 * The default retention settings for an S3 Object Lock configuration.
 *
 * @see https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lock-overview.html
 */
class ObjectLockRetention {
    /**
     * Configure for Governance retention for a specified duration.
     *
     * With governance mode, you protect objects against being deleted by most users, but you can
     * still grant some users permission to alter the retention settings or delete the object if
     * necessary. You can also use governance mode to test retention-period settings before
     * creating a compliance-mode retention period.
     *
     * @param duration the length of time for which objects should retained
     * @returns the ObjectLockRetention configuration
     */
    static governance(duration) {
        return new ObjectLockRetention(ObjectLockMode.GOVERNANCE, duration);
    }
    /**
     * Configure for Compliance retention for a specified duration.
     *
     * When an object is locked in compliance mode, its retention mode can't be changed, and
     * its retention period can't be shortened. Compliance mode helps ensure that an object
     * version can't be overwritten or deleted for the duration of the retention period.
     *
     * @param duration the length of time for which objects should be retained
     * @returns the ObjectLockRetention configuration
     */
    static compliance(duration) {
        return new ObjectLockRetention(ObjectLockMode.COMPLIANCE, duration);
    }
    constructor(mode, duration) {
        // https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lock-managing.html#object-lock-managing-retention-limits
        if (duration.toDays() > 365 * 100) {
            throw new Error('Object Lock retention duration must be less than 100 years');
        }
        if (duration.toDays() < 1) {
            throw new Error('Object Lock retention duration must be at least 1 day');
        }
        this.mode = mode;
        this.duration = duration;
    }
}
_e = JSII_RTTI_SYMBOL_1;
ObjectLockRetention[_e] = { fqn: "@aws-cdk/aws-s3.ObjectLockRetention", version: "0.0.0" };
exports.ObjectLockRetention = ObjectLockRetention;
function mapOrUndefined(list, callback) {
    if (!list || list.length === 0) {
        return undefined;
    }
    return list.map(callback);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVja2V0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYnVja2V0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLDJCQUF5QjtBQUN6Qiw2QkFBNkI7QUFDN0IsOENBQThDO0FBQzlDLHdDQUF3QztBQUN4Qyx3Q0FBd0M7QUFDeEMsd0NBaUJ1QjtBQUN2QiwyRUFBdUU7QUFDdkUseUNBQXlDO0FBQ3pDLDBEQUEwRDtBQUUxRCxtREFBK0M7QUFFL0MscUVBQStEO0FBQy9ELGlDQUFpQztBQUVqQyxpREFBMkM7QUFDM0MsaUNBQXlEO0FBRXpELE1BQU0saUNBQWlDLEdBQUcsNkJBQTZCLENBQUM7QUFDeEUsTUFBTSx1QkFBdUIsR0FBRyw2QkFBNkIsQ0FBQztBQStiOUQ7Ozs7Ozs7Ozs7Ozs7Ozs7R0FnQkc7QUFDSCxNQUFzQixVQUFXLFNBQVEsZUFBUTtJQTBDL0MsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxRQUF1QixFQUFFO1FBQ2pFLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXhCLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDLHlCQUF5QixFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQztLQUN0RztJQUVEOzs7Ozs7OztPQVFHO0lBQ0ksaUJBQWlCLENBQUMsRUFBVSxFQUFFLFVBQTBDLEVBQUU7Ozs7Ozs7Ozs7UUFDL0UsTUFBTSxJQUFJLEdBQUcsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxFQUFFLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDaEQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDL0IsSUFBSSxDQUFDLGVBQWUsQ0FBQztZQUNuQixNQUFNLEVBQUUsQ0FBQyxRQUFRLENBQUM7WUFDbEIs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QUMsY0FBYyxDQUFDLFVBQVUsRUFBRSxRQUFRLENBQUMsQ0FBQztLQUNyRTtJQUVEOzs7Ozs7Ozs7T0FTRztJQUNJLE1BQU0sQ0FBQyxVQUFVLENBQUMsUUFBa0I7UUFDekMsT0FBTyxJQUFJLG1CQUFtQixDQUFDLGNBQWMsQ0FBQyxVQUFVLEVBQUUsUUFBUSxDQUFDLENBQUM7S0FDckU7SUFjRCxZQUFvQixJQUFvQixFQUFFLFFBQWtCO1FBQzFELHdIQUF3SDtRQUN4SCxJQUFJLFFBQVEsQ0FBQyxNQUFNLEVBQUUsR0FBRyxHQUFHLEdBQUcsR0FBRyxFQUFFO1lBQ2pDLE1BQU0sSUFBSSxLQUFLLENBQUMsNERBQTRELENBQUMsQ0FBQztTQUMvRTtRQUNELElBQUksUUFBUSxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsRUFBRTtZQUN6QixNQUFNLElBQUksS0FBSyxDQUFDLHVEQUF1RCxDQUFDLENBQUM7U0FDMUU7UUFFRCxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztRQUNqQixJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztLQUMxQjs7OztBQXJEVSxrREFBbUI7QUFnRmhDLFNBQVMsY0FBYyxDQUFPLElBQXFCLEVBQUUsUUFBMkI7SUFDOUUsSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtRQUM5QixPQUFPLFNBQVMsQ0FBQztLQUNsQjtJQUVELE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUM1QixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRU9MIH0gZnJvbSAnb3MnO1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCAqIGFzIGV2ZW50cyBmcm9tICdAYXdzLWNkay9hd3MtZXZlbnRzJztcbmltcG9ydCAqIGFzIGlhbSBmcm9tICdAYXdzLWNkay9hd3MtaWFtJztcbmltcG9ydCAqIGFzIGttcyBmcm9tICdAYXdzLWNkay9hd3Mta21zJztcbmltcG9ydCB7XG4gIEN1c3RvbVJlc291cmNlLFxuICBDdXN0b21SZXNvdXJjZVByb3ZpZGVyLFxuICBDdXN0b21SZXNvdXJjZVByb3ZpZGVyUnVudGltZSxcbiAgRHVyYXRpb24sXG4gIEZlYXR1cmVGbGFncyxcbiAgRm4sXG4gIElSZXNvdXJjZSxcbiAgTGF6eSxcbiAgUmVtb3ZhbFBvbGljeSxcbiAgUmVzb3VyY2UsXG4gIFJlc291cmNlUHJvcHMsXG4gIFN0YWNrLFxuICBUYWdzLFxuICBUb2tlbixcbiAgVG9rZW5pemF0aW9uLFxuICBBbm5vdGF0aW9ucyxcbn0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBDZm5SZWZlcmVuY2UgfSBmcm9tICdAYXdzLWNkay9jb3JlL2xpYi9wcml2YXRlL2Nmbi1yZWZlcmVuY2UnO1xuaW1wb3J0ICogYXMgY3hhcGkgZnJvbSAnQGF3cy1jZGsvY3gtYXBpJztcbmltcG9ydCAqIGFzIHJlZ2lvbkluZm9ybWF0aW9uIGZyb20gJ0Bhd3MtY2RrL3JlZ2lvbi1pbmZvJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgQnVja2V0UG9saWN5IH0gZnJvbSAnLi9idWNrZXQtcG9saWN5JztcbmltcG9ydCB7IElCdWNrZXROb3RpZmljYXRpb25EZXN0aW5hdGlvbiB9IGZyb20gJy4vZGVzdGluYXRpb24nO1xuaW1wb3J0IHsgQnVja2V0Tm90aWZpY2F0aW9ucyB9IGZyb20gJy4vbm90aWZpY2F0aW9ucy1yZXNvdXJjZSc7XG5pbXBvcnQgKiBhcyBwZXJtcyBmcm9tICcuL3Blcm1zJztcbmltcG9ydCB7IExpZmVjeWNsZVJ1bGUgfSBmcm9tICcuL3J1bGUnO1xuaW1wb3J0IHsgQ2ZuQnVja2V0IH0gZnJvbSAnLi9zMy5nZW5lcmF0ZWQnO1xuaW1wb3J0IHsgcGFyc2VCdWNrZXRBcm4sIHBhcnNlQnVja2V0TmFtZSB9IGZyb20gJy4vdXRpbCc7XG5cbmNvbnN0IEFVVE9fREVMRVRFX09CSkVDVFNfUkVTT1VSQ0VfVFlQRSA9ICdDdXN0b206OlMzQXV0b0RlbGV0ZU9iamVjdHMnO1xuY29uc3QgQVVUT19ERUxFVEVfT0JKRUNUU19UQUcgPSAnYXdzLWNkazphdXRvLWRlbGV0ZS1vYmplY3RzJztcblxuZXhwb3J0IGludGVyZmFjZSBJQnVja2V0IGV4dGVuZHMgSVJlc291cmNlIHtcbiAgLyoqXG4gICAqIFRoZSBBUk4gb2YgdGhlIGJ1Y2tldC5cbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcmVhZG9ubHkgYnVja2V0QXJuOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBuYW1lIG9mIHRoZSBidWNrZXQuXG4gICAqIEBhdHRyaWJ1dGVcbiAgICovXG4gIHJlYWRvbmx5IGJ1Y2tldE5hbWU6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIFVSTCBvZiB0aGUgc3RhdGljIHdlYnNpdGUuXG4gICAqIEBhdHRyaWJ1dGVcbiAgICovXG4gIHJlYWRvbmx5IGJ1Y2tldFdlYnNpdGVVcmw6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIERvbWFpbiBuYW1lIG9mIHRoZSBzdGF0aWMgd2Vic2l0ZS5cbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcmVhZG9ubHkgYnVja2V0V2Vic2l0ZURvbWFpbk5hbWU6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIElQdjQgRE5TIG5hbWUgb2YgdGhlIHNwZWNpZmllZCBidWNrZXQuXG4gICAqIEBhdHRyaWJ1dGVcbiAgICovXG4gIHJlYWRvbmx5IGJ1Y2tldERvbWFpbk5hbWU6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIElQdjYgRE5TIG5hbWUgb2YgdGhlIHNwZWNpZmllZCBidWNrZXQuXG4gICAqIEBhdHRyaWJ1dGVcbiAgICovXG4gIHJlYWRvbmx5IGJ1Y2tldER1YWxTdGFja0RvbWFpbk5hbWU6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIHJlZ2lvbmFsIGRvbWFpbiBuYW1lIG9mIHRoZSBzcGVjaWZpZWQgYnVja2V0LlxuICAgKiBAYXR0cmlidXRlXG4gICAqL1xuICByZWFkb25seSBidWNrZXRSZWdpb25hbERvbWFpbk5hbWU6IHN0cmluZztcblxuICAvKipcbiAgICogSWYgdGhpcyBidWNrZXQgaGFzIGJlZW4gY29uZmlndXJlZCBmb3Igc3RhdGljIHdlYnNpdGUgaG9zdGluZy5cbiAgICovXG4gIHJlYWRvbmx5IGlzV2Vic2l0ZT86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIE9wdGlvbmFsIEtNUyBlbmNyeXB0aW9uIGtleSBhc3NvY2lhdGVkIHdpdGggdGhpcyBidWNrZXQuXG4gICAqL1xuICByZWFkb25seSBlbmNyeXB0aW9uS2V5Pzoga21zLklLZXk7XG5cbiAgLyoqXG4gICAqIFRoZSByZXNvdXJjZSBwb2xpY3kgYXNzb2NpYXRlZCB3aXRoIHRoaXMgYnVja2V0LlxuICAgKlxuICAgKiBJZiBgYXV0b0NyZWF0ZVBvbGljeWAgaXMgdHJ1ZSwgYSBgQnVja2V0UG9saWN5YCB3aWxsIGJlIGNyZWF0ZWQgdXBvbiB0aGVcbiAgICogZmlyc3QgY2FsbCB0byBhZGRUb1Jlc291cmNlUG9saWN5KHMpLlxuICAgKi9cbiAgcG9saWN5PzogQnVja2V0UG9saWN5O1xuXG4gIC8qKlxuICAgKiBBZGRzIGEgc3RhdGVtZW50IHRvIHRoZSByZXNvdXJjZSBwb2xpY3kgZm9yIGEgcHJpbmNpcGFsIChpLmUuXG4gICAqIGFjY291bnQvcm9sZS9zZXJ2aWNlKSB0byBwZXJmb3JtIGFjdGlvbnMgb24gdGhpcyBidWNrZXQgYW5kL29yIGl0c1xuICAgKiBjb250ZW50cy4gVXNlIGBidWNrZXRBcm5gIGFuZCBgYXJuRm9yT2JqZWN0cyhrZXlzKWAgdG8gb2J0YWluIEFSTnMgZm9yXG4gICAqIHRoaXMgYnVja2V0IG9yIG9iamVjdHMuXG4gICAqXG4gICAqIE5vdGUgdGhhdCB0aGUgcG9saWN5IHN0YXRlbWVudCBtYXkgb3IgbWF5IG5vdCBiZSBhZGRlZCB0byB0aGUgcG9saWN5LlxuICAgKiBGb3IgZXhhbXBsZSwgd2hlbiBhbiBgSUJ1Y2tldGAgaXMgY3JlYXRlZCBmcm9tIGFuIGV4aXN0aW5nIGJ1Y2tldCxcbiAgICogaXQncyBub3QgcG9zc2libGUgdG8gdGVsbCB3aGV0aGVyIHRoZSBidWNrZXQgYWxyZWFkeSBoYXMgYSBwb2xpY3lcbiAgICogYXR0YWNoZWQsIGxldCBhbG9uZSB0byByZS11c2UgdGhhdCBwb2xpY3kgdG8gYWRkIG1vcmUgc3RhdGVtZW50cyB0byBpdC5cbiAgICogU28gaXQncyBzYWZlc3QgdG8gZG8gbm90aGluZyBpbiB0aGVzZSBjYXNlcy5cbiAgICpcbiAgICogQHBhcmFtIHBlcm1pc3Npb24gdGhlIHBvbGljeSBzdGF0ZW1lbnQgdG8gYmUgYWRkZWQgdG8gdGhlIGJ1Y2tldCdzXG4gICAqIHBvbGljeS5cbiAgICogQHJldHVybnMgbWV0YWRhdGEgYWJvdXQgdGhlIGV4ZWN1dGlvbiBvZiB0aGlzIG1ldGhvZC4gSWYgdGhlIHBvbGljeVxuICAgKiB3YXMgbm90IGFkZGVkLCB0aGUgdmFsdWUgb2YgYHN0YXRlbWVudEFkZGVkYCB3aWxsIGJlIGBmYWxzZWAuIFlvdVxuICAgKiBzaG91bGQgYWx3YXlzIGNoZWNrIHRoaXMgdmFsdWUgdG8gbWFrZSBzdXJlIHRoYXQgdGhlIG9wZXJhdGlvbiB3YXNcbiAgICogYWN0dWFsbHkgY2FycmllZCBvdXQuIE90aGVyd2lzZSwgc3ludGhlc2lzIGFuZCBkZXBsb3kgd2lsbCB0ZXJtaW5hdGVcbiAgICogc2lsZW50bHksIHdoaWNoIG1heSBiZSBjb25mdXNpbmcuXG4gICAqL1xuICBhZGRUb1Jlc291cmNlUG9saWN5KHBlcm1pc3Npb246IGlhbS5Qb2xpY3lTdGF0ZW1lbnQpOiBpYW0uQWRkVG9SZXNvdXJjZVBvbGljeVJlc3VsdDtcblxuICAvKipcbiAgICogVGhlIGh0dHBzIFVSTCBvZiBhbiBTMyBvYmplY3QuIEZvciBleGFtcGxlOlxuICAgKlxuICAgKiAtIGBodHRwczovL3MzLnVzLXdlc3QtMS5hbWF6b25hd3MuY29tL29ubHlidWNrZXRgXG4gICAqIC0gYGh0dHBzOi8vczMudXMtd2VzdC0xLmFtYXpvbmF3cy5jb20vYnVja2V0L2tleWBcbiAgICogLSBgaHR0cHM6Ly9zMy5jbi1ub3J0aC0xLmFtYXpvbmF3cy5jb20uY24vY2hpbmEtYnVja2V0L215a2V5YFxuICAgKiBAcGFyYW0ga2V5IFRoZSBTMyBrZXkgb2YgdGhlIG9iamVjdC4gSWYgbm90IHNwZWNpZmllZCwgdGhlIFVSTCBvZiB0aGVcbiAgICogICAgICBidWNrZXQgaXMgcmV0dXJuZWQuXG4gICAqIEByZXR1cm5zIGFuIE9iamVjdFMzVXJsIHRva2VuXG4gICAqL1xuICB1cmxGb3JPYmplY3Qoa2V5Pzogc3RyaW5nKTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgaHR0cHMgVHJhbnNmZXIgQWNjZWxlcmF0aW9uIFVSTCBvZiBhbiBTMyBvYmplY3QuIFNwZWNpZnkgYGR1YWxTdGFjazogdHJ1ZWAgYXQgdGhlIG9wdGlvbnNcbiAgICogZm9yIGR1YWwtc3RhY2sgZW5kcG9pbnQgKGNvbm5lY3QgdG8gdGhlIGJ1Y2tldCBvdmVyIElQdjYpLiBGb3IgZXhhbXBsZTpcbiAgICpcbiAgICogLSBgaHR0cHM6Ly9idWNrZXQuczMtYWNjZWxlcmF0ZS5hbWF6b25hd3MuY29tYFxuICAgKiAtIGBodHRwczovL2J1Y2tldC5zMy1hY2NlbGVyYXRlLmFtYXpvbmF3cy5jb20va2V5YFxuICAgKlxuICAgKiBAcGFyYW0ga2V5IFRoZSBTMyBrZXkgb2YgdGhlIG9iamVjdC4gSWYgbm90IHNwZWNpZmllZCwgdGhlIFVSTCBvZiB0aGVcbiAgICogICAgICBidWNrZXQgaXMgcmV0dXJuZWQuXG4gICAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbnMgZm9yIGdlbmVyYXRpbmcgVVJMLlxuICAgKiBAcmV0dXJucyBhbiBUcmFuc2ZlckFjY2VsZXJhdGlvblVybCB0b2tlblxuICAgKi9cbiAgdHJhbnNmZXJBY2NlbGVyYXRpb25VcmxGb3JPYmplY3Qoa2V5Pzogc3RyaW5nLCBvcHRpb25zPzogVHJhbnNmZXJBY2NlbGVyYXRpb25VcmxPcHRpb25zKTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgdmlydHVhbCBob3N0ZWQtc3R5bGUgVVJMIG9mIGFuIFMzIG9iamVjdC4gU3BlY2lmeSBgcmVnaW9uYWw6IGZhbHNlYCBhdFxuICAgKiB0aGUgb3B0aW9ucyBmb3Igbm9uLXJlZ2lvbmFsIFVSTC4gRm9yIGV4YW1wbGU6XG4gICAqXG4gICAqIC0gYGh0dHBzOi8vb25seS1idWNrZXQuczMudXMtd2VzdC0xLmFtYXpvbmF3cy5jb21gXG4gICAqIC0gYGh0dHBzOi8vYnVja2V0LnMzLnVzLXdlc3QtMS5hbWF6b25hd3MuY29tL2tleWBcbiAgICogLSBgaHR0cHM6Ly9idWNrZXQuczMuYW1hem9uYXdzLmNvbS9rZXlgXG4gICAqIC0gYGh0dHBzOi8vY2hpbmEtYnVja2V0LnMzLmNuLW5vcnRoLTEuYW1hem9uYXdzLmNvbS5jbi9teWtleWBcbiAgICogQHBhcmFtIGtleSBUaGUgUzMga2V5IG9mIHRoZSBvYmplY3QuIElmIG5vdCBzcGVjaWZpZWQsIHRoZSBVUkwgb2YgdGhlXG4gICAqICAgICAgYnVja2V0IGlzIHJldHVybmVkLlxuICAgKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zIGZvciBnZW5lcmF0aW5nIFVSTC5cbiAgICogQHJldHVybnMgYW4gT2JqZWN0UzNVcmwgdG9rZW5cbiAgICovXG4gIHZpcnR1YWxIb3N0ZWRVcmxGb3JPYmplY3Qoa2V5Pzogc3RyaW5nLCBvcHRpb25zPzogVmlydHVhbEhvc3RlZFN0eWxlVXJsT3B0aW9ucyk6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIFMzIFVSTCBvZiBhbiBTMyBvYmplY3QuIEZvciBleGFtcGxlOlxuICAgKiAtIGBzMzovL29ubHlidWNrZXRgXG4gICAqIC0gYHMzOi8vYnVja2V0L2tleWBcbiAgICogQHBhcmFtIGtleSBUaGUgUzMga2V5IG9mIHRoZSBvYmplY3QuIElmIG5vdCBzcGVjaWZpZWQsIHRoZSBTMyBVUkwgb2YgdGhlXG4gICAqICAgICAgYnVja2V0IGlzIHJldHVybmVkLlxuICAgKiBAcmV0dXJucyBhbiBPYmplY3RTM1VybCB0b2tlblxuICAgKi9cbiAgczNVcmxGb3JPYmplY3Qoa2V5Pzogc3RyaW5nKTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGFuIEFSTiB0aGF0IHJlcHJlc2VudHMgYWxsIG9iamVjdHMgd2l0aGluIHRoZSBidWNrZXQgdGhhdCBtYXRjaFxuICAgKiB0aGUga2V5IHBhdHRlcm4gc3BlY2lmaWVkLiBUbyByZXByZXNlbnQgYWxsIGtleXMsIHNwZWNpZnkgYGBcIipcImBgLlxuICAgKi9cbiAgYXJuRm9yT2JqZWN0cyhrZXlQYXR0ZXJuOiBzdHJpbmcpOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEdyYW50IHJlYWQgcGVybWlzc2lvbnMgZm9yIHRoaXMgYnVja2V0IGFuZCBpdCdzIGNvbnRlbnRzIHRvIGFuIElBTVxuICAgKiBwcmluY2lwYWwgKFJvbGUvR3JvdXAvVXNlcikuXG4gICAqXG4gICAqIElmIGVuY3J5cHRpb24gaXMgdXNlZCwgcGVybWlzc2lvbiB0byB1c2UgdGhlIGtleSB0byBkZWNyeXB0IHRoZSBjb250ZW50c1xuICAgKiBvZiB0aGUgYnVja2V0IHdpbGwgYWxzbyBiZSBncmFudGVkIHRvIHRoZSBzYW1lIHByaW5jaXBhbC5cbiAgICpcbiAgICogQHBhcmFtIGlkZW50aXR5IFRoZSBwcmluY2lwYWxcbiAgICogQHBhcmFtIG9iamVjdHNLZXlQYXR0ZXJuIFJlc3RyaWN0IHRoZSBwZXJtaXNzaW9uIHRvIGEgY2VydGFpbiBrZXkgcGF0dGVybiAoZGVmYXVsdCAnKicpXG4gICAqL1xuICBncmFudFJlYWQoaWRlbnRpdHk6IGlhbS5JR3JhbnRhYmxlLCBvYmplY3RzS2V5UGF0dGVybj86IGFueSk6IGlhbS5HcmFudDtcblxuICAvKipcbiAgICogR3JhbnQgd3JpdGUgcGVybWlzc2lvbnMgdG8gdGhpcyBidWNrZXQgdG8gYW4gSUFNIHByaW5jaXBhbC5cbiAgICpcbiAgICogSWYgZW5jcnlwdGlvbiBpcyB1c2VkLCBwZXJtaXNzaW9uIHRvIHVzZSB0aGUga2V5IHRvIGVuY3J5cHQgdGhlIGNvbnRlbnRzXG4gICAqIG9mIHdyaXR0ZW4gZmlsZXMgd2lsbCBhbHNvIGJlIGdyYW50ZWQgdG8gdGhlIHNhbWUgcHJpbmNpcGFsLlxuICAgKlxuICAgKiBCZWZvcmUgQ0RLIHZlcnNpb24gMS44NS4wLCB0aGlzIG1ldGhvZCBncmFudGVkIHRoZSBgczM6UHV0T2JqZWN0KmAgcGVybWlzc2lvbiB0aGF0IGluY2x1ZGVkIGBzMzpQdXRPYmplY3RBY2xgLFxuICAgKiB3aGljaCBjb3VsZCBiZSB1c2VkIHRvIGdyYW50IHJlYWQvd3JpdGUgb2JqZWN0IGFjY2VzcyB0byBJQU0gcHJpbmNpcGFscyBpbiBvdGhlciBhY2NvdW50cy5cbiAgICogSWYgeW91IHdhbnQgdG8gZ2V0IHJpZCBvZiB0aGF0IGJlaGF2aW9yLCB1cGRhdGUgeW91ciBDREsgdmVyc2lvbiB0byAxLjg1LjAgb3IgbGF0ZXIsXG4gICAqIGFuZCBtYWtlIHN1cmUgdGhlIGBAYXdzLWNkay9hd3MtczM6Z3JhbnRXcml0ZVdpdGhvdXRBY2xgIGZlYXR1cmUgZmxhZyBpcyBzZXQgdG8gYHRydWVgXG4gICAqIGluIHRoZSBgY29udGV4dGAga2V5IG9mIHlvdXIgY2RrLmpzb24gZmlsZS5cbiAgICogSWYgeW91J3ZlIGFscmVhZHkgdXBkYXRlZCwgYnV0IHN0aWxsIG5lZWQgdGhlIHByaW5jaXBhbCB0byBoYXZlIHBlcm1pc3Npb25zIHRvIG1vZGlmeSB0aGUgQUNMcyxcbiAgICogdXNlIHRoZSBgZ3JhbnRQdXRBY2xgIG1ldGhvZC5cbiAgICpcbiAgICogQHBhcmFtIGlkZW50aXR5IFRoZSBwcmluY2lwYWxcbiAgICogQHBhcmFtIG9iamVjdHNLZXlQYXR0ZXJuIFJlc3RyaWN0IHRoZSBwZXJtaXNzaW9uIHRvIGEgY2VydGFpbiBrZXkgcGF0dGVybiAoZGVmYXVsdCAnKicpXG4gICAqIEBwYXJhbSBhbGxvd2VkQWN0aW9uUGF0dGVybnMgUmVzdHJpY3QgdGhlIHBlcm1pc3Npb25zIHRvIGNlcnRhaW4gbGlzdCBvZiBhY3Rpb24gcGF0dGVybnNcbiAgICovXG4gIGdyYW50V3JpdGUoaWRlbnRpdHk6IGlhbS5JR3JhbnRhYmxlLCBvYmplY3RzS2V5UGF0dGVybj86IGFueSwgYWxsb3dlZEFjdGlvblBhdHRlcm5zPzogc3RyaW5nW10pOiBpYW0uR3JhbnQ7XG5cbiAgLyoqXG4gICAqIEdyYW50cyBzMzpQdXRPYmplY3QqIGFuZCBzMzpBYm9ydCogcGVybWlzc2lvbnMgZm9yIHRoaXMgYnVja2V0IHRvIGFuIElBTSBwcmluY2lwYWwuXG4gICAqXG4gICAqIElmIGVuY3J5cHRpb24gaXMgdXNlZCwgcGVybWlzc2lvbiB0byB1c2UgdGhlIGtleSB0byBlbmNyeXB0IHRoZSBjb250ZW50c1xuICAgKiBvZiB3cml0dGVuIGZpbGVzIHdpbGwgYWxzbyBiZSBncmFudGVkIHRvIHRoZSBzYW1lIHByaW5jaXBhbC5cbiAgICogQHBhcmFtIGlkZW50aXR5IFRoZSBwcmluY2lwYWxcbiAgICogQHBhcmFtIG9iamVjdHNLZXlQYXR0ZXJuIFJlc3RyaWN0IHRoZSBwZXJtaXNzaW9uIHRvIGEgY2VydGFpbiBrZXkgcGF0dGVybiAoZGVmYXVsdCAnKicpXG4gICAqL1xuICBncmFudFB1dChpZGVudGl0eTogaWFtLklHcmFudGFibGUsIG9iamVjdHNLZXlQYXR0ZXJuPzogYW55KTogaWFtLkdyYW50O1xuXG4gIC8qKlxuICAgKiBHcmFudCB0aGUgZ2l2ZW4gSUFNIGlkZW50aXR5IHBlcm1pc3Npb25zIHRvIG1vZGlmeSB0aGUgQUNMcyBvZiBvYmplY3RzIGluIHRoZSBnaXZlbiBCdWNrZXQuXG4gICAqXG4gICAqIElmIHlvdXIgYXBwbGljYXRpb24gaGFzIHRoZSAnQGF3cy1jZGsvYXdzLXMzOmdyYW50V3JpdGVXaXRob3V0QWNsJyBmZWF0dXJlIGZsYWcgc2V0LFxuICAgKiBjYWxsaW5nIGBncmFudFdyaXRlYCBvciBgZ3JhbnRSZWFkV3JpdGVgIG5vIGxvbmdlciBncmFudHMgcGVybWlzc2lvbnMgdG8gbW9kaWZ5IHRoZSBBQ0xzIG9mIHRoZSBvYmplY3RzO1xuICAgKiBpbiB0aGlzIGNhc2UsIGlmIHlvdSBuZWVkIHRvIG1vZGlmeSBvYmplY3QgQUNMcywgY2FsbCB0aGlzIG1ldGhvZCBleHBsaWNpdGx5LlxuICAgKlxuICAgKiBAcGFyYW0gaWRlbnRpdHkgVGhlIHByaW5jaXBhbFxuICAgKiBAcGFyYW0gb2JqZWN0c0tleVBhdHRlcm4gUmVzdHJpY3QgdGhlIHBlcm1pc3Npb24gdG8gYSBjZXJ0YWluIGtleSBwYXR0ZXJuIChkZWZhdWx0ICcqJylcbiAgICovXG4gIGdyYW50UHV0QWNsKGlkZW50aXR5OiBpYW0uSUdyYW50YWJsZSwgb2JqZWN0c0tleVBhdHRlcm4/OiBzdHJpbmcpOiBpYW0uR3JhbnQ7XG5cbiAgLyoqXG4gICAqIEdyYW50cyBzMzpEZWxldGVPYmplY3QqIHBlcm1pc3Npb24gdG8gYW4gSUFNIHByaW5jaXBhbCBmb3Igb2JqZWN0c1xuICAgKiBpbiB0aGlzIGJ1Y2tldC5cbiAgICpcbiAgICogQHBhcmFtIGlkZW50aXR5IFRoZSBwcmluY2lwYWxcbiAgICogQHBhcmFtIG9iamVjdHNLZXlQYXR0ZXJuIFJlc3RyaWN0IHRoZSBwZXJtaXNzaW9uIHRvIGEgY2VydGFpbiBrZXkgcGF0dGVybiAoZGVmYXVsdCAnKicpXG4gICAqL1xuICBncmFudERlbGV0ZShpZGVudGl0eTogaWFtLklHcmFudGFibGUsIG9iamVjdHNLZXlQYXR0ZXJuPzogYW55KTogaWFtLkdyYW50O1xuXG4gIC8qKlxuICAgKiBHcmFudHMgcmVhZC93cml0ZSBwZXJtaXNzaW9ucyBmb3IgdGhpcyBidWNrZXQgYW5kIGl0J3MgY29udGVudHMgdG8gYW4gSUFNXG4gICAqIHByaW5jaXBhbCAoUm9sZS9Hcm91cC9Vc2VyKS5cbiAgICpcbiAgICogSWYgYW4gZW5jcnlwdGlvbiBrZXkgaXMgdXNlZCwgcGVybWlzc2lvbiB0byB1c2UgdGhlIGtleSBmb3JcbiAgICogZW5jcnlwdC9kZWNyeXB0IHdpbGwgYWxzbyBiZSBncmFudGVkLlxuICAgKlxuICAgKiBCZWZvcmUgQ0RLIHZlcnNpb24gMS44NS4wLCB0aGlzIG1ldGhvZCBncmFudGVkIHRoZSBgczM6UHV0T2JqZWN0KmAgcGVybWlzc2lvbiB0aGF0IGluY2x1ZGVkIGBzMzpQdXRPYmplY3RBY2xgLFxuICAgKiB3aGljaCBjb3VsZCBiZSB1c2VkIHRvIGdyYW50IHJlYWQvd3JpdGUgb2JqZWN0IGFjY2VzcyB0byBJQU0gcHJpbmNpcGFscyBpbiBvdGhlciBhY2NvdW50cy5cbiAgICogSWYgeW91IHdhbnQgdG8gZ2V0IHJpZCBvZiB0aGF0IGJlaGF2aW9yLCB1cGRhdGUgeW91ciBDREsgdmVyc2lvbiB0byAxLjg1LjAgb3IgbGF0ZXIsXG4gICAqIGFuZCBtYWtlIHN1cmUgdGhlIGBAYXdzLWNkay9hd3MtczM6Z3JhbnRXcml0ZVdpdGhvdXRBY2xgIGZlYXR1cmUgZmxhZyBpcyBzZXQgdG8gYHRydWVgXG4gICAqIGluIHRoZSBgY29udGV4dGAga2V5IG9mIHlvdXIgY2RrLmpzb24gZmlsZS5cbiAgICogSWYgeW91J3ZlIGFscmVhZHkgdXBkYXRlZCwgYnV0IHN0aWxsIG5lZWQgdGhlIHByaW5jaXBhbCB0byBoYXZlIHBlcm1pc3Npb25zIHRvIG1vZGlmeSB0aGUgQUNMcyxcbiAgICogdXNlIHRoZSBgZ3JhbnRQdXRBY2xgIG1ldGhvZC5cbiAgICpcbiAgICogQHBhcmFtIGlkZW50aXR5IFRoZSBwcmluY2lwYWxcbiAgICogQHBhcmFtIG9iamVjdHNLZXlQYXR0ZXJuIFJlc3RyaWN0IHRoZSBwZXJtaXNzaW9uIHRvIGEgY2VydGFpbiBrZXkgcGF0dGVybiAoZGVmYXVsdCAnKicpXG4gICAqL1xuICBncmFudFJlYWRXcml0ZShpZGVudGl0eTogaWFtLklHcmFudGFibGUsIG9iamVjdHNLZXlQYXR0ZXJuPzogYW55KTogaWFtLkdyYW50O1xuXG4gIC8qKlxuICAgKiBBbGxvd3MgdW5yZXN0cmljdGVkIGFjY2VzcyB0byBvYmplY3RzIGZyb20gdGhpcyBidWNrZXQuXG4gICAqXG4gICAqIElNUE9SVEFOVDogVGhpcyBwZXJtaXNzaW9uIGFsbG93cyBhbnlvbmUgdG8gcGVyZm9ybSBhY3Rpb25zIG9uIFMzIG9iamVjdHNcbiAgICogaW4gdGhpcyBidWNrZXQsIHdoaWNoIGlzIHVzZWZ1bCBmb3Igd2hlbiB5b3UgY29uZmlndXJlIHlvdXIgYnVja2V0IGFzIGFcbiAgICogd2Vic2l0ZSBhbmQgd2FudCBldmVyeW9uZSB0byBiZSBhYmxlIHRvIHJlYWQgb2JqZWN0cyBpbiB0aGUgYnVja2V0IHdpdGhvdXRcbiAgICogbmVlZGluZyB0byBhdXRoZW50aWNhdGUuXG4gICAqXG4gICAqIFdpdGhvdXQgYXJndW1lbnRzLCB0aGlzIG1ldGhvZCB3aWxsIGdyYW50IHJlYWQgKFwiczM6R2V0T2JqZWN0XCIpIGFjY2VzcyB0b1xuICAgKiBhbGwgb2JqZWN0cyAoXCIqXCIpIGluIHRoZSBidWNrZXQuXG4gICAqXG4gICAqIFRoZSBtZXRob2QgcmV0dXJucyB0aGUgYGlhbS5HcmFudGAgb2JqZWN0LCB3aGljaCBjYW4gdGhlbiBiZSBtb2RpZmllZFxuICAgKiBhcyBuZWVkZWQuIEZvciBleGFtcGxlLCB5b3UgY2FuIGFkZCBhIGNvbmRpdGlvbiB0aGF0IHdpbGwgcmVzdHJpY3QgYWNjZXNzIG9ubHlcbiAgICogdG8gYW4gSVB2NCByYW5nZSBsaWtlIHRoaXM6XG4gICAqXG4gICAqICAgICBjb25zdCBncmFudCA9IGJ1Y2tldC5ncmFudFB1YmxpY0FjY2VzcygpO1xuICAgKiAgICAgZ3JhbnQucmVzb3VyY2VTdGF0ZW1lbnQhLmFkZENvbmRpdGlvbijigJhJcEFkZHJlc3PigJksIHsg4oCcYXdzOlNvdXJjZUlw4oCdOiDigJw1NC4yNDAuMTQzLjAvMjTigJ0gfSk7XG4gICAqXG4gICAqXG4gICAqIEBwYXJhbSBrZXlQcmVmaXggdGhlIHByZWZpeCBvZiBTMyBvYmplY3Qga2V5cyAoZS5nLiBgaG9tZS8qYCkuIERlZmF1bHQgaXMgXCIqXCIuXG4gICAqIEBwYXJhbSBhbGxvd2VkQWN0aW9ucyB0aGUgc2V0IG9mIFMzIGFjdGlvbnMgdG8gYWxsb3cuIERlZmF1bHQgaXMgXCJzMzpHZXRPYmplY3RcIi5cbiAgICogQHJldHVybnMgVGhlIGBpYW0uUG9saWN5U3RhdGVtZW50YCBvYmplY3QsIHdoaWNoIGNhbiBiZSB1c2VkIHRvIGFwcGx5IGUuZy4gY29uZGl0aW9ucy5cbiAgICovXG4gIGdyYW50UHVibGljQWNjZXNzKGtleVByZWZpeD86IHN0cmluZywgLi4uYWxsb3dlZEFjdGlvbnM6IHN0cmluZ1tdKTogaWFtLkdyYW50O1xuXG4gIC8qKlxuICAgKiBEZWZpbmVzIGEgQ2xvdWRXYXRjaCBldmVudCB0aGF0IHRyaWdnZXJzIHdoZW4gc29tZXRoaW5nIGhhcHBlbnMgdG8gdGhpcyBidWNrZXRcbiAgICpcbiAgICogUmVxdWlyZXMgdGhhdCB0aGVyZSBleGlzdHMgYXQgbGVhc3Qgb25lIENsb3VkVHJhaWwgVHJhaWwgaW4geW91ciBhY2NvdW50XG4gICAqIHRoYXQgY2FwdHVyZXMgdGhlIGV2ZW50LiBUaGlzIG1ldGhvZCB3aWxsIG5vdCBjcmVhdGUgdGhlIFRyYWlsLlxuICAgKlxuICAgKiBAcGFyYW0gaWQgVGhlIGlkIG9mIHRoZSBydWxlXG4gICAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbnMgZm9yIGFkZGluZyB0aGUgcnVsZVxuICAgKi9cbiAgb25DbG91ZFRyYWlsRXZlbnQoaWQ6IHN0cmluZywgb3B0aW9ucz86IE9uQ2xvdWRUcmFpbEJ1Y2tldEV2ZW50T3B0aW9ucyk6IGV2ZW50cy5SdWxlO1xuXG4gIC8qKlxuICAgKiBEZWZpbmVzIGFuIEFXUyBDbG91ZFdhdGNoIGV2ZW50IHRoYXQgdHJpZ2dlcnMgd2hlbiBhbiBvYmplY3QgaXMgdXBsb2FkZWRcbiAgICogdG8gdGhlIHNwZWNpZmllZCBwYXRocyAoa2V5cykgaW4gdGhpcyBidWNrZXQgdXNpbmcgdGhlIFB1dE9iamVjdCBBUEkgY2FsbC5cbiAgICpcbiAgICogTm90ZSB0aGF0IHNvbWUgdG9vbHMgbGlrZSBgYXdzIHMzIGNwYCB3aWxsIGF1dG9tYXRpY2FsbHkgdXNlIGVpdGhlclxuICAgKiBQdXRPYmplY3Qgb3IgdGhlIG11bHRpcGFydCB1cGxvYWQgQVBJIGRlcGVuZGluZyBvbiB0aGUgZmlsZSBzaXplLFxuICAgKiBzbyB1c2luZyBgb25DbG91ZFRyYWlsV3JpdGVPYmplY3RgIG1heSBiZSBwcmVmZXJhYmxlLlxuICAgKlxuICAgKiBSZXF1aXJlcyB0aGF0IHRoZXJlIGV4aXN0cyBhdCBsZWFzdCBvbmUgQ2xvdWRUcmFpbCBUcmFpbCBpbiB5b3VyIGFjY291bnRcbiAgICogdGhhdCBjYXB0dXJlcyB0aGUgZXZlbnQuIFRoaXMgbWV0aG9kIHdpbGwgbm90IGNyZWF0ZSB0aGUgVHJhaWwuXG4gICAqXG4gICAqIEBwYXJhbSBpZCBUaGUgaWQgb2YgdGhlIHJ1bGVcbiAgICogQHBhcmFtIG9wdGlvbnMgT3B0aW9ucyBmb3IgYWRkaW5nIHRoZSBydWxlXG4gICAqL1xuICBvbkNsb3VkVHJhaWxQdXRPYmplY3QoaWQ6IHN0cmluZywgb3B0aW9ucz86IE9uQ2xvdWRUcmFpbEJ1Y2tldEV2ZW50T3B0aW9ucyk6IGV2ZW50cy5SdWxlO1xuXG4gIC8qKlxuICAgKiBEZWZpbmVzIGFuIEFXUyBDbG91ZFdhdGNoIGV2ZW50IHRoYXQgdHJpZ2dlcnMgd2hlbiBhbiBvYmplY3QgYXQgdGhlXG4gICAqIHNwZWNpZmllZCBwYXRocyAoa2V5cykgaW4gdGhpcyBidWNrZXQgYXJlIHdyaXR0ZW4gdG8uICBUaGlzIGluY2x1ZGVzXG4gICAqIHRoZSBldmVudHMgUHV0T2JqZWN0LCBDb3B5T2JqZWN0LCBhbmQgQ29tcGxldGVNdWx0aXBhcnRVcGxvYWQuXG4gICAqXG4gICAqIE5vdGUgdGhhdCBzb21lIHRvb2xzIGxpa2UgYGF3cyBzMyBjcGAgd2lsbCBhdXRvbWF0aWNhbGx5IHVzZSBlaXRoZXJcbiAgICogUHV0T2JqZWN0IG9yIHRoZSBtdWx0aXBhcnQgdXBsb2FkIEFQSSBkZXBlbmRpbmcgb24gdGhlIGZpbGUgc2l6ZSxcbiAgICogc28gdXNpbmcgdGhpcyBtZXRob2QgbWF5IGJlIHByZWZlcmFibGUgdG8gYG9uQ2xvdWRUcmFpbFB1dE9iamVjdGAuXG4gICAqXG4gICAqIFJlcXVpcmVzIHRoYXQgdGhlcmUgZXhpc3RzIGF0IGxlYXN0IG9uZSBDbG91ZFRyYWlsIFRyYWlsIGluIHlvdXIgYWNjb3VudFxuICAgKiB0aGF0IGNhcHR1cmVzIHRoZSBldmVudC4gVGhpcyBtZXRob2Qgd2lsbCBub3QgY3JlYXRlIHRoZSBUcmFpbC5cbiAgICpcbiAgICogQHBhcmFtIGlkIFRoZSBpZCBvZiB0aGUgcnVsZVxuICAgKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zIGZvciBhZGRpbmcgdGhlIHJ1bGVcbiAgICovXG4gIG9uQ2xvdWRUcmFpbFdyaXRlT2JqZWN0KGlkOiBzdHJpbmcsIG9wdGlvbnM/OiBPbkNsb3VkVHJhaWxCdWNrZXRFdmVudE9wdGlvbnMpOiBldmVudHMuUnVsZTtcblxuICAvKipcbiAgICogQWRkcyBhIGJ1Y2tldCBub3RpZmljYXRpb24gZXZlbnQgZGVzdGluYXRpb24uXG4gICAqIEBwYXJhbSBldmVudCBUaGUgZXZlbnQgdG8gdHJpZ2dlciB0aGUgbm90aWZpY2F0aW9uXG4gICAqIEBwYXJhbSBkZXN0IFRoZSBub3RpZmljYXRpb24gZGVzdGluYXRpb24gKExhbWJkYSwgU05TIFRvcGljIG9yIFNRUyBRdWV1ZSlcbiAgICpcbiAgICogQHBhcmFtIGZpbHRlcnMgUzMgb2JqZWN0IGtleSBmaWx0ZXIgcnVsZXMgdG8gZGV0ZXJtaW5lIHdoaWNoIG9iamVjdHNcbiAgICogdHJpZ2dlciB0aGlzIGV2ZW50LiBFYWNoIGZpbHRlciBtdXN0IGluY2x1ZGUgYSBgcHJlZml4YCBhbmQvb3IgYHN1ZmZpeGBcbiAgICogdGhhdCB3aWxsIGJlIG1hdGNoZWQgYWdhaW5zdCB0aGUgczMgb2JqZWN0IGtleS4gUmVmZXIgdG8gdGhlIFMzIERldmVsb3BlciBHdWlkZVxuICAgKiBmb3IgZGV0YWlscyBhYm91dCBhbGxvd2VkIGZpbHRlciBydWxlcy5cbiAgICpcbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQW1hem9uUzMvbGF0ZXN0L2Rldi9Ob3RpZmljYXRpb25Ib3dUby5odG1sI25vdGlmaWNhdGlvbi1ob3ctdG8tZmlsdGVyaW5nXG4gICAqXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqICAgIGRlY2xhcmUgY29uc3QgbXlMYW1iZGE6IGxhbWJkYS5GdW5jdGlvbjtcbiAgICogICAgY29uc3QgYnVja2V0ID0gbmV3IHMzLkJ1Y2tldCh0aGlzLCAnTXlCdWNrZXQnKTtcbiAgICogICAgYnVja2V0LmFkZEV2ZW50Tm90aWZpY2F0aW9uKHMzLkV2ZW50VHlwZS5PQkpFQ1RfQ1JFQVRFRCwgbmV3IHMzbi5MYW1iZGFEZXN0aW5hdGlvbihteUxhbWJkYSksIHtwcmVmaXg6ICdob21lL215dXNlcm5hbWUvKid9KVxuICAgKlxuICAgKiBAc2VlXG4gICAqIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BbWF6b25TMy9sYXRlc3QvZGV2L05vdGlmaWNhdGlvbkhvd1RvLmh0bWxcbiAgICovXG4gIGFkZEV2ZW50Tm90aWZpY2F0aW9uKGV2ZW50OiBFdmVudFR5cGUsIGRlc3Q6IElCdWNrZXROb3RpZmljYXRpb25EZXN0aW5hdGlvbiwgLi4uZmlsdGVyczogTm90aWZpY2F0aW9uS2V5RmlsdGVyW10pOiB2b2lkO1xuXG4gIC8qKlxuICAgKiBTdWJzY3JpYmVzIGEgZGVzdGluYXRpb24gdG8gcmVjZWl2ZSBub3RpZmljYXRpb25zIHdoZW4gYW4gb2JqZWN0IGlzXG4gICAqIGNyZWF0ZWQgaW4gdGhlIGJ1Y2tldC4gVGhpcyBpcyBpZGVudGljYWwgdG8gY2FsbGluZ1xuICAgKiBgb25FdmVudChzMy5FdmVudFR5cGUuT0JKRUNUX0NSRUFURUQpYC5cbiAgICpcbiAgICogQHBhcmFtIGRlc3QgVGhlIG5vdGlmaWNhdGlvbiBkZXN0aW5hdGlvbiAoc2VlIG9uRXZlbnQpXG4gICAqIEBwYXJhbSBmaWx0ZXJzIEZpbHRlcnMgKHNlZSBvbkV2ZW50KVxuICAgKi9cbiAgYWRkT2JqZWN0Q3JlYXRlZE5vdGlmaWNhdGlvbihkZXN0OiBJQnVja2V0Tm90aWZpY2F0aW9uRGVzdGluYXRpb24sIC4uLmZpbHRlcnM6IE5vdGlmaWNhdGlvbktleUZpbHRlcltdKTogdm9pZFxuXG4gIC8qKlxuICAgKiBTdWJzY3JpYmVzIGEgZGVzdGluYXRpb24gdG8gcmVjZWl2ZSBub3RpZmljYXRpb25zIHdoZW4gYW4gb2JqZWN0IGlzXG4gICAqIHJlbW92ZWQgZnJvbSB0aGUgYnVja2V0LiBUaGlzIGlzIGlkZW50aWNhbCB0byBjYWxsaW5nXG4gICAqIGBvbkV2ZW50KEV2ZW50VHlwZS5PQkpFQ1RfUkVNT1ZFRClgLlxuICAgKlxuICAgKiBAcGFyYW0gZGVzdCBUaGUgbm90aWZpY2F0aW9uIGRlc3RpbmF0aW9uIChzZWUgb25FdmVudClcbiAgICogQHBhcmFtIGZpbHRlcnMgRmlsdGVycyAoc2VlIG9uRXZlbnQpXG4gICAqL1xuICBhZGRPYmplY3RSZW1vdmVkTm90aWZpY2F0aW9uKGRlc3Q6IElCdWNrZXROb3RpZmljYXRpb25EZXN0aW5hdGlvbiwgLi4uZmlsdGVyczogTm90aWZpY2F0aW9uS2V5RmlsdGVyW10pOiB2b2lkO1xuXG5cbiAgLyoqXG4gICAqIEVuYWJsZXMgZXZlbnQgYnJpZGdlIG5vdGlmaWNhdGlvbiwgY2F1c2luZyBhbGwgZXZlbnRzIGJlbG93IHRvIGJlIHNlbnQgdG8gRXZlbnRCcmlkZ2U6XG4gICAqXG4gICAqIC0gT2JqZWN0IERlbGV0ZWQgKERlbGV0ZU9iamVjdClcbiAgICogLSBPYmplY3QgRGVsZXRlZCAoTGlmZWN5Y2xlIGV4cGlyYXRpb24pXG4gICAqIC0gT2JqZWN0IFJlc3RvcmUgSW5pdGlhdGVkXG4gICAqIC0gT2JqZWN0IFJlc3RvcmUgQ29tcGxldGVkXG4gICAqIC0gT2JqZWN0IFJlc3RvcmUgRXhwaXJlZFxuICAgKiAtIE9iamVjdCBTdG9yYWdlIENsYXNzIENoYW5nZWRcbiAgICogLSBPYmplY3QgQWNjZXNzIFRpZXIgQ2hhbmdlZFxuICAgKiAtIE9iamVjdCBBQ0wgVXBkYXRlZFxuICAgKiAtIE9iamVjdCBUYWdzIEFkZGVkXG4gICAqIC0gT2JqZWN0IFRhZ3MgRGVsZXRlZFxuICAgKi9cbiAgZW5hYmxlRXZlbnRCcmlkZ2VOb3RpZmljYXRpb24oKTogdm9pZDtcbn1cblxuLyoqXG4gKiBBIHJlZmVyZW5jZSB0byBhIGJ1Y2tldCBvdXRzaWRlIHRoaXMgc3RhY2tcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBCdWNrZXRBdHRyaWJ1dGVzIHtcbiAgLyoqXG4gICAqIFRoZSBBUk4gb2YgdGhlIGJ1Y2tldC4gQXQgbGVhc3Qgb25lIG9mIGJ1Y2tldEFybiBvciBidWNrZXROYW1lIG11c3QgYmVcbiAgICogZGVmaW5lZCBpbiBvcmRlciB0byBpbml0aWFsaXplIGEgYnVja2V0IHJlZi5cbiAgICovXG4gIHJlYWRvbmx5IGJ1Y2tldEFybj86IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIG5hbWUgb2YgdGhlIGJ1Y2tldC4gSWYgdGhlIHVuZGVybHlpbmcgdmFsdWUgb2YgQVJOIGlzIGEgc3RyaW5nLCB0aGVcbiAgICogbmFtZSB3aWxsIGJlIHBhcnNlZCBmcm9tIHRoZSBBUk4uIE90aGVyd2lzZSwgdGhlIG5hbWUgaXMgb3B0aW9uYWwsIGJ1dFxuICAgKiBzb21lIGZlYXR1cmVzIHRoYXQgcmVxdWlyZSB0aGUgYnVja2V0IG5hbWUgc3VjaCBhcyBhdXRvLWNyZWF0aW5nIGEgYnVja2V0XG4gICAqIHBvbGljeSwgd29uJ3Qgd29yay5cbiAgICovXG4gIHJlYWRvbmx5IGJ1Y2tldE5hbWU/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBkb21haW4gbmFtZSBvZiB0aGUgYnVja2V0LlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIEluZmVycmVkIGZyb20gYnVja2V0IG5hbWVcbiAgICovXG4gIHJlYWRvbmx5IGJ1Y2tldERvbWFpbk5hbWU/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSB3ZWJzaXRlIFVSTCBvZiB0aGUgYnVja2V0IChpZiBzdGF0aWMgd2ViIGhvc3RpbmcgaXMgZW5hYmxlZCkuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gSW5mZXJyZWQgZnJvbSBidWNrZXQgbmFtZSBhbmQgcmVnaW9uXG4gICAqL1xuICByZWFkb25seSBidWNrZXRXZWJzaXRlVXJsPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgcmVnaW9uYWwgZG9tYWluIG5hbWUgb2YgdGhlIHNwZWNpZmllZCBidWNrZXQuXG4gICAqL1xuICByZWFkb25seSBidWNrZXRSZWdpb25hbERvbWFpbk5hbWU/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBJUHY2IEROUyBuYW1lIG9mIHRoZSBzcGVjaWZpZWQgYnVja2V0LlxuICAgKi9cbiAgcmVhZG9ubHkgYnVja2V0RHVhbFN0YWNrRG9tYWluTmFtZT86IHN0cmluZztcblxuICAvKipcbiAgICogRm9yY2UgdGhlIGZvcm1hdCBvZiB0aGUgd2Vic2l0ZSBVUkwgb2YgdGhlIGJ1Y2tldC4gVGhpcyBzaG91bGQgYmUgdHJ1ZSBmb3JcbiAgICogcmVnaW9ucyBsYXVuY2hlZCBzaW5jZSAyMDE0LlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIGluZmVycmVkIGZyb20gYXZhaWxhYmxlIHJlZ2lvbiBpbmZvcm1hdGlvbiwgYGZhbHNlYCBvdGhlcndpc2VcbiAgICpcbiAgICogQGRlcHJlY2F0ZWQgVGhlIGNvcnJlY3Qgd2Vic2l0ZSB1cmwgZm9ybWF0IGNhbiBiZSBpbmZlcnJlZCBhdXRvbWF0aWNhbGx5IGZyb20gdGhlIGJ1Y2tldCBgcmVnaW9uYC5cbiAgICogQWx3YXlzIHByb3ZpZGUgdGhlIGJ1Y2tldCByZWdpb24gaWYgdGhlIGBidWNrZXRXZWJzaXRlVXJsYCB3aWxsIGJlIHVzZWQuXG4gICAqIEFsdGVybmF0aXZlbHkgcHJvdmlkZSB0aGUgZnVsbCBgYnVja2V0V2Vic2l0ZVVybGAgbWFudWFsbHkuXG4gICAqL1xuICByZWFkb25seSBidWNrZXRXZWJzaXRlTmV3VXJsRm9ybWF0PzogYm9vbGVhbjtcblxuICAvKipcbiAgICogS01TIGVuY3J5cHRpb24ga2V5IGFzc29jaWF0ZWQgd2l0aCB0aGlzIGJ1Y2tldC5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBubyBlbmNyeXB0aW9uIGtleVxuICAgKi9cbiAgcmVhZG9ubHkgZW5jcnlwdGlvbktleT86IGttcy5JS2V5O1xuXG4gIC8qKlxuICAgKiBJZiB0aGlzIGJ1Y2tldCBoYXMgYmVlbiBjb25maWd1cmVkIGZvciBzdGF0aWMgd2Vic2l0ZSBob3N0aW5nLlxuICAgKlxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKi9cbiAgcmVhZG9ubHkgaXNXZWJzaXRlPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogVGhlIGFjY291bnQgdGhpcyBleGlzdGluZyBidWNrZXQgYmVsb25ncyB0by5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBpdCdzIGFzc3VtZWQgdGhlIGJ1Y2tldCBiZWxvbmdzIHRvIHRoZSBzYW1lIGFjY291bnQgYXMgdGhlIHNjb3BlIGl0J3MgYmVpbmcgaW1wb3J0ZWQgaW50b1xuICAgKi9cbiAgcmVhZG9ubHkgYWNjb3VudD86IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIHJlZ2lvbiB0aGlzIGV4aXN0aW5nIGJ1Y2tldCBpcyBpbi5cbiAgICogRmVhdHVyZXMgdGhhdCByZXF1aXJlIHRoZSByZWdpb24gKGUuZy4gYGJ1Y2tldFdlYnNpdGVVcmxgKSB3b24ndCBmdWxseSB3b3JrXG4gICAqIGlmIHRoZSByZWdpb24gY2Fubm90IGJlIGNvcnJlY3RseSBpbmZlcnJlZC5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBpdCdzIGFzc3VtZWQgdGhlIGJ1Y2tldCBpcyBpbiB0aGUgc2FtZSByZWdpb24gYXMgdGhlIHNjb3BlIGl0J3MgYmVpbmcgaW1wb3J0ZWQgaW50b1xuICAgKi9cbiAgcmVhZG9ubHkgcmVnaW9uPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgcm9sZSB0byBiZSB1c2VkIGJ5IHRoZSBub3RpZmljYXRpb25zIGhhbmRsZXJcbiAgICpcbiAgICogQGRlZmF1bHQgLSBhIG5ldyByb2xlIHdpbGwgYmUgY3JlYXRlZC5cbiAgICovXG4gIHJlYWRvbmx5IG5vdGlmaWNhdGlvbnNIYW5kbGVyUm9sZT86IGlhbS5JUm9sZTtcbn1cblxuLyoqXG4gKiBSZXByZXNlbnRzIGFuIFMzIEJ1Y2tldC5cbiAqXG4gKiBCdWNrZXRzIGNhbiBiZSBlaXRoZXIgZGVmaW5lZCB3aXRoaW4gdGhpcyBzdGFjazpcbiAqXG4gKiAgIG5ldyBCdWNrZXQodGhpcywgJ015QnVja2V0JywgeyBwcm9wcyB9KTtcbiAqXG4gKiBPciBpbXBvcnRlZCBmcm9tIGFuIGV4aXN0aW5nIGJ1Y2tldDpcbiAqXG4gKiAgIEJ1Y2tldC5pbXBvcnQodGhpcywgJ015SW1wb3J0ZWRCdWNrZXQnLCB7IGJ1Y2tldEFybjogLi4uIH0pO1xuICpcbiAqIFlvdSBjYW4gYWxzbyBleHBvcnQgYSBidWNrZXQgYW5kIGltcG9ydCBpdCBpbnRvIGFub3RoZXIgc3RhY2s6XG4gKlxuICogICBjb25zdCByZWYgPSBteUJ1Y2tldC5leHBvcnQoKTtcbiAqICAgQnVja2V0LmltcG9ydCh0aGlzLCAnTXlJbXBvcnRlZEJ1Y2tldCcsIHJlZik7XG4gKlxuICovXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgQnVja2V0QmFzZSBleHRlbmRzIFJlc291cmNlIGltcGxlbWVudHMgSUJ1Y2tldCB7XG4gIHB1YmxpYyBhYnN0cmFjdCByZWFkb25seSBidWNrZXRBcm46IHN0cmluZztcbiAgcHVibGljIGFic3RyYWN0IHJlYWRvbmx5IGJ1Y2tldE5hbWU6IHN0cmluZztcbiAgcHVibGljIGFic3RyYWN0IHJlYWRvbmx5IGJ1Y2tldERvbWFpbk5hbWU6IHN0cmluZztcbiAgcHVibGljIGFic3RyYWN0IHJlYWRvbmx5IGJ1Y2tldFdlYnNpdGVVcmw6IHN0cmluZztcbiAgcHVibGljIGFic3RyYWN0IHJlYWRvbmx5IGJ1Y2tldFdlYnNpdGVEb21haW5OYW1lOiBzdHJpbmc7XG4gIHB1YmxpYyBhYnN0cmFjdCByZWFkb25seSBidWNrZXRSZWdpb25hbERvbWFpbk5hbWU6IHN0cmluZztcbiAgcHVibGljIGFic3RyYWN0IHJlYWRvbmx5IGJ1Y2tldER1YWxTdGFja0RvbWFpbk5hbWU6IHN0cmluZztcblxuICAvKipcbiAgICogT3B0aW9uYWwgS01TIGVuY3J5cHRpb24ga2V5IGFzc29jaWF0ZWQgd2l0aCB0aGlzIGJ1Y2tldC5cbiAgICovXG4gIHB1YmxpYyBhYnN0cmFjdCByZWFkb25seSBlbmNyeXB0aW9uS2V5Pzoga21zLklLZXk7XG5cbiAgLyoqXG4gICAqIElmIHRoaXMgYnVja2V0IGhhcyBiZWVuIGNvbmZpZ3VyZWQgZm9yIHN0YXRpYyB3ZWJzaXRlIGhvc3RpbmcuXG4gICAqL1xuICBwdWJsaWMgYWJzdHJhY3QgcmVhZG9ubHkgaXNXZWJzaXRlPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogVGhlIHJlc291cmNlIHBvbGljeSBhc3NvY2lhdGVkIHdpdGggdGhpcyBidWNrZXQuXG4gICAqXG4gICAqIElmIGBhdXRvQ3JlYXRlUG9saWN5YCBpcyB0cnVlLCBhIGBCdWNrZXRQb2xpY3lgIHdpbGwgYmUgY3JlYXRlZCB1cG9uIHRoZVxuICAgKiBmaXJzdCBjYWxsIHRvIGFkZFRvUmVzb3VyY2VQb2xpY3kocykuXG4gICAqL1xuICBwdWJsaWMgYWJzdHJhY3QgcG9saWN5PzogQnVja2V0UG9saWN5O1xuXG4gIC8qKlxuICAgKiBJbmRpY2F0ZXMgaWYgYSBidWNrZXQgcmVzb3VyY2UgcG9saWN5IHNob3VsZCBhdXRvbWF0aWNhbGx5IGNyZWF0ZWQgdXBvblxuICAgKiB0aGUgZmlyc3QgY2FsbCB0byBgYWRkVG9SZXNvdXJjZVBvbGljeWAuXG4gICAqL1xuICBwcm90ZWN0ZWQgYWJzdHJhY3QgYXV0b0NyZWF0ZVBvbGljeTogYm9vbGVhbjtcblxuICAvKipcbiAgICogV2hldGhlciB0byBkaXNhbGxvdyBwdWJsaWMgYWNjZXNzXG4gICAqL1xuICBwcm90ZWN0ZWQgYWJzdHJhY3QgZGlzYWxsb3dQdWJsaWNBY2Nlc3M/OiBib29sZWFuO1xuXG4gIHByaXZhdGUgbm90aWZpY2F0aW9ucz86IEJ1Y2tldE5vdGlmaWNhdGlvbnM7XG5cbiAgcHJvdGVjdGVkIG5vdGlmaWNhdGlvbnNIYW5kbGVyUm9sZT86IGlhbS5JUm9sZTtcblxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogUmVzb3VyY2VQcm9wcyA9IHt9KSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG5cbiAgICB0aGlzLm5vZGUuYWRkVmFsaWRhdGlvbih7IHZhbGlkYXRlOiAoKSA9PiB0aGlzLnBvbGljeT8uZG9jdW1lbnQudmFsaWRhdGVGb3JSZXNvdXJjZVBvbGljeSgpID8/IFtdIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIERlZmluZSBhIENsb3VkV2F0Y2ggZXZlbnQgdGhhdCB0cmlnZ2VycyB3aGVuIHNvbWV0aGluZyBoYXBwZW5zIHRvIHRoaXMgcmVwb3NpdG9yeVxuICAgKlxuICAgKiBSZXF1aXJlcyB0aGF0IHRoZXJlIGV4aXN0cyBhdCBsZWFzdCBvbmUgQ2xvdWRUcmFpbCBUcmFpbCBpbiB5b3VyIGFjY291bnRcbiAgICogdGhhdCBjYXB0dXJlcyB0aGUgZXZlbnQuIFRoaXMgbWV0aG9kIHdpbGwgbm90IGNyZWF0ZSB0aGUgVHJhaWwuXG4gICAqXG4gICAqIEBwYXJhbSBpZCBUaGUgaWQgb2YgdGhlIHJ1bGVcbiAgICogQHBhcmFtIG9wdGlvbnMgT3B0aW9ucyBmb3IgYWRkaW5nIHRoZSBydWxlXG4gICAqL1xuICBwdWJsaWMgb25DbG91ZFRyYWlsRXZlbnQoaWQ6IHN0cmluZywgb3B0aW9uczogT25DbG91ZFRyYWlsQnVja2V0RXZlbnRPcHRpb25zID0ge30pOiBldmVudHMuUnVsZSB7XG4gICAgY29uc3QgcnVsZSA9IG5ldyBldmVudHMuUnVsZSh0aGlzLCBpZCwgb3B0aW9ucyk7XG4gICAgcnVsZS5hZGRUYXJnZXQob3B0aW9ucy50YXJnZXQpO1xuICAgIHJ1bGUuYWRkRXZlbnRQYXR0ZXJuKHtcbiAgICAgIHNvdXJjZTogWydhd3MuczMnXSxcbiAgICAgIGRldGFpbFR5cGU6IFsnQVdTIEFQSSBDYWxsIHZpYSBDbG91ZFRyYWlsJ10sXG4gICAgICBkZXRhaWw6IHtcbiAgICAgICAgcmVzb3VyY2VzOiB7XG4gICAgICAgICAgQVJOOiBvcHRpb25zLnBhdGhzPy5tYXAocCA9PiB0aGlzLmFybkZvck9iamVjdHMocCkpID8/IFt0aGlzLmJ1Y2tldEFybl0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICAgIHJldHVybiBydWxlO1xuICB9XG5cbiAgLyoqXG4gICAqIERlZmluZXMgYW4gQVdTIENsb3VkV2F0Y2ggZXZlbnQgdGhhdCB0cmlnZ2VycyB3aGVuIGFuIG9iamVjdCBpcyB1cGxvYWRlZFxuICAgKiB0byB0aGUgc3BlY2lmaWVkIHBhdGhzIChrZXlzKSBpbiB0aGlzIGJ1Y2tldCB1c2luZyB0aGUgUHV0T2JqZWN0IEFQSSBjYWxsLlxuICAgKlxuICAgKiBOb3RlIHRoYXQgc29tZSB0b29scyBsaWtlIGBhd3MgczMgY3BgIHdpbGwgYXV0b21hdGljYWxseSB1c2UgZWl0aGVyXG4gICAqIFB1dE9iamVjdCBvciB0aGUgbXVsdGlwYXJ0IHVwbG9hZCBBUEkgZGVwZW5kaW5nIG9uIHRoZSBmaWxlIHNpemUsXG4gICAqIHNvIHVzaW5nIGBvbkNsb3VkVHJhaWxXcml0ZU9iamVjdGAgbWF5IGJlIHByZWZlcmFibGUuXG4gICAqXG4gICAqIFJlcXVpcmVzIHRoYXQgdGhlcmUgZXhpc3RzIGF0IGxlYXN0IG9uZSBDbG91ZFRyYWlsIFRyYWlsIGluIHlvdXIgYWNjb3VudFxuICAgKiB0aGF0IGNhcHR1cmVzIHRoZSBldmVudC4gVGhpcyBtZXRob2Qgd2lsbCBub3QgY3JlYXRlIHRoZSBUcmFpbC5cbiAgICpcbiAgICogQHBhcmFtIGlkIFRoZSBpZCBvZiB0aGUgcnVsZVxuICAgKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zIGZvciBhZGRpbmcgdGhlIHJ1bGVcbiAgICovXG4gIHB1YmxpYyBvbkNsb3VkVHJhaWxQdXRPYmplY3QoaWQ6IHN0cmluZywgb3B0aW9uczogT25DbG91ZFRyYWlsQnVja2V0RXZlbnRPcHRpb25zID0ge30pOiBldmVudHMuUnVsZSB7XG4gICAgY29uc3QgcnVsZSA9IHRoaXMub25DbG91ZFRyYWlsRXZlbnQoaWQsIG9wdGlvbnMpO1xuICAgIHJ1bGUuYWRkRXZlbnRQYXR0ZXJuKHtcbiAgICAgIGRldGFpbDoge1xuICAgICAgICBldmVudE5hbWU6IFsnUHV0T2JqZWN0J10sXG4gICAgICB9LFxuICAgIH0pO1xuICAgIHJldHVybiBydWxlO1xuICB9XG5cbiAgLyoqXG4gICAqIERlZmluZXMgYW4gQVdTIENsb3VkV2F0Y2ggZXZlbnQgdGhhdCB0cmlnZ2VycyB3aGVuIGFuIG9iamVjdCBhdCB0aGVcbiAgICogc3BlY2lmaWVkIHBhdGhzIChrZXlzKSBpbiB0aGlzIGJ1Y2tldCBhcmUgd3JpdHRlbiB0by4gIFRoaXMgaW5jbHVkZXNcbiAgICogdGhlIGV2ZW50cyBQdXRPYmplY3QsIENvcHlPYmplY3QsIGFuZCBDb21wbGV0ZU11bHRpcGFydFVwbG9hZC5cbiAgICpcbiAgICogTm90ZSB0aGF0IHNvbWUgdG9vbHMgbGlrZSBgYXdzIHMzIGNwYCB3aWxsIGF1dG9tYXRpY2FsbHkgdXNlIGVpdGhlclxuICAgKiBQdXRPYmplY3Qgb3IgdGhlIG11bHRpcGFydCB1cGxvYWQgQVBJIGRlcGVuZGluZyBvbiB0aGUgZmlsZSBzaXplLFxuICAgKiBzbyB1c2luZyB0aGlzIG1ldGhvZCBtYXkgYmUgcHJlZmVyYWJsZSB0byBgb25DbG91ZFRyYWlsUHV0T2JqZWN0YC5cbiAgICpcbiAgICogUmVxdWlyZXMgdGhhdCB0aGVyZSBleGlzdHMgYXQgbGVhc3Qgb25lIENsb3VkVHJhaWwgVHJhaWwgaW4geW91ciBhY2NvdW50XG4gICAqIHRoYXQgY2FwdHVyZXMgdGhlIGV2ZW50LiBUaGlzIG1ldGhvZCB3aWxsIG5vdCBjcmVhdGUgdGhlIFRyYWlsLlxuICAgKlxuICAgKiBAcGFyYW0gaWQgVGhlIGlkIG9mIHRoZSBydWxlXG4gICAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbnMgZm9yIGFkZGluZyB0aGUgcnVsZVxuICAgKi9cbiAgcHVibGljIG9uQ2xvdWRUcmFpbFdyaXRlT2JqZWN0KGlkOiBzdHJpbmcsIG9wdGlvbnM6IE9uQ2xvdWRUcmFpbEJ1Y2tldEV2ZW50T3B0aW9ucyA9IHt9KTogZXZlbnRzLlJ1bGUge1xuICAgIGNvbnN0IHJ1bGUgPSB0aGlzLm9uQ2xvdWRUcmFpbEV2ZW50KGlkLCBvcHRpb25zKTtcbiAgICBydWxlLmFkZEV2ZW50UGF0dGVybih7XG4gICAgICBkZXRhaWw6IHtcbiAgICAgICAgZXZlbnROYW1lOiBbXG4gICAgICAgICAgJ0NvbXBsZXRlTXVsdGlwYXJ0VXBsb2FkJyxcbiAgICAgICAgICAnQ29weU9iamVjdCcsXG4gICAgICAgICAgJ1B1dE9iamVjdCcsXG4gICAgICAgIF0sXG4gICAgICAgIHJlcXVlc3RQYXJhbWV0ZXJzOiB7XG4gICAgICAgICAgYnVja2V0TmFtZTogW3RoaXMuYnVja2V0TmFtZV0sXG4gICAgICAgICAga2V5OiBvcHRpb25zLnBhdGhzLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgICByZXR1cm4gcnVsZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGEgc3RhdGVtZW50IHRvIHRoZSByZXNvdXJjZSBwb2xpY3kgZm9yIGEgcHJpbmNpcGFsIChpLmUuXG4gICAqIGFjY291bnQvcm9sZS9zZXJ2aWNlKSB0byBwZXJmb3JtIGFjdGlvbnMgb24gdGhpcyBidWNrZXQgYW5kL29yIGl0c1xuICAgKiBjb250ZW50cy4gVXNlIGBidWNrZXRBcm5gIGFuZCBgYXJuRm9yT2JqZWN0cyhrZXlzKWAgdG8gb2J0YWluIEFSTnMgZm9yXG4gICAqIHRoaXMgYnVja2V0IG9yIG9iamVjdHMuXG4gICAqXG4gICAqIE5vdGUgdGhhdCB0aGUgcG9saWN5IHN0YXRlbWVudCBtYXkgb3IgbWF5IG5vdCBiZSBhZGRlZCB0byB0aGUgcG9saWN5LlxuICAgKiBGb3IgZXhhbXBsZSwgd2hlbiBhbiBgSUJ1Y2tldGAgaXMgY3JlYXRlZCBmcm9tIGFuIGV4aXN0aW5nIGJ1Y2tldCxcbiAgICogaXQncyBub3QgcG9zc2libGUgdG8gdGVsbCB3aGV0aGVyIHRoZSBidWNrZXQgYWxyZWFkeSBoYXMgYSBwb2xpY3lcbiAgICogYXR0YWNoZWQsIGxldCBhbG9uZSB0byByZS11c2UgdGhhdCBwb2xpY3kgdG8gYWRkIG1vcmUgc3RhdGVtZW50cyB0byBpdC5cbiAgICogU28gaXQncyBzYWZlc3QgdG8gZG8gbm90aGluZyBpbiB0aGVzZSBjYXNlcy5cbiAgICpcbiAgICogQHBhcmFtIHBlcm1pc3Npb24gdGhlIHBvbGljeSBzdGF0ZW1lbnQgdG8gYmUgYWRkZWQgdG8gdGhlIGJ1Y2tldCdzXG4gICAqIHBvbGljeS5cbiAgICogQHJldHVybnMgbWV0YWRhdGEgYWJvdXQgdGhlIGV4ZWN1dGlvbiBvZiB0aGlzIG1ldGhvZC4gSWYgdGhlIHBvbGljeVxuICAgKiB3YXMgbm90IGFkZGVkLCB0aGUgdmFsdWUgb2YgYHN0YXRlbWVudEFkZGVkYCB3aWxsIGJlIGBmYWxzZWAuIFlvdVxuICAgKiBzaG91bGQgYWx3YXlzIGNoZWNrIHRoaXMgdmFsdWUgdG8gbWFrZSBzdXJlIHRoYXQgdGhlIG9wZXJhdGlvbiB3YXNcbiAgICogYWN0dWFsbHkgY2FycmllZCBvdXQuIE90aGVyd2lzZSwgc3ludGhlc2lzIGFuZCBkZXBsb3kgd2lsbCB0ZXJtaW5hdGVcbiAgICogc2lsZW50bHksIHdoaWNoIG1heSBiZSBjb25mdXNpbmcuXG4gICAqL1xuICBwdWJsaWMgYWRkVG9SZXNvdXJjZVBvbGljeShwZXJtaXNzaW9uOiBpYW0uUG9saWN5U3RhdGVtZW50KTogaWFtLkFkZFRvUmVzb3VyY2VQb2xpY3lSZXN1bHQge1xuICAgIGlmICghdGhpcy5wb2xpY3kgJiYgdGhpcy5hdXRvQ3JlYXRlUG9saWN5KSB7XG4gICAgICB0aGlzLnBvbGljeSA9IG5ldyBCdWNrZXRQb2xpY3kodGhpcywgJ1BvbGljeScsIHsgYnVja2V0OiB0aGlzIH0pO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnBvbGljeSkge1xuICAgICAgdGhpcy5wb2xpY3kuZG9jdW1lbnQuYWRkU3RhdGVtZW50cyhwZXJtaXNzaW9uKTtcbiAgICAgIHJldHVybiB7IHN0YXRlbWVudEFkZGVkOiB0cnVlLCBwb2xpY3lEZXBlbmRhYmxlOiB0aGlzLnBvbGljeSB9O1xuICAgIH1cblxuICAgIHJldHVybiB7IHN0YXRlbWVudEFkZGVkOiBmYWxzZSB9O1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBodHRwcyBVUkwgb2YgYW4gUzMgb2JqZWN0LiBTcGVjaWZ5IGByZWdpb25hbDogZmFsc2VgIGF0IHRoZSBvcHRpb25zXG4gICAqIGZvciBub24tcmVnaW9uYWwgVVJMcy4gRm9yIGV4YW1wbGU6XG4gICAqXG4gICAqIC0gYGh0dHBzOi8vczMudXMtd2VzdC0xLmFtYXpvbmF3cy5jb20vb25seWJ1Y2tldGBcbiAgICogLSBgaHR0cHM6Ly9zMy51cy13ZXN0LTEuYW1hem9uYXdzLmNvbS9idWNrZXQva2V5YFxuICAgKiAtIGBodHRwczovL3MzLmNuLW5vcnRoLTEuYW1hem9uYXdzLmNvbS5jbi9jaGluYS1idWNrZXQvbXlrZXlgXG4gICAqXG4gICAqIEBwYXJhbSBrZXkgVGhlIFMzIGtleSBvZiB0aGUgb2JqZWN0LiBJZiBub3Qgc3BlY2lmaWVkLCB0aGUgVVJMIG9mIHRoZVxuICAgKiAgICAgIGJ1Y2tldCBpcyByZXR1cm5lZC5cbiAgICogQHJldHVybnMgYW4gT2JqZWN0UzNVcmwgdG9rZW5cbiAgICovXG4gIHB1YmxpYyB1cmxGb3JPYmplY3Qoa2V5Pzogc3RyaW5nKTogc3RyaW5nIHtcbiAgICBjb25zdCBzdGFjayA9IFN0YWNrLm9mKHRoaXMpO1xuICAgIGNvbnN0IHByZWZpeCA9IGBodHRwczovL3MzLiR7dGhpcy5lbnYucmVnaW9ufS4ke3N0YWNrLnVybFN1ZmZpeH0vYDtcbiAgICBpZiAodHlwZW9mIGtleSAhPT0gJ3N0cmluZycpIHtcbiAgICAgIHJldHVybiB0aGlzLnVybEpvaW4ocHJlZml4LCB0aGlzLmJ1Y2tldE5hbWUpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy51cmxKb2luKHByZWZpeCwgdGhpcy5idWNrZXROYW1lLCBrZXkpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBodHRwcyBUcmFuc2ZlciBBY2NlbGVyYXRpb24gVVJMIG9mIGFuIFMzIG9iamVjdC4gU3BlY2lmeSBgZHVhbFN0YWNrOiB0cnVlYCBhdCB0aGUgb3B0aW9uc1xuICAgKiBmb3IgZHVhbC1zdGFjayBlbmRwb2ludCAoY29ubmVjdCB0byB0aGUgYnVja2V0IG92ZXIgSVB2NikuIEZvciBleGFtcGxlOlxuICAgKlxuICAgKiAtIGBodHRwczovL2J1Y2tldC5zMy1hY2NlbGVyYXRlLmFtYXpvbmF3cy5jb21gXG4gICAqIC0gYGh0dHBzOi8vYnVja2V0LnMzLWFjY2VsZXJhdGUuYW1hem9uYXdzLmNvbS9rZXlgXG4gICAqXG4gICAqIEBwYXJhbSBrZXkgVGhlIFMzIGtleSBvZiB0aGUgb2JqZWN0LiBJZiBub3Qgc3BlY2lmaWVkLCB0aGUgVVJMIG9mIHRoZVxuICAgKiAgICAgIGJ1Y2tldCBpcyByZXR1cm5lZC5cbiAgICogQHBhcmFtIG9wdGlvbnMgT3B0aW9ucyBmb3IgZ2VuZXJhdGluZyBVUkwuXG4gICAqIEByZXR1cm5zIGFuIFRyYW5zZmVyQWNjZWxlcmF0aW9uVXJsIHRva2VuXG4gICAqL1xuICBwdWJsaWMgdHJhbnNmZXJBY2NlbGVyYXRpb25VcmxGb3JPYmplY3Qoa2V5Pzogc3RyaW5nLCBvcHRpb25zPzogVHJhbnNmZXJBY2NlbGVyYXRpb25VcmxPcHRpb25zKTogc3RyaW5nIHtcbiAgICBjb25zdCBkdWFsU3RhY2sgPSBvcHRpb25zPy5kdWFsU3RhY2sgPyAnLmR1YWxzdGFjaycgOiAnJztcbiAgICBjb25zdCBwcmVmaXggPSBgaHR0cHM6Ly8ke3RoaXMuYnVja2V0TmFtZX0uczMtYWNjZWxlcmF0ZSR7ZHVhbFN0YWNrfS5hbWF6b25hd3MuY29tL2A7XG4gICAgaWYgKHR5cGVvZiBrZXkgIT09ICdzdHJpbmcnKSB7XG4gICAgICByZXR1cm4gdGhpcy51cmxKb2luKHByZWZpeCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnVybEpvaW4ocHJlZml4LCBrZXkpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSB2aXJ0dWFsIGhvc3RlZC1zdHlsZSBVUkwgb2YgYW4gUzMgb2JqZWN0LiBTcGVjaWZ5IGByZWdpb25hbDogZmFsc2VgIGF0XG4gICAqIHRoZSBvcHRpb25zIGZvciBub24tcmVnaW9uYWwgVVJMLiBGb3IgZXhhbXBsZTpcbiAgICpcbiAgICogLSBgaHR0cHM6Ly9vbmx5LWJ1Y2tldC5zMy51cy13ZXN0LTEuYW1hem9uYXdzLmNvbWBcbiAgICogLSBgaHR0cHM6Ly9idWNrZXQuczMudXMtd2VzdC0xLmFtYXpvbmF3cy5jb20va2V5YFxuICAgKiAtIGBodHRwczovL2J1Y2tldC5zMy5hbWF6b25hd3MuY29tL2tleWBcbiAgICogLSBgaHR0cHM6Ly9jaGluYS1idWNrZXQuczMuY24tbm9ydGgtMS5hbWF6b25hd3MuY29tLmNuL215a2V5YFxuICAgKlxuICAgKiBAcGFyYW0ga2V5IFRoZSBTMyBrZXkgb2YgdGhlIG9iamVjdC4gSWYgbm90IHNwZWNpZmllZCwgdGhlIFVSTCBvZiB0aGVcbiAgICogICAgICBidWNrZXQgaXMgcmV0dXJuZWQuXG4gICAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbnMgZm9yIGdlbmVyYXRpbmcgVVJMLlxuICAgKiBAcmV0dXJucyBhbiBPYmplY3RTM1VybCB0b2tlblxuICAgKi9cbiAgcHVibGljIHZpcnR1YWxIb3N0ZWRVcmxGb3JPYmplY3Qoa2V5Pzogc3RyaW5nLCBvcHRpb25zPzogVmlydHVhbEhvc3RlZFN0eWxlVXJsT3B0aW9ucyk6IHN0cmluZyB7XG4gICAgY29uc3QgZG9tYWluTmFtZSA9IG9wdGlvbnM/LnJlZ2lvbmFsID8/IHRydWUgPyB0aGlzLmJ1Y2tldFJlZ2lvbmFsRG9tYWluTmFtZSA6IHRoaXMuYnVja2V0RG9tYWluTmFtZTtcbiAgICBjb25zdCBwcmVmaXggPSBgaHR0cHM6Ly8ke2RvbWFpbk5hbWV9YDtcbiAgICBpZiAodHlwZW9mIGtleSAhPT0gJ3N0cmluZycpIHtcbiAgICAgIHJldHVybiBwcmVmaXg7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnVybEpvaW4ocHJlZml4LCBrZXkpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBTMyBVUkwgb2YgYW4gUzMgb2JqZWN0LiBGb3IgZXhhbXBsZTpcbiAgICpcbiAgICogLSBgczM6Ly9vbmx5YnVja2V0YFxuICAgKiAtIGBzMzovL2J1Y2tldC9rZXlgXG4gICAqXG4gICAqIEBwYXJhbSBrZXkgVGhlIFMzIGtleSBvZiB0aGUgb2JqZWN0LiBJZiBub3Qgc3BlY2lmaWVkLCB0aGUgUzMgVVJMIG9mIHRoZVxuICAgKiAgICAgIGJ1Y2tldCBpcyByZXR1cm5lZC5cbiAgICogQHJldHVybnMgYW4gT2JqZWN0UzNVcmwgdG9rZW5cbiAgICovXG4gIHB1YmxpYyBzM1VybEZvck9iamVjdChrZXk/OiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIGNvbnN0IHByZWZpeCA9ICdzMzovLyc7XG4gICAgaWYgKHR5cGVvZiBrZXkgIT09ICdzdHJpbmcnKSB7XG4gICAgICByZXR1cm4gdGhpcy51cmxKb2luKHByZWZpeCwgdGhpcy5idWNrZXROYW1lKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMudXJsSm9pbihwcmVmaXgsIHRoaXMuYnVja2V0TmFtZSwga2V5KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGFuIEFSTiB0aGF0IHJlcHJlc2VudHMgYWxsIG9iamVjdHMgd2l0aGluIHRoZSBidWNrZXQgdGhhdCBtYXRjaFxuICAgKiB0aGUga2V5IHBhdHRlcm4gc3BlY2lmaWVkLiBUbyByZXByZXNlbnQgYWxsIGtleXMsIHNwZWNpZnkgYGBcIipcImBgLlxuICAgKlxuICAgKiBJZiB5b3UgbmVlZCB0byBzcGVjaWZ5IGEga2V5UGF0dGVybiB3aXRoIG11bHRpcGxlIGNvbXBvbmVudHMsIGNvbmNhdGVuYXRlIHRoZW0gaW50byBhIHNpbmdsZSBzdHJpbmcsIGUuZy46XG4gICAqXG4gICAqICAgYXJuRm9yT2JqZWN0cyhgaG9tZS8ke3RlYW19LyR7dXNlcn0vKmApXG4gICAqXG4gICAqL1xuICBwdWJsaWMgYXJuRm9yT2JqZWN0cyhrZXlQYXR0ZXJuOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIHJldHVybiBgJHt0aGlzLmJ1Y2tldEFybn0vJHtrZXlQYXR0ZXJufWA7XG4gIH1cblxuICAvKipcbiAgICogR3JhbnQgcmVhZCBwZXJtaXNzaW9ucyBmb3IgdGhpcyBidWNrZXQgYW5kIGl0J3MgY29udGVudHMgdG8gYW4gSUFNXG4gICAqIHByaW5jaXBhbCAoUm9sZS9Hcm91cC9Vc2VyKS5cbiAgICpcbiAgICogSWYgZW5jcnlwdGlvbiBpcyB1c2VkLCBwZXJtaXNzaW9uIHRvIHVzZSB0aGUga2V5IHRvIGRlY3J5cHQgdGhlIGNvbnRlbnRzXG4gICAqIG9mIHRoZSBidWNrZXQgd2lsbCBhbHNvIGJlIGdyYW50ZWQgdG8gdGhlIHNhbWUgcHJpbmNpcGFsLlxuICAgKlxuICAgKiBAcGFyYW0gaWRlbnRpdHkgVGhlIHByaW5jaXBhbFxuICAgKiBAcGFyYW0gb2JqZWN0c0tleVBhdHRlcm4gUmVzdHJpY3QgdGhlIHBlcm1pc3Npb24gdG8gYSBjZXJ0YWluIGtleSBwYXR0ZXJuIChkZWZhdWx0ICcqJylcbiAgICovXG4gIHB1YmxpYyBncmFudFJlYWQoaWRlbnRpdHk6IGlhbS5JR3JhbnRhYmxlLCBvYmplY3RzS2V5UGF0dGVybjogYW55ID0gJyonKSB7XG4gICAgcmV0dXJuIHRoaXMuZ3JhbnQoaWRlbnRpdHksIHBlcm1zLkJVQ0tFVF9SRUFEX0FDVElPTlMsIHBlcm1zLktFWV9SRUFEX0FDVElPTlMsXG4gICAgICB0aGlzLmJ1Y2tldEFybixcbiAgICAgIHRoaXMuYXJuRm9yT2JqZWN0cyhvYmplY3RzS2V5UGF0dGVybikpO1xuICB9XG5cbiAgcHVibGljIGdyYW50V3JpdGUoaWRlbnRpdHk6IGlhbS5JR3JhbnRhYmxlLCBvYmplY3RzS2V5UGF0dGVybjogYW55ID0gJyonLCBhbGxvd2VkQWN0aW9uUGF0dGVybnM6IHN0cmluZ1tdID0gW10pIHtcbiAgICBjb25zdCBncmFudGVkV3JpdGVBY3Rpb25zID0gYWxsb3dlZEFjdGlvblBhdHRlcm5zLmxlbmd0aCA+IDAgPyBhbGxvd2VkQWN0aW9uUGF0dGVybnMgOiB0aGlzLndyaXRlQWN0aW9ucztcbiAgICByZXR1cm4gdGhpcy5ncmFudChpZGVudGl0eSwgZ3JhbnRlZFdyaXRlQWN0aW9ucywgcGVybXMuS0VZX1dSSVRFX0FDVElPTlMsXG4gICAgICB0aGlzLmJ1Y2tldEFybixcbiAgICAgIHRoaXMuYXJuRm9yT2JqZWN0cyhvYmplY3RzS2V5UGF0dGVybikpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdyYW50cyBzMzpQdXRPYmplY3QqIGFuZCBzMzpBYm9ydCogcGVybWlzc2lvbnMgZm9yIHRoaXMgYnVja2V0IHRvIGFuIElBTSBwcmluY2lwYWwuXG4gICAqXG4gICAqIElmIGVuY3J5cHRpb24gaXMgdXNlZCwgcGVybWlzc2lvbiB0byB1c2UgdGhlIGtleSB0byBlbmNyeXB0IHRoZSBjb250ZW50c1xuICAgKiBvZiB3cml0dGVuIGZpbGVzIHdpbGwgYWxzbyBiZSBncmFudGVkIHRvIHRoZSBzYW1lIHByaW5jaXBhbC5cbiAgICogQHBhcmFtIGlkZW50aXR5IFRoZSBwcmluY2lwYWxcbiAgICogQHBhcmFtIG9iamVjdHNLZXlQYXR0ZXJuIFJlc3RyaWN0IHRoZSBwZXJtaXNzaW9uIHRvIGEgY2VydGFpbiBrZXkgcGF0dGVybiAoZGVmYXVsdCAnKicpXG4gICAqL1xuICBwdWJsaWMgZ3JhbnRQdXQoaWRlbnRpdHk6IGlhbS5JR3JhbnRhYmxlLCBvYmplY3RzS2V5UGF0dGVybjogYW55ID0gJyonKSB7XG4gICAgcmV0dXJuIHRoaXMuZ3JhbnQoaWRlbnRpdHksIHRoaXMucHV0QWN0aW9ucywgcGVybXMuS0VZX1dSSVRFX0FDVElPTlMsXG4gICAgICB0aGlzLmFybkZvck9iamVjdHMob2JqZWN0c0tleVBhdHRlcm4pKTtcbiAgfVxuXG4gIHB1YmxpYyBncmFudFB1dEFjbChpZGVudGl0eTogaWFtLklHcmFudGFibGUsIG9iamVjdHNLZXlQYXR0ZXJuOiBzdHJpbmcgPSAnKicpIHtcbiAgICByZXR1cm4gdGhpcy5ncmFudChpZGVudGl0eSwgcGVybXMuQlVDS0VUX1BVVF9BQ0xfQUNUSU9OUywgW10sXG4gICAgICB0aGlzLmFybkZvck9iamVjdHMob2JqZWN0c0tleVBhdHRlcm4pKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHcmFudHMgczM6RGVsZXRlT2JqZWN0KiBwZXJtaXNzaW9uIHRvIGFuIElBTSBwcmluY2lwYWwgZm9yIG9iamVjdHNcbiAgICogaW4gdGhpcyBidWNrZXQuXG4gICAqXG4gICAqIEBwYXJhbSBpZGVudGl0eSBUaGUgcHJpbmNpcGFsXG4gICAqIEBwYXJhbSBvYmplY3RzS2V5UGF0dGVybiBSZXN0cmljdCB0aGUgcGVybWlzc2lvbiB0byBhIGNlcnRhaW4ga2V5IHBhdHRlcm4gKGRlZmF1bHQgJyonKVxuICAgKi9cbiAgcHVibGljIGdyYW50RGVsZXRlKGlkZW50aXR5OiBpYW0uSUdyYW50YWJsZSwgb2JqZWN0c0tleVBhdHRlcm46IGFueSA9ICcqJykge1xuICAgIHJldHVybiB0aGlzLmdyYW50KGlkZW50aXR5LCBwZXJtcy5CVUNLRVRfREVMRVRFX0FDVElPTlMsIFtdLFxuICAgICAgdGhpcy5hcm5Gb3JPYmplY3RzKG9iamVjdHNLZXlQYXR0ZXJuKSk7XG4gIH1cblxuICBwdWJsaWMgZ3JhbnRSZWFkV3JpdGUoaWRlbnRpdHk6IGlhbS5JR3JhbnRhYmxlLCBvYmplY3RzS2V5UGF0dGVybjogYW55ID0gJyonKSB7XG4gICAgY29uc3QgYnVja2V0QWN0aW9ucyA9IHBlcm1zLkJVQ0tFVF9SRUFEX0FDVElPTlMuY29uY2F0KHRoaXMud3JpdGVBY3Rpb25zKTtcbiAgICAvLyB3ZSBuZWVkIHVuaXF1ZSBwZXJtaXNzaW9ucyBiZWNhdXNlIHNvbWUgcGVybWlzc2lvbnMgYXJlIGNvbW1vbiBiZXR3ZWVuIHJlYWQgYW5kIHdyaXRlIGtleSBhY3Rpb25zXG4gICAgY29uc3Qga2V5QWN0aW9ucyA9IFsuLi5uZXcgU2V0KFsuLi5wZXJtcy5LRVlfUkVBRF9BQ1RJT05TLCAuLi5wZXJtcy5LRVlfV1JJVEVfQUNUSU9OU10pXTtcblxuICAgIHJldHVybiB0aGlzLmdyYW50KGlkZW50aXR5LFxuICAgICAgYnVja2V0QWN0aW9ucyxcbiAgICAgIGtleUFjdGlvbnMsXG4gICAgICB0aGlzLmJ1Y2tldEFybixcbiAgICAgIHRoaXMuYXJuRm9yT2JqZWN0cyhvYmplY3RzS2V5UGF0dGVybikpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFsbG93cyB1bnJlc3RyaWN0ZWQgYWNjZXNzIHRvIG9iamVjdHMgZnJvbSB0aGlzIGJ1Y2tldC5cbiAgICpcbiAgICogSU1QT1JUQU5UOiBUaGlzIHBlcm1pc3Npb24gYWxsb3dzIGFueW9uZSB0byBwZXJmb3JtIGFjdGlvbnMgb24gUzMgb2JqZWN0c1xuICAgKiBpbiB0aGlzIGJ1Y2tldCwgd2hpY2ggaXMgdXNlZnVsIGZvciB3aGVuIHlvdSBjb25maWd1cmUgeW91ciBidWNrZXQgYXMgYVxuICAgKiB3ZWJzaXRlIGFuZCB3YW50IGV2ZXJ5b25lIHRvIGJlIGFibGUgdG8gcmVhZCBvYmplY3RzIGluIHRoZSBidWNrZXQgd2l0aG91dFxuICAgKiBuZWVkaW5nIHRvIGF1dGhlbnRpY2F0ZS5cbiAgICpcbiAgICogV2l0aG91dCBhcmd1bWVudHMsIHRoaXMgbWV0aG9kIHdpbGwgZ3JhbnQgcmVhZCAoXCJzMzpHZXRPYmplY3RcIikgYWNjZXNzIHRvXG4gICAqIGFsbCBvYmplY3RzIChcIipcIikgaW4gdGhlIGJ1Y2tldC5cbiAgICpcbiAgICogVGhlIG1ldGhvZCByZXR1cm5zIHRoZSBgaWFtLkdyYW50YCBvYmplY3QsIHdoaWNoIGNhbiB0aGVuIGJlIG1vZGlmaWVkXG4gICAqIGFzIG5lZWRlZC4gRm9yIGV4YW1wbGUsIHlvdSBjYW4gYWRkIGEgY29uZGl0aW9uIHRoYXQgd2lsbCByZXN0cmljdCBhY2Nlc3Mgb25seVxuICAgKiB0byBhbiBJUHY0IHJhbmdlIGxpa2UgdGhpczpcbiAgICpcbiAgICogICAgIGNvbnN0IGdyYW50ID0gYnVja2V0LmdyYW50UHVibGljQWNjZXNzKCk7XG4gICAqICAgICBncmFudC5yZXNvdXJjZVN0YXRlbWVudCEuYWRkQ29uZGl0aW9uKOKAmElwQWRkcmVzc+KAmSwgeyDigJxhd3M6U291cmNlSXDigJ06IOKAnDU0LjI0MC4xNDMuMC8yNOKAnSB9KTtcbiAgICpcbiAgICogTm90ZSB0aGF0IGlmIHRoaXMgYElCdWNrZXRgIHJlZmVycyB0byBhbiBleGlzdGluZyBidWNrZXQsIHBvc3NpYmx5IG5vdFxuICAgKiBtYW5hZ2VkIGJ5IENsb3VkRm9ybWF0aW9uLCB0aGlzIG1ldGhvZCB3aWxsIGhhdmUgbm8gZWZmZWN0LCBzaW5jZSBpdCdzXG4gICAqIGltcG9zc2libGUgdG8gbW9kaWZ5IHRoZSBwb2xpY3kgb2YgYW4gZXhpc3RpbmcgYnVja2V0LlxuICAgKlxuICAgKiBAcGFyYW0ga2V5UHJlZml4IHRoZSBwcmVmaXggb2YgUzMgb2JqZWN0IGtleXMgKGUuZy4gYGhvbWUvKmApLiBEZWZhdWx0IGlzIFwiKlwiLlxuICAgKiBAcGFyYW0gYWxsb3dlZEFjdGlvbnMgdGhlIHNldCBvZiBTMyBhY3Rpb25zIHRvIGFsbG93LiBEZWZhdWx0IGlzIFwiczM6R2V0T2JqZWN0XCIuXG4gICAqL1xuICBwdWJsaWMgZ3JhbnRQdWJsaWNBY2Nlc3Moa2V5UHJlZml4ID0gJyonLCAuLi5hbGxvd2VkQWN0aW9uczogc3RyaW5nW10pIHtcbiAgICBpZiAodGhpcy5kaXNhbGxvd1B1YmxpY0FjY2Vzcykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGdyYW50IHB1YmxpYyBhY2Nlc3Mgd2hlbiAnYmxvY2tQdWJsaWNQb2xpY3knIGlzIGVuYWJsZWRcIik7XG4gICAgfVxuXG4gICAgYWxsb3dlZEFjdGlvbnMgPSBhbGxvd2VkQWN0aW9ucy5sZW5ndGggPiAwID8gYWxsb3dlZEFjdGlvbnMgOiBbJ3MzOkdldE9iamVjdCddO1xuXG4gICAgcmV0dXJuIGlhbS5HcmFudC5hZGRUb1ByaW5jaXBhbE9yUmVzb3VyY2Uoe1xuICAgICAgYWN0aW9uczogYWxsb3dlZEFjdGlvbnMsXG4gICAgICByZXNvdXJjZUFybnM6IFt0aGlzLmFybkZvck9iamVjdHMoa2V5UHJlZml4KV0sXG4gICAgICBncmFudGVlOiBuZXcgaWFtLkFueVByaW5jaXBhbCgpLFxuICAgICAgcmVzb3VyY2U6IHRoaXMsXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhIGJ1Y2tldCBub3RpZmljYXRpb24gZXZlbnQgZGVzdGluYXRpb24uXG4gICAqIEBwYXJhbSBldmVudCBUaGUgZXZlbnQgdG8gdHJpZ2dlciB0aGUgbm90aWZpY2F0aW9uXG4gICAqIEBwYXJhbSBkZXN0IFRoZSBub3RpZmljYXRpb24gZGVzdGluYXRpb24gKExhbWJkYSwgU05TIFRvcGljIG9yIFNRUyBRdWV1ZSlcbiAgICpcbiAgICogQHBhcmFtIGZpbHRlcnMgUzMgb2JqZWN0IGtleSBmaWx0ZXIgcnVsZXMgdG8gZGV0ZXJtaW5lIHdoaWNoIG9iamVjdHNcbiAgICogdHJpZ2dlciB0aGlzIGV2ZW50LiBFYWNoIGZpbHRlciBtdXN0IGluY2x1ZGUgYSBgcHJlZml4YCBhbmQvb3IgYHN1ZmZpeGBcbiAgICogdGhhdCB3aWxsIGJlIG1hdGNoZWQgYWdhaW5zdCB0aGUgczMgb2JqZWN0IGtleS4gUmVmZXIgdG8gdGhlIFMzIERldmVsb3BlciBHdWlkZVxuICAgKiBmb3IgZGV0YWlscyBhYm91dCBhbGxvd2VkIGZpbHRlciBydWxlcy5cbiAgICpcbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQW1hem9uUzMvbGF0ZXN0L2Rldi9Ob3RpZmljYXRpb25Ib3dUby5odG1sI25vdGlmaWNhdGlvbi1ob3ctdG8tZmlsdGVyaW5nXG4gICAqXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqICAgIGRlY2xhcmUgY29uc3QgbXlMYW1iZGE6IGxhbWJkYS5GdW5jdGlvbjtcbiAgICogICAgY29uc3QgYnVja2V0ID0gbmV3IHMzLkJ1Y2tldCh0aGlzLCAnTXlCdWNrZXQnKTtcbiAgICogICAgYnVja2V0LmFkZEV2ZW50Tm90aWZpY2F0aW9uKHMzLkV2ZW50VHlwZS5PQkpFQ1RfQ1JFQVRFRCwgbmV3IHMzbi5MYW1iZGFEZXN0aW5hdGlvbihteUxhbWJkYSksIHtwcmVmaXg6ICdob21lL215dXNlcm5hbWUvKid9KTtcbiAgICpcbiAgICogQHNlZVxuICAgKiBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQW1hem9uUzMvbGF0ZXN0L2Rldi9Ob3RpZmljYXRpb25Ib3dUby5odG1sXG4gICAqL1xuICBwdWJsaWMgYWRkRXZlbnROb3RpZmljYXRpb24oZXZlbnQ6IEV2ZW50VHlwZSwgZGVzdDogSUJ1Y2tldE5vdGlmaWNhdGlvbkRlc3RpbmF0aW9uLCAuLi5maWx0ZXJzOiBOb3RpZmljYXRpb25LZXlGaWx0ZXJbXSkge1xuICAgIHRoaXMud2l0aE5vdGlmaWNhdGlvbnMobm90aWZpY2F0aW9ucyA9PiBub3RpZmljYXRpb25zLmFkZE5vdGlmaWNhdGlvbihldmVudCwgZGVzdCwgLi4uZmlsdGVycykpO1xuICB9XG5cbiAgcHJpdmF0ZSB3aXRoTm90aWZpY2F0aW9ucyhjYjogKG5vdGlmaWNhdGlvbnM6IEJ1Y2tldE5vdGlmaWNhdGlvbnMpID0+IHZvaWQpIHtcbiAgICBpZiAoIXRoaXMubm90aWZpY2F0aW9ucykge1xuICAgICAgdGhpcy5ub3RpZmljYXRpb25zID0gbmV3IEJ1Y2tldE5vdGlmaWNhdGlvbnModGhpcywgJ05vdGlmaWNhdGlvbnMnLCB7XG4gICAgICAgIGJ1Y2tldDogdGhpcyxcbiAgICAgICAgaGFuZGxlclJvbGU6IHRoaXMubm90aWZpY2F0aW9uc0hhbmRsZXJSb2xlLFxuICAgICAgfSk7XG4gICAgfVxuICAgIGNiKHRoaXMubm90aWZpY2F0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogU3Vic2NyaWJlcyBhIGRlc3RpbmF0aW9uIHRvIHJlY2VpdmUgbm90aWZpY2F0aW9ucyB3aGVuIGFuIG9iamVjdCBpc1xuICAgKiBjcmVhdGVkIGluIHRoZSBidWNrZXQuIFRoaXMgaXMgaWRlbnRpY2FsIHRvIGNhbGxpbmdcbiAgICogYG9uRXZlbnQoRXZlbnRUeXBlLk9CSkVDVF9DUkVBVEVEKWAuXG4gICAqXG4gICAqIEBwYXJhbSBkZXN0IFRoZSBub3RpZmljYXRpb24gZGVzdGluYXRpb24gKHNlZSBvbkV2ZW50KVxuICAgKiBAcGFyYW0gZmlsdGVycyBGaWx0ZXJzIChzZWUgb25FdmVudClcbiAgICovXG4gIHB1YmxpYyBhZGRPYmplY3RDcmVhdGVkTm90aWZpY2F0aW9uKGRlc3Q6IElCdWNrZXROb3RpZmljYXRpb25EZXN0aW5hdGlvbiwgLi4uZmlsdGVyczogTm90aWZpY2F0aW9uS2V5RmlsdGVyW10pIHtcbiAgICByZXR1cm4gdGhpcy5hZGRFdmVudE5vdGlmaWNhdGlvbihFdmVudFR5cGUuT0JKRUNUX0NSRUFURUQsIGRlc3QsIC4uLmZpbHRlcnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFN1YnNjcmliZXMgYSBkZXN0aW5hdGlvbiB0byByZWNlaXZlIG5vdGlmaWNhdGlvbnMgd2hlbiBhbiBvYmplY3QgaXNcbiAgICogcmVtb3ZlZCBmcm9tIHRoZSBidWNrZXQuIFRoaXMgaXMgaWRlbnRpY2FsIHRvIGNhbGxpbmdcbiAgICogYG9uRXZlbnQoRXZlbnRUeXBlLk9CSkVDVF9SRU1PVkVEKWAuXG4gICAqXG4gICAqIEBwYXJhbSBkZXN0IFRoZSBub3RpZmljYXRpb24gZGVzdGluYXRpb24gKHNlZSBvbkV2ZW50KVxuICAgKiBAcGFyYW0gZmlsdGVycyBGaWx0ZXJzIChzZWUgb25FdmVudClcbiAgICovXG4gIHB1YmxpYyBhZGRPYmplY3RSZW1vdmVkTm90aWZpY2F0aW9uKGRlc3Q6IElCdWNrZXROb3RpZmljYXRpb25EZXN0aW5hdGlvbiwgLi4uZmlsdGVyczogTm90aWZpY2F0aW9uS2V5RmlsdGVyW10pIHtcbiAgICByZXR1cm4gdGhpcy5hZGRFdmVudE5vdGlmaWNhdGlvbihFdmVudFR5cGUuT0JKRUNUX1JFTU9WRUQsIGRlc3QsIC4uLmZpbHRlcnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEVuYWJsZXMgZXZlbnQgYnJpZGdlIG5vdGlmaWNhdGlvbiwgY2F1c2luZyBhbGwgZXZlbnRzIGJlbG93IHRvIGJlIHNlbnQgdG8gRXZlbnRCcmlkZ2U6XG4gICAqXG4gICAqIC0gT2JqZWN0IERlbGV0ZWQgKERlbGV0ZU9iamVjdClcbiAgICogLSBPYmplY3QgRGVsZXRlZCAoTGlmZWN5Y2xlIGV4cGlyYXRpb24pXG4gICAqIC0gT2JqZWN0IFJlc3RvcmUgSW5pdGlhdGVkXG4gICAqIC0gT2JqZWN0IFJlc3RvcmUgQ29tcGxldGVkXG4gICAqIC0gT2JqZWN0IFJlc3RvcmUgRXhwaXJlZFxuICAgKiAtIE9iamVjdCBTdG9yYWdlIENsYXNzIENoYW5nZWRcbiAgICogLSBPYmplY3QgQWNjZXNzIFRpZXIgQ2hhbmdlZFxuICAgKiAtIE9iamVjdCBBQ0wgVXBkYXRlZFxuICAgKiAtIE9iamVjdCBUYWdzIEFkZGVkXG4gICAqIC0gT2JqZWN0IFRhZ3MgRGVsZXRlZFxuICAgKi9cbiAgcHVibGljIGVuYWJsZUV2ZW50QnJpZGdlTm90aWZpY2F0aW9uKCkge1xuICAgIHRoaXMud2l0aE5vdGlmaWNhdGlvbnMobm90aWZpY2F0aW9ucyA9PiBub3RpZmljYXRpb25zLmVuYWJsZUV2ZW50QnJpZGdlTm90aWZpY2F0aW9uKCkpO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXQgd3JpdGVBY3Rpb25zKCk6IHN0cmluZ1tdIHtcbiAgICByZXR1cm4gW1xuICAgICAgLi4ucGVybXMuQlVDS0VUX0RFTEVURV9BQ1RJT05TLFxuICAgICAgLi4udGhpcy5wdXRBY3Rpb25zLFxuICAgIF07XG4gIH1cblxuICBwcml2YXRlIGdldCBwdXRBY3Rpb25zKCk6IHN0cmluZ1tdIHtcbiAgICByZXR1cm4gRmVhdHVyZUZsYWdzLm9mKHRoaXMpLmlzRW5hYmxlZChjeGFwaS5TM19HUkFOVF9XUklURV9XSVRIT1VUX0FDTClcbiAgICAgID8gcGVybXMuQlVDS0VUX1BVVF9BQ1RJT05TXG4gICAgICA6IHBlcm1zLkxFR0FDWV9CVUNLRVRfUFVUX0FDVElPTlM7XG4gIH1cblxuICBwcml2YXRlIHVybEpvaW4oLi4uY29tcG9uZW50czogc3RyaW5nW10pOiBzdHJpbmcge1xuICAgIHJldHVybiBjb21wb25lbnRzLnJlZHVjZSgocmVzdWx0LCBjb21wb25lbnQpID0+IHtcbiAgICAgIGlmIChyZXN1bHQuZW5kc1dpdGgoJy8nKSkge1xuICAgICAgICByZXN1bHQgPSByZXN1bHQuc2xpY2UoMCwgLTEpO1xuICAgICAgfVxuICAgICAgaWYgKGNvbXBvbmVudC5zdGFydHNXaXRoKCcvJykpIHtcbiAgICAgICAgY29tcG9uZW50ID0gY29tcG9uZW50LnNsaWNlKDEpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGAke3Jlc3VsdH0vJHtjb21wb25lbnR9YDtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgZ3JhbnQoXG4gICAgZ3JhbnRlZTogaWFtLklHcmFudGFibGUsXG4gICAgYnVja2V0QWN0aW9uczogc3RyaW5nW10sXG4gICAga2V5QWN0aW9uczogc3RyaW5nW10sXG4gICAgcmVzb3VyY2VBcm46IHN0cmluZywgLi4ub3RoZXJSZXNvdXJjZUFybnM6IHN0cmluZ1tdKSB7XG4gICAgY29uc3QgcmVzb3VyY2VzID0gW3Jlc291cmNlQXJuLCAuLi5vdGhlclJlc291cmNlQXJuc107XG5cbiAgICBjb25zdCByZXQgPSBpYW0uR3JhbnQuYWRkVG9QcmluY2lwYWxPclJlc291cmNlKHtcbiAgICAgIGdyYW50ZWUsXG4gICAgICBhY3Rpb25zOiBidWNrZXRBY3Rpb25zLFxuICAgICAgcmVzb3VyY2VBcm5zOiByZXNvdXJjZXMsXG4gICAgICByZXNvdXJjZTogdGhpcyxcbiAgICB9KTtcblxuICAgIGlmICh0aGlzLmVuY3J5cHRpb25LZXkgJiYga2V5QWN0aW9ucyAmJiBrZXlBY3Rpb25zLmxlbmd0aCAhPT0gMCkge1xuICAgICAgdGhpcy5lbmNyeXB0aW9uS2V5LmdyYW50KGdyYW50ZWUsIC4uLmtleUFjdGlvbnMpO1xuICAgIH1cblxuICAgIHJldHVybiByZXQ7XG4gIH1cbn1cblxuZXhwb3J0IGludGVyZmFjZSBCbG9ja1B1YmxpY0FjY2Vzc09wdGlvbnMge1xuICAvKipcbiAgICogV2hldGhlciB0byBibG9jayBwdWJsaWMgQUNMc1xuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BbWF6b25TMy9sYXRlc3QvZGV2L2FjY2Vzcy1jb250cm9sLWJsb2NrLXB1YmxpYy1hY2Nlc3MuaHRtbCNhY2Nlc3MtY29udHJvbC1ibG9jay1wdWJsaWMtYWNjZXNzLW9wdGlvbnNcbiAgICovXG4gIHJlYWRvbmx5IGJsb2NrUHVibGljQWNscz86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdG8gYmxvY2sgcHVibGljIHBvbGljeVxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BbWF6b25TMy9sYXRlc3QvZGV2L2FjY2Vzcy1jb250cm9sLWJsb2NrLXB1YmxpYy1hY2Nlc3MuaHRtbCNhY2Nlc3MtY29udHJvbC1ibG9jay1wdWJsaWMtYWNjZXNzLW9wdGlvbnNcbiAgICovXG4gIHJlYWRvbmx5IGJsb2NrUHVibGljUG9saWN5PzogYm9vbGVhbjtcblxuICAvKipcbiAgICogV2hldGhlciB0byBpZ25vcmUgcHVibGljIEFDTHNcbiAgICpcbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQW1hem9uUzMvbGF0ZXN0L2Rldi9hY2Nlc3MtY29udHJvbC1ibG9jay1wdWJsaWMtYWNjZXNzLmh0bWwjYWNjZXNzLWNvbnRyb2wtYmxvY2stcHVibGljLWFjY2Vzcy1vcHRpb25zXG4gICAqL1xuICByZWFkb25seSBpZ25vcmVQdWJsaWNBY2xzPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogV2hldGhlciB0byByZXN0cmljdCBwdWJsaWMgYWNjZXNzXG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FtYXpvblMzL2xhdGVzdC9kZXYvYWNjZXNzLWNvbnRyb2wtYmxvY2stcHVibGljLWFjY2Vzcy5odG1sI2FjY2Vzcy1jb250cm9sLWJsb2NrLXB1YmxpYy1hY2Nlc3Mtb3B0aW9uc1xuICAgKi9cbiAgcmVhZG9ubHkgcmVzdHJpY3RQdWJsaWNCdWNrZXRzPzogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGNsYXNzIEJsb2NrUHVibGljQWNjZXNzIHtcbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBCTE9DS19BTEwgPSBuZXcgQmxvY2tQdWJsaWNBY2Nlc3Moe1xuICAgIGJsb2NrUHVibGljQWNsczogdHJ1ZSxcbiAgICBibG9ja1B1YmxpY1BvbGljeTogdHJ1ZSxcbiAgICBpZ25vcmVQdWJsaWNBY2xzOiB0cnVlLFxuICAgIHJlc3RyaWN0UHVibGljQnVja2V0czogdHJ1ZSxcbiAgfSk7XG5cbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBCTE9DS19BQ0xTID0gbmV3IEJsb2NrUHVibGljQWNjZXNzKHtcbiAgICBibG9ja1B1YmxpY0FjbHM6IHRydWUsXG4gICAgaWdub3JlUHVibGljQWNsczogdHJ1ZSxcbiAgfSk7XG5cbiAgcHVibGljIGJsb2NrUHVibGljQWNsczogYm9vbGVhbiB8IHVuZGVmaW5lZDtcbiAgcHVibGljIGJsb2NrUHVibGljUG9saWN5OiBib29sZWFuIHwgdW5kZWZpbmVkO1xuICBwdWJsaWMgaWdub3JlUHVibGljQWNsczogYm9vbGVhbiB8IHVuZGVmaW5lZDtcbiAgcHVibGljIHJlc3RyaWN0UHVibGljQnVja2V0czogYm9vbGVhbiB8IHVuZGVmaW5lZDtcblxuICBjb25zdHJ1Y3RvcihvcHRpb25zOiBCbG9ja1B1YmxpY0FjY2Vzc09wdGlvbnMpIHtcbiAgICB0aGlzLmJsb2NrUHVibGljQWNscyA9IG9wdGlvbnMuYmxvY2tQdWJsaWNBY2xzO1xuICAgIHRoaXMuYmxvY2tQdWJsaWNQb2xpY3kgPSBvcHRpb25zLmJsb2NrUHVibGljUG9saWN5O1xuICAgIHRoaXMuaWdub3JlUHVibGljQWNscyA9IG9wdGlvbnMuaWdub3JlUHVibGljQWNscztcbiAgICB0aGlzLnJlc3RyaWN0UHVibGljQnVja2V0cyA9IG9wdGlvbnMucmVzdHJpY3RQdWJsaWNCdWNrZXRzO1xuICB9XG59XG5cbi8qKlxuICogU3BlY2lmaWVzIGEgbWV0cmljcyBjb25maWd1cmF0aW9uIGZvciB0aGUgQ2xvdWRXYXRjaCByZXF1ZXN0IG1ldHJpY3MgZnJvbSBhbiBBbWF6b24gUzMgYnVja2V0LlxuICovXG5leHBvcnQgaW50ZXJmYWNlIEJ1Y2tldE1ldHJpY3Mge1xuICAvKipcbiAgICogVGhlIElEIHVzZWQgdG8gaWRlbnRpZnkgdGhlIG1ldHJpY3MgY29uZmlndXJhdGlvbi5cbiAgICovXG4gIHJlYWRvbmx5IGlkOiBzdHJpbmc7XG4gIC8qKlxuICAgKiBUaGUgcHJlZml4IHRoYXQgYW4gb2JqZWN0IG11c3QgaGF2ZSB0byBiZSBpbmNsdWRlZCBpbiB0aGUgbWV0cmljcyByZXN1bHRzLlxuICAgKi9cbiAgcmVhZG9ubHkgcHJlZml4Pzogc3RyaW5nO1xuICAvKipcbiAgICogU3BlY2lmaWVzIGEgbGlzdCBvZiB0YWcgZmlsdGVycyB0byB1c2UgYXMgYSBtZXRyaWNzIGNvbmZpZ3VyYXRpb24gZmlsdGVyLlxuICAgKiBUaGUgbWV0cmljcyBjb25maWd1cmF0aW9uIGluY2x1ZGVzIG9ubHkgb2JqZWN0cyB0aGF0IG1lZXQgdGhlIGZpbHRlcidzIGNyaXRlcmlhLlxuICAgKi9cbiAgcmVhZG9ubHkgdGFnRmlsdGVycz86IHsgW3RhZzogc3RyaW5nXTogYW55IH07XG59XG5cbi8qKlxuICogQWxsIGh0dHAgcmVxdWVzdCBtZXRob2RzXG4gKi9cbmV4cG9ydCBlbnVtIEh0dHBNZXRob2RzIHtcbiAgLyoqXG4gICAqIFRoZSBHRVQgbWV0aG9kIHJlcXVlc3RzIGEgcmVwcmVzZW50YXRpb24gb2YgdGhlIHNwZWNpZmllZCByZXNvdXJjZS5cbiAgICovXG4gIEdFVCA9ICdHRVQnLFxuICAvKipcbiAgICogVGhlIFBVVCBtZXRob2QgcmVwbGFjZXMgYWxsIGN1cnJlbnQgcmVwcmVzZW50YXRpb25zIG9mIHRoZSB0YXJnZXQgcmVzb3VyY2Ugd2l0aCB0aGUgcmVxdWVzdCBwYXlsb2FkLlxuICAgKi9cbiAgUFVUID0gJ1BVVCcsXG4gIC8qKlxuICAgKiBUaGUgSEVBRCBtZXRob2QgYXNrcyBmb3IgYSByZXNwb25zZSBpZGVudGljYWwgdG8gdGhhdCBvZiBhIEdFVCByZXF1ZXN0LCBidXQgd2l0aG91dCB0aGUgcmVzcG9uc2UgYm9keS5cbiAgICovXG4gIEhFQUQgPSAnSEVBRCcsXG4gIC8qKlxuICAgKiBUaGUgUE9TVCBtZXRob2QgaXMgdXNlZCB0byBzdWJtaXQgYW4gZW50aXR5IHRvIHRoZSBzcGVjaWZpZWQgcmVzb3VyY2UsIG9mdGVuIGNhdXNpbmcgYSBjaGFuZ2UgaW4gc3RhdGUgb3Igc2lkZSBlZmZlY3RzIG9uIHRoZSBzZXJ2ZXIuXG4gICAqL1xuICBQT1NUID0gJ1BPU1QnLFxuICAvKipcbiAgICogVGhlIERFTEVURSBtZXRob2QgZGVsZXRlcyB0aGUgc3BlY2lmaWVkIHJlc291cmNlLlxuICAgKi9cbiAgREVMRVRFID0gJ0RFTEVURScsXG59XG5cbi8qKlxuICogU3BlY2lmaWVzIGEgY3Jvc3Mtb3JpZ2luIGFjY2VzcyBydWxlIGZvciBhbiBBbWF6b24gUzMgYnVja2V0LlxuICovXG5leHBvcnQgaW50ZXJmYWNlIENvcnNSdWxlIHtcbiAgLyoqXG4gICAqIEEgdW5pcXVlIGlkZW50aWZpZXIgZm9yIHRoaXMgcnVsZS5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBObyBpZCBzcGVjaWZpZWQuXG4gICAqL1xuICByZWFkb25seSBpZD86IHN0cmluZztcbiAgLyoqXG4gICAqIFRoZSB0aW1lIGluIHNlY29uZHMgdGhhdCB5b3VyIGJyb3dzZXIgaXMgdG8gY2FjaGUgdGhlIHByZWZsaWdodCByZXNwb25zZSBmb3IgdGhlIHNwZWNpZmllZCByZXNvdXJjZS5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBObyBjYWNoaW5nLlxuICAgKi9cbiAgcmVhZG9ubHkgbWF4QWdlPzogbnVtYmVyO1xuICAvKipcbiAgICogSGVhZGVycyB0aGF0IGFyZSBzcGVjaWZpZWQgaW4gdGhlIEFjY2Vzcy1Db250cm9sLVJlcXVlc3QtSGVhZGVycyBoZWFkZXIuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm8gaGVhZGVycyBhbGxvd2VkLlxuICAgKi9cbiAgcmVhZG9ubHkgYWxsb3dlZEhlYWRlcnM/OiBzdHJpbmdbXTtcbiAgLyoqXG4gICAqIEFuIEhUVFAgbWV0aG9kIHRoYXQgeW91IGFsbG93IHRoZSBvcmlnaW4gdG8gZXhlY3V0ZS5cbiAgICovXG4gIHJlYWRvbmx5IGFsbG93ZWRNZXRob2RzOiBIdHRwTWV0aG9kc1tdO1xuICAvKipcbiAgICogT25lIG9yIG1vcmUgb3JpZ2lucyB5b3Ugd2FudCBjdXN0b21lcnMgdG8gYmUgYWJsZSB0byBhY2Nlc3MgdGhlIGJ1Y2tldCBmcm9tLlxuICAgKi9cbiAgcmVhZG9ubHkgYWxsb3dlZE9yaWdpbnM6IHN0cmluZ1tdO1xuICAvKipcbiAgICogT25lIG9yIG1vcmUgaGVhZGVycyBpbiB0aGUgcmVzcG9uc2UgdGhhdCB5b3Ugd2FudCBjdXN0b21lcnMgdG8gYmUgYWJsZSB0byBhY2Nlc3MgZnJvbSB0aGVpciBhcHBsaWNhdGlvbnMuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm8gaGVhZGVycyBleHBvc2VkLlxuICAgKi9cbiAgcmVhZG9ubHkgZXhwb3NlZEhlYWRlcnM/OiBzdHJpbmdbXTtcbn1cblxuLyoqXG4gKiBBbGwgaHR0cCByZXF1ZXN0IG1ldGhvZHNcbiAqL1xuZXhwb3J0IGVudW0gUmVkaXJlY3RQcm90b2NvbCB7XG4gIEhUVFAgPSAnaHR0cCcsXG4gIEhUVFBTID0gJ2h0dHBzJyxcbn1cblxuLyoqXG4gKiBTcGVjaWZpZXMgYSByZWRpcmVjdCBiZWhhdmlvciBvZiBhbGwgcmVxdWVzdHMgdG8gYSB3ZWJzaXRlIGVuZHBvaW50IG9mIGEgYnVja2V0LlxuICovXG5leHBvcnQgaW50ZXJmYWNlIFJlZGlyZWN0VGFyZ2V0IHtcbiAgLyoqXG4gICAqIE5hbWUgb2YgdGhlIGhvc3Qgd2hlcmUgcmVxdWVzdHMgYXJlIHJlZGlyZWN0ZWRcbiAgICovXG4gIHJlYWRvbmx5IGhvc3ROYW1lOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFByb3RvY29sIHRvIHVzZSB3aGVuIHJlZGlyZWN0aW5nIHJlcXVlc3RzXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gVGhlIHByb3RvY29sIHVzZWQgaW4gdGhlIG9yaWdpbmFsIHJlcXVlc3QuXG4gICAqL1xuICByZWFkb25seSBwcm90b2NvbD86IFJlZGlyZWN0UHJvdG9jb2w7XG59XG5cbi8qKlxuICogQWxsIHN1cHBvcnRlZCBpbnZlbnRvcnkgbGlzdCBmb3JtYXRzLlxuICovXG5leHBvcnQgZW51bSBJbnZlbnRvcnlGb3JtYXQge1xuICAvKipcbiAgICogR2VuZXJhdGUgdGhlIGludmVudG9yeSBsaXN0IGFzIENTVi5cbiAgICovXG4gIENTViA9ICdDU1YnLFxuICAvKipcbiAgICogR2VuZXJhdGUgdGhlIGludmVudG9yeSBsaXN0IGFzIFBhcnF1ZXQuXG4gICAqL1xuICBQQVJRVUVUID0gJ1BhcnF1ZXQnLFxuICAvKipcbiAgICogR2VuZXJhdGUgdGhlIGludmVudG9yeSBsaXN0IGFzIE9SQy5cbiAgICovXG4gIE9SQyA9ICdPUkMnLFxufVxuXG4vKipcbiAqIEFsbCBzdXBwb3J0ZWQgaW52ZW50b3J5IGZyZXF1ZW5jaWVzLlxuICovXG5leHBvcnQgZW51bSBJbnZlbnRvcnlGcmVxdWVuY3kge1xuICAvKipcbiAgICogQSByZXBvcnQgaXMgZ2VuZXJhdGVkIGV2ZXJ5IGRheS5cbiAgICovXG4gIERBSUxZID0gJ0RhaWx5JyxcbiAgLyoqXG4gICAqIEEgcmVwb3J0IGlzIGdlbmVyYXRlZCBldmVyeSBTdW5kYXkgKFVUQyB0aW1lem9uZSkgYWZ0ZXIgdGhlIGluaXRpYWwgcmVwb3J0LlxuICAgKi9cbiAgV0VFS0xZID0gJ1dlZWtseSdcbn1cblxuLyoqXG4gKiBJbnZlbnRvcnkgdmVyc2lvbiBzdXBwb3J0LlxuICovXG5leHBvcnQgZW51bSBJbnZlbnRvcnlPYmplY3RWZXJzaW9uIHtcbiAgLyoqXG4gICAqIEluY2x1ZGVzIGFsbCB2ZXJzaW9ucyBvZiBlYWNoIG9iamVjdCBpbiB0aGUgcmVwb3J0LlxuICAgKi9cbiAgQUxMID0gJ0FsbCcsXG4gIC8qKlxuICAgKiBJbmNsdWRlcyBvbmx5IHRoZSBjdXJyZW50IHZlcnNpb24gb2YgZWFjaCBvYmplY3QgaW4gdGhlIHJlcG9ydC5cbiAgICovXG4gIENVUlJFTlQgPSAnQ3VycmVudCcsXG59XG5cbi8qKlxuICogVGhlIGRlc3RpbmF0aW9uIG9mIHRoZSBpbnZlbnRvcnkuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSW52ZW50b3J5RGVzdGluYXRpb24ge1xuICAvKipcbiAgICogQnVja2V0IHdoZXJlIGFsbCBpbnZlbnRvcmllcyB3aWxsIGJlIHNhdmVkIGluLlxuICAgKi9cbiAgcmVhZG9ubHkgYnVja2V0OiBJQnVja2V0O1xuICAvKipcbiAgICogVGhlIHByZWZpeCB0byBiZSB1c2VkIHdoZW4gc2F2aW5nIHRoZSBpbnZlbnRvcnkuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm8gcHJlZml4LlxuICAgKi9cbiAgcmVhZG9ubHkgcHJlZml4Pzogc3RyaW5nO1xuICAvKipcbiAgICogVGhlIGFjY291bnQgSUQgdGhhdCBvd25zIHRoZSBkZXN0aW5hdGlvbiBTMyBidWNrZXQuXG4gICAqIElmIG5vIGFjY291bnQgSUQgaXMgcHJvdmlkZWQsIHRoZSBvd25lciBpcyBub3QgdmFsaWRhdGVkIGJlZm9yZSBleHBvcnRpbmcgZGF0YS5cbiAgICogSXQncyByZWNvbW1lbmRlZCB0byBzZXQgYW4gYWNjb3VudCBJRCB0byBwcmV2ZW50IHByb2JsZW1zIGlmIHRoZSBkZXN0aW5hdGlvbiBidWNrZXQgb3duZXJzaGlwIGNoYW5nZXMuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm8gYWNjb3VudCBJRC5cbiAgICovXG4gIHJlYWRvbmx5IGJ1Y2tldE93bmVyPzogc3RyaW5nO1xufVxuXG4vKipcbiAqIFNwZWNpZmllcyB0aGUgaW52ZW50b3J5IGNvbmZpZ3VyYXRpb24gb2YgYW4gUzMgQnVja2V0LlxuICpcbiAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FtYXpvblMzL2xhdGVzdC9kZXYvc3RvcmFnZS1pbnZlbnRvcnkuaHRtbFxuICovXG5leHBvcnQgaW50ZXJmYWNlIEludmVudG9yeSB7XG4gIC8qKlxuICAgKiBUaGUgZGVzdGluYXRpb24gb2YgdGhlIGludmVudG9yeS5cbiAgICovXG4gIHJlYWRvbmx5IGRlc3RpbmF0aW9uOiBJbnZlbnRvcnlEZXN0aW5hdGlvbjtcbiAgLyoqXG4gICAqIFRoZSBpbnZlbnRvcnkgd2lsbCBvbmx5IGluY2x1ZGUgb2JqZWN0cyB0aGF0IG1lZXQgdGhlIHByZWZpeCBmaWx0ZXIgY3JpdGVyaWEuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm8gb2JqZWN0cyBwcmVmaXhcbiAgICovXG4gIHJlYWRvbmx5IG9iamVjdHNQcmVmaXg/OiBzdHJpbmc7XG4gIC8qKlxuICAgKiBUaGUgZm9ybWF0IG9mIHRoZSBpbnZlbnRvcnkuXG4gICAqXG4gICAqIEBkZWZhdWx0IEludmVudG9yeUZvcm1hdC5DU1ZcbiAgICovXG4gIHJlYWRvbmx5IGZvcm1hdD86IEludmVudG9yeUZvcm1hdDtcbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhlIGludmVudG9yeSBpcyBlbmFibGVkIG9yIGRpc2FibGVkLlxuICAgKlxuICAgKiBAZGVmYXVsdCB0cnVlXG4gICAqL1xuICByZWFkb25seSBlbmFibGVkPzogYm9vbGVhbjtcbiAgLyoqXG4gICAqIFRoZSBpbnZlbnRvcnkgY29uZmlndXJhdGlvbiBJRC5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBnZW5lcmF0ZWQgSUQuXG4gICAqL1xuICByZWFkb25seSBpbnZlbnRvcnlJZD86IHN0cmluZztcbiAgLyoqXG4gICAqIEZyZXF1ZW5jeSBhdCB3aGljaCB0aGUgaW52ZW50b3J5IHNob3VsZCBiZSBnZW5lcmF0ZWQuXG4gICAqXG4gICAqIEBkZWZhdWx0IEludmVudG9yeUZyZXF1ZW5jeS5XRUVLTFlcbiAgICovXG4gIHJlYWRvbmx5IGZyZXF1ZW5jeT86IEludmVudG9yeUZyZXF1ZW5jeTtcbiAgLyoqXG4gICAqIElmIHRoZSBpbnZlbnRvcnkgc2hvdWxkIGNvbnRhaW4gYWxsIHRoZSBvYmplY3QgdmVyc2lvbnMgb3Igb25seSB0aGUgY3VycmVudCBvbmUuXG4gICAqXG4gICAqIEBkZWZhdWx0IEludmVudG9yeU9iamVjdFZlcnNpb24uQUxMXG4gICAqL1xuICByZWFkb25seSBpbmNsdWRlT2JqZWN0VmVyc2lvbnM/OiBJbnZlbnRvcnlPYmplY3RWZXJzaW9uO1xuICAvKipcbiAgICogQSBsaXN0IG9mIG9wdGlvbmFsIGZpZWxkcyB0byBiZSBpbmNsdWRlZCBpbiB0aGUgaW52ZW50b3J5IHJlc3VsdC5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBObyBvcHRpb25hbCBmaWVsZHMuXG4gICAqL1xuICByZWFkb25seSBvcHRpb25hbEZpZWxkcz86IHN0cmluZ1tdO1xufVxuLyoqXG4gICAqIFRoZSBPYmplY3RPd25lcnNoaXAgb2YgdGhlIGJ1Y2tldC5cbiAgICpcbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQW1hem9uUzMvbGF0ZXN0L2Rldi9hYm91dC1vYmplY3Qtb3duZXJzaGlwLmh0bWxcbiAgICpcbiAgICovXG5leHBvcnQgZW51bSBPYmplY3RPd25lcnNoaXAge1xuICAvKipcbiAgICogQUNMcyBhcmUgZGlzYWJsZWQsIGFuZCB0aGUgYnVja2V0IG93bmVyIGF1dG9tYXRpY2FsbHkgb3duc1xuICAgKiBhbmQgaGFzIGZ1bGwgY29udHJvbCBvdmVyIGV2ZXJ5IG9iamVjdCBpbiB0aGUgYnVja2V0LlxuICAgKiBBQ0xzIG5vIGxvbmdlciBhZmZlY3QgcGVybWlzc2lvbnMgdG8gZGF0YSBpbiB0aGUgUzMgYnVja2V0LlxuICAgKiBUaGUgYnVja2V0IHVzZXMgcG9saWNpZXMgdG8gZGVmaW5lIGFjY2VzcyBjb250cm9sLlxuICAgKi9cbiAgQlVDS0VUX09XTkVSX0VORk9SQ0VEID0gJ0J1Y2tldE93bmVyRW5mb3JjZWQnLFxuICAvKipcbiAgICogT2JqZWN0cyB1cGxvYWRlZCB0byB0aGUgYnVja2V0IGNoYW5nZSBvd25lcnNoaXAgdG8gdGhlIGJ1Y2tldCBvd25lciAuXG4gICAqL1xuICBCVUNLRVRfT1dORVJfUFJFRkVSUkVEID0gJ0J1Y2tldE93bmVyUHJlZmVycmVkJyxcbiAgLyoqXG4gICAqIFRoZSB1cGxvYWRpbmcgYWNjb3VudCB3aWxsIG93biB0aGUgb2JqZWN0LlxuICAgKi9cbiAgT0JKRUNUX1dSSVRFUiA9ICdPYmplY3RXcml0ZXInLFxufVxuLyoqXG4gKiBUaGUgaW50ZWxsaWdlbnQgdGllcmluZyBjb25maWd1cmF0aW9uLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIEludGVsbGlnZW50VGllcmluZ0NvbmZpZ3VyYXRpb24ge1xuICAvKipcbiAgICogQ29uZmlndXJhdGlvbiBuYW1lXG4gICAqL1xuICByZWFkb25seSBuYW1lOiBzdHJpbmc7XG5cblxuICAvKipcbiAgICogQWRkIGEgZmlsdGVyIHRvIGxpbWl0IHRoZSBzY29wZSBvZiB0aGlzIGNvbmZpZ3VyYXRpb24gdG8gYSBzaW5nbGUgcHJlZml4LlxuICAgKlxuICAgKiBAZGVmYXVsdCB0aGlzIGNvbmZpZ3VyYXRpb24gd2lsbCBhcHBseSB0byAqKmFsbCoqIG9iamVjdHMgaW4gdGhlIGJ1Y2tldC5cbiAgICovXG4gIHJlYWRvbmx5IHByZWZpeD86IHN0cmluZztcblxuICAvKipcbiAgICogWW91IGNhbiBsaW1pdCB0aGUgc2NvcGUgb2YgdGhpcyBydWxlIHRvIHRoZSBrZXkgdmFsdWUgcGFpcnMgYWRkZWQgYmVsb3cuXG4gICAqXG4gICAqIEBkZWZhdWx0IE5vIGZpbHRlcmluZyB3aWxsIGJlIHBlcmZvcm1lZCBvbiB0YWdzXG4gICAqL1xuICByZWFkb25seSB0YWdzPzogVGFnW107XG5cbiAgLyoqXG4gICAqIFdoZW4gZW5hYmxlZCwgSW50ZWxsaWdlbnQtVGllcmluZyB3aWxsIGF1dG9tYXRpY2FsbHkgbW92ZSBvYmplY3RzIHRoYXRcbiAgICogaGF2ZW7igJl0IGJlZW4gYWNjZXNzZWQgZm9yIGEgbWluaW11bSBvZiA5MCBkYXlzIHRvIHRoZSBBcmNoaXZlIEFjY2VzcyB0aWVyLlxuICAgKlxuICAgKiBAZGVmYXVsdCBPYmplY3RzIHdpbGwgbm90IG1vdmUgdG8gR2xhY2llclxuICAgKi9cbiAgcmVhZG9ubHkgYXJjaGl2ZUFjY2Vzc1RpZXJUaW1lPzogRHVyYXRpb247XG5cbiAgLyoqXG4gICAqIFdoZW4gZW5hYmxlZCwgSW50ZWxsaWdlbnQtVGllcmluZyB3aWxsIGF1dG9tYXRpY2FsbHkgbW92ZSBvYmplY3RzIHRoYXRcbiAgICogaGF2ZW7igJl0IGJlZW4gYWNjZXNzZWQgZm9yIGEgbWluaW11bSBvZiAxODAgZGF5cyB0byB0aGUgRGVlcCBBcmNoaXZlIEFjY2Vzc1xuICAgKiB0aWVyLlxuICAgKlxuICAgKiBAZGVmYXVsdCBPYmplY3RzIHdpbGwgbm90IG1vdmUgdG8gR2xhY2llciBEZWVwIEFjY2Vzc1xuICAgKi9cbiAgcmVhZG9ubHkgZGVlcEFyY2hpdmVBY2Nlc3NUaWVyVGltZT86IER1cmF0aW9uO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEJ1Y2tldFByb3BzIHtcbiAgLyoqXG4gICAqIFRoZSBraW5kIG9mIHNlcnZlci1zaWRlIGVuY3J5cHRpb24gdG8gYXBwbHkgdG8gdGhpcyBidWNrZXQuXG4gICAqXG4gICAqIElmIHlvdSBjaG9vc2UgS01TLCB5b3UgY2FuIHNwZWNpZnkgYSBLTVMga2V5IHZpYSBgZW5jcnlwdGlvbktleWAuIElmXG4gICAqIGVuY3J5cHRpb24ga2V5IGlzIG5vdCBzcGVjaWZpZWQsIGEga2V5IHdpbGwgYXV0b21hdGljYWxseSBiZSBjcmVhdGVkLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIGBLbXNgIGlmIGBlbmNyeXB0aW9uS2V5YCBpcyBzcGVjaWZpZWQsIG9yIGBVbmVuY3J5cHRlZGAgb3RoZXJ3aXNlLlxuICAgKi9cbiAgcmVhZG9ubHkgZW5jcnlwdGlvbj86IEJ1Y2tldEVuY3J5cHRpb247XG5cbiAgLyoqXG4gICAqIEV4dGVybmFsIEtNUyBrZXkgdG8gdXNlIGZvciBidWNrZXQgZW5jcnlwdGlvbi5cbiAgICpcbiAgICogVGhlICdlbmNyeXB0aW9uJyBwcm9wZXJ0eSBtdXN0IGJlIGVpdGhlciBub3Qgc3BlY2lmaWVkIG9yIHNldCB0byBcIkttc1wiLlxuICAgKiBBbiBlcnJvciB3aWxsIGJlIGVtaXR0ZWQgaWYgZW5jcnlwdGlvbiBpcyBzZXQgdG8gXCJVbmVuY3J5cHRlZFwiIG9yXG4gICAqIFwiTWFuYWdlZFwiLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIElmIGVuY3J5cHRpb24gaXMgc2V0IHRvIFwiS21zXCIgYW5kIHRoaXMgcHJvcGVydHkgaXMgdW5kZWZpbmVkLFxuICAgKiBhIG5ldyBLTVMga2V5IHdpbGwgYmUgY3JlYXRlZCBhbmQgYXNzb2NpYXRlZCB3aXRoIHRoaXMgYnVja2V0LlxuICAgKi9cbiAgcmVhZG9ubHkgZW5jcnlwdGlvbktleT86IGttcy5JS2V5O1xuXG4gIC8qKlxuICAqIEVuZm9yY2VzIFNTTCBmb3IgcmVxdWVzdHMuIFMzLjUgb2YgdGhlIEFXUyBGb3VuZGF0aW9uYWwgU2VjdXJpdHkgQmVzdCBQcmFjdGljZXMgUmVnYXJkaW5nIFMzLlxuICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2NvbmZpZy9sYXRlc3QvZGV2ZWxvcGVyZ3VpZGUvczMtYnVja2V0LXNzbC1yZXF1ZXN0cy1vbmx5Lmh0bWxcbiAgKlxuICAqIEBkZWZhdWx0IGZhbHNlXG4gICovXG4gIHJlYWRvbmx5IGVuZm9yY2VTU0w/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIEFtYXpvbiBTMyBzaG91bGQgdXNlIGl0cyBvd24gaW50ZXJtZWRpYXJ5IGtleSB0byBnZW5lcmF0ZSBkYXRhIGtleXMuXG4gICAqXG4gICAqIE9ubHkgcmVsZXZhbnQgd2hlbiB1c2luZyBLTVMgZm9yIGVuY3J5cHRpb24uXG4gICAqXG4gICAqIC0gSWYgbm90IGVuYWJsZWQsIGV2ZXJ5IG9iamVjdCBHRVQgYW5kIFBVVCB3aWxsIGNhdXNlIGFuIEFQSSBjYWxsIHRvIEtNUyAod2l0aCB0aGVcbiAgICogICBhdHRlbmRhbnQgY29zdCBpbXBsaWNhdGlvbnMgb2YgdGhhdCkuXG4gICAqIC0gSWYgZW5hYmxlZCwgUzMgd2lsbCB1c2UgaXRzIG93biB0aW1lLWxpbWl0ZWQga2V5IGluc3RlYWQuXG4gICAqXG4gICAqIE9ubHkgcmVsZXZhbnQsIHdoZW4gRW5jcnlwdGlvbiBpcyBzZXQgdG8gYEJ1Y2tldEVuY3J5cHRpb24uS01TYCBvciBgQnVja2V0RW5jcnlwdGlvbi5LTVNfTUFOQUdFRGAuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gZmFsc2VcbiAgICovXG4gIHJlYWRvbmx5IGJ1Y2tldEtleUVuYWJsZWQ/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBQaHlzaWNhbCBuYW1lIG9mIHRoaXMgYnVja2V0LlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIEFzc2lnbmVkIGJ5IENsb3VkRm9ybWF0aW9uIChyZWNvbW1lbmRlZCkuXG4gICAqL1xuICByZWFkb25seSBidWNrZXROYW1lPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBQb2xpY3kgdG8gYXBwbHkgd2hlbiB0aGUgYnVja2V0IGlzIHJlbW92ZWQgZnJvbSB0aGlzIHN0YWNrLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIFRoZSBidWNrZXQgd2lsbCBiZSBvcnBoYW5lZC5cbiAgICovXG4gIHJlYWRvbmx5IHJlbW92YWxQb2xpY3k/OiBSZW1vdmFsUG9saWN5O1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIGFsbCBvYmplY3RzIHNob3VsZCBiZSBhdXRvbWF0aWNhbGx5IGRlbGV0ZWQgd2hlbiB0aGUgYnVja2V0IGlzXG4gICAqIHJlbW92ZWQgZnJvbSB0aGUgc3RhY2sgb3Igd2hlbiB0aGUgc3RhY2sgaXMgZGVsZXRlZC5cbiAgICpcbiAgICogUmVxdWlyZXMgdGhlIGByZW1vdmFsUG9saWN5YCB0byBiZSBzZXQgdG8gYFJlbW92YWxQb2xpY3kuREVTVFJPWWAuXG4gICAqXG4gICAqICoqV2FybmluZyoqIGlmIHlvdSBoYXZlIGRlcGxveWVkIGEgYnVja2V0IHdpdGggYGF1dG9EZWxldGVPYmplY3RzOiB0cnVlYCxcbiAgICogc3dpdGNoaW5nIHRoaXMgdG8gYGZhbHNlYCBpbiBhIENESyB2ZXJzaW9uICpiZWZvcmUqIGAxLjEyNi4wYCB3aWxsIGxlYWQgdG9cbiAgICogYWxsIG9iamVjdHMgaW4gdGhlIGJ1Y2tldCBiZWluZyBkZWxldGVkLiBCZSBzdXJlIHRvIHVwZGF0ZSB5b3VyIGJ1Y2tldCByZXNvdXJjZXNcbiAgICogYnkgZGVwbG95aW5nIHdpdGggQ0RLIHZlcnNpb24gYDEuMTI2LjBgIG9yIGxhdGVyICoqYmVmb3JlKiogc3dpdGNoaW5nIHRoaXMgdmFsdWUgdG8gYGZhbHNlYC5cbiAgICpcbiAgICogQGRlZmF1bHQgZmFsc2VcbiAgICovXG4gIHJlYWRvbmx5IGF1dG9EZWxldGVPYmplY3RzPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogV2hldGhlciB0aGlzIGJ1Y2tldCBzaG91bGQgaGF2ZSB2ZXJzaW9uaW5nIHR1cm5lZCBvbiBvciBub3QuXG4gICAqXG4gICAqIEBkZWZhdWx0IGZhbHNlICh1bmxlc3Mgb2JqZWN0IGxvY2sgaXMgZW5hYmxlZCwgdGhlbiB0cnVlKVxuICAgKi9cbiAgcmVhZG9ubHkgdmVyc2lvbmVkPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogRW5hYmxlIG9iamVjdCBsb2NrIG9uIHRoZSBidWNrZXQuXG4gICAqXG4gICAqIEVuYWJsaW5nIG9iamVjdCBsb2NrIGZvciBleGlzdGluZyBidWNrZXRzIGlzIG5vdCBzdXBwb3J0ZWQuIE9iamVjdCBsb2NrIG11c3QgYmVcbiAgICogZW5hYmxlZCB3aGVuIHRoZSBidWNrZXQgaXMgY3JlYXRlZC5cbiAgICpcbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQW1hem9uUzMvbGF0ZXN0L3VzZXJndWlkZS9vYmplY3QtbG9jay1vdmVydmlldy5odG1sI29iamVjdC1sb2NrLWJ1Y2tldC1jb25maWctZW5hYmxlXG4gICAqXG4gICAqIEBkZWZhdWx0IGZhbHNlLCB1bmxlc3Mgb2JqZWN0TG9ja0RlZmF1bHRSZXRlbnRpb24gaXMgc2V0ICh0aGVuLCB0cnVlKVxuICAgKi9cbiAgcmVhZG9ubHkgb2JqZWN0TG9ja0VuYWJsZWQ/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBUaGUgZGVmYXVsdCByZXRlbnRpb24gbW9kZSBhbmQgcnVsZXMgZm9yIFMzIE9iamVjdCBMb2NrLlxuICAgKlxuICAgKiBEZWZhdWx0IHJldGVudGlvbiBjYW4gYmUgY29uZmlndXJlZCBhZnRlciBhIGJ1Y2tldCBpcyBjcmVhdGVkIGlmIHRoZSBidWNrZXQgYWxyZWFkeVxuICAgKiBoYXMgb2JqZWN0IGxvY2sgZW5hYmxlZC4gRW5hYmxpbmcgb2JqZWN0IGxvY2sgZm9yIGV4aXN0aW5nIGJ1Y2tldHMgaXMgbm90IHN1cHBvcnRlZC5cbiAgICpcbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQW1hem9uUzMvbGF0ZXN0L3VzZXJndWlkZS9vYmplY3QtbG9jay1vdmVydmlldy5odG1sI29iamVjdC1sb2NrLWJ1Y2tldC1jb25maWctZW5hYmxlXG4gICAqXG4gICAqIEBkZWZhdWx0IG5vIGRlZmF1bHQgcmV0ZW50aW9uIHBlcmlvZFxuICAgKi9cbiAgcmVhZG9ubHkgb2JqZWN0TG9ja0RlZmF1bHRSZXRlbnRpb24/OiBPYmplY3RMb2NrUmV0ZW50aW9uO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoaXMgYnVja2V0IHNob3VsZCBzZW5kIG5vdGlmaWNhdGlvbnMgdG8gQW1hem9uIEV2ZW50QnJpZGdlIG9yIG5vdC5cbiAgICpcbiAgICogQGRlZmF1bHQgZmFsc2VcbiAgICovXG4gIHJlYWRvbmx5IGV2ZW50QnJpZGdlRW5hYmxlZD86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFJ1bGVzIHRoYXQgZGVmaW5lIGhvdyBBbWF6b24gUzMgbWFuYWdlcyBvYmplY3RzIGR1cmluZyB0aGVpciBsaWZldGltZS5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBObyBsaWZlY3ljbGUgcnVsZXMuXG4gICAqL1xuICByZWFkb25seSBsaWZlY3ljbGVSdWxlcz86IExpZmVjeWNsZVJ1bGVbXTtcblxuICAvKipcbiAgICogVGhlIG5hbWUgb2YgdGhlIGluZGV4IGRvY3VtZW50IChlLmcuIFwiaW5kZXguaHRtbFwiKSBmb3IgdGhlIHdlYnNpdGUuIEVuYWJsZXMgc3RhdGljIHdlYnNpdGVcbiAgICogaG9zdGluZyBmb3IgdGhpcyBidWNrZXQuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm8gaW5kZXggZG9jdW1lbnQuXG4gICAqL1xuICByZWFkb25seSB3ZWJzaXRlSW5kZXhEb2N1bWVudD86IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIG5hbWUgb2YgdGhlIGVycm9yIGRvY3VtZW50IChlLmcuIFwiNDA0Lmh0bWxcIikgZm9yIHRoZSB3ZWJzaXRlLlxuICAgKiBgd2Vic2l0ZUluZGV4RG9jdW1lbnRgIG11c3QgYWxzbyBiZSBzZXQgaWYgdGhpcyBpcyBzZXQuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm8gZXJyb3IgZG9jdW1lbnQuXG4gICAqL1xuICByZWFkb25seSB3ZWJzaXRlRXJyb3JEb2N1bWVudD86IHN0cmluZztcblxuICAvKipcbiAgICogU3BlY2lmaWVzIHRoZSByZWRpcmVjdCBiZWhhdmlvciBvZiBhbGwgcmVxdWVzdHMgdG8gYSB3ZWJzaXRlIGVuZHBvaW50IG9mIGEgYnVja2V0LlxuICAgKlxuICAgKiBJZiB5b3Ugc3BlY2lmeSB0aGlzIHByb3BlcnR5LCB5b3UgY2FuJ3Qgc3BlY2lmeSBcIndlYnNpdGVJbmRleERvY3VtZW50XCIsIFwid2Vic2l0ZUVycm9yRG9jdW1lbnRcIiBub3IgLCBcIndlYnNpdGVSb3V0aW5nUnVsZXNcIi5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBObyByZWRpcmVjdGlvbi5cbiAgICovXG4gIHJlYWRvbmx5IHdlYnNpdGVSZWRpcmVjdD86IFJlZGlyZWN0VGFyZ2V0O1xuXG4gIC8qKlxuICAgKiBSdWxlcyB0aGF0IGRlZmluZSB3aGVuIGEgcmVkaXJlY3QgaXMgYXBwbGllZCBhbmQgdGhlIHJlZGlyZWN0IGJlaGF2aW9yXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm8gcmVkaXJlY3Rpb24gcnVsZXMuXG4gICAqL1xuICByZWFkb25seSB3ZWJzaXRlUm91dGluZ1J1bGVzPzogUm91dGluZ1J1bGVbXTtcblxuICAvKipcbiAgICogU3BlY2lmaWVzIGEgY2FubmVkIEFDTCB0aGF0IGdyYW50cyBwcmVkZWZpbmVkIHBlcm1pc3Npb25zIHRvIHRoZSBidWNrZXQuXG4gICAqXG4gICAqIEBkZWZhdWx0IEJ1Y2tldEFjY2Vzc0NvbnRyb2wuUFJJVkFURVxuICAgKi9cbiAgcmVhZG9ubHkgYWNjZXNzQ29udHJvbD86IEJ1Y2tldEFjY2Vzc0NvbnRyb2w7XG5cbiAgLyoqXG4gICAqIEdyYW50cyBwdWJsaWMgcmVhZCBhY2Nlc3MgdG8gYWxsIG9iamVjdHMgaW4gdGhlIGJ1Y2tldC5cbiAgICogU2ltaWxhciB0byBjYWxsaW5nIGBidWNrZXQuZ3JhbnRQdWJsaWNBY2Nlc3MoKWBcbiAgICpcbiAgICogQGRlZmF1bHQgZmFsc2VcbiAgICovXG4gIHJlYWRvbmx5IHB1YmxpY1JlYWRBY2Nlc3M/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBUaGUgYmxvY2sgcHVibGljIGFjY2VzcyBjb25maWd1cmF0aW9uIG9mIHRoaXMgYnVja2V0LlxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BbWF6b25TMy9sYXRlc3QvZGV2L2FjY2Vzcy1jb250cm9sLWJsb2NrLXB1YmxpYy1hY2Nlc3MuaHRtbFxuICAgKlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIENsb3VkRm9ybWF0aW9uIGRlZmF1bHRzIHdpbGwgYXBwbHkuIE5ldyBidWNrZXRzIGFuZCBvYmplY3RzIGRvbid0IGFsbG93IHB1YmxpYyBhY2Nlc3MsIGJ1dCB1c2VycyBjYW4gbW9kaWZ5IGJ1Y2tldCBwb2xpY2llcyBvciBvYmplY3QgcGVybWlzc2lvbnMgdG8gYWxsb3cgcHVibGljIGFjY2Vzc1xuICAgKi9cbiAgcmVhZG9ubHkgYmxvY2tQdWJsaWNBY2Nlc3M/OiBCbG9ja1B1YmxpY0FjY2VzcztcblxuICAvKipcbiAgICogVGhlIG1ldHJpY3MgY29uZmlndXJhdGlvbiBvZiB0aGlzIGJ1Y2tldC5cbiAgICpcbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcHJvcGVydGllcy1zMy1idWNrZXQtbWV0cmljc2NvbmZpZ3VyYXRpb24uaHRtbFxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vIG1ldHJpY3MgY29uZmlndXJhdGlvbi5cbiAgICovXG4gIHJlYWRvbmx5IG1ldHJpY3M/OiBCdWNrZXRNZXRyaWNzW107XG5cbiAgLyoqXG4gICAqIFRoZSBDT1JTIGNvbmZpZ3VyYXRpb24gb2YgdGhpcyBidWNrZXQuXG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXByb3BlcnRpZXMtczMtYnVja2V0LWNvcnMuaHRtbFxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vIENPUlMgY29uZmlndXJhdGlvbi5cbiAgICovXG4gIHJlYWRvbmx5IGNvcnM/OiBDb3JzUnVsZVtdO1xuXG4gIC8qKlxuICAgKiBEZXN0aW5hdGlvbiBidWNrZXQgZm9yIHRoZSBzZXJ2ZXIgYWNjZXNzIGxvZ3MuXG4gICAqIEBkZWZhdWx0IC0gSWYgXCJzZXJ2ZXJBY2Nlc3NMb2dzUHJlZml4XCIgdW5kZWZpbmVkIC0gYWNjZXNzIGxvZ3MgZGlzYWJsZWQsIG90aGVyd2lzZSAtIGxvZyB0byBjdXJyZW50IGJ1Y2tldC5cbiAgICovXG4gIHJlYWRvbmx5IHNlcnZlckFjY2Vzc0xvZ3NCdWNrZXQ/OiBJQnVja2V0O1xuXG4gIC8qKlxuICAgKiBPcHRpb25hbCBsb2cgZmlsZSBwcmVmaXggdG8gdXNlIGZvciB0aGUgYnVja2V0J3MgYWNjZXNzIGxvZ3MuXG4gICAqIElmIGRlZmluZWQgd2l0aG91dCBcInNlcnZlckFjY2Vzc0xvZ3NCdWNrZXRcIiwgZW5hYmxlcyBhY2Nlc3MgbG9ncyB0byBjdXJyZW50IGJ1Y2tldCB3aXRoIHRoaXMgcHJlZml4LlxuICAgKiBAZGVmYXVsdCAtIE5vIGxvZyBmaWxlIHByZWZpeFxuICAgKi9cbiAgcmVhZG9ubHkgc2VydmVyQWNjZXNzTG9nc1ByZWZpeD86IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIGludmVudG9yeSBjb25maWd1cmF0aW9uIG9mIHRoZSBidWNrZXQuXG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FtYXpvblMzL2xhdGVzdC9kZXYvc3RvcmFnZS1pbnZlbnRvcnkuaHRtbFxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vIGludmVudG9yeSBjb25maWd1cmF0aW9uXG4gICAqL1xuICByZWFkb25seSBpbnZlbnRvcmllcz86IEludmVudG9yeVtdO1xuICAvKipcbiAgICogVGhlIG9iamVjdE93bmVyc2hpcCBvZiB0aGUgYnVja2V0LlxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BbWF6b25TMy9sYXRlc3QvZGV2L2Fib3V0LW9iamVjdC1vd25lcnNoaXAuaHRtbFxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vIE9iamVjdE93bmVyc2hpcCBjb25maWd1cmF0aW9uLCB1cGxvYWRpbmcgYWNjb3VudCB3aWxsIG93biB0aGUgb2JqZWN0LlxuICAgKlxuICAgKi9cbiAgcmVhZG9ubHkgb2JqZWN0T3duZXJzaGlwPzogT2JqZWN0T3duZXJzaGlwO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoaXMgYnVja2V0IHNob3VsZCBoYXZlIHRyYW5zZmVyIGFjY2VsZXJhdGlvbiB0dXJuZWQgb24gb3Igbm90LlxuICAgKlxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKi9cbiAgcmVhZG9ubHkgdHJhbnNmZXJBY2NlbGVyYXRpb24/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBUaGUgcm9sZSB0byBiZSB1c2VkIGJ5IHRoZSBub3RpZmljYXRpb25zIGhhbmRsZXJcbiAgICpcbiAgICogQGRlZmF1bHQgLSBhIG5ldyByb2xlIHdpbGwgYmUgY3JlYXRlZC5cbiAgICovXG4gIHJlYWRvbmx5IG5vdGlmaWNhdGlvbnNIYW5kbGVyUm9sZT86IGlhbS5JUm9sZTtcblxuICAvKipcbiAgICogSW50ZWxpZ2VudCBUaWVyaW5nIENvbmZpZ3VyYXRpb25zXG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FtYXpvblMzL2xhdGVzdC91c2VyZ3VpZGUvaW50ZWxsaWdlbnQtdGllcmluZy5odG1sXG4gICAqXG4gICAqIEBkZWZhdWx0IE5vIEludGVsbGlnZW50IFRpaWVyaW5nIENvbmZpZ3VyYXRpb25zLlxuICAgKi9cbiAgcmVhZG9ubHkgaW50ZWxsaWdlbnRUaWVyaW5nQ29uZmlndXJhdGlvbnM/OiBJbnRlbGxpZ2VudFRpZXJpbmdDb25maWd1cmF0aW9uW107XG59XG5cblxuLyoqXG4gKiBUYWdcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBUYWcge1xuXG4gIC8qKlxuICAgKiBrZXkgdG8gZSB0YWdnZWRcbiAgICovXG4gIHJlYWRvbmx5IGtleTogc3RyaW5nO1xuICAvKipcbiAgICogYWRkaXRpb25hbCB2YWx1ZVxuICAgKi9cbiAgcmVhZG9ubHkgdmFsdWU6IHN0cmluZztcbn1cblxuLyoqXG4gKiBBbiBTMyBidWNrZXQgd2l0aCBhc3NvY2lhdGVkIHBvbGljeSBvYmplY3RzXG4gKlxuICogVGhpcyBidWNrZXQgZG9lcyBub3QgeWV0IGhhdmUgYWxsIGZlYXR1cmVzIHRoYXQgZXhwb3NlZCBieSB0aGUgdW5kZXJseWluZ1xuICogQnVja2V0UmVzb3VyY2UuXG4gKlxuICogQGV4YW1wbGVcbiAqXG4gKiBuZXcgQnVja2V0KHNjb3BlLCAnQnVja2V0Jywge1xuICogICBibG9ja1B1YmxpY0FjY2VzczogQmxvY2tQdWJsaWNBY2Nlc3MuQkxPQ0tfQUxMLFxuICogICBlbmNyeXB0aW9uOiBCdWNrZXRFbmNyeXB0aW9uLlMzX01BTkFHRUQsXG4gKiAgIGVuZm9yY2VTU0w6IHRydWUsXG4gKiAgIHZlcnNpb25lZDogdHJ1ZSxcbiAqICAgcmVtb3ZhbFBvbGljeTogUmVtb3ZhbFBvbGljeS5SRVRBSU4sXG4gKiB9KTtcbiAqXG4gKi9cbmV4cG9ydCBjbGFzcyBCdWNrZXQgZXh0ZW5kcyBCdWNrZXRCYXNlIHtcbiAgcHVibGljIHN0YXRpYyBmcm9tQnVja2V0QXJuKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIGJ1Y2tldEFybjogc3RyaW5nKTogSUJ1Y2tldCB7XG4gICAgcmV0dXJuIEJ1Y2tldC5mcm9tQnVja2V0QXR0cmlidXRlcyhzY29wZSwgaWQsIHsgYnVja2V0QXJuIH0pO1xuICB9XG5cbiAgcHVibGljIHN0YXRpYyBmcm9tQnVja2V0TmFtZShzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBidWNrZXROYW1lOiBzdHJpbmcpOiBJQnVja2V0IHtcbiAgICByZXR1cm4gQnVja2V0LmZyb21CdWNrZXRBdHRyaWJ1dGVzKHNjb3BlLCBpZCwgeyBidWNrZXROYW1lIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBCdWNrZXQgY29uc3RydWN0IHRoYXQgcmVwcmVzZW50cyBhbiBleHRlcm5hbCBidWNrZXQuXG4gICAqXG4gICAqIEBwYXJhbSBzY29wZSBUaGUgcGFyZW50IGNyZWF0aW5nIGNvbnN0cnVjdCAodXN1YWxseSBgdGhpc2ApLlxuICAgKiBAcGFyYW0gaWQgVGhlIGNvbnN0cnVjdCdzIG5hbWUuXG4gICAqIEBwYXJhbSBhdHRycyBBIGBCdWNrZXRBdHRyaWJ1dGVzYCBvYmplY3QuIENhbiBiZSBvYnRhaW5lZCBmcm9tIGEgY2FsbCB0b1xuICAgKiBgYnVja2V0LmV4cG9ydCgpYCBvciBtYW51YWxseSBjcmVhdGVkLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tQnVja2V0QXR0cmlidXRlcyhzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBhdHRyczogQnVja2V0QXR0cmlidXRlcyk6IElCdWNrZXQge1xuICAgIGNvbnN0IHN0YWNrID0gU3RhY2sub2Yoc2NvcGUpO1xuICAgIGNvbnN0IHJlZ2lvbiA9IGF0dHJzLnJlZ2lvbiA/PyBzdGFjay5yZWdpb247XG4gICAgY29uc3QgcmVnaW9uSW5mbyA9IHJlZ2lvbkluZm9ybWF0aW9uLlJlZ2lvbkluZm8uZ2V0KHJlZ2lvbik7XG4gICAgY29uc3QgdXJsU3VmZml4ID0gcmVnaW9uSW5mby5kb21haW5TdWZmaXggPz8gc3RhY2sudXJsU3VmZml4O1xuXG4gICAgY29uc3QgYnVja2V0TmFtZSA9IHBhcnNlQnVja2V0TmFtZShzY29wZSwgYXR0cnMpO1xuICAgIGlmICghYnVja2V0TmFtZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdCdWNrZXQgbmFtZSBpcyByZXF1aXJlZCcpO1xuICAgIH1cbiAgICBCdWNrZXQudmFsaWRhdGVCdWNrZXROYW1lKGJ1Y2tldE5hbWUpO1xuXG4gICAgY29uc3Qgb2xkRW5kcG9pbnQgPSBgczMtd2Vic2l0ZS0ke3JlZ2lvbn0uJHt1cmxTdWZmaXh9YDtcbiAgICBjb25zdCBuZXdFbmRwb2ludCA9IGBzMy13ZWJzaXRlLiR7cmVnaW9ufS4ke3VybFN1ZmZpeH1gO1xuXG4gICAgbGV0IHN0YXRpY0RvbWFpbkVuZHBvaW50ID0gcmVnaW9uSW5mby5zM1N0YXRpY1dlYnNpdGVFbmRwb2ludFxuICAgICAgPz8gTGF6eS5zdHJpbmcoeyBwcm9kdWNlOiAoKSA9PiBzdGFjay5yZWdpb25hbEZhY3QocmVnaW9uSW5mb3JtYXRpb24uRmFjdE5hbWUuUzNfU1RBVElDX1dFQlNJVEVfRU5EUE9JTlQsIG5ld0VuZHBvaW50KSB9KTtcblxuICAgIC8vIERlcHJlY2F0ZWQgdXNlIG9mIGJ1Y2tldFdlYnNpdGVOZXdVcmxGb3JtYXRcbiAgICBpZiAoYXR0cnMuYnVja2V0V2Vic2l0ZU5ld1VybEZvcm1hdCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBzdGF0aWNEb21haW5FbmRwb2ludCA9IGF0dHJzLmJ1Y2tldFdlYnNpdGVOZXdVcmxGb3JtYXQgPyBuZXdFbmRwb2ludCA6IG9sZEVuZHBvaW50O1xuICAgIH1cblxuICAgIGNvbnN0IHdlYnNpdGVEb21haW4gPSBgJHtidWNrZXROYW1lfS4ke3N0YXRpY0RvbWFpbkVuZHBvaW50fWA7XG5cbiAgICBjbGFzcyBJbXBvcnQgZXh0ZW5kcyBCdWNrZXRCYXNlIHtcbiAgICAgIHB1YmxpYyByZWFkb25seSBidWNrZXROYW1lID0gYnVja2V0TmFtZSE7XG4gICAgICBwdWJsaWMgcmVhZG9ubHkgYnVja2V0QXJuID0gcGFyc2VCdWNrZXRBcm4oc2NvcGUsIGF0dHJzKTtcbiAgICAgIHB1YmxpYyByZWFkb25seSBidWNrZXREb21haW5OYW1lID0gYXR0cnMuYnVja2V0RG9tYWluTmFtZSB8fCBgJHtidWNrZXROYW1lfS5zMy4ke3VybFN1ZmZpeH1gO1xuICAgICAgcHVibGljIHJlYWRvbmx5IGJ1Y2tldFdlYnNpdGVVcmwgPSBhdHRycy5idWNrZXRXZWJzaXRlVXJsIHx8IGBodHRwOi8vJHt3ZWJzaXRlRG9tYWlufWA7XG4gICAgICBwdWJsaWMgcmVhZG9ubHkgYnVja2V0V2Vic2l0ZURvbWFpbk5hbWUgPSBhdHRycy5idWNrZXRXZWJzaXRlVXJsID8gRm4uc2VsZWN0KDIsIEZuLnNwbGl0KCcvJywgYXR0cnMuYnVja2V0V2Vic2l0ZVVybCkpIDogd2Vic2l0ZURvbWFpbjtcbiAgICAgIHB1YmxpYyByZWFkb25seSBidWNrZXRSZWdpb25hbERvbWFpbk5hbWUgPSBhdHRycy5idWNrZXRSZWdpb25hbERvbWFpbk5hbWUgfHwgYCR7YnVja2V0TmFtZX0uczMuJHtyZWdpb259LiR7dXJsU3VmZml4fWA7XG4gICAgICBwdWJsaWMgcmVhZG9ubHkgYnVja2V0RHVhbFN0YWNrRG9tYWluTmFtZSA9IGF0dHJzLmJ1Y2tldER1YWxTdGFja0RvbWFpbk5hbWUgfHwgYCR7YnVja2V0TmFtZX0uczMuZHVhbHN0YWNrLiR7cmVnaW9ufS4ke3VybFN1ZmZpeH1gO1xuICAgICAgcHVibGljIHJlYWRvbmx5IGJ1Y2tldFdlYnNpdGVOZXdVcmxGb3JtYXQgPSBhdHRycy5idWNrZXRXZWJzaXRlTmV3VXJsRm9ybWF0ID8/IGZhbHNlO1xuICAgICAgcHVibGljIHJlYWRvbmx5IGVuY3J5cHRpb25LZXkgPSBhdHRycy5lbmNyeXB0aW9uS2V5O1xuICAgICAgcHVibGljIHJlYWRvbmx5IGlzV2Vic2l0ZSA9IGF0dHJzLmlzV2Vic2l0ZSA/PyBmYWxzZTtcbiAgICAgIHB1YmxpYyBwb2xpY3k/OiBCdWNrZXRQb2xpY3kgPSB1bmRlZmluZWQ7XG4gICAgICBwcm90ZWN0ZWQgYXV0b0NyZWF0ZVBvbGljeSA9IGZhbHNlO1xuICAgICAgcHJvdGVjdGVkIGRpc2FsbG93UHVibGljQWNjZXNzID0gZmFsc2U7XG4gICAgICBwcm90ZWN0ZWQgbm90aWZpY2F0aW9uc0hhbmRsZXJSb2xlID0gYXR0cnMubm90aWZpY2F0aW9uc0hhbmRsZXJSb2xlO1xuXG4gICAgICAvKipcbiAgICAgICAqIEV4cG9ydHMgdGhpcyBidWNrZXQgZnJvbSB0aGUgc3RhY2suXG4gICAgICAgKi9cbiAgICAgIHB1YmxpYyBleHBvcnQoKSB7XG4gICAgICAgIHJldHVybiBhdHRycztcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IEltcG9ydChzY29wZSwgaWQsIHtcbiAgICAgIGFjY291bnQ6IGF0dHJzLmFjY291bnQsXG4gICAgICByZWdpb246IGF0dHJzLnJlZ2lvbixcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgYSBtdXRhYmxlIGBJQnVja2V0YCBiYXNlZCBvbiBhIGxvdy1sZXZlbCBgQ2ZuQnVja2V0YC5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZnJvbUNmbkJ1Y2tldChjZm5CdWNrZXQ6IENmbkJ1Y2tldCk6IElCdWNrZXQge1xuICAgIC8vIHVzZSBhIFwid2VpcmRcIiBpZCB0aGF0IGhhcyBhIGhpZ2hlciBjaGFuY2Ugb2YgYmVpbmcgdW5pcXVlXG4gICAgY29uc3QgaWQgPSAnQEZyb21DZm5CdWNrZXQnO1xuXG4gICAgLy8gaWYgZnJvbUNmbkJ1Y2tldCgpIHdhcyBhbHJlYWR5IGNhbGxlZCBvbiB0aGlzIGNmbkJ1Y2tldCxcbiAgICAvLyByZXR1cm4gdGhlIHNhbWUgTDJcbiAgICAvLyAoYXMgZGlmZmVyZW50IEwycyB3b3VsZCBjb25mbGljdCwgYmVjYXVzZSBvZiB0aGUgbXV0YXRpb24gb2YgdGhlIHBvbGljeSBwcm9wZXJ0eSBvZiB0aGUgTDEgYmVsb3cpXG4gICAgY29uc3QgZXhpc3RpbmcgPSBjZm5CdWNrZXQubm9kZS50cnlGaW5kQ2hpbGQoaWQpO1xuICAgIGlmIChleGlzdGluZykge1xuICAgICAgcmV0dXJuIDxJQnVja2V0PmV4aXN0aW5nO1xuICAgIH1cblxuICAgIC8vIGhhbmRsZSB0aGUgS01TIEtleSBpZiB0aGUgQnVja2V0IHJlZmVyZW5jZXMgb25lXG4gICAgbGV0IGVuY3J5cHRpb25LZXk6IGttcy5JS2V5IHwgdW5kZWZpbmVkO1xuICAgIGlmIChjZm5CdWNrZXQuYnVja2V0RW5jcnlwdGlvbikge1xuICAgICAgY29uc3Qgc2VydmVyU2lkZUVuY3J5cHRpb25Db25maWd1cmF0aW9uID0gKGNmbkJ1Y2tldC5idWNrZXRFbmNyeXB0aW9uIGFzIGFueSkuc2VydmVyU2lkZUVuY3J5cHRpb25Db25maWd1cmF0aW9uO1xuICAgICAgaWYgKEFycmF5LmlzQXJyYXkoc2VydmVyU2lkZUVuY3J5cHRpb25Db25maWd1cmF0aW9uKSAmJiBzZXJ2ZXJTaWRlRW5jcnlwdGlvbkNvbmZpZ3VyYXRpb24ubGVuZ3RoID09PSAxKSB7XG4gICAgICAgIGNvbnN0IHNlcnZlclNpZGVFbmNyeXB0aW9uUnVsZVByb3BlcnR5ID0gc2VydmVyU2lkZUVuY3J5cHRpb25Db25maWd1cmF0aW9uWzBdO1xuICAgICAgICBjb25zdCBzZXJ2ZXJTaWRlRW5jcnlwdGlvbkJ5RGVmYXVsdCA9IHNlcnZlclNpZGVFbmNyeXB0aW9uUnVsZVByb3BlcnR5LnNlcnZlclNpZGVFbmNyeXB0aW9uQnlEZWZhdWx0O1xuICAgICAgICBpZiAoc2VydmVyU2lkZUVuY3J5cHRpb25CeURlZmF1bHQgJiYgVG9rZW4uaXNVbnJlc29sdmVkKHNlcnZlclNpZGVFbmNyeXB0aW9uQnlEZWZhdWx0Lmttc01hc3RlcktleUlkKSkge1xuICAgICAgICAgIGNvbnN0IGttc0lSZXNvbHZhYmxlID0gVG9rZW5pemF0aW9uLnJldmVyc2Uoc2VydmVyU2lkZUVuY3J5cHRpb25CeURlZmF1bHQua21zTWFzdGVyS2V5SWQpO1xuICAgICAgICAgIGlmIChrbXNJUmVzb2x2YWJsZSBpbnN0YW5jZW9mIENmblJlZmVyZW5jZSkge1xuICAgICAgICAgICAgY29uc3QgY2ZuRWxlbWVudCA9IGttc0lSZXNvbHZhYmxlLnRhcmdldDtcbiAgICAgICAgICAgIGlmIChjZm5FbGVtZW50IGluc3RhbmNlb2Yga21zLkNmbktleSkge1xuICAgICAgICAgICAgICBlbmNyeXB0aW9uS2V5ID0ga21zLktleS5mcm9tQ2ZuS2V5KGNmbkVsZW1lbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBuZXcgY2xhc3MgZXh0ZW5kcyBCdWNrZXRCYXNlIHtcbiAgICAgIHB1YmxpYyByZWFkb25seSBidWNrZXRBcm4gPSBjZm5CdWNrZXQuYXR0ckFybjtcbiAgICAgIHB1YmxpYyByZWFkb25seSBidWNrZXROYW1lID0gY2ZuQnVja2V0LnJlZjtcbiAgICAgIHB1YmxpYyByZWFkb25seSBidWNrZXREb21haW5OYW1lID0gY2ZuQnVja2V0LmF0dHJEb21haW5OYW1lO1xuICAgICAgcHVibGljIHJlYWRvbmx5IGJ1Y2tldER1YWxTdGFja0RvbWFpbk5hbWUgPSBjZm5CdWNrZXQuYXR0ckR1YWxTdGFja0RvbWFpbk5hbWU7XG4gICAgICBwdWJsaWMgcmVhZG9ubHkgYnVja2V0UmVnaW9uYWxEb21haW5OYW1lID0gY2ZuQnVja2V0LmF0dHJSZWdpb25hbERvbWFpbk5hbWU7XG4gICAgICBwdWJsaWMgcmVhZG9ubHkgYnVja2V0V2Vic2l0ZVVybCA9IGNmbkJ1Y2tldC5hdHRyV2Vic2l0ZVVybDtcbiAgICAgIHB1YmxpYyByZWFkb25seSBidWNrZXRXZWJzaXRlRG9tYWluTmFtZSA9IEZuLnNlbGVjdCgyLCBGbi5zcGxpdCgnLycsIGNmbkJ1Y2tldC5hdHRyV2Vic2l0ZVVybCkpO1xuXG4gICAgICBwdWJsaWMgcmVhZG9ubHkgZW5jcnlwdGlvbktleSA9IGVuY3J5cHRpb25LZXk7XG4gICAgICBwdWJsaWMgcmVhZG9ubHkgaXNXZWJzaXRlID0gY2ZuQnVja2V0LndlYnNpdGVDb25maWd1cmF0aW9uICE9PSB1bmRlZmluZWQ7XG4gICAgICBwdWJsaWMgcG9saWN5ID0gdW5kZWZpbmVkO1xuICAgICAgcHJvdGVjdGVkIGF1dG9DcmVhdGVQb2xpY3kgPSB0cnVlO1xuICAgICAgcHJvdGVjdGVkIGRpc2FsbG93UHVibGljQWNjZXNzID0gY2ZuQnVja2V0LnB1YmxpY0FjY2Vzc0Jsb2NrQ29uZmlndXJhdGlvbiAmJlxuICAgICAgICAoY2ZuQnVja2V0LnB1YmxpY0FjY2Vzc0Jsb2NrQ29uZmlndXJhdGlvbiBhcyBhbnkpLmJsb2NrUHVibGljUG9saWN5O1xuXG4gICAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoY2ZuQnVja2V0LCBpZCk7XG5cbiAgICAgICAgdGhpcy5ub2RlLmRlZmF1bHRDaGlsZCA9IGNmbkJ1Y2tldDtcbiAgICAgIH1cbiAgICB9KCk7XG4gIH1cblxuICAvKipcbiAgICogVGhyb3duIGFuIGV4Y2VwdGlvbiBpZiB0aGUgZ2l2ZW4gYnVja2V0IG5hbWUgaXMgbm90IHZhbGlkLlxuICAgKlxuICAgKiBAcGFyYW0gcGh5c2ljYWxOYW1lIG5hbWUgb2YgdGhlIGJ1Y2tldC5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgdmFsaWRhdGVCdWNrZXROYW1lKHBoeXNpY2FsTmFtZTogc3RyaW5nKTogdm9pZCB7XG4gICAgY29uc3QgYnVja2V0TmFtZSA9IHBoeXNpY2FsTmFtZTtcbiAgICBpZiAoIWJ1Y2tldE5hbWUgfHwgVG9rZW4uaXNVbnJlc29sdmVkKGJ1Y2tldE5hbWUpKSB7XG4gICAgICAvLyB0aGUgbmFtZSBpcyBhIGxhdGUtYm91bmQgdmFsdWUsIG5vdCBhIGRlZmluZWQgc3RyaW5nLFxuICAgICAgLy8gc28gc2tpcCB2YWxpZGF0aW9uXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgZXJyb3JzOiBzdHJpbmdbXSA9IFtdO1xuXG4gICAgLy8gUnVsZXMgY29kaWZpZWQgZnJvbSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQW1hem9uUzMvbGF0ZXN0L2Rldi9CdWNrZXRSZXN0cmljdGlvbnMuaHRtbFxuICAgIGlmIChidWNrZXROYW1lLmxlbmd0aCA8IDMgfHwgYnVja2V0TmFtZS5sZW5ndGggPiA2Mykge1xuICAgICAgZXJyb3JzLnB1c2goJ0J1Y2tldCBuYW1lIG11c3QgYmUgYXQgbGVhc3QgMyBhbmQgbm8gbW9yZSB0aGFuIDYzIGNoYXJhY3RlcnMnKTtcbiAgICB9XG4gICAgY29uc3QgY2hhcnNldE1hdGNoID0gYnVja2V0TmFtZS5tYXRjaCgvW15hLXowLTkuLV0vKTtcbiAgICBpZiAoY2hhcnNldE1hdGNoKSB7XG4gICAgICBlcnJvcnMucHVzaCgnQnVja2V0IG5hbWUgbXVzdCBvbmx5IGNvbnRhaW4gbG93ZXJjYXNlIGNoYXJhY3RlcnMgYW5kIHRoZSBzeW1ib2xzLCBwZXJpb2QgKC4pIGFuZCBkYXNoICgtKSAnXG4gICAgICAgICsgYChvZmZzZXQ6ICR7Y2hhcnNldE1hdGNoLmluZGV4fSlgKTtcbiAgICB9XG4gICAgaWYgKCEvW2EtejAtOV0vLnRlc3QoYnVja2V0TmFtZS5jaGFyQXQoMCkpKSB7XG4gICAgICBlcnJvcnMucHVzaCgnQnVja2V0IG5hbWUgbXVzdCBzdGFydCBhbmQgZW5kIHdpdGggYSBsb3dlcmNhc2UgY2hhcmFjdGVyIG9yIG51bWJlciAnXG4gICAgICAgICsgJyhvZmZzZXQ6IDApJyk7XG4gICAgfVxuICAgIGlmICghL1thLXowLTldLy50ZXN0KGJ1Y2tldE5hbWUuY2hhckF0KGJ1Y2tldE5hbWUubGVuZ3RoIC0gMSkpKSB7XG4gICAgICBlcnJvcnMucHVzaCgnQnVja2V0IG5hbWUgbXVzdCBzdGFydCBhbmQgZW5kIHdpdGggYSBsb3dlcmNhc2UgY2hhcmFjdGVyIG9yIG51bWJlciAnXG4gICAgICAgICsgYChvZmZzZXQ6ICR7YnVja2V0TmFtZS5sZW5ndGggLSAxfSlgKTtcbiAgICB9XG4gICAgY29uc3QgY29uc2VjU3ltYm9sTWF0Y2ggPSBidWNrZXROYW1lLm1hdGNoKC9cXC4tfC1cXC58XFwuXFwuLyk7XG4gICAgaWYgKGNvbnNlY1N5bWJvbE1hdGNoKSB7XG4gICAgICBlcnJvcnMucHVzaCgnQnVja2V0IG5hbWUgbXVzdCBub3QgaGF2ZSBkYXNoIG5leHQgdG8gcGVyaW9kLCBvciBwZXJpb2QgbmV4dCB0byBkYXNoLCBvciBjb25zZWN1dGl2ZSBwZXJpb2RzICdcbiAgICAgICAgKyBgKG9mZnNldDogJHtjb25zZWNTeW1ib2xNYXRjaC5pbmRleH0pYCk7XG4gICAgfVxuICAgIGlmICgvXlxcZHsxLDN9XFwuXFxkezEsM31cXC5cXGR7MSwzfVxcLlxcZHsxLDN9JC8udGVzdChidWNrZXROYW1lKSkge1xuICAgICAgZXJyb3JzLnB1c2goJ0J1Y2tldCBuYW1lIG11c3Qgbm90IHJlc2VtYmxlIGFuIElQIGFkZHJlc3MnKTtcbiAgICB9XG5cbiAgICBpZiAoZXJyb3JzLmxlbmd0aCA+IDApIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBTMyBidWNrZXQgbmFtZSAodmFsdWU6ICR7YnVja2V0TmFtZX0pJHtFT0x9JHtlcnJvcnMuam9pbihFT0wpfWApO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyByZWFkb25seSBidWNrZXRBcm46IHN0cmluZztcbiAgcHVibGljIHJlYWRvbmx5IGJ1Y2tldE5hbWU6IHN0cmluZztcbiAgcHVibGljIHJlYWRvbmx5IGJ1Y2tldERvbWFpbk5hbWU6IHN0cmluZztcbiAgcHVibGljIHJlYWRvbmx5IGJ1Y2tldFdlYnNpdGVVcmw6IHN0cmluZztcbiAgcHVibGljIHJlYWRvbmx5IGJ1Y2tldFdlYnNpdGVEb21haW5OYW1lOiBzdHJpbmc7XG4gIHB1YmxpYyByZWFkb25seSBidWNrZXREdWFsU3RhY2tEb21haW5OYW1lOiBzdHJpbmc7XG4gIHB1YmxpYyByZWFkb25seSBidWNrZXRSZWdpb25hbERvbWFpbk5hbWU6IHN0cmluZztcblxuICBwdWJsaWMgcmVhZG9ubHkgZW5jcnlwdGlvbktleT86IGttcy5JS2V5O1xuICBwdWJsaWMgcmVhZG9ubHkgaXNXZWJzaXRlPzogYm9vbGVhbjtcbiAgcHVibGljIHBvbGljeT86IEJ1Y2tldFBvbGljeTtcbiAgcHJvdGVjdGVkIGF1dG9DcmVhdGVQb2xpY3kgPSB0cnVlO1xuICBwcm90ZWN0ZWQgZGlzYWxsb3dQdWJsaWNBY2Nlc3M/OiBib29sZWFuO1xuICBwcml2YXRlIGFjY2Vzc0NvbnRyb2w/OiBCdWNrZXRBY2Nlc3NDb250cm9sO1xuICBwcml2YXRlIHJlYWRvbmx5IGxpZmVjeWNsZVJ1bGVzOiBMaWZlY3ljbGVSdWxlW10gPSBbXTtcbiAgcHJpdmF0ZSByZWFkb25seSBldmVudEJyaWRnZUVuYWJsZWQ/OiBib29sZWFuO1xuICBwcml2YXRlIHJlYWRvbmx5IG1ldHJpY3M6IEJ1Y2tldE1ldHJpY3NbXSA9IFtdO1xuICBwcml2YXRlIHJlYWRvbmx5IGNvcnM6IENvcnNSdWxlW10gPSBbXTtcbiAgcHJpdmF0ZSByZWFkb25seSBpbnZlbnRvcmllczogSW52ZW50b3J5W10gPSBbXTtcbiAgcHJpdmF0ZSByZWFkb25seSBfcmVzb3VyY2U6IENmbkJ1Y2tldDtcblxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogQnVja2V0UHJvcHMgPSB7fSkge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwge1xuICAgICAgcGh5c2ljYWxOYW1lOiBwcm9wcy5idWNrZXROYW1lLFxuICAgIH0pO1xuXG4gICAgdGhpcy5ub3RpZmljYXRpb25zSGFuZGxlclJvbGUgPSBwcm9wcy5ub3RpZmljYXRpb25zSGFuZGxlclJvbGU7XG5cbiAgICBjb25zdCB7IGJ1Y2tldEVuY3J5cHRpb24sIGVuY3J5cHRpb25LZXkgfSA9IHRoaXMucGFyc2VFbmNyeXB0aW9uKHByb3BzKTtcblxuICAgIEJ1Y2tldC52YWxpZGF0ZUJ1Y2tldE5hbWUodGhpcy5waHlzaWNhbE5hbWUpO1xuXG4gICAgY29uc3Qgd2Vic2l0ZUNvbmZpZ3VyYXRpb24gPSB0aGlzLnJlbmRlcldlYnNpdGVDb25maWd1cmF0aW9uKHByb3BzKTtcbiAgICB0aGlzLmlzV2Vic2l0ZSA9ICh3ZWJzaXRlQ29uZmlndXJhdGlvbiAhPT0gdW5kZWZpbmVkKTtcblxuICAgIGNvbnN0IG9iamVjdExvY2tDb25maWd1cmF0aW9uID0gdGhpcy5wYXJzZU9iamVjdExvY2tDb25maWcocHJvcHMpO1xuXG4gICAgY29uc3QgcmVzb3VyY2UgPSBuZXcgQ2ZuQnVja2V0KHRoaXMsICdSZXNvdXJjZScsIHtcbiAgICAgIGJ1Y2tldE5hbWU6IHRoaXMucGh5c2ljYWxOYW1lLFxuICAgICAgYnVja2V0RW5jcnlwdGlvbixcbiAgICAgIHZlcnNpb25pbmdDb25maWd1cmF0aW9uOiBwcm9wcy52ZXJzaW9uZWQgPyB7IHN0YXR1czogJ0VuYWJsZWQnIH0gOiB1bmRlZmluZWQsXG4gICAgICBsaWZlY3ljbGVDb25maWd1cmF0aW9uOiBMYXp5LmFueSh7IHByb2R1Y2U6ICgpID0+IHRoaXMucGFyc2VMaWZlY3ljbGVDb25maWd1cmF0aW9uKCkgfSksXG4gICAgICB3ZWJzaXRlQ29uZmlndXJhdGlvbixcbiAgICAgIHB1YmxpY0FjY2Vzc0Jsb2NrQ29uZmlndXJhdGlvbjogcHJvcHMuYmxvY2tQdWJsaWNBY2Nlc3MsXG4gICAgICBtZXRyaWNzQ29uZmlndXJhdGlvbnM6IExhenkuYW55KHsgcHJvZHVjZTogKCkgPT4gdGhpcy5wYXJzZU1ldHJpY0NvbmZpZ3VyYXRpb24oKSB9KSxcbiAgICAgIGNvcnNDb25maWd1cmF0aW9uOiBMYXp5LmFueSh7IHByb2R1Y2U6ICgpID0+IHRoaXMucGFyc2VDb3JzQ29uZmlndXJhdGlvbigpIH0pLFxuICAgICAgYWNjZXNzQ29udHJvbDogTGF6eS5zdHJpbmcoeyBwcm9kdWNlOiAoKSA9PiB0aGlzLmFjY2Vzc0NvbnRyb2wgfSksXG4gICAgICBsb2dnaW5nQ29uZmlndXJhdGlvbjogdGhpcy5wYXJzZVNlcnZlckFjY2Vzc0xvZ3MocHJvcHMpLFxuICAgICAgaW52ZW50b3J5Q29uZmlndXJhdGlvbnM6IExhenkuYW55KHsgcHJvZHVjZTogKCkgPT4gdGhpcy5wYXJzZUludmVudG9yeUNvbmZpZ3VyYXRpb24oKSB9KSxcbiAgICAgIG93bmVyc2hpcENvbnRyb2xzOiB0aGlzLnBhcnNlT3duZXJzaGlwQ29udHJvbHMocHJvcHMpLFxuICAgICAgYWNjZWxlcmF0ZUNvbmZpZ3VyYXRpb246IHByb3BzLnRyYW5zZmVyQWNjZWxlcmF0aW9uID8geyBhY2NlbGVyYXRpb25TdGF0dXM6ICdFbmFibGVkJyB9IDogdW5kZWZpbmVkLFxuICAgICAgaW50ZWxsaWdlbnRUaWVyaW5nQ29uZmlndXJhdGlvbnM6IHRoaXMucGFyc2VUaWVyaW5nQ29uZmlnKHByb3BzKSxcbiAgICAgIG9iamVjdExvY2tFbmFibGVkOiBvYmplY3RMb2NrQ29uZmlndXJhdGlvbiA/IHRydWUgOiBwcm9wcy5vYmplY3RMb2NrRW5hYmxlZCxcbiAgICAgIG9iamVjdExvY2tDb25maWd1cmF0aW9uOiBvYmplY3RMb2NrQ29uZmlndXJhdGlvbixcbiAgICB9KTtcbiAgICB0aGlzLl9yZXNvdXJjZSA9IHJlc291cmNlO1xuXG4gICAgcmVzb3VyY2UuYXBwbHlSZW1vdmFsUG9saWN5KHByb3BzLnJlbW92YWxQb2xpY3kpO1xuXG4gICAgdGhpcy5lbmNyeXB0aW9uS2V5ID0gZW5jcnlwdGlvbktleTtcbiAgICB0aGlzLmV2ZW50QnJpZGdlRW5hYmxlZCA9IHByb3BzLmV2ZW50QnJpZGdlRW5hYmxlZDtcblxuICAgIHRoaXMuYnVja2V0TmFtZSA9IHRoaXMuZ2V0UmVzb3VyY2VOYW1lQXR0cmlidXRlKHJlc291cmNlLnJlZik7XG4gICAgdGhpcy5idWNrZXRBcm4gPSB0aGlzLmdldFJlc291cmNlQXJuQXR0cmlidXRlKHJlc291cmNlLmF0dHJBcm4sIHtcbiAgICAgIHJlZ2lvbjogJycsXG4gICAgICBhY2NvdW50OiAnJyxcbiAgICAgIHNlcnZpY2U6ICdzMycsXG4gICAgICByZXNvdXJjZTogdGhpcy5waHlzaWNhbE5hbWUsXG4gICAgfSk7XG5cbiAgICB0aGlzLmJ1Y2tldERvbWFpbk5hbWUgPSByZXNvdXJjZS5hdHRyRG9tYWluTmFtZTtcbiAgICB0aGlzLmJ1Y2tldFdlYnNpdGVVcmwgPSByZXNvdXJjZS5hdHRyV2Vic2l0ZVVybDtcbiAgICB0aGlzLmJ1Y2tldFdlYnNpdGVEb21haW5OYW1lID0gRm4uc2VsZWN0KDIsIEZuLnNwbGl0KCcvJywgdGhpcy5idWNrZXRXZWJzaXRlVXJsKSk7XG4gICAgdGhpcy5idWNrZXREdWFsU3RhY2tEb21haW5OYW1lID0gcmVzb3VyY2UuYXR0ckR1YWxTdGFja0RvbWFpbk5hbWU7XG4gICAgdGhpcy5idWNrZXRSZWdpb25hbERvbWFpbk5hbWUgPSByZXNvdXJjZS5hdHRyUmVnaW9uYWxEb21haW5OYW1lO1xuXG4gICAgdGhpcy5kaXNhbGxvd1B1YmxpY0FjY2VzcyA9IHByb3BzLmJsb2NrUHVibGljQWNjZXNzICYmIHByb3BzLmJsb2NrUHVibGljQWNjZXNzLmJsb2NrUHVibGljUG9saWN5O1xuICAgIHRoaXMuYWNjZXNzQ29udHJvbCA9IHByb3BzLmFjY2Vzc0NvbnRyb2w7XG5cbiAgICAvLyBFbmZvcmNlIEFXUyBGb3VuZGF0aW9uYWwgU2VjdXJpdHkgQmVzdCBQcmFjdGljZVxuICAgIGlmIChwcm9wcy5lbmZvcmNlU1NMKSB7XG4gICAgICB0aGlzLmVuZm9yY2VTU0xTdGF0ZW1lbnQoKTtcbiAgICB9XG5cbiAgICBpZiAocHJvcHMuc2VydmVyQWNjZXNzTG9nc0J1Y2tldCBpbnN0YW5jZW9mIEJ1Y2tldCkge1xuICAgICAgcHJvcHMuc2VydmVyQWNjZXNzTG9nc0J1Y2tldC5hbGxvd0xvZ0RlbGl2ZXJ5KHRoaXMsIHByb3BzLnNlcnZlckFjY2Vzc0xvZ3NQcmVmaXgpO1xuICAgIC8vIEl0IGlzIHBvc3NpYmxlIHRoYXQgYHNlcnZlckFjY2Vzc0xvZ3NCdWNrZXRgIHdhcyBzcGVjaWZpZWQgYnV0IGlzIHNvbWUgb3RoZXIgYElCdWNrZXRgXG4gICAgLy8gdGhhdCBjYW5ub3QgaGF2ZSB0aGUgQUNMcyBvciBidWNrZXQgcG9saWN5IGFwcGxpZWQuIEluIHRoYXQgc2NlbmFyaW8sIHdlIHNob3VsZCBvbmx5XG4gICAgLy8gc2V0dXAgbG9nIGRlbGl2ZXJ5IHBlcm1pc3Npb25zIHRvIGB0aGlzYCBpZiBhIGJ1Y2tldCB3YXMgbm90IHNwZWNpZmllZCBhdCBhbGwsIGFzIGRvY3VtZW50ZWQuXG4gICAgLy8gRm9yIGV4YW1wbGUsIHdlIHNob3VsZCBub3QgYWxsb3cgbG9nIGRlbGl2ZXJ5IHRvIGB0aGlzYCBpZiBnaXZlbiBhbiBpbXBvcnRlZCBidWNrZXQgb3JcbiAgICAvLyBhbm90aGVyIHNpdHVhdGlvbiB0aGF0IGNhdXNlcyBgaW5zdGFuY2VvZmAgdG8gZmFpbFxuICAgIH0gZWxzZSBpZiAoIXByb3BzLnNlcnZlckFjY2Vzc0xvZ3NCdWNrZXQgJiYgcHJvcHMuc2VydmVyQWNjZXNzTG9nc1ByZWZpeCkge1xuICAgICAgdGhpcy5hbGxvd0xvZ0RlbGl2ZXJ5KHRoaXMsIHByb3BzLnNlcnZlckFjY2Vzc0xvZ3NQcmVmaXgpO1xuICAgIH0gZWxzZSBpZiAocHJvcHMuc2VydmVyQWNjZXNzTG9nc0J1Y2tldCkge1xuICAgICAgLy8gQSBgc2VydmVyQWNjZXNzTG9nc0J1Y2tldGAgd2FzIHByb3ZpZGVkIGJ1dCBpdCBpcyBub3QgYSBjb25jcmV0ZSBgQnVja2V0YCBhbmQgaXRcbiAgICAgIC8vIG1heSBub3QgYmUgcG9zc2libGUgdG8gY29uZmlndXJlIHRoZSBBQ0xzIG9yIGJ1Y2tldCBwb2xpY3kgYXMgcmVxdWlyZWQuXG4gICAgICBBbm5vdGF0aW9ucy5vZih0aGlzKS5hZGRXYXJuaW5nKFxuICAgICAgICBgVW5hYmxlIHRvIGFkZCBuZWNlc3NhcnkgbG9nZ2luZyBwZXJtaXNzaW9ucyB0byBpbXBvcnRlZCB0YXJnZXQgYnVja2V0OiAke3Byb3BzLnNlcnZlckFjY2Vzc0xvZ3NCdWNrZXR9YCxcbiAgICAgICk7XG4gICAgfVxuXG4gICAgZm9yIChjb25zdCBpbnZlbnRvcnkgb2YgcHJvcHMuaW52ZW50b3JpZXMgPz8gW10pIHtcbiAgICAgIHRoaXMuYWRkSW52ZW50b3J5KGludmVudG9yeSk7XG4gICAgfVxuXG4gICAgLy8gQWRkIGFsbCBidWNrZXQgbWV0cmljIGNvbmZpZ3VyYXRpb25zIHJ1bGVzXG4gICAgKHByb3BzLm1ldHJpY3MgfHwgW10pLmZvckVhY2godGhpcy5hZGRNZXRyaWMuYmluZCh0aGlzKSk7XG4gICAgLy8gQWRkIGFsbCBjb3JzIGNvbmZpZ3VyYXRpb24gcnVsZXNcbiAgICAocHJvcHMuY29ycyB8fCBbXSkuZm9yRWFjaCh0aGlzLmFkZENvcnNSdWxlLmJpbmQodGhpcykpO1xuXG4gICAgLy8gQWRkIGFsbCBsaWZlY3ljbGUgcnVsZXNcbiAgICAocHJvcHMubGlmZWN5Y2xlUnVsZXMgfHwgW10pLmZvckVhY2godGhpcy5hZGRMaWZlY3ljbGVSdWxlLmJpbmQodGhpcykpO1xuXG4gICAgaWYgKHByb3BzLnB1YmxpY1JlYWRBY2Nlc3MpIHtcbiAgICAgIHRoaXMuZ3JhbnRQdWJsaWNBY2Nlc3MoKTtcbiAgICB9XG5cbiAgICBpZiAocHJvcHMuYXV0b0RlbGV0ZU9iamVjdHMpIHtcbiAgICAgIGlmIChwcm9wcy5yZW1vdmFsUG9saWN5ICE9PSBSZW1vdmFsUG9saWN5LkRFU1RST1kpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgdXNlIFxcJ2F1dG9EZWxldGVPYmplY3RzXFwnIHByb3BlcnR5IG9uIGEgYnVja2V0IHdpdGhvdXQgc2V0dGluZyByZW1vdmFsIHBvbGljeSB0byBcXCdERVNUUk9ZXFwnLicpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmVuYWJsZUF1dG9EZWxldGVPYmplY3RzKCk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuZXZlbnRCcmlkZ2VFbmFibGVkKSB7XG4gICAgICB0aGlzLmVuYWJsZUV2ZW50QnJpZGdlTm90aWZpY2F0aW9uKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBhIGxpZmVjeWNsZSBydWxlIHRvIHRoZSBidWNrZXRcbiAgICpcbiAgICogQHBhcmFtIHJ1bGUgVGhlIHJ1bGUgdG8gYWRkXG4gICAqL1xuICBwdWJsaWMgYWRkTGlmZWN5Y2xlUnVsZShydWxlOiBMaWZlY3ljbGVSdWxlKSB7XG4gICAgdGhpcy5saWZlY3ljbGVSdWxlcy5wdXNoKHJ1bGUpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYSBtZXRyaWNzIGNvbmZpZ3VyYXRpb24gZm9yIHRoZSBDbG91ZFdhdGNoIHJlcXVlc3QgbWV0cmljcyBmcm9tIHRoZSBidWNrZXQuXG4gICAqXG4gICAqIEBwYXJhbSBtZXRyaWMgVGhlIG1ldHJpYyBjb25maWd1cmF0aW9uIHRvIGFkZFxuICAgKi9cbiAgcHVibGljIGFkZE1ldHJpYyhtZXRyaWM6IEJ1Y2tldE1ldHJpY3MpIHtcbiAgICB0aGlzLm1ldHJpY3MucHVzaChtZXRyaWMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYSBjcm9zcy1vcmlnaW4gYWNjZXNzIGNvbmZpZ3VyYXRpb24gZm9yIG9iamVjdHMgaW4gYW4gQW1hem9uIFMzIGJ1Y2tldFxuICAgKlxuICAgKiBAcGFyYW0gcnVsZSBUaGUgQ09SUyBjb25maWd1cmF0aW9uIHJ1bGUgdG8gYWRkXG4gICAqL1xuICBwdWJsaWMgYWRkQ29yc1J1bGUocnVsZTogQ29yc1J1bGUpIHtcbiAgICB0aGlzLmNvcnMucHVzaChydWxlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgYW4gaW52ZW50b3J5IGNvbmZpZ3VyYXRpb24uXG4gICAqXG4gICAqIEBwYXJhbSBpbnZlbnRvcnkgY29uZmlndXJhdGlvbiB0byBhZGRcbiAgICovXG4gIHB1YmxpYyBhZGRJbnZlbnRvcnkoaW52ZW50b3J5OiBJbnZlbnRvcnkpOiB2b2lkIHtcbiAgICB0aGlzLmludmVudG9yaWVzLnB1c2goaW52ZW50b3J5KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGFuIGlhbSBzdGF0ZW1lbnQgdG8gZW5mb3JjZSBTU0wgcmVxdWVzdHMgb25seS5cbiAgICovXG4gIHByaXZhdGUgZW5mb3JjZVNTTFN0YXRlbWVudCgpIHtcbiAgICBjb25zdCBzdGF0ZW1lbnQgPSBuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XG4gICAgICBhY3Rpb25zOiBbJ3MzOionXSxcbiAgICAgIGNvbmRpdGlvbnM6IHtcbiAgICAgICAgQm9vbDogeyAnYXdzOlNlY3VyZVRyYW5zcG9ydCc6ICdmYWxzZScgfSxcbiAgICAgIH0sXG4gICAgICBlZmZlY3Q6IGlhbS5FZmZlY3QuREVOWSxcbiAgICAgIHJlc291cmNlczogW1xuICAgICAgICB0aGlzLmJ1Y2tldEFybixcbiAgICAgICAgdGhpcy5hcm5Gb3JPYmplY3RzKCcqJyksXG4gICAgICBdLFxuICAgICAgcHJpbmNpcGFsczogW25ldyBpYW0uQW55UHJpbmNpcGFsKCldLFxuICAgIH0pO1xuICAgIHRoaXMuYWRkVG9SZXNvdXJjZVBvbGljeShzdGF0ZW1lbnQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldCB1cCBrZXkgcHJvcGVydGllcyBhbmQgcmV0dXJuIHRoZSBCdWNrZXQgZW5jcnlwdGlvbiBwcm9wZXJ0eSBmcm9tIHRoZVxuICAgKiB1c2VyJ3MgY29uZmlndXJhdGlvbi5cbiAgICovXG4gIHByaXZhdGUgcGFyc2VFbmNyeXB0aW9uKHByb3BzOiBCdWNrZXRQcm9wcyk6IHtcbiAgICBidWNrZXRFbmNyeXB0aW9uPzogQ2ZuQnVja2V0LkJ1Y2tldEVuY3J5cHRpb25Qcm9wZXJ0eSxcbiAgICBlbmNyeXB0aW9uS2V5Pzoga21zLklLZXlcbiAgfSB7XG5cbiAgICAvLyBkZWZhdWx0IGJhc2VkIG9uIHdoZXRoZXIgZW5jcnlwdGlvbktleSBpcyBzcGVjaWZpZWRcbiAgICBsZXQgZW5jcnlwdGlvblR5cGUgPSBwcm9wcy5lbmNyeXB0aW9uO1xuICAgIGlmIChlbmNyeXB0aW9uVHlwZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBlbmNyeXB0aW9uVHlwZSA9IHByb3BzLmVuY3J5cHRpb25LZXkgPyBCdWNrZXRFbmNyeXB0aW9uLktNUyA6IEJ1Y2tldEVuY3J5cHRpb24uVU5FTkNSWVBURUQ7XG4gICAgfVxuXG4gICAgLy8gaWYgZW5jcnlwdGlvbiBrZXkgaXMgc2V0LCBlbmNyeXB0aW9uIG11c3QgYmUgc2V0IHRvIEtNUy5cbiAgICBpZiAoZW5jcnlwdGlvblR5cGUgIT09IEJ1Y2tldEVuY3J5cHRpb24uS01TICYmIHByb3BzLmVuY3J5cHRpb25LZXkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgZW5jcnlwdGlvbktleSBpcyBzcGVjaWZpZWQsIHNvICdlbmNyeXB0aW9uJyBtdXN0IGJlIHNldCB0byBLTVMgKHZhbHVlOiAke2VuY3J5cHRpb25UeXBlfSlgKTtcbiAgICB9XG5cbiAgICAvLyBpZiBidWNrZXRLZXlFbmFibGVkIGlzIHNldCwgZW5jcnlwdGlvbiBtdXN0IGJlIHNldCB0byBLTVMuXG4gICAgaWYgKHByb3BzLmJ1Y2tldEtleUVuYWJsZWQgJiYgIVtCdWNrZXRFbmNyeXB0aW9uLktNUywgQnVja2V0RW5jcnlwdGlvbi5LTVNfTUFOQUdFRF0uaW5jbHVkZXMoZW5jcnlwdGlvblR5cGUpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYGJ1Y2tldEtleUVuYWJsZWQgaXMgc3BlY2lmaWVkLCBzbyAnZW5jcnlwdGlvbicgbXVzdCBiZSBzZXQgdG8gS01TICh2YWx1ZTogJHtlbmNyeXB0aW9uVHlwZX0pYCk7XG4gICAgfVxuXG4gICAgaWYgKGVuY3J5cHRpb25UeXBlID09PSBCdWNrZXRFbmNyeXB0aW9uLlVORU5DUllQVEVEKSB7XG4gICAgICByZXR1cm4geyBidWNrZXRFbmNyeXB0aW9uOiB1bmRlZmluZWQsIGVuY3J5cHRpb25LZXk6IHVuZGVmaW5lZCB9O1xuICAgIH1cblxuICAgIGlmIChlbmNyeXB0aW9uVHlwZSA9PT0gQnVja2V0RW5jcnlwdGlvbi5LTVMpIHtcbiAgICAgIGNvbnN0IGVuY3J5cHRpb25LZXkgPSBwcm9wcy5lbmNyeXB0aW9uS2V5IHx8IG5ldyBrbXMuS2V5KHRoaXMsICdLZXknLCB7XG4gICAgICAgIGRlc2NyaXB0aW9uOiBgQ3JlYXRlZCBieSAke3RoaXMubm9kZS5wYXRofWAsXG4gICAgICB9KTtcblxuICAgICAgY29uc3QgYnVja2V0RW5jcnlwdGlvbiA9IHtcbiAgICAgICAgc2VydmVyU2lkZUVuY3J5cHRpb25Db25maWd1cmF0aW9uOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgYnVja2V0S2V5RW5hYmxlZDogcHJvcHMuYnVja2V0S2V5RW5hYmxlZCxcbiAgICAgICAgICAgIHNlcnZlclNpZGVFbmNyeXB0aW9uQnlEZWZhdWx0OiB7XG4gICAgICAgICAgICAgIHNzZUFsZ29yaXRobTogJ2F3czprbXMnLFxuICAgICAgICAgICAgICBrbXNNYXN0ZXJLZXlJZDogZW5jcnlwdGlvbktleS5rZXlBcm4sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9O1xuICAgICAgcmV0dXJuIHsgZW5jcnlwdGlvbktleSwgYnVja2V0RW5jcnlwdGlvbiB9O1xuICAgIH1cblxuICAgIGlmIChlbmNyeXB0aW9uVHlwZSA9PT0gQnVja2V0RW5jcnlwdGlvbi5TM19NQU5BR0VEKSB7XG4gICAgICBjb25zdCBidWNrZXRFbmNyeXB0aW9uID0ge1xuICAgICAgICBzZXJ2ZXJTaWRlRW5jcnlwdGlvbkNvbmZpZ3VyYXRpb246IFtcbiAgICAgICAgICB7IHNlcnZlclNpZGVFbmNyeXB0aW9uQnlEZWZhdWx0OiB7IHNzZUFsZ29yaXRobTogJ0FFUzI1NicgfSB9LFxuICAgICAgICBdLFxuICAgICAgfTtcblxuICAgICAgcmV0dXJuIHsgYnVja2V0RW5jcnlwdGlvbiB9O1xuICAgIH1cblxuICAgIGlmIChlbmNyeXB0aW9uVHlwZSA9PT0gQnVja2V0RW5jcnlwdGlvbi5LTVNfTUFOQUdFRCkge1xuICAgICAgY29uc3QgYnVja2V0RW5jcnlwdGlvbiA9IHtcbiAgICAgICAgc2VydmVyU2lkZUVuY3J5cHRpb25Db25maWd1cmF0aW9uOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgYnVja2V0S2V5RW5hYmxlZDogcHJvcHMuYnVja2V0S2V5RW5hYmxlZCxcbiAgICAgICAgICAgIHNlcnZlclNpZGVFbmNyeXB0aW9uQnlEZWZhdWx0OiB7IHNzZUFsZ29yaXRobTogJ2F3czprbXMnIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH07XG4gICAgICByZXR1cm4geyBidWNrZXRFbmNyeXB0aW9uIH07XG4gICAgfVxuXG4gICAgdGhyb3cgbmV3IEVycm9yKGBVbmV4cGVjdGVkICdlbmNyeXB0aW9uVHlwZSc6ICR7ZW5jcnlwdGlvblR5cGV9YCk7XG4gIH1cblxuICAvKipcbiAgICogUGFyc2UgdGhlIGxpZmVjeWNsZSBjb25maWd1cmF0aW9uIG91dCBvZiB0aGUgYnVja2V0IHByb3BzXG4gICAqIEBwYXJhbSBwcm9wcyBQYXJcbiAgICovXG4gIHByaXZhdGUgcGFyc2VMaWZlY3ljbGVDb25maWd1cmF0aW9uKCk6IENmbkJ1Y2tldC5MaWZlY3ljbGVDb25maWd1cmF0aW9uUHJvcGVydHkgfCB1bmRlZmluZWQge1xuICAgIGlmICghdGhpcy5saWZlY3ljbGVSdWxlcyB8fCB0aGlzLmxpZmVjeWNsZVJ1bGVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgIHJldHVybiB7IHJ1bGVzOiB0aGlzLmxpZmVjeWNsZVJ1bGVzLm1hcChwYXJzZUxpZmVjeWNsZVJ1bGUpIH07XG5cbiAgICBmdW5jdGlvbiBwYXJzZUxpZmVjeWNsZVJ1bGUocnVsZTogTGlmZWN5Y2xlUnVsZSk6IENmbkJ1Y2tldC5SdWxlUHJvcGVydHkge1xuICAgICAgY29uc3QgZW5hYmxlZCA9IHJ1bGUuZW5hYmxlZCA/PyB0cnVlO1xuXG4gICAgICBjb25zdCB4OiBDZm5CdWNrZXQuUnVsZVByb3BlcnR5ID0ge1xuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbWF4LWxlblxuICAgICAgICBhYm9ydEluY29tcGxldGVNdWx0aXBhcnRVcGxvYWQ6IHJ1bGUuYWJvcnRJbmNvbXBsZXRlTXVsdGlwYXJ0VXBsb2FkQWZ0ZXIgIT09IHVuZGVmaW5lZCA/IHsgZGF5c0FmdGVySW5pdGlhdGlvbjogcnVsZS5hYm9ydEluY29tcGxldGVNdWx0aXBhcnRVcGxvYWRBZnRlci50b0RheXMoKSB9IDogdW5kZWZpbmVkLFxuICAgICAgICBleHBpcmF0aW9uRGF0ZTogcnVsZS5leHBpcmF0aW9uRGF0ZSxcbiAgICAgICAgZXhwaXJhdGlvbkluRGF5czogcnVsZS5leHBpcmF0aW9uPy50b0RheXMoKSxcbiAgICAgICAgaWQ6IHJ1bGUuaWQsXG4gICAgICAgIG5vbmN1cnJlbnRWZXJzaW9uRXhwaXJhdGlvbjogcnVsZS5ub25jdXJyZW50VmVyc2lvbkV4cGlyYXRpb24gJiYge1xuICAgICAgICAgIG5vbmN1cnJlbnREYXlzOiBydWxlLm5vbmN1cnJlbnRWZXJzaW9uRXhwaXJhdGlvbi50b0RheXMoKSxcbiAgICAgICAgICBuZXdlck5vbmN1cnJlbnRWZXJzaW9uczogcnVsZS5ub25jdXJyZW50VmVyc2lvbnNUb1JldGFpbixcbiAgICAgICAgfSxcbiAgICAgICAgbm9uY3VycmVudFZlcnNpb25UcmFuc2l0aW9uczogbWFwT3JVbmRlZmluZWQocnVsZS5ub25jdXJyZW50VmVyc2lvblRyYW5zaXRpb25zLCB0ID0+ICh7XG4gICAgICAgICAgc3RvcmFnZUNsYXNzOiB0LnN0b3JhZ2VDbGFzcy52YWx1ZSxcbiAgICAgICAgICB0cmFuc2l0aW9uSW5EYXlzOiB0LnRyYW5zaXRpb25BZnRlci50b0RheXMoKSxcbiAgICAgICAgICBuZXdlck5vbmN1cnJlbnRWZXJzaW9uczogdC5ub25jdXJyZW50VmVyc2lvbnNUb1JldGFpbixcbiAgICAgICAgfSkpLFxuICAgICAgICBwcmVmaXg6IHJ1bGUucHJlZml4LFxuICAgICAgICBzdGF0dXM6IGVuYWJsZWQgPyAnRW5hYmxlZCcgOiAnRGlzYWJsZWQnLFxuICAgICAgICB0cmFuc2l0aW9uczogbWFwT3JVbmRlZmluZWQocnVsZS50cmFuc2l0aW9ucywgdCA9PiAoe1xuICAgICAgICAgIHN0b3JhZ2VDbGFzczogdC5zdG9yYWdlQ2xhc3MudmFsdWUsXG4gICAgICAgICAgdHJhbnNpdGlvbkRhdGU6IHQudHJhbnNpdGlvbkRhdGUsXG4gICAgICAgICAgdHJhbnNpdGlvbkluRGF5czogdC50cmFuc2l0aW9uQWZ0ZXIgJiYgdC50cmFuc2l0aW9uQWZ0ZXIudG9EYXlzKCksXG4gICAgICAgIH0pKSxcbiAgICAgICAgZXhwaXJlZE9iamVjdERlbGV0ZU1hcmtlcjogcnVsZS5leHBpcmVkT2JqZWN0RGVsZXRlTWFya2VyLFxuICAgICAgICB0YWdGaWx0ZXJzOiBzZWxmLnBhcnNlVGFnRmlsdGVycyhydWxlLnRhZ0ZpbHRlcnMpLFxuICAgICAgICBvYmplY3RTaXplTGVzc1RoYW46IHJ1bGUub2JqZWN0U2l6ZUxlc3NUaGFuLFxuICAgICAgICBvYmplY3RTaXplR3JlYXRlclRoYW46IHJ1bGUub2JqZWN0U2l6ZUdyZWF0ZXJUaGFuLFxuICAgICAgfTtcblxuICAgICAgcmV0dXJuIHg7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBwYXJzZVNlcnZlckFjY2Vzc0xvZ3MocHJvcHM6IEJ1Y2tldFByb3BzKTogQ2ZuQnVja2V0LkxvZ2dpbmdDb25maWd1cmF0aW9uUHJvcGVydHkgfCB1bmRlZmluZWQge1xuICAgIGlmICghcHJvcHMuc2VydmVyQWNjZXNzTG9nc0J1Y2tldCAmJiAhcHJvcHMuc2VydmVyQWNjZXNzTG9nc1ByZWZpeCkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBpZiAoXG4gICAgICAvLyBLTVMgY2FuJ3QgYmUgdXNlZCBmb3IgbG9nZ2luZyBzaW5jZSB0aGUgbG9nZ2luZyBzZXJ2aWNlIGNhbid0IHVzZSB0aGUga2V5IC0gbG9ncyBkb24ndCB3cml0ZVxuICAgICAgLy8gS01TX01BTkFHRUQgY2FuJ3QgYmUgdXNlZCBmb3IgbG9nZ2luZyBzaW5jZSB0aGUgYWNjb3VudCBjYW4ndCBhY2Nlc3MgdGhlIGxvZ2dpbmcgc2VydmljZSBrZXkgLSBhY2NvdW50IGNhbid0IHJlYWQgbG9nc1xuICAgICAgKCFwcm9wcy5zZXJ2ZXJBY2Nlc3NMb2dzQnVja2V0ICYmIChcbiAgICAgICAgcHJvcHMuZW5jcnlwdGlvbktleSB8fFxuICAgICAgICBwcm9wcy5lbmNyeXB0aW9uID09PSBCdWNrZXRFbmNyeXB0aW9uLktNU19NQU5BR0VEIHx8XG4gICAgICAgIHByb3BzLmVuY3J5cHRpb24gPT09IEJ1Y2tldEVuY3J5cHRpb24uS01TICkpIHx8XG4gICAgICAvLyBBbm90aGVyIGJ1Y2tldCBpcyBiZWluZyB1c2VkIHRoYXQgaXMgY29uZmlndXJlZCBmb3IgZGVmYXVsdCBTU0UtS01TXG4gICAgICBwcm9wcy5zZXJ2ZXJBY2Nlc3NMb2dzQnVja2V0Py5lbmNyeXB0aW9uS2V5XG4gICAgKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1NTRS1TMyBpcyB0aGUgb25seSBzdXBwb3J0ZWQgZGVmYXVsdCBidWNrZXQgZW5jcnlwdGlvbiBmb3IgU2VydmVyIEFjY2VzcyBMb2dnaW5nIHRhcmdldCBidWNrZXRzJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIGRlc3RpbmF0aW9uQnVja2V0TmFtZTogcHJvcHMuc2VydmVyQWNjZXNzTG9nc0J1Y2tldD8uYnVja2V0TmFtZSxcbiAgICAgIGxvZ0ZpbGVQcmVmaXg6IHByb3BzLnNlcnZlckFjY2Vzc0xvZ3NQcmVmaXgsXG4gICAgfTtcbiAgfVxuXG4gIHByaXZhdGUgcGFyc2VNZXRyaWNDb25maWd1cmF0aW9uKCk6IENmbkJ1Y2tldC5NZXRyaWNzQ29uZmlndXJhdGlvblByb3BlcnR5W10gfCB1bmRlZmluZWQge1xuICAgIGlmICghdGhpcy5tZXRyaWNzIHx8IHRoaXMubWV0cmljcy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgICByZXR1cm4gdGhpcy5tZXRyaWNzLm1hcChwYXJzZU1ldHJpYyk7XG5cbiAgICBmdW5jdGlvbiBwYXJzZU1ldHJpYyhtZXRyaWM6IEJ1Y2tldE1ldHJpY3MpOiBDZm5CdWNrZXQuTWV0cmljc0NvbmZpZ3VyYXRpb25Qcm9wZXJ0eSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBpZDogbWV0cmljLmlkLFxuICAgICAgICBwcmVmaXg6IG1ldHJpYy5wcmVmaXgsXG4gICAgICAgIHRhZ0ZpbHRlcnM6IHNlbGYucGFyc2VUYWdGaWx0ZXJzKG1ldHJpYy50YWdGaWx0ZXJzKSxcbiAgICAgIH07XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBwYXJzZUNvcnNDb25maWd1cmF0aW9uKCk6IENmbkJ1Y2tldC5Db3JzQ29uZmlndXJhdGlvblByb3BlcnR5IHwgdW5kZWZpbmVkIHtcbiAgICBpZiAoIXRoaXMuY29ycyB8fCB0aGlzLmNvcnMubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIHJldHVybiB7IGNvcnNSdWxlczogdGhpcy5jb3JzLm1hcChwYXJzZUNvcnMpIH07XG5cbiAgICBmdW5jdGlvbiBwYXJzZUNvcnMocnVsZTogQ29yc1J1bGUpOiBDZm5CdWNrZXQuQ29yc1J1bGVQcm9wZXJ0eSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBpZDogcnVsZS5pZCxcbiAgICAgICAgbWF4QWdlOiBydWxlLm1heEFnZSxcbiAgICAgICAgYWxsb3dlZEhlYWRlcnM6IHJ1bGUuYWxsb3dlZEhlYWRlcnMsXG4gICAgICAgIGFsbG93ZWRNZXRob2RzOiBydWxlLmFsbG93ZWRNZXRob2RzLFxuICAgICAgICBhbGxvd2VkT3JpZ2luczogcnVsZS5hbGxvd2VkT3JpZ2lucyxcbiAgICAgICAgZXhwb3NlZEhlYWRlcnM6IHJ1bGUuZXhwb3NlZEhlYWRlcnMsXG4gICAgICB9O1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgcGFyc2VUYWdGaWx0ZXJzKHRhZ0ZpbHRlcnM/OiB7IFt0YWc6IHN0cmluZ106IGFueSB9KSB7XG4gICAgaWYgKCF0YWdGaWx0ZXJzIHx8IHRhZ0ZpbHRlcnMubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIHJldHVybiBPYmplY3Qua2V5cyh0YWdGaWx0ZXJzKS5tYXAodGFnID0+ICh7XG4gICAgICBrZXk6IHRhZyxcbiAgICAgIHZhbHVlOiB0YWdGaWx0ZXJzW3RhZ10sXG4gICAgfSkpO1xuICB9XG5cbiAgcHJpdmF0ZSBwYXJzZU93bmVyc2hpcENvbnRyb2xzKHsgb2JqZWN0T3duZXJzaGlwIH06IEJ1Y2tldFByb3BzKTogQ2ZuQnVja2V0Lk93bmVyc2hpcENvbnRyb2xzUHJvcGVydHkgfCB1bmRlZmluZWQge1xuICAgIGlmICghb2JqZWN0T3duZXJzaGlwKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgcnVsZXM6IFt7XG4gICAgICAgIG9iamVjdE93bmVyc2hpcCxcbiAgICAgIH1dLFxuICAgIH07XG4gIH1cblxuICBwcml2YXRlIHBhcnNlVGllcmluZ0NvbmZpZyh7IGludGVsbGlnZW50VGllcmluZ0NvbmZpZ3VyYXRpb25zIH06IEJ1Y2tldFByb3BzKTogQ2ZuQnVja2V0LkludGVsbGlnZW50VGllcmluZ0NvbmZpZ3VyYXRpb25Qcm9wZXJ0eVtdIHwgdW5kZWZpbmVkIHtcbiAgICBpZiAoIWludGVsbGlnZW50VGllcmluZ0NvbmZpZ3VyYXRpb25zKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIHJldHVybiBpbnRlbGxpZ2VudFRpZXJpbmdDb25maWd1cmF0aW9ucy5tYXAoY29uZmlnID0+IHtcbiAgICAgIGNvbnN0IHRpZXJpbmdzID0gW107XG4gICAgICBpZiAoY29uZmlnLmFyY2hpdmVBY2Nlc3NUaWVyVGltZSkge1xuICAgICAgICB0aWVyaW5ncy5wdXNoKHtcbiAgICAgICAgICBhY2Nlc3NUaWVyOiAnQVJDSElWRV9BQ0NFU1MnLFxuICAgICAgICAgIGRheXM6IGNvbmZpZy5hcmNoaXZlQWNjZXNzVGllclRpbWUudG9EYXlzKHsgaW50ZWdyYWw6IHRydWUgfSksXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgaWYgKGNvbmZpZy5kZWVwQXJjaGl2ZUFjY2Vzc1RpZXJUaW1lKSB7XG4gICAgICAgIHRpZXJpbmdzLnB1c2goe1xuICAgICAgICAgIGFjY2Vzc1RpZXI6ICdERUVQX0FSQ0hJVkVfQUNDRVNTJyxcbiAgICAgICAgICBkYXlzOiBjb25maWcuZGVlcEFyY2hpdmVBY2Nlc3NUaWVyVGltZS50b0RheXMoeyBpbnRlZ3JhbDogdHJ1ZSB9KSxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICByZXR1cm4ge1xuICAgICAgICBpZDogY29uZmlnLm5hbWUsXG4gICAgICAgIHByZWZpeDogY29uZmlnLnByZWZpeCxcbiAgICAgICAgc3RhdHVzOiAnRW5hYmxlZCcsXG4gICAgICAgIHRhZ0ZpbHRlcnM6IGNvbmZpZy50YWdzLFxuICAgICAgICB0aWVyaW5nczogdGllcmluZ3MsXG4gICAgICB9O1xuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBwYXJzZU9iamVjdExvY2tDb25maWcocHJvcHM6IEJ1Y2tldFByb3BzKTogQ2ZuQnVja2V0Lk9iamVjdExvY2tDb25maWd1cmF0aW9uUHJvcGVydHkgfCB1bmRlZmluZWQge1xuICAgIGNvbnN0IHsgb2JqZWN0TG9ja0VuYWJsZWQsIG9iamVjdExvY2tEZWZhdWx0UmV0ZW50aW9uIH0gPSBwcm9wcztcblxuICAgIGlmICghb2JqZWN0TG9ja0RlZmF1bHRSZXRlbnRpb24pIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICAgIGlmIChvYmplY3RMb2NrRW5hYmxlZCA9PT0gZmFsc2UgJiYgb2JqZWN0TG9ja0RlZmF1bHRSZXRlbnRpb24pIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignT2JqZWN0IExvY2sgbXVzdCBiZSBlbmFibGVkIHRvIGNvbmZpZ3VyZSBkZWZhdWx0IHJldGVudGlvbiBzZXR0aW5ncycpO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBvYmplY3RMb2NrRW5hYmxlZDogJ0VuYWJsZWQnLFxuICAgICAgcnVsZToge1xuICAgICAgICBkZWZhdWx0UmV0ZW50aW9uOiB7XG4gICAgICAgICAgZGF5czogb2JqZWN0TG9ja0RlZmF1bHRSZXRlbnRpb24uZHVyYXRpb24udG9EYXlzKCksXG4gICAgICAgICAgbW9kZTogb2JqZWN0TG9ja0RlZmF1bHRSZXRlbnRpb24ubW9kZSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfTtcbiAgfVxuXG4gIHByaXZhdGUgcmVuZGVyV2Vic2l0ZUNvbmZpZ3VyYXRpb24ocHJvcHM6IEJ1Y2tldFByb3BzKTogQ2ZuQnVja2V0LldlYnNpdGVDb25maWd1cmF0aW9uUHJvcGVydHkgfCB1bmRlZmluZWQge1xuICAgIGlmICghcHJvcHMud2Vic2l0ZUVycm9yRG9jdW1lbnQgJiYgIXByb3BzLndlYnNpdGVJbmRleERvY3VtZW50ICYmICFwcm9wcy53ZWJzaXRlUmVkaXJlY3QgJiYgIXByb3BzLndlYnNpdGVSb3V0aW5nUnVsZXMpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgaWYgKHByb3BzLndlYnNpdGVFcnJvckRvY3VtZW50ICYmICFwcm9wcy53ZWJzaXRlSW5kZXhEb2N1bWVudCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdcIndlYnNpdGVJbmRleERvY3VtZW50XCIgaXMgcmVxdWlyZWQgaWYgXCJ3ZWJzaXRlRXJyb3JEb2N1bWVudFwiIGlzIHNldCcpO1xuICAgIH1cblxuICAgIGlmIChwcm9wcy53ZWJzaXRlUmVkaXJlY3QgJiYgKHByb3BzLndlYnNpdGVFcnJvckRvY3VtZW50IHx8IHByb3BzLndlYnNpdGVJbmRleERvY3VtZW50IHx8IHByb3BzLndlYnNpdGVSb3V0aW5nUnVsZXMpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1wid2Vic2l0ZUluZGV4RG9jdW1lbnRcIiwgXCJ3ZWJzaXRlRXJyb3JEb2N1bWVudFwiIGFuZCwgXCJ3ZWJzaXRlUm91dGluZ1J1bGVzXCIgY2Fubm90IGJlIHNldCBpZiBcIndlYnNpdGVSZWRpcmVjdFwiIGlzIHVzZWQnKTtcbiAgICB9XG5cbiAgICBjb25zdCByb3V0aW5nUnVsZXMgPSBwcm9wcy53ZWJzaXRlUm91dGluZ1J1bGVzID8gcHJvcHMud2Vic2l0ZVJvdXRpbmdSdWxlcy5tYXA8Q2ZuQnVja2V0LlJvdXRpbmdSdWxlUHJvcGVydHk+KChydWxlKSA9PiB7XG4gICAgICBpZiAocnVsZS5jb25kaXRpb24gJiYgIXJ1bGUuY29uZGl0aW9uLmh0dHBFcnJvckNvZGVSZXR1cm5lZEVxdWFscyAmJiAhcnVsZS5jb25kaXRpb24ua2V5UHJlZml4RXF1YWxzKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignVGhlIGNvbmRpdGlvbiBwcm9wZXJ0eSBjYW5ub3QgYmUgYW4gZW1wdHkgb2JqZWN0Jyk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIHJlZGlyZWN0UnVsZToge1xuICAgICAgICAgIGhvc3ROYW1lOiBydWxlLmhvc3ROYW1lLFxuICAgICAgICAgIGh0dHBSZWRpcmVjdENvZGU6IHJ1bGUuaHR0cFJlZGlyZWN0Q29kZSxcbiAgICAgICAgICBwcm90b2NvbDogcnVsZS5wcm90b2NvbCxcbiAgICAgICAgICByZXBsYWNlS2V5V2l0aDogcnVsZS5yZXBsYWNlS2V5ICYmIHJ1bGUucmVwbGFjZUtleS53aXRoS2V5LFxuICAgICAgICAgIHJlcGxhY2VLZXlQcmVmaXhXaXRoOiBydWxlLnJlcGxhY2VLZXkgJiYgcnVsZS5yZXBsYWNlS2V5LnByZWZpeFdpdGhLZXksXG4gICAgICAgIH0sXG4gICAgICAgIHJvdXRpbmdSdWxlQ29uZGl0aW9uOiBydWxlLmNvbmRpdGlvbixcbiAgICAgIH07XG4gICAgfSkgOiB1bmRlZmluZWQ7XG5cbiAgICByZXR1cm4ge1xuICAgICAgaW5kZXhEb2N1bWVudDogcHJvcHMud2Vic2l0ZUluZGV4RG9jdW1lbnQsXG4gICAgICBlcnJvckRvY3VtZW50OiBwcm9wcy53ZWJzaXRlRXJyb3JEb2N1bWVudCxcbiAgICAgIHJlZGlyZWN0QWxsUmVxdWVzdHNUbzogcHJvcHMud2Vic2l0ZVJlZGlyZWN0LFxuICAgICAgcm91dGluZ1J1bGVzLFxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogQWxsb3dzIExvZyBEZWxpdmVyeSB0byB0aGUgUzMgYnVja2V0LCB1c2luZyBhIEJ1Y2tldCBQb2xpY3kgaWYgdGhlIHJlbGV2YW50IGZlYXR1cmVcbiAgICogZmxhZyBpcyBlbmFibGVkLCBvdGhlcndpc2UgdGhlIGNhbm5lZCBBQ0wgaXMgdXNlZC5cbiAgICpcbiAgICogSWYgbG9nIGRlbGl2ZXJ5IGlzIHRvIGJlIGFsbG93ZWQgdXNpbmcgdGhlIEFDTCBhbmQgYW4gQUNMIGhhcyBhbHJlYWR5IGJlZW4gc2V0LCB0aGlzIGZhaWxzLlxuICAgKlxuICAgKiBAc2VlXG4gICAqIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BbWF6b25TMy9sYXRlc3QvdXNlcmd1aWRlL2VuYWJsZS1zZXJ2ZXItYWNjZXNzLWxvZ2dpbmcuaHRtbFxuICAgKi9cbiAgcHJpdmF0ZSBhbGxvd0xvZ0RlbGl2ZXJ5KGZyb206IElCdWNrZXQsIHByZWZpeD86IHN0cmluZykge1xuICAgIGlmIChGZWF0dXJlRmxhZ3Mub2YodGhpcykuaXNFbmFibGVkKGN4YXBpLlMzX1NFUlZFUl9BQ0NFU1NfTE9HU19VU0VfQlVDS0VUX1BPTElDWSkpIHtcbiAgICAgIGxldCBjb25kaXRpb25zID0gdW5kZWZpbmVkO1xuICAgICAgLy8gVGhlIGNvbmRpdGlvbnMgZm9yIHRoZSBidWNrZXQgcG9saWN5IGNhbiBiZSBhcHBsaWVkIG9ubHkgd2hlbiB0aGUgYnVja2V0cyBhcmUgaW5cbiAgICAgIC8vIHRoZSBzYW1lIHN0YWNrIGFuZCBhIGNvbmNyZXRlIGJ1Y2tldCBpbnN0YW5jZSAobm90IGltcG9ydGVkKS4gT3RoZXJ3aXNlLCB0aGVcbiAgICAgIC8vIG5lY2Vzc2FyeSBpbXBvcnRzIG1heSByZXN1bHQgaW4gYSBjeWNsaWMgZGVwZW5kZW5jeSBiZXR3ZWVuIHRoZSBzdGFja3MuXG4gICAgICBpZiAoZnJvbSBpbnN0YW5jZW9mIEJ1Y2tldCAmJiBTdGFjay5vZih0aGlzKSA9PT0gU3RhY2sub2YoZnJvbSkpIHtcbiAgICAgICAgY29uZGl0aW9ucyA9IHtcbiAgICAgICAgICBBcm5MaWtlOiB7XG4gICAgICAgICAgICAnYXdzOlNvdXJjZUFybic6IGZyb20uYnVja2V0QXJuLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgU3RyaW5nRXF1YWxzOiB7XG4gICAgICAgICAgICAnYXdzOlNvdXJjZUFjY291bnQnOiBmcm9tLmVudi5hY2NvdW50LFxuICAgICAgICAgIH0sXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICB0aGlzLmFkZFRvUmVzb3VyY2VQb2xpY3kobmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgICBlZmZlY3Q6IGlhbS5FZmZlY3QuQUxMT1csXG4gICAgICAgIHByaW5jaXBhbHM6IFtuZXcgaWFtLlNlcnZpY2VQcmluY2lwYWwoJ2xvZ2dpbmcuczMuYW1hem9uYXdzLmNvbScpXSxcbiAgICAgICAgYWN0aW9uczogWydzMzpQdXRPYmplY3QnXSxcbiAgICAgICAgcmVzb3VyY2VzOiBbdGhpcy5hcm5Gb3JPYmplY3RzKHByZWZpeCA/IGAke3ByZWZpeH0qYCA6ICcqJyldLFxuICAgICAgICBjb25kaXRpb25zOiBjb25kaXRpb25zLFxuICAgICAgfSkpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5hY2Nlc3NDb250cm9sICYmIHRoaXMuYWNjZXNzQ29udHJvbCAhPT0gQnVja2V0QWNjZXNzQ29udHJvbC5MT0dfREVMSVZFUllfV1JJVEUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkNhbm5vdCBlbmFibGUgbG9nIGRlbGl2ZXJ5IHRvIHRoaXMgYnVja2V0IGJlY2F1c2UgdGhlIGJ1Y2tldCdzIEFDTCBoYXMgYmVlbiBzZXQgYW5kIGNhbid0IGJlIGNoYW5nZWRcIik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuYWNjZXNzQ29udHJvbCA9IEJ1Y2tldEFjY2Vzc0NvbnRyb2wuTE9HX0RFTElWRVJZX1dSSVRFO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgcGFyc2VJbnZlbnRvcnlDb25maWd1cmF0aW9uKCk6IENmbkJ1Y2tldC5JbnZlbnRvcnlDb25maWd1cmF0aW9uUHJvcGVydHlbXSB8IHVuZGVmaW5lZCB7XG4gICAgaWYgKCF0aGlzLmludmVudG9yaWVzIHx8IHRoaXMuaW52ZW50b3JpZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmludmVudG9yaWVzLm1hcCgoaW52ZW50b3J5LCBpbmRleCkgPT4ge1xuICAgICAgY29uc3QgZm9ybWF0ID0gaW52ZW50b3J5LmZvcm1hdCA/PyBJbnZlbnRvcnlGb3JtYXQuQ1NWO1xuICAgICAgY29uc3QgZnJlcXVlbmN5ID0gaW52ZW50b3J5LmZyZXF1ZW5jeSA/PyBJbnZlbnRvcnlGcmVxdWVuY3kuV0VFS0xZO1xuICAgICAgY29uc3QgaWQgPSBpbnZlbnRvcnkuaW52ZW50b3J5SWQgPz8gYCR7dGhpcy5ub2RlLmlkfUludmVudG9yeSR7aW5kZXh9YDtcblxuICAgICAgaWYgKGludmVudG9yeS5kZXN0aW5hdGlvbi5idWNrZXQgaW5zdGFuY2VvZiBCdWNrZXQpIHtcbiAgICAgICAgaW52ZW50b3J5LmRlc3RpbmF0aW9uLmJ1Y2tldC5hZGRUb1Jlc291cmNlUG9saWN5KG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcbiAgICAgICAgICBlZmZlY3Q6IGlhbS5FZmZlY3QuQUxMT1csXG4gICAgICAgICAgYWN0aW9uczogWydzMzpQdXRPYmplY3QnXSxcbiAgICAgICAgICByZXNvdXJjZXM6IFtcbiAgICAgICAgICAgIGludmVudG9yeS5kZXN0aW5hdGlvbi5idWNrZXQuYnVja2V0QXJuLFxuICAgICAgICAgICAgaW52ZW50b3J5LmRlc3RpbmF0aW9uLmJ1Y2tldC5hcm5Gb3JPYmplY3RzKGAke2ludmVudG9yeS5kZXN0aW5hdGlvbi5wcmVmaXggPz8gJyd9KmApLFxuICAgICAgICAgIF0sXG4gICAgICAgICAgcHJpbmNpcGFsczogW25ldyBpYW0uU2VydmljZVByaW5jaXBhbCgnczMuYW1hem9uYXdzLmNvbScpXSxcbiAgICAgICAgICBjb25kaXRpb25zOiB7XG4gICAgICAgICAgICBBcm5MaWtlOiB7XG4gICAgICAgICAgICAgICdhd3M6U291cmNlQXJuJzogdGhpcy5idWNrZXRBcm4sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgaWQsXG4gICAgICAgIGRlc3RpbmF0aW9uOiB7XG4gICAgICAgICAgYnVja2V0QXJuOiBpbnZlbnRvcnkuZGVzdGluYXRpb24uYnVja2V0LmJ1Y2tldEFybixcbiAgICAgICAgICBidWNrZXRBY2NvdW50SWQ6IGludmVudG9yeS5kZXN0aW5hdGlvbi5idWNrZXRPd25lcixcbiAgICAgICAgICBwcmVmaXg6IGludmVudG9yeS5kZXN0aW5hdGlvbi5wcmVmaXgsXG4gICAgICAgICAgZm9ybWF0LFxuICAgICAgICB9LFxuICAgICAgICBlbmFibGVkOiBpbnZlbnRvcnkuZW5hYmxlZCA/PyB0cnVlLFxuICAgICAgICBpbmNsdWRlZE9iamVjdFZlcnNpb25zOiBpbnZlbnRvcnkuaW5jbHVkZU9iamVjdFZlcnNpb25zID8/IEludmVudG9yeU9iamVjdFZlcnNpb24uQUxMLFxuICAgICAgICBzY2hlZHVsZUZyZXF1ZW5jeTogZnJlcXVlbmN5LFxuICAgICAgICBvcHRpb25hbEZpZWxkczogaW52ZW50b3J5Lm9wdGlvbmFsRmllbGRzLFxuICAgICAgICBwcmVmaXg6IGludmVudG9yeS5vYmplY3RzUHJlZml4LFxuICAgICAgfTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgZW5hYmxlQXV0b0RlbGV0ZU9iamVjdHMoKSB7XG4gICAgY29uc3QgcHJvdmlkZXIgPSBDdXN0b21SZXNvdXJjZVByb3ZpZGVyLmdldE9yQ3JlYXRlUHJvdmlkZXIodGhpcywgQVVUT19ERUxFVEVfT0JKRUNUU19SRVNPVVJDRV9UWVBFLCB7XG4gICAgICBjb2RlRGlyZWN0b3J5OiBwYXRoLmpvaW4oX19kaXJuYW1lLCAnYXV0by1kZWxldGUtb2JqZWN0cy1oYW5kbGVyJyksXG4gICAgICBydW50aW1lOiBDdXN0b21SZXNvdXJjZVByb3ZpZGVyUnVudGltZS5OT0RFSlNfMTRfWCxcbiAgICAgIGRlc2NyaXB0aW9uOiBgTGFtYmRhIGZ1bmN0aW9uIGZvciBhdXRvLWRlbGV0aW5nIG9iamVjdHMgaW4gJHt0aGlzLmJ1Y2tldE5hbWV9IFMzIGJ1Y2tldC5gLFxuICAgIH0pO1xuXG4gICAgLy8gVXNlIGEgYnVja2V0IHBvbGljeSB0byBhbGxvdyB0aGUgY3VzdG9tIHJlc291cmNlIHRvIGRlbGV0ZVxuICAgIC8vIG9iamVjdHMgaW4gdGhlIGJ1Y2tldFxuICAgIHRoaXMuYWRkVG9SZXNvdXJjZVBvbGljeShuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XG4gICAgICBhY3Rpb25zOiBbXG4gICAgICAgIC8vIGxpc3Qgb2JqZWN0c1xuICAgICAgICAuLi5wZXJtcy5CVUNLRVRfUkVBRF9NRVRBREFUQV9BQ1RJT05TLFxuICAgICAgICAuLi5wZXJtcy5CVUNLRVRfREVMRVRFX0FDVElPTlMsIC8vIGFuZCB0aGVuIGRlbGV0ZSB0aGVtXG4gICAgICBdLFxuICAgICAgcmVzb3VyY2VzOiBbXG4gICAgICAgIHRoaXMuYnVja2V0QXJuLFxuICAgICAgICB0aGlzLmFybkZvck9iamVjdHMoJyonKSxcbiAgICAgIF0sXG4gICAgICBwcmluY2lwYWxzOiBbbmV3IGlhbS5Bcm5QcmluY2lwYWwocHJvdmlkZXIucm9sZUFybildLFxuICAgIH0pKTtcblxuICAgIGNvbnN0IGN1c3RvbVJlc291cmNlID0gbmV3IEN1c3RvbVJlc291cmNlKHRoaXMsICdBdXRvRGVsZXRlT2JqZWN0c0N1c3RvbVJlc291cmNlJywge1xuICAgICAgcmVzb3VyY2VUeXBlOiBBVVRPX0RFTEVURV9PQkpFQ1RTX1JFU09VUkNFX1RZUEUsXG4gICAgICBzZXJ2aWNlVG9rZW46IHByb3ZpZGVyLnNlcnZpY2VUb2tlbixcbiAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgQnVja2V0TmFtZTogdGhpcy5idWNrZXROYW1lLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vIEVuc3VyZSBidWNrZXQgcG9saWN5IGlzIGRlbGV0ZWQgQUZURVIgdGhlIGN1c3RvbSByZXNvdXJjZSBvdGhlcndpc2VcbiAgICAvLyB3ZSBkb24ndCBoYXZlIHBlcm1pc3Npb25zIHRvIGxpc3QgYW5kIGRlbGV0ZSBpbiB0aGUgYnVja2V0LlxuICAgIC8vIChhZGQgYSBgaWZgIHRvIG1ha2UgVFMgaGFwcHkpXG4gICAgaWYgKHRoaXMucG9saWN5KSB7XG4gICAgICBjdXN0b21SZXNvdXJjZS5ub2RlLmFkZERlcGVuZGVuY3kodGhpcy5wb2xpY3kpO1xuICAgIH1cblxuICAgIC8vIFdlIGFsc28gdGFnIHRoZSBidWNrZXQgdG8gcmVjb3JkIHRoZSBmYWN0IHRoYXQgd2Ugd2FudCBpdCBhdXRvZGVsZXRlZC5cbiAgICAvLyBUaGUgY3VzdG9tIHJlc291cmNlIHdpbGwgY2hlY2sgdGhpcyB0YWcgYmVmb3JlIGFjdHVhbGx5IGRvaW5nIHRoZSBkZWxldGUuXG4gICAgLy8gQmVjYXVzZSB0YWdnaW5nIGFuZCB1bnRhZ2dpbmcgd2lsbCBBTFdBWVMgaGFwcGVuIGJlZm9yZSB0aGUgQ1IgaXMgZGVsZXRlZCxcbiAgICAvLyB3ZSBjYW4gc2V0IGBhdXRvRGVsZXRlT2JqZWN0czogZmFsc2VgIHdpdGhvdXQgdGhlIHJlbW92YWwgb2YgdGhlIENSIGVtcHR5aW5nXG4gICAgLy8gdGhlIGJ1Y2tldCBhcyBhIHNpZGUgZWZmZWN0LlxuICAgIFRhZ3Mub2YodGhpcy5fcmVzb3VyY2UpLmFkZChBVVRPX0RFTEVURV9PQkpFQ1RTX1RBRywgJ3RydWUnKTtcbiAgfVxufVxuXG4vKipcbiAqIFdoYXQga2luZCBvZiBzZXJ2ZXItc2lkZSBlbmNyeXB0aW9uIHRvIGFwcGx5IHRvIHRoaXMgYnVja2V0XG4gKi9cbmV4cG9ydCBlbnVtIEJ1Y2tldEVuY3J5cHRpb24ge1xuICAvKipcbiAgICogT2JqZWN0cyBpbiB0aGUgYnVja2V0IGFyZSBub3QgZW5jcnlwdGVkLlxuICAgKi9cbiAgVU5FTkNSWVBURUQgPSAnVU5FTkNSWVBURUQnLFxuXG4gIC8qKlxuICAgKiBTZXJ2ZXItc2lkZSBLTVMgZW5jcnlwdGlvbiB3aXRoIGEgbWFzdGVyIGtleSBtYW5hZ2VkIGJ5IEtNUy5cbiAgICovXG4gIEtNU19NQU5BR0VEID0gJ0tNU19NQU5BR0VEJyxcblxuICAvKipcbiAgICogU2VydmVyLXNpZGUgZW5jcnlwdGlvbiB3aXRoIGEgbWFzdGVyIGtleSBtYW5hZ2VkIGJ5IFMzLlxuICAgKi9cbiAgUzNfTUFOQUdFRCA9ICdTM19NQU5BR0VEJyxcblxuICAvKipcbiAgICogU2VydmVyLXNpZGUgZW5jcnlwdGlvbiB3aXRoIGEgS01TIGtleSBtYW5hZ2VkIGJ5IHRoZSB1c2VyLlxuICAgKiBJZiBgZW5jcnlwdGlvbktleWAgaXMgc3BlY2lmaWVkLCB0aGlzIGtleSB3aWxsIGJlIHVzZWQsIG90aGVyd2lzZSwgb25lIHdpbGwgYmUgZGVmaW5lZC5cbiAgICovXG4gIEtNUyA9ICdLTVMnLFxufVxuXG4vKipcbiAqIE5vdGlmaWNhdGlvbiBldmVudCB0eXBlcy5cbiAqIEBsaW5rIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BbWF6b25TMy9sYXRlc3QvdXNlcmd1aWRlL25vdGlmaWNhdGlvbi1ob3ctdG8tZXZlbnQtdHlwZXMtYW5kLWRlc3RpbmF0aW9ucy5odG1sI3N1cHBvcnRlZC1ub3RpZmljYXRpb24tZXZlbnQtdHlwZXNcbiAqL1xuZXhwb3J0IGVudW0gRXZlbnRUeXBlIHtcbiAgLyoqXG4gICAqIEFtYXpvbiBTMyBBUElzIHN1Y2ggYXMgUFVULCBQT1NULCBhbmQgQ09QWSBjYW4gY3JlYXRlIGFuIG9iamVjdC4gVXNpbmdcbiAgICogdGhlc2UgZXZlbnQgdHlwZXMsIHlvdSBjYW4gZW5hYmxlIG5vdGlmaWNhdGlvbiB3aGVuIGFuIG9iamVjdCBpcyBjcmVhdGVkXG4gICAqIHVzaW5nIGEgc3BlY2lmaWMgQVBJLCBvciB5b3UgY2FuIHVzZSB0aGUgczM6T2JqZWN0Q3JlYXRlZDoqIGV2ZW50IHR5cGUgdG9cbiAgICogcmVxdWVzdCBub3RpZmljYXRpb24gcmVnYXJkbGVzcyBvZiB0aGUgQVBJIHRoYXQgd2FzIHVzZWQgdG8gY3JlYXRlIGFuXG4gICAqIG9iamVjdC5cbiAgICovXG4gIE9CSkVDVF9DUkVBVEVEID0gJ3MzOk9iamVjdENyZWF0ZWQ6KicsXG5cbiAgLyoqXG4gICAqIEFtYXpvbiBTMyBBUElzIHN1Y2ggYXMgUFVULCBQT1NULCBhbmQgQ09QWSBjYW4gY3JlYXRlIGFuIG9iamVjdC4gVXNpbmdcbiAgICogdGhlc2UgZXZlbnQgdHlwZXMsIHlvdSBjYW4gZW5hYmxlIG5vdGlmaWNhdGlvbiB3aGVuIGFuIG9iamVjdCBpcyBjcmVhdGVkXG4gICAqIHVzaW5nIGEgc3BlY2lmaWMgQVBJLCBvciB5b3UgY2FuIHVzZSB0aGUgczM6T2JqZWN0Q3JlYXRlZDoqIGV2ZW50IHR5cGUgdG9cbiAgICogcmVxdWVzdCBub3RpZmljYXRpb24gcmVnYXJkbGVzcyBvZiB0aGUgQVBJIHRoYXQgd2FzIHVzZWQgdG8gY3JlYXRlIGFuXG4gICAqIG9iamVjdC5cbiAgICovXG4gIE9CSkVDVF9DUkVBVEVEX1BVVCA9ICdzMzpPYmplY3RDcmVhdGVkOlB1dCcsXG5cbiAgLyoqXG4gICAqIEFtYXpvbiBTMyBBUElzIHN1Y2ggYXMgUFVULCBQT1NULCBhbmQgQ09QWSBjYW4gY3JlYXRlIGFuIG9iamVjdC4gVXNpbmdcbiAgICogdGhlc2UgZXZlbnQgdHlwZXMsIHlvdSBjYW4gZW5hYmxlIG5vdGlmaWNhdGlvbiB3aGVuIGFuIG9iamVjdCBpcyBjcmVhdGVkXG4gICAqIHVzaW5nIGEgc3BlY2lmaWMgQVBJLCBvciB5b3UgY2FuIHVzZSB0aGUgczM6T2JqZWN0Q3JlYXRlZDoqIGV2ZW50IHR5cGUgdG9cbiAgICogcmVxdWVzdCBub3RpZmljYXRpb24gcmVnYXJkbGVzcyBvZiB0aGUgQVBJIHRoYXQgd2FzIHVzZWQgdG8gY3JlYXRlIGFuXG4gICAqIG9iamVjdC5cbiAgICovXG4gIE9CSkVDVF9DUkVBVEVEX1BPU1QgPSAnczM6T2JqZWN0Q3JlYXRlZDpQb3N0JyxcblxuICAvKipcbiAgICogQW1hem9uIFMzIEFQSXMgc3VjaCBhcyBQVVQsIFBPU1QsIGFuZCBDT1BZIGNhbiBjcmVhdGUgYW4gb2JqZWN0LiBVc2luZ1xuICAgKiB0aGVzZSBldmVudCB0eXBlcywgeW91IGNhbiBlbmFibGUgbm90aWZpY2F0aW9uIHdoZW4gYW4gb2JqZWN0IGlzIGNyZWF0ZWRcbiAgICogdXNpbmcgYSBzcGVjaWZpYyBBUEksIG9yIHlvdSBjYW4gdXNlIHRoZSBzMzpPYmplY3RDcmVhdGVkOiogZXZlbnQgdHlwZSB0b1xuICAgKiByZXF1ZXN0IG5vdGlmaWNhdGlvbiByZWdhcmRsZXNzIG9mIHRoZSBBUEkgdGhhdCB3YXMgdXNlZCB0byBjcmVhdGUgYW5cbiAgICogb2JqZWN0LlxuICAgKi9cbiAgT0JKRUNUX0NSRUFURURfQ09QWSA9ICdzMzpPYmplY3RDcmVhdGVkOkNvcHknLFxuXG4gIC8qKlxuICAgKiBBbWF6b24gUzMgQVBJcyBzdWNoIGFzIFBVVCwgUE9TVCwgYW5kIENPUFkgY2FuIGNyZWF0ZSBhbiBvYmplY3QuIFVzaW5nXG4gICAqIHRoZXNlIGV2ZW50IHR5cGVzLCB5b3UgY2FuIGVuYWJsZSBub3RpZmljYXRpb24gd2hlbiBhbiBvYmplY3QgaXMgY3JlYXRlZFxuICAgKiB1c2luZyBhIHNwZWNpZmljIEFQSSwgb3IgeW91IGNhbiB1c2UgdGhlIHMzOk9iamVjdENyZWF0ZWQ6KiBldmVudCB0eXBlIHRvXG4gICAqIHJlcXVlc3Qgbm90aWZpY2F0aW9uIHJlZ2FyZGxlc3Mgb2YgdGhlIEFQSSB0aGF0IHdhcyB1c2VkIHRvIGNyZWF0ZSBhblxuICAgKiBvYmplY3QuXG4gICAqL1xuICBPQkpFQ1RfQ1JFQVRFRF9DT01QTEVURV9NVUxUSVBBUlRfVVBMT0FEID0gJ3MzOk9iamVjdENyZWF0ZWQ6Q29tcGxldGVNdWx0aXBhcnRVcGxvYWQnLFxuXG4gIC8qKlxuICAgKiBCeSB1c2luZyB0aGUgT2JqZWN0UmVtb3ZlZCBldmVudCB0eXBlcywgeW91IGNhbiBlbmFibGUgbm90aWZpY2F0aW9uIHdoZW5cbiAgICogYW4gb2JqZWN0IG9yIGEgYmF0Y2ggb2Ygb2JqZWN0cyBpcyByZW1vdmVkIGZyb20gYSBidWNrZXQuXG4gICAqXG4gICAqIFlvdSBjYW4gcmVxdWVzdCBub3RpZmljYXRpb24gd2hlbiBhbiBvYmplY3QgaXMgZGVsZXRlZCBvciBhIHZlcnNpb25lZFxuICAgKiBvYmplY3QgaXMgcGVybWFuZW50bHkgZGVsZXRlZCBieSB1c2luZyB0aGUgczM6T2JqZWN0UmVtb3ZlZDpEZWxldGUgZXZlbnRcbiAgICogdHlwZS4gT3IgeW91IGNhbiByZXF1ZXN0IG5vdGlmaWNhdGlvbiB3aGVuIGEgZGVsZXRlIG1hcmtlciBpcyBjcmVhdGVkIGZvclxuICAgKiBhIHZlcnNpb25lZCBvYmplY3QgYnkgdXNpbmcgczM6T2JqZWN0UmVtb3ZlZDpEZWxldGVNYXJrZXJDcmVhdGVkLiBGb3JcbiAgICogaW5mb3JtYXRpb24gYWJvdXQgZGVsZXRpbmcgdmVyc2lvbmVkIG9iamVjdHMsIHNlZSBEZWxldGluZyBPYmplY3RcbiAgICogVmVyc2lvbnMuIFlvdSBjYW4gYWxzbyB1c2UgYSB3aWxkY2FyZCBzMzpPYmplY3RSZW1vdmVkOiogdG8gcmVxdWVzdFxuICAgKiBub3RpZmljYXRpb24gYW55dGltZSBhbiBvYmplY3QgaXMgZGVsZXRlZC5cbiAgICpcbiAgICogWW91IHdpbGwgbm90IHJlY2VpdmUgZXZlbnQgbm90aWZpY2F0aW9ucyBmcm9tIGF1dG9tYXRpYyBkZWxldGVzIGZyb21cbiAgICogbGlmZWN5Y2xlIHBvbGljaWVzIG9yIGZyb20gZmFpbGVkIG9wZXJhdGlvbnMuXG4gICAqL1xuICBPQkpFQ1RfUkVNT1ZFRCA9ICdzMzpPYmplY3RSZW1vdmVkOionLFxuXG4gIC8qKlxuICAgKiBCeSB1c2luZyB0aGUgT2JqZWN0UmVtb3ZlZCBldmVudCB0eXBlcywgeW91IGNhbiBlbmFibGUgbm90aWZpY2F0aW9uIHdoZW5cbiAgICogYW4gb2JqZWN0IG9yIGEgYmF0Y2ggb2Ygb2JqZWN0cyBpcyByZW1vdmVkIGZyb20gYSBidWNrZXQuXG4gICAqXG4gICAqIFlvdSBjYW4gcmVxdWVzdCBub3RpZmljYXRpb24gd2hlbiBhbiBvYmplY3QgaXMgZGVsZXRlZCBvciBhIHZlcnNpb25lZFxuICAgKiBvYmplY3QgaXMgcGVybWFuZW50bHkgZGVsZXRlZCBieSB1c2luZyB0aGUgczM6T2JqZWN0UmVtb3ZlZDpEZWxldGUgZXZlbnRcbiAgICogdHlwZS4gT3IgeW91IGNhbiByZXF1ZXN0IG5vdGlmaWNhdGlvbiB3aGVuIGEgZGVsZXRlIG1hcmtlciBpcyBjcmVhdGVkIGZvclxuICAgKiBhIHZlcnNpb25lZCBvYmplY3QgYnkgdXNpbmcgczM6T2JqZWN0UmVtb3ZlZDpEZWxldGVNYXJrZXJDcmVhdGVkLiBGb3JcbiAgICogaW5mb3JtYXRpb24gYWJvdXQgZGVsZXRpbmcgdmVyc2lvbmVkIG9iamVjdHMsIHNlZSBEZWxldGluZyBPYmplY3RcbiAgICogVmVyc2lvbnMuIFlvdSBjYW4gYWxzbyB1c2UgYSB3aWxkY2FyZCBzMzpPYmplY3RSZW1vdmVkOiogdG8gcmVxdWVzdFxuICAgKiBub3RpZmljYXRpb24gYW55dGltZSBhbiBvYmplY3QgaXMgZGVsZXRlZC5cbiAgICpcbiAgICogWW91IHdpbGwgbm90IHJlY2VpdmUgZXZlbnQgbm90aWZpY2F0aW9ucyBmcm9tIGF1dG9tYXRpYyBkZWxldGVzIGZyb21cbiAgICogbGlmZWN5Y2xlIHBvbGljaWVzIG9yIGZyb20gZmFpbGVkIG9wZXJhdGlvbnMuXG4gICAqL1xuICBPQkpFQ1RfUkVNT1ZFRF9ERUxFVEUgPSAnczM6T2JqZWN0UmVtb3ZlZDpEZWxldGUnLFxuXG4gIC8qKlxuICAgKiBCeSB1c2luZyB0aGUgT2JqZWN0UmVtb3ZlZCBldmVudCB0eXBlcywgeW91IGNhbiBlbmFibGUgbm90aWZpY2F0aW9uIHdoZW5cbiAgICogYW4gb2JqZWN0IG9yIGEgYmF0Y2ggb2Ygb2JqZWN0cyBpcyByZW1vdmVkIGZyb20gYSBidWNrZXQuXG4gICAqXG4gICAqIFlvdSBjYW4gcmVxdWVzdCBub3RpZmljYXRpb24gd2hlbiBhbiBvYmplY3QgaXMgZGVsZXRlZCBvciBhIHZlcnNpb25lZFxuICAgKiBvYmplY3QgaXMgcGVybWFuZW50bHkgZGVsZXRlZCBieSB1c2luZyB0aGUgczM6T2JqZWN0UmVtb3ZlZDpEZWxldGUgZXZlbnRcbiAgICogdHlwZS4gT3IgeW91IGNhbiByZXF1ZXN0IG5vdGlmaWNhdGlvbiB3aGVuIGEgZGVsZXRlIG1hcmtlciBpcyBjcmVhdGVkIGZvclxuICAgKiBhIHZlcnNpb25lZCBvYmplY3QgYnkgdXNpbmcgczM6T2JqZWN0UmVtb3ZlZDpEZWxldGVNYXJrZXJDcmVhdGVkLiBGb3JcbiAgICogaW5mb3JtYXRpb24gYWJvdXQgZGVsZXRpbmcgdmVyc2lvbmVkIG9iamVjdHMsIHNlZSBEZWxldGluZyBPYmplY3RcbiAgICogVmVyc2lvbnMuIFlvdSBjYW4gYWxzbyB1c2UgYSB3aWxkY2FyZCBzMzpPYmplY3RSZW1vdmVkOiogdG8gcmVxdWVzdFxuICAgKiBub3RpZmljYXRpb24gYW55dGltZSBhbiBvYmplY3QgaXMgZGVsZXRlZC5cbiAgICpcbiAgICogWW91IHdpbGwgbm90IHJlY2VpdmUgZXZlbnQgbm90aWZpY2F0aW9ucyBmcm9tIGF1dG9tYXRpYyBkZWxldGVzIGZyb21cbiAgICogbGlmZWN5Y2xlIHBvbGljaWVzIG9yIGZyb20gZmFpbGVkIG9wZXJhdGlvbnMuXG4gICAqL1xuICBPQkpFQ1RfUkVNT1ZFRF9ERUxFVEVfTUFSS0VSX0NSRUFURUQgPSAnczM6T2JqZWN0UmVtb3ZlZDpEZWxldGVNYXJrZXJDcmVhdGVkJyxcblxuICAvKipcbiAgICogVXNpbmcgcmVzdG9yZSBvYmplY3QgZXZlbnQgdHlwZXMgeW91IGNhbiByZWNlaXZlIG5vdGlmaWNhdGlvbnMgZm9yXG4gICAqIGluaXRpYXRpb24gYW5kIGNvbXBsZXRpb24gd2hlbiByZXN0b3Jpbmcgb2JqZWN0cyBmcm9tIHRoZSBTMyBHbGFjaWVyXG4gICAqIHN0b3JhZ2UgY2xhc3MuXG4gICAqXG4gICAqIFlvdSB1c2UgczM6T2JqZWN0UmVzdG9yZTpQb3N0IHRvIHJlcXVlc3Qgbm90aWZpY2F0aW9uIG9mIG9iamVjdCByZXN0b3JhdGlvblxuICAgKiBpbml0aWF0aW9uLlxuICAgKi9cbiAgT0JKRUNUX1JFU1RPUkVfUE9TVCA9ICdzMzpPYmplY3RSZXN0b3JlOlBvc3QnLFxuXG4gIC8qKlxuICAgKiBVc2luZyByZXN0b3JlIG9iamVjdCBldmVudCB0eXBlcyB5b3UgY2FuIHJlY2VpdmUgbm90aWZpY2F0aW9ucyBmb3JcbiAgICogaW5pdGlhdGlvbiBhbmQgY29tcGxldGlvbiB3aGVuIHJlc3RvcmluZyBvYmplY3RzIGZyb20gdGhlIFMzIEdsYWNpZXJcbiAgICogc3RvcmFnZSBjbGFzcy5cbiAgICpcbiAgICogWW91IHVzZSBzMzpPYmplY3RSZXN0b3JlOkNvbXBsZXRlZCB0byByZXF1ZXN0IG5vdGlmaWNhdGlvbiBvZlxuICAgKiByZXN0b3JhdGlvbiBjb21wbGV0aW9uLlxuICAgKi9cbiAgT0JKRUNUX1JFU1RPUkVfQ09NUExFVEVEID0gJ3MzOk9iamVjdFJlc3RvcmU6Q29tcGxldGVkJyxcblxuICAvKipcbiAgICogVXNpbmcgcmVzdG9yZSBvYmplY3QgZXZlbnQgdHlwZXMgeW91IGNhbiByZWNlaXZlIG5vdGlmaWNhdGlvbnMgZm9yXG4gICAqIGluaXRpYXRpb24gYW5kIGNvbXBsZXRpb24gd2hlbiByZXN0b3Jpbmcgb2JqZWN0cyBmcm9tIHRoZSBTMyBHbGFjaWVyXG4gICAqIHN0b3JhZ2UgY2xhc3MuXG4gICAqXG4gICAqIFlvdSB1c2UgczM6T2JqZWN0UmVzdG9yZTpEZWxldGUgdG8gcmVxdWVzdCBub3RpZmljYXRpb24gb2ZcbiAgICogcmVzdG9yYXRpb24gY29tcGxldGlvbi5cbiAgICovXG4gIE9CSkVDVF9SRVNUT1JFX0RFTEVURSA9ICdzMzpPYmplY3RSZXN0b3JlOkRlbGV0ZScsXG5cbiAgLyoqXG4gICAqIFlvdSBjYW4gdXNlIHRoaXMgZXZlbnQgdHlwZSB0byByZXF1ZXN0IEFtYXpvbiBTMyB0byBzZW5kIGEgbm90aWZpY2F0aW9uXG4gICAqIG1lc3NhZ2Ugd2hlbiBBbWF6b24gUzMgZGV0ZWN0cyB0aGF0IGFuIG9iamVjdCBvZiB0aGUgUlJTIHN0b3JhZ2UgY2xhc3MgaXNcbiAgICogbG9zdC5cbiAgICovXG4gIFJFRFVDRURfUkVEVU5EQU5DWV9MT1NUX09CSkVDVCA9ICdzMzpSZWR1Y2VkUmVkdW5kYW5jeUxvc3RPYmplY3QnLFxuXG4gIC8qKlxuICAgKiBZb3UgcmVjZWl2ZSB0aGlzIG5vdGlmaWNhdGlvbiBldmVudCB3aGVuIGFuIG9iamVjdCB0aGF0IHdhcyBlbGlnaWJsZSBmb3JcbiAgICogcmVwbGljYXRpb24gdXNpbmcgQW1hem9uIFMzIFJlcGxpY2F0aW9uIFRpbWUgQ29udHJvbCBmYWlsZWQgdG8gcmVwbGljYXRlLlxuICAgKi9cbiAgUkVQTElDQVRJT05fT1BFUkFUSU9OX0ZBSUxFRF9SRVBMSUNBVElPTiA9ICdzMzpSZXBsaWNhdGlvbjpPcGVyYXRpb25GYWlsZWRSZXBsaWNhdGlvbicsXG5cbiAgLyoqXG4gICAqIFlvdSByZWNlaXZlIHRoaXMgbm90aWZpY2F0aW9uIGV2ZW50IHdoZW4gYW4gb2JqZWN0IHRoYXQgd2FzIGVsaWdpYmxlIGZvclxuICAgKiByZXBsaWNhdGlvbiB1c2luZyBBbWF6b24gUzMgUmVwbGljYXRpb24gVGltZSBDb250cm9sIGV4Y2VlZGVkIHRoZSAxNS1taW51dGVcbiAgICogdGhyZXNob2xkIGZvciByZXBsaWNhdGlvbi5cbiAgICovXG4gIFJFUExJQ0FUSU9OX09QRVJBVElPTl9NSVNTRURfVEhSRVNIT0xEID0gJ3MzOlJlcGxpY2F0aW9uOk9wZXJhdGlvbk1pc3NlZFRocmVzaG9sZCcsXG5cbiAgLyoqXG4gICAqIFlvdSByZWNlaXZlIHRoaXMgbm90aWZpY2F0aW9uIGV2ZW50IGZvciBhbiBvYmplY3QgdGhhdCB3YXMgZWxpZ2libGUgZm9yXG4gICAqIHJlcGxpY2F0aW9uIHVzaW5nIHRoZSBBbWF6b24gUzMgUmVwbGljYXRpb24gVGltZSBDb250cm9sIGZlYXR1cmUgcmVwbGljYXRlZFxuICAgKiBhZnRlciB0aGUgMTUtbWludXRlIHRocmVzaG9sZC5cbiAgICovXG4gIFJFUExJQ0FUSU9OX09QRVJBVElPTl9SRVBMSUNBVEVEX0FGVEVSX1RIUkVTSE9MRCA9ICdzMzpSZXBsaWNhdGlvbjpPcGVyYXRpb25SZXBsaWNhdGVkQWZ0ZXJUaHJlc2hvbGQnLFxuXG4gIC8qKlxuICAgKiBZb3UgcmVjZWl2ZSB0aGlzIG5vdGlmaWNhdGlvbiBldmVudCBmb3IgYW4gb2JqZWN0IHRoYXQgd2FzIGVsaWdpYmxlIGZvclxuICAgKiByZXBsaWNhdGlvbiB1c2luZyBBbWF6b24gUzMgUmVwbGljYXRpb24gVGltZSBDb250cm9sIGJ1dCBpcyBubyBsb25nZXIgdHJhY2tlZFxuICAgKiBieSByZXBsaWNhdGlvbiBtZXRyaWNzLlxuICAgKi9cbiAgUkVQTElDQVRJT05fT1BFUkFUSU9OX05PVF9UUkFDS0VEID0gJ3MzOlJlcGxpY2F0aW9uOk9wZXJhdGlvbk5vdFRyYWNrZWQnLFxuXG4gIC8qKlxuICAgKiBCeSB1c2luZyB0aGUgTGlmZWN5Y2xlRXhwaXJhdGlvbiBldmVudCB0eXBlcywgeW91IGNhbiByZWNlaXZlIGEgbm90aWZpY2F0aW9uXG4gICAqIHdoZW4gQW1hem9uIFMzIGRlbGV0ZXMgYW4gb2JqZWN0IGJhc2VkIG9uIHlvdXIgUzMgTGlmZWN5Y2xlIGNvbmZpZ3VyYXRpb24uXG4gICAqL1xuICBMSUZFQ1lDTEVfRVhQSVJBVElPTiA9ICdzMzpMaWZlY3ljbGVFeHBpcmF0aW9uOionLFxuXG4gIC8qKlxuICAgKiBUaGUgczM6TGlmZWN5Y2xlRXhwaXJhdGlvbjpEZWxldGUgZXZlbnQgdHlwZSBub3RpZmllcyB5b3Ugd2hlbiBhbiBvYmplY3RcbiAgICogaW4gYW4gdW52ZXJzaW9uZWQgYnVja2V0IGlzIGRlbGV0ZWQuXG4gICAqIEl0IGFsc28gbm90aWZpZXMgeW91IHdoZW4gYW4gb2JqZWN0IHZlcnNpb24gaXMgcGVybWFuZW50bHkgZGVsZXRlZCBieSBhblxuICAgKiBTMyBMaWZlY3ljbGUgY29uZmlndXJhdGlvbi5cbiAgICovXG4gIExJRkVDWUNMRV9FWFBJUkFUSU9OX0RFTEVURSA9ICdzMzpMaWZlY3ljbGVFeHBpcmF0aW9uOkRlbGV0ZScsXG5cbiAgLyoqXG4gICAqIFRoZSBzMzpMaWZlY3ljbGVFeHBpcmF0aW9uOkRlbGV0ZU1hcmtlckNyZWF0ZWQgZXZlbnQgdHlwZSBub3RpZmllcyB5b3VcbiAgICogd2hlbiBTMyBMaWZlY3ljbGUgY3JlYXRlcyBhIGRlbGV0ZSBtYXJrZXIgd2hlbiBhIGN1cnJlbnQgdmVyc2lvbiBvZiBhblxuICAgKiBvYmplY3QgaW4gdmVyc2lvbmVkIGJ1Y2tldCBpcyBkZWxldGVkLlxuICAgKi9cbiAgTElGRUNZQ0xFX0VYUElSQVRJT05fREVMRVRFX01BUktFUl9DUkVBVEVEID0gJ3MzOkxpZmVjeWNsZUV4cGlyYXRpb246RGVsZXRlTWFya2VyQ3JlYXRlZCcsXG5cbiAgLyoqXG4gICAqIFlvdSByZWNlaXZlIHRoaXMgbm90aWZpY2F0aW9uIGV2ZW50IHdoZW4gYW4gb2JqZWN0IGlzIHRyYW5zaXRpb25lZCB0b1xuICAgKiBhbm90aGVyIEFtYXpvbiBTMyBzdG9yYWdlIGNsYXNzIGJ5IGFuIFMzIExpZmVjeWNsZSBjb25maWd1cmF0aW9uLlxuICAgKi9cbiAgTElGRUNZQ0xFX1RSQU5TSVRJT04gPSAnczM6TGlmZWN5Y2xlVHJhbnNpdGlvbicsXG5cbiAgLyoqXG4gICAqIFlvdSByZWNlaXZlIHRoaXMgbm90aWZpY2F0aW9uIGV2ZW50IHdoZW4gYW4gb2JqZWN0IHdpdGhpbiB0aGVcbiAgICogUzMgSW50ZWxsaWdlbnQtVGllcmluZyBzdG9yYWdlIGNsYXNzIG1vdmVkIHRvIHRoZSBBcmNoaXZlIEFjY2VzcyB0aWVyIG9yXG4gICAqIERlZXAgQXJjaGl2ZSBBY2Nlc3MgdGllci5cbiAgICovXG4gIElOVEVMTElHRU5UX1RJRVJJTkcgPSAnczM6SW50ZWxsaWdlbnRUaWVyaW5nJyxcblxuICAvKipcbiAgICogQnkgdXNpbmcgdGhlIE9iamVjdFRhZ2dpbmcgZXZlbnQgdHlwZXMsIHlvdSBjYW4gZW5hYmxlIG5vdGlmaWNhdGlvbiB3aGVuXG4gICAqIGFuIG9iamVjdCB0YWcgaXMgYWRkZWQgb3IgZGVsZXRlZCBmcm9tIGFuIG9iamVjdC5cbiAgICovXG4gIE9CSkVDVF9UQUdHSU5HID0gJ3MzOk9iamVjdFRhZ2dpbmc6KicsXG5cbiAgLyoqXG4gICAqIFRoZSBzMzpPYmplY3RUYWdnaW5nOlB1dCBldmVudCB0eXBlIG5vdGlmaWVzIHlvdSB3aGVuIGEgdGFnIGlzIFBVVCBvbiBhblxuICAgKiBvYmplY3Qgb3IgYW4gZXhpc3RpbmcgdGFnIGlzIHVwZGF0ZWQuXG5cbiAgICovXG4gIE9CSkVDVF9UQUdHSU5HX1BVVCA9ICdzMzpPYmplY3RUYWdnaW5nOlB1dCcsXG5cbiAgLyoqXG4gICAqIFRoZSBzMzpPYmplY3RUYWdnaW5nOkRlbGV0ZSBldmVudCB0eXBlIG5vdGlmaWVzIHlvdSB3aGVuIGEgdGFnIGlzIHJlbW92ZWRcbiAgICogZnJvbSBhbiBvYmplY3QuXG4gICAqL1xuICBPQkpFQ1RfVEFHR0lOR19ERUxFVEUgPSAnczM6T2JqZWN0VGFnZ2luZzpEZWxldGUnLFxuXG4gIC8qKlxuICAgKiBZb3UgcmVjZWl2ZSB0aGlzIG5vdGlmaWNhdGlvbiBldmVudCB3aGVuIGFuIEFDTCBpcyBQVVQgb24gYW4gb2JqZWN0IG9yIHdoZW5cbiAgICogYW4gZXhpc3RpbmcgQUNMIGlzIGNoYW5nZWQuXG4gICAqIEFuIGV2ZW50IGlzIG5vdCBnZW5lcmF0ZWQgd2hlbiBhIHJlcXVlc3QgcmVzdWx0cyBpbiBubyBjaGFuZ2UgdG8gYW5cbiAgICogb2JqZWN04oCZcyBBQ0wuXG4gICAqL1xuICBPQkpFQ1RfQUNMX1BVVCA9ICdzMzpPYmplY3RBY2w6UHV0Jyxcbn1cblxuZXhwb3J0IGludGVyZmFjZSBOb3RpZmljYXRpb25LZXlGaWx0ZXIge1xuICAvKipcbiAgICogUzMga2V5cyBtdXN0IGhhdmUgdGhlIHNwZWNpZmllZCBwcmVmaXguXG4gICAqL1xuICByZWFkb25seSBwcmVmaXg/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFMzIGtleXMgbXVzdCBoYXZlIHRoZSBzcGVjaWZpZWQgc3VmZml4LlxuICAgKi9cbiAgcmVhZG9ubHkgc3VmZml4Pzogc3RyaW5nO1xufVxuXG4vKipcbiAqIE9wdGlvbnMgZm9yIHRoZSBvbkNsb3VkVHJhaWxQdXRPYmplY3QgbWV0aG9kXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgT25DbG91ZFRyYWlsQnVja2V0RXZlbnRPcHRpb25zIGV4dGVuZHMgZXZlbnRzLk9uRXZlbnRPcHRpb25zIHtcbiAgLyoqXG4gICAqIE9ubHkgd2F0Y2ggY2hhbmdlcyB0byB0aGVzZSBvYmplY3QgcGF0aHNcbiAgICpcbiAgICogQGRlZmF1bHQgLSBXYXRjaCBjaGFuZ2VzIHRvIGFsbCBvYmplY3RzXG4gICAqL1xuICByZWFkb25seSBwYXRocz86IHN0cmluZ1tdO1xufVxuXG4vKipcbiAqIERlZmF1bHQgYnVja2V0IGFjY2VzcyBjb250cm9sIHR5cGVzLlxuICpcbiAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FtYXpvblMzL2xhdGVzdC9kZXYvYWNsLW92ZXJ2aWV3Lmh0bWxcbiAqL1xuZXhwb3J0IGVudW0gQnVja2V0QWNjZXNzQ29udHJvbCB7XG4gIC8qKlxuICAgKiBPd25lciBnZXRzIEZVTExfQ09OVFJPTC4gTm8gb25lIGVsc2UgaGFzIGFjY2VzcyByaWdodHMuXG4gICAqL1xuICBQUklWQVRFID0gJ1ByaXZhdGUnLFxuXG4gIC8qKlxuICAgKiBPd25lciBnZXRzIEZVTExfQ09OVFJPTC4gVGhlIEFsbFVzZXJzIGdyb3VwIGdldHMgUkVBRCBhY2Nlc3MuXG4gICAqL1xuICBQVUJMSUNfUkVBRCA9ICdQdWJsaWNSZWFkJyxcblxuICAvKipcbiAgICogT3duZXIgZ2V0cyBGVUxMX0NPTlRST0wuIFRoZSBBbGxVc2VycyBncm91cCBnZXRzIFJFQUQgYW5kIFdSSVRFIGFjY2Vzcy5cbiAgICogR3JhbnRpbmcgdGhpcyBvbiBhIGJ1Y2tldCBpcyBnZW5lcmFsbHkgbm90IHJlY29tbWVuZGVkLlxuICAgKi9cbiAgUFVCTElDX1JFQURfV1JJVEUgPSAnUHVibGljUmVhZFdyaXRlJyxcblxuICAvKipcbiAgICogT3duZXIgZ2V0cyBGVUxMX0NPTlRST0wuIFRoZSBBdXRoZW50aWNhdGVkVXNlcnMgZ3JvdXAgZ2V0cyBSRUFEIGFjY2Vzcy5cbiAgICovXG4gIEFVVEhFTlRJQ0FURURfUkVBRCA9ICdBdXRoZW50aWNhdGVkUmVhZCcsXG5cbiAgLyoqXG4gICAqIFRoZSBMb2dEZWxpdmVyeSBncm91cCBnZXRzIFdSSVRFIGFuZCBSRUFEX0FDUCBwZXJtaXNzaW9ucyBvbiB0aGUgYnVja2V0LlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BbWF6b25TMy9sYXRlc3QvZGV2L1NlcnZlckxvZ3MuaHRtbFxuICAgKi9cbiAgTE9HX0RFTElWRVJZX1dSSVRFID0gJ0xvZ0RlbGl2ZXJ5V3JpdGUnLFxuXG4gIC8qKlxuICAgKiBPYmplY3Qgb3duZXIgZ2V0cyBGVUxMX0NPTlRST0wuIEJ1Y2tldCBvd25lciBnZXRzIFJFQUQgYWNjZXNzLlxuICAgKiBJZiB5b3Ugc3BlY2lmeSB0aGlzIGNhbm5lZCBBQ0wgd2hlbiBjcmVhdGluZyBhIGJ1Y2tldCwgQW1hem9uIFMzIGlnbm9yZXMgaXQuXG4gICAqL1xuICBCVUNLRVRfT1dORVJfUkVBRCA9ICdCdWNrZXRPd25lclJlYWQnLFxuXG4gIC8qKlxuICAgKiBCb3RoIHRoZSBvYmplY3Qgb3duZXIgYW5kIHRoZSBidWNrZXQgb3duZXIgZ2V0IEZVTExfQ09OVFJPTCBvdmVyIHRoZSBvYmplY3QuXG4gICAqIElmIHlvdSBzcGVjaWZ5IHRoaXMgY2FubmVkIEFDTCB3aGVuIGNyZWF0aW5nIGEgYnVja2V0LCBBbWF6b24gUzMgaWdub3JlcyBpdC5cbiAgICovXG4gIEJVQ0tFVF9PV05FUl9GVUxMX0NPTlRST0wgPSAnQnVja2V0T3duZXJGdWxsQ29udHJvbCcsXG5cbiAgLyoqXG4gICAqIE93bmVyIGdldHMgRlVMTF9DT05UUk9MLiBBbWF6b24gRUMyIGdldHMgUkVBRCBhY2Nlc3MgdG8gR0VUIGFuIEFtYXpvbiBNYWNoaW5lIEltYWdlIChBTUkpIGJ1bmRsZSBmcm9tIEFtYXpvbiBTMy5cbiAgICovXG4gIEFXU19FWEVDX1JFQUQgPSAnQXdzRXhlY1JlYWQnLFxufVxuXG5leHBvcnQgaW50ZXJmYWNlIFJvdXRpbmdSdWxlQ29uZGl0aW9uIHtcbiAgLyoqXG4gICAqIFRoZSBIVFRQIGVycm9yIGNvZGUgd2hlbiB0aGUgcmVkaXJlY3QgaXMgYXBwbGllZFxuICAgKlxuICAgKiBJbiB0aGUgZXZlbnQgb2YgYW4gZXJyb3IsIGlmIHRoZSBlcnJvciBjb2RlIGVxdWFscyB0aGlzIHZhbHVlLCB0aGVuIHRoZSBzcGVjaWZpZWQgcmVkaXJlY3QgaXMgYXBwbGllZC5cbiAgICpcbiAgICogSWYgYm90aCBjb25kaXRpb24gcHJvcGVydGllcyBhcmUgc3BlY2lmaWVkLCBib3RoIG11c3QgYmUgdHJ1ZSBmb3IgdGhlIHJlZGlyZWN0IHRvIGJlIGFwcGxpZWQuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gVGhlIEhUVFAgZXJyb3IgY29kZSB3aWxsIG5vdCBiZSB2ZXJpZmllZFxuICAgKi9cbiAgcmVhZG9ubHkgaHR0cEVycm9yQ29kZVJldHVybmVkRXF1YWxzPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgb2JqZWN0IGtleSBuYW1lIHByZWZpeCB3aGVuIHRoZSByZWRpcmVjdCBpcyBhcHBsaWVkXG4gICAqXG4gICAqIElmIGJvdGggY29uZGl0aW9uIHByb3BlcnRpZXMgYXJlIHNwZWNpZmllZCwgYm90aCBtdXN0IGJlIHRydWUgZm9yIHRoZSByZWRpcmVjdCB0byBiZSBhcHBsaWVkLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIFRoZSBvYmplY3Qga2V5IG5hbWUgd2lsbCBub3QgYmUgdmVyaWZpZWRcbiAgICovXG4gIHJlYWRvbmx5IGtleVByZWZpeEVxdWFscz86IHN0cmluZztcbn1cblxuZXhwb3J0IGNsYXNzIFJlcGxhY2VLZXkge1xuICAvKipcbiAgICogVGhlIHNwZWNpZmljIG9iamVjdCBrZXkgdG8gdXNlIGluIHRoZSByZWRpcmVjdCByZXF1ZXN0XG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHdpdGgoa2V5UmVwbGFjZW1lbnQ6IHN0cmluZykge1xuICAgIHJldHVybiBuZXcgdGhpcyhrZXlSZXBsYWNlbWVudCk7XG4gIH1cblxuICAvKipcbiAgICogVGhlIG9iamVjdCBrZXkgcHJlZml4IHRvIHVzZSBpbiB0aGUgcmVkaXJlY3QgcmVxdWVzdFxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBwcmVmaXhXaXRoKGtleVJlcGxhY2VtZW50OiBzdHJpbmcpIHtcbiAgICByZXR1cm4gbmV3IHRoaXModW5kZWZpbmVkLCBrZXlSZXBsYWNlbWVudCk7XG4gIH1cblxuICBwcml2YXRlIGNvbnN0cnVjdG9yKHB1YmxpYyByZWFkb25seSB3aXRoS2V5Pzogc3RyaW5nLCBwdWJsaWMgcmVhZG9ubHkgcHJlZml4V2l0aEtleT86IHN0cmluZykge1xuICB9XG59XG5cbi8qKlxuICogUnVsZSB0aGF0IGRlZmluZSB3aGVuIGEgcmVkaXJlY3QgaXMgYXBwbGllZCBhbmQgdGhlIHJlZGlyZWN0IGJlaGF2aW9yLlxuICpcbiAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FtYXpvblMzL2xhdGVzdC9kZXYvaG93LXRvLXBhZ2UtcmVkaXJlY3QuaHRtbFxuICovXG5leHBvcnQgaW50ZXJmYWNlIFJvdXRpbmdSdWxlIHtcbiAgLyoqXG4gICAqIFRoZSBob3N0IG5hbWUgdG8gdXNlIGluIHRoZSByZWRpcmVjdCByZXF1ZXN0XG4gICAqXG4gICAqIEBkZWZhdWx0IC0gVGhlIGhvc3QgbmFtZSB1c2VkIGluIHRoZSBvcmlnaW5hbCByZXF1ZXN0LlxuICAgKi9cbiAgcmVhZG9ubHkgaG9zdE5hbWU/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBIVFRQIHJlZGlyZWN0IGNvZGUgdG8gdXNlIG9uIHRoZSByZXNwb25zZVxuICAgKlxuICAgKiBAZGVmYXVsdCBcIjMwMVwiIC0gTW92ZWQgUGVybWFuZW50bHlcbiAgICovXG4gIHJlYWRvbmx5IGh0dHBSZWRpcmVjdENvZGU/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFByb3RvY29sIHRvIHVzZSB3aGVuIHJlZGlyZWN0aW5nIHJlcXVlc3RzXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gVGhlIHByb3RvY29sIHVzZWQgaW4gdGhlIG9yaWdpbmFsIHJlcXVlc3QuXG4gICAqL1xuICByZWFkb25seSBwcm90b2NvbD86IFJlZGlyZWN0UHJvdG9jb2w7XG5cbiAgLyoqXG4gICAqIFNwZWNpZmllcyB0aGUgb2JqZWN0IGtleSBwcmVmaXggdG8gdXNlIGluIHRoZSByZWRpcmVjdCByZXF1ZXN0XG4gICAqXG4gICAqIEBkZWZhdWx0IC0gVGhlIGtleSB3aWxsIG5vdCBiZSByZXBsYWNlZFxuICAgKi9cbiAgcmVhZG9ubHkgcmVwbGFjZUtleT86IFJlcGxhY2VLZXk7XG5cbiAgLyoqXG4gICAqIFNwZWNpZmllcyBhIGNvbmRpdGlvbiB0aGF0IG11c3QgYmUgbWV0IGZvciB0aGUgc3BlY2lmaWVkIHJlZGlyZWN0IHRvIGFwcGx5LlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vIGNvbmRpdGlvblxuICAgKi9cbiAgcmVhZG9ubHkgY29uZGl0aW9uPzogUm91dGluZ1J1bGVDb25kaXRpb247XG59XG5cbi8qKlxuICogTW9kZXMgaW4gd2hpY2ggUzMgT2JqZWN0IExvY2sgcmV0ZW50aW9uIGNhbiBiZSBjb25maWd1cmVkLlxuICpcbiAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FtYXpvblMzL2xhdGVzdC91c2VyZ3VpZGUvb2JqZWN0LWxvY2stb3ZlcnZpZXcuaHRtbCNvYmplY3QtbG9jay1yZXRlbnRpb24tbW9kZXNcbiAqL1xuZXhwb3J0IGVudW0gT2JqZWN0TG9ja01vZGUge1xuICAvKipcbiAgICogVGhlIEdvdmVybmFuY2UgcmV0ZW50aW9uIG1vZGUuXG4gICAqXG4gICAqIFdpdGggZ292ZXJuYW5jZSBtb2RlLCB5b3UgcHJvdGVjdCBvYmplY3RzIGFnYWluc3QgYmVpbmcgZGVsZXRlZCBieSBtb3N0IHVzZXJzLCBidXQgeW91IGNhblxuICAgKiBzdGlsbCBncmFudCBzb21lIHVzZXJzIHBlcm1pc3Npb24gdG8gYWx0ZXIgdGhlIHJldGVudGlvbiBzZXR0aW5ncyBvciBkZWxldGUgdGhlIG9iamVjdCBpZlxuICAgKiBuZWNlc3NhcnkuIFlvdSBjYW4gYWxzbyB1c2UgZ292ZXJuYW5jZSBtb2RlIHRvIHRlc3QgcmV0ZW50aW9uLXBlcmlvZCBzZXR0aW5ncyBiZWZvcmVcbiAgICogY3JlYXRpbmcgYSBjb21wbGlhbmNlLW1vZGUgcmV0ZW50aW9uIHBlcmlvZC5cbiAgICovXG4gIEdPVkVSTkFOQ0UgPSAnR09WRVJOQU5DRScsXG5cbiAgLyoqXG4gICAqIFRoZSBDb21wbGlhbmNlIHJldGVudGlvbiBtb2RlLlxuICAgKlxuICAgKiBXaGVuIGFuIG9iamVjdCBpcyBsb2NrZWQgaW4gY29tcGxpYW5jZSBtb2RlLCBpdHMgcmV0ZW50aW9uIG1vZGUgY2FuJ3QgYmUgY2hhbmdlZCwgYW5kXG4gICAqIGl0cyByZXRlbnRpb24gcGVyaW9kIGNhbid0IGJlIHNob3J0ZW5lZC4gQ29tcGxpYW5jZSBtb2RlIGhlbHBzIGVuc3VyZSB0aGF0IGFuIG9iamVjdFxuICAgKiB2ZXJzaW9uIGNhbid0IGJlIG92ZXJ3cml0dGVuIG9yIGRlbGV0ZWQgZm9yIHRoZSBkdXJhdGlvbiBvZiB0aGUgcmV0ZW50aW9uIHBlcmlvZC5cbiAgICovXG4gIENPTVBMSUFOQ0UgPSAnQ09NUExJQU5DRScsXG59XG5cbi8qKlxuICogVGhlIGRlZmF1bHQgcmV0ZW50aW9uIHNldHRpbmdzIGZvciBhbiBTMyBPYmplY3QgTG9jayBjb25maWd1cmF0aW9uLlxuICpcbiAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FtYXpvblMzL2xhdGVzdC91c2VyZ3VpZGUvb2JqZWN0LWxvY2stb3ZlcnZpZXcuaHRtbFxuICovXG5leHBvcnQgY2xhc3MgT2JqZWN0TG9ja1JldGVudGlvbiB7XG4gIC8qKlxuICAgKiBDb25maWd1cmUgZm9yIEdvdmVybmFuY2UgcmV0ZW50aW9uIGZvciBhIHNwZWNpZmllZCBkdXJhdGlvbi5cbiAgICpcbiAgICogV2l0aCBnb3Zlcm5hbmNlIG1vZGUsIHlvdSBwcm90ZWN0IG9iamVjdHMgYWdhaW5zdCBiZWluZyBkZWxldGVkIGJ5IG1vc3QgdXNlcnMsIGJ1dCB5b3UgY2FuXG4gICAqIHN0aWxsIGdyYW50IHNvbWUgdXNlcnMgcGVybWlzc2lvbiB0byBhbHRlciB0aGUgcmV0ZW50aW9uIHNldHRpbmdzIG9yIGRlbGV0ZSB0aGUgb2JqZWN0IGlmXG4gICAqIG5lY2Vzc2FyeS4gWW91IGNhbiBhbHNvIHVzZSBnb3Zlcm5hbmNlIG1vZGUgdG8gdGVzdCByZXRlbnRpb24tcGVyaW9kIHNldHRpbmdzIGJlZm9yZVxuICAgKiBjcmVhdGluZyBhIGNvbXBsaWFuY2UtbW9kZSByZXRlbnRpb24gcGVyaW9kLlxuICAgKlxuICAgKiBAcGFyYW0gZHVyYXRpb24gdGhlIGxlbmd0aCBvZiB0aW1lIGZvciB3aGljaCBvYmplY3RzIHNob3VsZCByZXRhaW5lZFxuICAgKiBAcmV0dXJucyB0aGUgT2JqZWN0TG9ja1JldGVudGlvbiBjb25maWd1cmF0aW9uXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGdvdmVybmFuY2UoZHVyYXRpb246IER1cmF0aW9uKTogT2JqZWN0TG9ja1JldGVudGlvbiB7XG4gICAgcmV0dXJuIG5ldyBPYmplY3RMb2NrUmV0ZW50aW9uKE9iamVjdExvY2tNb2RlLkdPVkVSTkFOQ0UsIGR1cmF0aW9uKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb25maWd1cmUgZm9yIENvbXBsaWFuY2UgcmV0ZW50aW9uIGZvciBhIHNwZWNpZmllZCBkdXJhdGlvbi5cbiAgICpcbiAgICogV2hlbiBhbiBvYmplY3QgaXMgbG9ja2VkIGluIGNvbXBsaWFuY2UgbW9kZSwgaXRzIHJldGVudGlvbiBtb2RlIGNhbid0IGJlIGNoYW5nZWQsIGFuZFxuICAgKiBpdHMgcmV0ZW50aW9uIHBlcmlvZCBjYW4ndCBiZSBzaG9ydGVuZWQuIENvbXBsaWFuY2UgbW9kZSBoZWxwcyBlbnN1cmUgdGhhdCBhbiBvYmplY3RcbiAgICogdmVyc2lvbiBjYW4ndCBiZSBvdmVyd3JpdHRlbiBvciBkZWxldGVkIGZvciB0aGUgZHVyYXRpb24gb2YgdGhlIHJldGVudGlvbiBwZXJpb2QuXG4gICAqXG4gICAqIEBwYXJhbSBkdXJhdGlvbiB0aGUgbGVuZ3RoIG9mIHRpbWUgZm9yIHdoaWNoIG9iamVjdHMgc2hvdWxkIGJlIHJldGFpbmVkXG4gICAqIEByZXR1cm5zIHRoZSBPYmplY3RMb2NrUmV0ZW50aW9uIGNvbmZpZ3VyYXRpb25cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgY29tcGxpYW5jZShkdXJhdGlvbjogRHVyYXRpb24pOiBPYmplY3RMb2NrUmV0ZW50aW9uIHtcbiAgICByZXR1cm4gbmV3IE9iamVjdExvY2tSZXRlbnRpb24oT2JqZWN0TG9ja01vZGUuQ09NUExJQU5DRSwgZHVyYXRpb24pO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBkZWZhdWx0IHBlcmlvZCBmb3Igd2hpY2ggb2JqZWN0cyBzaG91bGQgYmUgcmV0YWluZWQuXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgZHVyYXRpb246IER1cmF0aW9uO1xuXG4gIC8qKlxuICAgKiBUaGUgcmV0ZW50aW9uIG1vZGUgdG8gdXNlIGZvciB0aGUgb2JqZWN0IGxvY2sgY29uZmlndXJhdGlvbi5cbiAgICpcbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQW1hem9uUzMvbGF0ZXN0L3VzZXJndWlkZS9vYmplY3QtbG9jay1vdmVydmlldy5odG1sI29iamVjdC1sb2NrLXJldGVudGlvbi1tb2Rlc1xuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IG1vZGU6IE9iamVjdExvY2tNb2RlO1xuXG4gIHByaXZhdGUgY29uc3RydWN0b3IobW9kZTogT2JqZWN0TG9ja01vZGUsIGR1cmF0aW9uOiBEdXJhdGlvbikge1xuICAgIC8vIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BbWF6b25TMy9sYXRlc3QvdXNlcmd1aWRlL29iamVjdC1sb2NrLW1hbmFnaW5nLmh0bWwjb2JqZWN0LWxvY2stbWFuYWdpbmctcmV0ZW50aW9uLWxpbWl0c1xuICAgIGlmIChkdXJhdGlvbi50b0RheXMoKSA+IDM2NSAqIDEwMCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdPYmplY3QgTG9jayByZXRlbnRpb24gZHVyYXRpb24gbXVzdCBiZSBsZXNzIHRoYW4gMTAwIHllYXJzJyk7XG4gICAgfVxuICAgIGlmIChkdXJhdGlvbi50b0RheXMoKSA8IDEpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignT2JqZWN0IExvY2sgcmV0ZW50aW9uIGR1cmF0aW9uIG11c3QgYmUgYXQgbGVhc3QgMSBkYXknKTtcbiAgICB9XG5cbiAgICB0aGlzLm1vZGUgPSBtb2RlO1xuICAgIHRoaXMuZHVyYXRpb24gPSBkdXJhdGlvbjtcbiAgfVxufVxuXG4vKipcbiAqIE9wdGlvbnMgZm9yIGNyZWF0aW5nIFZpcnR1YWwtSG9zdGVkIHN0eWxlIFVSTC5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBWaXJ0dWFsSG9zdGVkU3R5bGVVcmxPcHRpb25zIHtcbiAgLyoqXG4gICAqIFNwZWNpZmllcyB0aGUgVVJMIGluY2x1ZGVzIHRoZSByZWdpb24uXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gdHJ1ZVxuICAgKi9cbiAgcmVhZG9ubHkgcmVnaW9uYWw/OiBib29sZWFuO1xufVxuXG4vKipcbiAqIE9wdGlvbnMgZm9yIGNyZWF0aW5nIGEgVHJhbnNmZXIgQWNjZWxlcmF0aW9uIFVSTC5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBUcmFuc2ZlckFjY2VsZXJhdGlvblVybE9wdGlvbnMge1xuICAvKipcbiAgICogRHVhbC1zdGFjayBzdXBwb3J0IHRvIGNvbm5lY3QgdG8gdGhlIGJ1Y2tldCBvdmVyIElQdjYuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gZmFsc2VcbiAgICovXG4gIHJlYWRvbmx5IGR1YWxTdGFjaz86IGJvb2xlYW47XG59XG5cbmZ1bmN0aW9uIG1hcE9yVW5kZWZpbmVkPFQsIFU+KGxpc3Q6IFRbXSB8IHVuZGVmaW5lZCwgY2FsbGJhY2s6IChlbGVtZW50OiBUKSA9PiBVKTogVVtdIHwgdW5kZWZpbmVkIHtcbiAgaWYgKCFsaXN0IHx8IGxpc3QubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIHJldHVybiBsaXN0Lm1hcChjYWxsYmFjayk7XG59XG4iXX0=