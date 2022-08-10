import * as events from '@aws-cdk/aws-events';
import * as iam from '@aws-cdk/aws-iam';
import { addToDeadLetterQueueResourcePolicy, bindBaseTargetConfig, singletonEventRole, TargetBaseProps } from './util';

/**
 * Customize the EventBridge Api Destinations Target
 */
export interface ApiDestinationProps extends TargetBaseProps {
  /**
   * The event to send
   *
   * @default - the entire EventBridge event
   */
  readonly event?: events.RuleTargetInput;

  /**
   * The role to assume before invoking the target
   *
   * @default - a new role will be created
   */
  readonly eventRole?: iam.IRole;

  /**
   * Additional headers sent to the API Destination
   *
   * These are merged with headers specified on the Connection, with
   * the headers on the Connection taking precedence.
   *
   * You can only specify secret values on the Connection.
   *
   * @default - none
   */
  readonly headerParameters?: Record<string, string>;

  /**
   * Path parameters to insert in place of path wildcards (`*`).
   *
   * If the API destination has a wilcard in the path, these path parts
   * will be inserted in that place.
   *
   * @default - none
   */
  readonly pathParameterValues?: string[]

  /**
   * Additional query string parameters sent to the API Destination
   *
   * These are merged with headers specified on the Connection, with
   * the headers on the Connection taking precedence.
   *
   * You can only specify secret values on the Connection.
   *
   * @default - none
   */
  readonly queryStringParameters?: Record<string, string>;
}

/**
 * Use an API Destination rule target.
 */
export class ApiDestination implements events.IRuleTarget {
  constructor(
    private readonly apiDestination: events.IApiDestination,
    private readonly props: ApiDestinationProps = {},
  ) { }

  /**
   * Returns a RuleTarget that can be used to trigger API destinations
   * from an EventBridge event.
   */
  public bind(_rule: events.IRule, _id?: string): events.RuleTargetConfig {
    const httpParameters: events.CfnRule.HttpParametersProperty | undefined =
      this.props.headerParameters ??
      this.props.pathParameterValues ??
      this.props.queryStringParameters
        ? {
          headerParameters: this.props.headerParameters,
          pathParameterValues: this.props.pathParameterValues,
          queryStringParameters: this.props.queryStringParameters,
        } : undefined;

    if (this.props?.deadLetterQueue) {
      addToDeadLetterQueueResourcePolicy(_rule, this.props.deadLetterQueue);
    }

    const role = this.props?.eventRole ?? singletonEventRole(this.apiDestination);
    role.addToPrincipalPolicy(new iam.PolicyStatement({
      resources: [this.apiDestination.apiDestinationArn],
      actions: ['events:InvokeApiDestination'],
    }));

    return {
      ...(this.props ? bindBaseTargetConfig(this.props) : {}),
      arn: this.apiDestination.apiDestinationArn,
      role,
      input: this.props.event,
      targetResource: this.apiDestination,
      httpParameters,
    };
  }
}
