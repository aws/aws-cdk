import cdk = require('@aws-cdk/cdk');
import { PolicyStatement } from './policy-document';
import { Role } from './role';

export interface InstanceProfileRefProps {

    /**
     * The path associated with this instance profile. For information about IAM Instance Profiles, see
     * Friendly Names and Paths in IAM User Guide.
     */
    path: string;

    /**
     * The name of an existing IAM role to associate with this instance profile.
     * Currently, you can assign a maximum of one role to an instance profile.
     * @default Creates a default ec2.amazonaws.com Assume Role.
     */
    role?: Role;

    /**
     * The name of the instance profile that you want to create.
     * This parameter allows (per its regex pattern) a string consisting of
     * upper and lowercase alphanumeric characters with no spaces.
     * You can also include any of the following characters: = , . @ -
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
     */
    public static import(parent: cdk.Construct, name: string, ref: InstanceProfileRefProps): InstanceProfileRef {
        return new InstanceProfileRefImport(parent, name, ref);
    }
    /**
     * Path for the Instance Profile
     * @link http://docs.aws.amazon.com/IAM/latest/UserGuide/Using_Identifiers.html#Identifiers_FriendlyNames
     */
    public abstract readonly path: string;

    /**
     * The existing Role to associate with the Instance Profile.
     */
    public abstract readonly role?: Role;

    /**
     * The name of the Instance Profile.
     * This is the InstanceProfileName element within the CloudFormation Resource.
     */
    public abstract readonly instanceProfileName?: string;

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

    public addToRolePolicy(statement: PolicyStatement) {
        if (!this.role) {
          return;
        }
        this.role.addToPolicy(statement);
    }
}

class InstanceProfileRefImport extends InstanceProfileRef {
    public readonly path: string;
    public readonly role?: Role;
    public readonly instanceProfileName?: string;

    constructor(parent: cdk.Construct, name: string, props: InstanceProfileRefProps) {
        super(parent, name);
        this.path = props.path;
        this.role = props.role;
        this.instanceProfileName = props.instanceProfileName;
    }

}