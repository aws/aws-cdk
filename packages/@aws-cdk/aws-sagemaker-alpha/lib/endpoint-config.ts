import { EOL } from 'os';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as cdk from 'aws-cdk-lib/core';
import { Construct } from 'constructs';
import { AcceleratorType } from './accelerator-type';
import { InstanceType } from './instance-type';
import { IModel } from './model';
import { sameEnv } from './private/util';
import { CfnEndpointConfig } from 'aws-cdk-lib/aws-sagemaker';
import { addConstructMetadata, MethodMetadata } from 'aws-cdk-lib/core/lib/metadata-resource';
import { propertyInjectable } from 'aws-cdk-lib/core/lib/prop-injectable';

/**
 * The interface for a SageMaker EndpointConfig resource.
 */
export interface IEndpointConfig extends cdk.IResource {
  /**
   * The ARN of the endpoint configuration.
   *
   * @attribute
   */
  readonly endpointConfigArn: string;
  /**
   * The name of the endpoint configuration.
   *
   * @attribute
   */
  readonly endpointConfigName: string;
}

/**
 * Common construction properties for all production variant types (e.g., instance, serverless).
 */
interface ProductionVariantProps {
  /**
   * Determines initial traffic distribution among all of the models that you specify in the
   * endpoint configuration. The traffic to a production variant is determined by the ratio of the
   * variant weight to the sum of all variant weight values across all production variants.
   *
   * @default 1.0
   */
  readonly initialVariantWeight?: number;
  /**
   * The model to host.
   */
  readonly model: IModel;
  /**
   * Name of the production variant.
   */
  readonly variantName: string;
}

/**
 * Construction properties for an instance production variant.
 */
export interface InstanceProductionVariantProps extends ProductionVariantProps {
  /**
   * The size of the Elastic Inference (EI) instance to use for the production variant. EI instances
   * provide on-demand GPU computing for inference.
   *
   * @default - none
   */
  readonly acceleratorType?: AcceleratorType;
  /**
   * Number of instances to launch initially.
   *
   * @default 1
   */
  readonly initialInstanceCount?: number;
  /**
   * Instance type of the production variant.
   *
   * @default InstanceType.T2_MEDIUM
   */
  readonly instanceType?: InstanceType;
}

/**
 * Construction properties for a serverless production variant.
 */
export interface ServerlessProductionVariantProps extends ProductionVariantProps {
  /**
   * The maximum number of concurrent invocations your serverless endpoint can process.
   *
   * Valid range: 1-200
   */
  readonly maxConcurrency: number;
  /**
   * The memory size of your serverless endpoint. Valid values are in 1 GB increments:
   * 1024 MB, 2048 MB, 3072 MB, 4096 MB, 5120 MB, or 6144 MB.
   */
  readonly memorySizeInMB: number;
  /**
   * The number of concurrent invocations that are provisioned and ready to respond to your endpoint.
   *
   * Valid range: 1-200, must be less than or equal to maxConcurrency.
   *
   * @default - none
   */
  readonly provisionedConcurrency?: number;
}

/**
 * Represents common attributes of all production variant types (e.g., instance, serverless) once
 * associated to an EndpointConfig.
 */
interface ProductionVariant {
  /**
   * Determines initial traffic distribution among all of the models that you specify in the
   * endpoint configuration. The traffic to a production variant is determined by the ratio of the
   * variant weight to the sum of all variant weight values across all production variants.
   */
  readonly initialVariantWeight: number;
  /**
   * The name of the model to host.
   */
  readonly modelName: string;
  /**
   * The name of the production variant.
   */
  readonly variantName: string;
}

/**
 * Represents an instance production variant that has been associated with an EndpointConfig.
 *
 * @internal
 */
export interface InstanceProductionVariant extends ProductionVariant {
  /**
   * The size of the Elastic Inference (EI) instance to use for the production variant. EI instances
   * provide on-demand GPU computing for inference.
   *
   * @default - none
   */
  readonly acceleratorType?: AcceleratorType;
  /**
   * Number of instances to launch initially.
   */
  readonly initialInstanceCount: number;
  /**
   * Instance type of the production variant.
   */
  readonly instanceType: InstanceType;
}

/**
 * Represents a serverless production variant that has been associated with an EndpointConfig.
 *
 * @internal
 */
interface ServerlessProductionVariant extends ProductionVariant {
  /**
   * The maximum number of concurrent invocations your serverless endpoint can process.
   */
  readonly maxConcurrency: number;
  /**
   * The memory size of your serverless endpoint.
   */
  readonly memorySizeInMB: number;
  /**
   * The number of concurrent invocations that are provisioned and ready to respond to your endpoint.
   */
  readonly provisionedConcurrency?: number;
}

/**
 * Construction properties for a SageMaker EndpointConfig.
 */
export interface EndpointConfigProps {
  /**
   * Name of the endpoint configuration.
   *
   * @default - AWS CloudFormation generates a unique physical ID and uses that ID for the endpoint
   * configuration's name.
   */
  readonly endpointConfigName?: string;

  /**
   * Optional KMS encryption key associated with this stream.
   *
   * @default - none
   */
  readonly encryptionKey?: kms.IKeyRef;

  /**
   * A list of instance production variants. You can always add more variants later by calling
   * `EndpointConfig#addInstanceProductionVariant`.
   *
   * Cannot be specified if `serverlessProductionVariant` is specified.
   *
   * @default - none
   */
  readonly instanceProductionVariants?: InstanceProductionVariantProps[];

  /**
   * A serverless production variant. Serverless endpoints automatically launch compute resources
   * and scale them in and out depending on traffic.
   *
   * Cannot be specified if `instanceProductionVariants` is specified.
   *
   * @default - none
   */
  readonly serverlessProductionVariant?: ServerlessProductionVariantProps;
}

/**
 * Defines a SageMaker EndpointConfig.
 */
@propertyInjectable
export class EndpointConfig extends cdk.Resource implements IEndpointConfig {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = '@aws-cdk.aws-sagemaker-alpha.EndpointConfig';

  /**
   * Imports an EndpointConfig defined either outside the CDK or in a different CDK stack.
   * @param scope the Construct scope.
   * @param id the resource id.
   * @param endpointConfigArn the ARN of the endpoint configuration.
   */
  public static fromEndpointConfigArn(scope: Construct, id: string, endpointConfigArn: string): IEndpointConfig {
    const endpointConfigName = cdk.Stack.of(scope).splitArn(endpointConfigArn, cdk.ArnFormat.SLASH_RESOURCE_NAME).resourceName!;

    class Import extends cdk.Resource implements IEndpointConfig {
      public endpointConfigArn = endpointConfigArn;
      public endpointConfigName = endpointConfigName;
    }

    return new Import(scope, id, {
      environmentFromArn: endpointConfigArn,
    });
  }

  /**
   * Imports an EndpointConfig defined either outside the CDK or in a different CDK stack.
   * @param scope the Construct scope.
   * @param id the resource id.
   * @param endpointConfigName the name of the endpoint configuration.
   */
  public static fromEndpointConfigName(scope: Construct, id: string, endpointConfigName: string): IEndpointConfig {
    const endpointConfigArn = cdk.Stack.of(scope).formatArn({
      service: 'sagemaker',
      resource: 'endpoint-config',
      resourceName: endpointConfigName,
    });

    class Import extends cdk.Resource implements IEndpointConfig {
      public endpointConfigArn = endpointConfigArn;
      public endpointConfigName = endpointConfigName;
    }

    return new Import(scope, id, {
      environmentFromArn: endpointConfigArn,
    });
  }

  /**
   * The ARN of the endpoint configuration.
   */
  public readonly endpointConfigArn: string;
  /**
   * The name of the endpoint configuration.
   */
  public readonly endpointConfigName: string;

  private readonly instanceProductionVariantsByName: { [key: string]: InstanceProductionVariant } = {};
  private serverlessProductionVariant?: ServerlessProductionVariant;

  constructor(scope: Construct, id: string, props: EndpointConfigProps = {}) {
    super(scope, id, {
      physicalName: props.endpointConfigName,
    });
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    // Validate mutual exclusivity
    if (props.instanceProductionVariants && props.serverlessProductionVariant) {
      throw new Error('Cannot specify both instanceProductionVariants and serverlessProductionVariant. Choose one variant type.');
    }

    (props.instanceProductionVariants || []).map(p => this.addInstanceProductionVariant(p));

    if (props.serverlessProductionVariant) {
      this.addServerlessProductionVariant(props.serverlessProductionVariant);
    }

    // create the endpoint configuration resource
    const endpointConfig = new CfnEndpointConfig(this, 'EndpointConfig', {
      kmsKeyId: (props.encryptionKey) ? props.encryptionKey.keyRef.keyArn : undefined,
      endpointConfigName: this.physicalName,
      productionVariants: cdk.Lazy.any({ produce: () => this.renderProductionVariants() }),
    });
    this.endpointConfigName = this.getResourceNameAttribute(endpointConfig.attrEndpointConfigName);
    this.endpointConfigArn = this.getResourceArnAttribute(endpointConfig.ref, {
      service: 'sagemaker',
      resource: 'endpoint-config',
      resourceName: this.physicalName,
    });
  }

  /**
   * Add production variant to the endpoint configuration.
   *
   * @param props The properties of a production variant to add.
   */
  @MethodMetadata()
  public addInstanceProductionVariant(props: InstanceProductionVariantProps): void {
    if (this.serverlessProductionVariant) {
      throw new Error('Cannot add instance production variant when serverless production variant is already configured');
    }
    if (props.variantName in this.instanceProductionVariantsByName) {
      throw new Error(`There is already a Production Variant with name '${props.variantName}'`);
    }
    this.validateInstanceProductionVariantProps(props);
    this.instanceProductionVariantsByName[props.variantName] = {
      acceleratorType: props.acceleratorType,
      initialInstanceCount: props.initialInstanceCount || 1,
      initialVariantWeight: props.initialVariantWeight || 1.0,
      instanceType: props.instanceType || InstanceType.T2_MEDIUM,
      modelName: props.model.modelName,
      variantName: props.variantName,
    };
  }

  /**
   * Add serverless production variant to the endpoint configuration.
   *
   * @param props The properties of a serverless production variant to add.
   */
  @MethodMetadata()
  public addServerlessProductionVariant(props: ServerlessProductionVariantProps): void {
    if (Object.keys(this.instanceProductionVariantsByName).length > 0) {
      throw new Error('Cannot add serverless production variant when instance production variants are already configured');
    }
    if (this.serverlessProductionVariant) {
      throw new Error('Cannot add more than one serverless production variant per endpoint configuration');
    }
    this.validateServerlessProductionVariantProps(props);
    this.serverlessProductionVariant = {
      initialVariantWeight: props.initialVariantWeight || 1.0,
      maxConcurrency: props.maxConcurrency,
      memorySizeInMB: props.memorySizeInMB,
      modelName: props.model.modelName,
      provisionedConcurrency: props.provisionedConcurrency,
      variantName: props.variantName,
    };
  }

  /**
   * Get instance production variants associated with endpoint configuration.
   *
   * @internal
   */
  public get _instanceProductionVariants(): InstanceProductionVariant[] {
    return Object.values(this.instanceProductionVariantsByName);
  }

  /**
   * Find instance production variant based on variant name
   * @param name Variant name from production variant
   *
   * @internal
   */
  public _findInstanceProductionVariant(name: string): InstanceProductionVariant {
    const ret = this.instanceProductionVariantsByName[name];
    if (!ret) {
      throw new Error(`No variant with name: '${name}'`);
    }
    return ret;
  }

  private validateProductionVariants(): void {
    const hasServerlessVariant = this.serverlessProductionVariant !== undefined;

    // validate at least one production variant
    if (this._instanceProductionVariants.length === 0 && !hasServerlessVariant) {
      throw new Error('Must configure at least 1 production variant');
    }

    // validate mutual exclusivity
    if (this._instanceProductionVariants.length > 0 && hasServerlessVariant) {
      throw new Error('Cannot configure both instance and serverless production variants');
    }

    // validate instance variant limits
    if (this._instanceProductionVariants.length > 10) {
      throw new Error('Can\'t have more than 10 production variants');
    }
  }

  private validateInstanceProductionVariantProps(props: InstanceProductionVariantProps): void {
    const errors: string[] = [];

    // check instance count is greater than zero
    if (props.initialInstanceCount !== undefined && props.initialInstanceCount < 1) {
      errors.push('Must have at least one instance');
    }

    // check variant weight is not negative
    if (props.initialVariantWeight && props.initialVariantWeight < 0) {
      errors.push('Cannot have negative variant weight');
    }

    // check environment compatibility with model
    const model = props.model;
    if (!sameEnv(model.env.account, this.env.account)) {
      errors.push(`Cannot use model in account ${model.env.account} for endpoint configuration in account ${this.env.account}`);
    } else if (!sameEnv(model.env.region, this.env.region)) {
      errors.push(`Cannot use model in region ${model.env.region} for endpoint configuration in region ${this.env.region}`);
    }

    if (errors.length > 0) {
      throw new Error(`Invalid Production Variant Props: ${errors.join(EOL)}`);
    }
  }

  private validateServerlessProductionVariantProps(props: ServerlessProductionVariantProps): void {
    const errors: string[] = [];

    // check variant weight is not negative
    if (props.initialVariantWeight && props.initialVariantWeight < 0) {
      errors.push('Cannot have negative variant weight');
    }

    // check maxConcurrency range
    if (props.maxConcurrency < 1 || props.maxConcurrency > 200) {
      errors.push('maxConcurrency must be between 1 and 200');
    }

    // check memorySizeInMB valid values (1GB increments from 1024 to 6144)
    const validMemorySizes = [1024, 2048, 3072, 4096, 5120, 6144];
    if (!validMemorySizes.includes(props.memorySizeInMB)) {
      errors.push(`memorySizeInMB must be one of: ${validMemorySizes.join(', ')} MB`);
    }

    // check provisionedConcurrency range and relationship to maxConcurrency
    if (props.provisionedConcurrency !== undefined) {
      if (props.provisionedConcurrency < 1 || props.provisionedConcurrency > 200) {
        errors.push('provisionedConcurrency must be between 1 and 200');
      }
      if (props.provisionedConcurrency > props.maxConcurrency) {
        errors.push('provisionedConcurrency cannot be greater than maxConcurrency');
      }
    }

    // check environment compatibility with model
    const model = props.model;
    if (!sameEnv(model.env.account, this.env.account)) {
      errors.push(`Cannot use model in account ${model.env.account} for endpoint configuration in account ${this.env.account}`);
    } else if (!sameEnv(model.env.region, this.env.region)) {
      errors.push(`Cannot use model in region ${model.env.region} for endpoint configuration in region ${this.env.region}`);
    }

    if (errors.length > 0) {
      throw new Error(`Invalid Serverless Production Variant Props: ${errors.join(EOL)}`);
    }
  }

  /**
   * Render the list of production variants (instance or serverless).
   */
  private renderProductionVariants(): CfnEndpointConfig.ProductionVariantProperty[] {
    this.validateProductionVariants();

    if (this.serverlessProductionVariant) {
      return this.renderServerlessProductionVariant();
    } else {
      return this.renderInstanceProductionVariants();
    }
  }

  /**
   * Render the list of instance production variants.
   */
  private renderInstanceProductionVariants(): CfnEndpointConfig.ProductionVariantProperty[] {
    if (this._instanceProductionVariants.length === 0) {
      throw new Error('renderInstanceProductionVariants called but no instance variants are configured');
    }

    return this._instanceProductionVariants.map( v => ({
      acceleratorType: v.acceleratorType?.toString(),
      initialInstanceCount: v.initialInstanceCount,
      initialVariantWeight: v.initialVariantWeight,
      instanceType: v.instanceType.toString(),
      modelName: v.modelName,
      variantName: v.variantName,
    }) );
  }

  /**
   * Render the serverless production variant.
   */
  private renderServerlessProductionVariant(): CfnEndpointConfig.ProductionVariantProperty[] {
    if (!this.serverlessProductionVariant) {
      throw new Error('renderServerlessProductionVariant called but no serverless variant is configured');
    }

    const variant = this.serverlessProductionVariant;
    return [{
      initialVariantWeight: variant.initialVariantWeight,
      modelName: variant.modelName,
      variantName: variant.variantName,
      serverlessConfig: {
        maxConcurrency: variant.maxConcurrency,
        memorySizeInMb: variant.memorySizeInMB,
        provisionedConcurrency: variant.provisionedConcurrency,
      },
    }];
  }
}
