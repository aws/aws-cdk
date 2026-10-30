import * as logs from './logs.generated';
import { logGroupArnWithoutStreamSuffix } from './private/log-group-arn';
import * as iam from '../../aws-iam';
import type * as cdk from '../../core/lib';

/**
 * Properties for LogGroupGrants
 */
interface LogGroupGrantsProps {
  /**
   * The resource on which actions will be allowed
   */
  readonly resource: logs.ILogGroupRef;

  /**
   * The resource with policy on which actions will be allowed
   *
   * @default - No resource policy is created
   */
  readonly policyResource?: iam.IResourceWithPolicyV2;
}

/**
 * Collection of grant methods for a ILogGroupRef
 */
export class LogGroupGrants {
  /**
   * Creates grants for LogGroupGrants
   */
  public static fromLogGroup(resource: logs.ILogGroupRef): LogGroupGrants {
    return new LogGroupGrants({
      resource: resource,
      policyResource: iam.ResourceWithPolicies.of(resource),
    });
  }

  protected readonly resource: logs.ILogGroupRef;

  protected readonly policyResource?: iam.IResourceWithPolicyV2;

  private constructor(props: LogGroupGrantsProps) {
    this.resource = props.resource;
    this.policyResource = props.policyResource;
  }

  /**
   * Grant the given identity custom permissions
   */
  public actions(grantee: iam.IGrantable, actions: Array<string>, options: cdk.PermissionsOptions = {}): iam.Grant {
    const resourceArns = options.resourceArns ?? [logs.CfnLogGroup.arnForLogGroup(this.resource)];
    return this.policyResource
      ? iam.Grant.addToPrincipalOrResource({
        actions: actions,
        grantee: grantee,
        resourceArns: resourceArns,
        resource: this.policyResource,
      })
      : iam.Grant.addToPrincipal({
        actions: actions,
        grantee: grantee,
        resourceArns: resourceArns,
      });
  }

  /**
   * Give permissions to create and write to streams in this log group
   */
  public write(grantee: iam.IGrantable): iam.Grant {
    const actions = ['logs:CreateLogStream', 'logs:PutLogEvents'];
    return this.actions(grantee, actions, {});
  }

  /**
   * Give permissions to read and filter events from this log group
   */
  public read(grantee: iam.IGrantable): iam.Grant {
    const actions = ['logs:FilterLogEvents', 'logs:GetLogEvents', 'logs:GetLogGroupFields', 'logs:DescribeLogGroups', 'logs:DescribeLogStreams'];
    // Include both the log group ARN and the log stream ARN (':*').
    return this.actions(grantee, actions, {
      resourceArns: [
        logGroupArnWithoutStreamSuffix(this.resource),
        logs.CfnLogGroup.arnForLogGroup(this.resource),
      ],
    });
  }
}
