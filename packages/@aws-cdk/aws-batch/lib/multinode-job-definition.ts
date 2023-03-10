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

  /**
   * The index of the main node in this job.
   * The main node is responsible for orchestration.
   *
   * @default 0
   */
  mainNode: number;

  /**
   * The instance type that this job definition will run
   */
  instanceType: ec2.InstanceType;
}

/**
 * Runs the container on nodes [startNode, endNode]
 */
interface MultiNodeContainer {
  /**
   * The index of the first node to run this container
   *
   * The container is run on all nodes in the range [startNode, endNode] (inclusive)
   */
  startNode: number;

  /**
   * The index of the last node to run this container.
   *
   * The container is run on all nodes in the range [startNode, endNode] (inclusive)
   */
  endNode: number;

  /**
   * The container that this node range will run
   */
  container: ecs.ContainerDefinition;
}

interface MultiNodeJobDefinitionProps extends JobDefinitionProps {
  /**
   * The containers that this multinode job will run.
   *
   * @see: https://aws.amazon.com/blogs/compute/building-a-tightly-coupled-molecular-dynamics-workflow-with-multi-node-parallel-jobs-in-aws-batch/
   */
  containers: MultiNodeContainer[];

  /**
   * The index of the main node in this job.
   * The main node is responsible for orchestration.
   *
   * @default 0
   */
  mainNode: number;

  /**
   * The instance type that this job definition
   * will run.
   */
  instanceType: ec2.InstanceType;
}

export class MultiNodeJobDefinition extends JobDefinitionBase implements IMultiNodeJobDefinition {
  /**
   * The containers that this multinode job will run.
   *
   * @see: https://aws.amazon.com/blogs/compute/building-a-tightly-coupled-molecular-dynamics-workflow-with-multi-node-parallel-jobs-in-aws-batch/
   */
  readonly containers: MultiNodeContainer[];

  /**
   * The index of the main node in this job.
   * The main node is responsible for orchestration.
   *
   * @default 0
   */
  readonly mainNode: number;

  /**
   * The instance type that this job definition will run
   */
  readonly instanceType: ec2.InstanceType;

  constructor(scope: Construct, id: string, props: MultiNodeJobDefinitionProps) {
    super(scope, id, props);

    this.containers = props.containers;
    this.mainNode = props.mainNode;
    this.instanceType = props.instanceType;
  }

  //public addContainer(...containers: MultiNodeContainer[]) {}
}
