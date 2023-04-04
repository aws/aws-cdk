import * as fs from 'fs';
import * as path from 'path';
import { Construct } from 'constructs';
import { Annotations } from '../annotations';
import { attachCustomSynthesis } from '../app';
import { Reference } from '../reference';
import { IResolvable, DefaultTokenResolver, StringConcat } from '../resolvable';
import { ISynthesisSession } from '../stack-synthesizers';
import { Token, Tokenization } from '../token';

export const POLICY_SYNTHESIZER_ID = 'PolicySynthesizer';

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
  readonly managedPolicies: any[];

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

interface ManagedPolicyReportOptions {
  /**
   * A list of IAM Policy Statements attached to the
   * managed policy
   */
  readonly policyStatements: string[];

  /**
   * A list of IAM role construct paths that are attached to the managed policy
   *
   * @default - no roles are attached to the policy
   */
  readonly roles?: string[];
}

interface PolicyReport {
  readonly roles: PolicyReportRole[];
}

/**
 * The structure of the policy report
 */
interface PolicyReportRole {
  /**
   * The absolute path of the role construct
   */
  readonly roleConstructPath: string;
  /**
   * The physical name of the IAM role
   *
   * If the user has not provided a precreated physical name
   * this will be 'missing role'
   */
  readonly roleName: string;

  /**
   * Whether or not the user has provided a precreated physical name
   *
   * @default false
   */
  readonly missing?: boolean;

  /**
   * The assume role (trust) policy of the role
   *
   * @default - no assume role policy
   */
  readonly assumeRolePolicy?: string[];

  /**
   * The managed policy ARNs that have been attached to the role
   *
   * @default - no managed policy ARNs
   */
  readonly managedPolicyArns?: string[],

  /**
   * The managed policy statements that have been attached to the role
   *
   * @default - no managed policy statements
   */
  readonly managedPolicyStatements?: string[];

  /**
   * The policy statements that have been attached to the role
   * as inline statements
   *
   * @default - no inline statements
   */
  readonly identityPolicyStatements?: string[];
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
export class PolicySynthesizer extends Construct {
  public static getOrCreate(scope: Construct): PolicySynthesizer {
    const synthesizer = scope.node.root.node.tryFindChild(POLICY_SYNTHESIZER_ID);
    if (synthesizer) {
      return synthesizer as PolicySynthesizer;
    }
    return new PolicySynthesizer(scope.node.root);
  }

  private readonly roleReport: { [rolePath: string]: RoleReportOptions } = {};
  private readonly managedPolicyReport: { [policyPath: string]: ManagedPolicyReportOptions } = {};
  constructor(scope: Construct) {
    super(scope, POLICY_SYNTHESIZER_ID);

    attachCustomSynthesis(this, {
      onSynthesize: (session: ISynthesisSession) => {
        const report = this.createJsonReport();
        if (report.roles?.length > 0) {
          const filePath = path.join(session.outdir, 'iam-policy-report');
          fs.writeFileSync(filePath+'.txt', this.createHumanReport(report));
          fs.writeFileSync(filePath+'.json', JSON.stringify(report, undefined, 2));
        }
      },
    });
  }

  private createJsonReport(): PolicyReport {
    return Object.entries(this.roleReport).reduce((acc, [key, value]) => {
      const { policyArns, policyStatements } = this.renderManagedPoliciesForRole(key, value.managedPolicies);
      acc = {
        roles: [
          ...acc.roles ?? [],
          {
            roleConstructPath: key,
            roleName: value.missing ? 'missing role' : value.roleName!,
            missing: value.missing,
            assumeRolePolicy: this.resolveReferences(value.assumeRolePolicy),
            managedPolicyArns: this.resolveReferences(policyArns),
            managedPolicyStatements: this.resolveReferences(policyStatements),
            identityPolicyStatements: this.resolveReferences(value.policyStatements),
          },
        ],
      };
      return acc;
    }, {} as PolicyReport);
  }

  private createHumanReport(report: PolicyReport): string {
    return report.roles.map(role => [
      `<${role.missing ? 'missing role' : role.roleName}> (${role.roleConstructPath})`,
      '',
      'AssumeRole Policy:',
      ...this.toJsonString(role.assumeRolePolicy),
      '',
      'Managed Policy ARNs:',
      ...this.toJsonString(role.managedPolicyArns),
      '',
      'Managed Policies Statements:',
      this.toJsonString(role.managedPolicyStatements),
      '',
      'Identity Policy Statements:',
      this.toJsonString(role.identityPolicyStatements),
    ].join('\n')).join('');
  }

  /**
   * Takes a value and returns a formatted JSON string
   */
  private toJsonString(value?: any): string[] {
    if ((Array.isArray(value) && value.length === 0) || !value) {
      return ['NONE'];
    }

    return [JSON.stringify({ values: value }.values, undefined, 2)];
  }

  /**
   * IAM managed policies can be attached to a role using a couple different methods.
   *
   * 1. You can use an existing managed policy, i.e. ManagedPolicy.fromManagedPolicyName()
   * 2. You can create a managed policy and attach the role, i.e.
   *   new ManagedPolicy(scope, 'ManagedPolicy', { roles: [myRole] });
   * 3. You can create a managed policy and attach it to the role, i.e.
   *   const role = new Role(...);
   *   role.addManagedPolicy(new ManagedPolicy(...));
   *
   * For 1, CDK is not creating the managed policy so we just need to report the ARN
   * of the policy that needs to be attached to the role.
   *
   * For 2 & 3, CDK _is_ creating the managed policy so instead of reporting the name or ARN of the
   * policy (that we prevented being created) we should instead report the policy statements
   * that are part of that document. It doesn't really matter if the admins creating the roles then
   * decide to use managed policies or inline policies, etc.
   *
   * There could be managed policies that are created and _not_ attached to any roles, in that case
   * we do not report anything. That managed policy is not being created automatically by our constructs.
   */
  private renderManagedPoliciesForRole(
    rolePath: string,
    managedPolicies: any[],
  ): { policyArns: string[], policyStatements: string[] } {
    const policyStatements: string[] = [];
    // managed policies that have roles attached to the policy
    Object.values(this.managedPolicyReport).forEach(value => {
      if (value.roles?.includes(rolePath)) {
        policyStatements.push(...value.policyStatements);
      }
    });
    const policyArns: string[] = [];
    managedPolicies.forEach(policy => {
      if (Construct.isConstruct(policy)) {
        if (this.managedPolicyReport.hasOwnProperty(policy.node.path)) {
          policyStatements.push(...this.managedPolicyReport[policy.node.path].policyStatements);
        } else {
          // just add the arn
          policyArns.push((policy as any).managedPolicyArn);
        }
      } else {
        policyArns.push(policy.managedPolicyArn);
      }
    });
    return {
      policyArns,
      policyStatements,
    };
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
    if ((Array.isArray(ref) && ref.length === 0) || !ref) {
      return [];
    }
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
   *
   * @param rolePath the construct path of the role
   * @param options the values associated with the role
   */
  public addRole(rolePath: string, options: RoleReportOptions): void {
    if (this.roleReport.hasOwnProperty(rolePath)) {
      throw new Error(`IAM Policy Report already has an entry for role: ${rolePath}`);
    }
    this.roleReport[rolePath] = options;
  }

  /**
   * Add an IAM Managed Policy to the report
   *
   * @param policyPath the construct path of the managed policy
   * @param options the values associated with the managed policy
   */
  public addManagedPolicy(policyPath: string, options: ManagedPolicyReportOptions): void {
    if (this.managedPolicyReport.hasOwnProperty(policyPath)) {
      throw new Error(`IAM Policy Report already has an entry for managed policy: ${policyPath}`);
    }

    this.managedPolicyReport[policyPath] = options;
  }
}

/**
 * Return configuration for precreated roles
 */
export function getPrecreatedRoleConfig(scope: Construct, rolePath?: string): CustomizeRoleConfig {
  const precreatedRolePath = rolePath ?? scope.node.path;
  const customizeRolesContext = scope.node.tryGetContext(CUSTOMIZE_ROLES_CONTEXT_KEY);
  if (customizeRolesContext !== undefined) {
    const customizeRoles = customizeRolesContext;
    if (customizeRoles.preventSynthesis === false) {
      return {
        preventSynthesis: false,
        enabled: true,
      };
    }
    if (customizeRoles.usePrecreatedRoles?.hasOwnProperty(precreatedRolePath)) {
      if (Token.isUnresolved(customizeRoles.usePrecreatedRoles[precreatedRolePath])) {
        // we do not want to fail synthesis
        Annotations.of(scope).addError(
          `Cannot resolve precreated role name at path "${precreatedRolePath}". The value may be a token.`,
        );
      } else {
        return {
          enabled: true,
          preventSynthesis: true,
          precreatedRoleName: customizeRoles.usePrecreatedRoles[precreatedRolePath],
        };
      }
    } else {
      // we do not want to fail synthesis
      Annotations.of(scope).addError(
        `IAM Role is being created at path "${precreatedRolePath}" and customizeRoles.preventSynthesis is enabled. ` +
          'You must provide a precreated role name in customizeRoles.precreatedRoles',
      );
    }
    return {
      enabled: true,
      preventSynthesis: true,
    };
  }
  return { enabled: false };
}

export interface CustomizeRoleConfig {
  /**
   * Whether or not customized roles is enabled.
   *
   * This will be true if the user calls Role.customizeRoles()
   */
  readonly enabled: boolean;
  /**
   * Whether or not the role CFN resource should be synthesized
   * in the template
   *
   * @default - false if enabled=false otherwise true
   */
  readonly preventSynthesis?: boolean;

  /**
   * The physical name of the precreated role.
   *
   * @default - no precreated role
   */
  readonly precreatedRoleName?: string;
}

export const CUSTOMIZE_ROLES_CONTEXT_KEY = '@aws-cdk/iam:customizeRoles';
export function getCustomizeRolesConfig(scope: Construct): CustomizeRoleConfig {
  const customizeRolesContext = scope.node.tryGetContext(CUSTOMIZE_ROLES_CONTEXT_KEY);
  return {
    preventSynthesis: customizeRolesContext !== undefined && customizeRolesContext.preventSynthesis !== false,
    enabled: customizeRolesContext !== undefined,
  };
}
