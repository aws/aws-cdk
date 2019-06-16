import ec2 = require('@aws-cdk/aws-ec2');
import iam = require('@aws-cdk/aws-iam');
import kms = require('@aws-cdk/aws-kms');
import { Construct, Fn, Lazy, Resource } from '@aws-cdk/cdk';
import { CfnNotebookInstance, CfnNotebookInstanceLifecycleConfig } from './sagemaker.generated';

/**
 * Construction properties for a SageMaker Notebook instance
 *
 * @experimental
 */
export interface NotebookInstanceProps {

    /**
     * Enable the notebook to have direct internet access.
     *
     * @default true
     */
    readonly enableDirectInternetAccess?: boolean;

    /**
     * Instance type of the notebook.
     *
     * @default m1.t2.medium
     */
    readonly instanceType?: ec2.InstanceType;

    /**
     * Encryption key for the EBS volume attached to the notebook instance.
     *
     * @default none
     */
    readonly kmsKeyId?: kms.IKey;

    /**
     * Name of the notebook instance.
     *
     * @default none
     */
    readonly notebookInstanceName?: string;

    /**
     * Role to provide to the Sagemaker service to access other AWS services.
     *
     * @default a new role for Amazon SageMaker.
     */
    readonly role?: iam.IRole;

    /**
     * Enable the root access to the notebook instance.
     *
     * @default true
     */
    readonly enableRootAccess?: boolean;

    /**
     * VPC to deploy the notebook instance.
     *
     * @default none
     */
    readonly vpc?: ec2.IVpc;

    /**
     * Subnet where the notebook instance is deployed to in the VPC.
     *
     * @default none
     */
    readonly subnet?: ec2.ISubnet;

    /**
     * Size of the notebook volume in GB.
     *
     * @default 5 GB
     */
    readonly volumeSizeInGB?: number;
}

/**
 * Defines a SageMaker Notebook instance.
 *
 * @experimental
 */
export class NotebookInstance extends Resource implements ec2.IConnectable {

    /**
     * Allows specify security group connections for instances of this fleet.
     */
    public readonly connections: ec2.Connections;

    /**
     * Notebook instance name.
     *
     * @attribute
     */
    public readonly notebookInstanceName: string;

    /**
     * Notebook instance ARN.
     *
     * @attribute
     */
    public readonly notebookInstanceArn: string;

    private readonly vpc: ec2.IVpc;
    private readonly securityGroup: ec2.ISecurityGroup;
    private readonly securityGroups: ec2.ISecurityGroup[] = [];
    private readonly subnet: ec2.ISubnet;

    private readonly role: iam.IRole;
    private readonly instanceType: string;
    private readonly onCreateLines = new Array<string>();
    private readonly onStartLines = new Array<string>();

    constructor(scope: Construct, id: string, props: NotebookInstanceProps = {}) {
        super(scope, id);

        // set the instance type if defined otherwise set to 'ml.t2.medium'
        if (props.instanceType) {
            this.validateInstanceType(props.instanceType.toString());
            this.instanceType = 'ml.' + props.instanceType.toString();
        } else {
            // default to 'ml.t2.medium' if undefined
            this.instanceType = 'ml.t2.medium';
        }

        // set the notebook instance name
        if (props.notebookInstanceName) {
            this.notebookInstanceName = props.notebookInstanceName;
        }

        // setup the networking of the notebook instance
        if (props.vpc) {
            this.vpc = props.vpc;
            // create a security group
            this.securityGroup = new ec2.SecurityGroup(this, 'NotebookSecurityGroup', {
                vpc: props.vpc
            });
            this.connections = new ec2.Connections({ securityGroups: [this.securityGroup] });
            this.securityGroups.push(this.securityGroup);
            if (props.subnet) {
                this.subnet = props.subnet;
            } else {
                if (this.vpc.privateSubnets.length > 0) {
                    this.subnet = this.vpc.privateSubnets[0];
                } else if (this.vpc.publicSubnets.length > 0) {
                    this.subnet = this.vpc.publicSubnets[0];
                } else {
                    throw new Error("No available subnets to deploy notebook instance");
                }
            }
        }

        // validate the value of volumeSizeInGB
        if (props.volumeSizeInGB) {
            this.validateVolumeSizeInGb(props.volumeSizeInGB);
        }

        // set the sagemaker role or create new one
        this.role = props.role || new iam.Role(this, 'SagemakerRole', {
            assumedBy: new iam.ServicePrincipal('sagemaker.amazonaws.com'),
            managedPolicyArns: [
                new iam.AwsManagedPolicy('AmazonSageMakerFullAccess', scope).policyArn
            ]
        });

        // create the Lifecycle Config resource
        const onCreateToken = Lazy.stringValue( {produce: () => Fn.base64(this.createScript(this.onCreateLines)) });
        const onStartToken = Lazy.stringValue( {produce: () => Fn.base64(this.createScript(this.onStartLines)) });
        const lifecycleConfig = new CfnNotebookInstanceLifecycleConfig(this, 'LifecycleConfig', {
            onCreate: [{content: onCreateToken}],
            onStart: [{content: onStartToken}],
        });

        // create the CfnNotebookInstance resource
        const notebook = new CfnNotebookInstance(this, 'NotebookInstance', {
            roleArn: this.role.roleArn,
            instanceType: this.instanceType,
            lifecycleConfigName: lifecycleConfig.notebookInstanceLifecycleConfigName,
            notebookInstanceName: this.notebookInstanceName,
            directInternetAccess: props.enableDirectInternetAccess !== undefined ?
                (props.enableDirectInternetAccess ? 'Enabled' : 'Disabled') : undefined,
            volumeSizeInGb: props.volumeSizeInGB,
            subnetId: this.subnet !== undefined ? this.subnet.subnetId : undefined,
            securityGroupIds: Lazy.listValue( {produce: () =>
                (this.securityGroups !== undefined ? this.securityGroups.map(sg => (sg.securityGroupId)) : undefined)}),
            rootAccess: props.enableRootAccess !== undefined ? (props.enableRootAccess ? 'Enabled' : 'Disabled') : undefined,
            kmsKeyId: props.kmsKeyId !== undefined ? props.kmsKeyId.keyArn : undefined,
        });
        this.notebookInstanceName = notebook.notebookInstanceName;
        this.notebookInstanceArn = notebook.notebookInstanceArn;
    }

    /**
     * Add command to the on create script of the notebook instance.
     * The command must be in a scripting language supported by Linux.
     */
    public addOnCreateScript(...scriptLines: string[]) {
        scriptLines.forEach(scriptLine => this.onCreateLines.push(scriptLine));
    }

    /**
     * Add command to the on start script of the notebook instance.
     * The command must be in a scripting language supported by Linux.
     */
    public addOnStartScript(...scriptLines: string[]) {
        scriptLines.forEach(scriptLine => this.onStartLines.push(scriptLine));
    }

    /**
     * Add the security group to the notebook instance.
     *
     * @param securityGroup: The security group to add
     */
    public addSecurityGroup(securityGroup: ec2.ISecurityGroup): void {
        this.securityGroups.push(securityGroup);
    }

    /**
     * Creates the script to be attached to the lifecycle configuration resource.
     */
    private createScript(scripts: string[]): string {
        return '#!/bin/bash\n' + scripts.join('\n');
    }

    /**
     * Validates the provided instance type.
     * @param instanceType the instance type of the notebook instance
     */
    private validateInstanceType(instanceType: string) {
        // check if a valid sagemaker instance type
        if (!['c4', 'c5', 'm4', 'm5', 'p2', 'p3', 't2', 't3'].some(instanceClass => instanceType.indexOf(instanceClass) >= 0)) {
            throw new Error(`Invalid instance type for a Sagemaker notebook instance: ${instanceType}`);
        }
    }

    /**
     * Validates the provided EVS volume size.
     * @param volumeSizeInGb the volume size in GB
     */
    private validateVolumeSizeInGb(volumeSizeInGb: number) {
        if (volumeSizeInGb < 5 || volumeSizeInGb > 16384) {
            throw new Error("VolumeSizeInGb value must be between 5 and 16384 GB");
        }
    }
}
