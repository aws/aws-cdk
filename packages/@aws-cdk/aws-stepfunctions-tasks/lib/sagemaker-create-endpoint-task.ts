import * as iam from '@aws-cdk/aws-iam';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import { Stack } from '@aws-cdk/core';
import { getResourceArn } from './resource-arn-suffix';

/**
 *  @experimental
 */
export interface SagemakerCreateEndpointTaskProps {

    /**
     * The name of an endpoint configuration. For more information, see CreateEndpointConfig.
     */
    readonly endpointConfigName: string;

    /**
     * The name of the endpoint. The name must be unique within an AWS Region in your AWS account.
     */
    readonly endpointName: string;

    /**
     * Tags to be applied to the Endpoint.
     *
     * @default - No Tags
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
export class SagemakerCreateEndpointTask implements sfn.IStepFunctionsTask {

    private readonly integrationPattern: sfn.ServiceIntegrationPattern;

    constructor(private readonly props: SagemakerCreateEndpointTaskProps) {
        this.integrationPattern = props.integrationPattern || sfn.ServiceIntegrationPattern.FIRE_AND_FORGET;

        const supportedPatterns = [
            sfn.ServiceIntegrationPattern.FIRE_AND_FORGET
        ];

        if (!supportedPatterns.includes(this.integrationPattern)) {
            throw new Error(`Invalid Service Integration Pattern: ${this.integrationPattern} is not supported to call SageMaker:createEndpoint.`);
        }
    }

    public bind(task: sfn.Task): sfn.StepFunctionsTaskConfig  {

        return {
          resourceArn: getResourceArn("sagemaker", "createEndpoint", this.integrationPattern),
          parameters: this.renderParameters(),
          policyStatements: this.makePolicyStatements(task),
        };
    }

    private renderParameters(): {[key: string]: any} {
        return {
            EndpointConfigName: this.props.endpointConfigName,
            EndpointName: this.props.endpointName,
            ...(this.renderTags(this.props.tags)),
        };
    }

    private renderTags(tags: {[key: string]: any} | undefined): {[key: string]: any} {
        return (tags) ? { Tags: Object.keys(tags).map(key => ({ Key: key, Value: tags[key] })) } : {};
    }

    private makePolicyStatements(task: sfn.Task): iam.PolicyStatement[] {
        Stack.of(task);

        // https://docs.aws.amazon.com/step-functions/latest/dg/sagemaker-iam.html
        const policyStatements = [
            new iam.PolicyStatement({
                actions: ['sagemaker:createEndpoint'],
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
