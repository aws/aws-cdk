import * as iam from '@aws-cdk/aws-iam';
import * as iot from '@aws-cdk/aws-iot';
import * as s3 from '@aws-cdk/aws-s3';
import { CommonActionProps } from './common-action-props';
import { singletonActionRole } from './private/role';

/**
 * Configuration properties of an action for s3.
 */
export interface SQSQueueActionProps extends CommonActionProps {
  /**
   * The URL of the Amazon SQS queue.
   */
  readonly queueUrl: string

  /**
   * Specifies whether to use Base64 encoding.
   *
   * @default false
   */
  readonly useBase64: boolean
}

/**
 * The action to write the data from an MQTT message to an Amazon SQS queue.
 */
export class SQSQueueAction implements iot.IAction {
  private readonly role?: iam.IRole;
  private readonly queueUrl: string;
  private readonly useBase64: boolean;


  /**
   * @param bucket The Amazon S3 bucket to which to write data.
   * @param props Optional properties to not use default
   */
  constructor(private readonly bucket: s3.IBucket, props: SQSQueueActionProps) {
    this.role = props.role;
    this.queueUrl = props.queueUrl;
    this.useBase64 = props.useBase64;
  }

  bind(rule: iot.ITopicRule): iot.ActionConfig {
    const role = this.role ?? singletonActionRole(rule);
    role.addToPrincipalPolicy(new iam.PolicyStatement({
      actions: ['s3:PutObject'],
      resources: [this.bucket.arnForObjects('*')],
    }));

    return {
      configuration: {
        sqs: {
          queueUrl: this.queueUrl,
          useBase64: this.useBase64,
          roleArn: role.roleArn,
        },
      },
    };
  }
}
