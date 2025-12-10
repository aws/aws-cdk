import { Construct } from 'constructs';
import { ProductionVariant } from './base-types';
import * as iam from '../../../aws-iam';
import * as kms from '../../../aws-kms';
import * as sfn from '../../../aws-stepfunctions';
import * as cdk from '../../../core';
import { ValidationError } from '../../../core';
import { propertyInjectable } from '../../../core/lib/prop-injectable';
import { integrationResourceArn, isJsonPathOrJsonataExpression, validatePatternSupported } from '../private/task-utils';

interface SageMakerCreateEndpointConfigOptions {
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
  readonly kmsKey?: kms.IKeyRef;

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
 * Properties for creating an Amazon SageMaker endpoint configuration using JSONPath
 *
 * @see https://docs.aws.amazon.com/step-functions/latest/dg/connect-sagemaker.html
 */
export interface SageMakerCreateEndpointConfigJsonPathProps extends sfn.TaskStateJsonPathBaseProps, SageMakerCreateEndpointConfigOptions {}

/**
 * Properties for creating an Amazon SageMaker endpoint configuration using JSONata
 *
 * @see https://docs.aws.amazon.com/step-functions/latest/dg/connect-sagemaker.html
 */
export interface SageMakerCreateEndpointConfigJsonataProps extends sfn.TaskStateJsonataBaseProps, SageMakerCreateEndpointConfigOptions {}

/**
 * Properties for creating an Amazon SageMaker endpoint configuration
 *
 * @see https://docs.aws.amazon.com/step-functions/latest/dg/connect-sagemaker.html
 */
export interface SageMakerCreateEndpointConfigProps extends sfn.TaskStateBaseProps, SageMakerCreateEndpointConfigOptions {}

/**
 * A Step Functions Task to create a SageMaker endpoint configuration
 *
 * @see https://docs.aws.amazon.com/step-functions/latest/dg/connect-sagemaker.html
 */
@propertyInjectable
export class SageMakerCreateEndpointConfig extends sfn.TaskStateBase {
  /**
   * Uniquely identifies this class.
   */
  public static readonly PROPERTY_INJECTION_ID: string = 'aws-cdk-lib.aws-stepfunctions-tasks.SageMakerCreateEndpointConfig';

  /**
   * A Step Functions Task using JSONPath to create a SageMaker endpoint configuration
   *
   * @see https://docs.aws.amazon.com/step-functions/latest/dg/connect-sagemaker.html
   */
  public static jsonPath(scope: Construct, id: string, props: SageMakerCreateEndpointConfigJsonPathProps) {
    return new SageMakerCreateEndpointConfig(scope, id, props);
  }

  /**
   * A Step Functions Task using JSONata to create a SageMaker endpoint configuration
   *
   * @see https://docs.aws.amazon.com/step-functions/latest/dg/connect-sagemaker.html
   */
  public static jsonata(scope: Construct, id: string, props: SageMakerCreateEndpointConfigJsonataProps) {
    return new SageMakerCreateEndpointConfig(scope, id, {
      ...props,
      queryLanguage: sfn.QueryLanguage.JSONATA,
    });
  }

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
  protected _renderTask(topLevelQueryLanguage?: sfn.QueryLanguage): any {
    const queryLanguage = sfn._getActualQueryLanguage(topLevelQueryLanguage, this.props.queryLanguage);
    return {
      Resource: integrationResourceArn('sagemaker', 'createEndpointConfig', this.integrationPattern),
      ...this._renderParametersOrArguments(this.renderParameters(), queryLanguage),
    };
  }

  private renderParameters(): { [key: string]: any } {
    return {
      EndpointConfigName: this.props.endpointConfigName,
      Tags: this.props.tags?.value,
      KmsKeyId: this.props.kmsKey?.keyRef.keyId,
      ProductionVariants: this.props.productionVariants.map((variant) => ({
        InitialInstanceCount: variant.initialInstanceCount ? variant.initialInstanceCount : 1,
        InstanceType: isJsonPathOrJsonataExpression(variant.instanceType.toString())
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
            resourceName: isJsonPathOrJsonataExpression(this.props.endpointConfigName) ? '*' : `${this.props.endpointConfigName.toLowerCase()}`,
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
      throw new ValidationError('Must specify from 1 to 10 production variants per endpoint configuration', this);
    }
    this.props.productionVariants.forEach((variant) => {
      if (variant.initialInstanceCount && variant.initialInstanceCount < 1) throw new ValidationError('Must define at least one instance', this);
      if ( variant.initialVariantWeight && variant.initialVariantWeight <= 0) {
        throw new ValidationError('InitialVariantWeight has minimum value of 0', this);
      }
    });
  }
}
