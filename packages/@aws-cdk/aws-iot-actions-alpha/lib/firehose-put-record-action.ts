import * as iam from 'aws-cdk-lib/aws-iam';
import * as firehose from 'aws-cdk-lib/aws-kinesisfirehose';
import * as iot from '@aws-cdk/aws-iot-alpha';
import { CommonActionProps } from './common-action-props';
import { singletonActionRole } from './private/role';

/**
 * Record Separator to be used to separate records.
 */
export enum FirehoseRecordSeparator {
  /**
   * Separate by a new line
   */
  NEWLINE = '\n',

  /**
   * Separate by a tab
   */
  TAB = '\t',

  /**
   * Separate by a windows new line
   */
  WINDOWS_NEWLINE = '\r\n',

  /**
   * Separate by a comma
   */
  COMMA = ',',
}

/**
 * Configuration properties of an action for the Amazon Data Firehose stream.
 */
export interface FirehosePutRecordActionProps extends CommonActionProps {
  /**
   * Whether to deliver the Amazon Data Firehose stream as a batch by using `PutRecordBatch`.
   * When batchMode is true and the rule's SQL statement evaluates to an Array, each Array
   * element forms one record in the PutRecordBatch request. The resulting array can't have
   * more than 500 records.
   *
   * @default false
   */
  readonly batchMode?: boolean;

  /**
   * A character separator that will be used to separate records written to the Amazon Data Firehose stream.
   *
   * @default - none -- the stream does not use a separator
   */
  readonly recordSeparator?: FirehoseRecordSeparator;
}

/**
 * The action to put the record from an MQTT message to the Amazon Data Firehose stream.
 */
export class FirehosePutRecordAction implements iot.IAction {
  private readonly batchMode?: boolean;
  private readonly recordSeparator?: string;
  private readonly role?: iam.IRole;

  /**
   * @param stream The Amazon Data Firehose stream to which to put records.
   * @param props Optional properties to not use default
   */
  constructor(private readonly stream: firehose.IDeliveryStream, props: FirehosePutRecordActionProps = {}) {
    this.batchMode = props.batchMode;
    this.recordSeparator = props.recordSeparator;
    this.role = props.role;
  }

  /**
   * @internal
   */
  public _bind(rule: iot.ITopicRule): iot.ActionConfig {
    const role = this.role ?? singletonActionRole(rule);
    this.stream.grantPutRecords(role);

    return {
      configuration: {
        firehose: {
          batchMode: this.batchMode,
          deliveryStreamName: this.stream.deliveryStreamName,
          roleArn: role.roleArn,
          separator: this.recordSeparator,
        },
      },
    };
  }
}
