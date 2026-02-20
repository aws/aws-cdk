import { Construct } from 'constructs';
import type { ICluster } from './cluster';
import { KubectlProvider } from './kubectl-provider';
import { CustomResource, Stack, ValidationError } from '../../core';
import type { RemovalPolicy } from '../../core';

/**
 * Properties for KubernetesPatch
 */
export interface KubernetesPatchProps {
  /**
   * The cluster to apply the patch to.
   * [disable-awslint:ref-via-interface]
   */
  readonly cluster: ICluster;

  /**
   * The JSON object to pass to `kubectl patch` when the resource is created/updated.
   */
  readonly applyPatch: { [key: string]: any };

  /**
   * The JSON object to pass to `kubectl patch` when the resource is removed.
   */
  readonly restorePatch: { [key: string]: any };

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

  /**
   * The patch type to pass to `kubectl patch`.
   * The default type used by `kubectl patch` is "strategic".
   *
   * @default PatchType.STRATEGIC
   */
  readonly patchType?: PatchType;

  /**
   * The removal policy applied to the custom resource that manages the Kubernetes patch.
   *
   * The removal policy controls what happens to the resource if it stops being managed by CloudFormation.
   * This can happen in one of three situations:
   *
   * - The resource is removed from the template, so CloudFormation stops managing it
   * - A change to the resource is made that requires it to be replaced, so CloudFormation stops managing it
   * - The stack is deleted, so CloudFormation stops managing all resources in it
   *
   * @default RemovalPolicy.DESTROY
   */
  readonly removalPolicy?: RemovalPolicy;
}

/**
 * Values for `kubectl patch` --type argument
 */
export enum PatchType {
  /**
   * JSON Patch, RFC 6902
   */
  JSON = 'json',
  /**
   * JSON Merge patch
   */
  MERGE = 'merge',
  /**
   * Strategic merge patch
   */
  STRATEGIC = 'strategic',
}

/**
 * A CloudFormation resource which applies/restores a JSON patch into a
 * Kubernetes resource.
 * @see https://kubernetes.io/docs/tasks/run-application/update-api-object-kubectl-patch/
 */
export class KubernetesPatch extends Construct {
  constructor(scope: Construct, id: string, props: KubernetesPatchProps) {
    super(scope, id);

    const stack = Stack.of(this);

    const provider = KubectlProvider.getKubectlProvider(this, props.cluster);
    if (!provider) {
      throw new ValidationError('Kubectl Provider is not defined in this cluster. Define it when creating the cluster', this);
    }

    new CustomResource(this, 'Resource', {
      serviceToken: provider.serviceToken,
      resourceType: 'Custom::AWSCDK-EKS-KubernetesPatch',
      removalPolicy: props.removalPolicy,
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
