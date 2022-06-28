import * as fs from 'fs';
import * as path from 'path';
import * as iam from '@aws-cdk/aws-iam';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';

export class NotificationsResourceHandlerProps {
  /**
   * Role used by the notification resource handler
   */
  role?: iam.IRole;

  /**
   * Vpc to which the notification resource handler gets deployed
   * 
   * The Vpc requires at least one privat subnet!
   */
  vpc?: ec2.IVpc;
}

/**
 * A Lambda-based custom resource handler that provisions S3 bucket
 * notifications for a bucket.
 *
 * The resource property schema is:
 *
 * {
 *   BucketName: string, NotificationConfiguration: { see
 *   PutBucketNotificationConfiguration }
 * }
 *
 * For 'Delete' operations, we send an empty NotificationConfiguration as
 * required. We propagate errors and results as-is.
 *
 * Sadly, we can't use @aws-cdk/aws-lambda as it will introduce a dependency
 * cycle, so this uses raw `cdk.Resource`s.
 */
export class NotificationsResourceHandler extends Construct {
  /**
   * Defines a stack-singleton lambda function with the logic for a CloudFormation custom
   * resource that provisions bucket notification configuration for a bucket.
   *
   * @returns The ARN of the custom resource lambda function.
   */
  public static singleton(context: Construct, props: NotificationsResourceHandlerProps = {}) {
    const root = cdk.Stack.of(context);

    // well-known logical id to ensure stack singletonity
    const logicalId = 'BucketNotificationsHandler050a0587b7544547bf325f094a3db834';
    let lambda = root.node.tryFindChild(logicalId) as NotificationsResourceHandler;
    if (!lambda) {
      lambda = new NotificationsResourceHandler(root, logicalId, props);
    }

    return lambda;
  }

  /**
   * The ARN of the handler's lambda function. Used as a service token in the
   * custom resource.
   */
  public readonly functionArn: string;

  /**
   * The role of the handler's lambda function.
   */
  public readonly role: iam.IRole;

  constructor(scope: Construct, id: string, props: NotificationsResourceHandlerProps = {}) {
    super(scope, id);

    this.role = props.role ?? new iam.Role(this, 'Role', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });

    this.role.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'),
    );
    this.role.addToPrincipalPolicy(new iam.PolicyStatement({
      sid: "LambdaPutBucketNotificationPolicy",
      actions: ['s3:PutBucketNotification'],
      resources: ['*'],
    }));

    // If the lambda gets deployed to a VPC an additional policy is required
    if (props.vpc) {
      this.role.addToPrincipalPolicy(new iam.PolicyStatement({
        sid: "LambdaVpcPolicy",
        actions: [
          'ec2:CreateNetworkInterface',
          'ec2:DescribeNetworkInterfaces',
          'ec2:DeleteNetworkInterface'
        ],
        resources: ['*'],
      }));
    }

    const resourceType = 'AWS::Lambda::Function';
    class InLineLambda extends cdk.CfnResource {
      public readonly tags: cdk.TagManager = new cdk.TagManager(cdk.TagType.STANDARD, resourceType);

      protected renderProperties(properties: any): { [key: string]: any } {
        properties.Tags = cdk.listMapper(cdk.cfnTagToCloudFormation)(this.tags.renderTags());
        delete properties.tags;
        return properties;
      }
    }

    const handlerSource = fs.readFileSync(path.join(__dirname, 'lambda/index.py'), 'utf8');

    // Removing lines that starts with '#' (comment lines) in order to fit the 4096 limit
    const handlerSourceWithoutComments = handlerSource.replace(/^ *#.*\n?/gm, '');

    if (handlerSourceWithoutComments.length > 4096) {
      throw new Error(`Source of Notifications Resource Handler is too large (${handlerSourceWithoutComments.length} > 4096)`);
    }

    const resource = new InLineLambda(this, 'Resource', {
      type: resourceType,
      properties: {
        Description: 'AWS CloudFormation handler for "Custom::S3BucketNotifications" resources (@aws-cdk/aws-s3)',
        Code: { ZipFile: handlerSourceWithoutComments },
        Handler: 'index.handler',
        Role: this.role.roleArn,
        Runtime: 'python3.7',
        Timeout: 300,
        VpcConfig: this.getVpcConfig(props.vpc)
      },
    });
    resource.node.addDependency(this.role);

    this.functionArn = resource.getAtt('Arn').toString();
  }

  public addToRolePolicy(statement: iam.PolicyStatement) {
    this.role.addToPrincipalPolicy(statement);
  }

  private getVpcConfig(vpc: ec2.IVpc) {

    if (!vpc) { return undefined; }

    const { subnetIds } = vpc.selectSubnets({
      subnetType: ec2.SubnetType.PRIVATE_ISOLATED
    })
    const securityGroup = new ec2.SecurityGroup(this, 'SecurityGroup', {
      vpc: vpc,
      description: 'Automatic security group for Lambda Function ' + cdk.Names.uniqueId(this),
      allowAllOutbound: true,
    });
    const securityGroups = [securityGroup];

    return {
      SubnetIds: subnetIds,
      SecurityGroupIds: securityGroups.map(sg => sg.securityGroupId),
    }
  }
}
