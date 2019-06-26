import ec2 = require('@aws-cdk/aws-ec2');
import kms = require('@aws-cdk/aws-kms');
import { Construct, Lazy, Resource, Tag } from '@aws-cdk/core';
import { IModel } from './model';
import { CfnEndpoint, CfnEndpointConfig } from './sagemaker.generated';

/**
 * Name tag constant
 */
const NAME_TAG: string = 'Name';

/**
 * Construction properties for a SageMaker Endpoint.
 *
 * @experimental
 */
export interface EndpointProps {

    /**
     * Name of the endpoint.
     *
     * @default none
     */
    readonly endpointName?: string;

    /**
     * Name of the endpoint configuration.
     *
     * @default same as the endpoint name with 'Config' appended.
     */
    readonly configName?: string;

    /**
     * Optional KMS encryption key associated with this stream.
     *
     * @default none
     */
    readonly kmsKey?: kms.IKey;

    /**
     * List of production variants.
     *
     * @default none
     */
    readonly productionVariants?: ProductionVariant[];

}

/**
 * Construction properties for the Production Variant.
 *
 * @experimental
 */
export interface ProductionVariant {

    /**
     * Optional accelerateor type.
     *
     * @default none
     */
    readonly acceleratorType?: AcceleratorType;

    /**
     * Initial number of instances to be deployed.
     *
     * @default 1
     */
    readonly initialInstanceCount?: number;

    /**
     * Inital weight of the production variant.
     *
     * @default 100
     */
    readonly initialVariantWeight?: number;

    /**
     * Instance type of the production variant.
     *
     * @default ml.c4.xlarge instance type.
     */
    readonly instanceType?: ec2.InstanceType;

    /**
     * The model aligned to the production variant.
     *
     */
    readonly model: IModel;

    /**
     * Name of the production variant.
     *
     * @default same name as the model name
     */
    readonly variantName?: string;
}

export enum AcceleratorType {

    LARGE = 'ml.eia1.large ',

    MEDIUM = 'ml.eia1.medium',

    XLARGE = 'ml.eia1.xlarge',
}

/**
 * Defines a SageMaker Endpoint and associated configuration resource.
 *
 * @experimental
 */
export class Endpoint extends Resource {

    /**
     * The name of the endpoint.
     *
     * @attribute
     */
    public readonly endpointName: string;

    /**
     * Name of the endpoint configuration.
     *
     * @attribute
     */
    public readonly endpointConfigName: string;

    private readonly productionVariants: ProductionVariant[] = [];

    constructor(scope: Construct, id: string, props: EndpointProps= {}) {
        super(scope, id);

        // check that the production variants are defined
        if (props.productionVariants && props.productionVariants.length > 0) {
            this.productionVariants = props.productionVariants;
        }

        // apply a name tag to the endpoint resource
        this.node.applyAspect(new Tag(NAME_TAG, this.node.path));

        // create the endpoint configuration resource
        const endpointConfig = new CfnEndpointConfig(this, 'EndpointConfig', {
            kmsKeyId: (props.kmsKey) ? props.kmsKey.keyArn : undefined,
            endpointConfigName: (props.configName) ? props.configName : (props.endpointName) ? props.endpointName + "Config" : undefined,
            productionVariants: Lazy.anyValue({ produce: () => this.renderProductionVariants(this.productionVariants) })
        });
        this.endpointConfigName = endpointConfig.attrEndpointConfigName;

        // create the endpoint resource
        const endpoint = new CfnEndpoint(this, 'Endpoint', {
            endpointConfigName: this.endpointConfigName,
            endpointName: (props.endpointName) ? props.endpointName : undefined,
        });
        this.endpointName = endpoint.attrEndpointName;
    }

    /**
     * Add production variant to the endpoint configution.
     *
     * @param productionVariant: The production variant to add.
     */
    public addProductionVariant(productionVariant: ProductionVariant): void {
        this.productionVariants.push(productionVariant);
    }

    protected validate(): string[] {
        const result = super.validate();
        // check we have at least one production variant
        if (this.productionVariants.length === 0) {
            result.push("Must have at least one Production Variant");
        }

        // check instance count is greater than zero
        this.productionVariants.forEach(v => {
            if (v.initialInstanceCount && v.initialInstanceCount < 1) {
                result.push("Must have at least one instance");
            }
        });

        // check variant weight is not negative
        this.productionVariants.forEach(v => {
            if (v.initialVariantWeight && v.initialVariantWeight < 0) {
                result.push("Cannot have negative variant weight");
            }
        });

        // validate the instance type
        this.productionVariants.forEach(v => {
            if (v.instanceType) {
                this.validateInstanceType(v.instanceType.toString(), result);
            }
        });
        return result;
    }

    /**
     * Render the list of production variants. Set default values if not defined.
     * @param productionVariants the variants to render
     */
    private renderProductionVariants(productionVariants: ProductionVariant[]): CfnEndpointConfig.ProductionVariantProperty[] {
        return productionVariants.map(v => (
            {
                // get the initial instance count. Set to 1 if not defined
                initialInstanceCount: (v.initialInstanceCount) ? v.initialInstanceCount : 1,
                // get the initial variant weight. Set to 100 if not defined
                initialVariantWeight: (v.initialVariantWeight) ? v.initialVariantWeight : 100,
                // get the instance type. Set to 'ml.c4.xlarge' if not defined
                instanceType: 'ml.' + ((v.instanceType) ? (v.instanceType.toString()) :
                    ec2.InstanceType.of(ec2.InstanceClass.C4, ec2.InstanceSize.XLARGE)),
                modelName: v.model.modelName,
                // get the variant name. Set to the model name if not defined
                variantName: (v.variantName) ? v.variantName : v.model.modelName,
            }
        ));
    }

    /**
     * Validates the provided instance type.
     * @param instanceType the instance type of the SageMaker endpoint production variant.
     */
    private validateInstanceType(instanceType: string, result: string[]) {
        // check if a valid sagemaker instance type
        if (!['c4', 'c5', 'm4', 'm5', 'p2', 'p3', 't2'].some(instanceClass => instanceType.indexOf(instanceClass) >= 0)) {
            result.push(`Invalid instance type for a Sagemaker Endpoint Production Variant: ${instanceType}`);
        }
    }

}