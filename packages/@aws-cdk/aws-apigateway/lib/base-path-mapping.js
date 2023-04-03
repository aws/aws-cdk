"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasePathMapping = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const core_1 = require("@aws-cdk/core");
const apigateway_generated_1 = require("./apigateway.generated");
const restapi_1 = require("./restapi");
/**
 * This resource creates a base path that clients who call your API must use in
 * the invocation URL.
 *
 * Unless you're importing a domain with `DomainName.fromDomainNameAttributes()`,
 * you can use `DomainName.addBasePathMapping()` to define mappings.
 */
class BasePathMapping extends core_1.Resource {
    constructor(scope, id, props) {
        super(scope, id);
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_apigateway_BasePathMappingProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, BasePathMapping);
            }
            throw error;
        }
        if (props.basePath && !core_1.Token.isUnresolved(props.basePath)) {
            if (props.basePath.startsWith('/') || props.basePath.endsWith('/')) {
                throw new Error(`A base path cannot start or end with /", received: ${props.basePath}`);
            }
            if (props.basePath.match(/\/{2,}/)) {
                throw new Error(`A base path cannot have more than one consecutive /", received: ${props.basePath}`);
            }
            if (!props.basePath.match(/^[a-zA-Z0-9$_.+!*'()-/]+$/)) {
                throw new Error(`A base path may only contain letters, numbers, and one of "$-_.+!*'()/", received: ${props.basePath}`);
            }
        }
        const attachToStage = props.attachToStage ?? true;
        // if restApi is an owned API and it has a deployment stage, map all requests
        // to that stage. otherwise, the stage will have to be specified in the URL.
        // if props.attachToStage is false, then do not attach to the stage.
        const stage = props.stage ?? (props.restApi instanceof restapi_1.RestApiBase && attachToStage
            ? props.restApi.deploymentStage
            : undefined);
        new apigateway_generated_1.CfnBasePathMapping(this, 'Resource', {
            basePath: props.basePath,
            domainName: props.domainName.domainName,
            restApiId: props.restApi.restApiId,
            stage: stage?.stageName,
        });
    }
}
exports.BasePathMapping = BasePathMapping;
_a = JSII_RTTI_SYMBOL_1;
BasePathMapping[_a] = { fqn: "@aws-cdk/aws-apigateway.BasePathMapping", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZS1wYXRoLW1hcHBpbmcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJiYXNlLXBhdGgtbWFwcGluZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSx3Q0FBZ0Q7QUFFaEQsaUVBQTREO0FBRTVELHVDQUFrRDtBQTBDbEQ7Ozs7OztHQU1HO0FBQ0gsTUFBYSxlQUFnQixTQUFRLGVBQVE7SUFDM0MsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUEyQjtRQUNuRSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDOzs7Ozs7K0NBRlIsZUFBZTs7OztRQUl4QixJQUFJLEtBQUssQ0FBQyxRQUFRLElBQUksQ0FBQyxZQUFLLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsRUFBRTtZQUN6RCxJQUFJLEtBQUssQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEtBQUssQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxFQUFFO2dCQUNsRSxNQUFNLElBQUksS0FBSyxDQUFDLHNEQUFzRCxLQUFLLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQzthQUN6RjtZQUNELElBQUksS0FBSyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEVBQUU7Z0JBQ2xDLE1BQU0sSUFBSSxLQUFLLENBQUMsbUVBQW1FLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO2FBQ3RHO1lBQ0QsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLDJCQUEyQixDQUFDLEVBQUU7Z0JBQ3RELE1BQU0sSUFBSSxLQUFLLENBQUMsc0ZBQXNGLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO2FBQ3pIO1NBQ0Y7UUFFRCxNQUFNLGFBQWEsR0FBRyxLQUFLLENBQUMsYUFBYSxJQUFJLElBQUksQ0FBQztRQUVsRCw2RUFBNkU7UUFDN0UsNEVBQTRFO1FBQzVFLG9FQUFvRTtRQUNwRSxNQUFNLEtBQUssR0FBRyxLQUFLLENBQUMsS0FBSyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sWUFBWSxxQkFBVyxJQUFJLGFBQWE7WUFDakYsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsZUFBZTtZQUMvQixDQUFDLENBQUMsU0FBUyxDQUFDLENBQUM7UUFFZixJQUFJLHlDQUFrQixDQUFDLElBQUksRUFBRSxVQUFVLEVBQUU7WUFDdkMsUUFBUSxFQUFFLEtBQUssQ0FBQyxRQUFRO1lBQ3hCLFVBQVUsRUFBRSxLQUFLLENBQUMsVUFBVSxDQUFDLFVBQVU7WUFDdkMsU0FBUyxFQUFFLEtBQUssQ0FBQyxPQUFPLENBQUMsU0FBUztZQUNsQyxLQUFLLEVBQUUsS0FBSyxFQUFFLFNBQVM7U0FDeEIsQ0FBQyxDQUFDO0tBQ0o7O0FBL0JILDBDQWdDQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFJlc291cmNlLCBUb2tlbiB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBDZm5CYXNlUGF0aE1hcHBpbmcgfSBmcm9tICcuL2FwaWdhdGV3YXkuZ2VuZXJhdGVkJztcbmltcG9ydCB7IElEb21haW5OYW1lIH0gZnJvbSAnLi9kb21haW4tbmFtZSc7XG5pbXBvcnQgeyBJUmVzdEFwaSwgUmVzdEFwaUJhc2UgfSBmcm9tICcuL3Jlc3RhcGknO1xuaW1wb3J0IHsgU3RhZ2UgfSBmcm9tICcuL3N0YWdlJztcblxuZXhwb3J0IGludGVyZmFjZSBCYXNlUGF0aE1hcHBpbmdPcHRpb25zIHtcbiAgLyoqXG4gICAqIFRoZSBiYXNlIHBhdGggbmFtZSB0aGF0IGNhbGxlcnMgb2YgdGhlIEFQSSBtdXN0IHByb3ZpZGUgaW4gdGhlIFVSTCBhZnRlclxuICAgKiB0aGUgZG9tYWluIG5hbWUgKGUuZy4gYGV4YW1wbGUuY29tL2Jhc2UtcGF0aGApLiBJZiB5b3Ugc3BlY2lmeSB0aGlzXG4gICAqIHByb3BlcnR5LCBpdCBjYW4ndCBiZSBhbiBlbXB0eSBzdHJpbmcuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gbWFwIHJlcXVlc3RzIGZyb20gdGhlIGRvbWFpbiByb290IChlLmcuIGBleGFtcGxlLmNvbWApLiBJZiB0aGlzXG4gICAqIGlzIHVuZGVmaW5lZCwgbm8gYWRkaXRpb25hbCBtYXBwaW5ncyB3aWxsIGJlIGFsbG93ZWQgb24gdGhpcyBkb21haW4gbmFtZS5cbiAgICovXG4gIHJlYWRvbmx5IGJhc2VQYXRoPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgRGVwbG95bWVudCBzdGFnZSBvZiBBUElcbiAgICogW2Rpc2FibGUtYXdzbGludDpyZWYtdmlhLWludGVyZmFjZV1cbiAgICogQGRlZmF1bHQgLSBtYXAgdG8gZGVwbG95bWVudFN0YWdlIG9mIHJlc3RBcGkgb3RoZXJ3aXNlIHN0YWdlIG5lZWRzIHRvIHBhc3MgaW4gVVJMXG4gICAqL1xuICByZWFkb25seSBzdGFnZT86IFN0YWdlO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRvIGF0dGFjaCB0aGUgYmFzZSBwYXRoIG1hcHBpbmcgdG8gYSBzdGFnZS5cbiAgICogVXNlIHRoaXMgcHJvcGVydHkgdG8gY3JlYXRlIGEgYmFzZSBwYXRoIG1hcHBpbmcgd2l0aG91dCBhdHRhY2hpbmcgaXQgdG8gdGhlIFJlc3QgQVBJIGRlZmF1bHQgc3RhZ2UuXG4gICAqIFRoaXMgcHJvcGVydHkgaXMgaWdub3JlZCBpZiBgc3RhZ2VgIGlzIHByb3ZpZGVkLlxuICAgKiBAZGVmYXVsdCAtIHRydWVcbiAgICovXG4gIHJlYWRvbmx5IGF0dGFjaFRvU3RhZ2U/OiBib29sZWFuO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEJhc2VQYXRoTWFwcGluZ1Byb3BzIGV4dGVuZHMgQmFzZVBhdGhNYXBwaW5nT3B0aW9ucyB7XG4gIC8qKlxuICAgKiBUaGUgRG9tYWluTmFtZSB0byBhc3NvY2lhdGUgd2l0aCB0aGlzIGJhc2UgcGF0aCBtYXBwaW5nLlxuICAgKi9cbiAgcmVhZG9ubHkgZG9tYWluTmFtZTogSURvbWFpbk5hbWU7XG5cbiAgLyoqXG4gICAqIFRoZSBSZXN0QXBpIHJlc291cmNlIHRvIHRhcmdldC5cbiAgICovXG4gIHJlYWRvbmx5IHJlc3RBcGk6IElSZXN0QXBpO1xufVxuXG4vKipcbiAqIFRoaXMgcmVzb3VyY2UgY3JlYXRlcyBhIGJhc2UgcGF0aCB0aGF0IGNsaWVudHMgd2hvIGNhbGwgeW91ciBBUEkgbXVzdCB1c2UgaW5cbiAqIHRoZSBpbnZvY2F0aW9uIFVSTC5cbiAqXG4gKiBVbmxlc3MgeW91J3JlIGltcG9ydGluZyBhIGRvbWFpbiB3aXRoIGBEb21haW5OYW1lLmZyb21Eb21haW5OYW1lQXR0cmlidXRlcygpYCxcbiAqIHlvdSBjYW4gdXNlIGBEb21haW5OYW1lLmFkZEJhc2VQYXRoTWFwcGluZygpYCB0byBkZWZpbmUgbWFwcGluZ3MuXG4gKi9cbmV4cG9ydCBjbGFzcyBCYXNlUGF0aE1hcHBpbmcgZXh0ZW5kcyBSZXNvdXJjZSB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBCYXNlUGF0aE1hcHBpbmdQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG5cbiAgICBpZiAocHJvcHMuYmFzZVBhdGggJiYgIVRva2VuLmlzVW5yZXNvbHZlZChwcm9wcy5iYXNlUGF0aCkpIHtcbiAgICAgIGlmIChwcm9wcy5iYXNlUGF0aC5zdGFydHNXaXRoKCcvJykgfHwgcHJvcHMuYmFzZVBhdGguZW5kc1dpdGgoJy8nKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEEgYmFzZSBwYXRoIGNhbm5vdCBzdGFydCBvciBlbmQgd2l0aCAvXCIsIHJlY2VpdmVkOiAke3Byb3BzLmJhc2VQYXRofWApO1xuICAgICAgfVxuICAgICAgaWYgKHByb3BzLmJhc2VQYXRoLm1hdGNoKC9cXC97Mix9LykpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBBIGJhc2UgcGF0aCBjYW5ub3QgaGF2ZSBtb3JlIHRoYW4gb25lIGNvbnNlY3V0aXZlIC9cIiwgcmVjZWl2ZWQ6ICR7cHJvcHMuYmFzZVBhdGh9YCk7XG4gICAgICB9XG4gICAgICBpZiAoIXByb3BzLmJhc2VQYXRoLm1hdGNoKC9eW2EtekEtWjAtOSRfLishKicoKS0vXSskLykpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBBIGJhc2UgcGF0aCBtYXkgb25seSBjb250YWluIGxldHRlcnMsIG51bWJlcnMsIGFuZCBvbmUgb2YgXCIkLV8uKyEqJygpL1wiLCByZWNlaXZlZDogJHtwcm9wcy5iYXNlUGF0aH1gKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBhdHRhY2hUb1N0YWdlID0gcHJvcHMuYXR0YWNoVG9TdGFnZSA/PyB0cnVlO1xuXG4gICAgLy8gaWYgcmVzdEFwaSBpcyBhbiBvd25lZCBBUEkgYW5kIGl0IGhhcyBhIGRlcGxveW1lbnQgc3RhZ2UsIG1hcCBhbGwgcmVxdWVzdHNcbiAgICAvLyB0byB0aGF0IHN0YWdlLiBvdGhlcndpc2UsIHRoZSBzdGFnZSB3aWxsIGhhdmUgdG8gYmUgc3BlY2lmaWVkIGluIHRoZSBVUkwuXG4gICAgLy8gaWYgcHJvcHMuYXR0YWNoVG9TdGFnZSBpcyBmYWxzZSwgdGhlbiBkbyBub3QgYXR0YWNoIHRvIHRoZSBzdGFnZS5cbiAgICBjb25zdCBzdGFnZSA9IHByb3BzLnN0YWdlID8/IChwcm9wcy5yZXN0QXBpIGluc3RhbmNlb2YgUmVzdEFwaUJhc2UgJiYgYXR0YWNoVG9TdGFnZVxuICAgICAgPyBwcm9wcy5yZXN0QXBpLmRlcGxveW1lbnRTdGFnZVxuICAgICAgOiB1bmRlZmluZWQpO1xuXG4gICAgbmV3IENmbkJhc2VQYXRoTWFwcGluZyh0aGlzLCAnUmVzb3VyY2UnLCB7XG4gICAgICBiYXNlUGF0aDogcHJvcHMuYmFzZVBhdGgsXG4gICAgICBkb21haW5OYW1lOiBwcm9wcy5kb21haW5OYW1lLmRvbWFpbk5hbWUsXG4gICAgICByZXN0QXBpSWQ6IHByb3BzLnJlc3RBcGkucmVzdEFwaUlkLFxuICAgICAgc3RhZ2U6IHN0YWdlPy5zdGFnZU5hbWUsXG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==