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
            const result = (0, merge_statements_1.mergeStatements)(this.statements, { scope });
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
        const result = (0, merge_statements_1.mergeStatements)(this.statements, { scope, limitSize: true, mergeIfCombinable: doActualMerging });
        this.statements.splice(0, this.statements.length, ...result.mergedStatements);
        statementsToOriginals = result.originsMap;
        const sizeOptions = (0, policy_statement_1.deriveEstimateSizeOptions)(scope);
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
_a = JSII_RTTI_SYMBOL_1;
PolicyDocument[_a] = { fqn: "@aws-cdk/aws-iam.PolicyDocument", version: "0.0.0" };
exports.PolicyDocument = PolicyDocument;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9saWN5LWRvY3VtZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicG9saWN5LWRvY3VtZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLHFDQUFxQztBQUNyQyx5Q0FBeUM7QUFFekMseURBQWdGO0FBQ2hGLGlFQUE2RDtBQUM3RCx1RkFBa0Y7QUF1Q2xGOztHQUVHO0FBQ0gsTUFBYSxjQUFjO0lBRXpCOzs7O09BSUc7SUFDSSxNQUFNLENBQUMsUUFBUSxDQUFDLEdBQVE7UUFDN0IsTUFBTSxpQkFBaUIsR0FBRyxJQUFJLGNBQWMsRUFBRSxDQUFDO1FBQy9DLE1BQU0sU0FBUyxHQUFHLEdBQUcsQ0FBQyxTQUFTLElBQUksRUFBRSxDQUFDO1FBQ3RDLElBQUksU0FBUyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsRUFBRTtZQUMxQyxNQUFNLElBQUksS0FBSyxDQUFDLDRCQUE0QixDQUFDLENBQUM7U0FDL0M7UUFDRCxpQkFBaUIsQ0FBQyxhQUFhLENBQUMsR0FBRyxHQUFHLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQU0sRUFBRSxFQUFFLENBQUMsa0NBQWUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQy9GLE9BQU8saUJBQWlCLENBQUM7S0FDMUI7SUFPRCxZQUFZLFFBQTZCLEVBQUU7UUFKMUIsZUFBVSxHQUFHLElBQUksS0FBSyxFQUFtQixDQUFDOzs7Ozs7K0NBbEJoRCxjQUFjOzs7O1FBdUJ2QixJQUFJLENBQUMsYUFBYSxHQUFHLEdBQUcsQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO1FBQzdDLElBQUksQ0FBQyxjQUFjLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUM7UUFDekMsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDO1FBRS9CLElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxLQUFLLENBQUMsVUFB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LENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLGVBQWUsRUFBRSxDQUFDO1lBQ3hELE9BQU8sRUFBRSxZQUFZO1NBQ3RCLENBQUM7UUFFRixPQUFPLEdBQUcsQ0FBQztLQUNaO0lBRU8sV0FBVyxDQUFDLEtBQWlCO1FBQ25DLE9BQU8sSUFBSSxDQUFDLFFBQVEsSUFBSSxHQUFHLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLHFCQUFxQixDQUFDLElBQUksS0FBSyxDQUFDO0tBQ3BHO0lBRUQ7O09BRUc7SUFDSyxnQkFBZ0I7UUFDdEIsS0FBSyxNQUFNLFNBQVMsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFO1lBQ3ZDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztTQUNwQjtLQUNGOzs7O0FBdlFVLHdDQUFjIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY2RrIGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0ICogYXMgY3hhcGkgZnJvbSAnQGF3cy1jZGsvY3gtYXBpJztcbmltcG9ydCB7IElDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IFBvbGljeVN0YXRlbWVudCwgZGVyaXZlRXN0aW1hdGVTaXplT3B0aW9ucyB9IGZyb20gJy4vcG9saWN5LXN0YXRlbWVudCc7XG5pbXBvcnQgeyBtZXJnZVN0YXRlbWVudHMgfSBmcm9tICcuL3ByaXZhdGUvbWVyZ2Utc3RhdGVtZW50cyc7XG5pbXBvcnQgeyBQb3N0UHJvY2Vzc1BvbGljeURvY3VtZW50IH0gZnJvbSAnLi9wcml2YXRlL3Bvc3Rwcm9jZXNzLXBvbGljeS1kb2N1bWVudCc7XG5cbi8qKlxuICogUHJvcGVydGllcyBmb3IgYSBuZXcgUG9saWN5RG9jdW1lbnRcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBQb2xpY3lEb2N1bWVudFByb3BzIHtcbiAgLyoqXG4gICAqIEF1dG9tYXRpY2FsbHkgYXNzaWduIFN0YXRlbWVudCBJZHMgdG8gYWxsIHN0YXRlbWVudHNcbiAgICpcbiAgICogQGRlZmF1bHQgZmFsc2VcbiAgICovXG4gIHJlYWRvbmx5IGFzc2lnblNpZHM/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBJbml0aWFsIHN0YXRlbWVudHMgdG8gYWRkIHRvIHRoZSBwb2xpY3kgZG9jdW1lbnRcbiAgICpcbiAgICogQGRlZmF1bHQgLSBObyBzdGF0ZW1lbnRzXG4gICAqL1xuICByZWFkb25seSBzdGF0ZW1lbnRzPzogUG9saWN5U3RhdGVtZW50W107XG5cbiAgLyoqXG4gICAqIFRyeSB0byBtaW5pbWl6ZSB0aGUgcG9saWN5IGJ5IG1lcmdpbmcgc3RhdGVtZW50c1xuICAgKlxuICAgKiBUbyBhdm9pZCBvdmVycnVubmluZyB0aGUgbWF4aW11bSBwb2xpY3kgc2l6ZSwgY29tYmluZSBzdGF0ZW1lbnRzIGlmIHRoZXkgcHJvZHVjZVxuICAgKiB0aGUgc2FtZSByZXN1bHQuIE1lcmdpbmcgaGFwcGVucyBhY2NvcmRpbmcgdG8gdGhlIGZvbGxvd2luZyBydWxlczpcbiAgICpcbiAgICogLSBUaGUgRWZmZWN0IG9mIGJvdGggc3RhdGVtZW50cyBpcyB0aGUgc2FtZVxuICAgKiAtIE5laXRoZXIgb2YgdGhlIHN0YXRlbWVudHMgaGF2ZSBhICdTaWQnXG4gICAqIC0gQ29tYmluZSBQcmluY2lwYWxzIGlmIHRoZSByZXN0IG9mIHRoZSBzdGF0ZW1lbnQgaXMgZXhhY3RseSB0aGUgc2FtZS5cbiAgICogLSBDb21iaW5lIFJlc291cmNlcyBpZiB0aGUgcmVzdCBvZiB0aGUgc3RhdGVtZW50IGlzIGV4YWN0bHkgdGhlIHNhbWUuXG4gICAqIC0gQ29tYmluZSBBY3Rpb25zIGlmIHRoZSByZXN0IG9mIHRoZSBzdGF0ZW1lbnQgaXMgZXhhY3RseSB0aGUgc2FtZS5cbiAgICogLSBXZSB3aWxsIG5ldmVyIGNvbWJpbmUgTm90UHJpbmNpcGFscywgTm90UmVzb3VyY2VzIG9yIE5vdEFjdGlvbnMsIGJlY2F1c2UgZG9pbmdcbiAgICogICBzbyB3b3VsZCBjaGFuZ2UgdGhlIG1lYW5pbmcgb2YgdGhlIHBvbGljeSBkb2N1bWVudC5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBmYWxzZSwgdW5sZXNzIHRoZSBmZWF0dXJlIGZsYWcgYEBhd3MtY2RrL2F3cy1pYW06bWluaW1pemVQb2xpY2llc2AgaXMgc2V0XG4gICAqL1xuICByZWFkb25seSBtaW5pbWl6ZT86IGJvb2xlYW47XG59XG5cbi8qKlxuICogQSBQb2xpY3lEb2N1bWVudCBpcyBhIGNvbGxlY3Rpb24gb2Ygc3RhdGVtZW50c1xuICovXG5leHBvcnQgY2xhc3MgUG9saWN5RG9jdW1lbnQgaW1wbGVtZW50cyBjZGsuSVJlc29sdmFibGUge1xuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbmV3IFBvbGljeURvY3VtZW50IGJhc2VkIG9uIHRoZSBvYmplY3QgcHJvdmlkZWQuXG4gICAqIFRoaXMgd2lsbCBhY2NlcHQgYW4gb2JqZWN0IGNyZWF0ZWQgZnJvbSB0aGUgYC50b0pTT04oKWAgY2FsbFxuICAgKiBAcGFyYW0gb2JqIHRoZSBQb2xpY3lEb2N1bWVudCBpbiBvYmplY3QgZm9ybS5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZnJvbUpzb24ob2JqOiBhbnkpOiBQb2xpY3lEb2N1bWVudCB7XG4gICAgY29uc3QgbmV3UG9saWN5RG9jdW1lbnQgPSBuZXcgUG9saWN5RG9jdW1lbnQoKTtcbiAgICBjb25zdCBzdGF0ZW1lbnQgPSBvYmouU3RhdGVtZW50ID8/IFtdO1xuICAgIGlmIChzdGF0ZW1lbnQgJiYgIUFycmF5LmlzQXJyYXkoc3RhdGVtZW50KSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdTdGF0ZW1lbnQgbXVzdCBiZSBhbiBhcnJheScpO1xuICAgIH1cbiAgICBuZXdQb2xpY3lEb2N1bWVudC5hZGRTdGF0ZW1lbnRzKC4uLm9iai5TdGF0ZW1lbnQubWFwKChzOiBhbnkpID0+IFBvbGljeVN0YXRlbWVudC5mcm9tSnNvbihzKSkpO1xuICAgIHJldHVybiBuZXdQb2xpY3lEb2N1bWVudDtcbiAgfVxuXG4gIHB1YmxpYyByZWFkb25seSBjcmVhdGlvblN0YWNrOiBzdHJpbmdbXTtcbiAgcHJpdmF0ZSByZWFkb25seSBzdGF0ZW1lbnRzID0gbmV3IEFycmF5PFBvbGljeVN0YXRlbWVudD4oKTtcbiAgcHJpdmF0ZSByZWFkb25seSBhdXRvQXNzaWduU2lkczogYm9vbGVhbjtcbiAgcHJpdmF0ZSByZWFkb25seSBtaW5pbWl6ZT86IGJvb2xlYW47XG5cbiAgY29uc3RydWN0b3IocHJvcHM6IFBvbGljeURvY3VtZW50UHJvcHMgPSB7fSkge1xuICAgIHRoaXMuY3JlYXRpb25TdGFjayA9IGNkay5jYXB0dXJlU3RhY2tUcmFjZSgpO1xuICAgIHRoaXMuYXV0b0Fzc2lnblNpZHMgPSAhIXByb3BzLmFzc2lnblNpZHM7XG4gICAgdGhpcy5taW5pbWl6ZSA9IHByb3BzLm1pbmltaXplO1xuXG4gICAgdGhpcy5hZGRTdGF0ZW1lbnRzKC4uLnByb3BzLnN0YXRlbWVudHMgfHwgW10pO1xuICB9XG5cbiAgcHVibGljIHJlc29sdmUoY29udGV4dDogY2RrLklSZXNvbHZlQ29udGV4dCk6IGFueSB7XG4gICAgdGhpcy5mcmVlemVTdGF0ZW1lbnRzKCk7XG4gICAgdGhpcy5fbWF5YmVNZXJnZVN0YXRlbWVudHMoY29udGV4dC5zY29wZSk7XG5cbiAgICAvLyBJbiB0aGUgcHJldmlvdXMgaW1wbGVtZW50YXRpb24gb2YgJ21lcmdlJywgc29ydGluZyBvZiBhY3Rpb25zL3Jlc291cmNlcyBvblxuICAgIC8vIGEgc3RhdGVtZW50IGFsd2F5cyBoYXBwZW5lZCwgZXZlbiAgb24gc2luZ3VsYXIgc3RhdGVtZW50cy4gSW4gdGhlIG5ld1xuICAgIC8vIGltcGxlbWVudGF0aW9uIG9mICdtZXJnZScsIHNvcnRpbmcgb25seSBoYXBwZW5zIHdoZW4gYWN0dWFsbHkgY29tYmluaW5nIDJcbiAgICAvLyBzdGF0ZW1lbnRzLiBUaGlzIGFmZmVjdHMgYWxsIHRlc3Qgc25hcHNob3RzLCBzbyB3ZSBuZWVkIHRvIHB1dCBpbiBtZWNoYW5pc21zXG4gICAgLy8gdG8gYXZvaWQgaGF2aW5nIHRvIHVwZGF0ZSBhbGwgc25hcHNob3RzLlxuICAgIC8vXG4gICAgLy8gVG8gZG8gc29ydGluZyBpbiBhIHdheSBjb21wYXRpYmxlIHdpdGggdGhlIHByZXZpb3VzIGltcGxlbWVudGF0aW9uIG9mIG1lcmdpbmcsXG4gICAgLy8gKHNvIHdlIGRvbid0IGhhdmUgdG8gdXBkYXRlIHNuYXBzaG90cykgZG8gaXQgYWZ0ZXIgcmVuZGVyaW5nLCBidXQgb25seSB3aGVuXG4gICAgLy8gbWVyZ2luZyBpcyBlbmFibGVkLlxuICAgIGNvbnN0IHNvcnQgPSB0aGlzLnNob3VsZE1lcmdlKGNvbnRleHQuc2NvcGUpO1xuICAgIGNvbnRleHQucmVnaXN0ZXJQb3N0UHJvY2Vzc29yKG5ldyBQb3N0UHJvY2Vzc1BvbGljeURvY3VtZW50KHRoaXMuYXV0b0Fzc2lnblNpZHMsIHNvcnQpKTtcbiAgICByZXR1cm4gdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSBwb2xpY3kgZG9jdW1lbnQgY29udGFpbnMgYW55IHN0YXRlbWVudHMuXG4gICAqL1xuICBwdWJsaWMgZ2V0IGlzRW1wdHkoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuc3RhdGVtZW50cy5sZW5ndGggPT09IDA7XG4gIH1cblxuICAvKipcbiAgICogVGhlIG51bWJlciBvZiBzdGF0ZW1lbnRzIGFscmVhZHkgYWRkZWQgdG8gdGhpcyBwb2xpY3kuXG4gICAqIENhbiBiZSB1c2VkLCBmb3IgZXhhbXBsZSwgdG8gZ2VuZXJhdGUgdW5pcXVlIFwic2lkXCJzIHdpdGhpbiB0aGUgcG9saWN5LlxuICAgKi9cbiAgcHVibGljIGdldCBzdGF0ZW1lbnRDb3VudCgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLnN0YXRlbWVudHMubGVuZ3RoO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYSBzdGF0ZW1lbnQgdG8gdGhlIHBvbGljeSBkb2N1bWVudC5cbiAgICpcbiAgICogQHBhcmFtIHN0YXRlbWVudCB0aGUgc3RhdGVtZW50IHRvIGFkZC5cbiAgICovXG4gIHB1YmxpYyBhZGRTdGF0ZW1lbnRzKC4uLnN0YXRlbWVudDogUG9saWN5U3RhdGVtZW50W10pIHtcbiAgICB0aGlzLnN0YXRlbWVudHMucHVzaCguLi5zdGF0ZW1lbnQpO1xuICB9XG5cbiAgLyoqXG4gICAqIEVuY29kZSB0aGUgcG9saWN5IGRvY3VtZW50IGFzIGEgc3RyaW5nXG4gICAqL1xuICBwdWJsaWMgdG9TdHJpbmcoKSB7XG4gICAgcmV0dXJuIGNkay5Ub2tlbi5hc1N0cmluZyh0aGlzLCB7XG4gICAgICBkaXNwbGF5SGludDogJ1BvbGljeURvY3VtZW50JyxcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBKU09OLWlmeSB0aGUgZG9jdW1lbnRcbiAgICpcbiAgICogVXNlZCB3aGVuIEpTT04uc3RyaW5naWZ5KCkgaXMgY2FsbGVkXG4gICAqL1xuICBwdWJsaWMgdG9KU09OKCkge1xuICAgIHJldHVybiB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIFZhbGlkYXRlIHRoYXQgYWxsIHBvbGljeSBzdGF0ZW1lbnRzIGluIHRoZSBwb2xpY3kgZG9jdW1lbnQgc2F0aXNmaWVzIHRoZVxuICAgKiByZXF1aXJlbWVudHMgZm9yIGFueSBwb2xpY3kuXG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0lBTS9sYXRlc3QvVXNlckd1aWRlL2FjY2Vzc19wb2xpY2llcy5odG1sI2FjY2Vzc19wb2xpY2llcy1qc29uXG4gICAqXG4gICAqIEByZXR1cm5zIEFuIGFycmF5IG9mIHZhbGlkYXRpb24gZXJyb3IgbWVzc2FnZXMsIG9yIGFuIGVtcHR5IGFycmF5IGlmIHRoZSBkb2N1bWVudCBpcyB2YWxpZC5cbiAgICovXG4gIHB1YmxpYyB2YWxpZGF0ZUZvckFueVBvbGljeSgpOiBzdHJpbmdbXSB7XG4gICAgY29uc3QgZXJyb3JzID0gbmV3IEFycmF5PHN0cmluZz4oKTtcbiAgICBmb3IgKGNvbnN0IHN0YXRlbWVudCBvZiB0aGlzLnN0YXRlbWVudHMpIHtcbiAgICAgIGVycm9ycy5wdXNoKC4uLnN0YXRlbWVudC52YWxpZGF0ZUZvckFueVBvbGljeSgpKTtcbiAgICB9XG4gICAgcmV0dXJuIGVycm9ycztcbiAgfVxuXG4gIC8qKlxuICAgKiBWYWxpZGF0ZSB0aGF0IGFsbCBwb2xpY3kgc3RhdGVtZW50cyBpbiB0aGUgcG9saWN5IGRvY3VtZW50IHNhdGlzZmllcyB0aGVcbiAgICogcmVxdWlyZW1lbnRzIGZvciBhIHJlc291cmNlLWJhc2VkIHBvbGljeS5cbiAgICpcbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vSUFNL2xhdGVzdC9Vc2VyR3VpZGUvYWNjZXNzX3BvbGljaWVzLmh0bWwjYWNjZXNzX3BvbGljaWVzLWpzb25cbiAgICpcbiAgICogQHJldHVybnMgQW4gYXJyYXkgb2YgdmFsaWRhdGlvbiBlcnJvciBtZXNzYWdlcywgb3IgYW4gZW1wdHkgYXJyYXkgaWYgdGhlIGRvY3VtZW50IGlzIHZhbGlkLlxuICAgKi9cbiAgcHVibGljIHZhbGlkYXRlRm9yUmVzb3VyY2VQb2xpY3koKTogc3RyaW5nW10ge1xuICAgIGNvbnN0IGVycm9ycyA9IG5ldyBBcnJheTxzdHJpbmc+KCk7XG4gICAgZm9yIChjb25zdCBzdGF0ZW1lbnQgb2YgdGhpcy5zdGF0ZW1lbnRzKSB7XG4gICAgICBlcnJvcnMucHVzaCguLi5zdGF0ZW1lbnQudmFsaWRhdGVGb3JSZXNvdXJjZVBvbGljeSgpKTtcbiAgICB9XG4gICAgcmV0dXJuIGVycm9ycztcbiAgfVxuXG4gIC8qKlxuICAgKiBWYWxpZGF0ZSB0aGF0IGFsbCBwb2xpY3kgc3RhdGVtZW50cyBpbiB0aGUgcG9saWN5IGRvY3VtZW50IHNhdGlzZmllcyB0aGVcbiAgICogcmVxdWlyZW1lbnRzIGZvciBhbiBpZGVudGl0eS1iYXNlZCBwb2xpY3kuXG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0lBTS9sYXRlc3QvVXNlckd1aWRlL2FjY2Vzc19wb2xpY2llcy5odG1sI2FjY2Vzc19wb2xpY2llcy1qc29uXG4gICAqXG4gICAqIEByZXR1cm5zIEFuIGFycmF5IG9mIHZhbGlkYXRpb24gZXJyb3IgbWVzc2FnZXMsIG9yIGFuIGVtcHR5IGFycmF5IGlmIHRoZSBkb2N1bWVudCBpcyB2YWxpZC5cbiAgICovXG4gIHB1YmxpYyB2YWxpZGF0ZUZvcklkZW50aXR5UG9saWN5KCk6IHN0cmluZ1tdIHtcbiAgICBjb25zdCBlcnJvcnMgPSBuZXcgQXJyYXk8c3RyaW5nPigpO1xuICAgIGZvciAoY29uc3Qgc3RhdGVtZW50IG9mIHRoaXMuc3RhdGVtZW50cykge1xuICAgICAgZXJyb3JzLnB1c2goLi4uc3RhdGVtZW50LnZhbGlkYXRlRm9ySWRlbnRpdHlQb2xpY3koKSk7XG4gICAgfVxuICAgIHJldHVybiBlcnJvcnM7XG4gIH1cblxuICAvKipcbiAgICogUGVyZm9ybSBzdGF0ZW1lbnQgbWVyZ2luZyAoaWYgZW5hYmxlZCBhbmQgbm90IGRvbmUgeWV0KVxuICAgKlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIHB1YmxpYyBfbWF5YmVNZXJnZVN0YXRlbWVudHMoc2NvcGU6IElDb25zdHJ1Y3QpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5zaG91bGRNZXJnZShzY29wZSkpIHtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IG1lcmdlU3RhdGVtZW50cyh0aGlzLnN0YXRlbWVudHMsIHsgc2NvcGUgfSk7XG4gICAgICB0aGlzLnN0YXRlbWVudHMuc3BsaWNlKDAsIHRoaXMuc3RhdGVtZW50cy5sZW5ndGgsIC4uLnJlc3VsdC5tZXJnZWRTdGF0ZW1lbnRzKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU3BsaXQgdGhlIHN0YXRlbWVudHMgb2YgdGhlIFBvbGljeURvY3VtZW50IGludG8gbXVsdGlwbGUgZ3JvdXBzLCBsaW1pdGVkIGJ5IHRoZWlyIHNpemVcbiAgICpcbiAgICogV2UgZG8gYSByb3VuZCBvZiBzaXplLWxpbWl0ZWQgbWVyZ2luZyBmaXJzdCAobWFraW5nIHN1cmUgdG8gbm90IHByb2R1Y2Ugc3RhdGVtZW50cyB0b29cbiAgICogbGFyZ2UgdG8gZml0IGludG8gc3RhbmRhbG9uZSBwb2xpY2llcyksIHNvIHRoYXQgd2UgY2FuIG1vc3QgYWNjdXJhdGVseSBlc3RpbWF0ZSB0b3RhbFxuICAgKiBwb2xpY3kgc2l6ZS4gQW5vdGhlciBmaW5hbCByb3VuZCBvZiBtaW5pbWl6YXRpb24gd2lsbCBiZSBkb25lIGp1c3QgYmVmb3JlIHJlbmRlcmluZyB0b1xuICAgKiBlbmQgdXAgd2l0aCBtaW5pbWFsIHBvbGljaWVzIHRoYXQgbG9vayBuaWNlIHRvIGh1bWFucy5cbiAgICpcbiAgICogUmV0dXJuIGEgbWFwIG9mIHRoZSBmaW5hbCBzZXQgb2YgcG9saWN5IGRvY3VtZW50cywgbWFwcGVkIHRvIHRoZSBPUklHSU5BTCAocHJlLW1lcmdlKVxuICAgKiBQb2xpY3lTdGF0ZW1lbnRzIHRoYXQgZW5kZWQgdXAgaW4gdGhlIGdpdmVuIFBvbGljeURvY3VtZW50LlxuICAgKlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIHB1YmxpYyBfc3BsaXREb2N1bWVudChzY29wZTogSUNvbnN0cnVjdCwgc2VsZk1heGltdW1TaXplOiBudW1iZXIsIHNwbGl0TWF4aW11bVNpemU6IG51bWJlcik6IE1hcDxQb2xpY3lEb2N1bWVudCwgUG9saWN5U3RhdGVtZW50W10+IHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICBjb25zdCBuZXdEb2NzOiBQb2xpY3lEb2N1bWVudFtdID0gW107XG5cbiAgICAvLyBNYXBzIGZpbmFsIHN0YXRlbWVudHMgdG8gb3JpZ2luYWwgc3RhdGVtZW50c1xuICAgIHRoaXMuZnJlZXplU3RhdGVtZW50cygpO1xuICAgIGxldCBzdGF0ZW1lbnRzVG9PcmlnaW5hbHMgPSBuZXcgTWFwKHRoaXMuc3RhdGVtZW50cy5tYXAocyA9PiBbcywgW3NdXSkpO1xuXG4gICAgLy8gV2UgYWx3YXlzIHJ1biAnbWVyZ2VTdGF0ZW1lbnRzJyB0byBtaW5pbWl6ZSB0aGUgcG9saWN5IGJlZm9yZSBzcGxpdHRpbmcuXG4gICAgLy8gSG93ZXZlciwgd2Ugb25seSAnbWVyZ2UnIHdoZW4gdGhlIGZlYXR1cmUgZmxhZyBpcyBvbi4gSWYgdGhlIGZsYWcgaXMgbm90XG4gICAgLy8gb24sIHdlIG9ubHkgY29tYmluZSBzdGF0ZW1lbnRzIHRoYXQgYXJlICpleGFjdGx5KiB0aGUgc2FtZS4gV2UgbXVzdCBkb1xuICAgIC8vIHRoaXMgYmVmb3JlIHNwbGl0dGluZywgb3RoZXJ3aXNlIHdlIG1heSBlbmQgdXAgd2l0aCB0aGUgc3RhdGVtZW50IHNldCBbWCxcbiAgICAvLyBYLCBYLCBYLCBYXSBiZWluZyBzcGxpdCBvZmYgaW50byBbW1gsIFgsIFhdLCBbWCwgWF1dIGJlZm9yZSBiZWluZyByZWR1Y2VkXG4gICAgLy8gdG8gW1tYXSwgW1hdXSAoYnV0IHNob3VsZCBoYXZlIGJlZW4ganVzdCBbW1hdXSkuXG4gICAgY29uc3QgZG9BY3R1YWxNZXJnaW5nID0gdGhpcy5zaG91bGRNZXJnZShzY29wZSk7XG4gICAgY29uc3QgcmVzdWx0ID0gbWVyZ2VTdGF0ZW1lbnRzKHRoaXMuc3RhdGVtZW50cywgeyBzY29wZSwgbGltaXRTaXplOiB0cnVlLCBtZXJnZUlmQ29tYmluYWJsZTogZG9BY3R1YWxNZXJnaW5nIH0pO1xuICAgIHRoaXMuc3RhdGVtZW50cy5zcGxpY2UoMCwgdGhpcy5zdGF0ZW1lbnRzLmxlbmd0aCwgLi4ucmVzdWx0Lm1lcmdlZFN0YXRlbWVudHMpO1xuICAgIHN0YXRlbWVudHNUb09yaWdpbmFscyA9IHJlc3VsdC5vcmlnaW5zTWFwO1xuXG4gICAgY29uc3Qgc2l6ZU9wdGlvbnMgPSBkZXJpdmVFc3RpbWF0ZVNpemVPcHRpb25zKHNjb3BlKTtcblxuICAgIC8vIENhY2hlIHN0YXRlbWVudCBzaXplcyB0byBhdm9pZCByZWNvbXB1dGluZyB0aGVtIGJhc2VkIG9uIHRoZSBmaWVsZHNcbiAgICBjb25zdCBzdGF0ZW1lbnRTaXplcyA9IG5ldyBNYXA8UG9saWN5U3RhdGVtZW50LCBudW1iZXI+KHRoaXMuc3RhdGVtZW50cy5tYXAocyA9PiBbcywgcy5fZXN0aW1hdGVTaXplKHNpemVPcHRpb25zKV0pKTtcblxuICAgIC8vIEtlZXAgc29tZSBzaXplIGNvdW50ZXJzIHNvIHdlIGNhbiBhdm9pZCByZWNvbXB1dGluZyB0aGVtIGJhc2VkIG9uIHRoZSBzdGF0ZW1lbnRzIGluIGVhY2hcbiAgICBsZXQgc2VsZlNpemUgPSAwO1xuICAgIGNvbnN0IHBvbFNpemVzID0gbmV3IE1hcDxQb2xpY3lEb2N1bWVudCwgbnVtYmVyPigpO1xuICAgIC8vIEdldHRlciB3aXRoIGEgZGVmYXVsdCB0byBzYXZlIHNvbWUgc3ludGFjdGljIG5vaXNlXG4gICAgY29uc3QgcG9sU2l6ZSA9ICh4OiBQb2xpY3lEb2N1bWVudCkgPT4gcG9sU2l6ZXMuZ2V0KHgpID8/IDA7XG5cbiAgICBsZXQgaSA9IDA7XG4gICAgd2hpbGUgKGkgPCB0aGlzLnN0YXRlbWVudHMubGVuZ3RoKSB7XG4gICAgICBjb25zdCBzdGF0ZW1lbnQgPSB0aGlzLnN0YXRlbWVudHNbaV07XG5cbiAgICAgIGNvbnN0IHN0YXRlbWVudFNpemUgPSBzdGF0ZW1lbnRTaXplcy5nZXQoc3RhdGVtZW50KSA/PyAwO1xuICAgICAgaWYgKHNlbGZTaXplICsgc3RhdGVtZW50U2l6ZSA8IHNlbGZNYXhpbXVtU2l6ZSkge1xuICAgICAgICAvLyBGaXRzIGluIHNlbGZcbiAgICAgICAgc2VsZlNpemUgKz0gc3RhdGVtZW50U2l6ZTtcbiAgICAgICAgaSsrO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgLy8gU3BsaXQgb2ZmIHRvIG5ldyBQb2xpY3lEb2N1bWVudC4gRmluZCB0aGUgUG9saWN5RG9jdW1lbnQgd2UgY2FuIGFkZCB0aGlzIHRvLFxuICAgICAgLy8gb3IgYWRkIGEgZnJlc2ggb25lLlxuICAgICAgY29uc3QgYWRkVG9Eb2MgPSBmaW5kRG9jV2l0aFNwYWNlKHN0YXRlbWVudFNpemUpO1xuICAgICAgYWRkVG9Eb2MuYWRkU3RhdGVtZW50cyhzdGF0ZW1lbnQpO1xuICAgICAgcG9sU2l6ZXMuc2V0KGFkZFRvRG9jLCBwb2xTaXplKGFkZFRvRG9jKSArIHN0YXRlbWVudFNpemUpO1xuICAgICAgdGhpcy5zdGF0ZW1lbnRzLnNwbGljZShpLCAxKTtcbiAgICB9XG5cbiAgICAvLyBSZXR1cm4gdGhlIHNldCBvZiBhbGwgcG9saWN5IGRvY3VtZW50IGFuZCBvcmlnaW5hbCBzdGF0ZW1lbnRzXG4gICAgY29uc3QgcmV0ID0gbmV3IE1hcDxQb2xpY3lEb2N1bWVudCwgUG9saWN5U3RhdGVtZW50W10+KCk7XG4gICAgcmV0LnNldCh0aGlzLCB0aGlzLnN0YXRlbWVudHMuZmxhdE1hcChzID0+IHN0YXRlbWVudHNUb09yaWdpbmFscy5nZXQocykgPz8gW3NdKSk7XG4gICAgZm9yIChjb25zdCBuZXdEb2Mgb2YgbmV3RG9jcykge1xuICAgICAgcmV0LnNldChuZXdEb2MsIG5ld0RvYy5zdGF0ZW1lbnRzLmZsYXRNYXAocyA9PiBzdGF0ZW1lbnRzVG9PcmlnaW5hbHMuZ2V0KHMpID8/IFtzXSkpO1xuICAgIH1cbiAgICByZXR1cm4gcmV0O1xuXG4gICAgZnVuY3Rpb24gZmluZERvY1dpdGhTcGFjZShzaXplOiBudW1iZXIpIHtcbiAgICAgIGxldCBqID0gMDtcbiAgICAgIHdoaWxlIChqIDwgbmV3RG9jcy5sZW5ndGggJiYgcG9sU2l6ZShuZXdEb2NzW2pdKSArIHNpemUgPiBzcGxpdE1heGltdW1TaXplKSB7XG4gICAgICAgIGorKztcbiAgICAgIH1cbiAgICAgIGlmIChqIDwgbmV3RG9jcy5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIG5ld0RvY3Nbal07XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IG5ld0RvYyA9IG5ldyBQb2xpY3lEb2N1bWVudCh7XG4gICAgICAgIGFzc2lnblNpZHM6IHNlbGYuYXV0b0Fzc2lnblNpZHMsXG4gICAgICAgIG1pbmltaXplOiBzZWxmLm1pbmltaXplLFxuICAgICAgfSk7XG4gICAgICBuZXdEb2NzLnB1c2gobmV3RG9jKTtcbiAgICAgIHJldHVybiBuZXdEb2M7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSByZW5kZXIoKTogYW55IHtcbiAgICBpZiAodGhpcy5pc0VtcHR5KSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIGNvbnN0IGRvYyA9IHtcbiAgICAgIFN0YXRlbWVudDogdGhpcy5zdGF0ZW1lbnRzLm1hcChzID0+IHMudG9TdGF0ZW1lbnRKc29uKCkpLFxuICAgICAgVmVyc2lvbjogJzIwMTItMTAtMTcnLFxuICAgIH07XG5cbiAgICByZXR1cm4gZG9jO1xuICB9XG5cbiAgcHJpdmF0ZSBzaG91bGRNZXJnZShzY29wZTogSUNvbnN0cnVjdCkge1xuICAgIHJldHVybiB0aGlzLm1pbmltaXplID8/IGNkay5GZWF0dXJlRmxhZ3Mub2Yoc2NvcGUpLmlzRW5hYmxlZChjeGFwaS5JQU1fTUlOSU1JWkVfUE9MSUNJRVMpID8/IGZhbHNlO1xuICB9XG5cbiAgLyoqXG4gICAqIEZyZWV6ZSBhbGwgc3RhdGVtZW50c1xuICAgKi9cbiAgcHJpdmF0ZSBmcmVlemVTdGF0ZW1lbnRzKCkge1xuICAgIGZvciAoY29uc3Qgc3RhdGVtZW50IG9mIHRoaXMuc3RhdGVtZW50cykge1xuICAgICAgc3RhdGVtZW50LmZyZWV6ZSgpO1xuICAgIH1cbiAgfVxufVxuIl19