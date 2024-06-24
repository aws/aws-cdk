import { IInputTransformation, IPipe, ITarget, TargetConfig } from '@aws-cdk/aws-pipes-alpha';
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
   * @default none
   */
  readonly inputTransformation?: IInputTransformation;

  /**
   * Determines which shard in the stream the data record is assigned to. Partition keys are
   * Unicode strings with a maximum length limit of 256 characters for each key. Amazon Kinesis
   * Data Streams uses the partition key as input to a hash function that maps the partition key
   * and associated data to a specific shard. Specifically, an MD5 hash function is used to map
   * partition keys to 128-bit integer values and to map associated data records to shards. As a
   * result of this hashing mechanism, all data records with the same partition key map to the
   * same shard within the stream.
   *
   * Minimum: 0
   * Maximum: 256
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetkinesisstreamparameters.html#cfn-pipes-pipe-pipetargetkinesisstreamparameters-partitionkey
   */
  readonly partitionKey: string;
}

/**
 * A EventBridge Pipes target that sends messages to a Kinesis stream.
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
    if (!this.streamParameters) {
      return {
        targetParameters: {},
      };
    }

    return {
      targetParameters: {
        inputTemplate: this.streamParameters.inputTransformation?.bind(pipe).inputTemplate,
        kinesisStreamParameters: this.streamParameters,
      },
    };
  }
}

function validatePartitionKey(pk: string) {
  if (pk.length < 0 || pk.length > 256) {
    throw new Error(`Partition key must be between 0 and 256 characters, received ${pk.length}`);
  }
}
