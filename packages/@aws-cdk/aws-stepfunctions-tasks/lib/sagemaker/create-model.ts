import * as ec2 from '@aws-cdk/aws-ec2';
import * as iam from '@aws-cdk/aws-iam';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
import { IContainerDefinition } from './base-types';
import { integrationResourceArn, validatePatternSupported } from '../private/task-utils';

/**
 * Properties for creating an Amazon SageMaker model
 *
 * @see https://docs.aws.amazon.com/step-functions/latest/dg/connect-sagemaker.html
 */
export interface SageMakerCreateModelProps extends sfn.TaskStateBaseProps {
  /**
   * An execution role that you can pass in a CreateModel API request
   *
   * @default - a role will be created.
   */
  readonly role?: iam.IRole;
  /**
   * The name of the new model.
   */
  readonly modelName: string;
  /**
   * The definition of the primary docker image containing inference code, associated artifacts,
   * and custom environment map that the inference code uses when the model is deployed for predictions.
   */
  readonly primaryContainer: IContainerDefinition;
  /**
   * Specifies the containers in the inference pipeline.
   *
   * @default - None
   */
  readonly containers?: IContainerDefinition[];

  /**
   * Isolates the model container. No inbound or outbound network calls can be made to or from the model container.
   *
   * @default false
   */
  readonly enableNetworkIsolation?: boolean;

  /**
   * The VPC that is accessible by the hosted model
   *
   * @default - None
   */
  readonly vpc?: ec2.IVpc;

  /**
   * The subnets of the VPC to which the hosted model is connected
   * (Note this parameter is only used when VPC is provided)
   *
   * @default - Private Subnets are selected
   */
  readonly subnetSelection?: ec2.SubnetSelection;

  /**
   * Tags to be applied to the model.
   *
   * @default - No tags
   */
  readonly tags?: sfn.TaskInput;
}

/**
 * A Step Functions Task to create a SageMaker model
 *
 * @see https://docs.aws.amazon.com/step-functions/latest/dg/connect-sagemaker.html
 */
export class SageMakerCreateModel extends sfn.TaskStateBase implements iam.IGrantable, ec2.IConnectable {
  private static readonly SUPPORTED_INTEGRATION_PATTERNS: sfn.IntegrationPattern[] = [
    sfn.IntegrationPattern.REQUEST_RESPONSE,
  ];
  /**
   * Allows specify security group connections for instances of this fleet.
   */
  public readonly connections: ec2.Connections = new ec2.Connections();
  /**
   * The execution role for the Sagemaker Create Model API.
   */
  public readonly role: iam.IRole;
  public readonly grantPrincipal: iam.IPrincipal;
  protected readonly taskMetrics?: sfn.TaskMetricsConfig;
  protected readonly taskPolicies?: iam.PolicyStatement[];
  private readonly vpc?: ec2.IVpc;
  private securityGroup?: ec2.ISecurityGroup;
  private readonly securityGroups: ec2.ISecurityGroup[] = [];
  private readonly subnets?: string[];
  private readonly integrationPattern: sfn.IntegrationPattern;

  constructor(scope: Construct, id: string, private readonly props: SageMakerCreateModelProps) {
    super(scope, id, props);
    this.integrationPattern = props.integrationPattern || sfn.IntegrationPattern.REQUEST_RESPONSE;
    validatePatternSupported(this.integrationPattern, SageMakerCreateModel.SUPPORTED_INTEGRATION_PATTERNS);

    // add the security groups to the connections object
    if (props.vpc) {
      this.vpc = props.vpc;
      this.subnets = props.subnetSelection ? this.vpc.selectSubnets(props.subnetSelection).subnetIds : this.vpc.selectSubnets().subnetIds;
    }

    this.role = this.props.role || this.createSagemakerRole();
    this.grantPrincipal = this.role;
    this.taskPolicies = this.makePolicyStatements();
  }

  /**
   * Add the security group to all instances via the launch configuration
   * security groups array.
   *
   * @param securityGroup: The security group to add
   */
  public addSecurityGroup(securityGroup: ec2.ISecurityGroup): void {
    this.securityGroups.push(securityGroup);
  }

  /**
   * @internal
   */
  protected _renderTask(): any {
    return {
      Resource: integrationResourceArn('sagemaker', 'createModel', this.integrationPattern),
      Parameters: sfn.FieldUtils.renderObject(this.renderParameters()),
    };
  }

  private renderParameters(): { [key: string]: any } {
    return {
      EnableNetworkIsolation: this.props.enableNetworkIsolation,
      ExecutionRoleArn: this.role.roleArn,
      ModelName: this.props.modelName,
      Tags: this.props.tags?.value,
      PrimaryContainer: this.props.primaryContainer.bind(this).parameters,
      Containers: this.props.containers?.map(container => (container.bind(this))),
      ...this.renderVpcConfig(),
    };
  }

  private makePolicyStatements(): iam.PolicyStatement[] {
    const stack = cdk.Stack.of(this);
    return [
      new iam.PolicyStatement({
        actions: ['sagemaker:CreateModel'],
        resources: [
          stack.formatArn({
            service: 'sagemaker',
            resource: 'model',
            // If the model name comes from input, we cannot target the policy to a particular ARN prefix reliably.
            // SageMaker uses lowercase for resource name in the arn
            resourceName: sfn.JsonPath.isEncodedJsonPath(this.props.modelName) ? '*' : `${this.props.modelName.toLowerCase()}*`,
          }),
        ],
      }),
      new iam.PolicyStatement({
        actions: ['sagemaker:ListTags'],
        // https://docs.aws.amazon.com/step-functions/latest/dg/sagemaker-iam.html
        resources: ['*'],
      }),
      new iam.PolicyStatement({
        actions: ['iam:PassRole'],
        resources: [this.role.roleArn],
        conditions: {
          StringEquals: { 'iam:PassedToService': 'sagemaker.amazonaws.com' },
        },
      }),
    ];
  }

  private createSagemakerRole() {
    // https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-roles.html
    const role = new iam.Role(this, 'SagemakerRole', {
      assumedBy: new iam.ServicePrincipal('sagemaker.amazonaws.com'),
      inlinePolicies: {
        CreateModel: new iam.PolicyDocument({
          statements: [
            new iam.PolicyStatement({
              actions: [
                // https://docs.aws.amazon.com/IAM/latest/UserGuide/list_amazoncloudwatch.html
                'cloudwatch:PutMetricData',
                // https://docs.aws.amazon.com/IAM/latest/UserGuide/list_amazoncloudwatchlogs.html
                'logs:CreateLogStream',
                'logs:CreateLogGroup',
                'logs:PutLogEvents',
                'logs:DescribeLogStreams',
                // https://docs.aws.amazon.com/IAM/latest/UserGuide/list_amazonelasticcontainerregistry.html
                'ecr:GetAuthorizationToken',
              ],
              resources: ['*'],
            }),
          ],
        }),
      },
    });
    if (this.props.vpc) {
      role.addToPrincipalPolicy(
        // https://docs.aws.amazon.com/IAM/latest/UserGuide/list_amazonec2.html
        new iam.PolicyStatement({
          actions: [
            'ec2:CreateNetworkInterface',
            'ec2:CreateNetworkInterfacePermission',
            'ec2:DeleteNetworkInterface',
            'ec2:DeleteNetworkInterfacePermission',
            'ec2:DescribeNetworkInterfaces',
            'ec2:DescribeVpcs',
            'ec2:DescribeDhcpOptions',
            'ec2:DescribeSubnets',
            'ec2:DescribeSecurityGroups',
          ],
          resources: ['*'],
        }),
      );
    }
    return role;
  }

  private renderVpcConfig(): { [key: string]: any } {
    // create a security group if not defined
    if (this.vpc && this.securityGroup === undefined) {
      this.securityGroup = new ec2.SecurityGroup(this, 'ModelSecurityGroup', {
        vpc: this.vpc,
      });
      this.connections.addSecurityGroup(this.securityGroup);
      this.securityGroups.push(this.securityGroup);
    }
    return this.vpc
      ? {
        VpcConfig: {
          SecurityGroupIds: cdk.Lazy.list({ produce: () => this.securityGroups.map((sg) => sg.securityGroupId) }),
          Subnets: this.subnets,
        },
      }
      : {};
  }
}