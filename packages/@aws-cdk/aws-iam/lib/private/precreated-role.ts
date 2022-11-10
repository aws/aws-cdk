import * as fs from 'fs';
import * as path from 'path';
import { Resource, ISynthesisSession, attachCustomSynthesis, Stack, Reference, Tokenization, IResolvable, StringConcat, DefaultTokenResolver } from '@aws-cdk/core';
import { Construct, Dependable, DependencyGroup } from 'constructs';
import { Grant } from '../grant';
import { IManagedPolicy } from '../managed-policy';
import { Policy } from '../policy';
import { PolicyDocument } from '../policy-document';
import { PolicyStatement } from '../policy-statement';
import { AddToPrincipalPolicyResult, IPrincipal, PrincipalPolicyFragment } from '../principals';
import { IRole } from '../role';

const POLICY_SYNTHESIZER_ID = 'PolicySynthesizer';

/**
 * Options for a precreated role
 */
export interface PrecreatedRoleProps {
  /**
   * The base role to use for the precreated role. In most cases this will be
   * the `Role` or `IRole` that is being created by a construct. For example,
   * users (or constructs) will create an IAM role with `new Role(this, 'MyRole', {...})`.
   * That `Role` will be used as the base role for the `PrecreatedRole` meaning it be able
   * to access any methods and properties on the base role.
   */
  readonly role: IRole;

  /**
   * The assume role (trust) policy for the precreated role.
   *
   * @default - no assume role policy
   */
  readonly assumeRolePolicy?: PolicyDocument;

  /**
   * If the role is missing from the precreatedRole context
   *
   * @default false
   */
  readonly missing?: boolean;
}

/**
 * An IAM role that has been created outside of CDK and can be
 * used in place of a role that CDK _is_ creating.
 *
 * When any policy is attached to a precreated role the policy will be
 * synthesized into a separate report and will _not_ be synthesized in
 * the CloudFormation template.
 */
export class PrecreatedRole extends Resource implements IRole {
  public readonly assumeRoleAction: string;
  public readonly policyFragment: PrincipalPolicyFragment;
  public readonly grantPrincipal = this;
  public readonly principalAccount?: string;
  public readonly roleArn: string;
  public readonly roleName: string;
  public readonly stack: Stack;

  private readonly policySynthesizer: PolicySynthesizer;
  private readonly policyStatements: string[] = [];
  private readonly managedPolicies: string[] = [];

  private readonly role: IRole;
  constructor(scope: Construct, id: string, props: PrecreatedRoleProps) {
    super(scope, id, {
      account: props.role.env.account,
      region: props.role.env.region,
    });
    this.role = props.role;
    this.assumeRoleAction = this.role.assumeRoleAction;
    this.policyFragment = this.role.policyFragment;
    this.principalAccount = this.role.principalAccount;
    this.roleArn = this.role.roleArn;
    this.roleName = this.role.roleName;
    this.stack = this.role.stack;

    Dependable.implement(this, {
      dependencyRoots: [this.role],
    });

    // add a single PolicySynthesizer under the `App` scope
    this.policySynthesizer = (this.node.root.node.tryFindChild(POLICY_SYNTHESIZER_ID)
      ?? new PolicySynthesizer(this.node.root)) as PolicySynthesizer;
    this.policySynthesizer.addRole(this.node.path, {
      roleName: this.roleName,
      managedPolicies: this.managedPolicies,
      policyStatements: this.policyStatements,
      assumeRolePolicy: Stack.of(this).resolve(props.assumeRolePolicy?.toJSON()?.Statement),
      missing: props.missing,
    });
  }

  public attachInlinePolicy(policy: Policy): void {
    const statements = policy.document.toJSON()?.Statement;
    if (statements && Array.isArray(statements)) {
      statements.forEach(statement => {
        this.policyStatements.push(statement);
      });
    }
  }

  public addManagedPolicy(policy: IManagedPolicy): void {
    this.managedPolicies.push(policy.managedPolicyArn);
  }

  public addToPolicy(statement: PolicyStatement): boolean {
    this.policyStatements.push(statement.toStatementJson());
    return false;
  }

  public addToPrincipalPolicy(statement: PolicyStatement): AddToPrincipalPolicyResult {
    this.addToPolicy(statement);
    // If we return `false`, the grants will try to add the statement to the resource
    // (if possible).
    return { statementAdded: true, policyDependable: new DependencyGroup() };
  }

  public grant(grantee: IPrincipal, ...actions: string[]): Grant {
    return this.role.grant(grantee, ...actions);
  }

  public grantPassRole(grantee: IPrincipal): Grant {
    return this.role.grantPassRole(grantee);
  }

  public grantAssumeRole(identity: IPrincipal): Grant {
    return this.role.grantAssumeRole(identity);
  }
}

/**
 * Options for generating the role policy report
 */
interface RoleReportOptions {
  /**
   * The name of the IAM role.
   *
   * If this is not provided the role will be assumed
   * to be missing.
   *
   * @default 'missing role'
   */
  readonly roleName?: string;

  /**
   * A list of IAM Policy Statements
   */
  readonly policyStatements: string[];

  /**
   * A list of IAM Managed Policy ARNs
   */
  readonly managedPolicies: string[];

  /**
   * The trust policy for the IAM Role.
   *
   * @default - no trust policy.
   */
  readonly assumeRolePolicy?: string;

  /**
   * Whether or not the role is missing from the list of
   * precreated roles.
   *
   * @default false
   */
  readonly missing?: boolean;
}

/**
 * A construct that is responsible for generating an IAM policy Report
 * for all IAM roles that are created as part of the CDK application.
 *
 * The report will contain the following information for each IAM Role in the app:
 *
 * 1. Is the role "missing" (not provided in the customizeRoles.usePrecreatedRoles)?
 * 2. The AssumeRole Policy (AKA Trust Policy)
 * 3. Any "Identity" policies (i.e. policies attached to the role)
 * 4. Any Managed policies
 */
class PolicySynthesizer extends Construct {
  private readonly roleReport: { [roleName: string]: RoleReportOptions } = {};
  constructor(scope: Construct) {
    super(scope, POLICY_SYNTHESIZER_ID);

    attachCustomSynthesis(this, {
      onSynthesize: (session: ISynthesisSession) => {
        const filePath = path.join(session.outdir, 'iam-policy-report.txt');
        fs.writeFileSync(filePath, this.createReport());
      },
    });
  }

  private createReport(): string {
    return Object.entries(this.roleReport).flatMap(([key, value]) => {
      return [
        `<${value.missing ? 'missing role' : value.roleName}> (${key})`,
        '',
        'AssumeRole Policy:',
        ...this.toJsonString(value.assumeRolePolicy),
        '',
        'Managed Policies:',
        ...this.toJsonString(value.managedPolicies),
        '',
        'Identity Policy:',
        ...this.toJsonString(value.policyStatements),
      ];
    }).join('\n');
  }

  private toJsonString(value?: any): string[] {
    if ((Array.isArray(value) && value.length === 0) || !value) {
      return [];
    }

    return [JSON.stringify({ values: this.resolveReferences(value) }.values, undefined, 2)];
  }

  /**
   * Resolve any references and replace with a more user friendly value. This is the value
   * that will appear in the report, so instead of getting something like this (not very useful):
   *
   *     "Resource": {
   *       "Fn::Join": [
   *         "",
   *         [
   *           "arn:",
   *           {
   *             "Ref": "AWS::Partition"
   *           },
   *           ":iam::",
   *           {
   *             "Ref": "AWS::AccountId"
   *           },
   *           ":role/Role"
   *         ]
   *       ]
   *     }
   *
   * We will instead get:
   *
   *     "Resource": "arn:(PARTITION):iam::(ACCOUNT):role/Role"
   *
   * Or if referencing a resource attribute
   *
   *     "Resource": {
   *       "Fn::GetAtt": [
   *         "SomeResource",
   *         "Arn"
   *       ]
   *     }
   *
   * Becomes
   *
   *     "(Path/To/SomeResource.Arn)"
   */
  private resolveReferences(ref: any): any {
    if (Array.isArray(ref)) {
      return ref.map(r => this.resolveReferences(r));
    } else if (typeof ref === 'object') {
      return this.resolveJsonObject(ref);
    }
    const resolvable = Tokenization.reverseString(ref);
    if (resolvable.length === 1 && Reference.isReference(resolvable.firstToken)) {
      return `(${resolvable.firstToken.target.node.path}.${resolvable.firstToken.displayName})`;
    } else {
      const resolvedTokens = resolvable.mapTokens({
        mapToken: (r: IResolvable) => {
          if (Reference.isReference(r)) {
            return `(${r.target.node.path}.${r.displayName})`;
          }
          const resolved = Tokenization.resolve(r, {
            scope: this,
            resolver: new DefaultTokenResolver(new StringConcat()),
          });
          if (typeof resolved === 'object' && resolved.hasOwnProperty('Ref')) {
            switch (resolved.Ref) {
              case 'AWS::AccountId':
                return '(ACCOUNT)';
              case 'AWS::Partition':
                return '(PARTITION)';
              case 'AWS::Region':
                return '(REGION)';
              default:
                return r;
            }
          }
          return r;
        },
      });
      return resolvedTokens.join(new StringConcat());
    }
  }

  private resolveJsonObject(statement: { [key: string]: any }): any {
    const newStatement = statement;
    for (const [key, value] of Object.entries(statement)) {
      newStatement[key] = this.resolveReferences(value);
    }
    return newStatement;
  }

  /**
   * Add an IAM role to the report
   */
  public addRole(rolePath: string, options: RoleReportOptions): void {
    if (this.roleReport.hasOwnProperty(rolePath)) {
      throw new Error(`IAM Policy Report already has an entry for role: ${rolePath}`);
    }
    this.roleReport[rolePath] = options;
  }
}
