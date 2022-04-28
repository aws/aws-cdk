import * as ec2 from '@aws-cdk/aws-ec2';
import * as iam from '@aws-cdk/aws-iam';
import * as kms from '@aws-cdk/aws-kms';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import { Duration, Names, Lazy, Size, Stack } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { integrationResourceArn, validatePatternSupported } from '../private/task-utils';
import {
  DatasetDefinition,
  ExperimentConfig,
  InputMode,
  DockerImage,
  NetworkConfig,
  ProcessingInput,
  ProcessingOutput,
  S3DataType,
  StoppingCondition,
  CompressionType,
  S3DataDistributionType,
  AthenaOutputFormat,
  RedshiftOutputFormat,
  S3UploadMode,
  ProcessingCluster,
} from './base-types';
import { renderEnvironment, renderTags } from './private/utils';

/**
 * Properties for creating an Amazon SageMaker processing job task
 */
export interface SageMakerCreateProcessingJobProps extends sfn.TaskStateBaseProps {
  /**
   * Role for the Processing Job. The role must be granted all necessary permissions for the SageMaker processing job to
   * be able to operate.
   *
   * @see https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-roles.html#sagemaker-roles-createprocessingjob-perms
   *
   * @default - a role with appropriate permissions will be created.
   */
  readonly role?: iam.IRole;

  /**
   * The container image that contains the processing algorithm.
   */
  readonly image: DockerImage;

  /**
   * The entrypoint for the container specified in `image`.
   * When specified, this value overrides the ENTRYPOINT command in the Docker image.
   *
   * @see https://docs.aws.amazon.com/sagemaker/latest/dg/build-your-own-processing-container.html
   *
   * @default []
   */
  readonly containerEntrypoint?: string[];

  /**
   * The arguments for the container specified in `image` used to run a processing job.
   *
   * @see https://docs.aws.amazon.com/sagemaker/latest/dg/build-your-own-processing-container.html
   *
   * @default []
   */
  readonly containerArgs?: string[];

  /**
   * The environment variables (map of keys to values) to set in the Docker container. Up to 100 key and values entries
   * in the map are supported. Keys and values must be strings with a maximium length of 256.
   *
   * @default - No environment variables
   */
  readonly environment?: {[key: string]: string};

  /**
   * Associates a SageMaker job as a trial component with an experiment and trial. Specified when you call the
   * following APIs: CreateProcessingJob, CreateTrainingJob, CreateTransformJob
   *
   * @default - No experiment configuration
   */
  readonly experimentConfig?: ExperimentConfig;

  /**
   * Networking options for a processing job.
   *
   * @default - No network configuration
   */
  readonly networkConfig?: NetworkConfig;

  /**
   * For each input, data is downloaded from S3 into the processing container before the processing job begins running
   * if 'S3InputMode' is set to File.
   *
   * @default - No processing inputs
   */
  readonly processingInputs?: ProcessingInput[];

  /**
   * The name of the processing job. The name must be unique within an AWS Region in the AWS account.
   *
   * @default - A unique name will be created for you
   */
  readonly processingJobName?: string;

  /**
   * The KMS key that Amazon SageMaker users to encrypt the processing job output.
   *
   * @default - No key
   */
  readonly processingOutputKey?: kms.IKey,

  /**
   * Output configuration for the processing job.
   *
   * @default - No processing outputs
   */
  readonly processingOutputs?: ProcessingOutput[];

  /**
   * Identifies the resources, ML compute instances, and ML storage volumes to deploy for a processing job.
   * In distributed training, you specify more than one instance.
   *
   * @default - 1 instance of EC2 `M4.XLarge` with `10GB` volume
   */
  readonly processingCluster?: ProcessingCluster;

  /**
   * Sets a time limit for training.
   *
   * @default - max runtime of 1 hour
   */
  readonly stoppingCondition?: StoppingCondition;

  /**
   * Tags to be applied to the train job.
   *
   * @default - No tags
   */
  readonly tags?: { [key: string]: string };
}

/**
 * Class representing the SageMaker Create Processing Job task.
 */
export class SageMakerCreateProcessingJob extends sfn.TaskStateBase implements iam.IGrantable, ec2.IConnectable {
  private static readonly SUPPORTED_INTEGRATION_PATTERNS: sfn.IntegrationPattern[] = [
    sfn.IntegrationPattern.REQUEST_RESPONSE,
    sfn.IntegrationPattern.RUN_JOB,
  ];

  /**
   * Allows specify security group connections for instances of this fleet.
   */
  public readonly connections: ec2.Connections = new ec2.Connections();

  protected readonly taskPolicies?: iam.PolicyStatement[];
  protected readonly taskMetrics?: sfn.TaskMetricsConfig;

  /**
   * The processing resources for the task.
   */
  private readonly processingCluster: ProcessingCluster;
  /**
   * The stopping condition for the task
   */
  private readonly stoppingCondition: StoppingCondition;

  private readonly jobName: string;
  private readonly vpc?: ec2.IVpc;
  private securityGroup?: ec2.ISecurityGroup;
  private readonly securityGroups: ec2.ISecurityGroup[] = [];
  private readonly subnets?: string[];
  private readonly integrationPattern: sfn.IntegrationPattern;
  private _role?: iam.IRole;
  private _grantPrincipal?: iam.IPrincipal;

  constructor(
    scope: Construct,
    id: string,
    private readonly props: SageMakerCreateProcessingJobProps) {
    super(scope, id, props);
    this.integrationPattern = props.integrationPattern || sfn.IntegrationPattern.REQUEST_RESPONSE;
    validatePatternSupported(this.integrationPattern, SageMakerCreateProcessingJob.SUPPORTED_INTEGRATION_PATTERNS);

    this.jobName = props.processingJobName ?? this.generateName();

    // set the default processing resources if not defined.
    this.processingCluster = props.processingCluster ?? {
      instanceCount: 1,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.M4, ec2.InstanceSize.XLARGE),
      volumeSize: Size.gibibytes(10),
    };

    // set the stopping condition if not defined
    this.stoppingCondition = props.stoppingCondition ?? {
      maxRuntime: Duration.hours(1),
    };

    props.processingInputs?.forEach(input => {
      if (input.s3Input && input.datasetDefinition || (!input.s3Input && !input.datasetDefinition)) {
        throw new Error('ProcessingInput must contain exactly one of either S3Input or DatasetDefinition');
      }

      const athenaDefinition = input.datasetDefinition?.athenaDatasetDefinition;
      const redshiftDefinition = input.datasetDefinition?.athenaDatasetDefinition;
      if (!input.s3Input && ((athenaDefinition && redshiftDefinition) || (!athenaDefinition && !redshiftDefinition))) {
        throw new Error('DatasetDefinition must contain exactly one of either AthenaDatasetDefinition or RedshiftDatasetDefinition');
      }
    });

    // validate ExperimentConfig names
    if (props.experimentConfig) {
      const experimentName = props.experimentConfig.experimentName;
      const trialComponentDisplayName = props.experimentConfig.trialComponentDisplayName;
      const trialName = props.experimentConfig.trialName;
      [experimentName, trialComponentDisplayName, trialName].forEach(name => {
        if (name && (name.length == 0 || name.length > 120)) {
          throw new Error('ExperimentConfig component name must have a minimum length of 1 and a maximum length of 120.');
        }
      });
    }

    // validate ProcessingOutputConfig outputs
    if (props.processingOutputs) {
      if (props.processingOutputs.length > 10) {
        throw new Error('ProcessingOutputConfig must contain a maximum of 10 outputs.');
      }
      props.processingOutputs.forEach(output => {
        if (output.featureStoreOutput?.featureGroupName && output.featureStoreOutput?.featureGroupName.length > 64) {
          throw new Error('output TrialComponentDisplayName must have a minimum length of 1 and a maximum length of 120.');
        }
      });
    }

    // add the security groups to the connections object
    if (props.networkConfig && props.networkConfig.vpcConfig) {
      this.vpc = props.networkConfig.vpcConfig.vpc;
      this.subnets = (props.networkConfig.vpcConfig.subnets) ?
        (this.vpc.selectSubnets(props.networkConfig.vpcConfig.subnets).subnetIds) : this.vpc.selectSubnets().subnetIds;
    }

    this.taskPolicies = this.makePolicyStatements();
  }

  /**
   * The execution role for the SageMaker processing job.
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
   * Add the security group to all instances via the launch configuration security groups array.
   *
   * @param securityGroup The security group to add
   */
  public addSecurityGroup(securityGroup: ec2.ISecurityGroup): void {
    this.securityGroups.push(securityGroup);
  }

  /**
   * @internal
   */
  protected _renderTask(): any {
    return {
      Resource: integrationResourceArn('sagemaker', 'createProcessingJob', this.integrationPattern),
      Parameters: sfn.FieldUtils.renderObject(this.renderParameters()),
    };
  }

  private renderParameters(): { [key: string]: any } {
    return {
      ...this.renderAppSpecification(this.props),
      ...renderEnvironment(this.props.environment),
      ...this.renderExperimentConfig(this.props.experimentConfig),
      ...this.renderNetworkConfig(this.props.networkConfig),
      ...this.renderProcessingInputs(this.props.processingInputs),
      ProcessingJobName: this.props.processingJobName,
      ...this.renderProcessingOutputConfig(this.props),
      ...this.renderProcessingResources(this.processingCluster),
      RoleArn: this._role!.roleArn,
      ...this.renderStoppingCondition(this.stoppingCondition),
      ...renderTags(this.props.tags),
    };
  }

  private renderAppSpecification(props: SageMakerCreateProcessingJobProps): { [key: string]: any } {
    return {
      AppSpecification: {
        ...(props.containerArgs ? { ContainerArguments: props.containerArgs }: {}),
        ...(props.containerEntrypoint ? { ContainerEntrypoint: props.containerEntrypoint } : {}),
        ImageUri: props.image.bind(this).imageUri,
      },
    };
  }

  private renderProcessingResources(cluster: ProcessingCluster): { [key: string]: any } {
    return {
      ProcessingResources: {
        ClusterConfig: {
          InstanceCount: cluster.instanceCount,
          InstanceType: 'ml.' + cluster.instanceType,
          VolumeSizeInGB: cluster.volumeSize?.toGibibytes(),
          ...(cluster?.volumeEncryptionKey) ?
            { VolumeKmsKeyId: cluster.volumeEncryptionKey.keyArn } : {},
        },
      },
    };
  }

  private renderStoppingCondition(config: StoppingCondition): { [key: string]: any } {
    return {
      StoppingCondition: {
        MaxRuntimeInSeconds: config.maxRuntime && config.maxRuntime.toSeconds(),
      },
    };
  }

  private renderNetworkConfig(config: NetworkConfig | undefined): { [key: string]: any } {
    if (config === undefined) { return {}; }
    return {
      NetworkConfig: {
        EnableInterContainerTrafficEncryption: config.enableTraffic ?? false,
        EnableNetworkIsolation: config.enableIsolation ?? false,
        ...(config.vpcConfig ? {
          VpcConfig: {
            SecurityGroupIds: Lazy.list({ produce: () => (this.securityGroups.map(sg => (sg.securityGroupId))) }),
            Subnets: this.subnets,
          },
        } : {}),
      },
    };
  }

  private renderProcessingInputs(config: ProcessingInput[] | undefined): { [key: string]: any } {
    return (config) ? {
      ProcessingInputs: config.map((input, index) => {
        const inputName = input.inputName ?? `input${index}`;
        return {
          AppManaged: input.appManaged ?? false,
          InputName: inputName,
          ...(input.datasetDefinition) ? {
            DatasetDefinition: {
              ...this.renderAthenaDatasetDefinition(input.datasetDefinition),
              DataDistributionType: input.datasetDefinition.dataDistributionType ?? S3DataDistributionType.SHARDED_BY_S3_KEY,
              InputMode: input.datasetDefinition.inputMode ?? InputMode.FILE,
              LocalPath: `/opt/ml/processing/inputs/datasetDefinition/${input.datasetDefinition.localPathPrefix || inputName}/`,
              ...this.renderRedshiftDatasetDefinition(input.datasetDefinition),
            },
          } : {},
          S3Input: {
            LocalPath: `/opt/ml/processing/inputs/s3/${input.s3Input?.localPathPrefix ?? inputName}/`,
            S3CompressionType: input.s3Input?.s3CompressionType ?? CompressionType.NONE,
            S3DataDistributionType: input.s3Input?.s3DataDistributionType ?? S3DataDistributionType.FULLY_REPLICATED,
            S3DataType: input.s3Input?.s3DataType ?? S3DataType.S3_PREFIX,
            S3InputMode: input.s3Input?.s3InputMode ?? InputMode.FILE,
            S3Uri: input.s3Input?.s3Location.bind(this, { forReading: true }).uri,
          },
        };
      }),
    } : {};
  }

  private renderAthenaDatasetDefinition(datasetDefinition: DatasetDefinition | undefined): { [key: string]: any } {
    const athenaDatasetDefinition = datasetDefinition?.athenaDatasetDefinition;
    if (athenaDatasetDefinition === undefined) { return {}; }

    return {
      DatasetDefinition: {
        AthenaDatasetDefinition: {
          Catalog: athenaDatasetDefinition.catalog,
          Database: athenaDatasetDefinition.database,
          ...(athenaDatasetDefinition.encryptionKey) ? {
            KmsKeyId: athenaDatasetDefinition.encryptionKey.keyId,
          } : {},
          ...(athenaDatasetDefinition.outputCompression) ? {
            OutputCompression: athenaDatasetDefinition.outputCompression,
          } : {},
          OutputFormat: athenaDatasetDefinition.outputFormat ?? AthenaOutputFormat.TEXTFILE,
          OutputS3Uri: athenaDatasetDefinition.s3Location.bind(this, { forReading: true }).uri,
          QueryString: athenaDatasetDefinition.queryString,
          ...(athenaDatasetDefinition.workGroup) ? {
            WorkGroup: athenaDatasetDefinition.workGroup,
          } : {},
        },
      },
    };
  }

  private renderRedshiftDatasetDefinition(datasetDefinition: DatasetDefinition | undefined): { [key: string]: any } {
    const redshiftDatasetDefinition = datasetDefinition?.redshiftDatasetDefinition;
    if (redshiftDatasetDefinition === undefined) { return {}; }

    return {
      RedshiftDatasetDefinition: {
        ClusterId: redshiftDatasetDefinition.clusterId,
        ClusterRoleArn: redshiftDatasetDefinition.clusterRole.roleArn,
        Database: redshiftDatasetDefinition.database,
        DbUser: redshiftDatasetDefinition.dbUser,
        ...(redshiftDatasetDefinition.encryptionKey) ? {
          KmsKeyId: redshiftDatasetDefinition.encryptionKey.keyId,
        } : {},
        ...(redshiftDatasetDefinition.outputCompression) ? {
          OutputCompression: redshiftDatasetDefinition.outputCompression,
        } : {},
        OutputFormat: redshiftDatasetDefinition.outputFormat ?? RedshiftOutputFormat.CSV,
        OutputS3Uri: redshiftDatasetDefinition.s3Location.bind(this, { forReading: true }).uri,
        QueryString: redshiftDatasetDefinition.queryString,
      },
    };
  }

  private renderProcessingOutputConfig(props: SageMakerCreateProcessingJobProps): { [key: string]: any } {
    if (!props.processingOutputs || props.processingOutputs.length === 0) { return {}; }

    return {
      ProcessingOutputConfig: {
        ...(props.processingOutputKey ? { KmsKeyId: props.processingOutputKey?.keyId } : {}),
        Outputs: props.processingOutputs.map((output, index) => {
          const outputName = output.outputName ?? `output${index}`;
          return {
            OutputName: outputName,
            AppManaged: output.appManaged ?? false,
            ...(output.featureStoreOutput ? {
              FeatureStoreOutput: { FeatureGroupName: output.featureStoreOutput.featureGroupName },
            } : {}),
            S3Output: {
              LocalPath: `/opt/ml/processing/outputs/s3/${output.s3Output.localPathPrefix ?? outputName}/`,
              S3UploadMode: output.s3Output.s3UploadMode ?? S3UploadMode.END_OF_JOB,
              S3Uri: output.s3Output.s3Location.bind(this, { forWriting: true }).uri,
            },
          };
        }),
      },
    };
  }

  private renderExperimentConfig(config: ExperimentConfig | undefined): { [key: string]: any } {
    if (config === undefined) { return {}; }
    return {
      ExperimentConfig: {
        ...(config.experimentName) ? { ExperimentName: config.experimentName } : {},
        ...(config.trialComponentDisplayName) ? { TrialComponentDisplayName: config.trialComponentDisplayName } : {},
        ...(config.trialName) ? { TrialName: config.trialName } : {},
      },
    };
  }

  private makePolicyStatements(): iam.PolicyStatement[] {
    // Set the SageMaker role or create new one
    this._grantPrincipal = this._role =
      this.props.role ||
      new iam.Role(this, 'SagemakerRole', {
        assumedBy: new iam.ServicePrincipal('sagemaker.amazonaws.com'),
        inlinePolicies: {
          CreateProcessingJob: new iam.PolicyDocument({
            statements: [
              new iam.PolicyStatement({
                actions: [
                  'ecr:BatchCheckLayerAvailability',
                  'ecr:BatchGetImage',
                  'ecr:Describe*',
                  'ecr:GetAuthorizationToken',
                  'ecr:GetDownloadUrlForLayer',
                  'ecr:StartImageScan',
                ],
                resources: ['*'],
              }),
              new iam.PolicyStatement({
                actions: [
                  'cloudwatch:PutMetricData',
                  'logs:CreateLogStream',
                  'logs:PutLogEvents',
                  'logs:CreateLogGroup',
                  'logs:DescribeLogStreams',
                  'ecr:GetAuthorizationToken',
                  ...(this.props.networkConfig?.vpcConfig
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

    if (this.props.processingCluster && this.props.processingCluster &&
      this.props.processingCluster.volumeEncryptionKey) {
      this.props.processingCluster.volumeEncryptionKey.grant(this._role, 'kms:CreateGrant');
    }

    // create a security group if not defined
    if (this.vpc && this.securityGroup === undefined) {
      this.securityGroup = new ec2.SecurityGroup(this, 'ProcessJobSecurityGroup', {
        vpc: this.vpc,
      });
      this.connections.addSecurityGroup(this.securityGroup);
      this.securityGroups.push(this.securityGroup);
    }

    const stack = Stack.of(this);

    // https://docs.aws.amazon.com/step-functions/latest/dg/sagemaker-iam.html
    const policyStatements = [
      new iam.PolicyStatement({
        actions: ['sagemaker:CreateProcessingJob', 'sagemaker:DescribeProcessingJob', 'sagemaker:StopProcessingJob'],
        resources: [
          stack.formatArn({
            service: 'sagemaker',
            resource: 'processing-job',
            // If the job name comes from input, we cannot target the policy to a particular ARN prefix reliably...
            resourceName: sfn.JsonPath.isEncodedJsonPath(this.jobName) ? '*' : `${this.jobName}*`,
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

    if (this.integrationPattern === sfn.IntegrationPattern.RUN_JOB) {
      policyStatements.push(
        new iam.PolicyStatement({
          actions: ['events:PutTargets', 'events:PutRule', 'events:DescribeRule'],
          resources: [
            stack.formatArn({
              service: 'events',
              resource: 'rule',
              resourceName: 'StepFunctionsGetEventsForSageMakerProcessingJobsRule',
            }),
          ],
        }),
      );
    }

    return policyStatements;
  }

  private generateName(): string {
    const name = Stack.of(this).region + Names.uniqueId(this);
    if (name.length > 64) {
      return name.substring(0, 32) + name.substring(name.length - 32);
    }
    return name;
  }
}
