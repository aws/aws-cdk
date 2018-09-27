import { Construct } from '@aws-cdk/cdk';
import { EncryptionKeyRef } from './key';
import { cloudformation } from './kms.generated';

const REQUIRED_ALIAS_PREFIX = 'alias/';
const DISALLOWED_PREFIX = REQUIRED_ALIAS_PREFIX + 'AWS';

export interface EncryptionKeyAliasProps {
  /**
   * The name of the alias. The name must start with alias followed by a
   * forward slash, such as alias/. You can't specify aliases that begin with
   * alias/AWS. These aliases are reserved.
   */
  alias: string;

  /**
   * The ID of the key for which you are creating the alias. Specify the key's
   * globally unique identifier or Amazon Resource Name (ARN). You can't
   * specify another alias.
   */
  key: EncryptionKeyRef;
}

/**
 * Defines a display name for a customer master key (CMK) in AWS Key Management
 * Service (AWS KMS). Using an alias to refer to a key can help you simplify key
 * management. For example, when rotating keys, you can just update the alias
 * mapping instead of tracking and changing key IDs. For more information, see
 * Working with Aliases in the AWS Key Management Service Developer Guide.
 *
 * You can also add an alias for a key by calling `key.addAlias(alias)`.
 */
export class EncryptionKeyAlias extends Construct {
  /**
   * The name of the alias.
   */
  public aliasName: string;

  constructor(parent: Construct, name: string, props: EncryptionKeyAliasProps) {
    super(parent, name);

    if (!props.alias.startsWith(REQUIRED_ALIAS_PREFIX)) {
      throw new Error(`Alias must start with the prefix "${REQUIRED_ALIAS_PREFIX}": ${props.alias}`);
    }

    if (props.alias === REQUIRED_ALIAS_PREFIX) {
      throw new Error(`Alias must include a value after "${REQUIRED_ALIAS_PREFIX}": ${props.alias}`);
    }

    if (props.alias.startsWith(DISALLOWED_PREFIX)) {
      throw new Error(`Alias cannot start with ${DISALLOWED_PREFIX}: ${props.alias}`);
    }

    const resource = new cloudformation.AliasResource(this, 'Resource', {
      aliasName: props.alias,
      targetKeyId: props.key.keyArn
    });

    this.aliasName = resource.aliasName;
  }
}
