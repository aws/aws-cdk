import { Construct, Stack } from "@aws-cdk/core";
import { Role } from "@aws-cdk/iam";
import { Function, FunctionName, FunctionPermission, FunctionProps, FunctionRef } from "@aws-cdk/lambda";
import { lambda } from "@aws-cdk/resources";

/**
 * Properties for a newly created singleton Lambda
 */
export interface SingletonLambdaProps extends FunctionProps {
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
export class SingletonLambda extends FunctionRef {
    public functionName: FunctionName;
    public functionArn: lambda.FunctionArn;
    public role?: Role | undefined;
    protected canCreatePermissions: boolean;
    private lambdaFunction: FunctionRef;

    constructor(parent: Construct, name: string, props: SingletonLambdaProps) {
        super(parent, name);

        this.lambdaFunction = this.ensureFunction(props.uuid, props);

        this.functionArn = this.lambdaFunction.functionArn;
        this.functionName = this.lambdaFunction.functionName;
        this.role = this.lambdaFunction.role;

        this.canCreatePermissions = true; // Doesn't matter, addPermission is overriden anyway
    }

    public addPermission(name: string, permission: FunctionPermission) {
        return this.lambdaFunction.addPermission(name, permission);
    }

    private ensureFunction(uuid: string, props: FunctionProps): FunctionRef {
        const constructName = 'SingletonLambda' + slugify(uuid);
        const stack = Stack.find(this);
        const existing = stack.tryFindChild(constructName);
        if (existing) {
            // Just assume this is true
            return existing as FunctionRef;
        }

        return new Function(stack, constructName, props);
    }
}

function slugify(x: string): string {
    return x.replace(/[^a-zA-Z0-9]/g, '');
}
