import * as iam from '@aws-cdk/aws-iam';
import { IConstruct, Arn, Stack } from '@aws-cdk/core';
import { IAction, ActionConfig, ITopicRule } from '..';
import { singletonActionRole } from './util';

/**
 * Configuration properties of an action for republishing
 */
export interface RepublishActionProps {
  /**
   * The Quality of Service (QoS) level to use when republishing messages.
   *
   * @default Qos.LEVEL_0
   */
  readonly qos?: Qos;
  /**
   * The IAM role that allows AWS IoT to publish to the MQTT topic.
   *
   * @default a new role will be created
   */
  readonly role?: iam.IRole;
}

/**
 * The Quality of Service (QoS) level to use when republishing messages.
 *
 * @see MQTT Quality of Service (QoS) options
 */
export enum Qos {
  /**
   * Sent zero or more times
   */
  LEVEL_0,
  /**
   * Sent at least one time, and then repeatedly until a PUBACK response is received
   */
  LEVEL_1,
}

/**
 * The action to republish an MQTT message to another MQTT topic.
 */
export class RepublishAction implements IAction {
  private readonly qos?: number;
  private readonly role?: iam.IRole;

  /**
   * @param topic The MQTT topic to which to republish the message.
   * @param props Optional properties to not use default
   */
  constructor(private readonly topic: string, props: RepublishActionProps = {}) {
    this.qos = props.qos;
    this.role = props.role;
  }

  bind(rule: ITopicRule): ActionConfig {
    const role = this.role ?? singletonActionRole(rule);
    role.addToPrincipalPolicy(this.putEventStatement(rule));

    return {
      republish: {
        qos: this.qos ?? Qos.LEVEL_0,
        roleArn: role.roleArn,
        topic: this.topic,
      },
    };
  }

  private putEventStatement(scope: IConstruct) {
    return new iam.PolicyStatement({
      actions: ['iot:Publish'],
      resources: [
        Arn.format({
          service: 'iot', resource: 'topic', resourceName: this.topic,
        }, Stack.of(scope)),
      ],
    });
  }
}
