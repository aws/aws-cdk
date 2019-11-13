import ec2 = require('@aws-cdk/aws-ec2');
import iam = require('@aws-cdk/aws-iam');
import sfn = require('@aws-cdk/aws-stepfunctions');
import { Duration, Lazy, Stack } from '@aws-cdk/core';
import { getResourceArn } from './resource-arn-suffix';
import { AlgorithmSpecification, Channel, InputMode, OutputDataConfig, ResourceConfig,
         S3DataType, StoppingCondition, VpcConfig,  } from './sagemaker-task-base-types';

/**
 *  @experimental
 */
export interface SagemakerTrainTaskProps {

    /**
     * Training Job Name.
     */
    readonly trainingJobName: string;

    /**
     * Role for the Training Job. The role must be granted all necessary permissions for the SageMaker training job to
     * be able to operate.
     *
     * See https://docs.aws.amazon.com/fr_fr/sagemaker/latest/dg/sagemaker-roles.html#sagemaker-roles-createtrainingjob-perms
     *
     * @default - a role with appropriate permissions will be created.
     */
    readonly role?: iam.IRole;

    /**
     * The service integration pattern indicates different ways to call SageMaker APIs.
     *
     * The valid value is either FIRE_AND_FORGET or SYNC.
     *
     * @default FIRE_AND_FORGET
     */
    readonly integrationPattern?: sfn.ServiceIntegrationPattern;

    /**
     * Identifies the training algorithm to use.
     */
    readonly algorithmSpecification: AlgorithmSpecification;

    /**
     * Hyperparameters to be used for the train job.
     */
    readonly hyperparameters?: {[key: string]: any};

    /**
     *  Describes the various datasets (e.g. train, validation, test) and the Amazon S3 location where stored.
     */
    readonly inputDataConfig: Channel[];

    /**
     * Tags to be applied to the train job.
     */
    readonly tags?: {[key: string]: string};

    /**
     * Identifies the Amazon S3 location where you want Amazon SageMaker to save the results of model training.
     */
    readonly outputDataConfig: OutputDataConfig;

    /**
     * Identifies the resources, ML compute instances, and ML storage volumes to deploy for model training.
     */
    readonly resourceConfig?: ResourceConfig;

    /**
     * Sets a time limit for training.
     */
    readonly stoppingCondition?: StoppingCondition;

    /**
     * Specifies the VPC that you want your training job to connect to.
     */
    readonly vpcConfig?: VpcConfig;
}

/**
 * Class representing the SageMaker Create Training Job task.
 *
 * @experimental
 */
export class SagemakerTrainTask implements iam.IGrantable, ec2.IConnectable, sfn.IStepFunctionsTask {

    /**
     * Allows specify security group connections for instances of this fleet.
     */
    public readonly connections: ec2.Connections = new ec2.Connections();

    /**
     * The Algorithm Specification
     */
    private readonly algorithmSpecification: AlgorithmSpecification;

    /**
     * The Input Data Config.
     */
    private readonly inputDataConfig: Channel[];

    /**
     * The resource config for the task.
     */
    private readonly resourceConfig: ResourceConfig;

    /**
     * The resource config for the task.
     */
    private readonly stoppingCondition: StoppingCondition;

    private readonly vpc?: ec2.IVpc;
    private securityGroup?: ec2.ISecurityGroup;
    private readonly securityGroups: ec2.ISecurityGroup[] = [];
    private readonly subnets?: string[];
    private readonly integrationPattern: sfn.ServiceIntegrationPattern;
    private _role?: iam.IRole;
    private _grantPrincipal?: iam.IPrincipal;

    constructor(private readonly props: SagemakerTrainTaskProps) {
        this.integrationPattern = props.integrationPattern || sfn.ServiceIntegrationPattern.FIRE_AND_FORGET;

        const supportedPatterns = [
            sfn.ServiceIntegrationPattern.FIRE_AND_FORGET,
            sfn.ServiceIntegrationPattern.SYNC
        ];

        if (!supportedPatterns.includes(this.integrationPattern)) {
            throw new Error(`Invalid Service Integration Pattern: ${this.integrationPattern} is not supported to call SageMaker.`);
        }

        // set the default resource config if not defined.
        this.resourceConfig = props.resourceConfig || {
            instanceCount: 1,
            instanceType: ec2.InstanceType.of(ec2.InstanceClass.M4, ec2.InstanceSize.XLARGE),
            volumeSizeInGB: 10
        };

        // set the stopping condition if not defined
        this.stoppingCondition = props.stoppingCondition || {
            maxRuntime: Duration.hours(1)
        };

        // check that either algorithm name or image is defined
        if ((!props.algorithmSpecification.algorithmName) && (!props.algorithmSpecification.trainingImage)) {
            throw new Error("Must define either an algorithm name or training image URI in the algorithm specification");
        }

        // set the input mode to 'File' if not defined
        this.algorithmSpecification = ( props.algorithmSpecification.trainingInputMode ) ?
            ( props.algorithmSpecification ) :
            ( { ...props.algorithmSpecification, trainingInputMode: InputMode.FILE } );

        // set the S3 Data type of the input data config objects to be 'S3Prefix' if not defined
        this.inputDataConfig = props.inputDataConfig.map(config => {
            if (!config.dataSource.s3DataSource.s3DataType) {
                return Object.assign({}, config, { dataSource: { s3DataSource:
                    { ...config.dataSource.s3DataSource, s3DataType: S3DataType.S3_PREFIX } } });
            } else {
                return config;
            }
        });

        // add the security groups to the connections object
        if (props.vpcConfig) {
            this.vpc = props.vpcConfig.vpc;
            this.subnets = (props.vpcConfig.subnets) ?
                (this.vpc.selectSubnets(props.vpcConfig.subnets).subnetIds) : this.vpc.selectSubnets().subnetIds;
        }
    }

    /**
     * The execution role for the Sagemaker training job.
     *
     * Only available after task has been added to a state machine.
     */
    public get role(): iam.IRole {
        if (this._role === undefined) {
            throw new Error(`role not available yet--use the object in a Task first`);
        }
        return this._role;
    }

    public get grantPrincipal(): iam.IPrincipal {
        if (this._grantPrincipal === undefined) {
            throw new Error(`Principal not available yet--use the object in a Task first`);
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

    public bind(task: sfn.Task): sfn.StepFunctionsTaskConfig  {
        // set the sagemaker role or create new one
        this._grantPrincipal = this._role = this.props.role || new iam.Role(task, 'SagemakerRole', {
            assumedBy: new iam.ServicePrincipal('sagemaker.amazonaws.com'),
            inlinePolicies: {
                CreateTrainingJob: new iam.PolicyDocument({
                    statements: [
                        new iam.PolicyStatement({
                            actions: [
                                'cloudwatch:PutMetricData',
                                'logs:CreateLogStream',
                                'logs:PutLogEvents',
                                'logs:CreateLogGroup',
                                'logs:DescribeLogStreams',
                                'ecr:GetAuthorizationToken',
                                ...this.props.vpcConfig
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
                                    : [],
                            ],
                            resources: ['*'], // Those permissions cannot be resource-scoped
                        })
                    ]
                }),
            }
        });

        if (this.props.outputDataConfig.encryptionKey) {
            this.props.outputDataConfig.encryptionKey.grantEncrypt(this._role);
        }

        if (this.props.resourceConfig && this.props.resourceConfig.volumeEncryptionKey) {
            this.props.resourceConfig.volumeEncryptionKey.grant(this._role, 'kms:CreateGrant');
        }

        // create a security group if not defined
        if (this.vpc && this.securityGroup === undefined) {
            this.securityGroup = new ec2.SecurityGroup(task, 'TrainJobSecurityGroup', {
                vpc: this.vpc
            });
            this.connections.addSecurityGroup(this.securityGroup);
            this.securityGroups.push(this.securityGroup);
        }

        return {
          resourceArn: getResourceArn("sagemaker", "createTrainingJob", this.integrationPattern),
          parameters: this.renderParameters(),
          policyStatements: this.makePolicyStatements(task),
        };
    }

    private renderParameters(): {[key: string]: any} {
        return {
            TrainingJobName: this.props.trainingJobName,
            RoleArn: this._role!.roleArn,
            ...(this.renderAlgorithmSpecification(this.algorithmSpecification)),
            ...(this.renderInputDataConfig(this.inputDataConfig)),
            ...(this.renderOutputDataConfig(this.props.outputDataConfig)),
            ...(this.renderResourceConfig(this.resourceConfig)),
            ...(this.renderStoppingCondition(this.stoppingCondition)),
            ...(this.renderHyperparameters(this.props.hyperparameters)),
            ...(this.renderTags(this.props.tags)),
            ...(this.renderVpcConfig(this.props.vpcConfig)),
        };
    }

    private renderAlgorithmSpecification(spec: AlgorithmSpecification): {[key: string]: any} {
        return {
            AlgorithmSpecification: {
                TrainingInputMode: spec.trainingInputMode,
                ...(spec.trainingImage) ? { TrainingImage: spec.trainingImage.bind(this).imageUri } : {},
                ...(spec.algorithmName) ? { AlgorithmName: spec.algorithmName } : {},
                ...(spec.metricDefinitions) ?
                { MetricDefinitions: spec.metricDefinitions
                    .map(metric => ({ Name: metric.name, Regex: metric.regex })) } : {}
            }
        };
    }

    private renderInputDataConfig(config: Channel[]): {[key: string]: any} {
        return {
            InputDataConfig: config.map(channel => ({
                ChannelName: channel.channelName,
                DataSource: {
                    S3DataSource: {
                        S3Uri: channel.dataSource.s3DataSource.s3Location.bind(this, { forReading: true }).uri,
                        S3DataType: channel.dataSource.s3DataSource.s3DataType,
                        ...(channel.dataSource.s3DataSource.s3DataDistributionType) ?
                            { S3DataDistributionType: channel.dataSource.s3DataSource.s3DataDistributionType} : {},
                        ...(channel.dataSource.s3DataSource.attributeNames) ?
                        { AtttributeNames: channel.dataSource.s3DataSource.attributeNames } : {},
                    }
                },
                ...(channel.compressionType) ? { CompressionType: channel.compressionType } : {},
                ...(channel.contentType) ? { ContentType: channel.contentType } : {},
                ...(channel.inputMode) ? { InputMode: channel.inputMode } : {},
                ...(channel.recordWrapperType) ? { RecordWrapperType: channel.recordWrapperType } : {},
            }))
        };
    }

    private renderOutputDataConfig(config: OutputDataConfig): {[key: string]: any} {
        return {
            OutputDataConfig: {
                S3OutputPath: config.s3OutputLocation.bind(this, { forWriting: true }).uri,
                ...(config.encryptionKey) ? { KmsKeyId: config.encryptionKey.keyArn } : {},
            }
        };
    }

    private renderResourceConfig(config: ResourceConfig): {[key: string]: any} {
        return {
            ResourceConfig: {
                InstanceCount: config.instanceCount,
                InstanceType: 'ml.' + config.instanceType,
                VolumeSizeInGB: config.volumeSizeInGB,
                ...(config.volumeEncryptionKey) ? { VolumeKmsKeyId: config.volumeEncryptionKey.keyArn } : {},
            }
        };
    }

    private renderStoppingCondition(config: StoppingCondition): {[key: string]: any} {
        return {
            StoppingCondition: {
                MaxRuntimeInSeconds: config.maxRuntime && config.maxRuntime.toSeconds()
            }
        };
    }

    private renderHyperparameters(params: {[key: string]: any} | undefined): {[key: string]: any} {
        return (params) ? { HyperParameters: params } : {};
    }

    private renderTags(tags: {[key: string]: any} | undefined): {[key: string]: any} {
        return (tags) ? { Tags: Object.keys(tags).map(key => ({ Key: key, Value: tags[key] })) } : {};
    }

    private renderVpcConfig(config: VpcConfig | undefined): {[key: string]: any} {
        return (config) ? { VpcConfig: {
            SecurityGroupIds: Lazy.listValue({ produce: () => (this.securityGroups.map(sg => (sg.securityGroupId))) }),
            Subnets: this.subnets,
        }} : {};
    }

    private makePolicyStatements(task: sfn.Task): iam.PolicyStatement[] {
        const stack = Stack.of(task);

        // https://docs.aws.amazon.com/step-functions/latest/dg/sagemaker-iam.html
        const policyStatements = [
            new iam.PolicyStatement({
                actions: ['sagemaker:CreateTrainingJob', 'sagemaker:DescribeTrainingJob', 'sagemaker:StopTrainingJob'],
                resources: [
                    stack.formatArn({
                        service: 'sagemaker',
                        resource: 'training-job',
                        // If the job name comes from input, we cannot target the policy to a particular ARN prefix reliably...
                        resourceName: sfn.Data.isJsonPathString(this.props.trainingJobName) ? '*' : `${this.props.trainingJobName}*`
                    })
                ],
            }),
            new iam.PolicyStatement({
                actions: ['sagemaker:ListTags'],
                resources: ['*']
            }),
            new iam.PolicyStatement({
                actions: ['iam:PassRole'],
                resources: [this._role!.roleArn],
                conditions: {
                    StringEquals: { "iam:PassedToService": "sagemaker.amazonaws.com" }
                }
            })
        ];

        if (this.integrationPattern === sfn.ServiceIntegrationPattern.SYNC) {
            policyStatements.push(new iam.PolicyStatement({
                actions: ["events:PutTargets", "events:PutRule", "events:DescribeRule"],
                resources: [stack.formatArn({
                    service: 'events',
                    resource: 'rule',
                    resourceName: 'StepFunctionsGetEventsForSageMakerTrainingJobsRule'
                })]
            }));
        }

        return policyStatements;
      }
}
