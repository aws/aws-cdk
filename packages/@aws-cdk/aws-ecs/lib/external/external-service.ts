import * as ec2 from '@aws-cdk/aws-ec2';
import { Resource, Stack } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { BaseService, BaseServiceOptions, DeploymentControllerType, IBaseService, IService, LaunchType, PropagatedTagSource } from '../base/base-service';
import { fromServiceAtrributes } from '../base/from-service-attributes';
import { NetworkMode, TaskDefinition } from '../base/task-definition';
import { ICluster } from '../cluster';
/**
 * The properties for defining a service using the External launch type.
 */
export interface ExternalServiceProps extends BaseServiceOptions {
  /**
   * The task definition to use for tasks in the service.
   *
   * [disable-awslint:ref-via-interface]
   */
  readonly taskDefinition: TaskDefinition;

  /**
   * The security groups to associate with the service. If you do not specify a security group, the default security group for the VPC is used.
   *
   * This property is only used for tasks that use the awsvpc network mode.
   *
   * @default - A new security group is created.
   */
  readonly securityGroups?: ec2.ISecurityGroup[];

  /**
   * Specifies whether to propagate the tags from the task definition or the service to the tasks in the service.
   * Tags can only be propagated to the tasks within the service during service creation.
   *
   * @deprecated Use `propagateTags` instead.
   * @default PropagatedTagSource.NONE
   */
  readonly propagateTaskTagsFrom?: PropagatedTagSource;
}

/**
 * The interface for a service using the External launch type on an ECS cluster.
 */
export interface IExternalService extends IService {

}

/**
 * The properties to import from the service using the External launch type.
 */
export interface ExternalServiceAttributes {
  /**
   * The cluster that hosts the service.
   */
  readonly cluster: ICluster;

  /**
   * The service ARN.
   *
   * @default - either this, or {@link serviceName}, is required
   */
  readonly serviceArn?: string;

  /**
   * The name of the service.
   *
   * @default - either this, or {@link serviceArn}, is required
   */
  readonly serviceName?: string;
}

/**
 * This creates a service using the External launch type on an ECS cluster.
 *
 * @resource AWS::ECS::Service
 */
export class ExternalService extends BaseService implements IExternalService {

  /**
   * Imports from the specified service ARN.
   */
  public static fromExternalServiceArn(scope: Construct, id: string, externalServiceArn: string): IExternalService {
    class Import extends Resource implements IExternalService {
      public readonly serviceArn = externalServiceArn;
      public readonly serviceName = Stack.of(scope).parseArn(externalServiceArn).resourceName as string;
    }
    return new Import(scope, id);
  }

  /**
   * Imports from the specified service attrributes.
   */
  public static fromExternalServiceAttributes(scope: Construct, id: string, attrs: ExternalServiceAttributes): IBaseService {
    return fromServiceAtrributes(scope, id, attrs);
  }

  /**
   * Constructs a new instance of the ExternalService class.
   */
  constructor(scope: Construct, id: string, props: ExternalServiceProps) {
    if (props.minHealthyPercent !== undefined && props.maxHealthyPercent !== undefined && props.minHealthyPercent >= props.maxHealthyPercent) {
      throw new Error('Minimum healthy percent must be less than maximum healthy percent.');
    }

    if (props.propagateTags && props.propagateTaskTagsFrom) {
      throw new Error('You can only specify either propagateTags or propagateTaskTagsFrom. Alternatively, you can leave both blank');
    }

    if (props.taskDefinition.networkMode !== NetworkMode.BRIDGE) {
      throw new Error(`External tasks can only have Bridge network mode, got: ${props.taskDefinition.networkMode}`);
    }


    const propagateTagsFromSource = props.propagateTaskTagsFrom ?? props.propagateTags ?? PropagatedTagSource.NONE;

    super(scope, id, {
      ...props,
      desiredCount: props.desiredCount,
      maxHealthyPercent: props.maxHealthyPercent === undefined ? 100 : props.maxHealthyPercent,
      minHealthyPercent: props.minHealthyPercent === undefined ? 0 : props.minHealthyPercent,
      launchType: LaunchType.EXTERNAL,
      propagateTags: propagateTagsFromSource,
      enableECSManagedTags: props.enableECSManagedTags,
    },
    {
      cluster: props.cluster.clusterName,
      taskDefinition: props.deploymentController?.type === DeploymentControllerType.EXTERNAL ? undefined : props.taskDefinition.taskDefinitionArn,
    }, props.taskDefinition);

    this.node.addValidation({
      validate: () => !this.taskDefinition.defaultContainer ? ['A TaskDefinition must have at least one essential container'] : [],
    });
  }
}