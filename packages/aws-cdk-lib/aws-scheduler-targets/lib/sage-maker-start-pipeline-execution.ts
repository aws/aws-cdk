import { ScheduleTargetBase, ScheduleTargetBaseProps } from './target';
import { IRole } from '../../aws-iam';
import { IPipeline } from '../../aws-sagemaker';
import { ISchedule, IScheduleTarget, ScheduleTargetConfig } from '../../aws-scheduler';

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
  constructor(
    private readonly pipeline: IPipeline,
    private readonly props: SageMakerStartPipelineExecutionProps = {},
  ) {
    super(props, pipeline.pipelineArn);

    if (props.pipelineParameterList !== undefined && props.pipelineParameterList.length > 200) {
      throw new Error(`pipelineParameterList length must be between 0 and 200, got ${props.pipelineParameterList.length}`);
    }
  }

  protected addTargetActionToRole(role: IRole): void {
    this.pipeline.grantStartPipelineExecution(role);
  }

  protected bindBaseTargetConfig(schedule: ISchedule): ScheduleTargetConfig {
    const sageMakerPipelineParameters = this.props.pipelineParameterList ? {
      pipelineParameterList: this.props.pipelineParameterList.map(param => {
        return {
          name: param.name,
          value: param.value,
        };
      }),
    } : undefined;
    return {
      ...super.bindBaseTargetConfig(schedule),
      sageMakerPipelineParameters,
    };
  }
}
