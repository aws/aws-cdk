import { IInputTransformation, IPipe, ITarget, TargetConfig } from '@aws-cdk/aws-pipes-alpha';
import { IRole } from 'aws-cdk-lib/aws-iam';
import { ITopic } from 'aws-cdk-lib/aws-sns';

/**
 * SNS target properties.
 */
export interface SnsTargetParameters {
  /**
   * The input transformation to apply to the message before sending it to the target.
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetparameters.html#cfn-pipes-pipe-pipetargetparameters-inputtemplate
   * @default - none
   */
  readonly inputTransformation?: IInputTransformation;
}

/**
 * A EventBridge Pipes target that sends messages to an SNS topic.
 */
export class SnsTarget implements ITarget {
  private topic: ITopic;
  private topicParameters?: SnsTargetParameters;
  public readonly targetArn: string;

  constructor(topic: ITopic, parameters?: SnsTargetParameters) {
    this.topic = topic;
    this.targetArn = topic.topicArn;
    this.topicParameters = parameters;
  }

  grantPush(grantee: IRole): void {
    this.topic.grantPublish(grantee);
  }

  bind(pipe: IPipe): TargetConfig {
    if (!this.topicParameters?.inputTransformation) {
      return {
        targetParameters: {},
      };
    }

    return {
      targetParameters: {
        inputTemplate: this.topicParameters.inputTransformation?.bind(pipe).inputTemplate,
      },
    };
  }
}
