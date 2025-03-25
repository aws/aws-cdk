import { Construct } from 'constructs';
import { CfnJobDefinition } from './batch.generated';
import { EcsEc2ContainerDefinition, IEcsContainerDefinition } from './ecs-container-definition';
import { baseJobDefinitionProperties, IJobDefinition, JobDefinitionBase, JobDefinitionProps } from './job-definition-base';
import { IJobQueue } from './job-queue';
import * as iam from '../../aws-iam';
import { ArnFormat, Stack } from '../../core';
import { addConstructMetadata, MethodMetadata } from '../../core/lib/metadata-resource';

/**
 * A JobDefinition that uses ECS orchestration
 */
interface IEcsJobDefinition extends IJobDefinition {
  /**
   * The container that this job will run
   */
  readonly container: IEcsContainerDefinition;

  /**
   * Whether to propagate tags from the JobDefinition
   * to the ECS task that Batch spawns
   *
   * @default false
   */
  readonly propagateTags?: boolean;
}

/**
 * @internal
 */
export enum Compatibility {
  EC2 = 'EC2',
  FARGATE = 'FARGATE',
}

/**
 * Defines a consumable resource requirement for a batch job.
 */
export interface ConsumableResource {
  /**
   * The ARN of the consumable resource the job definition should consume.
   */
  readonly resource: string;

  /**
   * The quantity of the consumable resource required.
   */
  readonly quantity: number;
}

/**
 * Configuration for consumable resources.
 */
export interface ConsumableResourcesProps {
  /**
   * List of consumable resources required by the job.
   */
  readonly resources: ConsumableResource[];
}

/**
 * Props for EcsJobDefinition
 */
export interface EcsJobDefinitionProps extends JobDefinitionProps {
  /**
   * The container that this job will run
   */
  readonly container: IEcsContainerDefinition;

  /**
   * Whether to propagate tags from the JobDefinition
   * to the ECS task that Batch spawns
   *
   * @default false
   */
  readonly propagateTags?: boolean;

  /**
   * Configuration for consumable resources required by the job.
   * @default - No consumable resources are specified
   */
  readonly consumableResources?: ConsumableResourcesProps;
}

/**
 * A JobDefinition that uses ECS orchestration
 *
 * @resource AWS::Batch::JobDefinition
 */
export class EcsJobDefinition extends JobDefinitionBase implements IEcsJobDefinition {
  /**
   * Import a JobDefinition by its arn.
   */
  public static fromJobDefinitionArn(scope: Construct, id: string, jobDefinitionArn: string): IJobDefinition {
    class Import extends JobDefinitionBase implements IEcsJobDefinition {
      public readonly jobDefinitionArn = jobDefinitionArn;
      public readonly jobDefinitionName = EcsJobDefinition.getJobDefinitionName(this, jobDefinitionArn);
      public readonly enabled = true;
      container = {} as any;
    }

    return new Import(scope, id);
  }

  private static getJobDefinitionName(scope: Construct, jobDefinitionArn: string) {
    const resourceName = Stack.of(scope).splitArn(jobDefinitionArn, ArnFormat.SLASH_RESOURCE_NAME).resourceName!;
    return resourceName.split(':')[0];
  }

  readonly container: IEcsContainerDefinition;
  public readonly propagateTags?: boolean;

  public readonly jobDefinitionArn: string;
  public readonly jobDefinitionName: string;

  constructor(scope: Construct, id: string, props: EcsJobDefinitionProps) {
    super(scope, id, props);
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    this.container = props.container;
    this.propagateTags = props?.propagateTags;

    const resource = new CfnJobDefinition(this, 'Resource', {
      ...baseJobDefinitionProperties(this),
      type: 'container',
      jobDefinitionName: props.jobDefinitionName,
      containerProperties: this.container?._renderContainerDefinition(),
      platformCapabilities: this.renderPlatformCapabilities(),
      propagateTags: this.propagateTags,
      consumableResourceProperties: props.consumableResources && {
        consumableResourceList: props.consumableResources.resources.map(resource => ({
          consumableResource: resource.resource,
          quantity: resource.quantity,
        })),
      },
    });

    this.jobDefinitionArn = this.getResourceArnAttribute(resource.ref, {
      service: 'batch',
      resource: 'job-definition',
      resourceName: this.physicalName,
    });
    this.jobDefinitionName = EcsJobDefinition.getJobDefinitionName(scope, this.jobDefinitionArn);
  }

  /**
   * Grants the `batch:submitJob` permission to the identity on both this job definition and the `queue`
   */
  @MethodMetadata()
  public grantSubmitJob(identity: iam.IGrantable, queue: IJobQueue) {
    iam.Grant.addToPrincipal({
      actions: ['batch:SubmitJob'],
      grantee: identity,
      resourceArns: [this.jobDefinitionArn, queue.jobQueueArn],
    });
  }

  private renderPlatformCapabilities() {
    if (this.container instanceof EcsEc2ContainerDefinition) {
      return [Compatibility.EC2];
    }

    return [Compatibility.FARGATE];
  }
}
