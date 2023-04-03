"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnknownPrincipal = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const core_1 = require("@aws-cdk/core");
const constructs_1 = require("constructs");
/**
 * A principal for use in resources that need to have a role but it's unknown
 *
 * Some resources have roles associated with them which they assume, such as
 * Lambda Functions, CodeBuild projects, StepFunctions machines, etc.
 *
 * When those resources are imported, their actual roles are not always
 * imported with them. When that happens, we use an instance of this class
 * instead, which will add user warnings when statements are attempted to be
 * added to it.
 */
class UnknownPrincipal {
    constructor(props) {
        this.assumeRoleAction = 'sts:AssumeRole';
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_iam_UnknownPrincipalProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, UnknownPrincipal);
            }
            throw error;
        }
        this.resource = props.resource;
        this.grantPrincipal = this;
    }
    get policyFragment() {
        throw new Error(`Cannot get policy fragment of ${constructs_1.Node.of(this.resource).path}, resource imported without a role`);
    }
    addToPrincipalPolicy(statement) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_iam_PolicyStatement(statement);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addToPrincipalPolicy);
            }
            throw error;
        }
        const stack = core_1.Stack.of(this.resource);
        const repr = JSON.stringify(stack.resolve(statement));
        core_1.Annotations.of(this.resource).addWarning(`Add statement to this resource's role: ${repr}`);
        // Pretend we did the work. The human will do it for us, eventually.
        return { statementAdded: true, policyDependable: new constructs_1.DependencyGroup() };
    }
    addToPolicy(statement) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_iam_PolicyStatement(statement);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addToPolicy);
            }
            throw error;
        }
        return this.addToPrincipalPolicy(statement).statementAdded;
    }
}
_a = JSII_RTTI_SYMBOL_1;
UnknownPrincipal[_a] = { fqn: "@aws-cdk/aws-iam.UnknownPrincipal", version: "0.0.0" };
exports.UnknownPrincipal = UnknownPrincipal;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidW5rbm93bi1wcmluY2lwYWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ1bmtub3duLXByaW5jaXBhbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSx3Q0FBbUQ7QUFDbkQsMkNBQStEO0FBYy9EOzs7Ozs7Ozs7O0dBVUc7QUFDSCxNQUFhLGdCQUFnQjtJQUszQixZQUFZLEtBQTRCO1FBSnhCLHFCQUFnQixHQUFXLGdCQUFnQixDQUFDOzs7Ozs7K0NBRGpELGdCQUFnQjs7OztRQU16QixJQUFJLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUM7UUFDL0IsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUM7S0FDNUI7SUFFRCxJQUFXLGNBQWM7UUFDdkIsTUFBTSxJQUFJLEtBQUssQ0FBQyxpQ0FBaUMsaUJBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksb0NBQW9DLENBQUMsQ0FBQztLQUNuSDtJQUVNLG9CQUFvQixDQUFDLFNBQTBCOzs7Ozs7Ozs7O1FBQ3BELE1BQU0sS0FBSyxHQUFHLFlBQUssQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3RDLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1FBQ3RELGtCQUFXLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxVQUFVLENBQUMsMENBQTBDLElBQUksRUFBRSxDQUFDLENBQUM7UUFDM0Ysb0VBQW9FO1FBQ3BFLE9BQU8sRUFBRSxjQUFjLEVBQUUsSUFBSSxFQUFFLGdCQUFnQixFQUFFLElBQUksNEJBQWUsRUFBRSxFQUFFLENBQUM7S0FDMUU7SUFFTSxXQUFXLENBQUMsU0FBMEI7Ozs7Ozs7Ozs7UUFDM0MsT0FBTyxJQUFJLENBQUMsb0JBQW9CLENBQUMsU0FBUyxDQUFDLENBQUMsY0FBYyxDQUFDO0tBQzVEOzs7O0FBeEJVLDRDQUFnQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFubm90YXRpb25zLCBTdGFjayB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgRGVwZW5kZW5jeUdyb3VwLCBJQ29uc3RydWN0LCBOb2RlIH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBQb2xpY3lTdGF0ZW1lbnQgfSBmcm9tICcuL3BvbGljeS1zdGF0ZW1lbnQnO1xuaW1wb3J0IHsgQWRkVG9QcmluY2lwYWxQb2xpY3lSZXN1bHQsIElQcmluY2lwYWwsIFByaW5jaXBhbFBvbGljeUZyYWdtZW50IH0gZnJvbSAnLi9wcmluY2lwYWxzJztcblxuLyoqXG4gKiBQcm9wZXJ0aWVzIGZvciBhbiBVbmtub3duUHJpbmNpcGFsXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgVW5rbm93blByaW5jaXBhbFByb3BzIHtcbiAgLyoqXG4gICAqIFRoZSByZXNvdXJjZSB0aGUgcm9sZSBwcm94eSBpcyBmb3JcbiAgICovXG4gIHJlYWRvbmx5IHJlc291cmNlOiBJQ29uc3RydWN0O1xufVxuXG4vKipcbiAqIEEgcHJpbmNpcGFsIGZvciB1c2UgaW4gcmVzb3VyY2VzIHRoYXQgbmVlZCB0byBoYXZlIGEgcm9sZSBidXQgaXQncyB1bmtub3duXG4gKlxuICogU29tZSByZXNvdXJjZXMgaGF2ZSByb2xlcyBhc3NvY2lhdGVkIHdpdGggdGhlbSB3aGljaCB0aGV5IGFzc3VtZSwgc3VjaCBhc1xuICogTGFtYmRhIEZ1bmN0aW9ucywgQ29kZUJ1aWxkIHByb2plY3RzLCBTdGVwRnVuY3Rpb25zIG1hY2hpbmVzLCBldGMuXG4gKlxuICogV2hlbiB0aG9zZSByZXNvdXJjZXMgYXJlIGltcG9ydGVkLCB0aGVpciBhY3R1YWwgcm9sZXMgYXJlIG5vdCBhbHdheXNcbiAqIGltcG9ydGVkIHdpdGggdGhlbS4gV2hlbiB0aGF0IGhhcHBlbnMsIHdlIHVzZSBhbiBpbnN0YW5jZSBvZiB0aGlzIGNsYXNzXG4gKiBpbnN0ZWFkLCB3aGljaCB3aWxsIGFkZCB1c2VyIHdhcm5pbmdzIHdoZW4gc3RhdGVtZW50cyBhcmUgYXR0ZW1wdGVkIHRvIGJlXG4gKiBhZGRlZCB0byBpdC5cbiAqL1xuZXhwb3J0IGNsYXNzIFVua25vd25QcmluY2lwYWwgaW1wbGVtZW50cyBJUHJpbmNpcGFsIHtcbiAgcHVibGljIHJlYWRvbmx5IGFzc3VtZVJvbGVBY3Rpb246IHN0cmluZyA9ICdzdHM6QXNzdW1lUm9sZSc7XG4gIHB1YmxpYyByZWFkb25seSBncmFudFByaW5jaXBhbDogSVByaW5jaXBhbDtcbiAgcHJpdmF0ZSByZWFkb25seSByZXNvdXJjZTogSUNvbnN0cnVjdDtcblxuICBjb25zdHJ1Y3Rvcihwcm9wczogVW5rbm93blByaW5jaXBhbFByb3BzKSB7XG4gICAgdGhpcy5yZXNvdXJjZSA9IHByb3BzLnJlc291cmNlO1xuICAgIHRoaXMuZ3JhbnRQcmluY2lwYWwgPSB0aGlzO1xuICB9XG5cbiAgcHVibGljIGdldCBwb2xpY3lGcmFnbWVudCgpOiBQcmluY2lwYWxQb2xpY3lGcmFnbWVudCB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBDYW5ub3QgZ2V0IHBvbGljeSBmcmFnbWVudCBvZiAke05vZGUub2YodGhpcy5yZXNvdXJjZSkucGF0aH0sIHJlc291cmNlIGltcG9ydGVkIHdpdGhvdXQgYSByb2xlYCk7XG4gIH1cblxuICBwdWJsaWMgYWRkVG9QcmluY2lwYWxQb2xpY3koc3RhdGVtZW50OiBQb2xpY3lTdGF0ZW1lbnQpOiBBZGRUb1ByaW5jaXBhbFBvbGljeVJlc3VsdCB7XG4gICAgY29uc3Qgc3RhY2sgPSBTdGFjay5vZih0aGlzLnJlc291cmNlKTtcbiAgICBjb25zdCByZXByID0gSlNPTi5zdHJpbmdpZnkoc3RhY2sucmVzb2x2ZShzdGF0ZW1lbnQpKTtcbiAgICBBbm5vdGF0aW9ucy5vZih0aGlzLnJlc291cmNlKS5hZGRXYXJuaW5nKGBBZGQgc3RhdGVtZW50IHRvIHRoaXMgcmVzb3VyY2UncyByb2xlOiAke3JlcHJ9YCk7XG4gICAgLy8gUHJldGVuZCB3ZSBkaWQgdGhlIHdvcmsuIFRoZSBodW1hbiB3aWxsIGRvIGl0IGZvciB1cywgZXZlbnR1YWxseS5cbiAgICByZXR1cm4geyBzdGF0ZW1lbnRBZGRlZDogdHJ1ZSwgcG9saWN5RGVwZW5kYWJsZTogbmV3IERlcGVuZGVuY3lHcm91cCgpIH07XG4gIH1cblxuICBwdWJsaWMgYWRkVG9Qb2xpY3koc3RhdGVtZW50OiBQb2xpY3lTdGF0ZW1lbnQpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5hZGRUb1ByaW5jaXBhbFBvbGljeShzdGF0ZW1lbnQpLnN0YXRlbWVudEFkZGVkO1xuICB9XG59Il19