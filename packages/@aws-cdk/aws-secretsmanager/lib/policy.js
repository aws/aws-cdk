"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResourcePolicy = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const iam = require("@aws-cdk/aws-iam");
const core_1 = require("@aws-cdk/core");
const secretsmanager_generated_1 = require("./secretsmanager.generated");
/**
 * Resource Policy for SecretsManager Secrets
 *
 * Policies define the operations that are allowed on this resource.
 *
 * You almost never need to define this construct directly.
 *
 * All AWS resources that support resource policies have a method called
 * `addToResourcePolicy()`, which will automatically create a new resource
 * policy if one doesn't exist yet, otherwise it will add to the existing
 * policy.
 *
 * Prefer to use `addToResourcePolicy()` instead.
 */
class ResourcePolicy extends core_1.Resource {
    constructor(scope, id, props) {
        super(scope, id);
        /**
         * The IAM policy document for this policy.
         */
        this.document = new iam.PolicyDocument();
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_secretsmanager_ResourcePolicyProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, ResourcePolicy);
            }
            throw error;
        }
        new secretsmanager_generated_1.CfnResourcePolicy(this, 'Resource', {
            resourcePolicy: this.document,
            secretId: props.secret.secretArn,
        });
    }
}
exports.ResourcePolicy = ResourcePolicy;
_a = JSII_RTTI_SYMBOL_1;
ResourcePolicy[_a] = { fqn: "@aws-cdk/aws-secretsmanager.ResourcePolicy", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9saWN5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicG9saWN5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLHdDQUF3QztBQUN4Qyx3Q0FBeUM7QUFHekMseUVBQStEO0FBWS9EOzs7Ozs7Ozs7Ozs7O0dBYUc7QUFDSCxNQUFhLGNBQWUsU0FBUSxlQUFRO0lBTTFDLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBMEI7UUFDbEUsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztRQU5uQjs7V0FFRztRQUNhLGFBQVEsR0FBRyxJQUFJLEdBQUcsQ0FBQyxjQUFjLEVBQUUsQ0FBQzs7Ozs7OytDQUp6QyxjQUFjOzs7O1FBU3ZCLElBQUksNENBQWlCLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRTtZQUN0QyxjQUFjLEVBQUUsSUFBSSxDQUFDLFFBQVE7WUFDN0IsUUFBUSxFQUFFLEtBQUssQ0FBQyxNQUFNLENBQUMsU0FBUztTQUNqQyxDQUFDLENBQUM7S0FDSjs7QUFiSCx3Q0FjQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGlhbSBmcm9tICdAYXdzLWNkay9hd3MtaWFtJztcbmltcG9ydCB7IFJlc291cmNlIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IElTZWNyZXQgfSBmcm9tICcuL3NlY3JldCc7XG5pbXBvcnQgeyBDZm5SZXNvdXJjZVBvbGljeSB9IGZyb20gJy4vc2VjcmV0c21hbmFnZXIuZ2VuZXJhdGVkJztcblxuLyoqXG4gKiBDb25zdHJ1Y3Rpb24gcHJvcGVydGllcyBmb3IgYSBSZXNvdXJjZVBvbGljeVxuICovXG5leHBvcnQgaW50ZXJmYWNlIFJlc291cmNlUG9saWN5UHJvcHMge1xuICAvKipcbiAgICogVGhlIHNlY3JldCB0byBhdHRhY2ggYSByZXNvdXJjZS1iYXNlZCBwZXJtaXNzaW9ucyBwb2xpY3lcbiAgICovXG4gIHJlYWRvbmx5IHNlY3JldDogSVNlY3JldDtcbn1cblxuLyoqXG4gKiBSZXNvdXJjZSBQb2xpY3kgZm9yIFNlY3JldHNNYW5hZ2VyIFNlY3JldHNcbiAqXG4gKiBQb2xpY2llcyBkZWZpbmUgdGhlIG9wZXJhdGlvbnMgdGhhdCBhcmUgYWxsb3dlZCBvbiB0aGlzIHJlc291cmNlLlxuICpcbiAqIFlvdSBhbG1vc3QgbmV2ZXIgbmVlZCB0byBkZWZpbmUgdGhpcyBjb25zdHJ1Y3QgZGlyZWN0bHkuXG4gKlxuICogQWxsIEFXUyByZXNvdXJjZXMgdGhhdCBzdXBwb3J0IHJlc291cmNlIHBvbGljaWVzIGhhdmUgYSBtZXRob2QgY2FsbGVkXG4gKiBgYWRkVG9SZXNvdXJjZVBvbGljeSgpYCwgd2hpY2ggd2lsbCBhdXRvbWF0aWNhbGx5IGNyZWF0ZSBhIG5ldyByZXNvdXJjZVxuICogcG9saWN5IGlmIG9uZSBkb2Vzbid0IGV4aXN0IHlldCwgb3RoZXJ3aXNlIGl0IHdpbGwgYWRkIHRvIHRoZSBleGlzdGluZ1xuICogcG9saWN5LlxuICpcbiAqIFByZWZlciB0byB1c2UgYGFkZFRvUmVzb3VyY2VQb2xpY3koKWAgaW5zdGVhZC5cbiAqL1xuZXhwb3J0IGNsYXNzIFJlc291cmNlUG9saWN5IGV4dGVuZHMgUmVzb3VyY2Uge1xuICAvKipcbiAgICogVGhlIElBTSBwb2xpY3kgZG9jdW1lbnQgZm9yIHRoaXMgcG9saWN5LlxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IGRvY3VtZW50ID0gbmV3IGlhbS5Qb2xpY3lEb2N1bWVudCgpO1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBSZXNvdXJjZVBvbGljeVByb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkKTtcblxuICAgIG5ldyBDZm5SZXNvdXJjZVBvbGljeSh0aGlzLCAnUmVzb3VyY2UnLCB7XG4gICAgICByZXNvdXJjZVBvbGljeTogdGhpcy5kb2N1bWVudCxcbiAgICAgIHNlY3JldElkOiBwcm9wcy5zZWNyZXQuc2VjcmV0QXJuLFxuICAgIH0pO1xuICB9XG59XG4iXX0=