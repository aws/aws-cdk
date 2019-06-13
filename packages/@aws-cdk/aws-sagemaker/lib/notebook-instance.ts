import ec2 = require('@aws-cdk/aws-ec2');
import iam = require('@aws-cdk/aws-iam');
import kms = require('@aws-cdk/aws-kms');
import { Construct, Fn, Lazy, Resource } from '@aws-cdk/cdk';
import { CfnNotebookInstance, CfnNotebookInstanceLifecycleConfig } from './sagemaker.generated';

/**
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
     * Security groups attached to the notebook instance.
     *
     * @default none
     */
    readonly securityGroups?: ec2.ISecurityGroup[];

    /**
     * Subnet where the notebook instance is deployed to in the VPC.
     *
     * @default none
     */
    readonly subnet?: ec2.ISubnet;

    /**
     * Tags for the notebook instance.
     *
     * @default none
     */
    readonly tags?: {[key: string]: any};

    /**
     * Size of the notebook volume in GB.
     *
     * @default 5 GB
     */
    readonly volumeSizeInGB?: number;
}

/**
 * @experimental
 */
export class NotebookInstance extends Resource implements ec2.IConnectable {

    /**
     * Allows specify security group connections for instances of this fleet.
     */
    public readonly connections: ec2.Connections = new ec2.Connections();

    /** @attribute */
    public readonly notebookInstanceName: string;

    private readonly role: iam.IRole;
    private readonly instanceType: string;
    private readonly onCreateLines = new Array<string>();
    private readonly onStartLines = new Array<string>();
    private readonly tags: {[key: string]: any} = {};

    constructor(scope: Construct, id: string, props?: NotebookInstanceProps) {
        super(scope, id);

        if (!props) {
            props = {};
        }

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

        // set the notebook instance tags
        this.tags = (props.tags) ? (props.tags) : {};

        // add the security groups to the connections object
        if (props.securityGroups) {
            props.securityGroups.forEach(sg => this.connections.addSecurityGroup(sg));
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
        new CfnNotebookInstance(this, 'NotebookInstance', {
            roleArn: this.role.roleArn,
            instanceType: this.instanceType,
            lifecycleConfigName: lifecycleConfig.notebookInstanceLifecycleConfigName,
            notebookInstanceName: this.notebookInstanceName,
            tags: (Object.keys(this.tags).length > 0) ? (Object.keys(this.tags).map(key => ({ key, value: this.tags[key] }))) : undefined,
            directInternetAccess: props.enableDirectInternetAccess !== undefined ?
                (props.enableDirectInternetAccess ? 'Enabled' : 'Disabled') : undefined,
            volumeSizeInGb: props.volumeSizeInGB,
            subnetId: props.subnet !== undefined ? props.subnet.subnetId : undefined,
            securityGroupIds: props.securityGroups !== undefined ? props.securityGroups.map(sg => (sg.securityGroupId)) : undefined,
            rootAccess: props.enableRootAccess !== undefined ? (props.enableRootAccess ? 'Enabled' : 'Disabled') : undefined,
            kmsKeyId: props.kmsKeyId !== undefined ? props.kmsKeyId.keyArn : undefined,
        });
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
