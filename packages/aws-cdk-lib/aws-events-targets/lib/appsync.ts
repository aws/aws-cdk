import { addToDeadLetterQueueResourcePolicy, bindBaseTargetConfig, singletonEventRole, TargetBaseProps } from './util';
import * as appsync from '../../aws-appsync';
import * as events from '../../aws-events';
import * as iam from '../../aws-iam';

/**
 * Customize the AppSync GraphQL API target
 */
export interface AppSyncGraphQLAPIProps extends TargetBaseProps {

  /**
   * The GraphQL operation; that is, the query, mutation, or subscription
   * to be parsed and executed by the GraphQL service.
   */
  readonly graphQLOperation: string;

  /**
   * The variables that are include in the GraphQL operation.
   */
  readonly variables: events.RuleTargetInput;

  /**
   * The role to assume before invoking the target
   * (i.e., the pipeline) when the given rule is triggered.
   *
   * @default - a new role with permissions to access mutations will be created
   */
  readonly eventRole?: iam.IRole;

}

/**
 * Use an AppSync GraphQL API as a target for Amazon EventBridge rules.
 */
export class AppSync implements events.IRuleTarget {

  constructor(private readonly appsyncApi: appsync.GraphqlApi, private readonly props: AppSyncGraphQLAPIProps) {
  }

  /**
   * Returns a RuleTarget that can be used to trigger this AppSync GraphQL API
   * as a result from an EventBridge event.
   */
  public bind(rule: events.IRule, _id?: string): events.RuleTargetConfig {
    if (this.props.deadLetterQueue) {
      addToDeadLetterQueueResourcePolicy(rule, this.props.deadLetterQueue);
    }

    // make sure the API has AWS_IAM configured.
    if (!this.appsyncApi.modes.includes(appsync.AuthorizationType.IAM)) {
      throw new Error('You must have AWS_IAM authorization mode enabled on your API to configure an AppSync target');
    }

    const role = this.props.eventRole || singletonEventRole(this.appsyncApi);

    // if a role was not provided, attach a permission
    if (!this.props.eventRole) {
      this.appsyncApi.grantMutation(role, ...(this.props.mutationFields ?? []));
    }

    return {
      ...bindBaseTargetConfig(this.props),
      arn: this.appsyncApi.graphQLEndpointArn,
      role,
      deadLetterConfig: this.props.deadLetterQueue && { arn: this.props.deadLetterQueue?.queueArn },
      input: this.props.variables,
      targetResource: this.appsyncApi,
      appSyncParameters: {
        graphQlOperation: this.props.graphQLOperation,
      },
    };
  }
}

