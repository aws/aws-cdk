import { Construct, IConstruct } from 'constructs';
import { CfnJobDefinition } from './batch.generated';
import * as ecs from '../../aws-ecs';
import { Lazy, Size } from '../../core';

const EMPTY_DIR_VOLUME_SYMBOL = Symbol.for('aws-cdk-lib/aws-batch/lib/eks-container-definition.EmptyDirVolume');
const HOST_PATH_VOLUME_SYMBOL = Symbol.for('aws-cdk-lib/aws-batch/lib/eks-container-definition.HostPathVolume');
const SECRET_PATH_VOLUME_SYMBOL = Symbol.for('aws-cdk-lib/aws-batch/lib/eks-container-definition.SecretVolume');

/**
 * A container that can be run with EKS orchestration on EC2 resources
 */
export interface IEksContainerDefinition extends IConstruct {
  /**
   * The image that this container will run
   */
  readonly image: ecs.ContainerImage;

  /**
   * An array of arguments to the entrypoint.
   * If this isn't specified, the CMD of the container image is used.
   * This corresponds to the args member in the Entrypoint portion of the Pod in Kubernetes.
   * Environment variable references are expanded using the container's environment.
   * If the referenced environment variable doesn't exist, the reference in the command isn't changed.
   * For example, if the reference is to "$(NAME1)" and the NAME1 environment variable doesn't exist,
   * the command string will remain "$(NAME1)." $$ is replaced with $, and the resulting string isn't expanded.
   * or example, $$(VAR_NAME) is passed as $(VAR_NAME) whether or not the VAR_NAME environment variable exists.
   *
   * @see https://docs.docker.com/engine/reference/builder/#cmd
   * @see https://kubernetes.io/docs/tasks/inject-data-application/define-command-argument-container/
   */
  readonly args?: string[];

  /**
   * The entrypoint for the container. This isn't run within a shell.
   * If this isn't specified, the `ENTRYPOINT` of the container image is used.
   * Environment variable references are expanded using the container's environment.
   * If the referenced environment variable doesn't exist, the reference in the command isn't changed.
   * For example, if the reference is to `"$(NAME1)"` and the `NAME1` environment variable doesn't exist,
   * the command string will remain `"$(NAME1)."` `$$` is replaced with `$` and the resulting string isn't expanded.
   * For example, `$$(VAR_NAME)` will be passed as `$(VAR_NAME)` whether or not the `VAR_NAME` environment variable exists.

   * The entrypoint can't be updated.
   *
   * @see https://docs.docker.com/engine/reference/builder/#entrypoint
   * @see https://kubernetes.io/docs/tasks/inject-data-application/define-command-argument-container/
   * @see https://kubernetes.io/docs/reference/kubernetes-api/workload-resources/pod-v1/#entrypoint
   */
  readonly command?: string[];

  /**
   * The environment variables to pass to this container.
   *
   * *Note*: Environment variables cannot start with "AWS_BATCH".
   * This naming convention is reserved for variables that AWS Batch sets.
   */
  readonly env?: { [key:string]: string };

  /**
   * The image pull policy for this container
   *
   * @see https://kubernetes.io/docs/concepts/containers/images/#updating-images
   *
   * @default - `ALWAYS` if the `:latest` tag is specified, `IF_NOT_PRESENT` otherwise
   */
  readonly imagePullPolicy?: ImagePullPolicy;

  /**
   * The name of this container
   *
   * @default: `'Default'`
   */
  readonly name?: string;

  /**
   * The amount (in MiB) of memory to present to the container.
   * If your container attempts to exceed the allocated memory, it will be terminated.
   *
   * Must be larger that 4 MiB
   *
   * At least one of `memoryLimit` and `memoryReservation` is required
   *
   * *Note*: To maximize your resource utilization, provide your jobs with as much memory as possible
   * for the specific instance type that you are using.
   *
   * @see https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/
   * @see https://docs.aws.amazon.com/batch/latest/userguide/memory-management.html
   *
   * @default - No memory limit
   */
  readonly memoryLimit?: Size;

  /**
   * The soft limit (in MiB) of memory to reserve for the container.
   * Your container will be given at least this much memory, but may consume more.
   *
   * Must be larger that 4 MiB
   *
   * When system memory is under heavy contention, Docker attempts to keep the
   * container memory to this soft limit. However, your container can consume more
   * memory when it needs to, up to either the hard limit specified with the memory
   * parameter (if applicable), or all of the available memory on the container
   * instance, whichever comes first.
   *
   * At least one of `memoryLimit` and `memoryReservation` is required.
   * If both are specified, then `memoryLimit` must be equal to `memoryReservation`
   *
   * *Note*: To maximize your resource utilization, provide your jobs with as much memory as possible
   * for the specific instance type that you are using.
   *
   * @see https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/
   * @see https://docs.aws.amazon.com/batch/latest/userguide/memory-management.html
   *
   * @default - No memory reserved
   */
  readonly memoryReservation?: Size;

  /**
   * The hard limit of CPUs to present to this container.
   * Must be an even multiple of 0.25
   *
   * If your container attempts to exceed this limit, it will be terminated.
   *
   * At least one of `cpuReservation` and `cpuLimit` is required.
   * If both are specified, then `cpuLimit` must be at least as large as `cpuReservation`.
   *
   * @see https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/
   *
   * @default - No CPU limit
   */
  readonly cpuLimit?: number;

  /**
   * The soft limit of CPUs to reserve for the container
   * Must be an even multiple of 0.25
   *
   * The container will given at least this many CPUs, but may consume more.
   *
   * At least one of `cpuReservation` and `cpuLimit` is required.
   * If both are specified, then `cpuLimit` must be at least as large as `cpuReservation`.
   *
   * @see https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/
   *
   * @default - No CPUs reserved
   */
  readonly cpuReservation?: number;

  /**
   * The hard limit of GPUs to present to this container.
   *
   * If your container attempts to exceed this limit, it will be terminated.
   *
   * If both `gpuReservation` and `gpuLimit` are specified, then `gpuLimit` must be equal to `gpuReservation`.
   *
   * @see https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/
   *
   * @default - No GPU limit
   */
  readonly gpuLimit?: number;

  /**
   * The soft limit of CPUs to reserve for the container
   * Must be an even multiple of 0.25
   *
   * The container will given at least this many CPUs, but may consume more.
   *
   * If both `gpuReservation` and `gpuLimit` are specified, then `gpuLimit` must be equal to `gpuReservation`.
   *
   * @see https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/
   *
   * @default - No GPUs reserved
   */
  readonly gpuReservation?: number;

  /**
   * If specified, gives this container elevated permissions on the host container instance.
   * The level of permissions are similar to the root user permissions.
   *
   * This parameter maps to `privileged` policy in the Privileged pod security policies in the Kubernetes documentation.
   *
   * *Note*: this is only compatible with Kubernetes < v1.25
   *
   * @see https://kubernetes.io/docs/concepts/security/pod-security-policy/#volumes-and-file-systems
   *
   * @default false
   */
  readonly privileged?: boolean;

  /**
   * If specified, gives this container readonly access to its root file system.
   *
   * This parameter maps to `ReadOnlyRootFilesystem` policy in the Volumes and file systems pod security policies in the Kubernetes documentation.
   *
   * *Note*: this is only compatible with Kubernetes < v1.25
   *
   * @see https://kubernetes.io/docs/concepts/security/pod-security-policy/#volumes-and-file-systems
   *
   * @default false
   */
  readonly readonlyRootFilesystem?: boolean;

  /**
   * If specified, the container is run as the specified group ID (`gid`).
   * If this parameter isn't specified, the default is the group that's specified in the image metadata.
   * This parameter maps to `RunAsGroup` and `MustRunAs` policy in the Users and groups pod security policies in the Kubernetes documentation.
   *
   * *Note*: this is only compatible with Kubernetes < v1.25
   *
   * @see https://kubernetes.io/docs/concepts/security/pod-security-policy/#users-and-groups
   *
   * @default none
   */
  readonly runAsGroup?: number;

  /**
   * If specified, the container is run as a user with a `uid` other than 0. Otherwise, no such rule is enforced.
   * This parameter maps to `RunAsUser` and `MustRunAsNonRoot` policy in the Users and groups pod security policies in the Kubernetes documentation.
   *
   * *Note*: this is only compatible with Kubernetes < v1.25
   *
   * @see https://kubernetes.io/docs/concepts/security/pod-security-policy/#users-and-groups
   *
   * @default - the container is *not* required to run as a non-root user
   */
  readonly runAsRoot?: boolean;

  /**
   * If specified, this container is run as the specified user ID (`uid`).
   * This parameter maps to `RunAsUser` and `MustRunAs` policy in the Users and groups pod security policies in the Kubernetes documentation.
   *
   * *Note*: this is only compatible with Kubernetes < v1.25
   *
   * @see https://kubernetes.io/docs/concepts/security/pod-security-policy/#users-and-groups
   *
   * @default - the user that is specified in the image metadata.
   */
  readonly runAsUser?: number;

  /**
   * The Volumes to mount to this container.
   * Automatically added to the Pod.
   *
   * @see https://kubernetes.io/docs/concepts/storage/volumes/
   */
  readonly volumes: EksVolume[];

  /**
   * Mount a Volume to this container. Automatically added to the Pod.
   */
  addVolume(volume: EksVolume): void;
}

/**
 * Determines when the image is pulled from the registry to launch a container
 */
export enum ImagePullPolicy {
  /**
   * Every time the kubelet launches a container,
   * the kubelet queries the container image registry to resolve the name to an image digest.
   * If the kubelet has a container image with that exact digest cached locally,
   * the kubelet uses its cached image; otherwise, the kubelet pulls the image with the resolved digest,
   * and uses that image to launch the container.
   *
   * @see https://docs.docker.com/engine/reference/commandline/pull/#pull-an-image-by-digest-immutable-identifier
   */
  ALWAYS = 'Always',

  /**
   * The image is pulled only if it is not already present locally
   */
  IF_NOT_PRESENT = 'IfNotPresent',

  /**
   * The kubelet does not try fetching the image.
   * If the image is somehow already present locally,
   * the kubelet attempts to start the container; otherwise, startup fails.
   * See pre-pulled images for more details.
   *
   * @see https://kubernetes.io/docs/concepts/containers/images/#pre-pulled-images
   */
  NEVER = 'Never',
}

/**
 * Props to configure an EksContainerDefinition
 */
export interface EksContainerDefinitionProps {
  /**
   * The image that this container will run
   */
  readonly image: ecs.ContainerImage;

  /**
   * An array of arguments to the entrypoint.
   * If this isn't specified, the CMD of the container image is used.
   * This corresponds to the args member in the Entrypoint portion of the Pod in Kubernetes.
   * Environment variable references are expanded using the container's environment.
   * If the referenced environment variable doesn't exist, the reference in the command isn't changed.
   * For example, if the reference is to "$(NAME1)" and the NAME1 environment variable doesn't exist,
   * the command string will remain "$(NAME1)." $$ is replaced with $, and the resulting string isn't expanded.
   * or example, $$(VAR_NAME) is passed as $(VAR_NAME) whether or not the VAR_NAME environment variable exists.
   *
   * @see https://docs.docker.com/engine/reference/builder/#cmd
   * @see https://kubernetes.io/docs/tasks/inject-data-application/define-command-argument-container/
   *
   * @default - no args
   */
  readonly args?: string[];

  /**
   * The entrypoint for the container. This isn't run within a shell.
   * If this isn't specified, the `ENTRYPOINT` of the container image is used.
   * Environment variable references are expanded using the container's environment.
   * If the referenced environment variable doesn't exist, the reference in the command isn't changed.
   * For example, if the reference is to `"$(NAME1)"` and the `NAME1` environment variable doesn't exist,
   * the command string will remain `"$(NAME1)."` `$$` is replaced with `$` and the resulting string isn't expanded.
   * For example, `$$(VAR_NAME)` will be passed as `$(VAR_NAME)` whether or not the `VAR_NAME` environment variable exists.

   * The entrypoint can't be updated.
   *
   * @see https://docs.docker.com/engine/reference/builder/#entrypoint
   * @see https://kubernetes.io/docs/tasks/inject-data-application/define-command-argument-container/
   * @see https://kubernetes.io/docs/reference/kubernetes-api/workload-resources/pod-v1/#entrypoint
   *
   * @default - no command
   */
  readonly command?: string[];

  /**
   * The environment variables to pass to this container.
   *
   * *Note*: Environment variables cannot start with "AWS_BATCH".
   * This naming convention is reserved for variables that AWS Batch sets.
   *
   * @default - no environment variables
   */
  readonly env?: { [key:string]: string };

  /**
   * The image pull policy for this container
   *
   * @see https://kubernetes.io/docs/concepts/containers/images/#updating-images
   *
   * @default - `ALWAYS` if the `:latest` tag is specified, `IF_NOT_PRESENT` otherwise
   */
  readonly imagePullPolicy?: ImagePullPolicy;

  /**
   * The name of this container
   *
   * @default: `'Default'`
   */
  readonly name?: string;

  /**
   * The amount (in MiB) of memory to present to the container.
   * If your container attempts to exceed the allocated memory, it will be terminated.
   *
   * Must be larger that 4 MiB
   *
   * At least one of `memoryLimit` and `memoryReservation` is required
   *
   * *Note*: To maximize your resource utilization, provide your jobs with as much memory as possible
   * for the specific instance type that you are using.
   *
   * @see https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/
   * @see https://docs.aws.amazon.com/batch/latest/userguide/memory-management.html
   *
   * @default - No memory limit
   */
  readonly memoryLimit?: Size;

  /**
   * The soft limit (in MiB) of memory to reserve for the container.
   * Your container will be given at least this much memory, but may consume more.
   *
   * Must be larger that 4 MiB
   *
   * When system memory is under heavy contention, Docker attempts to keep the
   * container memory to this soft limit. However, your container can consume more
   * memory when it needs to, up to either the hard limit specified with the memory
   * parameter (if applicable), or all of the available memory on the container
   * instance, whichever comes first.
   *
   * At least one of `memoryLimit` and `memoryReservation` is required.
   * If both are specified, then `memoryLimit` must be equal to `memoryReservation`
   *
   * *Note*: To maximize your resource utilization, provide your jobs with as much memory as possible
   * for the specific instance type that you are using.
   *
   * @see https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/
   * @see https://docs.aws.amazon.com/batch/latest/userguide/memory-management.html
   *
   * @default - No memory reserved
   */
  readonly memoryReservation?: Size;

  /**
   * The hard limit of CPUs to present to this container.
   * Must be an even multiple of 0.25
   *
   * If your container attempts to exceed this limit, it will be terminated.
   *
   * At least one of `cpuReservation` and `cpuLimit` is required.
   * If both are specified, then `cpuLimit` must be at least as large as `cpuReservation`.
   *
   * @see https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/
   *
   * @default - No CPU limit
   */
  readonly cpuLimit?: number;

  /**
   * The soft limit of CPUs to reserve for the container
   * Must be an even multiple of 0.25
   *
   * The container will given at least this many CPUs, but may consume more.
   *
   * At least one of `cpuReservation` and `cpuLimit` is required.
   * If both are specified, then `cpuLimit` must be at least as large as `cpuReservation`.
   *
   * @see https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/
   *
   * @default - No CPUs reserved
   */
  readonly cpuReservation?: number;

  /**
   * The hard limit of GPUs to present to this container.
   *
   * If your container attempts to exceed this limit, it will be terminated.
   *
   * If both `gpuReservation` and `gpuLimit` are specified, then `gpuLimit` must be equal to `gpuReservation`.
   *
   * @see https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/
   *
   * @default - No GPU limit
   */
  readonly gpuLimit?: number;

  /**
   * The soft limit of CPUs to reserve for the container
   * Must be an even multiple of 0.25
   *
   * The container will given at least this many CPUs, but may consume more.
   *
   * If both `gpuReservation` and `gpuLimit` are specified, then `gpuLimit` must be equal to `gpuReservation`.
   *
   * @see https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/
   *
   * @default - No GPUs reserved
   */
  readonly gpuReservation?: number;

  /**
   * If specified, gives this container elevated permissions on the host container instance.
   * The level of permissions are similar to the root user permissions.
   *
   * This parameter maps to `privileged` policy in the Privileged pod security policies in the Kubernetes documentation.
   *
   * *Note*: this is only compatible with Kubernetes < v1.25
   *
   * @see https://kubernetes.io/docs/concepts/security/pod-security-policy/#volumes-and-file-systems
   *
   * @default false
   */
  readonly privileged?: boolean;

  /**
   * If specified, gives this container readonly access to its root file system.
   *
   * This parameter maps to `ReadOnlyRootFilesystem` policy in the Volumes and file systems pod security policies in the Kubernetes documentation.
   *
   * *Note*: this is only compatible with Kubernetes < v1.25
   *
   * @see https://kubernetes.io/docs/concepts/security/pod-security-policy/#volumes-and-file-systems
   *
   * @default false
   */
  readonly readonlyRootFilesystem?: boolean;

  /**
   * If specified, the container is run as the specified group ID (`gid`).
   * If this parameter isn't specified, the default is the group that's specified in the image metadata.
   * This parameter maps to `RunAsGroup` and `MustRunAs` policy in the Users and groups pod security policies in the Kubernetes documentation.
   *
   * *Note*: this is only compatible with Kubernetes < v1.25
   *
   * @see https://kubernetes.io/docs/concepts/security/pod-security-policy/#users-and-groups
   *
   * @default none
   */
  readonly runAsGroup?: number;

  /**
   * If specified, the container is run as a user with a `uid` other than 0. Otherwise, no such rule is enforced.
   * This parameter maps to `RunAsUser` and `MustRunAsNonRoot` policy in the Users and groups pod security policies in the Kubernetes documentation.
   *
   * *Note*: this is only compatible with Kubernetes < v1.25
   *
   * @see https://kubernetes.io/docs/concepts/security/pod-security-policy/#users-and-groups
   *
   * @default - the container is *not* required to run as a non-root user
   */
  readonly runAsRoot?: boolean;

  /**
   * If specified, this container is run as the specified user ID (`uid`).
   * This parameter maps to `RunAsUser` and `MustRunAs` policy in the Users and groups pod security policies in the Kubernetes documentation.
   *
   * *Note*: this is only compatible with Kubernetes < v1.25
   *
   * @see https://kubernetes.io/docs/concepts/security/pod-security-policy/#users-and-groups
   *
   * @default - the user that is specified in the image metadata.
   */
  readonly runAsUser?: number;

  /**
   * The Volumes to mount to this container.
   * Automatically added to the Pod.
   *
   * @see https://kubernetes.io/docs/concepts/storage/volumes/
   *
   * @default - no volumes
   */
  readonly volumes?: EksVolume[];
}

/**
 * A container that can be run with EKS orchestration on EC2 resources
 */
export class EksContainerDefinition extends Construct implements IEksContainerDefinition {
  public readonly image: ecs.ContainerImage;
  public readonly args?: string[];
  public readonly command?: string[];
  public readonly env?: { [key:string]: string };
  public readonly imagePullPolicy?: ImagePullPolicy;
  public readonly name?: string;
  public readonly memoryLimit?: Size;
  public readonly memoryReservation?: Size;
  public readonly cpuLimit?: number;
  public readonly cpuReservation?: number;
  public readonly gpuLimit?: number;
  public readonly gpuReservation?: number;
  public readonly privileged?: boolean;
  public readonly readonlyRootFilesystem?: boolean;
  public readonly runAsGroup?: number;
  public readonly runAsRoot?: boolean;
  public readonly runAsUser?: number;
  public readonly volumes: EksVolume[];

  private readonly imageConfig: ecs.ContainerImageConfig;

  constructor(scope: Construct, id: string, props: EksContainerDefinitionProps) {
    super(scope, id);

    this.image = props.image;
    this.args = props.args;
    this.command = props.command;
    this.env = props.env;
    this.imagePullPolicy = props.imagePullPolicy;
    this.name = props.name;
    this.memoryLimit = props.memoryLimit;
    this.memoryReservation = props.memoryReservation;
    this.cpuLimit = props.cpuLimit;
    this.cpuReservation = props.cpuReservation;
    this.gpuLimit = props.gpuLimit;
    this.gpuReservation = props.gpuReservation;
    this.privileged = props.privileged;
    this.readonlyRootFilesystem = props.readonlyRootFilesystem;
    this.runAsGroup = props.runAsGroup;
    this.runAsRoot = props.runAsRoot;
    this.runAsUser = props.runAsUser;
    this.volumes = props.volumes ?? [];
    this.imageConfig = props.image.bind(this, this as any);
  }

  addVolume(volume: EksVolume) {
    this.volumes.push(volume);
  }

  /**
   *
   * @internal
   */
  public _renderContainerDefinition(): CfnJobDefinition.EksContainerProperty {
    return {
      image: this.imageConfig.imageName,
      command: this.command,
      args: this.args,
      env: Object.keys(this.env ?? {}).map((key) => {
        return {
          name: key,
          value: this.env![key],
        };
      }),
      name: this.name,
      imagePullPolicy: this.imagePullPolicy,
      resources: {
        limits: {
          'cpu': this.cpuLimit,
          'memory': this.memoryLimit ? this.memoryLimit.toMebibytes() + 'Mi' : undefined,
          'nvidia.com/gpu': this.gpuLimit,
        },
        requests: {
          'cpu': this.cpuReservation,
          'memory': this.memoryReservation ? this.memoryReservation.toMebibytes() + 'Mi' : undefined,
          'nvidia.com/gpu': this.gpuReservation,
        },
      },
      securityContext: {
        privileged: this.privileged,
        readOnlyRootFilesystem: this.readonlyRootFilesystem,
        runAsGroup: this.runAsGroup,
        runAsNonRoot: !this.runAsRoot,
        runAsUser: this.runAsUser,
      },
      volumeMounts: Lazy.any({
        produce: () => {
          if (this.volumes.length === 0) {
            return undefined;
          }
          return this.volumes.map((volume) => {
            return {
              name: volume.name,
              mountPath: volume.containerPath,
              readOnly: volume.readonly,
            };
          });
        },
      }),
    };
  };
}

/**
 * Options to configure an EksVolume
 */
export interface EksVolumeOptions {
  /**
   * The name of this volume.
   * The name must be a valid DNS subdomain name.
   *
   * @see https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#dns-subdomain-names
   */
  readonly name: string;

  /**
   * The path on the container where the volume is mounted.
   *
   * @default - the volume is not mounted
   */
  readonly mountPath?: string;

  /**
   * If specified, the container has readonly access to the volume.
   * Otherwise, the container has read/write access.
   *
   * @default false
   */
  readonly readonly?: boolean;
}

/**
 * A Volume that can be mounted to a container supported by EKS
 */
export abstract class EksVolume {
  /**
   * Creates a Kubernetes EmptyDir volume
   *
   * @see https://kubernetes.io/docs/concepts/storage/volumes/#emptydir
   */
  static emptyDir(options: EmptyDirVolumeOptions) {
    return new EmptyDirVolume(options);
  }
  /**
   * Creates a Kubernetes HostPath volume
   *
   * @see https://kubernetes.io/docs/concepts/storage/volumes/#hostpath
   */
  static hostPath(options: HostPathVolumeOptions) {
    return new HostPathVolume(options);
  }
  /**
   * Creates a Kubernetes Secret volume
   *
   * @see https://kubernetes.io/docs/concepts/storage/volumes/#secret
   */
  static secret(options: SecretPathVolumeOptions) {
    return new SecretPathVolume(options);
  }

  /**
   * The name of this volume.
   * The name must be a valid DNS subdomain name.
   *
   * @see https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#dns-subdomain-names
   */
  readonly name: string;

  /**
   * The path on the container where the container is mounted.
   *
   * @default - the container is not mounted
   */
  readonly containerPath?: string;

  /**
   * If specified, the container has readonly access to the volume.
   * Otherwise, the container has read/write access.
   *
   * @default false
   */
  readonly readonly?: boolean;

  constructor(options: EksVolumeOptions) {
    this.name = options.name;
    this.containerPath = options.mountPath;
    this.readonly = options.readonly;
  }
}

/**
 * Options for a Kubernetes EmptyDir volume
 *
 * @see https://kubernetes.io/docs/concepts/storage/volumes/#emptydir
 */
export interface EmptyDirVolumeOptions extends EksVolumeOptions {
  /**
   * The storage type to use for this Volume.
   *
   * @default `EmptyDirMediumType.DISK`
   */
  readonly medium?: EmptyDirMediumType;

  /**
   * The maximum size for this Volume
   *
   * @default - no size limit
   */
  readonly sizeLimit?: Size
}

/**
 * What medium the volume will live in
 */
export enum EmptyDirMediumType {
  /**
   * Use the disk storage of the node.
   * Items written here will survive node reboots.
   */
  DISK = '',

  /**
   * Use the `tmpfs` volume that is backed by RAM of the node.
   * Items written here will *not* survive node reboots.
   */
  MEMORY = 'Memory',
}

/**
 * A Kubernetes EmptyDir volume
 *
 * @see https://kubernetes.io/docs/concepts/storage/volumes/#emptydir
 */
export class EmptyDirVolume extends EksVolume {
  /**
   * Returns `true` if `x` is an EmptyDirVolume, `false` otherwise
   */
  public static isEmptyDirVolume(x: any) : x is EmptyDirVolume {
    return x !== null && typeof(x) === 'object' && EMPTY_DIR_VOLUME_SYMBOL in x;
  }

  /**
   * The storage type to use for this Volume.
   *
   * @default `EmptyDirMediumType.DISK`
   */
  readonly medium?: EmptyDirMediumType;

  /**
   * The maximum size for this Volume
   *
   * @default - no size limit
   */
  readonly sizeLimit?: Size;

  constructor(options: EmptyDirVolumeOptions) {
    super(options);
    this.medium = options.medium;
    this.sizeLimit = options.sizeLimit;
  }
}

Object.defineProperty(EmptyDirVolume.prototype, EMPTY_DIR_VOLUME_SYMBOL, {
  value: true,
  enumerable: false,
  writable: false,
});

/**
 * Options for a kubernetes HostPath volume
 *
 * @see https://kubernetes.io/docs/concepts/storage/volumes/#hostpath
 */
export interface HostPathVolumeOptions extends EksVolumeOptions {
  /**
   * The path of the file or directory on the host to mount into containers on the pod.
   *
   * *Note*: HothPath Volumes present many security risks, and should be avoided when possible.
   *
   * @see https://kubernetes.io/docs/concepts/storage/volumes/#hostpath
   */
  readonly hostPath: string;
}

/**
 * A Kubernetes HostPath volume
 *
 * @see https://kubernetes.io/docs/concepts/storage/volumes/#hostpath
 */
export class HostPathVolume extends EksVolume {
  /**
   * returns `true` if `x` is a HostPathVolume, `false` otherwise
   */
  public static isHostPathVolume(x: any) : x is HostPathVolume {
    return x !== null && typeof(x) === 'object' && HOST_PATH_VOLUME_SYMBOL in x;
  }

  /**
   * The path of the file or directory on the host to mount into containers on the pod.
   *
   * *Note*: HothPath Volumes present many security risks, and should be avoided when possible.
   *
   * @see https://kubernetes.io/docs/concepts/storage/volumes/#hostpath
   */
  public readonly path: string;

  constructor(options: HostPathVolumeOptions) {
    super(options);
    this.path = options.hostPath;
  }
}

Object.defineProperty(HostPathVolume.prototype, HOST_PATH_VOLUME_SYMBOL, {
  value: true,
  enumerable: false,
  writable: false,
});

/**
 * Options for a Kubernetes SecretPath Volume
 *
 * @see https://kubernetes.io/docs/concepts/storage/volumes/#secret
 */
export interface SecretPathVolumeOptions extends EksVolumeOptions {
  /**
   * The name of the secret.
   * Must be a valid DNS subdomain name.
   *
   * @see https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#dns-subdomain-names
   */
  readonly secretName: string;

  /**
   * Specifies whether the secret or the secret's keys must be defined
   *
   * @default true
   */
  readonly optional?: boolean;
}

/**
 * Specifies the configuration of a Kubernetes secret volume
 *
 * @see https://kubernetes.io/docs/concepts/storage/volumes/#secret
 */
export class SecretPathVolume extends EksVolume {
  /**
   * returns `true` if `x` is a `SecretPathVolume` and `false` otherwise
   */
  public static isSecretPathVolume(x: any) : x is SecretPathVolume {
    return x !== null && typeof(x) === 'object' && SECRET_PATH_VOLUME_SYMBOL in x;
  }

  /**
   * The name of the secret.
   * Must be a valid DNS subdomain name.
   *
   * @see https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#dns-subdomain-names
   */
  readonly secretName: string;

  /**
   * Specifies whether the secret or the secret's keys must be defined
   *
   * @default true
   */
  readonly optional?: boolean;

  constructor(options: SecretPathVolumeOptions) {
    super(options);
    this.secretName = options.secretName;
    this.optional = options.optional ?? true;
  }
}

Object.defineProperty(SecretPathVolume.prototype, SECRET_PATH_VOLUME_SYMBOL, {
  value: true,
  enumerable: false,
  writable: false,
});
