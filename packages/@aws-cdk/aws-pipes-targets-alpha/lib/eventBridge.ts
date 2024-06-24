import { IInputTransformation, IPipe, ITarget, TargetConfig } from '@aws-cdk/aws-pipes-alpha';
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
   * @default none
   */
  readonly inputTransformation?: IInputTransformation;

  /**
   * A free-form string, with a maximum of 128 characters, used to decide what fields to expect in the event detail.
   *
   * Minimum: 1
   * Maximum: 128
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargeteventbridgeeventbusparameters.html#cfn-pipes-pipe-pipetargeteventbridgeeventbusparameters-detailtype
   * @default none
   */
  readonly detailType?: string;

  /**
   * The URL subdomain of the endpoint.
   *
   * For example, if the URL for the endpoint is https://abcde.veo.endpoints.event.amazonaws.com, then `EndpointId` is abcde.veo.
   *
   * Pattern: `^[A-Za-z0-9\-]+[\.][A-Za-z0-9\-]+$`
   * Minimum: 1
   * Maximum: 50
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargeteventbridgeeventbusparameters.html#cfn-pipes-pipe-pipetargeteventbridgeeventbusparameters-endpointid
   * @default none
   */
  readonly endpointId?: string;

  /**
   * AWS resources, identified by Amazon Resource Name (ARN), which the event primarily concerns. Any number, including zero, may be present.
   *
   * Minimum: 1 | 0
   * Maximum: 1600 | 10
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargeteventbridgeeventbusparameters.html#cfn-pipes-pipe-pipetargeteventbridgeeventbusparameters-resources
   * @default none
   */
  readonly resources?: string[];

  /**
   * The source of the event.
   *
   * Minimum: 1
   * Maximum: 256
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargeteventbridgeeventbusparameters.html#cfn-pipes-pipe-pipetargeteventbridgeeventbusparameters-source
   * @default none
   */
  readonly source?: string;

  /**
   * The time stamp of the event, per RFC3339. If no time stamp is provided, the time stamp of the PutEvents call is used.
   *
   * Pattern: (?=[/\.\-_A-Za-z0-9]+)((?!aws\.).*)|(\$(\.[\w/_-]+(\[(\d+|\*)\])*)*)
   * Minimum: 1
   * Maximum: 256
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargeteventbridgeeventbusparameters.html#cfn-pipes-pipe-pipetargeteventbridgeeventbusparameters-time
   * @default none
   */
  readonly time?: string;
}

/**
 * A EventBridge Pipes target that sends messages to an EventBridge event bus.
 */
export class EventBridgeTarget implements ITarget {
  private eventBus: IEventBus;
  private eventBridgeParameters?: EventBridgeTargetParameters;
  public readonly targetArn: string;
  constructor(eventBus: IEventBus, parameters?: EventBridgeTargetParameters) {
    this.eventBus = eventBus;
    this.targetArn = eventBus.eventBusArn;
    this.eventBridgeParameters = parameters;

    validateDetailType(parameters?.detailType);
    validateEndpointId(parameters?.endpointId);
    validateSource(parameters?.source);
    validateTime(parameters?.time);
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

function validateDetailType(detailType?: string) {
  if (detailType !== undefined) {
    if (detailType.length < 1 || detailType.length > 128) {
      throw new Error(`Detail type must be between 1 and 128 characters, received ${detailType.length}`);
    }
  }
}

function validateEndpointId(endpointId?: string) {
  if (endpointId !== undefined) {
    if (endpointId.length < 1 || endpointId.length > 50) {
      throw new Error(`Endpoint id must be between 1 and 50 characters, received ${endpointId.length}`);
    }
  }
}

function validateSource(source?: string) {
  if (source !== undefined) {
    if (source.length < 1 || source.length > 256) {
      throw new Error(`Source must be between 1 and 256 characters, received ${source.length}`);
    }
  }
}

function validateTime(time?: string) {
  if (time !== undefined) {
    if (time.length < 1 || time.length > 256) {
      throw new Error(`Time must be between 1 and 256 characters, received ${time.length}`);
    }
  }
}
