import * as iam from '@aws-cdk/aws-iam';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import { Construct, Stack } from '@aws-cdk/core';
import { integrationResourceArn, validatePatternSupported } from '../private/task-utils';
import { ProductionVariant } from './base-types';

/**
 * Properties for creating an Amazon SageMaker endpoint configuration
 *
 * @experimental
 */
export interface SageMakerCreateEndpointConfigProps extends sfn.TaskStateBaseProps {
  /**
   * The name of the endpoint configuration.
   */
  readonly endpointConfigName: string;
  /**
   * The Amazon Resource Name (ARN) of a AWS Key Management Service key that Amazon SageMaker
   * uses to encrypt data on the storage volume attached to the ML compute instance that hosts the endpoint.
   *
   * @default - None
   */
  readonly kmsKeyId?: string;

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
  readonly tags?: { [key: string]: string };
}

/**
 * A Step Functions Task to create a SageMaker endpoint configuration
 *
 * @experimental
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

    // verify production variants
    if (props.productionVariants.length < 1 || props.productionVariants.length > 10) {
      throw new Error('Must specify from 1 to 10 production variants per endpoint configuration');
    }
    props.productionVariants.forEach((variant) => {
      if ( variant.initialInstanceCount < 1) throw new Error('Must define at least one instance');
      if ( variant.initialVariantWeight && variant.initialVariantWeight <= 0) {
        throw new Error('InitialVariantWeight has minimum value of 0');
      }
    });
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
      ...this.props.kmsKeyId ? { KmsKeyId: this.props.kmsKeyId } : {},
      ...this.renderProductionVariants(this.props.productionVariants),
      ...this.renderTags(this.props.tags),
    };
  }

  private makePolicyStatements(): iam.PolicyStatement[] {
    const stack = Stack.of(this);
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
        resources: [
          stack.formatArn({
            service: 'sagemaker',
            resource: 'endpoint-config',
            resourceName: '*',
          }),
        ],
      }),
    ];
  }

  private renderTags(tags: { [key: string]: any } | undefined): { [key: string]: any } {
    return tags ? { Tags: Object.keys(tags).map((key) => ({ Key: key, Value: tags[key] })) } : {};
  }

  private renderProductionVariants(variants: ProductionVariant[]): {[key: string]: any} {
    return {
      ProductionVariants: variants.map((variant) => ({
        InitialInstanceCount: variant.initialInstanceCount,
        InstanceType: `ml.${variant.instanceType}`,
        ModelName: variant.modelName,
        VariantName: variant.variantName,
        ...variant.acceleratorType ? { AcceleratorType: variant.acceleratorType }: {},
        ...variant.initialVariantWeight ? { InitialVariantWeight: variant.initialVariantWeight } : {},
      })),
    };
  }
}