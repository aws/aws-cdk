import { IResource, Lazy, Resource, Stack } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { IAccount } from './account';
import { IOrganizationRoot } from './organization-root';
import { IOrganizationalUnit } from './organizational-unit';
import { CfnPolicy } from './organizations.generated';

export interface IPolicy extends IResource{
  readonly policyName: string;
  readonly policyId: string;
  readonly policyArn: string;
  readonly awsManaged: boolean;
}

export interface PolicyOptions {
  readonly policyName: string;
  readonly description: string;
}

abstract class PolicyBase extends Resource implements IPolicy {
  readonly abstract policyName: string;
  readonly abstract policyId: string;
  readonly abstract policyArn: string;
  readonly abstract awsManaged: boolean;
}

export interface PolicyProps extends PolicyOptions {
  readonly policyType: PolicyType;
  readonly content: { [key: string]: any };
  readonly targets?: PolicyAttachmentTarget[];
}

export interface PolicyAttributes {
  readonly policyName: string;
  readonly policyId: string;
  readonly policyArn: string;
  readonly awsManaged: boolean;
}

export class Policy extends PolicyBase {
  public static fromPolicyAttributes(scope: Construct, id: string, attrs: PolicyAttributes): IPolicy {
    class Import extends PolicyBase {
      readonly policyName: string = attrs.policyName;
      readonly policyId: string = attrs.policyId;
      readonly policyArn: string = attrs.policyArn;
      readonly awsManaged: boolean=attrs.awsManaged;
    }

    return new Import(scope, id);
  }

  public readonly policyName: string;
  public readonly policyId: string;
  public readonly policyArn: string;
  public readonly awsManaged: boolean;

  private targets: PolicyAttachmentTarget[];

  public constructor(scope: Construct, id: string, props: PolicyProps) {
    super(scope, id);

    this.targets = props.targets ?? [];

    const resource = new CfnPolicy(this, 'Resource', {
      name: props.policyName,
      description: props.description,
      content: Lazy.uncachedString({ produce: () => Stack.of(this).toJsonString(props.content) }),
      targetIds: Lazy.uncachedList({ produce: () => this.targets.map((target) => target.targetId) }),
      type: props.policyType,
    });

    this.policyName = props.policyName;
    this.policyId = resource.ref;
    this.policyArn = resource.attrArn;
    this.awsManaged = resource.attrAwsManaged as unknown as boolean;
  }
}

export class PolicyAttachmentTarget {
  public static ofAccount(account: IAccount) : PolicyAttachmentTarget {
    return new PolicyAttachmentTarget(account.accountId);
  }
  public static ofOrganizationalRoot(organizationRoot: IOrganizationRoot) : PolicyAttachmentTarget {
    return new PolicyAttachmentTarget(organizationRoot.organizationRootId);
  }
  public static ofOrganizationalUnit(organizationalUnit: IOrganizationalUnit) : PolicyAttachmentTarget {
    return new PolicyAttachmentTarget(organizationalUnit.organizationalUnitId);
  }

  public readonly targetId: string;

  private constructor(targetId: string) {
    this.targetId = targetId;
  }
}

export enum PolicyType {
  SERVICE_CONTROL_POLICY = 'SERVICE_CONTROL_POLICY',
  TAG_POLICY = 'TAG_POLICY',
  BACKUP_POLICY = 'BACKUP_POLICY',
  AISERVICES_OPT_OUT_POLICY = 'AISERVICES_OPT_OUT_POLICY',
}