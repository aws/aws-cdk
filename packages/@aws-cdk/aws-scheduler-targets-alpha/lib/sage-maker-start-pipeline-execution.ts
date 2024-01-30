import { ISchedule, IScheduleTarget, ScheduleTargetConfig } from '@aws-cdk/aws-scheduler-alpha';
import { ArnFormat, Names, Stack } from 'aws-cdk-lib';
import { IRole, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { CfnPipeline } from 'aws-cdk-lib/aws-sagemaker';
import { ScheduleTargetBase, ScheduleTargetBaseProps } from './target';
import { sameEnvDimension } from './util';

/**
 * Properties for a pipeline parameter
 */
export interface SageMakerPipelineParameter {
  /**
   * Name of parameter to start execution of a SageMaker Model Building Pipeline.
   */
  readonly name: string;

  /**
   * Value of parameter to start execution of a SageMaker Model Building Pipeline.
   */
  readonly value: string;
}

/**
 * Properties for a SageMaker Target
 */
export interface SageMakerStartPipelineExecutionProps extends ScheduleTargetBaseProps {
  /**
   * List of parameter names and values to use when executing the SageMaker Model Building Pipeline.
   *
   * The length must be between 0 and 200.
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-scheduler-schedule-sagemakerpipelineparameters.html#cfn-scheduler-schedule-sagemakerpipelineparameters-pipelineparameterlist
   *
   * @default - no pipeline parameter list
   */
  readonly pipelineParameterList?: SageMakerPipelineParameter[];
}

/**
 * Use a SageMaker pipeline as a target for AWS EventBridge Scheduler.
 */
export class SageMakerStartPipelineExecution extends ScheduleTargetBase implements IScheduleTarget {
  private readonly pipelineArn: string;

  constructor(
    private readonly pipeline: CfnPipeline,
    private readonly props: SageMakerStartPipelineExecutionProps = {},
  ) {
    const targetArn = Stack.of(pipeline).formatArn({
      service: 'sagemaker',
      resource: 'pipeline',
      resourceName: pipeline.pipelineName,
      arnFormat: ArnFormat.SLASH_RESOURCE_NAME,
    });
    super(props, targetArn);
    this.pipelineArn = targetArn;

    if (props.pipelineParameterList !== undefined && props.pipelineParameterList.length > 200) {
      throw new Error(`pipelineParameterList length must be between 0 and 200, got ${props.pipelineParameterList.length}`);
    }
  }

  protected addTargetActionToRole(schedule: ISchedule, role: IRole): void {
    if (!sameEnvDimension(this.pipeline.stack.region, schedule.env.region)) {
      throw new Error(`Cannot assign pipeline in region ${this.pipeline.stack.region} to the schedule ${Names.nodeUniqueId(schedule.node)} in region ${schedule.env.region}. Both the schedule and the pipeline must be in the same region.`);
    }

    if (!sameEnvDimension(this.pipeline.stack.account, schedule.env.account)) {
      throw new Error(`Cannot assign pipeline in account ${this.pipeline.stack.account} to the schedule ${Names.nodeUniqueId(schedule.node)} in account ${schedule.env.region}. Both the schedule and the pipeline must be in the same account.`);
    }

    if (this.props.role && !sameEnvDimension(this.props.role.env.account, this.pipeline.stack.account)) {
      throw new Error(`Cannot grant permission to execution role in account ${this.props.role.env.account} to invoke target ${Names.nodeUniqueId(this.pipeline.node)} in account ${this.pipeline.stack.account}. Both the target and the execution role must be in the same account.`);
    }

    role.addToPrincipalPolicy(new PolicyStatement({
      actions: ['sagemaker:StartPipelineExecution'],
      resources: [this.pipelineArn],
    }));
  }

  protected bindBaseTargetConfig(_schedule: ISchedule): ScheduleTargetConfig {
    const sageMakerPipelineParameters = this.props.pipelineParameterList ? {
      pipelineParameterList: this.props.pipelineParameterList.map(param => {
        return {
          name: param.name,
          value: param.value,
        };
      }),
    } : undefined;
    return {
      ...super.bindBaseTargetConfig(_schedule),
      sageMakerPipelineParameters,
    };
  }
}