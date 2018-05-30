import { Stack, Token } from "aws-cdk";
import { Lambda, LambdaProps } from 'aws-cdk-lambda';

/**
 * Base class for Custom Resource providers, that details how the custom resource is created
 */
export abstract class CustomResourceImplementation {
    /**
     * Return the provider ID for the provider in the given stack
     *
     * Returns either a Lambda ARN or an SNS topic ARN.
     */
    public abstract providerArn(stack: Stack): Token;
}

/**
 * Properties to pass to a Lambda-backed custom resource provider
 */
export interface LambdaBackedCustomResourceProps {
    /**
     * A unique identifier to identify this lambda
     *
     * The identifier should be unique across all custom resource providers.
     * We recommend generating a UUID per provider.
     */
    uuid: string;

    /**
     * Properties to instantiate the Lambda
     */
    lambdaProperties: LambdaProps;
}

/**
 * Custom Resource implementation that is backed by a Lambda function
 */
export class LambdaBackedCustomResource extends CustomResourceImplementation {
    constructor(private readonly props: LambdaBackedCustomResourceProps) {
        super();
    }

    public providerArn(stack: Stack): Token {
        const providerLambda = this.ensureLambda(stack);
        return providerLambda.functionArn;
    }

    /**
     * Add a fresh Lambda to the stack, or return the existing one if it already exists
     */
    private ensureLambda(stack: Stack): Lambda {
        const name = slugify(this.props.uuid);
        const existing = stack.tryFindChild(name);
        if (existing) {
            // Just assume this is true
            return existing as Lambda;
        }

        const newFunction = new Lambda(stack, name, this.props.lambdaProperties);
        return newFunction;
    }
}

function slugify(x: string): string {
    return x.replace(/[^a-zA-Z0-9]/g, '');
}
