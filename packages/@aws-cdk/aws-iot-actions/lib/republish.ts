import * as iam from '@aws-cdk/aws-iam';
import * as iot from '@aws-cdk/aws-iot';
import { Stack, Arn } from '@aws-cdk/core';
import { singletonTopicRuleRole } from './util';

/**
 * Construction properties for a Republish action.
 */
export interface RepublishProps {
  /**
   * The Quality of Service (Qos) level to use when republishing messages.
   *
   * @default - 0
   */
  readonly qos?: number;
  /**
   *
   * The MQTT topic to which to republish the message.
   *
   * To republish to a reserved topic, which begins with `$`, use `$$` instead.
   *
   * For example, to republish to the device shadow topic
   * `$aws/things/MyThing/shadow/update`, specify the topic as
   * `$$aws/things/MyThing/shadow/update`.
   */
  readonly topic: string;
  /**
   * The IAM role that grants access.
   *
   * @default - a role will be created
   */
  readonly role?: iam.IRole;
}

/**
 * Publishes to a IoT Topic
 */
export class Republish implements iot.ITopicRuleAction {
  constructor(private readonly props: RepublishProps) {
  }

  public bind(rule: iot.ITopicRule): iot.TopicRuleActionConfig {
    const stack = Stack.of(rule);
    // Allow rule to publish to topic
    // TODO: accept topic rule as prop - this.props.topic.topicRuleArn;
    // TODO: grantable topic rules - this.props.topic.grantPublish(rule);
    const role = this.props.role || singletonTopicRuleRole(rule, [new iam.PolicyStatement({
      actions: ['iot:Publish'],
      resources: [
        Arn.format({
          resource: 'topic',
          service: 'iot',
          resourceName: this.props.topic,
        }, stack),
      ],
    })]);

    return {
      republish: {
        qos: this.props.qos || 0,
        topic: this.props.topic,
        roleArn: role.roleArn,
      },
    };
  }
}
