"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestValidator = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const core_1 = require("@aws-cdk/core");
const apigateway_generated_1 = require("./apigateway.generated");
const restapi_1 = require("./restapi");
class RequestValidator extends core_1.Resource {
    constructor(scope, id, props) {
        super(scope, id, {
            physicalName: props.requestValidatorName,
        });
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_apigateway_RequestValidatorProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, RequestValidator);
            }
            throw error;
        }
        const validatorProps = {
            name: this.physicalName,
            restApiId: props.restApi.restApiId,
            validateRequestBody: props.validateRequestBody,
            validateRequestParameters: props.validateRequestParameters,
        };
        const resource = new apigateway_generated_1.CfnRequestValidator(this, 'Resource', validatorProps);
        this.requestValidatorId = resource.ref;
        const deployment = (props.restApi instanceof restapi_1.RestApi) ? props.restApi.latestDeployment : undefined;
        if (deployment) {
            deployment.node.addDependency(resource);
            deployment.addToLogicalId({ validator: validatorProps });
        }
    }
    static fromRequestValidatorId(scope, id, requestValidatorId) {
        class Import extends core_1.Resource {
            constructor() {
                super(...arguments);
                this.requestValidatorId = requestValidatorId;
            }
        }
        return new Import(scope, id);
    }
}
exports.RequestValidator = RequestValidator;
_a = JSII_RTTI_SYMBOL_1;
RequestValidator[_a] = { fqn: "@aws-cdk/aws-apigateway.RequestValidator", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVxdWVzdHZhbGlkYXRvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInJlcXVlc3R2YWxpZGF0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsd0NBQW9EO0FBRXBELGlFQUF1RjtBQUN2Rix1Q0FBOEM7QUErQzlDLE1BQWEsZ0JBQWlCLFNBQVEsZUFBUTtJQWdCNUMsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUE0QjtRQUNwRSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRTtZQUNmLFlBQVksRUFBRSxLQUFLLENBQUMsb0JBQW9CO1NBQ3pDLENBQUMsQ0FBQzs7Ozs7OytDQW5CTSxnQkFBZ0I7Ozs7UUFxQnpCLE1BQU0sY0FBYyxHQUE2QjtZQUMvQyxJQUFJLEVBQUUsSUFBSSxDQUFDLFlBQVk7WUFDdkIsU0FBUyxFQUFFLEtBQUssQ0FBQyxPQUFPLENBQUMsU0FBUztZQUNsQyxtQkFBbUIsRUFBRSxLQUFLLENBQUMsbUJBQW1CO1lBQzlDLHlCQUF5QixFQUFFLEtBQUssQ0FBQyx5QkFBeUI7U0FDM0QsQ0FBQztRQUVGLE1BQU0sUUFBUSxHQUFHLElBQUksMENBQW1CLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRSxjQUFjLENBQUMsQ0FBQztRQUUzRSxJQUFJLENBQUMsa0JBQWtCLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQztRQUV2QyxNQUFNLFVBQVUsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLFlBQVksaUJBQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUM7UUFDbkcsSUFBSSxVQUFVLEVBQUU7WUFDZCxVQUFVLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUN4QyxVQUFVLENBQUMsY0FBYyxDQUFDLEVBQUUsU0FBUyxFQUFFLGNBQWMsRUFBRSxDQUFDLENBQUM7U0FDMUQ7S0FDRjtJQXBDTSxNQUFNLENBQUMsc0JBQXNCLENBQUMsS0FBZ0IsRUFBRSxFQUFVLEVBQUUsa0JBQTBCO1FBQzNGLE1BQU0sTUFBTyxTQUFRLGVBQVE7WUFBN0I7O2dCQUNrQix1QkFBa0IsR0FBRyxrQkFBa0IsQ0FBQztZQUMxRCxDQUFDO1NBQUE7UUFFRCxPQUFPLElBQUksTUFBTSxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztLQUM5Qjs7QUFQSCw0Q0FzQ0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJUmVzb3VyY2UsIFJlc291cmNlIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IENmblJlcXVlc3RWYWxpZGF0b3IsIENmblJlcXVlc3RWYWxpZGF0b3JQcm9wcyB9IGZyb20gJy4vYXBpZ2F0ZXdheS5nZW5lcmF0ZWQnO1xuaW1wb3J0IHsgSVJlc3RBcGksIFJlc3RBcGkgfSBmcm9tICcuL3Jlc3RhcGknO1xuXG5leHBvcnQgaW50ZXJmYWNlIElSZXF1ZXN0VmFsaWRhdG9yIGV4dGVuZHMgSVJlc291cmNlIHtcbiAgLyoqXG4gICAqIElEIG9mIHRoZSByZXF1ZXN0IHZhbGlkYXRvciwgc3VjaCBhcyBhYmMxMjNcbiAgICpcbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcmVhZG9ubHkgcmVxdWVzdFZhbGlkYXRvcklkOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUmVxdWVzdFZhbGlkYXRvck9wdGlvbnMge1xuICAvKipcbiAgICogVGhlIG5hbWUgb2YgdGhpcyByZXF1ZXN0IHZhbGlkYXRvci5cbiAgICpcbiAgICogQGRlZmF1bHQgTm9uZVxuICAgKi9cbiAgcmVhZG9ubHkgcmVxdWVzdFZhbGlkYXRvck5hbWU/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEluZGljYXRlcyB3aGV0aGVyIHRvIHZhbGlkYXRlIHRoZSByZXF1ZXN0IGJvZHkgYWNjb3JkaW5nIHRvXG4gICAqIHRoZSBjb25maWd1cmVkIHNjaGVtYSBmb3IgdGhlIHRhcmdldGVkIEFQSSBhbmQgbWV0aG9kLlxuICAgKlxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKi9cbiAgcmVhZG9ubHkgdmFsaWRhdGVSZXF1ZXN0Qm9keT86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIEluZGljYXRlcyB3aGV0aGVyIHRvIHZhbGlkYXRlIHJlcXVlc3QgcGFyYW1ldGVycy5cbiAgICpcbiAgICogQGRlZmF1bHQgZmFsc2VcbiAgICovXG4gIHJlYWRvbmx5IHZhbGlkYXRlUmVxdWVzdFBhcmFtZXRlcnM/OiBib29sZWFuO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFJlcXVlc3RWYWxpZGF0b3JQcm9wcyBleHRlbmRzIFJlcXVlc3RWYWxpZGF0b3JPcHRpb25zIHtcbiAgLyoqXG4gICAqIFRoZSByZXN0IEFQSSB0aGF0IHRoaXMgbW9kZWwgaXMgcGFydCBvZi5cbiAgICpcbiAgICogVGhlIHJlYXNvbiB3ZSBuZWVkIHRoZSBSZXN0QXBpIG9iamVjdCBpdHNlbGYgYW5kIG5vdCBqdXN0IHRoZSBJRCBpcyBiZWNhdXNlIHRoZSBtb2RlbFxuICAgKiBpcyBiZWluZyB0cmFja2VkIGJ5IHRoZSB0b3AtbGV2ZWwgUmVzdEFwaSBvYmplY3QgZm9yIHRoZSBwdXJwb3NlIG9mIGNhbGN1bGF0aW5nIGl0J3NcbiAgICogaGFzaCB0byBkZXRlcm1pbmUgdGhlIElEIG9mIHRoZSBkZXBsb3ltZW50LiBUaGlzIGFsbG93cyB1cyB0byBhdXRvbWF0aWNhbGx5IHVwZGF0ZVxuICAgKiB0aGUgZGVwbG95bWVudCB3aGVuIHRoZSBtb2RlbCBvZiB0aGUgUkVTVCBBUEkgY2hhbmdlcy5cbiAgICovXG4gIHJlYWRvbmx5IHJlc3RBcGk6IElSZXN0QXBpO1xufVxuXG5leHBvcnQgY2xhc3MgUmVxdWVzdFZhbGlkYXRvciBleHRlbmRzIFJlc291cmNlIGltcGxlbWVudHMgSVJlcXVlc3RWYWxpZGF0b3Ige1xuICBwdWJsaWMgc3RhdGljIGZyb21SZXF1ZXN0VmFsaWRhdG9ySWQoc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcmVxdWVzdFZhbGlkYXRvcklkOiBzdHJpbmcpOiBJUmVxdWVzdFZhbGlkYXRvciB7XG4gICAgY2xhc3MgSW1wb3J0IGV4dGVuZHMgUmVzb3VyY2UgaW1wbGVtZW50cyBJUmVxdWVzdFZhbGlkYXRvciB7XG4gICAgICBwdWJsaWMgcmVhZG9ubHkgcmVxdWVzdFZhbGlkYXRvcklkID0gcmVxdWVzdFZhbGlkYXRvcklkO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgSW1wb3J0KHNjb3BlLCBpZCk7XG4gIH1cblxuICAvKipcbiAgICogSUQgb2YgdGhlIHJlcXVlc3QgdmFsaWRhdG9yLCBzdWNoIGFzIGFiYzEyM1xuICAgKlxuICAgKiBAYXR0cmlidXRlXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgcmVxdWVzdFZhbGlkYXRvcklkOiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IFJlcXVlc3RWYWxpZGF0b3JQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwge1xuICAgICAgcGh5c2ljYWxOYW1lOiBwcm9wcy5yZXF1ZXN0VmFsaWRhdG9yTmFtZSxcbiAgICB9KTtcblxuICAgIGNvbnN0IHZhbGlkYXRvclByb3BzOiBDZm5SZXF1ZXN0VmFsaWRhdG9yUHJvcHMgPSB7XG4gICAgICBuYW1lOiB0aGlzLnBoeXNpY2FsTmFtZSxcbiAgICAgIHJlc3RBcGlJZDogcHJvcHMucmVzdEFwaS5yZXN0QXBpSWQsXG4gICAgICB2YWxpZGF0ZVJlcXVlc3RCb2R5OiBwcm9wcy52YWxpZGF0ZVJlcXVlc3RCb2R5LFxuICAgICAgdmFsaWRhdGVSZXF1ZXN0UGFyYW1ldGVyczogcHJvcHMudmFsaWRhdGVSZXF1ZXN0UGFyYW1ldGVycyxcbiAgICB9O1xuXG4gICAgY29uc3QgcmVzb3VyY2UgPSBuZXcgQ2ZuUmVxdWVzdFZhbGlkYXRvcih0aGlzLCAnUmVzb3VyY2UnLCB2YWxpZGF0b3JQcm9wcyk7XG5cbiAgICB0aGlzLnJlcXVlc3RWYWxpZGF0b3JJZCA9IHJlc291cmNlLnJlZjtcblxuICAgIGNvbnN0IGRlcGxveW1lbnQgPSAocHJvcHMucmVzdEFwaSBpbnN0YW5jZW9mIFJlc3RBcGkpID8gcHJvcHMucmVzdEFwaS5sYXRlc3REZXBsb3ltZW50IDogdW5kZWZpbmVkO1xuICAgIGlmIChkZXBsb3ltZW50KSB7XG4gICAgICBkZXBsb3ltZW50Lm5vZGUuYWRkRGVwZW5kZW5jeShyZXNvdXJjZSk7XG4gICAgICBkZXBsb3ltZW50LmFkZFRvTG9naWNhbElkKHsgdmFsaWRhdG9yOiB2YWxpZGF0b3JQcm9wcyB9KTtcbiAgICB9XG4gIH1cbn0iXX0=