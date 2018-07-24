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
export class SingletonLambda extends lambda.LambdaRef {
    public functionName: lambda.FunctionName;
    public functionArn: lambda.FunctionArn;
    public role?: iam.Role | undefined;
    protected canCreatePermissions: boolean;
    private lambdaFunction: lambda.LambdaRef;

    constructor(parent: cdk.Construct, name: string, props: SingletonLambdaProps) {
        super(parent, name);

        this.lambdaFunction = this.ensureLambda(props.uuid, props);

        this.functionArn = this.lambdaFunction.functionArn;
        this.functionName = this.lambdaFunction.functionName;
        this.role = this.lambdaFunction.role;

        this.canCreatePermissions = true; // Doesn't matter, addPermission is overriden anyway
    }

    public addPermission(name: string, permission: lambda.LambdaPermission) {
        return this.lambdaFunction.addPermission(name, permission);
    }

    private ensureLambda(uuid: string, props: lambda.LambdaProps): lambda.LambdaRef {
        const constructName = 'SingletonLambda' + slugify(uuid);
        const stack = cdk.Stack.find(this);
        const existing = stack.tryFindChild(constructName);
        if (existing) {
            // Just assume this is true
            return existing as lambda.LambdaRef;
        }

        return new lambda.Lambda(stack, constructName, props);
    }
}

function slugify(x: string): string {
    return x.replace(/[^a-zA-Z0-9]/g, '');
}
