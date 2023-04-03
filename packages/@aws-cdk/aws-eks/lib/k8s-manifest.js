"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.KubernetesManifest = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const core_1 = require("@aws-cdk/core");
const constructs_1 = require("constructs");
const alb_controller_1 = require("./alb-controller");
const kubectl_provider_1 = require("./kubectl-provider");
const PRUNE_LABEL_PREFIX = 'aws.cdk.eks/prune-';
/**
 * Represents a manifest within the Kubernetes system.
 *
 * Alternatively, you can use `cluster.addManifest(resource[, resource, ...])`
 * to define resources on this cluster.
 *
 * Applies/deletes the manifest using `kubectl`.
 */
class KubernetesManifest extends constructs_1.Construct {
    constructor(scope, id, props) {
        super(scope, id);
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_eks_KubernetesManifestProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, KubernetesManifest);
            }
            throw error;
        }
        const stack = core_1.Stack.of(this);
        const provider = kubectl_provider_1.KubectlProvider.getOrCreate(this, props.cluster);
        const prune = props.prune ?? props.cluster.prune;
        const pruneLabel = prune
            ? this.injectPruneLabel(props.manifest)
            : undefined;
        if (props.ingressAlb ?? false) {
            this.injectIngressAlbAnnotations(props.manifest, props.ingressAlbScheme ?? alb_controller_1.AlbScheme.INTERNAL);
        }
        const customResource = new core_1.CustomResource(this, 'Resource', {
            serviceToken: provider.serviceToken,
            resourceType: KubernetesManifest.RESOURCE_TYPE,
            properties: {
                // `toJsonString` enables embedding CDK tokens in the manifest and will
                // render a CloudFormation-compatible JSON string (similar to
                // StepFunctions, CloudWatch Dashboards etc).
                Manifest: stack.toJsonString(props.manifest),
                ClusterName: props.cluster.clusterName,
                RoleArn: provider.roleArn,
                PruneLabel: pruneLabel,
                Overwrite: props.overwrite,
                SkipValidation: props.skipValidation,
            },
        });
        this.node.defaultChild = customResource.node.defaultChild;
    }
    /**
     * Injects a generated prune label to all resources in this manifest. The
     * label name will be `awscdk.eks/manifest-ADDR` where `ADDR` is the address
     * of the construct in the construct tree.
     *
     * @returns the label name
     */
    injectPruneLabel(manifest) {
        // max label name is 64 chars and addrs is always 42.
        const pruneLabel = PRUNE_LABEL_PREFIX + constructs_1.Node.of(this).addr;
        for (const resource of manifest) {
            // skip resource if it's not an object or if it does not have a "kind"
            if (typeof (resource) !== 'object' || !resource.kind) {
                continue;
            }
            if (!resource.metadata) {
                resource.metadata = {};
            }
            if (!resource.metadata.labels) {
                resource.metadata.labels = {};
            }
            resource.metadata.labels = {
                [pruneLabel]: '',
                ...resource.metadata.labels,
            };
        }
        return pruneLabel;
    }
    /**
     * Inject the necessary ingress annontations if possible (and requested).
     *
     * @see https://kubernetes-sigs.github.io/aws-load-balancer-controller/v2.2/guide/ingress/annotations/
     */
    injectIngressAlbAnnotations(manifest, scheme) {
        for (const resource of manifest) {
            // skip resource if it's not an object or if it does not have a "kind"
            if (typeof (resource) !== 'object' || !resource.kind) {
                continue;
            }
            if (resource.kind === 'Ingress') {
                resource.metadata.annotations = {
                    'kubernetes.io/ingress.class': 'alb',
                    'alb.ingress.kubernetes.io/scheme': scheme,
                    ...resource.metadata.annotations,
                };
            }
        }
    }
}
exports.KubernetesManifest = KubernetesManifest;
_a = JSII_RTTI_SYMBOL_1;
KubernetesManifest[_a] = { fqn: "@aws-cdk/aws-eks.KubernetesManifest", version: "0.0.0" };
/**
 * The CloudFormation reosurce type.
 */
KubernetesManifest.RESOURCE_TYPE = 'Custom::AWSCDK-EKS-KubernetesResource';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiazhzLW1hbmlmZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiazhzLW1hbmlmZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLHdDQUFzRDtBQUN0RCwyQ0FBNkM7QUFDN0MscURBQTZDO0FBRTdDLHlEQUFxRDtBQUVyRCxNQUFNLGtCQUFrQixHQUFHLG9CQUFvQixDQUFDO0FBc0doRDs7Ozs7OztHQU9HO0FBQ0gsTUFBYSxrQkFBbUIsU0FBUSxzQkFBUztJQU0vQyxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQThCO1FBQ3RFLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7Ozs7OzsrQ0FQUixrQkFBa0I7Ozs7UUFTM0IsTUFBTSxLQUFLLEdBQUcsWUFBSyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM3QixNQUFNLFFBQVEsR0FBRyxrQ0FBZSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRWxFLE1BQU0sS0FBSyxHQUFHLEtBQUssQ0FBQyxLQUFLLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUM7UUFDakQsTUFBTSxVQUFVLEdBQUcsS0FBSztZQUN0QixDQUFDLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUM7WUFDdkMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztRQUVkLElBQUksS0FBSyxDQUFDLFVBQVUsSUFBSSxLQUFLLEVBQUU7WUFDN0IsSUFBSSxDQUFDLDJCQUEyQixDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLGdCQUFnQixJQUFJLDBCQUFTLENBQUMsUUFBUSxDQUFDLENBQUM7U0FDaEc7UUFFRCxNQUFNLGNBQWMsR0FBRyxJQUFJLHFCQUFjLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRTtZQUMxRCxZQUFZLEVBQUUsUUFBUSxDQUFDLFlBQVk7WUFDbkMsWUFBWSxFQUFFLGtCQUFrQixDQUFDLGFBQWE7WUFDOUMsVUFBVSxFQUFFO2dCQUNWLHVFQUF1RTtnQkFDdkUsNkRBQTZEO2dCQUM3RCw2Q0FBNkM7Z0JBQzdDLFFBQVEsRUFBRSxLQUFLLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUM7Z0JBQzVDLFdBQVcsRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLFdBQVc7Z0JBQ3RDLE9BQU8sRUFBRSxRQUFRLENBQUMsT0FBTztnQkFDekIsVUFBVSxFQUFFLFVBQVU7Z0JBQ3RCLFNBQVMsRUFBRSxLQUFLLENBQUMsU0FBUztnQkFDMUIsY0FBYyxFQUFFLEtBQUssQ0FBQyxjQUFjO2FBQ3JDO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLEdBQUcsY0FBYyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUM7S0FDM0Q7SUFFRDs7Ozs7O09BTUc7SUFDSyxnQkFBZ0IsQ0FBQyxRQUErQjtRQUN0RCxxREFBcUQ7UUFDckQsTUFBTSxVQUFVLEdBQUcsa0JBQWtCLEdBQUcsaUJBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDO1FBRTNELEtBQUssTUFBTSxRQUFRLElBQUksUUFBUSxFQUFFO1lBQy9CLHNFQUFzRTtZQUN0RSxJQUFJLE9BQU0sQ0FBQyxRQUFRLENBQUMsS0FBSyxRQUFRLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFO2dCQUNuRCxTQUFTO2FBQ1Y7WUFFRCxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRTtnQkFDdEIsUUFBUSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7YUFDeEI7WUFFRCxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUU7Z0JBQzdCLFFBQVEsQ0FBQyxRQUFRLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQzthQUMvQjtZQUVELFFBQVEsQ0FBQyxRQUFRLENBQUMsTUFBTSxHQUFHO2dCQUN6QixDQUFDLFVBQVUsQ0FBQyxFQUFFLEVBQUU7Z0JBQ2hCLEdBQUcsUUFBUSxDQUFDLFFBQVEsQ0FBQyxNQUFNO2FBQzVCLENBQUM7U0FDSDtRQUVELE9BQU8sVUFBVSxDQUFDO0tBQ25CO0lBRUQ7Ozs7T0FJRztJQUNLLDJCQUEyQixDQUFDLFFBQStCLEVBQUUsTUFBaUI7UUFFcEYsS0FBSyxNQUFNLFFBQVEsSUFBSSxRQUFRLEVBQUU7WUFFL0Isc0VBQXNFO1lBQ3RFLElBQUksT0FBTSxDQUFDLFFBQVEsQ0FBQyxLQUFLLFFBQVEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUU7Z0JBQ25ELFNBQVM7YUFDVjtZQUVELElBQUksUUFBUSxDQUFDLElBQUksS0FBSyxTQUFTLEVBQUU7Z0JBQy9CLFFBQVEsQ0FBQyxRQUFRLENBQUMsV0FBVyxHQUFHO29CQUM5Qiw2QkFBNkIsRUFBRSxLQUFLO29CQUNwQyxrQ0FBa0MsRUFBRSxNQUFNO29CQUMxQyxHQUFHLFFBQVEsQ0FBQyxRQUFRLENBQUMsV0FBVztpQkFDakMsQ0FBQzthQUNIO1NBQ0Y7S0FFRjs7QUFqR0gsZ0RBa0dDOzs7QUFqR0M7O0dBRUc7QUFDb0IsZ0NBQWEsR0FBRyx1Q0FBdUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEN1c3RvbVJlc291cmNlLCBTdGFjayB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgQ29uc3RydWN0LCBOb2RlIH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBBbGJTY2hlbWUgfSBmcm9tICcuL2FsYi1jb250cm9sbGVyJztcbmltcG9ydCB7IElDbHVzdGVyIH0gZnJvbSAnLi9jbHVzdGVyJztcbmltcG9ydCB7IEt1YmVjdGxQcm92aWRlciB9IGZyb20gJy4va3ViZWN0bC1wcm92aWRlcic7XG5cbmNvbnN0IFBSVU5FX0xBQkVMX1BSRUZJWCA9ICdhd3MuY2RrLmVrcy9wcnVuZS0nO1xuXG4vKipcbiAqIE9wdGlvbnMgZm9yIGBLdWJlcm5ldGVzTWFuaWZlc3RgLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIEt1YmVybmV0ZXNNYW5pZmVzdE9wdGlvbnMge1xuICAvKipcbiAgICogV2hlbiBhIHJlc291cmNlIGlzIHJlbW92ZWQgZnJvbSBhIEt1YmVybmV0ZXMgbWFuaWZlc3QsIGl0IG5vIGxvbmdlciBhcHBlYXJzXG4gICAqIGluIHRoZSBtYW5pZmVzdCwgYW5kIHRoZXJlIGlzIG5vIHdheSB0byBrbm93IHRoYXQgdGhpcyByZXNvdXJjZSBuZWVkcyB0byBiZVxuICAgKiBkZWxldGVkLiBUbyBhZGRyZXNzIHRoaXMsIGBrdWJlY3RsIGFwcGx5YCBoYXMgYSBgLS1wcnVuZWAgb3B0aW9uIHdoaWNoIHdpbGxcbiAgICogcXVlcnkgdGhlIGNsdXN0ZXIgZm9yIGFsbCByZXNvdXJjZXMgd2l0aCBhIHNwZWNpZmljIGxhYmVsIGFuZCB3aWxsIHJlbW92ZVxuICAgKiBhbGwgdGhlIGxhYmVsZCByZXNvdXJjZXMgdGhhdCBhcmUgbm90IHBhcnQgb2YgdGhlIGFwcGxpZWQgbWFuaWZlc3QuIElmIHRoaXNcbiAgICogb3B0aW9uIGlzIGRpc2FibGVkIGFuZCBhIHJlc291cmNlIGlzIHJlbW92ZWQsIGl0IHdpbGwgYmVjb21lIFwib3JwaGFuZWRcIiBhbmRcbiAgICogd2lsbCBub3QgYmUgZGVsZXRlZCBmcm9tIHRoZSBjbHVzdGVyLlxuICAgKlxuICAgKiBXaGVuIHRoaXMgb3B0aW9uIGlzIGVuYWJsZWQgKGRlZmF1bHQpLCB0aGUgY29uc3RydWN0IHdpbGwgaW5qZWN0IGEgbGFiZWwgdG9cbiAgICogYWxsIEt1YmVybmV0ZXMgcmVzb3VyY2VzIGluY2x1ZGVkIGluIHRoaXMgbWFuaWZlc3Qgd2hpY2ggd2lsbCBiZSB1c2VkIHRvXG4gICAqIHBydW5lIHJlc291cmNlcyB3aGVuIHRoZSBtYW5pZmVzdCBjaGFuZ2VzIHZpYSBga3ViZWN0bCBhcHBseSAtLXBydW5lYC5cbiAgICpcbiAgICogVGhlIGxhYmVsIG5hbWUgd2lsbCBiZSBgYXdzLmNkay5la3MvcHJ1bmUtPEFERFI+YCB3aGVyZSBgPEFERFI+YCBpcyB0aGVcbiAgICogNDItY2hhciB1bmlxdWUgYWRkcmVzcyBvZiB0aGlzIGNvbnN0cnVjdCBpbiB0aGUgY29uc3RydWN0IHRyZWUuIFZhbHVlIGlzXG4gICAqIGVtcHR5LlxuICAgKlxuICAgKiBAc2VlXG4gICAqIGh0dHBzOi8va3ViZXJuZXRlcy5pby9kb2NzL3Rhc2tzL21hbmFnZS1rdWJlcm5ldGVzLW9iamVjdHMvZGVjbGFyYXRpdmUtY29uZmlnLyNhbHRlcm5hdGl2ZS1rdWJlY3RsLWFwcGx5LWYtZGlyZWN0b3J5LXBydW5lLWwteW91ci1sYWJlbFxuICAgKlxuICAgKiBAZGVmYXVsdCAtIGJhc2VkIG9uIHRoZSBwcnVuZSBvcHRpb24gb2YgdGhlIGNsdXN0ZXIsIHdoaWNoIGlzIGB0cnVlYCB1bmxlc3NcbiAgICogb3RoZXJ3aXNlIHNwZWNpZmllZC5cbiAgICovXG4gIHJlYWRvbmx5IHBydW5lPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogQSBmbGFnIHRvIHNpZ25pZnkgaWYgdGhlIG1hbmlmZXN0IHZhbGlkYXRpb24gc2hvdWxkIGJlIHNraXBwZWRcbiAgICpcbiAgICogQGRlZmF1bHQgZmFsc2VcbiAgICovXG4gIHJlYWRvbmx5IHNraXBWYWxpZGF0aW9uPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogQXV0b21hdGljYWxseSBkZXRlY3QgYEluZ3Jlc3NgIHJlc291cmNlcyBpbiB0aGUgbWFuaWZlc3QgYW5kIGFubm90YXRlIHRoZW0gc28gdGhleVxuICAgKiBhcmUgcGlja2VkIHVwIGJ5IGFuIEFMQiBJbmdyZXNzIENvbnRyb2xsZXIuXG4gICAqXG4gICAqIEBkZWZhdWx0IGZhbHNlXG4gICAqL1xuICByZWFkb25seSBpbmdyZXNzQWxiPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogU3BlY2lmeSB0aGUgQUxCIHNjaGVtZSB0aGF0IHNob3VsZCBiZSBhcHBsaWVkIHRvIGBJbmdyZXNzYCByZXNvdXJjZXMuXG4gICAqIE9ubHkgYXBwbGljYWJsZSBpZiBgaW5ncmVzc0FsYmAgaXMgc2V0IHRvIGB0cnVlYC5cbiAgICpcbiAgICogQGRlZmF1bHQgQWxiU2NoZW1lLklOVEVSTkFMXG4gICAqL1xuICByZWFkb25seSBpbmdyZXNzQWxiU2NoZW1lPzogQWxiU2NoZW1lO1xuXG59XG5cbi8qKlxuICogUHJvcGVydGllcyBmb3IgS3ViZXJuZXRlc01hbmlmZXN0XG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgS3ViZXJuZXRlc01hbmlmZXN0UHJvcHMgZXh0ZW5kcyBLdWJlcm5ldGVzTWFuaWZlc3RPcHRpb25zIHtcbiAgLyoqXG4gICAqIFRoZSBFS1MgY2x1c3RlciB0byBhcHBseSB0aGlzIG1hbmlmZXN0IHRvLlxuICAgKlxuICAgKiBbZGlzYWJsZS1hd3NsaW50OnJlZi12aWEtaW50ZXJmYWNlXVxuICAgKi9cbiAgcmVhZG9ubHkgY2x1c3RlcjogSUNsdXN0ZXI7XG5cbiAgLyoqXG4gICAqIFRoZSBtYW5pZmVzdCB0byBhcHBseS5cbiAgICpcbiAgICogQ29uc2lzdHMgb2YgYW55IG51bWJlciBvZiBjaGlsZCByZXNvdXJjZXMuXG4gICAqXG4gICAqIFdoZW4gdGhlIHJlc291cmNlcyBhcmUgY3JlYXRlZC91cGRhdGVkLCB0aGlzIG1hbmlmZXN0IHdpbGwgYmUgYXBwbGllZCB0byB0aGVcbiAgICogY2x1c3RlciB0aHJvdWdoIGBrdWJlY3RsIGFwcGx5YCBhbmQgd2hlbiB0aGUgcmVzb3VyY2VzIG9yIHRoZSBzdGFjayBpc1xuICAgKiBkZWxldGVkLCB0aGUgcmVzb3VyY2VzIGluIHRoZSBtYW5pZmVzdCB3aWxsIGJlIGRlbGV0ZWQgdGhyb3VnaCBga3ViZWN0bCBkZWxldGVgLlxuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiBbe1xuICAgKiAgIGFwaVZlcnNpb246ICd2MScsXG4gICAqICAga2luZDogJ1BvZCcsXG4gICAqICAgbWV0YWRhdGE6IHsgbmFtZTogJ215cG9kJyB9LFxuICAgKiAgIHNwZWM6IHtcbiAgICogICAgIGNvbnRhaW5lcnM6IFsgeyBuYW1lOiAnaGVsbG8nLCBpbWFnZTogJ3BhdWxib3V3ZXIvaGVsbG8ta3ViZXJuZXRlczoxLjUnLCBwb3J0czogWyB7IGNvbnRhaW5lclBvcnQ6IDgwODAgfSBdIH0gXVxuICAgKiAgIH1cbiAgICogfV1cbiAgICpcbiAgICovXG4gIHJlYWRvbmx5IG1hbmlmZXN0OiBSZWNvcmQ8c3RyaW5nLCBhbnk+W107XG5cbiAgLyoqXG4gICAqIE92ZXJ3cml0ZSBhbnkgZXhpc3RpbmcgcmVzb3VyY2VzLlxuICAgKlxuICAgKiBJZiB0aGlzIGlzIHNldCwgd2Ugd2lsbCB1c2UgYGt1YmVjdGwgYXBwbHlgIGluc3RlYWQgb2YgYGt1YmVjdGwgY3JlYXRlYFxuICAgKiB3aGVuIHRoZSByZXNvdXJjZSBpcyBjcmVhdGVkLiBPdGhlcndpc2UsIGlmIHRoZXJlIGlzIGFscmVhZHkgYSByZXNvdXJjZVxuICAgKiBpbiB0aGUgY2x1c3RlciB3aXRoIHRoZSBzYW1lIG5hbWUsIHRoZSBvcGVyYXRpb24gd2lsbCBmYWlsLlxuICAgKlxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKi9cbiAgcmVhZG9ubHkgb3ZlcndyaXRlPzogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBSZXByZXNlbnRzIGEgbWFuaWZlc3Qgd2l0aGluIHRoZSBLdWJlcm5ldGVzIHN5c3RlbS5cbiAqXG4gKiBBbHRlcm5hdGl2ZWx5LCB5b3UgY2FuIHVzZSBgY2x1c3Rlci5hZGRNYW5pZmVzdChyZXNvdXJjZVssIHJlc291cmNlLCAuLi5dKWBcbiAqIHRvIGRlZmluZSByZXNvdXJjZXMgb24gdGhpcyBjbHVzdGVyLlxuICpcbiAqIEFwcGxpZXMvZGVsZXRlcyB0aGUgbWFuaWZlc3QgdXNpbmcgYGt1YmVjdGxgLlxuICovXG5leHBvcnQgY2xhc3MgS3ViZXJuZXRlc01hbmlmZXN0IGV4dGVuZHMgQ29uc3RydWN0IHtcbiAgLyoqXG4gICAqIFRoZSBDbG91ZEZvcm1hdGlvbiByZW9zdXJjZSB0eXBlLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBSRVNPVVJDRV9UWVBFID0gJ0N1c3RvbTo6QVdTQ0RLLUVLUy1LdWJlcm5ldGVzUmVzb3VyY2UnO1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBLdWJlcm5ldGVzTWFuaWZlc3RQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG5cbiAgICBjb25zdCBzdGFjayA9IFN0YWNrLm9mKHRoaXMpO1xuICAgIGNvbnN0IHByb3ZpZGVyID0gS3ViZWN0bFByb3ZpZGVyLmdldE9yQ3JlYXRlKHRoaXMsIHByb3BzLmNsdXN0ZXIpO1xuXG4gICAgY29uc3QgcHJ1bmUgPSBwcm9wcy5wcnVuZSA/PyBwcm9wcy5jbHVzdGVyLnBydW5lO1xuICAgIGNvbnN0IHBydW5lTGFiZWwgPSBwcnVuZVxuICAgICAgPyB0aGlzLmluamVjdFBydW5lTGFiZWwocHJvcHMubWFuaWZlc3QpXG4gICAgICA6IHVuZGVmaW5lZDtcblxuICAgIGlmIChwcm9wcy5pbmdyZXNzQWxiID8/IGZhbHNlKSB7XG4gICAgICB0aGlzLmluamVjdEluZ3Jlc3NBbGJBbm5vdGF0aW9ucyhwcm9wcy5tYW5pZmVzdCwgcHJvcHMuaW5ncmVzc0FsYlNjaGVtZSA/PyBBbGJTY2hlbWUuSU5URVJOQUwpO1xuICAgIH1cblxuICAgIGNvbnN0IGN1c3RvbVJlc291cmNlID0gbmV3IEN1c3RvbVJlc291cmNlKHRoaXMsICdSZXNvdXJjZScsIHtcbiAgICAgIHNlcnZpY2VUb2tlbjogcHJvdmlkZXIuc2VydmljZVRva2VuLFxuICAgICAgcmVzb3VyY2VUeXBlOiBLdWJlcm5ldGVzTWFuaWZlc3QuUkVTT1VSQ0VfVFlQRSxcbiAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgLy8gYHRvSnNvblN0cmluZ2AgZW5hYmxlcyBlbWJlZGRpbmcgQ0RLIHRva2VucyBpbiB0aGUgbWFuaWZlc3QgYW5kIHdpbGxcbiAgICAgICAgLy8gcmVuZGVyIGEgQ2xvdWRGb3JtYXRpb24tY29tcGF0aWJsZSBKU09OIHN0cmluZyAoc2ltaWxhciB0b1xuICAgICAgICAvLyBTdGVwRnVuY3Rpb25zLCBDbG91ZFdhdGNoIERhc2hib2FyZHMgZXRjKS5cbiAgICAgICAgTWFuaWZlc3Q6IHN0YWNrLnRvSnNvblN0cmluZyhwcm9wcy5tYW5pZmVzdCksXG4gICAgICAgIENsdXN0ZXJOYW1lOiBwcm9wcy5jbHVzdGVyLmNsdXN0ZXJOYW1lLFxuICAgICAgICBSb2xlQXJuOiBwcm92aWRlci5yb2xlQXJuLCAvLyBUT0RPOiBiYWtlIGludG8gcHJvdmlkZXIncyBlbnZpcm9ubWVudFxuICAgICAgICBQcnVuZUxhYmVsOiBwcnVuZUxhYmVsLFxuICAgICAgICBPdmVyd3JpdGU6IHByb3BzLm92ZXJ3cml0ZSxcbiAgICAgICAgU2tpcFZhbGlkYXRpb246IHByb3BzLnNraXBWYWxpZGF0aW9uLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIHRoaXMubm9kZS5kZWZhdWx0Q2hpbGQgPSBjdXN0b21SZXNvdXJjZS5ub2RlLmRlZmF1bHRDaGlsZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbmplY3RzIGEgZ2VuZXJhdGVkIHBydW5lIGxhYmVsIHRvIGFsbCByZXNvdXJjZXMgaW4gdGhpcyBtYW5pZmVzdC4gVGhlXG4gICAqIGxhYmVsIG5hbWUgd2lsbCBiZSBgYXdzY2RrLmVrcy9tYW5pZmVzdC1BRERSYCB3aGVyZSBgQUREUmAgaXMgdGhlIGFkZHJlc3NcbiAgICogb2YgdGhlIGNvbnN0cnVjdCBpbiB0aGUgY29uc3RydWN0IHRyZWUuXG4gICAqXG4gICAqIEByZXR1cm5zIHRoZSBsYWJlbCBuYW1lXG4gICAqL1xuICBwcml2YXRlIGluamVjdFBydW5lTGFiZWwobWFuaWZlc3Q6IFJlY29yZDxzdHJpbmcsIGFueT5bXSk6IHN0cmluZyB7XG4gICAgLy8gbWF4IGxhYmVsIG5hbWUgaXMgNjQgY2hhcnMgYW5kIGFkZHJzIGlzIGFsd2F5cyA0Mi5cbiAgICBjb25zdCBwcnVuZUxhYmVsID0gUFJVTkVfTEFCRUxfUFJFRklYICsgTm9kZS5vZih0aGlzKS5hZGRyO1xuXG4gICAgZm9yIChjb25zdCByZXNvdXJjZSBvZiBtYW5pZmVzdCkge1xuICAgICAgLy8gc2tpcCByZXNvdXJjZSBpZiBpdCdzIG5vdCBhbiBvYmplY3Qgb3IgaWYgaXQgZG9lcyBub3QgaGF2ZSBhIFwia2luZFwiXG4gICAgICBpZiAodHlwZW9mKHJlc291cmNlKSAhPT0gJ29iamVjdCcgfHwgIXJlc291cmNlLmtpbmQpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGlmICghcmVzb3VyY2UubWV0YWRhdGEpIHtcbiAgICAgICAgcmVzb3VyY2UubWV0YWRhdGEgPSB7fTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFyZXNvdXJjZS5tZXRhZGF0YS5sYWJlbHMpIHtcbiAgICAgICAgcmVzb3VyY2UubWV0YWRhdGEubGFiZWxzID0ge307XG4gICAgICB9XG5cbiAgICAgIHJlc291cmNlLm1ldGFkYXRhLmxhYmVscyA9IHtcbiAgICAgICAgW3BydW5lTGFiZWxdOiAnJyxcbiAgICAgICAgLi4ucmVzb3VyY2UubWV0YWRhdGEubGFiZWxzLFxuICAgICAgfTtcbiAgICB9XG5cbiAgICByZXR1cm4gcHJ1bmVMYWJlbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbmplY3QgdGhlIG5lY2Vzc2FyeSBpbmdyZXNzIGFubm9udGF0aW9ucyBpZiBwb3NzaWJsZSAoYW5kIHJlcXVlc3RlZCkuXG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9rdWJlcm5ldGVzLXNpZ3MuZ2l0aHViLmlvL2F3cy1sb2FkLWJhbGFuY2VyLWNvbnRyb2xsZXIvdjIuMi9ndWlkZS9pbmdyZXNzL2Fubm90YXRpb25zL1xuICAgKi9cbiAgcHJpdmF0ZSBpbmplY3RJbmdyZXNzQWxiQW5ub3RhdGlvbnMobWFuaWZlc3Q6IFJlY29yZDxzdHJpbmcsIGFueT5bXSwgc2NoZW1lOiBBbGJTY2hlbWUpIHtcblxuICAgIGZvciAoY29uc3QgcmVzb3VyY2Ugb2YgbWFuaWZlc3QpIHtcblxuICAgICAgLy8gc2tpcCByZXNvdXJjZSBpZiBpdCdzIG5vdCBhbiBvYmplY3Qgb3IgaWYgaXQgZG9lcyBub3QgaGF2ZSBhIFwia2luZFwiXG4gICAgICBpZiAodHlwZW9mKHJlc291cmNlKSAhPT0gJ29iamVjdCcgfHwgIXJlc291cmNlLmtpbmQpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGlmIChyZXNvdXJjZS5raW5kID09PSAnSW5ncmVzcycpIHtcbiAgICAgICAgcmVzb3VyY2UubWV0YWRhdGEuYW5ub3RhdGlvbnMgPSB7XG4gICAgICAgICAgJ2t1YmVybmV0ZXMuaW8vaW5ncmVzcy5jbGFzcyc6ICdhbGInLFxuICAgICAgICAgICdhbGIuaW5ncmVzcy5rdWJlcm5ldGVzLmlvL3NjaGVtZSc6IHNjaGVtZSxcbiAgICAgICAgICAuLi5yZXNvdXJjZS5tZXRhZGF0YS5hbm5vdGF0aW9ucyxcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9XG5cbiAgfVxufVxuIl19