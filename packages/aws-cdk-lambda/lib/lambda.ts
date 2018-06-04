import { AwsPartition, Construct, FnConcat, PolicyStatement, ServicePrincipal, Token } from 'aws-cdk';
import { Role } from 'aws-cdk-iam';
import { lambda } from 'aws-cdk-resources';
import { LambdaCode } from './code';
import { FunctionName, LambdaRef } from './lambda-ref';
import { LambdaRuntime } from './runtime';
import { Version } from './version';

export interface LambdaProps {
    /**
     * The source code of your Lambda function. You can point to a file in an
     * Amazon Simple Storage Service (Amazon S3) bucket or specify your source
     * code as inline text.
     */
    code: LambdaCode;

    /**
     * A description of the function.
     */
    description?: string;

    /**
     * The name of the function (within your source code) that Lambda calls to
     * start running your code. For more information, see the Handler property
     * in the AWS Lambda Developer Guide.
     *
     * NOTE: If you specify your source code as inline text by specifying the
     * ZipFile property within the Code property, specify index.function_name as
     * the handler.
     */
    handler: string;

    /**
     * The function execution time (in seconds) after which Lambda terminates
     * the function. Because the execution time affects cost, set this value
     * based on the function's expected execution time.
     *
     * @default 3 seconds.
     */
    timeout?: number;

    /**
     * Key-value pairs that Lambda caches and makes available for your Lambda
     * functions. Use environment variables to apply configuration changes, such
     * as test and production environment configurations, without changing your
     * Lambda function source code.
     */
    environment?: { [key: string]: any };

    /**
     * The runtime environment for the Lambda function that you are uploading.
     * For valid values, see the Runtime property in the AWS Lambda Developer
     * Guide.
     */
    runtime: LambdaRuntime;

    /**
     * A name for the function. If you don't specify a name, AWS CloudFormation
     * generates a unique physical ID and uses that ID for the function's name.
     * For more information, see Name Type.
     */
    functionName?: string;

    /**
     * The amount of memory, in MB, that is allocated to your Lambda function.
     * Lambda uses this value to proportionally allocate the amount of CPU
     * power. For more information, see Resource Model in the AWS Lambda
     * Developer Guide.
     *
     * @default The default value is 128 MB
     */
    memorySize?: number;

    /**
     * Additional permissions to add to the created Lambda Role.
     * You can also call addToRolePolicy to the created lambda.
     */
    additionalPermissions?: PolicyStatement[];
}

/**
 * Deploys a file from from inside the construct library as a function.
 *
 * The supplied file is subject to the 4096 bytes limit of being embedded in a
 * CloudFormation template.
 *
 * The construct includes an associated role with the lambda.
 *
 * This construct does not yet reproduce all features from the underlying resource
 * library.
 */
export class Lambda extends LambdaRef {
    /**
     * Name of this function
     */
    public readonly functionName: FunctionName;

    /**
     * ARN of this function
     */
    public readonly functionArn: lambda.FunctionArn;

    /**
     * Execution role associated with this function
     */
    public readonly role?: Role;

    protected readonly canCreatePermissions = true;

    /**
     * Environment variables for this function
     */
    private readonly environment?: { [key: string]: any };

    constructor(parent: Construct, name: string, props: LambdaProps) {
        super(parent, name);

        this.environment = props.environment || { };

        this.role = new Role(this, 'ServiceRole', {
            assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
            managedPolicyArns: [ new FnConcat('arn:', new AwsPartition(), ':iam::aws:policy/service-role/AWSLambdaBasicExecutionRole')],
        });
        if (props.additionalPermissions && props.additionalPermissions.length > 0) {
            props.additionalPermissions.forEach(permission => this.role!.addToPolicy(permission));
        }

        const resource = new lambda.FunctionResource(this, 'Resource', {
            functionName: props.functionName,
            description: props.description,
            code: props.code.toJSON(props.runtime),
            handler: props.handler,
            timeout: props.timeout,
            runtime: props.runtime,
            role: this.role.roleArn,
            environment: new Token(() => this.renderEnvironment()),
            memorySize: props.memorySize,
        });

        resource.addDependency(this.role);

        this.functionName = resource.ref;
        this.functionArn = resource.functionArn;
    }

    /**
     * Adds an environment variable to this Lambda function.
     * If this is a ref to a Lambda function, this operation results in a no-op.
     * @param key The environment variable key.
     * @param value The environment variable's value.
     */
    public addEnvironment(key: string, value: any) {
        if (!this.environment) {
            // TODO: add metadata
            return;
        }
        this.environment[key] = value;
    }

    /**
     * Add a new version for this Lambda
     *
     * If you want to deploy through CloudFormation and use aliases, you need to
     * add a new version (with a new name) to your Lambda every time you want
     * to deploy an update. An alias can then refer to the newly created Version.
     *
     * All versions should have distinct names, and you should not delete versions
     * as long as your Alias needs to refer to them.
     *
     * @param name A unique name for this version
     * @param codeSha256 The SHA-256 hash of the most recently deployed Lambda source code, or
     *    omit to skip validation.
     * @param description A description for this version.
     * @returns A new Version object.
     */
    public addVersion(name: string, codeSha256?: string, description?: string): Version {
        return new Version(this, 'Version' + name, {
            lambda: this,
            codeSha256,
            description,
        });
    }

    private renderEnvironment() {
        if (!this.environment || Object.keys(this.environment).length === 0) {
            return undefined;
        }

        return {
            variables: this.environment
        };
    }
}
