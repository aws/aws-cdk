import { IScheduleTarget } from '@aws-cdk/aws-scheduler-alpha';
import { Aws, Token } from 'aws-cdk-lib';
import { IRole, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { awsSdkToIamAction } from 'aws-cdk-lib/custom-resources/lib/helpers-internal';
import { ScheduleTargetBase, ScheduleTargetBaseProps } from './target';

/**
 * AWS read-only API action name prefixes that are not supported by EventBridge Scheduler.
 *
 * @see https://docs.aws.amazon.com/scheduler/latest/UserGuide/managing-targets-universal.html
 */
const NOT_SUPPORTED_ACTION_PREFIX = [
  'get',
  'describe',
  'list',
  'poll',
  'receive',
  'search',
  'scan',
  'query',
  'select',
  'read',
  'lookup',
  'discover',
  'validate',
  'batchGet',
  'batchDescribe',
  'batchRead',
  'transactGet',
  'adminGet',
  'adminList',
  'testMigration',
  'retrieve',
  'testConnection',
  'translateDocument',
  'isAuthorized',
  'invokeModel',
];

/**
 * Properties for a Universal Target
 */
export interface UniversalProps extends ScheduleTargetBaseProps {
  /**
   * The AWS service to call.
   *
   * This must be in lowercase.
   */
  readonly service: string;

  /**
   * The API action to call.
   *
   * You cannot use read-only API actions such as common GET operations.
   *
   * Also, This must be in camelCase.
   */
  readonly action: string;

  /**
   * The IAM policy statements to allow the API call.
   *
   * This policies will be added to the role that is used to invoke the API.
   *
   * @default - extract the permission from the API call
   */
  readonly policyStatements?: PolicyStatement[];
}

/**
 * Use a wider set of AWS API as a target for AWS EventBridge Scheduler.
 *
 * @see https://docs.aws.amazon.com/scheduler/latest/UserGuide/managing-targets-universal.html
 */
export class Universal extends ScheduleTargetBase implements IScheduleTarget {
  constructor(
    private readonly props: UniversalProps,
  ) {
    const service = props.service;
    const action = props.action;

    if (!Token.isUnresolved(service) && service !== service.toLowerCase()) {
      throw new Error(`API service must be lowercase, got: ${service}`);
    }
    if (!Token.isUnresolved(action) && !action.startsWith(action[0]?.toLowerCase())) {
      throw new Error(`API action must be camelCase, got: ${action}`);
    }
    if (!Token.isUnresolved(action) && NOT_SUPPORTED_ACTION_PREFIX.some(prefix => action.startsWith(prefix))) {
      throw new Error(`Read-only API action is not supported by EventBridge Scheduler: ${service}:${action}`);
    }

    const arn = `arn:${Aws.PARTITION}:scheduler:::aws-sdk:${service}:${action}`;
    super(props, arn);
  }

  protected addTargetActionToRole(role: IRole): void {
    // If policyStatements is not provided or empty, add a policy statement extracted from the API call
    if (!this.props.policyStatements || !this.props.policyStatements.length) {
      role.addToPrincipalPolicy(new PolicyStatement({
        actions: [awsSdkToIamAction(this.props.service, this.props.action)],
        resources: ['*'],
      }));
      return;
    }

    for (const policyStatement of this.props.policyStatements) {
      role.addToPrincipalPolicy(policyStatement);
    }
  }
}
