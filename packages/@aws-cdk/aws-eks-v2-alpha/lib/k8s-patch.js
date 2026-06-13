"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KubernetesPatch = exports.PatchType = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const core_1 = require("aws-cdk-lib/core");
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
})(PatchType || (exports.PatchType = PatchType = {}));
/**
 * A CloudFormation resource which applies/restores a JSON patch into a
 * Kubernetes resource.
 * @see https://kubernetes.io/docs/tasks/run-application/update-api-object-kubectl-patch/
 */
class KubernetesPatch extends constructs_1.Construct {
    static [JSII_RTTI_SYMBOL_1] = { fqn: "@aws-cdk/aws-eks-v2-alpha.KubernetesPatch", version: "0.0.0" };
    constructor(scope, id, props) {
        super(scope, id);
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_eks_v2_alpha_KubernetesPatchProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, KubernetesPatch);
            }
            throw error;
        }
        const stack = core_1.Stack.of(this);
        const provider = kubectl_provider_1.KubectlProvider.getKubectlProvider(this, props.cluster);
        if (!provider) {
            throw new Error('Kubectl Provider is not defined in this cluster. Define it when creating the cluster');
        }
        new core_1.CustomResource(this, 'Resource', {
            serviceToken: provider.serviceToken,
            resourceType: 'Custom::AWSCDK-EKS-KubernetesPatch',
            properties: {
                ResourceName: props.resourceName,
                ResourceNamespace: props.resourceNamespace ?? 'default',
                ApplyPatchJson: stack.toJsonString(props.applyPatch),
                RestorePatchJson: stack.toJsonString(props.restorePatch),
                ClusterName: props.cluster.clusterName,
                PatchType: props.patchType ?? PatchType.STRATEGIC,
            },
        });
    }
}
exports.KubernetesPatch = KubernetesPatch;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiazhzLXBhdGNoLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiazhzLXBhdGNoLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsMkNBQXlEO0FBQ3pELDJDQUF1QztBQUV2Qyx5REFBcUQ7QUEyQ3JEOztHQUVHO0FBQ0gsSUFBWSxTQWFYO0FBYkQsV0FBWSxTQUFTO0lBQ25COztPQUVHO0lBQ0gsMEJBQWEsQ0FBQTtJQUNiOztPQUVHO0lBQ0gsNEJBQWUsQ0FBQTtJQUNmOztPQUVHO0lBQ0gsb0NBQXVCLENBQUE7QUFDekIsQ0FBQyxFQWJXLFNBQVMseUJBQVQsU0FBUyxRQWFwQjtBQUVEOzs7O0dBSUc7QUFDSCxNQUFhLGVBQWdCLFNBQVEsc0JBQVM7O0lBQzVDLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBMkI7UUFDbkUsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQzs7Ozs7OytDQUZSLGVBQWU7Ozs7UUFJeEIsTUFBTSxLQUFLLEdBQUcsWUFBSyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUU3QixNQUFNLFFBQVEsR0FBRyxrQ0FBZSxDQUFDLGtCQUFrQixDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDekUsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ2QsTUFBTSxJQUFJLEtBQUssQ0FBQyxzRkFBc0YsQ0FBQyxDQUFDO1FBQzFHLENBQUM7UUFFRCxJQUFJLHFCQUFjLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRTtZQUNuQyxZQUFZLEVBQUUsUUFBUSxDQUFDLFlBQVk7WUFDbkMsWUFBWSxFQUFFLG9DQUFvQztZQUNsRCxVQUFVLEVBQUU7Z0JBQ1YsWUFBWSxFQUFFLEtBQUssQ0FBQyxZQUFZO2dCQUNoQyxpQkFBaUIsRUFBRSxLQUFLLENBQUMsaUJBQWlCLElBQUksU0FBUztnQkFDdkQsY0FBYyxFQUFFLEtBQUssQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQztnQkFDcEQsZ0JBQWdCLEVBQUUsS0FBSyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDO2dCQUN4RCxXQUFXLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxXQUFXO2dCQUN0QyxTQUFTLEVBQUUsS0FBSyxDQUFDLFNBQVMsSUFBSSxTQUFTLENBQUMsU0FBUzthQUNsRDtTQUNGLENBQUMsQ0FBQztLQUNKOztBQXZCSCwwQ0F3QkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDdXN0b21SZXNvdXJjZSwgU3RhY2sgfSBmcm9tICdhd3MtY2RrLWxpYi9jb3JlJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgSUNsdXN0ZXIgfSBmcm9tICcuL2NsdXN0ZXInO1xuaW1wb3J0IHsgS3ViZWN0bFByb3ZpZGVyIH0gZnJvbSAnLi9rdWJlY3RsLXByb3ZpZGVyJztcblxuLyoqXG4gKiBQcm9wZXJ0aWVzIGZvciBLdWJlcm5ldGVzUGF0Y2hcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBLdWJlcm5ldGVzUGF0Y2hQcm9wcyB7XG4gIC8qKlxuICAgKiBUaGUgY2x1c3RlciB0byBhcHBseSB0aGUgcGF0Y2ggdG8uXG4gICAqIFtkaXNhYmxlLWF3c2xpbnQ6cmVmLXZpYS1pbnRlcmZhY2VdXG4gICAqL1xuICByZWFkb25seSBjbHVzdGVyOiBJQ2x1c3RlcjtcblxuICAvKipcbiAgICogVGhlIEpTT04gb2JqZWN0IHRvIHBhc3MgdG8gYGt1YmVjdGwgcGF0Y2hgIHdoZW4gdGhlIHJlc291cmNlIGlzIGNyZWF0ZWQvdXBkYXRlZC5cbiAgICovXG4gIHJlYWRvbmx5IGFwcGx5UGF0Y2g6IHsgW2tleTogc3RyaW5nXTogYW55IH07XG5cbiAgLyoqXG4gICAqIFRoZSBKU09OIG9iamVjdCB0byBwYXNzIHRvIGBrdWJlY3RsIHBhdGNoYCB3aGVuIHRoZSByZXNvdXJjZSBpcyByZW1vdmVkLlxuICAgKi9cbiAgcmVhZG9ubHkgcmVzdG9yZVBhdGNoOiB7IFtrZXk6IHN0cmluZ106IGFueSB9O1xuXG4gIC8qKlxuICAgKiBUaGUgZnVsbCBuYW1lIG9mIHRoZSByZXNvdXJjZSB0byBwYXRjaCAoZS5nLiBgZGVwbG95bWVudC9jb3JlZG5zYCkuXG4gICAqL1xuICByZWFkb25seSByZXNvdXJjZU5hbWU6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIGt1YmVybmV0ZXMgQVBJIG5hbWVzcGFjZVxuICAgKlxuICAgKiBAZGVmYXVsdCBcImRlZmF1bHRcIlxuICAgKi9cbiAgcmVhZG9ubHkgcmVzb3VyY2VOYW1lc3BhY2U/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBwYXRjaCB0eXBlIHRvIHBhc3MgdG8gYGt1YmVjdGwgcGF0Y2hgLlxuICAgKiBUaGUgZGVmYXVsdCB0eXBlIHVzZWQgYnkgYGt1YmVjdGwgcGF0Y2hgIGlzIFwic3RyYXRlZ2ljXCIuXG4gICAqXG4gICAqIEBkZWZhdWx0IFBhdGNoVHlwZS5TVFJBVEVHSUNcbiAgICovXG4gIHJlYWRvbmx5IHBhdGNoVHlwZT86IFBhdGNoVHlwZTtcbn1cblxuLyoqXG4gKiBWYWx1ZXMgZm9yIGBrdWJlY3RsIHBhdGNoYCAtLXR5cGUgYXJndW1lbnRcbiAqL1xuZXhwb3J0IGVudW0gUGF0Y2hUeXBlIHtcbiAgLyoqXG4gICAqIEpTT04gUGF0Y2gsIFJGQyA2OTAyXG4gICAqL1xuICBKU09OID0gJ2pzb24nLFxuICAvKipcbiAgICogSlNPTiBNZXJnZSBwYXRjaFxuICAgKi9cbiAgTUVSR0UgPSAnbWVyZ2UnLFxuICAvKipcbiAgICogU3RyYXRlZ2ljIG1lcmdlIHBhdGNoXG4gICAqL1xuICBTVFJBVEVHSUMgPSAnc3RyYXRlZ2ljJyxcbn1cblxuLyoqXG4gKiBBIENsb3VkRm9ybWF0aW9uIHJlc291cmNlIHdoaWNoIGFwcGxpZXMvcmVzdG9yZXMgYSBKU09OIHBhdGNoIGludG8gYVxuICogS3ViZXJuZXRlcyByZXNvdXJjZS5cbiAqIEBzZWUgaHR0cHM6Ly9rdWJlcm5ldGVzLmlvL2RvY3MvdGFza3MvcnVuLWFwcGxpY2F0aW9uL3VwZGF0ZS1hcGktb2JqZWN0LWt1YmVjdGwtcGF0Y2gvXG4gKi9cbmV4cG9ydCBjbGFzcyBLdWJlcm5ldGVzUGF0Y2ggZXh0ZW5kcyBDb25zdHJ1Y3Qge1xuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogS3ViZXJuZXRlc1BhdGNoUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQpO1xuXG4gICAgY29uc3Qgc3RhY2sgPSBTdGFjay5vZih0aGlzKTtcblxuICAgIGNvbnN0IHByb3ZpZGVyID0gS3ViZWN0bFByb3ZpZGVyLmdldEt1YmVjdGxQcm92aWRlcih0aGlzLCBwcm9wcy5jbHVzdGVyKTtcbiAgICBpZiAoIXByb3ZpZGVyKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0t1YmVjdGwgUHJvdmlkZXIgaXMgbm90IGRlZmluZWQgaW4gdGhpcyBjbHVzdGVyLiBEZWZpbmUgaXQgd2hlbiBjcmVhdGluZyB0aGUgY2x1c3RlcicpO1xuICAgIH1cblxuICAgIG5ldyBDdXN0b21SZXNvdXJjZSh0aGlzLCAnUmVzb3VyY2UnLCB7XG4gICAgICBzZXJ2aWNlVG9rZW46IHByb3ZpZGVyLnNlcnZpY2VUb2tlbixcbiAgICAgIHJlc291cmNlVHlwZTogJ0N1c3RvbTo6QVdTQ0RLLUVLUy1LdWJlcm5ldGVzUGF0Y2gnLFxuICAgICAgcHJvcGVydGllczoge1xuICAgICAgICBSZXNvdXJjZU5hbWU6IHByb3BzLnJlc291cmNlTmFtZSxcbiAgICAgICAgUmVzb3VyY2VOYW1lc3BhY2U6IHByb3BzLnJlc291cmNlTmFtZXNwYWNlID8/ICdkZWZhdWx0JyxcbiAgICAgICAgQXBwbHlQYXRjaEpzb246IHN0YWNrLnRvSnNvblN0cmluZyhwcm9wcy5hcHBseVBhdGNoKSxcbiAgICAgICAgUmVzdG9yZVBhdGNoSnNvbjogc3RhY2sudG9Kc29uU3RyaW5nKHByb3BzLnJlc3RvcmVQYXRjaCksXG4gICAgICAgIENsdXN0ZXJOYW1lOiBwcm9wcy5jbHVzdGVyLmNsdXN0ZXJOYW1lLFxuICAgICAgICBQYXRjaFR5cGU6IHByb3BzLnBhdGNoVHlwZSA/PyBQYXRjaFR5cGUuU1RSQVRFR0lDLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfVxufVxuIl19