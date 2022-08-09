import * as iam from '@aws-cdk/aws-iam';
import * as iot from '@aws-cdk/aws-iot';
import * as kinesis from '@aws-cdk/aws-kinesis';
import { CommonActionProps } from './common-action-props';
import { singletonActionRole } from './private/role';

/**
 * Configuration properties of an action for the Kinesis Data stream.
 */
export interface KinesisPutRecordActionProps extends CommonActionProps {
  /**
   * The partition key used to determine to which shard the data is written.
   * The partition key is usually composed of an expression (for example, ${topic()} or ${timestamp()}).
   *
   * @see https://docs.aws.amazon.com/iot/latest/developerguide/iot-substitution-templates.html
   *
   * You can use the expression '${newuuid()}' if your payload does not have a high cardinarity property.
   * If you use empty string, this action use no partition key and all records will put same one shard.
   *
   * @see https://docs.aws.amazon.com/kinesis/latest/APIReference/API_PutRecord.html#API_PutRecord_RequestParameters
   */
  readonly partitionKey: string;
}

/**
 * The action to put the record from an MQTT message to the Kinesis Data stream.
 */
export class KinesisPutRecordAction implements iot.IAction {
  private readonly partitionKey?: string;
  private readonly role?: iam.IRole;

  /**
   * @param stream The Kinesis Data stream to which to put records.
   * @param props Optional properties to not use default
   */
  constructor(private readonly stream: kinesis.IStream, props: KinesisPutRecordActionProps) {
    this.partitionKey = props.partitionKey;
    this.role = props.role;
  }

  /**
   * @internal
   */
  public _bind(rule: iot.ITopicRule): iot.ActionConfig {
    const role = this.role ?? singletonActionRole(rule);
    role.addToPrincipalPolicy(new iam.PolicyStatement({
      actions: ['kinesis:PutRecord'],
      resources: [this.stream.streamArn],
    }));

    return {
      configuration: {
        kinesis: {
          streamName: this.stream.streamName,
          partitionKey: this.partitionKey || undefined,
          roleArn: role.roleArn,
        },
      },
    };
  }
}
