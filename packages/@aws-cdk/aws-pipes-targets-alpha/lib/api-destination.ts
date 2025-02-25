import { IInputTransformation, IPipe, ITarget, TargetConfig } from '@aws-cdk/aws-pipes-alpha';
import { IApiDestination } from 'aws-cdk-lib/aws-events';
import { IRole, PolicyStatement } from 'aws-cdk-lib/aws-iam';

/**
 * EventBridge API destination target properties.
 */
export interface ApiDestinationTargetParameters {
  /**
   * The input transformation to apply to the message before sending it to the target.
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetparameters.html#cfn-pipes-pipe-pipetargetparameters-inputtemplate
   * @default - none
   */
  readonly inputTransformation?: IInputTransformation;

  /**
   * The headers to send as part of the request invoking the EventBridge API destination.
   *
   * The headers are merged with the headers from the API destination.
   * If there are conflicts, the headers from the API destination take precedence.
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargethttpparameters.html#cfn-pipes-pipe-pipetargethttpparameters-headerparameters
   * @default - none
   */
  readonly headerParameters?: { [key: string]: string };

  /**
   * The path parameter values used to populate the EventBridge API destination path wildcards ("*").
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargethttpparameters.html#cfn-pipes-pipe-pipetargethttpparameters-pathparametervalues
   * @default - none
   */
  readonly pathParameterValues?: string[];

  /**
   * The query string keys/values that need to be sent as part of request invoking the EventBridge API destination.
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargethttpparameters.html#cfn-pipes-pipe-pipetargethttpparameters-querystringparameters
   * @default - none
   */
  readonly queryStringParameters?: Record<string, string>;
}

/**
 * An EventBridge Pipes target that sends messages to an EventBridge API destination.
 */
export class ApiDestinationTarget implements ITarget {
  private destination: IApiDestination;
  private apiParameters?: ApiDestinationTargetParameters;
  public readonly targetArn: string;

  constructor(destination: IApiDestination, parameters?: ApiDestinationTargetParameters) {
    this.destination = destination;
    this.apiParameters = parameters;
    this.targetArn = destination.apiDestinationArn;
  }

  grantPush(grantee: IRole): void {
    grantee.addToPrincipalPolicy(new PolicyStatement({
      resources: [this.destination.apiDestinationArn],
      actions: ['events:InvokeApiDestination'],
    }));
  }

  bind(pipe: IPipe): TargetConfig {
    if (!this.apiParameters) {
      return {
        targetParameters: {},
      };
    }

    return {
      targetParameters: {
        inputTemplate: this.apiParameters.inputTransformation?.bind(pipe).inputTemplate,
        httpParameters: this.apiParameters,
      },
    };
  }
}
