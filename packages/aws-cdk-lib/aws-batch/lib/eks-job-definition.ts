import type { Construct } from 'constructs';
import { CfnJobDefinition } from './batch.generated';
import type { EksContainerDefinition, EksSeccompProfile } from './eks-container-definition';
import { EmptyDirVolume, HostPathVolume, SecretPathVolume } from './eks-container-definition';
import type { IJobDefinition, JobDefinitionProps } from './job-definition-base';
import { baseJobDefinitionProperties, JobDefinitionBase } from './job-definition-base';
import { ArnFormat, Stack, Token, ValidationError } from '../../core';
import { memoizedGetter } from '../../core/lib/helpers-internal';
import { addConstructMetadata } from '../../core/lib/metadata-resource';
import { lit } from '../../core/lib/private/literal-string';
import { propertyInjectable } from '../../core/lib/prop-injectable';

/**
 * A JobDefinition that uses Eks orchestration
 */
export interface IEksJobDefinition extends IJobDefinition {
  /**
   * The container this Job Definition will run
   */
  readonly container: EksContainerDefinition;

  /**
   * The DNS Policy of the pod used by this Job Definition
   *
   * @see https://kubernetes.io/docs/concepts/services-networking/dns-pod-service/#pod-s-dns-policy
   *
   * @default `DnsPolicy.CLUSTER_FIRST`
   */
  readonly dnsPolicy?: DnsPolicy;

  /**
   * If specified, the Pod used by this Job Definition will use the host's network IP address.
   * Otherwise, the Kubernetes pod networking model is enabled.
   * Most AWS Batch workloads are egress-only and don't require the overhead of IP allocation for each pod for incoming connections.
   *
   * @default true
   *
   * @see https://kubernetes.io/docs/concepts/security/pod-security-policy/#host-namespaces
   * @see https://kubernetes.io/docs/concepts/workloads/pods/#pod-networking
   */
  readonly useHostNetwork?: boolean;

  /**
   * The name of the service account that's used to run the container.
   * service accounts are Kubernetes method of identification and authentication,
   * roughly analogous to IAM users.
   *
   * @see https://docs.aws.amazon.com/eks/latest/userguide/service-accounts.html
   * @see https://kubernetes.io/docs/tasks/configure-pod-container/configure-service-account/
   * @see https://docs.aws.amazon.com/eks/latest/userguide/associate-service-account-role.html
   *
   * @default - the default service account of the container
   */
  readonly serviceAccount?: string;

  /**
   * The security context of the pod.
   *
   * The settings apply to every container in the pod that doesn't set its own value.
   * Note that the container always sets `runAsNonRoot` (`true` unless `runAsRoot` is `true`
   * on the container), so the pod-level `runAsNonRoot` has no effect on it.
   *
   * @see https://kubernetes.io/docs/tasks/configure-pod-container/security-context/#set-the-security-context-for-a-pod
   *
   * @default - no pod-level security context
   */
  readonly podSecurityContext?: EksPodSecurityContext;
}

/**
 * Props for EksJobDefinition
 */
export interface EksJobDefinitionProps extends JobDefinitionProps {
  /**
   * The container this Job Definition will run
   */
  readonly container: EksContainerDefinition;

  /**
   * The DNS Policy of the pod used by this Job Definition
   *
   * @see https://kubernetes.io/docs/concepts/services-networking/dns-pod-service/#pod-s-dns-policy
   *
   * @default `DnsPolicy.CLUSTER_FIRST`
   */
  readonly dnsPolicy?: DnsPolicy;

  /**
   * If specified, the Pod used by this Job Definition will use the host's network IP address.
   * Otherwise, the Kubernetes pod networking model is enabled.
   * Most AWS Batch workloads are egress-only and don't require the overhead of IP allocation for each pod for incoming connections.
   *
   * @default true
   *
   * @see https://kubernetes.io/docs/concepts/security/pod-security-policy/#host-namespaces
   * @see https://kubernetes.io/docs/concepts/workloads/pods/#pod-networking
   */
  readonly useHostNetwork?: boolean;

  /**
   * The name of the service account that's used to run the container.
   * service accounts are Kubernetes method of identification and authentication,
   * roughly analogous to IAM users.
   *
   * @see https://docs.aws.amazon.com/eks/latest/userguide/service-accounts.html
   * @see https://kubernetes.io/docs/tasks/configure-pod-container/configure-service-account/
   * @see https://docs.aws.amazon.com/eks/latest/userguide/associate-service-account-role.html
   *
   * @default - the default service account of the container
   */
  readonly serviceAccount?: string;

  /**
   * The security context of the pod.
   *
   * The settings apply to every container in the pod that doesn't set its own value.
   * Note that the container always sets `runAsNonRoot` (`true` unless `runAsRoot` is `true`
   * on the container), so the pod-level `runAsNonRoot` has no effect on it.
   *
   * @see https://kubernetes.io/docs/tasks/configure-pod-container/security-context/#set-the-security-context-for-a-pod
   *
   * @default - no pod-level security context
   */
  readonly podSecurityContext?: EksPodSecurityContext;
}

/**
 * The security context of the pod used by an EKS Job Definition.
 *
 * @see https://docs.aws.amazon.com/batch/latest/APIReference/API_EksPodSecurityContext.html
 */
export interface EksPodSecurityContext {
  /**
   * A supplemental group that is applied to all containers in the pod.
   * Some volume types let Kubernetes change the ownership of the volume contents to this group.
   *
   * Between 0 and 2147483647.
   *
   * @default - no supplemental group
   */
  readonly fsGroup?: number;

  /**
   * The user ID that runs the containers in the pod when a container doesn't set its own.
   *
   * Between 0 and 2147483647.
   *
   * @default - the user that is specified in the image metadata
   */
  readonly runAsUser?: number;

  /**
   * The primary group ID that runs the containers in the pod when a container doesn't set its own.
   *
   * Between 0 and 2147483647.
   *
   * @default - the group that is specified in the image metadata
   */
  readonly runAsGroup?: number;

  /**
   * Whether Kubernetes checks that the containers in the pod don't run as the root user,
   * unless a container sets its own value.
   *
   * `EksContainerDefinition` always sets this on the container, so this value has no
   * effect on it. Use `runAsRoot` on the container instead.
   *
   * @default - not set at the pod level
   */
  readonly runAsNonRoot?: boolean;

  /**
   * The default seccomp profile of the containers in the pod.
   * A container-level profile overrides it.
   *
   * @default - the container runtime's default behavior
   */
  readonly seccompProfile?: EksSeccompProfile;
}

/**
 * The DNS Policy for the pod used by the Job Definition
 *
 * @see https://kubernetes.io/docs/concepts/services-networking/dns-pod-service/#pod-s-dns-policy
 */
export enum DnsPolicy {
  /**
   * The Pod inherits the name resolution configuration from the node that the Pods run on
   */
  DEFAULT = 'Default',

  /**
   * Any DNS query that does not match the configured cluster domain suffix, such as `"www.kubernetes.io"`,
   * is forwarded to an upstream nameserver by the DNS server.
   * Cluster administrators may have extra stub-domain and upstream DNS servers configured.
   */
  CLUSTER_FIRST = 'ClusterFirst',

  /**
   * For Pods running with `hostNetwork`, you should explicitly set its DNS policy to `CLUSTER_FIRST_WITH_HOST_NET`.
   * Otherwise, Pods running with `hostNetwork` and `CLUSTER_FIRST` will fallback to the behavior of the `DEFAULT` policy.
   */
  CLUSTER_FIRST_WITH_HOST_NET = 'ClusterFirstWithHostNet',
}

/**
 * A JobDefinition that uses Eks orchestration
 *
 * @resource AWS::Batch::JobDefinition
 */
@propertyInjectable
export class EksJobDefinition extends JobDefinitionBase implements IEksJobDefinition {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = 'aws-cdk-lib.aws-batch.EksJobDefinition';

  /**
   * Import an EksJobDefinition by its arn
   */
  public static fromEksJobDefinitionArn(scope: Construct, id: string, eksJobDefinitionArn: string): IEksJobDefinition {
    const stack = Stack.of(scope);
    const jobDefinitionName = stack.splitArn(eksJobDefinitionArn, ArnFormat.SLASH_RESOURCE_NAME).resourceName!;

    class Import extends JobDefinitionBase implements IJobDefinition {
      public readonly jobDefinitionArn = eksJobDefinitionArn;
      public readonly jobDefinitionName = jobDefinitionName;
      public readonly enabled = true;
      public readonly container = {} as any;
    }

    return new Import(scope, id);
  }

  public readonly container: EksContainerDefinition;
  public readonly dnsPolicy?: DnsPolicy;
  public readonly useHostNetwork?: boolean;
  public readonly serviceAccount?: string;
  public readonly podSecurityContext?: EksPodSecurityContext;

  private readonly resource: CfnJobDefinition;

  @memoizedGetter
  public get jobDefinitionArn(): string {
    return this.getResourceArnAttribute(this.resource.ref, {
      service: 'batch',
      resource: 'job-definition',
      resourceName: this.physicalName,
    });
  }

  @memoizedGetter
  public get jobDefinitionName(): string {
    return this.getResourceNameAttribute(this.resource.ref);
  }

  constructor(scope: Construct, id: string, props: EksJobDefinitionProps) {
    super(scope, id, props);
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    this.container = props.container;
    this.dnsPolicy = props.dnsPolicy;
    this.useHostNetwork = props.useHostNetwork;
    this.serviceAccount = props.serviceAccount;
    this.podSecurityContext = props.podSecurityContext;
    this.validatePodSecurityContext(this.podSecurityContext);

    this.resource = new CfnJobDefinition(this, 'Resource', {
      ...baseJobDefinitionProperties(this),
      type: 'container',
      jobDefinitionName: props.jobDefinitionName,
      eksProperties: {
        podProperties: {
          containers: [
            this.container._renderContainerDefinition(),
          ],
          dnsPolicy: this.dnsPolicy,
          hostNetwork: this.useHostNetwork,
          serviceAccountName: this.serviceAccount,
          securityContext: this.renderPodSecurityContext(),
          volumes: this.container._mapVolumes((volume) => {
            if (EmptyDirVolume.isEmptyDirVolume(volume)) {
              return {
                name: volume.name,
                emptyDir: {
                  medium: volume.medium,
                  sizeLimit: volume.sizeLimit ? volume.sizeLimit.toMebibytes().toString() + 'Mi' : undefined,
                },
              };
            }
            if (HostPathVolume.isHostPathVolume(volume)) {
              return {
                name: volume.name,
                hostPath: {
                  path: volume.path,
                },
              };
            }
            if (SecretPathVolume.isSecretPathVolume(volume)) {
              return {
                name: volume.name,
                secret: {
                  optional: volume.optional,
                  secretName: volume.secretName,
                },
              };
            }

            throw new ValidationError(lit`UnknownVolumeType`, 'unknown volume type', this);
          }),
        },
      },
    });
  }

  private validatePodSecurityContext(context?: EksPodSecurityContext) {
    if (!context) {
      return;
    }
    for (const [name, value] of [['fsGroup', context.fsGroup], ['runAsUser', context.runAsUser], ['runAsGroup', context.runAsGroup]] as const) {
      if (value === undefined || Token.isUnresolved(value)) {
        continue;
      }
      if (!Number.isInteger(value) || value < 0 || value > 2147483647) {
        throw new ValidationError(lit`InvalidPodSecurityContextId`, `'podSecurityContext.${name}' must be an integer between 0 and 2147483647, got ${value}`, this);
      }
    }
  }

  private renderPodSecurityContext(): CfnJobDefinition.EksPodSecurityContextProperty | undefined {
    const context = this.podSecurityContext;
    if (!context || Object.values(context).every(value => value === undefined)) {
      return undefined;
    }
    return {
      fsGroup: context.fsGroup,
      runAsUser: context.runAsUser,
      runAsGroup: context.runAsGroup,
      runAsNonRoot: context.runAsNonRoot,
      seccompProfile: context.seccompProfile?._render(),
    };
  }
}
