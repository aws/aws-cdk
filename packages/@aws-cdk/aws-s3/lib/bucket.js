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
    grantWrite(identity, objectsKeyPattern = '*') {
        return this.grant(identity, this.writeActions, perms.KEY_WRITE_ACTIONS, this.bucketArn, this.arnForObjects(objectsKeyPattern));
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
exports.BucketBase = BucketBase;
_a = JSII_RTTI_SYMBOL_1;
BucketBase[_a] = { fqn: "@aws-cdk/aws-s3.BucketBase", version: "0.0.0" };
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
exports.BlockPublicAccess = BlockPublicAccess;
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
        const bucketName = util_1.parseBucketName(scope, attrs);
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
                this.bucketArn = util_1.parseBucketArn(scope, attrs);
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
                ...perms.BUCKET_DELETE_ACTIONS,
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
exports.Bucket = Bucket;
_c = JSII_RTTI_SYMBOL_1;
Bucket[_c] = { fqn: "@aws-cdk/aws-s3.Bucket", version: "0.0.0" };
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
    constructor(withKey, prefixWithKey) {
        this.withKey = withKey;
        this.prefixWithKey = prefixWithKey;
    }
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
}
exports.ReplaceKey = ReplaceKey;
_d = JSII_RTTI_SYMBOL_1;
ReplaceKey[_d] = { fqn: "@aws-cdk/aws-s3.ReplaceKey", version: "0.0.0" };
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
}
exports.ObjectLockRetention = ObjectLockRetention;
_e = JSII_RTTI_SYMBOL_1;
ObjectLockRetention[_e] = { fqn: "@aws-cdk/aws-s3.ObjectLockRetention", version: "0.0.0" };
function mapOrUndefined(list, callback) {
    if (!list || list.length === 0) {
        return undefined;
    }
    return list.map(callback);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVja2V0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYnVja2V0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLDJCQUF5QjtBQUN6Qiw2QkFBNkI7QUFDN0IsOENBQThDO0FBQzlDLHdDQUF3QztBQUN4Qyx3Q0FBd0M7QUFDeEMsd0NBaUJ1QjtBQUN2QiwyRUFBdUU7QUFDdkUseUNBQXlDO0FBQ3pDLDBEQUEwRDtBQUUxRCxtREFBK0M7QUFFL0MscUVBQStEO0FBQy9ELGlDQUFpQztBQUVqQyxpREFBMkM7QUFDM0MsaUNBQXlEO0FBRXpELE1BQU0saUNBQWlDLEdBQUcsNkJBQTZCLENBQUM7QUFDeEUsTUFBTSx1QkFBdUIsR0FBRyw2QkFBNkIsQ0FBQztBQThiOUQ7Ozs7Ozs7Ozs7Ozs7Ozs7R0FnQkc7QUFDSCxNQUFzQixVQUFXLFNBQVEsZUFBUTtJQTBDL0MsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxRQUF1QixFQUFFO1FBQ2pFLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXhCLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDLHlCQUF5QixFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQztLQUN0RztJQUVEOzs7Ozs7OztPQVFHO0lBQ0ksaUJBQWlCLENBQUMsRUFBVSxFQUFFLFVBQTBDLEVBQUU7Ozs7Ozs7Ozs7UUFDL0UsTUFBTSxJQUFJLEdBQUcsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxFQUFFLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDaEQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDL0IsSUFBSSxDQUFDLGVBQWUsQ0FBQztZQUNuQixNQUFNLEVBQUUsQ0FBQyxRQUFRLENBQUM7WUFDbEIsVUFBVSxFQUFFLENBQUMsNkJBQTZCLENBQUM7WUFDM0MsTUFBTSxFQUFFO2dCQUNOLFNBQVMsRUFBRTtvQkFDVCxHQUFHLEVBQUUsT0FBTyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDO2lCQUN4RTthQUNGO1NBQ0YsQ0FBQyxDQUFDO1FBQ0gsT0FBTyxJQUFJLENBQUM7S0FDYjtJQUVEOzs7Ozs7Ozs7Ozs7O09BYUc7SUFDSSxxQkFBcUIsQ0FBQyxFQUFVLEVBQUUsVUFBMEMsRUFBRTs7Ozs7Ozs7OztRQUNuRixNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsRUFBRSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ2pELElBQUksQ0FBQyxlQUFlLENBQUM7WUFDbkIsTUFBTSxFQUFFO2dCQUNOLFNBQVMsRUFBRSxDQUFDLFdBQVcsQ0FBQzthQUN6QjtTQUNGLENBQUMsQ0FBQztRQUNILE9BQU8sSUFBSSxDQUFDO0tBQ2I7SUFFRDs7Ozs7Ozs7Ozs7Ozs7T0FjRztJQUNJLHVCQUF1QixDQUFDLEVBQVUsRUFBRSxVQUEwQyxFQUFFOzs7Ozs7Ozs7O1FBQ3JGLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxFQUFFLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDakQsSUFBSSxDQUFDLGVBQWUsQ0FBQztZQUNuQixNQUFNLEVBQUU7Z0JBQ04sU0FBUyxFQUFFO29CQUNULHlCQUF5QjtvQkFDekIsWUFBWTtvQkFDWixXQUFXO2lCQUNaO2dCQUNELGlCQUFpQixFQUFFO29CQUNqQixVQUFVLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDO29CQUM3QixHQUFHLEVBQUUsT0FBTyxDQUFDLEtBQUs7aUJBQ25CO2FBQ0Y7U0FDRixDQUFDLENBQUM7UUFDSCxPQUFPLElBQUksQ0FBQztLQUNiO0lBRUQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7T0FtQkc7SUFDSSxtQkFBbUIsQ0FBQyxVQUErQjtRQUN4RCxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsZ0JBQWdCLEVBQUU7WUFDekMsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLDRCQUFZLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO1NBQ2xFO1FBRUQsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQ2YsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQy9DLE9BQU8sRUFBRSxjQUFjLEVBQUUsSUFBSSxFQUFFLGdCQUFnQixFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztTQUNoRTtRQUVELE9BQU8sRUFBRSxjQUFjLEVBQUUsS0FBSyxFQUFFLENBQUM7S0FDbEM7SUFFRDs7Ozs7Ozs7Ozs7T0FXRztJQUNJLFlBQVksQ0FBQyxHQUFZO1FBQzlCLE1BQU0sS0FBSyxHQUFHLFlBQUssQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDN0IsTUFBTSxNQUFNLEdBQUcsY0FBYyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sSUFBSSxLQUFLLENBQUMsU0FBUyxHQUFHLENBQUM7UUFDbkUsSUFBSSxPQUFPLEdBQUcsS0FBSyxRQUFRLEVBQUU7WUFDM0IsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7U0FDOUM7UUFDRCxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxVQUFVLEVBQUUsR0FBRyxDQUFDLENBQUM7S0FDbkQ7SUFFRDs7Ozs7Ozs7Ozs7T0FXRztJQUNJLGdDQUFnQyxDQUFDLEdBQVksRUFBRSxPQUF3Qzs7Ozs7Ozs7OztRQUM1RixNQUFNLFNBQVMsR0FBRyxPQUFPLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUN6RCxNQUFNLE1BQU0sR0FBRyxXQUFXLElBQUksQ0FBQyxVQUFVLGlCQUFpQixTQUFTLGlCQUFpQixDQUFDO1FBQ3JGLElBQUksT0FBTyxHQUFHLEtBQUssUUFBUSxFQUFFO1lBQzNCLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUM3QjtRQUNELE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUM7S0FDbEM7SUFFRDs7Ozs7Ozs7Ozs7OztPQWFHO0lBQ0kseUJBQXlCLENBQUMsR0FBWSxFQUFFLE9BQXNDOzs7Ozs7Ozs7O1FBQ25GLE1BQU0sVUFBVSxHQUFHLE9BQU8sRUFBRSxRQUFRLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsd0JBQXdCLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQztRQUNyRyxNQUFNLE1BQU0sR0FBRyxXQUFXLFVBQVUsRUFBRSxDQUFDO1FBQ3ZDLElBQUksT0FBTyxHQUFHLEtBQUssUUFBUSxFQUFFO1lBQzNCLE9BQU8sTUFBTSxDQUFDO1NBQ2Y7UUFDRCxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0tBQ2xDO0lBRUQ7Ozs7Ozs7OztPQVNHO0lBQ0ksY0FBYyxDQUFDLEdBQVk7UUFDaEMsTUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDO1FBQ3ZCLElBQUksT0FBTyxHQUFHLEtBQUssUUFBUSxFQUFFO1lBQzNCLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1NBQzlDO1FBQ0QsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsVUFBVSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0tBQ25EO0lBRUQ7Ozs7Ozs7O09BUUc7SUFDSSxhQUFhLENBQUMsVUFBa0I7UUFDckMsT0FBTyxHQUFHLElBQUksQ0FBQyxTQUFTLElBQUksVUFBVSxFQUFFLENBQUM7S0FDMUM7SUFFRDs7Ozs7Ozs7O09BU0c7SUFDSSxTQUFTLENBQUMsUUFBd0IsRUFBRSxvQkFBeUIsR0FBRztRQUNyRSxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxtQkFBbUIsRUFBRSxLQUFLLENBQUMsZ0JBQWdCLEVBQzNFLElBQUksQ0FBQyxTQUFTLEVBQ2QsSUFBSSxDQUFDLGFBQWEsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUM7S0FDMUM7SUFFTSxVQUFVLENBQUMsUUFBd0IsRUFBRSxvQkFBeUIsR0FBRztRQUN0RSxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxZQUFZLEVBQUUsS0FBSyxDQUFDLGlCQUFpQixFQUNwRSxJQUFJLENBQUMsU0FBUyxFQUNkLElBQUksQ0FBQyxhQUFhLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDO0tBQzFDO0lBRUQ7Ozs7Ozs7T0FPRztJQUNJLFFBQVEsQ0FBQyxRQUF3QixFQUFFLG9CQUF5QixHQUFHO1FBQ3BFLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFVBQVUsRUFBRSxLQUFLLENBQUMsaUJBQWlCLEVBQ2xFLElBQUksQ0FBQyxhQUFhLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDO0tBQzFDO0lBRU0sV0FBVyxDQUFDLFFBQXdCLEVBQUUsb0JBQTRCLEdBQUc7UUFDMUUsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsc0JBQXNCLEVBQUUsRUFBRSxFQUMxRCxJQUFJLENBQUMsYUFBYSxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQztLQUMxQztJQUVEOzs7Ozs7T0FNRztJQUNJLFdBQVcsQ0FBQyxRQUF3QixFQUFFLG9CQUF5QixHQUFHO1FBQ3ZFLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLHFCQUFxQixFQUFFLEVBQUUsRUFDekQsSUFBSSxDQUFDLGFBQWEsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUM7S0FDMUM7SUFFTSxjQUFjLENBQUMsUUFBd0IsRUFBRSxvQkFBeUIsR0FBRztRQUMxRSxNQUFNLGFBQWEsR0FBRyxLQUFLLENBQUMsbUJBQW1CLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUMxRSxvR0FBb0c7UUFDcEcsTUFBTSxVQUFVLEdBQUcsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsZ0JBQWdCLEVBQUUsR0FBRyxLQUFLLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFekYsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFDeEIsYUFBYSxFQUNiLFVBQVUsRUFDVixJQUFJLENBQUMsU0FBUyxFQUNkLElBQUksQ0FBQyxhQUFhLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDO0tBQzFDO0lBRUQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztPQXdCRztJQUNJLGlCQUFpQixDQUFDLFNBQVMsR0FBRyxHQUFHLEVBQUUsR0FBRyxjQUF3QjtRQUNuRSxJQUFJLElBQUksQ0FBQyxvQkFBb0IsRUFBRTtZQUM3QixNQUFNLElBQUksS0FBSyxDQUFDLGdFQUFnRSxDQUFDLENBQUM7U0FDbkY7UUFFRCxjQUFjLEdBQUcsY0FBYyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUUvRSxPQUFPLEdBQUcsQ0FBQyxLQUFLLENBQUMsd0JBQXdCLENBQUM7WUFDeEMsT0FBTyxFQUFFLGNBQWM7WUFDdkIsWUFBWSxFQUFFLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUM3QyxPQUFPLEVBQUUsSUFBSSxHQUFHLENBQUMsWUFBWSxFQUFFO1lBQy9CLFFBQVEsRUFBRSxJQUFJO1NBQ2YsQ0FBQyxDQUFDO0tBQ0o7SUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7T0FvQkc7SUFDSSxvQkFBb0IsQ0FBQyxLQUFnQixFQUFFLElBQW9DLEVBQUUsR0FBRyxPQUFnQzs7Ozs7Ozs7Ozs7O1FBQ3JILElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxhQUFhLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxlQUFlLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUM7S0FDakc7SUFFTyxpQkFBaUIsQ0FBQyxFQUFnRDtRQUN4RSxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRTtZQUN2QixJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksNENBQW1CLENBQUMsSUFBSSxFQUFFLGVBQWUsRUFBRTtnQkFDbEUsTUFBTSxFQUFFLElBQUk7Z0JBQ1osV0FBVyxFQUFFLElBQUksQ0FBQyx3QkFBd0I7YUFDM0MsQ0FBQyxDQUFDO1NBQ0o7UUFDRCxFQUFFLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0tBQ3hCO0lBRUQ7Ozs7Ozs7T0FPRztJQUNJLDRCQUE0QixDQUFDLElBQW9DLEVBQUUsR0FBRyxPQUFnQzs7Ozs7Ozs7Ozs7UUFDM0csT0FBTyxJQUFJLENBQUMsb0JBQW9CLENBQUMsU0FBUyxDQUFDLGNBQWMsRUFBRSxJQUFJLEVBQUUsR0FBRyxPQUFPLENBQUMsQ0FBQztLQUM5RTtJQUVEOzs7Ozs7O09BT0c7SUFDSSw0QkFBNEIsQ0FBQyxJQUFvQyxFQUFFLEdBQUcsT0FBZ0M7Ozs7Ozs7Ozs7O1FBQzNHLE9BQU8sSUFBSSxDQUFDLG9CQUFvQixDQUFDLFNBQVMsQ0FBQyxjQUFjLEVBQUUsSUFBSSxFQUFFLEdBQUcsT0FBTyxDQUFDLENBQUM7S0FDOUU7SUFFRDs7Ozs7Ozs7Ozs7OztPQWFHO0lBQ0ksNkJBQTZCO1FBQ2xDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxhQUFhLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQyw2QkFBNkIsRUFBRSxDQUFDLENBQUM7S0FDeEY7SUFFRCxJQUFZLFlBQVk7UUFDdEIsT0FBTztZQUNMLEdBQUcsS0FBSyxDQUFDLHFCQUFxQjtZQUM5QixHQUFHLElBQUksQ0FBQyxVQUFVO1NBQ25CLENBQUM7S0FDSDtJQUVELElBQVksVUFBVTtRQUNwQixPQUFPLG1CQUFZLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsMEJBQTBCLENBQUM7WUFDdEUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxrQkFBa0I7WUFDMUIsQ0FBQyxDQUFDLEtBQUssQ0FBQyx5QkFBeUIsQ0FBQztLQUNyQztJQUVPLE9BQU8sQ0FBQyxHQUFHLFVBQW9CO1FBQ3JDLE9BQU8sVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sRUFBRSxTQUFTLEVBQUUsRUFBRTtZQUM3QyxJQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEVBQUU7Z0JBQ3hCLE1BQU0sR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQzlCO1lBQ0QsSUFBSSxTQUFTLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxFQUFFO2dCQUM3QixTQUFTLEdBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUNoQztZQUNELE9BQU8sR0FBRyxNQUFNLElBQUksU0FBUyxFQUFFLENBQUM7UUFDbEMsQ0FBQyxDQUFDLENBQUM7S0FDSjtJQUVPLEtBQUssQ0FDWCxPQUF1QixFQUN2QixhQUF1QixFQUN2QixVQUFvQixFQUNwQixXQUFtQixFQUFFLEdBQUcsaUJBQTJCO1FBQ25ELE1BQU0sU0FBUyxHQUFHLENBQUMsV0FBVyxFQUFFLEdBQUcsaUJBQWlCLENBQUMsQ0FBQztRQUV0RCxNQUFNLEdBQUcsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLHdCQUF3QixDQUFDO1lBQzdDLE9BQU87WUFDUCxPQUFPLEVBQUUsYUFBYTtZQUN0QixZQUFZLEVBQUUsU0FBUztZQUN2QixRQUFRLEVBQUUsSUFBSTtTQUNmLENBQUMsQ0FBQztRQUVILElBQUksSUFBSSxDQUFDLGFBQWEsSUFBSSxVQUFVLElBQUksVUFBVSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7WUFDL0QsSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLEdBQUcsVUFBVSxDQUFDLENBQUM7U0FDbEQ7UUFFRCxPQUFPLEdBQUcsQ0FBQztLQUNaOztBQW5lSCxnQ0FvZUM7OztBQWdDRCxNQUFhLGlCQUFpQjtJQWtCNUIsWUFBWSxPQUFpQzs7Ozs7OytDQWxCbEMsaUJBQWlCOzs7O1FBbUIxQixJQUFJLENBQUMsZUFBZSxHQUFHLE9BQU8sQ0FBQyxlQUFlLENBQUM7UUFDL0MsSUFBSSxDQUFDLGlCQUFpQixHQUFHLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQztRQUNuRCxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsT0FBTyxDQUFDLGdCQUFnQixDQUFDO1FBQ2pELElBQUksQ0FBQyxxQkFBcUIsR0FBRyxPQUFPLENBQUMscUJBQXFCLENBQUM7S0FDNUQ7O0FBdkJILDhDQXdCQzs7O0FBdkJ3QiwyQkFBUyxHQUFHLElBQUksaUJBQWlCLENBQUM7SUFDdkQsZUFBZSxFQUFFLElBQUk7SUFDckIsaUJBQWlCLEVBQUUsSUFBSTtJQUN2QixnQkFBZ0IsRUFBRSxJQUFJO0lBQ3RCLHFCQUFxQixFQUFFLElBQUk7Q0FDNUIsQ0FBQyxDQUFDO0FBRW9CLDRCQUFVLEdBQUcsSUFBSSxpQkFBaUIsQ0FBQztJQUN4RCxlQUFlLEVBQUUsSUFBSTtJQUNyQixnQkFBZ0IsRUFBRSxJQUFJO0NBQ3ZCLENBQUMsQ0FBQztBQWtDTDs7R0FFRztBQUNILElBQVksV0FxQlg7QUFyQkQsV0FBWSxXQUFXO0lBQ3JCOztPQUVHO0lBQ0gsMEJBQVcsQ0FBQTtJQUNYOztPQUVHO0lBQ0gsMEJBQVcsQ0FBQTtJQUNYOztPQUVHO0lBQ0gsNEJBQWEsQ0FBQTtJQUNiOztPQUVHO0lBQ0gsNEJBQWEsQ0FBQTtJQUNiOztPQUVHO0lBQ0gsZ0NBQWlCLENBQUE7QUFDbkIsQ0FBQyxFQXJCVyxXQUFXLEdBQVgsbUJBQVcsS0FBWCxtQkFBVyxRQXFCdEI7QUF3Q0Q7O0dBRUc7QUFDSCxJQUFZLGdCQUdYO0FBSEQsV0FBWSxnQkFBZ0I7SUFDMUIsaUNBQWEsQ0FBQTtJQUNiLG1DQUFlLENBQUE7QUFDakIsQ0FBQyxFQUhXLGdCQUFnQixHQUFoQix3QkFBZ0IsS0FBaEIsd0JBQWdCLFFBRzNCO0FBbUJEOztHQUVHO0FBQ0gsSUFBWSxlQWFYO0FBYkQsV0FBWSxlQUFlO0lBQ3pCOztPQUVHO0lBQ0gsOEJBQVcsQ0FBQTtJQUNYOztPQUVHO0lBQ0gsc0NBQW1CLENBQUE7SUFDbkI7O09BRUc7SUFDSCw4QkFBVyxDQUFBO0FBQ2IsQ0FBQyxFQWJXLGVBQWUsR0FBZix1QkFBZSxLQUFmLHVCQUFlLFFBYTFCO0FBRUQ7O0dBRUc7QUFDSCxJQUFZLGtCQVNYO0FBVEQsV0FBWSxrQkFBa0I7SUFDNUI7O09BRUc7SUFDSCxxQ0FBZSxDQUFBO0lBQ2Y7O09BRUc7SUFDSCx1Q0FBaUIsQ0FBQTtBQUNuQixDQUFDLEVBVFcsa0JBQWtCLEdBQWxCLDBCQUFrQixLQUFsQiwwQkFBa0IsUUFTN0I7QUFFRDs7R0FFRztBQUNILElBQVksc0JBU1g7QUFURCxXQUFZLHNCQUFzQjtJQUNoQzs7T0FFRztJQUNILHFDQUFXLENBQUE7SUFDWDs7T0FFRztJQUNILDZDQUFtQixDQUFBO0FBQ3JCLENBQUMsRUFUVyxzQkFBc0IsR0FBdEIsOEJBQXNCLEtBQXRCLDhCQUFzQixRQVNqQztBQStFRDs7Ozs7S0FLSztBQUNMLElBQVksZUFnQlg7QUFoQkQsV0FBWSxlQUFlO0lBQ3pCOzs7OztPQUtHO0lBQ0gsZ0VBQTZDLENBQUE7SUFDN0M7O09BRUc7SUFDSCxrRUFBK0MsQ0FBQTtJQUMvQzs7T0FFRztJQUNILGlEQUE4QixDQUFBO0FBQ2hDLENBQUMsRUFoQlcsZUFBZSxHQUFmLHVCQUFlLEtBQWYsdUJBQWUsUUFnQjFCO0FBcVREOzs7Ozs7Ozs7Ozs7Ozs7O0dBZ0JHO0FBQ0gsTUFBYSxNQUFPLFNBQVEsVUFBVTtJQXFNcEMsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxRQUFxQixFQUFFO1FBQy9ELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFO1lBQ2YsWUFBWSxFQUFFLEtBQUssQ0FBQyxVQUFVO1NBQy9CLENBQUMsQ0FBQztRQWJLLHFCQUFnQixHQUFHLElBQUksQ0FBQztRQUdqQixtQkFBYyxHQUFvQixFQUFFLENBQUM7UUFFckMsWUFBTyxHQUFvQixFQUFFLENBQUM7UUFDOUIsU0FBSSxHQUFlLEVBQUUsQ0FBQztRQUN0QixnQkFBVyxHQUFnQixFQUFFLENBQUM7Ozs7OzsrQ0FsTXBDLE1BQU07Ozs7UUEwTWYsSUFBSSxDQUFDLHdCQUF3QixHQUFHLEtBQUssQ0FBQyx3QkFBd0IsQ0FBQztRQUUvRCxNQUFNLEVBQUUsZ0JBQWdCLEVBQUUsYUFBYSxFQUFFLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUV4RSxNQUFNLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBRTdDLE1BQU0sb0JBQW9CLEdBQUcsSUFBSSxDQUFDLDBCQUEwQixDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3BFLElBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxvQkFBb0IsS0FBSyxTQUFTLENBQUMsQ0FBQztRQUV0RCxNQUFNLHVCQUF1QixHQUFHLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUVsRSxNQUFNLFFBQVEsR0FBRyxJQUFJLHdCQUFTLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRTtZQUMvQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFlBQVk7WUFDN0IsZ0JBQWdCO1lBQ2hCLHVCQUF1QixFQUFFLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQyxTQUFTO1lBQzVFLHNCQUFzQixFQUFFLFdBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxPQUFPLEVBQUUsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLDJCQUEyQixFQUFFLEVBQUUsQ0FBQztZQUN2RixvQkFBb0I7WUFDcEIsOEJBQThCLEVBQUUsS0FBSyxDQUFDLGlCQUFpQjtZQUN2RCxxQkFBcUIsRUFBRSxXQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyx3QkFBd0IsRUFBRSxFQUFFLENBQUM7WUFDbkYsaUJBQWlCLEVBQUUsV0FBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsc0JBQXNCLEVBQUUsRUFBRSxDQUFDO1lBQzdFLGFBQWEsRUFBRSxXQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztZQUNqRSxvQkFBb0IsRUFBRSxJQUFJLENBQUMscUJBQXFCLENBQUMsS0FBSyxDQUFDO1lBQ3ZELHVCQUF1QixFQUFFLFdBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxPQUFPLEVBQUUsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLDJCQUEyQixFQUFFLEVBQUUsQ0FBQztZQUN4RixpQkFBaUIsRUFBRSxJQUFJLENBQUMsc0JBQXNCLENBQUMsS0FBSyxDQUFDO1lBQ3JELHVCQUF1QixFQUFFLEtBQUssQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsRUFBRSxrQkFBa0IsRUFBRSxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUztZQUNuRyxnQ0FBZ0MsRUFBRSxJQUFJLENBQUMsa0JBQWtCLENBQUMsS0FBSyxDQUFDO1lBQ2hFLGlCQUFpQixFQUFFLHVCQUF1QixDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxpQkFBaUI7WUFDM0UsdUJBQXVCLEVBQUUsdUJBQXVCO1NBQ2pELENBQUMsQ0FBQztRQUNILElBQUksQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDO1FBRTFCLFFBQVEsQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLENBQUM7UUFFakQsSUFBSSxDQUFDLGFBQWEsR0FBRyxhQUFhLENBQUM7UUFDbkMsSUFBSSxDQUFDLGtCQUFrQixHQUFHLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQztRQUVuRCxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDOUQsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsdUJBQXVCLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRTtZQUM5RCxNQUFNLEVBQUUsRUFBRTtZQUNWLE9BQU8sRUFBRSxFQUFFO1lBQ1gsT0FBTyxFQUFFLElBQUk7WUFDYixRQUFRLEVBQUUsSUFBSSxDQUFDLFlBQVk7U0FDNUIsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLGdCQUFnQixHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUM7UUFDaEQsSUFBSSxDQUFDLGdCQUFnQixHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUM7UUFDaEQsSUFBSSxDQUFDLHVCQUF1QixHQUFHLFNBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLFNBQUUsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7UUFDbEYsSUFBSSxDQUFDLHlCQUF5QixHQUFHLFFBQVEsQ0FBQyx1QkFBdUIsQ0FBQztRQUNsRSxJQUFJLENBQUMsd0JBQXdCLEdBQUcsUUFBUSxDQUFDLHNCQUFzQixDQUFDO1FBRWhFLElBQUksQ0FBQyxvQkFBb0IsR0FBRyxLQUFLLENBQUMsaUJBQWlCLElBQUksS0FBSyxDQUFDLGlCQUFpQixDQUFDLGlCQUFpQixDQUFDO1FBQ2pHLElBQUksQ0FBQyxhQUFhLEdBQUcsS0FBSyxDQUFDLGFBQWEsQ0FBQztRQUV6QyxrREFBa0Q7UUFDbEQsSUFBSSxLQUFLLENBQUMsVUFBVSxFQUFFO1lBQ3BCLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO1NBQzVCO1FBRUQsSUFBSSxLQUFLLENBQUMsc0JBQXNCLFlBQVksTUFBTSxFQUFFO1lBQ2xELEtBQUssQ0FBQyxzQkFBc0IsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLHNCQUFzQixDQUFDLENBQUM7WUFDcEYseUZBQXlGO1lBQ3pGLHVGQUF1RjtZQUN2RixnR0FBZ0c7WUFDaEcseUZBQXlGO1lBQ3pGLHFEQUFxRDtTQUNwRDthQUFNLElBQUksQ0FBQyxLQUFLLENBQUMsc0JBQXNCLElBQUksS0FBSyxDQUFDLHNCQUFzQixFQUFFO1lBQ3hFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLHNCQUFzQixDQUFDLENBQUM7U0FDM0Q7YUFBTSxJQUFJLEtBQUssQ0FBQyxzQkFBc0IsRUFBRTtZQUN2QyxtRkFBbUY7WUFDbkYsMEVBQTBFO1lBQzFFLGtCQUFXLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLFVBQVUsQ0FDN0IsMEVBQTBFLEtBQUssQ0FBQyxzQkFBc0IsRUFBRSxDQUN6RyxDQUFDO1NBQ0g7UUFFRCxLQUFLLE1BQU0sU0FBUyxJQUFJLEtBQUssQ0FBQyxXQUFXLElBQUksRUFBRSxFQUFFO1lBQy9DLElBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLENBQUM7U0FDOUI7UUFFRCw2Q0FBNkM7UUFDN0MsQ0FBQyxLQUFLLENBQUMsT0FBTyxJQUFJLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ3pELG1DQUFtQztRQUNuQyxDQUFDLEtBQUssQ0FBQyxJQUFJLElBQUksRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFFeEQsMEJBQTBCO1FBQzFCLENBQUMsS0FBSyxDQUFDLGNBQWMsSUFBSSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBRXZFLElBQUksS0FBSyxDQUFDLGdCQUFnQixFQUFFO1lBQzFCLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO1NBQzFCO1FBRUQsSUFBSSxLQUFLLENBQUMsaUJBQWlCLEVBQUU7WUFDM0IsSUFBSSxLQUFLLENBQUMsYUFBYSxLQUFLLG9CQUFhLENBQUMsT0FBTyxFQUFFO2dCQUNqRCxNQUFNLElBQUksS0FBSyxDQUFDLHNHQUFzRyxDQUFDLENBQUM7YUFDekg7WUFFRCxJQUFJLENBQUMsdUJBQXVCLEVBQUUsQ0FBQztTQUNoQztRQUVELElBQUksSUFBSSxDQUFDLGtCQUFrQixFQUFFO1lBQzNCLElBQUksQ0FBQyw2QkFBNkIsRUFBRSxDQUFDO1NBQ3RDO0tBQ0Y7SUEvU00sTUFBTSxDQUFDLGFBQWEsQ0FBQyxLQUFnQixFQUFFLEVBQVUsRUFBRSxTQUFpQjtRQUN6RSxPQUFPLE1BQU0sQ0FBQyxvQkFBb0IsQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsU0FBUyxFQUFFLENBQUMsQ0FBQztLQUM5RDtJQUVNLE1BQU0sQ0FBQyxjQUFjLENBQUMsS0FBZ0IsRUFBRSxFQUFVLEVBQUUsVUFBa0I7UUFDM0UsT0FBTyxNQUFNLENBQUMsb0JBQW9CLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUM7S0FDL0Q7SUFFRDs7Ozs7OztPQU9HO0lBQ0ksTUFBTSxDQUFDLG9CQUFvQixDQUFDLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQXVCOzs7Ozs7Ozs7O1FBQ3RGLE1BQU0sS0FBSyxHQUFHLFlBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDOUIsTUFBTSxNQUFNLEdBQUcsS0FBSyxDQUFDLE1BQU0sSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDO1FBQzVDLE1BQU0sVUFBVSxHQUFHLGlCQUFpQixDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDNUQsTUFBTSxTQUFTLEdBQUcsVUFBVSxDQUFDLFlBQVksSUFBSSxLQUFLLENBQUMsU0FBUyxDQUFDO1FBRTdELE1BQU0sVUFBVSxHQUFHLHNCQUFlLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ2pELElBQUksQ0FBQyxVQUFVLEVBQUU7WUFDZixNQUFNLElBQUksS0FBSyxDQUFDLHlCQUF5QixDQUFDLENBQUM7U0FDNUM7UUFDRCxNQUFNLENBQUMsa0JBQWtCLENBQUMsVUFBVSxDQUFDLENBQUM7UUFFdEMsTUFBTSxXQUFXLEdBQUcsY0FBYyxNQUFNLElBQUksU0FBUyxFQUFFLENBQUM7UUFDeEQsTUFBTSxXQUFXLEdBQUcsY0FBYyxNQUFNLElBQUksU0FBUyxFQUFFLENBQUM7UUFFeEQsSUFBSSxvQkFBb0IsR0FBRyxVQUFVLENBQUMsdUJBQXVCO2VBQ3hELFdBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxPQUFPLEVBQUUsR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxpQkFBaUIsQ0FBQyxRQUFRLENBQUMsMEJBQTBCLEVBQUUsV0FBVyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBRTVILDhDQUE4QztRQUM5QyxJQUFJLEtBQUssQ0FBQyx5QkFBeUIsS0FBSyxTQUFTLEVBQUU7WUFDakQsb0JBQW9CLEdBQUcsS0FBSyxDQUFDLHlCQUF5QixDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQztTQUNwRjtRQUVELE1BQU0sYUFBYSxHQUFHLEdBQUcsVUFBVSxJQUFJLG9CQUFvQixFQUFFLENBQUM7UUFFOUQsTUFBTSxNQUFPLFNBQVEsVUFBVTtZQUEvQjs7Z0JBQ2tCLGVBQVUsR0FBRyxVQUFXLENBQUM7Z0JBQ3pCLGNBQVMsR0FBRyxxQkFBYyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztnQkFDekMscUJBQWdCLEdBQUcsS0FBSyxDQUFDLGdCQUFnQixJQUFJLEdBQUcsVUFBVSxPQUFPLFNBQVMsRUFBRSxDQUFDO2dCQUM3RSxxQkFBZ0IsR0FBRyxLQUFLLENBQUMsZ0JBQWdCLElBQUksVUFBVSxhQUFhLEVBQUUsQ0FBQztnQkFDdkUsNEJBQXVCLEdBQUcsS0FBSyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxTQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxTQUFFLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUM7Z0JBQ3ZILDZCQUF3QixHQUFHLEtBQUssQ0FBQyx3QkFBd0IsSUFBSSxHQUFHLFVBQVUsT0FBTyxNQUFNLElBQUksU0FBUyxFQUFFLENBQUM7Z0JBQ3ZHLDhCQUF5QixHQUFHLEtBQUssQ0FBQyx5QkFBeUIsSUFBSSxHQUFHLFVBQVUsaUJBQWlCLE1BQU0sSUFBSSxTQUFTLEVBQUUsQ0FBQztnQkFDbkgsOEJBQXlCLEdBQUcsS0FBSyxDQUFDLHlCQUF5QixJQUFJLEtBQUssQ0FBQztnQkFDckUsa0JBQWEsR0FBRyxLQUFLLENBQUMsYUFBYSxDQUFDO2dCQUNwQyxjQUFTLEdBQUcsS0FBSyxDQUFDLFNBQVMsSUFBSSxLQUFLLENBQUM7Z0JBQzlDLFdBQU0sR0FBa0IsU0FBUyxDQUFDO2dCQUMvQixxQkFBZ0IsR0FBRyxLQUFLLENBQUM7Z0JBQ3pCLHlCQUFvQixHQUFHLEtBQUssQ0FBQztnQkFDN0IsNkJBQXdCLEdBQUcsS0FBSyxDQUFDLHdCQUF3QixDQUFDO1lBUXRFLENBQUM7WUFOQzs7ZUFFRztZQUNJLE1BQU07Z0JBQ1gsT0FBTyxLQUFLLENBQUM7WUFDZixDQUFDO1NBQ0Y7UUFFRCxPQUFPLElBQUksTUFBTSxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUU7WUFDM0IsT0FBTyxFQUFFLEtBQUssQ0FBQyxPQUFPO1lBQ3RCLE1BQU0sRUFBRSxLQUFLLENBQUMsTUFBTTtTQUNyQixDQUFDLENBQUM7S0FDSjtJQUVEOztPQUVHO0lBQ0ksTUFBTSxDQUFDLGFBQWEsQ0FBQyxTQUFvQjs7Ozs7Ozs7OztRQUM5Qyw0REFBNEQ7UUFDNUQsTUFBTSxFQUFFLEdBQUcsZ0JBQWdCLENBQUM7UUFFNUIsMkRBQTJEO1FBQzNELHFCQUFxQjtRQUNyQixvR0FBb0c7UUFDcEcsTUFBTSxRQUFRLEdBQUcsU0FBUyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDakQsSUFBSSxRQUFRLEVBQUU7WUFDWixPQUFnQixRQUFRLENBQUM7U0FDMUI7UUFFRCxrREFBa0Q7UUFDbEQsSUFBSSxhQUFtQyxDQUFDO1FBQ3hDLElBQUksU0FBUyxDQUFDLGdCQUFnQixFQUFFO1lBQzlCLE1BQU0saUNBQWlDLEdBQUksU0FBUyxDQUFDLGdCQUF3QixDQUFDLGlDQUFpQyxDQUFDO1lBQ2hILElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxpQ0FBaUMsQ0FBQyxJQUFJLGlDQUFpQyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7Z0JBQ3RHLE1BQU0sZ0NBQWdDLEdBQUcsaUNBQWlDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzlFLE1BQU0sNkJBQTZCLEdBQUcsZ0NBQWdDLENBQUMsNkJBQTZCLENBQUM7Z0JBQ3JHLElBQUksNkJBQTZCLElBQUksWUFBSyxDQUFDLFlBQVksQ0FBQyw2QkFBNkIsQ0FBQyxjQUFjLENBQUMsRUFBRTtvQkFDckcsTUFBTSxjQUFjLEdBQUcsbUJBQVksQ0FBQyxPQUFPLENBQUMsNkJBQTZCLENBQUMsY0FBYyxDQUFDLENBQUM7b0JBQzFGLElBQUksY0FBYyxZQUFZLDRCQUFZLEVBQUU7d0JBQzFDLE1BQU0sVUFBVSxHQUFHLGNBQWMsQ0FBQyxNQUFNLENBQUM7d0JBQ3pDLElBQUksVUFBVSxZQUFZLEdBQUcsQ0FBQyxNQUFNLEVBQUU7NEJBQ3BDLGFBQWEsR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsQ0FBQzt5QkFDaEQ7cUJBQ0Y7aUJBQ0Y7YUFDRjtTQUNGO1FBRUQsT0FBTyxJQUFJLEtBQU0sU0FBUSxVQUFVO1lBZ0JqQztnQkFDRSxLQUFLLENBQUMsU0FBUyxFQUFFLEVBQUUsQ0FBQyxDQUFDO2dCQWhCUCxjQUFTLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQztnQkFDOUIsZUFBVSxHQUFHLFNBQVMsQ0FBQyxHQUFHLENBQUM7Z0JBQzNCLHFCQUFnQixHQUFHLFNBQVMsQ0FBQyxjQUFjLENBQUM7Z0JBQzVDLDhCQUF5QixHQUFHLFNBQVMsQ0FBQyx1QkFBdUIsQ0FBQztnQkFDOUQsNkJBQXdCLEdBQUcsU0FBUyxDQUFDLHNCQUFzQixDQUFDO2dCQUM1RCxxQkFBZ0IsR0FBRyxTQUFTLENBQUMsY0FBYyxDQUFDO2dCQUM1Qyw0QkFBdUIsR0FBRyxTQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxTQUFFLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxTQUFTLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztnQkFFaEYsa0JBQWEsR0FBRyxhQUFhLENBQUM7Z0JBQzlCLGNBQVMsR0FBRyxTQUFTLENBQUMsb0JBQW9CLEtBQUssU0FBUyxDQUFDO2dCQUNsRSxXQUFNLEdBQUcsU0FBUyxDQUFDO2dCQUNoQixxQkFBZ0IsR0FBRyxJQUFJLENBQUM7Z0JBQ3hCLHlCQUFvQixHQUFHLFNBQVMsQ0FBQyw4QkFBOEI7b0JBQ3RFLFNBQVMsQ0FBQyw4QkFBc0MsQ0FBQyxpQkFBaUIsQ0FBQztnQkFLcEUsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLEdBQUcsU0FBUyxDQUFDO1lBQ3JDLENBQUM7U0FDRixFQUFFLENBQUM7S0FDTDtJQUVEOzs7O09BSUc7SUFDSSxNQUFNLENBQUMsa0JBQWtCLENBQUMsWUFBb0I7UUFDbkQsTUFBTSxVQUFVLEdBQUcsWUFBWSxDQUFDO1FBQ2hDLElBQUksQ0FBQyxVQUFVLElBQUksWUFBSyxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUMsRUFBRTtZQUNqRCx3REFBd0Q7WUFDeEQscUJBQXFCO1lBQ3JCLE9BQU87U0FDUjtRQUVELE1BQU0sTUFBTSxHQUFhLEVBQUUsQ0FBQztRQUU1Qiw4RkFBOEY7UUFDOUYsSUFBSSxVQUFVLENBQUMsTUFBTSxHQUFHLENBQUMsSUFBSSxVQUFVLENBQUMsTUFBTSxHQUFHLEVBQUUsRUFBRTtZQUNuRCxNQUFNLENBQUMsSUFBSSxDQUFDLCtEQUErRCxDQUFDLENBQUM7U0FDOUU7UUFDRCxNQUFNLFlBQVksR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQ3JELElBQUksWUFBWSxFQUFFO1lBQ2hCLE1BQU0sQ0FBQyxJQUFJLENBQUMsOEZBQThGO2tCQUN0RyxZQUFZLFlBQVksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDO1NBQ3hDO1FBQ0QsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQzFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsc0VBQXNFO2tCQUM5RSxhQUFhLENBQUMsQ0FBQztTQUNwQjtRQUNELElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQzlELE1BQU0sQ0FBQyxJQUFJLENBQUMsc0VBQXNFO2tCQUM5RSxZQUFZLFVBQVUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUMzQztRQUNELE1BQU0saUJBQWlCLEdBQUcsVUFBVSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUMzRCxJQUFJLGlCQUFpQixFQUFFO1lBQ3JCLE1BQU0sQ0FBQyxJQUFJLENBQUMsZ0dBQWdHO2tCQUN4RyxZQUFZLGlCQUFpQixDQUFDLEtBQUssR0FBRyxDQUFDLENBQUM7U0FDN0M7UUFDRCxJQUFJLHNDQUFzQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsRUFBRTtZQUMzRCxNQUFNLENBQUMsSUFBSSxDQUFDLDZDQUE2QyxDQUFDLENBQUM7U0FDNUQ7UUFFRCxJQUFJLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1lBQ3JCLE1BQU0sSUFBSSxLQUFLLENBQUMsa0NBQWtDLFVBQVUsSUFBSSxRQUFHLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7U0FDM0Y7S0FDRjtJQW9JRDs7OztPQUlHO0lBQ0ksZ0JBQWdCLENBQUMsSUFBbUI7Ozs7Ozs7Ozs7UUFDekMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDaEM7SUFFRDs7OztPQUlHO0lBQ0ksU0FBUyxDQUFDLE1BQXFCOzs7Ozs7Ozs7O1FBQ3BDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0tBQzNCO0lBRUQ7Ozs7T0FJRztJQUNJLFdBQVcsQ0FBQyxJQUFjOzs7Ozs7Ozs7O1FBQy9CLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQ3RCO0lBRUQ7Ozs7T0FJRztJQUNJLFlBQVksQ0FBQyxTQUFvQjs7Ozs7Ozs7OztRQUN0QyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztLQUNsQztJQUVEOztPQUVHO0lBQ0ssbUJBQW1CO1FBQ3pCLE1BQU0sU0FBUyxHQUFHLElBQUksR0FBRyxDQUFDLGVBQWUsQ0FBQztZQUN4QyxPQUFPLEVBQUUsQ0FBQyxNQUFNLENBQUM7WUFDakIsVUFBVSxFQUFFO2dCQUNWLElBQUksRUFBRSxFQUFFLHFCQUFxQixFQUFFLE9BQU8sRUFBRTthQUN6QztZQUNELE1BQU0sRUFBRSxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUk7WUFDdkIsU0FBUyxFQUFFO2dCQUNULElBQUksQ0FBQyxTQUFTO2dCQUNkLElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDO2FBQ3hCO1lBQ0QsVUFBVSxFQUFFLENBQUMsSUFBSSxHQUFHLENBQUMsWUFBWSxFQUFFLENBQUM7U0FDckMsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxDQUFDLG1CQUFtQixDQUFDLFNBQVMsQ0FBQyxDQUFDO0tBQ3JDO0lBRUQ7OztPQUdHO0lBQ0ssZUFBZSxDQUFDLEtBQWtCO1FBS3hDLHNEQUFzRDtRQUN0RCxJQUFJLGNBQWMsR0FBRyxLQUFLLENBQUMsVUFBVSxDQUFDO1FBQ3RDLElBQUksY0FBYyxLQUFLLFNBQVMsRUFBRTtZQUNoQyxjQUFjLEdBQUcsS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxXQUFXLENBQUM7U0FDNUY7UUFFRCwyREFBMkQ7UUFDM0QsSUFBSSxjQUFjLEtBQUssZ0JBQWdCLENBQUMsR0FBRyxJQUFJLEtBQUssQ0FBQyxhQUFhLEVBQUU7WUFDbEUsTUFBTSxJQUFJLEtBQUssQ0FBQywwRUFBMEUsY0FBYyxHQUFHLENBQUMsQ0FBQztTQUM5RztRQUVELDZEQUE2RDtRQUM3RCxJQUFJLEtBQUssQ0FBQyxnQkFBZ0IsSUFBSSxDQUFDLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxFQUFFLGdCQUFnQixDQUFDLFdBQVcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsRUFBRTtZQUM1RyxNQUFNLElBQUksS0FBSyxDQUFDLDZFQUE2RSxjQUFjLEdBQUcsQ0FBQyxDQUFDO1NBQ2pIO1FBRUQsSUFBSSxjQUFjLEtBQUssZ0JBQWdCLENBQUMsV0FBVyxFQUFFO1lBQ25ELE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxTQUFTLEVBQUUsYUFBYSxFQUFFLFNBQVMsRUFBRSxDQUFDO1NBQ2xFO1FBRUQsSUFBSSxjQUFjLEtBQUssZ0JBQWdCLENBQUMsR0FBRyxFQUFFO1lBQzNDLE1BQU0sYUFBYSxHQUFHLEtBQUssQ0FBQyxhQUFhLElBQUksSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUU7Z0JBQ3BFLFdBQVcsRUFBRSxjQUFjLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFO2FBQzVDLENBQUMsQ0FBQztZQUVILE1BQU0sZ0JBQWdCLEdBQUc7Z0JBQ3ZCLGlDQUFpQyxFQUFFO29CQUNqQzt3QkFDRSxnQkFBZ0IsRUFBRSxLQUFLLENBQUMsZ0JBQWdCO3dCQUN4Qyw2QkFBNkIsRUFBRTs0QkFDN0IsWUFBWSxFQUFFLFNBQVM7NEJBQ3ZCLGNBQWMsRUFBRSxhQUFhLENBQUMsTUFBTTt5QkFDckM7cUJBQ0Y7aUJBQ0Y7YUFDRixDQUFDO1lBQ0YsT0FBTyxFQUFFLGFBQWEsRUFBRSxnQkFBZ0IsRUFBRSxDQUFDO1NBQzVDO1FBRUQsSUFBSSxjQUFjLEtBQUssZ0JBQWdCLENBQUMsVUFBVSxFQUFFO1lBQ2xELE1BQU0sZ0JBQWdCLEdBQUc7Z0JBQ3ZCLGlDQUFpQyxFQUFFO29CQUNqQyxFQUFFLDZCQUE2QixFQUFFLEVBQUUsWUFBWSxFQUFFLFFBQVEsRUFBRSxFQUFFO2lCQUM5RDthQUNGLENBQUM7WUFFRixPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsQ0FBQztTQUM3QjtRQUVELElBQUksY0FBYyxLQUFLLGdCQUFnQixDQUFDLFdBQVcsRUFBRTtZQUNuRCxNQUFNLGdCQUFnQixHQUFHO2dCQUN2QixpQ0FBaUMsRUFBRTtvQkFDakM7d0JBQ0UsZ0JBQWdCLEVBQUUsS0FBSyxDQUFDLGdCQUFnQjt3QkFDeEMsNkJBQTZCLEVBQUUsRUFBRSxZQUFZLEVBQUUsU0FBUyxFQUFFO3FCQUMzRDtpQkFDRjthQUNGLENBQUM7WUFDRixPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsQ0FBQztTQUM3QjtRQUVELE1BQU0sSUFBSSxLQUFLLENBQUMsZ0NBQWdDLGNBQWMsRUFBRSxDQUFDLENBQUM7S0FDbkU7SUFFRDs7O09BR0c7SUFDSywyQkFBMkI7UUFDakMsSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLElBQUksSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1lBQzVELE9BQU8sU0FBUyxDQUFDO1NBQ2xCO1FBRUQsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBRWxCLE9BQU8sRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsa0JBQWtCLENBQUMsRUFBRSxDQUFDO1FBRTlELFNBQVMsa0JBQWtCLENBQUMsSUFBbUI7WUFDN0MsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUM7WUFFckMsTUFBTSxDQUFDLEdBQTJCO2dCQUNoQyxtQ0FBbUM7Z0JBQ25DLDhCQUE4QixFQUFFLElBQUksQ0FBQyxtQ0FBbUMsS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsbUJBQW1CLEVBQUUsSUFBSSxDQUFDLG1DQUFtQyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLFNBQVM7Z0JBQy9LLGNBQWMsRUFBRSxJQUFJLENBQUMsY0FBYztnQkFDbkMsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLFVBQVUsRUFBRSxNQUFNLEVBQUU7Z0JBQzNDLEVBQUUsRUFBRSxJQUFJLENBQUMsRUFBRTtnQkFDWCwyQkFBMkIsRUFBRSxJQUFJLENBQUMsMkJBQTJCLElBQUk7b0JBQy9ELGNBQWMsRUFBRSxJQUFJLENBQUMsMkJBQTJCLENBQUMsTUFBTSxFQUFFO29CQUN6RCx1QkFBdUIsRUFBRSxJQUFJLENBQUMsMEJBQTBCO2lCQUN6RDtnQkFDRCw0QkFBNEIsRUFBRSxjQUFjLENBQUMsSUFBSSxDQUFDLDRCQUE0QixFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztvQkFDcEYsWUFBWSxFQUFFLENBQUMsQ0FBQyxZQUFZLENBQUMsS0FBSztvQkFDbEMsZ0JBQWdCLEVBQUUsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxNQUFNLEVBQUU7b0JBQzVDLHVCQUF1QixFQUFFLENBQUMsQ0FBQywwQkFBMEI7aUJBQ3RELENBQUMsQ0FBQztnQkFDSCxNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU07Z0JBQ25CLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsVUFBVTtnQkFDeEMsV0FBVyxFQUFFLGNBQWMsQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztvQkFDbEQsWUFBWSxFQUFFLENBQUMsQ0FBQyxZQUFZLENBQUMsS0FBSztvQkFDbEMsY0FBYyxFQUFFLENBQUMsQ0FBQyxjQUFjO29CQUNoQyxnQkFBZ0IsRUFBRSxDQUFDLENBQUMsZUFBZSxJQUFJLENBQUMsQ0FBQyxlQUFlLENBQUMsTUFBTSxFQUFFO2lCQUNsRSxDQUFDLENBQUM7Z0JBQ0gseUJBQXlCLEVBQUUsSUFBSSxDQUFDLHlCQUF5QjtnQkFDekQsVUFBVSxFQUFFLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQztnQkFDakQsa0JBQWtCLEVBQUUsSUFBSSxDQUFDLGtCQUFrQjtnQkFDM0MscUJBQXFCLEVBQUUsSUFBSSxDQUFDLHFCQUFxQjthQUNsRCxDQUFDO1lBRUYsT0FBTyxDQUFDLENBQUM7UUFDWCxDQUFDO0tBQ0Y7SUFFTyxxQkFBcUIsQ0FBQyxLQUFrQjtRQUM5QyxJQUFJLENBQUMsS0FBSyxDQUFDLHNCQUFzQixJQUFJLENBQUMsS0FBSyxDQUFDLHNCQUFzQixFQUFFO1lBQ2xFLE9BQU8sU0FBUyxDQUFDO1NBQ2xCO1FBRUQ7UUFDRSwrRkFBK0Y7UUFDL0YseUhBQXlIO1FBQ3pILENBQUMsQ0FBQyxLQUFLLENBQUMsc0JBQXNCLElBQUksQ0FDaEMsS0FBSyxDQUFDLGFBQWE7WUFDbkIsS0FBSyxDQUFDLFVBQVUsS0FBSyxnQkFBZ0IsQ0FBQyxXQUFXO1lBQ2pELEtBQUssQ0FBQyxVQUFVLEtBQUssZ0JBQWdCLENBQUMsR0FBRyxDQUFFLENBQUM7WUFDOUMsc0VBQXNFO1lBQ3RFLEtBQUssQ0FBQyxzQkFBc0IsRUFBRSxhQUFhLEVBQzNDO1lBQ0EsTUFBTSxJQUFJLEtBQUssQ0FBQyxpR0FBaUcsQ0FBQyxDQUFDO1NBQ3BIO1FBRUQsT0FBTztZQUNMLHFCQUFxQixFQUFFLEtBQUssQ0FBQyxzQkFBc0IsRUFBRSxVQUFVO1lBQy9ELGFBQWEsRUFBRSxLQUFLLENBQUMsc0JBQXNCO1NBQzVDLENBQUM7S0FDSDtJQUVPLHdCQUF3QjtRQUM5QixJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7WUFDOUMsT0FBTyxTQUFTLENBQUM7U0FDbEI7UUFFRCxNQUFNLElBQUksR0FBRyxJQUFJLENBQUM7UUFFbEIsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUVyQyxTQUFTLFdBQVcsQ0FBQyxNQUFxQjtZQUN4QyxPQUFPO2dCQUNMLEVBQUUsRUFBRSxNQUFNLENBQUMsRUFBRTtnQkFDYixNQUFNLEVBQUUsTUFBTSxDQUFDLE1BQU07Z0JBQ3JCLFVBQVUsRUFBRSxJQUFJLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUM7YUFDcEQsQ0FBQztRQUNKLENBQUM7S0FDRjtJQUVPLHNCQUFzQjtRQUM1QixJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7WUFDeEMsT0FBTyxTQUFTLENBQUM7U0FDbEI7UUFFRCxPQUFPLEVBQUUsU0FBUyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUM7UUFFL0MsU0FBUyxTQUFTLENBQUMsSUFBYztZQUMvQixPQUFPO2dCQUNMLEVBQUUsRUFBRSxJQUFJLENBQUMsRUFBRTtnQkFDWCxNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU07Z0JBQ25CLGNBQWMsRUFBRSxJQUFJLENBQUMsY0FBYztnQkFDbkMsY0FBYyxFQUFFLElBQUksQ0FBQyxjQUFjO2dCQUNuQyxjQUFjLEVBQUUsSUFBSSxDQUFDLGNBQWM7Z0JBQ25DLGNBQWMsRUFBRSxJQUFJLENBQUMsY0FBYzthQUNwQyxDQUFDO1FBQ0osQ0FBQztLQUNGO0lBRU8sZUFBZSxDQUFDLFVBQW1DO1FBQ3pELElBQUksQ0FBQyxVQUFVLElBQUksVUFBVSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7WUFDMUMsT0FBTyxTQUFTLENBQUM7U0FDbEI7UUFFRCxPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUN6QyxHQUFHLEVBQUUsR0FBRztZQUNSLEtBQUssRUFBRSxVQUFVLENBQUMsR0FBRyxDQUFDO1NBQ3ZCLENBQUMsQ0FBQyxDQUFDO0tBQ0w7SUFFTyxzQkFBc0IsQ0FBQyxFQUFFLGVBQWUsRUFBZTtRQUM3RCxJQUFJLENBQUMsZUFBZSxFQUFFO1lBQ3BCLE9BQU8sU0FBUyxDQUFDO1NBQ2xCO1FBQ0QsT0FBTztZQUNMLEtBQUssRUFBRSxDQUFDO29CQUNOLGVBQWU7aUJBQ2hCLENBQUM7U0FDSCxDQUFDO0tBQ0g7SUFFTyxrQkFBa0IsQ0FBQyxFQUFFLGdDQUFnQyxFQUFlO1FBQzFFLElBQUksQ0FBQyxnQ0FBZ0MsRUFBRTtZQUNyQyxPQUFPLFNBQVMsQ0FBQztTQUNsQjtRQUVELE9BQU8sZ0NBQWdDLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFO1lBQ25ELE1BQU0sUUFBUSxHQUFHLEVBQUUsQ0FBQztZQUNwQixJQUFJLE1BQU0sQ0FBQyxxQkFBcUIsRUFBRTtnQkFDaEMsUUFBUSxDQUFDLElBQUksQ0FBQztvQkFDWixVQUFVLEVBQUUsZ0JBQWdCO29CQUM1QixJQUFJLEVBQUUsTUFBTSxDQUFDLHFCQUFxQixDQUFDLE1BQU0sQ0FBQyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsQ0FBQztpQkFDOUQsQ0FBQyxDQUFDO2FBQ0o7WUFDRCxJQUFJLE1BQU0sQ0FBQyx5QkFBeUIsRUFBRTtnQkFDcEMsUUFBUSxDQUFDLElBQUksQ0FBQztvQkFDWixVQUFVLEVBQUUscUJBQXFCO29CQUNqQyxJQUFJLEVBQUUsTUFBTSxDQUFDLHlCQUF5QixDQUFDLE1BQU0sQ0FBQyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsQ0FBQztpQkFDbEUsQ0FBQyxDQUFDO2FBQ0o7WUFDRCxPQUFPO2dCQUNMLEVBQUUsRUFBRSxNQUFNLENBQUMsSUFBSTtnQkFDZixNQUFNLEVBQUUsTUFBTSxDQUFDLE1BQU07Z0JBQ3JCLE1BQU0sRUFBRSxTQUFTO2dCQUNqQixVQUFVLEVBQUUsTUFBTSxDQUFDLElBQUk7Z0JBQ3ZCLFFBQVEsRUFBRSxRQUFRO2FBQ25CLENBQUM7UUFDSixDQUFDLENBQUMsQ0FBQztLQUNKO0lBRU8scUJBQXFCLENBQUMsS0FBa0I7UUFDOUMsTUFBTSxFQUFFLGlCQUFpQixFQUFFLDBCQUEwQixFQUFFLEdBQUcsS0FBSyxDQUFDO1FBRWhFLElBQUksQ0FBQywwQkFBMEIsRUFBRTtZQUMvQixPQUFPLFNBQVMsQ0FBQztTQUNsQjtRQUNELElBQUksaUJBQWlCLEtBQUssS0FBSyxJQUFJLDBCQUEwQixFQUFFO1lBQzdELE1BQU0sSUFBSSxLQUFLLENBQUMscUVBQXFFLENBQUMsQ0FBQztTQUN4RjtRQUVELE9BQU87WUFDTCxpQkFBaUIsRUFBRSxTQUFTO1lBQzVCLElBQUksRUFBRTtnQkFDSixnQkFBZ0IsRUFBRTtvQkFDaEIsSUFBSSxFQUFFLDBCQUEwQixDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUU7b0JBQ2xELElBQUksRUFBRSwwQkFBMEIsQ0FBQyxJQUFJO2lCQUN0QzthQUNGO1NBQ0YsQ0FBQztLQUNIO0lBRU8sMEJBQTBCLENBQUMsS0FBa0I7UUFDbkQsSUFBSSxDQUFDLEtBQUssQ0FBQyxvQkFBb0IsSUFBSSxDQUFDLEtBQUssQ0FBQyxvQkFBb0IsSUFBSSxDQUFDLEtBQUssQ0FBQyxlQUFlLElBQUksQ0FBQyxLQUFLLENBQUMsbUJBQW1CLEVBQUU7WUFDdEgsT0FBTyxTQUFTLENBQUM7U0FDbEI7UUFFRCxJQUFJLEtBQUssQ0FBQyxvQkFBb0IsSUFBSSxDQUFDLEtBQUssQ0FBQyxvQkFBb0IsRUFBRTtZQUM3RCxNQUFNLElBQUksS0FBSyxDQUFDLHFFQUFxRSxDQUFDLENBQUM7U0FDeEY7UUFFRCxJQUFJLEtBQUssQ0FBQyxlQUFlLElBQUksQ0FBQyxLQUFLLENBQUMsb0JBQW9CLElBQUksS0FBSyxDQUFDLG9CQUFvQixJQUFJLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxFQUFFO1lBQ3BILE1BQU0sSUFBSSxLQUFLLENBQUMsc0hBQXNILENBQUMsQ0FBQztTQUN6STtRQUVELE1BQU0sWUFBWSxHQUFHLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLG1CQUFtQixDQUFDLEdBQUcsQ0FBZ0MsQ0FBQyxJQUFJLEVBQUUsRUFBRTtZQUNySCxJQUFJLElBQUksQ0FBQyxTQUFTLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLDJCQUEyQixJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxlQUFlLEVBQUU7Z0JBQ3BHLE1BQU0sSUFBSSxLQUFLLENBQUMsa0RBQWtELENBQUMsQ0FBQzthQUNyRTtZQUVELE9BQU87Z0JBQ0wsWUFBWSxFQUFFO29CQUNaLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUTtvQkFDdkIsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLGdCQUFnQjtvQkFDdkMsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRO29CQUN2QixjQUFjLEVBQUUsSUFBSSxDQUFDLFVBQVUsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU87b0JBQzFELG9CQUFvQixFQUFFLElBQUksQ0FBQyxVQUFVLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhO2lCQUN2RTtnQkFDRCxvQkFBb0IsRUFBRSxJQUFJLENBQUMsU0FBUzthQUNyQyxDQUFDO1FBQ0osQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztRQUVmLE9BQU87WUFDTCxhQUFhLEVBQUUsS0FBSyxDQUFDLG9CQUFvQjtZQUN6QyxhQUFhLEVBQUUsS0FBSyxDQUFDLG9CQUFvQjtZQUN6QyxxQkFBcUIsRUFBRSxLQUFLLENBQUMsZUFBZTtZQUM1QyxZQUFZO1NBQ2IsQ0FBQztLQUNIO0lBRUQ7Ozs7Ozs7O09BUUc7SUFDSyxnQkFBZ0IsQ0FBQyxJQUFhLEVBQUUsTUFBZTtRQUNyRCxJQUFJLG1CQUFZLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsdUNBQXVDLENBQUMsRUFBRTtZQUNsRixJQUFJLFVBQVUsR0FBRyxTQUFTLENBQUM7WUFDM0IsbUZBQW1GO1lBQ25GLCtFQUErRTtZQUMvRSwwRUFBMEU7WUFDMUUsSUFBSSxJQUFJLFlBQVksTUFBTSxJQUFJLFlBQUssQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssWUFBSyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRTtnQkFDL0QsVUFBVSxHQUFHO29CQUNYLE9BQU8sRUFBRTt3QkFDUCxlQUFlLEVBQUUsSUFBSSxDQUFDLFNBQVM7cUJBQ2hDO29CQUNELFlBQVksRUFBRTt3QkFDWixtQkFBbUIsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU87cUJBQ3RDO2lCQUNGLENBQUM7YUFDSDtZQUNELElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxlQUFlLENBQUM7Z0JBQy9DLE1BQU0sRUFBRSxHQUFHLENBQUMsTUFBTSxDQUFDLEtBQUs7Z0JBQ3hCLFVBQVUsRUFBRSxDQUFDLElBQUksR0FBRyxDQUFDLGdCQUFnQixDQUFDLDBCQUEwQixDQUFDLENBQUM7Z0JBQ2xFLE9BQU8sRUFBRSxDQUFDLGNBQWMsQ0FBQztnQkFDekIsU0FBUyxFQUFFLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUM1RCxVQUFVLEVBQUUsVUFBVTthQUN2QixDQUFDLENBQUMsQ0FBQztTQUNMO2FBQU0sSUFBSSxJQUFJLENBQUMsYUFBYSxJQUFJLElBQUksQ0FBQyxhQUFhLEtBQUssbUJBQW1CLENBQUMsa0JBQWtCLEVBQUU7WUFDOUYsTUFBTSxJQUFJLEtBQUssQ0FBQyxzR0FBc0csQ0FBQyxDQUFDO1NBQ3pIO2FBQU07WUFDTCxJQUFJLENBQUMsYUFBYSxHQUFHLG1CQUFtQixDQUFDLGtCQUFrQixDQUFDO1NBQzdEO0tBQ0Y7SUFFTywyQkFBMkI7UUFDakMsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1lBQ3RELE9BQU8sU0FBUyxDQUFDO1NBQ2xCO1FBRUQsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFNBQVMsRUFBRSxLQUFLLEVBQUUsRUFBRTtZQUMvQyxNQUFNLE1BQU0sR0FBRyxTQUFTLENBQUMsTUFBTSxJQUFJLGVBQWUsQ0FBQyxHQUFHLENBQUM7WUFDdkQsTUFBTSxTQUFTLEdBQUcsU0FBUyxDQUFDLFNBQVMsSUFBSSxrQkFBa0IsQ0FBQyxNQUFNLENBQUM7WUFDbkUsTUFBTSxFQUFFLEdBQUcsU0FBUyxDQUFDLFdBQVcsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxZQUFZLEtBQUssRUFBRSxDQUFDO1lBRXZFLElBQUksU0FBUyxDQUFDLFdBQVcsQ0FBQyxNQUFNLFlBQVksTUFBTSxFQUFFO2dCQUNsRCxTQUFTLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxlQUFlLENBQUM7b0JBQ3ZFLE1BQU0sRUFBRSxHQUFHLENBQUMsTUFBTSxDQUFDLEtBQUs7b0JBQ3hCLE9BQU8sRUFBRSxDQUFDLGNBQWMsQ0FBQztvQkFDekIsU0FBUyxFQUFFO3dCQUNULFNBQVMsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLFNBQVM7d0JBQ3RDLFNBQVMsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxXQUFXLENBQUMsTUFBTSxJQUFJLEVBQUUsR0FBRyxDQUFDO3FCQUNyRjtvQkFDRCxVQUFVLEVBQUUsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO29CQUMxRCxVQUFVLEVBQUU7d0JBQ1YsT0FBTyxFQUFFOzRCQUNQLGVBQWUsRUFBRSxJQUFJLENBQUMsU0FBUzt5QkFDaEM7cUJBQ0Y7aUJBQ0YsQ0FBQyxDQUFDLENBQUM7YUFDTDtZQUVELE9BQU87Z0JBQ0wsRUFBRTtnQkFDRixXQUFXLEVBQUU7b0JBQ1gsU0FBUyxFQUFFLFNBQVMsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLFNBQVM7b0JBQ2pELGVBQWUsRUFBRSxTQUFTLENBQUMsV0FBVyxDQUFDLFdBQVc7b0JBQ2xELE1BQU0sRUFBRSxTQUFTLENBQUMsV0FBVyxDQUFDLE1BQU07b0JBQ3BDLE1BQU07aUJBQ1A7Z0JBQ0QsT0FBTyxFQUFFLFNBQVMsQ0FBQyxPQUFPLElBQUksSUFBSTtnQkFDbEMsc0JBQXNCLEVBQUUsU0FBUyxDQUFDLHFCQUFxQixJQUFJLHNCQUFzQixDQUFDLEdBQUc7Z0JBQ3JGLGlCQUFpQixFQUFFLFNBQVM7Z0JBQzVCLGNBQWMsRUFBRSxTQUFTLENBQUMsY0FBYztnQkFDeEMsTUFBTSxFQUFFLFNBQVMsQ0FBQyxhQUFhO2FBQ2hDLENBQUM7UUFDSixDQUFDLENBQUMsQ0FBQztLQUNKO0lBRU8sdUJBQXVCO1FBQzdCLE1BQU0sUUFBUSxHQUFHLDZCQUFzQixDQUFDLG1CQUFtQixDQUFDLElBQUksRUFBRSxpQ0FBaUMsRUFBRTtZQUNuRyxhQUFhLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsNkJBQTZCLENBQUM7WUFDbEUsT0FBTyxFQUFFLG9DQUE2QixDQUFDLFdBQVc7WUFDbEQsV0FBVyxFQUFFLGdEQUFnRCxJQUFJLENBQUMsVUFBVSxhQUFhO1NBQzFGLENBQUMsQ0FBQztRQUVILDZEQUE2RDtRQUM3RCx3QkFBd0I7UUFDeEIsSUFBSSxDQUFDLG1CQUFtQixDQUFDLElBQUksR0FBRyxDQUFDLGVBQWUsQ0FBQztZQUMvQyxPQUFPLEVBQUU7Z0JBQ1AsZUFBZTtnQkFDZixHQUFHLEtBQUssQ0FBQyw0QkFBNEI7Z0JBQ3JDLEdBQUcsS0FBSyxDQUFDLHFCQUFxQjthQUMvQjtZQUNELFNBQVMsRUFBRTtnQkFDVCxJQUFJLENBQUMsU0FBUztnQkFDZCxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQzthQUN4QjtZQUNELFVBQVUsRUFBRSxDQUFDLElBQUksR0FBRyxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDckQsQ0FBQyxDQUFDLENBQUM7UUFFSixNQUFNLGNBQWMsR0FBRyxJQUFJLHFCQUFjLENBQUMsSUFBSSxFQUFFLGlDQUFpQyxFQUFFO1lBQ2pGLFlBQVksRUFBRSxpQ0FBaUM7WUFDL0MsWUFBWSxFQUFFLFFBQVEsQ0FBQyxZQUFZO1lBQ25DLFVBQVUsRUFBRTtnQkFDVixVQUFVLEVBQUUsSUFBSSxDQUFDLFVBQVU7YUFDNUI7U0FDRixDQUFDLENBQUM7UUFFSCxzRUFBc0U7UUFDdEUsOERBQThEO1FBQzlELGdDQUFnQztRQUNoQyxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7WUFDZixjQUFjLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDaEQ7UUFFRCx5RUFBeUU7UUFDekUsNEVBQTRFO1FBQzVFLDZFQUE2RTtRQUM3RSwrRUFBK0U7UUFDL0UsK0JBQStCO1FBQy9CLFdBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyx1QkFBdUIsRUFBRSxNQUFNLENBQUMsQ0FBQztLQUM5RDs7QUEzd0JILHdCQTR3QkM7OztBQUVEOztHQUVHO0FBQ0gsSUFBWSxnQkFxQlg7QUFyQkQsV0FBWSxnQkFBZ0I7SUFDMUI7O09BRUc7SUFDSCwrQ0FBMkIsQ0FBQTtJQUUzQjs7T0FFRztJQUNILCtDQUEyQixDQUFBO0lBRTNCOztPQUVHO0lBQ0gsNkNBQXlCLENBQUE7SUFFekI7OztPQUdHO0lBQ0gsK0JBQVcsQ0FBQTtBQUNiLENBQUMsRUFyQlcsZ0JBQWdCLEdBQWhCLHdCQUFnQixLQUFoQix3QkFBZ0IsUUFxQjNCO0FBRUQ7OztHQUdHO0FBQ0gsSUFBWSxTQTZOWDtBQTdORCxXQUFZLFNBQVM7SUFDbkI7Ozs7OztPQU1HO0lBQ0gsa0RBQXFDLENBQUE7SUFFckM7Ozs7OztPQU1HO0lBQ0gsd0RBQTJDLENBQUE7SUFFM0M7Ozs7OztPQU1HO0lBQ0gsMERBQTZDLENBQUE7SUFFN0M7Ozs7OztPQU1HO0lBQ0gsMERBQTZDLENBQUE7SUFFN0M7Ozs7OztPQU1HO0lBQ0gsa0dBQXFGLENBQUE7SUFFckY7Ozs7Ozs7Ozs7Ozs7O09BY0c7SUFDSCxrREFBcUMsQ0FBQTtJQUVyQzs7Ozs7Ozs7Ozs7Ozs7T0FjRztJQUNILDhEQUFpRCxDQUFBO0lBRWpEOzs7Ozs7Ozs7Ozs7OztPQWNHO0lBQ0gsMEZBQTZFLENBQUE7SUFFN0U7Ozs7Ozs7T0FPRztJQUNILDBEQUE2QyxDQUFBO0lBRTdDOzs7Ozs7O09BT0c7SUFDSCxvRUFBdUQsQ0FBQTtJQUV2RDs7Ozs7OztPQU9HO0lBQ0gsOERBQWlELENBQUE7SUFFakQ7Ozs7T0FJRztJQUNILDhFQUFpRSxDQUFBO0lBRWpFOzs7T0FHRztJQUNILG1HQUFzRixDQUFBO0lBRXRGOzs7O09BSUc7SUFDSCwrRkFBa0YsQ0FBQTtJQUVsRjs7OztPQUlHO0lBQ0gsa0hBQXFHLENBQUE7SUFFckc7Ozs7T0FJRztJQUNILHFGQUF3RSxDQUFBO0lBRXhFOzs7T0FHRztJQUNILDhEQUFpRCxDQUFBO0lBRWpEOzs7OztPQUtHO0lBQ0gsMEVBQTZELENBQUE7SUFFN0Q7Ozs7T0FJRztJQUNILHNHQUF5RixDQUFBO0lBRXpGOzs7T0FHRztJQUNILDREQUErQyxDQUFBO0lBRS9DOzs7O09BSUc7SUFDSCwwREFBNkMsQ0FBQTtJQUU3Qzs7O09BR0c7SUFDSCxrREFBcUMsQ0FBQTtJQUVyQzs7OztPQUlHO0lBQ0gsd0RBQTJDLENBQUE7SUFFM0M7OztPQUdHO0lBQ0gsOERBQWlELENBQUE7SUFFakQ7Ozs7O09BS0c7SUFDSCxnREFBbUMsQ0FBQTtBQUNyQyxDQUFDLEVBN05XLFNBQVMsR0FBVCxpQkFBUyxLQUFULGlCQUFTLFFBNk5wQjtBQTBCRDs7OztHQUlHO0FBQ0gsSUFBWSxtQkE0Q1g7QUE1Q0QsV0FBWSxtQkFBbUI7SUFDN0I7O09BRUc7SUFDSCwwQ0FBbUIsQ0FBQTtJQUVuQjs7T0FFRztJQUNILGlEQUEwQixDQUFBO0lBRTFCOzs7T0FHRztJQUNILDREQUFxQyxDQUFBO0lBRXJDOztPQUVHO0lBQ0gsK0RBQXdDLENBQUE7SUFFeEM7OztPQUdHO0lBQ0gsOERBQXVDLENBQUE7SUFFdkM7OztPQUdHO0lBQ0gsNERBQXFDLENBQUE7SUFFckM7OztPQUdHO0lBQ0gsMkVBQW9ELENBQUE7SUFFcEQ7O09BRUc7SUFDSCxvREFBNkIsQ0FBQTtBQUMvQixDQUFDLEVBNUNXLG1CQUFtQixHQUFuQiwyQkFBbUIsS0FBbkIsMkJBQW1CLFFBNEM5QjtBQXdCRCxNQUFhLFVBQVU7SUFlckIsWUFBb0MsT0FBZ0IsRUFBa0IsYUFBc0I7UUFBeEQsWUFBTyxHQUFQLE9BQU8sQ0FBUztRQUFrQixrQkFBYSxHQUFiLGFBQWEsQ0FBUztLQUMzRjtJQWZEOztPQUVHO0lBQ0ksTUFBTSxDQUFDLElBQUksQ0FBQyxjQUFzQjtRQUN2QyxPQUFPLElBQUksSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO0tBQ2pDO0lBRUQ7O09BRUc7SUFDSSxNQUFNLENBQUMsVUFBVSxDQUFDLGNBQXNCO1FBQzdDLE9BQU8sSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFLGNBQWMsQ0FBQyxDQUFDO0tBQzVDOztBQWJILGdDQWlCQzs7O0FBNENEOzs7O0dBSUc7QUFDSCxJQUFZLGNBbUJYO0FBbkJELFdBQVksY0FBYztJQUN4Qjs7Ozs7OztPQU9HO0lBQ0gsMkNBQXlCLENBQUE7SUFFekI7Ozs7OztPQU1HO0lBQ0gsMkNBQXlCLENBQUE7QUFDM0IsQ0FBQyxFQW5CVyxjQUFjLEdBQWQsc0JBQWMsS0FBZCxzQkFBYyxRQW1CekI7QUFFRDs7OztHQUlHO0FBQ0gsTUFBYSxtQkFBbUI7SUEwQzlCLFlBQW9CLElBQW9CLEVBQUUsUUFBa0I7UUFDMUQsd0hBQXdIO1FBQ3hILElBQUksUUFBUSxDQUFDLE1BQU0sRUFBRSxHQUFHLEdBQUcsR0FBRyxHQUFHLEVBQUU7WUFDakMsTUFBTSxJQUFJLEtBQUssQ0FBQyw0REFBNEQsQ0FBQyxDQUFDO1NBQy9FO1FBQ0QsSUFBSSxRQUFRLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxFQUFFO1lBQ3pCLE1BQU0sSUFBSSxLQUFLLENBQUMsdURBQXVELENBQUMsQ0FBQztTQUMxRTtRQUVELElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2pCLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO0tBQzFCO0lBcEREOzs7Ozs7Ozs7O09BVUc7SUFDSSxNQUFNLENBQUMsVUFBVSxDQUFDLFFBQWtCO1FBQ3pDLE9BQU8sSUFBSSxtQkFBbUIsQ0FBQyxjQUFjLENBQUMsVUFBVSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0tBQ3JFO0lBRUQ7Ozs7Ozs7OztPQVNHO0lBQ0ksTUFBTSxDQUFDLFVBQVUsQ0FBQyxRQUFrQjtRQUN6QyxPQUFPLElBQUksbUJBQW1CLENBQUMsY0FBYyxDQUFDLFVBQVUsRUFBRSxRQUFRLENBQUMsQ0FBQztLQUNyRTs7QUE1Qkgsa0RBc0RDOzs7QUEwQkQsU0FBUyxjQUFjLENBQU8sSUFBcUIsRUFBRSxRQUEyQjtJQUM5RSxJQUFJLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1FBQzlCLE9BQU8sU0FBUyxDQUFDO0tBQ2xCO0lBRUQsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQzVCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBFT0wgfSBmcm9tICdvcyc7XG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0ICogYXMgZXZlbnRzIGZyb20gJ0Bhd3MtY2RrL2F3cy1ldmVudHMnO1xuaW1wb3J0ICogYXMgaWFtIGZyb20gJ0Bhd3MtY2RrL2F3cy1pYW0nO1xuaW1wb3J0ICogYXMga21zIGZyb20gJ0Bhd3MtY2RrL2F3cy1rbXMnO1xuaW1wb3J0IHtcbiAgQ3VzdG9tUmVzb3VyY2UsXG4gIEN1c3RvbVJlc291cmNlUHJvdmlkZXIsXG4gIEN1c3RvbVJlc291cmNlUHJvdmlkZXJSdW50aW1lLFxuICBEdXJhdGlvbixcbiAgRmVhdHVyZUZsYWdzLFxuICBGbixcbiAgSVJlc291cmNlLFxuICBMYXp5LFxuICBSZW1vdmFsUG9saWN5LFxuICBSZXNvdXJjZSxcbiAgUmVzb3VyY2VQcm9wcyxcbiAgU3RhY2ssXG4gIFRhZ3MsXG4gIFRva2VuLFxuICBUb2tlbml6YXRpb24sXG4gIEFubm90YXRpb25zLFxufSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IENmblJlZmVyZW5jZSB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUvbGliL3ByaXZhdGUvY2ZuLXJlZmVyZW5jZSc7XG5pbXBvcnQgKiBhcyBjeGFwaSBmcm9tICdAYXdzLWNkay9jeC1hcGknO1xuaW1wb3J0ICogYXMgcmVnaW9uSW5mb3JtYXRpb24gZnJvbSAnQGF3cy1jZGsvcmVnaW9uLWluZm8nO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBCdWNrZXRQb2xpY3kgfSBmcm9tICcuL2J1Y2tldC1wb2xpY3knO1xuaW1wb3J0IHsgSUJ1Y2tldE5vdGlmaWNhdGlvbkRlc3RpbmF0aW9uIH0gZnJvbSAnLi9kZXN0aW5hdGlvbic7XG5pbXBvcnQgeyBCdWNrZXROb3RpZmljYXRpb25zIH0gZnJvbSAnLi9ub3RpZmljYXRpb25zLXJlc291cmNlJztcbmltcG9ydCAqIGFzIHBlcm1zIGZyb20gJy4vcGVybXMnO1xuaW1wb3J0IHsgTGlmZWN5Y2xlUnVsZSB9IGZyb20gJy4vcnVsZSc7XG5pbXBvcnQgeyBDZm5CdWNrZXQgfSBmcm9tICcuL3MzLmdlbmVyYXRlZCc7XG5pbXBvcnQgeyBwYXJzZUJ1Y2tldEFybiwgcGFyc2VCdWNrZXROYW1lIH0gZnJvbSAnLi91dGlsJztcblxuY29uc3QgQVVUT19ERUxFVEVfT0JKRUNUU19SRVNPVVJDRV9UWVBFID0gJ0N1c3RvbTo6UzNBdXRvRGVsZXRlT2JqZWN0cyc7XG5jb25zdCBBVVRPX0RFTEVURV9PQkpFQ1RTX1RBRyA9ICdhd3MtY2RrOmF1dG8tZGVsZXRlLW9iamVjdHMnO1xuXG5leHBvcnQgaW50ZXJmYWNlIElCdWNrZXQgZXh0ZW5kcyBJUmVzb3VyY2Uge1xuICAvKipcbiAgICogVGhlIEFSTiBvZiB0aGUgYnVja2V0LlxuICAgKiBAYXR0cmlidXRlXG4gICAqL1xuICByZWFkb25seSBidWNrZXRBcm46IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIG5hbWUgb2YgdGhlIGJ1Y2tldC5cbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcmVhZG9ubHkgYnVja2V0TmFtZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgVVJMIG9mIHRoZSBzdGF0aWMgd2Vic2l0ZS5cbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcmVhZG9ubHkgYnVja2V0V2Vic2l0ZVVybDogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgRG9tYWluIG5hbWUgb2YgdGhlIHN0YXRpYyB3ZWJzaXRlLlxuICAgKiBAYXR0cmlidXRlXG4gICAqL1xuICByZWFkb25seSBidWNrZXRXZWJzaXRlRG9tYWluTmFtZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgSVB2NCBETlMgbmFtZSBvZiB0aGUgc3BlY2lmaWVkIGJ1Y2tldC5cbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcmVhZG9ubHkgYnVja2V0RG9tYWluTmFtZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgSVB2NiBETlMgbmFtZSBvZiB0aGUgc3BlY2lmaWVkIGJ1Y2tldC5cbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcmVhZG9ubHkgYnVja2V0RHVhbFN0YWNrRG9tYWluTmFtZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgcmVnaW9uYWwgZG9tYWluIG5hbWUgb2YgdGhlIHNwZWNpZmllZCBidWNrZXQuXG4gICAqIEBhdHRyaWJ1dGVcbiAgICovXG4gIHJlYWRvbmx5IGJ1Y2tldFJlZ2lvbmFsRG9tYWluTmFtZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBJZiB0aGlzIGJ1Y2tldCBoYXMgYmVlbiBjb25maWd1cmVkIGZvciBzdGF0aWMgd2Vic2l0ZSBob3N0aW5nLlxuICAgKi9cbiAgcmVhZG9ubHkgaXNXZWJzaXRlPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogT3B0aW9uYWwgS01TIGVuY3J5cHRpb24ga2V5IGFzc29jaWF0ZWQgd2l0aCB0aGlzIGJ1Y2tldC5cbiAgICovXG4gIHJlYWRvbmx5IGVuY3J5cHRpb25LZXk/OiBrbXMuSUtleTtcblxuICAvKipcbiAgICogVGhlIHJlc291cmNlIHBvbGljeSBhc3NvY2lhdGVkIHdpdGggdGhpcyBidWNrZXQuXG4gICAqXG4gICAqIElmIGBhdXRvQ3JlYXRlUG9saWN5YCBpcyB0cnVlLCBhIGBCdWNrZXRQb2xpY3lgIHdpbGwgYmUgY3JlYXRlZCB1cG9uIHRoZVxuICAgKiBmaXJzdCBjYWxsIHRvIGFkZFRvUmVzb3VyY2VQb2xpY3kocykuXG4gICAqL1xuICBwb2xpY3k/OiBCdWNrZXRQb2xpY3k7XG5cbiAgLyoqXG4gICAqIEFkZHMgYSBzdGF0ZW1lbnQgdG8gdGhlIHJlc291cmNlIHBvbGljeSBmb3IgYSBwcmluY2lwYWwgKGkuZS5cbiAgICogYWNjb3VudC9yb2xlL3NlcnZpY2UpIHRvIHBlcmZvcm0gYWN0aW9ucyBvbiB0aGlzIGJ1Y2tldCBhbmQvb3IgaXRzXG4gICAqIGNvbnRlbnRzLiBVc2UgYGJ1Y2tldEFybmAgYW5kIGBhcm5Gb3JPYmplY3RzKGtleXMpYCB0byBvYnRhaW4gQVJOcyBmb3JcbiAgICogdGhpcyBidWNrZXQgb3Igb2JqZWN0cy5cbiAgICpcbiAgICogTm90ZSB0aGF0IHRoZSBwb2xpY3kgc3RhdGVtZW50IG1heSBvciBtYXkgbm90IGJlIGFkZGVkIHRvIHRoZSBwb2xpY3kuXG4gICAqIEZvciBleGFtcGxlLCB3aGVuIGFuIGBJQnVja2V0YCBpcyBjcmVhdGVkIGZyb20gYW4gZXhpc3RpbmcgYnVja2V0LFxuICAgKiBpdCdzIG5vdCBwb3NzaWJsZSB0byB0ZWxsIHdoZXRoZXIgdGhlIGJ1Y2tldCBhbHJlYWR5IGhhcyBhIHBvbGljeVxuICAgKiBhdHRhY2hlZCwgbGV0IGFsb25lIHRvIHJlLXVzZSB0aGF0IHBvbGljeSB0byBhZGQgbW9yZSBzdGF0ZW1lbnRzIHRvIGl0LlxuICAgKiBTbyBpdCdzIHNhZmVzdCB0byBkbyBub3RoaW5nIGluIHRoZXNlIGNhc2VzLlxuICAgKlxuICAgKiBAcGFyYW0gcGVybWlzc2lvbiB0aGUgcG9saWN5IHN0YXRlbWVudCB0byBiZSBhZGRlZCB0byB0aGUgYnVja2V0J3NcbiAgICogcG9saWN5LlxuICAgKiBAcmV0dXJucyBtZXRhZGF0YSBhYm91dCB0aGUgZXhlY3V0aW9uIG9mIHRoaXMgbWV0aG9kLiBJZiB0aGUgcG9saWN5XG4gICAqIHdhcyBub3QgYWRkZWQsIHRoZSB2YWx1ZSBvZiBgc3RhdGVtZW50QWRkZWRgIHdpbGwgYmUgYGZhbHNlYC4gWW91XG4gICAqIHNob3VsZCBhbHdheXMgY2hlY2sgdGhpcyB2YWx1ZSB0byBtYWtlIHN1cmUgdGhhdCB0aGUgb3BlcmF0aW9uIHdhc1xuICAgKiBhY3R1YWxseSBjYXJyaWVkIG91dC4gT3RoZXJ3aXNlLCBzeW50aGVzaXMgYW5kIGRlcGxveSB3aWxsIHRlcm1pbmF0ZVxuICAgKiBzaWxlbnRseSwgd2hpY2ggbWF5IGJlIGNvbmZ1c2luZy5cbiAgICovXG4gIGFkZFRvUmVzb3VyY2VQb2xpY3kocGVybWlzc2lvbjogaWFtLlBvbGljeVN0YXRlbWVudCk6IGlhbS5BZGRUb1Jlc291cmNlUG9saWN5UmVzdWx0O1xuXG4gIC8qKlxuICAgKiBUaGUgaHR0cHMgVVJMIG9mIGFuIFMzIG9iamVjdC4gRm9yIGV4YW1wbGU6XG4gICAqXG4gICAqIC0gYGh0dHBzOi8vczMudXMtd2VzdC0xLmFtYXpvbmF3cy5jb20vb25seWJ1Y2tldGBcbiAgICogLSBgaHR0cHM6Ly9zMy51cy13ZXN0LTEuYW1hem9uYXdzLmNvbS9idWNrZXQva2V5YFxuICAgKiAtIGBodHRwczovL3MzLmNuLW5vcnRoLTEuYW1hem9uYXdzLmNvbS5jbi9jaGluYS1idWNrZXQvbXlrZXlgXG4gICAqIEBwYXJhbSBrZXkgVGhlIFMzIGtleSBvZiB0aGUgb2JqZWN0LiBJZiBub3Qgc3BlY2lmaWVkLCB0aGUgVVJMIG9mIHRoZVxuICAgKiAgICAgIGJ1Y2tldCBpcyByZXR1cm5lZC5cbiAgICogQHJldHVybnMgYW4gT2JqZWN0UzNVcmwgdG9rZW5cbiAgICovXG4gIHVybEZvck9iamVjdChrZXk/OiBzdHJpbmcpOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBodHRwcyBUcmFuc2ZlciBBY2NlbGVyYXRpb24gVVJMIG9mIGFuIFMzIG9iamVjdC4gU3BlY2lmeSBgZHVhbFN0YWNrOiB0cnVlYCBhdCB0aGUgb3B0aW9uc1xuICAgKiBmb3IgZHVhbC1zdGFjayBlbmRwb2ludCAoY29ubmVjdCB0byB0aGUgYnVja2V0IG92ZXIgSVB2NikuIEZvciBleGFtcGxlOlxuICAgKlxuICAgKiAtIGBodHRwczovL2J1Y2tldC5zMy1hY2NlbGVyYXRlLmFtYXpvbmF3cy5jb21gXG4gICAqIC0gYGh0dHBzOi8vYnVja2V0LnMzLWFjY2VsZXJhdGUuYW1hem9uYXdzLmNvbS9rZXlgXG4gICAqXG4gICAqIEBwYXJhbSBrZXkgVGhlIFMzIGtleSBvZiB0aGUgb2JqZWN0LiBJZiBub3Qgc3BlY2lmaWVkLCB0aGUgVVJMIG9mIHRoZVxuICAgKiAgICAgIGJ1Y2tldCBpcyByZXR1cm5lZC5cbiAgICogQHBhcmFtIG9wdGlvbnMgT3B0aW9ucyBmb3IgZ2VuZXJhdGluZyBVUkwuXG4gICAqIEByZXR1cm5zIGFuIFRyYW5zZmVyQWNjZWxlcmF0aW9uVXJsIHRva2VuXG4gICAqL1xuICB0cmFuc2ZlckFjY2VsZXJhdGlvblVybEZvck9iamVjdChrZXk/OiBzdHJpbmcsIG9wdGlvbnM/OiBUcmFuc2ZlckFjY2VsZXJhdGlvblVybE9wdGlvbnMpOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSB2aXJ0dWFsIGhvc3RlZC1zdHlsZSBVUkwgb2YgYW4gUzMgb2JqZWN0LiBTcGVjaWZ5IGByZWdpb25hbDogZmFsc2VgIGF0XG4gICAqIHRoZSBvcHRpb25zIGZvciBub24tcmVnaW9uYWwgVVJMLiBGb3IgZXhhbXBsZTpcbiAgICpcbiAgICogLSBgaHR0cHM6Ly9vbmx5LWJ1Y2tldC5zMy51cy13ZXN0LTEuYW1hem9uYXdzLmNvbWBcbiAgICogLSBgaHR0cHM6Ly9idWNrZXQuczMudXMtd2VzdC0xLmFtYXpvbmF3cy5jb20va2V5YFxuICAgKiAtIGBodHRwczovL2J1Y2tldC5zMy5hbWF6b25hd3MuY29tL2tleWBcbiAgICogLSBgaHR0cHM6Ly9jaGluYS1idWNrZXQuczMuY24tbm9ydGgtMS5hbWF6b25hd3MuY29tLmNuL215a2V5YFxuICAgKiBAcGFyYW0ga2V5IFRoZSBTMyBrZXkgb2YgdGhlIG9iamVjdC4gSWYgbm90IHNwZWNpZmllZCwgdGhlIFVSTCBvZiB0aGVcbiAgICogICAgICBidWNrZXQgaXMgcmV0dXJuZWQuXG4gICAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbnMgZm9yIGdlbmVyYXRpbmcgVVJMLlxuICAgKiBAcmV0dXJucyBhbiBPYmplY3RTM1VybCB0b2tlblxuICAgKi9cbiAgdmlydHVhbEhvc3RlZFVybEZvck9iamVjdChrZXk/OiBzdHJpbmcsIG9wdGlvbnM/OiBWaXJ0dWFsSG9zdGVkU3R5bGVVcmxPcHRpb25zKTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgUzMgVVJMIG9mIGFuIFMzIG9iamVjdC4gRm9yIGV4YW1wbGU6XG4gICAqIC0gYHMzOi8vb25seWJ1Y2tldGBcbiAgICogLSBgczM6Ly9idWNrZXQva2V5YFxuICAgKiBAcGFyYW0ga2V5IFRoZSBTMyBrZXkgb2YgdGhlIG9iamVjdC4gSWYgbm90IHNwZWNpZmllZCwgdGhlIFMzIFVSTCBvZiB0aGVcbiAgICogICAgICBidWNrZXQgaXMgcmV0dXJuZWQuXG4gICAqIEByZXR1cm5zIGFuIE9iamVjdFMzVXJsIHRva2VuXG4gICAqL1xuICBzM1VybEZvck9iamVjdChrZXk/OiBzdHJpbmcpOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYW4gQVJOIHRoYXQgcmVwcmVzZW50cyBhbGwgb2JqZWN0cyB3aXRoaW4gdGhlIGJ1Y2tldCB0aGF0IG1hdGNoXG4gICAqIHRoZSBrZXkgcGF0dGVybiBzcGVjaWZpZWQuIFRvIHJlcHJlc2VudCBhbGwga2V5cywgc3BlY2lmeSBgYFwiKlwiYGAuXG4gICAqL1xuICBhcm5Gb3JPYmplY3RzKGtleVBhdHRlcm46IHN0cmluZyk6IHN0cmluZztcblxuICAvKipcbiAgICogR3JhbnQgcmVhZCBwZXJtaXNzaW9ucyBmb3IgdGhpcyBidWNrZXQgYW5kIGl0J3MgY29udGVudHMgdG8gYW4gSUFNXG4gICAqIHByaW5jaXBhbCAoUm9sZS9Hcm91cC9Vc2VyKS5cbiAgICpcbiAgICogSWYgZW5jcnlwdGlvbiBpcyB1c2VkLCBwZXJtaXNzaW9uIHRvIHVzZSB0aGUga2V5IHRvIGRlY3J5cHQgdGhlIGNvbnRlbnRzXG4gICAqIG9mIHRoZSBidWNrZXQgd2lsbCBhbHNvIGJlIGdyYW50ZWQgdG8gdGhlIHNhbWUgcHJpbmNpcGFsLlxuICAgKlxuICAgKiBAcGFyYW0gaWRlbnRpdHkgVGhlIHByaW5jaXBhbFxuICAgKiBAcGFyYW0gb2JqZWN0c0tleVBhdHRlcm4gUmVzdHJpY3QgdGhlIHBlcm1pc3Npb24gdG8gYSBjZXJ0YWluIGtleSBwYXR0ZXJuIChkZWZhdWx0ICcqJylcbiAgICovXG4gIGdyYW50UmVhZChpZGVudGl0eTogaWFtLklHcmFudGFibGUsIG9iamVjdHNLZXlQYXR0ZXJuPzogYW55KTogaWFtLkdyYW50O1xuXG4gIC8qKlxuICAgKiBHcmFudCB3cml0ZSBwZXJtaXNzaW9ucyB0byB0aGlzIGJ1Y2tldCB0byBhbiBJQU0gcHJpbmNpcGFsLlxuICAgKlxuICAgKiBJZiBlbmNyeXB0aW9uIGlzIHVzZWQsIHBlcm1pc3Npb24gdG8gdXNlIHRoZSBrZXkgdG8gZW5jcnlwdCB0aGUgY29udGVudHNcbiAgICogb2Ygd3JpdHRlbiBmaWxlcyB3aWxsIGFsc28gYmUgZ3JhbnRlZCB0byB0aGUgc2FtZSBwcmluY2lwYWwuXG4gICAqXG4gICAqIEJlZm9yZSBDREsgdmVyc2lvbiAxLjg1LjAsIHRoaXMgbWV0aG9kIGdyYW50ZWQgdGhlIGBzMzpQdXRPYmplY3QqYCBwZXJtaXNzaW9uIHRoYXQgaW5jbHVkZWQgYHMzOlB1dE9iamVjdEFjbGAsXG4gICAqIHdoaWNoIGNvdWxkIGJlIHVzZWQgdG8gZ3JhbnQgcmVhZC93cml0ZSBvYmplY3QgYWNjZXNzIHRvIElBTSBwcmluY2lwYWxzIGluIG90aGVyIGFjY291bnRzLlxuICAgKiBJZiB5b3Ugd2FudCB0byBnZXQgcmlkIG9mIHRoYXQgYmVoYXZpb3IsIHVwZGF0ZSB5b3VyIENESyB2ZXJzaW9uIHRvIDEuODUuMCBvciBsYXRlcixcbiAgICogYW5kIG1ha2Ugc3VyZSB0aGUgYEBhd3MtY2RrL2F3cy1zMzpncmFudFdyaXRlV2l0aG91dEFjbGAgZmVhdHVyZSBmbGFnIGlzIHNldCB0byBgdHJ1ZWBcbiAgICogaW4gdGhlIGBjb250ZXh0YCBrZXkgb2YgeW91ciBjZGsuanNvbiBmaWxlLlxuICAgKiBJZiB5b3UndmUgYWxyZWFkeSB1cGRhdGVkLCBidXQgc3RpbGwgbmVlZCB0aGUgcHJpbmNpcGFsIHRvIGhhdmUgcGVybWlzc2lvbnMgdG8gbW9kaWZ5IHRoZSBBQ0xzLFxuICAgKiB1c2UgdGhlIGBncmFudFB1dEFjbGAgbWV0aG9kLlxuICAgKlxuICAgKiBAcGFyYW0gaWRlbnRpdHkgVGhlIHByaW5jaXBhbFxuICAgKiBAcGFyYW0gb2JqZWN0c0tleVBhdHRlcm4gUmVzdHJpY3QgdGhlIHBlcm1pc3Npb24gdG8gYSBjZXJ0YWluIGtleSBwYXR0ZXJuIChkZWZhdWx0ICcqJylcbiAgICovXG4gIGdyYW50V3JpdGUoaWRlbnRpdHk6IGlhbS5JR3JhbnRhYmxlLCBvYmplY3RzS2V5UGF0dGVybj86IGFueSk6IGlhbS5HcmFudDtcblxuICAvKipcbiAgICogR3JhbnRzIHMzOlB1dE9iamVjdCogYW5kIHMzOkFib3J0KiBwZXJtaXNzaW9ucyBmb3IgdGhpcyBidWNrZXQgdG8gYW4gSUFNIHByaW5jaXBhbC5cbiAgICpcbiAgICogSWYgZW5jcnlwdGlvbiBpcyB1c2VkLCBwZXJtaXNzaW9uIHRvIHVzZSB0aGUga2V5IHRvIGVuY3J5cHQgdGhlIGNvbnRlbnRzXG4gICAqIG9mIHdyaXR0ZW4gZmlsZXMgd2lsbCBhbHNvIGJlIGdyYW50ZWQgdG8gdGhlIHNhbWUgcHJpbmNpcGFsLlxuICAgKiBAcGFyYW0gaWRlbnRpdHkgVGhlIHByaW5jaXBhbFxuICAgKiBAcGFyYW0gb2JqZWN0c0tleVBhdHRlcm4gUmVzdHJpY3QgdGhlIHBlcm1pc3Npb24gdG8gYSBjZXJ0YWluIGtleSBwYXR0ZXJuIChkZWZhdWx0ICcqJylcbiAgICovXG4gIGdyYW50UHV0KGlkZW50aXR5OiBpYW0uSUdyYW50YWJsZSwgb2JqZWN0c0tleVBhdHRlcm4/OiBhbnkpOiBpYW0uR3JhbnQ7XG5cbiAgLyoqXG4gICAqIEdyYW50IHRoZSBnaXZlbiBJQU0gaWRlbnRpdHkgcGVybWlzc2lvbnMgdG8gbW9kaWZ5IHRoZSBBQ0xzIG9mIG9iamVjdHMgaW4gdGhlIGdpdmVuIEJ1Y2tldC5cbiAgICpcbiAgICogSWYgeW91ciBhcHBsaWNhdGlvbiBoYXMgdGhlICdAYXdzLWNkay9hd3MtczM6Z3JhbnRXcml0ZVdpdGhvdXRBY2wnIGZlYXR1cmUgZmxhZyBzZXQsXG4gICAqIGNhbGxpbmcgYGdyYW50V3JpdGVgIG9yIGBncmFudFJlYWRXcml0ZWAgbm8gbG9uZ2VyIGdyYW50cyBwZXJtaXNzaW9ucyB0byBtb2RpZnkgdGhlIEFDTHMgb2YgdGhlIG9iamVjdHM7XG4gICAqIGluIHRoaXMgY2FzZSwgaWYgeW91IG5lZWQgdG8gbW9kaWZ5IG9iamVjdCBBQ0xzLCBjYWxsIHRoaXMgbWV0aG9kIGV4cGxpY2l0bHkuXG4gICAqXG4gICAqIEBwYXJhbSBpZGVudGl0eSBUaGUgcHJpbmNpcGFsXG4gICAqIEBwYXJhbSBvYmplY3RzS2V5UGF0dGVybiBSZXN0cmljdCB0aGUgcGVybWlzc2lvbiB0byBhIGNlcnRhaW4ga2V5IHBhdHRlcm4gKGRlZmF1bHQgJyonKVxuICAgKi9cbiAgZ3JhbnRQdXRBY2woaWRlbnRpdHk6IGlhbS5JR3JhbnRhYmxlLCBvYmplY3RzS2V5UGF0dGVybj86IHN0cmluZyk6IGlhbS5HcmFudDtcblxuICAvKipcbiAgICogR3JhbnRzIHMzOkRlbGV0ZU9iamVjdCogcGVybWlzc2lvbiB0byBhbiBJQU0gcHJpbmNpcGFsIGZvciBvYmplY3RzXG4gICAqIGluIHRoaXMgYnVja2V0LlxuICAgKlxuICAgKiBAcGFyYW0gaWRlbnRpdHkgVGhlIHByaW5jaXBhbFxuICAgKiBAcGFyYW0gb2JqZWN0c0tleVBhdHRlcm4gUmVzdHJpY3QgdGhlIHBlcm1pc3Npb24gdG8gYSBjZXJ0YWluIGtleSBwYXR0ZXJuIChkZWZhdWx0ICcqJylcbiAgICovXG4gIGdyYW50RGVsZXRlKGlkZW50aXR5OiBpYW0uSUdyYW50YWJsZSwgb2JqZWN0c0tleVBhdHRlcm4/OiBhbnkpOiBpYW0uR3JhbnQ7XG5cbiAgLyoqXG4gICAqIEdyYW50cyByZWFkL3dyaXRlIHBlcm1pc3Npb25zIGZvciB0aGlzIGJ1Y2tldCBhbmQgaXQncyBjb250ZW50cyB0byBhbiBJQU1cbiAgICogcHJpbmNpcGFsIChSb2xlL0dyb3VwL1VzZXIpLlxuICAgKlxuICAgKiBJZiBhbiBlbmNyeXB0aW9uIGtleSBpcyB1c2VkLCBwZXJtaXNzaW9uIHRvIHVzZSB0aGUga2V5IGZvclxuICAgKiBlbmNyeXB0L2RlY3J5cHQgd2lsbCBhbHNvIGJlIGdyYW50ZWQuXG4gICAqXG4gICAqIEJlZm9yZSBDREsgdmVyc2lvbiAxLjg1LjAsIHRoaXMgbWV0aG9kIGdyYW50ZWQgdGhlIGBzMzpQdXRPYmplY3QqYCBwZXJtaXNzaW9uIHRoYXQgaW5jbHVkZWQgYHMzOlB1dE9iamVjdEFjbGAsXG4gICAqIHdoaWNoIGNvdWxkIGJlIHVzZWQgdG8gZ3JhbnQgcmVhZC93cml0ZSBvYmplY3QgYWNjZXNzIHRvIElBTSBwcmluY2lwYWxzIGluIG90aGVyIGFjY291bnRzLlxuICAgKiBJZiB5b3Ugd2FudCB0byBnZXQgcmlkIG9mIHRoYXQgYmVoYXZpb3IsIHVwZGF0ZSB5b3VyIENESyB2ZXJzaW9uIHRvIDEuODUuMCBvciBsYXRlcixcbiAgICogYW5kIG1ha2Ugc3VyZSB0aGUgYEBhd3MtY2RrL2F3cy1zMzpncmFudFdyaXRlV2l0aG91dEFjbGAgZmVhdHVyZSBmbGFnIGlzIHNldCB0byBgdHJ1ZWBcbiAgICogaW4gdGhlIGBjb250ZXh0YCBrZXkgb2YgeW91ciBjZGsuanNvbiBmaWxlLlxuICAgKiBJZiB5b3UndmUgYWxyZWFkeSB1cGRhdGVkLCBidXQgc3RpbGwgbmVlZCB0aGUgcHJpbmNpcGFsIHRvIGhhdmUgcGVybWlzc2lvbnMgdG8gbW9kaWZ5IHRoZSBBQ0xzLFxuICAgKiB1c2UgdGhlIGBncmFudFB1dEFjbGAgbWV0aG9kLlxuICAgKlxuICAgKiBAcGFyYW0gaWRlbnRpdHkgVGhlIHByaW5jaXBhbFxuICAgKiBAcGFyYW0gb2JqZWN0c0tleVBhdHRlcm4gUmVzdHJpY3QgdGhlIHBlcm1pc3Npb24gdG8gYSBjZXJ0YWluIGtleSBwYXR0ZXJuIChkZWZhdWx0ICcqJylcbiAgICovXG4gIGdyYW50UmVhZFdyaXRlKGlkZW50aXR5OiBpYW0uSUdyYW50YWJsZSwgb2JqZWN0c0tleVBhdHRlcm4/OiBhbnkpOiBpYW0uR3JhbnQ7XG5cbiAgLyoqXG4gICAqIEFsbG93cyB1bnJlc3RyaWN0ZWQgYWNjZXNzIHRvIG9iamVjdHMgZnJvbSB0aGlzIGJ1Y2tldC5cbiAgICpcbiAgICogSU1QT1JUQU5UOiBUaGlzIHBlcm1pc3Npb24gYWxsb3dzIGFueW9uZSB0byBwZXJmb3JtIGFjdGlvbnMgb24gUzMgb2JqZWN0c1xuICAgKiBpbiB0aGlzIGJ1Y2tldCwgd2hpY2ggaXMgdXNlZnVsIGZvciB3aGVuIHlvdSBjb25maWd1cmUgeW91ciBidWNrZXQgYXMgYVxuICAgKiB3ZWJzaXRlIGFuZCB3YW50IGV2ZXJ5b25lIHRvIGJlIGFibGUgdG8gcmVhZCBvYmplY3RzIGluIHRoZSBidWNrZXQgd2l0aG91dFxuICAgKiBuZWVkaW5nIHRvIGF1dGhlbnRpY2F0ZS5cbiAgICpcbiAgICogV2l0aG91dCBhcmd1bWVudHMsIHRoaXMgbWV0aG9kIHdpbGwgZ3JhbnQgcmVhZCAoXCJzMzpHZXRPYmplY3RcIikgYWNjZXNzIHRvXG4gICAqIGFsbCBvYmplY3RzIChcIipcIikgaW4gdGhlIGJ1Y2tldC5cbiAgICpcbiAgICogVGhlIG1ldGhvZCByZXR1cm5zIHRoZSBgaWFtLkdyYW50YCBvYmplY3QsIHdoaWNoIGNhbiB0aGVuIGJlIG1vZGlmaWVkXG4gICAqIGFzIG5lZWRlZC4gRm9yIGV4YW1wbGUsIHlvdSBjYW4gYWRkIGEgY29uZGl0aW9uIHRoYXQgd2lsbCByZXN0cmljdCBhY2Nlc3Mgb25seVxuICAgKiB0byBhbiBJUHY0IHJhbmdlIGxpa2UgdGhpczpcbiAgICpcbiAgICogICAgIGNvbnN0IGdyYW50ID0gYnVja2V0LmdyYW50UHVibGljQWNjZXNzKCk7XG4gICAqICAgICBncmFudC5yZXNvdXJjZVN0YXRlbWVudCEuYWRkQ29uZGl0aW9uKOKAmElwQWRkcmVzc+KAmSwgeyDigJxhd3M6U291cmNlSXDigJ06IOKAnDU0LjI0MC4xNDMuMC8yNOKAnSB9KTtcbiAgICpcbiAgICpcbiAgICogQHBhcmFtIGtleVByZWZpeCB0aGUgcHJlZml4IG9mIFMzIG9iamVjdCBrZXlzIChlLmcuIGBob21lLypgKS4gRGVmYXVsdCBpcyBcIipcIi5cbiAgICogQHBhcmFtIGFsbG93ZWRBY3Rpb25zIHRoZSBzZXQgb2YgUzMgYWN0aW9ucyB0byBhbGxvdy4gRGVmYXVsdCBpcyBcInMzOkdldE9iamVjdFwiLlxuICAgKiBAcmV0dXJucyBUaGUgYGlhbS5Qb2xpY3lTdGF0ZW1lbnRgIG9iamVjdCwgd2hpY2ggY2FuIGJlIHVzZWQgdG8gYXBwbHkgZS5nLiBjb25kaXRpb25zLlxuICAgKi9cbiAgZ3JhbnRQdWJsaWNBY2Nlc3Moa2V5UHJlZml4Pzogc3RyaW5nLCAuLi5hbGxvd2VkQWN0aW9uczogc3RyaW5nW10pOiBpYW0uR3JhbnQ7XG5cbiAgLyoqXG4gICAqIERlZmluZXMgYSBDbG91ZFdhdGNoIGV2ZW50IHRoYXQgdHJpZ2dlcnMgd2hlbiBzb21ldGhpbmcgaGFwcGVucyB0byB0aGlzIGJ1Y2tldFxuICAgKlxuICAgKiBSZXF1aXJlcyB0aGF0IHRoZXJlIGV4aXN0cyBhdCBsZWFzdCBvbmUgQ2xvdWRUcmFpbCBUcmFpbCBpbiB5b3VyIGFjY291bnRcbiAgICogdGhhdCBjYXB0dXJlcyB0aGUgZXZlbnQuIFRoaXMgbWV0aG9kIHdpbGwgbm90IGNyZWF0ZSB0aGUgVHJhaWwuXG4gICAqXG4gICAqIEBwYXJhbSBpZCBUaGUgaWQgb2YgdGhlIHJ1bGVcbiAgICogQHBhcmFtIG9wdGlvbnMgT3B0aW9ucyBmb3IgYWRkaW5nIHRoZSBydWxlXG4gICAqL1xuICBvbkNsb3VkVHJhaWxFdmVudChpZDogc3RyaW5nLCBvcHRpb25zPzogT25DbG91ZFRyYWlsQnVja2V0RXZlbnRPcHRpb25zKTogZXZlbnRzLlJ1bGU7XG5cbiAgLyoqXG4gICAqIERlZmluZXMgYW4gQVdTIENsb3VkV2F0Y2ggZXZlbnQgdGhhdCB0cmlnZ2VycyB3aGVuIGFuIG9iamVjdCBpcyB1cGxvYWRlZFxuICAgKiB0byB0aGUgc3BlY2lmaWVkIHBhdGhzIChrZXlzKSBpbiB0aGlzIGJ1Y2tldCB1c2luZyB0aGUgUHV0T2JqZWN0IEFQSSBjYWxsLlxuICAgKlxuICAgKiBOb3RlIHRoYXQgc29tZSB0b29scyBsaWtlIGBhd3MgczMgY3BgIHdpbGwgYXV0b21hdGljYWxseSB1c2UgZWl0aGVyXG4gICAqIFB1dE9iamVjdCBvciB0aGUgbXVsdGlwYXJ0IHVwbG9hZCBBUEkgZGVwZW5kaW5nIG9uIHRoZSBmaWxlIHNpemUsXG4gICAqIHNvIHVzaW5nIGBvbkNsb3VkVHJhaWxXcml0ZU9iamVjdGAgbWF5IGJlIHByZWZlcmFibGUuXG4gICAqXG4gICAqIFJlcXVpcmVzIHRoYXQgdGhlcmUgZXhpc3RzIGF0IGxlYXN0IG9uZSBDbG91ZFRyYWlsIFRyYWlsIGluIHlvdXIgYWNjb3VudFxuICAgKiB0aGF0IGNhcHR1cmVzIHRoZSBldmVudC4gVGhpcyBtZXRob2Qgd2lsbCBub3QgY3JlYXRlIHRoZSBUcmFpbC5cbiAgICpcbiAgICogQHBhcmFtIGlkIFRoZSBpZCBvZiB0aGUgcnVsZVxuICAgKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zIGZvciBhZGRpbmcgdGhlIHJ1bGVcbiAgICovXG4gIG9uQ2xvdWRUcmFpbFB1dE9iamVjdChpZDogc3RyaW5nLCBvcHRpb25zPzogT25DbG91ZFRyYWlsQnVja2V0RXZlbnRPcHRpb25zKTogZXZlbnRzLlJ1bGU7XG5cbiAgLyoqXG4gICAqIERlZmluZXMgYW4gQVdTIENsb3VkV2F0Y2ggZXZlbnQgdGhhdCB0cmlnZ2VycyB3aGVuIGFuIG9iamVjdCBhdCB0aGVcbiAgICogc3BlY2lmaWVkIHBhdGhzIChrZXlzKSBpbiB0aGlzIGJ1Y2tldCBhcmUgd3JpdHRlbiB0by4gIFRoaXMgaW5jbHVkZXNcbiAgICogdGhlIGV2ZW50cyBQdXRPYmplY3QsIENvcHlPYmplY3QsIGFuZCBDb21wbGV0ZU11bHRpcGFydFVwbG9hZC5cbiAgICpcbiAgICogTm90ZSB0aGF0IHNvbWUgdG9vbHMgbGlrZSBgYXdzIHMzIGNwYCB3aWxsIGF1dG9tYXRpY2FsbHkgdXNlIGVpdGhlclxuICAgKiBQdXRPYmplY3Qgb3IgdGhlIG11bHRpcGFydCB1cGxvYWQgQVBJIGRlcGVuZGluZyBvbiB0aGUgZmlsZSBzaXplLFxuICAgKiBzbyB1c2luZyB0aGlzIG1ldGhvZCBtYXkgYmUgcHJlZmVyYWJsZSB0byBgb25DbG91ZFRyYWlsUHV0T2JqZWN0YC5cbiAgICpcbiAgICogUmVxdWlyZXMgdGhhdCB0aGVyZSBleGlzdHMgYXQgbGVhc3Qgb25lIENsb3VkVHJhaWwgVHJhaWwgaW4geW91ciBhY2NvdW50XG4gICAqIHRoYXQgY2FwdHVyZXMgdGhlIGV2ZW50LiBUaGlzIG1ldGhvZCB3aWxsIG5vdCBjcmVhdGUgdGhlIFRyYWlsLlxuICAgKlxuICAgKiBAcGFyYW0gaWQgVGhlIGlkIG9mIHRoZSBydWxlXG4gICAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbnMgZm9yIGFkZGluZyB0aGUgcnVsZVxuICAgKi9cbiAgb25DbG91ZFRyYWlsV3JpdGVPYmplY3QoaWQ6IHN0cmluZywgb3B0aW9ucz86IE9uQ2xvdWRUcmFpbEJ1Y2tldEV2ZW50T3B0aW9ucyk6IGV2ZW50cy5SdWxlO1xuXG4gIC8qKlxuICAgKiBBZGRzIGEgYnVja2V0IG5vdGlmaWNhdGlvbiBldmVudCBkZXN0aW5hdGlvbi5cbiAgICogQHBhcmFtIGV2ZW50IFRoZSBldmVudCB0byB0cmlnZ2VyIHRoZSBub3RpZmljYXRpb25cbiAgICogQHBhcmFtIGRlc3QgVGhlIG5vdGlmaWNhdGlvbiBkZXN0aW5hdGlvbiAoTGFtYmRhLCBTTlMgVG9waWMgb3IgU1FTIFF1ZXVlKVxuICAgKlxuICAgKiBAcGFyYW0gZmlsdGVycyBTMyBvYmplY3Qga2V5IGZpbHRlciBydWxlcyB0byBkZXRlcm1pbmUgd2hpY2ggb2JqZWN0c1xuICAgKiB0cmlnZ2VyIHRoaXMgZXZlbnQuIEVhY2ggZmlsdGVyIG11c3QgaW5jbHVkZSBhIGBwcmVmaXhgIGFuZC9vciBgc3VmZml4YFxuICAgKiB0aGF0IHdpbGwgYmUgbWF0Y2hlZCBhZ2FpbnN0IHRoZSBzMyBvYmplY3Qga2V5LiBSZWZlciB0byB0aGUgUzMgRGV2ZWxvcGVyIEd1aWRlXG4gICAqIGZvciBkZXRhaWxzIGFib3V0IGFsbG93ZWQgZmlsdGVyIHJ1bGVzLlxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BbWF6b25TMy9sYXRlc3QvZGV2L05vdGlmaWNhdGlvbkhvd1RvLmh0bWwjbm90aWZpY2F0aW9uLWhvdy10by1maWx0ZXJpbmdcbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogICAgZGVjbGFyZSBjb25zdCBteUxhbWJkYTogbGFtYmRhLkZ1bmN0aW9uO1xuICAgKiAgICBjb25zdCBidWNrZXQgPSBuZXcgczMuQnVja2V0KHRoaXMsICdNeUJ1Y2tldCcpO1xuICAgKiAgICBidWNrZXQuYWRkRXZlbnROb3RpZmljYXRpb24oczMuRXZlbnRUeXBlLk9CSkVDVF9DUkVBVEVELCBuZXcgczNuLkxhbWJkYURlc3RpbmF0aW9uKG15TGFtYmRhKSwge3ByZWZpeDogJ2hvbWUvbXl1c2VybmFtZS8qJ30pXG4gICAqXG4gICAqIEBzZWVcbiAgICogaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FtYXpvblMzL2xhdGVzdC9kZXYvTm90aWZpY2F0aW9uSG93VG8uaHRtbFxuICAgKi9cbiAgYWRkRXZlbnROb3RpZmljYXRpb24oZXZlbnQ6IEV2ZW50VHlwZSwgZGVzdDogSUJ1Y2tldE5vdGlmaWNhdGlvbkRlc3RpbmF0aW9uLCAuLi5maWx0ZXJzOiBOb3RpZmljYXRpb25LZXlGaWx0ZXJbXSk6IHZvaWQ7XG5cbiAgLyoqXG4gICAqIFN1YnNjcmliZXMgYSBkZXN0aW5hdGlvbiB0byByZWNlaXZlIG5vdGlmaWNhdGlvbnMgd2hlbiBhbiBvYmplY3QgaXNcbiAgICogY3JlYXRlZCBpbiB0aGUgYnVja2V0LiBUaGlzIGlzIGlkZW50aWNhbCB0byBjYWxsaW5nXG4gICAqIGBvbkV2ZW50KHMzLkV2ZW50VHlwZS5PQkpFQ1RfQ1JFQVRFRClgLlxuICAgKlxuICAgKiBAcGFyYW0gZGVzdCBUaGUgbm90aWZpY2F0aW9uIGRlc3RpbmF0aW9uIChzZWUgb25FdmVudClcbiAgICogQHBhcmFtIGZpbHRlcnMgRmlsdGVycyAoc2VlIG9uRXZlbnQpXG4gICAqL1xuICBhZGRPYmplY3RDcmVhdGVkTm90aWZpY2F0aW9uKGRlc3Q6IElCdWNrZXROb3RpZmljYXRpb25EZXN0aW5hdGlvbiwgLi4uZmlsdGVyczogTm90aWZpY2F0aW9uS2V5RmlsdGVyW10pOiB2b2lkXG5cbiAgLyoqXG4gICAqIFN1YnNjcmliZXMgYSBkZXN0aW5hdGlvbiB0byByZWNlaXZlIG5vdGlmaWNhdGlvbnMgd2hlbiBhbiBvYmplY3QgaXNcbiAgICogcmVtb3ZlZCBmcm9tIHRoZSBidWNrZXQuIFRoaXMgaXMgaWRlbnRpY2FsIHRvIGNhbGxpbmdcbiAgICogYG9uRXZlbnQoRXZlbnRUeXBlLk9CSkVDVF9SRU1PVkVEKWAuXG4gICAqXG4gICAqIEBwYXJhbSBkZXN0IFRoZSBub3RpZmljYXRpb24gZGVzdGluYXRpb24gKHNlZSBvbkV2ZW50KVxuICAgKiBAcGFyYW0gZmlsdGVycyBGaWx0ZXJzIChzZWUgb25FdmVudClcbiAgICovXG4gIGFkZE9iamVjdFJlbW92ZWROb3RpZmljYXRpb24oZGVzdDogSUJ1Y2tldE5vdGlmaWNhdGlvbkRlc3RpbmF0aW9uLCAuLi5maWx0ZXJzOiBOb3RpZmljYXRpb25LZXlGaWx0ZXJbXSk6IHZvaWQ7XG5cblxuICAvKipcbiAgICogRW5hYmxlcyBldmVudCBicmlkZ2Ugbm90aWZpY2F0aW9uLCBjYXVzaW5nIGFsbCBldmVudHMgYmVsb3cgdG8gYmUgc2VudCB0byBFdmVudEJyaWRnZTpcbiAgICpcbiAgICogLSBPYmplY3QgRGVsZXRlZCAoRGVsZXRlT2JqZWN0KVxuICAgKiAtIE9iamVjdCBEZWxldGVkIChMaWZlY3ljbGUgZXhwaXJhdGlvbilcbiAgICogLSBPYmplY3QgUmVzdG9yZSBJbml0aWF0ZWRcbiAgICogLSBPYmplY3QgUmVzdG9yZSBDb21wbGV0ZWRcbiAgICogLSBPYmplY3QgUmVzdG9yZSBFeHBpcmVkXG4gICAqIC0gT2JqZWN0IFN0b3JhZ2UgQ2xhc3MgQ2hhbmdlZFxuICAgKiAtIE9iamVjdCBBY2Nlc3MgVGllciBDaGFuZ2VkXG4gICAqIC0gT2JqZWN0IEFDTCBVcGRhdGVkXG4gICAqIC0gT2JqZWN0IFRhZ3MgQWRkZWRcbiAgICogLSBPYmplY3QgVGFncyBEZWxldGVkXG4gICAqL1xuICBlbmFibGVFdmVudEJyaWRnZU5vdGlmaWNhdGlvbigpOiB2b2lkO1xufVxuXG4vKipcbiAqIEEgcmVmZXJlbmNlIHRvIGEgYnVja2V0IG91dHNpZGUgdGhpcyBzdGFja1xuICovXG5leHBvcnQgaW50ZXJmYWNlIEJ1Y2tldEF0dHJpYnV0ZXMge1xuICAvKipcbiAgICogVGhlIEFSTiBvZiB0aGUgYnVja2V0LiBBdCBsZWFzdCBvbmUgb2YgYnVja2V0QXJuIG9yIGJ1Y2tldE5hbWUgbXVzdCBiZVxuICAgKiBkZWZpbmVkIGluIG9yZGVyIHRvIGluaXRpYWxpemUgYSBidWNrZXQgcmVmLlxuICAgKi9cbiAgcmVhZG9ubHkgYnVja2V0QXJuPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgbmFtZSBvZiB0aGUgYnVja2V0LiBJZiB0aGUgdW5kZXJseWluZyB2YWx1ZSBvZiBBUk4gaXMgYSBzdHJpbmcsIHRoZVxuICAgKiBuYW1lIHdpbGwgYmUgcGFyc2VkIGZyb20gdGhlIEFSTi4gT3RoZXJ3aXNlLCB0aGUgbmFtZSBpcyBvcHRpb25hbCwgYnV0XG4gICAqIHNvbWUgZmVhdHVyZXMgdGhhdCByZXF1aXJlIHRoZSBidWNrZXQgbmFtZSBzdWNoIGFzIGF1dG8tY3JlYXRpbmcgYSBidWNrZXRcbiAgICogcG9saWN5LCB3b24ndCB3b3JrLlxuICAgKi9cbiAgcmVhZG9ubHkgYnVja2V0TmFtZT86IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIGRvbWFpbiBuYW1lIG9mIHRoZSBidWNrZXQuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gSW5mZXJyZWQgZnJvbSBidWNrZXQgbmFtZVxuICAgKi9cbiAgcmVhZG9ubHkgYnVja2V0RG9tYWluTmFtZT86IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIHdlYnNpdGUgVVJMIG9mIHRoZSBidWNrZXQgKGlmIHN0YXRpYyB3ZWIgaG9zdGluZyBpcyBlbmFibGVkKS5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBJbmZlcnJlZCBmcm9tIGJ1Y2tldCBuYW1lIGFuZCByZWdpb25cbiAgICovXG4gIHJlYWRvbmx5IGJ1Y2tldFdlYnNpdGVVcmw/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSByZWdpb25hbCBkb21haW4gbmFtZSBvZiB0aGUgc3BlY2lmaWVkIGJ1Y2tldC5cbiAgICovXG4gIHJlYWRvbmx5IGJ1Y2tldFJlZ2lvbmFsRG9tYWluTmFtZT86IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIElQdjYgRE5TIG5hbWUgb2YgdGhlIHNwZWNpZmllZCBidWNrZXQuXG4gICAqL1xuICByZWFkb25seSBidWNrZXREdWFsU3RhY2tEb21haW5OYW1lPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBGb3JjZSB0aGUgZm9ybWF0IG9mIHRoZSB3ZWJzaXRlIFVSTCBvZiB0aGUgYnVja2V0LiBUaGlzIHNob3VsZCBiZSB0cnVlIGZvclxuICAgKiByZWdpb25zIGxhdW5jaGVkIHNpbmNlIDIwMTQuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gaW5mZXJyZWQgZnJvbSBhdmFpbGFibGUgcmVnaW9uIGluZm9ybWF0aW9uLCBgZmFsc2VgIG90aGVyd2lzZVxuICAgKlxuICAgKiBAZGVwcmVjYXRlZCBUaGUgY29ycmVjdCB3ZWJzaXRlIHVybCBmb3JtYXQgY2FuIGJlIGluZmVycmVkIGF1dG9tYXRpY2FsbHkgZnJvbSB0aGUgYnVja2V0IGByZWdpb25gLlxuICAgKiBBbHdheXMgcHJvdmlkZSB0aGUgYnVja2V0IHJlZ2lvbiBpZiB0aGUgYGJ1Y2tldFdlYnNpdGVVcmxgIHdpbGwgYmUgdXNlZC5cbiAgICogQWx0ZXJuYXRpdmVseSBwcm92aWRlIHRoZSBmdWxsIGBidWNrZXRXZWJzaXRlVXJsYCBtYW51YWxseS5cbiAgICovXG4gIHJlYWRvbmx5IGJ1Y2tldFdlYnNpdGVOZXdVcmxGb3JtYXQ/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBLTVMgZW5jcnlwdGlvbiBrZXkgYXNzb2NpYXRlZCB3aXRoIHRoaXMgYnVja2V0LlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIG5vIGVuY3J5cHRpb24ga2V5XG4gICAqL1xuICByZWFkb25seSBlbmNyeXB0aW9uS2V5Pzoga21zLklLZXk7XG5cbiAgLyoqXG4gICAqIElmIHRoaXMgYnVja2V0IGhhcyBiZWVuIGNvbmZpZ3VyZWQgZm9yIHN0YXRpYyB3ZWJzaXRlIGhvc3RpbmcuXG4gICAqXG4gICAqIEBkZWZhdWx0IGZhbHNlXG4gICAqL1xuICByZWFkb25seSBpc1dlYnNpdGU/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBUaGUgYWNjb3VudCB0aGlzIGV4aXN0aW5nIGJ1Y2tldCBiZWxvbmdzIHRvLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIGl0J3MgYXNzdW1lZCB0aGUgYnVja2V0IGJlbG9uZ3MgdG8gdGhlIHNhbWUgYWNjb3VudCBhcyB0aGUgc2NvcGUgaXQncyBiZWluZyBpbXBvcnRlZCBpbnRvXG4gICAqL1xuICByZWFkb25seSBhY2NvdW50Pzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgcmVnaW9uIHRoaXMgZXhpc3RpbmcgYnVja2V0IGlzIGluLlxuICAgKiBGZWF0dXJlcyB0aGF0IHJlcXVpcmUgdGhlIHJlZ2lvbiAoZS5nLiBgYnVja2V0V2Vic2l0ZVVybGApIHdvbid0IGZ1bGx5IHdvcmtcbiAgICogaWYgdGhlIHJlZ2lvbiBjYW5ub3QgYmUgY29ycmVjdGx5IGluZmVycmVkLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIGl0J3MgYXNzdW1lZCB0aGUgYnVja2V0IGlzIGluIHRoZSBzYW1lIHJlZ2lvbiBhcyB0aGUgc2NvcGUgaXQncyBiZWluZyBpbXBvcnRlZCBpbnRvXG4gICAqL1xuICByZWFkb25seSByZWdpb24/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSByb2xlIHRvIGJlIHVzZWQgYnkgdGhlIG5vdGlmaWNhdGlvbnMgaGFuZGxlclxuICAgKlxuICAgKiBAZGVmYXVsdCAtIGEgbmV3IHJvbGUgd2lsbCBiZSBjcmVhdGVkLlxuICAgKi9cbiAgcmVhZG9ubHkgbm90aWZpY2F0aW9uc0hhbmRsZXJSb2xlPzogaWFtLklSb2xlO1xufVxuXG4vKipcbiAqIFJlcHJlc2VudHMgYW4gUzMgQnVja2V0LlxuICpcbiAqIEJ1Y2tldHMgY2FuIGJlIGVpdGhlciBkZWZpbmVkIHdpdGhpbiB0aGlzIHN0YWNrOlxuICpcbiAqICAgbmV3IEJ1Y2tldCh0aGlzLCAnTXlCdWNrZXQnLCB7IHByb3BzIH0pO1xuICpcbiAqIE9yIGltcG9ydGVkIGZyb20gYW4gZXhpc3RpbmcgYnVja2V0OlxuICpcbiAqICAgQnVja2V0LmltcG9ydCh0aGlzLCAnTXlJbXBvcnRlZEJ1Y2tldCcsIHsgYnVja2V0QXJuOiAuLi4gfSk7XG4gKlxuICogWW91IGNhbiBhbHNvIGV4cG9ydCBhIGJ1Y2tldCBhbmQgaW1wb3J0IGl0IGludG8gYW5vdGhlciBzdGFjazpcbiAqXG4gKiAgIGNvbnN0IHJlZiA9IG15QnVja2V0LmV4cG9ydCgpO1xuICogICBCdWNrZXQuaW1wb3J0KHRoaXMsICdNeUltcG9ydGVkQnVja2V0JywgcmVmKTtcbiAqXG4gKi9cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBCdWNrZXRCYXNlIGV4dGVuZHMgUmVzb3VyY2UgaW1wbGVtZW50cyBJQnVja2V0IHtcbiAgcHVibGljIGFic3RyYWN0IHJlYWRvbmx5IGJ1Y2tldEFybjogc3RyaW5nO1xuICBwdWJsaWMgYWJzdHJhY3QgcmVhZG9ubHkgYnVja2V0TmFtZTogc3RyaW5nO1xuICBwdWJsaWMgYWJzdHJhY3QgcmVhZG9ubHkgYnVja2V0RG9tYWluTmFtZTogc3RyaW5nO1xuICBwdWJsaWMgYWJzdHJhY3QgcmVhZG9ubHkgYnVja2V0V2Vic2l0ZVVybDogc3RyaW5nO1xuICBwdWJsaWMgYWJzdHJhY3QgcmVhZG9ubHkgYnVja2V0V2Vic2l0ZURvbWFpbk5hbWU6IHN0cmluZztcbiAgcHVibGljIGFic3RyYWN0IHJlYWRvbmx5IGJ1Y2tldFJlZ2lvbmFsRG9tYWluTmFtZTogc3RyaW5nO1xuICBwdWJsaWMgYWJzdHJhY3QgcmVhZG9ubHkgYnVja2V0RHVhbFN0YWNrRG9tYWluTmFtZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBPcHRpb25hbCBLTVMgZW5jcnlwdGlvbiBrZXkgYXNzb2NpYXRlZCB3aXRoIHRoaXMgYnVja2V0LlxuICAgKi9cbiAgcHVibGljIGFic3RyYWN0IHJlYWRvbmx5IGVuY3J5cHRpb25LZXk/OiBrbXMuSUtleTtcblxuICAvKipcbiAgICogSWYgdGhpcyBidWNrZXQgaGFzIGJlZW4gY29uZmlndXJlZCBmb3Igc3RhdGljIHdlYnNpdGUgaG9zdGluZy5cbiAgICovXG4gIHB1YmxpYyBhYnN0cmFjdCByZWFkb25seSBpc1dlYnNpdGU/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBUaGUgcmVzb3VyY2UgcG9saWN5IGFzc29jaWF0ZWQgd2l0aCB0aGlzIGJ1Y2tldC5cbiAgICpcbiAgICogSWYgYGF1dG9DcmVhdGVQb2xpY3lgIGlzIHRydWUsIGEgYEJ1Y2tldFBvbGljeWAgd2lsbCBiZSBjcmVhdGVkIHVwb24gdGhlXG4gICAqIGZpcnN0IGNhbGwgdG8gYWRkVG9SZXNvdXJjZVBvbGljeShzKS5cbiAgICovXG4gIHB1YmxpYyBhYnN0cmFjdCBwb2xpY3k/OiBCdWNrZXRQb2xpY3k7XG5cbiAgLyoqXG4gICAqIEluZGljYXRlcyBpZiBhIGJ1Y2tldCByZXNvdXJjZSBwb2xpY3kgc2hvdWxkIGF1dG9tYXRpY2FsbHkgY3JlYXRlZCB1cG9uXG4gICAqIHRoZSBmaXJzdCBjYWxsIHRvIGBhZGRUb1Jlc291cmNlUG9saWN5YC5cbiAgICovXG4gIHByb3RlY3RlZCBhYnN0cmFjdCBhdXRvQ3JlYXRlUG9saWN5OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRvIGRpc2FsbG93IHB1YmxpYyBhY2Nlc3NcbiAgICovXG4gIHByb3RlY3RlZCBhYnN0cmFjdCBkaXNhbGxvd1B1YmxpY0FjY2Vzcz86IGJvb2xlYW47XG5cbiAgcHJpdmF0ZSBub3RpZmljYXRpb25zPzogQnVja2V0Tm90aWZpY2F0aW9ucztcblxuICBwcm90ZWN0ZWQgbm90aWZpY2F0aW9uc0hhbmRsZXJSb2xlPzogaWFtLklSb2xlO1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBSZXNvdXJjZVByb3BzID0ge30pIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcblxuICAgIHRoaXMubm9kZS5hZGRWYWxpZGF0aW9uKHsgdmFsaWRhdGU6ICgpID0+IHRoaXMucG9saWN5Py5kb2N1bWVudC52YWxpZGF0ZUZvclJlc291cmNlUG9saWN5KCkgPz8gW10gfSk7XG4gIH1cblxuICAvKipcbiAgICogRGVmaW5lIGEgQ2xvdWRXYXRjaCBldmVudCB0aGF0IHRyaWdnZXJzIHdoZW4gc29tZXRoaW5nIGhhcHBlbnMgdG8gdGhpcyByZXBvc2l0b3J5XG4gICAqXG4gICAqIFJlcXVpcmVzIHRoYXQgdGhlcmUgZXhpc3RzIGF0IGxlYXN0IG9uZSBDbG91ZFRyYWlsIFRyYWlsIGluIHlvdXIgYWNjb3VudFxuICAgKiB0aGF0IGNhcHR1cmVzIHRoZSBldmVudC4gVGhpcyBtZXRob2Qgd2lsbCBub3QgY3JlYXRlIHRoZSBUcmFpbC5cbiAgICpcbiAgICogQHBhcmFtIGlkIFRoZSBpZCBvZiB0aGUgcnVsZVxuICAgKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zIGZvciBhZGRpbmcgdGhlIHJ1bGVcbiAgICovXG4gIHB1YmxpYyBvbkNsb3VkVHJhaWxFdmVudChpZDogc3RyaW5nLCBvcHRpb25zOiBPbkNsb3VkVHJhaWxCdWNrZXRFdmVudE9wdGlvbnMgPSB7fSk6IGV2ZW50cy5SdWxlIHtcbiAgICBjb25zdCBydWxlID0gbmV3IGV2ZW50cy5SdWxlKHRoaXMsIGlkLCBvcHRpb25zKTtcbiAgICBydWxlLmFkZFRhcmdldChvcHRpb25zLnRhcmdldCk7XG4gICAgcnVsZS5hZGRFdmVudFBhdHRlcm4oe1xuICAgICAgc291cmNlOiBbJ2F3cy5zMyddLFxuICAgICAgZGV0YWlsVHlwZTogWydBV1MgQVBJIENhbGwgdmlhIENsb3VkVHJhaWwnXSxcbiAgICAgIGRldGFpbDoge1xuICAgICAgICByZXNvdXJjZXM6IHtcbiAgICAgICAgICBBUk46IG9wdGlvbnMucGF0aHM/Lm1hcChwID0+IHRoaXMuYXJuRm9yT2JqZWN0cyhwKSkgPz8gW3RoaXMuYnVja2V0QXJuXSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgcmV0dXJuIHJ1bGU7XG4gIH1cblxuICAvKipcbiAgICogRGVmaW5lcyBhbiBBV1MgQ2xvdWRXYXRjaCBldmVudCB0aGF0IHRyaWdnZXJzIHdoZW4gYW4gb2JqZWN0IGlzIHVwbG9hZGVkXG4gICAqIHRvIHRoZSBzcGVjaWZpZWQgcGF0aHMgKGtleXMpIGluIHRoaXMgYnVja2V0IHVzaW5nIHRoZSBQdXRPYmplY3QgQVBJIGNhbGwuXG4gICAqXG4gICAqIE5vdGUgdGhhdCBzb21lIHRvb2xzIGxpa2UgYGF3cyBzMyBjcGAgd2lsbCBhdXRvbWF0aWNhbGx5IHVzZSBlaXRoZXJcbiAgICogUHV0T2JqZWN0IG9yIHRoZSBtdWx0aXBhcnQgdXBsb2FkIEFQSSBkZXBlbmRpbmcgb24gdGhlIGZpbGUgc2l6ZSxcbiAgICogc28gdXNpbmcgYG9uQ2xvdWRUcmFpbFdyaXRlT2JqZWN0YCBtYXkgYmUgcHJlZmVyYWJsZS5cbiAgICpcbiAgICogUmVxdWlyZXMgdGhhdCB0aGVyZSBleGlzdHMgYXQgbGVhc3Qgb25lIENsb3VkVHJhaWwgVHJhaWwgaW4geW91ciBhY2NvdW50XG4gICAqIHRoYXQgY2FwdHVyZXMgdGhlIGV2ZW50LiBUaGlzIG1ldGhvZCB3aWxsIG5vdCBjcmVhdGUgdGhlIFRyYWlsLlxuICAgKlxuICAgKiBAcGFyYW0gaWQgVGhlIGlkIG9mIHRoZSBydWxlXG4gICAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbnMgZm9yIGFkZGluZyB0aGUgcnVsZVxuICAgKi9cbiAgcHVibGljIG9uQ2xvdWRUcmFpbFB1dE9iamVjdChpZDogc3RyaW5nLCBvcHRpb25zOiBPbkNsb3VkVHJhaWxCdWNrZXRFdmVudE9wdGlvbnMgPSB7fSk6IGV2ZW50cy5SdWxlIHtcbiAgICBjb25zdCBydWxlID0gdGhpcy5vbkNsb3VkVHJhaWxFdmVudChpZCwgb3B0aW9ucyk7XG4gICAgcnVsZS5hZGRFdmVudFBhdHRlcm4oe1xuICAgICAgZGV0YWlsOiB7XG4gICAgICAgIGV2ZW50TmFtZTogWydQdXRPYmplY3QnXSxcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgcmV0dXJuIHJ1bGU7XG4gIH1cblxuICAvKipcbiAgICogRGVmaW5lcyBhbiBBV1MgQ2xvdWRXYXRjaCBldmVudCB0aGF0IHRyaWdnZXJzIHdoZW4gYW4gb2JqZWN0IGF0IHRoZVxuICAgKiBzcGVjaWZpZWQgcGF0aHMgKGtleXMpIGluIHRoaXMgYnVja2V0IGFyZSB3cml0dGVuIHRvLiAgVGhpcyBpbmNsdWRlc1xuICAgKiB0aGUgZXZlbnRzIFB1dE9iamVjdCwgQ29weU9iamVjdCwgYW5kIENvbXBsZXRlTXVsdGlwYXJ0VXBsb2FkLlxuICAgKlxuICAgKiBOb3RlIHRoYXQgc29tZSB0b29scyBsaWtlIGBhd3MgczMgY3BgIHdpbGwgYXV0b21hdGljYWxseSB1c2UgZWl0aGVyXG4gICAqIFB1dE9iamVjdCBvciB0aGUgbXVsdGlwYXJ0IHVwbG9hZCBBUEkgZGVwZW5kaW5nIG9uIHRoZSBmaWxlIHNpemUsXG4gICAqIHNvIHVzaW5nIHRoaXMgbWV0aG9kIG1heSBiZSBwcmVmZXJhYmxlIHRvIGBvbkNsb3VkVHJhaWxQdXRPYmplY3RgLlxuICAgKlxuICAgKiBSZXF1aXJlcyB0aGF0IHRoZXJlIGV4aXN0cyBhdCBsZWFzdCBvbmUgQ2xvdWRUcmFpbCBUcmFpbCBpbiB5b3VyIGFjY291bnRcbiAgICogdGhhdCBjYXB0dXJlcyB0aGUgZXZlbnQuIFRoaXMgbWV0aG9kIHdpbGwgbm90IGNyZWF0ZSB0aGUgVHJhaWwuXG4gICAqXG4gICAqIEBwYXJhbSBpZCBUaGUgaWQgb2YgdGhlIHJ1bGVcbiAgICogQHBhcmFtIG9wdGlvbnMgT3B0aW9ucyBmb3IgYWRkaW5nIHRoZSBydWxlXG4gICAqL1xuICBwdWJsaWMgb25DbG91ZFRyYWlsV3JpdGVPYmplY3QoaWQ6IHN0cmluZywgb3B0aW9uczogT25DbG91ZFRyYWlsQnVja2V0RXZlbnRPcHRpb25zID0ge30pOiBldmVudHMuUnVsZSB7XG4gICAgY29uc3QgcnVsZSA9IHRoaXMub25DbG91ZFRyYWlsRXZlbnQoaWQsIG9wdGlvbnMpO1xuICAgIHJ1bGUuYWRkRXZlbnRQYXR0ZXJuKHtcbiAgICAgIGRldGFpbDoge1xuICAgICAgICBldmVudE5hbWU6IFtcbiAgICAgICAgICAnQ29tcGxldGVNdWx0aXBhcnRVcGxvYWQnLFxuICAgICAgICAgICdDb3B5T2JqZWN0JyxcbiAgICAgICAgICAnUHV0T2JqZWN0JyxcbiAgICAgICAgXSxcbiAgICAgICAgcmVxdWVzdFBhcmFtZXRlcnM6IHtcbiAgICAgICAgICBidWNrZXROYW1lOiBbdGhpcy5idWNrZXROYW1lXSxcbiAgICAgICAgICBrZXk6IG9wdGlvbnMucGF0aHMsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICAgIHJldHVybiBydWxlO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYSBzdGF0ZW1lbnQgdG8gdGhlIHJlc291cmNlIHBvbGljeSBmb3IgYSBwcmluY2lwYWwgKGkuZS5cbiAgICogYWNjb3VudC9yb2xlL3NlcnZpY2UpIHRvIHBlcmZvcm0gYWN0aW9ucyBvbiB0aGlzIGJ1Y2tldCBhbmQvb3IgaXRzXG4gICAqIGNvbnRlbnRzLiBVc2UgYGJ1Y2tldEFybmAgYW5kIGBhcm5Gb3JPYmplY3RzKGtleXMpYCB0byBvYnRhaW4gQVJOcyBmb3JcbiAgICogdGhpcyBidWNrZXQgb3Igb2JqZWN0cy5cbiAgICpcbiAgICogTm90ZSB0aGF0IHRoZSBwb2xpY3kgc3RhdGVtZW50IG1heSBvciBtYXkgbm90IGJlIGFkZGVkIHRvIHRoZSBwb2xpY3kuXG4gICAqIEZvciBleGFtcGxlLCB3aGVuIGFuIGBJQnVja2V0YCBpcyBjcmVhdGVkIGZyb20gYW4gZXhpc3RpbmcgYnVja2V0LFxuICAgKiBpdCdzIG5vdCBwb3NzaWJsZSB0byB0ZWxsIHdoZXRoZXIgdGhlIGJ1Y2tldCBhbHJlYWR5IGhhcyBhIHBvbGljeVxuICAgKiBhdHRhY2hlZCwgbGV0IGFsb25lIHRvIHJlLXVzZSB0aGF0IHBvbGljeSB0byBhZGQgbW9yZSBzdGF0ZW1lbnRzIHRvIGl0LlxuICAgKiBTbyBpdCdzIHNhZmVzdCB0byBkbyBub3RoaW5nIGluIHRoZXNlIGNhc2VzLlxuICAgKlxuICAgKiBAcGFyYW0gcGVybWlzc2lvbiB0aGUgcG9saWN5IHN0YXRlbWVudCB0byBiZSBhZGRlZCB0byB0aGUgYnVja2V0J3NcbiAgICogcG9saWN5LlxuICAgKiBAcmV0dXJucyBtZXRhZGF0YSBhYm91dCB0aGUgZXhlY3V0aW9uIG9mIHRoaXMgbWV0aG9kLiBJZiB0aGUgcG9saWN5XG4gICAqIHdhcyBub3QgYWRkZWQsIHRoZSB2YWx1ZSBvZiBgc3RhdGVtZW50QWRkZWRgIHdpbGwgYmUgYGZhbHNlYC4gWW91XG4gICAqIHNob3VsZCBhbHdheXMgY2hlY2sgdGhpcyB2YWx1ZSB0byBtYWtlIHN1cmUgdGhhdCB0aGUgb3BlcmF0aW9uIHdhc1xuICAgKiBhY3R1YWxseSBjYXJyaWVkIG91dC4gT3RoZXJ3aXNlLCBzeW50aGVzaXMgYW5kIGRlcGxveSB3aWxsIHRlcm1pbmF0ZVxuICAgKiBzaWxlbnRseSwgd2hpY2ggbWF5IGJlIGNvbmZ1c2luZy5cbiAgICovXG4gIHB1YmxpYyBhZGRUb1Jlc291cmNlUG9saWN5KHBlcm1pc3Npb246IGlhbS5Qb2xpY3lTdGF0ZW1lbnQpOiBpYW0uQWRkVG9SZXNvdXJjZVBvbGljeVJlc3VsdCB7XG4gICAgaWYgKCF0aGlzLnBvbGljeSAmJiB0aGlzLmF1dG9DcmVhdGVQb2xpY3kpIHtcbiAgICAgIHRoaXMucG9saWN5ID0gbmV3IEJ1Y2tldFBvbGljeSh0aGlzLCAnUG9saWN5JywgeyBidWNrZXQ6IHRoaXMgfSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucG9saWN5KSB7XG4gICAgICB0aGlzLnBvbGljeS5kb2N1bWVudC5hZGRTdGF0ZW1lbnRzKHBlcm1pc3Npb24pO1xuICAgICAgcmV0dXJuIHsgc3RhdGVtZW50QWRkZWQ6IHRydWUsIHBvbGljeURlcGVuZGFibGU6IHRoaXMucG9saWN5IH07XG4gICAgfVxuXG4gICAgcmV0dXJuIHsgc3RhdGVtZW50QWRkZWQ6IGZhbHNlIH07XG4gIH1cblxuICAvKipcbiAgICogVGhlIGh0dHBzIFVSTCBvZiBhbiBTMyBvYmplY3QuIFNwZWNpZnkgYHJlZ2lvbmFsOiBmYWxzZWAgYXQgdGhlIG9wdGlvbnNcbiAgICogZm9yIG5vbi1yZWdpb25hbCBVUkxzLiBGb3IgZXhhbXBsZTpcbiAgICpcbiAgICogLSBgaHR0cHM6Ly9zMy51cy13ZXN0LTEuYW1hem9uYXdzLmNvbS9vbmx5YnVja2V0YFxuICAgKiAtIGBodHRwczovL3MzLnVzLXdlc3QtMS5hbWF6b25hd3MuY29tL2J1Y2tldC9rZXlgXG4gICAqIC0gYGh0dHBzOi8vczMuY24tbm9ydGgtMS5hbWF6b25hd3MuY29tLmNuL2NoaW5hLWJ1Y2tldC9teWtleWBcbiAgICpcbiAgICogQHBhcmFtIGtleSBUaGUgUzMga2V5IG9mIHRoZSBvYmplY3QuIElmIG5vdCBzcGVjaWZpZWQsIHRoZSBVUkwgb2YgdGhlXG4gICAqICAgICAgYnVja2V0IGlzIHJldHVybmVkLlxuICAgKiBAcmV0dXJucyBhbiBPYmplY3RTM1VybCB0b2tlblxuICAgKi9cbiAgcHVibGljIHVybEZvck9iamVjdChrZXk/OiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIGNvbnN0IHN0YWNrID0gU3RhY2sub2YodGhpcyk7XG4gICAgY29uc3QgcHJlZml4ID0gYGh0dHBzOi8vczMuJHt0aGlzLmVudi5yZWdpb259LiR7c3RhY2sudXJsU3VmZml4fS9gO1xuICAgIGlmICh0eXBlb2Yga2V5ICE9PSAnc3RyaW5nJykge1xuICAgICAgcmV0dXJuIHRoaXMudXJsSm9pbihwcmVmaXgsIHRoaXMuYnVja2V0TmFtZSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnVybEpvaW4ocHJlZml4LCB0aGlzLmJ1Y2tldE5hbWUsIGtleSk7XG4gIH1cblxuICAvKipcbiAgICogVGhlIGh0dHBzIFRyYW5zZmVyIEFjY2VsZXJhdGlvbiBVUkwgb2YgYW4gUzMgb2JqZWN0LiBTcGVjaWZ5IGBkdWFsU3RhY2s6IHRydWVgIGF0IHRoZSBvcHRpb25zXG4gICAqIGZvciBkdWFsLXN0YWNrIGVuZHBvaW50IChjb25uZWN0IHRvIHRoZSBidWNrZXQgb3ZlciBJUHY2KS4gRm9yIGV4YW1wbGU6XG4gICAqXG4gICAqIC0gYGh0dHBzOi8vYnVja2V0LnMzLWFjY2VsZXJhdGUuYW1hem9uYXdzLmNvbWBcbiAgICogLSBgaHR0cHM6Ly9idWNrZXQuczMtYWNjZWxlcmF0ZS5hbWF6b25hd3MuY29tL2tleWBcbiAgICpcbiAgICogQHBhcmFtIGtleSBUaGUgUzMga2V5IG9mIHRoZSBvYmplY3QuIElmIG5vdCBzcGVjaWZpZWQsIHRoZSBVUkwgb2YgdGhlXG4gICAqICAgICAgYnVja2V0IGlzIHJldHVybmVkLlxuICAgKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zIGZvciBnZW5lcmF0aW5nIFVSTC5cbiAgICogQHJldHVybnMgYW4gVHJhbnNmZXJBY2NlbGVyYXRpb25VcmwgdG9rZW5cbiAgICovXG4gIHB1YmxpYyB0cmFuc2ZlckFjY2VsZXJhdGlvblVybEZvck9iamVjdChrZXk/OiBzdHJpbmcsIG9wdGlvbnM/OiBUcmFuc2ZlckFjY2VsZXJhdGlvblVybE9wdGlvbnMpOiBzdHJpbmcge1xuICAgIGNvbnN0IGR1YWxTdGFjayA9IG9wdGlvbnM/LmR1YWxTdGFjayA/ICcuZHVhbHN0YWNrJyA6ICcnO1xuICAgIGNvbnN0IHByZWZpeCA9IGBodHRwczovLyR7dGhpcy5idWNrZXROYW1lfS5zMy1hY2NlbGVyYXRlJHtkdWFsU3RhY2t9LmFtYXpvbmF3cy5jb20vYDtcbiAgICBpZiAodHlwZW9mIGtleSAhPT0gJ3N0cmluZycpIHtcbiAgICAgIHJldHVybiB0aGlzLnVybEpvaW4ocHJlZml4KTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMudXJsSm9pbihwcmVmaXgsIGtleSk7XG4gIH1cblxuICAvKipcbiAgICogVGhlIHZpcnR1YWwgaG9zdGVkLXN0eWxlIFVSTCBvZiBhbiBTMyBvYmplY3QuIFNwZWNpZnkgYHJlZ2lvbmFsOiBmYWxzZWAgYXRcbiAgICogdGhlIG9wdGlvbnMgZm9yIG5vbi1yZWdpb25hbCBVUkwuIEZvciBleGFtcGxlOlxuICAgKlxuICAgKiAtIGBodHRwczovL29ubHktYnVja2V0LnMzLnVzLXdlc3QtMS5hbWF6b25hd3MuY29tYFxuICAgKiAtIGBodHRwczovL2J1Y2tldC5zMy51cy13ZXN0LTEuYW1hem9uYXdzLmNvbS9rZXlgXG4gICAqIC0gYGh0dHBzOi8vYnVja2V0LnMzLmFtYXpvbmF3cy5jb20va2V5YFxuICAgKiAtIGBodHRwczovL2NoaW5hLWJ1Y2tldC5zMy5jbi1ub3J0aC0xLmFtYXpvbmF3cy5jb20uY24vbXlrZXlgXG4gICAqXG4gICAqIEBwYXJhbSBrZXkgVGhlIFMzIGtleSBvZiB0aGUgb2JqZWN0LiBJZiBub3Qgc3BlY2lmaWVkLCB0aGUgVVJMIG9mIHRoZVxuICAgKiAgICAgIGJ1Y2tldCBpcyByZXR1cm5lZC5cbiAgICogQHBhcmFtIG9wdGlvbnMgT3B0aW9ucyBmb3IgZ2VuZXJhdGluZyBVUkwuXG4gICAqIEByZXR1cm5zIGFuIE9iamVjdFMzVXJsIHRva2VuXG4gICAqL1xuICBwdWJsaWMgdmlydHVhbEhvc3RlZFVybEZvck9iamVjdChrZXk/OiBzdHJpbmcsIG9wdGlvbnM/OiBWaXJ0dWFsSG9zdGVkU3R5bGVVcmxPcHRpb25zKTogc3RyaW5nIHtcbiAgICBjb25zdCBkb21haW5OYW1lID0gb3B0aW9ucz8ucmVnaW9uYWwgPz8gdHJ1ZSA/IHRoaXMuYnVja2V0UmVnaW9uYWxEb21haW5OYW1lIDogdGhpcy5idWNrZXREb21haW5OYW1lO1xuICAgIGNvbnN0IHByZWZpeCA9IGBodHRwczovLyR7ZG9tYWluTmFtZX1gO1xuICAgIGlmICh0eXBlb2Yga2V5ICE9PSAnc3RyaW5nJykge1xuICAgICAgcmV0dXJuIHByZWZpeDtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMudXJsSm9pbihwcmVmaXgsIGtleSk7XG4gIH1cblxuICAvKipcbiAgICogVGhlIFMzIFVSTCBvZiBhbiBTMyBvYmplY3QuIEZvciBleGFtcGxlOlxuICAgKlxuICAgKiAtIGBzMzovL29ubHlidWNrZXRgXG4gICAqIC0gYHMzOi8vYnVja2V0L2tleWBcbiAgICpcbiAgICogQHBhcmFtIGtleSBUaGUgUzMga2V5IG9mIHRoZSBvYmplY3QuIElmIG5vdCBzcGVjaWZpZWQsIHRoZSBTMyBVUkwgb2YgdGhlXG4gICAqICAgICAgYnVja2V0IGlzIHJldHVybmVkLlxuICAgKiBAcmV0dXJucyBhbiBPYmplY3RTM1VybCB0b2tlblxuICAgKi9cbiAgcHVibGljIHMzVXJsRm9yT2JqZWN0KGtleT86IHN0cmluZyk6IHN0cmluZyB7XG4gICAgY29uc3QgcHJlZml4ID0gJ3MzOi8vJztcbiAgICBpZiAodHlwZW9mIGtleSAhPT0gJ3N0cmluZycpIHtcbiAgICAgIHJldHVybiB0aGlzLnVybEpvaW4ocHJlZml4LCB0aGlzLmJ1Y2tldE5hbWUpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy51cmxKb2luKHByZWZpeCwgdGhpcy5idWNrZXROYW1lLCBrZXkpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYW4gQVJOIHRoYXQgcmVwcmVzZW50cyBhbGwgb2JqZWN0cyB3aXRoaW4gdGhlIGJ1Y2tldCB0aGF0IG1hdGNoXG4gICAqIHRoZSBrZXkgcGF0dGVybiBzcGVjaWZpZWQuIFRvIHJlcHJlc2VudCBhbGwga2V5cywgc3BlY2lmeSBgYFwiKlwiYGAuXG4gICAqXG4gICAqIElmIHlvdSBuZWVkIHRvIHNwZWNpZnkgYSBrZXlQYXR0ZXJuIHdpdGggbXVsdGlwbGUgY29tcG9uZW50cywgY29uY2F0ZW5hdGUgdGhlbSBpbnRvIGEgc2luZ2xlIHN0cmluZywgZS5nLjpcbiAgICpcbiAgICogICBhcm5Gb3JPYmplY3RzKGBob21lLyR7dGVhbX0vJHt1c2VyfS8qYClcbiAgICpcbiAgICovXG4gIHB1YmxpYyBhcm5Gb3JPYmplY3RzKGtleVBhdHRlcm46IHN0cmluZyk6IHN0cmluZyB7XG4gICAgcmV0dXJuIGAke3RoaXMuYnVja2V0QXJufS8ke2tleVBhdHRlcm59YDtcbiAgfVxuXG4gIC8qKlxuICAgKiBHcmFudCByZWFkIHBlcm1pc3Npb25zIGZvciB0aGlzIGJ1Y2tldCBhbmQgaXQncyBjb250ZW50cyB0byBhbiBJQU1cbiAgICogcHJpbmNpcGFsIChSb2xlL0dyb3VwL1VzZXIpLlxuICAgKlxuICAgKiBJZiBlbmNyeXB0aW9uIGlzIHVzZWQsIHBlcm1pc3Npb24gdG8gdXNlIHRoZSBrZXkgdG8gZGVjcnlwdCB0aGUgY29udGVudHNcbiAgICogb2YgdGhlIGJ1Y2tldCB3aWxsIGFsc28gYmUgZ3JhbnRlZCB0byB0aGUgc2FtZSBwcmluY2lwYWwuXG4gICAqXG4gICAqIEBwYXJhbSBpZGVudGl0eSBUaGUgcHJpbmNpcGFsXG4gICAqIEBwYXJhbSBvYmplY3RzS2V5UGF0dGVybiBSZXN0cmljdCB0aGUgcGVybWlzc2lvbiB0byBhIGNlcnRhaW4ga2V5IHBhdHRlcm4gKGRlZmF1bHQgJyonKVxuICAgKi9cbiAgcHVibGljIGdyYW50UmVhZChpZGVudGl0eTogaWFtLklHcmFudGFibGUsIG9iamVjdHNLZXlQYXR0ZXJuOiBhbnkgPSAnKicpIHtcbiAgICByZXR1cm4gdGhpcy5ncmFudChpZGVudGl0eSwgcGVybXMuQlVDS0VUX1JFQURfQUNUSU9OUywgcGVybXMuS0VZX1JFQURfQUNUSU9OUyxcbiAgICAgIHRoaXMuYnVja2V0QXJuLFxuICAgICAgdGhpcy5hcm5Gb3JPYmplY3RzKG9iamVjdHNLZXlQYXR0ZXJuKSk7XG4gIH1cblxuICBwdWJsaWMgZ3JhbnRXcml0ZShpZGVudGl0eTogaWFtLklHcmFudGFibGUsIG9iamVjdHNLZXlQYXR0ZXJuOiBhbnkgPSAnKicpIHtcbiAgICByZXR1cm4gdGhpcy5ncmFudChpZGVudGl0eSwgdGhpcy53cml0ZUFjdGlvbnMsIHBlcm1zLktFWV9XUklURV9BQ1RJT05TLFxuICAgICAgdGhpcy5idWNrZXRBcm4sXG4gICAgICB0aGlzLmFybkZvck9iamVjdHMob2JqZWN0c0tleVBhdHRlcm4pKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHcmFudHMgczM6UHV0T2JqZWN0KiBhbmQgczM6QWJvcnQqIHBlcm1pc3Npb25zIGZvciB0aGlzIGJ1Y2tldCB0byBhbiBJQU0gcHJpbmNpcGFsLlxuICAgKlxuICAgKiBJZiBlbmNyeXB0aW9uIGlzIHVzZWQsIHBlcm1pc3Npb24gdG8gdXNlIHRoZSBrZXkgdG8gZW5jcnlwdCB0aGUgY29udGVudHNcbiAgICogb2Ygd3JpdHRlbiBmaWxlcyB3aWxsIGFsc28gYmUgZ3JhbnRlZCB0byB0aGUgc2FtZSBwcmluY2lwYWwuXG4gICAqIEBwYXJhbSBpZGVudGl0eSBUaGUgcHJpbmNpcGFsXG4gICAqIEBwYXJhbSBvYmplY3RzS2V5UGF0dGVybiBSZXN0cmljdCB0aGUgcGVybWlzc2lvbiB0byBhIGNlcnRhaW4ga2V5IHBhdHRlcm4gKGRlZmF1bHQgJyonKVxuICAgKi9cbiAgcHVibGljIGdyYW50UHV0KGlkZW50aXR5OiBpYW0uSUdyYW50YWJsZSwgb2JqZWN0c0tleVBhdHRlcm46IGFueSA9ICcqJykge1xuICAgIHJldHVybiB0aGlzLmdyYW50KGlkZW50aXR5LCB0aGlzLnB1dEFjdGlvbnMsIHBlcm1zLktFWV9XUklURV9BQ1RJT05TLFxuICAgICAgdGhpcy5hcm5Gb3JPYmplY3RzKG9iamVjdHNLZXlQYXR0ZXJuKSk7XG4gIH1cblxuICBwdWJsaWMgZ3JhbnRQdXRBY2woaWRlbnRpdHk6IGlhbS5JR3JhbnRhYmxlLCBvYmplY3RzS2V5UGF0dGVybjogc3RyaW5nID0gJyonKSB7XG4gICAgcmV0dXJuIHRoaXMuZ3JhbnQoaWRlbnRpdHksIHBlcm1zLkJVQ0tFVF9QVVRfQUNMX0FDVElPTlMsIFtdLFxuICAgICAgdGhpcy5hcm5Gb3JPYmplY3RzKG9iamVjdHNLZXlQYXR0ZXJuKSk7XG4gIH1cblxuICAvKipcbiAgICogR3JhbnRzIHMzOkRlbGV0ZU9iamVjdCogcGVybWlzc2lvbiB0byBhbiBJQU0gcHJpbmNpcGFsIGZvciBvYmplY3RzXG4gICAqIGluIHRoaXMgYnVja2V0LlxuICAgKlxuICAgKiBAcGFyYW0gaWRlbnRpdHkgVGhlIHByaW5jaXBhbFxuICAgKiBAcGFyYW0gb2JqZWN0c0tleVBhdHRlcm4gUmVzdHJpY3QgdGhlIHBlcm1pc3Npb24gdG8gYSBjZXJ0YWluIGtleSBwYXR0ZXJuIChkZWZhdWx0ICcqJylcbiAgICovXG4gIHB1YmxpYyBncmFudERlbGV0ZShpZGVudGl0eTogaWFtLklHcmFudGFibGUsIG9iamVjdHNLZXlQYXR0ZXJuOiBhbnkgPSAnKicpIHtcbiAgICByZXR1cm4gdGhpcy5ncmFudChpZGVudGl0eSwgcGVybXMuQlVDS0VUX0RFTEVURV9BQ1RJT05TLCBbXSxcbiAgICAgIHRoaXMuYXJuRm9yT2JqZWN0cyhvYmplY3RzS2V5UGF0dGVybikpO1xuICB9XG5cbiAgcHVibGljIGdyYW50UmVhZFdyaXRlKGlkZW50aXR5OiBpYW0uSUdyYW50YWJsZSwgb2JqZWN0c0tleVBhdHRlcm46IGFueSA9ICcqJykge1xuICAgIGNvbnN0IGJ1Y2tldEFjdGlvbnMgPSBwZXJtcy5CVUNLRVRfUkVBRF9BQ1RJT05TLmNvbmNhdCh0aGlzLndyaXRlQWN0aW9ucyk7XG4gICAgLy8gd2UgbmVlZCB1bmlxdWUgcGVybWlzc2lvbnMgYmVjYXVzZSBzb21lIHBlcm1pc3Npb25zIGFyZSBjb21tb24gYmV0d2VlbiByZWFkIGFuZCB3cml0ZSBrZXkgYWN0aW9uc1xuICAgIGNvbnN0IGtleUFjdGlvbnMgPSBbLi4ubmV3IFNldChbLi4ucGVybXMuS0VZX1JFQURfQUNUSU9OUywgLi4ucGVybXMuS0VZX1dSSVRFX0FDVElPTlNdKV07XG5cbiAgICByZXR1cm4gdGhpcy5ncmFudChpZGVudGl0eSxcbiAgICAgIGJ1Y2tldEFjdGlvbnMsXG4gICAgICBrZXlBY3Rpb25zLFxuICAgICAgdGhpcy5idWNrZXRBcm4sXG4gICAgICB0aGlzLmFybkZvck9iamVjdHMob2JqZWN0c0tleVBhdHRlcm4pKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBbGxvd3MgdW5yZXN0cmljdGVkIGFjY2VzcyB0byBvYmplY3RzIGZyb20gdGhpcyBidWNrZXQuXG4gICAqXG4gICAqIElNUE9SVEFOVDogVGhpcyBwZXJtaXNzaW9uIGFsbG93cyBhbnlvbmUgdG8gcGVyZm9ybSBhY3Rpb25zIG9uIFMzIG9iamVjdHNcbiAgICogaW4gdGhpcyBidWNrZXQsIHdoaWNoIGlzIHVzZWZ1bCBmb3Igd2hlbiB5b3UgY29uZmlndXJlIHlvdXIgYnVja2V0IGFzIGFcbiAgICogd2Vic2l0ZSBhbmQgd2FudCBldmVyeW9uZSB0byBiZSBhYmxlIHRvIHJlYWQgb2JqZWN0cyBpbiB0aGUgYnVja2V0IHdpdGhvdXRcbiAgICogbmVlZGluZyB0byBhdXRoZW50aWNhdGUuXG4gICAqXG4gICAqIFdpdGhvdXQgYXJndW1lbnRzLCB0aGlzIG1ldGhvZCB3aWxsIGdyYW50IHJlYWQgKFwiczM6R2V0T2JqZWN0XCIpIGFjY2VzcyB0b1xuICAgKiBhbGwgb2JqZWN0cyAoXCIqXCIpIGluIHRoZSBidWNrZXQuXG4gICAqXG4gICAqIFRoZSBtZXRob2QgcmV0dXJucyB0aGUgYGlhbS5HcmFudGAgb2JqZWN0LCB3aGljaCBjYW4gdGhlbiBiZSBtb2RpZmllZFxuICAgKiBhcyBuZWVkZWQuIEZvciBleGFtcGxlLCB5b3UgY2FuIGFkZCBhIGNvbmRpdGlvbiB0aGF0IHdpbGwgcmVzdHJpY3QgYWNjZXNzIG9ubHlcbiAgICogdG8gYW4gSVB2NCByYW5nZSBsaWtlIHRoaXM6XG4gICAqXG4gICAqICAgICBjb25zdCBncmFudCA9IGJ1Y2tldC5ncmFudFB1YmxpY0FjY2VzcygpO1xuICAgKiAgICAgZ3JhbnQucmVzb3VyY2VTdGF0ZW1lbnQhLmFkZENvbmRpdGlvbijigJhJcEFkZHJlc3PigJksIHsg4oCcYXdzOlNvdXJjZUlw4oCdOiDigJw1NC4yNDAuMTQzLjAvMjTigJ0gfSk7XG4gICAqXG4gICAqIE5vdGUgdGhhdCBpZiB0aGlzIGBJQnVja2V0YCByZWZlcnMgdG8gYW4gZXhpc3RpbmcgYnVja2V0LCBwb3NzaWJseSBub3RcbiAgICogbWFuYWdlZCBieSBDbG91ZEZvcm1hdGlvbiwgdGhpcyBtZXRob2Qgd2lsbCBoYXZlIG5vIGVmZmVjdCwgc2luY2UgaXQnc1xuICAgKiBpbXBvc3NpYmxlIHRvIG1vZGlmeSB0aGUgcG9saWN5IG9mIGFuIGV4aXN0aW5nIGJ1Y2tldC5cbiAgICpcbiAgICogQHBhcmFtIGtleVByZWZpeCB0aGUgcHJlZml4IG9mIFMzIG9iamVjdCBrZXlzIChlLmcuIGBob21lLypgKS4gRGVmYXVsdCBpcyBcIipcIi5cbiAgICogQHBhcmFtIGFsbG93ZWRBY3Rpb25zIHRoZSBzZXQgb2YgUzMgYWN0aW9ucyB0byBhbGxvdy4gRGVmYXVsdCBpcyBcInMzOkdldE9iamVjdFwiLlxuICAgKi9cbiAgcHVibGljIGdyYW50UHVibGljQWNjZXNzKGtleVByZWZpeCA9ICcqJywgLi4uYWxsb3dlZEFjdGlvbnM6IHN0cmluZ1tdKSB7XG4gICAgaWYgKHRoaXMuZGlzYWxsb3dQdWJsaWNBY2Nlc3MpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkNhbm5vdCBncmFudCBwdWJsaWMgYWNjZXNzIHdoZW4gJ2Jsb2NrUHVibGljUG9saWN5JyBpcyBlbmFibGVkXCIpO1xuICAgIH1cblxuICAgIGFsbG93ZWRBY3Rpb25zID0gYWxsb3dlZEFjdGlvbnMubGVuZ3RoID4gMCA/IGFsbG93ZWRBY3Rpb25zIDogWydzMzpHZXRPYmplY3QnXTtcblxuICAgIHJldHVybiBpYW0uR3JhbnQuYWRkVG9QcmluY2lwYWxPclJlc291cmNlKHtcbiAgICAgIGFjdGlvbnM6IGFsbG93ZWRBY3Rpb25zLFxuICAgICAgcmVzb3VyY2VBcm5zOiBbdGhpcy5hcm5Gb3JPYmplY3RzKGtleVByZWZpeCldLFxuICAgICAgZ3JhbnRlZTogbmV3IGlhbS5BbnlQcmluY2lwYWwoKSxcbiAgICAgIHJlc291cmNlOiB0aGlzLFxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYSBidWNrZXQgbm90aWZpY2F0aW9uIGV2ZW50IGRlc3RpbmF0aW9uLlxuICAgKiBAcGFyYW0gZXZlbnQgVGhlIGV2ZW50IHRvIHRyaWdnZXIgdGhlIG5vdGlmaWNhdGlvblxuICAgKiBAcGFyYW0gZGVzdCBUaGUgbm90aWZpY2F0aW9uIGRlc3RpbmF0aW9uIChMYW1iZGEsIFNOUyBUb3BpYyBvciBTUVMgUXVldWUpXG4gICAqXG4gICAqIEBwYXJhbSBmaWx0ZXJzIFMzIG9iamVjdCBrZXkgZmlsdGVyIHJ1bGVzIHRvIGRldGVybWluZSB3aGljaCBvYmplY3RzXG4gICAqIHRyaWdnZXIgdGhpcyBldmVudC4gRWFjaCBmaWx0ZXIgbXVzdCBpbmNsdWRlIGEgYHByZWZpeGAgYW5kL29yIGBzdWZmaXhgXG4gICAqIHRoYXQgd2lsbCBiZSBtYXRjaGVkIGFnYWluc3QgdGhlIHMzIG9iamVjdCBrZXkuIFJlZmVyIHRvIHRoZSBTMyBEZXZlbG9wZXIgR3VpZGVcbiAgICogZm9yIGRldGFpbHMgYWJvdXQgYWxsb3dlZCBmaWx0ZXIgcnVsZXMuXG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FtYXpvblMzL2xhdGVzdC9kZXYvTm90aWZpY2F0aW9uSG93VG8uaHRtbCNub3RpZmljYXRpb24taG93LXRvLWZpbHRlcmluZ1xuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiAgICBkZWNsYXJlIGNvbnN0IG15TGFtYmRhOiBsYW1iZGEuRnVuY3Rpb247XG4gICAqICAgIGNvbnN0IGJ1Y2tldCA9IG5ldyBzMy5CdWNrZXQodGhpcywgJ015QnVja2V0Jyk7XG4gICAqICAgIGJ1Y2tldC5hZGRFdmVudE5vdGlmaWNhdGlvbihzMy5FdmVudFR5cGUuT0JKRUNUX0NSRUFURUQsIG5ldyBzM24uTGFtYmRhRGVzdGluYXRpb24obXlMYW1iZGEpLCB7cHJlZml4OiAnaG9tZS9teXVzZXJuYW1lLyonfSk7XG4gICAqXG4gICAqIEBzZWVcbiAgICogaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FtYXpvblMzL2xhdGVzdC9kZXYvTm90aWZpY2F0aW9uSG93VG8uaHRtbFxuICAgKi9cbiAgcHVibGljIGFkZEV2ZW50Tm90aWZpY2F0aW9uKGV2ZW50OiBFdmVudFR5cGUsIGRlc3Q6IElCdWNrZXROb3RpZmljYXRpb25EZXN0aW5hdGlvbiwgLi4uZmlsdGVyczogTm90aWZpY2F0aW9uS2V5RmlsdGVyW10pIHtcbiAgICB0aGlzLndpdGhOb3RpZmljYXRpb25zKG5vdGlmaWNhdGlvbnMgPT4gbm90aWZpY2F0aW9ucy5hZGROb3RpZmljYXRpb24oZXZlbnQsIGRlc3QsIC4uLmZpbHRlcnMpKTtcbiAgfVxuXG4gIHByaXZhdGUgd2l0aE5vdGlmaWNhdGlvbnMoY2I6IChub3RpZmljYXRpb25zOiBCdWNrZXROb3RpZmljYXRpb25zKSA9PiB2b2lkKSB7XG4gICAgaWYgKCF0aGlzLm5vdGlmaWNhdGlvbnMpIHtcbiAgICAgIHRoaXMubm90aWZpY2F0aW9ucyA9IG5ldyBCdWNrZXROb3RpZmljYXRpb25zKHRoaXMsICdOb3RpZmljYXRpb25zJywge1xuICAgICAgICBidWNrZXQ6IHRoaXMsXG4gICAgICAgIGhhbmRsZXJSb2xlOiB0aGlzLm5vdGlmaWNhdGlvbnNIYW5kbGVyUm9sZSxcbiAgICAgIH0pO1xuICAgIH1cbiAgICBjYih0aGlzLm5vdGlmaWNhdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFN1YnNjcmliZXMgYSBkZXN0aW5hdGlvbiB0byByZWNlaXZlIG5vdGlmaWNhdGlvbnMgd2hlbiBhbiBvYmplY3QgaXNcbiAgICogY3JlYXRlZCBpbiB0aGUgYnVja2V0LiBUaGlzIGlzIGlkZW50aWNhbCB0byBjYWxsaW5nXG4gICAqIGBvbkV2ZW50KEV2ZW50VHlwZS5PQkpFQ1RfQ1JFQVRFRClgLlxuICAgKlxuICAgKiBAcGFyYW0gZGVzdCBUaGUgbm90aWZpY2F0aW9uIGRlc3RpbmF0aW9uIChzZWUgb25FdmVudClcbiAgICogQHBhcmFtIGZpbHRlcnMgRmlsdGVycyAoc2VlIG9uRXZlbnQpXG4gICAqL1xuICBwdWJsaWMgYWRkT2JqZWN0Q3JlYXRlZE5vdGlmaWNhdGlvbihkZXN0OiBJQnVja2V0Tm90aWZpY2F0aW9uRGVzdGluYXRpb24sIC4uLmZpbHRlcnM6IE5vdGlmaWNhdGlvbktleUZpbHRlcltdKSB7XG4gICAgcmV0dXJuIHRoaXMuYWRkRXZlbnROb3RpZmljYXRpb24oRXZlbnRUeXBlLk9CSkVDVF9DUkVBVEVELCBkZXN0LCAuLi5maWx0ZXJzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdWJzY3JpYmVzIGEgZGVzdGluYXRpb24gdG8gcmVjZWl2ZSBub3RpZmljYXRpb25zIHdoZW4gYW4gb2JqZWN0IGlzXG4gICAqIHJlbW92ZWQgZnJvbSB0aGUgYnVja2V0LiBUaGlzIGlzIGlkZW50aWNhbCB0byBjYWxsaW5nXG4gICAqIGBvbkV2ZW50KEV2ZW50VHlwZS5PQkpFQ1RfUkVNT1ZFRClgLlxuICAgKlxuICAgKiBAcGFyYW0gZGVzdCBUaGUgbm90aWZpY2F0aW9uIGRlc3RpbmF0aW9uIChzZWUgb25FdmVudClcbiAgICogQHBhcmFtIGZpbHRlcnMgRmlsdGVycyAoc2VlIG9uRXZlbnQpXG4gICAqL1xuICBwdWJsaWMgYWRkT2JqZWN0UmVtb3ZlZE5vdGlmaWNhdGlvbihkZXN0OiBJQnVja2V0Tm90aWZpY2F0aW9uRGVzdGluYXRpb24sIC4uLmZpbHRlcnM6IE5vdGlmaWNhdGlvbktleUZpbHRlcltdKSB7XG4gICAgcmV0dXJuIHRoaXMuYWRkRXZlbnROb3RpZmljYXRpb24oRXZlbnRUeXBlLk9CSkVDVF9SRU1PVkVELCBkZXN0LCAuLi5maWx0ZXJzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFbmFibGVzIGV2ZW50IGJyaWRnZSBub3RpZmljYXRpb24sIGNhdXNpbmcgYWxsIGV2ZW50cyBiZWxvdyB0byBiZSBzZW50IHRvIEV2ZW50QnJpZGdlOlxuICAgKlxuICAgKiAtIE9iamVjdCBEZWxldGVkIChEZWxldGVPYmplY3QpXG4gICAqIC0gT2JqZWN0IERlbGV0ZWQgKExpZmVjeWNsZSBleHBpcmF0aW9uKVxuICAgKiAtIE9iamVjdCBSZXN0b3JlIEluaXRpYXRlZFxuICAgKiAtIE9iamVjdCBSZXN0b3JlIENvbXBsZXRlZFxuICAgKiAtIE9iamVjdCBSZXN0b3JlIEV4cGlyZWRcbiAgICogLSBPYmplY3QgU3RvcmFnZSBDbGFzcyBDaGFuZ2VkXG4gICAqIC0gT2JqZWN0IEFjY2VzcyBUaWVyIENoYW5nZWRcbiAgICogLSBPYmplY3QgQUNMIFVwZGF0ZWRcbiAgICogLSBPYmplY3QgVGFncyBBZGRlZFxuICAgKiAtIE9iamVjdCBUYWdzIERlbGV0ZWRcbiAgICovXG4gIHB1YmxpYyBlbmFibGVFdmVudEJyaWRnZU5vdGlmaWNhdGlvbigpIHtcbiAgICB0aGlzLndpdGhOb3RpZmljYXRpb25zKG5vdGlmaWNhdGlvbnMgPT4gbm90aWZpY2F0aW9ucy5lbmFibGVFdmVudEJyaWRnZU5vdGlmaWNhdGlvbigpKTtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0IHdyaXRlQWN0aW9ucygpOiBzdHJpbmdbXSB7XG4gICAgcmV0dXJuIFtcbiAgICAgIC4uLnBlcm1zLkJVQ0tFVF9ERUxFVEVfQUNUSU9OUyxcbiAgICAgIC4uLnRoaXMucHV0QWN0aW9ucyxcbiAgICBdO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXQgcHV0QWN0aW9ucygpOiBzdHJpbmdbXSB7XG4gICAgcmV0dXJuIEZlYXR1cmVGbGFncy5vZih0aGlzKS5pc0VuYWJsZWQoY3hhcGkuUzNfR1JBTlRfV1JJVEVfV0lUSE9VVF9BQ0wpXG4gICAgICA/IHBlcm1zLkJVQ0tFVF9QVVRfQUNUSU9OU1xuICAgICAgOiBwZXJtcy5MRUdBQ1lfQlVDS0VUX1BVVF9BQ1RJT05TO1xuICB9XG5cbiAgcHJpdmF0ZSB1cmxKb2luKC4uLmNvbXBvbmVudHM6IHN0cmluZ1tdKTogc3RyaW5nIHtcbiAgICByZXR1cm4gY29tcG9uZW50cy5yZWR1Y2UoKHJlc3VsdCwgY29tcG9uZW50KSA9PiB7XG4gICAgICBpZiAocmVzdWx0LmVuZHNXaXRoKCcvJykpIHtcbiAgICAgICAgcmVzdWx0ID0gcmVzdWx0LnNsaWNlKDAsIC0xKTtcbiAgICAgIH1cbiAgICAgIGlmIChjb21wb25lbnQuc3RhcnRzV2l0aCgnLycpKSB7XG4gICAgICAgIGNvbXBvbmVudCA9IGNvbXBvbmVudC5zbGljZSgxKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBgJHtyZXN1bHR9LyR7Y29tcG9uZW50fWA7XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIGdyYW50KFxuICAgIGdyYW50ZWU6IGlhbS5JR3JhbnRhYmxlLFxuICAgIGJ1Y2tldEFjdGlvbnM6IHN0cmluZ1tdLFxuICAgIGtleUFjdGlvbnM6IHN0cmluZ1tdLFxuICAgIHJlc291cmNlQXJuOiBzdHJpbmcsIC4uLm90aGVyUmVzb3VyY2VBcm5zOiBzdHJpbmdbXSkge1xuICAgIGNvbnN0IHJlc291cmNlcyA9IFtyZXNvdXJjZUFybiwgLi4ub3RoZXJSZXNvdXJjZUFybnNdO1xuXG4gICAgY29uc3QgcmV0ID0gaWFtLkdyYW50LmFkZFRvUHJpbmNpcGFsT3JSZXNvdXJjZSh7XG4gICAgICBncmFudGVlLFxuICAgICAgYWN0aW9uczogYnVja2V0QWN0aW9ucyxcbiAgICAgIHJlc291cmNlQXJuczogcmVzb3VyY2VzLFxuICAgICAgcmVzb3VyY2U6IHRoaXMsXG4gICAgfSk7XG5cbiAgICBpZiAodGhpcy5lbmNyeXB0aW9uS2V5ICYmIGtleUFjdGlvbnMgJiYga2V5QWN0aW9ucy5sZW5ndGggIT09IDApIHtcbiAgICAgIHRoaXMuZW5jcnlwdGlvbktleS5ncmFudChncmFudGVlLCAuLi5rZXlBY3Rpb25zKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmV0O1xuICB9XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQmxvY2tQdWJsaWNBY2Nlc3NPcHRpb25zIHtcbiAgLyoqXG4gICAqIFdoZXRoZXIgdG8gYmxvY2sgcHVibGljIEFDTHNcbiAgICpcbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQW1hem9uUzMvbGF0ZXN0L2Rldi9hY2Nlc3MtY29udHJvbC1ibG9jay1wdWJsaWMtYWNjZXNzLmh0bWwjYWNjZXNzLWNvbnRyb2wtYmxvY2stcHVibGljLWFjY2Vzcy1vcHRpb25zXG4gICAqL1xuICByZWFkb25seSBibG9ja1B1YmxpY0FjbHM/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRvIGJsb2NrIHB1YmxpYyBwb2xpY3lcbiAgICpcbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQW1hem9uUzMvbGF0ZXN0L2Rldi9hY2Nlc3MtY29udHJvbC1ibG9jay1wdWJsaWMtYWNjZXNzLmh0bWwjYWNjZXNzLWNvbnRyb2wtYmxvY2stcHVibGljLWFjY2Vzcy1vcHRpb25zXG4gICAqL1xuICByZWFkb25seSBibG9ja1B1YmxpY1BvbGljeT86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdG8gaWdub3JlIHB1YmxpYyBBQ0xzXG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FtYXpvblMzL2xhdGVzdC9kZXYvYWNjZXNzLWNvbnRyb2wtYmxvY2stcHVibGljLWFjY2Vzcy5odG1sI2FjY2Vzcy1jb250cm9sLWJsb2NrLXB1YmxpYy1hY2Nlc3Mtb3B0aW9uc1xuICAgKi9cbiAgcmVhZG9ubHkgaWdub3JlUHVibGljQWNscz86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdG8gcmVzdHJpY3QgcHVibGljIGFjY2Vzc1xuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BbWF6b25TMy9sYXRlc3QvZGV2L2FjY2Vzcy1jb250cm9sLWJsb2NrLXB1YmxpYy1hY2Nlc3MuaHRtbCNhY2Nlc3MtY29udHJvbC1ibG9jay1wdWJsaWMtYWNjZXNzLW9wdGlvbnNcbiAgICovXG4gIHJlYWRvbmx5IHJlc3RyaWN0UHVibGljQnVja2V0cz86IGJvb2xlYW47XG59XG5cbmV4cG9ydCBjbGFzcyBCbG9ja1B1YmxpY0FjY2VzcyB7XG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgQkxPQ0tfQUxMID0gbmV3IEJsb2NrUHVibGljQWNjZXNzKHtcbiAgICBibG9ja1B1YmxpY0FjbHM6IHRydWUsXG4gICAgYmxvY2tQdWJsaWNQb2xpY3k6IHRydWUsXG4gICAgaWdub3JlUHVibGljQWNsczogdHJ1ZSxcbiAgICByZXN0cmljdFB1YmxpY0J1Y2tldHM6IHRydWUsXG4gIH0pO1xuXG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgQkxPQ0tfQUNMUyA9IG5ldyBCbG9ja1B1YmxpY0FjY2Vzcyh7XG4gICAgYmxvY2tQdWJsaWNBY2xzOiB0cnVlLFxuICAgIGlnbm9yZVB1YmxpY0FjbHM6IHRydWUsXG4gIH0pO1xuXG4gIHB1YmxpYyBibG9ja1B1YmxpY0FjbHM6IGJvb2xlYW4gfCB1bmRlZmluZWQ7XG4gIHB1YmxpYyBibG9ja1B1YmxpY1BvbGljeTogYm9vbGVhbiB8IHVuZGVmaW5lZDtcbiAgcHVibGljIGlnbm9yZVB1YmxpY0FjbHM6IGJvb2xlYW4gfCB1bmRlZmluZWQ7XG4gIHB1YmxpYyByZXN0cmljdFB1YmxpY0J1Y2tldHM6IGJvb2xlYW4gfCB1bmRlZmluZWQ7XG5cbiAgY29uc3RydWN0b3Iob3B0aW9uczogQmxvY2tQdWJsaWNBY2Nlc3NPcHRpb25zKSB7XG4gICAgdGhpcy5ibG9ja1B1YmxpY0FjbHMgPSBvcHRpb25zLmJsb2NrUHVibGljQWNscztcbiAgICB0aGlzLmJsb2NrUHVibGljUG9saWN5ID0gb3B0aW9ucy5ibG9ja1B1YmxpY1BvbGljeTtcbiAgICB0aGlzLmlnbm9yZVB1YmxpY0FjbHMgPSBvcHRpb25zLmlnbm9yZVB1YmxpY0FjbHM7XG4gICAgdGhpcy5yZXN0cmljdFB1YmxpY0J1Y2tldHMgPSBvcHRpb25zLnJlc3RyaWN0UHVibGljQnVja2V0cztcbiAgfVxufVxuXG4vKipcbiAqIFNwZWNpZmllcyBhIG1ldHJpY3MgY29uZmlndXJhdGlvbiBmb3IgdGhlIENsb3VkV2F0Y2ggcmVxdWVzdCBtZXRyaWNzIGZyb20gYW4gQW1hem9uIFMzIGJ1Y2tldC5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBCdWNrZXRNZXRyaWNzIHtcbiAgLyoqXG4gICAqIFRoZSBJRCB1c2VkIHRvIGlkZW50aWZ5IHRoZSBtZXRyaWNzIGNvbmZpZ3VyYXRpb24uXG4gICAqL1xuICByZWFkb25seSBpZDogc3RyaW5nO1xuICAvKipcbiAgICogVGhlIHByZWZpeCB0aGF0IGFuIG9iamVjdCBtdXN0IGhhdmUgdG8gYmUgaW5jbHVkZWQgaW4gdGhlIG1ldHJpY3MgcmVzdWx0cy5cbiAgICovXG4gIHJlYWRvbmx5IHByZWZpeD86IHN0cmluZztcbiAgLyoqXG4gICAqIFNwZWNpZmllcyBhIGxpc3Qgb2YgdGFnIGZpbHRlcnMgdG8gdXNlIGFzIGEgbWV0cmljcyBjb25maWd1cmF0aW9uIGZpbHRlci5cbiAgICogVGhlIG1ldHJpY3MgY29uZmlndXJhdGlvbiBpbmNsdWRlcyBvbmx5IG9iamVjdHMgdGhhdCBtZWV0IHRoZSBmaWx0ZXIncyBjcml0ZXJpYS5cbiAgICovXG4gIHJlYWRvbmx5IHRhZ0ZpbHRlcnM/OiB7IFt0YWc6IHN0cmluZ106IGFueSB9O1xufVxuXG4vKipcbiAqIEFsbCBodHRwIHJlcXVlc3QgbWV0aG9kc1xuICovXG5leHBvcnQgZW51bSBIdHRwTWV0aG9kcyB7XG4gIC8qKlxuICAgKiBUaGUgR0VUIG1ldGhvZCByZXF1ZXN0cyBhIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBzcGVjaWZpZWQgcmVzb3VyY2UuXG4gICAqL1xuICBHRVQgPSAnR0VUJyxcbiAgLyoqXG4gICAqIFRoZSBQVVQgbWV0aG9kIHJlcGxhY2VzIGFsbCBjdXJyZW50IHJlcHJlc2VudGF0aW9ucyBvZiB0aGUgdGFyZ2V0IHJlc291cmNlIHdpdGggdGhlIHJlcXVlc3QgcGF5bG9hZC5cbiAgICovXG4gIFBVVCA9ICdQVVQnLFxuICAvKipcbiAgICogVGhlIEhFQUQgbWV0aG9kIGFza3MgZm9yIGEgcmVzcG9uc2UgaWRlbnRpY2FsIHRvIHRoYXQgb2YgYSBHRVQgcmVxdWVzdCwgYnV0IHdpdGhvdXQgdGhlIHJlc3BvbnNlIGJvZHkuXG4gICAqL1xuICBIRUFEID0gJ0hFQUQnLFxuICAvKipcbiAgICogVGhlIFBPU1QgbWV0aG9kIGlzIHVzZWQgdG8gc3VibWl0IGFuIGVudGl0eSB0byB0aGUgc3BlY2lmaWVkIHJlc291cmNlLCBvZnRlbiBjYXVzaW5nIGEgY2hhbmdlIGluIHN0YXRlIG9yIHNpZGUgZWZmZWN0cyBvbiB0aGUgc2VydmVyLlxuICAgKi9cbiAgUE9TVCA9ICdQT1NUJyxcbiAgLyoqXG4gICAqIFRoZSBERUxFVEUgbWV0aG9kIGRlbGV0ZXMgdGhlIHNwZWNpZmllZCByZXNvdXJjZS5cbiAgICovXG4gIERFTEVURSA9ICdERUxFVEUnLFxufVxuXG4vKipcbiAqIFNwZWNpZmllcyBhIGNyb3NzLW9yaWdpbiBhY2Nlc3MgcnVsZSBmb3IgYW4gQW1hem9uIFMzIGJ1Y2tldC5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBDb3JzUnVsZSB7XG4gIC8qKlxuICAgKiBBIHVuaXF1ZSBpZGVudGlmaWVyIGZvciB0aGlzIHJ1bGUuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm8gaWQgc3BlY2lmaWVkLlxuICAgKi9cbiAgcmVhZG9ubHkgaWQ/OiBzdHJpbmc7XG4gIC8qKlxuICAgKiBUaGUgdGltZSBpbiBzZWNvbmRzIHRoYXQgeW91ciBicm93c2VyIGlzIHRvIGNhY2hlIHRoZSBwcmVmbGlnaHQgcmVzcG9uc2UgZm9yIHRoZSBzcGVjaWZpZWQgcmVzb3VyY2UuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm8gY2FjaGluZy5cbiAgICovXG4gIHJlYWRvbmx5IG1heEFnZT86IG51bWJlcjtcbiAgLyoqXG4gICAqIEhlYWRlcnMgdGhhdCBhcmUgc3BlY2lmaWVkIGluIHRoZSBBY2Nlc3MtQ29udHJvbC1SZXF1ZXN0LUhlYWRlcnMgaGVhZGVyLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vIGhlYWRlcnMgYWxsb3dlZC5cbiAgICovXG4gIHJlYWRvbmx5IGFsbG93ZWRIZWFkZXJzPzogc3RyaW5nW107XG4gIC8qKlxuICAgKiBBbiBIVFRQIG1ldGhvZCB0aGF0IHlvdSBhbGxvdyB0aGUgb3JpZ2luIHRvIGV4ZWN1dGUuXG4gICAqL1xuICByZWFkb25seSBhbGxvd2VkTWV0aG9kczogSHR0cE1ldGhvZHNbXTtcbiAgLyoqXG4gICAqIE9uZSBvciBtb3JlIG9yaWdpbnMgeW91IHdhbnQgY3VzdG9tZXJzIHRvIGJlIGFibGUgdG8gYWNjZXNzIHRoZSBidWNrZXQgZnJvbS5cbiAgICovXG4gIHJlYWRvbmx5IGFsbG93ZWRPcmlnaW5zOiBzdHJpbmdbXTtcbiAgLyoqXG4gICAqIE9uZSBvciBtb3JlIGhlYWRlcnMgaW4gdGhlIHJlc3BvbnNlIHRoYXQgeW91IHdhbnQgY3VzdG9tZXJzIHRvIGJlIGFibGUgdG8gYWNjZXNzIGZyb20gdGhlaXIgYXBwbGljYXRpb25zLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vIGhlYWRlcnMgZXhwb3NlZC5cbiAgICovXG4gIHJlYWRvbmx5IGV4cG9zZWRIZWFkZXJzPzogc3RyaW5nW107XG59XG5cbi8qKlxuICogQWxsIGh0dHAgcmVxdWVzdCBtZXRob2RzXG4gKi9cbmV4cG9ydCBlbnVtIFJlZGlyZWN0UHJvdG9jb2wge1xuICBIVFRQID0gJ2h0dHAnLFxuICBIVFRQUyA9ICdodHRwcycsXG59XG5cbi8qKlxuICogU3BlY2lmaWVzIGEgcmVkaXJlY3QgYmVoYXZpb3Igb2YgYWxsIHJlcXVlc3RzIHRvIGEgd2Vic2l0ZSBlbmRwb2ludCBvZiBhIGJ1Y2tldC5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBSZWRpcmVjdFRhcmdldCB7XG4gIC8qKlxuICAgKiBOYW1lIG9mIHRoZSBob3N0IHdoZXJlIHJlcXVlc3RzIGFyZSByZWRpcmVjdGVkXG4gICAqL1xuICByZWFkb25seSBob3N0TmFtZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBQcm90b2NvbCB0byB1c2Ugd2hlbiByZWRpcmVjdGluZyByZXF1ZXN0c1xuICAgKlxuICAgKiBAZGVmYXVsdCAtIFRoZSBwcm90b2NvbCB1c2VkIGluIHRoZSBvcmlnaW5hbCByZXF1ZXN0LlxuICAgKi9cbiAgcmVhZG9ubHkgcHJvdG9jb2w/OiBSZWRpcmVjdFByb3RvY29sO1xufVxuXG4vKipcbiAqIEFsbCBzdXBwb3J0ZWQgaW52ZW50b3J5IGxpc3QgZm9ybWF0cy5cbiAqL1xuZXhwb3J0IGVudW0gSW52ZW50b3J5Rm9ybWF0IHtcbiAgLyoqXG4gICAqIEdlbmVyYXRlIHRoZSBpbnZlbnRvcnkgbGlzdCBhcyBDU1YuXG4gICAqL1xuICBDU1YgPSAnQ1NWJyxcbiAgLyoqXG4gICAqIEdlbmVyYXRlIHRoZSBpbnZlbnRvcnkgbGlzdCBhcyBQYXJxdWV0LlxuICAgKi9cbiAgUEFSUVVFVCA9ICdQYXJxdWV0JyxcbiAgLyoqXG4gICAqIEdlbmVyYXRlIHRoZSBpbnZlbnRvcnkgbGlzdCBhcyBPUkMuXG4gICAqL1xuICBPUkMgPSAnT1JDJyxcbn1cblxuLyoqXG4gKiBBbGwgc3VwcG9ydGVkIGludmVudG9yeSBmcmVxdWVuY2llcy5cbiAqL1xuZXhwb3J0IGVudW0gSW52ZW50b3J5RnJlcXVlbmN5IHtcbiAgLyoqXG4gICAqIEEgcmVwb3J0IGlzIGdlbmVyYXRlZCBldmVyeSBkYXkuXG4gICAqL1xuICBEQUlMWSA9ICdEYWlseScsXG4gIC8qKlxuICAgKiBBIHJlcG9ydCBpcyBnZW5lcmF0ZWQgZXZlcnkgU3VuZGF5IChVVEMgdGltZXpvbmUpIGFmdGVyIHRoZSBpbml0aWFsIHJlcG9ydC5cbiAgICovXG4gIFdFRUtMWSA9ICdXZWVrbHknXG59XG5cbi8qKlxuICogSW52ZW50b3J5IHZlcnNpb24gc3VwcG9ydC5cbiAqL1xuZXhwb3J0IGVudW0gSW52ZW50b3J5T2JqZWN0VmVyc2lvbiB7XG4gIC8qKlxuICAgKiBJbmNsdWRlcyBhbGwgdmVyc2lvbnMgb2YgZWFjaCBvYmplY3QgaW4gdGhlIHJlcG9ydC5cbiAgICovXG4gIEFMTCA9ICdBbGwnLFxuICAvKipcbiAgICogSW5jbHVkZXMgb25seSB0aGUgY3VycmVudCB2ZXJzaW9uIG9mIGVhY2ggb2JqZWN0IGluIHRoZSByZXBvcnQuXG4gICAqL1xuICBDVVJSRU5UID0gJ0N1cnJlbnQnLFxufVxuXG4vKipcbiAqIFRoZSBkZXN0aW5hdGlvbiBvZiB0aGUgaW52ZW50b3J5LlxuICovXG5leHBvcnQgaW50ZXJmYWNlIEludmVudG9yeURlc3RpbmF0aW9uIHtcbiAgLyoqXG4gICAqIEJ1Y2tldCB3aGVyZSBhbGwgaW52ZW50b3JpZXMgd2lsbCBiZSBzYXZlZCBpbi5cbiAgICovXG4gIHJlYWRvbmx5IGJ1Y2tldDogSUJ1Y2tldDtcbiAgLyoqXG4gICAqIFRoZSBwcmVmaXggdG8gYmUgdXNlZCB3aGVuIHNhdmluZyB0aGUgaW52ZW50b3J5LlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vIHByZWZpeC5cbiAgICovXG4gIHJlYWRvbmx5IHByZWZpeD86IHN0cmluZztcbiAgLyoqXG4gICAqIFRoZSBhY2NvdW50IElEIHRoYXQgb3ducyB0aGUgZGVzdGluYXRpb24gUzMgYnVja2V0LlxuICAgKiBJZiBubyBhY2NvdW50IElEIGlzIHByb3ZpZGVkLCB0aGUgb3duZXIgaXMgbm90IHZhbGlkYXRlZCBiZWZvcmUgZXhwb3J0aW5nIGRhdGEuXG4gICAqIEl0J3MgcmVjb21tZW5kZWQgdG8gc2V0IGFuIGFjY291bnQgSUQgdG8gcHJldmVudCBwcm9ibGVtcyBpZiB0aGUgZGVzdGluYXRpb24gYnVja2V0IG93bmVyc2hpcCBjaGFuZ2VzLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vIGFjY291bnQgSUQuXG4gICAqL1xuICByZWFkb25seSBidWNrZXRPd25lcj86IHN0cmluZztcbn1cblxuLyoqXG4gKiBTcGVjaWZpZXMgdGhlIGludmVudG9yeSBjb25maWd1cmF0aW9uIG9mIGFuIFMzIEJ1Y2tldC5cbiAqXG4gKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BbWF6b25TMy9sYXRlc3QvZGV2L3N0b3JhZ2UtaW52ZW50b3J5Lmh0bWxcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBJbnZlbnRvcnkge1xuICAvKipcbiAgICogVGhlIGRlc3RpbmF0aW9uIG9mIHRoZSBpbnZlbnRvcnkuXG4gICAqL1xuICByZWFkb25seSBkZXN0aW5hdGlvbjogSW52ZW50b3J5RGVzdGluYXRpb247XG4gIC8qKlxuICAgKiBUaGUgaW52ZW50b3J5IHdpbGwgb25seSBpbmNsdWRlIG9iamVjdHMgdGhhdCBtZWV0IHRoZSBwcmVmaXggZmlsdGVyIGNyaXRlcmlhLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vIG9iamVjdHMgcHJlZml4XG4gICAqL1xuICByZWFkb25seSBvYmplY3RzUHJlZml4Pzogc3RyaW5nO1xuICAvKipcbiAgICogVGhlIGZvcm1hdCBvZiB0aGUgaW52ZW50b3J5LlxuICAgKlxuICAgKiBAZGVmYXVsdCBJbnZlbnRvcnlGb3JtYXQuQ1NWXG4gICAqL1xuICByZWFkb25seSBmb3JtYXQ/OiBJbnZlbnRvcnlGb3JtYXQ7XG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSBpbnZlbnRvcnkgaXMgZW5hYmxlZCBvciBkaXNhYmxlZC5cbiAgICpcbiAgICogQGRlZmF1bHQgdHJ1ZVxuICAgKi9cbiAgcmVhZG9ubHkgZW5hYmxlZD86IGJvb2xlYW47XG4gIC8qKlxuICAgKiBUaGUgaW52ZW50b3J5IGNvbmZpZ3VyYXRpb24gSUQuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gZ2VuZXJhdGVkIElELlxuICAgKi9cbiAgcmVhZG9ubHkgaW52ZW50b3J5SWQ/OiBzdHJpbmc7XG4gIC8qKlxuICAgKiBGcmVxdWVuY3kgYXQgd2hpY2ggdGhlIGludmVudG9yeSBzaG91bGQgYmUgZ2VuZXJhdGVkLlxuICAgKlxuICAgKiBAZGVmYXVsdCBJbnZlbnRvcnlGcmVxdWVuY3kuV0VFS0xZXG4gICAqL1xuICByZWFkb25seSBmcmVxdWVuY3k/OiBJbnZlbnRvcnlGcmVxdWVuY3k7XG4gIC8qKlxuICAgKiBJZiB0aGUgaW52ZW50b3J5IHNob3VsZCBjb250YWluIGFsbCB0aGUgb2JqZWN0IHZlcnNpb25zIG9yIG9ubHkgdGhlIGN1cnJlbnQgb25lLlxuICAgKlxuICAgKiBAZGVmYXVsdCBJbnZlbnRvcnlPYmplY3RWZXJzaW9uLkFMTFxuICAgKi9cbiAgcmVhZG9ubHkgaW5jbHVkZU9iamVjdFZlcnNpb25zPzogSW52ZW50b3J5T2JqZWN0VmVyc2lvbjtcbiAgLyoqXG4gICAqIEEgbGlzdCBvZiBvcHRpb25hbCBmaWVsZHMgdG8gYmUgaW5jbHVkZWQgaW4gdGhlIGludmVudG9yeSByZXN1bHQuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm8gb3B0aW9uYWwgZmllbGRzLlxuICAgKi9cbiAgcmVhZG9ubHkgb3B0aW9uYWxGaWVsZHM/OiBzdHJpbmdbXTtcbn1cbi8qKlxuICAgKiBUaGUgT2JqZWN0T3duZXJzaGlwIG9mIHRoZSBidWNrZXQuXG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FtYXpvblMzL2xhdGVzdC9kZXYvYWJvdXQtb2JqZWN0LW93bmVyc2hpcC5odG1sXG4gICAqXG4gICAqL1xuZXhwb3J0IGVudW0gT2JqZWN0T3duZXJzaGlwIHtcbiAgLyoqXG4gICAqIEFDTHMgYXJlIGRpc2FibGVkLCBhbmQgdGhlIGJ1Y2tldCBvd25lciBhdXRvbWF0aWNhbGx5IG93bnNcbiAgICogYW5kIGhhcyBmdWxsIGNvbnRyb2wgb3ZlciBldmVyeSBvYmplY3QgaW4gdGhlIGJ1Y2tldC5cbiAgICogQUNMcyBubyBsb25nZXIgYWZmZWN0IHBlcm1pc3Npb25zIHRvIGRhdGEgaW4gdGhlIFMzIGJ1Y2tldC5cbiAgICogVGhlIGJ1Y2tldCB1c2VzIHBvbGljaWVzIHRvIGRlZmluZSBhY2Nlc3MgY29udHJvbC5cbiAgICovXG4gIEJVQ0tFVF9PV05FUl9FTkZPUkNFRCA9ICdCdWNrZXRPd25lckVuZm9yY2VkJyxcbiAgLyoqXG4gICAqIE9iamVjdHMgdXBsb2FkZWQgdG8gdGhlIGJ1Y2tldCBjaGFuZ2Ugb3duZXJzaGlwIHRvIHRoZSBidWNrZXQgb3duZXIgLlxuICAgKi9cbiAgQlVDS0VUX09XTkVSX1BSRUZFUlJFRCA9ICdCdWNrZXRPd25lclByZWZlcnJlZCcsXG4gIC8qKlxuICAgKiBUaGUgdXBsb2FkaW5nIGFjY291bnQgd2lsbCBvd24gdGhlIG9iamVjdC5cbiAgICovXG4gIE9CSkVDVF9XUklURVIgPSAnT2JqZWN0V3JpdGVyJyxcbn1cbi8qKlxuICogVGhlIGludGVsbGlnZW50IHRpZXJpbmcgY29uZmlndXJhdGlvbi5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBJbnRlbGxpZ2VudFRpZXJpbmdDb25maWd1cmF0aW9uIHtcbiAgLyoqXG4gICAqIENvbmZpZ3VyYXRpb24gbmFtZVxuICAgKi9cbiAgcmVhZG9ubHkgbmFtZTogc3RyaW5nO1xuXG5cbiAgLyoqXG4gICAqIEFkZCBhIGZpbHRlciB0byBsaW1pdCB0aGUgc2NvcGUgb2YgdGhpcyBjb25maWd1cmF0aW9uIHRvIGEgc2luZ2xlIHByZWZpeC5cbiAgICpcbiAgICogQGRlZmF1bHQgdGhpcyBjb25maWd1cmF0aW9uIHdpbGwgYXBwbHkgdG8gKiphbGwqKiBvYmplY3RzIGluIHRoZSBidWNrZXQuXG4gICAqL1xuICByZWFkb25seSBwcmVmaXg/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFlvdSBjYW4gbGltaXQgdGhlIHNjb3BlIG9mIHRoaXMgcnVsZSB0byB0aGUga2V5IHZhbHVlIHBhaXJzIGFkZGVkIGJlbG93LlxuICAgKlxuICAgKiBAZGVmYXVsdCBObyBmaWx0ZXJpbmcgd2lsbCBiZSBwZXJmb3JtZWQgb24gdGFnc1xuICAgKi9cbiAgcmVhZG9ubHkgdGFncz86IFRhZ1tdO1xuXG4gIC8qKlxuICAgKiBXaGVuIGVuYWJsZWQsIEludGVsbGlnZW50LVRpZXJpbmcgd2lsbCBhdXRvbWF0aWNhbGx5IG1vdmUgb2JqZWN0cyB0aGF0XG4gICAqIGhhdmVu4oCZdCBiZWVuIGFjY2Vzc2VkIGZvciBhIG1pbmltdW0gb2YgOTAgZGF5cyB0byB0aGUgQXJjaGl2ZSBBY2Nlc3MgdGllci5cbiAgICpcbiAgICogQGRlZmF1bHQgT2JqZWN0cyB3aWxsIG5vdCBtb3ZlIHRvIEdsYWNpZXJcbiAgICovXG4gIHJlYWRvbmx5IGFyY2hpdmVBY2Nlc3NUaWVyVGltZT86IER1cmF0aW9uO1xuXG4gIC8qKlxuICAgKiBXaGVuIGVuYWJsZWQsIEludGVsbGlnZW50LVRpZXJpbmcgd2lsbCBhdXRvbWF0aWNhbGx5IG1vdmUgb2JqZWN0cyB0aGF0XG4gICAqIGhhdmVu4oCZdCBiZWVuIGFjY2Vzc2VkIGZvciBhIG1pbmltdW0gb2YgMTgwIGRheXMgdG8gdGhlIERlZXAgQXJjaGl2ZSBBY2Nlc3NcbiAgICogdGllci5cbiAgICpcbiAgICogQGRlZmF1bHQgT2JqZWN0cyB3aWxsIG5vdCBtb3ZlIHRvIEdsYWNpZXIgRGVlcCBBY2Nlc3NcbiAgICovXG4gIHJlYWRvbmx5IGRlZXBBcmNoaXZlQWNjZXNzVGllclRpbWU/OiBEdXJhdGlvbjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBCdWNrZXRQcm9wcyB7XG4gIC8qKlxuICAgKiBUaGUga2luZCBvZiBzZXJ2ZXItc2lkZSBlbmNyeXB0aW9uIHRvIGFwcGx5IHRvIHRoaXMgYnVja2V0LlxuICAgKlxuICAgKiBJZiB5b3UgY2hvb3NlIEtNUywgeW91IGNhbiBzcGVjaWZ5IGEgS01TIGtleSB2aWEgYGVuY3J5cHRpb25LZXlgLiBJZlxuICAgKiBlbmNyeXB0aW9uIGtleSBpcyBub3Qgc3BlY2lmaWVkLCBhIGtleSB3aWxsIGF1dG9tYXRpY2FsbHkgYmUgY3JlYXRlZC5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBgS21zYCBpZiBgZW5jcnlwdGlvbktleWAgaXMgc3BlY2lmaWVkLCBvciBgVW5lbmNyeXB0ZWRgIG90aGVyd2lzZS5cbiAgICovXG4gIHJlYWRvbmx5IGVuY3J5cHRpb24/OiBCdWNrZXRFbmNyeXB0aW9uO1xuXG4gIC8qKlxuICAgKiBFeHRlcm5hbCBLTVMga2V5IHRvIHVzZSBmb3IgYnVja2V0IGVuY3J5cHRpb24uXG4gICAqXG4gICAqIFRoZSAnZW5jcnlwdGlvbicgcHJvcGVydHkgbXVzdCBiZSBlaXRoZXIgbm90IHNwZWNpZmllZCBvciBzZXQgdG8gXCJLbXNcIi5cbiAgICogQW4gZXJyb3Igd2lsbCBiZSBlbWl0dGVkIGlmIGVuY3J5cHRpb24gaXMgc2V0IHRvIFwiVW5lbmNyeXB0ZWRcIiBvclxuICAgKiBcIk1hbmFnZWRcIi5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBJZiBlbmNyeXB0aW9uIGlzIHNldCB0byBcIkttc1wiIGFuZCB0aGlzIHByb3BlcnR5IGlzIHVuZGVmaW5lZCxcbiAgICogYSBuZXcgS01TIGtleSB3aWxsIGJlIGNyZWF0ZWQgYW5kIGFzc29jaWF0ZWQgd2l0aCB0aGlzIGJ1Y2tldC5cbiAgICovXG4gIHJlYWRvbmx5IGVuY3J5cHRpb25LZXk/OiBrbXMuSUtleTtcblxuICAvKipcbiAgKiBFbmZvcmNlcyBTU0wgZm9yIHJlcXVlc3RzLiBTMy41IG9mIHRoZSBBV1MgRm91bmRhdGlvbmFsIFNlY3VyaXR5IEJlc3QgUHJhY3RpY2VzIFJlZ2FyZGluZyBTMy5cbiAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9jb25maWcvbGF0ZXN0L2RldmVsb3Blcmd1aWRlL3MzLWJ1Y2tldC1zc2wtcmVxdWVzdHMtb25seS5odG1sXG4gICpcbiAgKiBAZGVmYXVsdCBmYWxzZVxuICAqL1xuICByZWFkb25seSBlbmZvcmNlU1NMPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogV2hldGhlciBBbWF6b24gUzMgc2hvdWxkIHVzZSBpdHMgb3duIGludGVybWVkaWFyeSBrZXkgdG8gZ2VuZXJhdGUgZGF0YSBrZXlzLlxuICAgKlxuICAgKiBPbmx5IHJlbGV2YW50IHdoZW4gdXNpbmcgS01TIGZvciBlbmNyeXB0aW9uLlxuICAgKlxuICAgKiAtIElmIG5vdCBlbmFibGVkLCBldmVyeSBvYmplY3QgR0VUIGFuZCBQVVQgd2lsbCBjYXVzZSBhbiBBUEkgY2FsbCB0byBLTVMgKHdpdGggdGhlXG4gICAqICAgYXR0ZW5kYW50IGNvc3QgaW1wbGljYXRpb25zIG9mIHRoYXQpLlxuICAgKiAtIElmIGVuYWJsZWQsIFMzIHdpbGwgdXNlIGl0cyBvd24gdGltZS1saW1pdGVkIGtleSBpbnN0ZWFkLlxuICAgKlxuICAgKiBPbmx5IHJlbGV2YW50LCB3aGVuIEVuY3J5cHRpb24gaXMgc2V0IHRvIGBCdWNrZXRFbmNyeXB0aW9uLktNU2Agb3IgYEJ1Y2tldEVuY3J5cHRpb24uS01TX01BTkFHRURgLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIGZhbHNlXG4gICAqL1xuICByZWFkb25seSBidWNrZXRLZXlFbmFibGVkPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogUGh5c2ljYWwgbmFtZSBvZiB0aGlzIGJ1Y2tldC5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBBc3NpZ25lZCBieSBDbG91ZEZvcm1hdGlvbiAocmVjb21tZW5kZWQpLlxuICAgKi9cbiAgcmVhZG9ubHkgYnVja2V0TmFtZT86IHN0cmluZztcblxuICAvKipcbiAgICogUG9saWN5IHRvIGFwcGx5IHdoZW4gdGhlIGJ1Y2tldCBpcyByZW1vdmVkIGZyb20gdGhpcyBzdGFjay5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBUaGUgYnVja2V0IHdpbGwgYmUgb3JwaGFuZWQuXG4gICAqL1xuICByZWFkb25seSByZW1vdmFsUG9saWN5PzogUmVtb3ZhbFBvbGljeTtcblxuICAvKipcbiAgICogV2hldGhlciBhbGwgb2JqZWN0cyBzaG91bGQgYmUgYXV0b21hdGljYWxseSBkZWxldGVkIHdoZW4gdGhlIGJ1Y2tldCBpc1xuICAgKiByZW1vdmVkIGZyb20gdGhlIHN0YWNrIG9yIHdoZW4gdGhlIHN0YWNrIGlzIGRlbGV0ZWQuXG4gICAqXG4gICAqIFJlcXVpcmVzIHRoZSBgcmVtb3ZhbFBvbGljeWAgdG8gYmUgc2V0IHRvIGBSZW1vdmFsUG9saWN5LkRFU1RST1lgLlxuICAgKlxuICAgKiAqKldhcm5pbmcqKiBpZiB5b3UgaGF2ZSBkZXBsb3llZCBhIGJ1Y2tldCB3aXRoIGBhdXRvRGVsZXRlT2JqZWN0czogdHJ1ZWAsXG4gICAqIHN3aXRjaGluZyB0aGlzIHRvIGBmYWxzZWAgaW4gYSBDREsgdmVyc2lvbiAqYmVmb3JlKiBgMS4xMjYuMGAgd2lsbCBsZWFkIHRvXG4gICAqIGFsbCBvYmplY3RzIGluIHRoZSBidWNrZXQgYmVpbmcgZGVsZXRlZC4gQmUgc3VyZSB0byB1cGRhdGUgeW91ciBidWNrZXQgcmVzb3VyY2VzXG4gICAqIGJ5IGRlcGxveWluZyB3aXRoIENESyB2ZXJzaW9uIGAxLjEyNi4wYCBvciBsYXRlciAqKmJlZm9yZSoqIHN3aXRjaGluZyB0aGlzIHZhbHVlIHRvIGBmYWxzZWAuXG4gICAqXG4gICAqIEBkZWZhdWx0IGZhbHNlXG4gICAqL1xuICByZWFkb25seSBhdXRvRGVsZXRlT2JqZWN0cz86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhpcyBidWNrZXQgc2hvdWxkIGhhdmUgdmVyc2lvbmluZyB0dXJuZWQgb24gb3Igbm90LlxuICAgKlxuICAgKiBAZGVmYXVsdCBmYWxzZSAodW5sZXNzIG9iamVjdCBsb2NrIGlzIGVuYWJsZWQsIHRoZW4gdHJ1ZSlcbiAgICovXG4gIHJlYWRvbmx5IHZlcnNpb25lZD86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIEVuYWJsZSBvYmplY3QgbG9jayBvbiB0aGUgYnVja2V0LlxuICAgKlxuICAgKiBFbmFibGluZyBvYmplY3QgbG9jayBmb3IgZXhpc3RpbmcgYnVja2V0cyBpcyBub3Qgc3VwcG9ydGVkLiBPYmplY3QgbG9jayBtdXN0IGJlXG4gICAqIGVuYWJsZWQgd2hlbiB0aGUgYnVja2V0IGlzIGNyZWF0ZWQuXG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FtYXpvblMzL2xhdGVzdC91c2VyZ3VpZGUvb2JqZWN0LWxvY2stb3ZlcnZpZXcuaHRtbCNvYmplY3QtbG9jay1idWNrZXQtY29uZmlnLWVuYWJsZVxuICAgKlxuICAgKiBAZGVmYXVsdCBmYWxzZSwgdW5sZXNzIG9iamVjdExvY2tEZWZhdWx0UmV0ZW50aW9uIGlzIHNldCAodGhlbiwgdHJ1ZSlcbiAgICovXG4gIHJlYWRvbmx5IG9iamVjdExvY2tFbmFibGVkPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogVGhlIGRlZmF1bHQgcmV0ZW50aW9uIG1vZGUgYW5kIHJ1bGVzIGZvciBTMyBPYmplY3QgTG9jay5cbiAgICpcbiAgICogRGVmYXVsdCByZXRlbnRpb24gY2FuIGJlIGNvbmZpZ3VyZWQgYWZ0ZXIgYSBidWNrZXQgaXMgY3JlYXRlZCBpZiB0aGUgYnVja2V0IGFscmVhZHlcbiAgICogaGFzIG9iamVjdCBsb2NrIGVuYWJsZWQuIEVuYWJsaW5nIG9iamVjdCBsb2NrIGZvciBleGlzdGluZyBidWNrZXRzIGlzIG5vdCBzdXBwb3J0ZWQuXG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FtYXpvblMzL2xhdGVzdC91c2VyZ3VpZGUvb2JqZWN0LWxvY2stb3ZlcnZpZXcuaHRtbCNvYmplY3QtbG9jay1idWNrZXQtY29uZmlnLWVuYWJsZVxuICAgKlxuICAgKiBAZGVmYXVsdCBubyBkZWZhdWx0IHJldGVudGlvbiBwZXJpb2RcbiAgICovXG4gIHJlYWRvbmx5IG9iamVjdExvY2tEZWZhdWx0UmV0ZW50aW9uPzogT2JqZWN0TG9ja1JldGVudGlvbjtcblxuICAvKipcbiAgICogV2hldGhlciB0aGlzIGJ1Y2tldCBzaG91bGQgc2VuZCBub3RpZmljYXRpb25zIHRvIEFtYXpvbiBFdmVudEJyaWRnZSBvciBub3QuXG4gICAqXG4gICAqIEBkZWZhdWx0IGZhbHNlXG4gICAqL1xuICByZWFkb25seSBldmVudEJyaWRnZUVuYWJsZWQ/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBSdWxlcyB0aGF0IGRlZmluZSBob3cgQW1hem9uIFMzIG1hbmFnZXMgb2JqZWN0cyBkdXJpbmcgdGhlaXIgbGlmZXRpbWUuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm8gbGlmZWN5Y2xlIHJ1bGVzLlxuICAgKi9cbiAgcmVhZG9ubHkgbGlmZWN5Y2xlUnVsZXM/OiBMaWZlY3ljbGVSdWxlW107XG5cbiAgLyoqXG4gICAqIFRoZSBuYW1lIG9mIHRoZSBpbmRleCBkb2N1bWVudCAoZS5nLiBcImluZGV4Lmh0bWxcIikgZm9yIHRoZSB3ZWJzaXRlLiBFbmFibGVzIHN0YXRpYyB3ZWJzaXRlXG4gICAqIGhvc3RpbmcgZm9yIHRoaXMgYnVja2V0LlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vIGluZGV4IGRvY3VtZW50LlxuICAgKi9cbiAgcmVhZG9ubHkgd2Vic2l0ZUluZGV4RG9jdW1lbnQ/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBuYW1lIG9mIHRoZSBlcnJvciBkb2N1bWVudCAoZS5nLiBcIjQwNC5odG1sXCIpIGZvciB0aGUgd2Vic2l0ZS5cbiAgICogYHdlYnNpdGVJbmRleERvY3VtZW50YCBtdXN0IGFsc28gYmUgc2V0IGlmIHRoaXMgaXMgc2V0LlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vIGVycm9yIGRvY3VtZW50LlxuICAgKi9cbiAgcmVhZG9ubHkgd2Vic2l0ZUVycm9yRG9jdW1lbnQ/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFNwZWNpZmllcyB0aGUgcmVkaXJlY3QgYmVoYXZpb3Igb2YgYWxsIHJlcXVlc3RzIHRvIGEgd2Vic2l0ZSBlbmRwb2ludCBvZiBhIGJ1Y2tldC5cbiAgICpcbiAgICogSWYgeW91IHNwZWNpZnkgdGhpcyBwcm9wZXJ0eSwgeW91IGNhbid0IHNwZWNpZnkgXCJ3ZWJzaXRlSW5kZXhEb2N1bWVudFwiLCBcIndlYnNpdGVFcnJvckRvY3VtZW50XCIgbm9yICwgXCJ3ZWJzaXRlUm91dGluZ1J1bGVzXCIuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm8gcmVkaXJlY3Rpb24uXG4gICAqL1xuICByZWFkb25seSB3ZWJzaXRlUmVkaXJlY3Q/OiBSZWRpcmVjdFRhcmdldDtcblxuICAvKipcbiAgICogUnVsZXMgdGhhdCBkZWZpbmUgd2hlbiBhIHJlZGlyZWN0IGlzIGFwcGxpZWQgYW5kIHRoZSByZWRpcmVjdCBiZWhhdmlvclxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vIHJlZGlyZWN0aW9uIHJ1bGVzLlxuICAgKi9cbiAgcmVhZG9ubHkgd2Vic2l0ZVJvdXRpbmdSdWxlcz86IFJvdXRpbmdSdWxlW107XG5cbiAgLyoqXG4gICAqIFNwZWNpZmllcyBhIGNhbm5lZCBBQ0wgdGhhdCBncmFudHMgcHJlZGVmaW5lZCBwZXJtaXNzaW9ucyB0byB0aGUgYnVja2V0LlxuICAgKlxuICAgKiBAZGVmYXVsdCBCdWNrZXRBY2Nlc3NDb250cm9sLlBSSVZBVEVcbiAgICovXG4gIHJlYWRvbmx5IGFjY2Vzc0NvbnRyb2w/OiBCdWNrZXRBY2Nlc3NDb250cm9sO1xuXG4gIC8qKlxuICAgKiBHcmFudHMgcHVibGljIHJlYWQgYWNjZXNzIHRvIGFsbCBvYmplY3RzIGluIHRoZSBidWNrZXQuXG4gICAqIFNpbWlsYXIgdG8gY2FsbGluZyBgYnVja2V0LmdyYW50UHVibGljQWNjZXNzKClgXG4gICAqXG4gICAqIEBkZWZhdWx0IGZhbHNlXG4gICAqL1xuICByZWFkb25seSBwdWJsaWNSZWFkQWNjZXNzPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogVGhlIGJsb2NrIHB1YmxpYyBhY2Nlc3MgY29uZmlndXJhdGlvbiBvZiB0aGlzIGJ1Y2tldC5cbiAgICpcbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQW1hem9uUzMvbGF0ZXN0L2Rldi9hY2Nlc3MtY29udHJvbC1ibG9jay1wdWJsaWMtYWNjZXNzLmh0bWxcbiAgICpcbiAgICpcbiAgICogQGRlZmF1bHQgLSBDbG91ZEZvcm1hdGlvbiBkZWZhdWx0cyB3aWxsIGFwcGx5LiBOZXcgYnVja2V0cyBhbmQgb2JqZWN0cyBkb24ndCBhbGxvdyBwdWJsaWMgYWNjZXNzLCBidXQgdXNlcnMgY2FuIG1vZGlmeSBidWNrZXQgcG9saWNpZXMgb3Igb2JqZWN0IHBlcm1pc3Npb25zIHRvIGFsbG93IHB1YmxpYyBhY2Nlc3NcbiAgICovXG4gIHJlYWRvbmx5IGJsb2NrUHVibGljQWNjZXNzPzogQmxvY2tQdWJsaWNBY2Nlc3M7XG5cbiAgLyoqXG4gICAqIFRoZSBtZXRyaWNzIGNvbmZpZ3VyYXRpb24gb2YgdGhpcyBidWNrZXQuXG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXByb3BlcnRpZXMtczMtYnVja2V0LW1ldHJpY3Njb25maWd1cmF0aW9uLmh0bWxcbiAgICpcbiAgICogQGRlZmF1bHQgLSBObyBtZXRyaWNzIGNvbmZpZ3VyYXRpb24uXG4gICAqL1xuICByZWFkb25seSBtZXRyaWNzPzogQnVja2V0TWV0cmljc1tdO1xuXG4gIC8qKlxuICAgKiBUaGUgQ09SUyBjb25maWd1cmF0aW9uIG9mIHRoaXMgYnVja2V0LlxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1wcm9wZXJ0aWVzLXMzLWJ1Y2tldC1jb3JzLmh0bWxcbiAgICpcbiAgICogQGRlZmF1bHQgLSBObyBDT1JTIGNvbmZpZ3VyYXRpb24uXG4gICAqL1xuICByZWFkb25seSBjb3JzPzogQ29yc1J1bGVbXTtcblxuICAvKipcbiAgICogRGVzdGluYXRpb24gYnVja2V0IGZvciB0aGUgc2VydmVyIGFjY2VzcyBsb2dzLlxuICAgKiBAZGVmYXVsdCAtIElmIFwic2VydmVyQWNjZXNzTG9nc1ByZWZpeFwiIHVuZGVmaW5lZCAtIGFjY2VzcyBsb2dzIGRpc2FibGVkLCBvdGhlcndpc2UgLSBsb2cgdG8gY3VycmVudCBidWNrZXQuXG4gICAqL1xuICByZWFkb25seSBzZXJ2ZXJBY2Nlc3NMb2dzQnVja2V0PzogSUJ1Y2tldDtcblxuICAvKipcbiAgICogT3B0aW9uYWwgbG9nIGZpbGUgcHJlZml4IHRvIHVzZSBmb3IgdGhlIGJ1Y2tldCdzIGFjY2VzcyBsb2dzLlxuICAgKiBJZiBkZWZpbmVkIHdpdGhvdXQgXCJzZXJ2ZXJBY2Nlc3NMb2dzQnVja2V0XCIsIGVuYWJsZXMgYWNjZXNzIGxvZ3MgdG8gY3VycmVudCBidWNrZXQgd2l0aCB0aGlzIHByZWZpeC5cbiAgICogQGRlZmF1bHQgLSBObyBsb2cgZmlsZSBwcmVmaXhcbiAgICovXG4gIHJlYWRvbmx5IHNlcnZlckFjY2Vzc0xvZ3NQcmVmaXg/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBpbnZlbnRvcnkgY29uZmlndXJhdGlvbiBvZiB0aGUgYnVja2V0LlxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BbWF6b25TMy9sYXRlc3QvZGV2L3N0b3JhZ2UtaW52ZW50b3J5Lmh0bWxcbiAgICpcbiAgICogQGRlZmF1bHQgLSBObyBpbnZlbnRvcnkgY29uZmlndXJhdGlvblxuICAgKi9cbiAgcmVhZG9ubHkgaW52ZW50b3JpZXM/OiBJbnZlbnRvcnlbXTtcbiAgLyoqXG4gICAqIFRoZSBvYmplY3RPd25lcnNoaXAgb2YgdGhlIGJ1Y2tldC5cbiAgICpcbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQW1hem9uUzMvbGF0ZXN0L2Rldi9hYm91dC1vYmplY3Qtb3duZXJzaGlwLmh0bWxcbiAgICpcbiAgICogQGRlZmF1bHQgLSBObyBPYmplY3RPd25lcnNoaXAgY29uZmlndXJhdGlvbiwgdXBsb2FkaW5nIGFjY291bnQgd2lsbCBvd24gdGhlIG9iamVjdC5cbiAgICpcbiAgICovXG4gIHJlYWRvbmx5IG9iamVjdE93bmVyc2hpcD86IE9iamVjdE93bmVyc2hpcDtcblxuICAvKipcbiAgICogV2hldGhlciB0aGlzIGJ1Y2tldCBzaG91bGQgaGF2ZSB0cmFuc2ZlciBhY2NlbGVyYXRpb24gdHVybmVkIG9uIG9yIG5vdC5cbiAgICpcbiAgICogQGRlZmF1bHQgZmFsc2VcbiAgICovXG4gIHJlYWRvbmx5IHRyYW5zZmVyQWNjZWxlcmF0aW9uPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogVGhlIHJvbGUgdG8gYmUgdXNlZCBieSB0aGUgbm90aWZpY2F0aW9ucyBoYW5kbGVyXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gYSBuZXcgcm9sZSB3aWxsIGJlIGNyZWF0ZWQuXG4gICAqL1xuICByZWFkb25seSBub3RpZmljYXRpb25zSGFuZGxlclJvbGU/OiBpYW0uSVJvbGU7XG5cbiAgLyoqXG4gICAqIEludGVsaWdlbnQgVGllcmluZyBDb25maWd1cmF0aW9uc1xuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BbWF6b25TMy9sYXRlc3QvdXNlcmd1aWRlL2ludGVsbGlnZW50LXRpZXJpbmcuaHRtbFxuICAgKlxuICAgKiBAZGVmYXVsdCBObyBJbnRlbGxpZ2VudCBUaWllcmluZyBDb25maWd1cmF0aW9ucy5cbiAgICovXG4gIHJlYWRvbmx5IGludGVsbGlnZW50VGllcmluZ0NvbmZpZ3VyYXRpb25zPzogSW50ZWxsaWdlbnRUaWVyaW5nQ29uZmlndXJhdGlvbltdO1xufVxuXG5cbi8qKlxuICogVGFnXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgVGFnIHtcblxuICAvKipcbiAgICoga2V5IHRvIGUgdGFnZ2VkXG4gICAqL1xuICByZWFkb25seSBrZXk6IHN0cmluZztcbiAgLyoqXG4gICAqIGFkZGl0aW9uYWwgdmFsdWVcbiAgICovXG4gIHJlYWRvbmx5IHZhbHVlOiBzdHJpbmc7XG59XG5cbi8qKlxuICogQW4gUzMgYnVja2V0IHdpdGggYXNzb2NpYXRlZCBwb2xpY3kgb2JqZWN0c1xuICpcbiAqIFRoaXMgYnVja2V0IGRvZXMgbm90IHlldCBoYXZlIGFsbCBmZWF0dXJlcyB0aGF0IGV4cG9zZWQgYnkgdGhlIHVuZGVybHlpbmdcbiAqIEJ1Y2tldFJlc291cmNlLlxuICpcbiAqIEBleGFtcGxlXG4gKlxuICogbmV3IEJ1Y2tldChzY29wZSwgJ0J1Y2tldCcsIHtcbiAqICAgYmxvY2tQdWJsaWNBY2Nlc3M6IEJsb2NrUHVibGljQWNjZXNzLkJMT0NLX0FMTCxcbiAqICAgZW5jcnlwdGlvbjogQnVja2V0RW5jcnlwdGlvbi5TM19NQU5BR0VELFxuICogICBlbmZvcmNlU1NMOiB0cnVlLFxuICogICB2ZXJzaW9uZWQ6IHRydWUsXG4gKiAgIHJlbW92YWxQb2xpY3k6IFJlbW92YWxQb2xpY3kuUkVUQUlOLFxuICogfSk7XG4gKlxuICovXG5leHBvcnQgY2xhc3MgQnVja2V0IGV4dGVuZHMgQnVja2V0QmFzZSB7XG4gIHB1YmxpYyBzdGF0aWMgZnJvbUJ1Y2tldEFybihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBidWNrZXRBcm46IHN0cmluZyk6IElCdWNrZXQge1xuICAgIHJldHVybiBCdWNrZXQuZnJvbUJ1Y2tldEF0dHJpYnV0ZXMoc2NvcGUsIGlkLCB7IGJ1Y2tldEFybiB9KTtcbiAgfVxuXG4gIHB1YmxpYyBzdGF0aWMgZnJvbUJ1Y2tldE5hbWUoc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgYnVja2V0TmFtZTogc3RyaW5nKTogSUJ1Y2tldCB7XG4gICAgcmV0dXJuIEJ1Y2tldC5mcm9tQnVja2V0QXR0cmlidXRlcyhzY29wZSwgaWQsIHsgYnVja2V0TmFtZSB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgQnVja2V0IGNvbnN0cnVjdCB0aGF0IHJlcHJlc2VudHMgYW4gZXh0ZXJuYWwgYnVja2V0LlxuICAgKlxuICAgKiBAcGFyYW0gc2NvcGUgVGhlIHBhcmVudCBjcmVhdGluZyBjb25zdHJ1Y3QgKHVzdWFsbHkgYHRoaXNgKS5cbiAgICogQHBhcmFtIGlkIFRoZSBjb25zdHJ1Y3QncyBuYW1lLlxuICAgKiBAcGFyYW0gYXR0cnMgQSBgQnVja2V0QXR0cmlidXRlc2Agb2JqZWN0LiBDYW4gYmUgb2J0YWluZWQgZnJvbSBhIGNhbGwgdG9cbiAgICogYGJ1Y2tldC5leHBvcnQoKWAgb3IgbWFudWFsbHkgY3JlYXRlZC5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZnJvbUJ1Y2tldEF0dHJpYnV0ZXMoc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgYXR0cnM6IEJ1Y2tldEF0dHJpYnV0ZXMpOiBJQnVja2V0IHtcbiAgICBjb25zdCBzdGFjayA9IFN0YWNrLm9mKHNjb3BlKTtcbiAgICBjb25zdCByZWdpb24gPSBhdHRycy5yZWdpb24gPz8gc3RhY2sucmVnaW9uO1xuICAgIGNvbnN0IHJlZ2lvbkluZm8gPSByZWdpb25JbmZvcm1hdGlvbi5SZWdpb25JbmZvLmdldChyZWdpb24pO1xuICAgIGNvbnN0IHVybFN1ZmZpeCA9IHJlZ2lvbkluZm8uZG9tYWluU3VmZml4ID8/IHN0YWNrLnVybFN1ZmZpeDtcblxuICAgIGNvbnN0IGJ1Y2tldE5hbWUgPSBwYXJzZUJ1Y2tldE5hbWUoc2NvcGUsIGF0dHJzKTtcbiAgICBpZiAoIWJ1Y2tldE5hbWUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQnVja2V0IG5hbWUgaXMgcmVxdWlyZWQnKTtcbiAgICB9XG4gICAgQnVja2V0LnZhbGlkYXRlQnVja2V0TmFtZShidWNrZXROYW1lKTtcblxuICAgIGNvbnN0IG9sZEVuZHBvaW50ID0gYHMzLXdlYnNpdGUtJHtyZWdpb259LiR7dXJsU3VmZml4fWA7XG4gICAgY29uc3QgbmV3RW5kcG9pbnQgPSBgczMtd2Vic2l0ZS4ke3JlZ2lvbn0uJHt1cmxTdWZmaXh9YDtcblxuICAgIGxldCBzdGF0aWNEb21haW5FbmRwb2ludCA9IHJlZ2lvbkluZm8uczNTdGF0aWNXZWJzaXRlRW5kcG9pbnRcbiAgICAgID8/IExhenkuc3RyaW5nKHsgcHJvZHVjZTogKCkgPT4gc3RhY2sucmVnaW9uYWxGYWN0KHJlZ2lvbkluZm9ybWF0aW9uLkZhY3ROYW1lLlMzX1NUQVRJQ19XRUJTSVRFX0VORFBPSU5ULCBuZXdFbmRwb2ludCkgfSk7XG5cbiAgICAvLyBEZXByZWNhdGVkIHVzZSBvZiBidWNrZXRXZWJzaXRlTmV3VXJsRm9ybWF0XG4gICAgaWYgKGF0dHJzLmJ1Y2tldFdlYnNpdGVOZXdVcmxGb3JtYXQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgc3RhdGljRG9tYWluRW5kcG9pbnQgPSBhdHRycy5idWNrZXRXZWJzaXRlTmV3VXJsRm9ybWF0ID8gbmV3RW5kcG9pbnQgOiBvbGRFbmRwb2ludDtcbiAgICB9XG5cbiAgICBjb25zdCB3ZWJzaXRlRG9tYWluID0gYCR7YnVja2V0TmFtZX0uJHtzdGF0aWNEb21haW5FbmRwb2ludH1gO1xuXG4gICAgY2xhc3MgSW1wb3J0IGV4dGVuZHMgQnVja2V0QmFzZSB7XG4gICAgICBwdWJsaWMgcmVhZG9ubHkgYnVja2V0TmFtZSA9IGJ1Y2tldE5hbWUhO1xuICAgICAgcHVibGljIHJlYWRvbmx5IGJ1Y2tldEFybiA9IHBhcnNlQnVja2V0QXJuKHNjb3BlLCBhdHRycyk7XG4gICAgICBwdWJsaWMgcmVhZG9ubHkgYnVja2V0RG9tYWluTmFtZSA9IGF0dHJzLmJ1Y2tldERvbWFpbk5hbWUgfHwgYCR7YnVja2V0TmFtZX0uczMuJHt1cmxTdWZmaXh9YDtcbiAgICAgIHB1YmxpYyByZWFkb25seSBidWNrZXRXZWJzaXRlVXJsID0gYXR0cnMuYnVja2V0V2Vic2l0ZVVybCB8fCBgaHR0cDovLyR7d2Vic2l0ZURvbWFpbn1gO1xuICAgICAgcHVibGljIHJlYWRvbmx5IGJ1Y2tldFdlYnNpdGVEb21haW5OYW1lID0gYXR0cnMuYnVja2V0V2Vic2l0ZVVybCA/IEZuLnNlbGVjdCgyLCBGbi5zcGxpdCgnLycsIGF0dHJzLmJ1Y2tldFdlYnNpdGVVcmwpKSA6IHdlYnNpdGVEb21haW47XG4gICAgICBwdWJsaWMgcmVhZG9ubHkgYnVja2V0UmVnaW9uYWxEb21haW5OYW1lID0gYXR0cnMuYnVja2V0UmVnaW9uYWxEb21haW5OYW1lIHx8IGAke2J1Y2tldE5hbWV9LnMzLiR7cmVnaW9ufS4ke3VybFN1ZmZpeH1gO1xuICAgICAgcHVibGljIHJlYWRvbmx5IGJ1Y2tldER1YWxTdGFja0RvbWFpbk5hbWUgPSBhdHRycy5idWNrZXREdWFsU3RhY2tEb21haW5OYW1lIHx8IGAke2J1Y2tldE5hbWV9LnMzLmR1YWxzdGFjay4ke3JlZ2lvbn0uJHt1cmxTdWZmaXh9YDtcbiAgICAgIHB1YmxpYyByZWFkb25seSBidWNrZXRXZWJzaXRlTmV3VXJsRm9ybWF0ID0gYXR0cnMuYnVja2V0V2Vic2l0ZU5ld1VybEZvcm1hdCA/PyBmYWxzZTtcbiAgICAgIHB1YmxpYyByZWFkb25seSBlbmNyeXB0aW9uS2V5ID0gYXR0cnMuZW5jcnlwdGlvbktleTtcbiAgICAgIHB1YmxpYyByZWFkb25seSBpc1dlYnNpdGUgPSBhdHRycy5pc1dlYnNpdGUgPz8gZmFsc2U7XG4gICAgICBwdWJsaWMgcG9saWN5PzogQnVja2V0UG9saWN5ID0gdW5kZWZpbmVkO1xuICAgICAgcHJvdGVjdGVkIGF1dG9DcmVhdGVQb2xpY3kgPSBmYWxzZTtcbiAgICAgIHByb3RlY3RlZCBkaXNhbGxvd1B1YmxpY0FjY2VzcyA9IGZhbHNlO1xuICAgICAgcHJvdGVjdGVkIG5vdGlmaWNhdGlvbnNIYW5kbGVyUm9sZSA9IGF0dHJzLm5vdGlmaWNhdGlvbnNIYW5kbGVyUm9sZTtcblxuICAgICAgLyoqXG4gICAgICAgKiBFeHBvcnRzIHRoaXMgYnVja2V0IGZyb20gdGhlIHN0YWNrLlxuICAgICAgICovXG4gICAgICBwdWJsaWMgZXhwb3J0KCkge1xuICAgICAgICByZXR1cm4gYXR0cnM7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBJbXBvcnQoc2NvcGUsIGlkLCB7XG4gICAgICBhY2NvdW50OiBhdHRycy5hY2NvdW50LFxuICAgICAgcmVnaW9uOiBhdHRycy5yZWdpb24sXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIGEgbXV0YWJsZSBgSUJ1Y2tldGAgYmFzZWQgb24gYSBsb3ctbGV2ZWwgYENmbkJ1Y2tldGAuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21DZm5CdWNrZXQoY2ZuQnVja2V0OiBDZm5CdWNrZXQpOiBJQnVja2V0IHtcbiAgICAvLyB1c2UgYSBcIndlaXJkXCIgaWQgdGhhdCBoYXMgYSBoaWdoZXIgY2hhbmNlIG9mIGJlaW5nIHVuaXF1ZVxuICAgIGNvbnN0IGlkID0gJ0BGcm9tQ2ZuQnVja2V0JztcblxuICAgIC8vIGlmIGZyb21DZm5CdWNrZXQoKSB3YXMgYWxyZWFkeSBjYWxsZWQgb24gdGhpcyBjZm5CdWNrZXQsXG4gICAgLy8gcmV0dXJuIHRoZSBzYW1lIEwyXG4gICAgLy8gKGFzIGRpZmZlcmVudCBMMnMgd291bGQgY29uZmxpY3QsIGJlY2F1c2Ugb2YgdGhlIG11dGF0aW9uIG9mIHRoZSBwb2xpY3kgcHJvcGVydHkgb2YgdGhlIEwxIGJlbG93KVxuICAgIGNvbnN0IGV4aXN0aW5nID0gY2ZuQnVja2V0Lm5vZGUudHJ5RmluZENoaWxkKGlkKTtcbiAgICBpZiAoZXhpc3RpbmcpIHtcbiAgICAgIHJldHVybiA8SUJ1Y2tldD5leGlzdGluZztcbiAgICB9XG5cbiAgICAvLyBoYW5kbGUgdGhlIEtNUyBLZXkgaWYgdGhlIEJ1Y2tldCByZWZlcmVuY2VzIG9uZVxuICAgIGxldCBlbmNyeXB0aW9uS2V5OiBrbXMuSUtleSB8IHVuZGVmaW5lZDtcbiAgICBpZiAoY2ZuQnVja2V0LmJ1Y2tldEVuY3J5cHRpb24pIHtcbiAgICAgIGNvbnN0IHNlcnZlclNpZGVFbmNyeXB0aW9uQ29uZmlndXJhdGlvbiA9IChjZm5CdWNrZXQuYnVja2V0RW5jcnlwdGlvbiBhcyBhbnkpLnNlcnZlclNpZGVFbmNyeXB0aW9uQ29uZmlndXJhdGlvbjtcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KHNlcnZlclNpZGVFbmNyeXB0aW9uQ29uZmlndXJhdGlvbikgJiYgc2VydmVyU2lkZUVuY3J5cHRpb25Db25maWd1cmF0aW9uLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICBjb25zdCBzZXJ2ZXJTaWRlRW5jcnlwdGlvblJ1bGVQcm9wZXJ0eSA9IHNlcnZlclNpZGVFbmNyeXB0aW9uQ29uZmlndXJhdGlvblswXTtcbiAgICAgICAgY29uc3Qgc2VydmVyU2lkZUVuY3J5cHRpb25CeURlZmF1bHQgPSBzZXJ2ZXJTaWRlRW5jcnlwdGlvblJ1bGVQcm9wZXJ0eS5zZXJ2ZXJTaWRlRW5jcnlwdGlvbkJ5RGVmYXVsdDtcbiAgICAgICAgaWYgKHNlcnZlclNpZGVFbmNyeXB0aW9uQnlEZWZhdWx0ICYmIFRva2VuLmlzVW5yZXNvbHZlZChzZXJ2ZXJTaWRlRW5jcnlwdGlvbkJ5RGVmYXVsdC5rbXNNYXN0ZXJLZXlJZCkpIHtcbiAgICAgICAgICBjb25zdCBrbXNJUmVzb2x2YWJsZSA9IFRva2VuaXphdGlvbi5yZXZlcnNlKHNlcnZlclNpZGVFbmNyeXB0aW9uQnlEZWZhdWx0Lmttc01hc3RlcktleUlkKTtcbiAgICAgICAgICBpZiAoa21zSVJlc29sdmFibGUgaW5zdGFuY2VvZiBDZm5SZWZlcmVuY2UpIHtcbiAgICAgICAgICAgIGNvbnN0IGNmbkVsZW1lbnQgPSBrbXNJUmVzb2x2YWJsZS50YXJnZXQ7XG4gICAgICAgICAgICBpZiAoY2ZuRWxlbWVudCBpbnN0YW5jZW9mIGttcy5DZm5LZXkpIHtcbiAgICAgICAgICAgICAgZW5jcnlwdGlvbktleSA9IGttcy5LZXkuZnJvbUNmbktleShjZm5FbGVtZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IGNsYXNzIGV4dGVuZHMgQnVja2V0QmFzZSB7XG4gICAgICBwdWJsaWMgcmVhZG9ubHkgYnVja2V0QXJuID0gY2ZuQnVja2V0LmF0dHJBcm47XG4gICAgICBwdWJsaWMgcmVhZG9ubHkgYnVja2V0TmFtZSA9IGNmbkJ1Y2tldC5yZWY7XG4gICAgICBwdWJsaWMgcmVhZG9ubHkgYnVja2V0RG9tYWluTmFtZSA9IGNmbkJ1Y2tldC5hdHRyRG9tYWluTmFtZTtcbiAgICAgIHB1YmxpYyByZWFkb25seSBidWNrZXREdWFsU3RhY2tEb21haW5OYW1lID0gY2ZuQnVja2V0LmF0dHJEdWFsU3RhY2tEb21haW5OYW1lO1xuICAgICAgcHVibGljIHJlYWRvbmx5IGJ1Y2tldFJlZ2lvbmFsRG9tYWluTmFtZSA9IGNmbkJ1Y2tldC5hdHRyUmVnaW9uYWxEb21haW5OYW1lO1xuICAgICAgcHVibGljIHJlYWRvbmx5IGJ1Y2tldFdlYnNpdGVVcmwgPSBjZm5CdWNrZXQuYXR0cldlYnNpdGVVcmw7XG4gICAgICBwdWJsaWMgcmVhZG9ubHkgYnVja2V0V2Vic2l0ZURvbWFpbk5hbWUgPSBGbi5zZWxlY3QoMiwgRm4uc3BsaXQoJy8nLCBjZm5CdWNrZXQuYXR0cldlYnNpdGVVcmwpKTtcblxuICAgICAgcHVibGljIHJlYWRvbmx5IGVuY3J5cHRpb25LZXkgPSBlbmNyeXB0aW9uS2V5O1xuICAgICAgcHVibGljIHJlYWRvbmx5IGlzV2Vic2l0ZSA9IGNmbkJ1Y2tldC53ZWJzaXRlQ29uZmlndXJhdGlvbiAhPT0gdW5kZWZpbmVkO1xuICAgICAgcHVibGljIHBvbGljeSA9IHVuZGVmaW5lZDtcbiAgICAgIHByb3RlY3RlZCBhdXRvQ3JlYXRlUG9saWN5ID0gdHJ1ZTtcbiAgICAgIHByb3RlY3RlZCBkaXNhbGxvd1B1YmxpY0FjY2VzcyA9IGNmbkJ1Y2tldC5wdWJsaWNBY2Nlc3NCbG9ja0NvbmZpZ3VyYXRpb24gJiZcbiAgICAgICAgKGNmbkJ1Y2tldC5wdWJsaWNBY2Nlc3NCbG9ja0NvbmZpZ3VyYXRpb24gYXMgYW55KS5ibG9ja1B1YmxpY1BvbGljeTtcblxuICAgICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKGNmbkJ1Y2tldCwgaWQpO1xuXG4gICAgICAgIHRoaXMubm9kZS5kZWZhdWx0Q2hpbGQgPSBjZm5CdWNrZXQ7XG4gICAgICB9XG4gICAgfSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRocm93biBhbiBleGNlcHRpb24gaWYgdGhlIGdpdmVuIGJ1Y2tldCBuYW1lIGlzIG5vdCB2YWxpZC5cbiAgICpcbiAgICogQHBhcmFtIHBoeXNpY2FsTmFtZSBuYW1lIG9mIHRoZSBidWNrZXQuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHZhbGlkYXRlQnVja2V0TmFtZShwaHlzaWNhbE5hbWU6IHN0cmluZyk6IHZvaWQge1xuICAgIGNvbnN0IGJ1Y2tldE5hbWUgPSBwaHlzaWNhbE5hbWU7XG4gICAgaWYgKCFidWNrZXROYW1lIHx8IFRva2VuLmlzVW5yZXNvbHZlZChidWNrZXROYW1lKSkge1xuICAgICAgLy8gdGhlIG5hbWUgaXMgYSBsYXRlLWJvdW5kIHZhbHVlLCBub3QgYSBkZWZpbmVkIHN0cmluZyxcbiAgICAgIC8vIHNvIHNraXAgdmFsaWRhdGlvblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGVycm9yczogc3RyaW5nW10gPSBbXTtcblxuICAgIC8vIFJ1bGVzIGNvZGlmaWVkIGZyb20gaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FtYXpvblMzL2xhdGVzdC9kZXYvQnVja2V0UmVzdHJpY3Rpb25zLmh0bWxcbiAgICBpZiAoYnVja2V0TmFtZS5sZW5ndGggPCAzIHx8IGJ1Y2tldE5hbWUubGVuZ3RoID4gNjMpIHtcbiAgICAgIGVycm9ycy5wdXNoKCdCdWNrZXQgbmFtZSBtdXN0IGJlIGF0IGxlYXN0IDMgYW5kIG5vIG1vcmUgdGhhbiA2MyBjaGFyYWN0ZXJzJyk7XG4gICAgfVxuICAgIGNvbnN0IGNoYXJzZXRNYXRjaCA9IGJ1Y2tldE5hbWUubWF0Y2goL1teYS16MC05Li1dLyk7XG4gICAgaWYgKGNoYXJzZXRNYXRjaCkge1xuICAgICAgZXJyb3JzLnB1c2goJ0J1Y2tldCBuYW1lIG11c3Qgb25seSBjb250YWluIGxvd2VyY2FzZSBjaGFyYWN0ZXJzIGFuZCB0aGUgc3ltYm9scywgcGVyaW9kICguKSBhbmQgZGFzaCAoLSkgJ1xuICAgICAgICArIGAob2Zmc2V0OiAke2NoYXJzZXRNYXRjaC5pbmRleH0pYCk7XG4gICAgfVxuICAgIGlmICghL1thLXowLTldLy50ZXN0KGJ1Y2tldE5hbWUuY2hhckF0KDApKSkge1xuICAgICAgZXJyb3JzLnB1c2goJ0J1Y2tldCBuYW1lIG11c3Qgc3RhcnQgYW5kIGVuZCB3aXRoIGEgbG93ZXJjYXNlIGNoYXJhY3RlciBvciBudW1iZXIgJ1xuICAgICAgICArICcob2Zmc2V0OiAwKScpO1xuICAgIH1cbiAgICBpZiAoIS9bYS16MC05XS8udGVzdChidWNrZXROYW1lLmNoYXJBdChidWNrZXROYW1lLmxlbmd0aCAtIDEpKSkge1xuICAgICAgZXJyb3JzLnB1c2goJ0J1Y2tldCBuYW1lIG11c3Qgc3RhcnQgYW5kIGVuZCB3aXRoIGEgbG93ZXJjYXNlIGNoYXJhY3RlciBvciBudW1iZXIgJ1xuICAgICAgICArIGAob2Zmc2V0OiAke2J1Y2tldE5hbWUubGVuZ3RoIC0gMX0pYCk7XG4gICAgfVxuICAgIGNvbnN0IGNvbnNlY1N5bWJvbE1hdGNoID0gYnVja2V0TmFtZS5tYXRjaCgvXFwuLXwtXFwufFxcLlxcLi8pO1xuICAgIGlmIChjb25zZWNTeW1ib2xNYXRjaCkge1xuICAgICAgZXJyb3JzLnB1c2goJ0J1Y2tldCBuYW1lIG11c3Qgbm90IGhhdmUgZGFzaCBuZXh0IHRvIHBlcmlvZCwgb3IgcGVyaW9kIG5leHQgdG8gZGFzaCwgb3IgY29uc2VjdXRpdmUgcGVyaW9kcyAnXG4gICAgICAgICsgYChvZmZzZXQ6ICR7Y29uc2VjU3ltYm9sTWF0Y2guaW5kZXh9KWApO1xuICAgIH1cbiAgICBpZiAoL15cXGR7MSwzfVxcLlxcZHsxLDN9XFwuXFxkezEsM31cXC5cXGR7MSwzfSQvLnRlc3QoYnVja2V0TmFtZSkpIHtcbiAgICAgIGVycm9ycy5wdXNoKCdCdWNrZXQgbmFtZSBtdXN0IG5vdCByZXNlbWJsZSBhbiBJUCBhZGRyZXNzJyk7XG4gICAgfVxuXG4gICAgaWYgKGVycm9ycy5sZW5ndGggPiAwKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgUzMgYnVja2V0IG5hbWUgKHZhbHVlOiAke2J1Y2tldE5hbWV9KSR7RU9MfSR7ZXJyb3JzLmpvaW4oRU9MKX1gKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgcmVhZG9ubHkgYnVja2V0QXJuOiBzdHJpbmc7XG4gIHB1YmxpYyByZWFkb25seSBidWNrZXROYW1lOiBzdHJpbmc7XG4gIHB1YmxpYyByZWFkb25seSBidWNrZXREb21haW5OYW1lOiBzdHJpbmc7XG4gIHB1YmxpYyByZWFkb25seSBidWNrZXRXZWJzaXRlVXJsOiBzdHJpbmc7XG4gIHB1YmxpYyByZWFkb25seSBidWNrZXRXZWJzaXRlRG9tYWluTmFtZTogc3RyaW5nO1xuICBwdWJsaWMgcmVhZG9ubHkgYnVja2V0RHVhbFN0YWNrRG9tYWluTmFtZTogc3RyaW5nO1xuICBwdWJsaWMgcmVhZG9ubHkgYnVja2V0UmVnaW9uYWxEb21haW5OYW1lOiBzdHJpbmc7XG5cbiAgcHVibGljIHJlYWRvbmx5IGVuY3J5cHRpb25LZXk/OiBrbXMuSUtleTtcbiAgcHVibGljIHJlYWRvbmx5IGlzV2Vic2l0ZT86IGJvb2xlYW47XG4gIHB1YmxpYyBwb2xpY3k/OiBCdWNrZXRQb2xpY3k7XG4gIHByb3RlY3RlZCBhdXRvQ3JlYXRlUG9saWN5ID0gdHJ1ZTtcbiAgcHJvdGVjdGVkIGRpc2FsbG93UHVibGljQWNjZXNzPzogYm9vbGVhbjtcbiAgcHJpdmF0ZSBhY2Nlc3NDb250cm9sPzogQnVja2V0QWNjZXNzQ29udHJvbDtcbiAgcHJpdmF0ZSByZWFkb25seSBsaWZlY3ljbGVSdWxlczogTGlmZWN5Y2xlUnVsZVtdID0gW107XG4gIHByaXZhdGUgcmVhZG9ubHkgZXZlbnRCcmlkZ2VFbmFibGVkPzogYm9vbGVhbjtcbiAgcHJpdmF0ZSByZWFkb25seSBtZXRyaWNzOiBCdWNrZXRNZXRyaWNzW10gPSBbXTtcbiAgcHJpdmF0ZSByZWFkb25seSBjb3JzOiBDb3JzUnVsZVtdID0gW107XG4gIHByaXZhdGUgcmVhZG9ubHkgaW52ZW50b3JpZXM6IEludmVudG9yeVtdID0gW107XG4gIHByaXZhdGUgcmVhZG9ubHkgX3Jlc291cmNlOiBDZm5CdWNrZXQ7XG5cbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IEJ1Y2tldFByb3BzID0ge30pIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHtcbiAgICAgIHBoeXNpY2FsTmFtZTogcHJvcHMuYnVja2V0TmFtZSxcbiAgICB9KTtcblxuICAgIHRoaXMubm90aWZpY2F0aW9uc0hhbmRsZXJSb2xlID0gcHJvcHMubm90aWZpY2F0aW9uc0hhbmRsZXJSb2xlO1xuXG4gICAgY29uc3QgeyBidWNrZXRFbmNyeXB0aW9uLCBlbmNyeXB0aW9uS2V5IH0gPSB0aGlzLnBhcnNlRW5jcnlwdGlvbihwcm9wcyk7XG5cbiAgICBCdWNrZXQudmFsaWRhdGVCdWNrZXROYW1lKHRoaXMucGh5c2ljYWxOYW1lKTtcblxuICAgIGNvbnN0IHdlYnNpdGVDb25maWd1cmF0aW9uID0gdGhpcy5yZW5kZXJXZWJzaXRlQ29uZmlndXJhdGlvbihwcm9wcyk7XG4gICAgdGhpcy5pc1dlYnNpdGUgPSAod2Vic2l0ZUNvbmZpZ3VyYXRpb24gIT09IHVuZGVmaW5lZCk7XG5cbiAgICBjb25zdCBvYmplY3RMb2NrQ29uZmlndXJhdGlvbiA9IHRoaXMucGFyc2VPYmplY3RMb2NrQ29uZmlnKHByb3BzKTtcblxuICAgIGNvbnN0IHJlc291cmNlID0gbmV3IENmbkJ1Y2tldCh0aGlzLCAnUmVzb3VyY2UnLCB7XG4gICAgICBidWNrZXROYW1lOiB0aGlzLnBoeXNpY2FsTmFtZSxcbiAgICAgIGJ1Y2tldEVuY3J5cHRpb24sXG4gICAgICB2ZXJzaW9uaW5nQ29uZmlndXJhdGlvbjogcHJvcHMudmVyc2lvbmVkID8geyBzdGF0dXM6ICdFbmFibGVkJyB9IDogdW5kZWZpbmVkLFxuICAgICAgbGlmZWN5Y2xlQ29uZmlndXJhdGlvbjogTGF6eS5hbnkoeyBwcm9kdWNlOiAoKSA9PiB0aGlzLnBhcnNlTGlmZWN5Y2xlQ29uZmlndXJhdGlvbigpIH0pLFxuICAgICAgd2Vic2l0ZUNvbmZpZ3VyYXRpb24sXG4gICAgICBwdWJsaWNBY2Nlc3NCbG9ja0NvbmZpZ3VyYXRpb246IHByb3BzLmJsb2NrUHVibGljQWNjZXNzLFxuICAgICAgbWV0cmljc0NvbmZpZ3VyYXRpb25zOiBMYXp5LmFueSh7IHByb2R1Y2U6ICgpID0+IHRoaXMucGFyc2VNZXRyaWNDb25maWd1cmF0aW9uKCkgfSksXG4gICAgICBjb3JzQ29uZmlndXJhdGlvbjogTGF6eS5hbnkoeyBwcm9kdWNlOiAoKSA9PiB0aGlzLnBhcnNlQ29yc0NvbmZpZ3VyYXRpb24oKSB9KSxcbiAgICAgIGFjY2Vzc0NvbnRyb2w6IExhenkuc3RyaW5nKHsgcHJvZHVjZTogKCkgPT4gdGhpcy5hY2Nlc3NDb250cm9sIH0pLFxuICAgICAgbG9nZ2luZ0NvbmZpZ3VyYXRpb246IHRoaXMucGFyc2VTZXJ2ZXJBY2Nlc3NMb2dzKHByb3BzKSxcbiAgICAgIGludmVudG9yeUNvbmZpZ3VyYXRpb25zOiBMYXp5LmFueSh7IHByb2R1Y2U6ICgpID0+IHRoaXMucGFyc2VJbnZlbnRvcnlDb25maWd1cmF0aW9uKCkgfSksXG4gICAgICBvd25lcnNoaXBDb250cm9sczogdGhpcy5wYXJzZU93bmVyc2hpcENvbnRyb2xzKHByb3BzKSxcbiAgICAgIGFjY2VsZXJhdGVDb25maWd1cmF0aW9uOiBwcm9wcy50cmFuc2ZlckFjY2VsZXJhdGlvbiA/IHsgYWNjZWxlcmF0aW9uU3RhdHVzOiAnRW5hYmxlZCcgfSA6IHVuZGVmaW5lZCxcbiAgICAgIGludGVsbGlnZW50VGllcmluZ0NvbmZpZ3VyYXRpb25zOiB0aGlzLnBhcnNlVGllcmluZ0NvbmZpZyhwcm9wcyksXG4gICAgICBvYmplY3RMb2NrRW5hYmxlZDogb2JqZWN0TG9ja0NvbmZpZ3VyYXRpb24gPyB0cnVlIDogcHJvcHMub2JqZWN0TG9ja0VuYWJsZWQsXG4gICAgICBvYmplY3RMb2NrQ29uZmlndXJhdGlvbjogb2JqZWN0TG9ja0NvbmZpZ3VyYXRpb24sXG4gICAgfSk7XG4gICAgdGhpcy5fcmVzb3VyY2UgPSByZXNvdXJjZTtcblxuICAgIHJlc291cmNlLmFwcGx5UmVtb3ZhbFBvbGljeShwcm9wcy5yZW1vdmFsUG9saWN5KTtcblxuICAgIHRoaXMuZW5jcnlwdGlvbktleSA9IGVuY3J5cHRpb25LZXk7XG4gICAgdGhpcy5ldmVudEJyaWRnZUVuYWJsZWQgPSBwcm9wcy5ldmVudEJyaWRnZUVuYWJsZWQ7XG5cbiAgICB0aGlzLmJ1Y2tldE5hbWUgPSB0aGlzLmdldFJlc291cmNlTmFtZUF0dHJpYnV0ZShyZXNvdXJjZS5yZWYpO1xuICAgIHRoaXMuYnVja2V0QXJuID0gdGhpcy5nZXRSZXNvdXJjZUFybkF0dHJpYnV0ZShyZXNvdXJjZS5hdHRyQXJuLCB7XG4gICAgICByZWdpb246ICcnLFxuICAgICAgYWNjb3VudDogJycsXG4gICAgICBzZXJ2aWNlOiAnczMnLFxuICAgICAgcmVzb3VyY2U6IHRoaXMucGh5c2ljYWxOYW1lLFxuICAgIH0pO1xuXG4gICAgdGhpcy5idWNrZXREb21haW5OYW1lID0gcmVzb3VyY2UuYXR0ckRvbWFpbk5hbWU7XG4gICAgdGhpcy5idWNrZXRXZWJzaXRlVXJsID0gcmVzb3VyY2UuYXR0cldlYnNpdGVVcmw7XG4gICAgdGhpcy5idWNrZXRXZWJzaXRlRG9tYWluTmFtZSA9IEZuLnNlbGVjdCgyLCBGbi5zcGxpdCgnLycsIHRoaXMuYnVja2V0V2Vic2l0ZVVybCkpO1xuICAgIHRoaXMuYnVja2V0RHVhbFN0YWNrRG9tYWluTmFtZSA9IHJlc291cmNlLmF0dHJEdWFsU3RhY2tEb21haW5OYW1lO1xuICAgIHRoaXMuYnVja2V0UmVnaW9uYWxEb21haW5OYW1lID0gcmVzb3VyY2UuYXR0clJlZ2lvbmFsRG9tYWluTmFtZTtcblxuICAgIHRoaXMuZGlzYWxsb3dQdWJsaWNBY2Nlc3MgPSBwcm9wcy5ibG9ja1B1YmxpY0FjY2VzcyAmJiBwcm9wcy5ibG9ja1B1YmxpY0FjY2Vzcy5ibG9ja1B1YmxpY1BvbGljeTtcbiAgICB0aGlzLmFjY2Vzc0NvbnRyb2wgPSBwcm9wcy5hY2Nlc3NDb250cm9sO1xuXG4gICAgLy8gRW5mb3JjZSBBV1MgRm91bmRhdGlvbmFsIFNlY3VyaXR5IEJlc3QgUHJhY3RpY2VcbiAgICBpZiAocHJvcHMuZW5mb3JjZVNTTCkge1xuICAgICAgdGhpcy5lbmZvcmNlU1NMU3RhdGVtZW50KCk7XG4gICAgfVxuXG4gICAgaWYgKHByb3BzLnNlcnZlckFjY2Vzc0xvZ3NCdWNrZXQgaW5zdGFuY2VvZiBCdWNrZXQpIHtcbiAgICAgIHByb3BzLnNlcnZlckFjY2Vzc0xvZ3NCdWNrZXQuYWxsb3dMb2dEZWxpdmVyeSh0aGlzLCBwcm9wcy5zZXJ2ZXJBY2Nlc3NMb2dzUHJlZml4KTtcbiAgICAvLyBJdCBpcyBwb3NzaWJsZSB0aGF0IGBzZXJ2ZXJBY2Nlc3NMb2dzQnVja2V0YCB3YXMgc3BlY2lmaWVkIGJ1dCBpcyBzb21lIG90aGVyIGBJQnVja2V0YFxuICAgIC8vIHRoYXQgY2Fubm90IGhhdmUgdGhlIEFDTHMgb3IgYnVja2V0IHBvbGljeSBhcHBsaWVkLiBJbiB0aGF0IHNjZW5hcmlvLCB3ZSBzaG91bGQgb25seVxuICAgIC8vIHNldHVwIGxvZyBkZWxpdmVyeSBwZXJtaXNzaW9ucyB0byBgdGhpc2AgaWYgYSBidWNrZXQgd2FzIG5vdCBzcGVjaWZpZWQgYXQgYWxsLCBhcyBkb2N1bWVudGVkLlxuICAgIC8vIEZvciBleGFtcGxlLCB3ZSBzaG91bGQgbm90IGFsbG93IGxvZyBkZWxpdmVyeSB0byBgdGhpc2AgaWYgZ2l2ZW4gYW4gaW1wb3J0ZWQgYnVja2V0IG9yXG4gICAgLy8gYW5vdGhlciBzaXR1YXRpb24gdGhhdCBjYXVzZXMgYGluc3RhbmNlb2ZgIHRvIGZhaWxcbiAgICB9IGVsc2UgaWYgKCFwcm9wcy5zZXJ2ZXJBY2Nlc3NMb2dzQnVja2V0ICYmIHByb3BzLnNlcnZlckFjY2Vzc0xvZ3NQcmVmaXgpIHtcbiAgICAgIHRoaXMuYWxsb3dMb2dEZWxpdmVyeSh0aGlzLCBwcm9wcy5zZXJ2ZXJBY2Nlc3NMb2dzUHJlZml4KTtcbiAgICB9IGVsc2UgaWYgKHByb3BzLnNlcnZlckFjY2Vzc0xvZ3NCdWNrZXQpIHtcbiAgICAgIC8vIEEgYHNlcnZlckFjY2Vzc0xvZ3NCdWNrZXRgIHdhcyBwcm92aWRlZCBidXQgaXQgaXMgbm90IGEgY29uY3JldGUgYEJ1Y2tldGAgYW5kIGl0XG4gICAgICAvLyBtYXkgbm90IGJlIHBvc3NpYmxlIHRvIGNvbmZpZ3VyZSB0aGUgQUNMcyBvciBidWNrZXQgcG9saWN5IGFzIHJlcXVpcmVkLlxuICAgICAgQW5ub3RhdGlvbnMub2YodGhpcykuYWRkV2FybmluZyhcbiAgICAgICAgYFVuYWJsZSB0byBhZGQgbmVjZXNzYXJ5IGxvZ2dpbmcgcGVybWlzc2lvbnMgdG8gaW1wb3J0ZWQgdGFyZ2V0IGJ1Y2tldDogJHtwcm9wcy5zZXJ2ZXJBY2Nlc3NMb2dzQnVja2V0fWAsXG4gICAgICApO1xuICAgIH1cblxuICAgIGZvciAoY29uc3QgaW52ZW50b3J5IG9mIHByb3BzLmludmVudG9yaWVzID8/IFtdKSB7XG4gICAgICB0aGlzLmFkZEludmVudG9yeShpbnZlbnRvcnkpO1xuICAgIH1cblxuICAgIC8vIEFkZCBhbGwgYnVja2V0IG1ldHJpYyBjb25maWd1cmF0aW9ucyBydWxlc1xuICAgIChwcm9wcy5tZXRyaWNzIHx8IFtdKS5mb3JFYWNoKHRoaXMuYWRkTWV0cmljLmJpbmQodGhpcykpO1xuICAgIC8vIEFkZCBhbGwgY29ycyBjb25maWd1cmF0aW9uIHJ1bGVzXG4gICAgKHByb3BzLmNvcnMgfHwgW10pLmZvckVhY2godGhpcy5hZGRDb3JzUnVsZS5iaW5kKHRoaXMpKTtcblxuICAgIC8vIEFkZCBhbGwgbGlmZWN5Y2xlIHJ1bGVzXG4gICAgKHByb3BzLmxpZmVjeWNsZVJ1bGVzIHx8IFtdKS5mb3JFYWNoKHRoaXMuYWRkTGlmZWN5Y2xlUnVsZS5iaW5kKHRoaXMpKTtcblxuICAgIGlmIChwcm9wcy5wdWJsaWNSZWFkQWNjZXNzKSB7XG4gICAgICB0aGlzLmdyYW50UHVibGljQWNjZXNzKCk7XG4gICAgfVxuXG4gICAgaWYgKHByb3BzLmF1dG9EZWxldGVPYmplY3RzKSB7XG4gICAgICBpZiAocHJvcHMucmVtb3ZhbFBvbGljeSAhPT0gUmVtb3ZhbFBvbGljeS5ERVNUUk9ZKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IHVzZSBcXCdhdXRvRGVsZXRlT2JqZWN0c1xcJyBwcm9wZXJ0eSBvbiBhIGJ1Y2tldCB3aXRob3V0IHNldHRpbmcgcmVtb3ZhbCBwb2xpY3kgdG8gXFwnREVTVFJPWVxcJy4nKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5lbmFibGVBdXRvRGVsZXRlT2JqZWN0cygpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmV2ZW50QnJpZGdlRW5hYmxlZCkge1xuICAgICAgdGhpcy5lbmFibGVFdmVudEJyaWRnZU5vdGlmaWNhdGlvbigpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgYSBsaWZlY3ljbGUgcnVsZSB0byB0aGUgYnVja2V0XG4gICAqXG4gICAqIEBwYXJhbSBydWxlIFRoZSBydWxlIHRvIGFkZFxuICAgKi9cbiAgcHVibGljIGFkZExpZmVjeWNsZVJ1bGUocnVsZTogTGlmZWN5Y2xlUnVsZSkge1xuICAgIHRoaXMubGlmZWN5Y2xlUnVsZXMucHVzaChydWxlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGEgbWV0cmljcyBjb25maWd1cmF0aW9uIGZvciB0aGUgQ2xvdWRXYXRjaCByZXF1ZXN0IG1ldHJpY3MgZnJvbSB0aGUgYnVja2V0LlxuICAgKlxuICAgKiBAcGFyYW0gbWV0cmljIFRoZSBtZXRyaWMgY29uZmlndXJhdGlvbiB0byBhZGRcbiAgICovXG4gIHB1YmxpYyBhZGRNZXRyaWMobWV0cmljOiBCdWNrZXRNZXRyaWNzKSB7XG4gICAgdGhpcy5tZXRyaWNzLnB1c2gobWV0cmljKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGEgY3Jvc3Mtb3JpZ2luIGFjY2VzcyBjb25maWd1cmF0aW9uIGZvciBvYmplY3RzIGluIGFuIEFtYXpvbiBTMyBidWNrZXRcbiAgICpcbiAgICogQHBhcmFtIHJ1bGUgVGhlIENPUlMgY29uZmlndXJhdGlvbiBydWxlIHRvIGFkZFxuICAgKi9cbiAgcHVibGljIGFkZENvcnNSdWxlKHJ1bGU6IENvcnNSdWxlKSB7XG4gICAgdGhpcy5jb3JzLnB1c2gocnVsZSk7XG4gIH1cblxuICAvKipcbiAgICogQWRkIGFuIGludmVudG9yeSBjb25maWd1cmF0aW9uLlxuICAgKlxuICAgKiBAcGFyYW0gaW52ZW50b3J5IGNvbmZpZ3VyYXRpb24gdG8gYWRkXG4gICAqL1xuICBwdWJsaWMgYWRkSW52ZW50b3J5KGludmVudG9yeTogSW52ZW50b3J5KTogdm9pZCB7XG4gICAgdGhpcy5pbnZlbnRvcmllcy5wdXNoKGludmVudG9yeSk7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhbiBpYW0gc3RhdGVtZW50IHRvIGVuZm9yY2UgU1NMIHJlcXVlc3RzIG9ubHkuXG4gICAqL1xuICBwcml2YXRlIGVuZm9yY2VTU0xTdGF0ZW1lbnQoKSB7XG4gICAgY29uc3Qgc3RhdGVtZW50ID0gbmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgYWN0aW9uczogWydzMzoqJ10sXG4gICAgICBjb25kaXRpb25zOiB7XG4gICAgICAgIEJvb2w6IHsgJ2F3czpTZWN1cmVUcmFuc3BvcnQnOiAnZmFsc2UnIH0sXG4gICAgICB9LFxuICAgICAgZWZmZWN0OiBpYW0uRWZmZWN0LkRFTlksXG4gICAgICByZXNvdXJjZXM6IFtcbiAgICAgICAgdGhpcy5idWNrZXRBcm4sXG4gICAgICAgIHRoaXMuYXJuRm9yT2JqZWN0cygnKicpLFxuICAgICAgXSxcbiAgICAgIHByaW5jaXBhbHM6IFtuZXcgaWFtLkFueVByaW5jaXBhbCgpXSxcbiAgICB9KTtcbiAgICB0aGlzLmFkZFRvUmVzb3VyY2VQb2xpY3koc3RhdGVtZW50KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgdXAga2V5IHByb3BlcnRpZXMgYW5kIHJldHVybiB0aGUgQnVja2V0IGVuY3J5cHRpb24gcHJvcGVydHkgZnJvbSB0aGVcbiAgICogdXNlcidzIGNvbmZpZ3VyYXRpb24uXG4gICAqL1xuICBwcml2YXRlIHBhcnNlRW5jcnlwdGlvbihwcm9wczogQnVja2V0UHJvcHMpOiB7XG4gICAgYnVja2V0RW5jcnlwdGlvbj86IENmbkJ1Y2tldC5CdWNrZXRFbmNyeXB0aW9uUHJvcGVydHksXG4gICAgZW5jcnlwdGlvbktleT86IGttcy5JS2V5XG4gIH0ge1xuXG4gICAgLy8gZGVmYXVsdCBiYXNlZCBvbiB3aGV0aGVyIGVuY3J5cHRpb25LZXkgaXMgc3BlY2lmaWVkXG4gICAgbGV0IGVuY3J5cHRpb25UeXBlID0gcHJvcHMuZW5jcnlwdGlvbjtcbiAgICBpZiAoZW5jcnlwdGlvblR5cGUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgZW5jcnlwdGlvblR5cGUgPSBwcm9wcy5lbmNyeXB0aW9uS2V5ID8gQnVja2V0RW5jcnlwdGlvbi5LTVMgOiBCdWNrZXRFbmNyeXB0aW9uLlVORU5DUllQVEVEO1xuICAgIH1cblxuICAgIC8vIGlmIGVuY3J5cHRpb24ga2V5IGlzIHNldCwgZW5jcnlwdGlvbiBtdXN0IGJlIHNldCB0byBLTVMuXG4gICAgaWYgKGVuY3J5cHRpb25UeXBlICE9PSBCdWNrZXRFbmNyeXB0aW9uLktNUyAmJiBwcm9wcy5lbmNyeXB0aW9uS2V5KSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYGVuY3J5cHRpb25LZXkgaXMgc3BlY2lmaWVkLCBzbyAnZW5jcnlwdGlvbicgbXVzdCBiZSBzZXQgdG8gS01TICh2YWx1ZTogJHtlbmNyeXB0aW9uVHlwZX0pYCk7XG4gICAgfVxuXG4gICAgLy8gaWYgYnVja2V0S2V5RW5hYmxlZCBpcyBzZXQsIGVuY3J5cHRpb24gbXVzdCBiZSBzZXQgdG8gS01TLlxuICAgIGlmIChwcm9wcy5idWNrZXRLZXlFbmFibGVkICYmICFbQnVja2V0RW5jcnlwdGlvbi5LTVMsIEJ1Y2tldEVuY3J5cHRpb24uS01TX01BTkFHRURdLmluY2x1ZGVzKGVuY3J5cHRpb25UeXBlKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBidWNrZXRLZXlFbmFibGVkIGlzIHNwZWNpZmllZCwgc28gJ2VuY3J5cHRpb24nIG11c3QgYmUgc2V0IHRvIEtNUyAodmFsdWU6ICR7ZW5jcnlwdGlvblR5cGV9KWApO1xuICAgIH1cblxuICAgIGlmIChlbmNyeXB0aW9uVHlwZSA9PT0gQnVja2V0RW5jcnlwdGlvbi5VTkVOQ1JZUFRFRCkge1xuICAgICAgcmV0dXJuIHsgYnVja2V0RW5jcnlwdGlvbjogdW5kZWZpbmVkLCBlbmNyeXB0aW9uS2V5OiB1bmRlZmluZWQgfTtcbiAgICB9XG5cbiAgICBpZiAoZW5jcnlwdGlvblR5cGUgPT09IEJ1Y2tldEVuY3J5cHRpb24uS01TKSB7XG4gICAgICBjb25zdCBlbmNyeXB0aW9uS2V5ID0gcHJvcHMuZW5jcnlwdGlvbktleSB8fCBuZXcga21zLktleSh0aGlzLCAnS2V5Jywge1xuICAgICAgICBkZXNjcmlwdGlvbjogYENyZWF0ZWQgYnkgJHt0aGlzLm5vZGUucGF0aH1gLFxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IGJ1Y2tldEVuY3J5cHRpb24gPSB7XG4gICAgICAgIHNlcnZlclNpZGVFbmNyeXB0aW9uQ29uZmlndXJhdGlvbjogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGJ1Y2tldEtleUVuYWJsZWQ6IHByb3BzLmJ1Y2tldEtleUVuYWJsZWQsXG4gICAgICAgICAgICBzZXJ2ZXJTaWRlRW5jcnlwdGlvbkJ5RGVmYXVsdDoge1xuICAgICAgICAgICAgICBzc2VBbGdvcml0aG06ICdhd3M6a21zJyxcbiAgICAgICAgICAgICAga21zTWFzdGVyS2V5SWQ6IGVuY3J5cHRpb25LZXkua2V5QXJuLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfTtcbiAgICAgIHJldHVybiB7IGVuY3J5cHRpb25LZXksIGJ1Y2tldEVuY3J5cHRpb24gfTtcbiAgICB9XG5cbiAgICBpZiAoZW5jcnlwdGlvblR5cGUgPT09IEJ1Y2tldEVuY3J5cHRpb24uUzNfTUFOQUdFRCkge1xuICAgICAgY29uc3QgYnVja2V0RW5jcnlwdGlvbiA9IHtcbiAgICAgICAgc2VydmVyU2lkZUVuY3J5cHRpb25Db25maWd1cmF0aW9uOiBbXG4gICAgICAgICAgeyBzZXJ2ZXJTaWRlRW5jcnlwdGlvbkJ5RGVmYXVsdDogeyBzc2VBbGdvcml0aG06ICdBRVMyNTYnIH0gfSxcbiAgICAgICAgXSxcbiAgICAgIH07XG5cbiAgICAgIHJldHVybiB7IGJ1Y2tldEVuY3J5cHRpb24gfTtcbiAgICB9XG5cbiAgICBpZiAoZW5jcnlwdGlvblR5cGUgPT09IEJ1Y2tldEVuY3J5cHRpb24uS01TX01BTkFHRUQpIHtcbiAgICAgIGNvbnN0IGJ1Y2tldEVuY3J5cHRpb24gPSB7XG4gICAgICAgIHNlcnZlclNpZGVFbmNyeXB0aW9uQ29uZmlndXJhdGlvbjogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGJ1Y2tldEtleUVuYWJsZWQ6IHByb3BzLmJ1Y2tldEtleUVuYWJsZWQsXG4gICAgICAgICAgICBzZXJ2ZXJTaWRlRW5jcnlwdGlvbkJ5RGVmYXVsdDogeyBzc2VBbGdvcml0aG06ICdhd3M6a21zJyB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9O1xuICAgICAgcmV0dXJuIHsgYnVja2V0RW5jcnlwdGlvbiB9O1xuICAgIH1cblxuICAgIHRocm93IG5ldyBFcnJvcihgVW5leHBlY3RlZCAnZW5jcnlwdGlvblR5cGUnOiAke2VuY3J5cHRpb25UeXBlfWApO1xuICB9XG5cbiAgLyoqXG4gICAqIFBhcnNlIHRoZSBsaWZlY3ljbGUgY29uZmlndXJhdGlvbiBvdXQgb2YgdGhlIGJ1Y2tldCBwcm9wc1xuICAgKiBAcGFyYW0gcHJvcHMgUGFyXG4gICAqL1xuICBwcml2YXRlIHBhcnNlTGlmZWN5Y2xlQ29uZmlndXJhdGlvbigpOiBDZm5CdWNrZXQuTGlmZWN5Y2xlQ29uZmlndXJhdGlvblByb3BlcnR5IHwgdW5kZWZpbmVkIHtcbiAgICBpZiAoIXRoaXMubGlmZWN5Y2xlUnVsZXMgfHwgdGhpcy5saWZlY3ljbGVSdWxlcy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgICByZXR1cm4geyBydWxlczogdGhpcy5saWZlY3ljbGVSdWxlcy5tYXAocGFyc2VMaWZlY3ljbGVSdWxlKSB9O1xuXG4gICAgZnVuY3Rpb24gcGFyc2VMaWZlY3ljbGVSdWxlKHJ1bGU6IExpZmVjeWNsZVJ1bGUpOiBDZm5CdWNrZXQuUnVsZVByb3BlcnR5IHtcbiAgICAgIGNvbnN0IGVuYWJsZWQgPSBydWxlLmVuYWJsZWQgPz8gdHJ1ZTtcblxuICAgICAgY29uc3QgeDogQ2ZuQnVja2V0LlJ1bGVQcm9wZXJ0eSA9IHtcbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG1heC1sZW5cbiAgICAgICAgYWJvcnRJbmNvbXBsZXRlTXVsdGlwYXJ0VXBsb2FkOiBydWxlLmFib3J0SW5jb21wbGV0ZU11bHRpcGFydFVwbG9hZEFmdGVyICE9PSB1bmRlZmluZWQgPyB7IGRheXNBZnRlckluaXRpYXRpb246IHJ1bGUuYWJvcnRJbmNvbXBsZXRlTXVsdGlwYXJ0VXBsb2FkQWZ0ZXIudG9EYXlzKCkgfSA6IHVuZGVmaW5lZCxcbiAgICAgICAgZXhwaXJhdGlvbkRhdGU6IHJ1bGUuZXhwaXJhdGlvbkRhdGUsXG4gICAgICAgIGV4cGlyYXRpb25JbkRheXM6IHJ1bGUuZXhwaXJhdGlvbj8udG9EYXlzKCksXG4gICAgICAgIGlkOiBydWxlLmlkLFxuICAgICAgICBub25jdXJyZW50VmVyc2lvbkV4cGlyYXRpb246IHJ1bGUubm9uY3VycmVudFZlcnNpb25FeHBpcmF0aW9uICYmIHtcbiAgICAgICAgICBub25jdXJyZW50RGF5czogcnVsZS5ub25jdXJyZW50VmVyc2lvbkV4cGlyYXRpb24udG9EYXlzKCksXG4gICAgICAgICAgbmV3ZXJOb25jdXJyZW50VmVyc2lvbnM6IHJ1bGUubm9uY3VycmVudFZlcnNpb25zVG9SZXRhaW4sXG4gICAgICAgIH0sXG4gICAgICAgIG5vbmN1cnJlbnRWZXJzaW9uVHJhbnNpdGlvbnM6IG1hcE9yVW5kZWZpbmVkKHJ1bGUubm9uY3VycmVudFZlcnNpb25UcmFuc2l0aW9ucywgdCA9PiAoe1xuICAgICAgICAgIHN0b3JhZ2VDbGFzczogdC5zdG9yYWdlQ2xhc3MudmFsdWUsXG4gICAgICAgICAgdHJhbnNpdGlvbkluRGF5czogdC50cmFuc2l0aW9uQWZ0ZXIudG9EYXlzKCksXG4gICAgICAgICAgbmV3ZXJOb25jdXJyZW50VmVyc2lvbnM6IHQubm9uY3VycmVudFZlcnNpb25zVG9SZXRhaW4sXG4gICAgICAgIH0pKSxcbiAgICAgICAgcHJlZml4OiBydWxlLnByZWZpeCxcbiAgICAgICAgc3RhdHVzOiBlbmFibGVkID8gJ0VuYWJsZWQnIDogJ0Rpc2FibGVkJyxcbiAgICAgICAgdHJhbnNpdGlvbnM6IG1hcE9yVW5kZWZpbmVkKHJ1bGUudHJhbnNpdGlvbnMsIHQgPT4gKHtcbiAgICAgICAgICBzdG9yYWdlQ2xhc3M6IHQuc3RvcmFnZUNsYXNzLnZhbHVlLFxuICAgICAgICAgIHRyYW5zaXRpb25EYXRlOiB0LnRyYW5zaXRpb25EYXRlLFxuICAgICAgICAgIHRyYW5zaXRpb25JbkRheXM6IHQudHJhbnNpdGlvbkFmdGVyICYmIHQudHJhbnNpdGlvbkFmdGVyLnRvRGF5cygpLFxuICAgICAgICB9KSksXG4gICAgICAgIGV4cGlyZWRPYmplY3REZWxldGVNYXJrZXI6IHJ1bGUuZXhwaXJlZE9iamVjdERlbGV0ZU1hcmtlcixcbiAgICAgICAgdGFnRmlsdGVyczogc2VsZi5wYXJzZVRhZ0ZpbHRlcnMocnVsZS50YWdGaWx0ZXJzKSxcbiAgICAgICAgb2JqZWN0U2l6ZUxlc3NUaGFuOiBydWxlLm9iamVjdFNpemVMZXNzVGhhbixcbiAgICAgICAgb2JqZWN0U2l6ZUdyZWF0ZXJUaGFuOiBydWxlLm9iamVjdFNpemVHcmVhdGVyVGhhbixcbiAgICAgIH07XG5cbiAgICAgIHJldHVybiB4O1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgcGFyc2VTZXJ2ZXJBY2Nlc3NMb2dzKHByb3BzOiBCdWNrZXRQcm9wcyk6IENmbkJ1Y2tldC5Mb2dnaW5nQ29uZmlndXJhdGlvblByb3BlcnR5IHwgdW5kZWZpbmVkIHtcbiAgICBpZiAoIXByb3BzLnNlcnZlckFjY2Vzc0xvZ3NCdWNrZXQgJiYgIXByb3BzLnNlcnZlckFjY2Vzc0xvZ3NQcmVmaXgpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgaWYgKFxuICAgICAgLy8gS01TIGNhbid0IGJlIHVzZWQgZm9yIGxvZ2dpbmcgc2luY2UgdGhlIGxvZ2dpbmcgc2VydmljZSBjYW4ndCB1c2UgdGhlIGtleSAtIGxvZ3MgZG9uJ3Qgd3JpdGVcbiAgICAgIC8vIEtNU19NQU5BR0VEIGNhbid0IGJlIHVzZWQgZm9yIGxvZ2dpbmcgc2luY2UgdGhlIGFjY291bnQgY2FuJ3QgYWNjZXNzIHRoZSBsb2dnaW5nIHNlcnZpY2Uga2V5IC0gYWNjb3VudCBjYW4ndCByZWFkIGxvZ3NcbiAgICAgICghcHJvcHMuc2VydmVyQWNjZXNzTG9nc0J1Y2tldCAmJiAoXG4gICAgICAgIHByb3BzLmVuY3J5cHRpb25LZXkgfHxcbiAgICAgICAgcHJvcHMuZW5jcnlwdGlvbiA9PT0gQnVja2V0RW5jcnlwdGlvbi5LTVNfTUFOQUdFRCB8fFxuICAgICAgICBwcm9wcy5lbmNyeXB0aW9uID09PSBCdWNrZXRFbmNyeXB0aW9uLktNUyApKSB8fFxuICAgICAgLy8gQW5vdGhlciBidWNrZXQgaXMgYmVpbmcgdXNlZCB0aGF0IGlzIGNvbmZpZ3VyZWQgZm9yIGRlZmF1bHQgU1NFLUtNU1xuICAgICAgcHJvcHMuc2VydmVyQWNjZXNzTG9nc0J1Y2tldD8uZW5jcnlwdGlvbktleVxuICAgICkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdTU0UtUzMgaXMgdGhlIG9ubHkgc3VwcG9ydGVkIGRlZmF1bHQgYnVja2V0IGVuY3J5cHRpb24gZm9yIFNlcnZlciBBY2Nlc3MgTG9nZ2luZyB0YXJnZXQgYnVja2V0cycpO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBkZXN0aW5hdGlvbkJ1Y2tldE5hbWU6IHByb3BzLnNlcnZlckFjY2Vzc0xvZ3NCdWNrZXQ/LmJ1Y2tldE5hbWUsXG4gICAgICBsb2dGaWxlUHJlZml4OiBwcm9wcy5zZXJ2ZXJBY2Nlc3NMb2dzUHJlZml4LFxuICAgIH07XG4gIH1cblxuICBwcml2YXRlIHBhcnNlTWV0cmljQ29uZmlndXJhdGlvbigpOiBDZm5CdWNrZXQuTWV0cmljc0NvbmZpZ3VyYXRpb25Qcm9wZXJ0eVtdIHwgdW5kZWZpbmVkIHtcbiAgICBpZiAoIXRoaXMubWV0cmljcyB8fCB0aGlzLm1ldHJpY3MubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgcmV0dXJuIHRoaXMubWV0cmljcy5tYXAocGFyc2VNZXRyaWMpO1xuXG4gICAgZnVuY3Rpb24gcGFyc2VNZXRyaWMobWV0cmljOiBCdWNrZXRNZXRyaWNzKTogQ2ZuQnVja2V0Lk1ldHJpY3NDb25maWd1cmF0aW9uUHJvcGVydHkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgaWQ6IG1ldHJpYy5pZCxcbiAgICAgICAgcHJlZml4OiBtZXRyaWMucHJlZml4LFxuICAgICAgICB0YWdGaWx0ZXJzOiBzZWxmLnBhcnNlVGFnRmlsdGVycyhtZXRyaWMudGFnRmlsdGVycyksXG4gICAgICB9O1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgcGFyc2VDb3JzQ29uZmlndXJhdGlvbigpOiBDZm5CdWNrZXQuQ29yc0NvbmZpZ3VyYXRpb25Qcm9wZXJ0eSB8IHVuZGVmaW5lZCB7XG4gICAgaWYgKCF0aGlzLmNvcnMgfHwgdGhpcy5jb3JzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICByZXR1cm4geyBjb3JzUnVsZXM6IHRoaXMuY29ycy5tYXAocGFyc2VDb3JzKSB9O1xuXG4gICAgZnVuY3Rpb24gcGFyc2VDb3JzKHJ1bGU6IENvcnNSdWxlKTogQ2ZuQnVja2V0LkNvcnNSdWxlUHJvcGVydHkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgaWQ6IHJ1bGUuaWQsXG4gICAgICAgIG1heEFnZTogcnVsZS5tYXhBZ2UsXG4gICAgICAgIGFsbG93ZWRIZWFkZXJzOiBydWxlLmFsbG93ZWRIZWFkZXJzLFxuICAgICAgICBhbGxvd2VkTWV0aG9kczogcnVsZS5hbGxvd2VkTWV0aG9kcyxcbiAgICAgICAgYWxsb3dlZE9yaWdpbnM6IHJ1bGUuYWxsb3dlZE9yaWdpbnMsXG4gICAgICAgIGV4cG9zZWRIZWFkZXJzOiBydWxlLmV4cG9zZWRIZWFkZXJzLFxuICAgICAgfTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHBhcnNlVGFnRmlsdGVycyh0YWdGaWx0ZXJzPzogeyBbdGFnOiBzdHJpbmddOiBhbnkgfSkge1xuICAgIGlmICghdGFnRmlsdGVycyB8fCB0YWdGaWx0ZXJzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICByZXR1cm4gT2JqZWN0LmtleXModGFnRmlsdGVycykubWFwKHRhZyA9PiAoe1xuICAgICAga2V5OiB0YWcsXG4gICAgICB2YWx1ZTogdGFnRmlsdGVyc1t0YWddLFxuICAgIH0pKTtcbiAgfVxuXG4gIHByaXZhdGUgcGFyc2VPd25lcnNoaXBDb250cm9scyh7IG9iamVjdE93bmVyc2hpcCB9OiBCdWNrZXRQcm9wcyk6IENmbkJ1Y2tldC5Pd25lcnNoaXBDb250cm9sc1Byb3BlcnR5IHwgdW5kZWZpbmVkIHtcbiAgICBpZiAoIW9iamVjdE93bmVyc2hpcCkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgIHJ1bGVzOiBbe1xuICAgICAgICBvYmplY3RPd25lcnNoaXAsXG4gICAgICB9XSxcbiAgICB9O1xuICB9XG5cbiAgcHJpdmF0ZSBwYXJzZVRpZXJpbmdDb25maWcoeyBpbnRlbGxpZ2VudFRpZXJpbmdDb25maWd1cmF0aW9ucyB9OiBCdWNrZXRQcm9wcyk6IENmbkJ1Y2tldC5JbnRlbGxpZ2VudFRpZXJpbmdDb25maWd1cmF0aW9uUHJvcGVydHlbXSB8IHVuZGVmaW5lZCB7XG4gICAgaWYgKCFpbnRlbGxpZ2VudFRpZXJpbmdDb25maWd1cmF0aW9ucykge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICByZXR1cm4gaW50ZWxsaWdlbnRUaWVyaW5nQ29uZmlndXJhdGlvbnMubWFwKGNvbmZpZyA9PiB7XG4gICAgICBjb25zdCB0aWVyaW5ncyA9IFtdO1xuICAgICAgaWYgKGNvbmZpZy5hcmNoaXZlQWNjZXNzVGllclRpbWUpIHtcbiAgICAgICAgdGllcmluZ3MucHVzaCh7XG4gICAgICAgICAgYWNjZXNzVGllcjogJ0FSQ0hJVkVfQUNDRVNTJyxcbiAgICAgICAgICBkYXlzOiBjb25maWcuYXJjaGl2ZUFjY2Vzc1RpZXJUaW1lLnRvRGF5cyh7IGludGVncmFsOiB0cnVlIH0pLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGlmIChjb25maWcuZGVlcEFyY2hpdmVBY2Nlc3NUaWVyVGltZSkge1xuICAgICAgICB0aWVyaW5ncy5wdXNoKHtcbiAgICAgICAgICBhY2Nlc3NUaWVyOiAnREVFUF9BUkNISVZFX0FDQ0VTUycsXG4gICAgICAgICAgZGF5czogY29uZmlnLmRlZXBBcmNoaXZlQWNjZXNzVGllclRpbWUudG9EYXlzKHsgaW50ZWdyYWw6IHRydWUgfSksXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgaWQ6IGNvbmZpZy5uYW1lLFxuICAgICAgICBwcmVmaXg6IGNvbmZpZy5wcmVmaXgsXG4gICAgICAgIHN0YXR1czogJ0VuYWJsZWQnLFxuICAgICAgICB0YWdGaWx0ZXJzOiBjb25maWcudGFncyxcbiAgICAgICAgdGllcmluZ3M6IHRpZXJpbmdzLFxuICAgICAgfTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgcGFyc2VPYmplY3RMb2NrQ29uZmlnKHByb3BzOiBCdWNrZXRQcm9wcyk6IENmbkJ1Y2tldC5PYmplY3RMb2NrQ29uZmlndXJhdGlvblByb3BlcnR5IHwgdW5kZWZpbmVkIHtcbiAgICBjb25zdCB7IG9iamVjdExvY2tFbmFibGVkLCBvYmplY3RMb2NrRGVmYXVsdFJldGVudGlvbiB9ID0gcHJvcHM7XG5cbiAgICBpZiAoIW9iamVjdExvY2tEZWZhdWx0UmV0ZW50aW9uKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgICBpZiAob2JqZWN0TG9ja0VuYWJsZWQgPT09IGZhbHNlICYmIG9iamVjdExvY2tEZWZhdWx0UmV0ZW50aW9uKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ09iamVjdCBMb2NrIG11c3QgYmUgZW5hYmxlZCB0byBjb25maWd1cmUgZGVmYXVsdCByZXRlbnRpb24gc2V0dGluZ3MnKTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgb2JqZWN0TG9ja0VuYWJsZWQ6ICdFbmFibGVkJyxcbiAgICAgIHJ1bGU6IHtcbiAgICAgICAgZGVmYXVsdFJldGVudGlvbjoge1xuICAgICAgICAgIGRheXM6IG9iamVjdExvY2tEZWZhdWx0UmV0ZW50aW9uLmR1cmF0aW9uLnRvRGF5cygpLFxuICAgICAgICAgIG1vZGU6IG9iamVjdExvY2tEZWZhdWx0UmV0ZW50aW9uLm1vZGUsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH07XG4gIH1cblxuICBwcml2YXRlIHJlbmRlcldlYnNpdGVDb25maWd1cmF0aW9uKHByb3BzOiBCdWNrZXRQcm9wcyk6IENmbkJ1Y2tldC5XZWJzaXRlQ29uZmlndXJhdGlvblByb3BlcnR5IHwgdW5kZWZpbmVkIHtcbiAgICBpZiAoIXByb3BzLndlYnNpdGVFcnJvckRvY3VtZW50ICYmICFwcm9wcy53ZWJzaXRlSW5kZXhEb2N1bWVudCAmJiAhcHJvcHMud2Vic2l0ZVJlZGlyZWN0ICYmICFwcm9wcy53ZWJzaXRlUm91dGluZ1J1bGVzKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIGlmIChwcm9wcy53ZWJzaXRlRXJyb3JEb2N1bWVudCAmJiAhcHJvcHMud2Vic2l0ZUluZGV4RG9jdW1lbnQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignXCJ3ZWJzaXRlSW5kZXhEb2N1bWVudFwiIGlzIHJlcXVpcmVkIGlmIFwid2Vic2l0ZUVycm9yRG9jdW1lbnRcIiBpcyBzZXQnKTtcbiAgICB9XG5cbiAgICBpZiAocHJvcHMud2Vic2l0ZVJlZGlyZWN0ICYmIChwcm9wcy53ZWJzaXRlRXJyb3JEb2N1bWVudCB8fCBwcm9wcy53ZWJzaXRlSW5kZXhEb2N1bWVudCB8fCBwcm9wcy53ZWJzaXRlUm91dGluZ1J1bGVzKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdcIndlYnNpdGVJbmRleERvY3VtZW50XCIsIFwid2Vic2l0ZUVycm9yRG9jdW1lbnRcIiBhbmQsIFwid2Vic2l0ZVJvdXRpbmdSdWxlc1wiIGNhbm5vdCBiZSBzZXQgaWYgXCJ3ZWJzaXRlUmVkaXJlY3RcIiBpcyB1c2VkJyk7XG4gICAgfVxuXG4gICAgY29uc3Qgcm91dGluZ1J1bGVzID0gcHJvcHMud2Vic2l0ZVJvdXRpbmdSdWxlcyA/IHByb3BzLndlYnNpdGVSb3V0aW5nUnVsZXMubWFwPENmbkJ1Y2tldC5Sb3V0aW5nUnVsZVByb3BlcnR5PigocnVsZSkgPT4ge1xuICAgICAgaWYgKHJ1bGUuY29uZGl0aW9uICYmICFydWxlLmNvbmRpdGlvbi5odHRwRXJyb3JDb2RlUmV0dXJuZWRFcXVhbHMgJiYgIXJ1bGUuY29uZGl0aW9uLmtleVByZWZpeEVxdWFscykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSBjb25kaXRpb24gcHJvcGVydHkgY2Fubm90IGJlIGFuIGVtcHR5IG9iamVjdCcpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4ge1xuICAgICAgICByZWRpcmVjdFJ1bGU6IHtcbiAgICAgICAgICBob3N0TmFtZTogcnVsZS5ob3N0TmFtZSxcbiAgICAgICAgICBodHRwUmVkaXJlY3RDb2RlOiBydWxlLmh0dHBSZWRpcmVjdENvZGUsXG4gICAgICAgICAgcHJvdG9jb2w6IHJ1bGUucHJvdG9jb2wsXG4gICAgICAgICAgcmVwbGFjZUtleVdpdGg6IHJ1bGUucmVwbGFjZUtleSAmJiBydWxlLnJlcGxhY2VLZXkud2l0aEtleSxcbiAgICAgICAgICByZXBsYWNlS2V5UHJlZml4V2l0aDogcnVsZS5yZXBsYWNlS2V5ICYmIHJ1bGUucmVwbGFjZUtleS5wcmVmaXhXaXRoS2V5LFxuICAgICAgICB9LFxuICAgICAgICByb3V0aW5nUnVsZUNvbmRpdGlvbjogcnVsZS5jb25kaXRpb24sXG4gICAgICB9O1xuICAgIH0pIDogdW5kZWZpbmVkO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGluZGV4RG9jdW1lbnQ6IHByb3BzLndlYnNpdGVJbmRleERvY3VtZW50LFxuICAgICAgZXJyb3JEb2N1bWVudDogcHJvcHMud2Vic2l0ZUVycm9yRG9jdW1lbnQsXG4gICAgICByZWRpcmVjdEFsbFJlcXVlc3RzVG86IHByb3BzLndlYnNpdGVSZWRpcmVjdCxcbiAgICAgIHJvdXRpbmdSdWxlcyxcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIEFsbG93cyBMb2cgRGVsaXZlcnkgdG8gdGhlIFMzIGJ1Y2tldCwgdXNpbmcgYSBCdWNrZXQgUG9saWN5IGlmIHRoZSByZWxldmFudCBmZWF0dXJlXG4gICAqIGZsYWcgaXMgZW5hYmxlZCwgb3RoZXJ3aXNlIHRoZSBjYW5uZWQgQUNMIGlzIHVzZWQuXG4gICAqXG4gICAqIElmIGxvZyBkZWxpdmVyeSBpcyB0byBiZSBhbGxvd2VkIHVzaW5nIHRoZSBBQ0wgYW5kIGFuIEFDTCBoYXMgYWxyZWFkeSBiZWVuIHNldCwgdGhpcyBmYWlscy5cbiAgICpcbiAgICogQHNlZVxuICAgKiBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQW1hem9uUzMvbGF0ZXN0L3VzZXJndWlkZS9lbmFibGUtc2VydmVyLWFjY2Vzcy1sb2dnaW5nLmh0bWxcbiAgICovXG4gIHByaXZhdGUgYWxsb3dMb2dEZWxpdmVyeShmcm9tOiBJQnVja2V0LCBwcmVmaXg/OiBzdHJpbmcpIHtcbiAgICBpZiAoRmVhdHVyZUZsYWdzLm9mKHRoaXMpLmlzRW5hYmxlZChjeGFwaS5TM19TRVJWRVJfQUNDRVNTX0xPR1NfVVNFX0JVQ0tFVF9QT0xJQ1kpKSB7XG4gICAgICBsZXQgY29uZGl0aW9ucyA9IHVuZGVmaW5lZDtcbiAgICAgIC8vIFRoZSBjb25kaXRpb25zIGZvciB0aGUgYnVja2V0IHBvbGljeSBjYW4gYmUgYXBwbGllZCBvbmx5IHdoZW4gdGhlIGJ1Y2tldHMgYXJlIGluXG4gICAgICAvLyB0aGUgc2FtZSBzdGFjayBhbmQgYSBjb25jcmV0ZSBidWNrZXQgaW5zdGFuY2UgKG5vdCBpbXBvcnRlZCkuIE90aGVyd2lzZSwgdGhlXG4gICAgICAvLyBuZWNlc3NhcnkgaW1wb3J0cyBtYXkgcmVzdWx0IGluIGEgY3ljbGljIGRlcGVuZGVuY3kgYmV0d2VlbiB0aGUgc3RhY2tzLlxuICAgICAgaWYgKGZyb20gaW5zdGFuY2VvZiBCdWNrZXQgJiYgU3RhY2sub2YodGhpcykgPT09IFN0YWNrLm9mKGZyb20pKSB7XG4gICAgICAgIGNvbmRpdGlvbnMgPSB7XG4gICAgICAgICAgQXJuTGlrZToge1xuICAgICAgICAgICAgJ2F3czpTb3VyY2VBcm4nOiBmcm9tLmJ1Y2tldEFybixcbiAgICAgICAgICB9LFxuICAgICAgICAgIFN0cmluZ0VxdWFsczoge1xuICAgICAgICAgICAgJ2F3czpTb3VyY2VBY2NvdW50JzogZnJvbS5lbnYuYWNjb3VudCxcbiAgICAgICAgICB9LFxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgdGhpcy5hZGRUb1Jlc291cmNlUG9saWN5KG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcbiAgICAgICAgZWZmZWN0OiBpYW0uRWZmZWN0LkFMTE9XLFxuICAgICAgICBwcmluY2lwYWxzOiBbbmV3IGlhbS5TZXJ2aWNlUHJpbmNpcGFsKCdsb2dnaW5nLnMzLmFtYXpvbmF3cy5jb20nKV0sXG4gICAgICAgIGFjdGlvbnM6IFsnczM6UHV0T2JqZWN0J10sXG4gICAgICAgIHJlc291cmNlczogW3RoaXMuYXJuRm9yT2JqZWN0cyhwcmVmaXggPyBgJHtwcmVmaXh9KmAgOiAnKicpXSxcbiAgICAgICAgY29uZGl0aW9uczogY29uZGl0aW9ucyxcbiAgICAgIH0pKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuYWNjZXNzQ29udHJvbCAmJiB0aGlzLmFjY2Vzc0NvbnRyb2wgIT09IEJ1Y2tldEFjY2Vzc0NvbnRyb2wuTE9HX0RFTElWRVJZX1dSSVRFKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZW5hYmxlIGxvZyBkZWxpdmVyeSB0byB0aGlzIGJ1Y2tldCBiZWNhdXNlIHRoZSBidWNrZXQncyBBQ0wgaGFzIGJlZW4gc2V0IGFuZCBjYW4ndCBiZSBjaGFuZ2VkXCIpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmFjY2Vzc0NvbnRyb2wgPSBCdWNrZXRBY2Nlc3NDb250cm9sLkxPR19ERUxJVkVSWV9XUklURTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHBhcnNlSW52ZW50b3J5Q29uZmlndXJhdGlvbigpOiBDZm5CdWNrZXQuSW52ZW50b3J5Q29uZmlndXJhdGlvblByb3BlcnR5W10gfCB1bmRlZmluZWQge1xuICAgIGlmICghdGhpcy5pbnZlbnRvcmllcyB8fCB0aGlzLmludmVudG9yaWVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5pbnZlbnRvcmllcy5tYXAoKGludmVudG9yeSwgaW5kZXgpID0+IHtcbiAgICAgIGNvbnN0IGZvcm1hdCA9IGludmVudG9yeS5mb3JtYXQgPz8gSW52ZW50b3J5Rm9ybWF0LkNTVjtcbiAgICAgIGNvbnN0IGZyZXF1ZW5jeSA9IGludmVudG9yeS5mcmVxdWVuY3kgPz8gSW52ZW50b3J5RnJlcXVlbmN5LldFRUtMWTtcbiAgICAgIGNvbnN0IGlkID0gaW52ZW50b3J5LmludmVudG9yeUlkID8/IGAke3RoaXMubm9kZS5pZH1JbnZlbnRvcnkke2luZGV4fWA7XG5cbiAgICAgIGlmIChpbnZlbnRvcnkuZGVzdGluYXRpb24uYnVja2V0IGluc3RhbmNlb2YgQnVja2V0KSB7XG4gICAgICAgIGludmVudG9yeS5kZXN0aW5hdGlvbi5idWNrZXQuYWRkVG9SZXNvdXJjZVBvbGljeShuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XG4gICAgICAgICAgZWZmZWN0OiBpYW0uRWZmZWN0LkFMTE9XLFxuICAgICAgICAgIGFjdGlvbnM6IFsnczM6UHV0T2JqZWN0J10sXG4gICAgICAgICAgcmVzb3VyY2VzOiBbXG4gICAgICAgICAgICBpbnZlbnRvcnkuZGVzdGluYXRpb24uYnVja2V0LmJ1Y2tldEFybixcbiAgICAgICAgICAgIGludmVudG9yeS5kZXN0aW5hdGlvbi5idWNrZXQuYXJuRm9yT2JqZWN0cyhgJHtpbnZlbnRvcnkuZGVzdGluYXRpb24ucHJlZml4ID8/ICcnfSpgKSxcbiAgICAgICAgICBdLFxuICAgICAgICAgIHByaW5jaXBhbHM6IFtuZXcgaWFtLlNlcnZpY2VQcmluY2lwYWwoJ3MzLmFtYXpvbmF3cy5jb20nKV0sXG4gICAgICAgICAgY29uZGl0aW9uczoge1xuICAgICAgICAgICAgQXJuTGlrZToge1xuICAgICAgICAgICAgICAnYXdzOlNvdXJjZUFybic6IHRoaXMuYnVja2V0QXJuLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9KSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIGlkLFxuICAgICAgICBkZXN0aW5hdGlvbjoge1xuICAgICAgICAgIGJ1Y2tldEFybjogaW52ZW50b3J5LmRlc3RpbmF0aW9uLmJ1Y2tldC5idWNrZXRBcm4sXG4gICAgICAgICAgYnVja2V0QWNjb3VudElkOiBpbnZlbnRvcnkuZGVzdGluYXRpb24uYnVja2V0T3duZXIsXG4gICAgICAgICAgcHJlZml4OiBpbnZlbnRvcnkuZGVzdGluYXRpb24ucHJlZml4LFxuICAgICAgICAgIGZvcm1hdCxcbiAgICAgICAgfSxcbiAgICAgICAgZW5hYmxlZDogaW52ZW50b3J5LmVuYWJsZWQgPz8gdHJ1ZSxcbiAgICAgICAgaW5jbHVkZWRPYmplY3RWZXJzaW9uczogaW52ZW50b3J5LmluY2x1ZGVPYmplY3RWZXJzaW9ucyA/PyBJbnZlbnRvcnlPYmplY3RWZXJzaW9uLkFMTCxcbiAgICAgICAgc2NoZWR1bGVGcmVxdWVuY3k6IGZyZXF1ZW5jeSxcbiAgICAgICAgb3B0aW9uYWxGaWVsZHM6IGludmVudG9yeS5vcHRpb25hbEZpZWxkcyxcbiAgICAgICAgcHJlZml4OiBpbnZlbnRvcnkub2JqZWN0c1ByZWZpeCxcbiAgICAgIH07XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIGVuYWJsZUF1dG9EZWxldGVPYmplY3RzKCkge1xuICAgIGNvbnN0IHByb3ZpZGVyID0gQ3VzdG9tUmVzb3VyY2VQcm92aWRlci5nZXRPckNyZWF0ZVByb3ZpZGVyKHRoaXMsIEFVVE9fREVMRVRFX09CSkVDVFNfUkVTT1VSQ0VfVFlQRSwge1xuICAgICAgY29kZURpcmVjdG9yeTogcGF0aC5qb2luKF9fZGlybmFtZSwgJ2F1dG8tZGVsZXRlLW9iamVjdHMtaGFuZGxlcicpLFxuICAgICAgcnVudGltZTogQ3VzdG9tUmVzb3VyY2VQcm92aWRlclJ1bnRpbWUuTk9ERUpTXzE0X1gsXG4gICAgICBkZXNjcmlwdGlvbjogYExhbWJkYSBmdW5jdGlvbiBmb3IgYXV0by1kZWxldGluZyBvYmplY3RzIGluICR7dGhpcy5idWNrZXROYW1lfSBTMyBidWNrZXQuYCxcbiAgICB9KTtcblxuICAgIC8vIFVzZSBhIGJ1Y2tldCBwb2xpY3kgdG8gYWxsb3cgdGhlIGN1c3RvbSByZXNvdXJjZSB0byBkZWxldGVcbiAgICAvLyBvYmplY3RzIGluIHRoZSBidWNrZXRcbiAgICB0aGlzLmFkZFRvUmVzb3VyY2VQb2xpY3kobmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgYWN0aW9uczogW1xuICAgICAgICAvLyBsaXN0IG9iamVjdHNcbiAgICAgICAgLi4ucGVybXMuQlVDS0VUX1JFQURfTUVUQURBVEFfQUNUSU9OUyxcbiAgICAgICAgLi4ucGVybXMuQlVDS0VUX0RFTEVURV9BQ1RJT05TLCAvLyBhbmQgdGhlbiBkZWxldGUgdGhlbVxuICAgICAgXSxcbiAgICAgIHJlc291cmNlczogW1xuICAgICAgICB0aGlzLmJ1Y2tldEFybixcbiAgICAgICAgdGhpcy5hcm5Gb3JPYmplY3RzKCcqJyksXG4gICAgICBdLFxuICAgICAgcHJpbmNpcGFsczogW25ldyBpYW0uQXJuUHJpbmNpcGFsKHByb3ZpZGVyLnJvbGVBcm4pXSxcbiAgICB9KSk7XG5cbiAgICBjb25zdCBjdXN0b21SZXNvdXJjZSA9IG5ldyBDdXN0b21SZXNvdXJjZSh0aGlzLCAnQXV0b0RlbGV0ZU9iamVjdHNDdXN0b21SZXNvdXJjZScsIHtcbiAgICAgIHJlc291cmNlVHlwZTogQVVUT19ERUxFVEVfT0JKRUNUU19SRVNPVVJDRV9UWVBFLFxuICAgICAgc2VydmljZVRva2VuOiBwcm92aWRlci5zZXJ2aWNlVG9rZW4sXG4gICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIEJ1Y2tldE5hbWU6IHRoaXMuYnVja2V0TmFtZSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyBFbnN1cmUgYnVja2V0IHBvbGljeSBpcyBkZWxldGVkIEFGVEVSIHRoZSBjdXN0b20gcmVzb3VyY2Ugb3RoZXJ3aXNlXG4gICAgLy8gd2UgZG9uJ3QgaGF2ZSBwZXJtaXNzaW9ucyB0byBsaXN0IGFuZCBkZWxldGUgaW4gdGhlIGJ1Y2tldC5cbiAgICAvLyAoYWRkIGEgYGlmYCB0byBtYWtlIFRTIGhhcHB5KVxuICAgIGlmICh0aGlzLnBvbGljeSkge1xuICAgICAgY3VzdG9tUmVzb3VyY2Uubm9kZS5hZGREZXBlbmRlbmN5KHRoaXMucG9saWN5KTtcbiAgICB9XG5cbiAgICAvLyBXZSBhbHNvIHRhZyB0aGUgYnVja2V0IHRvIHJlY29yZCB0aGUgZmFjdCB0aGF0IHdlIHdhbnQgaXQgYXV0b2RlbGV0ZWQuXG4gICAgLy8gVGhlIGN1c3RvbSByZXNvdXJjZSB3aWxsIGNoZWNrIHRoaXMgdGFnIGJlZm9yZSBhY3R1YWxseSBkb2luZyB0aGUgZGVsZXRlLlxuICAgIC8vIEJlY2F1c2UgdGFnZ2luZyBhbmQgdW50YWdnaW5nIHdpbGwgQUxXQVlTIGhhcHBlbiBiZWZvcmUgdGhlIENSIGlzIGRlbGV0ZWQsXG4gICAgLy8gd2UgY2FuIHNldCBgYXV0b0RlbGV0ZU9iamVjdHM6IGZhbHNlYCB3aXRob3V0IHRoZSByZW1vdmFsIG9mIHRoZSBDUiBlbXB0eWluZ1xuICAgIC8vIHRoZSBidWNrZXQgYXMgYSBzaWRlIGVmZmVjdC5cbiAgICBUYWdzLm9mKHRoaXMuX3Jlc291cmNlKS5hZGQoQVVUT19ERUxFVEVfT0JKRUNUU19UQUcsICd0cnVlJyk7XG4gIH1cbn1cblxuLyoqXG4gKiBXaGF0IGtpbmQgb2Ygc2VydmVyLXNpZGUgZW5jcnlwdGlvbiB0byBhcHBseSB0byB0aGlzIGJ1Y2tldFxuICovXG5leHBvcnQgZW51bSBCdWNrZXRFbmNyeXB0aW9uIHtcbiAgLyoqXG4gICAqIE9iamVjdHMgaW4gdGhlIGJ1Y2tldCBhcmUgbm90IGVuY3J5cHRlZC5cbiAgICovXG4gIFVORU5DUllQVEVEID0gJ1VORU5DUllQVEVEJyxcblxuICAvKipcbiAgICogU2VydmVyLXNpZGUgS01TIGVuY3J5cHRpb24gd2l0aCBhIG1hc3RlciBrZXkgbWFuYWdlZCBieSBLTVMuXG4gICAqL1xuICBLTVNfTUFOQUdFRCA9ICdLTVNfTUFOQUdFRCcsXG5cbiAgLyoqXG4gICAqIFNlcnZlci1zaWRlIGVuY3J5cHRpb24gd2l0aCBhIG1hc3RlciBrZXkgbWFuYWdlZCBieSBTMy5cbiAgICovXG4gIFMzX01BTkFHRUQgPSAnUzNfTUFOQUdFRCcsXG5cbiAgLyoqXG4gICAqIFNlcnZlci1zaWRlIGVuY3J5cHRpb24gd2l0aCBhIEtNUyBrZXkgbWFuYWdlZCBieSB0aGUgdXNlci5cbiAgICogSWYgYGVuY3J5cHRpb25LZXlgIGlzIHNwZWNpZmllZCwgdGhpcyBrZXkgd2lsbCBiZSB1c2VkLCBvdGhlcndpc2UsIG9uZSB3aWxsIGJlIGRlZmluZWQuXG4gICAqL1xuICBLTVMgPSAnS01TJyxcbn1cblxuLyoqXG4gKiBOb3RpZmljYXRpb24gZXZlbnQgdHlwZXMuXG4gKiBAbGluayBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQW1hem9uUzMvbGF0ZXN0L3VzZXJndWlkZS9ub3RpZmljYXRpb24taG93LXRvLWV2ZW50LXR5cGVzLWFuZC1kZXN0aW5hdGlvbnMuaHRtbCNzdXBwb3J0ZWQtbm90aWZpY2F0aW9uLWV2ZW50LXR5cGVzXG4gKi9cbmV4cG9ydCBlbnVtIEV2ZW50VHlwZSB7XG4gIC8qKlxuICAgKiBBbWF6b24gUzMgQVBJcyBzdWNoIGFzIFBVVCwgUE9TVCwgYW5kIENPUFkgY2FuIGNyZWF0ZSBhbiBvYmplY3QuIFVzaW5nXG4gICAqIHRoZXNlIGV2ZW50IHR5cGVzLCB5b3UgY2FuIGVuYWJsZSBub3RpZmljYXRpb24gd2hlbiBhbiBvYmplY3QgaXMgY3JlYXRlZFxuICAgKiB1c2luZyBhIHNwZWNpZmljIEFQSSwgb3IgeW91IGNhbiB1c2UgdGhlIHMzOk9iamVjdENyZWF0ZWQ6KiBldmVudCB0eXBlIHRvXG4gICAqIHJlcXVlc3Qgbm90aWZpY2F0aW9uIHJlZ2FyZGxlc3Mgb2YgdGhlIEFQSSB0aGF0IHdhcyB1c2VkIHRvIGNyZWF0ZSBhblxuICAgKiBvYmplY3QuXG4gICAqL1xuICBPQkpFQ1RfQ1JFQVRFRCA9ICdzMzpPYmplY3RDcmVhdGVkOionLFxuXG4gIC8qKlxuICAgKiBBbWF6b24gUzMgQVBJcyBzdWNoIGFzIFBVVCwgUE9TVCwgYW5kIENPUFkgY2FuIGNyZWF0ZSBhbiBvYmplY3QuIFVzaW5nXG4gICAqIHRoZXNlIGV2ZW50IHR5cGVzLCB5b3UgY2FuIGVuYWJsZSBub3RpZmljYXRpb24gd2hlbiBhbiBvYmplY3QgaXMgY3JlYXRlZFxuICAgKiB1c2luZyBhIHNwZWNpZmljIEFQSSwgb3IgeW91IGNhbiB1c2UgdGhlIHMzOk9iamVjdENyZWF0ZWQ6KiBldmVudCB0eXBlIHRvXG4gICAqIHJlcXVlc3Qgbm90aWZpY2F0aW9uIHJlZ2FyZGxlc3Mgb2YgdGhlIEFQSSB0aGF0IHdhcyB1c2VkIHRvIGNyZWF0ZSBhblxuICAgKiBvYmplY3QuXG4gICAqL1xuICBPQkpFQ1RfQ1JFQVRFRF9QVVQgPSAnczM6T2JqZWN0Q3JlYXRlZDpQdXQnLFxuXG4gIC8qKlxuICAgKiBBbWF6b24gUzMgQVBJcyBzdWNoIGFzIFBVVCwgUE9TVCwgYW5kIENPUFkgY2FuIGNyZWF0ZSBhbiBvYmplY3QuIFVzaW5nXG4gICAqIHRoZXNlIGV2ZW50IHR5cGVzLCB5b3UgY2FuIGVuYWJsZSBub3RpZmljYXRpb24gd2hlbiBhbiBvYmplY3QgaXMgY3JlYXRlZFxuICAgKiB1c2luZyBhIHNwZWNpZmljIEFQSSwgb3IgeW91IGNhbiB1c2UgdGhlIHMzOk9iamVjdENyZWF0ZWQ6KiBldmVudCB0eXBlIHRvXG4gICAqIHJlcXVlc3Qgbm90aWZpY2F0aW9uIHJlZ2FyZGxlc3Mgb2YgdGhlIEFQSSB0aGF0IHdhcyB1c2VkIHRvIGNyZWF0ZSBhblxuICAgKiBvYmplY3QuXG4gICAqL1xuICBPQkpFQ1RfQ1JFQVRFRF9QT1NUID0gJ3MzOk9iamVjdENyZWF0ZWQ6UG9zdCcsXG5cbiAgLyoqXG4gICAqIEFtYXpvbiBTMyBBUElzIHN1Y2ggYXMgUFVULCBQT1NULCBhbmQgQ09QWSBjYW4gY3JlYXRlIGFuIG9iamVjdC4gVXNpbmdcbiAgICogdGhlc2UgZXZlbnQgdHlwZXMsIHlvdSBjYW4gZW5hYmxlIG5vdGlmaWNhdGlvbiB3aGVuIGFuIG9iamVjdCBpcyBjcmVhdGVkXG4gICAqIHVzaW5nIGEgc3BlY2lmaWMgQVBJLCBvciB5b3UgY2FuIHVzZSB0aGUgczM6T2JqZWN0Q3JlYXRlZDoqIGV2ZW50IHR5cGUgdG9cbiAgICogcmVxdWVzdCBub3RpZmljYXRpb24gcmVnYXJkbGVzcyBvZiB0aGUgQVBJIHRoYXQgd2FzIHVzZWQgdG8gY3JlYXRlIGFuXG4gICAqIG9iamVjdC5cbiAgICovXG4gIE9CSkVDVF9DUkVBVEVEX0NPUFkgPSAnczM6T2JqZWN0Q3JlYXRlZDpDb3B5JyxcblxuICAvKipcbiAgICogQW1hem9uIFMzIEFQSXMgc3VjaCBhcyBQVVQsIFBPU1QsIGFuZCBDT1BZIGNhbiBjcmVhdGUgYW4gb2JqZWN0LiBVc2luZ1xuICAgKiB0aGVzZSBldmVudCB0eXBlcywgeW91IGNhbiBlbmFibGUgbm90aWZpY2F0aW9uIHdoZW4gYW4gb2JqZWN0IGlzIGNyZWF0ZWRcbiAgICogdXNpbmcgYSBzcGVjaWZpYyBBUEksIG9yIHlvdSBjYW4gdXNlIHRoZSBzMzpPYmplY3RDcmVhdGVkOiogZXZlbnQgdHlwZSB0b1xuICAgKiByZXF1ZXN0IG5vdGlmaWNhdGlvbiByZWdhcmRsZXNzIG9mIHRoZSBBUEkgdGhhdCB3YXMgdXNlZCB0byBjcmVhdGUgYW5cbiAgICogb2JqZWN0LlxuICAgKi9cbiAgT0JKRUNUX0NSRUFURURfQ09NUExFVEVfTVVMVElQQVJUX1VQTE9BRCA9ICdzMzpPYmplY3RDcmVhdGVkOkNvbXBsZXRlTXVsdGlwYXJ0VXBsb2FkJyxcblxuICAvKipcbiAgICogQnkgdXNpbmcgdGhlIE9iamVjdFJlbW92ZWQgZXZlbnQgdHlwZXMsIHlvdSBjYW4gZW5hYmxlIG5vdGlmaWNhdGlvbiB3aGVuXG4gICAqIGFuIG9iamVjdCBvciBhIGJhdGNoIG9mIG9iamVjdHMgaXMgcmVtb3ZlZCBmcm9tIGEgYnVja2V0LlxuICAgKlxuICAgKiBZb3UgY2FuIHJlcXVlc3Qgbm90aWZpY2F0aW9uIHdoZW4gYW4gb2JqZWN0IGlzIGRlbGV0ZWQgb3IgYSB2ZXJzaW9uZWRcbiAgICogb2JqZWN0IGlzIHBlcm1hbmVudGx5IGRlbGV0ZWQgYnkgdXNpbmcgdGhlIHMzOk9iamVjdFJlbW92ZWQ6RGVsZXRlIGV2ZW50XG4gICAqIHR5cGUuIE9yIHlvdSBjYW4gcmVxdWVzdCBub3RpZmljYXRpb24gd2hlbiBhIGRlbGV0ZSBtYXJrZXIgaXMgY3JlYXRlZCBmb3JcbiAgICogYSB2ZXJzaW9uZWQgb2JqZWN0IGJ5IHVzaW5nIHMzOk9iamVjdFJlbW92ZWQ6RGVsZXRlTWFya2VyQ3JlYXRlZC4gRm9yXG4gICAqIGluZm9ybWF0aW9uIGFib3V0IGRlbGV0aW5nIHZlcnNpb25lZCBvYmplY3RzLCBzZWUgRGVsZXRpbmcgT2JqZWN0XG4gICAqIFZlcnNpb25zLiBZb3UgY2FuIGFsc28gdXNlIGEgd2lsZGNhcmQgczM6T2JqZWN0UmVtb3ZlZDoqIHRvIHJlcXVlc3RcbiAgICogbm90aWZpY2F0aW9uIGFueXRpbWUgYW4gb2JqZWN0IGlzIGRlbGV0ZWQuXG4gICAqXG4gICAqIFlvdSB3aWxsIG5vdCByZWNlaXZlIGV2ZW50IG5vdGlmaWNhdGlvbnMgZnJvbSBhdXRvbWF0aWMgZGVsZXRlcyBmcm9tXG4gICAqIGxpZmVjeWNsZSBwb2xpY2llcyBvciBmcm9tIGZhaWxlZCBvcGVyYXRpb25zLlxuICAgKi9cbiAgT0JKRUNUX1JFTU9WRUQgPSAnczM6T2JqZWN0UmVtb3ZlZDoqJyxcblxuICAvKipcbiAgICogQnkgdXNpbmcgdGhlIE9iamVjdFJlbW92ZWQgZXZlbnQgdHlwZXMsIHlvdSBjYW4gZW5hYmxlIG5vdGlmaWNhdGlvbiB3aGVuXG4gICAqIGFuIG9iamVjdCBvciBhIGJhdGNoIG9mIG9iamVjdHMgaXMgcmVtb3ZlZCBmcm9tIGEgYnVja2V0LlxuICAgKlxuICAgKiBZb3UgY2FuIHJlcXVlc3Qgbm90aWZpY2F0aW9uIHdoZW4gYW4gb2JqZWN0IGlzIGRlbGV0ZWQgb3IgYSB2ZXJzaW9uZWRcbiAgICogb2JqZWN0IGlzIHBlcm1hbmVudGx5IGRlbGV0ZWQgYnkgdXNpbmcgdGhlIHMzOk9iamVjdFJlbW92ZWQ6RGVsZXRlIGV2ZW50XG4gICAqIHR5cGUuIE9yIHlvdSBjYW4gcmVxdWVzdCBub3RpZmljYXRpb24gd2hlbiBhIGRlbGV0ZSBtYXJrZXIgaXMgY3JlYXRlZCBmb3JcbiAgICogYSB2ZXJzaW9uZWQgb2JqZWN0IGJ5IHVzaW5nIHMzOk9iamVjdFJlbW92ZWQ6RGVsZXRlTWFya2VyQ3JlYXRlZC4gRm9yXG4gICAqIGluZm9ybWF0aW9uIGFib3V0IGRlbGV0aW5nIHZlcnNpb25lZCBvYmplY3RzLCBzZWUgRGVsZXRpbmcgT2JqZWN0XG4gICAqIFZlcnNpb25zLiBZb3UgY2FuIGFsc28gdXNlIGEgd2lsZGNhcmQgczM6T2JqZWN0UmVtb3ZlZDoqIHRvIHJlcXVlc3RcbiAgICogbm90aWZpY2F0aW9uIGFueXRpbWUgYW4gb2JqZWN0IGlzIGRlbGV0ZWQuXG4gICAqXG4gICAqIFlvdSB3aWxsIG5vdCByZWNlaXZlIGV2ZW50IG5vdGlmaWNhdGlvbnMgZnJvbSBhdXRvbWF0aWMgZGVsZXRlcyBmcm9tXG4gICAqIGxpZmVjeWNsZSBwb2xpY2llcyBvciBmcm9tIGZhaWxlZCBvcGVyYXRpb25zLlxuICAgKi9cbiAgT0JKRUNUX1JFTU9WRURfREVMRVRFID0gJ3MzOk9iamVjdFJlbW92ZWQ6RGVsZXRlJyxcblxuICAvKipcbiAgICogQnkgdXNpbmcgdGhlIE9iamVjdFJlbW92ZWQgZXZlbnQgdHlwZXMsIHlvdSBjYW4gZW5hYmxlIG5vdGlmaWNhdGlvbiB3aGVuXG4gICAqIGFuIG9iamVjdCBvciBhIGJhdGNoIG9mIG9iamVjdHMgaXMgcmVtb3ZlZCBmcm9tIGEgYnVja2V0LlxuICAgKlxuICAgKiBZb3UgY2FuIHJlcXVlc3Qgbm90aWZpY2F0aW9uIHdoZW4gYW4gb2JqZWN0IGlzIGRlbGV0ZWQgb3IgYSB2ZXJzaW9uZWRcbiAgICogb2JqZWN0IGlzIHBlcm1hbmVudGx5IGRlbGV0ZWQgYnkgdXNpbmcgdGhlIHMzOk9iamVjdFJlbW92ZWQ6RGVsZXRlIGV2ZW50XG4gICAqIHR5cGUuIE9yIHlvdSBjYW4gcmVxdWVzdCBub3RpZmljYXRpb24gd2hlbiBhIGRlbGV0ZSBtYXJrZXIgaXMgY3JlYXRlZCBmb3JcbiAgICogYSB2ZXJzaW9uZWQgb2JqZWN0IGJ5IHVzaW5nIHMzOk9iamVjdFJlbW92ZWQ6RGVsZXRlTWFya2VyQ3JlYXRlZC4gRm9yXG4gICAqIGluZm9ybWF0aW9uIGFib3V0IGRlbGV0aW5nIHZlcnNpb25lZCBvYmplY3RzLCBzZWUgRGVsZXRpbmcgT2JqZWN0XG4gICAqIFZlcnNpb25zLiBZb3UgY2FuIGFsc28gdXNlIGEgd2lsZGNhcmQgczM6T2JqZWN0UmVtb3ZlZDoqIHRvIHJlcXVlc3RcbiAgICogbm90aWZpY2F0aW9uIGFueXRpbWUgYW4gb2JqZWN0IGlzIGRlbGV0ZWQuXG4gICAqXG4gICAqIFlvdSB3aWxsIG5vdCByZWNlaXZlIGV2ZW50IG5vdGlmaWNhdGlvbnMgZnJvbSBhdXRvbWF0aWMgZGVsZXRlcyBmcm9tXG4gICAqIGxpZmVjeWNsZSBwb2xpY2llcyBvciBmcm9tIGZhaWxlZCBvcGVyYXRpb25zLlxuICAgKi9cbiAgT0JKRUNUX1JFTU9WRURfREVMRVRFX01BUktFUl9DUkVBVEVEID0gJ3MzOk9iamVjdFJlbW92ZWQ6RGVsZXRlTWFya2VyQ3JlYXRlZCcsXG5cbiAgLyoqXG4gICAqIFVzaW5nIHJlc3RvcmUgb2JqZWN0IGV2ZW50IHR5cGVzIHlvdSBjYW4gcmVjZWl2ZSBub3RpZmljYXRpb25zIGZvclxuICAgKiBpbml0aWF0aW9uIGFuZCBjb21wbGV0aW9uIHdoZW4gcmVzdG9yaW5nIG9iamVjdHMgZnJvbSB0aGUgUzMgR2xhY2llclxuICAgKiBzdG9yYWdlIGNsYXNzLlxuICAgKlxuICAgKiBZb3UgdXNlIHMzOk9iamVjdFJlc3RvcmU6UG9zdCB0byByZXF1ZXN0IG5vdGlmaWNhdGlvbiBvZiBvYmplY3QgcmVzdG9yYXRpb25cbiAgICogaW5pdGlhdGlvbi5cbiAgICovXG4gIE9CSkVDVF9SRVNUT1JFX1BPU1QgPSAnczM6T2JqZWN0UmVzdG9yZTpQb3N0JyxcblxuICAvKipcbiAgICogVXNpbmcgcmVzdG9yZSBvYmplY3QgZXZlbnQgdHlwZXMgeW91IGNhbiByZWNlaXZlIG5vdGlmaWNhdGlvbnMgZm9yXG4gICAqIGluaXRpYXRpb24gYW5kIGNvbXBsZXRpb24gd2hlbiByZXN0b3Jpbmcgb2JqZWN0cyBmcm9tIHRoZSBTMyBHbGFjaWVyXG4gICAqIHN0b3JhZ2UgY2xhc3MuXG4gICAqXG4gICAqIFlvdSB1c2UgczM6T2JqZWN0UmVzdG9yZTpDb21wbGV0ZWQgdG8gcmVxdWVzdCBub3RpZmljYXRpb24gb2ZcbiAgICogcmVzdG9yYXRpb24gY29tcGxldGlvbi5cbiAgICovXG4gIE9CSkVDVF9SRVNUT1JFX0NPTVBMRVRFRCA9ICdzMzpPYmplY3RSZXN0b3JlOkNvbXBsZXRlZCcsXG5cbiAgLyoqXG4gICAqIFVzaW5nIHJlc3RvcmUgb2JqZWN0IGV2ZW50IHR5cGVzIHlvdSBjYW4gcmVjZWl2ZSBub3RpZmljYXRpb25zIGZvclxuICAgKiBpbml0aWF0aW9uIGFuZCBjb21wbGV0aW9uIHdoZW4gcmVzdG9yaW5nIG9iamVjdHMgZnJvbSB0aGUgUzMgR2xhY2llclxuICAgKiBzdG9yYWdlIGNsYXNzLlxuICAgKlxuICAgKiBZb3UgdXNlIHMzOk9iamVjdFJlc3RvcmU6RGVsZXRlIHRvIHJlcXVlc3Qgbm90aWZpY2F0aW9uIG9mXG4gICAqIHJlc3RvcmF0aW9uIGNvbXBsZXRpb24uXG4gICAqL1xuICBPQkpFQ1RfUkVTVE9SRV9ERUxFVEUgPSAnczM6T2JqZWN0UmVzdG9yZTpEZWxldGUnLFxuXG4gIC8qKlxuICAgKiBZb3UgY2FuIHVzZSB0aGlzIGV2ZW50IHR5cGUgdG8gcmVxdWVzdCBBbWF6b24gUzMgdG8gc2VuZCBhIG5vdGlmaWNhdGlvblxuICAgKiBtZXNzYWdlIHdoZW4gQW1hem9uIFMzIGRldGVjdHMgdGhhdCBhbiBvYmplY3Qgb2YgdGhlIFJSUyBzdG9yYWdlIGNsYXNzIGlzXG4gICAqIGxvc3QuXG4gICAqL1xuICBSRURVQ0VEX1JFRFVOREFOQ1lfTE9TVF9PQkpFQ1QgPSAnczM6UmVkdWNlZFJlZHVuZGFuY3lMb3N0T2JqZWN0JyxcblxuICAvKipcbiAgICogWW91IHJlY2VpdmUgdGhpcyBub3RpZmljYXRpb24gZXZlbnQgd2hlbiBhbiBvYmplY3QgdGhhdCB3YXMgZWxpZ2libGUgZm9yXG4gICAqIHJlcGxpY2F0aW9uIHVzaW5nIEFtYXpvbiBTMyBSZXBsaWNhdGlvbiBUaW1lIENvbnRyb2wgZmFpbGVkIHRvIHJlcGxpY2F0ZS5cbiAgICovXG4gIFJFUExJQ0FUSU9OX09QRVJBVElPTl9GQUlMRURfUkVQTElDQVRJT04gPSAnczM6UmVwbGljYXRpb246T3BlcmF0aW9uRmFpbGVkUmVwbGljYXRpb24nLFxuXG4gIC8qKlxuICAgKiBZb3UgcmVjZWl2ZSB0aGlzIG5vdGlmaWNhdGlvbiBldmVudCB3aGVuIGFuIG9iamVjdCB0aGF0IHdhcyBlbGlnaWJsZSBmb3JcbiAgICogcmVwbGljYXRpb24gdXNpbmcgQW1hem9uIFMzIFJlcGxpY2F0aW9uIFRpbWUgQ29udHJvbCBleGNlZWRlZCB0aGUgMTUtbWludXRlXG4gICAqIHRocmVzaG9sZCBmb3IgcmVwbGljYXRpb24uXG4gICAqL1xuICBSRVBMSUNBVElPTl9PUEVSQVRJT05fTUlTU0VEX1RIUkVTSE9MRCA9ICdzMzpSZXBsaWNhdGlvbjpPcGVyYXRpb25NaXNzZWRUaHJlc2hvbGQnLFxuXG4gIC8qKlxuICAgKiBZb3UgcmVjZWl2ZSB0aGlzIG5vdGlmaWNhdGlvbiBldmVudCBmb3IgYW4gb2JqZWN0IHRoYXQgd2FzIGVsaWdpYmxlIGZvclxuICAgKiByZXBsaWNhdGlvbiB1c2luZyB0aGUgQW1hem9uIFMzIFJlcGxpY2F0aW9uIFRpbWUgQ29udHJvbCBmZWF0dXJlIHJlcGxpY2F0ZWRcbiAgICogYWZ0ZXIgdGhlIDE1LW1pbnV0ZSB0aHJlc2hvbGQuXG4gICAqL1xuICBSRVBMSUNBVElPTl9PUEVSQVRJT05fUkVQTElDQVRFRF9BRlRFUl9USFJFU0hPTEQgPSAnczM6UmVwbGljYXRpb246T3BlcmF0aW9uUmVwbGljYXRlZEFmdGVyVGhyZXNob2xkJyxcblxuICAvKipcbiAgICogWW91IHJlY2VpdmUgdGhpcyBub3RpZmljYXRpb24gZXZlbnQgZm9yIGFuIG9iamVjdCB0aGF0IHdhcyBlbGlnaWJsZSBmb3JcbiAgICogcmVwbGljYXRpb24gdXNpbmcgQW1hem9uIFMzIFJlcGxpY2F0aW9uIFRpbWUgQ29udHJvbCBidXQgaXMgbm8gbG9uZ2VyIHRyYWNrZWRcbiAgICogYnkgcmVwbGljYXRpb24gbWV0cmljcy5cbiAgICovXG4gIFJFUExJQ0FUSU9OX09QRVJBVElPTl9OT1RfVFJBQ0tFRCA9ICdzMzpSZXBsaWNhdGlvbjpPcGVyYXRpb25Ob3RUcmFja2VkJyxcblxuICAvKipcbiAgICogQnkgdXNpbmcgdGhlIExpZmVjeWNsZUV4cGlyYXRpb24gZXZlbnQgdHlwZXMsIHlvdSBjYW4gcmVjZWl2ZSBhIG5vdGlmaWNhdGlvblxuICAgKiB3aGVuIEFtYXpvbiBTMyBkZWxldGVzIGFuIG9iamVjdCBiYXNlZCBvbiB5b3VyIFMzIExpZmVjeWNsZSBjb25maWd1cmF0aW9uLlxuICAgKi9cbiAgTElGRUNZQ0xFX0VYUElSQVRJT04gPSAnczM6TGlmZWN5Y2xlRXhwaXJhdGlvbjoqJyxcblxuICAvKipcbiAgICogVGhlIHMzOkxpZmVjeWNsZUV4cGlyYXRpb246RGVsZXRlIGV2ZW50IHR5cGUgbm90aWZpZXMgeW91IHdoZW4gYW4gb2JqZWN0XG4gICAqIGluIGFuIHVudmVyc2lvbmVkIGJ1Y2tldCBpcyBkZWxldGVkLlxuICAgKiBJdCBhbHNvIG5vdGlmaWVzIHlvdSB3aGVuIGFuIG9iamVjdCB2ZXJzaW9uIGlzIHBlcm1hbmVudGx5IGRlbGV0ZWQgYnkgYW5cbiAgICogUzMgTGlmZWN5Y2xlIGNvbmZpZ3VyYXRpb24uXG4gICAqL1xuICBMSUZFQ1lDTEVfRVhQSVJBVElPTl9ERUxFVEUgPSAnczM6TGlmZWN5Y2xlRXhwaXJhdGlvbjpEZWxldGUnLFxuXG4gIC8qKlxuICAgKiBUaGUgczM6TGlmZWN5Y2xlRXhwaXJhdGlvbjpEZWxldGVNYXJrZXJDcmVhdGVkIGV2ZW50IHR5cGUgbm90aWZpZXMgeW91XG4gICAqIHdoZW4gUzMgTGlmZWN5Y2xlIGNyZWF0ZXMgYSBkZWxldGUgbWFya2VyIHdoZW4gYSBjdXJyZW50IHZlcnNpb24gb2YgYW5cbiAgICogb2JqZWN0IGluIHZlcnNpb25lZCBidWNrZXQgaXMgZGVsZXRlZC5cbiAgICovXG4gIExJRkVDWUNMRV9FWFBJUkFUSU9OX0RFTEVURV9NQVJLRVJfQ1JFQVRFRCA9ICdzMzpMaWZlY3ljbGVFeHBpcmF0aW9uOkRlbGV0ZU1hcmtlckNyZWF0ZWQnLFxuXG4gIC8qKlxuICAgKiBZb3UgcmVjZWl2ZSB0aGlzIG5vdGlmaWNhdGlvbiBldmVudCB3aGVuIGFuIG9iamVjdCBpcyB0cmFuc2l0aW9uZWQgdG9cbiAgICogYW5vdGhlciBBbWF6b24gUzMgc3RvcmFnZSBjbGFzcyBieSBhbiBTMyBMaWZlY3ljbGUgY29uZmlndXJhdGlvbi5cbiAgICovXG4gIExJRkVDWUNMRV9UUkFOU0lUSU9OID0gJ3MzOkxpZmVjeWNsZVRyYW5zaXRpb24nLFxuXG4gIC8qKlxuICAgKiBZb3UgcmVjZWl2ZSB0aGlzIG5vdGlmaWNhdGlvbiBldmVudCB3aGVuIGFuIG9iamVjdCB3aXRoaW4gdGhlXG4gICAqIFMzIEludGVsbGlnZW50LVRpZXJpbmcgc3RvcmFnZSBjbGFzcyBtb3ZlZCB0byB0aGUgQXJjaGl2ZSBBY2Nlc3MgdGllciBvclxuICAgKiBEZWVwIEFyY2hpdmUgQWNjZXNzIHRpZXIuXG4gICAqL1xuICBJTlRFTExJR0VOVF9USUVSSU5HID0gJ3MzOkludGVsbGlnZW50VGllcmluZycsXG5cbiAgLyoqXG4gICAqIEJ5IHVzaW5nIHRoZSBPYmplY3RUYWdnaW5nIGV2ZW50IHR5cGVzLCB5b3UgY2FuIGVuYWJsZSBub3RpZmljYXRpb24gd2hlblxuICAgKiBhbiBvYmplY3QgdGFnIGlzIGFkZGVkIG9yIGRlbGV0ZWQgZnJvbSBhbiBvYmplY3QuXG4gICAqL1xuICBPQkpFQ1RfVEFHR0lORyA9ICdzMzpPYmplY3RUYWdnaW5nOionLFxuXG4gIC8qKlxuICAgKiBUaGUgczM6T2JqZWN0VGFnZ2luZzpQdXQgZXZlbnQgdHlwZSBub3RpZmllcyB5b3Ugd2hlbiBhIHRhZyBpcyBQVVQgb24gYW5cbiAgICogb2JqZWN0IG9yIGFuIGV4aXN0aW5nIHRhZyBpcyB1cGRhdGVkLlxuXG4gICAqL1xuICBPQkpFQ1RfVEFHR0lOR19QVVQgPSAnczM6T2JqZWN0VGFnZ2luZzpQdXQnLFxuXG4gIC8qKlxuICAgKiBUaGUgczM6T2JqZWN0VGFnZ2luZzpEZWxldGUgZXZlbnQgdHlwZSBub3RpZmllcyB5b3Ugd2hlbiBhIHRhZyBpcyByZW1vdmVkXG4gICAqIGZyb20gYW4gb2JqZWN0LlxuICAgKi9cbiAgT0JKRUNUX1RBR0dJTkdfREVMRVRFID0gJ3MzOk9iamVjdFRhZ2dpbmc6RGVsZXRlJyxcblxuICAvKipcbiAgICogWW91IHJlY2VpdmUgdGhpcyBub3RpZmljYXRpb24gZXZlbnQgd2hlbiBhbiBBQ0wgaXMgUFVUIG9uIGFuIG9iamVjdCBvciB3aGVuXG4gICAqIGFuIGV4aXN0aW5nIEFDTCBpcyBjaGFuZ2VkLlxuICAgKiBBbiBldmVudCBpcyBub3QgZ2VuZXJhdGVkIHdoZW4gYSByZXF1ZXN0IHJlc3VsdHMgaW4gbm8gY2hhbmdlIHRvIGFuXG4gICAqIG9iamVjdOKAmXMgQUNMLlxuICAgKi9cbiAgT0JKRUNUX0FDTF9QVVQgPSAnczM6T2JqZWN0QWNsOlB1dCcsXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgTm90aWZpY2F0aW9uS2V5RmlsdGVyIHtcbiAgLyoqXG4gICAqIFMzIGtleXMgbXVzdCBoYXZlIHRoZSBzcGVjaWZpZWQgcHJlZml4LlxuICAgKi9cbiAgcmVhZG9ubHkgcHJlZml4Pzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBTMyBrZXlzIG11c3QgaGF2ZSB0aGUgc3BlY2lmaWVkIHN1ZmZpeC5cbiAgICovXG4gIHJlYWRvbmx5IHN1ZmZpeD86IHN0cmluZztcbn1cblxuLyoqXG4gKiBPcHRpb25zIGZvciB0aGUgb25DbG91ZFRyYWlsUHV0T2JqZWN0IG1ldGhvZFxuICovXG5leHBvcnQgaW50ZXJmYWNlIE9uQ2xvdWRUcmFpbEJ1Y2tldEV2ZW50T3B0aW9ucyBleHRlbmRzIGV2ZW50cy5PbkV2ZW50T3B0aW9ucyB7XG4gIC8qKlxuICAgKiBPbmx5IHdhdGNoIGNoYW5nZXMgdG8gdGhlc2Ugb2JqZWN0IHBhdGhzXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gV2F0Y2ggY2hhbmdlcyB0byBhbGwgb2JqZWN0c1xuICAgKi9cbiAgcmVhZG9ubHkgcGF0aHM/OiBzdHJpbmdbXTtcbn1cblxuLyoqXG4gKiBEZWZhdWx0IGJ1Y2tldCBhY2Nlc3MgY29udHJvbCB0eXBlcy5cbiAqXG4gKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BbWF6b25TMy9sYXRlc3QvZGV2L2FjbC1vdmVydmlldy5odG1sXG4gKi9cbmV4cG9ydCBlbnVtIEJ1Y2tldEFjY2Vzc0NvbnRyb2wge1xuICAvKipcbiAgICogT3duZXIgZ2V0cyBGVUxMX0NPTlRST0wuIE5vIG9uZSBlbHNlIGhhcyBhY2Nlc3MgcmlnaHRzLlxuICAgKi9cbiAgUFJJVkFURSA9ICdQcml2YXRlJyxcblxuICAvKipcbiAgICogT3duZXIgZ2V0cyBGVUxMX0NPTlRST0wuIFRoZSBBbGxVc2VycyBncm91cCBnZXRzIFJFQUQgYWNjZXNzLlxuICAgKi9cbiAgUFVCTElDX1JFQUQgPSAnUHVibGljUmVhZCcsXG5cbiAgLyoqXG4gICAqIE93bmVyIGdldHMgRlVMTF9DT05UUk9MLiBUaGUgQWxsVXNlcnMgZ3JvdXAgZ2V0cyBSRUFEIGFuZCBXUklURSBhY2Nlc3MuXG4gICAqIEdyYW50aW5nIHRoaXMgb24gYSBidWNrZXQgaXMgZ2VuZXJhbGx5IG5vdCByZWNvbW1lbmRlZC5cbiAgICovXG4gIFBVQkxJQ19SRUFEX1dSSVRFID0gJ1B1YmxpY1JlYWRXcml0ZScsXG5cbiAgLyoqXG4gICAqIE93bmVyIGdldHMgRlVMTF9DT05UUk9MLiBUaGUgQXV0aGVudGljYXRlZFVzZXJzIGdyb3VwIGdldHMgUkVBRCBhY2Nlc3MuXG4gICAqL1xuICBBVVRIRU5USUNBVEVEX1JFQUQgPSAnQXV0aGVudGljYXRlZFJlYWQnLFxuXG4gIC8qKlxuICAgKiBUaGUgTG9nRGVsaXZlcnkgZ3JvdXAgZ2V0cyBXUklURSBhbmQgUkVBRF9BQ1AgcGVybWlzc2lvbnMgb24gdGhlIGJ1Y2tldC5cbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQW1hem9uUzMvbGF0ZXN0L2Rldi9TZXJ2ZXJMb2dzLmh0bWxcbiAgICovXG4gIExPR19ERUxJVkVSWV9XUklURSA9ICdMb2dEZWxpdmVyeVdyaXRlJyxcblxuICAvKipcbiAgICogT2JqZWN0IG93bmVyIGdldHMgRlVMTF9DT05UUk9MLiBCdWNrZXQgb3duZXIgZ2V0cyBSRUFEIGFjY2Vzcy5cbiAgICogSWYgeW91IHNwZWNpZnkgdGhpcyBjYW5uZWQgQUNMIHdoZW4gY3JlYXRpbmcgYSBidWNrZXQsIEFtYXpvbiBTMyBpZ25vcmVzIGl0LlxuICAgKi9cbiAgQlVDS0VUX09XTkVSX1JFQUQgPSAnQnVja2V0T3duZXJSZWFkJyxcblxuICAvKipcbiAgICogQm90aCB0aGUgb2JqZWN0IG93bmVyIGFuZCB0aGUgYnVja2V0IG93bmVyIGdldCBGVUxMX0NPTlRST0wgb3ZlciB0aGUgb2JqZWN0LlxuICAgKiBJZiB5b3Ugc3BlY2lmeSB0aGlzIGNhbm5lZCBBQ0wgd2hlbiBjcmVhdGluZyBhIGJ1Y2tldCwgQW1hem9uIFMzIGlnbm9yZXMgaXQuXG4gICAqL1xuICBCVUNLRVRfT1dORVJfRlVMTF9DT05UUk9MID0gJ0J1Y2tldE93bmVyRnVsbENvbnRyb2wnLFxuXG4gIC8qKlxuICAgKiBPd25lciBnZXRzIEZVTExfQ09OVFJPTC4gQW1hem9uIEVDMiBnZXRzIFJFQUQgYWNjZXNzIHRvIEdFVCBhbiBBbWF6b24gTWFjaGluZSBJbWFnZSAoQU1JKSBidW5kbGUgZnJvbSBBbWF6b24gUzMuXG4gICAqL1xuICBBV1NfRVhFQ19SRUFEID0gJ0F3c0V4ZWNSZWFkJyxcbn1cblxuZXhwb3J0IGludGVyZmFjZSBSb3V0aW5nUnVsZUNvbmRpdGlvbiB7XG4gIC8qKlxuICAgKiBUaGUgSFRUUCBlcnJvciBjb2RlIHdoZW4gdGhlIHJlZGlyZWN0IGlzIGFwcGxpZWRcbiAgICpcbiAgICogSW4gdGhlIGV2ZW50IG9mIGFuIGVycm9yLCBpZiB0aGUgZXJyb3IgY29kZSBlcXVhbHMgdGhpcyB2YWx1ZSwgdGhlbiB0aGUgc3BlY2lmaWVkIHJlZGlyZWN0IGlzIGFwcGxpZWQuXG4gICAqXG4gICAqIElmIGJvdGggY29uZGl0aW9uIHByb3BlcnRpZXMgYXJlIHNwZWNpZmllZCwgYm90aCBtdXN0IGJlIHRydWUgZm9yIHRoZSByZWRpcmVjdCB0byBiZSBhcHBsaWVkLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIFRoZSBIVFRQIGVycm9yIGNvZGUgd2lsbCBub3QgYmUgdmVyaWZpZWRcbiAgICovXG4gIHJlYWRvbmx5IGh0dHBFcnJvckNvZGVSZXR1cm5lZEVxdWFscz86IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIG9iamVjdCBrZXkgbmFtZSBwcmVmaXggd2hlbiB0aGUgcmVkaXJlY3QgaXMgYXBwbGllZFxuICAgKlxuICAgKiBJZiBib3RoIGNvbmRpdGlvbiBwcm9wZXJ0aWVzIGFyZSBzcGVjaWZpZWQsIGJvdGggbXVzdCBiZSB0cnVlIGZvciB0aGUgcmVkaXJlY3QgdG8gYmUgYXBwbGllZC5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBUaGUgb2JqZWN0IGtleSBuYW1lIHdpbGwgbm90IGJlIHZlcmlmaWVkXG4gICAqL1xuICByZWFkb25seSBrZXlQcmVmaXhFcXVhbHM/OiBzdHJpbmc7XG59XG5cbmV4cG9ydCBjbGFzcyBSZXBsYWNlS2V5IHtcbiAgLyoqXG4gICAqIFRoZSBzcGVjaWZpYyBvYmplY3Qga2V5IHRvIHVzZSBpbiB0aGUgcmVkaXJlY3QgcmVxdWVzdFxuICAgKi9cbiAgcHVibGljIHN0YXRpYyB3aXRoKGtleVJlcGxhY2VtZW50OiBzdHJpbmcpIHtcbiAgICByZXR1cm4gbmV3IHRoaXMoa2V5UmVwbGFjZW1lbnQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBvYmplY3Qga2V5IHByZWZpeCB0byB1c2UgaW4gdGhlIHJlZGlyZWN0IHJlcXVlc3RcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcHJlZml4V2l0aChrZXlSZXBsYWNlbWVudDogc3RyaW5nKSB7XG4gICAgcmV0dXJuIG5ldyB0aGlzKHVuZGVmaW5lZCwga2V5UmVwbGFjZW1lbnQpO1xuICB9XG5cbiAgcHJpdmF0ZSBjb25zdHJ1Y3RvcihwdWJsaWMgcmVhZG9ubHkgd2l0aEtleT86IHN0cmluZywgcHVibGljIHJlYWRvbmx5IHByZWZpeFdpdGhLZXk/OiBzdHJpbmcpIHtcbiAgfVxufVxuXG4vKipcbiAqIFJ1bGUgdGhhdCBkZWZpbmUgd2hlbiBhIHJlZGlyZWN0IGlzIGFwcGxpZWQgYW5kIHRoZSByZWRpcmVjdCBiZWhhdmlvci5cbiAqXG4gKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BbWF6b25TMy9sYXRlc3QvZGV2L2hvdy10by1wYWdlLXJlZGlyZWN0Lmh0bWxcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBSb3V0aW5nUnVsZSB7XG4gIC8qKlxuICAgKiBUaGUgaG9zdCBuYW1lIHRvIHVzZSBpbiB0aGUgcmVkaXJlY3QgcmVxdWVzdFxuICAgKlxuICAgKiBAZGVmYXVsdCAtIFRoZSBob3N0IG5hbWUgdXNlZCBpbiB0aGUgb3JpZ2luYWwgcmVxdWVzdC5cbiAgICovXG4gIHJlYWRvbmx5IGhvc3ROYW1lPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgSFRUUCByZWRpcmVjdCBjb2RlIHRvIHVzZSBvbiB0aGUgcmVzcG9uc2VcbiAgICpcbiAgICogQGRlZmF1bHQgXCIzMDFcIiAtIE1vdmVkIFBlcm1hbmVudGx5XG4gICAqL1xuICByZWFkb25seSBodHRwUmVkaXJlY3RDb2RlPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBQcm90b2NvbCB0byB1c2Ugd2hlbiByZWRpcmVjdGluZyByZXF1ZXN0c1xuICAgKlxuICAgKiBAZGVmYXVsdCAtIFRoZSBwcm90b2NvbCB1c2VkIGluIHRoZSBvcmlnaW5hbCByZXF1ZXN0LlxuICAgKi9cbiAgcmVhZG9ubHkgcHJvdG9jb2w/OiBSZWRpcmVjdFByb3RvY29sO1xuXG4gIC8qKlxuICAgKiBTcGVjaWZpZXMgdGhlIG9iamVjdCBrZXkgcHJlZml4IHRvIHVzZSBpbiB0aGUgcmVkaXJlY3QgcmVxdWVzdFxuICAgKlxuICAgKiBAZGVmYXVsdCAtIFRoZSBrZXkgd2lsbCBub3QgYmUgcmVwbGFjZWRcbiAgICovXG4gIHJlYWRvbmx5IHJlcGxhY2VLZXk/OiBSZXBsYWNlS2V5O1xuXG4gIC8qKlxuICAgKiBTcGVjaWZpZXMgYSBjb25kaXRpb24gdGhhdCBtdXN0IGJlIG1ldCBmb3IgdGhlIHNwZWNpZmllZCByZWRpcmVjdCB0byBhcHBseS5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBObyBjb25kaXRpb25cbiAgICovXG4gIHJlYWRvbmx5IGNvbmRpdGlvbj86IFJvdXRpbmdSdWxlQ29uZGl0aW9uO1xufVxuXG4vKipcbiAqIE1vZGVzIGluIHdoaWNoIFMzIE9iamVjdCBMb2NrIHJldGVudGlvbiBjYW4gYmUgY29uZmlndXJlZC5cbiAqXG4gKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BbWF6b25TMy9sYXRlc3QvdXNlcmd1aWRlL29iamVjdC1sb2NrLW92ZXJ2aWV3Lmh0bWwjb2JqZWN0LWxvY2stcmV0ZW50aW9uLW1vZGVzXG4gKi9cbmV4cG9ydCBlbnVtIE9iamVjdExvY2tNb2RlIHtcbiAgLyoqXG4gICAqIFRoZSBHb3Zlcm5hbmNlIHJldGVudGlvbiBtb2RlLlxuICAgKlxuICAgKiBXaXRoIGdvdmVybmFuY2UgbW9kZSwgeW91IHByb3RlY3Qgb2JqZWN0cyBhZ2FpbnN0IGJlaW5nIGRlbGV0ZWQgYnkgbW9zdCB1c2VycywgYnV0IHlvdSBjYW5cbiAgICogc3RpbGwgZ3JhbnQgc29tZSB1c2VycyBwZXJtaXNzaW9uIHRvIGFsdGVyIHRoZSByZXRlbnRpb24gc2V0dGluZ3Mgb3IgZGVsZXRlIHRoZSBvYmplY3QgaWZcbiAgICogbmVjZXNzYXJ5LiBZb3UgY2FuIGFsc28gdXNlIGdvdmVybmFuY2UgbW9kZSB0byB0ZXN0IHJldGVudGlvbi1wZXJpb2Qgc2V0dGluZ3MgYmVmb3JlXG4gICAqIGNyZWF0aW5nIGEgY29tcGxpYW5jZS1tb2RlIHJldGVudGlvbiBwZXJpb2QuXG4gICAqL1xuICBHT1ZFUk5BTkNFID0gJ0dPVkVSTkFOQ0UnLFxuXG4gIC8qKlxuICAgKiBUaGUgQ29tcGxpYW5jZSByZXRlbnRpb24gbW9kZS5cbiAgICpcbiAgICogV2hlbiBhbiBvYmplY3QgaXMgbG9ja2VkIGluIGNvbXBsaWFuY2UgbW9kZSwgaXRzIHJldGVudGlvbiBtb2RlIGNhbid0IGJlIGNoYW5nZWQsIGFuZFxuICAgKiBpdHMgcmV0ZW50aW9uIHBlcmlvZCBjYW4ndCBiZSBzaG9ydGVuZWQuIENvbXBsaWFuY2UgbW9kZSBoZWxwcyBlbnN1cmUgdGhhdCBhbiBvYmplY3RcbiAgICogdmVyc2lvbiBjYW4ndCBiZSBvdmVyd3JpdHRlbiBvciBkZWxldGVkIGZvciB0aGUgZHVyYXRpb24gb2YgdGhlIHJldGVudGlvbiBwZXJpb2QuXG4gICAqL1xuICBDT01QTElBTkNFID0gJ0NPTVBMSUFOQ0UnLFxufVxuXG4vKipcbiAqIFRoZSBkZWZhdWx0IHJldGVudGlvbiBzZXR0aW5ncyBmb3IgYW4gUzMgT2JqZWN0IExvY2sgY29uZmlndXJhdGlvbi5cbiAqXG4gKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BbWF6b25TMy9sYXRlc3QvdXNlcmd1aWRlL29iamVjdC1sb2NrLW92ZXJ2aWV3Lmh0bWxcbiAqL1xuZXhwb3J0IGNsYXNzIE9iamVjdExvY2tSZXRlbnRpb24ge1xuICAvKipcbiAgICogQ29uZmlndXJlIGZvciBHb3Zlcm5hbmNlIHJldGVudGlvbiBmb3IgYSBzcGVjaWZpZWQgZHVyYXRpb24uXG4gICAqXG4gICAqIFdpdGggZ292ZXJuYW5jZSBtb2RlLCB5b3UgcHJvdGVjdCBvYmplY3RzIGFnYWluc3QgYmVpbmcgZGVsZXRlZCBieSBtb3N0IHVzZXJzLCBidXQgeW91IGNhblxuICAgKiBzdGlsbCBncmFudCBzb21lIHVzZXJzIHBlcm1pc3Npb24gdG8gYWx0ZXIgdGhlIHJldGVudGlvbiBzZXR0aW5ncyBvciBkZWxldGUgdGhlIG9iamVjdCBpZlxuICAgKiBuZWNlc3NhcnkuIFlvdSBjYW4gYWxzbyB1c2UgZ292ZXJuYW5jZSBtb2RlIHRvIHRlc3QgcmV0ZW50aW9uLXBlcmlvZCBzZXR0aW5ncyBiZWZvcmVcbiAgICogY3JlYXRpbmcgYSBjb21wbGlhbmNlLW1vZGUgcmV0ZW50aW9uIHBlcmlvZC5cbiAgICpcbiAgICogQHBhcmFtIGR1cmF0aW9uIHRoZSBsZW5ndGggb2YgdGltZSBmb3Igd2hpY2ggb2JqZWN0cyBzaG91bGQgcmV0YWluZWRcbiAgICogQHJldHVybnMgdGhlIE9iamVjdExvY2tSZXRlbnRpb24gY29uZmlndXJhdGlvblxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBnb3Zlcm5hbmNlKGR1cmF0aW9uOiBEdXJhdGlvbik6IE9iamVjdExvY2tSZXRlbnRpb24ge1xuICAgIHJldHVybiBuZXcgT2JqZWN0TG9ja1JldGVudGlvbihPYmplY3RMb2NrTW9kZS5HT1ZFUk5BTkNFLCBkdXJhdGlvbik7XG4gIH1cblxuICAvKipcbiAgICogQ29uZmlndXJlIGZvciBDb21wbGlhbmNlIHJldGVudGlvbiBmb3IgYSBzcGVjaWZpZWQgZHVyYXRpb24uXG4gICAqXG4gICAqIFdoZW4gYW4gb2JqZWN0IGlzIGxvY2tlZCBpbiBjb21wbGlhbmNlIG1vZGUsIGl0cyByZXRlbnRpb24gbW9kZSBjYW4ndCBiZSBjaGFuZ2VkLCBhbmRcbiAgICogaXRzIHJldGVudGlvbiBwZXJpb2QgY2FuJ3QgYmUgc2hvcnRlbmVkLiBDb21wbGlhbmNlIG1vZGUgaGVscHMgZW5zdXJlIHRoYXQgYW4gb2JqZWN0XG4gICAqIHZlcnNpb24gY2FuJ3QgYmUgb3ZlcndyaXR0ZW4gb3IgZGVsZXRlZCBmb3IgdGhlIGR1cmF0aW9uIG9mIHRoZSByZXRlbnRpb24gcGVyaW9kLlxuICAgKlxuICAgKiBAcGFyYW0gZHVyYXRpb24gdGhlIGxlbmd0aCBvZiB0aW1lIGZvciB3aGljaCBvYmplY3RzIHNob3VsZCBiZSByZXRhaW5lZFxuICAgKiBAcmV0dXJucyB0aGUgT2JqZWN0TG9ja1JldGVudGlvbiBjb25maWd1cmF0aW9uXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGNvbXBsaWFuY2UoZHVyYXRpb246IER1cmF0aW9uKTogT2JqZWN0TG9ja1JldGVudGlvbiB7XG4gICAgcmV0dXJuIG5ldyBPYmplY3RMb2NrUmV0ZW50aW9uKE9iamVjdExvY2tNb2RlLkNPTVBMSUFOQ0UsIGR1cmF0aW9uKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgZGVmYXVsdCBwZXJpb2QgZm9yIHdoaWNoIG9iamVjdHMgc2hvdWxkIGJlIHJldGFpbmVkLlxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IGR1cmF0aW9uOiBEdXJhdGlvbjtcblxuICAvKipcbiAgICogVGhlIHJldGVudGlvbiBtb2RlIHRvIHVzZSBmb3IgdGhlIG9iamVjdCBsb2NrIGNvbmZpZ3VyYXRpb24uXG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FtYXpvblMzL2xhdGVzdC91c2VyZ3VpZGUvb2JqZWN0LWxvY2stb3ZlcnZpZXcuaHRtbCNvYmplY3QtbG9jay1yZXRlbnRpb24tbW9kZXNcbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBtb2RlOiBPYmplY3RMb2NrTW9kZTtcblxuICBwcml2YXRlIGNvbnN0cnVjdG9yKG1vZGU6IE9iamVjdExvY2tNb2RlLCBkdXJhdGlvbjogRHVyYXRpb24pIHtcbiAgICAvLyBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQW1hem9uUzMvbGF0ZXN0L3VzZXJndWlkZS9vYmplY3QtbG9jay1tYW5hZ2luZy5odG1sI29iamVjdC1sb2NrLW1hbmFnaW5nLXJldGVudGlvbi1saW1pdHNcbiAgICBpZiAoZHVyYXRpb24udG9EYXlzKCkgPiAzNjUgKiAxMDApIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignT2JqZWN0IExvY2sgcmV0ZW50aW9uIGR1cmF0aW9uIG11c3QgYmUgbGVzcyB0aGFuIDEwMCB5ZWFycycpO1xuICAgIH1cbiAgICBpZiAoZHVyYXRpb24udG9EYXlzKCkgPCAxKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ09iamVjdCBMb2NrIHJldGVudGlvbiBkdXJhdGlvbiBtdXN0IGJlIGF0IGxlYXN0IDEgZGF5Jyk7XG4gICAgfVxuXG4gICAgdGhpcy5tb2RlID0gbW9kZTtcbiAgICB0aGlzLmR1cmF0aW9uID0gZHVyYXRpb247XG4gIH1cbn1cblxuLyoqXG4gKiBPcHRpb25zIGZvciBjcmVhdGluZyBWaXJ0dWFsLUhvc3RlZCBzdHlsZSBVUkwuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgVmlydHVhbEhvc3RlZFN0eWxlVXJsT3B0aW9ucyB7XG4gIC8qKlxuICAgKiBTcGVjaWZpZXMgdGhlIFVSTCBpbmNsdWRlcyB0aGUgcmVnaW9uLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIHRydWVcbiAgICovXG4gIHJlYWRvbmx5IHJlZ2lvbmFsPzogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBPcHRpb25zIGZvciBjcmVhdGluZyBhIFRyYW5zZmVyIEFjY2VsZXJhdGlvbiBVUkwuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgVHJhbnNmZXJBY2NlbGVyYXRpb25VcmxPcHRpb25zIHtcbiAgLyoqXG4gICAqIER1YWwtc3RhY2sgc3VwcG9ydCB0byBjb25uZWN0IHRvIHRoZSBidWNrZXQgb3ZlciBJUHY2LlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIGZhbHNlXG4gICAqL1xuICByZWFkb25seSBkdWFsU3RhY2s/OiBib29sZWFuO1xufVxuXG5mdW5jdGlvbiBtYXBPclVuZGVmaW5lZDxULCBVPihsaXN0OiBUW10gfCB1bmRlZmluZWQsIGNhbGxiYWNrOiAoZWxlbWVudDogVCkgPT4gVSk6IFVbXSB8IHVuZGVmaW5lZCB7XG4gIGlmICghbGlzdCB8fCBsaXN0Lmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICByZXR1cm4gbGlzdC5tYXAoY2FsbGJhY2spO1xufVxuIl19