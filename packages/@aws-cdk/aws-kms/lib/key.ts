import * as iam from '@aws-cdk/aws-iam';
import { Construct, IResource, RemovalPolicy, Resource, Stack } from '@aws-cdk/core';
import { Alias } from './alias';
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
   * Grant decryption permisisons using this key to the given principal
   */
  grantDecrypt(grantee: iam.IGrantable): iam.Grant;

  /**
   * Grant encryption permisisons using this key to the given principal
   */
  grantEncrypt(grantee: iam.IGrantable): iam.Grant;

  /**
   * Grant encryption and decryption permisisons using this key to the given principal
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
   * If specified grants will default identity policies instead of to both
   * resource and identity policies.
   */
  protected abstract readonly trustAccountIdentities: boolean;

  /**
   * Collection of aliases added to the key
   *
   * Tracked to determine whether or not the aliasName should be added to the end of its ID
   */
  private readonly aliases: Alias[] = [];

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
    if (this.trustAccountIdentities) {
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
   * Grant decryption permisisons using this key to the given principal
   */
  public grantDecrypt(grantee: iam.IGrantable): iam.Grant {
    return this.grant(grantee,
      'kms:Decrypt',
    );
  }

  /**
   * Grant encryption permisisons using this key to the given principal
   */
  public grantEncrypt(grantee: iam.IGrantable): iam.Grant {
    return this.grant(grantee,
      'kms:Encrypt',
      'kms:ReEncrypt*',
      'kms:GenerateDataKey*',
    );
  }

  /**
   * Grant encryption and decryption permisisons using this key to the given principal
   */
  public grantEncryptDecrypt(grantee: iam.IGrantable): iam.Grant {
    return this.grant(grantee,
      'kms:Decrypt',
      'kms:Encrypt',
      'kms:ReEncrypt*',
      'kms:GenerateDataKey*',
    );
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
    if (!(Construct.isConstruct(grantee))) {
      return undefined;
    }
    const keyStack = Stack.of(this);
    const granteeStack = Stack.of(grantee);
    if (keyStack === granteeStack) {
      return undefined;
    }
    return granteeStack.dependencies.includes(keyStack)
      ? granteeStack.account
      : undefined;
  }

  private isGranteeFromAnotherRegion(grantee: iam.IGrantable): boolean {
    if (!(Construct.isConstruct(grantee))) {
      return false;
    }
    const bucketStack = Stack.of(this);
    const identityStack = Stack.of(grantee);
    return bucketStack.region !== identityStack.region;
  }

  private isGranteeFromAnotherAccount(grantee: iam.IGrantable): boolean {
    if (!(Construct.isConstruct(grantee))) {
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
   * @default - A policy document with permissions for the account root to
   * administer the key will be created.
   */
  readonly policy?: iam.PolicyDocument;

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
   * to how it works for other AWS resources).
   *
   * @default false
   * @see https://docs.aws.amazon.com/kms/latest/developerguide/key-policies.html#key-policy-default-allow-root-enable-iam
   */
  readonly trustAccountIdentities?: boolean;
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

    this.policy = props.policy || new iam.PolicyDocument();
    this.trustAccountIdentities = props.trustAccountIdentities || false;
    if (this.trustAccountIdentities) {
      this.allowAccountIdentitiesToControl();
    } else {
      this.allowAccountToAdmin();
    }

    const resource = new CfnKey(this, 'Resource', {
      description: props.description,
      enableKeyRotation: props.enableKeyRotation,
      enabled: props.enabled,
      keyPolicy: this.policy,
    });

    this.keyArn = resource.attrArn;
    this.keyId = resource.ref;
    resource.applyRemovalPolicy(props.removalPolicy);

    if (props.alias !== undefined) {
      this.addAlias(props.alias);
    }
  }

  private allowAccountIdentitiesToControl() {
    this.addToResourcePolicy(new iam.PolicyStatement({
      resources: ['*'],
      actions: ['kms:*'],
      principals: [new iam.AccountRootPrincipal()],
    }));

  }
  /**
   * Let users or IAM policies from this account admin this key.
   * @link https://docs.aws.amazon.com/kms/latest/developerguide/key-policies.html#key-policy-default
   * @link https://aws.amazon.com/premiumsupport/knowledge-center/update-key-policy-future/
   */
  private allowAccountToAdmin() {
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
