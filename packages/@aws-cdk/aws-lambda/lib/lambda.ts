import ec2 = require('@aws-cdk/aws-ec2');
import iam = require('@aws-cdk/aws-iam');
import cdk = require('@aws-cdk/cdk');
import { Code } from './code';
import { FunctionName, FunctionRef } from './lambda-ref';
import { FunctionVersion } from './lambda-version';
import { cloudformation, FunctionArn } from './lambda.generated';
import { Runtime } from './runtime';

export interface FunctionProps {
    /**
     * The source code of your Lambda function. You can point to a file in an
     * Amazon Simple Storage Service (Amazon S3) bucket or specify your source
     * code as inline text.
     */
    code: Code;

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
    runtime: Runtime;

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
     * Initial policy statements to add to the created Lambda Role.
     *
     * You can call `addToRolePolicy` to the created lambda to add statements post creation.
     */
    initialPolicy?: cdk.PolicyStatement[];

    /**
     * Lambda execution role.
     *
     * This is the role that will be assumed by the function upon execution.
     * It controls the permissions that the function will have. The Role must
     * be assumable by the 'lambda.amazonaws.com' service principal.
     *
     * @default a unique role will be generated for this lambda function.
     * Both supplied and generated roles can always be changed by calling `addToRolePolicy`.
     */
    role?: iam.Role;

    /**
     * VPC network to place Lambda network interfaces
     *
     * Specify this if the Lambda function needs to access resources in a VPC.
     */
    vpc?: ec2.VpcNetworkRef;

    /**
     * Where to place the network interfaces within the VPC.
     *
     * Only used if 'vpc' is supplied.
     *
     * @default Private subnets
     */
    vpcPlacement?: ec2.VpcPlacementStrategy;

    /**
     * What security group to associate with the Lambda's network interfaces.
     *
     * Only used if 'vpc' is supplied.
     *
     * @default A unique security group is created for this Lambda function.
     */
    securityGroup?: ec2.SecurityGroupRef;
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
export class Function extends FunctionRef implements ec2.IConnectable {
    /**
     * Name of this function
     */
    public readonly functionName: FunctionName;

    /**
     * ARN of this function
     */
    public readonly functionArn: FunctionArn;

    /**
     * Execution role associated with this function
     */
    public readonly role?: iam.Role;

    /**
     * The runtime configured for this lambda.
     */
    public readonly runtime: Runtime;

    /**
     * The name of the handler configured for this lambda.
     */
    public readonly handler: string;

    /**
     * The security group associated with this function
     *
     * (Only set if associated with a VPC).
     */
    public securityGroup?: ec2.SecurityGroupRef;

    protected readonly canCreatePermissions = true;

    /**
     * Environment variables for this function
     */
    private readonly environment?: { [key: string]: any };

    private _connections?: ec2.Connections;

    constructor(parent: cdk.Construct, name: string, props: FunctionProps) {
        super(parent, name);

        this.environment = props.environment || { };

        const managedPolicyArns = new Array<cdk.Arn>();

        // the arn is in the form of - arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole
        managedPolicyArns.push(cdk.Arn.fromComponents({
            service: "iam",
            region: "", // no region for managed policy
            account: "aws", // the account for a managed policy is 'aws'
            resource: "policy",
            resourceName: "service-role/AWSLambdaBasicExecutionRole"
        }));

        if (props.vpc) {
            // Policy that will have ENI creation permissions
            managedPolicyArns.push(cdk.Arn.fromComponents({
                service: "iam",
                region: "", // no region for managed policy
                account: "aws", // the account for a managed policy is 'aws'
                resource: "policy",
                resourceName: "service-role/AWSLambdaVPCAccessExecutionRole"
            }));
        }

        this.role = props.role || new iam.Role(this, 'ServiceRole', {
            assumedBy: new cdk.ServicePrincipal('lambda.amazonaws.com'),
            managedPolicyArns,
        });

        for (const statement of (props.initialPolicy || [])) {
            this.role.addToPolicy(statement);
        }

        const resource = new cloudformation.FunctionResource(this, 'Resource', {
            functionName: props.functionName,
            description: props.description,
            code: new cdk.Token(() => props.code.toJSON()),
            handler: props.handler,
            timeout: props.timeout,
            runtime: props.runtime.name,
            role: this.role.roleArn,
            environment: new cdk.Token(() => this.renderEnvironment()),
            memorySize: props.memorySize,
            vpcConfig: this.addToVpc(props),
        });

        resource.addDependency(this.role);

        this.functionName = resource.ref;
        this.functionArn = resource.functionArn;
        this.handler = props.handler;
        this.runtime = props.runtime;

        // allow code to bind to stack.
        props.code.bind(this);
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
    public addVersion(name: string, codeSha256?: string, description?: string): FunctionVersion {
        return new FunctionVersion(this, 'Version' + name, {
            lambda: this,
            codeSha256,
            description,
        });
    }

    /**
     * Access the Connections object
     *
     * Will fail if not a VPC-enabled Lambda Function
     */
    public get connections(): ec2.Connections {
        if (!this._connections) {
            throw new Error('Only VPC-associated Lambda Functions can have their security groups managed.');
        }
        return this.connections;
    }

    private renderEnvironment() {
        if (!this.environment || Object.keys(this.environment).length === 0) {
            return undefined;
        }

        return {
            variables: this.environment
        };
    }

    /**
     * If configured, set up the VPC-related properties
     *
     * Returns the VpcConfig that should be added to the
     * Lambda creation properties.
     */
    private addToVpc(props: FunctionProps): cloudformation.FunctionResource.VpcConfigProperty | undefined {
        if (!props.vpc) { return undefined; }

        this.securityGroup = props.securityGroup;
        if (!this.securityGroup) {
            this.securityGroup = new ec2.SecurityGroup(this, 'SecurityGroup', {
                vpc: props.vpc,
                description: 'Automatic security group for Lambda Function ' + this.uniqueId,
            });
        }

        this._connections = new ec2.Connections({ securityGroup: this.securityGroup });

        return {
            subnetIds: props.vpc.subnets(props.vpcPlacement).map(s => s.subnetId),
            securityGroupIds: [this.securityGroup.securityGroupId]
        };
    }
}
