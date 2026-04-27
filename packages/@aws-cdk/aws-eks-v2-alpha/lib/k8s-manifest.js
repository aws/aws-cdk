"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KubernetesManifest = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const core_1 = require("aws-cdk-lib/core");
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
    static [JSII_RTTI_SYMBOL_1] = { fqn: "@aws-cdk/aws-eks-v2-alpha.KubernetesManifest", version: "0.0.0" };
    /**
     * The CloudFormation resource type.
     */
    static RESOURCE_TYPE = 'Custom::AWSCDK-EKS-KubernetesResource';
    constructor(scope, id, props) {
        super(scope, id);
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_eks_v2_alpha_KubernetesManifestProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, KubernetesManifest);
            }
            throw error;
        }
        const stack = core_1.Stack.of(this);
        const provider = kubectl_provider_1.KubectlProvider.getKubectlProvider(this, props.cluster);
        if (!provider) {
            throw new Error('Kubectl Provider is not defined in this cluster. Define it when creating the cluster');
        }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiazhzLW1hbmlmZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiazhzLW1hbmlmZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsMkNBQXlEO0FBQ3pELDJDQUE2QztBQUM3QyxxREFBNkM7QUFFN0MseURBQXFEO0FBRXJELE1BQU0sa0JBQWtCLEdBQUcsb0JBQW9CLENBQUM7QUFzR2hEOzs7Ozs7O0dBT0c7QUFDSCxNQUFhLGtCQUFtQixTQUFRLHNCQUFTOztJQUMvQzs7T0FFRztJQUNJLE1BQU0sQ0FBVSxhQUFhLEdBQUcsdUNBQXVDLENBQUM7SUFFL0UsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUE4QjtRQUN0RSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDOzs7Ozs7K0NBUFIsa0JBQWtCOzs7O1FBUzNCLE1BQU0sS0FBSyxHQUFHLFlBQUssQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDN0IsTUFBTSxRQUFRLEdBQUcsa0NBQWUsQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3pFLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUNkLE1BQU0sSUFBSSxLQUFLLENBQUMsc0ZBQXNGLENBQUMsQ0FBQztRQUMxRyxDQUFDO1FBRUQsTUFBTSxLQUFLLEdBQUcsS0FBSyxDQUFDLEtBQUssSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQztRQUNqRCxNQUFNLFVBQVUsR0FBRyxLQUFLO1lBQ3RCLENBQUMsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQztZQUN2QyxDQUFDLENBQUMsU0FBUyxDQUFDO1FBRWQsSUFBSSxLQUFLLENBQUMsVUFBVSxJQUFJLEtBQUssRUFBRSxDQUFDO1lBQzlCLElBQUksQ0FBQywyQkFBMkIsQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxnQkFBZ0IsSUFBSSwwQkFBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ2pHLENBQUM7UUFFRCxNQUFNLGNBQWMsR0FBRyxJQUFJLHFCQUFjLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRTtZQUMxRCxZQUFZLEVBQUUsUUFBUSxDQUFDLFlBQVk7WUFDbkMsWUFBWSxFQUFFLGtCQUFrQixDQUFDLGFBQWE7WUFDOUMsVUFBVSxFQUFFO2dCQUNWLHVFQUF1RTtnQkFDdkUsNkRBQTZEO2dCQUM3RCw2Q0FBNkM7Z0JBQzdDLFFBQVEsRUFBRSxLQUFLLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUM7Z0JBQzVDLFdBQVcsRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLFdBQVc7Z0JBQ3RDLFVBQVUsRUFBRSxVQUFVO2dCQUN0QixTQUFTLEVBQUUsS0FBSyxDQUFDLFNBQVM7Z0JBQzFCLGNBQWMsRUFBRSxLQUFLLENBQUMsY0FBYzthQUNyQztTQUNGLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxHQUFHLGNBQWMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDO0tBQzNEO0lBRUQ7Ozs7OztPQU1HO0lBQ0ssZ0JBQWdCLENBQUMsUUFBK0I7UUFDdEQscURBQXFEO1FBQ3JELE1BQU0sVUFBVSxHQUFHLGtCQUFrQixHQUFHLGlCQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQztRQUUzRCxLQUFLLE1BQU0sUUFBUSxJQUFJLFFBQVEsRUFBRSxDQUFDO1lBQ2hDLHNFQUFzRTtZQUN0RSxJQUFJLE9BQU0sQ0FBQyxRQUFRLENBQUMsS0FBSyxRQUFRLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUM7Z0JBQ3BELFNBQVM7WUFDWCxDQUFDO1lBRUQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsQ0FBQztnQkFDdkIsUUFBUSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7WUFDekIsQ0FBQztZQUVELElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDO2dCQUM5QixRQUFRLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7WUFDaEMsQ0FBQztZQUVELFFBQVEsQ0FBQyxRQUFRLENBQUMsTUFBTSxHQUFHO2dCQUN6QixDQUFDLFVBQVUsQ0FBQyxFQUFFLEVBQUU7Z0JBQ2hCLEdBQUcsUUFBUSxDQUFDLFFBQVEsQ0FBQyxNQUFNO2FBQzVCLENBQUM7UUFDSixDQUFDO1FBRUQsT0FBTyxVQUFVLENBQUM7S0FDbkI7SUFFRDs7OztPQUlHO0lBQ0ssMkJBQTJCLENBQUMsUUFBK0IsRUFBRSxNQUFpQjtRQUNwRixLQUFLLE1BQU0sUUFBUSxJQUFJLFFBQVEsRUFBRSxDQUFDO1lBQ2hDLHNFQUFzRTtZQUN0RSxJQUFJLE9BQU0sQ0FBQyxRQUFRLENBQUMsS0FBSyxRQUFRLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUM7Z0JBQ3BELFNBQVM7WUFDWCxDQUFDO1lBRUQsSUFBSSxRQUFRLENBQUMsSUFBSSxLQUFLLFNBQVMsRUFBRSxDQUFDO2dCQUNoQyxRQUFRLENBQUMsUUFBUSxDQUFDLFdBQVcsR0FBRztvQkFDOUIsNkJBQTZCLEVBQUUsS0FBSztvQkFDcEMsa0NBQWtDLEVBQUUsTUFBTTtvQkFDMUMsR0FBRyxRQUFRLENBQUMsUUFBUSxDQUFDLFdBQVc7aUJBQ2pDLENBQUM7WUFDSixDQUFDO1FBQ0gsQ0FBQztLQUNGOztBQWhHSCxnREFpR0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDdXN0b21SZXNvdXJjZSwgU3RhY2sgfSBmcm9tICdhd3MtY2RrLWxpYi9jb3JlJztcbmltcG9ydCB7IENvbnN0cnVjdCwgTm9kZSB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgQWxiU2NoZW1lIH0gZnJvbSAnLi9hbGItY29udHJvbGxlcic7XG5pbXBvcnQgeyBJQ2x1c3RlciB9IGZyb20gJy4vY2x1c3Rlcic7XG5pbXBvcnQgeyBLdWJlY3RsUHJvdmlkZXIgfSBmcm9tICcuL2t1YmVjdGwtcHJvdmlkZXInO1xuXG5jb25zdCBQUlVORV9MQUJFTF9QUkVGSVggPSAnYXdzLmNkay5la3MvcHJ1bmUtJztcblxuLyoqXG4gKiBPcHRpb25zIGZvciBgS3ViZXJuZXRlc01hbmlmZXN0YC5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBLdWJlcm5ldGVzTWFuaWZlc3RPcHRpb25zIHtcbiAgLyoqXG4gICAqIFdoZW4gYSByZXNvdXJjZSBpcyByZW1vdmVkIGZyb20gYSBLdWJlcm5ldGVzIG1hbmlmZXN0LCBpdCBubyBsb25nZXIgYXBwZWFyc1xuICAgKiBpbiB0aGUgbWFuaWZlc3QsIGFuZCB0aGVyZSBpcyBubyB3YXkgdG8ga25vdyB0aGF0IHRoaXMgcmVzb3VyY2UgbmVlZHMgdG8gYmVcbiAgICogZGVsZXRlZC4gVG8gYWRkcmVzcyB0aGlzLCBga3ViZWN0bCBhcHBseWAgaGFzIGEgYC0tcHJ1bmVgIG9wdGlvbiB3aGljaCB3aWxsXG4gICAqIHF1ZXJ5IHRoZSBjbHVzdGVyIGZvciBhbGwgcmVzb3VyY2VzIHdpdGggYSBzcGVjaWZpYyBsYWJlbCBhbmQgd2lsbCByZW1vdmVcbiAgICogYWxsIHRoZSBsYWJlbGQgcmVzb3VyY2VzIHRoYXQgYXJlIG5vdCBwYXJ0IG9mIHRoZSBhcHBsaWVkIG1hbmlmZXN0LiBJZiB0aGlzXG4gICAqIG9wdGlvbiBpcyBkaXNhYmxlZCBhbmQgYSByZXNvdXJjZSBpcyByZW1vdmVkLCBpdCB3aWxsIGJlY29tZSBcIm9ycGhhbmVkXCIgYW5kXG4gICAqIHdpbGwgbm90IGJlIGRlbGV0ZWQgZnJvbSB0aGUgY2x1c3Rlci5cbiAgICpcbiAgICogV2hlbiB0aGlzIG9wdGlvbiBpcyBlbmFibGVkIChkZWZhdWx0KSwgdGhlIGNvbnN0cnVjdCB3aWxsIGluamVjdCBhIGxhYmVsIHRvXG4gICAqIGFsbCBLdWJlcm5ldGVzIHJlc291cmNlcyBpbmNsdWRlZCBpbiB0aGlzIG1hbmlmZXN0IHdoaWNoIHdpbGwgYmUgdXNlZCB0b1xuICAgKiBwcnVuZSByZXNvdXJjZXMgd2hlbiB0aGUgbWFuaWZlc3QgY2hhbmdlcyB2aWEgYGt1YmVjdGwgYXBwbHkgLS1wcnVuZWAuXG4gICAqXG4gICAqIFRoZSBsYWJlbCBuYW1lIHdpbGwgYmUgYGF3cy5jZGsuZWtzL3BydW5lLTxBRERSPmAgd2hlcmUgYDxBRERSPmAgaXMgdGhlXG4gICAqIDQyLWNoYXIgdW5pcXVlIGFkZHJlc3Mgb2YgdGhpcyBjb25zdHJ1Y3QgaW4gdGhlIGNvbnN0cnVjdCB0cmVlLiBWYWx1ZSBpc1xuICAgKiBlbXB0eS5cbiAgICpcbiAgICogQHNlZVxuICAgKiBodHRwczovL2t1YmVybmV0ZXMuaW8vZG9jcy90YXNrcy9tYW5hZ2Uta3ViZXJuZXRlcy1vYmplY3RzL2RlY2xhcmF0aXZlLWNvbmZpZy8jYWx0ZXJuYXRpdmUta3ViZWN0bC1hcHBseS1mLWRpcmVjdG9yeS1wcnVuZS1sLXlvdXItbGFiZWxcbiAgICpcbiAgICogQGRlZmF1bHQgLSBiYXNlZCBvbiB0aGUgcHJ1bmUgb3B0aW9uIG9mIHRoZSBjbHVzdGVyLCB3aGljaCBpcyBgdHJ1ZWAgdW5sZXNzXG4gICAqIG90aGVyd2lzZSBzcGVjaWZpZWQuXG4gICAqL1xuICByZWFkb25seSBwcnVuZT86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIEEgZmxhZyB0byBzaWduaWZ5IGlmIHRoZSBtYW5pZmVzdCB2YWxpZGF0aW9uIHNob3VsZCBiZSBza2lwcGVkXG4gICAqXG4gICAqIEBkZWZhdWx0IGZhbHNlXG4gICAqL1xuICByZWFkb25seSBza2lwVmFsaWRhdGlvbj86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIEF1dG9tYXRpY2FsbHkgZGV0ZWN0IGBJbmdyZXNzYCByZXNvdXJjZXMgaW4gdGhlIG1hbmlmZXN0IGFuZCBhbm5vdGF0ZSB0aGVtIHNvIHRoZXlcbiAgICogYXJlIHBpY2tlZCB1cCBieSBhbiBBTEIgSW5ncmVzcyBDb250cm9sbGVyLlxuICAgKlxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKi9cbiAgcmVhZG9ubHkgaW5ncmVzc0FsYj86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFNwZWNpZnkgdGhlIEFMQiBzY2hlbWUgdGhhdCBzaG91bGQgYmUgYXBwbGllZCB0byBgSW5ncmVzc2AgcmVzb3VyY2VzLlxuICAgKiBPbmx5IGFwcGxpY2FibGUgaWYgYGluZ3Jlc3NBbGJgIGlzIHNldCB0byBgdHJ1ZWAuXG4gICAqXG4gICAqIEBkZWZhdWx0IEFsYlNjaGVtZS5JTlRFUk5BTFxuICAgKi9cbiAgcmVhZG9ubHkgaW5ncmVzc0FsYlNjaGVtZT86IEFsYlNjaGVtZTtcblxufVxuXG4vKipcbiAqIFByb3BlcnRpZXMgZm9yIEt1YmVybmV0ZXNNYW5pZmVzdFxuICovXG5leHBvcnQgaW50ZXJmYWNlIEt1YmVybmV0ZXNNYW5pZmVzdFByb3BzIGV4dGVuZHMgS3ViZXJuZXRlc01hbmlmZXN0T3B0aW9ucyB7XG4gIC8qKlxuICAgKiBUaGUgRUtTIGNsdXN0ZXIgdG8gYXBwbHkgdGhpcyBtYW5pZmVzdCB0by5cbiAgICpcbiAgICogW2Rpc2FibGUtYXdzbGludDpyZWYtdmlhLWludGVyZmFjZV1cbiAgICovXG4gIHJlYWRvbmx5IGNsdXN0ZXI6IElDbHVzdGVyO1xuXG4gIC8qKlxuICAgKiBUaGUgbWFuaWZlc3QgdG8gYXBwbHkuXG4gICAqXG4gICAqIENvbnNpc3RzIG9mIGFueSBudW1iZXIgb2YgY2hpbGQgcmVzb3VyY2VzLlxuICAgKlxuICAgKiBXaGVuIHRoZSByZXNvdXJjZXMgYXJlIGNyZWF0ZWQvdXBkYXRlZCwgdGhpcyBtYW5pZmVzdCB3aWxsIGJlIGFwcGxpZWQgdG8gdGhlXG4gICAqIGNsdXN0ZXIgdGhyb3VnaCBga3ViZWN0bCBhcHBseWAgYW5kIHdoZW4gdGhlIHJlc291cmNlcyBvciB0aGUgc3RhY2sgaXNcbiAgICogZGVsZXRlZCwgdGhlIHJlc291cmNlcyBpbiB0aGUgbWFuaWZlc3Qgd2lsbCBiZSBkZWxldGVkIHRocm91Z2ggYGt1YmVjdGwgZGVsZXRlYC5cbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogW3tcbiAgICogICBhcGlWZXJzaW9uOiAndjEnLFxuICAgKiAgIGtpbmQ6ICdQb2QnLFxuICAgKiAgIG1ldGFkYXRhOiB7IG5hbWU6ICdteXBvZCcgfSxcbiAgICogICBzcGVjOiB7XG4gICAqICAgICBjb250YWluZXJzOiBbIHsgbmFtZTogJ2hlbGxvJywgaW1hZ2U6ICdwYXVsYm91d2VyL2hlbGxvLWt1YmVybmV0ZXM6MS41JywgcG9ydHM6IFsgeyBjb250YWluZXJQb3J0OiA4MDgwIH0gXSB9IF1cbiAgICogICB9XG4gICAqIH1dXG4gICAqXG4gICAqL1xuICByZWFkb25seSBtYW5pZmVzdDogUmVjb3JkPHN0cmluZywgYW55PltdO1xuXG4gIC8qKlxuICAgKiBPdmVyd3JpdGUgYW55IGV4aXN0aW5nIHJlc291cmNlcy5cbiAgICpcbiAgICogSWYgdGhpcyBpcyBzZXQsIHdlIHdpbGwgdXNlIGBrdWJlY3RsIGFwcGx5YCBpbnN0ZWFkIG9mIGBrdWJlY3RsIGNyZWF0ZWBcbiAgICogd2hlbiB0aGUgcmVzb3VyY2UgaXMgY3JlYXRlZC4gT3RoZXJ3aXNlLCBpZiB0aGVyZSBpcyBhbHJlYWR5IGEgcmVzb3VyY2VcbiAgICogaW4gdGhlIGNsdXN0ZXIgd2l0aCB0aGUgc2FtZSBuYW1lLCB0aGUgb3BlcmF0aW9uIHdpbGwgZmFpbC5cbiAgICpcbiAgICogQGRlZmF1bHQgZmFsc2VcbiAgICovXG4gIHJlYWRvbmx5IG92ZXJ3cml0ZT86IGJvb2xlYW47XG59XG5cbi8qKlxuICogUmVwcmVzZW50cyBhIG1hbmlmZXN0IHdpdGhpbiB0aGUgS3ViZXJuZXRlcyBzeXN0ZW0uXG4gKlxuICogQWx0ZXJuYXRpdmVseSwgeW91IGNhbiB1c2UgYGNsdXN0ZXIuYWRkTWFuaWZlc3QocmVzb3VyY2VbLCByZXNvdXJjZSwgLi4uXSlgXG4gKiB0byBkZWZpbmUgcmVzb3VyY2VzIG9uIHRoaXMgY2x1c3Rlci5cbiAqXG4gKiBBcHBsaWVzL2RlbGV0ZXMgdGhlIG1hbmlmZXN0IHVzaW5nIGBrdWJlY3RsYC5cbiAqL1xuZXhwb3J0IGNsYXNzIEt1YmVybmV0ZXNNYW5pZmVzdCBleHRlbmRzIENvbnN0cnVjdCB7XG4gIC8qKlxuICAgKiBUaGUgQ2xvdWRGb3JtYXRpb24gcmVzb3VyY2UgdHlwZS5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgUkVTT1VSQ0VfVFlQRSA9ICdDdXN0b206OkFXU0NESy1FS1MtS3ViZXJuZXRlc1Jlc291cmNlJztcblxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogS3ViZXJuZXRlc01hbmlmZXN0UHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQpO1xuXG4gICAgY29uc3Qgc3RhY2sgPSBTdGFjay5vZih0aGlzKTtcbiAgICBjb25zdCBwcm92aWRlciA9IEt1YmVjdGxQcm92aWRlci5nZXRLdWJlY3RsUHJvdmlkZXIodGhpcywgcHJvcHMuY2x1c3Rlcik7XG4gICAgaWYgKCFwcm92aWRlcikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdLdWJlY3RsIFByb3ZpZGVyIGlzIG5vdCBkZWZpbmVkIGluIHRoaXMgY2x1c3Rlci4gRGVmaW5lIGl0IHdoZW4gY3JlYXRpbmcgdGhlIGNsdXN0ZXInKTtcbiAgICB9XG5cbiAgICBjb25zdCBwcnVuZSA9IHByb3BzLnBydW5lID8/IHByb3BzLmNsdXN0ZXIucHJ1bmU7XG4gICAgY29uc3QgcHJ1bmVMYWJlbCA9IHBydW5lXG4gICAgICA/IHRoaXMuaW5qZWN0UHJ1bmVMYWJlbChwcm9wcy5tYW5pZmVzdClcbiAgICAgIDogdW5kZWZpbmVkO1xuXG4gICAgaWYgKHByb3BzLmluZ3Jlc3NBbGIgPz8gZmFsc2UpIHtcbiAgICAgIHRoaXMuaW5qZWN0SW5ncmVzc0FsYkFubm90YXRpb25zKHByb3BzLm1hbmlmZXN0LCBwcm9wcy5pbmdyZXNzQWxiU2NoZW1lID8/IEFsYlNjaGVtZS5JTlRFUk5BTCk7XG4gICAgfVxuXG4gICAgY29uc3QgY3VzdG9tUmVzb3VyY2UgPSBuZXcgQ3VzdG9tUmVzb3VyY2UodGhpcywgJ1Jlc291cmNlJywge1xuICAgICAgc2VydmljZVRva2VuOiBwcm92aWRlci5zZXJ2aWNlVG9rZW4sXG4gICAgICByZXNvdXJjZVR5cGU6IEt1YmVybmV0ZXNNYW5pZmVzdC5SRVNPVVJDRV9UWVBFLFxuICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAvLyBgdG9Kc29uU3RyaW5nYCBlbmFibGVzIGVtYmVkZGluZyBDREsgdG9rZW5zIGluIHRoZSBtYW5pZmVzdCBhbmQgd2lsbFxuICAgICAgICAvLyByZW5kZXIgYSBDbG91ZEZvcm1hdGlvbi1jb21wYXRpYmxlIEpTT04gc3RyaW5nIChzaW1pbGFyIHRvXG4gICAgICAgIC8vIFN0ZXBGdW5jdGlvbnMsIENsb3VkV2F0Y2ggRGFzaGJvYXJkcyBldGMpLlxuICAgICAgICBNYW5pZmVzdDogc3RhY2sudG9Kc29uU3RyaW5nKHByb3BzLm1hbmlmZXN0KSxcbiAgICAgICAgQ2x1c3Rlck5hbWU6IHByb3BzLmNsdXN0ZXIuY2x1c3Rlck5hbWUsXG4gICAgICAgIFBydW5lTGFiZWw6IHBydW5lTGFiZWwsXG4gICAgICAgIE92ZXJ3cml0ZTogcHJvcHMub3ZlcndyaXRlLFxuICAgICAgICBTa2lwVmFsaWRhdGlvbjogcHJvcHMuc2tpcFZhbGlkYXRpb24sXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgdGhpcy5ub2RlLmRlZmF1bHRDaGlsZCA9IGN1c3RvbVJlc291cmNlLm5vZGUuZGVmYXVsdENoaWxkO1xuICB9XG5cbiAgLyoqXG4gICAqIEluamVjdHMgYSBnZW5lcmF0ZWQgcHJ1bmUgbGFiZWwgdG8gYWxsIHJlc291cmNlcyBpbiB0aGlzIG1hbmlmZXN0LiBUaGVcbiAgICogbGFiZWwgbmFtZSB3aWxsIGJlIGBhd3NjZGsuZWtzL21hbmlmZXN0LUFERFJgIHdoZXJlIGBBRERSYCBpcyB0aGUgYWRkcmVzc1xuICAgKiBvZiB0aGUgY29uc3RydWN0IGluIHRoZSBjb25zdHJ1Y3QgdHJlZS5cbiAgICpcbiAgICogQHJldHVybnMgdGhlIGxhYmVsIG5hbWVcbiAgICovXG4gIHByaXZhdGUgaW5qZWN0UHJ1bmVMYWJlbChtYW5pZmVzdDogUmVjb3JkPHN0cmluZywgYW55PltdKTogc3RyaW5nIHtcbiAgICAvLyBtYXggbGFiZWwgbmFtZSBpcyA2NCBjaGFycyBhbmQgYWRkcnMgaXMgYWx3YXlzIDQyLlxuICAgIGNvbnN0IHBydW5lTGFiZWwgPSBQUlVORV9MQUJFTF9QUkVGSVggKyBOb2RlLm9mKHRoaXMpLmFkZHI7XG5cbiAgICBmb3IgKGNvbnN0IHJlc291cmNlIG9mIG1hbmlmZXN0KSB7XG4gICAgICAvLyBza2lwIHJlc291cmNlIGlmIGl0J3Mgbm90IGFuIG9iamVjdCBvciBpZiBpdCBkb2VzIG5vdCBoYXZlIGEgXCJraW5kXCJcbiAgICAgIGlmICh0eXBlb2YocmVzb3VyY2UpICE9PSAnb2JqZWN0JyB8fCAhcmVzb3VyY2Uua2luZCkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFyZXNvdXJjZS5tZXRhZGF0YSkge1xuICAgICAgICByZXNvdXJjZS5tZXRhZGF0YSA9IHt9O1xuICAgICAgfVxuXG4gICAgICBpZiAoIXJlc291cmNlLm1ldGFkYXRhLmxhYmVscykge1xuICAgICAgICByZXNvdXJjZS5tZXRhZGF0YS5sYWJlbHMgPSB7fTtcbiAgICAgIH1cblxuICAgICAgcmVzb3VyY2UubWV0YWRhdGEubGFiZWxzID0ge1xuICAgICAgICBbcHJ1bmVMYWJlbF06ICcnLFxuICAgICAgICAuLi5yZXNvdXJjZS5tZXRhZGF0YS5sYWJlbHMsXG4gICAgICB9O1xuICAgIH1cblxuICAgIHJldHVybiBwcnVuZUxhYmVsO1xuICB9XG5cbiAgLyoqXG4gICAqIEluamVjdCB0aGUgbmVjZXNzYXJ5IGluZ3Jlc3MgYW5ub250YXRpb25zIGlmIHBvc3NpYmxlIChhbmQgcmVxdWVzdGVkKS5cbiAgICpcbiAgICogQHNlZSBodHRwczovL2t1YmVybmV0ZXMtc2lncy5naXRodWIuaW8vYXdzLWxvYWQtYmFsYW5jZXItY29udHJvbGxlci92Mi4yL2d1aWRlL2luZ3Jlc3MvYW5ub3RhdGlvbnMvXG4gICAqL1xuICBwcml2YXRlIGluamVjdEluZ3Jlc3NBbGJBbm5vdGF0aW9ucyhtYW5pZmVzdDogUmVjb3JkPHN0cmluZywgYW55PltdLCBzY2hlbWU6IEFsYlNjaGVtZSkge1xuICAgIGZvciAoY29uc3QgcmVzb3VyY2Ugb2YgbWFuaWZlc3QpIHtcbiAgICAgIC8vIHNraXAgcmVzb3VyY2UgaWYgaXQncyBub3QgYW4gb2JqZWN0IG9yIGlmIGl0IGRvZXMgbm90IGhhdmUgYSBcImtpbmRcIlxuICAgICAgaWYgKHR5cGVvZihyZXNvdXJjZSkgIT09ICdvYmplY3QnIHx8ICFyZXNvdXJjZS5raW5kKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAocmVzb3VyY2Uua2luZCA9PT0gJ0luZ3Jlc3MnKSB7XG4gICAgICAgIHJlc291cmNlLm1ldGFkYXRhLmFubm90YXRpb25zID0ge1xuICAgICAgICAgICdrdWJlcm5ldGVzLmlvL2luZ3Jlc3MuY2xhc3MnOiAnYWxiJyxcbiAgICAgICAgICAnYWxiLmluZ3Jlc3Mua3ViZXJuZXRlcy5pby9zY2hlbWUnOiBzY2hlbWUsXG4gICAgICAgICAgLi4ucmVzb3VyY2UubWV0YWRhdGEuYW5ub3RhdGlvbnMsXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfVxuICB9XG59XG4iXX0=