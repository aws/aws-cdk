import { IInputTransformation, IPipe, ITarget, TargetConfig } from '@aws-cdk/aws-pipes-alpha';
import { IRestApi } from 'aws-cdk-lib/aws-apigateway';
import { IRole, PolicyStatement } from 'aws-cdk-lib/aws-iam';

/**
 * API Gateway REST API target properties.
 */
export interface ApiGatewayTargetParameters {
  /**
   * The input transformation to apply to the message before sending it to the target.
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetparameters.html#cfn-pipes-pipe-pipetargetparameters-inputtemplate
   * @default - none
   */
  readonly inputTransformation?: IInputTransformation;

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
   * The headers to send as part of the request invoking the API Gateway REST API.
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargethttpparameters.html#cfn-pipes-pipe-pipetargethttpparameters-headerparameters
   * @default - none
   */
  readonly headerParameters?: Record<string, string>;

  /**
   * The path parameter values used to populate the API Gateway REST API path wildcards ("*").
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargethttpparameters.html#cfn-pipes-pipe-pipetargethttpparameters-pathparametervalues
   * @default - none
   */
  readonly pathParameterValues?: string[];

  /**
   * The query string keys/values that need to be sent as part of request invoking the API Gateway REST API.
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargethttpparameters.html#cfn-pipes-pipe-pipetargethttpparameters-querystringparameters
   * @default - none
   */
  readonly queryStringParameters?: Record<string, string>;
}

/**
 * An EventBridge Pipes target that sends messages to an EventBridge API destination.
 */
export class ApiGatewayTarget implements ITarget {
  private restApi: IRestApi;
  private restApiParameters?: ApiGatewayTargetParameters;
  private restApiArn: string;
  public readonly targetArn;

  constructor(restApi: IRestApi, parameters?: ApiGatewayTargetParameters) {
    this.restApi = restApi;
    this.restApiParameters = parameters;

    if (this.restApiParameters?.stage === undefined && this.restApi.deploymentStage === undefined) {
      throw Error('The REST API must have a deployed stage.');
    }

    this.restApiArn = this.restApi.arnForExecuteApi(
      this.restApiParameters?.method,
      this.restApiParameters?.path || '/',
      this.restApiParameters?.stage || this.restApi.deploymentStage.stageName,
    );

    this.targetArn = this.restApiArn;
  }

  grantPush(grantee: IRole): void {
    grantee.addToPrincipalPolicy(new PolicyStatement({
      resources: [this.restApiArn],
      actions: ['execute-api:Invoke'],
    }));
  }

  bind(pipe: IPipe): TargetConfig {
    if (!this.restApiParameters) {
      return {
        targetParameters: {},
      };
    }

    return {
      targetParameters: {
        inputTemplate: this.restApiParameters.inputTransformation?.bind(pipe).inputTemplate,
        httpParameters: this.restApiParameters,
      },
    };
  }
}
