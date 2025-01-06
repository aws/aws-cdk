import { Construct } from 'constructs';
import { CfnJobDefinition } from './batch.generated';
import { EcsEc2ContainerDefinition, IEcsContainerDefinition } from './ecs-container-definition';
import { baseJobDefinitionProperties, IJobDefinition, JobDefinitionBase, JobDefinitionProps } from './job-definition-base';
import { IJobQueue } from './job-queue';
import * as iam from '../../aws-iam';
import { ArnFormat, Stack } from '../../core';

/**
 * A JobDefinition that uses ECS orchestration
 */
interface IEcsJobDefinition extends IJobDefinition {
  /**
   * The container that this job will run
   */
  readonly container: IEcsContainerDefinition;

  /**
   * Whether to propogate tags from the JobDefinition
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
 * Props for EcsJobDefinition
 */
export interface EcsJobDefinitionProps extends JobDefinitionProps {
  /**
   * The container that this job will run
   */
  readonly container: IEcsContainerDefinition;

  /**
   * Whether to propogate tags from the JobDefinition
   * to the ECS task that Batch spawns
   *
   * @default false
   */
  readonly propagateTags?: boolean;
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

    this.container = props.container;
    this.propagateTags = props?.propagateTags;

    const resource = new CfnJobDefinition(this, 'Resource', {
      ...baseJobDefinitionProperties(this),
      type: 'container',
      jobDefinitionName: props.jobDefinitionName,
      containerProperties: this.container?._renderContainerDefinition(),
      platformCapabilities: this.renderPlatformCapabilities(),
      propagateTags: this.propagateTags,
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
