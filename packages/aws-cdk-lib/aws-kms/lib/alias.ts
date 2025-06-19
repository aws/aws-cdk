import { Construct } from 'constructs';
import { IKey } from './key';
import { CfnAlias } from './kms.generated';
import * as iam from '../../aws-iam';
import * as perms from './private/perms';
import { FeatureFlags, RemovalPolicy, Resource, Stack, Token, Tokenization, ValidationError } from '../../core';
import { addConstructMetadata } from '../../core/lib/metadata-resource';
import { propertyInjectable } from '../../core/lib/prop-injectable';
import { KMS_ALIAS_NAME_REF, KMS_APPLY_IMPORTED_ALIAS_PERMISSIONS_TO_PRINCIPAL } from '../../cx-api';

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

  /**
   * The ARN of the alias.
   *
   * @attribute
   * @deprecated use `aliasArn` instead
   */
  public get keyArn(): string {
    return Stack.of(this).formatArn({
      service: 'kms',
      // aliasName already contains the '/'
      resource: this.aliasName,
    });
  }

  /**
   * The ARN of the alias.
   *
   * @attribute
   */
  public get aliasArn(): string {
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

  public grantSign(grantee: iam.IGrantable): iam.Grant {
    return this.aliasTargetKey.grantSign(grantee);
  }

  public grantVerify(grantee: iam.IGrantable): iam.Grant {
    return this.aliasTargetKey.grantVerify(grantee);
  }

  public grantSignVerify(grantee: iam.IGrantable): iam.Grant {
    return this.aliasTargetKey.grantSignVerify(grantee);
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
@propertyInjectable
export class Alias extends AliasBase {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = 'aws-cdk-lib.aws-kms.Alias';

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
   * This Alias will not have a direct reference to the KMS Key, so addAlias method is not supported.
   *
   * If the `@aws-cdk/aws-kms:applyImportedAliasPermissionsToPrincipal` feature flag is set to `true`,
   * the grant* methods will use the kms:ResourceAliases condition to grant permissions to the specific alias name.
   * They will only modify the principal policy, not the key resource policy.
   * Without the feature flag `grant*` methods will be a no-op.
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
      public get aliasTargetKey(): IKey { throw new ValidationError('Cannot access aliasTargetKey on an Alias imported by Alias.fromAliasName().', this); }
      public addAlias(_alias: string): Alias { throw new ValidationError('Cannot call addAlias on an Alias imported by Alias.fromAliasName().', this); }
      public addToResourcePolicy(_statement: iam.PolicyStatement, _allowNoOp?: boolean): iam.AddToResourcePolicyResult {
        return { statementAdded: false };
      }

      public grant(grantee: iam.IGrantable, ...actions: string[]): iam.Grant {
        if (!FeatureFlags.of(this).isEnabled(KMS_APPLY_IMPORTED_ALIAS_PERMISSIONS_TO_PRINCIPAL)) {
          return iam.Grant.drop(grantee, '');
        }
        return iam.Grant.addToPrincipal({
          grantee,
          actions,
          resourceArns: [Stack.of(scope).formatArn({
            service: 'kms',
            resource: 'key',
            resourceName: '*',
          })],
          conditions: {
            'ForAnyValue:StringEquals': {
              'kms:ResourceAliases': this.aliasName,
            },
          },
        });
      }

      public grantDecrypt(grantee: iam.IGrantable): iam.Grant {
        return this.grant(grantee, ...perms.DECRYPT_ACTIONS);
      }

      public grantEncrypt(grantee: iam.IGrantable): iam.Grant {
        return this.grant(grantee, ...perms.ENCRYPT_ACTIONS);
      }

      public grantEncryptDecrypt(grantee: iam.IGrantable): iam.Grant {
        return this.grant(grantee, ...perms.DECRYPT_ACTIONS, ...perms.ENCRYPT_ACTIONS);
      }

      public grantSign(grantee: iam.IGrantable): iam.Grant {
        return this.grant(grantee, ...perms.SIGN_ACTIONS);
      }

      public grantVerify(grantee: iam.IGrantable): iam.Grant {
        return this.grant(grantee, ...perms.VERIFY_ACTIONS);
      }

      public grantSignVerify(grantee: iam.IGrantable): iam.Grant {
        return this.grant(grantee, ...perms.SIGN_ACTIONS, ...perms.VERIFY_ACTIONS);
      }

      public grantGenerateMac(grantee: iam.IGrantable): iam.Grant {
        return this.grant(grantee, ...perms.GENERATE_HMAC_ACTIONS);
      }

      public grantVerifyMac(grantee: iam.IGrantable): iam.Grant {
        return this.grant(grantee, ...perms.VERIFY_HMAC_ACTIONS);
      }
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
        throw new ValidationError(`Alias must include a value after "${REQUIRED_ALIAS_PREFIX}": ${aliasName}`, scope);
      }

      if (aliasName.toLocaleLowerCase().startsWith(DISALLOWED_PREFIX)) {
        throw new ValidationError(`Alias cannot start with ${DISALLOWED_PREFIX}: ${aliasName}`, scope);
      }

      if (!aliasName.match(/^[a-zA-Z0-9:/_-]{1,256}$/)) {
        throw new ValidationError('Alias name must be between 1 and 256 characters in a-zA-Z0-9:/_-', scope);
      }
    } else if (Tokenization.reverseString(aliasName).firstValue && Tokenization.reverseString(aliasName).firstToken === undefined) {
      const valueInToken = Tokenization.reverseString(aliasName).firstValue;

      if (!valueInToken.startsWith(REQUIRED_ALIAS_PREFIX)) {
        aliasName = REQUIRED_ALIAS_PREFIX + aliasName;
      }

      if (valueInToken.toLocaleLowerCase().startsWith(DISALLOWED_PREFIX)) {
        throw new ValidationError(`Alias cannot start with ${DISALLOWED_PREFIX}: ${aliasName}`, scope);
      }

      if (!valueInToken.match(/^[a-zA-Z0-9:/_-]{1,256}$/)) {
        throw new ValidationError('Alias name must be between 1 and 256 characters in a-zA-Z0-9:/_-', scope);
      }
    }

    super(scope, id, {
      physicalName: aliasName,
    });
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    this.aliasTargetKey = props.targetKey;

    const resource = new CfnAlias(this, 'Resource', {
      aliasName: this.physicalName,
      targetKeyId: this.aliasTargetKey.keyArn,
    });

    if (FeatureFlags.of(this).isEnabled(KMS_ALIAS_NAME_REF)) {
      this.aliasName = this.getResourceNameAttribute(resource.ref);
    } else {
      this.aliasName = this.getResourceNameAttribute(resource.aliasName);
    }

    if (props.removalPolicy) {
      resource.applyRemovalPolicy(props.removalPolicy);
    }
  }

  protected generatePhysicalName(): string {
    return REQUIRED_ALIAS_PREFIX + super.generatePhysicalName();
  }
}

