"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCustomizeRolesConfig = exports.CUSTOMIZE_ROLES_CONTEXT_KEY = exports.getPrecreatedRoleConfig = exports.PolicySynthesizer = exports.POLICY_SYNTHESIZER_ID = void 0;
const fs = require("fs");
const path = require("path");
const constructs_1 = require("constructs");
const annotations_1 = require("../annotations");
const app_1 = require("../app");
const reference_1 = require("../reference");
const resolvable_1 = require("../resolvable");
const token_1 = require("../token");
exports.POLICY_SYNTHESIZER_ID = 'PolicySynthesizer';
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
class PolicySynthesizer extends constructs_1.Construct {
    static getOrCreate(scope) {
        const synthesizer = scope.node.root.node.tryFindChild(exports.POLICY_SYNTHESIZER_ID);
        if (synthesizer) {
            return synthesizer;
        }
        return new PolicySynthesizer(scope.node.root);
    }
    constructor(scope) {
        super(scope, exports.POLICY_SYNTHESIZER_ID);
        this.roleReport = {};
        this.managedPolicyReport = {};
        (0, app_1.attachCustomSynthesis)(this, {
            onSynthesize: (session) => {
                const report = this.createJsonReport();
                if (report.roles?.length > 0) {
                    const filePath = path.join(session.outdir, 'iam-policy-report');
                    fs.writeFileSync(filePath + '.txt', this.createHumanReport(report));
                    fs.writeFileSync(filePath + '.json', JSON.stringify(report, undefined, 2));
                }
            },
        });
    }
    createJsonReport() {
        return Object.entries(this.roleReport).reduce((acc, [key, value]) => {
            const { policyArns, policyStatements } = this.renderManagedPoliciesForRole(key, value.managedPolicies);
            acc = {
                roles: [
                    ...acc.roles ?? [],
                    {
                        roleConstructPath: key,
                        roleName: value.missing ? 'missing role' : value.roleName,
                        missing: value.missing,
                        assumeRolePolicy: this.resolveReferences(value.assumeRolePolicy),
                        managedPolicyArns: this.resolveReferences(policyArns),
                        managedPolicyStatements: this.resolveReferences(policyStatements),
                        identityPolicyStatements: this.resolveReferences(value.policyStatements),
                    },
                ],
            };
            return acc;
        }, {});
    }
    createHumanReport(report) {
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
    toJsonString(value) {
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
    renderManagedPoliciesForRole(rolePath, managedPolicies) {
        const policyStatements = [];
        // managed policies that have roles attached to the policy
        Object.values(this.managedPolicyReport).forEach(value => {
            if (value.roles?.includes(rolePath)) {
                policyStatements.push(...value.policyStatements);
            }
        });
        const policyArns = [];
        managedPolicies.forEach(policy => {
            if (constructs_1.Construct.isConstruct(policy)) {
                if (this.managedPolicyReport.hasOwnProperty(policy.node.path)) {
                    policyStatements.push(...this.managedPolicyReport[policy.node.path].policyStatements);
                }
                else {
                    // just add the arn
                    policyArns.push(policy.managedPolicyArn);
                }
            }
            else {
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
    resolveReferences(ref) {
        if ((Array.isArray(ref) && ref.length === 0) || !ref) {
            return [];
        }
        if (Array.isArray(ref)) {
            return ref.map(r => this.resolveReferences(r));
        }
        else if (typeof ref === 'object') {
            return this.resolveJsonObject(ref);
        }
        const resolvable = token_1.Tokenization.reverseString(ref);
        if (resolvable.length === 1 && reference_1.Reference.isReference(resolvable.firstToken)) {
            return `(${resolvable.firstToken.target.node.path}.${resolvable.firstToken.displayName})`;
        }
        else {
            const resolvedTokens = resolvable.mapTokens({
                mapToken: (r) => {
                    if (reference_1.Reference.isReference(r)) {
                        return `(${r.target.node.path}.${r.displayName})`;
                    }
                    const resolved = token_1.Tokenization.resolve(r, {
                        scope: this,
                        resolver: new resolvable_1.DefaultTokenResolver(new resolvable_1.StringConcat()),
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
            return resolvedTokens.join(new resolvable_1.StringConcat());
        }
    }
    resolveJsonObject(statement) {
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
    addRole(rolePath, options) {
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
    addManagedPolicy(policyPath, options) {
        if (this.managedPolicyReport.hasOwnProperty(policyPath)) {
            throw new Error(`IAM Policy Report already has an entry for managed policy: ${policyPath}`);
        }
        this.managedPolicyReport[policyPath] = options;
    }
}
exports.PolicySynthesizer = PolicySynthesizer;
/**
 * Return configuration for precreated roles
 */
function getPrecreatedRoleConfig(scope, rolePath) {
    const precreatedRolePath = rolePath ?? scope.node.path;
    const customizeRolesContext = scope.node.tryGetContext(exports.CUSTOMIZE_ROLES_CONTEXT_KEY);
    if (customizeRolesContext !== undefined) {
        const customizeRoles = customizeRolesContext;
        if (customizeRoles.preventSynthesis === false) {
            return {
                preventSynthesis: false,
                enabled: true,
            };
        }
        if (customizeRoles.usePrecreatedRoles?.hasOwnProperty(precreatedRolePath)) {
            if (token_1.Token.isUnresolved(customizeRoles.usePrecreatedRoles[precreatedRolePath])) {
                // we do not want to fail synthesis
                annotations_1.Annotations.of(scope).addError(`Cannot resolve precreated role name at path "${precreatedRolePath}". The value may be a token.`);
            }
            else {
                return {
                    enabled: true,
                    preventSynthesis: true,
                    precreatedRoleName: customizeRoles.usePrecreatedRoles[precreatedRolePath],
                };
            }
        }
        else {
            // we do not want to fail synthesis
            annotations_1.Annotations.of(scope).addError(`IAM Role is being created at path "${precreatedRolePath}" and customizeRoles.preventSynthesis is enabled. ` +
                'You must provide a precreated role name in customizeRoles.precreatedRoles');
        }
        return {
            enabled: true,
            preventSynthesis: true,
        };
    }
    return { enabled: false };
}
exports.getPrecreatedRoleConfig = getPrecreatedRoleConfig;
exports.CUSTOMIZE_ROLES_CONTEXT_KEY = '@aws-cdk/iam:customizeRoles';
function getCustomizeRolesConfig(scope) {
    const customizeRolesContext = scope.node.tryGetContext(exports.CUSTOMIZE_ROLES_CONTEXT_KEY);
    return {
        preventSynthesis: customizeRolesContext !== undefined && customizeRolesContext.preventSynthesis !== false,
        enabled: customizeRolesContext !== undefined,
    };
}
exports.getCustomizeRolesConfig = getCustomizeRolesConfig;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3VzdG9taXplLXJvbGVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY3VzdG9taXplLXJvbGVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHlCQUF5QjtBQUN6Qiw2QkFBNkI7QUFDN0IsMkNBQXVDO0FBQ3ZDLGdEQUE2QztBQUM3QyxnQ0FBK0M7QUFDL0MsNENBQXlDO0FBQ3pDLDhDQUFnRjtBQUVoRixvQ0FBK0M7QUFFbEMsUUFBQSxxQkFBcUIsR0FBRyxtQkFBbUIsQ0FBQztBQWtIekQ7Ozs7Ozs7Ozs7R0FVRztBQUNILE1BQWEsaUJBQWtCLFNBQVEsc0JBQVM7SUFDdkMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxLQUFnQjtRQUN4QyxNQUFNLFdBQVcsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLDZCQUFxQixDQUFDLENBQUM7UUFDN0UsSUFBSSxXQUFXLEVBQUU7WUFDZixPQUFPLFdBQWdDLENBQUM7U0FDekM7UUFDRCxPQUFPLElBQUksaUJBQWlCLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNoRCxDQUFDO0lBSUQsWUFBWSxLQUFnQjtRQUMxQixLQUFLLENBQUMsS0FBSyxFQUFFLDZCQUFxQixDQUFDLENBQUM7UUFIckIsZUFBVSxHQUE4QyxFQUFFLENBQUM7UUFDM0Qsd0JBQW1CLEdBQXlELEVBQUUsQ0FBQztRQUk5RixJQUFBLDJCQUFxQixFQUFDLElBQUksRUFBRTtZQUMxQixZQUFZLEVBQUUsQ0FBQyxPQUEwQixFQUFFLEVBQUU7Z0JBQzNDLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO2dCQUN2QyxJQUFJLE1BQU0sQ0FBQyxLQUFLLEVBQUUsTUFBTSxHQUFHLENBQUMsRUFBRTtvQkFDNUIsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLG1CQUFtQixD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QyxRQUFRLENBQzVCLGdEQUFnRCxrQkFBa0IsOEJBQThCLENBQ2pHLENBQUM7YUFDSDtpQkFBTTtnQkFDTCxPQUFPO29CQUNMLE9BQU8sRUFBRSxJQUFJO29CQUNiLGdCQUFnQixFQUFFLElBQUk7b0JBQ3RCLGtCQUFrQixFQUFFLGNBQWMsQ0FBQyxrQkFBa0IsQ0FBQyxrQkFBa0IsQ0FBQztpQkFDMUUsQ0FBQzthQUNIO1NBQ0Y7YUFBTTtZQUNMLG1DQUFtQztZQUNuQyx5QkFBVyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxRQUFRLENBQzVCLHNDQUFzQyxrQkFBa0Isb0RBQW9EO2dCQUMxRywyRUFBMkUsQ0FDOUUsQ0FBQztTQUNIO1FBQ0QsT0FBTztZQUNMLE9BQU8sRUFBRSxJQUFJO1lBQ2IsZ0JBQWdCLEVBQUUsSUFBSTtTQUN2QixDQUFDO0tBQ0g7SUFDRCxPQUFPLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxDQUFDO0FBQzVCLENBQUM7QUFyQ0QsMERBcUNDO0FBeUJZLFFBQUEsMkJBQTJCLEdBQUcsNkJBQTZCLENBQUM7QUFDekUsU0FBZ0IsdUJBQXVCLENBQUMsS0FBZ0I7SUFDdEQsTUFBTSxxQkFBcUIsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxtQ0FBMkIsQ0FBQyxDQUFDO0lBQ3BGLE9BQU87UUFDTCxnQkFBZ0IsRUFBRSxxQkFBcUIsS0FBSyxTQUFTLElBQUkscUJBQXFCLENBQUMsZ0JBQWdCLEtBQUssS0FBSztRQUN6RyxPQUFPLEVBQUUscUJBQXFCLEtBQUssU0FBUztLQUM3QyxDQUFDO0FBQ0osQ0FBQztBQU5ELDBEQU1DIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgZnMgZnJvbSAnZnMnO1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgQW5ub3RhdGlvbnMgfSBmcm9tICcuLi9hbm5vdGF0aW9ucyc7XG5pbXBvcnQgeyBhdHRhY2hDdXN0b21TeW50aGVzaXMgfSBmcm9tICcuLi9hcHAnO1xuaW1wb3J0IHsgUmVmZXJlbmNlIH0gZnJvbSAnLi4vcmVmZXJlbmNlJztcbmltcG9ydCB7IElSZXNvbHZhYmxlLCBEZWZhdWx0VG9rZW5SZXNvbHZlciwgU3RyaW5nQ29uY2F0IH0gZnJvbSAnLi4vcmVzb2x2YWJsZSc7XG5pbXBvcnQgeyBJU3ludGhlc2lzU2Vzc2lvbiB9IGZyb20gJy4uL3N0YWNrLXN5bnRoZXNpemVycyc7XG5pbXBvcnQgeyBUb2tlbiwgVG9rZW5pemF0aW9uIH0gZnJvbSAnLi4vdG9rZW4nO1xuXG5leHBvcnQgY29uc3QgUE9MSUNZX1NZTlRIRVNJWkVSX0lEID0gJ1BvbGljeVN5bnRoZXNpemVyJztcblxuLyoqXG4gKiBPcHRpb25zIGZvciBnZW5lcmF0aW5nIHRoZSByb2xlIHBvbGljeSByZXBvcnRcbiAqL1xuaW50ZXJmYWNlIFJvbGVSZXBvcnRPcHRpb25zIHtcbiAgLyoqXG4gICAqIFRoZSBuYW1lIG9mIHRoZSBJQU0gcm9sZS5cbiAgICpcbiAgICogSWYgdGhpcyBpcyBub3QgcHJvdmlkZWQgdGhlIHJvbGUgd2lsbCBiZSBhc3N1bWVkXG4gICAqIHRvIGJlIG1pc3NpbmcuXG4gICAqXG4gICAqIEBkZWZhdWx0ICdtaXNzaW5nIHJvbGUnXG4gICAqL1xuICByZWFkb25seSByb2xlTmFtZT86IHN0cmluZztcblxuICAvKipcbiAgICogQSBsaXN0IG9mIElBTSBQb2xpY3kgU3RhdGVtZW50c1xuICAgKi9cbiAgcmVhZG9ubHkgcG9saWN5U3RhdGVtZW50czogc3RyaW5nW107XG5cbiAgLyoqXG4gICAqIEEgbGlzdCBvZiBJQU0gTWFuYWdlZCBQb2xpY3kgQVJOc1xuICAgKi9cbiAgcmVhZG9ubHkgbWFuYWdlZFBvbGljaWVzOiBhbnlbXTtcblxuICAvKipcbiAgICogVGhlIHRydXN0IHBvbGljeSBmb3IgdGhlIElBTSBSb2xlLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIG5vIHRydXN0IHBvbGljeS5cbiAgICovXG4gIHJlYWRvbmx5IGFzc3VtZVJvbGVQb2xpY3k/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgb3Igbm90IHRoZSByb2xlIGlzIG1pc3NpbmcgZnJvbSB0aGUgbGlzdCBvZlxuICAgKiBwcmVjcmVhdGVkIHJvbGVzLlxuICAgKlxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKi9cbiAgcmVhZG9ubHkgbWlzc2luZz86IGJvb2xlYW47XG59XG5cbmludGVyZmFjZSBNYW5hZ2VkUG9saWN5UmVwb3J0T3B0aW9ucyB7XG4gIC8qKlxuICAgKiBBIGxpc3Qgb2YgSUFNIFBvbGljeSBTdGF0ZW1lbnRzIGF0dGFjaGVkIHRvIHRoZVxuICAgKiBtYW5hZ2VkIHBvbGljeVxuICAgKi9cbiAgcmVhZG9ubHkgcG9saWN5U3RhdGVtZW50czogc3RyaW5nW107XG5cbiAgLyoqXG4gICAqIEEgbGlzdCBvZiBJQU0gcm9sZSBjb25zdHJ1Y3QgcGF0aHMgdGhhdCBhcmUgYXR0YWNoZWQgdG8gdGhlIG1hbmFnZWQgcG9saWN5XG4gICAqXG4gICAqIEBkZWZhdWx0IC0gbm8gcm9sZXMgYXJlIGF0dGFjaGVkIHRvIHRoZSBwb2xpY3lcbiAgICovXG4gIHJlYWRvbmx5IHJvbGVzPzogc3RyaW5nW107XG59XG5cbmludGVyZmFjZSBQb2xpY3lSZXBvcnQge1xuICByZWFkb25seSByb2xlczogUG9saWN5UmVwb3J0Um9sZVtdO1xufVxuXG4vKipcbiAqIFRoZSBzdHJ1Y3R1cmUgb2YgdGhlIHBvbGljeSByZXBvcnRcbiAqL1xuaW50ZXJmYWNlIFBvbGljeVJlcG9ydFJvbGUge1xuICAvKipcbiAgICogVGhlIGFic29sdXRlIHBhdGggb2YgdGhlIHJvbGUgY29uc3RydWN0XG4gICAqL1xuICByZWFkb25seSByb2xlQ29uc3RydWN0UGF0aDogc3RyaW5nO1xuICAvKipcbiAgICogVGhlIHBoeXNpY2FsIG5hbWUgb2YgdGhlIElBTSByb2xlXG4gICAqXG4gICAqIElmIHRoZSB1c2VyIGhhcyBub3QgcHJvdmlkZWQgYSBwcmVjcmVhdGVkIHBoeXNpY2FsIG5hbWVcbiAgICogdGhpcyB3aWxsIGJlICdtaXNzaW5nIHJvbGUnXG4gICAqL1xuICByZWFkb25seSByb2xlTmFtZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIG9yIG5vdCB0aGUgdXNlciBoYXMgcHJvdmlkZWQgYSBwcmVjcmVhdGVkIHBoeXNpY2FsIG5hbWVcbiAgICpcbiAgICogQGRlZmF1bHQgZmFsc2VcbiAgICovXG4gIHJlYWRvbmx5IG1pc3Npbmc/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBUaGUgYXNzdW1lIHJvbGUgKHRydXN0KSBwb2xpY3kgb2YgdGhlIHJvbGVcbiAgICpcbiAgICogQGRlZmF1bHQgLSBubyBhc3N1bWUgcm9sZSBwb2xpY3lcbiAgICovXG4gIHJlYWRvbmx5IGFzc3VtZVJvbGVQb2xpY3k/OiBzdHJpbmdbXTtcblxuICAvKipcbiAgICogVGhlIG1hbmFnZWQgcG9saWN5IEFSTnMgdGhhdCBoYXZlIGJlZW4gYXR0YWNoZWQgdG8gdGhlIHJvbGVcbiAgICpcbiAgICogQGRlZmF1bHQgLSBubyBtYW5hZ2VkIHBvbGljeSBBUk5zXG4gICAqL1xuICByZWFkb25seSBtYW5hZ2VkUG9saWN5QXJucz86IHN0cmluZ1tdLFxuXG4gIC8qKlxuICAgKiBUaGUgbWFuYWdlZCBwb2xpY3kgc3RhdGVtZW50cyB0aGF0IGhhdmUgYmVlbiBhdHRhY2hlZCB0byB0aGUgcm9sZVxuICAgKlxuICAgKiBAZGVmYXVsdCAtIG5vIG1hbmFnZWQgcG9saWN5IHN0YXRlbWVudHNcbiAgICovXG4gIHJlYWRvbmx5IG1hbmFnZWRQb2xpY3lTdGF0ZW1lbnRzPzogc3RyaW5nW107XG5cbiAgLyoqXG4gICAqIFRoZSBwb2xpY3kgc3RhdGVtZW50cyB0aGF0IGhhdmUgYmVlbiBhdHRhY2hlZCB0byB0aGUgcm9sZVxuICAgKiBhcyBpbmxpbmUgc3RhdGVtZW50c1xuICAgKlxuICAgKiBAZGVmYXVsdCAtIG5vIGlubGluZSBzdGF0ZW1lbnRzXG4gICAqL1xuICByZWFkb25seSBpZGVudGl0eVBvbGljeVN0YXRlbWVudHM/OiBzdHJpbmdbXTtcbn1cblxuLyoqXG4gKiBBIGNvbnN0cnVjdCB0aGF0IGlzIHJlc3BvbnNpYmxlIGZvciBnZW5lcmF0aW5nIGFuIElBTSBwb2xpY3kgUmVwb3J0XG4gKiBmb3IgYWxsIElBTSByb2xlcyB0aGF0IGFyZSBjcmVhdGVkIGFzIHBhcnQgb2YgdGhlIENESyBhcHBsaWNhdGlvbi5cbiAqXG4gKiBUaGUgcmVwb3J0IHdpbGwgY29udGFpbiB0aGUgZm9sbG93aW5nIGluZm9ybWF0aW9uIGZvciBlYWNoIElBTSBSb2xlIGluIHRoZSBhcHA6XG4gKlxuICogMS4gSXMgdGhlIHJvbGUgXCJtaXNzaW5nXCIgKG5vdCBwcm92aWRlZCBpbiB0aGUgY3VzdG9taXplUm9sZXMudXNlUHJlY3JlYXRlZFJvbGVzKT9cbiAqIDIuIFRoZSBBc3N1bWVSb2xlIFBvbGljeSAoQUtBIFRydXN0IFBvbGljeSlcbiAqIDMuIEFueSBcIklkZW50aXR5XCIgcG9saWNpZXMgKGkuZS4gcG9saWNpZXMgYXR0YWNoZWQgdG8gdGhlIHJvbGUpXG4gKiA0LiBBbnkgTWFuYWdlZCBwb2xpY2llc1xuICovXG5leHBvcnQgY2xhc3MgUG9saWN5U3ludGhlc2l6ZXIgZXh0ZW5kcyBDb25zdHJ1Y3Qge1xuICBwdWJsaWMgc3RhdGljIGdldE9yQ3JlYXRlKHNjb3BlOiBDb25zdHJ1Y3QpOiBQb2xpY3lTeW50aGVzaXplciB7XG4gICAgY29uc3Qgc3ludGhlc2l6ZXIgPSBzY29wZS5ub2RlLnJvb3Qubm9kZS50cnlGaW5kQ2hpbGQoUE9MSUNZX1NZTlRIRVNJWkVSX0lEKTtcbiAgICBpZiAoc3ludGhlc2l6ZXIpIHtcbiAgICAgIHJldHVybiBzeW50aGVzaXplciBhcyBQb2xpY3lTeW50aGVzaXplcjtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBQb2xpY3lTeW50aGVzaXplcihzY29wZS5ub2RlLnJvb3QpO1xuICB9XG5cbiAgcHJpdmF0ZSByZWFkb25seSByb2xlUmVwb3J0OiB7IFtyb2xlUGF0aDogc3RyaW5nXTogUm9sZVJlcG9ydE9wdGlvbnMgfSA9IHt9O1xuICBwcml2YXRlIHJlYWRvbmx5IG1hbmFnZWRQb2xpY3lSZXBvcnQ6IHsgW3BvbGljeVBhdGg6IHN0cmluZ106IE1hbmFnZWRQb2xpY3lSZXBvcnRPcHRpb25zIH0gPSB7fTtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCkge1xuICAgIHN1cGVyKHNjb3BlLCBQT0xJQ1lfU1lOVEhFU0laRVJfSUQpO1xuXG4gICAgYXR0YWNoQ3VzdG9tU3ludGhlc2lzKHRoaXMsIHtcbiAgICAgIG9uU3ludGhlc2l6ZTogKHNlc3Npb246IElTeW50aGVzaXNTZXNzaW9uKSA9PiB7XG4gICAgICAgIGNvbnN0IHJlcG9ydCA9IHRoaXMuY3JlYXRlSnNvblJlcG9ydCgpO1xuICAgICAgICBpZiAocmVwb3J0LnJvbGVzPy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgY29uc3QgZmlsZVBhdGggPSBwYXRoLmpvaW4oc2Vzc2lvbi5vdXRkaXIsICdpYW0tcG9saWN5LXJlcG9ydCcpO1xuICAgICAgICAgIGZzLndyaXRlRmlsZVN5bmMoZmlsZVBhdGgrJy50eHQnLCB0aGlzLmNyZWF0ZUh1bWFuUmVwb3J0KHJlcG9ydCkpO1xuICAgICAgICAgIGZzLndyaXRlRmlsZVN5bmMoZmlsZVBhdGgrJy5qc29uJywgSlNPTi5zdHJpbmdpZnkocmVwb3J0LCB1bmRlZmluZWQsIDIpKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgY3JlYXRlSnNvblJlcG9ydCgpOiBQb2xpY3lSZXBvcnQge1xuICAgIHJldHVybiBPYmplY3QuZW50cmllcyh0aGlzLnJvbGVSZXBvcnQpLnJlZHVjZSgoYWNjLCBba2V5LCB2YWx1ZV0pID0+IHtcbiAgICAgIGNvbnN0IHsgcG9saWN5QXJucywgcG9saWN5U3RhdGVtZW50cyB9ID0gdGhpcy5yZW5kZXJNYW5hZ2VkUG9saWNpZXNGb3JSb2xlKGtleSwgdmFsdWUubWFuYWdlZFBvbGljaWVzKTtcbiAgICAgIGFjYyA9IHtcbiAgICAgICAgcm9sZXM6IFtcbiAgICAgICAgICAuLi5hY2Mucm9sZXMgPz8gW10sXG4gICAgICAgICAge1xuICAgICAgICAgICAgcm9sZUNvbnN0cnVjdFBhdGg6IGtleSxcbiAgICAgICAgICAgIHJvbGVOYW1lOiB2YWx1ZS5taXNzaW5nID8gJ21pc3Npbmcgcm9sZScgOiB2YWx1ZS5yb2xlTmFtZSEsXG4gICAgICAgICAgICBtaXNzaW5nOiB2YWx1ZS5taXNzaW5nLFxuICAgICAgICAgICAgYXNzdW1lUm9sZVBvbGljeTogdGhpcy5yZXNvbHZlUmVmZXJlbmNlcyh2YWx1ZS5hc3N1bWVSb2xlUG9saWN5KSxcbiAgICAgICAgICAgIG1hbmFnZWRQb2xpY3lBcm5zOiB0aGlzLnJlc29sdmVSZWZlcmVuY2VzKHBvbGljeUFybnMpLFxuICAgICAgICAgICAgbWFuYWdlZFBvbGljeVN0YXRlbWVudHM6IHRoaXMucmVzb2x2ZVJlZmVyZW5jZXMocG9saWN5U3RhdGVtZW50cyksXG4gICAgICAgICAgICBpZGVudGl0eVBvbGljeVN0YXRlbWVudHM6IHRoaXMucmVzb2x2ZVJlZmVyZW5jZXModmFsdWUucG9saWN5U3RhdGVtZW50cyksXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH07XG4gICAgICByZXR1cm4gYWNjO1xuICAgIH0sIHt9IGFzIFBvbGljeVJlcG9ydCk7XG4gIH1cblxuICBwcml2YXRlIGNyZWF0ZUh1bWFuUmVwb3J0KHJlcG9ydDogUG9saWN5UmVwb3J0KTogc3RyaW5nIHtcbiAgICByZXR1cm4gcmVwb3J0LnJvbGVzLm1hcChyb2xlID0+IFtcbiAgICAgIGA8JHtyb2xlLm1pc3NpbmcgPyAnbWlzc2luZyByb2xlJyA6IHJvbGUucm9sZU5hbWV9PiAoJHtyb2xlLnJvbGVDb25zdHJ1Y3RQYXRofSlgLFxuICAgICAgJycsXG4gICAgICAnQXNzdW1lUm9sZSBQb2xpY3k6JyxcbiAgICAgIC4uLnRoaXMudG9Kc29uU3RyaW5nKHJvbGUuYXNzdW1lUm9sZVBvbGljeSksXG4gICAgICAnJyxcbiAgICAgICdNYW5hZ2VkIFBvbGljeSBBUk5zOicsXG4gICAgICAuLi50aGlzLnRvSnNvblN0cmluZyhyb2xlLm1hbmFnZWRQb2xpY3lBcm5zKSxcbiAgICAgICcnLFxuICAgICAgJ01hbmFnZWQgUG9saWNpZXMgU3RhdGVtZW50czonLFxuICAgICAgdGhpcy50b0pzb25TdHJpbmcocm9sZS5tYW5hZ2VkUG9saWN5U3RhdGVtZW50cyksXG4gICAgICAnJyxcbiAgICAgICdJZGVudGl0eSBQb2xpY3kgU3RhdGVtZW50czonLFxuICAgICAgdGhpcy50b0pzb25TdHJpbmcocm9sZS5pZGVudGl0eVBvbGljeVN0YXRlbWVudHMpLFxuICAgIF0uam9pbignXFxuJykpLmpvaW4oJycpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRha2VzIGEgdmFsdWUgYW5kIHJldHVybnMgYSBmb3JtYXR0ZWQgSlNPTiBzdHJpbmdcbiAgICovXG4gIHByaXZhdGUgdG9Kc29uU3RyaW5nKHZhbHVlPzogYW55KTogc3RyaW5nW10ge1xuICAgIGlmICgoQXJyYXkuaXNBcnJheSh2YWx1ZSkgJiYgdmFsdWUubGVuZ3RoID09PSAwKSB8fCAhdmFsdWUpIHtcbiAgICAgIHJldHVybiBbJ05PTkUnXTtcbiAgICB9XG5cbiAgICByZXR1cm4gW0pTT04uc3RyaW5naWZ5KHsgdmFsdWVzOiB2YWx1ZSB9LnZhbHVlcywgdW5kZWZpbmVkLCAyKV07XG4gIH1cblxuICAvKipcbiAgICogSUFNIG1hbmFnZWQgcG9saWNpZXMgY2FuIGJlIGF0dGFjaGVkIHRvIGEgcm9sZSB1c2luZyBhIGNvdXBsZSBkaWZmZXJlbnQgbWV0aG9kcy5cbiAgICpcbiAgICogMS4gWW91IGNhbiB1c2UgYW4gZXhpc3RpbmcgbWFuYWdlZCBwb2xpY3ksIGkuZS4gTWFuYWdlZFBvbGljeS5mcm9tTWFuYWdlZFBvbGljeU5hbWUoKVxuICAgKiAyLiBZb3UgY2FuIGNyZWF0ZSBhIG1hbmFnZWQgcG9saWN5IGFuZCBhdHRhY2ggdGhlIHJvbGUsIGkuZS5cbiAgICogICBuZXcgTWFuYWdlZFBvbGljeShzY29wZSwgJ01hbmFnZWRQb2xpY3knLCB7IHJvbGVzOiBbbXlSb2xlXSB9KTtcbiAgICogMy4gWW91IGNhbiBjcmVhdGUgYSBtYW5hZ2VkIHBvbGljeSBhbmQgYXR0YWNoIGl0IHRvIHRoZSByb2xlLCBpLmUuXG4gICAqICAgY29uc3Qgcm9sZSA9IG5ldyBSb2xlKC4uLik7XG4gICAqICAgcm9sZS5hZGRNYW5hZ2VkUG9saWN5KG5ldyBNYW5hZ2VkUG9saWN5KC4uLikpO1xuICAgKlxuICAgKiBGb3IgMSwgQ0RLIGlzIG5vdCBjcmVhdGluZyB0aGUgbWFuYWdlZCBwb2xpY3kgc28gd2UganVzdCBuZWVkIHRvIHJlcG9ydCB0aGUgQVJOXG4gICAqIG9mIHRoZSBwb2xpY3kgdGhhdCBuZWVkcyB0byBiZSBhdHRhY2hlZCB0byB0aGUgcm9sZS5cbiAgICpcbiAgICogRm9yIDIgJiAzLCBDREsgX2lzXyBjcmVhdGluZyB0aGUgbWFuYWdlZCBwb2xpY3kgc28gaW5zdGVhZCBvZiByZXBvcnRpbmcgdGhlIG5hbWUgb3IgQVJOIG9mIHRoZVxuICAgKiBwb2xpY3kgKHRoYXQgd2UgcHJldmVudGVkIGJlaW5nIGNyZWF0ZWQpIHdlIHNob3VsZCBpbnN0ZWFkIHJlcG9ydCB0aGUgcG9saWN5IHN0YXRlbWVudHNcbiAgICogdGhhdCBhcmUgcGFydCBvZiB0aGF0IGRvY3VtZW50LiBJdCBkb2Vzbid0IHJlYWxseSBtYXR0ZXIgaWYgdGhlIGFkbWlucyBjcmVhdGluZyB0aGUgcm9sZXMgdGhlblxuICAgKiBkZWNpZGUgdG8gdXNlIG1hbmFnZWQgcG9saWNpZXMgb3IgaW5saW5lIHBvbGljaWVzLCBldGMuXG4gICAqXG4gICAqIFRoZXJlIGNvdWxkIGJlIG1hbmFnZWQgcG9saWNpZXMgdGhhdCBhcmUgY3JlYXRlZCBhbmQgX25vdF8gYXR0YWNoZWQgdG8gYW55IHJvbGVzLCBpbiB0aGF0IGNhc2VcbiAgICogd2UgZG8gbm90IHJlcG9ydCBhbnl0aGluZy4gVGhhdCBtYW5hZ2VkIHBvbGljeSBpcyBub3QgYmVpbmcgY3JlYXRlZCBhdXRvbWF0aWNhbGx5IGJ5IG91ciBjb25zdHJ1Y3RzLlxuICAgKi9cbiAgcHJpdmF0ZSByZW5kZXJNYW5hZ2VkUG9saWNpZXNGb3JSb2xlKFxuICAgIHJvbGVQYXRoOiBzdHJpbmcsXG4gICAgbWFuYWdlZFBvbGljaWVzOiBhbnlbXSxcbiAgKTogeyBwb2xpY3lBcm5zOiBzdHJpbmdbXSwgcG9saWN5U3RhdGVtZW50czogc3RyaW5nW10gfSB7XG4gICAgY29uc3QgcG9saWN5U3RhdGVtZW50czogc3RyaW5nW10gPSBbXTtcbiAgICAvLyBtYW5hZ2VkIHBvbGljaWVzIHRoYXQgaGF2ZSByb2xlcyBhdHRhY2hlZCB0byB0aGUgcG9saWN5XG4gICAgT2JqZWN0LnZhbHVlcyh0aGlzLm1hbmFnZWRQb2xpY3lSZXBvcnQpLmZvckVhY2godmFsdWUgPT4ge1xuICAgICAgaWYgKHZhbHVlLnJvbGVzPy5pbmNsdWRlcyhyb2xlUGF0aCkpIHtcbiAgICAgICAgcG9saWN5U3RhdGVtZW50cy5wdXNoKC4uLnZhbHVlLnBvbGljeVN0YXRlbWVudHMpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGNvbnN0IHBvbGljeUFybnM6IHN0cmluZ1tdID0gW107XG4gICAgbWFuYWdlZFBvbGljaWVzLmZvckVhY2gocG9saWN5ID0+IHtcbiAgICAgIGlmIChDb25zdHJ1Y3QuaXNDb25zdHJ1Y3QocG9saWN5KSkge1xuICAgICAgICBpZiAodGhpcy5tYW5hZ2VkUG9saWN5UmVwb3J0Lmhhc093blByb3BlcnR5KHBvbGljeS5ub2RlLnBhdGgpKSB7XG4gICAgICAgICAgcG9saWN5U3RhdGVtZW50cy5wdXNoKC4uLnRoaXMubWFuYWdlZFBvbGljeVJlcG9ydFtwb2xpY3kubm9kZS5wYXRoXS5wb2xpY3lTdGF0ZW1lbnRzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBqdXN0IGFkZCB0aGUgYXJuXG4gICAgICAgICAgcG9saWN5QXJucy5wdXNoKChwb2xpY3kgYXMgYW55KS5tYW5hZ2VkUG9saWN5QXJuKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcG9saWN5QXJucy5wdXNoKHBvbGljeS5tYW5hZ2VkUG9saWN5QXJuKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4ge1xuICAgICAgcG9saWN5QXJucyxcbiAgICAgIHBvbGljeVN0YXRlbWVudHMsXG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXNvbHZlIGFueSByZWZlcmVuY2VzIGFuZCByZXBsYWNlIHdpdGggYSBtb3JlIHVzZXIgZnJpZW5kbHkgdmFsdWUuIFRoaXMgaXMgdGhlIHZhbHVlXG4gICAqIHRoYXQgd2lsbCBhcHBlYXIgaW4gdGhlIHJlcG9ydCwgc28gaW5zdGVhZCBvZiBnZXR0aW5nIHNvbWV0aGluZyBsaWtlIHRoaXMgKG5vdCB2ZXJ5IHVzZWZ1bCk6XG4gICAqXG4gICAqICAgICBcIlJlc291cmNlXCI6IHtcbiAgICogICAgICAgXCJGbjo6Sm9pblwiOiBbXG4gICAqICAgICAgICAgXCJcIixcbiAgICogICAgICAgICBbXG4gICAqICAgICAgICAgICBcImFybjpcIixcbiAgICogICAgICAgICAgIHtcbiAgICogICAgICAgICAgICAgXCJSZWZcIjogXCJBV1M6OlBhcnRpdGlvblwiXG4gICAqICAgICAgICAgICB9LFxuICAgKiAgICAgICAgICAgXCI6aWFtOjpcIixcbiAgICogICAgICAgICAgIHtcbiAgICogICAgICAgICAgICAgXCJSZWZcIjogXCJBV1M6OkFjY291bnRJZFwiXG4gICAqICAgICAgICAgICB9LFxuICAgKiAgICAgICAgICAgXCI6cm9sZS9Sb2xlXCJcbiAgICogICAgICAgICBdXG4gICAqICAgICAgIF1cbiAgICogICAgIH1cbiAgICpcbiAgICogV2Ugd2lsbCBpbnN0ZWFkIGdldDpcbiAgICpcbiAgICogICAgIFwiUmVzb3VyY2VcIjogXCJhcm46KFBBUlRJVElPTik6aWFtOjooQUNDT1VOVCk6cm9sZS9Sb2xlXCJcbiAgICpcbiAgICogT3IgaWYgcmVmZXJlbmNpbmcgYSByZXNvdXJjZSBhdHRyaWJ1dGVcbiAgICpcbiAgICogICAgIFwiUmVzb3VyY2VcIjoge1xuICAgKiAgICAgICBcIkZuOjpHZXRBdHRcIjogW1xuICAgKiAgICAgICAgIFwiU29tZVJlc291cmNlXCIsXG4gICAqICAgICAgICAgXCJBcm5cIlxuICAgKiAgICAgICBdXG4gICAqICAgICB9XG4gICAqXG4gICAqIEJlY29tZXNcbiAgICpcbiAgICogICAgIFwiKFBhdGgvVG8vU29tZVJlc291cmNlLkFybilcIlxuICAgKi9cbiAgcHJpdmF0ZSByZXNvbHZlUmVmZXJlbmNlcyhyZWY6IGFueSk6IGFueSB7XG4gICAgaWYgKChBcnJheS5pc0FycmF5KHJlZikgJiYgcmVmLmxlbmd0aCA9PT0gMCkgfHwgIXJlZikge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cbiAgICBpZiAoQXJyYXkuaXNBcnJheShyZWYpKSB7XG4gICAgICByZXR1cm4gcmVmLm1hcChyID0+IHRoaXMucmVzb2x2ZVJlZmVyZW5jZXMocikpO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIHJlZiA9PT0gJ29iamVjdCcpIHtcbiAgICAgIHJldHVybiB0aGlzLnJlc29sdmVKc29uT2JqZWN0KHJlZik7XG4gICAgfVxuICAgIGNvbnN0IHJlc29sdmFibGUgPSBUb2tlbml6YXRpb24ucmV2ZXJzZVN0cmluZyhyZWYpO1xuICAgIGlmIChyZXNvbHZhYmxlLmxlbmd0aCA9PT0gMSAmJiBSZWZlcmVuY2UuaXNSZWZlcmVuY2UocmVzb2x2YWJsZS5maXJzdFRva2VuKSkge1xuICAgICAgcmV0dXJuIGAoJHtyZXNvbHZhYmxlLmZpcnN0VG9rZW4udGFyZ2V0Lm5vZGUucGF0aH0uJHtyZXNvbHZhYmxlLmZpcnN0VG9rZW4uZGlzcGxheU5hbWV9KWA7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IHJlc29sdmVkVG9rZW5zID0gcmVzb2x2YWJsZS5tYXBUb2tlbnMoe1xuICAgICAgICBtYXBUb2tlbjogKHI6IElSZXNvbHZhYmxlKSA9PiB7XG4gICAgICAgICAgaWYgKFJlZmVyZW5jZS5pc1JlZmVyZW5jZShyKSkge1xuICAgICAgICAgICAgcmV0dXJuIGAoJHtyLnRhcmdldC5ub2RlLnBhdGh9LiR7ci5kaXNwbGF5TmFtZX0pYDtcbiAgICAgICAgICB9XG4gICAgICAgICAgY29uc3QgcmVzb2x2ZWQgPSBUb2tlbml6YXRpb24ucmVzb2x2ZShyLCB7XG4gICAgICAgICAgICBzY29wZTogdGhpcyxcbiAgICAgICAgICAgIHJlc29sdmVyOiBuZXcgRGVmYXVsdFRva2VuUmVzb2x2ZXIobmV3IFN0cmluZ0NvbmNhdCgpKSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBpZiAodHlwZW9mIHJlc29sdmVkID09PSAnb2JqZWN0JyAmJiByZXNvbHZlZC5oYXNPd25Qcm9wZXJ0eSgnUmVmJykpIHtcbiAgICAgICAgICAgIHN3aXRjaCAocmVzb2x2ZWQuUmVmKSB7XG4gICAgICAgICAgICAgIGNhc2UgJ0FXUzo6QWNjb3VudElkJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gJyhBQ0NPVU5UKSc7XG4gICAgICAgICAgICAgIGNhc2UgJ0FXUzo6UGFydGl0aW9uJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gJyhQQVJUSVRJT04pJztcbiAgICAgICAgICAgICAgY2FzZSAnQVdTOjpSZWdpb24nOlxuICAgICAgICAgICAgICAgIHJldHVybiAnKFJFR0lPTiknO1xuICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHJldHVybiByO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gcjtcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHJlc29sdmVkVG9rZW5zLmpvaW4obmV3IFN0cmluZ0NvbmNhdCgpKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHJlc29sdmVKc29uT2JqZWN0KHN0YXRlbWVudDogeyBba2V5OiBzdHJpbmddOiBhbnkgfSk6IGFueSB7XG4gICAgY29uc3QgbmV3U3RhdGVtZW50ID0gc3RhdGVtZW50O1xuICAgIGZvciAoY29uc3QgW2tleSwgdmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKHN0YXRlbWVudCkpIHtcbiAgICAgIG5ld1N0YXRlbWVudFtrZXldID0gdGhpcy5yZXNvbHZlUmVmZXJlbmNlcyh2YWx1ZSk7XG4gICAgfVxuICAgIHJldHVybiBuZXdTdGF0ZW1lbnQ7XG4gIH1cblxuICAvKipcbiAgICogQWRkIGFuIElBTSByb2xlIHRvIHRoZSByZXBvcnRcbiAgICpcbiAgICogQHBhcmFtIHJvbGVQYXRoIHRoZSBjb25zdHJ1Y3QgcGF0aCBvZiB0aGUgcm9sZVxuICAgKiBAcGFyYW0gb3B0aW9ucyB0aGUgdmFsdWVzIGFzc29jaWF0ZWQgd2l0aCB0aGUgcm9sZVxuICAgKi9cbiAgcHVibGljIGFkZFJvbGUocm9sZVBhdGg6IHN0cmluZywgb3B0aW9uczogUm9sZVJlcG9ydE9wdGlvbnMpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5yb2xlUmVwb3J0Lmhhc093blByb3BlcnR5KHJvbGVQYXRoKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBJQU0gUG9saWN5IFJlcG9ydCBhbHJlYWR5IGhhcyBhbiBlbnRyeSBmb3Igcm9sZTogJHtyb2xlUGF0aH1gKTtcbiAgICB9XG4gICAgdGhpcy5yb2xlUmVwb3J0W3JvbGVQYXRoXSA9IG9wdGlvbnM7XG4gIH1cblxuICAvKipcbiAgICogQWRkIGFuIElBTSBNYW5hZ2VkIFBvbGljeSB0byB0aGUgcmVwb3J0XG4gICAqXG4gICAqIEBwYXJhbSBwb2xpY3lQYXRoIHRoZSBjb25zdHJ1Y3QgcGF0aCBvZiB0aGUgbWFuYWdlZCBwb2xpY3lcbiAgICogQHBhcmFtIG9wdGlvbnMgdGhlIHZhbHVlcyBhc3NvY2lhdGVkIHdpdGggdGhlIG1hbmFnZWQgcG9saWN5XG4gICAqL1xuICBwdWJsaWMgYWRkTWFuYWdlZFBvbGljeShwb2xpY3lQYXRoOiBzdHJpbmcsIG9wdGlvbnM6IE1hbmFnZWRQb2xpY3lSZXBvcnRPcHRpb25zKTogdm9pZCB7XG4gICAgaWYgKHRoaXMubWFuYWdlZFBvbGljeVJlcG9ydC5oYXNPd25Qcm9wZXJ0eShwb2xpY3lQYXRoKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBJQU0gUG9saWN5IFJlcG9ydCBhbHJlYWR5IGhhcyBhbiBlbnRyeSBmb3IgbWFuYWdlZCBwb2xpY3k6ICR7cG9saWN5UGF0aH1gKTtcbiAgICB9XG5cbiAgICB0aGlzLm1hbmFnZWRQb2xpY3lSZXBvcnRbcG9saWN5UGF0aF0gPSBvcHRpb25zO1xuICB9XG59XG5cbi8qKlxuICogUmV0dXJuIGNvbmZpZ3VyYXRpb24gZm9yIHByZWNyZWF0ZWQgcm9sZXNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldFByZWNyZWF0ZWRSb2xlQ29uZmlnKHNjb3BlOiBDb25zdHJ1Y3QsIHJvbGVQYXRoPzogc3RyaW5nKTogQ3VzdG9taXplUm9sZUNvbmZpZyB7XG4gIGNvbnN0IHByZWNyZWF0ZWRSb2xlUGF0aCA9IHJvbGVQYXRoID8/IHNjb3BlLm5vZGUucGF0aDtcbiAgY29uc3QgY3VzdG9taXplUm9sZXNDb250ZXh0ID0gc2NvcGUubm9kZS50cnlHZXRDb250ZXh0KENVU1RPTUlaRV9ST0xFU19DT05URVhUX0tFWSk7XG4gIGlmIChjdXN0b21pemVSb2xlc0NvbnRleHQgIT09IHVuZGVmaW5lZCkge1xuICAgIGNvbnN0IGN1c3RvbWl6ZVJvbGVzID0gY3VzdG9taXplUm9sZXNDb250ZXh0O1xuICAgIGlmIChjdXN0b21pemVSb2xlcy5wcmV2ZW50U3ludGhlc2lzID09PSBmYWxzZSkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgcHJldmVudFN5bnRoZXNpczogZmFsc2UsXG4gICAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICB9O1xuICAgIH1cbiAgICBpZiAoY3VzdG9taXplUm9sZXMudXNlUHJlY3JlYXRlZFJvbGVzPy5oYXNPd25Qcm9wZXJ0eShwcmVjcmVhdGVkUm9sZVBhdGgpKSB7XG4gICAgICBpZiAoVG9rZW4uaXNVbnJlc29sdmVkKGN1c3RvbWl6ZVJvbGVzLnVzZVByZWNyZWF0ZWRSb2xlc1twcmVjcmVhdGVkUm9sZVBhdGhdKSkge1xuICAgICAgICAvLyB3ZSBkbyBub3Qgd2FudCB0byBmYWlsIHN5bnRoZXNpc1xuICAgICAgICBBbm5vdGF0aW9ucy5vZihzY29wZSkuYWRkRXJyb3IoXG4gICAgICAgICAgYENhbm5vdCByZXNvbHZlIHByZWNyZWF0ZWQgcm9sZSBuYW1lIGF0IHBhdGggXCIke3ByZWNyZWF0ZWRSb2xlUGF0aH1cIi4gVGhlIHZhbHVlIG1heSBiZSBhIHRva2VuLmAsXG4gICAgICAgICk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICAgICAgcHJldmVudFN5bnRoZXNpczogdHJ1ZSxcbiAgICAgICAgICBwcmVjcmVhdGVkUm9sZU5hbWU6IGN1c3RvbWl6ZVJvbGVzLnVzZVByZWNyZWF0ZWRSb2xlc1twcmVjcmVhdGVkUm9sZVBhdGhdLFxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyB3ZSBkbyBub3Qgd2FudCB0byBmYWlsIHN5bnRoZXNpc1xuICAgICAgQW5ub3RhdGlvbnMub2Yoc2NvcGUpLmFkZEVycm9yKFxuICAgICAgICBgSUFNIFJvbGUgaXMgYmVpbmcgY3JlYXRlZCBhdCBwYXRoIFwiJHtwcmVjcmVhdGVkUm9sZVBhdGh9XCIgYW5kIGN1c3RvbWl6ZVJvbGVzLnByZXZlbnRTeW50aGVzaXMgaXMgZW5hYmxlZC4gYCArXG4gICAgICAgICAgJ1lvdSBtdXN0IHByb3ZpZGUgYSBwcmVjcmVhdGVkIHJvbGUgbmFtZSBpbiBjdXN0b21pemVSb2xlcy5wcmVjcmVhdGVkUm9sZXMnLFxuICAgICAgKTtcbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICBwcmV2ZW50U3ludGhlc2lzOiB0cnVlLFxuICAgIH07XG4gIH1cbiAgcmV0dXJuIHsgZW5hYmxlZDogZmFsc2UgfTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBDdXN0b21pemVSb2xlQ29uZmlnIHtcbiAgLyoqXG4gICAqIFdoZXRoZXIgb3Igbm90IGN1c3RvbWl6ZWQgcm9sZXMgaXMgZW5hYmxlZC5cbiAgICpcbiAgICogVGhpcyB3aWxsIGJlIHRydWUgaWYgdGhlIHVzZXIgY2FsbHMgUm9sZS5jdXN0b21pemVSb2xlcygpXG4gICAqL1xuICByZWFkb25seSBlbmFibGVkOiBib29sZWFuO1xuICAvKipcbiAgICogV2hldGhlciBvciBub3QgdGhlIHJvbGUgQ0ZOIHJlc291cmNlIHNob3VsZCBiZSBzeW50aGVzaXplZFxuICAgKiBpbiB0aGUgdGVtcGxhdGVcbiAgICpcbiAgICogQGRlZmF1bHQgLSBmYWxzZSBpZiBlbmFibGVkPWZhbHNlIG90aGVyd2lzZSB0cnVlXG4gICAqL1xuICByZWFkb25seSBwcmV2ZW50U3ludGhlc2lzPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogVGhlIHBoeXNpY2FsIG5hbWUgb2YgdGhlIHByZWNyZWF0ZWQgcm9sZS5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBubyBwcmVjcmVhdGVkIHJvbGVcbiAgICovXG4gIHJlYWRvbmx5IHByZWNyZWF0ZWRSb2xlTmFtZT86IHN0cmluZztcbn1cblxuZXhwb3J0IGNvbnN0IENVU1RPTUlaRV9ST0xFU19DT05URVhUX0tFWSA9ICdAYXdzLWNkay9pYW06Y3VzdG9taXplUm9sZXMnO1xuZXhwb3J0IGZ1bmN0aW9uIGdldEN1c3RvbWl6ZVJvbGVzQ29uZmlnKHNjb3BlOiBDb25zdHJ1Y3QpOiBDdXN0b21pemVSb2xlQ29uZmlnIHtcbiAgY29uc3QgY3VzdG9taXplUm9sZXNDb250ZXh0ID0gc2NvcGUubm9kZS50cnlHZXRDb250ZXh0KENVU1RPTUlaRV9ST0xFU19DT05URVhUX0tFWSk7XG4gIHJldHVybiB7XG4gICAgcHJldmVudFN5bnRoZXNpczogY3VzdG9taXplUm9sZXNDb250ZXh0ICE9PSB1bmRlZmluZWQgJiYgY3VzdG9taXplUm9sZXNDb250ZXh0LnByZXZlbnRTeW50aGVzaXMgIT09IGZhbHNlLFxuICAgIGVuYWJsZWQ6IGN1c3RvbWl6ZVJvbGVzQ29udGV4dCAhPT0gdW5kZWZpbmVkLFxuICB9O1xufVxuIl19