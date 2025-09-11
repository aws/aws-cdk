import * as cr from 'aws-cdk-lib/custom-resources';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
import { IBedrockInvokable } from './models';

/**
 * Properties for ModelAccessValidator
 */
export interface ModelAccessValidatorProps {
  /**
   * The Bedrock model to validate access for
   */
  readonly model: IBedrockInvokable;

  /**
   * Whether to validate model access during deployment
   * @default true
   */
  readonly validateOnDeploy?: boolean;

  /**
   * Custom error message to display when model access fails
   * @default - Standard error message with console link
   */
  readonly errorMessage?: string;
}

/**
 * Validates that a Bedrock model is accessible in the current account during deployment.
 *
 * This construct creates a custom resource that attempts to invoke the specified model
 * with a minimal test payload. If the model is not accessible (hasn't been enabled in
 * the Bedrock console), the deployment will fail with a clear error message.
 *
 * @example
 * const model = BedrockFoundationModel.ANTHROPIC_CLAUDE_OPUS_V1_0;
 *
 * new ModelAccessValidator(this, 'ModelValidator', {
 *   model: model,
 * });
 */
export class ModelAccessValidator extends Construct {
  constructor(scope: Construct, id: string, props: ModelAccessValidatorProps) {
    super(scope, id);

    if (props.validateOnDeploy === false) {
      return;
    }

    // Create a role for the custom resource
    const role = new iam.Role(this, 'ValidationRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'),
      ],
    });

    const customResource = new cr.AwsCustomResource(this, 'ValidationResource', {
      onCreate: {
        service: 'BedrockRuntime',
        action: 'invokeModel',
        parameters: {
          modelId: props.model.invokableArn,
          body: Buffer.from(JSON.stringify({ prompt: 'test' })).toString('base64'),
        },
        physicalResourceId: cr.PhysicalResourceId.of(`model-access-${props.model.invokableArn}`),
        ignoreErrorCodesMatching: 'ValidationException',
      },
      onUpdate: {
        service: 'BedrockRuntime',
        action: 'invokeModel',
        parameters: {
          modelId: props.model.invokableArn,
          body: Buffer.from(JSON.stringify({ prompt: 'test' })).toString('base64'),
        },
        physicalResourceId: cr.PhysicalResourceId.of(`model-access-${props.model.invokableArn}`),
        ignoreErrorCodesMatching: 'ValidationException',
      },
      role: role,
      installLatestAwsSdk: false,
      resourceType: 'Custom::ModelAccessValidator',
    });

    // Let the model itself grant the appropriate permissions
    props.model.grantInvoke(customResource);
  }
}
