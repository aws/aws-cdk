import iam = require('@aws-cdk/aws-iam');
import lambda = require('@aws-cdk/aws-lambda');
import cdk = require('@aws-cdk/cdk');
/**
 * Properties for a newly created singleton Lambda
 */
export interface SingletonLambdaProps extends lambda.LambdaProps {
    /**
     * A unique identifier to identify this lambda
     *
     * The identifier should be unique across all custom resource providers.
     * We recommend generating a UUID per provider.
     */
    uuid: string;
}
/**
 * A Lambda that will only ever be added to a stack once.
 *
 * The lambda is identified using the value of 'uuid'. Run 'uuidgen'
 * for every SingletonLambda you create.
 */
export declare class SingletonLambda extends lambda.LambdaRef {
    readonly functionName: lambda.FunctionName;
    readonly functionArn: lambda.FunctionArn;
    readonly role?: iam.Role | undefined;
    protected readonly canCreatePermissions: boolean;
    private lambdaFunction;
    constructor(parent: cdk.Construct, name: string, props: SingletonLambdaProps);
    addPermission(name: string, permission: lambda.LambdaPermission): void;
    private ensureLambda;
}
