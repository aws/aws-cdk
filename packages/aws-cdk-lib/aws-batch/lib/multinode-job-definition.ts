import { Construct } from 'constructs';
import { CfnJobDefinition } from './batch.generated';
import { IEcsContainerDefinition } from './ecs-container-definition';
import { Compatibility } from './ecs-job-definition';
import { baseJobDefinitionProperties, IJobDefinition, JobDefinitionBase, JobDefinitionProps } from './job-definition-base';
import * as ec2 from '../../aws-ec2';
import { ArnFormat, Lazy, Stack } from '../../core';

/**
 * Not a real instance type! Indicates that Batch will choose one it determines to be optimal
 * for the workload.
 */
export class OptimalInstanceType extends ec2.InstanceType {
  constructor() {
    // this is not a real instance type! Batch uses an `undefined` value to mean 'optimal',
    // which tells Batch to select the optimal instance type.
    super('optimal');
  }
}

interface IMultiNodeJobDefinition extends IJobDefinition {
  /**
   * The containers that this multinode job will run.
   *
   * @see https://aws.amazon.com/blogs/compute/building-a-tightly-coupled-molecular-dynamics-workflow-with-multi-node-parallel-jobs-in-aws-batch/
   */
  readonly containers: MultiNodeContainer[];

  /**
   * The instance type that this job definition will run
   *
   * @default - optimal instance, selected by Batch
   */
  readonly instanceType?: ec2.InstanceType;

  /**
   * The index of the main node in this job.
   * The main node is responsible for orchestration.
   *
   * @default 0
   */
  readonly mainNode?: number;

  /**
   * Whether to propogate tags from the JobDefinition
   * to the ECS task that Batch spawns
   *
   * @default false
   */
  readonly propagateTags?: boolean;

  /**
   * Add a container to this multinode job
   */
  addContainer(container: MultiNodeContainer): void;
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

/**
 * Props to configure a MultiNodeJobDefinition
 */
export interface MultiNodeJobDefinitionProps extends JobDefinitionProps {
  /**
   * The instance type that this job definition
   * will run.
   *
   * @default - optimal instance, selected by Batch
   */
  readonly instanceType?: ec2.InstanceType;

  /**
   * The containers that this multinode job will run.
   *
   * @see https://aws.amazon.com/blogs/compute/building-a-tightly-coupled-molecular-dynamics-workflow-with-multi-node-parallel-jobs-in-aws-batch/
   *
   * @default none
   */
  readonly containers?: MultiNodeContainer[];

  /**
   * The index of the main node in this job.
   * The main node is responsible for orchestration.
   *
   * @default 0
   */
  readonly mainNode?: number;

  /**
   * Whether to propogate tags from the JobDefinition
   * to the ECS task that Batch spawns
   *
   * @default false
   */
  readonly propagateTags?: boolean;
}

/**
 * A JobDefinition that uses Ecs orchestration to run multiple containers
 *
 * @resource AWS::Batch::JobDefinition
 */
export class MultiNodeJobDefinition extends JobDefinitionBase implements IMultiNodeJobDefinition {
  /**
   * refer to an existing JobDefinition by its arn
   */
  public static fromJobDefinitionArn(scope: Construct, id: string, jobDefinitionArn: string): IJobDefinition {
    const stack = Stack.of(scope);
    const jobDefinitionName = stack.splitArn(jobDefinitionArn, ArnFormat.SLASH_RESOURCE_NAME).resourceName!;

    class Import extends JobDefinitionBase implements IJobDefinition {
      public readonly jobDefinitionArn = jobDefinitionArn;
      public readonly jobDefinitionName = jobDefinitionName;
      public readonly enabled = true;
    }

    return new Import(scope, id);
  }

  public readonly containers: MultiNodeContainer[];
  public readonly mainNode?: number;
  public readonly propagateTags?: boolean;

  public readonly jobDefinitionArn: string;
  public readonly jobDefinitionName: string;

  private readonly _instanceType?: ec2.InstanceType;

  constructor(scope: Construct, id: string, props?: MultiNodeJobDefinitionProps) {
    super(scope, id, props);

    this.containers = props?.containers ?? [];
    this.mainNode = props?.mainNode;
    this._instanceType = props?.instanceType;
    this.propagateTags = props?.propagateTags;

    const resource = new CfnJobDefinition(this, 'Resource', {
      ...baseJobDefinitionProperties(this),
      type: 'multinode',
      jobDefinitionName: props?.jobDefinitionName,
      propagateTags: this.propagateTags,
      nodeProperties: {
        mainNode: this.mainNode ?? 0,
        nodeRangeProperties: Lazy.any({
          produce: () => this.containers.map((container) => ({
            targetNodes: container.startNode + ':' + container.endNode,
            container: {
              ...container.container._renderContainerDefinition(),
              instanceType: this._instanceType?.toString(),
            },
          })),
        }),
        numNodes: Lazy.number({
          produce: () => computeNumNodes(this.containers),
        }),
      },
      platformCapabilities: [Compatibility.EC2],
    });
    this.jobDefinitionArn = this.getResourceArnAttribute(resource.ref, {
      service: 'batch',
      resource: 'job-definition',
      resourceName: this.physicalName,
    });
    this.jobDefinitionName = this.getResourceNameAttribute(resource.ref);

    this.node.addValidation({ validate: () => validateContainers(this.containers) });
  }

  /**
   * If the prop `instanceType` is left `undefined`, then this
   * will hold a fake instance type, for backwards compatibility reasons.
   */
  public get instanceType(): ec2.InstanceType {
    if (!this._instanceType) {
      return new OptimalInstanceType();
    }

    return this._instanceType;
  }

  public addContainer(container: MultiNodeContainer) {
    this.containers.push(container);
  }
}

function computeNumNodes(containers: MultiNodeContainer[]) {
  let result = 0;

  for (const container of containers) {
    result += container.endNode - container.startNode + 1;
  }

  return result;
}

function validateContainers(containers: MultiNodeContainer[]): string[] {
  return containers.length === 0 ? ['multinode job has no containers!'] : [];
}
