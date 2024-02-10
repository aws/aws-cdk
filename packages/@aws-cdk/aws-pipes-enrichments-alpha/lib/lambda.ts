import { EnrichmentParametersConfig, IEnrichment, IPipe, InputTransformation } from '@aws-cdk/aws-pipes-alpha';
import { IRole } from 'aws-cdk-lib/aws-iam';
import { IFunction } from 'aws-cdk-lib/aws-lambda';

/**
 * Properties for a LambdaEnrichment
 */
export interface LambdaEnrichmentProps {
  /**
   * The input transformation for the enrichment
   * @see https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-pipes-input-transformation.html
   * @default - None
   */
  readonly inputTransformation?: InputTransformation;
}

/**
 * A Lambda enrichment for a pipe
 */
export class LambdaEnrichment implements IEnrichment {
  public readonly enrichmentArn: string;

  private readonly inputTransformation?: InputTransformation;

  constructor(private readonly lambda: IFunction, props?: LambdaEnrichmentProps) {
    this.enrichmentArn = lambda.functionArn;
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
    this.lambda.grantInvoke(pipeRole);
  }
}
