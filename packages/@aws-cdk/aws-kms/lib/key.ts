import iam = require('@aws-cdk/aws-iam');
import { PolicyDocument, PolicyStatement } from '@aws-cdk/aws-iam';
import { Construct, DeletionPolicy, IResource, Resource, Stack } from '@aws-cdk/cdk';
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

  /**
   * Optional policy document that represents the resource policy of this key.
   *
   * If specified, addToResourcePolicy can be used to edit this policy.
   * Otherwise this method will no-op.
   */
  protected abstract readonly policy?: PolicyDocument;

  /**
   * Defines a new alias for the key.
   */
  public addAlias(alias: string): Alias {
    return new Alias(this, 'Alias', { name: alias, targetKey: this });
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
    return iam.Grant.addToPrincipalAndResource({
      grantee,
      actions,
      resourceArns: [this.keyArn],
      resource: this,
      resourceSelfArns: ['*']
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
   * @default true
   */
  readonly retain?: boolean;
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
      public keyArn = keyArn;
      protected policy?: iam.PolicyDocument | undefined = undefined;
    }

    return new Import(scope, id);
  }

  public readonly keyArn: string;
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

    this.keyArn = resource.keyArn;
    resource.options.deletionPolicy = props.retain === false
                                    ? DeletionPolicy.Delete
                                    : DeletionPolicy.Retain;
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
      "kms:CancelKeyDeletion"
    ];

    this.addToResourcePolicy(new PolicyStatement({
      resources: ['*'],
      actions,
      principals: [new iam.AccountRootPrincipal()]
    }));
  }
}
