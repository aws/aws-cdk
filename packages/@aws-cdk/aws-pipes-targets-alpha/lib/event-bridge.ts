import { IInputTransformation, IPipe, ITarget, TargetConfig } from '@aws-cdk/aws-pipes-alpha';
import { Token } from 'aws-cdk-lib';
import { IEventBus } from 'aws-cdk-lib/aws-events';
import { IRole } from 'aws-cdk-lib/aws-iam';

/**
 * EventBridge target properties.
 */
export interface EventBridgeTargetParameters {
  /**
   * The input transformation to apply to the message before sending it to the target.
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetparameters.html#cfn-pipes-pipe-pipetargetparameters-inputtemplate
   * @default - none
   */
  readonly inputTransformation?: IInputTransformation;

  /**
   * A free-form string used to decide what fields to expect in the event detail.
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargeteventbridgeeventbusparameters.html#cfn-pipes-pipe-pipetargeteventbridgeeventbusparameters-detailtype
   * @default - none
   */
  readonly detailType?: string;

  /**
   * The URL subdomain of the endpoint.
   *
   * @example
   * // if the URL for the endpoint is https://abcde.veo.endpoints.event.amazonaws.com
   * 'abcde.veo'
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargeteventbridgeeventbusparameters.html#cfn-pipes-pipe-pipetargeteventbridgeeventbusparameters-endpointid
   * @default - none
   */
  readonly endpointId?: string;

  /**
   * AWS resources, identified by Amazon Resource Name (ARN), which the event primarily concerns.
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargeteventbridgeeventbusparameters.html#cfn-pipes-pipe-pipetargeteventbridgeeventbusparameters-resources
   * @default - none
   */
  readonly resources?: string[];

  /**
   * The source of the event.
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargeteventbridgeeventbusparameters.html#cfn-pipes-pipe-pipetargeteventbridgeeventbusparameters-source
   * @default - none
   */
  readonly source?: string;

  /**
   * The time stamp of the event, per RFC3339.
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargeteventbridgeeventbusparameters.html#cfn-pipes-pipe-pipetargeteventbridgeeventbusparameters-time
   * @default - the time stamp of the PutEvents call
   */
  readonly time?: string;
}

/**
 * An EventBridge Pipes target that sends messages to an EventBridge event bus.
 */
export class EventBridgeTarget implements ITarget {
  private eventBus: IEventBus;
  private eventBridgeParameters?: EventBridgeTargetParameters;
  public readonly targetArn: string;

  constructor(eventBus: IEventBus, parameters?: EventBridgeTargetParameters) {
    this.eventBus = eventBus;
    this.targetArn = eventBus.eventBusArn;
    if (parameters) {
      this.eventBridgeParameters = parameters;
      for (const validate of [validateDetailType, validateEndpointId, validateSource, validateTime]) {
        validate(parameters);
      }
    }
  }

  grantPush(grantee: IRole): void {
    this.eventBus.grantPutEventsTo(grantee);
  }

  bind(pipe: IPipe): TargetConfig {
    if (!this.eventBridgeParameters) {
      return {
        targetParameters: {},
      };
    }

    return {
      targetParameters: {
        inputTemplate: this.eventBridgeParameters.inputTransformation?.bind(pipe).inputTemplate,
        eventBridgeEventBusParameters: this.eventBridgeParameters,
      },
    };
  }
}

function validateDetailType({ detailType }: EventBridgeTargetParameters) {
  if (detailType !== undefined && !Token.isUnresolved(detailType)) {
    if (detailType.length < 1 || detailType.length > 128) {
      throw new Error(`Detail type must be between 1 and 128 characters, received ${detailType.length}`);
    }
  }
}

function validateEndpointId({ endpointId }: EventBridgeTargetParameters) {
  if (endpointId !== undefined && !Token.isUnresolved(endpointId)) {
    if (endpointId.length < 1 || endpointId.length > 50) {
      throw new Error(`Endpoint id must be between 1 and 50 characters, received ${endpointId.length}`);
    }
  }
}

function validateSource({ source }: EventBridgeTargetParameters) {
  if (source !== undefined && !Token.isUnresolved(source)) {
    if (source.length < 1 || source.length > 256) {
      throw new Error(`Source must be between 1 and 256 characters, received ${source.length}`);
    }
  }
}

function validateTime({ time }: EventBridgeTargetParameters) {
  if (time !== undefined && !Token.isUnresolved(time)) {
    if (time.length < 1 || time.length > 256) {
      throw new Error(`Time must be between 1 and 256 characters, received ${time.length}`);
    }
  }
}
