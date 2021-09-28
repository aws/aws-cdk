import * as iam from '@aws-cdk/aws-iam';
import * as logs from '@aws-cdk/aws-logs';
import { IAction, ActionConfig, ITopicRule } from '..';
import { singletonActionRole } from './util';

/**
 * Configuration properties of an action for CloudWatch Logs.
 */
export interface CloudwatchLogsActionProps {
  /**
   * The IAM role that allows access to the CloudWatch log group.
   *
   * @default a new role will be created
   */
  readonly role?: iam.IRole;
}

/**
 * The action to send data to Amazon CloudWatch Logs
 */
export class CloudwatchLogsAction implements IAction {
  private readonly role?: iam.IRole;

  /**
   * @param logGroup The CloudWatch log group to which the action sends data
   * @param props Optional properties to not use default
   */
  constructor(
    private readonly logGroup: logs.ILogGroup,
    props: CloudwatchLogsActionProps = {},
  ) {
    this.role = props.role;
  }

  bind(rule: ITopicRule): ActionConfig {
    const role = this.role ?? singletonActionRole(rule);
    this.logGroup.grant(role, 'logs:CreateLogStream', 'logs:DescribeLogStreams', 'logs:PutLogEvents');

    return {
      cloudwatchLogs: {
        logGroupName: this.logGroup.logGroupName,
        roleArn: role.roleArn,
      },
    };
  }
}
