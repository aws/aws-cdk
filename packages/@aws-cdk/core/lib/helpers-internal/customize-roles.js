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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3VzdG9taXplLXJvbGVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY3VzdG9taXplLXJvbGVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHlCQUF5QjtBQUN6Qiw2QkFBNkI7QUFDN0IsMkNBQXVDO0FBQ3ZDLGdEQUE2QztBQUM3QyxnQ0FBK0M7QUFDL0MsNENBQXlDO0FBQ3pDLDhDQUFnRjtBQUVoRixvQ0FBK0M7QUFFbEMsUUFBQSxxQkFBcUIsR0FBRyxtQkFBbUIsQ0FBQztBQWtIekQ7Ozs7Ozs7Ozs7R0FVRztBQUNILE1BQWEsaUJBQWtCLFNBQVEsc0JBQVM7SUFDdkMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxLQUFnQjtRQUN4QyxNQUFNLFdBQVcsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLDZCQUFxQixDQUFDLENBQUM7UUFDN0UsSUFBSSxXQUFXLEVBQUU7WUFDZixPQUFPLFdBQWdDLENBQUM7U0FDekM7UUFDRCxPQUFPLElBQUksaUJBQWlCLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUMvQztJQUlELFlBQVksS0FBZ0I7UUFDMUIsS0FBSyxDQUFDLEtBQUssRUFBRSw2QkFBcUIsQ0FBQyxDQUFDO1FBSHJCLGVBQVUsR0FBOEMsRUFBRSxDQUFDO1FBQzNELHdCQUFtQixHQUF5RCxFQUFFLENBQUM7UUFJOUYsSUFBQSwyQkFBcUIsRUFBQyxJQUFJLEVBQUU7WUFDMUIsWUFBWSxFQUFFLENBQUMsT0FBMEIsRUFBRSxFQUFFO2dCQUMzQyxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztnQkFDdkMsSUFBSSxNQUFNLENBQUMsS0FBSyxFQUFFLE1BQU0sR0FBRyxDQUFDLEVBQUU7b0JBQzVCLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxtQkFBbUIsQ0FBQyxD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aUJBQU07Z0JBQ0wsT0FBTztvQkFDTCxPQUFPLEVBQUUsSUFBSTtvQkFDYixnQkFBZ0IsRUFBRSxJQUFJO29CQUN0QixrQkFBa0IsRUFBRSxjQUFjLENBQUMsa0JBQWtCLENBQUMsa0JBQWtCLENBQUM7aUJBQzFFLENBQUM7YUFDSDtTQUNGO2FBQU07WUFDTCxtQ0FBbUM7WUFDbkMseUJBQVcsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsUUFBUSxDQUM1QixzQ0FBc0Msa0JBQWtCLG9EQUFvRDtnQkFDMUcsMkVBQTJFLENBQzlFLENBQUM7U0FDSDtRQUNELE9BQU87WUFDTCxPQUFPLEVBQUUsSUFBSTtZQUNiLGdCQUFnQixFQUFFLElBQUk7U0FDdkIsQ0FBQztLQUNIO0lBQ0QsT0FBTyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsQ0FBQztBQUM1QixDQUFDO0FBckNELDBEQXFDQztBQXlCWSxRQUFBLDJCQUEyQixHQUFHLDZCQUE2QixDQUFDO0FBQ3pFLFNBQWdCLHVCQUF1QixDQUFDLEtBQWdCO0lBQ3RELE1BQU0scUJBQXFCLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsbUNBQTJCLENBQUMsQ0FBQztJQUNwRixPQUFPO1FBQ0wsZ0JBQWdCLEVBQUUscUJBQXFCLEtBQUssU0FBUyxJQUFJLHFCQUFxQixDQUFDLGdCQUFnQixLQUFLLEtBQUs7UUFDekcsT0FBTyxFQUFFLHFCQUFxQixLQUFLLFNBQVM7S0FDN0MsQ0FBQztBQUNKLENBQUM7QUFORCwwREFNQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGZzIGZyb20gJ2ZzJztcbmltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IEFubm90YXRpb25zIH0gZnJvbSAnLi4vYW5ub3RhdGlvbnMnO1xuaW1wb3J0IHsgYXR0YWNoQ3VzdG9tU3ludGhlc2lzIH0gZnJvbSAnLi4vYXBwJztcbmltcG9ydCB7IFJlZmVyZW5jZSB9IGZyb20gJy4uL3JlZmVyZW5jZSc7XG5pbXBvcnQgeyBJUmVzb2x2YWJsZSwgRGVmYXVsdFRva2VuUmVzb2x2ZXIsIFN0cmluZ0NvbmNhdCB9IGZyb20gJy4uL3Jlc29sdmFibGUnO1xuaW1wb3J0IHsgSVN5bnRoZXNpc1Nlc3Npb24gfSBmcm9tICcuLi9zdGFjay1zeW50aGVzaXplcnMnO1xuaW1wb3J0IHsgVG9rZW4sIFRva2VuaXphdGlvbiB9IGZyb20gJy4uL3Rva2VuJztcblxuZXhwb3J0IGNvbnN0IFBPTElDWV9TWU5USEVTSVpFUl9JRCA9ICdQb2xpY3lTeW50aGVzaXplcic7XG5cbi8qKlxuICogT3B0aW9ucyBmb3IgZ2VuZXJhdGluZyB0aGUgcm9sZSBwb2xpY3kgcmVwb3J0XG4gKi9cbmludGVyZmFjZSBSb2xlUmVwb3J0T3B0aW9ucyB7XG4gIC8qKlxuICAgKiBUaGUgbmFtZSBvZiB0aGUgSUFNIHJvbGUuXG4gICAqXG4gICAqIElmIHRoaXMgaXMgbm90IHByb3ZpZGVkIHRoZSByb2xlIHdpbGwgYmUgYXNzdW1lZFxuICAgKiB0byBiZSBtaXNzaW5nLlxuICAgKlxuICAgKiBAZGVmYXVsdCAnbWlzc2luZyByb2xlJ1xuICAgKi9cbiAgcmVhZG9ubHkgcm9sZU5hbWU/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEEgbGlzdCBvZiBJQU0gUG9saWN5IFN0YXRlbWVudHNcbiAgICovXG4gIHJlYWRvbmx5IHBvbGljeVN0YXRlbWVudHM6IHN0cmluZ1tdO1xuXG4gIC8qKlxuICAgKiBBIGxpc3Qgb2YgSUFNIE1hbmFnZWQgUG9saWN5IEFSTnNcbiAgICovXG4gIHJlYWRvbmx5IG1hbmFnZWRQb2xpY2llczogYW55W107XG5cbiAgLyoqXG4gICAqIFRoZSB0cnVzdCBwb2xpY3kgZm9yIHRoZSBJQU0gUm9sZS5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBubyB0cnVzdCBwb2xpY3kuXG4gICAqL1xuICByZWFkb25seSBhc3N1bWVSb2xlUG9saWN5Pzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIG9yIG5vdCB0aGUgcm9sZSBpcyBtaXNzaW5nIGZyb20gdGhlIGxpc3Qgb2ZcbiAgICogcHJlY3JlYXRlZCByb2xlcy5cbiAgICpcbiAgICogQGRlZmF1bHQgZmFsc2VcbiAgICovXG4gIHJlYWRvbmx5IG1pc3Npbmc/OiBib29sZWFuO1xufVxuXG5pbnRlcmZhY2UgTWFuYWdlZFBvbGljeVJlcG9ydE9wdGlvbnMge1xuICAvKipcbiAgICogQSBsaXN0IG9mIElBTSBQb2xpY3kgU3RhdGVtZW50cyBhdHRhY2hlZCB0byB0aGVcbiAgICogbWFuYWdlZCBwb2xpY3lcbiAgICovXG4gIHJlYWRvbmx5IHBvbGljeVN0YXRlbWVudHM6IHN0cmluZ1tdO1xuXG4gIC8qKlxuICAgKiBBIGxpc3Qgb2YgSUFNIHJvbGUgY29uc3RydWN0IHBhdGhzIHRoYXQgYXJlIGF0dGFjaGVkIHRvIHRoZSBtYW5hZ2VkIHBvbGljeVxuICAgKlxuICAgKiBAZGVmYXVsdCAtIG5vIHJvbGVzIGFyZSBhdHRhY2hlZCB0byB0aGUgcG9saWN5XG4gICAqL1xuICByZWFkb25seSByb2xlcz86IHN0cmluZ1tdO1xufVxuXG5pbnRlcmZhY2UgUG9saWN5UmVwb3J0IHtcbiAgcmVhZG9ubHkgcm9sZXM6IFBvbGljeVJlcG9ydFJvbGVbXTtcbn1cblxuLyoqXG4gKiBUaGUgc3RydWN0dXJlIG9mIHRoZSBwb2xpY3kgcmVwb3J0XG4gKi9cbmludGVyZmFjZSBQb2xpY3lSZXBvcnRSb2xlIHtcbiAgLyoqXG4gICAqIFRoZSBhYnNvbHV0ZSBwYXRoIG9mIHRoZSByb2xlIGNvbnN0cnVjdFxuICAgKi9cbiAgcmVhZG9ubHkgcm9sZUNvbnN0cnVjdFBhdGg6IHN0cmluZztcbiAgLyoqXG4gICAqIFRoZSBwaHlzaWNhbCBuYW1lIG9mIHRoZSBJQU0gcm9sZVxuICAgKlxuICAgKiBJZiB0aGUgdXNlciBoYXMgbm90IHByb3ZpZGVkIGEgcHJlY3JlYXRlZCBwaHlzaWNhbCBuYW1lXG4gICAqIHRoaXMgd2lsbCBiZSAnbWlzc2luZyByb2xlJ1xuICAgKi9cbiAgcmVhZG9ubHkgcm9sZU5hbWU6IHN0cmluZztcblxuICAvKipcbiAgICogV2hldGhlciBvciBub3QgdGhlIHVzZXIgaGFzIHByb3ZpZGVkIGEgcHJlY3JlYXRlZCBwaHlzaWNhbCBuYW1lXG4gICAqXG4gICAqIEBkZWZhdWx0IGZhbHNlXG4gICAqL1xuICByZWFkb25seSBtaXNzaW5nPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogVGhlIGFzc3VtZSByb2xlICh0cnVzdCkgcG9saWN5IG9mIHRoZSByb2xlXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gbm8gYXNzdW1lIHJvbGUgcG9saWN5XG4gICAqL1xuICByZWFkb25seSBhc3N1bWVSb2xlUG9saWN5Pzogc3RyaW5nW107XG5cbiAgLyoqXG4gICAqIFRoZSBtYW5hZ2VkIHBvbGljeSBBUk5zIHRoYXQgaGF2ZSBiZWVuIGF0dGFjaGVkIHRvIHRoZSByb2xlXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gbm8gbWFuYWdlZCBwb2xpY3kgQVJOc1xuICAgKi9cbiAgcmVhZG9ubHkgbWFuYWdlZFBvbGljeUFybnM/OiBzdHJpbmdbXSxcblxuICAvKipcbiAgICogVGhlIG1hbmFnZWQgcG9saWN5IHN0YXRlbWVudHMgdGhhdCBoYXZlIGJlZW4gYXR0YWNoZWQgdG8gdGhlIHJvbGVcbiAgICpcbiAgICogQGRlZmF1bHQgLSBubyBtYW5hZ2VkIHBvbGljeSBzdGF0ZW1lbnRzXG4gICAqL1xuICByZWFkb25seSBtYW5hZ2VkUG9saWN5U3RhdGVtZW50cz86IHN0cmluZ1tdO1xuXG4gIC8qKlxuICAgKiBUaGUgcG9saWN5IHN0YXRlbWVudHMgdGhhdCBoYXZlIGJlZW4gYXR0YWNoZWQgdG8gdGhlIHJvbGVcbiAgICogYXMgaW5saW5lIHN0YXRlbWVudHNcbiAgICpcbiAgICogQGRlZmF1bHQgLSBubyBpbmxpbmUgc3RhdGVtZW50c1xuICAgKi9cbiAgcmVhZG9ubHkgaWRlbnRpdHlQb2xpY3lTdGF0ZW1lbnRzPzogc3RyaW5nW107XG59XG5cbi8qKlxuICogQSBjb25zdHJ1Y3QgdGhhdCBpcyByZXNwb25zaWJsZSBmb3IgZ2VuZXJhdGluZyBhbiBJQU0gcG9saWN5IFJlcG9ydFxuICogZm9yIGFsbCBJQU0gcm9sZXMgdGhhdCBhcmUgY3JlYXRlZCBhcyBwYXJ0IG9mIHRoZSBDREsgYXBwbGljYXRpb24uXG4gKlxuICogVGhlIHJlcG9ydCB3aWxsIGNvbnRhaW4gdGhlIGZvbGxvd2luZyBpbmZvcm1hdGlvbiBmb3IgZWFjaCBJQU0gUm9sZSBpbiB0aGUgYXBwOlxuICpcbiAqIDEuIElzIHRoZSByb2xlIFwibWlzc2luZ1wiIChub3QgcHJvdmlkZWQgaW4gdGhlIGN1c3RvbWl6ZVJvbGVzLnVzZVByZWNyZWF0ZWRSb2xlcyk/XG4gKiAyLiBUaGUgQXNzdW1lUm9sZSBQb2xpY3kgKEFLQSBUcnVzdCBQb2xpY3kpXG4gKiAzLiBBbnkgXCJJZGVudGl0eVwiIHBvbGljaWVzIChpLmUuIHBvbGljaWVzIGF0dGFjaGVkIHRvIHRoZSByb2xlKVxuICogNC4gQW55IE1hbmFnZWQgcG9saWNpZXNcbiAqL1xuZXhwb3J0IGNsYXNzIFBvbGljeVN5bnRoZXNpemVyIGV4dGVuZHMgQ29uc3RydWN0IHtcbiAgcHVibGljIHN0YXRpYyBnZXRPckNyZWF0ZShzY29wZTogQ29uc3RydWN0KTogUG9saWN5U3ludGhlc2l6ZXIge1xuICAgIGNvbnN0IHN5bnRoZXNpemVyID0gc2NvcGUubm9kZS5yb290Lm5vZGUudHJ5RmluZENoaWxkKFBPTElDWV9TWU5USEVTSVpFUl9JRCk7XG4gICAgaWYgKHN5bnRoZXNpemVyKSB7XG4gICAgICByZXR1cm4gc3ludGhlc2l6ZXIgYXMgUG9saWN5U3ludGhlc2l6ZXI7XG4gICAgfVxuICAgIHJldHVybiBuZXcgUG9saWN5U3ludGhlc2l6ZXIoc2NvcGUubm9kZS5yb290KTtcbiAgfVxuXG4gIHByaXZhdGUgcmVhZG9ubHkgcm9sZVJlcG9ydDogeyBbcm9sZVBhdGg6IHN0cmluZ106IFJvbGVSZXBvcnRPcHRpb25zIH0gPSB7fTtcbiAgcHJpdmF0ZSByZWFkb25seSBtYW5hZ2VkUG9saWN5UmVwb3J0OiB7IFtwb2xpY3lQYXRoOiBzdHJpbmddOiBNYW5hZ2VkUG9saWN5UmVwb3J0T3B0aW9ucyB9ID0ge307XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QpIHtcbiAgICBzdXBlcihzY29wZSwgUE9MSUNZX1NZTlRIRVNJWkVSX0lEKTtcblxuICAgIGF0dGFjaEN1c3RvbVN5bnRoZXNpcyh0aGlzLCB7XG4gICAgICBvblN5bnRoZXNpemU6IChzZXNzaW9uOiBJU3ludGhlc2lzU2Vzc2lvbikgPT4ge1xuICAgICAgICBjb25zdCByZXBvcnQgPSB0aGlzLmNyZWF0ZUpzb25SZXBvcnQoKTtcbiAgICAgICAgaWYgKHJlcG9ydC5yb2xlcz8ubGVuZ3RoID4gMCkge1xuICAgICAgICAgIGNvbnN0IGZpbGVQYXRoID0gcGF0aC5qb2luKHNlc3Npb24ub3V0ZGlyLCAnaWFtLXBvbGljeS1yZXBvcnQnKTtcbiAgICAgICAgICBmcy53cml0ZUZpbGVTeW5jKGZpbGVQYXRoKycudHh0JywgdGhpcy5jcmVhdGVIdW1hblJlcG9ydChyZXBvcnQpKTtcbiAgICAgICAgICBmcy53cml0ZUZpbGVTeW5jKGZpbGVQYXRoKycuanNvbicsIEpTT04uc3RyaW5naWZ5KHJlcG9ydCwgdW5kZWZpbmVkLCAyKSk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIGNyZWF0ZUpzb25SZXBvcnQoKTogUG9saWN5UmVwb3J0IHtcbiAgICByZXR1cm4gT2JqZWN0LmVudHJpZXModGhpcy5yb2xlUmVwb3J0KS5yZWR1Y2UoKGFjYywgW2tleSwgdmFsdWVdKSA9PiB7XG4gICAgICBjb25zdCB7IHBvbGljeUFybnMsIHBvbGljeVN0YXRlbWVudHMgfSA9IHRoaXMucmVuZGVyTWFuYWdlZFBvbGljaWVzRm9yUm9sZShrZXksIHZhbHVlLm1hbmFnZWRQb2xpY2llcyk7XG4gICAgICBhY2MgPSB7XG4gICAgICAgIHJvbGVzOiBbXG4gICAgICAgICAgLi4uYWNjLnJvbGVzID8/IFtdLFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHJvbGVDb25zdHJ1Y3RQYXRoOiBrZXksXG4gICAgICAgICAgICByb2xlTmFtZTogdmFsdWUubWlzc2luZyA/ICdtaXNzaW5nIHJvbGUnIDogdmFsdWUucm9sZU5hbWUhLFxuICAgICAgICAgICAgbWlzc2luZzogdmFsdWUubWlzc2luZyxcbiAgICAgICAgICAgIGFzc3VtZVJvbGVQb2xpY3k6IHRoaXMucmVzb2x2ZVJlZmVyZW5jZXModmFsdWUuYXNzdW1lUm9sZVBvbGljeSksXG4gICAgICAgICAgICBtYW5hZ2VkUG9saWN5QXJuczogdGhpcy5yZXNvbHZlUmVmZXJlbmNlcyhwb2xpY3lBcm5zKSxcbiAgICAgICAgICAgIG1hbmFnZWRQb2xpY3lTdGF0ZW1lbnRzOiB0aGlzLnJlc29sdmVSZWZlcmVuY2VzKHBvbGljeVN0YXRlbWVudHMpLFxuICAgICAgICAgICAgaWRlbnRpdHlQb2xpY3lTdGF0ZW1lbnRzOiB0aGlzLnJlc29sdmVSZWZlcmVuY2VzKHZhbHVlLnBvbGljeVN0YXRlbWVudHMpLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9O1xuICAgICAgcmV0dXJuIGFjYztcbiAgICB9LCB7fSBhcyBQb2xpY3lSZXBvcnQpO1xuICB9XG5cbiAgcHJpdmF0ZSBjcmVhdGVIdW1hblJlcG9ydChyZXBvcnQ6IFBvbGljeVJlcG9ydCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHJlcG9ydC5yb2xlcy5tYXAocm9sZSA9PiBbXG4gICAgICBgPCR7cm9sZS5taXNzaW5nID8gJ21pc3Npbmcgcm9sZScgOiByb2xlLnJvbGVOYW1lfT4gKCR7cm9sZS5yb2xlQ29uc3RydWN0UGF0aH0pYCxcbiAgICAgICcnLFxuICAgICAgJ0Fzc3VtZVJvbGUgUG9saWN5OicsXG4gICAgICAuLi50aGlzLnRvSnNvblN0cmluZyhyb2xlLmFzc3VtZVJvbGVQb2xpY3kpLFxuICAgICAgJycsXG4gICAgICAnTWFuYWdlZCBQb2xpY3kgQVJOczonLFxuICAgICAgLi4udGhpcy50b0pzb25TdHJpbmcocm9sZS5tYW5hZ2VkUG9saWN5QXJucyksXG4gICAgICAnJyxcbiAgICAgICdNYW5hZ2VkIFBvbGljaWVzIFN0YXRlbWVudHM6JyxcbiAgICAgIHRoaXMudG9Kc29uU3RyaW5nKHJvbGUubWFuYWdlZFBvbGljeVN0YXRlbWVudHMpLFxuICAgICAgJycsXG4gICAgICAnSWRlbnRpdHkgUG9saWN5IFN0YXRlbWVudHM6JyxcbiAgICAgIHRoaXMudG9Kc29uU3RyaW5nKHJvbGUuaWRlbnRpdHlQb2xpY3lTdGF0ZW1lbnRzKSxcbiAgICBdLmpvaW4oJ1xcbicpKS5qb2luKCcnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUYWtlcyBhIHZhbHVlIGFuZCByZXR1cm5zIGEgZm9ybWF0dGVkIEpTT04gc3RyaW5nXG4gICAqL1xuICBwcml2YXRlIHRvSnNvblN0cmluZyh2YWx1ZT86IGFueSk6IHN0cmluZ1tdIHtcbiAgICBpZiAoKEFycmF5LmlzQXJyYXkodmFsdWUpICYmIHZhbHVlLmxlbmd0aCA9PT0gMCkgfHwgIXZhbHVlKSB7XG4gICAgICByZXR1cm4gWydOT05FJ107XG4gICAgfVxuXG4gICAgcmV0dXJuIFtKU09OLnN0cmluZ2lmeSh7IHZhbHVlczogdmFsdWUgfS52YWx1ZXMsIHVuZGVmaW5lZCwgMildO1xuICB9XG5cbiAgLyoqXG4gICAqIElBTSBtYW5hZ2VkIHBvbGljaWVzIGNhbiBiZSBhdHRhY2hlZCB0byBhIHJvbGUgdXNpbmcgYSBjb3VwbGUgZGlmZmVyZW50IG1ldGhvZHMuXG4gICAqXG4gICAqIDEuIFlvdSBjYW4gdXNlIGFuIGV4aXN0aW5nIG1hbmFnZWQgcG9saWN5LCBpLmUuIE1hbmFnZWRQb2xpY3kuZnJvbU1hbmFnZWRQb2xpY3lOYW1lKClcbiAgICogMi4gWW91IGNhbiBjcmVhdGUgYSBtYW5hZ2VkIHBvbGljeSBhbmQgYXR0YWNoIHRoZSByb2xlLCBpLmUuXG4gICAqICAgbmV3IE1hbmFnZWRQb2xpY3koc2NvcGUsICdNYW5hZ2VkUG9saWN5JywgeyByb2xlczogW215Um9sZV0gfSk7XG4gICAqIDMuIFlvdSBjYW4gY3JlYXRlIGEgbWFuYWdlZCBwb2xpY3kgYW5kIGF0dGFjaCBpdCB0byB0aGUgcm9sZSwgaS5lLlxuICAgKiAgIGNvbnN0IHJvbGUgPSBuZXcgUm9sZSguLi4pO1xuICAgKiAgIHJvbGUuYWRkTWFuYWdlZFBvbGljeShuZXcgTWFuYWdlZFBvbGljeSguLi4pKTtcbiAgICpcbiAgICogRm9yIDEsIENESyBpcyBub3QgY3JlYXRpbmcgdGhlIG1hbmFnZWQgcG9saWN5IHNvIHdlIGp1c3QgbmVlZCB0byByZXBvcnQgdGhlIEFSTlxuICAgKiBvZiB0aGUgcG9saWN5IHRoYXQgbmVlZHMgdG8gYmUgYXR0YWNoZWQgdG8gdGhlIHJvbGUuXG4gICAqXG4gICAqIEZvciAyICYgMywgQ0RLIF9pc18gY3JlYXRpbmcgdGhlIG1hbmFnZWQgcG9saWN5IHNvIGluc3RlYWQgb2YgcmVwb3J0aW5nIHRoZSBuYW1lIG9yIEFSTiBvZiB0aGVcbiAgICogcG9saWN5ICh0aGF0IHdlIHByZXZlbnRlZCBiZWluZyBjcmVhdGVkKSB3ZSBzaG91bGQgaW5zdGVhZCByZXBvcnQgdGhlIHBvbGljeSBzdGF0ZW1lbnRzXG4gICAqIHRoYXQgYXJlIHBhcnQgb2YgdGhhdCBkb2N1bWVudC4gSXQgZG9lc24ndCByZWFsbHkgbWF0dGVyIGlmIHRoZSBhZG1pbnMgY3JlYXRpbmcgdGhlIHJvbGVzIHRoZW5cbiAgICogZGVjaWRlIHRvIHVzZSBtYW5hZ2VkIHBvbGljaWVzIG9yIGlubGluZSBwb2xpY2llcywgZXRjLlxuICAgKlxuICAgKiBUaGVyZSBjb3VsZCBiZSBtYW5hZ2VkIHBvbGljaWVzIHRoYXQgYXJlIGNyZWF0ZWQgYW5kIF9ub3RfIGF0dGFjaGVkIHRvIGFueSByb2xlcywgaW4gdGhhdCBjYXNlXG4gICAqIHdlIGRvIG5vdCByZXBvcnQgYW55dGhpbmcuIFRoYXQgbWFuYWdlZCBwb2xpY3kgaXMgbm90IGJlaW5nIGNyZWF0ZWQgYXV0b21hdGljYWxseSBieSBvdXIgY29uc3RydWN0cy5cbiAgICovXG4gIHByaXZhdGUgcmVuZGVyTWFuYWdlZFBvbGljaWVzRm9yUm9sZShcbiAgICByb2xlUGF0aDogc3RyaW5nLFxuICAgIG1hbmFnZWRQb2xpY2llczogYW55W10sXG4gICk6IHsgcG9saWN5QXJuczogc3RyaW5nW10sIHBvbGljeVN0YXRlbWVudHM6IHN0cmluZ1tdIH0ge1xuICAgIGNvbnN0IHBvbGljeVN0YXRlbWVudHM6IHN0cmluZ1tdID0gW107XG4gICAgLy8gbWFuYWdlZCBwb2xpY2llcyB0aGF0IGhhdmUgcm9sZXMgYXR0YWNoZWQgdG8gdGhlIHBvbGljeVxuICAgIE9iamVjdC52YWx1ZXModGhpcy5tYW5hZ2VkUG9saWN5UmVwb3J0KS5mb3JFYWNoKHZhbHVlID0+IHtcbiAgICAgIGlmICh2YWx1ZS5yb2xlcz8uaW5jbHVkZXMocm9sZVBhdGgpKSB7XG4gICAgICAgIHBvbGljeVN0YXRlbWVudHMucHVzaCguLi52YWx1ZS5wb2xpY3lTdGF0ZW1lbnRzKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBjb25zdCBwb2xpY3lBcm5zOiBzdHJpbmdbXSA9IFtdO1xuICAgIG1hbmFnZWRQb2xpY2llcy5mb3JFYWNoKHBvbGljeSA9PiB7XG4gICAgICBpZiAoQ29uc3RydWN0LmlzQ29uc3RydWN0KHBvbGljeSkpIHtcbiAgICAgICAgaWYgKHRoaXMubWFuYWdlZFBvbGljeVJlcG9ydC5oYXNPd25Qcm9wZXJ0eShwb2xpY3kubm9kZS5wYXRoKSkge1xuICAgICAgICAgIHBvbGljeVN0YXRlbWVudHMucHVzaCguLi50aGlzLm1hbmFnZWRQb2xpY3lSZXBvcnRbcG9saWN5Lm5vZGUucGF0aF0ucG9saWN5U3RhdGVtZW50cyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8ganVzdCBhZGQgdGhlIGFyblxuICAgICAgICAgIHBvbGljeUFybnMucHVzaCgocG9saWN5IGFzIGFueSkubWFuYWdlZFBvbGljeUFybik7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBvbGljeUFybnMucHVzaChwb2xpY3kubWFuYWdlZFBvbGljeUFybik7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHtcbiAgICAgIHBvbGljeUFybnMsXG4gICAgICBwb2xpY3lTdGF0ZW1lbnRzLFxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogUmVzb2x2ZSBhbnkgcmVmZXJlbmNlcyBhbmQgcmVwbGFjZSB3aXRoIGEgbW9yZSB1c2VyIGZyaWVuZGx5IHZhbHVlLiBUaGlzIGlzIHRoZSB2YWx1ZVxuICAgKiB0aGF0IHdpbGwgYXBwZWFyIGluIHRoZSByZXBvcnQsIHNvIGluc3RlYWQgb2YgZ2V0dGluZyBzb21ldGhpbmcgbGlrZSB0aGlzIChub3QgdmVyeSB1c2VmdWwpOlxuICAgKlxuICAgKiAgICAgXCJSZXNvdXJjZVwiOiB7XG4gICAqICAgICAgIFwiRm46OkpvaW5cIjogW1xuICAgKiAgICAgICAgIFwiXCIsXG4gICAqICAgICAgICAgW1xuICAgKiAgICAgICAgICAgXCJhcm46XCIsXG4gICAqICAgICAgICAgICB7XG4gICAqICAgICAgICAgICAgIFwiUmVmXCI6IFwiQVdTOjpQYXJ0aXRpb25cIlxuICAgKiAgICAgICAgICAgfSxcbiAgICogICAgICAgICAgIFwiOmlhbTo6XCIsXG4gICAqICAgICAgICAgICB7XG4gICAqICAgICAgICAgICAgIFwiUmVmXCI6IFwiQVdTOjpBY2NvdW50SWRcIlxuICAgKiAgICAgICAgICAgfSxcbiAgICogICAgICAgICAgIFwiOnJvbGUvUm9sZVwiXG4gICAqICAgICAgICAgXVxuICAgKiAgICAgICBdXG4gICAqICAgICB9XG4gICAqXG4gICAqIFdlIHdpbGwgaW5zdGVhZCBnZXQ6XG4gICAqXG4gICAqICAgICBcIlJlc291cmNlXCI6IFwiYXJuOihQQVJUSVRJT04pOmlhbTo6KEFDQ09VTlQpOnJvbGUvUm9sZVwiXG4gICAqXG4gICAqIE9yIGlmIHJlZmVyZW5jaW5nIGEgcmVzb3VyY2UgYXR0cmlidXRlXG4gICAqXG4gICAqICAgICBcIlJlc291cmNlXCI6IHtcbiAgICogICAgICAgXCJGbjo6R2V0QXR0XCI6IFtcbiAgICogICAgICAgICBcIlNvbWVSZXNvdXJjZVwiLFxuICAgKiAgICAgICAgIFwiQXJuXCJcbiAgICogICAgICAgXVxuICAgKiAgICAgfVxuICAgKlxuICAgKiBCZWNvbWVzXG4gICAqXG4gICAqICAgICBcIihQYXRoL1RvL1NvbWVSZXNvdXJjZS5Bcm4pXCJcbiAgICovXG4gIHByaXZhdGUgcmVzb2x2ZVJlZmVyZW5jZXMocmVmOiBhbnkpOiBhbnkge1xuICAgIGlmICgoQXJyYXkuaXNBcnJheShyZWYpICYmIHJlZi5sZW5ndGggPT09IDApIHx8ICFyZWYpIHtcbiAgICAgIHJldHVybiBbXTtcbiAgICB9XG4gICAgaWYgKEFycmF5LmlzQXJyYXkocmVmKSkge1xuICAgICAgcmV0dXJuIHJlZi5tYXAociA9PiB0aGlzLnJlc29sdmVSZWZlcmVuY2VzKHIpKTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiByZWYgPT09ICdvYmplY3QnKSB7XG4gICAgICByZXR1cm4gdGhpcy5yZXNvbHZlSnNvbk9iamVjdChyZWYpO1xuICAgIH1cbiAgICBjb25zdCByZXNvbHZhYmxlID0gVG9rZW5pemF0aW9uLnJldmVyc2VTdHJpbmcocmVmKTtcbiAgICBpZiAocmVzb2x2YWJsZS5sZW5ndGggPT09IDEgJiYgUmVmZXJlbmNlLmlzUmVmZXJlbmNlKHJlc29sdmFibGUuZmlyc3RUb2tlbikpIHtcbiAgICAgIHJldHVybiBgKCR7cmVzb2x2YWJsZS5maXJzdFRva2VuLnRhcmdldC5ub2RlLnBhdGh9LiR7cmVzb2x2YWJsZS5maXJzdFRva2VuLmRpc3BsYXlOYW1lfSlgO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCByZXNvbHZlZFRva2VucyA9IHJlc29sdmFibGUubWFwVG9rZW5zKHtcbiAgICAgICAgbWFwVG9rZW46IChyOiBJUmVzb2x2YWJsZSkgPT4ge1xuICAgICAgICAgIGlmIChSZWZlcmVuY2UuaXNSZWZlcmVuY2UocikpIHtcbiAgICAgICAgICAgIHJldHVybiBgKCR7ci50YXJnZXQubm9kZS5wYXRofS4ke3IuZGlzcGxheU5hbWV9KWA7XG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbnN0IHJlc29sdmVkID0gVG9rZW5pemF0aW9uLnJlc29sdmUociwge1xuICAgICAgICAgICAgc2NvcGU6IHRoaXMsXG4gICAgICAgICAgICByZXNvbHZlcjogbmV3IERlZmF1bHRUb2tlblJlc29sdmVyKG5ldyBTdHJpbmdDb25jYXQoKSksXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgaWYgKHR5cGVvZiByZXNvbHZlZCA9PT0gJ29iamVjdCcgJiYgcmVzb2x2ZWQuaGFzT3duUHJvcGVydHkoJ1JlZicpKSB7XG4gICAgICAgICAgICBzd2l0Y2ggKHJlc29sdmVkLlJlZikge1xuICAgICAgICAgICAgICBjYXNlICdBV1M6OkFjY291bnRJZCc6XG4gICAgICAgICAgICAgICAgcmV0dXJuICcoQUNDT1VOVCknO1xuICAgICAgICAgICAgICBjYXNlICdBV1M6OlBhcnRpdGlvbic6XG4gICAgICAgICAgICAgICAgcmV0dXJuICcoUEFSVElUSU9OKSc7XG4gICAgICAgICAgICAgIGNhc2UgJ0FXUzo6UmVnaW9uJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gJyhSRUdJT04pJztcbiAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICByZXR1cm4gcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHI7XG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICAgIHJldHVybiByZXNvbHZlZFRva2Vucy5qb2luKG5ldyBTdHJpbmdDb25jYXQoKSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSByZXNvbHZlSnNvbk9iamVjdChzdGF0ZW1lbnQ6IHsgW2tleTogc3RyaW5nXTogYW55IH0pOiBhbnkge1xuICAgIGNvbnN0IG5ld1N0YXRlbWVudCA9IHN0YXRlbWVudDtcbiAgICBmb3IgKGNvbnN0IFtrZXksIHZhbHVlXSBvZiBPYmplY3QuZW50cmllcyhzdGF0ZW1lbnQpKSB7XG4gICAgICBuZXdTdGF0ZW1lbnRba2V5XSA9IHRoaXMucmVzb2x2ZVJlZmVyZW5jZXModmFsdWUpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3U3RhdGVtZW50O1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBhbiBJQU0gcm9sZSB0byB0aGUgcmVwb3J0XG4gICAqXG4gICAqIEBwYXJhbSByb2xlUGF0aCB0aGUgY29uc3RydWN0IHBhdGggb2YgdGhlIHJvbGVcbiAgICogQHBhcmFtIG9wdGlvbnMgdGhlIHZhbHVlcyBhc3NvY2lhdGVkIHdpdGggdGhlIHJvbGVcbiAgICovXG4gIHB1YmxpYyBhZGRSb2xlKHJvbGVQYXRoOiBzdHJpbmcsIG9wdGlvbnM6IFJvbGVSZXBvcnRPcHRpb25zKTogdm9pZCB7XG4gICAgaWYgKHRoaXMucm9sZVJlcG9ydC5oYXNPd25Qcm9wZXJ0eShyb2xlUGF0aCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgSUFNIFBvbGljeSBSZXBvcnQgYWxyZWFkeSBoYXMgYW4gZW50cnkgZm9yIHJvbGU6ICR7cm9sZVBhdGh9YCk7XG4gICAgfVxuICAgIHRoaXMucm9sZVJlcG9ydFtyb2xlUGF0aF0gPSBvcHRpb25zO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBhbiBJQU0gTWFuYWdlZCBQb2xpY3kgdG8gdGhlIHJlcG9ydFxuICAgKlxuICAgKiBAcGFyYW0gcG9saWN5UGF0aCB0aGUgY29uc3RydWN0IHBhdGggb2YgdGhlIG1hbmFnZWQgcG9saWN5XG4gICAqIEBwYXJhbSBvcHRpb25zIHRoZSB2YWx1ZXMgYXNzb2NpYXRlZCB3aXRoIHRoZSBtYW5hZ2VkIHBvbGljeVxuICAgKi9cbiAgcHVibGljIGFkZE1hbmFnZWRQb2xpY3kocG9saWN5UGF0aDogc3RyaW5nLCBvcHRpb25zOiBNYW5hZ2VkUG9saWN5UmVwb3J0T3B0aW9ucyk6IHZvaWQge1xuICAgIGlmICh0aGlzLm1hbmFnZWRQb2xpY3lSZXBvcnQuaGFzT3duUHJvcGVydHkocG9saWN5UGF0aCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgSUFNIFBvbGljeSBSZXBvcnQgYWxyZWFkeSBoYXMgYW4gZW50cnkgZm9yIG1hbmFnZWQgcG9saWN5OiAke3BvbGljeVBhdGh9YCk7XG4gICAgfVxuXG4gICAgdGhpcy5tYW5hZ2VkUG9saWN5UmVwb3J0W3BvbGljeVBhdGhdID0gb3B0aW9ucztcbiAgfVxufVxuXG4vKipcbiAqIFJldHVybiBjb25maWd1cmF0aW9uIGZvciBwcmVjcmVhdGVkIHJvbGVzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRQcmVjcmVhdGVkUm9sZUNvbmZpZyhzY29wZTogQ29uc3RydWN0LCByb2xlUGF0aD86IHN0cmluZyk6IEN1c3RvbWl6ZVJvbGVDb25maWcge1xuICBjb25zdCBwcmVjcmVhdGVkUm9sZVBhdGggPSByb2xlUGF0aCA/PyBzY29wZS5ub2RlLnBhdGg7XG4gIGNvbnN0IGN1c3RvbWl6ZVJvbGVzQ29udGV4dCA9IHNjb3BlLm5vZGUudHJ5R2V0Q29udGV4dChDVVNUT01JWkVfUk9MRVNfQ09OVEVYVF9LRVkpO1xuICBpZiAoY3VzdG9taXplUm9sZXNDb250ZXh0ICE9PSB1bmRlZmluZWQpIHtcbiAgICBjb25zdCBjdXN0b21pemVSb2xlcyA9IGN1c3RvbWl6ZVJvbGVzQ29udGV4dDtcbiAgICBpZiAoY3VzdG9taXplUm9sZXMucHJldmVudFN5bnRoZXNpcyA9PT0gZmFsc2UpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHByZXZlbnRTeW50aGVzaXM6IGZhbHNlLFxuICAgICAgICBlbmFibGVkOiB0cnVlLFxuICAgICAgfTtcbiAgICB9XG4gICAgaWYgKGN1c3RvbWl6ZVJvbGVzLnVzZVByZWNyZWF0ZWRSb2xlcz8uaGFzT3duUHJvcGVydHkocHJlY3JlYXRlZFJvbGVQYXRoKSkge1xuICAgICAgaWYgKFRva2VuLmlzVW5yZXNvbHZlZChjdXN0b21pemVSb2xlcy51c2VQcmVjcmVhdGVkUm9sZXNbcHJlY3JlYXRlZFJvbGVQYXRoXSkpIHtcbiAgICAgICAgLy8gd2UgZG8gbm90IHdhbnQgdG8gZmFpbCBzeW50aGVzaXNcbiAgICAgICAgQW5ub3RhdGlvbnMub2Yoc2NvcGUpLmFkZEVycm9yKFxuICAgICAgICAgIGBDYW5ub3QgcmVzb2x2ZSBwcmVjcmVhdGVkIHJvbGUgbmFtZSBhdCBwYXRoIFwiJHtwcmVjcmVhdGVkUm9sZVBhdGh9XCIuIFRoZSB2YWx1ZSBtYXkgYmUgYSB0b2tlbi5gLFxuICAgICAgICApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBlbmFibGVkOiB0cnVlLFxuICAgICAgICAgIHByZXZlbnRTeW50aGVzaXM6IHRydWUsXG4gICAgICAgICAgcHJlY3JlYXRlZFJvbGVOYW1lOiBjdXN0b21pemVSb2xlcy51c2VQcmVjcmVhdGVkUm9sZXNbcHJlY3JlYXRlZFJvbGVQYXRoXSxcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gd2UgZG8gbm90IHdhbnQgdG8gZmFpbCBzeW50aGVzaXNcbiAgICAgIEFubm90YXRpb25zLm9mKHNjb3BlKS5hZGRFcnJvcihcbiAgICAgICAgYElBTSBSb2xlIGlzIGJlaW5nIGNyZWF0ZWQgYXQgcGF0aCBcIiR7cHJlY3JlYXRlZFJvbGVQYXRofVwiIGFuZCBjdXN0b21pemVSb2xlcy5wcmV2ZW50U3ludGhlc2lzIGlzIGVuYWJsZWQuIGAgK1xuICAgICAgICAgICdZb3UgbXVzdCBwcm92aWRlIGEgcHJlY3JlYXRlZCByb2xlIG5hbWUgaW4gY3VzdG9taXplUm9sZXMucHJlY3JlYXRlZFJvbGVzJyxcbiAgICAgICk7XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICBlbmFibGVkOiB0cnVlLFxuICAgICAgcHJldmVudFN5bnRoZXNpczogdHJ1ZSxcbiAgICB9O1xuICB9XG4gIHJldHVybiB7IGVuYWJsZWQ6IGZhbHNlIH07XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ3VzdG9taXplUm9sZUNvbmZpZyB7XG4gIC8qKlxuICAgKiBXaGV0aGVyIG9yIG5vdCBjdXN0b21pemVkIHJvbGVzIGlzIGVuYWJsZWQuXG4gICAqXG4gICAqIFRoaXMgd2lsbCBiZSB0cnVlIGlmIHRoZSB1c2VyIGNhbGxzIFJvbGUuY3VzdG9taXplUm9sZXMoKVxuICAgKi9cbiAgcmVhZG9ubHkgZW5hYmxlZDogYm9vbGVhbjtcbiAgLyoqXG4gICAqIFdoZXRoZXIgb3Igbm90IHRoZSByb2xlIENGTiByZXNvdXJjZSBzaG91bGQgYmUgc3ludGhlc2l6ZWRcbiAgICogaW4gdGhlIHRlbXBsYXRlXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gZmFsc2UgaWYgZW5hYmxlZD1mYWxzZSBvdGhlcndpc2UgdHJ1ZVxuICAgKi9cbiAgcmVhZG9ubHkgcHJldmVudFN5bnRoZXNpcz86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFRoZSBwaHlzaWNhbCBuYW1lIG9mIHRoZSBwcmVjcmVhdGVkIHJvbGUuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gbm8gcHJlY3JlYXRlZCByb2xlXG4gICAqL1xuICByZWFkb25seSBwcmVjcmVhdGVkUm9sZU5hbWU/OiBzdHJpbmc7XG59XG5cbmV4cG9ydCBjb25zdCBDVVNUT01JWkVfUk9MRVNfQ09OVEVYVF9LRVkgPSAnQGF3cy1jZGsvaWFtOmN1c3RvbWl6ZVJvbGVzJztcbmV4cG9ydCBmdW5jdGlvbiBnZXRDdXN0b21pemVSb2xlc0NvbmZpZyhzY29wZTogQ29uc3RydWN0KTogQ3VzdG9taXplUm9sZUNvbmZpZyB7XG4gIGNvbnN0IGN1c3RvbWl6ZVJvbGVzQ29udGV4dCA9IHNjb3BlLm5vZGUudHJ5R2V0Q29udGV4dChDVVNUT01JWkVfUk9MRVNfQ09OVEVYVF9LRVkpO1xuICByZXR1cm4ge1xuICAgIHByZXZlbnRTeW50aGVzaXM6IGN1c3RvbWl6ZVJvbGVzQ29udGV4dCAhPT0gdW5kZWZpbmVkICYmIGN1c3RvbWl6ZVJvbGVzQ29udGV4dC5wcmV2ZW50U3ludGhlc2lzICE9PSBmYWxzZSxcbiAgICBlbmFibGVkOiBjdXN0b21pemVSb2xlc0NvbnRleHQgIT09IHVuZGVmaW5lZCxcbiAgfTtcbn1cbiJdfQ==