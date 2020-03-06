import * as ec2 from '@aws-cdk/aws-ec2';
import * as iam from '@aws-cdk/aws-iam';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import { Lazy, Stack } from '@aws-cdk/core';
import { getResourceArn } from './resource-arn-suffix';
import { ModelContainer, VpcConfig } from './sagemaker-task-base-types';

/**
 *  @experimental
 */
export interface SagemakerCreateModelTaskProps {

    /**
     * Specifies the containers in the inference pipeline.
     */
    readonly Containers?: ModelContainer[];

    /**
     * Isolates the model container. No inbound or outbound network calls can be made to or from the model container.
     */
    readonly EnableNetworkIsolation?: boolean;

    /**
     * The Amazon Resource Name (ARN) of the IAM role that Amazon SageMaker can assume to access model artifacts and
     * docker image for deployment on ML compute instances or for batch transform jobs.
     */
    readonly ExecutionRoleArn?: string;

    /**
     * The name of the new model.
     */
    readonly ModelName: string;

    /**
     * The location of the primary docker image containing inference code, associated artifacts, and
     * custom environment map that the inference code uses when the model is deployed for predictions.
     */
    readonly PrimaryContainer?: ModelContainer;

    /**
     * Tags to be applied to the model.
     */
    readonly tags?: {[key: string]: string};

    /**
     * A VpcConfig object that specifies the VPC that you want your model to connect to.
     */
    readonly vpcConfig?: VpcConfig;

    /**
     * An execution role that you can pass in a CreateModel API request
     *
     * See https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-roles.html#sagemaker-roles-createmodel-perms
     *
     * @default - a role with appropriate permissions will be created.
     */
    readonly role?: iam.IRole;

    /**
     * The service integration pattern indicates different ways to call SageMaker APIs.
     *
     * The valid value is FIRE_AND_FORGE.
     *
     * @default FIRE_AND_FORGET
     */
    readonly integrationPattern?: sfn.ServiceIntegrationPattern;

}

/**
 * Class representing the SageMaker Create Training Job task.
 *
 * @experimental
 */
export class SagemakerCreateModelTask implements iam.IGrantable, ec2.IConnectable, sfn.IStepFunctionsTask {

    /**
     * Allows specify security group connections for instances of this fleet.
     */
    public readonly connections: ec2.Connections = new ec2.Connections();

    private readonly vpc?: ec2.IVpc;
    private securityGroup?: ec2.ISecurityGroup;
    private readonly securityGroups: ec2.ISecurityGroup[] = [];
    private readonly subnets?: string[];
    private readonly integrationPattern: sfn.ServiceIntegrationPattern;
    private _role?: iam.IRole;
    private _grantPrincipal?: iam.IPrincipal;

    constructor(private readonly props: SagemakerCreateModelTaskProps) {
        this.integrationPattern = props.integrationPattern || sfn.ServiceIntegrationPattern.FIRE_AND_FORGET;

        const supportedPatterns = [
            sfn.ServiceIntegrationPattern.FIRE_AND_FORGET
        ];

        if (!supportedPatterns.includes(this.integrationPattern)) {
            throw new Error(`Invalid Service Integration Pattern: ${this.integrationPattern} is not supported to call SageMaker.`);
        }

        // add the security groups to the connections object
        if (props.vpcConfig) {
            this.vpc = props.vpcConfig.vpc;
            this.subnets = (props.vpcConfig.subnets) ?
                (this.vpc.selectSubnets(props.vpcConfig.subnets).subnetIds) : this.vpc.selectSubnets().subnetIds;
        }
    }

    /**
     * The execution role for the Sagemaker Create Model API.
     *
     * Only available after task has been added to a state machine.
     */
    public get role(): iam.IRole {
        if (this._role === undefined) {
            throw new Error(`role not available yet--use the object in a Task first`);
        }
        return this._role;
    }

    public get grantPrincipal(): iam.IPrincipal {
        if (this._grantPrincipal === undefined) {
            throw new Error(`Principal not available yet--use the object in a Task first`);
        }
        return this._grantPrincipal;
    }

    /**
     * Add the security group to all instances via the launch configuration
     * security groups array.
     *
     * @param securityGroup: The security group to add
     */
    public addSecurityGroup(securityGroup: ec2.ISecurityGroup): void {
        this.securityGroups.push(securityGroup);
    }

    public bind(task: sfn.Task): sfn.StepFunctionsTaskConfig  {
        // set the sagemaker role or create new one
        this._grantPrincipal = this._role = this.props.role || new iam.Role(task, 'SagemakerRole', {
            assumedBy: new iam.ServicePrincipal('sagemaker.amazonaws.com'),
            inlinePolicies: {
                CreateModel: new iam.PolicyDocument({
                    statements: [
                        new iam.PolicyStatement({
                            actions: [
                                "cloudwatch:PutMetricData",
                                "logs:CreateLogStream",
                                "logs:PutLogEvents",
                                "logs:CreateLogGroup",
                                "logs:DescribeLogStreams",
                                "s3:GetObject",
                                "ecr:GetAuthorizationToken",
                                "ecr:BatchCheckLayerAvailability",
                                "ecr:GetDownloadUrlForLayer",
                                "ecr:BatchGetImage",
                                                ...this.props.vpcConfig
                                    ? [
                                        'ec2:CreateNetworkInterface',
                                        'ec2:CreateNetworkInterfacePermission',
                                        'ec2:DeleteNetworkInterface',
                                        'ec2:DeleteNetworkInterfacePermission',
                                        'ec2:DescribeNetworkInterfaces',
                                        'ec2:DescribeVpcs',
                                        'ec2:DescribeDhcpOptions',
                                        'ec2:DescribeSubnets',
                                        'ec2:DescribeSecurityGroups',
                                    ]
                                    : [],
                            ],
                            resources: ['*'], // Those permissions cannot be resource-scoped
                        })
                    ]
                }),
            }
        });

        // create a security group if not defined
        if (this.vpc && this.securityGroup === undefined) {
            this.securityGroup = new ec2.SecurityGroup(task, 'TrainJobSecurityGroup', {
                vpc: this.vpc
            });
            this.connections.addSecurityGroup(this.securityGroup);
            this.securityGroups.push(this.securityGroup);
        }

        return {
          resourceArn: getResourceArn("sagemaker", "createModel", this.integrationPattern),
          parameters: this.renderParameters(),
          policyStatements: this.makePolicyStatements(task),
        };
    }

    private renderParameters(): {[key: string]: any} {
        return {
            EnableNetworkIsolation: this.props.EnableNetworkIsolation,
            ExecutionRoleArn: (this.props.ExecutionRoleArn) ? this.props.ExecutionRoleArn : this.role.roleArn,
            ModelName: this.props.ModelName,
            ...(this.renderContainers(this.props.Containers)),
            ...(this.renderPrimaryContainer(this.props.PrimaryContainer)),
            ...(this.renderTags(this.props.tags)),
            ...(this.renderVpcConfig(this.props.vpcConfig))
        };
    }

    private renderContainers(config: ModelContainer[] | undefined): {[key: string]: any} {
        return (config) ? { Containers: config.map(container => (this.renderContainer(container)))} : {};
    }

    private renderPrimaryContainer(config: ModelContainer | undefined): {[key: string]: any} {
        return (config) ? {PrimaryContainer: this.renderContainer(config)} : {};
    }

    private renderContainer(container: ModelContainer): {[key: string]: any} {
        return (container) ? {
            ...(container.containerHostname) ? { ContainerHostname: container.containerHostname } : {},
            ...(container.image) ? { Image: container.image.bind(this).imageUri } : {},
            ...(container.mode) ? { Mode: container.mode } : {},
            ...(container.modelDataUrl) ? { ModelDataUrl: container.modelDataUrl } : {},
            ...(container.modelPackageName) ? { ModelPackageName: container.modelPackageName } : {},
        } : {};
    }

    private renderTags(tags: {[key: string]: any} | undefined): {[key: string]: any} {
        return (tags) ? { Tags: Object.keys(tags).map(key => ({ Key: key, Value: tags[key] })) } : {};
    }

    private renderVpcConfig(config: VpcConfig | undefined): {[key: string]: any} {
        return (config) ? { VpcConfig: {
            SecurityGroupIds: Lazy.listValue({ produce: () => (this.securityGroups.map(sg => (sg.securityGroupId))) }),
            Subnets: this.subnets,
        }} : {};
    }

    private makePolicyStatements(task: sfn.Task): iam.PolicyStatement[] {
        Stack.of(task);

        // https://docs.aws.amazon.com/step-functions/latest/dg/sagemaker-iam.html
        const policyStatements = [
            new iam.PolicyStatement({
                actions: ['sagemaker:CreateModel'],
                resources: ['*'],
            }),
            new iam.PolicyStatement({
                actions: ['sagemaker:ListTags'],
                resources: ['*']
            }),
            new iam.PolicyStatement({
                actions: ['iam:PassRole'],
                resources: [this._role!.roleArn],
                conditions: {
                    StringEquals: { "iam:PassedToService": "sagemaker.amazonaws.com" }
                }
            })
        ];

        return policyStatements;
    }
}
