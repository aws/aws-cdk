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
exports.Grant = Grant;
_a = JSII_RTTI_SYMBOL_1;
Grant[_a] = { fqn: "@aws-cdk/aws-iam.Grant", version: "0.0.0" };
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
exports.CompositeDependable = CompositeDependable;
_b = JSII_RTTI_SYMBOL_1;
CompositeDependable[_b] = { fqn: "@aws-cdk/aws-iam.CompositeDependable", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JhbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJncmFudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxxQ0FBcUM7QUFDckMsMkNBQWlFO0FBQ2pFLHlEQUFxRDtBQWtHckQ7Ozs7O0dBS0c7QUFDSCxNQUFhLEtBQUs7SUErSmhCLFlBQW9CLEtBQWlCO1FBM0JyQzs7V0FFRztRQUNhLHdCQUFtQixHQUFHLElBQUksS0FBSyxFQUFtQixDQUFDO1FBU25FOztXQUVHO1FBQ2EsdUJBQWtCLEdBQUcsSUFBSSxLQUFLLEVBQW1CLENBQUM7UUFVakQsZ0JBQVcsR0FBRyxJQUFJLEtBQUssRUFBZSxDQUFDO1FBR3RELElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQztRQUM3QixJQUFJLENBQUMsa0JBQWtCLEdBQUcsS0FBSyxDQUFDLGtCQUFrQixDQUFDO1FBQ25ELElBQUksQ0FBQyxpQkFBaUIsR0FBRyxLQUFLLENBQUMsaUJBQWlCLENBQUM7UUFDakQsSUFBSSxJQUFJLENBQUMsa0JBQWtCLEVBQUU7WUFDM0IsSUFBSSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQztTQUN4RDtRQUNELElBQUksSUFBSSxDQUFDLGlCQUFpQixFQUFFO1lBQzFCLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUM7U0FDdEQ7UUFDRCxJQUFJLEtBQUssQ0FBQyxnQkFBZ0IsRUFBRTtZQUMxQixJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztTQUMvQztRQUVELE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQztRQUNsQix1QkFBVSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUU7WUFDekIsSUFBSSxlQUFlO2dCQUNqQixPQUFPLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxH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Q0FBQyxDQUFDO1NBQ2xDLENBQUMsQ0FBQztRQUNILEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxNQUFNLEVBQUUsR0FBRyxhQUFhLENBQUMsQ0FBQztRQUNwRixHQUFHLENBQUMsa0JBQWtCLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsa0JBQWtCLENBQUMsTUFBTSxFQUFFLEdBQUcsV0FBVyxDQUFDLENBQUM7UUFDaEYsR0FBRyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsV0FBVyxFQUFFLEdBQUcsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQzlELE9BQU8sR0FBRyxDQUFDO0tBQ1o7O0FBak9ILHNCQWtPQzs7O0FBRUQsU0FBUyxhQUFhLENBQUMsT0FBMkI7SUFDaEQsT0FBTyxvQkFBb0IsT0FBTyxDQUFDLE9BQU8sY0FBYyxPQUFPLENBQUMsT0FBTyxTQUFTLE9BQU8sQ0FBQyxZQUFZLEdBQUcsQ0FBQztBQUMxRyxDQUFDO0FBMkNEOzs7Ozs7R0FNRztBQUNILE1BQWEsbUJBQW1CO0lBQzlCLFlBQVksR0FBRyxXQUEwQjtRQUN2Qyx1QkFBVSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUU7WUFDekIsSUFBSSxlQUFlO2dCQUNqQixPQUFPLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUUsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLHVCQUFVLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUM7WUFDbEcsQ0FBQztTQUNGLENBQUMsQ0FBQztLQUNKOztBQVBILGtEQVFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY2RrIGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgRGVwZW5kYWJsZSwgSUNvbnN0cnVjdCwgSURlcGVuZGFibGUgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IFBvbGljeVN0YXRlbWVudCB9IGZyb20gJy4vcG9saWN5LXN0YXRlbWVudCc7XG5pbXBvcnQgeyBJR3JhbnRhYmxlLCBJUHJpbmNpcGFsIH0gZnJvbSAnLi9wcmluY2lwYWxzJztcblxuLyoqXG4gKiBCYXNpYyBvcHRpb25zIGZvciBhIGdyYW50IG9wZXJhdGlvblxuICpcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBDb21tb25HcmFudE9wdGlvbnMge1xuICAvKipcbiAgICogVGhlIHByaW5jaXBhbCB0byBncmFudCB0b1xuICAgKlxuICAgKiBAZGVmYXVsdCBpZiBwcmluY2lwYWwgaXMgdW5kZWZpbmVkLCBubyB3b3JrIGlzIGRvbmUuXG4gICAqL1xuICByZWFkb25seSBncmFudGVlOiBJR3JhbnRhYmxlO1xuXG4gIC8qKlxuICAgKiBUaGUgYWN0aW9ucyB0byBncmFudFxuICAgKi9cbiAgcmVhZG9ubHkgYWN0aW9uczogc3RyaW5nW107XG5cbiAgLyoqXG4gICAqIFRoZSByZXNvdXJjZSBBUk5zIHRvIGdyYW50IHRvXG4gICAqL1xuICByZWFkb25seSByZXNvdXJjZUFybnM6IHN0cmluZ1tdO1xuXG4gIC8qKlxuICAgKiBBbnkgY29uZGl0aW9ucyB0byBhdHRhY2ggdG8gdGhlIGdyYW50XG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm8gY29uZGl0aW9uc1xuICAgKi9cbiAgcmVhZG9ubHkgY29uZGl0aW9ucz86IFJlY29yZDxzdHJpbmcsIFJlY29yZDxzdHJpbmcsIHVua25vd24+Pjtcbn1cblxuLyoqXG4gKiBPcHRpb25zIGZvciBhIGdyYW50IG9wZXJhdGlvblxuICpcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBHcmFudFdpdGhSZXNvdXJjZU9wdGlvbnMgZXh0ZW5kcyBDb21tb25HcmFudE9wdGlvbnMge1xuICAvKipcbiAgICogVGhlIHJlc291cmNlIHdpdGggYSByZXNvdXJjZSBwb2xpY3lcbiAgICpcbiAgICogVGhlIHN0YXRlbWVudCB3aWxsIGJlIGFkZGVkIHRvIHRoZSByZXNvdXJjZSBwb2xpY3kgaWYgaXQgY291bGRuJ3QgYmVcbiAgICogYWRkZWQgdG8gdGhlIHByaW5jaXBhbCBwb2xpY3kuXG4gICAqL1xuICByZWFkb25seSByZXNvdXJjZTogSVJlc291cmNlV2l0aFBvbGljeTtcblxuICAvKipcbiAgICogV2hlbiByZWZlcnJpbmcgdG8gdGhlIHJlc291cmNlIGluIGEgcmVzb3VyY2UgcG9saWN5LCB1c2UgdGhpcyBhcyBBUk4uXG4gICAqXG4gICAqIChEZXBlbmRpbmcgb24gdGhlIHJlc291cmNlIHR5cGUsIHRoaXMgbmVlZHMgdG8gYmUgJyonIGluIGEgcmVzb3VyY2UgcG9saWN5KS5cbiAgICpcbiAgICogQGRlZmF1bHQgU2FtZSBhcyByZWd1bGFyIHJlc291cmNlIEFSTnNcbiAgICovXG4gIHJlYWRvbmx5IHJlc291cmNlU2VsZkFybnM/OiBzdHJpbmdbXTtcbn1cblxuLyoqXG4gKiBPcHRpb25zIGZvciBhIGdyYW50IG9wZXJhdGlvbiB0aGF0IG9ubHkgYXBwbGllcyB0byBwcmluY2lwYWxzXG4gKlxuICovXG5leHBvcnQgaW50ZXJmYWNlIEdyYW50T25QcmluY2lwYWxPcHRpb25zIGV4dGVuZHMgQ29tbW9uR3JhbnRPcHRpb25zIHtcbiAgLyoqXG4gICAqIENvbnN0cnVjdCB0byByZXBvcnQgd2FybmluZ3Mgb24gaW4gY2FzZSBncmFudCBjb3VsZCBub3QgYmUgcmVnaXN0ZXJlZFxuICAgKlxuICAgKiBAZGVmYXVsdCAtIHRoZSBjb25zdHJ1Y3QgaW4gd2hpY2ggdGhpcyBjb25zdHJ1Y3QgaXMgZGVmaW5lZFxuICAgKi9cbiAgcmVhZG9ubHkgc2NvcGU/OiBJQ29uc3RydWN0O1xufVxuXG4vKipcbiAqIE9wdGlvbnMgZm9yIGEgZ3JhbnQgb3BlcmF0aW9uIHRvIGJvdGggaWRlbnRpdHkgYW5kIHJlc291cmNlXG4gKlxuICovXG5leHBvcnQgaW50ZXJmYWNlIEdyYW50T25QcmluY2lwYWxBbmRSZXNvdXJjZU9wdGlvbnMgZXh0ZW5kcyBDb21tb25HcmFudE9wdGlvbnMge1xuICAvKipcbiAgICogVGhlIHJlc291cmNlIHdpdGggYSByZXNvdXJjZSBwb2xpY3lcbiAgICpcbiAgICogVGhlIHN0YXRlbWVudCB3aWxsIGFsd2F5cyBiZSBhZGRlZCB0byB0aGUgcmVzb3VyY2UgcG9saWN5LlxuICAgKi9cbiAgcmVhZG9ubHkgcmVzb3VyY2U6IElSZXNvdXJjZVdpdGhQb2xpY3k7XG5cbiAgLyoqXG4gICAqIFdoZW4gcmVmZXJyaW5nIHRvIHRoZSByZXNvdXJjZSBpbiBhIHJlc291cmNlIHBvbGljeSwgdXNlIHRoaXMgYXMgQVJOLlxuICAgKlxuICAgKiAoRGVwZW5kaW5nIG9uIHRoZSByZXNvdXJjZSB0eXBlLCB0aGlzIG5lZWRzIHRvIGJlICcqJyBpbiBhIHJlc291cmNlIHBvbGljeSkuXG4gICAqXG4gICAqIEBkZWZhdWx0IFNhbWUgYXMgcmVndWxhciByZXNvdXJjZSBBUk5zXG4gICAqL1xuICByZWFkb25seSByZXNvdXJjZVNlbGZBcm5zPzogc3RyaW5nW107XG5cbiAgLyoqXG4gICAqIFRoZSBwcmluY2lwYWwgdG8gdXNlIGluIHRoZSBzdGF0ZW1lbnQgZm9yIHRoZSByZXNvdXJjZSBwb2xpY3kuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gdGhlIHByaW5jaXBhbCBvZiB0aGUgZ3JhbnRlZSB3aWxsIGJlIHVzZWRcbiAgICovXG4gIHJlYWRvbmx5IHJlc291cmNlUG9saWN5UHJpbmNpcGFsPzogSVByaW5jaXBhbDtcbn1cblxuLyoqXG4gKiBSZXN1bHQgb2YgYSBncmFudCgpIG9wZXJhdGlvblxuICpcbiAqIFRoaXMgY2xhc3MgaXMgbm90IGluc3RhbnRpYWJsZSBieSBjb25zdW1lcnMgb24gcHVycG9zZSwgc28gdGhhdCB0aGV5IHdpbGwgYmVcbiAqIHJlcXVpcmVkIHRvIGNhbGwgdGhlIEdyYW50IGZhY3RvcnkgZnVuY3Rpb25zLlxuICovXG5leHBvcnQgY2xhc3MgR3JhbnQgaW1wbGVtZW50cyBJRGVwZW5kYWJsZSB7XG4gIC8qKlxuICAgKiBHcmFudCB0aGUgZ2l2ZW4gcGVybWlzc2lvbnMgdG8gdGhlIHByaW5jaXBhbFxuICAgKlxuICAgKiBUaGUgcGVybWlzc2lvbnMgd2lsbCBiZSBhZGRlZCB0byB0aGUgcHJpbmNpcGFsIHBvbGljeSBwcmltYXJpbHksIGZhbGxpbmdcbiAgICogYmFjayB0byB0aGUgcmVzb3VyY2UgcG9saWN5IGlmIG5lY2Vzc2FyeS4gVGhlIHBlcm1pc3Npb25zIG11c3QgYmUgZ3JhbnRlZFxuICAgKiBzb21ld2hlcmUuXG4gICAqXG4gICAqIC0gVHJ5aW5nIHRvIGdyYW50IHBlcm1pc3Npb25zIHRvIGEgcHJpbmNpcGFsIHRoYXQgZG9lcyBub3QgYWRtaXQgYWRkaW5nIHRvXG4gICAqICAgdGhlIHByaW5jaXBhbCBwb2xpY3kgd2hpbGUgbm90IHByb3ZpZGluZyBhIHJlc291cmNlIHdpdGggYSByZXNvdXJjZSBwb2xpY3lcbiAgICogICBpcyBhbiBlcnJvci5cbiAgICogLSBUcnlpbmcgdG8gZ3JhbnQgcGVybWlzc2lvbnMgdG8gYW4gYWJzZW50IHByaW5jaXBhbCAocG9zc2libGUgaW4gdGhlXG4gICAqICAgY2FzZSBvZiBpbXBvcnRlZCByZXNvdXJjZXMpIGxlYWRzIHRvIGEgd2FybmluZyBiZWluZyBhZGRlZCB0byB0aGVcbiAgICogICByZXNvdXJjZSBjb25zdHJ1Y3QuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGFkZFRvUHJpbmNpcGFsT3JSZXNvdXJjZShvcHRpb25zOiBHcmFudFdpdGhSZXNvdXJjZU9wdGlvbnMpOiBHcmFudCB7XG4gICAgY29uc3QgcmVzdWx0ID0gR3JhbnQuYWRkVG9QcmluY2lwYWwoe1xuICAgICAgLi4ub3B0aW9ucyxcbiAgICAgIHNjb3BlOiBvcHRpb25zLnJlc291cmNlLFxuICAgIH0pO1xuXG4gICAgY29uc3QgcmVzb3VyY2VBbmRQcmluY2lwYWxBY2NvdW50Q29tcGFyaXNvbiA9IG9wdGlvbnMuZ3JhbnRlZS5ncmFudFByaW5jaXBhbC5wcmluY2lwYWxBY2NvdW50XG4gICAgICA/IGNkay5Ub2tlbi5jb21wYXJlU3RyaW5ncyhvcHRpb25zLnJlc291cmNlLmVudi5hY2NvdW50LCBvcHRpb25zLmdyYW50ZWUuZ3JhbnRQcmluY2lwYWwucHJpbmNpcGFsQWNjb3VudClcbiAgICAgIDogdW5kZWZpbmVkO1xuICAgIC8vIGlmIGJvdGggYWNjb3VudHMgYXJlIHRva2Vucywgd2UgYXNzdW1lIGhlcmUgdGhleSBhcmUgdGhlIHNhbWVcbiAgICBjb25zdCBlcXVhbE9yQm90aFVucmVzb2x2ZWQgPSByZXNvdXJjZUFuZFByaW5jaXBhbEFjY291bnRDb21wYXJpc29uID09PSBjZGsuVG9rZW5Db21wYXJpc29uLlNBTUVcbiAgICAgIHx8IHJlc291cmNlQW5kUHJpbmNpcGFsQWNjb3VudENvbXBhcmlzb24gPT0gY2RrLlRva2VuQ29tcGFyaXNvbi5CT1RIX1VOUkVTT0xWRUQ7XG4gICAgY29uc3Qgc2FtZUFjY291bnQ6IGJvb2xlYW4gPSByZXNvdXJjZUFuZFByaW5jaXBhbEFjY291bnRDb21wYXJpc29uXG4gICAgICA/IGVxdWFsT3JCb3RoVW5yZXNvbHZlZFxuICAgICAgLy8gaWYgdGhlIHByaW5jaXBhbCBkb2Vzbid0IGhhdmUgYW4gYWNjb3VudCAoZm9yIGV4YW1wbGUsIGEgc2VydmljZSBwcmluY2lwYWwpLFxuICAgICAgLy8gd2Ugc2hvdWxkIG1vZGlmeSB0aGUgcmVzb3VyY2UncyB0cnVzdCBwb2xpY3lcbiAgICAgIDogZmFsc2U7XG4gICAgLy8gSWYgd2UgYWRkZWQgdG8gdGhlIHByaW5jaXBhbCBBTkQgd2UncmUgaW4gdGhlIHNhbWUgYWNjb3VudCwgdGhlbiB3ZSdyZSBkb25lLlxuICAgIC8vIElmIG5vdCwgaXQncyBhIGRpZmZlcmVudCBhY2NvdW50IGFuZCB3ZSBtdXN0IGFsc28gYWRkIGEgdHJ1c3QgcG9saWN5IG9uIHRoZSByZXNvdXJjZS5cbiAgICBpZiAocmVzdWx0LnN1Y2Nlc3MgJiYgc2FtZUFjY291bnQpIHtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgY29uc3Qgc3RhdGVtZW50ID0gbmV3IFBvbGljeVN0YXRlbWVudCh7XG4gICAgICBhY3Rpb25zOiBvcHRpb25zLmFjdGlvbnMsXG4gICAgICByZXNvdXJjZXM6IChvcHRpb25zLnJlc291cmNlU2VsZkFybnMgfHwgb3B0aW9ucy5yZXNvdXJjZUFybnMpLFxuICAgICAgcHJpbmNpcGFsczogW29wdGlvbnMuZ3JhbnRlZSEuZ3JhbnRQcmluY2lwYWxdLFxuICAgIH0pO1xuXG4gICAgY29uc3QgcmVzb3VyY2VSZXN1bHQgPSBvcHRpb25zLnJlc291cmNlLmFkZFRvUmVzb3VyY2VQb2xpY3koc3RhdGVtZW50KTtcblxuICAgIHJldHVybiBuZXcgR3JhbnQoe1xuICAgICAgcmVzb3VyY2VTdGF0ZW1lbnQ6IHN0YXRlbWVudCxcbiAgICAgIG9wdGlvbnMsXG4gICAgICBwb2xpY3lEZXBlbmRhYmxlOiByZXNvdXJjZVJlc3VsdC5zdGF0ZW1lbnRBZGRlZCA/IHJlc291cmNlUmVzdWx0LnBvbGljeURlcGVuZGFibGUgPz8gb3B0aW9ucy5yZXNvdXJjZSA6IHVuZGVmaW5lZCxcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUcnkgdG8gZ3JhbnQgdGhlIGdpdmVuIHBlcm1pc3Npb25zIHRvIHRoZSBnaXZlbiBwcmluY2lwYWxcbiAgICpcbiAgICogQWJzZW5jZSBvZiBhIHByaW5jaXBhbCBsZWFkcyB0byBhIHdhcm5pbmcsIGJ1dCBmYWlsaW5nIHRvIGFkZFxuICAgKiB0aGUgcGVybWlzc2lvbnMgdG8gYSBwcmVzZW50IHByaW5jaXBhbCBpcyBub3QgYW4gZXJyb3IuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGFkZFRvUHJpbmNpcGFsKG9wdGlvbnM6IEdyYW50T25QcmluY2lwYWxPcHRpb25zKTogR3JhbnQge1xuICAgIGNvbnN0IHN0YXRlbWVudCA9IG5ldyBQb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgYWN0aW9uczogb3B0aW9ucy5hY3Rpb25zLFxuICAgICAgcmVzb3VyY2VzOiBvcHRpb25zLnJlc291cmNlQXJucyxcbiAgICAgIGNvbmRpdGlvbnM6IG9wdGlvbnMuY29uZGl0aW9ucyxcbiAgICB9KTtcblxuICAgIGNvbnN0IGFkZGVkVG9QcmluY2lwYWwgPSBvcHRpb25zLmdyYW50ZWUuZ3JhbnRQcmluY2lwYWwuYWRkVG9QcmluY2lwYWxQb2xpY3koc3RhdGVtZW50KTtcbiAgICBpZiAoIWFkZGVkVG9QcmluY2lwYWwuc3RhdGVtZW50QWRkZWQpIHtcbiAgICAgIHJldHVybiBuZXcgR3JhbnQoeyBwcmluY2lwYWxTdGF0ZW1lbnQ6IHVuZGVmaW5lZCwgb3B0aW9ucyB9KTtcbiAgICB9XG5cbiAgICBpZiAoIWFkZGVkVG9QcmluY2lwYWwucG9saWN5RGVwZW5kYWJsZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdDb250cmFjdCB2aW9sYXRpb246IHdoZW4gUHJpbmNpcGFsIHJldHVybnMgc3RhdGVtZW50QWRkZWQ9dHJ1ZSwgaXQgc2hvdWxkIHJldHVybiBhIGRlcGVuZGFibGUnKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IEdyYW50KHsgcHJpbmNpcGFsU3RhdGVtZW50OiBzdGF0ZW1lbnQsIG9wdGlvbnMsIHBvbGljeURlcGVuZGFibGU6IGFkZGVkVG9QcmluY2lwYWwucG9saWN5RGVwZW5kYWJsZSB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgYSBncmFudCBib3RoIG9uIHRoZSBwcmluY2lwYWwgYW5kIG9uIHRoZSByZXNvdXJjZVxuICAgKlxuICAgKiBBcyBsb25nIGFzIGFueSBwcmluY2lwYWwgaXMgZ2l2ZW4sIGdyYW50aW5nIG9uIHRoZSBwcmluY2lwYWwgbWF5IGZhaWwgKGluXG4gICAqIGNhc2Ugb2YgYSBub24taWRlbnRpdHkgcHJpbmNpcGFsKSwgYnV0IGdyYW50aW5nIG9uIHRoZSByZXNvdXJjZSB3aWxsXG4gICAqIG5ldmVyIGZhaWwuXG4gICAqXG4gICAqIFN0YXRlbWVudCB3aWxsIGJlIHRoZSByZXNvdXJjZSBzdGF0ZW1lbnQuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGFkZFRvUHJpbmNpcGFsQW5kUmVzb3VyY2Uob3B0aW9uczogR3JhbnRPblByaW5jaXBhbEFuZFJlc291cmNlT3B0aW9ucyk6IEdyYW50IHtcbiAgICBjb25zdCByZXN1bHQgPSBHcmFudC5hZGRUb1ByaW5jaXBhbCh7XG4gICAgICAuLi5vcHRpb25zLFxuICAgICAgc2NvcGU6IG9wdGlvbnMucmVzb3VyY2UsXG4gICAgfSk7XG5cbiAgICBjb25zdCBzdGF0ZW1lbnQgPSBuZXcgUG9saWN5U3RhdGVtZW50KHtcbiAgICAgIGFjdGlvbnM6IG9wdGlvbnMuYWN0aW9ucyxcbiAgICAgIHJlc291cmNlczogKG9wdGlvbnMucmVzb3VyY2VTZWxmQXJucyB8fCBvcHRpb25zLnJlc291cmNlQXJucyksXG4gICAgICBwcmluY2lwYWxzOiBbb3B0aW9ucy5yZXNvdXJjZVBvbGljeVByaW5jaXBhbCB8fCBvcHRpb25zLmdyYW50ZWUhLmdyYW50UHJpbmNpcGFsXSxcbiAgICB9KTtcblxuICAgIGNvbnN0IHJlc291cmNlUmVzdWx0ID0gb3B0aW9ucy5yZXNvdXJjZS5hZGRUb1Jlc291cmNlUG9saWN5KHN0YXRlbWVudCk7XG4gICAgY29uc3QgcmVzb3VyY2VEZXBlbmRhYmxlID0gcmVzb3VyY2VSZXN1bHQuc3RhdGVtZW50QWRkZWQgPyByZXNvdXJjZVJlc3VsdC5wb2xpY3lEZXBlbmRhYmxlID8/IG9wdGlvbnMucmVzb3VyY2UgOiB1bmRlZmluZWQ7XG5cbiAgICByZXR1cm4gbmV3IEdyYW50KHtcbiAgICAgIHByaW5jaXBhbFN0YXRlbWVudDogc3RhdGVtZW50LFxuICAgICAgcmVzb3VyY2VTdGF0ZW1lbnQ6IHJlc3VsdC5yZXNvdXJjZVN0YXRlbWVudCxcbiAgICAgIG9wdGlvbnMsXG4gICAgICBwb2xpY3lEZXBlbmRhYmxlOiByZXNvdXJjZURlcGVuZGFibGUgPyBuZXcgQ29tcG9zaXRlRGVwZW5kYWJsZShyZXN1bHQsIHJlc291cmNlRGVwZW5kYWJsZSkgOiByZXN1bHQsXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhIFwibm8tb3BcIiBgR3JhbnRgIG9iamVjdCB3aGljaCByZXByZXNlbnRzIGEgXCJkcm9wcGVkIGdyYW50XCIuXG4gICAqXG4gICAqIFRoaXMgY2FuIGJlIHVzZWQgZm9yIGUuZy4gaW1wb3J0ZWQgcmVzb3VyY2VzIHdoZXJlIHlvdSBtYXkgbm90IGJlIGFibGUgdG8gbW9kaWZ5XG4gICAqIHRoZSByZXNvdXJjZSdzIHBvbGljeSBvciBzb21lIHVuZGVybHlpbmcgcG9saWN5IHdoaWNoIHlvdSBkb24ndCBrbm93IGFib3V0LlxuICAgKlxuICAgKiBAcGFyYW0gZ3JhbnRlZSBUaGUgaW50ZW5kZWQgZ3JhbnRlZVxuICAgKiBAcGFyYW0gX2ludGVudCBUaGUgdXNlcidzIGludGVudCAod2lsbCBiZSBpZ25vcmVkIGF0IHRoZSBtb21lbnQpXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGRyb3AoZ3JhbnRlZTogSUdyYW50YWJsZSwgX2ludGVudDogc3RyaW5nKTogR3JhbnQge1xuICAgIHJldHVybiBuZXcgR3JhbnQoe1xuICAgICAgb3B0aW9uczogeyBncmFudGVlLCBhY3Rpb25zOiBbXSwgcmVzb3VyY2VBcm5zOiBbXSB9LFxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBzdGF0ZW1lbnQgdGhhdCB3YXMgYWRkZWQgdG8gdGhlIHByaW5jaXBhbCdzIHBvbGljeVxuICAgKlxuICAgKiBAZGVwcmVjYXRlZCBVc2UgYHByaW5jaXBhbFN0YXRlbWVudHNgIGluc3RlYWRcbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBwcmluY2lwYWxTdGF0ZW1lbnQ/OiBQb2xpY3lTdGF0ZW1lbnQ7XG5cbiAgLyoqXG4gICAqIFRoZSBzdGF0ZW1lbnRzIHRoYXQgd2VyZSBhZGRlZCB0byB0aGUgcHJpbmNpcGFsJ3MgcG9saWN5XG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgcHJpbmNpcGFsU3RhdGVtZW50cyA9IG5ldyBBcnJheTxQb2xpY3lTdGF0ZW1lbnQ+KCk7XG5cbiAgLyoqXG4gICAqIFRoZSBzdGF0ZW1lbnQgdGhhdCB3YXMgYWRkZWQgdG8gdGhlIHJlc291cmNlIHBvbGljeVxuICAgKlxuICAgKiBAZGVwcmVjYXRlZCBVc2UgYHJlc291cmNlU3RhdGVtZW50c2AgaW5zdGVhZFxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IHJlc291cmNlU3RhdGVtZW50PzogUG9saWN5U3RhdGVtZW50O1xuXG4gIC8qKlxuICAgKiBUaGUgc3RhdGVtZW50cyB0aGF0IHdlcmUgYWRkZWQgdG8gdGhlIHByaW5jaXBhbCdzIHBvbGljeVxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IHJlc291cmNlU3RhdGVtZW50cyA9IG5ldyBBcnJheTxQb2xpY3lTdGF0ZW1lbnQ+KCk7XG5cbiAgLyoqXG4gICAqIFRoZSBvcHRpb25zIG9yaWdpbmFsbHkgdXNlZCB0byBzZXQgdGhpcyByZXN1bHRcbiAgICpcbiAgICogUHJpdmF0ZSBtZW1iZXIgZG91YmxlcyBhcyBhIHdheSB0byBtYWtlIGl0IGltcG9zc2libGUgZm9yIGFuIG9iamVjdCBsaXRlcmFsIHRvXG4gICAqIGJlIHN0cnVjdHVyYWxseSB0aGUgc2FtZSBhcyB0aGlzIGNsYXNzLlxuICAgKi9cbiAgcHJpdmF0ZSByZWFkb25seSBvcHRpb25zOiBDb21tb25HcmFudE9wdGlvbnM7XG5cbiAgcHJpdmF0ZSByZWFkb25seSBkZXBlbmRhYmxlcyA9IG5ldyBBcnJheTxJRGVwZW5kYWJsZT4oKTtcblxuICBwcml2YXRlIGNvbnN0cnVjdG9yKHByb3BzOiBHcmFudFByb3BzKSB7XG4gICAgdGhpcy5vcHRpb25zID0gcHJvcHMub3B0aW9ucztcbiAgICB0aGlzLnByaW5jaXBhbFN0YXRlbWVudCA9IHByb3BzLnByaW5jaXBhbFN0YXRlbWVudDtcbiAgICB0aGlzLnJlc291cmNlU3RhdGVtZW50ID0gcHJvcHMucmVzb3VyY2VTdGF0ZW1lbnQ7XG4gICAgaWYgKHRoaXMucHJpbmNpcGFsU3RhdGVtZW50KSB7XG4gICAgICB0aGlzLnByaW5jaXBhbFN0YXRlbWVudHMucHVzaCh0aGlzLnByaW5jaXBhbFN0YXRlbWVudCk7XG4gICAgfVxuICAgIGlmICh0aGlzLnJlc291cmNlU3RhdGVtZW50KSB7XG4gICAgICB0aGlzLnJlc291cmNlU3RhdGVtZW50cy5wdXNoKHRoaXMucmVzb3VyY2VTdGF0ZW1lbnQpO1xuICAgIH1cbiAgICBpZiAocHJvcHMucG9saWN5RGVwZW5kYWJsZSkge1xuICAgICAgdGhpcy5kZXBlbmRhYmxlcy5wdXNoKHByb3BzLnBvbGljeURlcGVuZGFibGUpO1xuICAgIH1cblxuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIERlcGVuZGFibGUuaW1wbGVtZW50KHRoaXMsIHtcbiAgICAgIGdldCBkZXBlbmRlbmN5Um9vdHMoKSB7XG4gICAgICAgIHJldHVybiBBcnJheS5mcm9tKG5ldyBTZXQoc2VsZi5kZXBlbmRhYmxlcy5mbGF0TWFwKGQgPT4gRGVwZW5kYWJsZS5vZihkKS5kZXBlbmRlbmN5Um9vdHMpKSk7XG4gICAgICB9LFxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhlIGdyYW50IG9wZXJhdGlvbiB3YXMgc3VjY2Vzc2Z1bFxuICAgKi9cbiAgcHVibGljIGdldCBzdWNjZXNzKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnByaW5jaXBhbFN0YXRlbWVudCAhPT0gdW5kZWZpbmVkIHx8IHRoaXMucmVzb3VyY2VTdGF0ZW1lbnQgIT09IHVuZGVmaW5lZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaHJvdyBhbiBlcnJvciBpZiB0aGlzIGdyYW50IHdhc24ndCBzdWNjZXNzZnVsXG4gICAqL1xuICBwdWJsaWMgYXNzZXJ0U3VjY2VzcygpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuc3VjY2Vzcykge1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG1heC1sZW5cbiAgICAgIHRocm93IG5ldyBFcnJvcihgJHtkZXNjcmliZUdyYW50KHRoaXMub3B0aW9ucyl9IGNvdWxkIG5vdCBiZSBhZGRlZCBvbiBlaXRoZXIgaWRlbnRpdHkgb3IgcmVzb3VyY2UgcG9saWN5LmApO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBNYWtlIHN1cmUgdGhpcyBncmFudCBpcyBhcHBsaWVkIGJlZm9yZSB0aGUgZ2l2ZW4gY29uc3RydWN0cyBhcmUgZGVwbG95ZWRcbiAgICpcbiAgICogVGhlIHNhbWUgYXMgY29uc3RydWN0Lm5vZGUuYWRkRGVwZW5kZW5jeShncmFudCksIGJ1dCBzbGlnaHRseSBuaWNlciB0byByZWFkLlxuICAgKi9cbiAgcHVibGljIGFwcGx5QmVmb3JlKC4uLmNvbnN0cnVjdHM6IElDb25zdHJ1Y3RbXSkge1xuICAgIGZvciAoY29uc3QgY29uc3RydWN0IG9mIGNvbnN0cnVjdHMpIHtcbiAgICAgIGNvbnN0cnVjdC5ub2RlLmFkZERlcGVuZGVuY3kodGhpcyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENvbWJpbmUgdHdvIGdyYW50cyBpbnRvIGEgbmV3IG9uZVxuICAgKi9cbiAgcHVibGljIGNvbWJpbmUocmhzOiBHcmFudCkge1xuICAgIGNvbnN0IGNvbWJpbmVkUHJpbmMgPSBbLi4udGhpcy5wcmluY2lwYWxTdGF0ZW1lbnRzLCAuLi5yaHMucHJpbmNpcGFsU3RhdGVtZW50c107XG4gICAgY29uc3QgY29tYmluZWRSZXMgPSBbLi4udGhpcy5yZXNvdXJjZVN0YXRlbWVudHMsIC4uLnJocy5yZXNvdXJjZVN0YXRlbWVudHNdO1xuXG4gICAgY29uc3QgcmV0ID0gbmV3IEdyYW50KHtcbiAgICAgIG9wdGlvbnM6IHRoaXMub3B0aW9ucyxcbiAgICAgIHByaW5jaXBhbFN0YXRlbWVudDogY29tYmluZWRQcmluY1swXSxcbiAgICAgIHJlc291cmNlU3RhdGVtZW50OiBjb21iaW5lZFJlc1swXSxcbiAgICB9KTtcbiAgICByZXQucHJpbmNpcGFsU3RhdGVtZW50cy5zcGxpY2UoMCwgcmV0LnByaW5jaXBhbFN0YXRlbWVudHMubGVuZ3RoLCAuLi5jb21iaW5lZFByaW5jKTtcbiAgICByZXQucmVzb3VyY2VTdGF0ZW1lbnRzLnNwbGljZSgwLCByZXQucmVzb3VyY2VTdGF0ZW1lbnRzLmxlbmd0aCwgLi4uY29tYmluZWRSZXMpO1xuICAgIHJldC5kZXBlbmRhYmxlcy5wdXNoKC4uLnRoaXMuZGVwZW5kYWJsZXMsIC4uLnJocy5kZXBlbmRhYmxlcyk7XG4gICAgcmV0dXJuIHJldDtcbiAgfVxufVxuXG5mdW5jdGlvbiBkZXNjcmliZUdyYW50KG9wdGlvbnM6IENvbW1vbkdyYW50T3B0aW9ucykge1xuICByZXR1cm4gYFBlcm1pc3Npb25zIGZvciAnJHtvcHRpb25zLmdyYW50ZWV9JyB0byBjYWxsICcke29wdGlvbnMuYWN0aW9uc30nIG9uICcke29wdGlvbnMucmVzb3VyY2VBcm5zfSdgO1xufVxuXG5pbnRlcmZhY2UgR3JhbnRQcm9wcyB7XG4gIHJlYWRvbmx5IG9wdGlvbnM6IENvbW1vbkdyYW50T3B0aW9ucztcbiAgcmVhZG9ubHkgcHJpbmNpcGFsU3RhdGVtZW50PzogUG9saWN5U3RhdGVtZW50O1xuICByZWFkb25seSByZXNvdXJjZVN0YXRlbWVudD86IFBvbGljeVN0YXRlbWVudDtcblxuICAvKipcbiAgICogQ29uc3RydWN0cyB3aG9zZSBkZXBsb3ltZW50IGFwcGxpZXMgdGhlIGdyYW50XG4gICAqXG4gICAqIFVzZWQgdG8gYWRkIGRlcGVuZGVuY2llcyBvbiBncmFudHNcbiAgICovXG4gIHJlYWRvbmx5IHBvbGljeURlcGVuZGFibGU/OiBJRGVwZW5kYWJsZTtcbn1cblxuLyoqXG4gKiBBIHJlc291cmNlIHdpdGggYSByZXNvdXJjZSBwb2xpY3kgdGhhdCBjYW4gYmUgYWRkZWQgdG9cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBJUmVzb3VyY2VXaXRoUG9saWN5IGV4dGVuZHMgY2RrLklSZXNvdXJjZSB7XG4gIC8qKlxuICAgKiBBZGQgYSBzdGF0ZW1lbnQgdG8gdGhlIHJlc291cmNlJ3MgcmVzb3VyY2UgcG9saWN5XG4gICAqL1xuICBhZGRUb1Jlc291cmNlUG9saWN5KHN0YXRlbWVudDogUG9saWN5U3RhdGVtZW50KTogQWRkVG9SZXNvdXJjZVBvbGljeVJlc3VsdDtcbn1cblxuLyoqXG4gKiBSZXN1bHQgb2YgY2FsbGluZyBhZGRUb1Jlc291cmNlUG9saWN5XG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQWRkVG9SZXNvdXJjZVBvbGljeVJlc3VsdCB7XG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSBzdGF0ZW1lbnQgd2FzIGFkZGVkXG4gICAqL1xuICByZWFkb25seSBzdGF0ZW1lbnRBZGRlZDogYm9vbGVhbjtcblxuICAvKipcbiAgICogRGVwZW5kYWJsZSB3aGljaCBhbGxvd3MgZGVwZW5kaW5nIG9uIHRoZSBwb2xpY3kgY2hhbmdlIGJlaW5nIGFwcGxpZWRcbiAgICpcbiAgICogQGRlZmF1bHQgLSBJZiBgc3RhdGVtZW50QWRkZWRgIGlzIHRydWUsIHRoZSByZXNvdXJjZSBvYmplY3QgaXRzZWxmLlxuICAgKiBPdGhlcndpc2UsIG5vIGRlcGVuZGFibGUuXG4gICAqL1xuICByZWFkb25seSBwb2xpY3lEZXBlbmRhYmxlPzogSURlcGVuZGFibGU7XG59XG5cbi8qKlxuICogQ29tcG9zaXRlIGRlcGVuZGFibGVcbiAqXG4gKiBOb3QgYXMgc2ltcGxlIGFzIGVhZ2VybHkgZ2V0dGluZyB0aGUgZGVwZW5kZW5jeSByb290cyBmcm9tIHRoZVxuICogaW5uZXIgZGVwZW5kYWJsZXMsIGFzIHRoZXkgbWF5IGJlIG11dGFibGUgc28gd2UgbmVlZCB0byBkZWZlclxuICogdGhlIHF1ZXJ5LlxuICovXG5leHBvcnQgY2xhc3MgQ29tcG9zaXRlRGVwZW5kYWJsZSBpbXBsZW1lbnRzIElEZXBlbmRhYmxlIHtcbiAgY29uc3RydWN0b3IoLi4uZGVwZW5kYWJsZXM6IElEZXBlbmRhYmxlW10pIHtcbiAgICBEZXBlbmRhYmxlLmltcGxlbWVudCh0aGlzLCB7XG4gICAgICBnZXQgZGVwZW5kZW5jeVJvb3RzKCk6IElDb25zdHJ1Y3RbXSB7XG4gICAgICAgIHJldHVybiBBcnJheS5wcm90b3R5cGUuY29uY2F0LmFwcGx5KFtdLCBkZXBlbmRhYmxlcy5tYXAoZCA9PiBEZXBlbmRhYmxlLm9mKGQpLmRlcGVuZGVuY3lSb290cykpO1xuICAgICAgfSxcbiAgICB9KTtcbiAgfVxufVxuIl19