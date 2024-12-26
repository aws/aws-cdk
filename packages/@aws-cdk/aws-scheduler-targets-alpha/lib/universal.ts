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
 * The resources for the IAM policy statement that will be added to the scheduler role's policy
 * to allow the scheduler to make the API call.
 *
 * We recommend specifying the resources to the minimum required for the API call.
 *
 * @default ['*']
 */
readonly iamResources?: string[];

/**
 * The action for the IAM policy statement that will be added to the scheduler role's policy
 * to allow the scheduler to make the API call.
 *
 * Use this in cases where the IAM action name does not match the
 * API service/action name, e.g., `lambda:invoke` requires `lambda:InvokeFunction` permission.
 *
 * @default - service:action
 */
readonly iamAction?: string;

/**
 * The conditions for the IAM policy statement that will be added to the scheduler role's policy
 * to allow the scheduler to make the API call.
 *
 * @default - no conditions
 */
readonly iamConditions?: { [key: string]: any };

/**
 * Additional IAM policy statements that will be added to the scheduler role's policy.
 *
 * @default - no additional policy statements
 */
readonly additionalPolicyStatements?: PolicyStatement[];
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
    role.addToPrincipalPolicy(new PolicyStatement({
      actions: [this.props.iamAction ?? awsSdkToIamAction(this.props.service, this.props.action)],
      resources: this.props.iamResources ?? ['*'],
      conditions: this.props.iamConditions,
    }));

    for (const policyStatement of this.props.additionalPolicyStatements ?? []) {
      role.addToPrincipalPolicy(policyStatement);
    }
  }
}
