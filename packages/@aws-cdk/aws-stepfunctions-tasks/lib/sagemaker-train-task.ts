import ec2 = require('@aws-cdk/aws-ec2');
import iam = require('@aws-cdk/aws-iam');
import sfn = require('@aws-cdk/aws-stepfunctions');
import { Construct, Duration, Stack } from '@aws-cdk/core';
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
     * Specify if the task is synchronous or asychronous.
     *
     * @default false
     */
    readonly synchronous?: boolean;

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
    readonly tags?: {[key: string]: any};

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
     * The execution role for the Sagemaker training job.
     *
     * @default new role for Amazon SageMaker to assume is automatically created.
     */
    public readonly role: iam.IRole;

    public readonly grantPrincipal: iam.IPrincipal;

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

    constructor(scope: Construct, private readonly props: SagemakerTrainTaskProps) {

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

        // set the sagemaker role or create new one
        this.grantPrincipal = this.role = props.role || new iam.Role(scope, 'SagemakerRole', {
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
                                ...props.vpcConfig
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

        if (props.outputDataConfig.encryptionKey) {
            props.outputDataConfig.encryptionKey.grantEncrypt(this.role);
        }

        if (props.resourceConfig && props.resourceConfig.volumeEncryptionKey) {
            props.resourceConfig.volumeEncryptionKey.grant(this.role, 'kms:CreateGrant');
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
        if (this.props.vpcConfig) {
            this.props.vpcConfig.securityGroups.forEach(sg => this.connections.addSecurityGroup(sg));
        }
    }

    public bind(task: sfn.Task): sfn.StepFunctionsTaskConfig  {
        return {
          resourceArn: 'arn:aws:states:::sagemaker:createTrainingJob' + (this.props.synchronous ? '.sync' : ''),
          parameters: this.renderParameters(),
          policyStatements: this.makePolicyStatements(task),
        };
    }

    private renderParameters(): {[key: string]: any} {
        return {
            TrainingJobName: this.props.trainingJobName,
            RoleArn: this.role.roleArn,
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
            SecurityGroupIds: config.securityGroups.map(sg => ( sg.securityGroupId )),
            Subnets: config.subnets.map(subnet => ( subnet.subnetId )),
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
                resources: [this.role.roleArn],
                conditions: {
                    StringEquals: { "iam:PassedToService": "sagemaker.amazonaws.com" }
                }
            })
        ];

        if (this.props.synchronous) {
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
