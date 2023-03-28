import * as iam from '@aws-cdk/aws-iam';
import { RemovalPolicy, Resource, Stack, Token } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { IKey } from './key';
import { CfnAlias } from './kms.generated';

const REQUIRED_ALIAS_PREFIX = 'alias/';
const DISALLOWED_PREFIX = REQUIRED_ALIAS_PREFIX + 'aws/';

/**
 * A KMS Key alias.
 * An alias can be used in all places that expect a key.
 */
export interface IAlias extends IKey {
  /**
   * The name of the alias.
   *
   * @attribute
   */
  readonly aliasName: string;

  /**
   * The Key to which the Alias refers.
   *
   * @attribute
   */
  readonly aliasTargetKey: IKey;
}

/**
 * Construction properties for a KMS Key Alias object.
 */
export interface AliasProps {
  /**
   * The name of the alias. The name must start with alias followed by a
   * forward slash, such as alias/. You can't specify aliases that begin with
   * alias/AWS. These aliases are reserved.
   */
  readonly aliasName: string;

  /**
   * The ID of the key for which you are creating the alias. Specify the key's
   * globally unique identifier or Amazon Resource Name (ARN). You can't
   * specify another alias.
   */
  readonly targetKey: IKey;

  /**
   * Policy to apply when the alias is removed from this stack.
   *
   * @default - The alias will be deleted
   */
  readonly removalPolicy?: RemovalPolicy;
}

abstract class AliasBase extends Resource implements IAlias {
  public abstract readonly aliasName: string;

  public abstract readonly aliasTargetKey: IKey;

  public get keyArn(): string {
    return Stack.of(this).formatArn({
      service: 'kms',
      // aliasName already contains the '/'
      resource: this.aliasName,
    });
  }

  public get keyId(): string {
    return this.aliasName;
  }

  public addAlias(alias: string): Alias {
    return this.aliasTargetKey.addAlias(alias);
  }

  public addToResourcePolicy(statement: iam.PolicyStatement, allowNoOp?: boolean): iam.AddToResourcePolicyResult {
    return this.aliasTargetKey.addToResourcePolicy(statement, allowNoOp);
  }

  public grant(grantee: iam.IGrantable, ...actions: string[]): iam.Grant {
    return this.aliasTargetKey.grant(grantee, ...actions);
  }

  public grantDecrypt(grantee: iam.IGrantable): iam.Grant {
    return this.aliasTargetKey.grantDecrypt(grantee);
  }

  public grantEncrypt(grantee: iam.IGrantable): iam.Grant {
    return this.aliasTargetKey.grantEncrypt(grantee);
  }

  public grantEncryptDecrypt(grantee: iam.IGrantable): iam.Grant {
    return this.aliasTargetKey.grantEncryptDecrypt(grantee);
  }

  grantGenerateMac(grantee: iam.IGrantable): iam.Grant {
    return this.aliasTargetKey.grantGenerateMac(grantee);
  }

  grantVerifyMac(grantee: iam.IGrantable): iam.Grant {
    return this.aliasTargetKey.grantVerifyMac(grantee);
  }
}

/**
 * Properties of a reference to an existing KMS Alias
 */
export interface AliasAttributes {
  /**
   * Specifies the alias name. This value must begin with alias/ followed by a name (i.e. alias/ExampleAlias)
   */
  readonly aliasName: string;

  /**
   * The customer master key (CMK) to which the Alias refers.
   */
  readonly aliasTargetKey: IKey;
}

/**
 * Defines a display name for a customer master key (CMK) in AWS Key Management
 * Service (AWS KMS). Using an alias to refer to a key can help you simplify key
 * management. For example, when rotating keys, you can just update the alias
 * mapping instead of tracking and changing key IDs. For more information, see
 * Working with Aliases in the AWS Key Management Service Developer Guide.
 *
 * You can also add an alias for a key by calling `key.addAlias(alias)`.
 *
 * @resource AWS::KMS::Alias
 */
export class Alias extends AliasBase {
  /**
   * Import an existing KMS Alias defined outside the CDK app.
   *
   * @param scope The parent creating construct (usually `this`).
   * @param id The construct's name.
   * @param attrs the properties of the referenced KMS Alias
   */
  public static fromAliasAttributes(scope: Construct, id: string, attrs: AliasAttributes): IAlias {
    class _Alias extends AliasBase {
      public get aliasName() { return attrs.aliasName; }
      public get aliasTargetKey() { return attrs.aliasTargetKey; }
    }
    return new _Alias(scope, id);
  }

  /**
   * Import an existing KMS Alias defined outside the CDK app, by the alias name. This method should be used
   * instead of 'fromAliasAttributes' when the underlying KMS Key ARN is not available.
   * This Alias will not have a direct reference to the KMS Key, so addAlias and grant* methods are not supported.
   *
   * @param scope The parent creating construct (usually `this`).
   * @param id The construct's name.
   * @param aliasName The full name of the KMS Alias (e.g., 'alias/aws/s3', 'alias/myKeyAlias').
   */
  public static fromAliasName(scope: Construct, id: string, aliasName: string): IAlias {
    class Import extends Resource implements IAlias {
      public readonly keyArn = Stack.of(this).formatArn({ service: 'kms', resource: aliasName });
      public readonly keyId = aliasName;
      public readonly aliasName = aliasName;
      public get aliasTargetKey(): IKey { throw new Error('Cannot access aliasTargetKey on an Alias imported by Alias.fromAliasName().'); }
      public addAlias(_alias: string): Alias { throw new Error('Cannot call addAlias on an Alias imported by Alias.fromAliasName().'); }
      public addToResourcePolicy(_statement: iam.PolicyStatement, _allowNoOp?: boolean): iam.AddToResourcePolicyResult {
        return { statementAdded: false };
      }
      public grant(grantee: iam.IGrantable, ..._actions: string[]): iam.Grant { return iam.Grant.drop(grantee, ''); }
      public grantDecrypt(grantee: iam.IGrantable): iam.Grant { return iam.Grant.drop(grantee, ''); }
      public grantEncrypt(grantee: iam.IGrantable): iam.Grant { return iam.Grant.drop(grantee, ''); }
      public grantEncryptDecrypt(grantee: iam.IGrantable): iam.Grant { return iam.Grant.drop(grantee, ''); }
      public grantGenerateMac(grantee: iam.IGrantable): iam.Grant { return iam.Grant.drop(grantee, ''); }
      public grantVerifyMac(grantee: iam.IGrantable): iam.Grant { return iam.Grant.drop(grantee, ''); }
    }

    return new Import(scope, id);
  }

  public readonly aliasName: string;
  public readonly aliasTargetKey: IKey;

  constructor(scope: Construct, id: string, props: AliasProps) {
    let aliasName = props.aliasName;

    if (!Token.isUnresolved(aliasName)) {
      if (!aliasName.startsWith(REQUIRED_ALIAS_PREFIX)) {
        aliasName = REQUIRED_ALIAS_PREFIX + aliasName;
      }

      if (aliasName === REQUIRED_ALIAS_PREFIX) {
        throw new Error(`Alias must include a value after "${REQUIRED_ALIAS_PREFIX}": ${aliasName}`);
      }

      if (aliasName.toLocaleLowerCase().startsWith(DISALLOWED_PREFIX)) {
        throw new Error(`Alias cannot start with ${DISALLOWED_PREFIX}: ${aliasName}`);
      }

      if (!aliasName.match(/^[a-zA-Z0-9:/_-]{1,256}$/)) {
        throw new Error('Alias name must be between 1 and 256 characters in a-zA-Z0-9:/_-');
      }
    }

    super(scope, id, {
      physicalName: aliasName,
    });

    this.aliasTargetKey = props.targetKey;

    const resource = new CfnAlias(this, 'Resource', {
      aliasName: this.physicalName,
      targetKeyId: this.aliasTargetKey.keyArn,
    });

    this.aliasName = this.getResourceNameAttribute(resource.aliasName);

    if (props.removalPolicy) {
      resource.applyRemovalPolicy(props.removalPolicy);
    }
  }

  protected generatePhysicalName(): string {
    return REQUIRED_ALIAS_PREFIX + super.generatePhysicalName();
  }
}
