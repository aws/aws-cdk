import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecs from '@aws-cdk/aws-ecs';
import { Construct } from 'constructs';
import { EnvironmentCapacityType } from './extensions/extension-interfaces';

/**
 * Settings for the environment you want to deploy.
 * services within.
 */
export interface EnvironmentProps {
  /**
   * The VPC used by the service for networking
   * @default - Create a new VPC
   */
  readonly vpc?: ec2.IVpc,

  /**
   * The ECS cluster which provides compute capacity to this service.
   * [disable-awslint:ref-via-interface]
   * @default - Create a new cluster
   */
  readonly cluster?: ecs.Cluster

  /**
   * The type of capacity to use for this environment.
   * @default - EnvironmentCapacityType.FARGATE
   */
  readonly capacityType?: EnvironmentCapacityType
}

/**
 * An environment into which to deploy a service.
 */
export interface IEnvironment {
  /**
   * The name of this environment.
   */
  readonly id: string;

  /**
   * The VPC into which environment services should be placed.
   */
  readonly vpc: ec2.IVpc;

  /**
   * The cluster that is providing capacity for this service.
   */
  readonly cluster: ecs.ICluster;

  /**
   * The capacity type used by the service's cluster.
   */
  readonly capacityType: EnvironmentCapacityType;

  /**
   * Add a default cloudmap namespace to the environment's cluster.
   */
  addDefaultCloudMapNamespace(options: ecs.CloudMapNamespaceOptions): void;
}

/**
 * An environment into which to deploy a service. This environment
 * can either be instantiated with a preexisting AWS VPC and ECS cluster,
 * or it can create it's own VPC and cluster. By default it will create
 * a cluster with Fargate capacity.
 */
export class Environment extends Construct implements IEnvironment {
  /**
   * Import an existing environment from its attributes.
   */
  public static fromEnvironmentAttributes(scope: Construct, id: string, attrs: EnvironmentAttributes): IEnvironment {
    return new ImportedEnvironment(scope, id, attrs);
  }

  /**
   * The name of this environment.
   */
  public readonly id: string;

  /**
   * The VPC into which environment services should be placed.
   */
  public readonly vpc: ec2.IVpc;

  /**
   * The cluster that is providing capacity for this service.
   */
  public readonly cluster: ecs.Cluster;

  /**
   * The capacity type used by the service's cluster.
   */
  public readonly capacityType: EnvironmentCapacityType;

  private readonly scope: Construct;

  constructor(scope: Construct, id: string, props?: EnvironmentProps) {
    super(scope, id);

    this.scope = scope;
    this.id = id;

    if (props && props.vpc) {
      this.vpc = props.vpc;
    } else {
      this.vpc = new ec2.Vpc(this.scope, `${this.id}-environment-vpc`);
    }

    if (props && props.cluster) {
      this.cluster = props.cluster;
    } else {
      this.cluster = new ecs.Cluster(this.scope, `${this.id}-environment-cluster`, { vpc: this.vpc });
    }

    if (props && props.capacityType) {
      this.capacityType = props.capacityType;
    } else {
      this.capacityType = EnvironmentCapacityType.FARGATE;
    }
  }

  /**
   * Add a default cloudmap namespace to the environment's cluster.
   */
  addDefaultCloudMapNamespace(options: ecs.CloudMapNamespaceOptions) {
    this.cluster.addDefaultCloudMapNamespace(options);
  }
}

export interface EnvironmentAttributes {
  /**
   * The capacity type used by the service's cluster.
   */
  capacityType: EnvironmentCapacityType;

  /**
   * The cluster that is providing capacity for this service.
   */
  cluster: ecs.ICluster;
}

export class ImportedEnvironment extends Construct implements IEnvironment {
  public readonly capacityType: EnvironmentCapacityType;
  public readonly cluster: ecs.ICluster;
  public readonly id: string;
  public readonly vpc: ec2.IVpc;

  constructor(scope: Construct, id: string, props: EnvironmentAttributes) {
    super(scope, id);

    this.id = id;
    this.capacityType = props.capacityType;
    this.cluster = props.cluster;
    this.vpc = props.cluster.vpc;
  }

  /**
   * Refuses to add a default cloudmap namespace to the cluster as we don't
   * own it.
   */
  addDefaultCloudMapNamespace(_options: ecs.CloudMapNamespaceOptions) {
    throw new Error('the cluster environment is immutable when imported');
  }
}