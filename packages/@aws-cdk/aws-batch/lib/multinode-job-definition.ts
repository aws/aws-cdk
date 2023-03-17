import * as ec2 from '@aws-cdk/aws-ec2';
import { Construct } from 'constructs';
import { CfnJobDefinition } from './batch.generated';
import { IEcsContainerDefinition } from './ecs-container-definition';
import { Compatibility } from './ecs-job-definition';
import { IJobDefinition, JobDefinitionBase, JobDefinitionProps } from './job-definition-base';


interface IMultiNodeJobDefinition extends IJobDefinition {
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
}

/**
 * Runs the container on nodes [startNode, endNode]
 */
export interface MultiNodeContainer {
  /**
   * The index of the first node to run this container
   *
   * The container is run on all nodes in the range [startNode, endNode] (inclusive)
   */
  readonly startNode: number;

  /**
   * The index of the last node to run this container.
   *
   * The container is run on all nodes in the range [startNode, endNode] (inclusive)
   */
  readonly endNode: number;

  /**
   * The container that this node range will run
   */
  readonly container: IEcsContainerDefinition;
}

export interface MultiNodeJobDefinitionProps extends JobDefinitionProps {
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
   * The instance type that this job definition
   * will run.
   */
  readonly instanceType: ec2.InstanceType;
}

export class MultiNodeJobDefinition extends JobDefinitionBase implements IMultiNodeJobDefinition {
  readonly containers: MultiNodeContainer[];
  readonly mainNode: number;
  readonly instanceType: ec2.InstanceType;

  constructor(scope: Construct, id: string, props: MultiNodeJobDefinitionProps) {
    super(scope, id, props);

    this.containers = props.containers;
    this.mainNode = props.mainNode;
    this.instanceType = props.instanceType;

    new CfnJobDefinition(this, 'Resource', {
      ...this.resourceProps,
      type: 'multinode',
      nodeProperties: {
        mainNode: this.mainNode,
        nodeRangeProperties: this.containers.map((container) => ({
          targetNodes: container.startNode + ':' + container.endNode,
          container: {
            ...container.container.renderContainerDefinition(),
            instanceType: this.instanceType.toString(),
          },
        })),
        numNodes: computeNumNodes(this.containers),
      },
      platformCapabilities: [Compatibility.EC2],
    });
  }

  //public addContainer(...containers: MultiNodeContainer[]) {}
}

function computeNumNodes(containers: MultiNodeContainer[]) {
  let result = 1;

  for (const container of containers) {
    result += container.endNode - container.startNode;
  }

  return result;
}
