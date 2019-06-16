import ec2 = require('@aws-cdk/aws-ec2');
import iam = require('@aws-cdk/aws-iam');
import { Construct, Context, IResource, Lazy, Resource, Stack, Tag, Token } from '@aws-cdk/cdk';
import { CfnModel } from './sagemaker.generated';

/**
 * Name tag constant
 */
const NAME_TAG: string = 'Name';

/**
 * Interface that defines a Model resource.
 */
export interface IModel extends IResource {
    /**
     * Returns the ARN of this model.
     *
     * @attribute
     */
    readonly modelArn: string;

    /**
     * Returns the name of this model.
     *
     * @attribute
     */
    readonly modelName: string;
}

/**
 * Construction properties for a generic container image.
 */
export interface GenericContainerProps {

    /**
     * A map of region to ECS Container Registry URI.
     */
    readonly amiMap: {[region: string]: string};

    /**
     * A map of enviornment variables to pass into the container.
     *
     * @default none
     */
    readonly environment?: {[key: string]: string};

    /**
     * Hostname of the container.
     *
     * @default none
     */
    readonly containerHostname?: string;

    /**
     * S3 path to the model artefacts.
     *
     * @default none
     */
    readonly modelDataUrl?: string;
}

/**
 * Interface that defines a container definition.
 */
export interface IContainerDefinition {
    /**
     * Return the container image to use in the given context
     */
    getImage(scope: Construct): string;

    /**
     * Return the container envionment map.
     * @param scope the Construct scope.
     */
    getEnvironment(scope?: Construct): {[key: string]: string} | undefined;

    /**
     * Return the URL of the model artefacts
     * @param scope the Construct scope.
     */
    getModelDataUrl(scope?: Construct): string | undefined;

    /**
     * Return the container hostname.
     * @param scope the Construct scope.
     */
    getContainerHostname(scope?: Construct): string | undefined;

}

/**
 * Construct an ECR Container Image URI from a map of region names to ECR container URIs.
 *
 */
export class GenericContainerDefinition implements IContainerDefinition  {

    private readonly amiMap: {[region: string]: string} = {};

    constructor(private readonly props?: GenericContainerProps) {
        if (props) { this.amiMap = props.amiMap; }
    }

    public getImage(scope: Construct): string {
        let region = Stack.of(scope).region;
        if (Token.isUnresolved(region)) {
            region = Context.getDefaultRegion(scope);
        }

        const uri = region !== 'test-region' ? this.amiMap[region] : '123456789012.dkr.ecr.us-west-2.amazonaws.com/mymodel:latest';
        if (!uri) {
            throw new Error(`Unable to find ECR Container Image URI in map: no URI specified for region '${region}'`);
        }
        return uri;
    }

    public getEnvironment(_scope: Construct): {[key: string]: string} | undefined {
        if (!(this.props)) { return undefined; }
        return this.props.environment;
    }

    public getModelDataUrl(_scope: Construct): string | undefined {
        if (!(this.props)) { return undefined; }
        return this.props.modelDataUrl;
    }

    public getContainerHostname(_scope: Construct): string | undefined {
        if (!(this.props)) { return undefined; }
        return this.props.containerHostname;
    }
  }

/**
 * Construction properties for a SageMaker Model.
 */
export interface ModelProps {

    /**
     * The IAM role that the Amazon SageMaker service assumes.
     *
     * @default a new IAM role will be created.
     */
    readonly role?: iam.IRole;

    /**
     * Name of the SageMaker Model.
     *
     * @default none
     */
    readonly modelName?: string;

    /**
     * The VPC to deploy the endpoint to.
     *
     * @default none
     */
    readonly vpc?: ec2.IVpc;

    /**
     * The VPC subnets to deploy the endpoints.
     *
     * @default none
     */
    readonly vpcSubnets?: ec2.SubnetSelection;

    /**
     * Primary container definition
     *
     * @default none
     */
    readonly primaryContainer?: IContainerDefinition;
}

/**
 * Defines a SageMaker Model.
 */
export class Model extends Resource implements IModel, ec2.IConnectable {

    /**
     * Creates a SageMaker model from a name.
     * @param scope the Construct scope.
     * @param id the resource id.
     * @param modelName the name of the model.
     */
    public static fromModelName(scope: Construct, id: string, modelName: string): IModel {
        class Import extends Resource implements IModel {
          public modelName = modelName;
          public modelArn = Stack.of(this).formatArn({
            service: 'sagemaker',
            resource: 'model',
            resourceName: this.modelName
          });
        }

        return new Import(scope, id);
      }

    /**
     * Returns the ARN of this model.
     * @attribute
     */
    public readonly modelArn: string;

    /**
     * Returns the name of the model.
     * @attribute
     */
    public readonly modelName: string;

    /**
     * Allows specify security group connections for instances of this fleet.
     */
    public readonly connections: ec2.Connections;

    private readonly vpc: ec2.IVpc;
    private readonly role: iam.IRole;
    private readonly securityGroup: ec2.ISecurityGroup;
    private readonly securityGroups: ec2.ISecurityGroup[] = [];
    private readonly subnets: ec2.SelectedSubnets;
    private readonly primaryContainer: IContainerDefinition;
    private readonly containers: IContainerDefinition[] = [];

    constructor(scope: Construct, id: string, props: ModelProps = {}) {
        super(scope, id);

        // set the model if if defined
        if (props.modelName) { this.modelName = props.modelName; }
        if (props.primaryContainer) { this.primaryContainer = props.primaryContainer; }

        // configure networking
        if (props.vpc) {
            this.vpc = props.vpc;
            // create a security group
            this.securityGroup = new ec2.SecurityGroup(this, 'ModelSecurityGroup', {
                vpc: props.vpc
            });
            this.connections = new ec2.Connections({ securityGroups: [this.securityGroup] });
            this.securityGroups.push(this.securityGroup);
            this.subnets = props.vpc.selectSubnets(props.vpcSubnets);
        }

        // set the sagemaker role or create new one
        this.role = props.role || new iam.Role(this, 'SagemakerRole', {
            assumedBy: new iam.ServicePrincipal('sagemaker.amazonaws.com'),
            managedPolicyArns: [
                new iam.AwsManagedPolicy('AmazonSageMakerFullAccess', scope).policyArn
            ]
        });

        this.node.applyAspect(new Tag(NAME_TAG, this.node.path));

        const model = new CfnModel(this, 'Model', {
            executionRoleArn: this.role.roleArn,
            modelName: this.modelName,
            primaryContainer: Lazy.anyValue({ produce: () => (this.containers.length === 0) ?
                this.renderPrimaryContainer(scope, this.primaryContainer) : undefined }),
            vpcConfig: Lazy.anyValue({ produce: () => this.renderVpcConfig() }),
            containers: Lazy.anyValue({ produce: () => this.renderContainerList(scope, this.containers) })
        });
        this.modelName = model.modelName;
        this.modelArn = model.modelArn;
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

    /**
     * Add the container definition to the model.
     *
     * @param container: The container to add
     */
    public addContainer(container: IContainerDefinition): void {
        this.containers.push(container);
    }

    protected validate(): string[] {
        const result = super.validate();
        if (!(this.primaryContainer) && (this.containers.length === 0)) {
            result.push("Must define either Primary Container or list of inference containers");
        }
        return result;
    }

    private renderPrimaryContainer(scope: Construct, container?: IContainerDefinition): CfnModel.ContainerDefinitionProperty | undefined {
        if (!container) { return undefined; }
        return {
            image: container.getImage(scope),
            containerHostname: container.getContainerHostname(),
            environment: container.getEnvironment(),
            modelDataUrl: container.getModelDataUrl(),
        };
    }

    private renderVpcConfig(): CfnModel.VpcConfigProperty | undefined {
        if (!this.vpc) { return undefined; }
        return {
            subnets: this.subnets.subnetIds,
            securityGroupIds: this.securityGroups.map(sg => sg.securityGroupId),
        };
    }

    private renderContainerList(scope: Construct, containers?: IContainerDefinition[]): CfnModel.ContainerDefinitionProperty[] | undefined {
       if (!(containers) || containers.length === 0) { return undefined; }
       return containers.map(c => (
           {
            image: c.getImage(scope),
            containerHostname: c.getContainerHostname(),
            environment: c.getEnvironment(),
            modelDataUrl: c.getModelDataUrl(),
        }));
    }
}
