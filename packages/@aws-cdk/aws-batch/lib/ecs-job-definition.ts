import * as ecs from '@aws-cdk/aws-ecs';
import { Construct } from 'constructs';
import { IJobDefinition, JobDefinitionBase, JobDefinitionProps } from './job-definition-base';

interface IEcsJobDefinition extends IJobDefinition {
  /**
   * The container that this job will run
   */
  containerDefinition: ecs.ContainerDefinition

  /**
   * Which version of Fargate to use when running this container
   *
   * @default LATEST
   */
  fargatePlatformVersion?: ecs.FargatePlatformVersion;

  /**
   * Which platforms this Job requires
   *
   * @default Compatibility.EC2
   */
  compatibility?: Compatibility;
}

enum Compatibility {
  EC2 = 'EC2',
  FARGATE = 'FARGATE',
  EC2_AND_FARGATE = 'EC2+FARGATE',
}

interface EcsJobDefinitionProps extends JobDefinitionProps {
  /**
   * The container that this job will run
   */
  containerDefinition: ecs.ContainerDefinition

  /**
   * Which version of Fargate to use when running this container
   *
   * @default LATEST
   */
  fargatePlatformVersion?: ecs.FargatePlatformVersion;

  /**
   * Which platforms this Job requires
   *
   * @default Compatibility.EC2
   */
  compatibility?: Compatibility;
}

export class EcsJobDefinition extends JobDefinitionBase implements IEcsJobDefinition {
  /**
   * The container that this job will run
   */
  containerDefinition: ecs.ContainerDefinition

  /**
   * Which version of Fargate to use when running this container
   *
   * @default LATEST
   */
  fargatePlatformVersion?: ecs.FargatePlatformVersion;

  /**
   * Which platforms this Job requires
   *
   * @default Compatibility.EC2
   */
  compatibility?: Compatibility;

  constructor(scope: Construct, id: string, props: EcsJobDefinitionProps) {
    super(scope, id, props);

    this.containerDefinition = props.containerDefinition;
    this.fargatePlatformVersion = props.fargatePlatformVersion;
    this.compatibility = props.compatibility;
  }
}
