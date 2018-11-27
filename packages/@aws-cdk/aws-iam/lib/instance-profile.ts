import { Construct } from '@aws-cdk/cdk';
import { cloudformation } from './iam.generated';
import { InstanceProfileRef } from './instance-profile-ref';
import { PolicyStatement, ServicePrincipal } from './policy-document';
import { IRole, Role } from './role';
export interface InstanceProfileProps {

  /**
   * The path associated with this instance profile. For information about IAM Instance Profiles, see
   * Friendly Names and Paths in IAM User Guide.
   * @link http://docs.aws.amazon.com/IAM/latest/UserGuide/Using_Identifiers.html#Identifiers_FriendlyNames
   * @default / By default, AWS CloudFormation specifies '/' for the path.
   */
  path?: string;

  /**
   * The name of an existing IAM role to associate with this instance profile.
   * Currently, you can assign a maximum of one role to an instance profile.
   * @default Role a default Role with ServicePrincipal(ec2.amazonaws.com).
   */
  role?: IRole;

  /**
   * The name of the instance profile that you want to create.
   * This parameter allows (per its regex pattern) a string consisting of
   * upper and lowercase alphanumeric characters with no spaces.
   * You can also include any of the following characters: = , . @ -
   * @default none instance profile name does not have a default value.
   */
  instanceProfileName?: string;

}

/**
 * IAM Instance Profile
 *
 * Defines an IAM Instance Profile that can be used with IAM roles for EC2 instances.
 * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-instanceprofile.html
 */
export class InstanceProfile extends InstanceProfileRef {

    public readonly path: string;
    public readonly role: IRole;
    public readonly instanceProfileName?: string;

    constructor(parent: Construct, name: string, props: InstanceProfileProps) {
        super(parent, name);

        this.role = props.role || new Role(this, 'EC2Role', {
            assumedBy: new ServicePrincipal('ec2.amazonaws.com')
        });

        this.path = props.path || "/";
        const resource = new cloudformation.InstanceProfileResource(this, 'Resource', {
            roles:  [ this.role.roleName ],
            path: this.path,
            instanceProfileName: props.instanceProfileName
        });
        this.instanceProfileName = resource.instanceProfileName;
    }

    /**
     * Adds a PolicyStatement to the Role associated with this InstanceProfile
     * @param statement the statement to add
     */
    public addToRolePolicy(statement: PolicyStatement) {
        if (!this.role) {
          return;
        }
        this.role.addToPolicy(statement);
    }

}