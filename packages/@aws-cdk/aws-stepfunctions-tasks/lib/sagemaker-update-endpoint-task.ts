import * as iam from '@aws-cdk/aws-iam';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import { Stack } from '@aws-cdk/core';
import { getResourceArn } from './resource-arn-suffix';
import { VariantPropertyType } from './sagemaker-task-base-types';

/**
 *  @experimental
 */
export interface SagemakerUpdateEndpointTaskProps {

    /**
     * The name of an endpoint configuration. For more information, see CreateEndpointConfig.
     */
    readonly endpointConfigName: string;

    /**
     * The name of the endpoint. The name must be unique within an AWS Region in your AWS account.
     */
    readonly endpointName: string;

    /**
     * The name of the endpoint. The name must be unique within an AWS Region in your AWS account.
     *
     * @default - None
     */
    readonly excludeRetainedVariantProperties?: VariantPropertyType[];

    /**
     * When updating endpoint resources, enables or disables the retention of variant properties, such as the instance count or the variant weight.
     *
     * @default false
     */
    readonly retainAllVariantProperties?: boolean;

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
export class SagemakerUpdateEndpointTask implements sfn.IStepFunctionsTask {

    private readonly integrationPattern: sfn.ServiceIntegrationPattern;

    constructor(private readonly props: SagemakerUpdateEndpointTaskProps) {
        this.integrationPattern = props.integrationPattern || sfn.ServiceIntegrationPattern.FIRE_AND_FORGET;

        const supportedPatterns = [
            sfn.ServiceIntegrationPattern.FIRE_AND_FORGET
        ];

        if (!supportedPatterns.includes(this.integrationPattern)) {
            throw new Error(`Invalid Service Integration Pattern: ${this.integrationPattern} is not supported to call SageMaker:updateEndpoint.`);
        }
    }

    public bind(task: sfn.Task): sfn.StepFunctionsTaskConfig  {

        return {
          resourceArn: getResourceArn("sagemaker", "updateEndpoint", this.integrationPattern),
          parameters: this.renderParameters(),
          policyStatements: this.makePolicyStatements(task),
        };
    }

    private renderParameters(): {[key: string]: any} {
        return {
            EndpointConfigName: this.props.endpointConfigName,
            EndpointName: this.props.endpointName,
            ...(this.renderProductionVariants(this.props.excludeRetainedVariantProperties)),
            ...(this.renderRetainAllVariantProperties(this.props.retainAllVariantProperties)),
        };
    }

    private renderRetainAllVariantProperties(config: boolean | undefined): {[key: string]: any} {
        return (config) ? {RetainAllVariantProperties: config} : {};
    }

    private renderProductionVariants(configs: VariantPropertyType[] | undefined): {[key: string]: any} {
        return (configs) ? { ExcludeRetainedVariantProperties: configs.map(config => ({
             VariantPropertyType: config }
        ))} : {};
    }

    private makePolicyStatements(task: sfn.Task): iam.PolicyStatement[] {
        Stack.of(task);

        // https://docs.aws.amazon.com/step-functions/latest/dg/sagemaker-iam.html
        const policyStatements = [
            new iam.PolicyStatement({
                actions: ['sagemaker:updateEndpoint'],
                resources: ['*'],
            }),
            new iam.PolicyStatement({
                actions: ['sagemaker:ListTags'],
                resources: ['*']
            })
        ];

        return policyStatements;
      }
}
