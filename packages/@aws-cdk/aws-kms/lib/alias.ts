import iam = require('@aws-cdk/aws-iam');
import { Construct, RemovalPolicy, Resource, Stack, Token } from '@aws-cdk/core';
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

  public addToResourcePolicy(statement: iam.PolicyStatement, allowNoOp?: boolean): void {
    this.aliasTargetKey.addToResourcePolicy(statement, allowNoOp);
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
}

export interface AliasAttributes {
  readonly aliasName: string;
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
  public static fromAliasAttributes(scope: Construct, id: string, attrs: AliasAttributes): IAlias {
    // eslint-disable-next-line @typescript-eslint/class-name-casing
    class _Alias extends AliasBase {
      public get aliasName() { return attrs.aliasName; }
      public get aliasTargetKey() { return attrs.aliasTargetKey; }
    }
    return new _Alias(scope, id);
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
        throw new Error(`Alias name must be between 1 and 256 characters in a-zA-Z0-9:/_-`);
      }
    }

    super(scope, id, {
      physicalName: aliasName,
    });

    this.aliasTargetKey = props.targetKey;

    const resource = new CfnAlias(this, 'Resource', {
      aliasName: this.physicalName,
      targetKeyId: this.aliasTargetKey.keyArn
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
