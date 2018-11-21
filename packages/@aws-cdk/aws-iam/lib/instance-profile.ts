import { Construct, Token } from '@aws-cdk/cdk';
import { cloudformation } from './iam.generated';
import { Role } from './role';
import { generateInstanceProfileName, undefinedIfEmpty } from './util';

export interface InstanceProfileProps {

  /**
   * The path associated with this instance profile. For information about IAM Instance Profiles, see
   * Friendly Names and Paths in IAM User Guide.
   */
  path?: string;

  /**
   * The name of an existing IAM role to associate with this instance profile.
   * Currently, you can assign a maximum of one role to an instance profile.
   */
  roles: Role[];

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

    public readonly instanceProfileName: string;
    public readonly roles: Role[];

    constructor(parent: Construct, name: string, props: InstanceProfileProps) {
        super(parent, name);
        this.validateMaxSessionDuration(props.roles);
        const resource = new cloudformation.InstanceProfileResource(this, 'Resource', {
            instanceProfileName: new Token(() => this.instanceProfileName),
            path: props.path,
            roles: undefinedIfEmpty(() => this.roles.map(r => r.roleName))
        });

        this.instanceProfileName = props.instanceProfileName || generateInstanceProfileName(resource.logicalId);
        this.roles = props.roles;

    }

    private validateMaxSessionDuration(roles: Role[]) {
        if (roles.length > 1) {
            throw new Error('Currently, you can assign a maximum of one role to an instance profile.');
        }
    }

}