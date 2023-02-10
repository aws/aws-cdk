import * as iam from '@aws-cdk/aws-iam';
import * as iot from '@aws-cdk/aws-iot';
import { CfnTopicRule } from '@aws-cdk/aws-iot';
import { CfnTracker } from '@aws-cdk/aws-location';
import { CommonActionProps } from './common-action-props';
import { singletonActionRole } from './private/role';

/**
 * Location Timestamp Unit Enum
 *
 * @see https://docs.aws.amazon.com/iot/latest/apireference/API_LocationTimestamp.html
 */
export enum LocationTimestampUnit {
  /**
   * SECONDS
   *
   */
  SECONDS='SECONDS',

  /**
   * MILLISECONDS
   *
   */
  MILLISECONDS='MILLISECONDS',

  /**
   * MICROSECONDS
   *
   */
  MICROSECONDS='MICROSECONDS',

  /**
   * NANOSECONDS
   *
   */
  NANOSECONDS='NANOSECONDS',
}

/**
 * Describes how to interpret an application-defined timestamp value from an MQTT message payload and the precision of that value
 *
 * @see https://docs.aws.amazon.com/iot/latest/apireference/API_LocationTimestamp.html
 */
export interface LocationTimestamp {
  /**
     * The precision of the timestamp value that results from the expression described in `value`.
     * @see https://docs.aws.amazon.com/iot/latest/apireference/API_LocationTimestamp.html
     *
     * @default MILLISECONDS
     */
  readonly unit?: LocationTimestampUnit

  /**
     * An expression that returns a long epoch time value
     * @see https://docs.aws.amazon.com/iot/latest/developerguide/iot-substitution-templates.html
     *
     * @default '${timestamp()}'
     */
  readonly value?: string
}

/**
 * Configuration properties of an action for Location.
 */
export interface LocationActionProps extends CommonActionProps {
  /**
   * The deviceId providing the location data.
   * @see https://docs.aws.amazon.com/iot/latest/apireference/API_LocationAction.html
   *
   * @default None
   */
  readonly deviceId: string;

  /**
   * A string that evaluates to a double value that represents the latitude of the device's location
   * @see https://docs.aws.amazon.com/iot/latest/apireference/API_LocationAction.html
   *
   * @default None
   */
  readonly latitude: string;

  /**
   * A string that evaluates to a double value that represents the longitude of the device's location.
   * @see https://docs.aws.amazon.com/iot/latest/apireference/API_LocationAction.html
   *
   * @default None
   */
  readonly longitude: string;

  /**
   * The time that the location data was sampled. The default value is the time the MQTT message was processed..
   * @see https://docs.aws.amazon.com/iot/latest/apireference/API_LocationAction.html
   *
   * @default {unit: 'MILLISECONDS', value: '${timestamp()}'}
   */
  readonly timestamp?: LocationTimestamp;
}

/**
 * The action to write the data from an MQTT message to an Amazon S3 bucket.
 */
export class LocationAction implements iot.IAction {
  private readonly deviceId: string;
  private readonly latitude: string;
  private readonly longitude: string;
  private readonly timestamp?: LocationTimestamp;
  private readonly role?: iam.IRole;

  /**
   * @param tracker The Amazon Location tracker to which to write data.
   * @param props Optional properties to not use default
   */
  constructor(private readonly tracker: CfnTracker, props: LocationActionProps) {
    this.deviceId = props.deviceId;
    this.latitude = props.latitude;
    this.longitude = props.longitude;
    this.timestamp = props.timestamp;
    this.role = props.role;
  }

  /**
   * @internal
   */
  public _bind(rule: iot.ITopicRule): iot.ActionConfig {
    const role = this.role ?? singletonActionRole(rule);
    role.addToPrincipalPolicy(
      new iam.PolicyStatement({
        actions: ['geo:BatchUpdateDevicePosition'],
        resources: [this.tracker.attrArn],
      }),
    );
    // TODO: remove when this bug has been fixed! https://github.com/aws/aws-cdk/issues/22732
    const topicRule = rule.node.defaultChild as CfnTopicRule;
    topicRule.addOverride('Properties.TopicRulePayload.Actions.0', {
      Location: {
        DeviceId: this.deviceId,
        Latitude: this.latitude,
        Longitude: this.longitude,
        RoleArn: role.roleArn,
        Timestamp: this.timestamp
          ? { Value: this.timestamp.value, Unit: this.timestamp.unit }
          : {
            Value: '${timestamp()}',
            Unit: LocationTimestampUnit.MILLISECONDS,
          },
        TrackerName: this.tracker.trackerName,
      },
    });
    // END TODO

    return {
      configuration: {
        location: {
          deviceId: this.deviceId,
          latitude: this.latitude,
          longitude: this.longitude,
          roleArn: role.roleArn,
          trackerName: this.tracker.trackerName,
          timestamp: new Date(),
        },
      },
    };
  }
}
