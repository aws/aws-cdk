import * as iam from '@aws-cdk/aws-iam';
import * as cxschema from '@aws-cdk/cloud-assembly-schema';
import {
  Arn,
  ArnFormat,
  ContextProvider,
  Duration,
  FeatureFlags,
  IResource,
  Lazy,
  RemovalPolicy,
  Resource,
  ResourceProps,
  Stack,
  Token,
} from '@aws-cdk/core';
import * as cxapi from '@aws-cdk/cx-api';
import { Construct } from 'constructs';
import { Alias } from './alias';
import { KeyLookupOptions } from './key-lookup';
import { CfnKey } from './kms.generated';
import * as perms from './private/perms';

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
  grantGenerateMac(grantee: iam.IGrantable): iam.Grant

  /**
   * Grant permissions to verifying MACs to the given principal
   */
  grantVerifyMac(grantee: iam.IGrantable): iam.Grant
}

abstract class KeyBase extends Resource implements IKey {
  /**
   * The ARN of the key.
   */
  public abstract readonly keyArn: string;

  public abstract readonly keyId: string;

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
  private readonly aliases: Alias[] = [];

  constructor(scope: Construct, id: string, props: ResourceProps = {}) {
    super(scope, id, props);

    this.node.addValidation({ validate: () => this.policy?.validateForResourcePolicy() ?? [] });
  }

  /**
   * Defines a new alias for the key.
   */
  public addAlias(aliasName: string): Alias {
    const aliasId = this.aliases.length > 0 ? `Alias${aliasName}` : 'Alias';

    const alias = new Alias(this, aliasId, { aliasName, targetKey: this });
    this.aliases.push(alias);

    return alias;
  }

  /**
   * Adds a statement to the KMS key resource policy.
   * @param statement The policy statement to add
   * @param allowNoOp If this is set to `false` and there is no policy
   * defined (i.e. external key), the operation will fail. Otherwise, it will
   * no-op.
   */
  public addToResourcePolicy(statement: iam.PolicyStatement, allowNoOp = true): iam.AddToResourcePolicyResult {
    const stack = Stack.of(this);

    if (!this.policy) {
      if (allowNoOp) { return { statementAdded: false }; }
      throw new Error(`Unable to add statement to IAM resource policy for KMS key: ${JSON.stringify(stack.resolve(this.keyArn))}`);
    }

    this.policy.addStatements(statement);
    return { statementAdded: true, policyDependable: this.policy };
  }

  /**
   * Grant the indicated permissions on this key to the given principal
   *
   * This modifies both the principal's policy as well as the resource policy,
   * since the default CloudFormation setup for KMS keys is that the policy
   * must not be empty and so default grants won't work.
   */
  public grant(grantee: iam.IGrantable, ...actions: string[]): iam.Grant {
    // KMS verifies whether the principals included in its key policy actually exist.
    // This is a problem if the stack the grantee is part of depends on the key stack
    // (as it won't exist before the key policy is attempted to be created).
    // In that case, make the account the resource policy principal
    const granteeStackDependsOnKeyStack = this.granteeStackDependsOnKeyStack(grantee);
    const principal = granteeStackDependsOnKeyStack
      ? new iam.AccountPrincipal(granteeStackDependsOnKeyStack)
      : grantee.grantPrincipal;

    const crossAccountAccess = this.isGranteeFromAnotherAccount(grantee);
    const crossRegionAccess = this.isGranteeFromAnotherRegion(grantee);
    const crossEnvironment = crossAccountAccess || crossRegionAccess;
    const grantOptions: iam.GrantWithResourceOptions = {
      grantee,
      actions,
      resource: this,
      resourceArns: [this.keyArn],
      resourceSelfArns: crossEnvironment ? undefined : ['*'],
    };
    if (this.trustAccountIdentities && !crossEnvironment) {
      return iam.Grant.addToPrincipalOrResource(grantOptions);
    } else {
      return iam.Grant.addToPrincipalAndResource({
        ...grantOptions,
        // if the key is used in a cross-environment matter,
        // we can't access the Key ARN (they don't have physical names),
        // so fall back to using '*'. ToDo we need to make this better... somehow
        resourceArns: crossEnvironment ? ['*'] : [this.keyArn],
        resourcePolicyPrincipal: principal,
      });
    }
  }

  /**
   * Grant decryption permissions using this key to the given principal
   */
  public grantDecrypt(grantee: iam.IGrantable): iam.Grant {
    return this.grant(grantee, ...perms.DECRYPT_ACTIONS);
  }

  /**
   * Grant encryption permissions using this key to the given principal
   */
  public grantEncrypt(grantee: iam.IGrantable): iam.Grant {
    return this.grant(grantee, ...perms.ENCRYPT_ACTIONS);
  }

  /**
   * Grant encryption and decryption permissions using this key to the given principal
   */
  public grantEncryptDecrypt(grantee: iam.IGrantable): iam.Grant {
    return this.grant(grantee, ...[...perms.DECRYPT_ACTIONS, ...perms.ENCRYPT_ACTIONS]);
  }

  /**
   * Grant permissions to generating MACs to the given principal
   */
  public grantGenerateMac(grantee: iam.IGrantable): iam.Grant {
    return this.grant(grantee, ...perms.GENERATE_HMAC_ACTIONS);
  }

  /**
   * Grant permissions to verifying MACs to the given principal
   */
  public grantVerifyMac(grantee: iam.IGrantable): iam.Grant {
    return this.grant(grantee, ...perms.VERIFY_HMAC_ACTIONS);
  }

  /**
   * Checks whether the grantee belongs to a stack that will be deployed
   * after the stack containing this key.
   *
   * @param grantee the grantee to give permissions to
   * @returns the account ID of the grantee stack if its stack does depend on this stack,
   *   undefined otherwise
   */
  private granteeStackDependsOnKeyStack(grantee: iam.IGrantable): string | undefined {
    const grantPrincipal = grantee.grantPrincipal;
    // this logic should only apply to newly created
    // (= not imported) resources
    if (!iam.principalIsOwnedResource(grantPrincipal)) {
      return undefined;
    }
    const keyStack = Stack.of(this);
    const granteeStack = Stack.of(grantPrincipal);
    if (keyStack === granteeStack) {
      return undefined;
    }

    return granteeStack.dependencies.includes(keyStack)
      ? granteeStack.account
      : undefined;
  }

  private isGranteeFromAnotherRegion(grantee: iam.IGrantable): boolean {
    if (!iam.principalIsOwnedResource(grantee.grantPrincipal)) {
      return false;
    }
    const bucketStack = Stack.of(this);
    const identityStack = Stack.of(grantee.grantPrincipal);
    return bucketStack.region !== identityStack.region;
  }

  private isGranteeFromAnotherAccount(grantee: iam.IGrantable): boolean {
    if (!iam.principalIsOwnedResource(grantee.grantPrincipal)) {
      return false;
    }
    const bucketStack = Stack.of(this);
    const identityStack = Stack.of(grantee.grantPrincipal);
    return bucketStack.account !== identityStack.account;
  }
}

/**
 * The key spec, represents the cryptographic configuration of keys.
 */
export enum KeySpec {
  /**
   * The default key spec.
   *
   * Valid usage: ENCRYPT_DECRYPT
   */
  SYMMETRIC_DEFAULT = 'SYMMETRIC_DEFAULT',

  /**
   * RSA with 2048 bits of key.
   *
   * Valid usage: ENCRYPT_DECRYPT and SIGN_VERIFY
   */
  RSA_2048 = 'RSA_2048',

  /**
   * RSA with 3072 bits of key.
   *
   * Valid usage: ENCRYPT_DECRYPT and SIGN_VERIFY
   */
  RSA_3072 = 'RSA_3072',

  /**
   * RSA with 4096 bits of key.
   *
   * Valid usage: ENCRYPT_DECRYPT and SIGN_VERIFY
   */
  RSA_4096 = 'RSA_4096',

  /**
   * NIST FIPS 186-4, Section 6.4, ECDSA signature using the curve specified by the key and
   * SHA-256 for the message digest.
   *
   * Valid usage: SIGN_VERIFY
   */
  ECC_NIST_P256 = 'ECC_NIST_P256',

  /**
   * NIST FIPS 186-4, Section 6.4, ECDSA signature using the curve specified by the key and
   * SHA-384 for the message digest.
   *
   * Valid usage: SIGN_VERIFY
   */
  ECC_NIST_P384 = 'ECC_NIST_P384',

  /**
   * NIST FIPS 186-4, Section 6.4, ECDSA signature using the curve specified by the key and
   * SHA-512 for the message digest.
   *
   * Valid usage: SIGN_VERIFY
   */
  ECC_NIST_P521 = 'ECC_NIST_P521',

  /**
   * Standards for Efficient Cryptography 2, Section 2.4.1, ECDSA signature on the Koblitz curve.
   *
   * Valid usage: SIGN_VERIFY
   */
  ECC_SECG_P256K1 = 'ECC_SECG_P256K1',

  /**
   * Hash-Based Message Authentication Code as defined in RFC 2104 using the message digest function SHA224.
   *
   * Valid usage: GENERATE_VERIFY_MAC
   */
  HMAC_224 = 'HMAC_224',

  /**
   * Hash-Based Message Authentication Code as defined in RFC 2104 using the message digest function SHA256.
   *
   * Valid usage: GENERATE_VERIFY_MAC
   */
  HMAC_256 = 'HMAC_256',

  /**
   * Hash-Based Message Authentication Code as defined in RFC 2104 using the message digest function SHA384.
   *
   * Valid usage: GENERATE_VERIFY_MAC
   */
  HMAC_384 = 'HMAC_384',

  /**
   * Hash-Based Message Authentication Code as defined in RFC 2104 using the message digest function SHA512.
   *
   * Valid usage: GENERATE_VERIFY_MAC
   */
  HMAC_512 = 'HMAC_512',

  /**
   * Elliptic curve key spec available only in China Regions.
   *
   * Valid usage: ENCRYPT_DECRYPT and SIGN_VERIFY
   */
  SM2 = 'SM2',
}

/**
 * The key usage, represents the cryptographic operations of keys.
 */
export enum KeyUsage {
  /**
   * Encryption and decryption.
   */
  ENCRYPT_DECRYPT = 'ENCRYPT_DECRYPT',

  /**
   * Signing and verification
   */
  SIGN_VERIFY = 'SIGN_VERIFY',

  /**
   * Generating and verifying MACs
   */
  GENERATE_VERIFY_MAC = 'GENERATE_VERIFY_MAC',
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
export class Key extends KeyBase {
  /**
   * Import an externally defined KMS Key using its ARN.
   *
   * @param scope  the construct that will "own" the imported key.
   * @param id     the id of the imported key in the construct tree.
   * @param keyArn the ARN of an existing KMS key.
   */
  public static fromKeyArn(scope: Construct, id: string, keyArn: string): IKey {
    class Import extends KeyBase {
      public readonly keyArn = keyArn;
      public readonly keyId: string;
      protected readonly policy?: iam.PolicyDocument | undefined = undefined;
      // defaulting true: if we are importing the key the key policy is
      // undefined and impossible to change here; this means updating identity
      // policies is really the only option
      protected readonly trustAccountIdentities: boolean = true;

      constructor(keyId: string, props: ResourceProps = {}) {
        super(scope, id, props);

        this.keyId = keyId;
      }
    }

    const keyResourceName = Stack.of(scope).splitArn(keyArn, ArnFormat.SLASH_RESOURCE_NAME).resourceName;
    if (!keyResourceName) {
      throw new Error(`KMS key ARN must be in the format 'arn:aws:kms:<region>:<account>:key/<keyId>', got: '${keyArn}'`);
    }

    return new Import(keyResourceName, {
      environmentFromArn: keyArn,
    });
  }

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
  public static fromCfnKey(cfnKey: CfnKey): IKey {
    // use a "weird" id that has a higher chance of being unique
    const id = '@FromCfnKey';

    // if fromCfnKey() was already called on this cfnKey,
    // return the same L2
    // (as different L2s would conflict, because of the mutation of the keyPolicy property of the L1 below)
    const existing = cfnKey.node.tryFindChild(id);
    if (existing) {
      return <IKey>existing;
    }

    let keyPolicy: iam.PolicyDocument;
    try {
      keyPolicy = iam.PolicyDocument.fromJson(cfnKey.keyPolicy);
    } catch {
      // If the KeyPolicy contains any CloudFormation functions,
      // PolicyDocument.fromJson() throws an exception.
      // In that case, because we would have to effectively make the returned IKey immutable,
      // throw an exception suggesting to use the other importing methods instead.
      // We might make this parsing logic smarter later,
      // but let's start by erroring out.
      throw new Error('Could not parse the PolicyDocument of the passed AWS::KMS::Key resource because it contains CloudFormation functions. ' +
        'This makes it impossible to create a mutable IKey from that Policy. ' +
        'You have to use fromKeyArn instead, passing it the ARN attribute property of the low-level CfnKey');
    }

    // change the key policy of the L1, so that all changes done in the L2 are reflected in the resulting template
    cfnKey.keyPolicy = Lazy.any({ produce: () => keyPolicy.toJSON() });

    return new class extends KeyBase {
      public readonly keyArn = cfnKey.attrArn;
      public readonly keyId = cfnKey.ref;
      protected readonly policy = keyPolicy;
      protected readonly trustAccountIdentities = false;
    }(cfnKey, id);
  }

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
  public static fromLookup(scope: Construct, id: string, options: KeyLookupOptions): IKey {
    class Import extends KeyBase {
      public readonly keyArn: string;
      public readonly keyId: string;
      protected readonly policy?: iam.PolicyDocument | undefined = undefined;
      // defaulting true: if we are importing the key the key policy is
      // undefined and impossible to change here; this means updating identity
      // policies is really the only option
      protected readonly trustAccountIdentities: boolean = true;

      constructor(keyId: string, keyArn: string) {
        super(scope, id);

        this.keyId = keyId;
        this.keyArn = keyArn;
      }
    }
    if (Token.isUnresolved(options.aliasName)) {
      throw new Error('All arguments to Key.fromLookup() must be concrete (no Tokens)');
    }

    const attributes: cxapi.KeyContextResponse = ContextProvider.getValue(scope, {
      provider: cxschema.ContextProvider.KEY_PROVIDER,
      props: {
        aliasName: options.aliasName,
      } as cxschema.KeyContextQuery,
      dummyValue: {
        keyId: '1234abcd-12ab-34cd-56ef-1234567890ab',
      },
    }).value;

    return new Import(attributes.keyId,
      Arn.format({ resource: 'key', service: 'kms', resourceName: attributes.keyId }, Stack.of(scope)));
  }

  public readonly keyArn: string;
  public readonly keyId: string;
  protected readonly policy?: iam.PolicyDocument;
  protected readonly trustAccountIdentities: boolean;

  constructor(scope: Construct, id: string, props: KeyProps = {}) {
    super(scope, id);

    const denyLists = {
      [KeyUsage.ENCRYPT_DECRYPT]: [
        KeySpec.ECC_NIST_P256,
        KeySpec.ECC_NIST_P384,
        KeySpec.ECC_NIST_P521,
        KeySpec.ECC_SECG_P256K1,
        KeySpec.HMAC_224,
        KeySpec.HMAC_256,
        KeySpec.HMAC_384,
        KeySpec.HMAC_512,
      ],
      [KeyUsage.SIGN_VERIFY]: [
        KeySpec.SYMMETRIC_DEFAULT,
        KeySpec.HMAC_224,
        KeySpec.HMAC_256,
        KeySpec.HMAC_384,
        KeySpec.HMAC_512,
      ],
      [KeyUsage.GENERATE_VERIFY_MAC]: [
        KeySpec.RSA_2048,
        KeySpec.RSA_3072,
        KeySpec.RSA_4096,
        KeySpec.ECC_NIST_P256,
        KeySpec.ECC_NIST_P384,
        KeySpec.ECC_NIST_P521,
        KeySpec.ECC_SECG_P256K1,
        KeySpec.SYMMETRIC_DEFAULT,
        KeySpec.SM2,
      ],
    };
    const keySpec = props.keySpec ?? KeySpec.SYMMETRIC_DEFAULT;
    const keyUsage = props.keyUsage ?? KeyUsage.ENCRYPT_DECRYPT;
    if (denyLists[keyUsage].includes(keySpec)) {
      throw new Error(`key spec '${keySpec}' is not valid with usage '${keyUsage}'`);
    }

    if (keySpec.startsWith('HMAC') && props.enableKeyRotation) {
      throw new Error('key rotation cannot be enabled on HMAC keys');
    }

    if (keySpec !== KeySpec.SYMMETRIC_DEFAULT && props.enableKeyRotation) {
      throw new Error('key rotation cannot be enabled on asymmetric keys');
    }

    const defaultKeyPoliciesFeatureEnabled = FeatureFlags.of(this).isEnabled(cxapi.KMS_DEFAULT_KEY_POLICIES);

    this.policy = props.policy ?? new iam.PolicyDocument();
    if (defaultKeyPoliciesFeatureEnabled) {
      if (props.trustAccountIdentities === false) {
        throw new Error('`trustAccountIdentities` cannot be false if the @aws-cdk/aws-kms:defaultKeyPolicies feature flag is set');
      }

      this.trustAccountIdentities = true;
      // Set the default key policy if one hasn't been provided by the user.
      if (!props.policy) {
        this.addDefaultAdminPolicy();
      }
    } else {
      this.trustAccountIdentities = props.trustAccountIdentities ?? false;
      if (this.trustAccountIdentities) {
        this.addDefaultAdminPolicy();
      } else {
        this.addLegacyAdminPolicy();
      }
    }

    let pendingWindowInDays;
    if (props.pendingWindow) {
      pendingWindowInDays = props.pendingWindow.toDays();
      if (pendingWindowInDays < 7 || pendingWindowInDays > 30) {
        throw new Error(`'pendingWindow' value must between 7 and 30 days. Received: ${pendingWindowInDays}`);
      }
    }

    const resource = new CfnKey(this, 'Resource', {
      description: props.description,
      enableKeyRotation: props.enableKeyRotation,
      enabled: props.enabled,
      keySpec: props.keySpec,
      keyUsage: props.keyUsage,
      keyPolicy: this.policy,
      pendingWindowInDays: pendingWindowInDays,
    });

    this.keyArn = resource.attrArn;
    this.keyId = resource.ref;
    resource.applyRemovalPolicy(props.removalPolicy);

    (props.admins ?? []).forEach((p) => this.grantAdmin(p));

    if (props.alias !== undefined) {
      this.addAlias(props.alias);
    }
  }

  /**
   * Grant admins permissions using this key to the given principal
   *
   * Key administrators have permissions to manage the key (e.g., change permissions, revoke), but do not have permissions
   * to use the key in cryptographic operations (e.g., encrypt, decrypt).
   */
  public grantAdmin(grantee: iam.IGrantable): iam.Grant {
    return this.grant(grantee, ...perms.ADMIN_ACTIONS);
  }

  /**
   * Adds the default key policy to the key. This policy gives the AWS account (root user) full access to the CMK,
   * which reduces the risk of the CMK becoming unmanageable and enables IAM policies to allow access to the CMK.
   * This is the same policy that is default when creating a Key via the KMS API or Console.
   * @see https://docs.aws.amazon.com/kms/latest/developerguide/key-policies.html#key-policy-default
   */
  private addDefaultAdminPolicy() {
    this.addToResourcePolicy(new iam.PolicyStatement({
      resources: ['*'],
      actions: ['kms:*'],
      principals: [new iam.AccountRootPrincipal()],
    }));
  }

  /**
   * Grants the account admin privileges -- not full account access -- plus the GenerateDataKey action.
   * The GenerateDataKey action was added for interop with S3 in https://github.com/aws/aws-cdk/issues/3458.
   *
   * This policy is discouraged and deprecated by the `@aws-cdk/aws-kms:defaultKeyPolicies` feature flag.
   *
   * @link https://docs.aws.amazon.com/kms/latest/developerguide/key-policies.html#key-policy-default
   * @deprecated
   */
  private addLegacyAdminPolicy() {
    // This is equivalent to `[...perms.ADMIN_ACTIONS, 'kms:GenerateDataKey']`,
    // but keeping this explicit ordering for backwards-compatibility (changing the ordering causes resource updates)
    const actions = [
      'kms:Create*',
      'kms:Describe*',
      'kms:Enable*',
      'kms:List*',
      'kms:Put*',
      'kms:Update*',
      'kms:Revoke*',
      'kms:Disable*',
      'kms:Get*',
      'kms:Delete*',
      'kms:ScheduleKeyDeletion',
      'kms:CancelKeyDeletion',
      'kms:GenerateDataKey',
      'kms:TagResource',
      'kms:UntagResource',
    ];

    this.addToResourcePolicy(new iam.PolicyStatement({
      resources: ['*'],
      actions,
      principals: [new iam.AccountRootPrincipal()],
    }));
  }
}
