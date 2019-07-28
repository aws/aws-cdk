import { Construct, IResource, Resource, Token } from '@aws-cdk/core';
import { IKey } from './key';
import { CfnAlias } from './kms.generated';

const REQUIRED_ALIAS_PREFIX = 'alias/';
const DISALLOWED_PREFIX = REQUIRED_ALIAS_PREFIX + 'aws/';

/**
 * A KMS Key alias.
 */
export interface IAlias extends IResource {
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
}

abstract class AliasBase extends Resource implements IAlias {
  public abstract readonly aliasName: string;

  public abstract readonly aliasTargetKey: IKey;
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
    // tslint:disable-next-line: class-name
    class _Alias extends AliasBase {
      public get aliasName() { return attrs.aliasName; }
      public get aliasTargetKey() { return attrs.aliasTargetKey; }
    }
    return new _Alias(scope, id);
  }

  public readonly aliasName: string;
  public readonly aliasTargetKey: IKey;

  constructor(scope: Construct, id: string, props: AliasProps) {
    super(scope, id);

    if (!Token.isUnresolved(props.aliasName)) {
      if (!props.aliasName.startsWith(REQUIRED_ALIAS_PREFIX)) {
        throw new Error(`Alias must start with the prefix "${REQUIRED_ALIAS_PREFIX}": ${props.aliasName}`);
      }

      if (props.aliasName === REQUIRED_ALIAS_PREFIX) {
        throw new Error(`Alias must include a value after "${REQUIRED_ALIAS_PREFIX}": ${props.aliasName}`);
      }

      if (props.aliasName.startsWith(DISALLOWED_PREFIX)) {
        throw new Error(`Alias cannot start with ${DISALLOWED_PREFIX}: ${props.aliasName}`);
      }

      if (!props.aliasName.match(/^[a-zA-Z0-9:/_-]{1,256}$/)) {
        throw new Error(`Alias name must be between 1 and 256 characters in a-zA-Z0-9:/_-`);
      }
    }

    const resource = new CfnAlias(this, 'Resource', {
      aliasName: props.aliasName,
      targetKeyId: props.targetKey.keyArn
    });

    this.aliasName = resource.aliasName;
  }
}
