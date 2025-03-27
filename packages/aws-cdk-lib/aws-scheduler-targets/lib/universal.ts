import { ScheduleTargetBase, ScheduleTargetBaseProps } from './target';
import { IRole, PolicyStatement } from '../../aws-iam';
import { IScheduleTarget } from '../../aws-scheduler';
import { Annotations, Aws, Token } from '../../core';
import { awsSdkToIamAction } from '../../custom-resources/lib/helpers-internal';

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
export interface UniversalTargetProps extends ScheduleTargetBaseProps {
  /**
   * The AWS service to call.
   *
   * This must be in lowercase.
   */
  readonly service: string;

  /**
   * The API action to call. Must be camelCase.
   *
   * You cannot use read-only API actions such as common GET operations.
   *
   * @see https://docs.aws.amazon.com/scheduler/latest/UserGuide/managing-targets-universal.html#unsupported-api-actions
   */
  readonly action: string;

  /**
   * The IAM policy statements needed to invoke the target. These statements are attached to the Scheduler's role.
   *
   * Note that the default may not be the correct actions as not all AWS services follows the same IAM action pattern, or there may be more actions needed to invoke the target.
   *
   * @default - Policy with `service:action` action only.
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
    private readonly props: UniversalTargetProps,
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
    if (!this.props.policyStatements?.length) {
      Annotations.of(role).addWarningV2('@aws-cdk/aws-scheduler-targets:defaultWildcardResourcePolicy',
        'Default policy with * for resources is used. Use custom policy for better security posture.');
      role.addToPrincipalPolicy(new PolicyStatement({
        actions: [awsSdkToIamAction(this.props.service, this.props.action)],
        resources: ['*'],
      }));
      return;
    }

    for (const statement of this.props.policyStatements) {
      role.addToPrincipalPolicy(statement);
    }
  }
}
