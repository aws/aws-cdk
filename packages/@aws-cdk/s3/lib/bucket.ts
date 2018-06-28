import { applyRemovalPolicy, Arn, Construct, FnConcat, Output, PolicyStatement, RemovalPolicy, ServicePrincipal, Token } from '@aws-cdk/core';
import { IIdentityResource, Role } from '@aws-cdk/iam';
import * as kms from '@aws-cdk/kms';
import { s3 } from '@aws-cdk/resources';
import { BucketPolicy } from './bucket-policy';
import * as perms from './perms';
import { LifecycleRule } from './rule';
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
    bucketArn?: s3.BucketArn;

    /**
     * The name of the bucket. If the underlying value of ARN is a string, the
     * name will be parsed from the ARN. Otherwise, the name is optional, but
     * some features that require the bucket name such as auto-creating a bucket
     * policy, won't work.
     */
    bucketName?: BucketName;

    /**
     * The ARN of the bucket's encryption key
     */
    keyArn?: Arn;
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
export abstract class BucketRef extends Construct {
    /**
     * Creates a Bucket construct that represents an external bucket.
     *
     * @param parent The parent creating construct (usually `this`).
     * @param name The construct's name.
     * @param ref A BucketRefProps object. Can be obtained from a call to
     * `bucket.export()`.
     */
    public static import(parent: Construct, name: string, props: BucketRefProps): BucketRef {
        return new ImportedBucketRef(parent, name, props);
    }

    /**
     * The ARN of the bucket.
     */
    public abstract readonly bucketArn: s3.BucketArn;

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
            bucketArn: new Output(this, 'BucketArn', { value: this.bucketArn }).makeImportValue(),
            bucketName: new Output(this, 'BucketName', { value: this.bucketName }).makeImportValue(),
            ...(this.encryptionKey ? this.encryptionKey.export() : undefined)
        };
    }

    /**
     * Adds a statement to the resource policy for a principal (i.e.
     * account/role/service) to perform actions on this bucket and/or it's
     * contents. Use `bucketArn` and `arnForObjects(keys)` to obtain ARNs for
     * this bucket or objects.
     */
    public addToResourcePolicy(permission: PolicyStatement) {
        if (!this.policy && this.autoCreatePolicy) {
            this.policy = new BucketPolicy(this, 'Policy', { bucket: this });
        }

        if (this.policy) {
            this.policy.document.addStatement(permission);
        }
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
    public arnForObjects(...keyPattern: any[]): Arn {
        return new FnConcat(this.bucketArn, '/', ...keyPattern);
    }

    /**
     * Temporary API for granting read permissions for this bucket and it's
     * contents to an IAM principal (Role/Group/User).
     *
     * If an encryption key is used, permission to ues the key to decrypt the
     * contents of the bucket will also be granted.
     */
    public grantRead(identity?: IIdentityResource, objectsKeyPattern = '*') {
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
    public grantReadWrite(identity?: IIdentityResource, objectsKeyPattern = '*') {
        if (!identity) {
            return;
        }
        const bucketActions = perms.BUCKET_READ_ACTIONS.concat(perms.BUCKET_WRITE_ACTIONS);
        const keyActions = perms.KEY_READ_ACTIONS.concat(perms.KEY_WRITE_ACTIONS);
        this.grant(identity, objectsKeyPattern, bucketActions, keyActions);
    }

    private grant(identity: IIdentityResource, objectsKeyPattern: string, bucketActions: string[], keyActions: string[]) {
        const resources = [
            this.bucketArn,
            this.arnForObjects(objectsKeyPattern)
        ];

        identity.addToPolicy(new PolicyStatement()
            .addResources(...resources)
            .addActions(...bucketActions));

        // grant key permissions if there's an associated key.
        if (this.encryptionKey) {
            grantKeyActions(identity, this.encryptionKey, keyActions);
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
    removalPolicy?: RemovalPolicy;

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
    public readonly bucketArn: s3.BucketArn;
    public readonly bucketName: BucketName;
    public readonly domainName: s3.BucketDomainName;
    public readonly dualstackDomainName: s3.BucketDualStackDomainName;
    public readonly encryptionKey?: kms.EncryptionKeyRef;
    protected policy?: BucketPolicy;
    protected autoCreatePolicy = true;
    private readonly lifecycleRules: LifecycleRule[] = [];
    private readonly versioned?: boolean;
    private replicationConfiguration?: s3.BucketResource.ReplicationConfigurationProperty;
    private readonly encryptionType: BucketEncryption;

    constructor(parent: Construct, name: string, props: BucketProps = {}) {
        super(parent, name);

        validateBucketName(props && props.bucketName);

        this.encryptionType = props.encryption || BucketEncryption.Unencrypted;
        const { bucketEncryption, encryptionKey } = this.parseEncryption(this.encryptionType, props);

        const resource = new s3.BucketResource(this, 'Resource', {
            bucketName: props && props.bucketName,
            bucketEncryption,
            versioningConfiguration: props.versioned ? { status: 'Enabled' } : undefined,
            lifecycleConfiguration: new Token(() => this.parseLifecycleConfiguration()),
            replicationConfiguration: new Token(() => this.replicationConfiguration),
        });

        applyRemovalPolicy(resource, props.removalPolicy);

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
     * Switch on bucket replication to the given bucket
     *
     * Can specify details about prefixes to replicate by giving rules. If no rules are given,
     * all objects are replicated with default settings.
     *
     * Note that the indicated bucket MUST reside in a different region! Bucket replication
     * will not work inside the same region.
     *
     * If the source bucket is encrypted, a KMS key must be available for replication. This
     * key can be passed in to this call, or is taken from the destinationBucket if not given.
     * Note that the IAM role created for replication must be allowed to use this key. Because
     * the IAM role cannot be identified by ARN before it's created, it will be easiest to give
     * wildcard permissions on the key to encrypt things with it.
     *
     * @param destinationBucket The bucket to replicate to. Must be in a different region.
     * @param rules Selective replication rules, if required.
     */
    public enableBucketReplication(destinationBucket: BucketRef, rules?: ReplicationRule[]) {
        if (!this.versioned) {
            throw new Error('Bucket replication can only be enabled on buckets with versioning');
        }
        if (this.replicationConfiguration) {
            throw new Error('Replication configured for this bucket, can only replicate to one bucket');
        }

        // If not given, make an object that has all defaults, which effectively replicates everything.
        rules = rules || [{}];

        // Mapping also involves validation, don't proceed unless this succeeds
        const mappedRules = rules.map(r => this.renderReplicationRule(destinationBucket, r));

        // Need a role to replicate to this bucket
        //
        // https://docs.aws.amazon.com/AmazonS3/latest/dev/crr-how-setup.html
        const role = new Role(this, 'ReplicationRole', {
            assumedBy: new ServicePrincipal('s3.amazonaws.com')
        });
        role.addToPolicy(new PolicyStatement()
            .addResource(this.bucketArn)
            .addActions('s3:GetReplicationConfiguration', 's3:ListBucket'));
        role.addToPolicy(new PolicyStatement()
            .addResource(this.arnForObjects('*'))
            .addActions('s3:GetObjectVersion', 's3:GetObjectVersionAcl', 's3:GetObjectVersionTagging'));
        role.addToPolicy(new PolicyStatement()
            .addResource(destinationBucket.arnForObjects('*'))
            .addActions('s3:ReplicateObject', 's3:ReplicateDelete', 's3:ReplicateTags'));

        // TODO:
        // 1. Add the conditional KMS-using policies that are shown on this page to the key:
        //    https://docs.aws.amazon.com/AmazonS3/latest/dev/crr-walkthrough-4.html
        // 2. Add a similar policy to the key itself which doesn't mention principal (see PR).
        //    Probably make a function to make it possible for the user to call
        //    this function before they export the key.
        // 3. Figure out if an alias can be used in place of a key. The S3 console doesn't
        //    show it if we do that, but it might still work. File a bug against the S3 console
        //    if so.
        // 4. S3 console also requires us to specify a decryption key, which the model has no
        //    notion of. File a bug against CloudFormation implementation of bucket resource
        //    if it turns out that this is required.

        // If the source bucket has an encryptionKey, the role must be allowed to use it to read.
        if (this.encryptionKey) {
            grantKeyActions(role, this.encryptionKey, perms.KEY_READ_ACTIONS);
        }

        // Also give the role permissions on all destination keys involved.
        //
        // NOTE: THIS CODE LOOKS NICE BUT DOESN'T ACTUALLY WORK.
        //
        // The destination bucket and key must live in a different region, so MUST live in a different stack.
        // At this point, we're trying to create a bidirectional grant between the key in the other stack and the role
        // in this stack, which we don't have a solution for yet!
        //
        // The user should take care to manually add wildcarding to the target key.
        if (destinationBucket.encryptionKey) {
            grantKeyActions(role, destinationBucket.encryptionKey, perms.KEY_READ_ACTIONS.concat(perms.KEY_WRITE_ACTIONS));
        }
        for (const rule of rules) {
            if (rule.replicationEncryptionKey) {
                grantKeyActions(role, rule.replicationEncryptionKey, perms.KEY_READ_ACTIONS.concat(perms.KEY_WRITE_ACTIONS));
            }
        }

        // Set config
        this.replicationConfiguration = {
            role: role.roleArn,
            rules: mappedRules
        };
    }

    /**
     * Set up key properties and return the Bucket encryption property from the
     * user's configuration.
     */
    private parseEncryption(encryptionType: BucketEncryption, props: BucketProps): {
        bucketEncryption?: s3.BucketResource.BucketEncryptionProperty,
        encryptionKey?: kms.EncryptionKeyRef
    } {
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
    private parseLifecycleConfiguration(): s3.BucketResource.LifecycleConfigurationProperty | undefined {
        if (!this.lifecycleRules || this.lifecycleRules.length === 0) {
            return undefined;
        }

        return { rules: this.lifecycleRules.map(parseLifecycleRule) };

        function parseLifecycleRule(rule: LifecycleRule): s3.BucketResource.RuleProperty {
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

    /**
     * Turn one of our ReplicationRule objects into an S3 ReplicationRule object
     */
    private renderReplicationRule(destinationBucket: BucketRef, rule: ReplicationRule): s3.BucketResource.ReplicationRuleProperty {
        // Encryption handling:
        //
        // - Replicate encrypted defaults to true, can be disabled.
        // - Replication key defaults to target bucket one, can be overridden.
        // - When replicating encrypted objects, there must be a key.
        const replicateKmsEncryptedObjects = rule.replicateKmsEncryptedObjects !== undefined
                                        ? rule.replicateKmsEncryptedObjects
                                        : (this.encryptionType !== BucketEncryption.Unencrypted);

        const replicationEncryptionKey = rule.replicationEncryptionKey !== undefined
                                       ? rule.replicationEncryptionKey
                                       : destinationBucket.encryptionKey;

        if (replicateKmsEncryptedObjects && !replicationEncryptionKey) {
            throw new Error('Can only replicate encrypted objects if the destination bucket has a custom KMS key or a key is provided');
        }

        return {
            prefix: rule.prefix || '',
            destination: {
                accessControlTranslation: rule.newOwnerAccount ? { owner: 'Destination' } : undefined,
                account: rule.newOwnerAccount,
                bucket: destinationBucket.bucketArn,
                storageClass: rule.storageClass,
                encryptionConfiguration: replicationEncryptionKey ? { replicaKmsKeyId: replicationEncryptionKey.keyArn } : undefined,
            },
            sourceSelectionCriteria: replicateKmsEncryptedObjects ? { sseKmsEncryptedObjects: { status: "Enabled" } } : undefined,
            status: rule.enabled === false ? 'Disabled' : 'Enabled'
        };
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
     * Server-side KMS encryption with a master key managed by S3.
     */
    KmsManaged = 'MANAGED',

    /**
     * Server-side encryption with a KMS key managed by the user.
     * If `encryptionKey` is specified, this key will be used, otherwise, one will be defined.
     */
    Kms = 'KMS',
}

/**
 * The name of the bucket.
 */
export class BucketName extends Token {

}

/**
 * Custom rule to use for bucket replication
 */
export interface ReplicationRule {
    /**
     * Prefix of objects to replicate
     *
     * Empty string is all objects. Prefixes for multiple replication rules cannot overlap.
     *
     * @default ''
     */
    prefix?: string;

    /**
     * The AWS account you want to own the destination objects.
     *
     * Only specify a cross-account replication setup, and only specify the owner
     * account of the destination bucket. If not specified, the source AWS account
     * still owns the replicated objects.
     *
     * @default No ownership change
     */
    newOwnerAccount?: string;

    /**
     * Whether you want to replicate objects that have been encrypted with KMS keys.
     *
     * If you set this to true, either the target bucket must be encrypted with a
     * custom KMS key, or you must pass an encryption key to use for KMS encryption
     * on the rule.
     *
     * @default true if the current bucket is encrypted.
     */
    replicateKmsEncryptedObjects?: boolean;

    /**
     * KMS encryption key to use to encrypt the replicated objects.
     *
     * @default Custom KMS key of the destination bucket, if available.
     */
    replicationEncryptionKey?: kms.EncryptionKeyRef;

    /**
     * Whether the rule is enabled.
     *
     * If set to 'false', the rule exists but it disabled.
     *
     * @default true
     */
    enabled?: boolean;

    /**
     * What storage class to use for the replicated objects.
     *
     * @default Same storage class as original object.
     */
    storageClass?: ReplicationStorageClass;
}

/**
 * Storage class of replicated objects
 */
export enum ReplicationStorageClass {
    /**
     * Standard storage class.
     */
    Standard = 'STANDARD',

    /**
     * Storage class for data that is accessed less frequently, but requires rapid access when needed.
     *
     * Has lower availability than Standard storage.
     */
    InfrequentAccess = 'STANDARD_ID',

    /**
     * Infrequent Access that's only stored in one availability zone.
     *
     * Has lower availability than standard InfrequentAccess.
     */
    OneZoneInfrequentAccess = 'ONEZONE_IA',

    /**
     * Reduced Redundancy is for data that can be recreated on demand.
     *
     * It has lower durability than the other storage classes.
     */
    ReducedRedundancy = 'REDUCED_REDUNDANCY'
}

class ImportedBucketRef extends BucketRef {
    public readonly bucketArn: s3.BucketArn;
    public readonly bucketName: BucketName;
    public readonly encryptionKey?: kms.EncryptionKeyRef;

    protected policy?: BucketPolicy;
    protected autoCreatePolicy: boolean;

    constructor(parent: Construct, name: string, props: BucketRefProps) {
        super(parent, name);

        this.bucketArn = parseBucketArn(props);
        this.bucketName = parseBucketName(props);
        if (props.keyArn) {
            this.encryptionKey = kms.EncryptionKeyRef.import(this, 'EncryptionKey', {
                keyArn: props.keyArn
            });
        }

        this.autoCreatePolicy = false;
        this.policy = undefined;
    }
}

/**
 * Establish bidirectional grant between identity and KMS key for the given actions.
 *
 * Normally we can do it one way, but for KMS keys we must add the grants on
 * both resources.
 */
function grantKeyActions(identity: IIdentityResource, encryptionKey: kms.EncryptionKeyRef, keyActions: string[]) {
    identity.addToPolicy(new PolicyStatement()
        .addResource(encryptionKey.keyArn)
        .addActions(...keyActions));

    encryptionKey.addToResourcePolicy(new PolicyStatement()
        .addResource('*')
        .addPrincipal(identity.principal)
        .addActions(...keyActions));
}