import iam = require('@aws-cdk/aws-iam');
import { PolicyDocument, PolicyStatement } from '@aws-cdk/aws-iam';
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
  addToResourcePolicy(statement: PolicyStatement, allowNoOp?: boolean): void;

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
  protected abstract readonly policy?: PolicyDocument;

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
  public addToResourcePolicy(statement: PolicyStatement, allowNoOp = true) {
    const stack = Stack.of(this);

    if (!this.policy) {
      if (allowNoOp) { return; }
      throw new Error(`Unable to add statement to IAM resource policy for KMS key: ${JSON.stringify(stack.resolve(this.keyArn))}`);
    }

    this.policy.addStatements(statement);
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
    return iam.Grant.addToPrincipalAndResource({
      grantee,
      actions,
      resource: this,
      resourcePolicyPrincipal: principal,

      // if the key is used in a cross-environment matter,
      // we can't access the Key ARN (they don't have physical names),
      // so fall back to using '*'. ToDo we need to make this better... somehow
      resourceArns: crossEnvironment ? ['*'] : [this.keyArn],

      resourceSelfArns: crossEnvironment ? undefined : ['*'],
    });
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
      'kms:GenerateDataKey*'
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
      'kms:GenerateDataKey*'
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
  readonly policy?: PolicyDocument;

  /**
   * Whether the encryption key should be retained when it is removed from the Stack. This is useful when one wants to
   * retain access to data that was encrypted with a key that is being retired.
   *
   * @default RemovalPolicy.Retain
   */
  readonly removalPolicy?: RemovalPolicy;
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
  protected readonly policy?: PolicyDocument;

  constructor(scope: Construct, id: string, props: KeyProps = {}) {
    super(scope, id);

    if (props.policy) {
      this.policy = props.policy;
    } else {
      this.policy = new PolicyDocument();
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

  /**
   * Let users from this account admin this key.
   * @link https://aws.amazon.com/premiumsupport/knowledge-center/update-key-policy-future/
   */
  private allowAccountToAdmin() {
    const actions = [
      "kms:Create*",
      "kms:Describe*",
      "kms:Enable*",
      "kms:List*",
      "kms:Put*",
      "kms:Update*",
      "kms:Revoke*",
      "kms:Disable*",
      "kms:Get*",
      "kms:Delete*",
      "kms:ScheduleKeyDeletion",
      "kms:CancelKeyDeletion",
      "kms:GenerateDataKey"
    ];

    this.addToResourcePolicy(new PolicyStatement({
      resources: ['*'],
      actions,
      principals: [new iam.AccountRootPrincipal()]
    }));
  }
}
