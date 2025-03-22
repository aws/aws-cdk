import { IInputTransformation, IPipe, ITarget, TargetConfig } from '@aws-cdk/aws-pipes-alpha';
import { IRole } from 'aws-cdk-lib/aws-iam';
import { IDeliveryStream } from 'aws-cdk-lib/aws-kinesisfirehose';

/**
 * Amazon Data Firehose target properties.
 */
export interface FirehoseTargetParameters {
  /**
   * The input transformation to apply to the message before sending it to the target.
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetparameters.html#cfn-pipes-pipe-pipetargetparameters-inputtemplate
   * @default - none
   */
  readonly inputTransformation?: IInputTransformation;
}

/**
 * An EventBridge Pipes target that sends messages to an Amazon Data Firehose delivery stream.
 */
export class FirehoseTarget implements ITarget {
  private stream: IDeliveryStream;
  private streamParameters: FirehoseTargetParameters;
  public readonly targetArn: string;

  constructor(stream: IDeliveryStream, parameters: FirehoseTargetParameters = {}) {
    this.stream = stream;
    this.targetArn = stream.deliveryStreamArn;
    this.streamParameters = parameters;
  }

  grantPush(grantee: IRole): void {
    this.stream.grantPutRecords(grantee);
  }

  bind(pipe: IPipe): TargetConfig {
    return {
      targetParameters: {
        inputTemplate: this.streamParameters.inputTransformation?.bind(pipe).inputTemplate,
      },
    };
  }
}
