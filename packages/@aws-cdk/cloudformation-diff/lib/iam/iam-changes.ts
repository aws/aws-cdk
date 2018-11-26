import colors = require('colors/safe');
import { PropertyChange, PropertyMap, ResourceChange } from "../diff/types";
import { parseLambdaPermission, parseStatements, Statement, Targets } from "./statement";
import { unCloudFormation } from "./uncfn";

/**
 * Changes to IAM statements
 */
export class IamChanges {
  public readonly additions: Statement[] = [];
  public readonly removals: Statement[] = [];
  private oldStatements: Statement[] = [];
  private newStatements: Statement[] = [];

  constructor(identityPolicyChanges: PropertyChange[], resourcePolicyChanges: PropertyChange[], lambdaPermissionChanges: ResourceChange[]) {
    for (const policyChange of identityPolicyChanges) {
      this.oldStatements.push(...this.readIdentityStatements(policyChange.oldValue, policyChange.propertyName, policyChange.resourceLogicalId));
      this.newStatements.push(...this.readIdentityStatements(policyChange.newValue, policyChange.propertyName, policyChange.resourceLogicalId));
    }
    for (const policyChange of resourcePolicyChanges) {
      this.oldStatements.push(...this.readResourceStatements(policyChange.oldValue, policyChange.resourceLogicalId));
      this.newStatements.push(...this.readResourceStatements(policyChange.newValue, policyChange.resourceLogicalId));
    }
    for (const lambdaChange of lambdaPermissionChanges) {
      this.oldStatements.push(...this.readLambdaStatements(lambdaChange.oldProperties));
      this.newStatements.push(...this.readLambdaStatements(lambdaChange.newProperties));
    }

    this.additions.push(...this.newStatements.filter(s => !hasStatement(s, this.oldStatements)));
    this.removals.push(...this.oldStatements.filter(s => !hasStatement(s, this.newStatements)));
  }

  public get empty() {
    return this.additions.length + this.removals.length === 0;
  }

  public get hasAdditions() {
    return this.additions.length > 0;
  }

  public get hasRemovals() {
    return this.removals.length > 0;
  }

  /**
   * Return a summary table of changes
   */
  public summarize(): string[][] {
    const ret: string[][] = [];

    const header = ['', 'Resource', 'Effect', 'Actions', 'Principals', 'Condition'];

    // First generate all lines, then sort on Resource so that similar resources are together
    for (const statement of this.additions) {
      ret.push([
        '+',
        renderTargets(statement.resources),
        statement.effect,
        renderTargets(statement.actions),
        renderTargets(statement.principals),
        renderCondition(statement.condition)
      ].map(s => colors.green(s)));
    }
    for (const statement of this.removals) {
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

  private readLambdaStatements(properties?: PropertyMap): Statement[] {
    if (!properties) { return []; }

    return [parseLambdaPermission(unCloudFormation(properties))];
  }
}

function hasStatement(statement: Statement, ss: Statement[]) {
  return ss.some(s => statement.equal(s));
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