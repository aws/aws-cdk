import * as iam from '@aws-cdk/aws-iam';
import { FeatureFlags, IResource, RemovalPolicy, Resource, Stack, Duration } from '@aws-cdk/core';
import * as cxapi from '@aws-cdk/cx-api';
import { IConstruct, Construct } from 'constructs';
import { Alias } from './alias';
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

  constructor(scope: Construct, id: string) {
    super(scope, id);

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
   * Checks whether the grantee belongs to a stack that will be deployed
   * after the stack containing this key.
   *
   * @param grantee the grantee to give permissions to
   * @returns the account ID of the grantee stack if its stack does depend on this stack,
   *   undefined otherwise
   */
  private granteeStackDependsOnKeyStack(grantee: iam.IGrantable): string | undefined {
    const grantPrincipal = grantee.grantPrincipal;
    if (!(grantPrincipal instanceof Construct)) {
      return undefined;
    }
    // this logic should only apply to newly created
    // (= not imported) resources
    if (!this.principalIsANewlyCreatedResource(grantPrincipal)) {
      return undefined;
    }
    // return undefined;
    const keyStack = Stack.of(this);
    const granteeStack = Stack.of(grantPrincipal);
    if (keyStack === granteeStack) {
      return undefined;
    }
    return granteeStack.dependencies.includes(keyStack)
      ? granteeStack.account
      : undefined;
  }

  private principalIsANewlyCreatedResource(principal: IConstruct): boolean {
    // yes, this sucks
    // this is just a temporary stopgap to stem the bleeding while we work on a proper fix
    return principal instanceof iam.Role ||
      principal instanceof iam.User ||
      principal instanceof iam.Group;
  }

  private isGranteeFromAnotherRegion(grantee: iam.IGrantable): boolean {
    if (!(grantee instanceof Construct)) {
      return false;
    }
    const bucketStack = Stack.of(this);
    const identityStack = Stack.of(grantee);
    return bucketStack.region !== identityStack.region;
  }

  private isGranteeFromAnotherAccount(grantee: iam.IGrantable): boolean {
    if (!(grantee instanceof Construct)) {
      return false;
    }
    const bucketStack = Stack.of(this);
    const identityStack = Stack.of(grantee);
    return bucketStack.account !== identityStack.account;
  }
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
   * Custom policy document to attach to the KMS key.
   *
   * NOTE - If the '@aws-cdk/aws-kms:defaultKeyPolicies' feature flag is set (the default for new projects),
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
   * If the '@aws-cdk/aws-kms:defaultKeyPolicies' feature flag is set (the default for new projects),
   * this flag will always be treated as 'true' and does not need to be explicitly set.
   *
   * @default - false, unless the '@aws-cdk/aws-kms:defaultKeyPolicies' feature flag is set.
   * @see https://docs.aws.amazon.com/kms/latest/developerguide/key-policies.html#key-policy-default-allow-root-enable-iam
   * @deprecated redundant with the '@aws-cdk/aws-kms:defaultKeyPolicies' feature flag
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

      constructor(keyId: string) {
        super(scope, id);

        this.keyId = keyId;
      }
    }

    const keyResourceName = Stack.of(scope).parseArn(keyArn).resourceName;
    if (!keyResourceName) {
      throw new Error(`KMS key ARN must be in the format 'arn:aws:kms:<region>:<account>:key/<keyId>', got: '${keyArn}'`);
    }

    return new Import(keyResourceName);
  }

  public readonly keyArn: string;
  public readonly keyId: string;
  protected readonly policy?: iam.PolicyDocument;
  protected readonly trustAccountIdentities: boolean;

  constructor(scope: Construct, id: string, props: KeyProps = {}) {
    super(scope, id);

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
   * This policy is discouraged and deprecated by the '@aws-cdk/aws-kms:defaultKeyPolicies' feature flag.
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
