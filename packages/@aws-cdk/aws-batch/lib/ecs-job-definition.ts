import * as ecs from '@aws-cdk/aws-ecs';
import { Construct } from 'constructs';
import { CfnJobDefinition } from './batch.generated';
import { EcsEc2ContainerDefinition, IEcsContainerDefinition } from './ecs-container-definition';
import { IJobDefinition, JobDefinitionBase, JobDefinitionProps } from './job-definition-base';

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

export interface EcsJobDefinitionProps extends JobDefinitionProps {
  /**
   * The container that this job will run
   */
  readonly containerDefinition: IEcsContainerDefinition
}

export class EcsJobDefinition extends JobDefinitionBase implements IEcsJobDefinition {
  readonly containerDefinition: IEcsContainerDefinition
  readonly fargatePlatformVersion?: ecs.FargatePlatformVersion;

  constructor(scope: Construct, id: string, props: EcsJobDefinitionProps) {
    super(scope, id, props);

    this.containerDefinition = props.containerDefinition;

    new CfnJobDefinition(this, 'Resource', {
      ...this.resourceProps,
      type: 'container',
      containerProperties: this.containerDefinition.renderContainerDefinition(),
      platformCapabilities: this.renderPlatformCapabilities(),
    });
  }

  private renderPlatformCapabilities() {
    if (this.containerDefinition instanceof EcsEc2ContainerDefinition) {
      return [Compatibility.EC2];
    }

    return [Compatibility.FARGATE];
  }
}
