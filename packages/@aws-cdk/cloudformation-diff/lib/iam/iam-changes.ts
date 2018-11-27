import colors = require('colors/safe');
import { PropertyChange, PropertyMap, ResourceChange } from "../diff/types";
import { ManagedPolicyAttachment, parseManagedPolicies } from './managed-policy';
import { parseLambdaPermission, parseStatements, Statement, Targets } from "./statement";
import { unCloudFormation } from "./uncfn";

export interface IamChangesProps {
  identityPolicyChanges: PropertyChange[];
  resourcePolicyChanges: PropertyChange[];
  lambdaPermissionChanges: ResourceChange[];
  managedPolicyChanges: PropertyChange[];
}

/**
 * Changes to IAM statements
 */
export class IamChanges {
  public readonly statementAdditions: Statement[] = [];
  public readonly statementRemovals: Statement[] = [];
  public readonly managedPolicyAdditions: ManagedPolicyAttachment[] = [];
  public readonly managedPolicyRemovals: ManagedPolicyAttachment[] = [];

  private oldStatements: Statement[] = [];
  private newStatements: Statement[] = [];
  private oldPolicyAttachments: ManagedPolicyAttachment[] = [];
  private newPolicyAttachments: ManagedPolicyAttachment[] = [];

  constructor(props: IamChangesProps) {
    for (const policyChange of props.identityPolicyChanges) {
      this.oldStatements.push(...this.readIdentityStatements(policyChange.oldValue, policyChange.propertyName, policyChange.resourceLogicalId));
      this.newStatements.push(...this.readIdentityStatements(policyChange.newValue, policyChange.propertyName, policyChange.resourceLogicalId));
    }
    for (const policyChange of props.resourcePolicyChanges) {
      this.oldStatements.push(...this.readResourceStatements(policyChange.oldValue, policyChange.resourceLogicalId));
      this.newStatements.push(...this.readResourceStatements(policyChange.newValue, policyChange.resourceLogicalId));
    }
    for (const lambdaChange of props.lambdaPermissionChanges) {
      this.oldStatements.push(...this.readLambdaStatements(lambdaChange.oldProperties));
      this.newStatements.push(...this.readLambdaStatements(lambdaChange.newProperties));
    }
    for (const managedPolicyChange of props.managedPolicyChanges) {
      this.oldPolicyAttachments.push(...this.readManagedPolicies(managedPolicyChange.oldValue, managedPolicyChange.resourceLogicalId));
      this.newPolicyAttachments.push(...this.readManagedPolicies(managedPolicyChange.newValue, managedPolicyChange.resourceLogicalId));
    }

    this.statementAdditions.push(...difference(this.newStatements, this.oldStatements));
    this.statementRemovals.push(...difference(this.oldStatements, this.newStatements));

    this.managedPolicyAdditions.push(...difference(this.newPolicyAttachments, this.oldPolicyAttachments));
    this.managedPolicyAdditions.push(...difference(this.oldPolicyAttachments, this.newPolicyAttachments));
  }

  public get hasChanges() {
    return this.hasManagedPolicyChanges || this.hasStatementChanges;
  }

  public get hasStatementChanges() {
    return this.statementAdditions.length + this.statementRemovals.length > 0;
  }

  public get hasStatementAdditions() {
    return this.statementAdditions.length > 0;
  }

  public get hasStatementRemovals() {
    return this.statementRemovals.length > 0;
  }

  public get hasManagedPolicyChanges() {
    return this.managedPolicyAdditions.length + this.managedPolicyRemovals.length > 0;
  }

  public get hasManagedPolicyAdditions() {
    return this.managedPolicyAdditions.length > 0;
  }

  public get hasManagedPolicyRemovals() {
    return this.managedPolicyRemovals.length > 0;
  }

  /**
   * Return a summary table of changes
   */
  public summarizeStatements(): string[][] {
    const ret: string[][] = [];

    const header = ['', 'Resource', 'Effect', 'Action', 'Principal', 'Condition'];

    // First generate all lines, then sort on Resource so that similar resources are together
    for (const statement of this.statementAdditions) {
      ret.push([
        '+',
        renderTargets(statement.resources),
        statement.effect,
        renderTargets(statement.actions),
        renderTargets(statement.principals),
        renderCondition(statement.condition)
      ].map(s => colors.green(s)));
    }
    for (const statement of this.statementRemovals) {
      ret.push([
        colors.red('-'),
        renderTargets(statement.resources),
        statement.effect,
        renderTargets(statement.actions),
        renderTargets(statement.principals),
        renderCondition(statement.condition)
      ].map(s => colors.red(s)));
    }

    // Sort by 2nd column
    ret.sort(makeComparator((row: string[]) => row[1]));

    ret.splice(0, 0, header);

    return ret;
  }

  public summarizeManagedPolicies(): string[][] {
    const ret: string[][] = [];
    const header = ['', 'Resource', 'Managed Policy ARN'];

    for (const att of this.managedPolicyAdditions) {
      ret.push([
        '+',
        att.identityArn,
        att.managedPolicyArn,
      ].map(s => colors.green(s)));
    }
    for (const att of this.managedPolicyRemovals) {
      ret.push([
        '-',
        att.identityArn,
        att.managedPolicyArn,
      ].map(s => colors.red(s)));
    }

    // Sort by 2nd column
    ret.sort(makeComparator((row: string[]) => row[1]));

    ret.splice(0, 0, header);

    return ret;
  }

  private readIdentityStatements(policy: any, propertyName: string, logicalId: string): Statement[] {
    if (!policy) { return []; }

    // Stringify CloudFormation intrinsics so that the IAM parser has an easier domain to work in,
    // then parse.
    const statements = parseStatements(unCloudFormation(policy.Statement));

    // If this is an assumeRolePolicy and the Resource list is empty, add in the logicalId into Resources,
    // because that's what this statement is applying to.
    if (propertyName === 'AssumeRolePolicyDocument') {
      const rep = '${' + logicalId + '.Arn}';
      statements.forEach(s => s.resources.replaceEmpty(rep));
    }

    return statements;
  }

  private readResourceStatements(policy: any, logicalId: string): Statement[] {
    // Stringify CloudFormation intrinsics so that the IAM parser has an easier domain to work in,
    // then parse.
    const statements = parseStatements(unCloudFormation(policy.Statement));

    // Since this is a ResourcePolicy, the meaning of the '*' in a Resource field
    // actually scoped to the resource it's on, so replace * resources with what
    // they're scoped to.
    //
    // We replace with the ARN of the resource, exemplified by a "GetAtt"
    // expression. This might not strictly work in CFN for all resource types
    // (because {X.Arn} might not exist, or it might have to be {Ref}), and for
    // example for Buckets a * implies both the bucket and the resources in the
    // bucket, but for human consumpion this is sufficient to be intelligible.
    const rep = '${' + logicalId + '.Arn}';
    statements.forEach(s => s.resources.replaceStar(rep));

    return statements;
  }

  private readManagedPolicies(policyArns: string[] | undefined, logicalId: string): ManagedPolicyAttachment[] {
    if (!policyArns) { return []; }

    const rep = '${' + logicalId + '.Arn}';
    return parseManagedPolicies(rep, unCloudFormation(policyArns));
  }

  private readLambdaStatements(properties?: PropertyMap): Statement[] {
    if (!properties) { return []; }

    return [parseLambdaPermission(unCloudFormation(properties))];
  }
}

/**
 * Things that can be compared to themselves (by value)
 */
interface Eq<T> {
  equal(other: T): boolean;
}

/**
 * Whether a collection contains some element (by value)
 */
function contains<T extends Eq<T>>(element: T, xs: T[]) {
  return xs.some(x => x.equal(element));
}

/**
 * Return collection except for elements
 */
function difference<T extends Eq<T>>(collection: T[], elements: T[]) {
  return collection.filter(x => !contains(x, elements));
}

/**
 * Render into a summary table cell
 */
function renderTargets(targets: Targets): string {
  if (targets.not) {
    return targets.values.map(s => `NOT ${s}`).join('\n');
  }
  return targets.values.join('\n');
}

/**
 * Render the Condition column
 */
function renderCondition(condition: any) {
  if (!condition || Object.keys(condition).length === 0) { return ''; }
  const jsonRepresentation = JSON.stringify(condition, undefined, 2);

  // The JSON representation looks like this:
  //
  //  {
  //    "ArnLike": {
  //      "AWS:SourceArn": "${MyTopic86869434}"
  //    }
  //  }
  //
  // We can make it more compact without losing information by getting rid of the outermost braces
  // and the indentation.
  const lines = jsonRepresentation.split('\n');
  return lines.slice(1, lines.length - 1).map(s => s.substr(2)).join('\n');
}

/**
 * Turn a key extraction function into a comparator for use in Array.sort()
 */
function makeComparator<T, U>(keyFn: (x: T) => U) {
  return (a: T, b: T) => {
    const keyA = keyFn(a);
    const keyB = keyFn(b);

    if (keyA < keyB) { return -1; }
    if (keyB < keyA) { return 1; }
    return 0;
  };
}