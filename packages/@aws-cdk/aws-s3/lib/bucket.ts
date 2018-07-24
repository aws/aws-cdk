import iam = require('@aws-cdk/aws-iam');
import kms = require('@aws-cdk/aws-kms');
import cdk = require('@aws-cdk/cdk');
import { BucketPolicy } from './bucket-policy';
import perms = require('./perms');
import { LifecycleRule } from './rule';
import { BucketArn, BucketDomainName, BucketDualStackDomainName, cloudformation } from './s3.generated';
import { parseBucketArn, parseBucketName, validateBucketName } from './util';

/**
 * A reference to a bucket. The easiest way to instantiate is to call
 * `bucket.export()`. Then, the consumer can use `Bucket.import(this, ref)` and
 * get a `Bucket`.
 */
export interface BucketRefProps {
    /**
     * The ARN fo the bucket. At least one of bucketArn or bucketName must be
     * defined in order to initialize a bucket ref.
     */
    bucketArn?: BucketArn;

    /**
     * The name of the bucket. If the underlying value of ARN is a string, the
     * name will be parsed from the ARN. Otherwise, the name is optional, but
     * some features that require the bucket name such as auto-creating a bucket
     * policy, won't work.
     */
    bucketName?: BucketName;
}

/**
 * Represents an S3 Bucket.
 *
 * Buckets can be either defined within this stack:
 *
 *     new Bucket(this, 'MyBucket', { props });
 *
 * Or imported from an existing bucket:
 *
 *     BucketRef.import(this, 'MyImportedBucket', { bucketArn: ... });
 *
 * You can also export a bucket and import it into another stack:
 *
 *     const ref = myBucket.export();
 *     BucketRef.import(this, 'MyImportedBucket', ref);
 *
 */
export abstract class BucketRef extends cdk.Construct {
    /**
     * Creates a Bucket construct that represents an external bucket.
     *
     * @param parent The parent creating construct (usually `this`).
     * @param name The construct's name.
     * @param ref A BucketRefProps object. Can be obtained from a call to
     * `bucket.export()`.
     */
    public static import(parent: cdk.Construct, name: string, props: BucketRefProps): BucketRef {
        return new ImportedBucketRef(parent, name, props);
    }

    /**
     * The ARN of the bucket.
     */
    public abstract readonly bucketArn: BucketArn;

    /**
     * The name of the bucket.
     */
    public abstract readonly bucketName: BucketName;

    /**
     * Optional KMS encryption key associated with this bucket.
     */
    public abstract readonly encryptionKey?: kms.EncryptionKeyRef;

    /**
     * The resource policy assoicated with this bucket.
     *
     * If `autoCreatePolicy` is true, a `BucketPolicy` will be created upon the
     * first call to addToResourcePolicy(s).
     */
    protected abstract policy?: BucketPolicy;

    /**
     * Indicates if a bucket resource policy should automatically created upon
     * the first call to `addToResourcePolicy`.
     */
    protected abstract autoCreatePolicy = false;

    /**
     * Exports this bucket from the stack.
     */
    public export(): BucketRefProps {
        return {
            bucketArn: new cdk.Output(this, 'BucketArn', { value: this.bucketArn }).makeImportValue(),
            bucketName: new cdk.Output(this, 'BucketName', { value: this.bucketName }).makeImportValue(),
        };
    }

    /**
     * Adds a statement to the resource policy for a principal (i.e.
     * account/role/service) to perform actions on this bucket and/or it's
     * contents. Use `bucketArn` and `arnForObjects(keys)` to obtain ARNs for
     * this bucket or objects.
     */
    public addToResourcePolicy(permission: cdk.PolicyStatement) {
        if (!this.policy && this.autoCreatePolicy) {
            this.policy = new BucketPolicy(this, 'Policy', { bucket: this });
        }

        if (this.policy) {
            this.policy.document.addStatement(permission);
        }
    }

    /**
     * The https:// URL of this bucket.
     * @example https://s3.us-west-1.amazonaws.com/onlybucket
     * Similar to calling `urlForObject` with no object key.
     */
    public get bucketUrl() {
        return this.urlForObject();
    }

    /**
     * The https URL of an S3 object. For example:
     * @example https://s3.us-west-1.amazonaws.com/onlybucket
     * @example https://s3.us-west-1.amazonaws.com/bucket/key
     * @example https://s3.cn-north-1.amazonaws.com.cn/china-bucket/mykey
     * @param key The S3 key of the object. If not specified, the URL of the
     *            bucket is returned.
     * @returns an ObjectS3Url token
     */
    public urlForObject(key?: any): S3Url {
        const components = [ 'https://', 's3.', new cdk.AwsRegion(), '.', new cdk.AwsURLSuffix(), '/', this.bucketName ];
        if (key) {
            // trim prepending '/'
            if (typeof key === 'string' && key.startsWith('/')) {
                key = key.substr(1);
            }
            components.push('/');
            components.push(key);
        }

        return new cdk.FnConcat(...components);
    }

    /**
     * Returns an ARN that represents all objects within the bucket that match
     * the key pattern specified. To represent all keys, specify ``"*"``.
     *
     * If you specify multiple components for keyPattern, they will be concatenated::
     *
     *     arnForObjects('home/', team, '/', user, '/*')
     *
     */
    public arnForObjects(...keyPattern: any[]): cdk.Arn {
        return new cdk.FnConcat(this.bucketArn, '/', ...keyPattern);
    }

    /**
     * Temporary API for granting read permissions for this bucket and it's
     * contents to an IAM principal (Role/Group/User).
     *
     * If an encryption key is used, permission to ues the key to decrypt the
     * contents of the bucket will also be granted.
     */
    public grantRead(identity?: iam.IPrincipal, objectsKeyPattern: any = '*') {
        if (!identity) {
            return;
        }
        this.grant(identity, objectsKeyPattern, perms.BUCKET_READ_ACTIONS, perms.KEY_READ_ACTIONS);
    }

    /**
     * Grants read/write permissions for this bucket and it's contents to an IAM
     * principal (Role/Group/User).
     *
     * If an encryption key is used, permission to use the key for
     * encrypt/decrypt will also be granted.
     */
    public grantReadWrite(identity?: iam.IPrincipal, objectsKeyPattern: any = '*') {
        if (!identity) {
            return;
        }
        const bucketActions = perms.BUCKET_READ_ACTIONS.concat(perms.BUCKET_WRITE_ACTIONS);
        const keyActions = perms.KEY_READ_ACTIONS.concat(perms.KEY_WRITE_ACTIONS);
        this.grant(identity, objectsKeyPattern, bucketActions, keyActions);
    }

    private grant(identity: iam.IPrincipal, objectsKeyPattern: any, bucketActions: string[], keyActions: string[]) {
        const resources = [
            this.bucketArn,
            this.arnForObjects(objectsKeyPattern)
        ];

        identity.addToPolicy(new cdk.PolicyStatement()
            .addResources(...resources)
            .addActions(...bucketActions));

        // grant key permissions if there's an associated key.
        if (this.encryptionKey) {
            // KMS permissions need to be granted both directions
            identity.addToPolicy(new cdk.PolicyStatement()
                .addResource(this.encryptionKey.keyArn)
                .addActions(...keyActions));

            this.encryptionKey.addToResourcePolicy(new cdk.PolicyStatement()
                .addResource('*')
                .addPrincipal(identity.principal)
                .addActions(...keyActions));
        }
    }
}

export interface BucketProps {
    /**
     * The kind of server-side encryption to apply to this bucket.
     *
     * If you choose KMS, you can specify a KMS key via `encryptionKey`. If
     * encryption key is not specified, a key will automatically be created.
     *
     * @default Unencrypted
     */
    encryption?: BucketEncryption;

    /**
     * External KMS key to use for bucket encryption.
     *
     * The 'encryption' property must be either not specified or set to "Kms".
     * An error will be emitted if encryption is set to "Unencrypted" or
     * "Managed".
     *
     * @default If encryption is set to "Kms" and this property is undefined, a
     * new KMS key will be created and associated with this bucket.
     */
    encryptionKey?: kms.EncryptionKeyRef;

    /**
     * Physical name of this bucket.
     *
     * @default Assigned by CloudFormation (recommended)
     */
    bucketName?: string;

    /**
     * Policy to apply when the bucket is removed from this stack.
     *
     * @default By default, the bucket will be destroyed if it is removed from the stack.
     */
    removalPolicy?: cdk.RemovalPolicy;

    /**
     * The bucket policy associated with this bucket.
     *
     * @default A bucket policy will be created automatically in the first call
     * to addToPolicy.
     */
    policy?: BucketPolicy;

    /**
     * Whether this bucket should have versioning turned on or not.
     *
     * @default false
     */
    versioned?: boolean;

    /**
     * Rules that define how Amazon S3 manages objects during their lifetime.
     *
     * @default No lifecycle rules
     */
    lifecycleRules?: LifecycleRule[];
}

/**
 * An S3 bucket with associated policy objects
 *
 * This bucket does not yet have all features that exposed by the underlying
 * BucketResource.
 */
export class Bucket extends BucketRef {
    public readonly bucketArn: BucketArn;
    public readonly bucketName: BucketName;
    public readonly domainName: BucketDomainName;
    public readonly dualstackDomainName: BucketDualStackDomainName;
    public readonly encryptionKey?: kms.EncryptionKeyRef;
    protected policy?: BucketPolicy;
    protected autoCreatePolicy = true;
    private readonly lifecycleRules: LifecycleRule[] = [];
    private readonly versioned?: boolean;

    constructor(parent: cdk.Construct, name: string, props: BucketProps = {}) {
        super(parent, name);

        validateBucketName(props && props.bucketName);

        const { bucketEncryption, encryptionKey } = this.parseEncryption(props);

        const resource = new cloudformation.BucketResource(this, 'Resource', {
            bucketName: props && props.bucketName,
            bucketEncryption,
            versioningConfiguration: props.versioned ? { status: 'Enabled' } : undefined,
            lifecycleConfiguration: new cdk.Token(() => this.parseLifecycleConfiguration()),
        });

        cdk.applyRemovalPolicy(resource, props.removalPolicy);

        this.versioned = props.versioned;
        this.policy = props.policy;
        this.encryptionKey = encryptionKey;
        this.bucketArn = resource.bucketArn;
        this.bucketName = resource.ref;
        this.domainName = resource.bucketDomainName;
        this.dualstackDomainName = resource.bucketDualStackDomainName;

        // Add all lifecycle rules
        (props.lifecycleRules || []).forEach(this.addLifecycleRule.bind(this));
    }

    /**
     * Add a lifecycle rule to the bucket
     *
     * @param rule The rule to add
     */
    public addLifecycleRule(rule: LifecycleRule) {
        if ((rule.noncurrentVersionExpirationInDays !== undefined
            || (rule.noncurrentVersionTransitions && rule.noncurrentVersionTransitions.length > 0))
            && !this.versioned) {
            throw new Error("Cannot use 'noncurrent' rules on a nonversioned bucket");
        }

        this.lifecycleRules.push(rule);
    }

    /**
     * Set up key properties and return the Bucket encryption property from the
     * user's configuration.
     */
    private parseEncryption(props: BucketProps): {
        bucketEncryption?: cloudformation.BucketResource.BucketEncryptionProperty,
        encryptionKey?: kms.EncryptionKeyRef
    } {

        // default to unencrypted.
        const encryptionType = props.encryption || BucketEncryption.Unencrypted;

        // if encryption key is set, encryption must be set to KMS.
        if (encryptionType !== BucketEncryption.Kms && props.encryptionKey) {
            throw new Error(`encryptionKey is specified, so 'encryption' must be set to KMS (value: ${encryptionType})`);
        }

        if (encryptionType === BucketEncryption.Unencrypted) {
            return { bucketEncryption: undefined, encryptionKey: undefined };
        }

        if (encryptionType === BucketEncryption.Kms) {
            const encryptionKey = props.encryptionKey || new kms.EncryptionKey(this, 'Key', {
                description: `Created by ${this.path}`
            });

            const bucketEncryption = {
                serverSideEncryptionConfiguration: [
                    {
                        serverSideEncryptionByDefault: {
                            sseAlgorithm: 'aws:kms',
                            kmsMasterKeyId: encryptionKey.keyArn
                        }
                    }
                ]
            };
            return { encryptionKey, bucketEncryption };
        }

        if (encryptionType === BucketEncryption.S3Managed) {
            const bucketEncryption = {
                serverSideEncryptionConfiguration: [
                    { serverSideEncryptionByDefault: { sseAlgorithm: 'AES256' } }
                ]
            };

            return { bucketEncryption };
        }

        if (encryptionType === BucketEncryption.KmsManaged) {
            const bucketEncryption = {
                serverSideEncryptionConfiguration: [
                    { serverSideEncryptionByDefault: { sseAlgorithm: 'aws:kms' } }
                ]
            };
            return { bucketEncryption };
        }

        throw new Error(`Unexpected 'encryptionType': ${encryptionType}`);
    }

    /**
     * Parse the lifecycle configuration out of the uucket props
     * @param props Par
     */
    private parseLifecycleConfiguration(): cloudformation.BucketResource.LifecycleConfigurationProperty | undefined {
        if (!this.lifecycleRules || this.lifecycleRules.length === 0) {
            return undefined;
        }

        return { rules: this.lifecycleRules.map(parseLifecycleRule) };

        function parseLifecycleRule(rule: LifecycleRule): cloudformation.BucketResource.RuleProperty {
            const enabled = rule.enabled !== undefined ? rule.enabled : true;

            const x = {
                // tslint:disable-next-line:max-line-length
                abortIncompleteMultipartUpload: rule.abortIncompleteMultipartUploadAfterDays !== undefined ? { daysAfterInitiation: rule.abortIncompleteMultipartUploadAfterDays } : undefined,
                expirationDate: rule.expirationDate,
                expirationInDays: rule.expirationInDays,
                id: rule.id,
                noncurrentVersionExpirationInDays: rule.noncurrentVersionExpirationInDays,
                noncurrentVersionTransitions: rule.noncurrentVersionTransitions,
                prefix: rule.prefix,
                status: enabled ? 'Enabled' : 'Disabled',
                transitions: rule.transitions,
                tagFilters: parseTagFilters(rule.tagFilters)
            };

            return x;
        }

        function parseTagFilters(tagFilters?: {[tag: string]: any}) {
            if (!tagFilters || tagFilters.length === 0) {
                return undefined;
            }

            return Object.keys(tagFilters).map(tag => ({
                key: tag,
                value: tagFilters[tag]
            }));
        }
    }
}

/**
 * What kind of server-side encryption to apply to this bucket
 */
export enum BucketEncryption {
    /**
     * Objects in the bucket are not encrypted.
     */
    Unencrypted = 'NONE',

    /**
     * Server-side KMS encryption with a master key managed by KMS.
     */
    KmsManaged = 'MANAGED',

    /**
     * Server-side encryption with a master key managed by S3.
     */
    S3Managed = 'S3MANAGED',

    /**
     * Server-side encryption with a KMS key managed by the user.
     * If `encryptionKey` is specified, this key will be used, otherwise, one will be defined.
     */
    Kms = 'KMS',
}

/**
 * The name of the bucket.
 */
export class BucketName extends cdk.Token {

}

/**
 * A key to an S3 object.
 */
export class ObjectKey extends cdk.Token {

}

/**
 * The web URL (https://s3.us-west-1.amazonaws.com/bucket/key) of an S3 object.
 */
export class S3Url extends cdk.Token {

}

class ImportedBucketRef extends BucketRef {
    public readonly bucketArn: BucketArn;
    public readonly bucketName: BucketName;
    public readonly encryptionKey?: kms.EncryptionKey;

    protected policy?: BucketPolicy;
    protected autoCreatePolicy: boolean;

    constructor(parent: cdk.Construct, name: string, props: BucketRefProps) {
        super(parent, name);

        this.bucketArn = parseBucketArn(props);
        this.bucketName = parseBucketName(props);
        this.autoCreatePolicy = false;
        this.policy = undefined;
    }
}
