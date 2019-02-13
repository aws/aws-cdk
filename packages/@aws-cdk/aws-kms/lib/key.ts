import { PolicyDocument, PolicyStatement } from '@aws-cdk/aws-iam';
import { Construct, DeletionPolicy, IConstruct, Output } from '@aws-cdk/cdk';
import { EncryptionKeyAlias } from './alias';
import { CfnKey } from './kms.generated';

export interface IEncryptionKey extends IConstruct {
  /**
   * The ARN of the key.
   */
  readonly keyArn: string;

  /**
   * Defines a new alias for the key.
   */
  addAlias(alias: string): EncryptionKeyAlias;

  /**
   * Adds a statement to the KMS key resource policy.
   * @param statement The policy statement to add
   * @param allowNoOp If this is set to `false` and there is no policy
   * defined (i.e. external key), the operation will fail. Otherwise, it will
   * no-op.
   */
  addToResourcePolicy(statement: PolicyStatement, allowNoOp?: boolean): void;

  /**
   * Exports this key from the current stack.
   * @returns a key ref which can be used in a call to `EncryptionKey.import(ref)`.
   */
  export(): EncryptionKeyImportProps;
}

export interface EncryptionKeyImportProps {
  /**
   * The ARN of the external KMS key.
   */
  keyArn: string;
}

export abstract class EncryptionKeyBase extends Construct implements IEncryptionKey {
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
  public addAlias(alias: string): EncryptionKeyAlias {
    return new EncryptionKeyAlias(this, 'Alias', { alias, key: this });
  }

  /**
   * Adds a statement to the KMS key resource policy.
   * @param statement The policy statement to add
   * @param allowNoOp If this is set to `false` and there is no policy
   * defined (i.e. external key), the operation will fail. Otherwise, it will
   * no-op.
   */
  public addToResourcePolicy(statement: PolicyStatement, allowNoOp = true) {
    if (!this.policy) {
      if (allowNoOp) { return; }
      throw new Error(`Unable to add statement to IAM resource policy for KMS key: ${JSON.stringify(this.node.resolve(this.keyArn))}`);
    }

    this.policy.addStatement(statement);
  }

  public abstract export(): EncryptionKeyImportProps;
}

/**
 * Construction properties for a KMS Key object
 */
export interface EncryptionKeyProps {
  /**
   * A description of the key. Use a description that helps your users decide
   * whether the key is appropriate for a particular task.
   */
  description?: string;

  /**
   * Indicates whether AWS KMS rotates the key.
   * @default false
   */
  enableKeyRotation?: boolean;

  /**
   * Indicates whether the key is available for use.
   * @default Key is enabled
   */
  enabled?: boolean;

  /**
   * Custom policy document to attach to the KMS key.
   *
   * @default A policy document with permissions for the account root to
   * administer the key will be created.
   */
  policy?: PolicyDocument;

  /**
   * Whether the encryption key should be retained when it is removed from the Stack. This is useful when one wants to
   * retain access to data that was encrypted with a key that is being retired.
   *
   * @default true
   */
  retain?: boolean;
}

/**
 * Defines a KMS key.
 */
export class EncryptionKey extends EncryptionKeyBase {
  /**
   * Defines an imported encryption key.
   *
   * `ref` can be obtained either via a call to `key.export()` or using
   * literals.
   *
   * For example:
   *
   *   const keyAttr = key.export();
   *   const keyRef1 = EncryptionKey.import(this, 'MyImportedKey1', keyAttr);
   *   const keyRef2 = EncryptionKey.import(this, 'MyImportedKey2', {
   *     keyArn: new KeyArn('arn:aws:kms:...')
   *   });
   *
   * @param scope The parent construct.
   * @param id The name of the construct.
   * @param props The key reference.
   */
  public static import(scope: Construct, id: string, props: EncryptionKeyImportProps): IEncryptionKey {
    return new ImportedEncryptionKey(scope, id, props);
  }

  public readonly keyArn: string;
  protected readonly policy?: PolicyDocument;

  constructor(scope: Construct, id: string, props: EncryptionKeyProps = {}) {
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
   * Exports this key from the current stack.
   * @returns a key ref which can be used in a call to `EncryptionKey.import(ref)`.
   */
  public export(): EncryptionKeyImportProps {
    return {
      keyArn: new Output(this, 'KeyArn', { value: this.keyArn }).makeImportValue().toString()
    };
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

    this.addToResourcePolicy(new PolicyStatement()
      .addAllResources()
      .addActions(...actions)
      .addAccountRootPrincipal());
  }
}

class ImportedEncryptionKey extends EncryptionKeyBase {
  public readonly keyArn: string;
  protected readonly policy = undefined; // no policy associated with an imported key

  constructor(scope: Construct, id: string, private readonly props: EncryptionKeyImportProps) {
    super(scope, id);

    this.keyArn = props.keyArn;
  }

  public export() {
    return this.props;
  }
}
