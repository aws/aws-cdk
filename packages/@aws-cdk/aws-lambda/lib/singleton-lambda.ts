import iam = require('@aws-cdk/aws-iam');
import cdk = require('@aws-cdk/cdk');
import { Lambda, LambdaProps } from './lambda';
import { FunctionName, LambdaRef } from './lambda-ref';
import { FunctionArn } from './lambda.generated';
import { LambdaPermission } from './permission';

/**
 * Properties for a newly created singleton Lambda
 */
export interface SingletonLambdaProps extends LambdaProps {
    /**
     * A unique identifier to identify this lambda
     *
     * The identifier should be unique across all custom resource providers.
     * We recommend generating a UUID per provider.
     */
    uuid: string;

    /**
     * A descriptive name for the purpose of this Lambda.
     *
     * If the Lambda does not have a physical name, this string will be
     * reflected its generated name. The combination of lambdaPurpose
     * and uuid must be unique.
     *
     * @default SingletonLambda
     */
    lambdaPurpose?: string;
}

/**
 * A Lambda that will only ever be added to a stack once.
 *
 * The lambda is identified using the value of 'uuid'. Run 'uuidgen'
 * for every SingletonLambda you create.
 */
export class SingletonLambda extends LambdaRef {
    public readonly functionName: FunctionName;
    public readonly functionArn: FunctionArn;
    public readonly role?: iam.Role | undefined;
    protected readonly canCreatePermissions: boolean;
    private lambdaFunction: LambdaRef;

    constructor(parent: cdk.Construct, name: string, props: SingletonLambdaProps) {
        super(parent, name);

        this.lambdaFunction = this.ensureLambda(props);

        this.functionArn = this.lambdaFunction.functionArn;
        this.functionName = this.lambdaFunction.functionName;
        this.role = this.lambdaFunction.role;

        this.canCreatePermissions = true; // Doesn't matter, addPermission is overriden anyway
    }

    public addPermission(name: string, permission: LambdaPermission) {
        return this.lambdaFunction.addPermission(name, permission);
    }

    private ensureLambda(props: SingletonLambdaProps): LambdaRef {
        const constructName = (props.lambdaPurpose || 'SingletonLambda') + slugify(props.uuid);
        const stack = cdk.Stack.find(this);
        const existing = stack.tryFindChild(constructName);
        if (existing) {
            // Just assume this is true
            return existing as LambdaRef;
        }

        return new Lambda(stack, constructName, props);
    }
}

function slugify(x: string): string {
    return x.replace(/[^a-zA-Z0-9]/g, '');
}
