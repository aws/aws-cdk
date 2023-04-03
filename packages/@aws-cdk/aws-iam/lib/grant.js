"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompositeDependable = exports.Grant = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const cdk = require("@aws-cdk/core");
const constructs_1 = require("constructs");
const policy_statement_1 = require("./policy-statement");
/**
 * Result of a grant() operation
 *
 * This class is not instantiable by consumers on purpose, so that they will be
 * required to call the Grant factory functions.
 */
class Grant {
    /**
     * Grant the given permissions to the principal
     *
     * The permissions will be added to the principal policy primarily, falling
     * back to the resource policy if necessary. The permissions must be granted
     * somewhere.
     *
     * - Trying to grant permissions to a principal that does not admit adding to
     *   the principal policy while not providing a resource with a resource policy
     *   is an error.
     * - Trying to grant permissions to an absent principal (possible in the
     *   case of imported resources) leads to a warning being added to the
     *   resource construct.
     */
    static addToPrincipalOrResource(options) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_iam_GrantWithResourceOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addToPrincipalOrResource);
            }
            throw error;
        }
        const result = Grant.addToPrincipal({
            ...options,
            scope: options.resource,
        });
        const resourceAndPrincipalAccountComparison = options.grantee.grantPrincipal.principalAccount
            ? cdk.Token.compareStrings(options.resource.env.account, options.grantee.grantPrincipal.principalAccount)
            : undefined;
        // if both accounts are tokens, we assume here they are the same
        const equalOrBothUnresolved = resourceAndPrincipalAccountComparison === cdk.TokenComparison.SAME
            || resourceAndPrincipalAccountComparison == cdk.TokenComparison.BOTH_UNRESOLVED;
        const sameAccount = resourceAndPrincipalAccountComparison
            ? equalOrBothUnresolved
            // if the principal doesn't have an account (for example, a service principal),
            // we should modify the resource's trust policy
            : false;
        // If we added to the principal AND we're in the same account, then we're done.
        // If not, it's a different account and we must also add a trust policy on the resource.
        if (result.success && sameAccount) {
            return result;
        }
        const statement = new policy_statement_1.PolicyStatement({
            actions: options.actions,
            resources: (options.resourceSelfArns || options.resourceArns),
            principals: [options.grantee.grantPrincipal],
        });
        const resourceResult = options.resource.addToResourcePolicy(statement);
        return new Grant({
            resourceStatement: statement,
            options,
            policyDependable: resourceResult.statementAdded ? resourceResult.policyDependable ?? options.resource : undefined,
        });
    }
    /**
     * Try to grant the given permissions to the given principal
     *
     * Absence of a principal leads to a warning, but failing to add
     * the permissions to a present principal is not an error.
     */
    static addToPrincipal(options) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_iam_GrantOnPrincipalOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addToPrincipal);
            }
            throw error;
        }
        const statement = new policy_statement_1.PolicyStatement({
            actions: options.actions,
            resources: options.resourceArns,
            conditions: options.conditions,
        });
        const addedToPrincipal = options.grantee.grantPrincipal.addToPrincipalPolicy(statement);
        if (!addedToPrincipal.statementAdded) {
            return new Grant({ principalStatement: undefined, options });
        }
        if (!addedToPrincipal.policyDependable) {
            throw new Error('Contract violation: when Principal returns statementAdded=true, it should return a dependable');
        }
        return new Grant({ principalStatement: statement, options, policyDependable: addedToPrincipal.policyDependable });
    }
    /**
     * Add a grant both on the principal and on the resource
     *
     * As long as any principal is given, granting on the principal may fail (in
     * case of a non-identity principal), but granting on the resource will
     * never fail.
     *
     * Statement will be the resource statement.
     */
    static addToPrincipalAndResource(options) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_iam_GrantOnPrincipalAndResourceOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addToPrincipalAndResource);
            }
            throw error;
        }
        const result = Grant.addToPrincipal({
            ...options,
            scope: options.resource,
        });
        const statement = new policy_statement_1.PolicyStatement({
            actions: options.actions,
            resources: (options.resourceSelfArns || options.resourceArns),
            principals: [options.resourcePolicyPrincipal || options.grantee.grantPrincipal],
        });
        const resourceResult = options.resource.addToResourcePolicy(statement);
        const resourceDependable = resourceResult.statementAdded ? resourceResult.policyDependable ?? options.resource : undefined;
        return new Grant({
            principalStatement: statement,
            resourceStatement: result.resourceStatement,
            options,
            policyDependable: resourceDependable ? new CompositeDependable(result, resourceDependable) : result,
        });
    }
    /**
     * Returns a "no-op" `Grant` object which represents a "dropped grant".
     *
     * This can be used for e.g. imported resources where you may not be able to modify
     * the resource's policy or some underlying policy which you don't know about.
     *
     * @param grantee The intended grantee
     * @param _intent The user's intent (will be ignored at the moment)
     */
    static drop(grantee, _intent) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_iam_IGrantable(grantee);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.drop);
            }
            throw error;
        }
        return new Grant({
            options: { grantee, actions: [], resourceArns: [] },
        });
    }
    constructor(props) {
        /**
         * The statements that were added to the principal's policy
         */
        this.principalStatements = new Array();
        /**
         * The statements that were added to the principal's policy
         */
        this.resourceStatements = new Array();
        this.dependables = new Array();
        this.options = props.options;
        this.principalStatement = props.principalStatement;
        this.resourceStatement = props.resourceStatement;
        if (this.principalStatement) {
            this.principalStatements.push(this.principalStatement);
        }
        if (this.resourceStatement) {
            this.resourceStatements.push(this.resourceStatement);
        }
        if (props.policyDependable) {
            this.dependables.push(props.policyDependable);
        }
        const self = this;
        constructs_1.Dependable.implement(this, {
            get dependencyRoots() {
                return Array.from(new Set(self.dependables.flatMap(d => constructs_1.Dependable.of(d).dependencyRoots)));
            },
        });
    }
    /**
     * Whether the grant operation was successful
     */
    get success() {
        return this.principalStatement !== undefined || this.resourceStatement !== undefined;
    }
    /**
     * Throw an error if this grant wasn't successful
     */
    assertSuccess() {
        if (!this.success) {
            // eslint-disable-next-line max-len
            throw new Error(`${describeGrant(this.options)} could not be added on either identity or resource policy.`);
        }
    }
    /**
     * Make sure this grant is applied before the given constructs are deployed
     *
     * The same as construct.node.addDependency(grant), but slightly nicer to read.
     */
    applyBefore(...constructs) {
        for (const construct of constructs) {
            construct.node.addDependency(this);
        }
    }
    /**
     * Combine two grants into a new one
     */
    combine(rhs) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_iam_Grant(rhs);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.combine);
            }
            throw error;
        }
        const combinedPrinc = [...this.principalStatements, ...rhs.principalStatements];
        const combinedRes = [...this.resourceStatements, ...rhs.resourceStatements];
        const ret = new Grant({
            options: this.options,
            principalStatement: combinedPrinc[0],
            resourceStatement: combinedRes[0],
        });
        ret.principalStatements.splice(0, ret.principalStatements.length, ...combinedPrinc);
        ret.resourceStatements.splice(0, ret.resourceStatements.length, ...combinedRes);
        ret.dependables.push(...this.dependables, ...rhs.dependables);
        return ret;
    }
}
_a = JSII_RTTI_SYMBOL_1;
Grant[_a] = { fqn: "@aws-cdk/aws-iam.Grant", version: "0.0.0" };
exports.Grant = Grant;
function describeGrant(options) {
    return `Permissions for '${options.grantee}' to call '${options.actions}' on '${options.resourceArns}'`;
}
/**
 * Composite dependable
 *
 * Not as simple as eagerly getting the dependency roots from the
 * inner dependables, as they may be mutable so we need to defer
 * the query.
 */
class CompositeDependable {
    constructor(...dependables) {
        constructs_1.Dependable.implement(this, {
            get dependencyRoots() {
                return Array.prototype.concat.apply([], dependables.map(d => constructs_1.Dependable.of(d).dependencyRoots));
            },
        });
    }
}
_b = JSII_RTTI_SYMBOL_1;
CompositeDependable[_b] = { fqn: "@aws-cdk/aws-iam.CompositeDependable", version: "0.0.0" };
exports.CompositeDependable = CompositeDependable;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JhbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJncmFudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxxQ0FBcUM7QUFDckMsMkNBQWlFO0FBQ2pFLHlEQUFxRDtBQWtHckQ7Ozs7O0dBS0c7QUFDSCxNQUFhLEtBQUs7SUFDaEI7Ozs7Ozs7Ozs7Ozs7T0FhRztJQUNJLE1BQU0sQ0FBQyx3QkFBd0IsQ0FBQyxPQUFpQzs7Ozs7Ozs7OztRQUN0RSxNQUFNLE1BQU0sR0FBRyxLQUFLLENBQUMsY0FBYyxDQUFDO1lBQ2xDLEdBQUcsT0FBTztZQUNWLEtBQUssRUFBRSxPQUFPLENBQUMsUUFBUTtTQUN4QixDQUFDLENBQUM7UUFFSCxNQUFNLHFDQUFxQyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLGdCQUFnQjtZQUMzRixDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLGdCQUFnQixDQUFDO1lBQ3pHLENBQUMsQ0FBQyxTQUFTLENBQUM7UUFDZCxnRUFBZ0U7UUFDaEUsTUFBTSxxQkFBcUIsR0FBRyxxQ0FBcUMsS0FBSyxHQUFHLENBQUMsZUFBZSxDQUFDLElBQUk7ZUFDM0YscUNBQXFDLElBQUksR0FBRyxDQUFDLGVBQWUsQ0FBQyxlQUFlLENBQUM7UUFDbEYsTUFBTSxXQUFXLEdBQVkscUNBQXFDO1lBQ2hFLENBQUMsQ0FBQyxxQkFBcUI7WUFDdkIsK0VBQStFO1lBQy9FLCtDQUErQztZQUMvQyxDQUFDLENBQUMsS0FBSyxDQUFDO1FBQ1YsK0VBQStFO1FBQy9FLHdGQUF3RjtRQUN4RixJQUFJLE1BQU0sQ0FBQyxPQUFPLElBQUksV0FBVyxFQUFFO1lBQ2pDLE9BQU8sTUFBTSxDQUFDO1NBQ2Y7UUFFRCxNQUFNLFNBQVMsR0FBRyxJQUFJLGtDQUFlLENBQUM7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QUMsQ0FBQztTQUNsQyxDQUFDLENBQUM7UUFDSCxHQUFHLENBQUMsbUJBQW1CLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsbUJBQW1CLENBQUMsTUFBTSxFQUFFLEdBQUcsYUFBYSxDQUFDLENBQUM7UUFDcEYsR0FBRyxDQUFDLGtCQUFrQixDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLGtCQUFrQixDQUFDLE1BQU0sRUFBRSxHQUFHLFdBQVcsQ0FBQyxDQUFDO1FBQ2hGLEdBQUcsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLFdBQVcsRUFBRSxHQUFHLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUM5RCxPQUFPLEdBQUcsQ0FBQztLQUNaOzs7O0FBak9VLHNCQUFLO0FBb09sQixTQUFTLGFBQWEsQ0FBQyxPQUEyQjtJQUNoRCxPQUFPLG9CQUFvQixPQUFPLENBQUMsT0FBTyxjQUFjLE9BQU8sQ0FBQyxPQUFPLFNBQVMsT0FBTyxDQUFDLFlBQVksR0FBRyxDQUFDO0FBQzFHLENBQUM7QUEyQ0Q7Ozs7OztHQU1HO0FBQ0gsTUFBYSxtQkFBbUI7SUFDOUIsWUFBWSxHQUFHLFdBQTBCO1FBQ3ZDLHVCQUFVLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRTtZQUN6QixJQUFJLGVBQWU7Z0JBQ2pCLE9BQU8sS0FBSyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBRSxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsdUJBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztZQUNsRyxDQUFDO1NBQ0YsQ0FBQyxDQUFDO0tBQ0o7Ozs7QUFQVSxrREFBbUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBEZXBlbmRhYmxlLCBJQ29uc3RydWN0LCBJRGVwZW5kYWJsZSB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgUG9saWN5U3RhdGVtZW50IH0gZnJvbSAnLi9wb2xpY3ktc3RhdGVtZW50JztcbmltcG9ydCB7IElHcmFudGFibGUsIElQcmluY2lwYWwgfSBmcm9tICcuL3ByaW5jaXBhbHMnO1xuXG4vKipcbiAqIEJhc2ljIG9wdGlvbnMgZm9yIGEgZ3JhbnQgb3BlcmF0aW9uXG4gKlxuICovXG5leHBvcnQgaW50ZXJmYWNlIENvbW1vbkdyYW50T3B0aW9ucyB7XG4gIC8qKlxuICAgKiBUaGUgcHJpbmNpcGFsIHRvIGdyYW50IHRvXG4gICAqXG4gICAqIEBkZWZhdWx0IGlmIHByaW5jaXBhbCBpcyB1bmRlZmluZWQsIG5vIHdvcmsgaXMgZG9uZS5cbiAgICovXG4gIHJlYWRvbmx5IGdyYW50ZWU6IElHcmFudGFibGU7XG5cbiAgLyoqXG4gICAqIFRoZSBhY3Rpb25zIHRvIGdyYW50XG4gICAqL1xuICByZWFkb25seSBhY3Rpb25zOiBzdHJpbmdbXTtcblxuICAvKipcbiAgICogVGhlIHJlc291cmNlIEFSTnMgdG8gZ3JhbnQgdG9cbiAgICovXG4gIHJlYWRvbmx5IHJlc291cmNlQXJuczogc3RyaW5nW107XG5cbiAgLyoqXG4gICAqIEFueSBjb25kaXRpb25zIHRvIGF0dGFjaCB0byB0aGUgZ3JhbnRcbiAgICpcbiAgICogQGRlZmF1bHQgLSBObyBjb25kaXRpb25zXG4gICAqL1xuICByZWFkb25seSBjb25kaXRpb25zPzogUmVjb3JkPHN0cmluZywgUmVjb3JkPHN0cmluZywgdW5rbm93bj4+O1xufVxuXG4vKipcbiAqIE9wdGlvbnMgZm9yIGEgZ3JhbnQgb3BlcmF0aW9uXG4gKlxuICovXG5leHBvcnQgaW50ZXJmYWNlIEdyYW50V2l0aFJlc291cmNlT3B0aW9ucyBleHRlbmRzIENvbW1vbkdyYW50T3B0aW9ucyB7XG4gIC8qKlxuICAgKiBUaGUgcmVzb3VyY2Ugd2l0aCBhIHJlc291cmNlIHBvbGljeVxuICAgKlxuICAgKiBUaGUgc3RhdGVtZW50IHdpbGwgYmUgYWRkZWQgdG8gdGhlIHJlc291cmNlIHBvbGljeSBpZiBpdCBjb3VsZG4ndCBiZVxuICAgKiBhZGRlZCB0byB0aGUgcHJpbmNpcGFsIHBvbGljeS5cbiAgICovXG4gIHJlYWRvbmx5IHJlc291cmNlOiBJUmVzb3VyY2VXaXRoUG9saWN5O1xuXG4gIC8qKlxuICAgKiBXaGVuIHJlZmVycmluZyB0byB0aGUgcmVzb3VyY2UgaW4gYSByZXNvdXJjZSBwb2xpY3ksIHVzZSB0aGlzIGFzIEFSTi5cbiAgICpcbiAgICogKERlcGVuZGluZyBvbiB0aGUgcmVzb3VyY2UgdHlwZSwgdGhpcyBuZWVkcyB0byBiZSAnKicgaW4gYSByZXNvdXJjZSBwb2xpY3kpLlxuICAgKlxuICAgKiBAZGVmYXVsdCBTYW1lIGFzIHJlZ3VsYXIgcmVzb3VyY2UgQVJOc1xuICAgKi9cbiAgcmVhZG9ubHkgcmVzb3VyY2VTZWxmQXJucz86IHN0cmluZ1tdO1xufVxuXG4vKipcbiAqIE9wdGlvbnMgZm9yIGEgZ3JhbnQgb3BlcmF0aW9uIHRoYXQgb25seSBhcHBsaWVzIHRvIHByaW5jaXBhbHNcbiAqXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgR3JhbnRPblByaW5jaXBhbE9wdGlvbnMgZXh0ZW5kcyBDb21tb25HcmFudE9wdGlvbnMge1xuICAvKipcbiAgICogQ29uc3RydWN0IHRvIHJlcG9ydCB3YXJuaW5ncyBvbiBpbiBjYXNlIGdyYW50IGNvdWxkIG5vdCBiZSByZWdpc3RlcmVkXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gdGhlIGNvbnN0cnVjdCBpbiB3aGljaCB0aGlzIGNvbnN0cnVjdCBpcyBkZWZpbmVkXG4gICAqL1xuICByZWFkb25seSBzY29wZT86IElDb25zdHJ1Y3Q7XG59XG5cbi8qKlxuICogT3B0aW9ucyBmb3IgYSBncmFudCBvcGVyYXRpb24gdG8gYm90aCBpZGVudGl0eSBhbmQgcmVzb3VyY2VcbiAqXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgR3JhbnRPblByaW5jaXBhbEFuZFJlc291cmNlT3B0aW9ucyBleHRlbmRzIENvbW1vbkdyYW50T3B0aW9ucyB7XG4gIC8qKlxuICAgKiBUaGUgcmVzb3VyY2Ugd2l0aCBhIHJlc291cmNlIHBvbGljeVxuICAgKlxuICAgKiBUaGUgc3RhdGVtZW50IHdpbGwgYWx3YXlzIGJlIGFkZGVkIHRvIHRoZSByZXNvdXJjZSBwb2xpY3kuXG4gICAqL1xuICByZWFkb25seSByZXNvdXJjZTogSVJlc291cmNlV2l0aFBvbGljeTtcblxuICAvKipcbiAgICogV2hlbiByZWZlcnJpbmcgdG8gdGhlIHJlc291cmNlIGluIGEgcmVzb3VyY2UgcG9saWN5LCB1c2UgdGhpcyBhcyBBUk4uXG4gICAqXG4gICAqIChEZXBlbmRpbmcgb24gdGhlIHJlc291cmNlIHR5cGUsIHRoaXMgbmVlZHMgdG8gYmUgJyonIGluIGEgcmVzb3VyY2UgcG9saWN5KS5cbiAgICpcbiAgICogQGRlZmF1bHQgU2FtZSBhcyByZWd1bGFyIHJlc291cmNlIEFSTnNcbiAgICovXG4gIHJlYWRvbmx5IHJlc291cmNlU2VsZkFybnM/OiBzdHJpbmdbXTtcblxuICAvKipcbiAgICogVGhlIHByaW5jaXBhbCB0byB1c2UgaW4gdGhlIHN0YXRlbWVudCBmb3IgdGhlIHJlc291cmNlIHBvbGljeS5cbiAgICpcbiAgICogQGRlZmF1bHQgLSB0aGUgcHJpbmNpcGFsIG9mIHRoZSBncmFudGVlIHdpbGwgYmUgdXNlZFxuICAgKi9cbiAgcmVhZG9ubHkgcmVzb3VyY2VQb2xpY3lQcmluY2lwYWw/OiBJUHJpbmNpcGFsO1xufVxuXG4vKipcbiAqIFJlc3VsdCBvZiBhIGdyYW50KCkgb3BlcmF0aW9uXG4gKlxuICogVGhpcyBjbGFzcyBpcyBub3QgaW5zdGFudGlhYmxlIGJ5IGNvbnN1bWVycyBvbiBwdXJwb3NlLCBzbyB0aGF0IHRoZXkgd2lsbCBiZVxuICogcmVxdWlyZWQgdG8gY2FsbCB0aGUgR3JhbnQgZmFjdG9yeSBmdW5jdGlvbnMuXG4gKi9cbmV4cG9ydCBjbGFzcyBHcmFudCBpbXBsZW1lbnRzIElEZXBlbmRhYmxlIHtcbiAgLyoqXG4gICAqIEdyYW50IHRoZSBnaXZlbiBwZXJtaXNzaW9ucyB0byB0aGUgcHJpbmNpcGFsXG4gICAqXG4gICAqIFRoZSBwZXJtaXNzaW9ucyB3aWxsIGJlIGFkZGVkIHRvIHRoZSBwcmluY2lwYWwgcG9saWN5IHByaW1hcmlseSwgZmFsbGluZ1xuICAgKiBiYWNrIHRvIHRoZSByZXNvdXJjZSBwb2xpY3kgaWYgbmVjZXNzYXJ5LiBUaGUgcGVybWlzc2lvbnMgbXVzdCBiZSBncmFudGVkXG4gICAqIHNvbWV3aGVyZS5cbiAgICpcbiAgICogLSBUcnlpbmcgdG8gZ3JhbnQgcGVybWlzc2lvbnMgdG8gYSBwcmluY2lwYWwgdGhhdCBkb2VzIG5vdCBhZG1pdCBhZGRpbmcgdG9cbiAgICogICB0aGUgcHJpbmNpcGFsIHBvbGljeSB3aGlsZSBub3QgcHJvdmlkaW5nIGEgcmVzb3VyY2Ugd2l0aCBhIHJlc291cmNlIHBvbGljeVxuICAgKiAgIGlzIGFuIGVycm9yLlxuICAgKiAtIFRyeWluZyB0byBncmFudCBwZXJtaXNzaW9ucyB0byBhbiBhYnNlbnQgcHJpbmNpcGFsIChwb3NzaWJsZSBpbiB0aGVcbiAgICogICBjYXNlIG9mIGltcG9ydGVkIHJlc291cmNlcykgbGVhZHMgdG8gYSB3YXJuaW5nIGJlaW5nIGFkZGVkIHRvIHRoZVxuICAgKiAgIHJlc291cmNlIGNvbnN0cnVjdC5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgYWRkVG9QcmluY2lwYWxPclJlc291cmNlKG9wdGlvbnM6IEdyYW50V2l0aFJlc291cmNlT3B0aW9ucyk6IEdyYW50IHtcbiAgICBjb25zdCByZXN1bHQgPSBHcmFudC5hZGRUb1ByaW5jaXBhbCh7XG4gICAgICAuLi5vcHRpb25zLFxuICAgICAgc2NvcGU6IG9wdGlvbnMucmVzb3VyY2UsXG4gICAgfSk7XG5cbiAgICBjb25zdCByZXNvdXJjZUFuZFByaW5jaXBhbEFjY291bnRDb21wYXJpc29uID0gb3B0aW9ucy5ncmFudGVlLmdyYW50UHJpbmNpcGFsLnByaW5jaXBhbEFjY291bnRcbiAgICAgID8gY2RrLlRva2VuLmNvbXBhcmVTdHJpbmdzKG9wdGlvbnMucmVzb3VyY2UuZW52LmFjY291bnQsIG9wdGlvbnMuZ3JhbnRlZS5ncmFudFByaW5jaXBhbC5wcmluY2lwYWxBY2NvdW50KVxuICAgICAgOiB1bmRlZmluZWQ7XG4gICAgLy8gaWYgYm90aCBhY2NvdW50cyBhcmUgdG9rZW5zLCB3ZSBhc3N1bWUgaGVyZSB0aGV5IGFyZSB0aGUgc2FtZVxuICAgIGNvbnN0IGVxdWFsT3JCb3RoVW5yZXNvbHZlZCA9IHJlc291cmNlQW5kUHJpbmNpcGFsQWNjb3VudENvbXBhcmlzb24gPT09IGNkay5Ub2tlbkNvbXBhcmlzb24uU0FNRVxuICAgICAgfHwgcmVzb3VyY2VBbmRQcmluY2lwYWxBY2NvdW50Q29tcGFyaXNvbiA9PSBjZGsuVG9rZW5Db21wYXJpc29uLkJPVEhfVU5SRVNPTFZFRDtcbiAgICBjb25zdCBzYW1lQWNjb3VudDogYm9vbGVhbiA9IHJlc291cmNlQW5kUHJpbmNpcGFsQWNjb3VudENvbXBhcmlzb25cbiAgICAgID8gZXF1YWxPckJvdGhVbnJlc29sdmVkXG4gICAgICAvLyBpZiB0aGUgcHJpbmNpcGFsIGRvZXNuJ3QgaGF2ZSBhbiBhY2NvdW50IChmb3IgZXhhbXBsZSwgYSBzZXJ2aWNlIHByaW5jaXBhbCksXG4gICAgICAvLyB3ZSBzaG91bGQgbW9kaWZ5IHRoZSByZXNvdXJjZSdzIHRydXN0IHBvbGljeVxuICAgICAgOiBmYWxzZTtcbiAgICAvLyBJZiB3ZSBhZGRlZCB0byB0aGUgcHJpbmNpcGFsIEFORCB3ZSdyZSBpbiB0aGUgc2FtZSBhY2NvdW50LCB0aGVuIHdlJ3JlIGRvbmUuXG4gICAgLy8gSWYgbm90LCBpdCdzIGEgZGlmZmVyZW50IGFjY291bnQgYW5kIHdlIG11c3QgYWxzbyBhZGQgYSB0cnVzdCBwb2xpY3kgb24gdGhlIHJlc291cmNlLlxuICAgIGlmIChyZXN1bHQuc3VjY2VzcyAmJiBzYW1lQWNjb3VudCkge1xuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICBjb25zdCBzdGF0ZW1lbnQgPSBuZXcgUG9saWN5U3RhdGVtZW50KHtcbiAgICAgIGFjdGlvbnM6IG9wdGlvbnMuYWN0aW9ucyxcbiAgICAgIHJlc291cmNlczogKG9wdGlvbnMucmVzb3VyY2VTZWxmQXJucyB8fCBvcHRpb25zLnJlc291cmNlQXJucyksXG4gICAgICBwcmluY2lwYWxzOiBbb3B0aW9ucy5ncmFudGVlIS5ncmFudFByaW5jaXBhbF0sXG4gICAgfSk7XG5cbiAgICBjb25zdCByZXNvdXJjZVJlc3VsdCA9IG9wdGlvbnMucmVzb3VyY2UuYWRkVG9SZXNvdXJjZVBvbGljeShzdGF0ZW1lbnQpO1xuXG4gICAgcmV0dXJuIG5ldyBHcmFudCh7XG4gICAgICByZXNvdXJjZVN0YXRlbWVudDogc3RhdGVtZW50LFxuICAgICAgb3B0aW9ucyxcbiAgICAgIHBvbGljeURlcGVuZGFibGU6IHJlc291cmNlUmVzdWx0LnN0YXRlbWVudEFkZGVkID8gcmVzb3VyY2VSZXN1bHQucG9saWN5RGVwZW5kYWJsZSA/PyBvcHRpb25zLnJlc291cmNlIDogdW5kZWZpbmVkLFxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFRyeSB0byBncmFudCB0aGUgZ2l2ZW4gcGVybWlzc2lvbnMgdG8gdGhlIGdpdmVuIHByaW5jaXBhbFxuICAgKlxuICAgKiBBYnNlbmNlIG9mIGEgcHJpbmNpcGFsIGxlYWRzIHRvIGEgd2FybmluZywgYnV0IGZhaWxpbmcgdG8gYWRkXG4gICAqIHRoZSBwZXJtaXNzaW9ucyB0byBhIHByZXNlbnQgcHJpbmNpcGFsIGlzIG5vdCBhbiBlcnJvci5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgYWRkVG9QcmluY2lwYWwob3B0aW9uczogR3JhbnRPblByaW5jaXBhbE9wdGlvbnMpOiBHcmFudCB7XG4gICAgY29uc3Qgc3RhdGVtZW50ID0gbmV3IFBvbGljeVN0YXRlbWVudCh7XG4gICAgICBhY3Rpb25zOiBvcHRpb25zLmFjdGlvbnMsXG4gICAgICByZXNvdXJjZXM6IG9wdGlvbnMucmVzb3VyY2VBcm5zLFxuICAgICAgY29uZGl0aW9uczogb3B0aW9ucy5jb25kaXRpb25zLFxuICAgIH0pO1xuXG4gICAgY29uc3QgYWRkZWRUb1ByaW5jaXBhbCA9IG9wdGlvbnMuZ3JhbnRlZS5ncmFudFByaW5jaXBhbC5hZGRUb1ByaW5jaXBhbFBvbGljeShzdGF0ZW1lbnQpO1xuICAgIGlmICghYWRkZWRUb1ByaW5jaXBhbC5zdGF0ZW1lbnRBZGRlZCkge1xuICAgICAgcmV0dXJuIG5ldyBHcmFudCh7IHByaW5jaXBhbFN0YXRlbWVudDogdW5kZWZpbmVkLCBvcHRpb25zIH0pO1xuICAgIH1cblxuICAgIGlmICghYWRkZWRUb1ByaW5jaXBhbC5wb2xpY3lEZXBlbmRhYmxlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0NvbnRyYWN0IHZpb2xhdGlvbjogd2hlbiBQcmluY2lwYWwgcmV0dXJucyBzdGF0ZW1lbnRBZGRlZD10cnVlLCBpdCBzaG91bGQgcmV0dXJuIGEgZGVwZW5kYWJsZScpO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgR3JhbnQoeyBwcmluY2lwYWxTdGF0ZW1lbnQ6IHN0YXRlbWVudCwgb3B0aW9ucywgcG9saWN5RGVwZW5kYWJsZTogYWRkZWRUb1ByaW5jaXBhbC5wb2xpY3lEZXBlbmRhYmxlIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBhIGdyYW50IGJvdGggb24gdGhlIHByaW5jaXBhbCBhbmQgb24gdGhlIHJlc291cmNlXG4gICAqXG4gICAqIEFzIGxvbmcgYXMgYW55IHByaW5jaXBhbCBpcyBnaXZlbiwgZ3JhbnRpbmcgb24gdGhlIHByaW5jaXBhbCBtYXkgZmFpbCAoaW5cbiAgICogY2FzZSBvZiBhIG5vbi1pZGVudGl0eSBwcmluY2lwYWwpLCBidXQgZ3JhbnRpbmcgb24gdGhlIHJlc291cmNlIHdpbGxcbiAgICogbmV2ZXIgZmFpbC5cbiAgICpcbiAgICogU3RhdGVtZW50IHdpbGwgYmUgdGhlIHJlc291cmNlIHN0YXRlbWVudC5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgYWRkVG9QcmluY2lwYWxBbmRSZXNvdXJjZShvcHRpb25zOiBHcmFudE9uUHJpbmNpcGFsQW5kUmVzb3VyY2VPcHRpb25zKTogR3JhbnQge1xuICAgIGNvbnN0IHJlc3VsdCA9IEdyYW50LmFkZFRvUHJpbmNpcGFsKHtcbiAgICAgIC4uLm9wdGlvbnMsXG4gICAgICBzY29wZTogb3B0aW9ucy5yZXNvdXJjZSxcbiAgICB9KTtcblxuICAgIGNvbnN0IHN0YXRlbWVudCA9IG5ldyBQb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgYWN0aW9uczogb3B0aW9ucy5hY3Rpb25zLFxuICAgICAgcmVzb3VyY2VzOiAob3B0aW9ucy5yZXNvdXJjZVNlbGZBcm5zIHx8IG9wdGlvbnMucmVzb3VyY2VBcm5zKSxcbiAgICAgIHByaW5jaXBhbHM6IFtvcHRpb25zLnJlc291cmNlUG9saWN5UHJpbmNpcGFsIHx8IG9wdGlvbnMuZ3JhbnRlZSEuZ3JhbnRQcmluY2lwYWxdLFxuICAgIH0pO1xuXG4gICAgY29uc3QgcmVzb3VyY2VSZXN1bHQgPSBvcHRpb25zLnJlc291cmNlLmFkZFRvUmVzb3VyY2VQb2xpY3koc3RhdGVtZW50KTtcbiAgICBjb25zdCByZXNvdXJjZURlcGVuZGFibGUgPSByZXNvdXJjZVJlc3VsdC5zdGF0ZW1lbnRBZGRlZCA/IHJlc291cmNlUmVzdWx0LnBvbGljeURlcGVuZGFibGUgPz8gb3B0aW9ucy5yZXNvdXJjZSA6IHVuZGVmaW5lZDtcblxuICAgIHJldHVybiBuZXcgR3JhbnQoe1xuICAgICAgcHJpbmNpcGFsU3RhdGVtZW50OiBzdGF0ZW1lbnQsXG4gICAgICByZXNvdXJjZVN0YXRlbWVudDogcmVzdWx0LnJlc291cmNlU3RhdGVtZW50LFxuICAgICAgb3B0aW9ucyxcbiAgICAgIHBvbGljeURlcGVuZGFibGU6IHJlc291cmNlRGVwZW5kYWJsZSA/IG5ldyBDb21wb3NpdGVEZXBlbmRhYmxlKHJlc3VsdCwgcmVzb3VyY2VEZXBlbmRhYmxlKSA6IHJlc3VsdCxcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgXCJuby1vcFwiIGBHcmFudGAgb2JqZWN0IHdoaWNoIHJlcHJlc2VudHMgYSBcImRyb3BwZWQgZ3JhbnRcIi5cbiAgICpcbiAgICogVGhpcyBjYW4gYmUgdXNlZCBmb3IgZS5nLiBpbXBvcnRlZCByZXNvdXJjZXMgd2hlcmUgeW91IG1heSBub3QgYmUgYWJsZSB0byBtb2RpZnlcbiAgICogdGhlIHJlc291cmNlJ3MgcG9saWN5IG9yIHNvbWUgdW5kZXJseWluZyBwb2xpY3kgd2hpY2ggeW91IGRvbid0IGtub3cgYWJvdXQuXG4gICAqXG4gICAqIEBwYXJhbSBncmFudGVlIFRoZSBpbnRlbmRlZCBncmFudGVlXG4gICAqIEBwYXJhbSBfaW50ZW50IFRoZSB1c2VyJ3MgaW50ZW50ICh3aWxsIGJlIGlnbm9yZWQgYXQgdGhlIG1vbWVudClcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZHJvcChncmFudGVlOiBJR3JhbnRhYmxlLCBfaW50ZW50OiBzdHJpbmcpOiBHcmFudCB7XG4gICAgcmV0dXJuIG5ldyBHcmFudCh7XG4gICAgICBvcHRpb25zOiB7IGdyYW50ZWUsIGFjdGlvbnM6IFtdLCByZXNvdXJjZUFybnM6IFtdIH0sXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogVGhlIHN0YXRlbWVudCB0aGF0IHdhcyBhZGRlZCB0byB0aGUgcHJpbmNpcGFsJ3MgcG9saWN5XG4gICAqXG4gICAqIEBkZXByZWNhdGVkIFVzZSBgcHJpbmNpcGFsU3RhdGVtZW50c2AgaW5zdGVhZFxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IHByaW5jaXBhbFN0YXRlbWVudD86IFBvbGljeVN0YXRlbWVudDtcblxuICAvKipcbiAgICogVGhlIHN0YXRlbWVudHMgdGhhdCB3ZXJlIGFkZGVkIHRvIHRoZSBwcmluY2lwYWwncyBwb2xpY3lcbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBwcmluY2lwYWxTdGF0ZW1lbnRzID0gbmV3IEFycmF5PFBvbGljeVN0YXRlbWVudD4oKTtcblxuICAvKipcbiAgICogVGhlIHN0YXRlbWVudCB0aGF0IHdhcyBhZGRlZCB0byB0aGUgcmVzb3VyY2UgcG9saWN5XG4gICAqXG4gICAqIEBkZXByZWNhdGVkIFVzZSBgcmVzb3VyY2VTdGF0ZW1lbnRzYCBpbnN0ZWFkXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgcmVzb3VyY2VTdGF0ZW1lbnQ/OiBQb2xpY3lTdGF0ZW1lbnQ7XG5cbiAgLyoqXG4gICAqIFRoZSBzdGF0ZW1lbnRzIHRoYXQgd2VyZSBhZGRlZCB0byB0aGUgcHJpbmNpcGFsJ3MgcG9saWN5XG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgcmVzb3VyY2VTdGF0ZW1lbnRzID0gbmV3IEFycmF5PFBvbGljeVN0YXRlbWVudD4oKTtcblxuICAvKipcbiAgICogVGhlIG9wdGlvbnMgb3JpZ2luYWxseSB1c2VkIHRvIHNldCB0aGlzIHJlc3VsdFxuICAgKlxuICAgKiBQcml2YXRlIG1lbWJlciBkb3VibGVzIGFzIGEgd2F5IHRvIG1ha2UgaXQgaW1wb3NzaWJsZSBmb3IgYW4gb2JqZWN0IGxpdGVyYWwgdG9cbiAgICogYmUgc3RydWN0dXJhbGx5IHRoZSBzYW1lIGFzIHRoaXMgY2xhc3MuXG4gICAqL1xuICBwcml2YXRlIHJlYWRvbmx5IG9wdGlvbnM6IENvbW1vbkdyYW50T3B0aW9ucztcblxuICBwcml2YXRlIHJlYWRvbmx5IGRlcGVuZGFibGVzID0gbmV3IEFycmF5PElEZXBlbmRhYmxlPigpO1xuXG4gIHByaXZhdGUgY29uc3RydWN0b3IocHJvcHM6IEdyYW50UHJvcHMpIHtcbiAgICB0aGlzLm9wdGlvbnMgPSBwcm9wcy5vcHRpb25zO1xuICAgIHRoaXMucHJpbmNpcGFsU3RhdGVtZW50ID0gcHJvcHMucHJpbmNpcGFsU3RhdGVtZW50O1xuICAgIHRoaXMucmVzb3VyY2VTdGF0ZW1lbnQgPSBwcm9wcy5yZXNvdXJjZVN0YXRlbWVudDtcbiAgICBpZiAodGhpcy5wcmluY2lwYWxTdGF0ZW1lbnQpIHtcbiAgICAgIHRoaXMucHJpbmNpcGFsU3RhdGVtZW50cy5wdXNoKHRoaXMucHJpbmNpcGFsU3RhdGVtZW50KTtcbiAgICB9XG4gICAgaWYgKHRoaXMucmVzb3VyY2VTdGF0ZW1lbnQpIHtcbiAgICAgIHRoaXMucmVzb3VyY2VTdGF0ZW1lbnRzLnB1c2godGhpcy5yZXNvdXJjZVN0YXRlbWVudCk7XG4gICAgfVxuICAgIGlmIChwcm9wcy5wb2xpY3lEZXBlbmRhYmxlKSB7XG4gICAgICB0aGlzLmRlcGVuZGFibGVzLnB1c2gocHJvcHMucG9saWN5RGVwZW5kYWJsZSk7XG4gICAgfVxuXG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgRGVwZW5kYWJsZS5pbXBsZW1lbnQodGhpcywge1xuICAgICAgZ2V0IGRlcGVuZGVuY3lSb290cygpIHtcbiAgICAgICAgcmV0dXJuIEFycmF5LmZyb20obmV3IFNldChzZWxmLmRlcGVuZGFibGVzLmZsYXRNYXAoZCA9PiBEZXBlbmRhYmxlLm9mKGQpLmRlcGVuZGVuY3lSb290cykpKTtcbiAgICAgIH0sXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogV2hldGhlciB0aGUgZ3JhbnQgb3BlcmF0aW9uIHdhcyBzdWNjZXNzZnVsXG4gICAqL1xuICBwdWJsaWMgZ2V0IHN1Y2Nlc3MoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMucHJpbmNpcGFsU3RhdGVtZW50ICE9PSB1bmRlZmluZWQgfHwgdGhpcy5yZXNvdXJjZVN0YXRlbWVudCAhPT0gdW5kZWZpbmVkO1xuICB9XG5cbiAgLyoqXG4gICAqIFRocm93IGFuIGVycm9yIGlmIHRoaXMgZ3JhbnQgd2Fzbid0IHN1Y2Nlc3NmdWxcbiAgICovXG4gIHB1YmxpYyBhc3NlcnRTdWNjZXNzKCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5zdWNjZXNzKSB7XG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbWF4LWxlblxuICAgICAgdGhyb3cgbmV3IEVycm9yKGAke2Rlc2NyaWJlR3JhbnQodGhpcy5vcHRpb25zKX0gY291bGQgbm90IGJlIGFkZGVkIG9uIGVpdGhlciBpZGVudGl0eSBvciByZXNvdXJjZSBwb2xpY3kuYCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIE1ha2Ugc3VyZSB0aGlzIGdyYW50IGlzIGFwcGxpZWQgYmVmb3JlIHRoZSBnaXZlbiBjb25zdHJ1Y3RzIGFyZSBkZXBsb3llZFxuICAgKlxuICAgKiBUaGUgc2FtZSBhcyBjb25zdHJ1Y3Qubm9kZS5hZGREZXBlbmRlbmN5KGdyYW50KSwgYnV0IHNsaWdodGx5IG5pY2VyIHRvIHJlYWQuXG4gICAqL1xuICBwdWJsaWMgYXBwbHlCZWZvcmUoLi4uY29uc3RydWN0czogSUNvbnN0cnVjdFtdKSB7XG4gICAgZm9yIChjb25zdCBjb25zdHJ1Y3Qgb2YgY29uc3RydWN0cykge1xuICAgICAgY29uc3RydWN0Lm5vZGUuYWRkRGVwZW5kZW5jeSh0aGlzKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ29tYmluZSB0d28gZ3JhbnRzIGludG8gYSBuZXcgb25lXG4gICAqL1xuICBwdWJsaWMgY29tYmluZShyaHM6IEdyYW50KSB7XG4gICAgY29uc3QgY29tYmluZWRQcmluYyA9IFsuLi50aGlzLnByaW5jaXBhbFN0YXRlbWVudHMsIC4uLnJocy5wcmluY2lwYWxTdGF0ZW1lbnRzXTtcbiAgICBjb25zdCBjb21iaW5lZFJlcyA9IFsuLi50aGlzLnJlc291cmNlU3RhdGVtZW50cywgLi4ucmhzLnJlc291cmNlU3RhdGVtZW50c107XG5cbiAgICBjb25zdCByZXQgPSBuZXcgR3JhbnQoe1xuICAgICAgb3B0aW9uczogdGhpcy5vcHRpb25zLFxuICAgICAgcHJpbmNpcGFsU3RhdGVtZW50OiBjb21iaW5lZFByaW5jWzBdLFxuICAgICAgcmVzb3VyY2VTdGF0ZW1lbnQ6IGNvbWJpbmVkUmVzWzBdLFxuICAgIH0pO1xuICAgIHJldC5wcmluY2lwYWxTdGF0ZW1lbnRzLnNwbGljZSgwLCByZXQucHJpbmNpcGFsU3RhdGVtZW50cy5sZW5ndGgsIC4uLmNvbWJpbmVkUHJpbmMpO1xuICAgIHJldC5yZXNvdXJjZVN0YXRlbWVudHMuc3BsaWNlKDAsIHJldC5yZXNvdXJjZVN0YXRlbWVudHMubGVuZ3RoLCAuLi5jb21iaW5lZFJlcyk7XG4gICAgcmV0LmRlcGVuZGFibGVzLnB1c2goLi4udGhpcy5kZXBlbmRhYmxlcywgLi4ucmhzLmRlcGVuZGFibGVzKTtcbiAgICByZXR1cm4gcmV0O1xuICB9XG59XG5cbmZ1bmN0aW9uIGRlc2NyaWJlR3JhbnQob3B0aW9uczogQ29tbW9uR3JhbnRPcHRpb25zKSB7XG4gIHJldHVybiBgUGVybWlzc2lvbnMgZm9yICcke29wdGlvbnMuZ3JhbnRlZX0nIHRvIGNhbGwgJyR7b3B0aW9ucy5hY3Rpb25zfScgb24gJyR7b3B0aW9ucy5yZXNvdXJjZUFybnN9J2A7XG59XG5cbmludGVyZmFjZSBHcmFudFByb3BzIHtcbiAgcmVhZG9ubHkgb3B0aW9uczogQ29tbW9uR3JhbnRPcHRpb25zO1xuICByZWFkb25seSBwcmluY2lwYWxTdGF0ZW1lbnQ/OiBQb2xpY3lTdGF0ZW1lbnQ7XG4gIHJlYWRvbmx5IHJlc291cmNlU3RhdGVtZW50PzogUG9saWN5U3RhdGVtZW50O1xuXG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RzIHdob3NlIGRlcGxveW1lbnQgYXBwbGllcyB0aGUgZ3JhbnRcbiAgICpcbiAgICogVXNlZCB0byBhZGQgZGVwZW5kZW5jaWVzIG9uIGdyYW50c1xuICAgKi9cbiAgcmVhZG9ubHkgcG9saWN5RGVwZW5kYWJsZT86IElEZXBlbmRhYmxlO1xufVxuXG4vKipcbiAqIEEgcmVzb3VyY2Ugd2l0aCBhIHJlc291cmNlIHBvbGljeSB0aGF0IGNhbiBiZSBhZGRlZCB0b1xuICovXG5leHBvcnQgaW50ZXJmYWNlIElSZXNvdXJjZVdpdGhQb2xpY3kgZXh0ZW5kcyBjZGsuSVJlc291cmNlIHtcbiAgLyoqXG4gICAqIEFkZCBhIHN0YXRlbWVudCB0byB0aGUgcmVzb3VyY2UncyByZXNvdXJjZSBwb2xpY3lcbiAgICovXG4gIGFkZFRvUmVzb3VyY2VQb2xpY3koc3RhdGVtZW50OiBQb2xpY3lTdGF0ZW1lbnQpOiBBZGRUb1Jlc291cmNlUG9saWN5UmVzdWx0O1xufVxuXG4vKipcbiAqIFJlc3VsdCBvZiBjYWxsaW5nIGFkZFRvUmVzb3VyY2VQb2xpY3lcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBBZGRUb1Jlc291cmNlUG9saWN5UmVzdWx0IHtcbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhlIHN0YXRlbWVudCB3YXMgYWRkZWRcbiAgICovXG4gIHJlYWRvbmx5IHN0YXRlbWVudEFkZGVkOiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBEZXBlbmRhYmxlIHdoaWNoIGFsbG93cyBkZXBlbmRpbmcgb24gdGhlIHBvbGljeSBjaGFuZ2UgYmVpbmcgYXBwbGllZFxuICAgKlxuICAgKiBAZGVmYXVsdCAtIElmIGBzdGF0ZW1lbnRBZGRlZGAgaXMgdHJ1ZSwgdGhlIHJlc291cmNlIG9iamVjdCBpdHNlbGYuXG4gICAqIE90aGVyd2lzZSwgbm8gZGVwZW5kYWJsZS5cbiAgICovXG4gIHJlYWRvbmx5IHBvbGljeURlcGVuZGFibGU/OiBJRGVwZW5kYWJsZTtcbn1cblxuLyoqXG4gKiBDb21wb3NpdGUgZGVwZW5kYWJsZVxuICpcbiAqIE5vdCBhcyBzaW1wbGUgYXMgZWFnZXJseSBnZXR0aW5nIHRoZSBkZXBlbmRlbmN5IHJvb3RzIGZyb20gdGhlXG4gKiBpbm5lciBkZXBlbmRhYmxlcywgYXMgdGhleSBtYXkgYmUgbXV0YWJsZSBzbyB3ZSBuZWVkIHRvIGRlZmVyXG4gKiB0aGUgcXVlcnkuXG4gKi9cbmV4cG9ydCBjbGFzcyBDb21wb3NpdGVEZXBlbmRhYmxlIGltcGxlbWVudHMgSURlcGVuZGFibGUge1xuICBjb25zdHJ1Y3RvciguLi5kZXBlbmRhYmxlczogSURlcGVuZGFibGVbXSkge1xuICAgIERlcGVuZGFibGUuaW1wbGVtZW50KHRoaXMsIHtcbiAgICAgIGdldCBkZXBlbmRlbmN5Um9vdHMoKTogSUNvbnN0cnVjdFtdIHtcbiAgICAgICAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5jb25jYXQuYXBwbHkoW10sIGRlcGVuZGFibGVzLm1hcChkID0+IERlcGVuZGFibGUub2YoZCkuZGVwZW5kZW5jeVJvb3RzKSk7XG4gICAgICB9LFxuICAgIH0pO1xuICB9XG59XG4iXX0=