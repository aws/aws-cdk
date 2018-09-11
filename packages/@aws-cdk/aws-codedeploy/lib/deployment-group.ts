import cdk = require("@aws-cdk/cdk");
import iam = require("../../aws-iam/lib/role");
import { ServerApplication, ServerApplicationRef } from "./application";
import { ApplicationName, cloudformation, DeploymentGroupName } from './codedeploy.generated';

export class DeploymentGroupArn extends cdk.Arn {}

/**
 * Properties of a reference to a CodeDeploy EC2/on-premise Deployment Group.
 *
 * @see ServerDeploymentGroupRef#import
 * @see ServerDeploymentGroupRef#export
 */
export interface ServerDeploymentGroupRefProps {
    /**
     * The reference to the CodeDeploy EC2/on-premise Application
     * that this Deployment Group belongs to.
     */
    application: ServerApplicationRef;

    /**
     * The physical, human-readable name of the CodeDeploy EC2/on-premise Deployment Group
     * that we are referencing.
     */
    deploymentGroupName: DeploymentGroupName;
}

/**
 * Represents a reference to a CodeDeploy EC2/on-premise Deployment Group.
 *
 * If you're managing the Deployment Group alongside the rest of your CDK resources,
 * use the {@link ServerDeploymentGroup} class.
 *
 * If you want to reference an already existing Deployment Group,
 * or one defined in a different CDK Stack,
 * use the {@link #import} method.
 */
export abstract class ServerDeploymentGroupRef extends cdk.Construct {
    /**
     * Import an EC2/on-premise Deployment Group defined either outside the CDK,
     * or in a different CDK Stack and exported using the {@link #export} method.
     *
     * @param parent the parent Construct for this new Construct
     * @param id the logical ID of this new Construct
     * @param props the properties of the referenced Deployment Group
     * @returns a Construct representing a reference to an existing Deployment Group
     */
    public static import(parent: cdk.Construct, id: string, props: ServerDeploymentGroupRefProps): ServerDeploymentGroupRef {
        return new ImportedServerDeploymentGroupRef(parent, id, props);
    }

    public abstract readonly application: ServerApplicationRef;
    public abstract readonly deploymentGroupName: DeploymentGroupName;
    public abstract readonly deploymentGroupArn: DeploymentGroupArn;

    public export(): ServerDeploymentGroupRefProps {
        return {
            application: this.application,
            deploymentGroupName: new DeploymentGroupName(new cdk.Output(this, 'DeploymentGroupName', {
                    value: this.deploymentGroupName
                }).makeImportValue()),
        };
    }
}

class ImportedServerDeploymentGroupRef extends ServerDeploymentGroupRef {
    public readonly application: ServerApplicationRef;
    public readonly deploymentGroupName: DeploymentGroupName;
    public readonly deploymentGroupArn: DeploymentGroupArn;

    constructor(parent: cdk.Construct, id: string, props: ServerDeploymentGroupRefProps) {
        super(parent, id);

        this.application = props.application;
        this.deploymentGroupName = props.deploymentGroupName;
        this.deploymentGroupArn = deploymentGroupName2Arn(props.application.applicationName,
            props.deploymentGroupName);
    }
}

/**
 * Construction properties for {@link ServerDeploymentGroup}.
 */
export interface ServerDeploymentGroupProps {
    /**
     * The CodeDeploy EC2/on-premise Application this Deployment Group belongs to.
     * If you don't provide one, a new Application will be created.
     */
    application?: ServerApplicationRef;

    /**
     * The service Role of this Deployment Group.
     * If you don't provide one, a new Role will be created.
     */
    role?: iam.Role;

    /**
     * The physical, human-readable name of the CodeDeploy Deployment Group.
     *
     * @default an auto-generated name will be used
     */
    deploymentGroupName?: string;
}

/**
 * A CodeDeploy Deployment Group that deploys to EC2/on-premise instances.
 */
export class ServerDeploymentGroup extends ServerDeploymentGroupRef {
    public readonly application: ServerApplicationRef;
    public readonly role: iam.Role;
    public readonly deploymentGroupArn: DeploymentGroupArn;
    public readonly deploymentGroupName: DeploymentGroupName;

    constructor(parent: cdk.Construct, id: string, props?: ServerDeploymentGroupProps) {
        super(parent, id);

        this.application = (props && props.application) || new ServerApplication(this, 'Application');

        this.role = (props && props.role) || new iam.Role(this, 'Role', {
            assumedBy: new cdk.ServicePrincipal('codedeploy.amazonaws.com'),
            managedPolicyArns: ['arn:aws:iam::aws:policy/service-role/AWSCodeDeployRole'],
        });

        const resource = new cloudformation.DeploymentGroupResource(this, 'Resource', {
            applicationName: this.application.applicationName,
            deploymentGroupName: props && props.deploymentGroupName,
            serviceRoleArn: this.role.roleArn,
        });

        this.deploymentGroupName = resource.ref;
        this.deploymentGroupArn = deploymentGroupName2Arn(this.application.applicationName,
            this.deploymentGroupName);
    }
}

function deploymentGroupName2Arn(applicationName: ApplicationName,
                                 deploymentGroupName: DeploymentGroupName): DeploymentGroupArn {
    return cdk.Arn.fromComponents({
        service: 'codedeploy',
        resource: 'deploymentgroup',
        resourceName: new cdk.FnJoin('/', [applicationName, deploymentGroupName]),
        sep: ':',
    });
}
