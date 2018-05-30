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

    /**
     * Properties to pass to the Lambda
     */
    properties?: Properties;
}

/**
 * Custom resource that is implemented using a Lambda
 *
 * As a custom resource author, you should be publishing a subclass of this class
 * that hides the choice of provider, and accepts a strongly-typed properties
 * object with the properties your provider accepts.
 */
export class CustomResource extends cloudformation.CustomResource {
    // Needs to be implemented using inheritance because we must override the `renderProperties`
    // The generated props classes will never render properties that they don't know about.

    private readonly userProperties?: Properties;

    constructor(parent: Construct, name: string, props: CustomResourceProps) {
        const stack = Stack.find(parent);
        super(parent, name, {
            serviceToken: props.provider.providerArn(stack),
        });

        this.userProperties = props.properties;
    }

    /**
     * Override renderProperties to mix in the user-defined properties
     */
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
