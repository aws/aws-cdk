"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.KubernetesResource = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const core_1 = require("@aws-cdk/core");
const constructs_1 = require("constructs");
/**
 * Represents a resource within the Kubernetes system.
 *
 * Alternatively, you can use `cluster.addResource(resource[, resource, ...])`
 * to define resources on this cluster.
 *
 * Applies/deletes the resources using `kubectl` in sync with the resource.
 */
class KubernetesResource extends constructs_1.Construct {
    constructor(scope, id, props) {
        super(scope, id);
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-eks-legacy.KubernetesResource", "");
            jsiiDeprecationWarnings._aws_cdk_aws_eks_legacy_KubernetesResourceProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, KubernetesResource);
            }
            throw error;
        }
        const stack = core_1.Stack.of(this);
        // we maintain a single manifest custom resource handler for each cluster
        const handler = props.cluster._k8sResourceHandler;
        if (!handler) {
            throw new Error('Cannot define a KubernetesManifest resource on a cluster with kubectl disabled');
        }
        new core_1.CustomResource(this, 'Resource', {
            serviceToken: handler.functionArn,
            resourceType: KubernetesResource.RESOURCE_TYPE,
            properties: {
                // `toJsonString` enables embedding CDK tokens in the manifest and will
                // render a CloudFormation-compatible JSON string (similar to
                // StepFunctions, CloudWatch Dashboards etc).
                Manifest: stack.toJsonString(props.manifest),
            },
        });
    }
}
exports.KubernetesResource = KubernetesResource;
_a = JSII_RTTI_SYMBOL_1;
KubernetesResource[_a] = { fqn: "@aws-cdk/aws-eks-legacy.KubernetesResource", version: "0.0.0" };
/**
 * The CloudFormation reosurce type.
 */
KubernetesResource.RESOURCE_TYPE = 'Custom::AWSCDK-EKS-KubernetesResource';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiazhzLXJlc291cmNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiazhzLXJlc291cmNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLHdDQUFzRDtBQUN0RCwyQ0FBdUM7QUFrQ3ZDOzs7Ozs7O0dBT0c7QUFDSCxNQUFhLGtCQUFtQixTQUFRLHNCQUFTO0lBTS9DLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBOEI7UUFDdEUsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQzs7Ozs7OzsrQ0FQUixrQkFBa0I7Ozs7UUFTM0IsTUFBTSxLQUFLLEdBQUcsWUFBSyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUU3Qix5RUFBeUU7UUFDekUsTUFBTSxPQUFPLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQztRQUNsRCxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ1osTUFBTSxJQUFJLEtBQUssQ0FBQyxnRkFBZ0YsQ0FBQyxDQUFDO1NBQ25HO1FBRUQsSUFBSSxxQkFBYyxDQUFDLElBQUksRUFBRSxVQUFVLEVBQUU7WUFDbkMsWUFBWSxFQUFFLE9BQU8sQ0FBQyxXQUFXO1lBQ2pDLFlBQVksRUFBRSxrQkFBa0IsQ0FBQyxhQUFhO1lBQzlDLFVBQVUsRUFBRTtnQkFDVix1RUFBdUU7Z0JBQ3ZFLDZEQUE2RDtnQkFDN0QsNkNBQTZDO2dCQUM3QyxRQUFRLEVBQUUsS0FBSyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDO2FBQzdDO1NBQ0YsQ0FBQyxDQUFDO0tBQ0o7O0FBM0JILGdEQTRCQzs7O0FBM0JDOztHQUVHO0FBQ29CLGdDQUFhLEdBQUcsdUNBQXVDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDdXN0b21SZXNvdXJjZSwgU3RhY2sgfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgQ2x1c3RlciB9IGZyb20gJy4vY2x1c3Rlcic7XG5cbmV4cG9ydCBpbnRlcmZhY2UgS3ViZXJuZXRlc1Jlc291cmNlUHJvcHMge1xuICAvKipcbiAgICogVGhlIEVLUyBjbHVzdGVyIHRvIGFwcGx5IHRoaXMgY29uZmlndXJhdGlvbiB0by5cbiAgICpcbiAgICogW2Rpc2FibGUtYXdzbGludDpyZWYtdmlhLWludGVyZmFjZV1cbiAgICovXG4gIHJlYWRvbmx5IGNsdXN0ZXI6IENsdXN0ZXI7XG5cbiAgLyoqXG4gICAqIFRoZSByZXNvdXJjZSBtYW5pZmVzdC5cbiAgICpcbiAgICogQ29uc2lzdHMgb2YgYW55IG51bWJlciBvZiBjaGlsZCByZXNvdXJjZXMuXG4gICAqXG4gICAqIFdoZW4gdGhlIHJlc291cmNlIGlzIGNyZWF0ZWQvdXBkYXRlZCwgdGhpcyBtYW5pZmVzdCB3aWxsIGJlIGFwcGxpZWQgdG8gdGhlXG4gICAqIGNsdXN0ZXIgdGhyb3VnaCBga3ViZWN0bCBhcHBseWAgYW5kIHdoZW4gdGhlIHJlc291cmNlIG9yIHRoZSBzdGFjayBpc1xuICAgKiBkZWxldGVkLCB0aGUgbWFuaWZlc3Qgd2lsbCBiZSBkZWxldGVkIHRocm91Z2ggYGt1YmVjdGwgZGVsZXRlYC5cbiAgICpcbiAgICogYGBgXG4gICAqIGNvbnN0IG1hbmlmZXN0ID0ge1xuICAgKiAgIGFwaVZlcnNpb246ICd2MScsXG4gICAqICAga2luZDogJ1BvZCcsXG4gICAqICAgbWV0YWRhdGE6IHsgbmFtZTogJ215cG9kJyB9LFxuICAgKiAgIHNwZWM6IHtcbiAgICogICAgIGNvbnRhaW5lcnM6IFsgeyBuYW1lOiAnaGVsbG8nLCBpbWFnZTogJ3BhdWxib3V3ZXIvaGVsbG8ta3ViZXJuZXRlczoxLjUnLCBwb3J0czogWyB7IGNvbnRhaW5lclBvcnQ6IDgwODAgfSBdIH0gXVxuICAgKiAgIH1cbiAgICogfVxuICAgKiBgYGBcbiAgICovXG4gIHJlYWRvbmx5IG1hbmlmZXN0OiBhbnlbXTtcbn1cblxuLyoqXG4gKiBSZXByZXNlbnRzIGEgcmVzb3VyY2Ugd2l0aGluIHRoZSBLdWJlcm5ldGVzIHN5c3RlbS5cbiAqXG4gKiBBbHRlcm5hdGl2ZWx5LCB5b3UgY2FuIHVzZSBgY2x1c3Rlci5hZGRSZXNvdXJjZShyZXNvdXJjZVssIHJlc291cmNlLCAuLi5dKWBcbiAqIHRvIGRlZmluZSByZXNvdXJjZXMgb24gdGhpcyBjbHVzdGVyLlxuICpcbiAqIEFwcGxpZXMvZGVsZXRlcyB0aGUgcmVzb3VyY2VzIHVzaW5nIGBrdWJlY3RsYCBpbiBzeW5jIHdpdGggdGhlIHJlc291cmNlLlxuICovXG5leHBvcnQgY2xhc3MgS3ViZXJuZXRlc1Jlc291cmNlIGV4dGVuZHMgQ29uc3RydWN0IHtcbiAgLyoqXG4gICAqIFRoZSBDbG91ZEZvcm1hdGlvbiByZW9zdXJjZSB0eXBlLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBSRVNPVVJDRV9UWVBFID0gJ0N1c3RvbTo6QVdTQ0RLLUVLUy1LdWJlcm5ldGVzUmVzb3VyY2UnO1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBLdWJlcm5ldGVzUmVzb3VyY2VQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG5cbiAgICBjb25zdCBzdGFjayA9IFN0YWNrLm9mKHRoaXMpO1xuXG4gICAgLy8gd2UgbWFpbnRhaW4gYSBzaW5nbGUgbWFuaWZlc3QgY3VzdG9tIHJlc291cmNlIGhhbmRsZXIgZm9yIGVhY2ggY2x1c3RlclxuICAgIGNvbnN0IGhhbmRsZXIgPSBwcm9wcy5jbHVzdGVyLl9rOHNSZXNvdXJjZUhhbmRsZXI7XG4gICAgaWYgKCFoYW5kbGVyKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBkZWZpbmUgYSBLdWJlcm5ldGVzTWFuaWZlc3QgcmVzb3VyY2Ugb24gYSBjbHVzdGVyIHdpdGgga3ViZWN0bCBkaXNhYmxlZCcpO1xuICAgIH1cblxuICAgIG5ldyBDdXN0b21SZXNvdXJjZSh0aGlzLCAnUmVzb3VyY2UnLCB7XG4gICAgICBzZXJ2aWNlVG9rZW46IGhhbmRsZXIuZnVuY3Rpb25Bcm4sXG4gICAgICByZXNvdXJjZVR5cGU6IEt1YmVybmV0ZXNSZXNvdXJjZS5SRVNPVVJDRV9UWVBFLFxuICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAvLyBgdG9Kc29uU3RyaW5nYCBlbmFibGVzIGVtYmVkZGluZyBDREsgdG9rZW5zIGluIHRoZSBtYW5pZmVzdCBhbmQgd2lsbFxuICAgICAgICAvLyByZW5kZXIgYSBDbG91ZEZvcm1hdGlvbi1jb21wYXRpYmxlIEpTT04gc3RyaW5nIChzaW1pbGFyIHRvXG4gICAgICAgIC8vIFN0ZXBGdW5jdGlvbnMsIENsb3VkV2F0Y2ggRGFzaGJvYXJkcyBldGMpLlxuICAgICAgICBNYW5pZmVzdDogc3RhY2sudG9Kc29uU3RyaW5nKHByb3BzLm1hbmlmZXN0KSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==