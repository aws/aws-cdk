import cdk = require('@aws-cdk/cdk');
import { PolicyStatement } from './policy-document';
import { IRole } from './role';

export interface InstanceProfileRefProps {

    /**
     * The path associated with this instance profile. For information about IAM Instance Profiles, see
     * Friendly Names and Paths in IAM User Guide.
     * @link http://docs.aws.amazon.com/IAM/latest/UserGuide/Using_Identifiers.html#Identifiers_FriendlyNames
     * @default / By default, AWS CloudFormation specifies '/' for the path.
     */
    path: string;

    /**
     * The name of an existing IAM role to associate with this instance profile.
     * Currently, you can assign a maximum of one role to an instance profile.
     * @default Role a default Role with ServicePrincipal(ec2.amazonaws.com).
     */
    role: IRole;

    /**
     * The name of the instance profile that you want to create.
     * This parameter allows (per its regex pattern) a string consisting of
     * upper and lowercase alphanumeric characters with no spaces.
     * You can also include any of the following characters: = , . @ -
     * @default none instance profile name does not have a default value.
     */
    instanceProfileName?: string;

}

export abstract class InstanceProfileRef extends cdk.Construct {

    /**
     * Creates an IAM Instance Profile object which represents an
     * instance profile not defined within this stack.
     *
     * `InstanceProfile.import(this, 'MyImportedInstanceProfile', {})`
     *
     * @param parent The parent construct
     * @param name The name for the CloudFormation InstanceProfile Element.  Note: this is not the same as the
     * InstanceProfileName.
     * @param ref A reference to an Instance Profile.  Can be created manually (see example above) or
     * obtained through a call to `instanceProfile.export()`
     * @returns InstanceProfileRef
     */
    public static import(parent: cdk.Construct, name: string, ref: InstanceProfileRefProps): InstanceProfileRef {
        return new InstanceProfileRefImport(parent, name, ref);
    }

    /**
     * Path for the Instance Profile
     * @link http://docs.aws.amazon.com/IAM/latest/UserGuide/Using_Identifiers.html#Identifiers_FriendlyNames
     * @default / If a path is not provided, CloudFormation defaults the path to '/'.
     */
    public abstract readonly path: string;

    /**
     * The name of an existing IAM role to associate with this instance profile.
     * Currently, you can assign a maximum of one role to an instance profile.
     * @default Role a default Role with ServicePrincipal(ec2.amazonaws.com).
     */
    public abstract readonly role: IRole;

    /**
     * The name of the instance profile that you want to create.
     * This parameter allows (per its regex pattern) a string consisting of
     * upper and lowercase alphanumeric characters with no spaces.
     * You can also include any of the following characters: = , . @ -
     * @default none instance profile name does not have a default value.
     */
    public abstract readonly instanceProfileName?: string;

    /**
     * Adds a PolicyStatement to the Role associated with this InstanceProfile
     * @param statement the statement to add
     */
    public abstract addToRolePolicy(statement: PolicyStatement): void;

    /**
     * Exports this InstanceProfile
     */
    public export(): InstanceProfileRefProps {
        return {
            path: this.path,
            role: this.role,
            instanceProfileName: this.instanceProfileName
        };
    }

}

class InstanceProfileRefImport extends InstanceProfileRef {
    public readonly path: string;
    public readonly role: IRole;
    public readonly instanceProfileName?: string;

    constructor(parent: cdk.Construct, name: string, props: InstanceProfileRefProps) {
        super(parent, name);
        this.path = props.path;
        this.role = props.role;
        this.instanceProfileName = props.instanceProfileName;
    }

    public addToRolePolicy(_statement: PolicyStatement) {
        // FIXME: Add warning that we're ignoring this
    }

}