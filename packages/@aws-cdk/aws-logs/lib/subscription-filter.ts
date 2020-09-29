import * as iam from '@aws-cdk/aws-iam';
import { Resource } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { ILogGroup, SubscriptionFilterOptions } from './log-group';
import { CfnSubscriptionFilter } from './logs.generated';

// v2 - keep this section separate to reduce merge conflicts when merging forwrad into v2 branch
// eslint-disable-next-line
import { Construct as CoreConstruct } from '@aws-cdk/core';

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
  bind(scope: CoreConstruct, sourceLogGroup: ILogGroup): LogSubscriptionDestinationConfig;
}

/**
 * Properties returned by a Subscription destination
 */
export interface LogSubscriptionDestinationConfig {
  /**
   * The ARN of the subscription's destination
   */
  readonly arn: string;

  /**
   * The role to assume to write log events to the destination
   *
   * @default No role assumed
   */
  readonly role?: iam.IRole;
}

/**
 * Properties for a SubscriptionFilter
 */
export interface SubscriptionFilterProps extends SubscriptionFilterOptions {
  /**
   * The log group to create the subscription on.
   */
  readonly logGroup: ILogGroup;
}

/**
 * A new Subscription on a CloudWatch log group.
 */
export class SubscriptionFilter extends Resource {
  constructor(scope: Construct, id: string, props: SubscriptionFilterProps) {
    super(scope, id);

    const destProps = props.destination.bind(this, props.logGroup);

    new CfnSubscriptionFilter(this, 'Resource', {
      logGroupName: props.logGroup.logGroupName,
      destinationArn: destProps.arn,
      roleArn: destProps.role && destProps.role.roleArn,
      filterPattern: props.filterPattern.logPatternString,
    });
  }
}
