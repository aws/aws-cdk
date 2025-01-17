import { Construct } from 'constructs';
import { CfnResourceVersion } from './cloudformation.generated';
import { IRole, Role, CompositePrincipal, ServicePrincipal, PolicyDocument, PolicyStatement, Effect } from '../../aws-iam';
import { ILogGroup, LogGroup, RetentionDays } from '../../aws-logs';
import { Asset } from '../../aws-s3-assets';
/**
 * logging configuration for handler
 */
export interface ILogConfiguration {
  /**
   * The ARN of the role that CloudFormation should assume when sending log entries to CloudWatch logs.
   */
  readonly logRole?: IRole;
  /**
   * The Amazon CloudWatch logs group to which CloudFormation sends error logging information when invoking the type's handlers.
   */
  readonly logGroup?: ILogGroup;
}

/**
 * properties for ResourceVersion construct
 */
export interface ResourceVersionProps {
  /**
   * The name of the resource being registered.
   * We recommend that resource names adhere to the following pattern: company_or_organization::service::type.
   */
  readonly typeName: string;
  /**
   * Logging configuration information for a resource.
   * @default if not provided, it will be auto generated
   */
  readonly logging?: ILogConfiguration;
  /**
   * Contains the resource project package that contains the necessary files for the resource you want to register.
   */
  readonly handler: Asset;
  /**
   * IAM role for CloudFormation to assume when invoking the resource. If your resource calls AWS APIs in any of its handlers, you must create an IAM execution role that includes the necessary permissions to call those AWS APIs,
   * and provision that execution role in your account. When CloudFormation needs to invoke the resource type handler, CloudFormation assumes this execution role to create a temporary session token,
   * which it then passes to the resource type handler, thereby supplying your resource type with the appropriate credentials.
   * @default no role will be passed to the resourceVersion
   */
  readonly executionRole?: IRole;
}

/**
 * L2 construct for https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-resourceversion.html
 */
export class ResourceVersion extends Construct {

  /**
   * resourceVersion resource created by this construct
   */
  public readonly resourceVersion: CfnResourceVersion;
  /**
   * logRole referenced by resourceVersion
   */
  public readonly logRole: IRole;
  /**
   * logGroup referenced by resourceVersion
   */
  public readonly logGroup: ILogGroup;

  constructor(scope: Construct, id: string, props: ResourceVersionProps) {
    super(scope, id);

    // default perms from https://github.com/aws-cloudformation/cloudformation-cli/blob/a73666d6b38099549c55f674748c095e0ef628ee/src/rpdk/core/data/managed-upload-infrastructure.yaml#L129
    this.logRole =
      props.logging?.logRole ??
      new Role(this, 'LogRole', {
        assumedBy: new CompositePrincipal(
          new ServicePrincipal('hooks.cloudformation.amazonaws.com'),
          new ServicePrincipal('resources.cloudformation.amazonaws.com'),
        ),
        description: 'Role for CloudFormation Resource Version logging',
        inlinePolicies: {
          LogAndMetricsDeliveryRolePolicy:
          new PolicyDocument({
            statements: [
              new PolicyStatement({
                effect: Effect.ALLOW,
                actions: ['cloudwatch:PutMetricData', 'cloudwatch:ListMetrics', 'logs:DescribeLogGroups'],
                resources: ['*'],
              }),
            ],
          }),

        },
      });

    this.logGroup =
      props.logging?.logGroup ??
      new LogGroup(this, 'LogGroup', {
        logGroupName: `/aws/cloudformation/${props.typeName.split('::').join('-')}`,
        retention: RetentionDays.TEN_YEARS,
      });
    this.logGroup.grantWrite(this.logRole);

    this.resourceVersion = new CfnResourceVersion(this, 'CfnResourceVersion', {
      typeName: props.typeName,
      schemaHandlerPackage: props.handler.s3ObjectUrl,
      loggingConfig: {
        logRoleArn: this.logRole.roleArn,
        logGroupName: this.logGroup.logGroupName,
      },
      executionRoleArn: props.executionRole?.roleArn,
    });
  }
}
