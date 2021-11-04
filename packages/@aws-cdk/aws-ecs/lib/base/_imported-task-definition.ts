import * as ec2 from '@aws-cdk/aws-ec2';
import { IRole, PolicyStatement } from '@aws-cdk/aws-iam';
import { Resource } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { PortMapping, Protocol } from '../container-definition';
import { IEc2TaskDefinition } from '../ec2/ec2-task-definition';
import { IFargateTaskDefinition } from '../fargate/fargate-task-definition';
import { LoadBalancerTarget, LoadBalancerTargetOptions, Compatibility, NetworkMode, isEc2Compatible, isFargateCompatible, isExternalCompatible, EPHEMERAL_PORT_RANGE } from './task-definition';

/**
 * The properties of ImportedTaskDefinition
 */
export interface ImportedTaskDefinitionProps {
  /**
   * The arn of the task definition
   */
  readonly taskDefinitionArn: string;

  /**
   * What launch types this task definition should be compatible with.
   *
   * @default Compatibility.EC2_AND_FARGATE
   */
  readonly compatibility?: Compatibility;

  /**
   * The networking mode to use for the containers in the task.
   *
   * @default Network mode cannot be provided to the imported task.
   */
  readonly networkMode?: NetworkMode;

  /**
   * The name of the IAM role that grants containers in the task permission to call AWS APIs on your behalf.
   *
   * @default Permissions cannot be granted to the imported task.
   */
  readonly taskRole?: IRole;
}

/**
 * Task definition reference of an imported task
 */
export class ImportedTaskDefinition extends Resource implements IEc2TaskDefinition, IFargateTaskDefinition {
  /**
   * What launch types this task definition should be compatible with.
   */
  readonly compatibility: Compatibility;

  /**
   * ARN of this task definition
   */
  readonly taskDefinitionArn: string;

  /**
   * Execution role for this task definition
   */
  readonly executionRole?: IRole = undefined;

  /**
   * The networking mode to use for the containers in the task.
   */
  readonly _networkMode?: NetworkMode;

  /**
   * The name of the IAM role that grants containers in the task permission to call AWS APIs on your behalf.
   */
  readonly _taskRole?: IRole;

  constructor(scope: Construct, id: string, props: ImportedTaskDefinitionProps) {
    super(scope, id);

    this.compatibility = props.compatibility ?? Compatibility.EC2_AND_FARGATE;
    this.taskDefinitionArn = props.taskDefinitionArn;
    this._taskRole = props.taskRole;
    this._networkMode = props.networkMode;
  }

  public get networkMode(): NetworkMode {
    if (this._networkMode == undefined) {
      throw new Error('This operation requires the networkMode in ImportedTaskDefinition to be defined. ' +
        'Add the \'networkMode\' in ImportedTaskDefinitionProps to instantiate ImportedTaskDefinition');
    } else {
      return this._networkMode;
    }
  }

  public get taskRole(): IRole {
    if (this._taskRole == undefined) {
      throw new Error('This operation requires the taskRole in ImportedTaskDefinition to be defined. ' +
        'Add the \'taskRole\' in ImportedTaskDefinitionProps to instantiate ImportedTaskDefinition');
    } else {
      return this._taskRole;
    }
  }

  /**
   * Return true if the task definition can be run on an EC2 cluster
   */
  public get isEc2Compatible(): boolean {
    return isEc2Compatible(this.compatibility);
  }

  /**
   * Return true if the task definition can be run on a Fargate cluster
   */
  public get isFargateCompatible(): boolean {
    return isFargateCompatible(this.compatibility);
  }

  /**
   * Return true if the task definition can be run on a ECS Anywhere cluster
   */
  public get isExternalCompatible(): boolean {
    return isExternalCompatible(this.compatibility);
  }

  /**
   * Adds a policy statement to the task IAM role.
   */
  public addToTaskRolePolicy(statement: PolicyStatement) {
    this.taskRole.addToPrincipalPolicy(statement);
  }

  /**
   * Returns the port range to be opened that match the provided container name and container port.
   *
   * @internal
   */
  public _portRangeFromPortMapping(portMapping: PortMapping): ec2.Port {
    if (portMapping.hostPort !== undefined && portMapping.hostPort !== 0) {
      return portMapping.protocol === Protocol.UDP ? ec2.Port.udp(portMapping.hostPort) : ec2.Port.tcp(portMapping.hostPort);
    }
    if (this.networkMode === NetworkMode.BRIDGE || this.networkMode === NetworkMode.NAT) {
      return EPHEMERAL_PORT_RANGE;
    }
    return portMapping.protocol === Protocol.UDP ? ec2.Port.udp(portMapping.containerPort) : ec2.Port.tcp(portMapping.containerPort);
  }

  /**
   * Validate the existence of the input target and set default values.
   *
   * @internal
   */
  public _validateTarget(options: LoadBalancerTargetOptions): LoadBalancerTarget {
    if (!options.containerName) {
      throw new Error('containerName is required when using an imported ITaskDefinition');
    }

    const targetProtocol = options.protocol || Protocol.TCP;
    if (!options.containerPort) {
      throw new Error('containerPort is required when using an imported ITaskDefinition');
    }

    const portMapping: PortMapping = {
      containerPort: options.containerPort,
      hostPort: options.hostPort,
      protocol: targetProtocol,
    };
    return {
      containerName: options.containerName,
      portMapping,
    };
  }
}
