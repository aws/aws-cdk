import type { IConstruct } from 'constructs';
import { CfnKey } from './kms.generated';
import * as perms from './private/perms';
import type {
  AddToResourcePolicyResult,
  IGrantable,
  IResourceWithPolicyV2,
  PolicyStatement,
  IResourcePolicyFactory,
} from '../../aws-iam';
import * as iam from '../../aws-iam';
import { DefaultPolicyFactories } from '../../aws-iam';
import type { ResourceEnvironment } from '../../core';
import { Token, FeatureFlags, Stack, ValidationError } from '../../core';
import * as cxapi from '../../cx-api';
import type { IKeyRef } from '../../interfaces/generated/aws-kms-interfaces.generated';

interface KeyGrantsProps {
  readonly resource: IKeyRef;
  readonly trustAccountIdentities?: boolean;
}

/**
 * Collection of grant methods for an IKey
 */
export class KeyGrants {
  /**
   * Creates grants for an IKeyRef
   */
  public static fromKey(resource: IKeyRef, trustAccountIdentities?: boolean): KeyGrants {
    return new KeyGrants({ resource, trustAccountIdentities });
  }

  protected readonly resource: IKeyRef;
  private readonly trustAccountIdentities?: boolean;
  private readonly policyResource?: iam.IResourceWithPolicyV2;

  private constructor(props: KeyGrantsProps) {
    this.resource = props.resource;
    this.trustAccountIdentities = props.trustAccountIdentities ?? FeatureFlags.of(this.resource).isEnabled(cxapi.KMS_DEFAULT_KEY_POLICIES);
    this.policyResource = iam.ResourceWithPolicies.of(this.resource);
  }

  /**
   * Grant the indicated permissions on this key to the given principal
   *
   * This modifies both the principal's policy as well as the resource policy,
   * since the default CloudFormation setup for KMS keys is that the policy
   * must not be empty and so default grants won't work.
   *
   */
  public actions(grantee: iam.IGrantable, ...actions: string[]): iam.Grant {
    const granteeStackDependsOnKeyStack = this.granteeStackDependsOnKeyStack(grantee);
    const principal = granteeStackDependsOnKeyStack
      ? new iam.AccountPrincipal(granteeStackDependsOnKeyStack)
      : grantee.grantPrincipal;

    const crossAccountAccess = this.isGranteeFromAnotherAccount(grantee);
    const crossRegionAccess = this.isGranteeFromAnotherRegion(grantee);
    const crossEnvironment = crossAccountAccess || crossRegionAccess;

    if (!this.policyResource) {
      return iam.Grant.addToPrincipal({
        actions: actions,
        grantee: grantee,
        resourceArns: [this.resource.keyRef.keyArn],
      });
    } else {
      const grantOptions: iam.GrantWithResourceOptions = {
        grantee,
        actions,
        resource: this.policyResource,
        resourceArns: [this.resource.keyRef.keyArn],
        resourceSelfArns: crossEnvironment ? undefined : ['*'],
      };

      // For L1s, we always add the statement to the resource policy because we cannot automatically
      // detect whether the key already has a policy for trusting account identities. And we can't
      // expect users to pass the correct value for `trustAccountIdentities` prop when creating the
      // KeyGrants instance for an L1.
      if (!CfnKey.isCfnKey(this.resource) && this.trustAccountIdentities && !crossEnvironment) {
        return iam.Grant.addToPrincipalOrResource(grantOptions);
      } else {
        return iam.Grant.addToPrincipalAndResource({
          ...grantOptions,
          resourceArns: crossEnvironment ? ['*'] : [this.resource.keyRef.keyArn],
          resourcePolicyPrincipal: principal,
        });
      }
    }
  }

  /**
   * Grant decryption permissions using this key to the given principal
   *
   */
  public decrypt(grantee: IGrantable): iam.Grant {
    return this.actions(grantee, ...perms.DECRYPT_ACTIONS);
  }

  /**
   * Grant encryption permissions using this key to the given principal
   *
   */
  public encrypt(grantee: IGrantable): iam.Grant {
    return this.actions(grantee, ...perms.ENCRYPT_ACTIONS);
  }

  /**
   * Grant encryption and decryption permissions using this key to the given principal
   *
   */
  public encryptDecrypt(grantee: IGrantable): iam.Grant {
    return this.actions(grantee, ...[...perms.DECRYPT_ACTIONS, ...perms.ENCRYPT_ACTIONS]);
  }

  /**
   * Grant sign permissions using this key to the given principal
   *
   */
  public sign(grantee: IGrantable): iam.Grant {
    return this.actions(grantee, ...perms.SIGN_ACTIONS);
  }

  /**
   * Grant verify permissions using this key to the given principal
   *
   */
  public verify(grantee: IGrantable): iam.Grant {
    return this.actions(grantee, ...perms.VERIFY_ACTIONS);
  }

  /**
   * Grant sign and verify permissions using this key to the given principal
   *
   */
  public signVerify(grantee: IGrantable): iam.Grant {
    return this.actions(grantee, ...[...perms.SIGN_ACTIONS, ...perms.VERIFY_ACTIONS]);
  }

  /**
   * Grant permissions to generating MACs to the given principal
   *
   */
  public generateMac(grantee: IGrantable): iam.Grant {
    return this.actions(grantee, ...perms.GENERATE_HMAC_ACTIONS);
  }

  /**
   * Grant permissions to verifying MACs to the given principal
   *
   */
  public verifyMac(grantee: IGrantable): iam.Grant {
    return this.actions(grantee, ...perms.VERIFY_HMAC_ACTIONS);
  }

  private granteeStackDependsOnKeyStack(grantee: iam.IGrantable): string | undefined {
    const grantPrincipal = grantee.grantPrincipal;
    if (!iam.principalIsOwnedResource(grantPrincipal)) {
      return undefined;
    }
    const keyStack = Stack.of(this.resource);
    const granteeStack = Stack.of(grantPrincipal);
    if (keyStack === granteeStack) { return undefined; }

    return granteeStack.dependencies.includes(keyStack) ? granteeStack.account : undefined;
  }

  private isGranteeFromAnotherRegion(grantee: iam.IGrantable): boolean {
    if (!iam.principalIsOwnedResource(grantee.grantPrincipal)) { return false; }
    const keyStack = Stack.of(this.resource);
    const identityStack = Stack.of(grantee.grantPrincipal);

    if (FeatureFlags.of(this.resource).isEnabled(cxapi.KMS_REDUCE_CROSS_ACCOUNT_REGION_POLICY_SCOPE)) {
      return keyStack.region !== identityStack.region && this.resource.env.region !== identityStack.region;
    }
    return keyStack.region !== identityStack.region;
  }

  private isGranteeFromAnotherAccount(grantee: iam.IGrantable): boolean {
    if (!iam.principalIsOwnedResource(grantee.grantPrincipal)) { return false; }
    const keyStack = Stack.of(this.resource);
    const identityStack = Stack.of(grantee.grantPrincipal);

    if (FeatureFlags.of(this.resource).isEnabled(cxapi.KMS_REDUCE_CROSS_ACCOUNT_REGION_POLICY_SCOPE)) {
      return keyStack.account !== identityStack.account && this.resource.env.account !== identityStack.account;
    }
    return keyStack.account !== identityStack.account;
  }
}

export class KeyWithPolicyFactory implements IResourcePolicyFactory {
  static {
    DefaultPolicyFactories.set('AWS::KMS::Key', new KeyWithPolicyFactory());
  }

  public fromConstruct(resource: IConstruct): IResourceWithPolicyV2 {
    if (!CfnKey.isCfnKey(resource)) {
      throw new ValidationError(`Construct ${resource.node.path} is not of type CfnKey`, resource);
    }

    return new CfnKeyWithPolicy(resource);
  }
}

class CfnKeyWithPolicy implements IResourceWithPolicyV2 {
  public readonly env: ResourceEnvironment;
  private policyDocument?: iam.PolicyDocument;

  constructor(private readonly key: CfnKey) {
    this.env = key.env;
  }

  public addToResourcePolicy(statement: PolicyStatement): AddToResourcePolicyResult {
    if (Token.isResolved(this.key.keyPolicy)) {
      if (this.policyDocument == null) {
        this.policyDocument = iam.PolicyDocument.fromJson(this.key.keyPolicy ?? { Statement: [] });
      }

      this.policyDocument.addStatements(statement);
      this.key.keyPolicy = this.policyDocument.toJSON();

      return { statementAdded: true, policyDependable: this.policyDocument };
    }
    return { statementAdded: false };
  }
}
