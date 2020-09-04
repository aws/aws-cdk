import * as ec2 from '@aws-cdk/aws-ec2';
import * as iam from '@aws-cdk/aws-iam';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import { Construct, Lazy, Stack } from '@aws-cdk/core';
import { integrationResourceArn, validatePatternSupported } from '../private/task-utils';
import { ContainerDefinition, VpcConfig } from './base-types';

/**
 * Properties for creating an Amazon SageMaker model
 *
 * @experimental
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
   * The location of the primary docker image containing inference code, associated artifacts,
   * and custom environment map that the inference code uses when the model is deployed for predictions.
   */
  readonly primaryContainer: ContainerDefinition;
  /**
   * Specifies the containers in the inference pipeline.
   *
   * @default - None
   */
  readonly containers?: ContainerDefinition[];

  /**
   * Isolates the model container. No inbound or outbound network calls can be made to or from the model container.
   *
   * @default false
   */
  readonly enableNetworkIsolation?: boolean;

  /**
   * A VpcConfig object that specifies the VPC that you want your model to connect to.
   *
   * @default - None
   */
  readonly vpcConfig?: VpcConfig;


  /**
   * Tags to be applied to the model.
   *
   * @default - No tags
   */
  readonly tags?: { [key: string]: string };
}

/**
 * A Step Functions Task to create a SageMaker model
 *
 * @experimental
 */
export class SageMakerCreateModel extends sfn.TaskStateBase implements iam.IGrantable, ec2.IConnectable {
  private static readonly SUPPORTED_INTEGRATION_PATTERNS: sfn.IntegrationPattern[] = [
    sfn.IntegrationPattern.REQUEST_RESPONSE,
  ];
  /**
   * Allows specify security group connections for instances of this fleet.
   */
  public readonly connections: ec2.Connections = new ec2.Connections();
  protected readonly taskMetrics?: sfn.TaskMetricsConfig;
  protected readonly taskPolicies?: iam.PolicyStatement[];
  private readonly vpc?: ec2.IVpc;
  private securityGroup?: ec2.ISecurityGroup;
  private readonly securityGroups: ec2.ISecurityGroup[] = [];
  private readonly subnets?: string[];
  private readonly integrationPattern: sfn.IntegrationPattern;
  private _role?: iam.IRole;
  private _grantPrincipal?: iam.IPrincipal;

  constructor(scope: Construct, id: string, private readonly props: SageMakerCreateModelProps) {
    super(scope, id, props);
    this.integrationPattern = props.integrationPattern || sfn.IntegrationPattern.REQUEST_RESPONSE;
    validatePatternSupported(this.integrationPattern, SageMakerCreateModel.SUPPORTED_INTEGRATION_PATTERNS);

    // add the security groups to the connections object
    if (props.vpcConfig) {
      this.vpc = props.vpcConfig.vpc;
      this.subnets = props.vpcConfig.subnets ? this.vpc.selectSubnets(props.vpcConfig.subnets).subnetIds : this.vpc.selectSubnets().subnetIds;
    }

    this.taskPolicies = this.makePolicyStatements();
  }

  /**
   * The execution role for the Sagemaker Create Model API.
   *
   * Only available after task has been added to a state machine.
   */
  public get role(): iam.IRole {
    if (this._role === undefined) {
      throw new Error('role not available yet--use the object in a Task first');
    }
    return this._role;
  }

  public get grantPrincipal(): iam.IPrincipal {
    if (this._grantPrincipal === undefined) {
      throw new Error('Principal not available yet--use the object in a Task first');
    }
    return this._grantPrincipal;
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
      ExecutionRoleArn: this._role!.roleArn,
      ModelName: this.props.modelName,
      ...this.renderContainers(this.props.containers),
      ...this.renderPrimaryContainer(this.props.primaryContainer),
      ...this.renderTags(this.props.tags),
      ...this.renderVpcConfig(this.props.vpcConfig),
    };
  }

  private makePolicyStatements(): iam.PolicyStatement[] {
    // set the SageMaker role or create new one
    this._grantPrincipal = this._role =
        this.props.role ||
        new iam.Role(this, 'SagemakerRole', {
          assumedBy: new iam.ServicePrincipal('sagemaker.amazonaws.com'),
          inlinePolicies: {
            CreateModel: new iam.PolicyDocument({
              statements: [
                new iam.PolicyStatement({
                  actions: [
                    'cloudwatch:PutMetricData',
                    'logs:CreateLogStream',
                    'logs:PutLogEvents',
                    'logs:CreateLogGroup',
                    'logs:DescribeLogStreams',
                    's3:GetObject',
                    'ecr:GetAuthorizationToken',
                    'ecr:BatchCheckLayerAvailability',
                    'ecr:GetDownloadUrlForLayer',
                    'ecr:BatchGetImage',
                    ...(this.props.vpcConfig
                      ? [
                        'ec2:CreateNetworkInterface',
                        'ec2:CreateNetworkInterfacePermission',
                        'ec2:DeleteNetworkInterface',
                        'ec2:DeleteNetworkInterfacePermission',
                        'ec2:DescribeNetworkInterfaces',
                        'ec2:DescribeVpcs',
                        'ec2:DescribeDhcpOptions',
                        'ec2:DescribeSubnets',
                        'ec2:DescribeSecurityGroups',
                      ]
                      : []),
                  ],
                  resources: ['*'], // Those permissions cannot be resource-scoped
                }),
              ],
            }),
          },
        });

    // create a security group if not defined
    if (this.vpc && this.securityGroup === undefined) {
      this.securityGroup = new ec2.SecurityGroup(this, 'ModelSecurityGroup', {
        vpc: this.vpc,
      });
      this.connections.addSecurityGroup(this.securityGroup);
      this.securityGroups.push(this.securityGroup);
    }
    const stack = Stack.of(this);

    return [
      new iam.PolicyStatement({
        actions: ['sagemaker:CreateModel'],
        resources: [
          stack.formatArn({
            service: 'sagemaker',
            resource: 'model',
            // If the endpoint name comes from input, we cannot target the policy to a particular ARN prefix reliably.
            // SageMaker uses lowercase for resource name in the arn
            resourceName: sfn.JsonPath.isEncodedJsonPath(this.props.modelName) ? '*' : `${this.props.modelName.toLowerCase()}*`,
          }),
        ],
      }),
      new iam.PolicyStatement({
        actions: ['sagemaker:ListTags'],
        resources: ['*'],
      }),
      new iam.PolicyStatement({
        actions: ['iam:PassRole'],
        resources: [this._role!.roleArn],
        conditions: {
          StringEquals: { 'iam:PassedToService': 'sagemaker.amazonaws.com' },
        },
      }),
    ];
  }

  private renderTags(tags: { [key: string]: any } | undefined): { [key: string]: any } {
    return tags ? { Tags: Object.keys(tags).map((key) => ({ Key: key, Value: tags[key] })) } : {};
  }

  private renderVpcConfig(config: VpcConfig | undefined): { [key: string]: any } {
    return config
      ? {
        VpcConfig: {
          SecurityGroupIds: Lazy.listValue({ produce: () => this.securityGroups.map((sg) => sg.securityGroupId) }),
          Subnets: this.subnets,
        },
      }
      : {};
  }

  private renderPrimaryContainer(config: ContainerDefinition): {[key: string]: any} {
    return (config) ? { PrimaryContainer: this.renderContainer(config) } : {};
  }

  private renderContainers(config: ContainerDefinition[] | undefined): {[key: string]: any} {
    return (config) ? { Containers: config.map(container => (this.renderContainer(container))) } : {};
  }

  private renderContainer(container: ContainerDefinition): {[key: string]: any} {
    return (container) ? {
      ...(container.containerHostName) ? { ContainerHostname: container.containerHostName } : {},
      ...(container.image) ? { Image: container.image.bind(this).imageUri } : {},
      ...(container.mode) ? { Mode: container.mode } : {},
      ...(container.modelDataUrl) ? { ModelDataUrl: container.modelDataUrl } : {},
      ...(container.modelPackageName) ? { ModelPackageName: container.modelPackageName } : {},
    } : {};
  }
}