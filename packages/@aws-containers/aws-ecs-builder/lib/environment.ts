import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecs from '@aws-cdk/aws-ecs';
import * as cdk from '@aws-cdk/core';
import { EnvironmentCapacityType } from './addons/addon-interfaces';

/**
 * Settings for the deploy environment you want to deploy
 * services within.
 */
export interface EnvironmentProps {
  /**
   * The VPC used by the service for networking
   * @default - Create a new VPC
   */
  readonly vpc?: ec2.IVpc,

  /**
   * The ECS cluster which provides compute capacity to this service
   * [disable-awslint:ref-via-interface]
   * @default - Create a new cluster
   */
  readonly cluster?: ecs.Cluster

  /**
   * What type of capacity to use for this environment
   * @default - EnvironmentCapacityType.FARGATE
   */
  readonly capacityType?: EnvironmentCapacityType
}

/**
 * A service builder class. This construct support various addons
 * which can construct an ECS service progressively.
 */
export class Environment extends cdk.Construct {
  /**
   * The name of this environment
   */
  public readonly id: string;

  /**
   * The VPC into which environment services should be placed
   */
  public readonly vpc: ec2.IVpc;

  /**
   * The cluster that is providing capacity for this service
   */
  public readonly cluster: ecs.Cluster;

  /**
   * The cluster that is providing capacity for this service
   */
  public readonly capacityType: EnvironmentCapacityType;

  private readonly scope: cdk.Construct;

  constructor(scope: cdk.Construct, id: string, props?: EnvironmentProps) {
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
}