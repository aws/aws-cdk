import { PropertyScrutinyType, ResourceScrutinyType } from '@aws-cdk/service-spec-types';
import * as chalk from 'chalk';
import { ISsoInstanceACAConfig, ISsoPermissionSet, SsoAssignment, SsoInstanceACAConfig, SsoPermissionSet } from './iam-identity-center';
import { ManagedPolicyAttachment, ManagedPolicyJson } from './managed-policy';
import { parseLambdaPermission, parseStatements, Statement, StatementJson } from './statement';
import { MaybeParsed } from '../diff/maybe-parsed';
import { PropertyChange, PropertyMap, ResourceChange } from '../diff/types';
import { DiffableCollection } from '../diffable';
import { renderIntrinsics } from '../render-intrinsics';
import { deepRemoveUndefined, dropIfEmpty, flatMap, makeComparator } from '../util';

export interface IamChangesProps {
  propertyChanges: PropertyChange[];
  resourceChanges: ResourceChange[];
}

/**
 * Changes to IAM statements and IAM identity center
 */
export class IamChanges {
  public static IamPropertyScrutinies = [
    PropertyScrutinyType.InlineIdentityPolicies,
    PropertyScrutinyType.InlineResourcePolicy,
    PropertyScrutinyType.ManagedPolicies,
  ];

  public static IamResourceScrutinies = [
    ResourceScrutinyType.ResourcePolicyResource,
    ResourceScrutinyType.IdentityPolicyResource,
    ResourceScrutinyType.LambdaPermission,
    ResourceScrutinyType.SsoAssignmentResource,
    ResourceScrutinyType.SsoInstanceACAConfigResource,
    ResourceScrutinyType.SsoPermissionSet,
  ];

  // each entry in a DiffableCollection is used to generate a single row of the security changes table that is presented for cdk diff and cdk deploy.
  public readonly statements = new DiffableCollection<Statement>();
  public readonly managedPolicies = new DiffableCollection<ManagedPolicyAttachment>();
  public readonly ssoPermissionSets = new DiffableCollection<SsoPermissionSet>();
  public readonly ssoAssignments = new DiffableCollection<SsoAssignment>();
  public readonly ssoInstanceACAConfigs = new DiffableCollection<SsoInstanceACAConfig>();

  constructor(props: IamChangesProps) {
    for (const propertyChange of props.propertyChanges) {
      this.readPropertyChange(propertyChange);
    }
    for (const resourceChange of props.resourceChanges) {
      this.readResourceChange(resourceChange);
    }

    this.statements.calculateDiff();
    this.managedPolicies.calculateDiff();
    this.ssoPermissionSets.calculateDiff();
    this.ssoAssignments.calculateDiff();
    this.ssoInstanceACAConfigs.calculateDiff();
  }

  public get hasChanges() {
    return (this.statements.hasChanges
      || this.managedPolicies.hasChanges
      || this.ssoPermissionSets.hasChanges
      || this.ssoAssignments.hasChanges
      || this.ssoInstanceACAConfigs.hasChanges);
  }

  /**
   * Return whether the changes include broadened permissions
   *
   * Permissions are broadened if positive statements are added or
   * negative statements are removed, or if managed policies are added.
   */
  public get permissionsBroadened(): boolean {
    return this.statements.additions.some(s => !s.isNegativeStatement)
        || this.statements.removals.some(s => s.isNegativeStatement)
        || this.managedPolicies.hasAdditions
        || this.ssoPermissionSets.hasAdditions
        || this.ssoAssignments.hasAdditions
        || this.ssoInstanceACAConfigs.hasAdditions;
  }

  /**
   * Return a summary table of changes
   */
  public summarizeStatements(): string[][] {
    const ret: string[][] = [];

    const header = ['', 'Resource', 'Effect', 'Action', 'Principal', 'Condition'];

    // First generate all lines, then sort on Resource so that similar resources are together
    for (const statement of this.statements.additions) {
      const renderedStatement = statement.render();
      ret.push([
        '+',
        renderedStatement.resource,
        renderedStatement.effect,
        renderedStatement.action,
        renderedStatement.principal,
        renderedStatement.condition,
      ].map(s => chalk.green(s)));
    }
    for (const statement of this.statements.removals) {
      const renderedStatement = statement.render();
      ret.push([
        '-',
        renderedStatement.resource,
        renderedStatement.effect,
        renderedStatement.action,
        renderedStatement.principal,
        renderedStatement.condition,
      ].map(s => chalk.red(s)));
    }

    // Sort by 2nd column
    ret.sort(makeComparator((row: string[]) => [row[1]]));

    ret.splice(0, 0, header);

    return ret;
  }

  public summarizeManagedPolicies(): string[][] {
    const ret: string[][] = [];
    const header = ['', 'Resource', 'Managed Policy ARN'];

    for (const att of this.managedPolicies.additions) {
      ret.push([
        '+',
        att.identityArn,
        att.managedPolicyArn,
      ].map(s => chalk.green(s)));
    }
    for (const att of this.managedPolicies.removals) {
      ret.push([
        '-',
        att.identityArn,
        att.managedPolicyArn,
      ].map(s => chalk.red(s)));
    }

    // Sort by 2nd column
    ret.sort(makeComparator((row: string[]) => [row[1]]));

    ret.splice(0, 0, header);

    return ret;
  }

  public summarizeSsoAssignments(): string[][] {
    const ret: string[][] = [];
    const header = ['', 'Resource', 'InstanceArn', 'PermissionSetArn', 'PrincipalId', 'PrincipalType', 'TargetId', 'TargetType'];

    for (const att of this.ssoAssignments.additions) {
      ret.push([
        '+',
        att.cfnLogicalId || '',
        att.ssoInstanceArn || '',
        att.permissionSetArn || '',
        att.principalId || '',
        att.principalType || '',
        att.targetId || '',
        att.targetType || '',
      ].map(s => chalk.green(s)));
    }
    for (const att of this.ssoAssignments.removals) {
      ret.push([
        '-',
        att.cfnLogicalId || '',
        att.ssoInstanceArn || '',
        att.permissionSetArn || '',
        att.principalId || '',
        att.principalType || '',
        att.targetId || '',
        att.targetType || '',
      ].map(s => chalk.red(s)));
    }

    // Sort by resource name to ensure a unique value is used for sorting
    ret.sort(makeComparator((row: string[]) => [row[1]]));
    ret.splice(0, 0, header);

    return ret;
  }

  public summarizeSsoInstanceACAConfigs(): string[][] {
    const ret: string[][] = [];
    const header = ['', 'Resource', 'InstanceArn', 'AccessControlAttributes'];

    function formatAccessControlAttribute(aca: ISsoInstanceACAConfig.AccessControlAttribute): string {
      return `Key: ${aca?.Key}, Values: [${aca?.Value?.Source.join(', ')}]`;
    }

    for (const att of this.ssoInstanceACAConfigs.additions) {
      ret.push([
        '+',
        att.cfnLogicalId || '',
        att.ssoInstanceArn || '',
        att.accessControlAttributes?.map(formatAccessControlAttribute).join('\n') || '',
      ].map(s => chalk.green(s)));
    }
    for (const att of this.ssoInstanceACAConfigs.removals) {
      ret.push([
        '-',
        att.cfnLogicalId || '',
        att.ssoInstanceArn || '',
        att.accessControlAttributes?.map(formatAccessControlAttribute).join('\n') || '',
      ].map(s => chalk.red(s)));
    }

    // Sort by resource name to ensure a unique value is used for sorting
    ret.sort(makeComparator((row: string[]) => [row[1]]));
    ret.splice(0, 0, header);

    return ret;
  }

  public summarizeSsoPermissionSets(): string[][] {
    const ret: string[][] = [];
    const header = ['', 'Resource', 'InstanceArn', 'PermissionSet name', 'PermissionsBoundary', 'CustomerManagedPolicyReferences'];

    function formatManagedPolicyRef(s: ISsoPermissionSet.CustomerManagedPolicyReference | undefined): string {
      return `Name: ${s?.Name || ''}, Path: ${s?.Path || ''}`;
    }

    function formatSsoPermissionsBoundary(ssoPb: ISsoPermissionSet.PermissionsBoundary | undefined): string {
      // ManagedPolicyArn OR CustomerManagedPolicyReference can be specified -- but not both.
      if (ssoPb?.ManagedPolicyArn !== undefined) {
        return `ManagedPolicyArn: ${ssoPb?.ManagedPolicyArn || ''}`;
      } else if (ssoPb?.CustomerManagedPolicyReference !== undefined) {
        return `CustomerManagedPolicyReference: {\n  ${formatManagedPolicyRef(ssoPb?.CustomerManagedPolicyReference)}\n}`;
      } else {
        return '';
      }
    }

    for (const att of this.ssoPermissionSets.additions) {
      ret.push([
        '+',
        att.cfnLogicalId || '',
        att.ssoInstanceArn || '',
        att.name || '',
        formatSsoPermissionsBoundary(att.ssoPermissionsBoundary),
        att.ssoCustomerManagedPolicyReferences?.map(formatManagedPolicyRef).join('\n') || '',
      ].map(s => chalk.green(s)));
    }
    for (const att of this.ssoPermissionSets.removals) {
      ret.push([
        '-',
        att.cfnLogicalId || '',
        att.ssoInstanceArn || '',
        att.name || '',
        formatSsoPermissionsBoundary(att.ssoPermissionsBoundary),
        att.ssoCustomerManagedPolicyReferences?.map(formatManagedPolicyRef).join('\n') || '',
      ].map(s => chalk.red(s)));
    }

    // Sort by resource name to ensure a unique value is used for sorting
    ret.sort(makeComparator((row: string[]) => [row[1]]));
    ret.splice(0, 0, header);

    return ret;
  }

  /**
   * Return a machine-readable version of the changes.
   * This is only used in tests.
   *
   * @internal
   */
  public _toJson(): IamChangesJson {
    return deepRemoveUndefined({
      statementAdditions: dropIfEmpty(this.statements.additions.map(s => s._toJson())),
      statementRemovals: dropIfEmpty(this.statements.removals.map(s => s._toJson())),
      managedPolicyAdditions: dropIfEmpty(this.managedPolicies.additions.map(s => s._toJson())),
      managedPolicyRemovals: dropIfEmpty(this.managedPolicies.removals.map(s => s._toJson())),
    });
  }

  private readPropertyChange(propertyChange: PropertyChange) {
    switch (propertyChange.scrutinyType) {
      case PropertyScrutinyType.InlineIdentityPolicies:
        // AWS::IAM::{ Role | User | Group }.Policies
        this.statements.addOld(...this.readIdentityPolicies(propertyChange.oldValue, propertyChange.resourceLogicalId));
        this.statements.addNew(...this.readIdentityPolicies(propertyChange.newValue, propertyChange.resourceLogicalId));
        break;
      case PropertyScrutinyType.InlineResourcePolicy:
        // Any PolicyDocument on a resource (including AssumeRolePolicyDocument)
        this.statements.addOld(...this.readResourceStatements(propertyChange.oldValue, propertyChange.resourceLogicalId));
        this.statements.addNew(...this.readResourceStatements(propertyChange.newValue, propertyChange.resourceLogicalId));
        break;
      case PropertyScrutinyType.ManagedPolicies:
        // Just a list of managed policies
        this.managedPolicies.addOld(...this.readManagedPolicies(propertyChange.oldValue, propertyChange.resourceLogicalId));
        this.managedPolicies.addNew(...this.readManagedPolicies(propertyChange.newValue, propertyChange.resourceLogicalId));
        break;
    }
  }

  private readResourceChange(resourceChange: ResourceChange) {
    switch (resourceChange.scrutinyType) {
      case ResourceScrutinyType.IdentityPolicyResource:
        // AWS::IAM::Policy
        this.statements.addOld(...this.readIdentityPolicyResource(resourceChange.oldProperties));
        this.statements.addNew(...this.readIdentityPolicyResource(resourceChange.newProperties));
        break;
      case ResourceScrutinyType.ResourcePolicyResource:
        // AWS::*::{Bucket,Queue,Topic}Policy
        this.statements.addOld(...this.readResourcePolicyResource(resourceChange.oldProperties));
        this.statements.addNew(...this.readResourcePolicyResource(resourceChange.newProperties));
        break;
      case ResourceScrutinyType.LambdaPermission:
        this.statements.addOld(...this.readLambdaStatements(resourceChange.oldProperties));
        this.statements.addNew(...this.readLambdaStatements(resourceChange.newProperties));
        break;
      case ResourceScrutinyType.SsoPermissionSet:
        this.ssoPermissionSets.addOld(...this.readSsoPermissionSet(resourceChange.oldProperties, resourceChange.resourceLogicalId));
        this.ssoPermissionSets.addNew(...this.readSsoPermissionSet(resourceChange.newProperties, resourceChange.resourceLogicalId));
        break;
      case ResourceScrutinyType.SsoAssignmentResource:
        this.ssoAssignments.addOld(...this.readSsoAssignments(resourceChange.oldProperties, resourceChange.resourceLogicalId));
        this.ssoAssignments.addNew(...this.readSsoAssignments(resourceChange.newProperties, resourceChange.resourceLogicalId));
        break;
      case ResourceScrutinyType.SsoInstanceACAConfigResource:
        this.ssoInstanceACAConfigs.addOld(...this.readSsoInstanceACAConfigs(resourceChange.oldProperties, resourceChange.resourceLogicalId));
        this.ssoInstanceACAConfigs.addNew(...this.readSsoInstanceACAConfigs(resourceChange.newProperties, resourceChange.resourceLogicalId));
        break;
    }
  }

  /**
   * Parse a list of policies on an identity
   */
  private readIdentityPolicies(policies: any, logicalId: string): Statement[] {
    if (policies === undefined || !Array.isArray(policies)) { return []; }

    const appliesToPrincipal = 'AWS:${' + logicalId + '}';

    return flatMap(policies, (policy: any) => {
      // check if the Policy itself is not an intrinsic, like an Fn::If
      const unparsedStatement = policy.PolicyDocument?.Statement
        ? policy.PolicyDocument.Statement
        : policy;
      return defaultPrincipal(appliesToPrincipal, parseStatements(renderIntrinsics(unparsedStatement)));
    });
  }

  /**
   * Parse an IAM::Policy resource
   */
  private readIdentityPolicyResource(properties: any): Statement[] {
    if (properties === undefined) { return []; }

    properties = renderIntrinsics(properties);

    const principals = (properties.Groups || []).concat(properties.Users || []).concat(properties.Roles || []);
    return flatMap(principals, (principal: string) => {
      const ref = 'AWS:' + principal;
      return defaultPrincipal(ref, parseStatements(properties.PolicyDocument.Statement));
    });
  }

  private readSsoInstanceACAConfigs(properties: any, logicalId: string): SsoInstanceACAConfig[] {
    if (properties === undefined) { return []; }

    properties = renderIntrinsics(properties);

    return [new SsoInstanceACAConfig({
      cfnLogicalId: '${' + logicalId + '}',
      ssoInstanceArn: properties.InstanceArn,
      accessControlAttributes: properties.AccessControlAttributes,
    })];
  }

  private readSsoAssignments(properties: any, logicalId: string): SsoAssignment[] {
    if (properties === undefined) { return []; }

    properties = renderIntrinsics(properties);

    return [new SsoAssignment({
      cfnLogicalId: '${' + logicalId + '}',
      ssoInstanceArn: properties.InstanceArn,
      permissionSetArn: properties.PermissionSetArn,
      principalId: properties.PrincipalId,
      principalType: properties.PrincipalType,
      targetId: properties.TargetId,
      targetType: properties.TargetType,
    })];
  }

  private readSsoPermissionSet(properties: any, logicalId: string): SsoPermissionSet[] {
    if (properties === undefined) { return []; }

    properties = renderIntrinsics(properties);

    return [new SsoPermissionSet({
      cfnLogicalId: '${' + logicalId + '}',
      name: properties.Name,
      ssoInstanceArn: properties.InstanceArn,
      ssoCustomerManagedPolicyReferences: properties.CustomerManagedPolicyReferences,
      ssoPermissionsBoundary: properties.PermissionsBoundary,
    })];
  }

  private readResourceStatements(policy: any, logicalId: string): Statement[] {
    if (policy === undefined) { return []; }

    const appliesToResource = '${' + logicalId + '.Arn}';
    return defaultResource(appliesToResource, parseStatements(renderIntrinsics(policy.Statement)));
  }

  /**
   * Parse an AWS::*::{Bucket,Topic,Queue}policy
   */
  private readResourcePolicyResource(properties: any): Statement[] {
    if (properties === undefined) { return []; }

    properties = renderIntrinsics(properties);

    const policyKeys = Object.keys(properties).filter(key => key.indexOf('Policy') > -1);

    // Find the key that identifies the resource(s) this policy applies to
    const resourceKeys = Object.keys(properties).filter(key => !policyKeys.includes(key) && !key.endsWith('Name'));
    let resources = resourceKeys.length === 1 ? properties[resourceKeys[0]] : ['???'];

    // For some resources, this is a singleton string, for some it's an array
    if (!Array.isArray(resources)) {
      resources = [resources];
    }

    return flatMap(resources, (resource: string) => {
      return defaultResource(resource, parseStatements(properties[policyKeys[0]].Statement));
    });
  }

  private readManagedPolicies(policyArns: any, logicalId: string): ManagedPolicyAttachment[] {
    if (!policyArns) { return []; }

    const rep = '${' + logicalId + '}';
    return ManagedPolicyAttachment.parseManagedPolicies(rep, renderIntrinsics(policyArns));
  }

  private readLambdaStatements(properties?: PropertyMap): Statement[] {
    if (!properties) { return []; }

    return [parseLambdaPermission(renderIntrinsics(properties))];
  }
}

/**
 * Set an undefined or wildcarded principal on these statements
 */
function defaultPrincipal(principal: string, statements: Statement[]) {
  statements.forEach(s => s.principals.replaceEmpty(principal));
  statements.forEach(s => s.principals.replaceStar(principal));
  return statements;
}

/**
 * Set an undefined or wildcarded resource on these statements
 */
function defaultResource(resource: string, statements: Statement[]) {
  statements.forEach(s => s.resources.replaceEmpty(resource));
  statements.forEach(s => s.resources.replaceStar(resource));
  return statements;
}

export interface IamChangesJson {
  statementAdditions?: Array<MaybeParsed<StatementJson>>;
  statementRemovals?: Array<MaybeParsed<StatementJson>>;
  managedPolicyAdditions?: Array<MaybeParsed<ManagedPolicyJson>>;
  managedPolicyRemovals?: Array<MaybeParsed<ManagedPolicyJson>>;
}
