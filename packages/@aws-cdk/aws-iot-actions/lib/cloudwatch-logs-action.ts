import * as iam from '@aws-cdk/aws-iam';
import * as iot from '@aws-cdk/aws-iot';
import * as logs from '@aws-cdk/aws-logs';
import { singletonActionRole } from './private/role';

/**
 * Configuration properties of an action for CloudWatch Logs.
 */
export interface CloudWatchLogsActionProps {
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
export class CloudWatchLogsAction implements iot.IAction {
  private readonly role?: iam.IRole;

  /**
   * @param logGroup The CloudWatch log group to which the action sends data
   * @param props Optional properties to not use default
   */
  constructor(
    private readonly logGroup: logs.ILogGroup,
    props: CloudWatchLogsActionProps = {},
  ) {
    this.role = props.role;
  }

  bind(rule: iot.ITopicRule): iot.ActionConfig {
    const role = this.role ?? singletonActionRole(rule);
    this.logGroup.grantWrite(role);
    this.logGroup.grant(role, 'logs:DescribeLogStreams');

    return {
      configuration: {
        cloudwatchLogs: {
          logGroupName: this.logGroup.logGroupName,
          roleArn: role.roleArn,
        },
      },
    };
  }
}
