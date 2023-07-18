import * as cfnspec from '@aws-cdk/cfnspec';
import * as chalk from 'chalk';
import { ManagedPolicyAttachment, ManagedPolicyJson } from './managed-policy';
import { parseLambdaPermission, parseStatements, Statement, StatementJson } from './statement';
import { PropertyChange, PropertyMap, ResourceChange } from '../diff/types';
import { DiffableCollection } from '../diffable';
import { renderIntrinsics } from '../render-intrinsics';
import { deepRemoveUndefined, dropIfEmpty, flatMap, makeComparator } from '../util';

export interface IamChangesProps {
  propertyChanges: PropertyChange[];
  resourceChanges: ResourceChange[];
}

/**
 * Changes to IAM statements
 */
export class IamChanges {
  public static IamPropertyScrutinies = [
    cfnspec.schema.PropertyScrutinyType.InlineIdentityPolicies,
    cfnspec.schema.PropertyScrutinyType.InlineResourcePolicy,
    cfnspec.schema.PropertyScrutinyType.ManagedPolicies,
  ];

  public static IamResourceScrutinies = [
    cfnspec.schema.ResourceScrutinyType.ResourcePolicyResource,
    cfnspec.schema.ResourceScrutinyType.IdentityPolicyResource,
    cfnspec.schema.ResourceScrutinyType.LambdaPermission,
  ];

  public readonly statements = new DiffableCollection<Statement>();
  public readonly managedPolicies = new DiffableCollection<ManagedPolicyAttachment>();

  constructor(props: IamChangesProps) {
    for (const propertyChange of props.propertyChanges) {
      this.readPropertyChange(propertyChange);
    }
    for (const resourceChange of props.resourceChanges) {
      this.readResourceChange(resourceChange);
    }

    this.statements.calculateDiff();
    this.managedPolicies.calculateDiff();
  }

  public get hasChanges() {
    return this.statements.hasChanges || this.managedPolicies.hasChanges;
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
        || this.managedPolicies.hasAdditions;
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
        chalk.red('-'),
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
      case cfnspec.schema.PropertyScrutinyType.InlineIdentityPolicies:
        // AWS::IAM::{ Role | User | Group }.Policies
        this.statements.addOld(...this.readIdentityPolicies(propertyChange.oldValue, propertyChange.resourceLogicalId));
        this.statements.addNew(...this.readIdentityPolicies(propertyChange.newValue, propertyChange.resourceLogicalId));
        break;
      case cfnspec.schema.PropertyScrutinyType.InlineResourcePolicy:
        // Any PolicyDocument on a resource (including AssumeRolePolicyDocument)
        this.statements.addOld(...this.readResourceStatements(propertyChange.oldValue, propertyChange.resourceLogicalId));
        this.statements.addNew(...this.readResourceStatements(propertyChange.newValue, propertyChange.resourceLogicalId));
        break;
      case cfnspec.schema.PropertyScrutinyType.ManagedPolicies:
        // Just a list of managed policies
        this.managedPolicies.addOld(...this.readManagedPolicies(propertyChange.oldValue, propertyChange.resourceLogicalId));
        this.managedPolicies.addNew(...this.readManagedPolicies(propertyChange.newValue, propertyChange.resourceLogicalId));
        break;
    }
  }

  private readResourceChange(resourceChange: ResourceChange) {
    switch (resourceChange.scrutinyType) {
      case cfnspec.schema.ResourceScrutinyType.IdentityPolicyResource:
        // AWS::IAM::Policy
        this.statements.addOld(...this.readIdentityPolicyResource(resourceChange.oldProperties));
        this.statements.addNew(...this.readIdentityPolicyResource(resourceChange.newProperties));
        break;
      case cfnspec.schema.ResourceScrutinyType.ResourcePolicyResource:
        // AWS::*::{Bucket,Queue,Topic}Policy
        this.statements.addOld(...this.readResourcePolicyResource(resourceChange.oldProperties));
        this.statements.addNew(...this.readResourcePolicyResource(resourceChange.newProperties));
        break;
      case cfnspec.schema.ResourceScrutinyType.LambdaPermission:
        this.statements.addOld(...this.readLambdaStatements(resourceChange.oldProperties));
        this.statements.addNew(...this.readLambdaStatements(resourceChange.newProperties));
        break;
    }
  }

  /**
   * Parse a list of policies on an identity
   */
  private readIdentityPolicies(policies: any, logicalId: string): Statement[] {
    if (policies === undefined) { return []; }

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
  statementAdditions?: StatementJson[];
  statementRemovals?: StatementJson[];
  managedPolicyAdditions?: ManagedPolicyJson[];
  managedPolicyRemovals?: ManagedPolicyJson[];
}
