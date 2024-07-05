import { IInputTransformation, IPipe, ITarget, TargetConfig } from '@aws-cdk/aws-pipes-alpha';
import { IRestApi, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { ApiDestination, IApiDestination } from 'aws-cdk-lib/aws-events';
import { IRole, PolicyStatement } from 'aws-cdk-lib/aws-iam';

/**
 * Http target properties.
 */
export interface HttpTargetParameters {
  /**
   * The input transformation to apply to the message before sending it to the target.
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetparameters.html#cfn-pipes-pipe-pipetargetparameters-inputtemplate
   * @default - none
   */
  readonly inputTransformation?: IInputTransformation;

  /**
   * The headers to send as part of the request invoking the API Gateway REST API or EventBridge API destination.
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargethttpparameters.html#cfn-pipes-pipe-pipetargethttpparameters-headerparameters
   * @default - none
   */
  readonly headerParameters?: Record<string, string>;

  /**
   * The path parameter values used to populate API Gateway REST API or EventBridge API destination path wildcards ("*").
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargethttpparameters.html#cfn-pipes-pipe-pipetargethttpparameters-pathparametervalues
   * @default - none
   */
  readonly pathParameterValues?: string[];

  /**
   * The query string keys/values that need to be sent as part of request invoking the API Gateway REST API or EventBridge API destination.
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargethttpparameters.html#cfn-pipes-pipe-pipetargethttpparameters-querystringparameters
   * @default - none
   */
  readonly queryStringParameters?: Record<string, string>;
}

/**
 * A EventBridge Pipes target that sends messages to an API Gateway REST API or EventBridge API destination.
 */
export class HttpTarget implements ITarget {
  private destination: IRestApi | IApiDestination;
  private httpParameters?: HttpTargetParameters;
  public readonly targetArn: string = '';

  constructor(destination: IRestApi | IApiDestination, parameters?: HttpTargetParameters) {
    this.destination = destination;
    this.httpParameters = parameters;

    if (destination instanceof RestApi) {
      this.targetArn = destination.arnForExecuteApi();
    } else if (destination instanceof ApiDestination) {
      this.targetArn = destination.apiDestinationArn;
    };
  }

  grantPush(grantee: IRole): void {
    if (this.destination instanceof RestApi) {
      grantee.addToPrincipalPolicy(new PolicyStatement({
        resources: [this.destination.arnForExecuteApi()],
        actions: [
          'execute-api:Invoke',
          'execute-api:ManageConnections',
        ],
      }));
    } else if (this.destination instanceof ApiDestination) {
      grantee.addToPrincipalPolicy(new PolicyStatement({
        resources: [this.destination.apiDestinationArn],
        actions: ['events:InvokeApiDestination'],
      }));
    }
  }

  bind(pipe: IPipe): TargetConfig {
    if (!this.httpParameters) {
      return {
        targetParameters: {},
      };
    }

    return {
      targetParameters: {
        inputTemplate: this.httpParameters.inputTransformation?.bind(pipe).inputTemplate,
        httpParameters: this.httpParameters,
      },
    };
  }
}
