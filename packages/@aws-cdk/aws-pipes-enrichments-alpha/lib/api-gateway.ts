import { EnrichmentParametersConfig, IEnrichment, IPipe, InputTransformation } from '@aws-cdk/aws-pipes-alpha';
import { IRestApi } from 'aws-cdk-lib/aws-apigateway';
import { IRole, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { CfnPipe } from 'aws-cdk-lib/aws-pipes';

/**
 * Properties for a ApiGatewayEnrichment
 */
export interface ApiGatewayEnrichmentProps {
  /**
   * The input transformation for the enrichment
   * @see https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-pipes-input-transformation.html
   * @default - None
   */
  readonly inputTransformation?: InputTransformation;

  /**
   * The method for API Gateway resource.
   *
   * @default '*' - ANY
   */
  readonly method?: string;

  /**
   * The path for the API Gateway resource.
   *
   * @default '/'
   */
  readonly path?: string;

  /**
   * The deployment stage for the API Gateway resource.
   *
   * @default - the value of `deploymentStage.stageName` of target API Gateway resource.
   */
  readonly stage?: string;

  /**
   * The headers that need to be sent as part of request invoking the API Gateway REST API.
   *
   * @default - none
   */
  readonly headerParameters?: Record<string, string>;

  /**
   * The path parameter values used to populate the API Gateway REST API path wildcards ("*").
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
 * An API Gateway enrichment for a pipe
 */
export class ApiGatewayEnrichment implements IEnrichment {
  public readonly enrichmentArn: string;

  private readonly inputTransformation?: InputTransformation;
  private readonly headerParameters?: Record<string, string>;
  private readonly pathParameterValues?: string[];
  private readonly queryStringParameters?: Record<string, string>;

  constructor(private readonly restApi: IRestApi, props?: ApiGatewayEnrichmentProps) {
    this.enrichmentArn = restApi.arnForExecuteApi(
      props?.method,
      props?.path || '/',
      props?.stage || this.restApi.deploymentStage.stageName,
    );
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
      resources: [this.enrichmentArn],
      actions: ['execute-api:Invoke'],
    }));
  }
}

