"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KubernetesObjectValue = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const core_1 = require("aws-cdk-lib/core");
const constructs_1 = require("constructs");
const kubectl_provider_1 = require("./kubectl-provider");
/**
 * Represents a value of a specific object deployed in the cluster.
 * Use this to fetch any information available by the `kubectl get` command.
 */
class KubernetesObjectValue extends constructs_1.Construct {
    static [JSII_RTTI_SYMBOL_1] = { fqn: "@aws-cdk/aws-eks-v2-alpha.KubernetesObjectValue", version: "0.0.0" };
    /**
     * The CloudFormation resource type.
     */
    static RESOURCE_TYPE = 'Custom::AWSCDK-EKS-KubernetesObjectValue';
    _resource;
    constructor(scope, id, props) {
        super(scope, id);
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_eks_v2_alpha_KubernetesObjectValueProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, KubernetesObjectValue);
            }
            throw error;
        }
        const provider = kubectl_provider_1.KubectlProvider.getKubectlProvider(this, props.cluster);
        if (!provider) {
            throw new Error('Kubectl Provider is not defined in this cluster. Define it when creating the cluster');
        }
        this._resource = new core_1.CustomResource(this, 'Resource', {
            resourceType: KubernetesObjectValue.RESOURCE_TYPE,
            serviceToken: provider.serviceToken,
            properties: {
                ClusterName: props.cluster.clusterName,
                ObjectType: props.objectType,
                ObjectName: props.objectName,
                ObjectNamespace: props.objectNamespace ?? 'default',
                JsonPath: props.jsonPath,
                TimeoutSeconds: (props?.timeout ?? core_1.Duration.minutes(5)).toSeconds(),
            },
        });
    }
    /**
     * The value as a string token.
     */
    get value() {
        return core_1.Token.asString(this._resource.getAtt('Value'));
    }
}
exports.KubernetesObjectValue = KubernetesObjectValue;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiazhzLW9iamVjdC12YWx1ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIms4cy1vYmplY3QtdmFsdWUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSwyQ0FBbUU7QUFDbkUsMkNBQXVDO0FBRXZDLHlEQUFxRDtBQThDckQ7OztHQUdHO0FBQ0gsTUFBYSxxQkFBc0IsU0FBUSxzQkFBUzs7SUFDbEQ7O09BRUc7SUFDSSxNQUFNLENBQVUsYUFBYSxHQUFHLDBDQUEwQyxDQUFDO0lBRTFFLFNBQVMsQ0FBaUI7SUFFbEMsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUFpQztRQUN6RSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDOzs7Ozs7K0NBVFIscUJBQXFCOzs7O1FBVzlCLE1BQU0sUUFBUSxHQUFHLGtDQUFlLENBQUMsa0JBQWtCLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUV6RSxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDZCxNQUFNLElBQUksS0FBSyxDQUFDLHNGQUFzRixDQUFDLENBQUM7UUFDMUcsQ0FBQztRQUVELElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxxQkFBYyxDQUFDLElBQUksRUFBRSxVQUFVLEVBQUU7WUFDcEQsWUFBWSxFQUFFLHFCQUFxQixDQUFDLGFBQWE7WUFDakQsWUFBWSxFQUFFLFFBQVEsQ0FBQyxZQUFZO1lBQ25DLFVBQVUsRUFBRTtnQkFDVixXQUFXLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxXQUFXO2dCQUN0QyxVQUFVLEVBQUUsS0FBSyxDQUFDLFVBQVU7Z0JBQzVCLFVBQVUsRUFBRSxLQUFLLENBQUMsVUFBVTtnQkFDNUIsZUFBZSxFQUFFLEtBQUssQ0FBQyxlQUFlLElBQUksU0FBUztnQkFDbkQsUUFBUSxFQUFFLEtBQUssQ0FBQyxRQUFRO2dCQUN4QixjQUFjLEVBQUUsQ0FBQyxLQUFLLEVBQUUsT0FBTyxJQUFJLGVBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLEVBQUU7YUFDcEU7U0FDRixDQUFDLENBQUM7S0FDSjtJQUVEOztPQUVHO0lBQ0gsSUFBVyxLQUFLO1FBQ2QsT0FBTyxZQUFLLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7S0FDdkQ7O0FBcENILHNEQXFDQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEN1c3RvbVJlc291cmNlLCBUb2tlbiwgRHVyYXRpb24gfSBmcm9tICdhd3MtY2RrLWxpYi9jb3JlJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgSUNsdXN0ZXIgfSBmcm9tICcuL2NsdXN0ZXInO1xuaW1wb3J0IHsgS3ViZWN0bFByb3ZpZGVyIH0gZnJvbSAnLi9rdWJlY3RsLXByb3ZpZGVyJztcblxuLyoqXG4gKiBQcm9wZXJ0aWVzIGZvciBLdWJlcm5ldGVzT2JqZWN0VmFsdWUuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgS3ViZXJuZXRlc09iamVjdFZhbHVlUHJvcHMge1xuICAvKipcbiAgICogVGhlIEVLUyBjbHVzdGVyIHRvIGZldGNoIGF0dHJpYnV0ZXMgZnJvbS5cbiAgICpcbiAgICogW2Rpc2FibGUtYXdzbGludDpyZWYtdmlhLWludGVyZmFjZV1cbiAgICovXG4gIHJlYWRvbmx5IGNsdXN0ZXI6IElDbHVzdGVyO1xuXG4gIC8qKlxuICAgKiBUaGUgb2JqZWN0IHR5cGUgdG8gcXVlcnkuIChlLmcgJ3NlcnZpY2UnLCAncG9kJy4uLilcbiAgICovXG4gIHJlYWRvbmx5IG9iamVjdFR5cGU6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIG5hbWUgb2YgdGhlIG9iamVjdCB0byBxdWVyeS5cbiAgICovXG4gIHJlYWRvbmx5IG9iamVjdE5hbWU6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIG5hbWVzcGFjZSB0aGUgb2JqZWN0IGJlbG9uZ3MgdG8uXG4gICAqXG4gICAqIEBkZWZhdWx0ICdkZWZhdWx0J1xuICAgKi9cbiAgcmVhZG9ubHkgb2JqZWN0TmFtZXNwYWNlPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBKU09OUGF0aCB0byB0aGUgc3BlY2lmaWMgdmFsdWUuXG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9rdWJlcm5ldGVzLmlvL2RvY3MvcmVmZXJlbmNlL2t1YmVjdGwvanNvbnBhdGgvXG4gICAqL1xuICByZWFkb25seSBqc29uUGF0aDogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaW1lb3V0IGZvciB3YWl0aW5nIG9uIGEgdmFsdWUuXG4gICAqXG4gICAqIEBkZWZhdWx0IER1cmF0aW9uLm1pbnV0ZXMoNSlcbiAgICovXG4gIHJlYWRvbmx5IHRpbWVvdXQ/OiBEdXJhdGlvbjtcblxufVxuXG4vKipcbiAqIFJlcHJlc2VudHMgYSB2YWx1ZSBvZiBhIHNwZWNpZmljIG9iamVjdCBkZXBsb3llZCBpbiB0aGUgY2x1c3Rlci5cbiAqIFVzZSB0aGlzIHRvIGZldGNoIGFueSBpbmZvcm1hdGlvbiBhdmFpbGFibGUgYnkgdGhlIGBrdWJlY3RsIGdldGAgY29tbWFuZC5cbiAqL1xuZXhwb3J0IGNsYXNzIEt1YmVybmV0ZXNPYmplY3RWYWx1ZSBleHRlbmRzIENvbnN0cnVjdCB7XG4gIC8qKlxuICAgKiBUaGUgQ2xvdWRGb3JtYXRpb24gcmVzb3VyY2UgdHlwZS5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgUkVTT1VSQ0VfVFlQRSA9ICdDdXN0b206OkFXU0NESy1FS1MtS3ViZXJuZXRlc09iamVjdFZhbHVlJztcblxuICBwcml2YXRlIF9yZXNvdXJjZTogQ3VzdG9tUmVzb3VyY2U7XG5cbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IEt1YmVybmV0ZXNPYmplY3RWYWx1ZVByb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkKTtcblxuICAgIGNvbnN0IHByb3ZpZGVyID0gS3ViZWN0bFByb3ZpZGVyLmdldEt1YmVjdGxQcm92aWRlcih0aGlzLCBwcm9wcy5jbHVzdGVyKTtcblxuICAgIGlmICghcHJvdmlkZXIpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignS3ViZWN0bCBQcm92aWRlciBpcyBub3QgZGVmaW5lZCBpbiB0aGlzIGNsdXN0ZXIuIERlZmluZSBpdCB3aGVuIGNyZWF0aW5nIHRoZSBjbHVzdGVyJyk7XG4gICAgfVxuXG4gICAgdGhpcy5fcmVzb3VyY2UgPSBuZXcgQ3VzdG9tUmVzb3VyY2UodGhpcywgJ1Jlc291cmNlJywge1xuICAgICAgcmVzb3VyY2VUeXBlOiBLdWJlcm5ldGVzT2JqZWN0VmFsdWUuUkVTT1VSQ0VfVFlQRSxcbiAgICAgIHNlcnZpY2VUb2tlbjogcHJvdmlkZXIuc2VydmljZVRva2VuLFxuICAgICAgcHJvcGVydGllczoge1xuICAgICAgICBDbHVzdGVyTmFtZTogcHJvcHMuY2x1c3Rlci5jbHVzdGVyTmFtZSxcbiAgICAgICAgT2JqZWN0VHlwZTogcHJvcHMub2JqZWN0VHlwZSxcbiAgICAgICAgT2JqZWN0TmFtZTogcHJvcHMub2JqZWN0TmFtZSxcbiAgICAgICAgT2JqZWN0TmFtZXNwYWNlOiBwcm9wcy5vYmplY3ROYW1lc3BhY2UgPz8gJ2RlZmF1bHQnLFxuICAgICAgICBKc29uUGF0aDogcHJvcHMuanNvblBhdGgsXG4gICAgICAgIFRpbWVvdXRTZWNvbmRzOiAocHJvcHM/LnRpbWVvdXQgPz8gRHVyYXRpb24ubWludXRlcyg1KSkudG9TZWNvbmRzKCksXG4gICAgICB9LFxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSB2YWx1ZSBhcyBhIHN0cmluZyB0b2tlbi5cbiAgICovXG4gIHB1YmxpYyBnZXQgdmFsdWUoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gVG9rZW4uYXNTdHJpbmcodGhpcy5fcmVzb3VyY2UuZ2V0QXR0KCdWYWx1ZScpKTtcbiAgfVxufVxuIl19