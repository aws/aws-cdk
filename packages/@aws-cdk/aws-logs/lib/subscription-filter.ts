import iam = require('@aws-cdk/aws-iam');
import { Construct, Resource } from '@aws-cdk/cdk';
import { ILogGroup } from './log-group';
import { CfnSubscriptionFilter } from './logs.generated';
import { IFilterPattern } from './pattern';

/**
 * Interface for classes that can be the destination of a log Subscription
 */
export interface ILogSubscriptionDestination {
  /**
   * Return the properties required to send subscription events to this destination.
   *
   * If necessary, the destination can use the properties of the SubscriptionFilter
   * object itself to configure its permissions to allow the subscription to write
   * to it.
   *
   * The destination may reconfigure its own permissions in response to this
   * function call.
   */
  logSubscriptionDestination(sourceLogGroup: ILogGroup): LogSubscriptionDestination;
}

/**
 * Properties returned by a Subscription destination
 */
export interface LogSubscriptionDestination {
  /**
   * The ARN of the subscription's destination
   */
  readonly arn: string;

  /**
   * The role to assume to write log events to the destination
   *
   * @default No role assumed
   */
  readonly role?: iam.Role;
}

/**
 * Properties for a SubscriptionFilter
 */
export interface SubscriptionFilterProps {
  /**
   * The log group to create the subscription on.
   */
  readonly logGroup: ILogGroup;

  /**
   * The destination to send the filtered events to.
   *
   * For example, a Kinesis stream or a Lambda function.
   */
  readonly destination: ILogSubscriptionDestination;

  /**
   * Log events matching this pattern will be sent to the destination.
   */
  readonly filterPattern: IFilterPattern;
}

/**
 * A new Subscription on a CloudWatch log group.
 */
export class SubscriptionFilter extends Resource {
  constructor(scope: Construct, id: string, props: SubscriptionFilterProps) {
    super(scope, id);

    const destProps = props.destination.logSubscriptionDestination(props.logGroup);

    new CfnSubscriptionFilter(this, 'Resource', {
      logGroupName: props.logGroup.logGroupName,
      destinationArn: destProps.arn,
      roleArn: destProps.role && destProps.role.roleArn,
      filterPattern: props.filterPattern.logPatternString
    });
  }
}
