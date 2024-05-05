// namespace object imports won't work in the bundle for function exports
// eslint-disable-next-line @typescript-eslint/no-require-imports
const deepEqual = require('fast-deep-equal');

/**
 * This namespace should be a subset of the L1 CfnPermissionSet, other than
 * capitalization, since the values come from from a parsed CFN template.
 */
export namespace ISsoPermissionSet {
  export interface Props {
    readonly name: string | undefined;
    readonly cfnLogicalId: string | undefined;
    readonly ssoInstanceArn: string | undefined;
    readonly ssoPermissionsBoundary: ISsoPermissionSet.PermissionsBoundary | undefined;
    readonly ssoCustomerManagedPolicyReferences: ISsoPermissionSet.CustomerManagedPolicyReference[] | undefined;
  }
  export interface PermissionsBoundary {
    readonly CustomerManagedPolicyReference?: CustomerManagedPolicyReference;
    readonly ManagedPolicyArn?: string;
  }
  export interface CustomerManagedPolicyReference {
    readonly Name: string | undefined;
    readonly Path: string | undefined;
  }
}

export class SsoPermissionSet implements ISsoPermissionSet.Props {
  public readonly name: string | undefined;
  public readonly cfnLogicalId: string | undefined;
  public readonly ssoInstanceArn: string | undefined;
  public readonly ssoPermissionsBoundary: ISsoPermissionSet.PermissionsBoundary | undefined;
  public readonly ssoCustomerManagedPolicyReferences: ISsoPermissionSet.CustomerManagedPolicyReference[] | undefined;

  constructor(props: ISsoPermissionSet.Props) {
    this.cfnLogicalId = props.cfnLogicalId;
    this.name = props.name;
    this.ssoInstanceArn = props.ssoInstanceArn;
    this.ssoPermissionsBoundary = props.ssoPermissionsBoundary;
    this.ssoCustomerManagedPolicyReferences = props.ssoCustomerManagedPolicyReferences;
  }

  public equal(other: SsoPermissionSet): boolean {
    return deepEqual(this, other);
  }
}

export namespace ISsoAssignment {
  export interface Props {
    readonly ssoInstanceArn: string | undefined;
    readonly cfnLogicalId: string | undefined;
    readonly permissionSetArn: string | undefined;
    readonly principalId: string | undefined;
    readonly principalType: string | undefined;
    readonly targetId: string | undefined;
    readonly targetType: string | undefined;
  }
}

export class SsoAssignment implements ISsoAssignment.Props {
  public readonly cfnLogicalId: string | undefined;
  public readonly ssoInstanceArn: string | undefined;
  public readonly permissionSetArn: string | undefined;
  public readonly principalId: string | undefined;
  public readonly principalType: string | undefined;
  public readonly targetId: string | undefined;
  public readonly targetType: string | undefined;

  constructor(props: ISsoAssignment.Props) {
    this.cfnLogicalId = props.cfnLogicalId;
    this.ssoInstanceArn = props.ssoInstanceArn;
    this.permissionSetArn = props.permissionSetArn;
    this.principalId = props.principalId;
    this.principalType = props.principalType;
    this.targetId = props.targetId;
    this.targetType = props.targetType;
  }

  public equal(other: SsoAssignment): boolean {
    return deepEqual(this, other);
  }
}

/**
 * AWS::SSO::InstanceAccessControlAttributeConfiguration
 */
export interface ISsoInstanceACAConfigProps {
  ssoInstanceArn: string;
}

export namespace ISsoInstanceACAConfig {
  export type AccessControlAttribute = {
    Key: string | undefined;
    Value: { Source: string[] } | undefined;
  } | undefined;

  export interface Props {
    readonly ssoInstanceArn: string | undefined;
    readonly cfnLogicalId: string | undefined;
    readonly accessControlAttributes?: AccessControlAttribute[] | undefined;
  }
}

export class SsoInstanceACAConfig implements ISsoInstanceACAConfig.Props {
  public readonly cfnLogicalId: string | undefined;
  public readonly ssoInstanceArn: string | undefined;
  public readonly accessControlAttributes?: ISsoInstanceACAConfig.AccessControlAttribute[] | undefined;

  constructor(props: ISsoInstanceACAConfig.Props) {
    this.cfnLogicalId = props.cfnLogicalId;
    this.ssoInstanceArn = props.ssoInstanceArn;
    this.accessControlAttributes = props.accessControlAttributes;
  }

  public equal(other: SsoInstanceACAConfig): boolean {
    return deepEqual(this, other);
  }
}
