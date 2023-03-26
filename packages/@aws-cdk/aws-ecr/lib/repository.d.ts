import * as events from '@aws-cdk/aws-events';
import * as iam from '@aws-cdk/aws-iam';
import * as kms from '@aws-cdk/aws-kms';
import { IResource, RemovalPolicy, Resource } from '@aws-cdk/core';
import { IConstruct, Construct } from 'constructs';
import { LifecycleRule } from './lifecycle';
/**
 * Represents an ECR repository.
 */
export interface IRepository extends IResource {
    /**
     * The name of the repository
     * @attribute
     */
    readonly repositoryName: string;
    /**
     * The ARN of the repository
     * @attribute
     */
    readonly repositoryArn: string;
    /**
     * The URI of this repository (represents the latest image):
     *
     *    ACCOUNT.dkr.ecr.REGION.amazonaws.com/REPOSITORY
     *
     * @attribute
     */
    readonly repositoryUri: string;
    /**
     * Returns the URI of the repository for a certain tag. Can be used in `docker push/pull`.
     *
     *    ACCOUNT.dkr.ecr.REGION.amazonaws.com/REPOSITORY[:TAG]
     *
     * @param tag Image tag to use (tools usually default to "latest" if omitted)
     */
    repositoryUriForTag(tag?: string): string;
    /**
     * Returns the URI of the repository for a certain digest. Can be used in `docker push/pull`.
     *
     *    ACCOUNT.dkr.ecr.REGION.amazonaws.com/REPOSITORY[@DIGEST]
     *
     * @param digest Image digest to use (tools usually default to the image with the "latest" tag if omitted)
     */
    repositoryUriForDigest(digest?: string): string;
    /**
     * Returns the URI of the repository for a certain tag or digest, inferring based on the syntax of the tag. Can be used in `docker push/pull`.
     *
     *    ACCOUNT.dkr.ecr.REGION.amazonaws.com/REPOSITORY[:TAG]
     *    ACCOUNT.dkr.ecr.REGION.amazonaws.com/REPOSITORY[@DIGEST]
     *
     * @param tagOrDigest Image tag or digest to use (tools usually default to the image with the "latest" tag if omitted)
     */
    repositoryUriForTagOrDigest(tagOrDigest?: string): string;
    /**
     * Add a policy statement to the repository's resource policy
     */
    addToResourcePolicy(statement: iam.PolicyStatement): iam.AddToResourcePolicyResult;
    /**
     * Grant the given principal identity permissions to perform the actions on this repository
     */
    grant(grantee: iam.IGrantable, ...actions: string[]): iam.Grant;
    /**
     * Grant the given identity permissions to pull images in this repository.
     */
    grantPull(grantee: iam.IGrantable): iam.Grant;
    /**
     * Grant the given identity permissions to pull and push images to this repository.
     */
    grantPullPush(grantee: iam.IGrantable): iam.Grant;
    /**
     * Define a CloudWatch event that triggers when something happens to this repository
     *
     * Requires that there exists at least one CloudTrail Trail in your account
     * that captures the event. This method will not create the Trail.
     *
     * @param id The id of the rule
     * @param options Options for adding the rule
     */
    onCloudTrailEvent(id: string, options?: events.OnEventOptions): events.Rule;
    /**
     * Defines an AWS CloudWatch event rule that can trigger a target when an image is pushed to this
     * repository.
     *
     * Requires that there exists at least one CloudTrail Trail in your account
     * that captures the event. This method will not create the Trail.
     *
     * @param id The id of the rule
     * @param options Options for adding the rule
     */
    onCloudTrailImagePushed(id: string, options?: OnCloudTrailImagePushedOptions): events.Rule;
    /**
     * Defines an AWS CloudWatch event rule that can trigger a target when the image scan is completed
     *
     *
     * @param id The id of the rule
     * @param options Options for adding the rule
     */
    onImageScanCompleted(id: string, options?: OnImageScanCompletedOptions): events.Rule;
    /**
     * Defines a CloudWatch event rule which triggers for repository events. Use
     * `rule.addEventPattern(pattern)` to specify a filter.
     */
    onEvent(id: string, options?: events.OnEventOptions): events.Rule;
}
/**
 * Base class for ECR repository. Reused between imported repositories and owned repositories.
 */
export declare abstract class RepositoryBase extends Resource implements IRepository {
    /**
     * The name of the repository
     */
    abstract readonly repositoryName: string;
    /**
     * The ARN of the repository
     */
    abstract readonly repositoryArn: string;
    /**
     * Add a policy statement to the repository's resource policy
     */
    abstract addToResourcePolicy(statement: iam.PolicyStatement): iam.AddToResourcePolicyResult;
    /**
     * The URI of this repository (represents the latest image):
     *
     *    ACCOUNT.dkr.ecr.REGION.amazonaws.com/REPOSITORY
     *
     */
    get repositoryUri(): string;
    /**
     * Returns the URL of the repository. Can be used in `docker push/pull`.
     *
     *    ACCOUNT.dkr.ecr.REGION.amazonaws.com/REPOSITORY[:TAG]
     *
     * @param tag Optional image tag
     */
    repositoryUriForTag(tag?: string): string;
    /**
     * Returns the URL of the repository. Can be used in `docker push/pull`.
     *
     *    ACCOUNT.dkr.ecr.REGION.amazonaws.com/REPOSITORY[@DIGEST]
     *
     * @param digest Optional image digest
     */
    repositoryUriForDigest(digest?: string): string;
    /**
     * Returns the URL of the repository. Can be used in `docker push/pull`.
     *
     *    ACCOUNT.dkr.ecr.REGION.amazonaws.com/REPOSITORY[:TAG]
     *    ACCOUNT.dkr.ecr.REGION.amazonaws.com/REPOSITORY[@DIGEST]
     *
     * @param tagOrDigest Optional image tag or digest (digests must start with `sha256:`)
     */
    repositoryUriForTagOrDigest(tagOrDigest?: string): string;
    /**
     * Returns the repository URI, with an appended suffix, if provided.
     * @param suffix An image tag or an image digest.
     * @private
     */
    private repositoryUriWithSuffix;
    /**
     * Define a CloudWatch event that triggers when something happens to this repository
     *
     * Requires that there exists at least one CloudTrail Trail in your account
     * that captures the event. This method will not create the Trail.
     *
     * @param id The id of the rule
     * @param options Options for adding the rule
     */
    onCloudTrailEvent(id: string, options?: events.OnEventOptions): events.Rule;
    /**
     * Defines an AWS CloudWatch event rule that can trigger a target when an image is pushed to this
     * repository.
     *
     * Requires that there exists at least one CloudTrail Trail in your account
     * that captures the event. This method will not create the Trail.
     *
     * @param id The id of the rule
     * @param options Options for adding the rule
     */
    onCloudTrailImagePushed(id: string, options?: OnCloudTrailImagePushedOptions): events.Rule;
    /**
     * Defines an AWS CloudWatch event rule that can trigger a target when an image scan is completed
     *
     *
     * @param id The id of the rule
     * @param options Options for adding the rule
     */
    onImageScanCompleted(id: string, options?: OnImageScanCompletedOptions): events.Rule;
    /**
     * Defines a CloudWatch event rule which triggers for repository events. Use
     * `rule.addEventPattern(pattern)` to specify a filter.
     */
    onEvent(id: string, options?: events.OnEventOptions): events.Rule;
    /**
     * Grant the given principal identity permissions to perform the actions on this repository
     */
    grant(grantee: iam.IGrantable, ...actions: string[]): iam.Grant;
    /**
     * Grant the given identity permissions to use the images in this repository
     */
    grantPull(grantee: iam.IGrantable): iam.Grant;
    /**
     * Grant the given identity permissions to pull and push images to this repository.
     */
    grantPullPush(grantee: iam.IGrantable): iam.Grant;
    /**
     * Returns the resource that backs the given IAM grantee if we cannot put a direct reference
     * to the grantee in the resource policy of this ECR repository,
     * and 'undefined' in case we can.
     */
    private unsafeCrossAccountResourcePolicyPrincipal;
}
/**
 * Options for the onCloudTrailImagePushed method
 */
export interface OnCloudTrailImagePushedOptions extends events.OnEventOptions {
    /**
     * Only watch changes to this image tag
     *
     * @default - Watch changes to all tags
     */
    readonly imageTag?: string;
}
/**
 * Options for the OnImageScanCompleted method
 */
export interface OnImageScanCompletedOptions extends events.OnEventOptions {
    /**
     * Only watch changes to the image tags spedified.
     * Leave it undefined to watch the full repository.
     *
     * @default - Watch the changes to the repository with all image tags
     */
    readonly imageTags?: string[];
}
export interface RepositoryProps {
    /**
     * Name for this repository
     *
     * @default Automatically generated name.
     */
    readonly repositoryName?: string;
    /**
     * The kind of server-side encryption to apply to this repository.
     *
     * If you choose KMS, you can specify a KMS key via `encryptionKey`. If
     * encryptionKey is not specified, an AWS managed KMS key is used.
     *
     * @default - `KMS` if `encryptionKey` is specified, or `AES256` otherwise.
     */
    readonly encryption?: RepositoryEncryption;
    /**
     * External KMS key to use for repository encryption.
     *
     * The 'encryption' property must be either not specified or set to "KMS".
     * An error will be emitted if encryption is set to "AES256".
     *
     * @default - If encryption is set to `KMS` and this property is undefined,
     * an AWS managed KMS key is used.
     */
    readonly encryptionKey?: kms.IKey;
    /**
     * Life cycle rules to apply to this registry
     *
     * @default No life cycle rules
     */
    readonly lifecycleRules?: LifecycleRule[];
    /**
     * The AWS account ID associated with the registry that contains the repository.
     *
     * @see https://docs.aws.amazon.com/AmazonECR/latest/APIReference/API_PutLifecyclePolicy.html
     * @default The default registry is assumed.
     */
    readonly lifecycleRegistryId?: string;
    /**
     * Determine what happens to the repository when the resource/stack is deleted.
     *
     * @default RemovalPolicy.Retain
     */
    readonly removalPolicy?: RemovalPolicy;
    /**
     * Enable the scan on push when creating the repository
     *
     *  @default false
     */
    readonly imageScanOnPush?: boolean;
    /**
     * The tag mutability setting for the repository. If this parameter is omitted, the default setting of MUTABLE will be used which will allow image tags to be overwritten.
     *
     *  @default TagMutability.MUTABLE
     */
    readonly imageTagMutability?: TagMutability;
}
export interface RepositoryAttributes {
    readonly repositoryName: string;
    readonly repositoryArn: string;
}
/**
 * Define an ECR repository
 */
export declare class Repository extends RepositoryBase {
    /**
     * Import a repository
     */
    static fromRepositoryAttributes(scope: Construct, id: string, attrs: RepositoryAttributes): IRepository;
    static fromRepositoryArn(scope: Construct, id: string, repositoryArn: string): IRepository;
    static fromRepositoryName(scope: Construct, id: string, repositoryName: string): IRepository;
    /**
     * Returns an ECR ARN for a repository that resides in the same account/region
     * as the current stack.
     */
    static arnForLocalRepository(repositoryName: string, scope: IConstruct, account?: string): string;
    private static validateRepositoryName;
    readonly repositoryName: string;
    readonly repositoryArn: string;
    private readonly lifecycleRules;
    private readonly registryId?;
    private policyDocument?;
    constructor(scope: Construct, id: string, props?: RepositoryProps);
    addToResourcePolicy(statement: iam.PolicyStatement): iam.AddToResourcePolicyResult;
    /**
     * Add a life cycle rule to the repository
     *
     * Life cycle rules automatically expire images from the repository that match
     * certain conditions.
     */
    addLifecycleRule(rule: LifecycleRule): void;
    /**
     * Render the life cycle policy object
     */
    private renderLifecyclePolicy;
    /**
     * Return life cycle rules with automatic ordering applied.
     *
     * Also applies validation of the 'any' rule.
     */
    private orderedLifecycleRules;
    /**
     * Set up key properties and return the Repository encryption property from the
     * user's configuration.
     */
    private parseEncryption;
}
/**
 * The tag mutability setting for your repository.
 */
export declare enum TagMutability {
    /**
     * allow image tags to be overwritten.
     */
    MUTABLE = "MUTABLE",
    /**
     * all image tags within the repository will be immutable which will prevent them from being overwritten.
     */
    IMMUTABLE = "IMMUTABLE"
}
/**
 * Indicates whether server-side encryption is enabled for the object, and whether that encryption is
 * from the AWS Key Management Service (AWS KMS) or from Amazon S3 managed encryption (SSE-S3).
 * @see https://docs.aws.amazon.com/AmazonS3/latest/dev/UsingMetadata.html#SysMetadata
 */
export declare class RepositoryEncryption {
    readonly value: string;
    /**
     * 'AES256'
     */
    static readonly AES_256: RepositoryEncryption;
    /**
     * 'KMS'
     */
    static readonly KMS: RepositoryEncryption;
    /**
     * @param value the string value of the encryption
     */
    protected constructor(value: string);
}
