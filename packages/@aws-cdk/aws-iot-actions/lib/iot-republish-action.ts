import * as iam from '@aws-cdk/aws-iam';
import * as iot from '@aws-cdk/aws-iot';
import { CommonActionProps } from './common-action-props';
import { singletonActionRole } from './private/role';

/**
 * MQTT Quality of Service (QoS) indicates the level of assurance for delivery of an MQTT Message.
 *
 * @see https://docs.aws.amazon.com/iot/latest/developerguide/mqtt.html#mqtt-qos
 */
export enum MqttQualityOfService {
  /**
   * QoS level 0. Sent zero or more times.
   * This level should be used for messages that are sent over reliable communication links or that can be missed without a problem.
   */
  ZERO_OR_MORE_TIMES,

  /**
   * QoS level 1. Sent at least one time, and then repeatedly until a PUBACK response is received.
   * The message is not considered complete until the sender receives a PUBACK response to indicate successful delivery.
   */
  AT_LEAST_ONCE,
}

/**
 * Configuration properties of an action to republish MQTT messages.
 */
export interface IotRepublishMqttActionProps extends CommonActionProps {
  /**
   * The Quality of Service (QoS) level to use when republishing messages.
   *
   * @see https://docs.aws.amazon.com/iot/latest/developerguide/mqtt.html#mqtt-qos
   *
   * @default MqttQualityOfService.ZERO_OR_MORE_TIMES
   */
  readonly qualityOfService?: MqttQualityOfService;
}

/**
 * The action to put the record from an MQTT message to republish another MQTT topic.
 */
export class IotRepublishMqttAction implements iot.IAction {
  private readonly qualityOfService?: MqttQualityOfService;
  private readonly role?: iam.IRole;

  /**
   * @param topic The MQTT topic to which to republish the message.
   * @param props Optional properties to not use default.
   */
  constructor(private readonly topic: string, props: IotRepublishMqttActionProps = {}) {
    this.qualityOfService = props.qualityOfService;
    this.role = props.role;
  }

  bind(rule: iot.ITopicRule): iot.ActionConfig {
    const role = this.role ?? singletonActionRole(rule);
    role.addToPrincipalPolicy(new iam.PolicyStatement({
      actions: ['iot:Publish'],
      resources: ['*'],
    }));

    return {
      configuration: {
        republish: {
          topic: this.topic,
          qos: this.qualityOfService,
          roleArn: role.roleArn,
        },
      },
    };
  }
}
