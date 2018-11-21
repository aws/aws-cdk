import { Construct } from '@aws-cdk/cdk';
import { cloudformation } from './iam.generated';
import { ServicePrincipal } from './policy-document';
import { Role } from './role';

export interface InstanceProfileProps {

  /**
   * The path associated with this instance profile. For information about IAM Instance Profiles, see
   * Friendly Names and Paths in IAM User Guide.
   */
  path?: string;

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

/**
 * IAM Instance Profile
 *
 * Defines an IAM Instance Profile that can be used with IAM roles for EC2 instances.
 */
export class InstanceProfile extends Construct {

    public readonly roles = new Array<Role>();
    public defaultRole = new Role(this, 'EC2Role', {
        assumedBy: new ServicePrincipal('ec2.amazonaws.com')
    });

    constructor(parent: Construct, name: string, props: InstanceProfileProps = {}) {
        super(parent, name);

        if (props.role) {
            this.defaultRole = props.role;
        }
        this.roles.push(this.defaultRole);

        new cloudformation.InstanceProfileResource(this, 'Resource', {
            instanceProfileName: props.instanceProfileName,
            roles: this.roles.map(r => r.roleName),
            path: props.path
        });

    }

}