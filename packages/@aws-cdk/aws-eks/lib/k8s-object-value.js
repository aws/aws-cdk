"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.KubernetesObjectValue = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const core_1 = require("@aws-cdk/core");
const constructs_1 = require("constructs");
const kubectl_provider_1 = require("./kubectl-provider");
/**
 * Represents a value of a specific object deployed in the cluster.
 * Use this to fetch any information available by the `kubectl get` command.
 */
class KubernetesObjectValue extends constructs_1.Construct {
    constructor(scope, id, props) {
        super(scope, id);
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_eks_KubernetesObjectValueProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, KubernetesObjectValue);
            }
            throw error;
        }
        const provider = kubectl_provider_1.KubectlProvider.getOrCreate(this, props.cluster);
        this._resource = new core_1.CustomResource(this, 'Resource', {
            resourceType: KubernetesObjectValue.RESOURCE_TYPE,
            serviceToken: provider.serviceToken,
            properties: {
                ClusterName: props.cluster.clusterName,
                RoleArn: provider.roleArn,
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
_a = JSII_RTTI_SYMBOL_1;
KubernetesObjectValue[_a] = { fqn: "@aws-cdk/aws-eks.KubernetesObjectValue", version: "0.0.0" };
/**
 * The CloudFormation reosurce type.
 */
KubernetesObjectValue.RESOURCE_TYPE = 'Custom::AWSCDK-EKS-KubernetesObjectValue';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiazhzLW9iamVjdC12YWx1ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIms4cy1vYmplY3QtdmFsdWUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsd0NBQWdFO0FBQ2hFLDJDQUF1QztBQUV2Qyx5REFBcUQ7QUE4Q3JEOzs7R0FHRztBQUNILE1BQWEscUJBQXNCLFNBQVEsc0JBQVM7SUFRbEQsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUFpQztRQUN6RSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDOzs7Ozs7K0NBVFIscUJBQXFCOzs7O1FBVzlCLE1BQU0sUUFBUSxHQUFHLGtDQUFlLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFbEUsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLHFCQUFjLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRTtZQUNwRCxZQUFZLEVBQUUscUJBQXFCLENBQUMsYUFBYTtZQUNqRCxZQUFZLEVBQUUsUUFBUSxDQUFDLFlBQVk7WUFDbkMsVUFBVSxFQUFFO2dCQUNWLFdBQVcsRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLFdBQVc7Z0JBQ3RDLE9BQU8sRUFBRSxRQUFRLENBQUMsT0FBTztnQkFDekIsVUFBVSxFQUFFLEtBQUssQ0FBQyxVQUFVO2dCQUM1QixVQUFVLEVBQUUsS0FBSyxDQUFDLFVBQVU7Z0JBQzVCLGVBQWUsRUFBRSxLQUFLLENBQUMsZUFBZSxJQUFJLFNBQVM7Z0JBQ25ELFFBQVEsRUFBRSxLQUFLLENBQUMsUUFBUTtnQkFDeEIsY0FBYyxFQUFFLENBQUMsS0FBSyxFQUFFLE9BQU8sSUFBSSxlQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxFQUFFO2FBQ3BFO1NBQ0YsQ0FBQyxDQUFDO0tBRUo7SUFFRDs7T0FFRztJQUNILElBQVcsS0FBSztRQUNkLE9BQU8sWUFBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO0tBQ3ZEOztBQWxDSCxzREFtQ0M7OztBQWxDQzs7R0FFRztBQUNvQixtQ0FBYSxHQUFHLDBDQUEwQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ3VzdG9tUmVzb3VyY2UsIFRva2VuLCBEdXJhdGlvbiB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBJQ2x1c3RlciB9IGZyb20gJy4vY2x1c3Rlcic7XG5pbXBvcnQgeyBLdWJlY3RsUHJvdmlkZXIgfSBmcm9tICcuL2t1YmVjdGwtcHJvdmlkZXInO1xuXG4vKipcbiAqIFByb3BlcnRpZXMgZm9yIEt1YmVybmV0ZXNPYmplY3RWYWx1ZS5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBLdWJlcm5ldGVzT2JqZWN0VmFsdWVQcm9wcyB7XG4gIC8qKlxuICAgKiBUaGUgRUtTIGNsdXN0ZXIgdG8gZmV0Y2ggYXR0cmlidXRlcyBmcm9tLlxuICAgKlxuICAgKiBbZGlzYWJsZS1hd3NsaW50OnJlZi12aWEtaW50ZXJmYWNlXVxuICAgKi9cbiAgcmVhZG9ubHkgY2x1c3RlcjogSUNsdXN0ZXI7XG5cbiAgLyoqXG4gICAqIFRoZSBvYmplY3QgdHlwZSB0byBxdWVyeS4gKGUuZyAnc2VydmljZScsICdwb2QnLi4uKVxuICAgKi9cbiAgcmVhZG9ubHkgb2JqZWN0VHlwZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgbmFtZSBvZiB0aGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICAgKi9cbiAgcmVhZG9ubHkgb2JqZWN0TmFtZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgbmFtZXNwYWNlIHRoZSBvYmplY3QgYmVsb25ncyB0by5cbiAgICpcbiAgICogQGRlZmF1bHQgJ2RlZmF1bHQnXG4gICAqL1xuICByZWFkb25seSBvYmplY3ROYW1lc3BhY2U/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEpTT05QYXRoIHRvIHRoZSBzcGVjaWZpYyB2YWx1ZS5cbiAgICpcbiAgICogQHNlZSBodHRwczovL2t1YmVybmV0ZXMuaW8vZG9jcy9yZWZlcmVuY2Uva3ViZWN0bC9qc29ucGF0aC9cbiAgICovXG4gIHJlYWRvbmx5IGpzb25QYXRoOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRpbWVvdXQgZm9yIHdhaXRpbmcgb24gYSB2YWx1ZS5cbiAgICpcbiAgICogQGRlZmF1bHQgRHVyYXRpb24ubWludXRlcyg1KVxuICAgKi9cbiAgcmVhZG9ubHkgdGltZW91dD86IER1cmF0aW9uO1xuXG59XG5cbi8qKlxuICogUmVwcmVzZW50cyBhIHZhbHVlIG9mIGEgc3BlY2lmaWMgb2JqZWN0IGRlcGxveWVkIGluIHRoZSBjbHVzdGVyLlxuICogVXNlIHRoaXMgdG8gZmV0Y2ggYW55IGluZm9ybWF0aW9uIGF2YWlsYWJsZSBieSB0aGUgYGt1YmVjdGwgZ2V0YCBjb21tYW5kLlxuICovXG5leHBvcnQgY2xhc3MgS3ViZXJuZXRlc09iamVjdFZhbHVlIGV4dGVuZHMgQ29uc3RydWN0IHtcbiAgLyoqXG4gICAqIFRoZSBDbG91ZEZvcm1hdGlvbiByZW9zdXJjZSB0eXBlLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBSRVNPVVJDRV9UWVBFID0gJ0N1c3RvbTo6QVdTQ0RLLUVLUy1LdWJlcm5ldGVzT2JqZWN0VmFsdWUnO1xuXG4gIHByaXZhdGUgX3Jlc291cmNlOiBDdXN0b21SZXNvdXJjZTtcblxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogS3ViZXJuZXRlc09iamVjdFZhbHVlUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQpO1xuXG4gICAgY29uc3QgcHJvdmlkZXIgPSBLdWJlY3RsUHJvdmlkZXIuZ2V0T3JDcmVhdGUodGhpcywgcHJvcHMuY2x1c3Rlcik7XG5cbiAgICB0aGlzLl9yZXNvdXJjZSA9IG5ldyBDdXN0b21SZXNvdXJjZSh0aGlzLCAnUmVzb3VyY2UnLCB7XG4gICAgICByZXNvdXJjZVR5cGU6IEt1YmVybmV0ZXNPYmplY3RWYWx1ZS5SRVNPVVJDRV9UWVBFLFxuICAgICAgc2VydmljZVRva2VuOiBwcm92aWRlci5zZXJ2aWNlVG9rZW4sXG4gICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIENsdXN0ZXJOYW1lOiBwcm9wcy5jbHVzdGVyLmNsdXN0ZXJOYW1lLFxuICAgICAgICBSb2xlQXJuOiBwcm92aWRlci5yb2xlQXJuLFxuICAgICAgICBPYmplY3RUeXBlOiBwcm9wcy5vYmplY3RUeXBlLFxuICAgICAgICBPYmplY3ROYW1lOiBwcm9wcy5vYmplY3ROYW1lLFxuICAgICAgICBPYmplY3ROYW1lc3BhY2U6IHByb3BzLm9iamVjdE5hbWVzcGFjZSA/PyAnZGVmYXVsdCcsXG4gICAgICAgIEpzb25QYXRoOiBwcm9wcy5qc29uUGF0aCxcbiAgICAgICAgVGltZW91dFNlY29uZHM6IChwcm9wcz8udGltZW91dCA/PyBEdXJhdGlvbi5taW51dGVzKDUpKS50b1NlY29uZHMoKSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgdmFsdWUgYXMgYSBzdHJpbmcgdG9rZW4uXG4gICAqL1xuICBwdWJsaWMgZ2V0IHZhbHVlKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIFRva2VuLmFzU3RyaW5nKHRoaXMuX3Jlc291cmNlLmdldEF0dCgnVmFsdWUnKSk7XG4gIH1cbn1cbiJdfQ==