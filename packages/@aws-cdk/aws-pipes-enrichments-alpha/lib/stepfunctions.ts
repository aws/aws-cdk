import { EnrichmentParametersConfig, IEnrichment, IPipe, InputTransformation } from '@aws-cdk/aws-pipes-alpha';
import { IRole } from 'aws-cdk-lib/aws-iam';
import { IStateMachine, StateMachine, StateMachineType } from 'aws-cdk-lib/aws-stepfunctions';

/**
 * Properties for a StepFunctionsEnrichment
 */
export interface StepFunctionsEnrichmentProps {
  /**
   * The input transformation for the enrichment
   * @see https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-pipes-input-transformation.html
   * @default - None
   */
  readonly inputTransformation?: InputTransformation;
}

/**
 * A StepFunctions enrichment for a pipe
 */
export class StepFunctionsEnrichment implements IEnrichment {
  public readonly enrichmentArn: string;

  private readonly inputTransformation?: InputTransformation;
  constructor(private readonly stateMachine: IStateMachine, props?: StepFunctionsEnrichmentProps) {
    if (stateMachine instanceof StateMachine
      && (stateMachine.stateMachineType !== StateMachineType.EXPRESS)
    ) {
      throw new Error(`EventBridge pipes only support EXPRESS workflows as enrichment, got ${stateMachine.stateMachineType}`);
    }
    this.enrichmentArn = stateMachine.stateMachineArn;
    this.inputTransformation = props?.inputTransformation;
  }

  bind(pipe: IPipe): EnrichmentParametersConfig {
    return {
      enrichmentParameters: {
        inputTemplate: this.inputTransformation?.bind(pipe).inputTemplate,
      },
    };
  }

  grantInvoke(pipeRole: IRole): void {
    this.stateMachine.grantStartSyncExecution(pipeRole);
  }
}

