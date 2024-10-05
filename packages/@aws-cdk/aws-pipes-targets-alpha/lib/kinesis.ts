import { IInputTransformation, IPipe, ITarget, TargetConfig } from '@aws-cdk/aws-pipes-alpha';
import { Token } from 'aws-cdk-lib';
import { IRole } from 'aws-cdk-lib/aws-iam';
import { IStream } from 'aws-cdk-lib/aws-kinesis';

/**
 * Kinesis target properties.
 */
export interface KinesisTargetParameters {
  /**
   * The input transformation to apply to the message before sending it to the target.
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetparameters.html#cfn-pipes-pipe-pipetargetparameters-inputtemplate
   * @default - none
   */
  readonly inputTransformation?: IInputTransformation;

  /**
   * Determines which shard in the stream the data record is assigned to.
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetkinesisstreamparameters.html#cfn-pipes-pipe-pipetargetkinesisstreamparameters-partitionkey
   */
  readonly partitionKey: string;
}

/**
 * An EventBridge Pipes target that sends messages to a Kinesis stream.
 */
export class KinesisTarget implements ITarget {
  private stream: IStream;
  private streamParameters: KinesisTargetParameters;
  public readonly targetArn: string;

  constructor(stream: IStream, parameters: KinesisTargetParameters) {
    this.stream = stream;
    this.targetArn = stream.streamArn;
    this.streamParameters = parameters;

    validatePartitionKey(parameters.partitionKey);
  }

  grantPush(grantee: IRole): void {
    this.stream.grantWrite(grantee);
  }

  bind(pipe: IPipe): TargetConfig {
    return {
      targetParameters: {
        inputTemplate: this.streamParameters.inputTransformation?.bind(pipe).inputTemplate,
        kinesisStreamParameters: this.streamParameters,
      },
    };
  }
}

function validatePartitionKey(pk: string) {
  if (!Token.isUnresolved(pk) && pk.length > 256) {
    throw new Error(`Partition key must be less than or equal to 256 characters, received ${pk.length}`);
  }
}
