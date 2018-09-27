import { Construct, DeletionPolicy, Output, PolicyDocument, PolicyStatement, resolve } from '@aws-cdk/cdk';
import { EncryptionKeyAlias } from './alias';
import { cloudformation } from './kms.generated';

export interface EncryptionKeyRefProps {
  /**
   * The ARN of the external KMS key.
   */
  keyArn: string;
}

export abstract class EncryptionKeyRef extends Construct {
  /**
   * Defines an imported encryption key.
   *
   * `ref` can be obtained either via a call to `key.export()` or using
   * literals.
   *
   * For example:
   *
   *   const keyRefProps = key.export();
   *   const keyRef1 = EncryptionKeyRef.import(this, 'MyImportedKey1', keyRefProps);
   *   const keyRef2 = EncryptionKeyRef.import(this, 'MyImportedKey2', {
   *     keyArn: new KeyArn('arn:aws:kms:...')
   *   });
   *
   * @param parent The parent construct.
   * @param name The name of the construct.
   * @param props The key reference.
   */
  public static import(parent: Construct, name: string, props: EncryptionKeyRefProps): EncryptionKeyRef {
    return new EncryptionKeyRefImport(parent, name, props);
  }

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
      throw new Error(`Unable to add statement to IAM resource policy for KMS key: ${JSON.stringify(resolve(this.keyArn))}`);
    }

    this.policy.addStatement(statement);
  }

  /**
   * Exports this key from the current stack.
   * @returns a key ref which can be used in a call to `EncryptionKey.import(ref)`.
   */
  public export(): EncryptionKeyRefProps {
    return {
      keyArn: new Output(this, 'KeyArn').makeImportValue().toString()
    };
  }
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
}

/**
 * Definews a KMS key.
 */
export class EncryptionKey extends EncryptionKeyRef {
  public readonly keyArn: string;
  protected readonly policy?: PolicyDocument;

  constructor(parent: Construct, name: string, props: EncryptionKeyProps = {}) {
    super(parent, name);

    if (props.policy) {
      this.policy = props.policy;
    } else {
      this.policy = new PolicyDocument();
      this.allowAccountToAdmin();
    }

    const resource = new cloudformation.KeyResource(this, 'Resource', {
      description: props.description,
      enableKeyRotation: props.enableKeyRotation,
      enabled: props.enabled,
      keyPolicy: this.policy
    });

    this.keyArn = resource.keyArn;
    resource.options.deletionPolicy = DeletionPolicy.Retain;
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

class EncryptionKeyRefImport extends EncryptionKeyRef {
  public readonly keyArn: string;
  protected readonly policy = undefined; // no policy associated with an imported key

  constructor(parent: Construct, name: string, props: EncryptionKeyRefProps) {
    super(parent, name);

    this.keyArn = props.keyArn;
  }
}
