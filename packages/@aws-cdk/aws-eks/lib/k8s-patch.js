"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.KubernetesPatch = exports.PatchType = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const core_1 = require("@aws-cdk/core");
const constructs_1 = require("constructs");
const kubectl_provider_1 = require("./kubectl-provider");
/**
 * Values for `kubectl patch` --type argument
 */
var PatchType;
(function (PatchType) {
    /**
     * JSON Patch, RFC 6902
     */
    PatchType["JSON"] = "json";
    /**
     * JSON Merge patch
     */
    PatchType["MERGE"] = "merge";
    /**
     * Strategic merge patch
     */
    PatchType["STRATEGIC"] = "strategic";
})(PatchType = exports.PatchType || (exports.PatchType = {}));
/**
 * A CloudFormation resource which applies/restores a JSON patch into a
 * Kubernetes resource.
 * @see https://kubernetes.io/docs/tasks/run-application/update-api-object-kubectl-patch/
 */
class KubernetesPatch extends constructs_1.Construct {
    constructor(scope, id, props) {
        super(scope, id);
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_eks_KubernetesPatchProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, KubernetesPatch);
            }
            throw error;
        }
        const stack = core_1.Stack.of(this);
        const provider = kubectl_provider_1.KubectlProvider.getOrCreate(this, props.cluster);
        new core_1.CustomResource(this, 'Resource', {
            serviceToken: provider.serviceToken,
            resourceType: 'Custom::AWSCDK-EKS-KubernetesPatch',
            properties: {
                ResourceName: props.resourceName,
                ResourceNamespace: props.resourceNamespace ?? 'default',
                ApplyPatchJson: stack.toJsonString(props.applyPatch),
                RestorePatchJson: stack.toJsonString(props.restorePatch),
                ClusterName: props.cluster.clusterName,
                RoleArn: provider.roleArn,
                PatchType: props.patchType ?? PatchType.STRATEGIC,
            },
        });
    }
}
exports.KubernetesPatch = KubernetesPatch;
_a = JSII_RTTI_SYMBOL_1;
KubernetesPatch[_a] = { fqn: "@aws-cdk/aws-eks.KubernetesPatch", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiazhzLXBhdGNoLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiazhzLXBhdGNoLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLHdDQUFzRDtBQUN0RCwyQ0FBdUM7QUFFdkMseURBQXFEO0FBMkNyRDs7R0FFRztBQUNILElBQVksU0FhWDtBQWJELFdBQVksU0FBUztJQUNuQjs7T0FFRztJQUNILDBCQUFhLENBQUE7SUFDYjs7T0FFRztJQUNILDRCQUFlLENBQUE7SUFDZjs7T0FFRztJQUNILG9DQUF1QixDQUFBO0FBQ3pCLENBQUMsRUFiVyxTQUFTLEdBQVQsaUJBQVMsS0FBVCxpQkFBUyxRQWFwQjtBQUVEOzs7O0dBSUc7QUFDSCxNQUFhLGVBQWdCLFNBQVEsc0JBQVM7SUFDNUMsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUEyQjtRQUNuRSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDOzs7Ozs7K0NBRlIsZUFBZTs7OztRQUl4QixNQUFNLEtBQUssR0FBRyxZQUFLLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzdCLE1BQU0sUUFBUSxHQUFHLGtDQUFlLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFbEUsSUFBSSxxQkFBYyxDQUFDLElBQUksRUFBRSxVQUFVLEVBQUU7WUFDbkMsWUFBWSxFQUFFLFFBQVEsQ0FBQyxZQUFZO1lBQ25DLFlBQVksRUFBRSxvQ0FBb0M7WUFDbEQsVUFBVSxFQUFFO2dCQUNWLFlBQVksRUFBRSxLQUFLLENBQUMsWUFBWTtnQkFDaEMsaUJBQWlCLEVBQUUsS0FBSyxDQUFDLGlCQUFpQixJQUFJLFNBQVM7Z0JBQ3ZELGNBQWMsRUFBRSxLQUFLLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUM7Z0JBQ3BELGdCQUFnQixFQUFFLEtBQUssQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQztnQkFDeEQsV0FBVyxFQUFFLEtBQUssQ0FBQyxPQUFPLENBQUMsV0FBVztnQkFDdEMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxPQUFPO2dCQUN6QixTQUFTLEVBQUUsS0FBSyxDQUFDLFNBQVMsSUFBSSxTQUFTLENBQUMsU0FBUzthQUNsRDtTQUNGLENBQUMsQ0FBQztLQUNKOztBQXBCSCwwQ0FxQkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDdXN0b21SZXNvdXJjZSwgU3RhY2sgfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgSUNsdXN0ZXIgfSBmcm9tICcuL2NsdXN0ZXInO1xuaW1wb3J0IHsgS3ViZWN0bFByb3ZpZGVyIH0gZnJvbSAnLi9rdWJlY3RsLXByb3ZpZGVyJztcblxuLyoqXG4gKiBQcm9wZXJ0aWVzIGZvciBLdWJlcm5ldGVzUGF0Y2hcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBLdWJlcm5ldGVzUGF0Y2hQcm9wcyB7XG4gIC8qKlxuICAgKiBUaGUgY2x1c3RlciB0byBhcHBseSB0aGUgcGF0Y2ggdG8uXG4gICAqIFtkaXNhYmxlLWF3c2xpbnQ6cmVmLXZpYS1pbnRlcmZhY2VdXG4gICAqL1xuICByZWFkb25seSBjbHVzdGVyOiBJQ2x1c3RlcjtcblxuICAvKipcbiAgICogVGhlIEpTT04gb2JqZWN0IHRvIHBhc3MgdG8gYGt1YmVjdGwgcGF0Y2hgIHdoZW4gdGhlIHJlc291cmNlIGlzIGNyZWF0ZWQvdXBkYXRlZC5cbiAgICovXG4gIHJlYWRvbmx5IGFwcGx5UGF0Y2g6IHsgW2tleTogc3RyaW5nXTogYW55IH07XG5cbiAgLyoqXG4gICAqIFRoZSBKU09OIG9iamVjdCB0byBwYXNzIHRvIGBrdWJlY3RsIHBhdGNoYCB3aGVuIHRoZSByZXNvdXJjZSBpcyByZW1vdmVkLlxuICAgKi9cbiAgcmVhZG9ubHkgcmVzdG9yZVBhdGNoOiB7IFtrZXk6IHN0cmluZ106IGFueSB9O1xuXG4gIC8qKlxuICAgKiBUaGUgZnVsbCBuYW1lIG9mIHRoZSByZXNvdXJjZSB0byBwYXRjaCAoZS5nLiBgZGVwbG95bWVudC9jb3JlZG5zYCkuXG4gICAqL1xuICByZWFkb25seSByZXNvdXJjZU5hbWU6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIGt1YmVybmV0ZXMgQVBJIG5hbWVzcGFjZVxuICAgKlxuICAgKiBAZGVmYXVsdCBcImRlZmF1bHRcIlxuICAgKi9cbiAgcmVhZG9ubHkgcmVzb3VyY2VOYW1lc3BhY2U/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBwYXRjaCB0eXBlIHRvIHBhc3MgdG8gYGt1YmVjdGwgcGF0Y2hgLlxuICAgKiBUaGUgZGVmYXVsdCB0eXBlIHVzZWQgYnkgYGt1YmVjdGwgcGF0Y2hgIGlzIFwic3RyYXRlZ2ljXCIuXG4gICAqXG4gICAqIEBkZWZhdWx0IFBhdGNoVHlwZS5TVFJBVEVHSUNcbiAgICovXG4gIHJlYWRvbmx5IHBhdGNoVHlwZT86IFBhdGNoVHlwZTtcbn1cblxuLyoqXG4gKiBWYWx1ZXMgZm9yIGBrdWJlY3RsIHBhdGNoYCAtLXR5cGUgYXJndW1lbnRcbiAqL1xuZXhwb3J0IGVudW0gUGF0Y2hUeXBlIHtcbiAgLyoqXG4gICAqIEpTT04gUGF0Y2gsIFJGQyA2OTAyXG4gICAqL1xuICBKU09OID0gJ2pzb24nLFxuICAvKipcbiAgICogSlNPTiBNZXJnZSBwYXRjaFxuICAgKi9cbiAgTUVSR0UgPSAnbWVyZ2UnLFxuICAvKipcbiAgICogU3RyYXRlZ2ljIG1lcmdlIHBhdGNoXG4gICAqL1xuICBTVFJBVEVHSUMgPSAnc3RyYXRlZ2ljJ1xufVxuXG4vKipcbiAqIEEgQ2xvdWRGb3JtYXRpb24gcmVzb3VyY2Ugd2hpY2ggYXBwbGllcy9yZXN0b3JlcyBhIEpTT04gcGF0Y2ggaW50byBhXG4gKiBLdWJlcm5ldGVzIHJlc291cmNlLlxuICogQHNlZSBodHRwczovL2t1YmVybmV0ZXMuaW8vZG9jcy90YXNrcy9ydW4tYXBwbGljYXRpb24vdXBkYXRlLWFwaS1vYmplY3Qta3ViZWN0bC1wYXRjaC9cbiAqL1xuZXhwb3J0IGNsYXNzIEt1YmVybmV0ZXNQYXRjaCBleHRlbmRzIENvbnN0cnVjdCB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBLdWJlcm5ldGVzUGF0Y2hQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG5cbiAgICBjb25zdCBzdGFjayA9IFN0YWNrLm9mKHRoaXMpO1xuICAgIGNvbnN0IHByb3ZpZGVyID0gS3ViZWN0bFByb3ZpZGVyLmdldE9yQ3JlYXRlKHRoaXMsIHByb3BzLmNsdXN0ZXIpO1xuXG4gICAgbmV3IEN1c3RvbVJlc291cmNlKHRoaXMsICdSZXNvdXJjZScsIHtcbiAgICAgIHNlcnZpY2VUb2tlbjogcHJvdmlkZXIuc2VydmljZVRva2VuLFxuICAgICAgcmVzb3VyY2VUeXBlOiAnQ3VzdG9tOjpBV1NDREstRUtTLUt1YmVybmV0ZXNQYXRjaCcsXG4gICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIFJlc291cmNlTmFtZTogcHJvcHMucmVzb3VyY2VOYW1lLFxuICAgICAgICBSZXNvdXJjZU5hbWVzcGFjZTogcHJvcHMucmVzb3VyY2VOYW1lc3BhY2UgPz8gJ2RlZmF1bHQnLFxuICAgICAgICBBcHBseVBhdGNoSnNvbjogc3RhY2sudG9Kc29uU3RyaW5nKHByb3BzLmFwcGx5UGF0Y2gpLFxuICAgICAgICBSZXN0b3JlUGF0Y2hKc29uOiBzdGFjay50b0pzb25TdHJpbmcocHJvcHMucmVzdG9yZVBhdGNoKSxcbiAgICAgICAgQ2x1c3Rlck5hbWU6IHByb3BzLmNsdXN0ZXIuY2x1c3Rlck5hbWUsXG4gICAgICAgIFJvbGVBcm46IHByb3ZpZGVyLnJvbGVBcm4sIC8vIFRPRE86IGJha2UgaW50byBwcm92aWRlcidzIGVudmlyb25tZW50XG4gICAgICAgIFBhdGNoVHlwZTogcHJvcHMucGF0Y2hUeXBlID8/IFBhdGNoVHlwZS5TVFJBVEVHSUMsXG4gICAgICB9LFxuICAgIH0pO1xuICB9XG59XG4iXX0=