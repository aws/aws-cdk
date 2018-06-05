import { Construct, Stack } from 'aws-cdk';
import { cloudformation } from 'aws-cdk-resources';
import { CustomResourceImplementation } from './provider';

/**
 * Collection of arbitrary properties
 */
export type Properties = {[key: string]: any};

/**
 * Properties to provide a Lambda-backed custom resource
 */
export interface CustomResourceProps {
    /**
     * The provider that is going to implement this custom resource
     */
    provider: CustomResourceImplementation;
}

/**
 * Custom resource that is implemented using a Lambda
 *
 * As a custom resource author, you should be publishing a subclass of this class
 * that hides the choice of provider, and accepts a strongly-typed properties
 * object with the properties your provider accepts.
 */
export class CustomResource extends Construct {
    // Needs to be implemented using inheritance because we must override the `renderProperties`
    // The generated props classes will never render properties that they don't know about.
    private readonly stack: Stack;
    private readonly provider: CustomResourceImplementation;

    constructor(parent: Construct, name: string, props: CustomResourceProps) {
        super(parent, name);
        this.stack = Stack.find(parent);
        this.provider = props.provider;
    }

    /**
     * Add a new instance of the custom resource to the stack
     */
    public resourceInstance(name: string, properties?: Properties) {
        return new CustomResourceInstance(this, name, {
            stack: this.stack,
            provider: this.provider,
            userProperties: properties}
        );
    }
}

export interface CustomResourceInstanceProps {
    stack: Stack,
    provider: CustomResourceImplementation,
    userProperties?: Properties,
}

export class CustomResourceInstance extends cloudformation.CustomResource {

    private readonly userProperties?: Properties;

    constructor(parent: CustomResource, name: string, properties: CustomResourceInstanceProps) {
        super(parent, name, {
            serviceToken: properties.provider.providerArn()
        });
        this.userProperties = properties.userProperties;
    }

    protected renderProperties(): {[key: string]: any}  {
        const props = super.renderProperties();
        return Object.assign(props, uppercaseProperties(this.userProperties || {}));
    }
}

/**
 * Uppercase the first letter of every property name
 *
 * It's customary for CloudFormation properties to start with capitals, and our
 * properties to start with lowercase, so this function translates from one
 * to the other
 */
function uppercaseProperties(props: Properties): Properties {
    const ret: Properties = {};
    Object.keys(props).forEach(key => {
        const upper = key.substr(0, 1).toUpperCase() + key.substr(1);
        ret[upper] = props[key];
    });
    return ret;
}
