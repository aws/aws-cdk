import { EOL } from 'os';
import * as kms from '@aws-cdk/aws-kms';
import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
import { AcceleratorType } from './accelerator-type';
import { InstanceType } from './instance-type';
import { IModel } from './model';
import { sameEnv } from './private/util';
import { CfnEndpointConfig } from './sagemaker.generated';

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
  readonly encryptionKey?: kms.IKey;

  /**
   * A list of instance production variants. You can always add more variants later by calling
   * `EndpointConfig#addInstanceProductionVariant`.
   *
   * @default - none
   */
  readonly instanceProductionVariants?: InstanceProductionVariantProps[];
}

/**
 * Defines a SageMaker EndpointConfig.
 */
export class EndpointConfig extends cdk.Resource implements IEndpointConfig {
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

  private readonly instanceProductionVariantsByName: { [key: string]: InstanceProductionVariant; } = {};

  constructor(scope: Construct, id: string, props: EndpointConfigProps = {}) {
    super(scope, id, {
      physicalName: props.endpointConfigName,
    });

    (props.instanceProductionVariants || []).map(p => this.addInstanceProductionVariant(p));

    // create the endpoint configuration resource
    const endpointConfig = new CfnEndpointConfig(this, 'EndpointConfig', {
      kmsKeyId: (props.encryptionKey) ? props.encryptionKey.keyArn : undefined,
      endpointConfigName: this.physicalName,
      productionVariants: cdk.Lazy.any({ produce: () => this.renderInstanceProductionVariants() }),
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
  public addInstanceProductionVariant(props: InstanceProductionVariantProps): void {
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
    // validate number of production variants
    if (this._instanceProductionVariants.length < 1) {
      throw new Error('Must configure at least 1 production variant');
    } else if (this._instanceProductionVariants.length > 10) {
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

  /**
   * Render the list of instance production variants.
   */
  private renderInstanceProductionVariants(): CfnEndpointConfig.ProductionVariantProperty[] {
    this.validateProductionVariants();
    return this._instanceProductionVariants.map( v => ({
      acceleratorType: v.acceleratorType?.toString(),
      initialInstanceCount: v.initialInstanceCount,
      initialVariantWeight: v.initialVariantWeight,
      instanceType: v.instanceType.toString(),
      modelName: v.modelName,
      variantName: v.variantName,
    }) );
  }

}
