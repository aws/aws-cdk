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
  private deliveryStream: IDeliveryStream;
  private deliveryStreamParameters: FirehoseTargetParameters;
  public readonly targetArn: string;

  constructor(deliveryStream: IDeliveryStream, parameters: FirehoseTargetParameters = {}) {
    this.deliveryStream = deliveryStream;
    this.targetArn = deliveryStream.deliveryStreamArn;
    this.deliveryStreamParameters = parameters;
  }

  grantPush(grantee: IRole): void {
    this.deliveryStream.grantPutRecords(grantee);
  }

  bind(pipe: IPipe): TargetConfig {
    return {
      targetParameters: {
        inputTemplate: this.deliveryStreamParameters.inputTransformation?.bind(pipe).inputTemplate,
      },
    };
  }
}
