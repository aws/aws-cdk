import { IScheduleTarget, ISchedule, ScheduleTargetInput, ScheduleTargetConfig } from '@aws-cdk/aws-scheduler-alpha';
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
 * Properties for a AWS API Target
 */
export interface AwsApiProps extends ScheduleTargetBaseProps {
  /**
   * The AWS service to call.
   */
  readonly service: string;

  /**
   * The API action to call.
   *
   * You cannot use read-only API actions such as common GET operations.
   * For more information, see the {@link https://docs.aws.amazon.com/scheduler/latest/UserGuide/managing-targets-universal.html}.
   *
   * ALso, This must be in camelCase.
   */
  readonly action: string;

  /**
   * The resource ARNs for the IAM statement that will be added to
   * the execution role's policy to allow the scheduler to make the API call.
   *
   * @default ['*']
   */
  readonly iamResources?: string[];

  /**
   * The action for the IAM statement that will be added to
   * the execution role's policy to allow the scheduler to make the API call.
   *
   * Use in the case where the IAM action name does not match with the
   * API service/action name, e.g. `s3:listObjectV2` requires `s3:ListBucket`.
   *
   * @default - service:action
   */
  readonly iamAction?: string;
}

/**
 * Send an event to an AWS EventBridge by AWS EventBridge Scheduler.
 */
export class AwsApi extends ScheduleTargetBase implements IScheduleTarget {
  constructor(
    private readonly props: AwsApiProps,
  ) {
    const service = props.service;
    const action = props.action;

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
    role.addToPrincipalPolicy(new PolicyStatement({
      actions: [this.props.iamAction ?? awsSdkToIamAction(this.props.service, this.props.action)],
      resources: this.props.iamResources ?? ['*'],
    }));
  }
}
