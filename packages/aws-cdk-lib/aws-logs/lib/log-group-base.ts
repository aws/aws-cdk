
import { ILogGroup, MetricFilterOptions, StreamOptions, SubscriptionFilterOptions } from './log-group';
import { LogStream } from './log-stream';
import { MetricFilter } from './metric-filter';
import { FilterPattern } from './pattern';
import { ResourcePolicy } from './policy';
import { SubscriptionFilter } from './subscription-filter';
import * as cloudwatch from '../../aws-cloudwatch';
import * as iam from '../../aws-iam';
import { Arn, ArnFormat, Resource } from '../../core';

/**
 * A CloudWatch Log Group
 */
export abstract class LogGroupBase extends Resource implements ILogGroup {
  /**
     * The ARN of this log group, with ':*' appended
     */
  public abstract readonly logGroupArn: string;

  /**
     * The name of this log group
     */
  public abstract readonly logGroupName: string;

  private policy?: ResourcePolicy;

  /**
     * Create a new Log Stream for this Log Group
     *
     * @param id Unique identifier for the construct in its parent
     * @param props Properties for creating the LogStream
     */
  public addStream(id: string, props: StreamOptions = {}): LogStream {
    return new LogStream(this, id, {
      logGroup: this,
      ...props,
    });
  }

  /**
     * Create a new Subscription Filter on this Log Group
     *
     * @param id Unique identifier for the construct in its parent
     * @param props Properties for creating the SubscriptionFilter
     */
  public addSubscriptionFilter(id: string, props: SubscriptionFilterOptions): SubscriptionFilter {
    return new SubscriptionFilter(this, id, {
      logGroup: this,
      ...props,
    });
  }

  /**
     * Create a new Metric Filter on this Log Group
     *
     * @param id Unique identifier for the construct in its parent
     * @param props Properties for creating the MetricFilter
     */
  public addMetricFilter(id: string, props: MetricFilterOptions): MetricFilter {
    return new MetricFilter(this, id, {
      logGroup: this,
      ...props,
    });
  }

  /**
     * Extract a metric from structured log events in the LogGroup
     *
     * Creates a MetricFilter on this LogGroup that will extract the value
     * of the indicated JSON field in all records where it occurs.
     *
     * The metric will be available in CloudWatch Metrics under the
     * indicated namespace and name.
     *
     * @param jsonField JSON field to extract (example: '$.myfield')
     * @param metricNamespace Namespace to emit the metric under
     * @param metricName Name to emit the metric under
     * @returns A Metric object representing the extracted metric
     */
  public extractMetric(jsonField: string, metricNamespace: string, metricName: string) {
    new MetricFilter(this, `${metricNamespace}_${metricName}`, {
      logGroup: this,
      metricNamespace,
      metricName,
      filterPattern: FilterPattern.exists(jsonField),
      metricValue: jsonField,
    });

    return new cloudwatch.Metric({ metricName, namespace: metricNamespace }).attachTo(this);
  }

  /**
     * Give permissions to create and write to streams in this log group
     */
  public grantWrite(grantee: iam.IGrantable) {
    return this.grant(grantee, 'logs:CreateLogStream', 'logs:PutLogEvents');
  }

  /**
     * Give permissions to read and filter events from this log group
     */
  public grantRead(grantee: iam.IGrantable) {
    return this.grant(grantee,
      'logs:FilterLogEvents',
      'logs:GetLogEvents',
      'logs:GetLogGroupFields',
      'logs:DescribeLogGroups',
      'logs:DescribeLogStreams',
    );
  }

  /**
     * Give the indicated permissions on this log group and all streams
     */
  public grant(grantee: iam.IGrantable, ...actions: string[]) {
    return iam.Grant.addToPrincipalOrResource({
      grantee,
      actions,
      // A LogGroup ARN out of CloudFormation already includes a ':*' at the end to include the log streams under the group.
      // See https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-loggroup.html#w2ab1c21c10c63c43c11
      resourceArns: [this.logGroupArn],
      resource: this,
    });
  }

  /**
     * Public method to get the physical name of this log group
     * @returns Physical name of log group
     */
  public logGroupPhysicalName(): string {
    return this.physicalName;
  }

  /**
     * Adds a statement to the resource policy associated with this log group.
     * A resource policy will be automatically created upon the first call to `addToResourcePolicy`.
     *
     * Any ARN Principals inside of the statement will be converted into AWS Account ID strings
     * because CloudWatch Logs Resource Policies do not accept ARN principals.
     *
     * @param statement The policy statement to add
     */
  public addToResourcePolicy(statement: iam.PolicyStatement): iam.AddToResourcePolicyResult {
    if (!this.policy) {
      this.policy = new ResourcePolicy(this, 'Policy');
    }
    this.policy.document.addStatements(statement.copy({
      principals: statement.principals.map(p => this.convertArnPrincipalToAccountId(p)),
    }));
    return { statementAdded: true, policyDependable: this.policy };
  }

  private convertArnPrincipalToAccountId(principal: iam.IPrincipal) {
    if (principal.principalAccount) {
      // we use ArnPrincipal here because the constructor inserts the argument
      // into the template without mutating it, which means that there is no
      // ARN created by this call.
      return new iam.ArnPrincipal(principal.principalAccount);
    }

    if (principal instanceof iam.ArnPrincipal) {
      const parsedArn = Arn.split(principal.arn, ArnFormat.SLASH_RESOURCE_NAME);
      if (parsedArn.account) {
        return new iam.ArnPrincipal(parsedArn.account);
      }
    }

    return principal;
  }
}
