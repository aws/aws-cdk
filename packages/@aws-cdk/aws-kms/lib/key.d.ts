import * as iam from '@aws-cdk/aws-iam';
import { Duration, IResource, RemovalPolicy, Resource, ResourceProps } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { Alias } from './alias';
import { KeyLookupOptions } from './key-lookup';
import { CfnKey } from './kms.generated';
/**
 * A KMS Key, either managed by this CDK app, or imported.
 */
export interface IKey extends IResource {
    /**
     * The ARN of the key.
     *
     * @attribute
     */
    readonly keyArn: string;
    /**
     * The ID of the key
     * (the part that looks something like: 1234abcd-12ab-34cd-56ef-1234567890ab).
     *
     * @attribute
     */
    readonly keyId: string;
    /**
     * Defines a new alias for the key.
     */
    addAlias(alias: string): Alias;
    /**
     * Adds a statement to the KMS key resource policy.
     * @param statement The policy statement to add
     * @param allowNoOp If this is set to `false` and there is no policy
     * defined (i.e. external key), the operation will fail. Otherwise, it will
     * no-op.
     */
    addToResourcePolicy(statement: iam.PolicyStatement, allowNoOp?: boolean): iam.AddToResourcePolicyResult;
    /**
     * Grant the indicated permissions on this key to the given principal
     */
    grant(grantee: iam.IGrantable, ...actions: string[]): iam.Grant;
    /**
     * Grant decryption permissions using this key to the given principal
     */
    grantDecrypt(grantee: iam.IGrantable): iam.Grant;
    /**
     * Grant encryption permissions using this key to the given principal
     */
    grantEncrypt(grantee: iam.IGrantable): iam.Grant;
    /**
     * Grant encryption and decryption permissions using this key to the given principal
     */
    grantEncryptDecrypt(grantee: iam.IGrantable): iam.Grant;
    /**
     * Grant permissions to generating MACs to the given principal
     */
    grantGenerateMac(grantee: iam.IGrantable): iam.Grant;
    /**
     * Grant permissions to verifying MACs to the given principal
     */
    grantVerifyMac(grantee: iam.IGrantable): iam.Grant;
}
declare abstract class KeyBase extends Resource implements IKey {
    /**
     * The ARN of the key.
     */
    abstract readonly keyArn: string;
    abstract readonly keyId: string;
    /**
     * Optional policy document that represents the resource policy of this key.
     *
     * If specified, addToResourcePolicy can be used to edit this policy.
     * Otherwise this method will no-op.
     */
    protected abstract readonly policy?: iam.PolicyDocument;
    /**
     * Optional property to control trusting account identities.
     *
     * If specified, grants will default identity policies instead of to both
     * resource and identity policies. This matches the default behavior when creating
     * KMS keys via the API or console.
     */
    protected abstract readonly trustAccountIdentities: boolean;
    /**
     * Collection of aliases added to the key
     *
     * Tracked to determine whether or not the aliasName should be added to the end of its ID
     */
    private readonly aliases;
    constructor(scope: Construct, id: string, props?: ResourceProps);
    /**
     * Defines a new alias for the key.
     */
    addAlias(aliasName: string): Alias;
    /**
     * Adds a statement to the KMS key resource policy.
     * @param statement The policy statement to add
     * @param allowNoOp If this is set to `false` and there is no policy
     * defined (i.e. external key), the operation will fail. Otherwise, it will
     * no-op.
     */
    addToResourcePolicy(statement: iam.PolicyStatement, allowNoOp?: boolean): iam.AddToResourcePolicyResult;
    /**
     * Grant the indicated permissions on this key to the given principal
     *
     * This modifies both the principal's policy as well as the resource policy,
     * since the default CloudFormation setup for KMS keys is that the policy
     * must not be empty and so default grants won't work.
     */
    grant(grantee: iam.IGrantable, ...actions: string[]): iam.Grant;
    /**
     * Grant decryption permissions using this key to the given principal
     */
    grantDecrypt(grantee: iam.IGrantable): iam.Grant;
    /**
     * Grant encryption permissions using this key to the given principal
     */
    grantEncrypt(grantee: iam.IGrantable): iam.Grant;
    /**
     * Grant encryption and decryption permissions using this key to the given principal
     */
    grantEncryptDecrypt(grantee: iam.IGrantable): iam.Grant;
    /**
     * Grant permissions to generating MACs to the given principal
     */
    grantGenerateMac(grantee: iam.IGrantable): iam.Grant;
    /**
     * Grant permissions to verifying MACs to the given principal
     */
    grantVerifyMac(grantee: iam.IGrantable): iam.Grant;
    /**
     * Checks whether the grantee belongs to a stack that will be deployed
     * after the stack containing this key.
     *
     * @param grantee the grantee to give permissions to
     * @returns the account ID of the grantee stack if its stack does depend on this stack,
     *   undefined otherwise
     */
    private granteeStackDependsOnKeyStack;
    private isGranteeFromAnotherRegion;
    private isGranteeFromAnotherAccount;
}
/**
 * The key spec, represents the cryptographic configuration of keys.
 */
export declare enum KeySpec {
    /**
     * The default key spec.
     *
     * Valid usage: ENCRYPT_DECRYPT
     */
    SYMMETRIC_DEFAULT = "SYMMETRIC_DEFAULT",
    /**
     * RSA with 2048 bits of key.
     *
     * Valid usage: ENCRYPT_DECRYPT and SIGN_VERIFY
     */
    RSA_2048 = "RSA_2048",
    /**
     * RSA with 3072 bits of key.
     *
     * Valid usage: ENCRYPT_DECRYPT and SIGN_VERIFY
     */
    RSA_3072 = "RSA_3072",
    /**
     * RSA with 4096 bits of key.
     *
     * Valid usage: ENCRYPT_DECRYPT and SIGN_VERIFY
     */
    RSA_4096 = "RSA_4096",
    /**
     * NIST FIPS 186-4, Section 6.4, ECDSA signature using the curve specified by the key and
     * SHA-256 for the message digest.
     *
     * Valid usage: SIGN_VERIFY
     */
    ECC_NIST_P256 = "ECC_NIST_P256",
    /**
     * NIST FIPS 186-4, Section 6.4, ECDSA signature using the curve specified by the key and
     * SHA-384 for the message digest.
     *
     * Valid usage: SIGN_VERIFY
     */
    ECC_NIST_P384 = "ECC_NIST_P384",
    /**
     * NIST FIPS 186-4, Section 6.4, ECDSA signature using the curve specified by the key and
     * SHA-512 for the message digest.
     *
     * Valid usage: SIGN_VERIFY
     */
    ECC_NIST_P521 = "ECC_NIST_P521",
    /**
     * Standards for Efficient Cryptography 2, Section 2.4.1, ECDSA signature on the Koblitz curve.
     *
     * Valid usage: SIGN_VERIFY
     */
    ECC_SECG_P256K1 = "ECC_SECG_P256K1",
    /**
     * Hash-Based Message Authentication Code as defined in RFC 2104 using the message digest function SHA224.
     *
     * Valid usage: GENERATE_VERIFY_MAC
     */
    HMAC_224 = "HMAC_224",
    /**
     * Hash-Based Message Authentication Code as defined in RFC 2104 using the message digest function SHA256.
     *
     * Valid usage: GENERATE_VERIFY_MAC
     */
    HMAC_256 = "HMAC_256",
    /**
     * Hash-Based Message Authentication Code as defined in RFC 2104 using the message digest function SHA384.
     *
     * Valid usage: GENERATE_VERIFY_MAC
     */
    HMAC_384 = "HMAC_384",
    /**
     * Hash-Based Message Authentication Code as defined in RFC 2104 using the message digest function SHA512.
     *
     * Valid usage: GENERATE_VERIFY_MAC
     */
    HMAC_512 = "HMAC_512",
    /**
     * Elliptic curve key spec available only in China Regions.
     *
     * Valid usage: ENCRYPT_DECRYPT and SIGN_VERIFY
     */
    SM2 = "SM2"
}
/**
 * The key usage, represents the cryptographic operations of keys.
 */
export declare enum KeyUsage {
    /**
     * Encryption and decryption.
     */
    ENCRYPT_DECRYPT = "ENCRYPT_DECRYPT",
    /**
     * Signing and verification
     */
    SIGN_VERIFY = "SIGN_VERIFY",
    /**
     * Generating and verifying MACs
     */
    GENERATE_VERIFY_MAC = "GENERATE_VERIFY_MAC"
}
/**
 * Construction properties for a KMS Key object
 */
export interface KeyProps {
    /**
     * A description of the key. Use a description that helps your users decide
     * whether the key is appropriate for a particular task.
     *
     * @default - No description.
     */
    readonly description?: string;
    /**
     * Initial alias to add to the key
     *
     * More aliases can be added later by calling `addAlias`.
     *
     * @default - No alias is added for the key.
     */
    readonly alias?: string;
    /**
     * Indicates whether AWS KMS rotates the key.
     *
     * @default false
     */
    readonly enableKeyRotation?: boolean;
    /**
     * Indicates whether the key is available for use.
     *
     * @default - Key is enabled.
     */
    readonly enabled?: boolean;
    /**
     * The cryptographic configuration of the key. The valid value depends on usage of the key.
     *
     * IMPORTANT: If you change this property of an existing key, the existing key is scheduled for deletion
     * and a new key is created with the specified value.
     *
     * @default KeySpec.SYMMETRIC_DEFAULT
     */
    readonly keySpec?: KeySpec;
    /**
     * The cryptographic operations for which the key can be used.
     *
     * IMPORTANT: If you change this property of an existing key, the existing key is scheduled for deletion
     * and a new key is created with the specified value.
     *
     * @default KeyUsage.ENCRYPT_DECRYPT
     */
    readonly keyUsage?: KeyUsage;
    /**
     * Custom policy document to attach to the KMS key.
     *
     * NOTE - If the `@aws-cdk/aws-kms:defaultKeyPolicies` feature flag is set (the default for new projects),
     * this policy will *override* the default key policy and become the only key policy for the key. If the
     * feature flag is not set, this policy will be appended to the default key policy.
     *
     * @default - A policy document with permissions for the account root to
     * administer the key will be created.
     */
    readonly policy?: iam.PolicyDocument;
    /**
     * A list of principals to add as key administrators to the key policy.
     *
     * Key administrators have permissions to manage the key (e.g., change permissions, revoke), but do not have permissions
     * to use the key in cryptographic operations (e.g., encrypt, decrypt).
     *
     * These principals will be added to the default key policy (if none specified), or to the specified policy (if provided).
     *
     * @default []
     */
    readonly admins?: iam.IPrincipal[];
    /**
     * Whether the encryption key should be retained when it is removed from the Stack. This is useful when one wants to
     * retain access to data that was encrypted with a key that is being retired.
     *
     * @default RemovalPolicy.Retain
     */
    readonly removalPolicy?: RemovalPolicy;
    /**
     * Whether the key usage can be granted by IAM policies
     *
     * Setting this to true adds a default statement which delegates key
     * access control completely to the identity's IAM policy (similar
     * to how it works for other AWS resources). This matches the default behavior
     * when creating KMS keys via the API or console.
     *
     * If the `@aws-cdk/aws-kms:defaultKeyPolicies` feature flag is set (the default for new projects),
     * this flag will always be treated as 'true' and does not need to be explicitly set.
     *
     * @default - false, unless the `@aws-cdk/aws-kms:defaultKeyPolicies` feature flag is set.
     * @see https://docs.aws.amazon.com/kms/latest/developerguide/key-policies.html#key-policy-default-allow-root-enable-iam
     * @deprecated redundant with the `@aws-cdk/aws-kms:defaultKeyPolicies` feature flag
     */
    readonly trustAccountIdentities?: boolean;
    /**
     * Specifies the number of days in the waiting period before
     * AWS KMS deletes a CMK that has been removed from a CloudFormation stack.
     *
     * When you remove a customer master key (CMK) from a CloudFormation stack, AWS KMS schedules the CMK for deletion
     * and starts the mandatory waiting period. The PendingWindowInDays property determines the length of waiting period.
     * During the waiting period, the key state of CMK is Pending Deletion, which prevents the CMK from being used in
     * cryptographic operations. When the waiting period expires, AWS KMS permanently deletes the CMK.
     *
     * Enter a value between 7 and 30 days.
     *
     * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kms-key.html#cfn-kms-key-pendingwindowindays
     * @default - 30 days
     */
    readonly pendingWindow?: Duration;
}
/**
 * Defines a KMS key.
 *
 * @resource AWS::KMS::Key
 */
export declare class Key extends KeyBase {
    /**
     * Import an externally defined KMS Key using its ARN.
     *
     * @param scope  the construct that will "own" the imported key.
     * @param id     the id of the imported key in the construct tree.
     * @param keyArn the ARN of an existing KMS key.
     */
    static fromKeyArn(scope: Construct, id: string, keyArn: string): IKey;
    /**
     * Create a mutable `IKey` based on a low-level `CfnKey`.
     * This is most useful when combined with the cloudformation-include module.
     * This method is different than `fromKeyArn()` because the `IKey`
     * returned from this method is mutable;
     * meaning, calling any mutating methods on it,
     * like `IKey.addToResourcePolicy()`,
     * will actually be reflected in the resulting template,
     * as opposed to the object returned from `fromKeyArn()`,
     * on which calling those methods would have no effect.
     */
    static fromCfnKey(cfnKey: CfnKey): IKey;
    /**
     * Import an existing Key by querying the AWS environment this stack is deployed to.
     *
     * This function only needs to be used to use Keys not defined in your CDK
     * application. If you are looking to share a Key between stacks, you can
     * pass the `Key` object between stacks and use it as normal. In addition,
     * it's not necessary to use this method if an interface accepts an `IKey`.
     * In this case, `Alias.fromAliasName()` can be used which returns an alias
     * that extends `IKey`.
     *
     * Calling this method will lead to a lookup when the CDK CLI is executed.
     * You can therefore not use any values that will only be available at
     * CloudFormation execution time (i.e., Tokens).
     *
     * The Key information will be cached in `cdk.context.json` and the same Key
     * will be used on future runs. To refresh the lookup, you will have to
     * evict the value from the cache using the `cdk context` command. See
     * https://docs.aws.amazon.com/cdk/latest/guide/context.html for more information.
     */
    static fromLookup(scope: Construct, id: string, options: KeyLookupOptions): IKey;
    readonly keyArn: string;
    readonly keyId: string;
    protected readonly policy?: iam.PolicyDocument;
    protected readonly trustAccountIdentities: boolean;
    constructor(scope: Construct, id: string, props?: KeyProps);
    /**
     * Grant admins permissions using this key to the given principal
     *
     * Key administrators have permissions to manage the key (e.g., change permissions, revoke), but do not have permissions
     * to use the key in cryptographic operations (e.g., encrypt, decrypt).
     */
    grantAdmin(grantee: iam.IGrantable): iam.Grant;
    /**
     * Adds the default key policy to the key. This policy gives the AWS account (root user) full access to the CMK,
     * which reduces the risk of the CMK becoming unmanageable and enables IAM policies to allow access to the CMK.
     * This is the same policy that is default when creating a Key via the KMS API or Console.
     * @see https://docs.aws.amazon.com/kms/latest/developerguide/key-policies.html#key-policy-default
     */
    private addDefaultAdminPolicy;
    /**
     * Grants the account admin privileges -- not full account access -- plus the GenerateDataKey action.
     * The GenerateDataKey action was added for interop with S3 in https://github.com/aws/aws-cdk/issues/3458.
     *
     * This policy is discouraged and deprecated by the `@aws-cdk/aws-kms:defaultKeyPolicies` feature flag.
     *
     * @link https://docs.aws.amazon.com/kms/latest/developerguide/key-policies.html#key-policy-default
     * @deprecated
     */
    private addLegacyAdminPolicy;
}
export {};
