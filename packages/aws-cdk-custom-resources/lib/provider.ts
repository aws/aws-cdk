import { Construct, PolicyStatement, Token } from "aws-cdk";
import { Lambda, LambdaProps } from 'aws-cdk-lambda';

/**
 * Base class for Custom Resource providers, that details how the custom resource is created
 */
export interface CustomResourceImplementation {
    /**
     * Return the provider ID for the provider in the given stack
     *
     * Returns either a Lambda ARN or an SNS topic ARN.
     */
    providerArn(): Token;
}

/**
 * Properties to pass to a Lambda-backed custom resource provider
 */
export interface LambdaBackedCustomResourceProps {

    /**
     * Properties to instantiate the Lambda
     */
    lambdaProperties: LambdaPropsWithPermissions;
}

export interface LambdaPropsWithPermissions extends LambdaProps {
    permissions?: PolicyStatement[];
}
/**
 * Custom Resource implementation that is backed by a Lambda function
 */
export class LambdaBackedCustomResource implements CustomResourceImplementation {

    private readonly lambda: Lambda;

    constructor(parent: Construct, name: string, private readonly props: LambdaBackedCustomResourceProps) {
        this.lambda = new Lambda(parent, name, this.props.lambdaProperties);
        if (this.props.lambdaProperties.permissions && this.props.lambdaProperties.permissions.length > 0) {
            this.props.lambdaProperties.permissions.forEach(permission => this.lambda.addToRolePolicy(permission));
        }
    }

    public providerArn(): Token {
        return this.lambda.functionArn;
    }
}
