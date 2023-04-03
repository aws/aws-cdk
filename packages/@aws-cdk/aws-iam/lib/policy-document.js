"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PolicyDocument = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const cdk = require("@aws-cdk/core");
const cxapi = require("@aws-cdk/cx-api");
const policy_statement_1 = require("./policy-statement");
const merge_statements_1 = require("./private/merge-statements");
const postprocess_policy_document_1 = require("./private/postprocess-policy-document");
/**
 * A PolicyDocument is a collection of statements
 */
class PolicyDocument {
    constructor(props = {}) {
        this.statements = new Array();
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_iam_PolicyDocumentProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, PolicyDocument);
            }
            throw error;
        }
        this.creationStack = cdk.captureStackTrace();
        this.autoAssignSids = !!props.assignSids;
        this.minimize = props.minimize;
        this.addStatements(...props.statements || []);
    }
    /**
     * Creates a new PolicyDocument based on the object provided.
     * This will accept an object created from the `.toJSON()` call
     * @param obj the PolicyDocument in object form.
     */
    static fromJson(obj) {
        const newPolicyDocument = new PolicyDocument();
        const statement = obj.Statement ?? [];
        if (statement && !Array.isArray(statement)) {
            throw new Error('Statement must be an array');
        }
        newPolicyDocument.addStatements(...obj.Statement.map((s) => policy_statement_1.PolicyStatement.fromJson(s)));
        return newPolicyDocument;
    }
    resolve(context) {
        this.freezeStatements();
        this._maybeMergeStatements(context.scope);
        // In the previous implementation of 'merge', sorting of actions/resources on
        // a statement always happened, even  on singular statements. In the new
        // implementation of 'merge', sorting only happens when actually combining 2
        // statements. This affects all test snapshots, so we need to put in mechanisms
        // to avoid having to update all snapshots.
        //
        // To do sorting in a way compatible with the previous implementation of merging,
        // (so we don't have to update snapshots) do it after rendering, but only when
        // merging is enabled.
        const sort = this.shouldMerge(context.scope);
        context.registerPostProcessor(new postprocess_policy_document_1.PostProcessPolicyDocument(this.autoAssignSids, sort));
        return this.render();
    }
    /**
     * Whether the policy document contains any statements.
     */
    get isEmpty() {
        return this.statements.length === 0;
    }
    /**
     * The number of statements already added to this policy.
     * Can be used, for example, to generate unique "sid"s within the policy.
     */
    get statementCount() {
        return this.statements.length;
    }
    /**
     * Adds a statement to the policy document.
     *
     * @param statement the statement to add.
     */
    addStatements(...statement) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_iam_PolicyStatement(statement);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addStatements);
            }
            throw error;
        }
        this.statements.push(...statement);
    }
    /**
     * Encode the policy document as a string
     */
    toString() {
        return cdk.Token.asString(this, {
            displayHint: 'PolicyDocument',
        });
    }
    /**
     * JSON-ify the document
     *
     * Used when JSON.stringify() is called
     */
    toJSON() {
        return this.render();
    }
    /**
     * Validate that all policy statements in the policy document satisfies the
     * requirements for any policy.
     *
     * @see https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies.html#access_policies-json
     *
     * @returns An array of validation error messages, or an empty array if the document is valid.
     */
    validateForAnyPolicy() {
        const errors = new Array();
        for (const statement of this.statements) {
            errors.push(...statement.validateForAnyPolicy());
        }
        return errors;
    }
    /**
     * Validate that all policy statements in the policy document satisfies the
     * requirements for a resource-based policy.
     *
     * @see https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies.html#access_policies-json
     *
     * @returns An array of validation error messages, or an empty array if the document is valid.
     */
    validateForResourcePolicy() {
        const errors = new Array();
        for (const statement of this.statements) {
            errors.push(...statement.validateForResourcePolicy());
        }
        return errors;
    }
    /**
     * Validate that all policy statements in the policy document satisfies the
     * requirements for an identity-based policy.
     *
     * @see https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies.html#access_policies-json
     *
     * @returns An array of validation error messages, or an empty array if the document is valid.
     */
    validateForIdentityPolicy() {
        const errors = new Array();
        for (const statement of this.statements) {
            errors.push(...statement.validateForIdentityPolicy());
        }
        return errors;
    }
    /**
     * Perform statement merging (if enabled and not done yet)
     *
     * @internal
     */
    _maybeMergeStatements(scope) {
        if (this.shouldMerge(scope)) {
            const result = merge_statements_1.mergeStatements(this.statements, { scope });
            this.statements.splice(0, this.statements.length, ...result.mergedStatements);
        }
    }
    /**
     * Split the statements of the PolicyDocument into multiple groups, limited by their size
     *
     * We do a round of size-limited merging first (making sure to not produce statements too
     * large to fit into standalone policies), so that we can most accurately estimate total
     * policy size. Another final round of minimization will be done just before rendering to
     * end up with minimal policies that look nice to humans.
     *
     * Return a map of the final set of policy documents, mapped to the ORIGINAL (pre-merge)
     * PolicyStatements that ended up in the given PolicyDocument.
     *
     * @internal
     */
    _splitDocument(scope, selfMaximumSize, splitMaximumSize) {
        const self = this;
        const newDocs = [];
        // Maps final statements to original statements
        this.freezeStatements();
        let statementsToOriginals = new Map(this.statements.map(s => [s, [s]]));
        // We always run 'mergeStatements' to minimize the policy before splitting.
        // However, we only 'merge' when the feature flag is on. If the flag is not
        // on, we only combine statements that are *exactly* the same. We must do
        // this before splitting, otherwise we may end up with the statement set [X,
        // X, X, X, X] being split off into [[X, X, X], [X, X]] before being reduced
        // to [[X], [X]] (but should have been just [[X]]).
        const doActualMerging = this.shouldMerge(scope);
        const result = merge_statements_1.mergeStatements(this.statements, { scope, limitSize: true, mergeIfCombinable: doActualMerging });
        this.statements.splice(0, this.statements.length, ...result.mergedStatements);
        statementsToOriginals = result.originsMap;
        const sizeOptions = policy_statement_1.deriveEstimateSizeOptions(scope);
        // Cache statement sizes to avoid recomputing them based on the fields
        const statementSizes = new Map(this.statements.map(s => [s, s._estimateSize(sizeOptions)]));
        // Keep some size counters so we can avoid recomputing them based on the statements in each
        let selfSize = 0;
        const polSizes = new Map();
        // Getter with a default to save some syntactic noise
        const polSize = (x) => polSizes.get(x) ?? 0;
        let i = 0;
        while (i < this.statements.length) {
            const statement = this.statements[i];
            const statementSize = statementSizes.get(statement) ?? 0;
            if (selfSize + statementSize < selfMaximumSize) {
                // Fits in self
                selfSize += statementSize;
                i++;
                continue;
            }
            // Split off to new PolicyDocument. Find the PolicyDocument we can add this to,
            // or add a fresh one.
            const addToDoc = findDocWithSpace(statementSize);
            addToDoc.addStatements(statement);
            polSizes.set(addToDoc, polSize(addToDoc) + statementSize);
            this.statements.splice(i, 1);
        }
        // Return the set of all policy document and original statements
        const ret = new Map();
        ret.set(this, this.statements.flatMap(s => statementsToOriginals.get(s) ?? [s]));
        for (const newDoc of newDocs) {
            ret.set(newDoc, newDoc.statements.flatMap(s => statementsToOriginals.get(s) ?? [s]));
        }
        return ret;
        function findDocWithSpace(size) {
            let j = 0;
            while (j < newDocs.length && polSize(newDocs[j]) + size > splitMaximumSize) {
                j++;
            }
            if (j < newDocs.length) {
                return newDocs[j];
            }
            const newDoc = new PolicyDocument({
                assignSids: self.autoAssignSids,
                minimize: self.minimize,
            });
            newDocs.push(newDoc);
            return newDoc;
        }
    }
    render() {
        if (this.isEmpty) {
            return undefined;
        }
        const doc = {
            Statement: this.statements.map(s => s.toStatementJson()),
            Version: '2012-10-17',
        };
        return doc;
    }
    shouldMerge(scope) {
        return this.minimize ?? cdk.FeatureFlags.of(scope).isEnabled(cxapi.IAM_MINIMIZE_POLICIES) ?? false;
    }
    /**
     * Freeze all statements
     */
    freezeStatements() {
        for (const statement of this.statements) {
            statement.freeze();
        }
    }
}
exports.PolicyDocument = PolicyDocument;
_a = JSII_RTTI_SYMBOL_1;
PolicyDocument[_a] = { fqn: "@aws-cdk/aws-iam.PolicyDocument", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9saWN5LWRvY3VtZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicG9saWN5LWRvY3VtZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLHFDQUFxQztBQUNyQyx5Q0FBeUM7QUFFekMseURBQWdGO0FBQ2hGLGlFQUE2RDtBQUM3RCx1RkFBa0Y7QUF1Q2xGOztHQUVHO0FBQ0gsTUFBYSxjQUFjO0lBc0J6QixZQUFZLFFBQTZCLEVBQUU7UUFKMUIsZUFBVSxHQUFHLElBQUksS0FBSyxFQUFtQixDQUFDOzs7Ozs7K0NBbEJoRCxjQUFjOzs7O1FBdUJ2QixJQUFJLENBQUMsYUFBYSxHQUFHLEdBQUcsQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO1FBQzdDLElBQUksQ0FBQyxjQUFjLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUM7UUFDekMsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDO1FBRS9CLElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxLQUFLLENBQUMsVUFBVSxJQUFJLEVBQUUsQ0FBQyxDQUFDO0tBQy9DO0lBMUJEOzs7O09BSUc7SUFDSSxNQUFNLENBQUMsUUFBUSxDQUFDLEdBQVE7UUFDN0IsTUFBTSxpQkFBaUIsR0FBRyxJQUFJLGNBQWMsRUFBRSxDQUFDO1FBQy9DLE1BQU0sU0FBUyxHQUFHLEdBQUcsQ0FBQyxTQUFTLElBQUksRUFBRSxDQUFDO1FBQ3RDLElBQUksU0FBUyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsRUFBRTtZQUMxQyxNQUFNLElBQUksS0FBSyxDQUFDLDRCQUE0QixDQUFDLENBQUM7U0FDL0M7UUFDRCxpQkFBaUIsQ0FBQyxhQUFhLENBQUMsR0FBRyxHQUFHLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQU0sRUFBRSxFQUFFLENBQUMsa0NBQWUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFD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QUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsZUFBZSxFQUFFLENBQUM7WUFDeEQsT0FBTyxFQUFFLFlBQVk7U0FDdEIsQ0FBQztRQUVGLE9BQU8sR0FBRyxDQUFDO0tBQ1o7SUFFTyxXQUFXLENBQUMsS0FBaUI7UUFDbkMsT0FBTyxJQUFJLENBQUMsUUFBUSxJQUFJLEdBQUcsQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMscUJBQXFCLENBQUMsSUFBSSxLQUFLLENBQUM7S0FDcEc7SUFFRDs7T0FFRztJQUNLLGdCQUFnQjtRQUN0QixLQUFLLE1BQU0sU0FBUyxJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUU7WUFDdkMsU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFDO1NBQ3BCO0tBQ0Y7O0FBdlFILHdDQXdRQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCAqIGFzIGN4YXBpIGZyb20gJ0Bhd3MtY2RrL2N4LWFwaSc7XG5pbXBvcnQgeyBJQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBQb2xpY3lTdGF0ZW1lbnQsIGRlcml2ZUVzdGltYXRlU2l6ZU9wdGlvbnMgfSBmcm9tICcuL3BvbGljeS1zdGF0ZW1lbnQnO1xuaW1wb3J0IHsgbWVyZ2VTdGF0ZW1lbnRzIH0gZnJvbSAnLi9wcml2YXRlL21lcmdlLXN0YXRlbWVudHMnO1xuaW1wb3J0IHsgUG9zdFByb2Nlc3NQb2xpY3lEb2N1bWVudCB9IGZyb20gJy4vcHJpdmF0ZS9wb3N0cHJvY2Vzcy1wb2xpY3ktZG9jdW1lbnQnO1xuXG4vKipcbiAqIFByb3BlcnRpZXMgZm9yIGEgbmV3IFBvbGljeURvY3VtZW50XG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgUG9saWN5RG9jdW1lbnRQcm9wcyB7XG4gIC8qKlxuICAgKiBBdXRvbWF0aWNhbGx5IGFzc2lnbiBTdGF0ZW1lbnQgSWRzIHRvIGFsbCBzdGF0ZW1lbnRzXG4gICAqXG4gICAqIEBkZWZhdWx0IGZhbHNlXG4gICAqL1xuICByZWFkb25seSBhc3NpZ25TaWRzPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogSW5pdGlhbCBzdGF0ZW1lbnRzIHRvIGFkZCB0byB0aGUgcG9saWN5IGRvY3VtZW50XG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm8gc3RhdGVtZW50c1xuICAgKi9cbiAgcmVhZG9ubHkgc3RhdGVtZW50cz86IFBvbGljeVN0YXRlbWVudFtdO1xuXG4gIC8qKlxuICAgKiBUcnkgdG8gbWluaW1pemUgdGhlIHBvbGljeSBieSBtZXJnaW5nIHN0YXRlbWVudHNcbiAgICpcbiAgICogVG8gYXZvaWQgb3ZlcnJ1bm5pbmcgdGhlIG1heGltdW0gcG9saWN5IHNpemUsIGNvbWJpbmUgc3RhdGVtZW50cyBpZiB0aGV5IHByb2R1Y2VcbiAgICogdGhlIHNhbWUgcmVzdWx0LiBNZXJnaW5nIGhhcHBlbnMgYWNjb3JkaW5nIHRvIHRoZSBmb2xsb3dpbmcgcnVsZXM6XG4gICAqXG4gICAqIC0gVGhlIEVmZmVjdCBvZiBib3RoIHN0YXRlbWVudHMgaXMgdGhlIHNhbWVcbiAgICogLSBOZWl0aGVyIG9mIHRoZSBzdGF0ZW1lbnRzIGhhdmUgYSAnU2lkJ1xuICAgKiAtIENvbWJpbmUgUHJpbmNpcGFscyBpZiB0aGUgcmVzdCBvZiB0aGUgc3RhdGVtZW50IGlzIGV4YWN0bHkgdGhlIHNhbWUuXG4gICAqIC0gQ29tYmluZSBSZXNvdXJjZXMgaWYgdGhlIHJlc3Qgb2YgdGhlIHN0YXRlbWVudCBpcyBleGFjdGx5IHRoZSBzYW1lLlxuICAgKiAtIENvbWJpbmUgQWN0aW9ucyBpZiB0aGUgcmVzdCBvZiB0aGUgc3RhdGVtZW50IGlzIGV4YWN0bHkgdGhlIHNhbWUuXG4gICAqIC0gV2Ugd2lsbCBuZXZlciBjb21iaW5lIE5vdFByaW5jaXBhbHMsIE5vdFJlc291cmNlcyBvciBOb3RBY3Rpb25zLCBiZWNhdXNlIGRvaW5nXG4gICAqICAgc28gd291bGQgY2hhbmdlIHRoZSBtZWFuaW5nIG9mIHRoZSBwb2xpY3kgZG9jdW1lbnQuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gZmFsc2UsIHVubGVzcyB0aGUgZmVhdHVyZSBmbGFnIGBAYXdzLWNkay9hd3MtaWFtOm1pbmltaXplUG9saWNpZXNgIGlzIHNldFxuICAgKi9cbiAgcmVhZG9ubHkgbWluaW1pemU/OiBib29sZWFuO1xufVxuXG4vKipcbiAqIEEgUG9saWN5RG9jdW1lbnQgaXMgYSBjb2xsZWN0aW9uIG9mIHN0YXRlbWVudHNcbiAqL1xuZXhwb3J0IGNsYXNzIFBvbGljeURvY3VtZW50IGltcGxlbWVudHMgY2RrLklSZXNvbHZhYmxlIHtcblxuICAvKipcbiAgICogQ3JlYXRlcyBhIG5ldyBQb2xpY3lEb2N1bWVudCBiYXNlZCBvbiB0aGUgb2JqZWN0IHByb3ZpZGVkLlxuICAgKiBUaGlzIHdpbGwgYWNjZXB0IGFuIG9iamVjdCBjcmVhdGVkIGZyb20gdGhlIGAudG9KU09OKClgIGNhbGxcbiAgICogQHBhcmFtIG9iaiB0aGUgUG9saWN5RG9jdW1lbnQgaW4gb2JqZWN0IGZvcm0uXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21Kc29uKG9iajogYW55KTogUG9saWN5RG9jdW1lbnQge1xuICAgIGNvbnN0IG5ld1BvbGljeURvY3VtZW50ID0gbmV3IFBvbGljeURvY3VtZW50KCk7XG4gICAgY29uc3Qgc3RhdGVtZW50ID0gb2JqLlN0YXRlbWVudCA/PyBbXTtcbiAgICBpZiAoc3RhdGVtZW50ICYmICFBcnJheS5pc0FycmF5KHN0YXRlbWVudCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignU3RhdGVtZW50IG11c3QgYmUgYW4gYXJyYXknKTtcbiAgICB9XG4gICAgbmV3UG9saWN5RG9jdW1lbnQuYWRkU3RhdGVtZW50cyguLi5vYmouU3RhdGVtZW50Lm1hcCgoczogYW55KSA9PiBQb2xpY3lTdGF0ZW1lbnQuZnJvbUpzb24ocykpKTtcbiAgICByZXR1cm4gbmV3UG9saWN5RG9jdW1lbnQ7XG4gIH1cblxuICBwdWJsaWMgcmVhZG9ubHkgY3JlYXRpb25TdGFjazogc3RyaW5nW107XG4gIHByaXZhdGUgcmVhZG9ubHkgc3RhdGVtZW50cyA9IG5ldyBBcnJheTxQb2xpY3lTdGF0ZW1lbnQ+KCk7XG4gIHByaXZhdGUgcmVhZG9ubHkgYXV0b0Fzc2lnblNpZHM6IGJvb2xlYW47XG4gIHByaXZhdGUgcmVhZG9ubHkgbWluaW1pemU/OiBib29sZWFuO1xuXG4gIGNvbnN0cnVjdG9yKHByb3BzOiBQb2xpY3lEb2N1bWVudFByb3BzID0ge30pIHtcbiAgICB0aGlzLmNyZWF0aW9uU3RhY2sgPSBjZGsuY2FwdHVyZVN0YWNrVHJhY2UoKTtcbiAgICB0aGlzLmF1dG9Bc3NpZ25TaWRzID0gISFwcm9wcy5hc3NpZ25TaWRzO1xuICAgIHRoaXMubWluaW1pemUgPSBwcm9wcy5taW5pbWl6ZTtcblxuICAgIHRoaXMuYWRkU3RhdGVtZW50cyguLi5wcm9wcy5zdGF0ZW1lbnRzIHx8IFtdKTtcbiAgfVxuXG4gIHB1YmxpYyByZXNvbHZlKGNvbnRleHQ6IGNkay5JUmVzb2x2ZUNvbnRleHQpOiBhbnkge1xuICAgIHRoaXMuZnJlZXplU3RhdGVtZW50cygpO1xuICAgIHRoaXMuX21heWJlTWVyZ2VTdGF0ZW1lbnRzKGNvbnRleHQuc2NvcGUpO1xuXG4gICAgLy8gSW4gdGhlIHByZXZpb3VzIGltcGxlbWVudGF0aW9uIG9mICdtZXJnZScsIHNvcnRpbmcgb2YgYWN0aW9ucy9yZXNvdXJjZXMgb25cbiAgICAvLyBhIHN0YXRlbWVudCBhbHdheXMgaGFwcGVuZWQsIGV2ZW4gIG9uIHNpbmd1bGFyIHN0YXRlbWVudHMuIEluIHRoZSBuZXdcbiAgICAvLyBpbXBsZW1lbnRhdGlvbiBvZiAnbWVyZ2UnLCBzb3J0aW5nIG9ubHkgaGFwcGVucyB3aGVuIGFjdHVhbGx5IGNvbWJpbmluZyAyXG4gICAgLy8gc3RhdGVtZW50cy4gVGhpcyBhZmZlY3RzIGFsbCB0ZXN0IHNuYXBzaG90cywgc28gd2UgbmVlZCB0byBwdXQgaW4gbWVjaGFuaXNtc1xuICAgIC8vIHRvIGF2b2lkIGhhdmluZyB0byB1cGRhdGUgYWxsIHNuYXBzaG90cy5cbiAgICAvL1xuICAgIC8vIFRvIGRvIHNvcnRpbmcgaW4gYSB3YXkgY29tcGF0aWJsZSB3aXRoIHRoZSBwcmV2aW91cyBpbXBsZW1lbnRhdGlvbiBvZiBtZXJnaW5nLFxuICAgIC8vIChzbyB3ZSBkb24ndCBoYXZlIHRvIHVwZGF0ZSBzbmFwc2hvdHMpIGRvIGl0IGFmdGVyIHJlbmRlcmluZywgYnV0IG9ubHkgd2hlblxuICAgIC8vIG1lcmdpbmcgaXMgZW5hYmxlZC5cbiAgICBjb25zdCBzb3J0ID0gdGhpcy5zaG91bGRNZXJnZShjb250ZXh0LnNjb3BlKTtcbiAgICBjb250ZXh0LnJlZ2lzdGVyUG9zdFByb2Nlc3NvcihuZXcgUG9zdFByb2Nlc3NQb2xpY3lEb2N1bWVudCh0aGlzLmF1dG9Bc3NpZ25TaWRzLCBzb3J0KSk7XG4gICAgcmV0dXJuIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICAvKipcbiAgICogV2hldGhlciB0aGUgcG9saWN5IGRvY3VtZW50IGNvbnRhaW5zIGFueSBzdGF0ZW1lbnRzLlxuICAgKi9cbiAgcHVibGljIGdldCBpc0VtcHR5KCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnN0YXRlbWVudHMubGVuZ3RoID09PSAwO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBudW1iZXIgb2Ygc3RhdGVtZW50cyBhbHJlYWR5IGFkZGVkIHRvIHRoaXMgcG9saWN5LlxuICAgKiBDYW4gYmUgdXNlZCwgZm9yIGV4YW1wbGUsIHRvIGdlbmVyYXRlIHVuaXF1ZSBcInNpZFwicyB3aXRoaW4gdGhlIHBvbGljeS5cbiAgICovXG4gIHB1YmxpYyBnZXQgc3RhdGVtZW50Q291bnQoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5zdGF0ZW1lbnRzLmxlbmd0aDtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGEgc3RhdGVtZW50IHRvIHRoZSBwb2xpY3kgZG9jdW1lbnQuXG4gICAqXG4gICAqIEBwYXJhbSBzdGF0ZW1lbnQgdGhlIHN0YXRlbWVudCB0byBhZGQuXG4gICAqL1xuICBwdWJsaWMgYWRkU3RhdGVtZW50cyguLi5zdGF0ZW1lbnQ6IFBvbGljeVN0YXRlbWVudFtdKSB7XG4gICAgdGhpcy5zdGF0ZW1lbnRzLnB1c2goLi4uc3RhdGVtZW50KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFbmNvZGUgdGhlIHBvbGljeSBkb2N1bWVudCBhcyBhIHN0cmluZ1xuICAgKi9cbiAgcHVibGljIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiBjZGsuVG9rZW4uYXNTdHJpbmcodGhpcywge1xuICAgICAgZGlzcGxheUhpbnQ6ICdQb2xpY3lEb2N1bWVudCcsXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogSlNPTi1pZnkgdGhlIGRvY3VtZW50XG4gICAqXG4gICAqIFVzZWQgd2hlbiBKU09OLnN0cmluZ2lmeSgpIGlzIGNhbGxlZFxuICAgKi9cbiAgcHVibGljIHRvSlNPTigpIHtcbiAgICByZXR1cm4gdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBWYWxpZGF0ZSB0aGF0IGFsbCBwb2xpY3kgc3RhdGVtZW50cyBpbiB0aGUgcG9saWN5IGRvY3VtZW50IHNhdGlzZmllcyB0aGVcbiAgICogcmVxdWlyZW1lbnRzIGZvciBhbnkgcG9saWN5LlxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9JQU0vbGF0ZXN0L1VzZXJHdWlkZS9hY2Nlc3NfcG9saWNpZXMuaHRtbCNhY2Nlc3NfcG9saWNpZXMtanNvblxuICAgKlxuICAgKiBAcmV0dXJucyBBbiBhcnJheSBvZiB2YWxpZGF0aW9uIGVycm9yIG1lc3NhZ2VzLCBvciBhbiBlbXB0eSBhcnJheSBpZiB0aGUgZG9jdW1lbnQgaXMgdmFsaWQuXG4gICAqL1xuICBwdWJsaWMgdmFsaWRhdGVGb3JBbnlQb2xpY3koKTogc3RyaW5nW10ge1xuICAgIGNvbnN0IGVycm9ycyA9IG5ldyBBcnJheTxzdHJpbmc+KCk7XG4gICAgZm9yIChjb25zdCBzdGF0ZW1lbnQgb2YgdGhpcy5zdGF0ZW1lbnRzKSB7XG4gICAgICBlcnJvcnMucHVzaCguLi5zdGF0ZW1lbnQudmFsaWRhdGVGb3JBbnlQb2xpY3koKSk7XG4gICAgfVxuICAgIHJldHVybiBlcnJvcnM7XG4gIH1cblxuICAvKipcbiAgICogVmFsaWRhdGUgdGhhdCBhbGwgcG9saWN5IHN0YXRlbWVudHMgaW4gdGhlIHBvbGljeSBkb2N1bWVudCBzYXRpc2ZpZXMgdGhlXG4gICAqIHJlcXVpcmVtZW50cyBmb3IgYSByZXNvdXJjZS1iYXNlZCBwb2xpY3kuXG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0lBTS9sYXRlc3QvVXNlckd1aWRlL2FjY2Vzc19wb2xpY2llcy5odG1sI2FjY2Vzc19wb2xpY2llcy1qc29uXG4gICAqXG4gICAqIEByZXR1cm5zIEFuIGFycmF5IG9mIHZhbGlkYXRpb24gZXJyb3IgbWVzc2FnZXMsIG9yIGFuIGVtcHR5IGFycmF5IGlmIHRoZSBkb2N1bWVudCBpcyB2YWxpZC5cbiAgICovXG4gIHB1YmxpYyB2YWxpZGF0ZUZvclJlc291cmNlUG9saWN5KCk6IHN0cmluZ1tdIHtcbiAgICBjb25zdCBlcnJvcnMgPSBuZXcgQXJyYXk8c3RyaW5nPigpO1xuICAgIGZvciAoY29uc3Qgc3RhdGVtZW50IG9mIHRoaXMuc3RhdGVtZW50cykge1xuICAgICAgZXJyb3JzLnB1c2goLi4uc3RhdGVtZW50LnZhbGlkYXRlRm9yUmVzb3VyY2VQb2xpY3koKSk7XG4gICAgfVxuICAgIHJldHVybiBlcnJvcnM7XG4gIH1cblxuICAvKipcbiAgICogVmFsaWRhdGUgdGhhdCBhbGwgcG9saWN5IHN0YXRlbWVudHMgaW4gdGhlIHBvbGljeSBkb2N1bWVudCBzYXRpc2ZpZXMgdGhlXG4gICAqIHJlcXVpcmVtZW50cyBmb3IgYW4gaWRlbnRpdHktYmFzZWQgcG9saWN5LlxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9JQU0vbGF0ZXN0L1VzZXJHdWlkZS9hY2Nlc3NfcG9saWNpZXMuaHRtbCNhY2Nlc3NfcG9saWNpZXMtanNvblxuICAgKlxuICAgKiBAcmV0dXJucyBBbiBhcnJheSBvZiB2YWxpZGF0aW9uIGVycm9yIG1lc3NhZ2VzLCBvciBhbiBlbXB0eSBhcnJheSBpZiB0aGUgZG9jdW1lbnQgaXMgdmFsaWQuXG4gICAqL1xuICBwdWJsaWMgdmFsaWRhdGVGb3JJZGVudGl0eVBvbGljeSgpOiBzdHJpbmdbXSB7XG4gICAgY29uc3QgZXJyb3JzID0gbmV3IEFycmF5PHN0cmluZz4oKTtcbiAgICBmb3IgKGNvbnN0IHN0YXRlbWVudCBvZiB0aGlzLnN0YXRlbWVudHMpIHtcbiAgICAgIGVycm9ycy5wdXNoKC4uLnN0YXRlbWVudC52YWxpZGF0ZUZvcklkZW50aXR5UG9saWN5KCkpO1xuICAgIH1cbiAgICByZXR1cm4gZXJyb3JzO1xuICB9XG5cbiAgLyoqXG4gICAqIFBlcmZvcm0gc3RhdGVtZW50IG1lcmdpbmcgKGlmIGVuYWJsZWQgYW5kIG5vdCBkb25lIHlldClcbiAgICpcbiAgICogQGludGVybmFsXG4gICAqL1xuICBwdWJsaWMgX21heWJlTWVyZ2VTdGF0ZW1lbnRzKHNjb3BlOiBJQ29uc3RydWN0KTogdm9pZCB7XG4gICAgaWYgKHRoaXMuc2hvdWxkTWVyZ2Uoc2NvcGUpKSB7XG4gICAgICBjb25zdCByZXN1bHQgPSBtZXJnZVN0YXRlbWVudHModGhpcy5zdGF0ZW1lbnRzLCB7IHNjb3BlIH0pO1xuICAgICAgdGhpcy5zdGF0ZW1lbnRzLnNwbGljZSgwLCB0aGlzLnN0YXRlbWVudHMubGVuZ3RoLCAuLi5yZXN1bHQubWVyZ2VkU3RhdGVtZW50cyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNwbGl0IHRoZSBzdGF0ZW1lbnRzIG9mIHRoZSBQb2xpY3lEb2N1bWVudCBpbnRvIG11bHRpcGxlIGdyb3VwcywgbGltaXRlZCBieSB0aGVpciBzaXplXG4gICAqXG4gICAqIFdlIGRvIGEgcm91bmQgb2Ygc2l6ZS1saW1pdGVkIG1lcmdpbmcgZmlyc3QgKG1ha2luZyBzdXJlIHRvIG5vdCBwcm9kdWNlIHN0YXRlbWVudHMgdG9vXG4gICAqIGxhcmdlIHRvIGZpdCBpbnRvIHN0YW5kYWxvbmUgcG9saWNpZXMpLCBzbyB0aGF0IHdlIGNhbiBtb3N0IGFjY3VyYXRlbHkgZXN0aW1hdGUgdG90YWxcbiAgICogcG9saWN5IHNpemUuIEFub3RoZXIgZmluYWwgcm91bmQgb2YgbWluaW1pemF0aW9uIHdpbGwgYmUgZG9uZSBqdXN0IGJlZm9yZSByZW5kZXJpbmcgdG9cbiAgICogZW5kIHVwIHdpdGggbWluaW1hbCBwb2xpY2llcyB0aGF0IGxvb2sgbmljZSB0byBodW1hbnMuXG4gICAqXG4gICAqIFJldHVybiBhIG1hcCBvZiB0aGUgZmluYWwgc2V0IG9mIHBvbGljeSBkb2N1bWVudHMsIG1hcHBlZCB0byB0aGUgT1JJR0lOQUwgKHByZS1tZXJnZSlcbiAgICogUG9saWN5U3RhdGVtZW50cyB0aGF0IGVuZGVkIHVwIGluIHRoZSBnaXZlbiBQb2xpY3lEb2N1bWVudC5cbiAgICpcbiAgICogQGludGVybmFsXG4gICAqL1xuICBwdWJsaWMgX3NwbGl0RG9jdW1lbnQoc2NvcGU6IElDb25zdHJ1Y3QsIHNlbGZNYXhpbXVtU2l6ZTogbnVtYmVyLCBzcGxpdE1heGltdW1TaXplOiBudW1iZXIpOiBNYXA8UG9saWN5RG9jdW1lbnQsIFBvbGljeVN0YXRlbWVudFtdPiB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgY29uc3QgbmV3RG9jczogUG9saWN5RG9jdW1lbnRbXSA9IFtdO1xuXG4gICAgLy8gTWFwcyBmaW5hbCBzdGF0ZW1lbnRzIHRvIG9yaWdpbmFsIHN0YXRlbWVudHNcbiAgICB0aGlzLmZyZWV6ZVN0YXRlbWVudHMoKTtcbiAgICBsZXQgc3RhdGVtZW50c1RvT3JpZ2luYWxzID0gbmV3IE1hcCh0aGlzLnN0YXRlbWVudHMubWFwKHMgPT4gW3MsIFtzXV0pKTtcblxuICAgIC8vIFdlIGFsd2F5cyBydW4gJ21lcmdlU3RhdGVtZW50cycgdG8gbWluaW1pemUgdGhlIHBvbGljeSBiZWZvcmUgc3BsaXR0aW5nLlxuICAgIC8vIEhvd2V2ZXIsIHdlIG9ubHkgJ21lcmdlJyB3aGVuIHRoZSBmZWF0dXJlIGZsYWcgaXMgb24uIElmIHRoZSBmbGFnIGlzIG5vdFxuICAgIC8vIG9uLCB3ZSBvbmx5IGNvbWJpbmUgc3RhdGVtZW50cyB0aGF0IGFyZSAqZXhhY3RseSogdGhlIHNhbWUuIFdlIG11c3QgZG9cbiAgICAvLyB0aGlzIGJlZm9yZSBzcGxpdHRpbmcsIG90aGVyd2lzZSB3ZSBtYXkgZW5kIHVwIHdpdGggdGhlIHN0YXRlbWVudCBzZXQgW1gsXG4gICAgLy8gWCwgWCwgWCwgWF0gYmVpbmcgc3BsaXQgb2ZmIGludG8gW1tYLCBYLCBYXSwgW1gsIFhdXSBiZWZvcmUgYmVpbmcgcmVkdWNlZFxuICAgIC8vIHRvIFtbWF0sIFtYXV0gKGJ1dCBzaG91bGQgaGF2ZSBiZWVuIGp1c3QgW1tYXV0pLlxuICAgIGNvbnN0IGRvQWN0dWFsTWVyZ2luZyA9IHRoaXMuc2hvdWxkTWVyZ2Uoc2NvcGUpO1xuICAgIGNvbnN0IHJlc3VsdCA9IG1lcmdlU3RhdGVtZW50cyh0aGlzLnN0YXRlbWVudHMsIHsgc2NvcGUsIGxpbWl0U2l6ZTogdHJ1ZSwgbWVyZ2VJZkNvbWJpbmFibGU6IGRvQWN0dWFsTWVyZ2luZyB9KTtcbiAgICB0aGlzLnN0YXRlbWVudHMuc3BsaWNlKDAsIHRoaXMuc3RhdGVtZW50cy5sZW5ndGgsIC4uLnJlc3VsdC5tZXJnZWRTdGF0ZW1lbnRzKTtcbiAgICBzdGF0ZW1lbnRzVG9PcmlnaW5hbHMgPSByZXN1bHQub3JpZ2luc01hcDtcblxuICAgIGNvbnN0IHNpemVPcHRpb25zID0gZGVyaXZlRXN0aW1hdGVTaXplT3B0aW9ucyhzY29wZSk7XG5cbiAgICAvLyBDYWNoZSBzdGF0ZW1lbnQgc2l6ZXMgdG8gYXZvaWQgcmVjb21wdXRpbmcgdGhlbSBiYXNlZCBvbiB0aGUgZmllbGRzXG4gICAgY29uc3Qgc3RhdGVtZW50U2l6ZXMgPSBuZXcgTWFwPFBvbGljeVN0YXRlbWVudCwgbnVtYmVyPih0aGlzLnN0YXRlbWVudHMubWFwKHMgPT4gW3MsIHMuX2VzdGltYXRlU2l6ZShzaXplT3B0aW9ucyldKSk7XG5cbiAgICAvLyBLZWVwIHNvbWUgc2l6ZSBjb3VudGVycyBzbyB3ZSBjYW4gYXZvaWQgcmVjb21wdXRpbmcgdGhlbSBiYXNlZCBvbiB0aGUgc3RhdGVtZW50cyBpbiBlYWNoXG4gICAgbGV0IHNlbGZTaXplID0gMDtcbiAgICBjb25zdCBwb2xTaXplcyA9IG5ldyBNYXA8UG9saWN5RG9jdW1lbnQsIG51bWJlcj4oKTtcbiAgICAvLyBHZXR0ZXIgd2l0aCBhIGRlZmF1bHQgdG8gc2F2ZSBzb21lIHN5bnRhY3RpYyBub2lzZVxuICAgIGNvbnN0IHBvbFNpemUgPSAoeDogUG9saWN5RG9jdW1lbnQpID0+IHBvbFNpemVzLmdldCh4KSA/PyAwO1xuXG4gICAgbGV0IGkgPSAwO1xuICAgIHdoaWxlIChpIDwgdGhpcy5zdGF0ZW1lbnRzLmxlbmd0aCkge1xuICAgICAgY29uc3Qgc3RhdGVtZW50ID0gdGhpcy5zdGF0ZW1lbnRzW2ldO1xuXG4gICAgICBjb25zdCBzdGF0ZW1lbnRTaXplID0gc3RhdGVtZW50U2l6ZXMuZ2V0KHN0YXRlbWVudCkgPz8gMDtcbiAgICAgIGlmIChzZWxmU2l6ZSArIHN0YXRlbWVudFNpemUgPCBzZWxmTWF4aW11bVNpemUpIHtcbiAgICAgICAgLy8gRml0cyBpbiBzZWxmXG4gICAgICAgIHNlbGZTaXplICs9IHN0YXRlbWVudFNpemU7XG4gICAgICAgIGkrKztcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIC8vIFNwbGl0IG9mZiB0byBuZXcgUG9saWN5RG9jdW1lbnQuIEZpbmQgdGhlIFBvbGljeURvY3VtZW50IHdlIGNhbiBhZGQgdGhpcyB0byxcbiAgICAgIC8vIG9yIGFkZCBhIGZyZXNoIG9uZS5cbiAgICAgIGNvbnN0IGFkZFRvRG9jID0gZmluZERvY1dpdGhTcGFjZShzdGF0ZW1lbnRTaXplKTtcbiAgICAgIGFkZFRvRG9jLmFkZFN0YXRlbWVudHMoc3RhdGVtZW50KTtcbiAgICAgIHBvbFNpemVzLnNldChhZGRUb0RvYywgcG9sU2l6ZShhZGRUb0RvYykgKyBzdGF0ZW1lbnRTaXplKTtcbiAgICAgIHRoaXMuc3RhdGVtZW50cy5zcGxpY2UoaSwgMSk7XG4gICAgfVxuXG4gICAgLy8gUmV0dXJuIHRoZSBzZXQgb2YgYWxsIHBvbGljeSBkb2N1bWVudCBhbmQgb3JpZ2luYWwgc3RhdGVtZW50c1xuICAgIGNvbnN0IHJldCA9IG5ldyBNYXA8UG9saWN5RG9jdW1lbnQsIFBvbGljeVN0YXRlbWVudFtdPigpO1xuICAgIHJldC5zZXQodGhpcywgdGhpcy5zdGF0ZW1lbnRzLmZsYXRNYXAocyA9PiBzdGF0ZW1lbnRzVG9PcmlnaW5hbHMuZ2V0KHMpID8/IFtzXSkpO1xuICAgIGZvciAoY29uc3QgbmV3RG9jIG9mIG5ld0RvY3MpIHtcbiAgICAgIHJldC5zZXQobmV3RG9jLCBuZXdEb2Muc3RhdGVtZW50cy5mbGF0TWFwKHMgPT4gc3RhdGVtZW50c1RvT3JpZ2luYWxzLmdldChzKSA/PyBbc10pKTtcbiAgICB9XG4gICAgcmV0dXJuIHJldDtcblxuICAgIGZ1bmN0aW9uIGZpbmREb2NXaXRoU3BhY2Uoc2l6ZTogbnVtYmVyKSB7XG4gICAgICBsZXQgaiA9IDA7XG4gICAgICB3aGlsZSAoaiA8IG5ld0RvY3MubGVuZ3RoICYmIHBvbFNpemUobmV3RG9jc1tqXSkgKyBzaXplID4gc3BsaXRNYXhpbXVtU2l6ZSkge1xuICAgICAgICBqKys7XG4gICAgICB9XG4gICAgICBpZiAoaiA8IG5ld0RvY3MubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiBuZXdEb2NzW2pdO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBuZXdEb2MgPSBuZXcgUG9saWN5RG9jdW1lbnQoe1xuICAgICAgICBhc3NpZ25TaWRzOiBzZWxmLmF1dG9Bc3NpZ25TaWRzLFxuICAgICAgICBtaW5pbWl6ZTogc2VsZi5taW5pbWl6ZSxcbiAgICAgIH0pO1xuICAgICAgbmV3RG9jcy5wdXNoKG5ld0RvYyk7XG4gICAgICByZXR1cm4gbmV3RG9jO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgcmVuZGVyKCk6IGFueSB7XG4gICAgaWYgKHRoaXMuaXNFbXB0eSkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBjb25zdCBkb2MgPSB7XG4gICAgICBTdGF0ZW1lbnQ6IHRoaXMuc3RhdGVtZW50cy5tYXAocyA9PiBzLnRvU3RhdGVtZW50SnNvbigpKSxcbiAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICB9O1xuXG4gICAgcmV0dXJuIGRvYztcbiAgfVxuXG4gIHByaXZhdGUgc2hvdWxkTWVyZ2Uoc2NvcGU6IElDb25zdHJ1Y3QpIHtcbiAgICByZXR1cm4gdGhpcy5taW5pbWl6ZSA/PyBjZGsuRmVhdHVyZUZsYWdzLm9mKHNjb3BlKS5pc0VuYWJsZWQoY3hhcGkuSUFNX01JTklNSVpFX1BPTElDSUVTKSA/PyBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBGcmVlemUgYWxsIHN0YXRlbWVudHNcbiAgICovXG4gIHByaXZhdGUgZnJlZXplU3RhdGVtZW50cygpIHtcbiAgICBmb3IgKGNvbnN0IHN0YXRlbWVudCBvZiB0aGlzLnN0YXRlbWVudHMpIHtcbiAgICAgIHN0YXRlbWVudC5mcmVlemUoKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==