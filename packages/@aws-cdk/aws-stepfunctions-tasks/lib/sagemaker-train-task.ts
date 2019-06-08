import ec2 = require('@aws-cdk/aws-ec2');
import iam = require('@aws-cdk/aws-iam');
import sfn = require('@aws-cdk/aws-stepfunctions');

import { AlgorithmSpecification, Channel, OutputDataConfig, ResourceConfig, StoppingCondition, VpcConfig } from './sagemaker-task-base-types';

export interface SagemakerTrainProps {

    /**
     * Training Job Name.
     */
    readonly trainingJobName: string;

    /**
     * Role for thte Training Job.
     */
    readonly role: iam.Role;

    /**
     * Specify if the task is synchronous or asychronous.
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
    readonly resourceConfig: ResourceConfig;

    /**
     * Sets a time limit for training. 
     */
    readonly stoppingCondition: StoppingCondition;

    /**
     * Specifies the VPC that you want your training job to connect to.
     */
    readonly vpcConfig?: VpcConfig;
}

/**
 * Class representing the SageMaker Create Training Job task.
 */
export class SagemakerTrainTask implements ec2.IConnectable, sfn.IStepFunctionsTask {

    public readonly connections: ec2.Connections = new ec2.Connections();

    constructor(private readonly props: SagemakerTrainProps) { }

    public bind(task: sfn.Task): sfn.StepFunctionsTaskProperties {
        return {
          resourceArn: 'arn:aws:states:::sagemaker:createTrainingJob' + (this.props.synchronous ? '.sync' : ''),
          parameters: sfn.FieldUtils.renderObject(this.renderParameters()),
          policyStatements: this.makePolicyStatements(task),
        };
    }

    private renderParameters(): {[key: string]: any} {
        return {
            TrainingJobName: this.props.trainingJobName,
            RoleArn: this.props.role.roleArn,
            ...(this.renderAlgorithmSpecification(this.props.algorithmSpecification)),
            ...(this.renderInputDataConfig(this.props.inputDataConfig)),
            ...(this.renderOutputDataConfig(this.props.outputDataConfig)),
            ...(this.renderResourceConfig(this.props.resourceConfig)),
            ...(this.renderStoppingCondition(this.props.stoppingCondition)),
            ...(this.renderHyperparameters(this.props.hyperparameters)),
            ...(this.renderTags(this.props.tags)),
            ...(this.renderVpcConfig(this.props.vpcConfig)),
        };
    }

    private renderAlgorithmSpecification(spec: AlgorithmSpecification): {[key: string]: any} {
        return {
            AlgorithmSpecification: {
                TrainingInputMode: spec.trainingInputMode,
                ...(spec.trainingImage) ? { TrainingImage: spec.trainingImage } : {},
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
                        S3Uri: channel.dataSource.s3DataSource.s3Uri,
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
                S3OutputPath: config.s3OutputPath,
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
                ...(config.volumeKmsKeyId) ? { VolumeKmsKeyId: config.volumeKmsKeyId.keyArn } : {},
            }
        };
    }

    private renderStoppingCondition(config: StoppingCondition): {[key: string]: any} {
        return {
            StoppingCondition: {
                MaxRuntimeInSeconds: config.maxRuntimeInSeconds
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
        const stack = task.node.stack;

        // https://docs.aws.amazon.com/step-functions/latest/dg/sagemaker-iam.html
        const policyStatements = [
          new iam.PolicyStatement()
            .addActions('sagemaker:CreateTrainingJob', 'sagemaker:DescribeTrainingJob', 'sagemaker:StopTrainingJob')
            .addResource(stack.formatArn({
                service: 'sagemaker',
                resource: 'training-job',
                resourceName: '*'
            })),
          new iam.PolicyStatement()
            .addAction('sagemaker:ListTags')
            .addAllResources(),
          new iam.PolicyStatement()
            .addAction('iam:PassRole')
            .addResources(this.props.role.roleArn)
            .addCondition('StringEquals', { "iam:PassedToService": "sagemaker.amazonaws.com" })
        ];

        if (this.props.synchronous) {
          policyStatements.push(new iam.PolicyStatement()
            .addActions("events:PutTargets", "events:PutRule", "events:DescribeRule")
            .addResource(stack.formatArn({
              service: 'events',
              resource: 'rule',
              resourceName: 'StepFunctionsGetEventsForSageMakerTrainingJobsRule'
          })));
        }

        return policyStatements;
      }
}