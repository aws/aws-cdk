import { Construct } from 'constructs';
import { IKey } from './key';
import { CfnAlias } from './kms.generated';
import * as perms from './private/perms';
import { makeAliasArn, parseAliasName } from './util';
import * as iam from '../../aws-iam';
import { FeatureFlags, RemovalPolicy, Resource, Stack, Token, Tokenization } from '../../core';
import { KMS_ALIAS_NAME_REF } from '../../cx-api';

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
   * The ARN of the alias.
   *
   * @attribute
   */
  readonly aliasArn: string;

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

  public abstract readonly aliasArn: string;

  public abstract readonly keyId: string;

  public abstract readonly keyArn: string;

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
   * @default - Inferred from aliasArn
   */
  readonly aliasName?: string;

  /**
   * Specifies the alias arn.
   * @default - Inferred from stack and aliasName
   */
  readonly aliasArn?: string;

  /**
   * Specifies the alias account.
   * @default - Inferred from stack
   */
  readonly account?: string;
  /**
   * Specifies the region where the alias is defined.
   * @default - Inferred from stack
   */
  readonly region?: string;

  /**
   * The customer master key (CMK) to which the Alias refers.
   * @default - No key
   */
  readonly aliasTargetKey?: IKey;
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
    const aliasName = parseAliasName(scope, attrs);
    if (!aliasName) {
      throw new Error('Could not determine alias name from attributes');
    }
    const aliasArn = makeAliasArn(scope, attrs);
    if (!aliasArn) {
      throw new Error('Could not determine alias arn from attributes'); // TODO: Get a better error message?
    }

    class Import extends AliasBase implements IAlias {
      public readonly keyArn = attrs.aliasTargetKey ? attrs.aliasTargetKey.keyArn : aliasArn!;
      public readonly aliasArn = aliasArn!;
      public readonly keyId = attrs.aliasTargetKey ? attrs.aliasTargetKey.keyId : aliasName!;
      public readonly aliasName = aliasName!;
      public get aliasTargetKey(): IKey {
        if (!attrs.aliasTargetKey) {
          throw new Error('No aliasTargetKey was provided when importing the Alias');
        }
        return attrs.aliasTargetKey;
      }
      public addAlias(_alias: string): Alias { throw new Error('Cannot call addAlias on an Alias imported by Alias.fromAliasAttributes().'); }
      public addToResourcePolicy(_statement: iam.PolicyStatement, _allowNoOp?: boolean): iam.AddToResourcePolicyResult {
        return { statementAdded: false };
      }
      public grant(grantee: iam.IGrantable, ...actions: string[]): iam.Grant {
        // If we have a real key, we defer and create the grant as a resource policy
        if (attrs.aliasTargetKey) {
          return attrs.aliasTargetKey.grant(grantee, ...actions);
        }

        // The arn for the keys we allow is not the stack necessarily, it could be cross account or cross region based on the imported resource
        const keyPolicyArn = Stack.of(this).formatArn(
          {
            account: this.env.account,
            region: this.env.region,
            service: 'kms',
            resource: 'key',
            resourceName: '*',
          });

        return iam.Grant.addToPrincipal({
          grantee,
          actions,
          resourceArns: [keyPolicyArn],
          conditions: {
            'ForAnyValue:StringEquals': {
              'kms:ResourceAliases': this.aliasName,
            },
          },
        });
      }

      public grantDecrypt(grantee: iam.IGrantable): iam.Grant {
        if (attrs.aliasTargetKey) {
          attrs.aliasTargetKey.grantDecrypt(grantee);
        }

        return this.grant(grantee, ...perms.DECRYPT_ACTIONS);
      }

      public grantEncrypt(grantee: iam.IGrantable): iam.Grant {
        if (attrs.aliasTargetKey) {
          attrs.aliasTargetKey.grantEncrypt(grantee);
        }

        return this.grant(grantee, ...perms.ENCRYPT_ACTIONS);
      }

      public grantEncryptDecrypt(grantee: iam.IGrantable): iam.Grant {
        if (attrs.aliasTargetKey) {
          attrs.aliasTargetKey.grantEncryptDecrypt(grantee);
        }

        return this.grant(grantee, ...[...perms.DECRYPT_ACTIONS, ...perms.ENCRYPT_ACTIONS]);
      }

      public grantGenerateMac(grantee: iam.IGrantable): iam.Grant {
        if (attrs.aliasTargetKey) {
          attrs.aliasTargetKey.grantGenerateMac(grantee);
        }

        return this.grant(grantee, ...perms.GENERATE_HMAC_ACTIONS);
      }

      public grantVerifyMac(grantee: iam.IGrantable): iam.Grant {
        if (attrs.aliasTargetKey) {
          attrs.aliasTargetKey.grantVerifyMac(grantee);
        }

        return this.grant(grantee, ...perms.VERIFY_HMAC_ACTIONS);
      }
    }

    return new Import(scope, id, { environmentFromArn: aliasArn });
  }

  /**
   * Import an existing KMS Alias defined outside the CDK app, by the alias arn. This method should be used
   * instead of 'fromAliasAttributes' when the underlying KMS Key ARN is not available.
   * This Alias will not have a direct reference to the KMS Key, so addAlias and grant* methods are not supported.
   *
   * @param scope The parent creating construct (usually `this`).
   * @param id The construct's name.
   * @param aliasArn The full arn of the KMS Alias (e.g., 'arn:aws:kms:us-west-2:111122223333:alias/myKeyAlias').
   */
  public static fromAliasArn(scope: Construct, id: string, aliasArn: string): IAlias {
    return this.fromAliasAttributes(scope, id, {
      aliasArn,
    });
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
    return this.fromAliasAttributes(scope, id, {
      aliasName: aliasName,
    });
  }

  public readonly aliasName: string;
  public readonly aliasTargetKey: IKey;

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
    } else if (Tokenization.reverseString(aliasName).firstValue && Tokenization.reverseString(aliasName).firstToken === undefined) {
      const valueInToken = Tokenization.reverseString(aliasName).firstValue;

      if (!valueInToken.startsWith(REQUIRED_ALIAS_PREFIX)) {
        aliasName = REQUIRED_ALIAS_PREFIX + aliasName;
      }

      if (valueInToken.toLocaleLowerCase().startsWith(DISALLOWED_PREFIX)) {
        throw new Error(`Alias cannot start with ${DISALLOWED_PREFIX}: ${aliasName}`);
      }

      if (!valueInToken.match(/^[a-zA-Z0-9:/_-]{1,256}$/)) {
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
