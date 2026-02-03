import type { Construct } from 'constructs';
import { CfnJobDefinition } from './batch.generated';
import type { IEcsContainerDefinition } from './ecs-container-definition';
import { EcsEc2ContainerDefinition } from './ecs-container-definition';
import type { IJobDefinition, JobDefinitionProps } from './job-definition-base';
import { baseJobDefinitionProperties, JobDefinitionBase } from './job-definition-base';
import * as iam from '../../aws-iam';
import { ArnFormat, Stack } from '../../core';
import { memoizedGetter } from '../../core/lib/helpers-internal';
import { addConstructMetadata, MethodMetadata } from '../../core/lib/metadata-resource';
import { propertyInjectable } from '../../core/lib/prop-injectable';
import type { IJobQueueRef } from '../../interfaces/generated/aws-batch-interfaces.generated';

/**
 * A JobDefinition that uses ECS orchestration
 */
interface IEcsJobDefinition extends IJobDefinition {
  /**
   * The container that this job will run
   */
  readonly container: IEcsContainerDefinition;

  /**
   * Whether to propagate tags from the JobDefinition
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
   * Whether to propagate tags from the JobDefinition
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
@propertyInjectable
export class EcsJobDefinition extends JobDefinitionBase implements IEcsJobDefinition {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = 'aws-cdk-lib.aws-batch.EcsJobDefinition';

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

  private readonly resource: CfnJobDefinition;

  @memoizedGetter
  public get jobDefinitionArn(): string {
    return this.getResourceArnAttribute(this.resource.ref, {
      service: 'batch',
      resource: 'job-definition',
      resourceName: this.physicalName,
    });
  }

  @memoizedGetter
  public get jobDefinitionName(): string {
    return EcsJobDefinition.getJobDefinitionName(this, this.jobDefinitionArn);
  }

  constructor(scope: Construct, id: string, props: EcsJobDefinitionProps) {
    super(scope, id, props);
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    this.container = props.container;
    this.propagateTags = props?.propagateTags;

    this.resource = new CfnJobDefinition(this, 'Resource', {
      ...baseJobDefinitionProperties(this),
      type: 'container',
      jobDefinitionName: props.jobDefinitionName,
      containerProperties: this.container?._renderContainerDefinition(),
      platformCapabilities: this.renderPlatformCapabilities(),
      propagateTags: this.propagateTags,
    });
  }

  /**
   * Grants the `batch:submitJob` permission to the identity on both this job definition and the `queue`
   *
   * [disable-awslint:no-grants]
   */
  @MethodMetadata()
  public grantSubmitJob(identity: iam.IGrantable, queue: IJobQueueRef) {
    iam.Grant.addToPrincipal({
      actions: ['batch:SubmitJob'],
      grantee: identity,
      resourceArns: [this.jobDefinitionArn, queue.jobQueueRef.jobQueueArn],
    });
  }

  private renderPlatformCapabilities() {
    if (this.container instanceof EcsEc2ContainerDefinition) {
      return [Compatibility.EC2];
    }

    return [Compatibility.FARGATE];
  }
}
