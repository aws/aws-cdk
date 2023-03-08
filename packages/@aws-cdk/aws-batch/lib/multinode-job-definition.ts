import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecs from '@aws-cdk/aws-ecs';
import { Construct } from 'constructs';
import { IJobDefinition, JobDefinitionBase, JobDefinitionProps } from './job-definition-base';


interface IMultiNodeJobDefinition extends IJobDefinition {
  /**
   * The containers that this multinode job will run.
   *
   * @see: https://aws.amazon.com/blogs/compute/building-a-tightly-coupled-molecular-dynamics-workflow-with-multi-node-parallel-jobs-in-aws-batch/
   */
  containers: MultiNodeContainer[];
  mainNode: number;
  instanceType: ec2.InstanceType;
}

interface MultiNodeContainer {
  startNode: number;
  endNode: number;
  container: ecs.ContainerDefinition;
}

interface MultiNodeJobDefinitionProps extends JobDefinitionProps {
  containers: MultiNodeContainer[];
  mainNode: number;
  instanceType: ec2.InstanceType;
}

export class MultiNodeJobDefinition extends JobDefinitionBase implements IMultiNodeJobDefinition {
  constructor(scope: Construct, id: string, props: MultiNodeJobDefinitionProps) {
    super(scope, id, props);

    this.containers = props.containers;
    this.mainNode = props.mainNode;
    this.instanceType = props.instanceType;
  }

  public addContainer(...containers: MultiNodeContainer[]) {}
}