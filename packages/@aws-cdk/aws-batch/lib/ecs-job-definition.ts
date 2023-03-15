import * as ecs from '@aws-cdk/aws-ecs';
import { Construct } from 'constructs';
import { CfnJobDefinition } from './batch.generated';
import { EcsEc2ContainerDefinition, IEcsContainerDefinition } from './container-definition';
import { IJobDefinition, JobDefinitionBase, JobDefinitionProps } from './job-definition-base';

interface IEcsJobDefinition extends IJobDefinition {
  /**
   * The container that this job will run
   */
  readonly containerDefinition: IEcsContainerDefinition

  /**
   * Which version of Fargate to use when running this container
   *
   * @default LATEST
   */
  readonly fargatePlatformVersion?: ecs.FargatePlatformVersion;
}

enum Compatibility {
  EC2 = 'EC2',
  FARGATE = 'FARGATE',
}

export interface EcsJobDefinitionProps extends JobDefinitionProps {
  /**
   * The container that this job will run
   */
  readonly containerDefinition: IEcsContainerDefinition

  /**
   * Which version of Fargate to use when running this container
   *
   * @default LATEST
   */
  readonly fargatePlatformVersion?: ecs.FargatePlatformVersion;
}

export class EcsJobDefinition extends JobDefinitionBase implements IEcsJobDefinition {
  readonly containerDefinition: IEcsContainerDefinition
  readonly fargatePlatformVersion?: ecs.FargatePlatformVersion;

  constructor(scope: Construct, id: string, props: EcsJobDefinitionProps) {
    super(scope, id, props);

    this.containerDefinition = props.containerDefinition;
    this.fargatePlatformVersion = props.fargatePlatformVersion;

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
