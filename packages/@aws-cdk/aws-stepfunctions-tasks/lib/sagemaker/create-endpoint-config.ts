import * as iam from '@aws-cdk/aws-iam';
import * as kms from '@aws-cdk/aws-kms';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
import { ProductionVariant } from './base-types';
import { integrationResourceArn, validatePatternSupported } from '../private/task-utils';

/**
 * Properties for creating an Amazon SageMaker endpoint configuration
 *
 * @see https://docs.aws.amazon.com/step-functions/latest/dg/connect-sagemaker.html
 */
export interface SageMakerCreateEndpointConfigProps extends sfn.TaskStateBaseProps {
  /**
   * The name of the endpoint configuration.
   */
  readonly endpointConfigName: string;
  /**
   * AWS Key Management Service key that Amazon SageMaker
   * uses to encrypt data on the storage volume attached to the ML compute instance that hosts the endpoint.
   *
   * @default - None
   */
  readonly kmsKey?: kms.IKey;

  /**
   * An list of ProductionVariant objects, one for each model that you want to host at this endpoint.
   * Identifies a model that you want to host and the resources to deploy for hosting it.
   * If you are deploying multiple models, tell Amazon SageMaker how to distribute traffic among the models by specifying variant weights.
   */
  readonly productionVariants: ProductionVariant[];

  /**
   * Tags to be applied to the endpoint configuration.
   *
   * @default - No tags
   */
  readonly tags?: sfn.TaskInput;
}

/**
 * A Step Functions Task to create a SageMaker endpoint configuration
 *
 * @see https://docs.aws.amazon.com/step-functions/latest/dg/connect-sagemaker.html
 */
export class SageMakerCreateEndpointConfig extends sfn.TaskStateBase {
  private static readonly SUPPORTED_INTEGRATION_PATTERNS: sfn.IntegrationPattern[] = [
    sfn.IntegrationPattern.REQUEST_RESPONSE,
  ];
  protected readonly taskMetrics?: sfn.TaskMetricsConfig;
  protected readonly taskPolicies?: iam.PolicyStatement[];
  private readonly integrationPattern: sfn.IntegrationPattern;

  constructor(scope: Construct, id: string, private readonly props: SageMakerCreateEndpointConfigProps) {
    super(scope, id, props);
    this.integrationPattern = props.integrationPattern || sfn.IntegrationPattern.REQUEST_RESPONSE;
    validatePatternSupported(this.integrationPattern, SageMakerCreateEndpointConfig.SUPPORTED_INTEGRATION_PATTERNS);

    this.validateProductionVariants();
    this.taskPolicies = this.makePolicyStatements();
  }

  /**
   * @internal
   */
  protected _renderTask(): any {
    return {
      Resource: integrationResourceArn('sagemaker', 'createEndpointConfig', this.integrationPattern),
      Parameters: sfn.FieldUtils.renderObject(this.renderParameters()),
    };
  }

  private renderParameters(): { [key: string]: any } {
    return {
      EndpointConfigName: this.props.endpointConfigName,
      Tags: this.props.tags?.value,
      KmsKeyId: this.props.kmsKey?.keyId,
      ProductionVariants: this.props.productionVariants.map((variant) => ({
        InitialInstanceCount: variant.initialInstanceCount ? variant.initialInstanceCount : 1,
        InstanceType: sfn.JsonPath.isEncodedJsonPath(variant.instanceType.toString())
          ? variant.instanceType.toString() : `ml.${variant.instanceType}`,
        ModelName: variant.modelName,
        VariantName: variant.variantName,
        AcceleratorType: variant.acceleratorType,
        InitialVariantWeight: variant.initialVariantWeight,
      }),
      ),
    };
  }

  private makePolicyStatements(): iam.PolicyStatement[] {
    const stack = cdk.Stack.of(this);
    // https://docs.aws.amazon.com/sagemaker/latest/dg/api-permissions-reference.html
    return [
      new iam.PolicyStatement({
        actions: ['sagemaker:CreateEndpointConfig'],
        resources: [
          stack.formatArn({
            service: 'sagemaker',
            resource: 'endpoint-config',
            // If the endpoint configuration name comes from input, we cannot target the policy to a particular ARN prefix reliably.
            // SageMaker uses lowercase for resource name in the arn
            resourceName: sfn.JsonPath.isEncodedJsonPath(this.props.endpointConfigName) ? '*' : `${this.props.endpointConfigName.toLowerCase()}`,
          }),
        ],
      }),
      new iam.PolicyStatement({
        actions: ['sagemaker:ListTags'],
        // https://docs.aws.amazon.com/step-functions/latest/dg/sagemaker-iam.html
        resources: ['*'],
      }),
    ];
  }

  private validateProductionVariants() {
    if (this.props.productionVariants.length < 1 || this.props.productionVariants.length > 10) {
      throw new Error('Must specify from 1 to 10 production variants per endpoint configuration');
    }
    this.props.productionVariants.forEach((variant) => {
      if (variant.initialInstanceCount && variant.initialInstanceCount < 1) throw new Error('Must define at least one instance');
      if ( variant.initialVariantWeight && variant.initialVariantWeight <= 0) {
        throw new Error('InitialVariantWeight has minimum value of 0');
      }
    });
  }
}