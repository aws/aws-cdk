import { EOL } from 'os';
import * as kms from '@aws-cdk/aws-kms';
import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
import { AcceleratorType } from './accelerator-type';
import { InstanceType } from './instance-type';
import { IModel } from './model';
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
   * @default - ml.t2.medium instance type.
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
 * Name tag constant
 */
const NAME_TAG: string = 'Name';

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
   * {@link EndpointConfig#addInstanceProductionVariant}.
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
   * @param endpointConfigName the name of the endpoint configuration.
   */
  public static fromEndpointConfigName(scope: Construct, id: string, endpointConfigName: string): IEndpointConfig {
    class Import extends cdk.Resource implements IEndpointConfig {
      public endpointConfigName = endpointConfigName;
      public endpointConfigArn = cdk.Stack.of(this).formatArn({
        service: 'sagemaker',
        resource: 'endpoint-config',
        resourceName: this.endpointConfigName,
      });
    }

    return new Import(scope, id);
  }

  /**
   * The ARN of the endpoint configuration.
   */
  public readonly endpointConfigArn: string;
  /**
   * The name of the endpoint configuration.
   */
  public readonly endpointConfigName: string;

  private readonly _instanceProductionVariants: { [key: string]: InstanceProductionVariant; } = {};

  constructor(scope: Construct, id: string, props: EndpointConfigProps = {}) {
    super(scope, id, {
      physicalName: props.endpointConfigName,
    });

    // apply a name tag to the endpoint config resource
    cdk.Tags.of(this).add(NAME_TAG, this.node.path);

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

    // post-construction validation
    this.node.addValidation({ validate: () => this.validateProductionVariants() });
  }

  /**
   * Add production variant to the endpoint configuration.
   *
   * @param props The properties of a production variant to add.
   */
  public addInstanceProductionVariant(props: InstanceProductionVariantProps): void {
    if (props.variantName in this._instanceProductionVariants) {
      throw new Error(`There is already a Production Variant with name '${props.variantName}'`);
    }
    this.validateProps(props);
    this._instanceProductionVariants[props.variantName] = {
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
   */
  public get instanceProductionVariants(): InstanceProductionVariant[] {
    return Object.values(this._instanceProductionVariants);
  }

  /**
   * Find instance production variant based on variant name
   * @param name Variant name from production variant
   */
  public findInstanceProductionVariant(name: string): InstanceProductionVariant {
    const ret = this._instanceProductionVariants[name];
    if (!ret) {
      throw new Error(`No variant with name: '${name}'`);
    }
    return ret;
  }

  private validateProductionVariants(): string[] {
    const result = Array<string>();

    // validate number of production variants
    if (this.instanceProductionVariants.length < 1) {
      result.push('Must configure at least 1 production variant');
    } else if (this.instanceProductionVariants.length > 10) {
      result.push('Can\'t have more than 10 production variants');
    }

    return result;
  }

  private validateProps(props: InstanceProductionVariantProps): void {
    const errors: string[] = [];
    // check instance count is greater than zero
    if (props.initialInstanceCount !== undefined && props.initialInstanceCount < 1) {
      errors.push('Must have at least one instance');
    }

    // check variant weight is not negative
    if (props.initialVariantWeight && props.initialVariantWeight < 0) {
      errors.push('Cannot have negative variant weight');
    }

    if (errors.length > 0) {
      throw new Error(`Invalid Production Variant Props: ${errors.join(EOL)}`);
    }
  }

  /**
   * Render the list of instance production variants.
   */
  private renderInstanceProductionVariants(): CfnEndpointConfig.ProductionVariantProperty[] {
    return this.instanceProductionVariants.map( v => ({
      acceleratorType: v.acceleratorType?.toString(),
      initialInstanceCount: v.initialInstanceCount,
      initialVariantWeight: v.initialVariantWeight,
      instanceType: v.instanceType.toString(),
      modelName: v.modelName,
      variantName: v.variantName,
    }) );
  }

}
