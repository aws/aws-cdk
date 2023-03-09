import * as iam from '@aws-cdk/aws-iam';
import * as iot from '@aws-cdk/aws-iot';
import * as iotevents from '@aws-cdk/aws-iotevents';
import { CommonActionProps } from './common-action-props';
import { singletonActionRole } from './private/role';

/**
 * Configuration properties of an action for the IoT Events.
 */
export interface IotEventsPutMessageActionProps extends CommonActionProps {
  /**
   * Whether to process the event actions as a batch.
   *
   * When batchMode is true, you can't specify a messageId.
   *
   * When batchMode is true and the rule SQL statement evaluates to an Array,
   * each Array element is treated as a separate message when Events by calling BatchPutMessage.
   * The resulting array can't have more than 10 messages.
   *
   * @default false
   */
  readonly batchMode?: boolean;

  /**
   * The ID of the message.
   *
   * When batchMode is true, you can't specify a messageId--a new UUID value will be assigned.
   * Assign a value to this property to ensure that only one input (message) with a given messageId will be processed by an AWS IoT Events detector.
   *
   * @default - none -- a new UUID value will be assigned
   */
  readonly messageId?: string;
}

/**
 * The action to put the message from an MQTT message to the IoT Events input.
 */
export class IotEventsPutMessageAction implements iot.IAction {
  private readonly batchMode?: boolean;
  private readonly messageId?: string;
  private readonly role?: iam.IRole;

  /**
   * @param input The IoT Events input to put messages.
   * @param props Optional properties to not use default
   */
  constructor(private readonly input: iotevents.IInput, props: IotEventsPutMessageActionProps = {}) {
    this.batchMode = props.batchMode;
    this.messageId = props.messageId;
    this.role = props.role;

    if (this.batchMode && this.messageId) {
      throw new Error('messageId is not allowed when batchMode is true');
    }
  }

  /**
   * @internal
   */
  public _bind(rule: iot.ITopicRule): iot.ActionConfig {
    const role = this.role ?? singletonActionRole(rule);
    this.input.grantWrite(role);

    return {
      configuration: {
        iotEvents: {
          batchMode: this.batchMode,
          inputName: this.input.inputName,
          messageId: this.messageId,
          roleArn: role.roleArn,
        },
      },
    };
  }
}
