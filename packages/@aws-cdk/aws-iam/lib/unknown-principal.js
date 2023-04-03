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
exports.UnknownPrincipal = UnknownPrincipal;
_a = JSII_RTTI_SYMBOL_1;
UnknownPrincipal[_a] = { fqn: "@aws-cdk/aws-iam.UnknownPrincipal", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidW5rbm93bi1wcmluY2lwYWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ1bmtub3duLXByaW5jaXBhbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSx3Q0FBbUQ7QUFDbkQsMkNBQStEO0FBYy9EOzs7Ozs7Ozs7O0dBVUc7QUFDSCxNQUFhLGdCQUFnQjtJQUszQixZQUFZLEtBQTRCO1FBSnhCLHFCQUFnQixHQUFXLGdCQUFnQixDQUFDOzs7Ozs7K0NBRGpELGdCQUFnQjs7OztRQU16QixJQUFJLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUM7UUFDL0IsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUM7S0FDNUI7SUFFRCxJQUFXLGNBQWM7UUFDdkIsTUFBTSxJQUFJLEtBQUssQ0FBQyxpQ0FBaUMsaUJBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksb0NBQW9DLENBQUMsQ0FBQztLQUNuSDtJQUVNLG9CQUFvQixDQUFDLFNBQTBCOzs7Ozs7Ozs7O1FBQ3BELE1BQU0sS0FBSyxHQUFHLFlBQUssQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3RDLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1FBQ3RELGtCQUFXLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxVQUFVLENBQUMsMENBQTBDLElBQUksRUFBRSxDQUFDLENBQUM7UUFDM0Ysb0VBQW9FO1FBQ3BFLE9BQU8sRUFBRSxjQUFjLEVBQUUsSUFBSSxFQUFFLGdCQUFnQixFQUFFLElBQUksNEJBQWUsRUFBRSxFQUFFLENBQUM7S0FDMUU7SUFFTSxXQUFXLENBQUMsU0FBMEI7Ozs7Ozs7Ozs7UUFDM0MsT0FBTyxJQUFJLENBQUMsb0JBQW9CLENBQUMsU0FBUyxDQUFDLENBQUMsY0FBYyxDQUFDO0tBQzVEOztBQXhCSCw0Q0F5QkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBbm5vdGF0aW9ucywgU3RhY2sgfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IERlcGVuZGVuY3lHcm91cCwgSUNvbnN0cnVjdCwgTm9kZSB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgUG9saWN5U3RhdGVtZW50IH0gZnJvbSAnLi9wb2xpY3ktc3RhdGVtZW50JztcbmltcG9ydCB7IEFkZFRvUHJpbmNpcGFsUG9saWN5UmVzdWx0LCBJUHJpbmNpcGFsLCBQcmluY2lwYWxQb2xpY3lGcmFnbWVudCB9IGZyb20gJy4vcHJpbmNpcGFscyc7XG5cbi8qKlxuICogUHJvcGVydGllcyBmb3IgYW4gVW5rbm93blByaW5jaXBhbFxuICovXG5leHBvcnQgaW50ZXJmYWNlIFVua25vd25QcmluY2lwYWxQcm9wcyB7XG4gIC8qKlxuICAgKiBUaGUgcmVzb3VyY2UgdGhlIHJvbGUgcHJveHkgaXMgZm9yXG4gICAqL1xuICByZWFkb25seSByZXNvdXJjZTogSUNvbnN0cnVjdDtcbn1cblxuLyoqXG4gKiBBIHByaW5jaXBhbCBmb3IgdXNlIGluIHJlc291cmNlcyB0aGF0IG5lZWQgdG8gaGF2ZSBhIHJvbGUgYnV0IGl0J3MgdW5rbm93blxuICpcbiAqIFNvbWUgcmVzb3VyY2VzIGhhdmUgcm9sZXMgYXNzb2NpYXRlZCB3aXRoIHRoZW0gd2hpY2ggdGhleSBhc3N1bWUsIHN1Y2ggYXNcbiAqIExhbWJkYSBGdW5jdGlvbnMsIENvZGVCdWlsZCBwcm9qZWN0cywgU3RlcEZ1bmN0aW9ucyBtYWNoaW5lcywgZXRjLlxuICpcbiAqIFdoZW4gdGhvc2UgcmVzb3VyY2VzIGFyZSBpbXBvcnRlZCwgdGhlaXIgYWN0dWFsIHJvbGVzIGFyZSBub3QgYWx3YXlzXG4gKiBpbXBvcnRlZCB3aXRoIHRoZW0uIFdoZW4gdGhhdCBoYXBwZW5zLCB3ZSB1c2UgYW4gaW5zdGFuY2Ugb2YgdGhpcyBjbGFzc1xuICogaW5zdGVhZCwgd2hpY2ggd2lsbCBhZGQgdXNlciB3YXJuaW5ncyB3aGVuIHN0YXRlbWVudHMgYXJlIGF0dGVtcHRlZCB0byBiZVxuICogYWRkZWQgdG8gaXQuXG4gKi9cbmV4cG9ydCBjbGFzcyBVbmtub3duUHJpbmNpcGFsIGltcGxlbWVudHMgSVByaW5jaXBhbCB7XG4gIHB1YmxpYyByZWFkb25seSBhc3N1bWVSb2xlQWN0aW9uOiBzdHJpbmcgPSAnc3RzOkFzc3VtZVJvbGUnO1xuICBwdWJsaWMgcmVhZG9ubHkgZ3JhbnRQcmluY2lwYWw6IElQcmluY2lwYWw7XG4gIHByaXZhdGUgcmVhZG9ubHkgcmVzb3VyY2U6IElDb25zdHJ1Y3Q7XG5cbiAgY29uc3RydWN0b3IocHJvcHM6IFVua25vd25QcmluY2lwYWxQcm9wcykge1xuICAgIHRoaXMucmVzb3VyY2UgPSBwcm9wcy5yZXNvdXJjZTtcbiAgICB0aGlzLmdyYW50UHJpbmNpcGFsID0gdGhpcztcbiAgfVxuXG4gIHB1YmxpYyBnZXQgcG9saWN5RnJhZ21lbnQoKTogUHJpbmNpcGFsUG9saWN5RnJhZ21lbnQge1xuICAgIHRocm93IG5ldyBFcnJvcihgQ2Fubm90IGdldCBwb2xpY3kgZnJhZ21lbnQgb2YgJHtOb2RlLm9mKHRoaXMucmVzb3VyY2UpLnBhdGh9LCByZXNvdXJjZSBpbXBvcnRlZCB3aXRob3V0IGEgcm9sZWApO1xuICB9XG5cbiAgcHVibGljIGFkZFRvUHJpbmNpcGFsUG9saWN5KHN0YXRlbWVudDogUG9saWN5U3RhdGVtZW50KTogQWRkVG9QcmluY2lwYWxQb2xpY3lSZXN1bHQge1xuICAgIGNvbnN0IHN0YWNrID0gU3RhY2sub2YodGhpcy5yZXNvdXJjZSk7XG4gICAgY29uc3QgcmVwciA9IEpTT04uc3RyaW5naWZ5KHN0YWNrLnJlc29sdmUoc3RhdGVtZW50KSk7XG4gICAgQW5ub3RhdGlvbnMub2YodGhpcy5yZXNvdXJjZSkuYWRkV2FybmluZyhgQWRkIHN0YXRlbWVudCB0byB0aGlzIHJlc291cmNlJ3Mgcm9sZTogJHtyZXByfWApO1xuICAgIC8vIFByZXRlbmQgd2UgZGlkIHRoZSB3b3JrLiBUaGUgaHVtYW4gd2lsbCBkbyBpdCBmb3IgdXMsIGV2ZW50dWFsbHkuXG4gICAgcmV0dXJuIHsgc3RhdGVtZW50QWRkZWQ6IHRydWUsIHBvbGljeURlcGVuZGFibGU6IG5ldyBEZXBlbmRlbmN5R3JvdXAoKSB9O1xuICB9XG5cbiAgcHVibGljIGFkZFRvUG9saWN5KHN0YXRlbWVudDogUG9saWN5U3RhdGVtZW50KTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuYWRkVG9QcmluY2lwYWxQb2xpY3koc3RhdGVtZW50KS5zdGF0ZW1lbnRBZGRlZDtcbiAgfVxufSJdfQ==