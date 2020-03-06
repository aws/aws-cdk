import * as iam from '@aws-cdk/aws-iam';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import { Stack } from '@aws-cdk/core';
import { getResourceArn } from './resource-arn-suffix';
import { DataCaptureConfig, ProductionVariants } from './sagemaker-task-base-types';

/**
 *  @experimental
 */
export interface SagemakerCreateEndpointConfigTaskProps {

    /**
     * The request accepts the following data in JSON format.
     */
    readonly DataCaptureConfig?: DataCaptureConfig;

    /**
     * The name of the endpoint configuration. You specify this name in a CreateEndpoint request.
     */
    readonly EndpointConfigName: string;

    /**
     * Isolates the model container. No inbound or outbound network calls can be made to or from the model container.
     */
    readonly KmsKeyId?: string;

    /**
     * The Amazon Resource Name (ARN) of the IAM role that Amazon SageMaker can assume to access model artifacts and
     * docker image for deployment on ML compute instances or for batch transform jobs.
     */
    readonly ProductionVariants: ProductionVariants[];

    /**
     * Tags to be applied to the model.
     */
    readonly tags?: {[key: string]: string};

    /**
     * The service integration pattern indicates different ways to call SageMaker APIs.
     *
     * The valid value is FIRE_AND_FORGE.
     *
     * @default FIRE_AND_FORGET
     */
    readonly integrationPattern?: sfn.ServiceIntegrationPattern;

}

/**
 * Class representing the SageMaker Create Training Job task.
 *
 * @experimental
 */
export class SagemakerCreateEndpointConfigTask implements sfn.IStepFunctionsTask {

    private readonly integrationPattern: sfn.ServiceIntegrationPattern;

    constructor(private readonly props: SagemakerCreateEndpointConfigTaskProps) {
        this.integrationPattern = props.integrationPattern || sfn.ServiceIntegrationPattern.FIRE_AND_FORGET;

        const supportedPatterns = [
            sfn.ServiceIntegrationPattern.FIRE_AND_FORGET
        ];

        if (!supportedPatterns.includes(this.integrationPattern)) {
            throw new Error(`Invalid Service Integration Pattern: ${this.integrationPattern}
            is not supported to call SageMaker:CreateEndpointConfig.`);
        }
    }

    public bind(task: sfn.Task): sfn.StepFunctionsTaskConfig  {

        return {
          resourceArn: getResourceArn("sagemaker", "createEndpointConfig", this.integrationPattern),
          parameters: this.renderParameters(),
          policyStatements: this.makePolicyStatements(task),
        };
    }

    private renderParameters(): {[key: string]: any} {
        return {
            EndpointConfigName: this.props.EndpointConfigName,
            ...(this.renderProductionVariants(this.props.ProductionVariants)),
            ...(this.renderDataCaptureConfig(this.props.DataCaptureConfig)),
            ...(this.renderKmsKeyId(this.props.KmsKeyId)),
            ...(this.renderTags(this.props.tags)),
        };
    }

    private renderDataCaptureConfig(config: DataCaptureConfig | undefined): {[key: string]: any} {
        return (config) ? { DataCaptureConfig: {
            DestinationS3Uri: config.destinationS3Uri,
            InitialSamplingPercentage: config.initialSamplingPercentage,
            ...(config.kmsKeyId) ? {KmsKeyId: config.kmsKeyId} : {},
            ...(config.enableCapture) ? {EnableCapture: config.enableCapture} : {},
            ...(config.captureOptions) ? { CaptureOptions: config.captureOptions.map(
                captureOption => ({
                    CaptureMode: captureOption.captureMode
                })
            )} : {},
            ...(config.captureContentTypeHeader) ? {
                CaptureContentTypeHeader: {
                    CsvContentTypes: config.captureContentTypeHeader.csvContentTypes,
                    JsonContentTypes: config.captureContentTypeHeader.jsonContentTypes
                }
            } : {}
        } } : {};
    }

    private renderKmsKeyId(config: string | undefined): {[key: string]: any} {
        return (config) ? {KmsKeyId: config} : {};
    }

    private renderProductionVariants(configs: ProductionVariants[]): {[key: string]: any} {
        return (configs) ? { ProductionVariants: configs.map(config => ({
                ...(config.acceleratorType) ? { AcceleratorType: config.acceleratorType } : {},
                ...(config.initialInstanceCount) ? { InitialInstanceCount: config.initialInstanceCount } : {},
                ...(config.initialVariantWeight) ? { InitialVariantWeight: config.initialVariantWeight } : {},
                ...(config.instanceType) ? { InstanceType: 'ml.' + config.instanceType.toString() } : {},
                ...(config.modelName) ? { ModelName: config.modelName } : {},
                ...(config.variantName) ? { VariantName: config.variantName } : {},
            }))} : {};
    }

    private renderTags(tags: {[key: string]: any} | undefined): {[key: string]: any} {
        return (tags) ? { Tags: Object.keys(tags).map(key => ({ Key: key, Value: tags[key] })) } : {};
    }

    private makePolicyStatements(task: sfn.Task): iam.PolicyStatement[] {
        Stack.of(task);

        // https://docs.aws.amazon.com/step-functions/latest/dg/sagemaker-iam.html
        const policyStatements = [
            new iam.PolicyStatement({
                actions: ['sagemaker:CreateEndpointConfig'],
                resources: ['*'],
            }),
            new iam.PolicyStatement({
                actions: ['sagemaker:ListTags'],
                resources: ['*']
            }),
        ];

        return policyStatements;
      }
}
