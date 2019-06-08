import iam = require('@aws-cdk/aws-iam');
import sfn = require('@aws-cdk/aws-stepfunctions');

import { BatchStrategy, TransformInput, TransformOutput, TransformResources } from './sagemaker-task-base-types';

export interface SagemakerTransformProps {

    /**
     * Training Job Name.
     */
    readonly transformJobName: string;

    /**
     * Role for thte Training Job.
     */
    readonly role: iam.Role;

    /**
     * Specify if the task is synchronous or asychronous.
     */
    readonly synchronous?: boolean;

    /**
     * Number of records to include in a mini-batch for an HTTP inference request.
     */
    readonly batchStrategy?: BatchStrategy;

    /**
     * Environment variables to set in the Docker container.
     */
    readonly environment?: {[key: string]: any};

    /**
     * Maximum number of parallel requests that can be sent to each instance in a transform job.
     */
    readonly maxConcurrentTransforms?: number;

    /**
     * Maximum allowed size of the payload, in MB.
     */
    readonly maxPayloadInMB?: number;

    /**
     * Name of the model that you want to use for the transform job.
     */
    readonly modelName: string;

    /**
     * Tags to be applied to the train job.
     */
    readonly tags?: {[key: string]: any};

    /**
     * Dataset to be transformed and the Amazon S3 location where it is stored.
     */
    readonly transformInput: TransformInput;

    /**
     * S3 location where you want Amazon SageMaker to save the results from the transform job.
     */
    readonly transformOutput: TransformOutput;

    /**
     * ML compute instances for the transform job.
     */
    readonly transformResources: TransformResources;
}

/**
 * Class representing the SageMaker Create Training Job task.
 */
export class SagemakerTransformTask implements sfn.IStepFunctionsTask {

    constructor(private readonly props: SagemakerTransformProps) { }

    public bind(task: sfn.Task): sfn.StepFunctionsTaskProperties {
        return {
          resourceArn: 'arn:aws:states:::sagemaker:createTransformJob' + (this.props.synchronous ? '.sync' : ''),
          parameters: sfn.FieldUtils.renderObject(this.renderParameters()),
          policyStatements: this.makePolicyStatements(task),
        };
    }

    private renderParameters(): {[key: string]: any} {
        return {
            ...(this.props.batchStrategy) ? { BatchStrategy: this.props.batchStrategy } : {},
            ...(this.renderEnvironment(this.props.environment)),
            ...(this.props.maxConcurrentTransforms) ? { MaxConcurrentTransforms: this.props.maxConcurrentTransforms } : {},
            ...(this.props.maxPayloadInMB) ? { MaxPayloadInMB: this.props.maxPayloadInMB } : {},
            ModelName: this.props.modelName,
            ...(this.renderTags(this.props.tags)),
            ...(this.renderTransformInput(this.props.transformInput)),
            TransformJobName: this.props.transformJobName,
            ...(this.renderTransformOutput(this.props.transformOutput)),
            ...(this.renderTransformResources(this.props.transformResources)),
        };
    }

    private renderTransformInput(input: TransformInput): {[key: string]: any} {
        return {
            TransformInput: {
                ...(input.compressionType) ? { CompressionType: input.compressionType } : {},
                ...(input.contentType) ? { ContentType: input.contentType } : {},
                DataSource: {
                    S3DataSource: {
                        S3Uri: input.transformDataSource.s3DataSource.s3Uri,
                        S3DataType: input.transformDataSource.s3DataSource.s3DataType,
                    }
                },
                ...(input.splitType) ? { SplitType: input.splitType } : {},
            }
        };
    }

    private renderTransformOutput(output: TransformOutput): {[key: string]: any} {
        return {
            TransformOutput: {
                S3OutputPath: output.s3OutputPath,
                ...(output.encryptionKey) ? { KmsKeyId: output.encryptionKey.keyArn } : {},
                ...(output.accept) ? { Accept: output.accept } : {},
                ...(output.assembleWith) ? { AssembleWith: output.assembleWith } : {},
            }
        };
    }

    private renderTransformResources(resources: TransformResources): {[key: string]: any} {
        return {
            TransformResources: {
                InstanceCount: resources.instanceCount,
                InstanceType: 'ml.' + resources.instanceType,
                ...(resources.volumeKmsKeyId) ? { VolumeKmsKeyId: resources.volumeKmsKeyId.keyArn } : {},
            }
        };
    }

    private renderEnvironment(environment: {[key: string]: any} | undefined): {[key: string]: any} {
        return (environment) ? { Environment: environment } : {};
    }

    private renderTags(tags: {[key: string]: any} | undefined): {[key: string]: any} {
        return (tags) ? { Tags: Object.keys(tags).map(key => ({ Key: key, Value: tags[key] })) } : {};
    }

    private makePolicyStatements(task: sfn.Task): iam.PolicyStatement[] {
        const stack = task.node.stack;

        // https://docs.aws.amazon.com/step-functions/latest/dg/sagemaker-iam.html
        const policyStatements = [
          new iam.PolicyStatement()
            .addActions('sagemaker:CreateTransformJob', 'sagemaker:DescribeTransformJob', 'sagemaker:StopTransformJob')
            .addResource(stack.formatArn({
                service: 'sagemaker',
                resource: 'transform-job',
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
              resourceName: 'StepFunctionsGetEventsForSageMakerTransformJobsRule'
          })));
        }

        return policyStatements;
      }
}