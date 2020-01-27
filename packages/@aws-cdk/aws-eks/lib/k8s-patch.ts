import { CustomResource } from "@aws-cdk/aws-cloudformation";
import { Construct, Stack } from "@aws-cdk/core";
import { Cluster } from "./cluster";
import { KubectlProvider } from "./kubectl-provider";

export interface CoreDnsComputeTypeProps {
  /**
   * The cluster to apply the patch to.
   */
  readonly cluster: Cluster;

  /**
   * The JSON object to pass to `kubectl patch` when the resource is created/updated.
   */
  readonly applyPatch: any;

  /**
   * The JSON object to pass to `kubectl patch` when the resource is removed.
   */
  readonly restorePatch: any;

  /**
   * The full name of the resource to patch (e.g. `deployment/coredns`).
   */
  readonly resourceName: string;

  /**
   * The kubernetes API namespace
   *
   * @default "default"
   */
  readonly resourceNamespace?: string;
}

/**
 * A CloudFormation resource which applies/restores a JSON patch into a
 * Kubernetes resource.
 */
export class KubernetesPatch extends Construct {
  constructor(scope: Construct, id: string, props: CoreDnsComputeTypeProps) {
    super(scope, id);

    const stack = Stack.of(this);
    const provider = KubectlProvider.getOrCreate(stack);

    new CustomResource(this, 'Resource', {
      provider: provider.provider,
      resourceType: 'Custom::AWSCDK-EKS-KubernetesPatch',
      properties: {
        ResourceName: props.resourceName,
        ResourceNamespace: props.resourceNamespace ?? 'default',
        ApplyPatchJson: stack.toJsonString(props.applyPatch),
        RestorePatchJson: stack.toJsonString(props.restorePatch),
        ClusterName: props.cluster.clusterName,
        RoleArn: props.cluster._getKubectlCreationRoleArn(provider.role)
      }
    });
  }
}