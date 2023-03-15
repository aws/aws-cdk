import * as ecs from '@aws-cdk/aws-ecs';
import { Construct } from 'constructs';
import { CfnJobDefinition } from './batch.generated';
import { EcsContainerDefinition } from './container-definition';
import { IJobDefinition, JobDefinitionBase, JobDefinitionProps } from './job-definition-base';

interface IEcsJobDefinition extends IJobDefinition {
  /**
   * The container that this job will run
   */
  readonly containerDefinition: EcsContainerDefinition

  /**
   * Which version of Fargate to use when running this container
   *
   * @default LATEST
   */
  readonly fargatePlatformVersion?: ecs.FargatePlatformVersion;

  /**
   * Which platforms this Job requires
   *
   * @default Compatibility.EC2
   */
  readonly compatibility?: Compatibility;
}

export enum Compatibility {
  EC2 = 'EC2',
  FARGATE = 'FARGATE',
  EC2_AND_FARGATE = 'EC2+FARGATE',
}

export interface EcsJobDefinitionProps extends JobDefinitionProps {
  /**
   * The container that this job will run
   */
  readonly containerDefinition: EcsContainerDefinition

  /**
   * Which version of Fargate to use when running this container
   *
   * @default LATEST
   */
  readonly fargatePlatformVersion?: ecs.FargatePlatformVersion;

  /**
   * Which platforms this Job requires
   *
   * @default Compatibility.EC2
   */
  readonly compatibility?: Compatibility;
}

export class EcsJobDefinition extends JobDefinitionBase implements IEcsJobDefinition {
  readonly containerDefinition: EcsContainerDefinition
  readonly fargatePlatformVersion?: ecs.FargatePlatformVersion;
  readonly compatibility?: Compatibility;

  constructor(scope: Construct, id: string, props: EcsJobDefinitionProps) {
    super(scope, id, props);

    this.containerDefinition = props.containerDefinition;
    this.fargatePlatformVersion = props.fargatePlatformVersion;
    this.compatibility = props.compatibility;

    new CfnJobDefinition(this, 'Resource', {
      type: 'container',
      containerProperties: this.containerDefinition.renderContainerDefinition(),
    });
  }
}
