import { ArnFormat, Stack } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CfnJobDefinition } from './batch.generated';
import { EcsEc2ContainerDefinition, IEcsContainerDefinition } from './ecs-container-definition';
import { IJobDefinition, JobDefinitionBase, JobDefinitionProps } from './job-definition-base';

/**
 * A JobDefinition that uses ECS orchestration
 */
interface IEcsJobDefinition extends IJobDefinition {
  /**
   * The container that this job will run
   */
  readonly containerDefinition: IEcsContainerDefinition
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
  readonly containerDefinition: IEcsContainerDefinition
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
    const stack = Stack.of(scope);
    const jobDefinitionName = stack.splitArn(jobDefinitionArn, ArnFormat.SLASH_RESOURCE_NAME).resourceName!;

    class Import extends JobDefinitionBase implements IEcsJobDefinition {
      public readonly jobDefinitionArn = jobDefinitionArn;
      public readonly jobDefinitionName = jobDefinitionName;
      public readonly enabled = true;
      containerDefinition = {} as any;
    }

    return new Import(scope, id);
  }

  readonly containerDefinition: IEcsContainerDefinition

  public readonly jobDefinitionArn: string;
  public readonly jobDefinitionName: string;

  constructor(scope: Construct, id: string, props: EcsJobDefinitionProps) {
    super(scope, id, props);

    this.containerDefinition = props.containerDefinition;

    const resource = new CfnJobDefinition(this, 'Resource', {
      ...this.resourceProps,
      type: 'container',
      jobDefinitionName: props.jobDefinitionName,
      containerProperties: this.containerDefinition?._renderContainerDefinition(),
      platformCapabilities: this.renderPlatformCapabilities(),
    });

    this.jobDefinitionArn = this.getResourceArnAttribute(resource.ref, {
      service: 'batch',
      resource: 'job-definition',
      resourceName: this.physicalName,
    });
    this.jobDefinitionName = this.getResourceNameAttribute(resource.ref);
  }

  private renderPlatformCapabilities() {
    if (this.containerDefinition instanceof EcsEc2ContainerDefinition) {
      return [Compatibility.EC2];
    }

    return [Compatibility.FARGATE];
  }
}
