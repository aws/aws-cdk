import { Construct } from 'constructs';
export declare const POLICY_SYNTHESIZER_ID = "PolicySynthesizer";
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
export declare class PolicySynthesizer extends Construct {
    static getOrCreate(scope: Construct): PolicySynthesizer;
    private readonly roleReport;
    private readonly managedPolicyReport;
    constructor(scope: Construct);
    private createJsonReport;
    private createHumanReport;
    /**
     * Takes a value and returns a formatted JSON string
     */
    private toJsonString;
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
    private renderManagedPoliciesForRole;
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
    private resolveReferences;
    private resolveJsonObject;
    /**
     * Add an IAM role to the report
     *
     * @param rolePath the construct path of the role
     * @param options the values associated with the role
     */
    addRole(rolePath: string, options: RoleReportOptions): void;
    /**
     * Add an IAM Managed Policy to the report
     *
     * @param policyPath the construct path of the managed policy
     * @param options the values associated with the managed policy
     */
    addManagedPolicy(policyPath: string, options: ManagedPolicyReportOptions): void;
}
/**
 * Return configuration for precreated roles
 */
export declare function getPrecreatedRoleConfig(scope: Construct, rolePath?: string): CustomizeRoleConfig;
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
export declare const CUSTOMIZE_ROLES_CONTEXT_KEY = "@aws-cdk/iam:customizeRoles";
export declare function getCustomizeRolesConfig(scope: Construct): CustomizeRoleConfig;
export {};
