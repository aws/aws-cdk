import { EnrichmentParametersConfig, IEnrichment, IPipe, InputTransformation } from '@aws-cdk/aws-pipes-alpha';
import { IApiDestination } from 'aws-cdk-lib/aws-events';
import { IRole, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { CfnPipe } from 'aws-cdk-lib/aws-pipes';

/**
 * Properties for a ApiDestinationEnrichment
 */
export interface ApiDestinationEnrichmentProps {
  /**
   * The input transformation for the enrichment
   * @see https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-pipes-input-transformation.html
   * @default - None
   */
  readonly inputTransformation?: InputTransformation;

  /**
   * The headers that need to be sent as part of request invoking the EventBridge ApiDestination.
   *
   * @default - none
   */
  readonly headerParameters?: Record<string, string>;

  /**
   * The path parameter values used to populate the EventBridge API destination path wildcards ("*").
   *
   * @default - none
   */
  readonly pathParameterValues?: string[];

  /**
   * The query string keys/values that need to be sent as part of request invoking the EventBridge API destination.
   *
   * @default - none
   */
  readonly queryStringParameters?: Record<string, string>;
}

/**
 * An API Destination enrichment for a pipe
 */
export class ApiDestinationEnrichment implements IEnrichment {
  public readonly enrichmentArn: string;

  private readonly inputTransformation?: InputTransformation;
  private readonly headerParameters?: Record<string, string>;
  private readonly pathParameterValues?: string[];
  private readonly queryStringParameters?: Record<string, string>;

  constructor(private readonly destination: IApiDestination, props?: ApiDestinationEnrichmentProps) {
    this.enrichmentArn = destination.apiDestinationArn;
    this.inputTransformation = props?.inputTransformation;
    this.headerParameters = props?.headerParameters;
    this.queryStringParameters = props?.queryStringParameters;
    this.pathParameterValues = props?.pathParameterValues;
  }

  bind(pipe: IPipe): EnrichmentParametersConfig {
    const httpParameters: CfnPipe.PipeEnrichmentHttpParametersProperty | undefined =
      this.headerParameters ??
        this.pathParameterValues ??
        this.queryStringParameters
        ? {
          headerParameters: this.headerParameters,
          pathParameterValues: this.pathParameterValues,
          queryStringParameters: this.queryStringParameters,
        }
        : undefined;

    return {
      enrichmentParameters: {
        inputTemplate: this.inputTransformation?.bind(pipe).inputTemplate,
        httpParameters,
      },
    };
  }

  grantInvoke(pipeRole: IRole): void {
    pipeRole.addToPrincipalPolicy(new PolicyStatement({
      resources: [this.destination.apiDestinationArn],
      actions: ['events:InvokeApiDestination'],
    }));
  }
}

