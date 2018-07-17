import { ArnPrincipal, Construct, IDependable, PolicyDocument, PolicyPrincipal, PolicyStatement, Token } from '@aws-cdk/cdk';
import { cloudformation, RoleArn } from './iam.generated';
import { IIdentityResource, Policy } from './policy';
import { AttachedPolicies, undefinedIfEmpty } from './util';

export interface RoleProps {
    /**
     * The IAM principal (i.e. `new ServicePrincipal('sns.amazonaws.com')`)
     * which can assume this role.
     *
     * You can later modify the assume role policy document by accessing it via
     * the `assumeRolePolicy` property.
     */
    assumedBy: PolicyPrincipal;

    /**
     * A list of ARNs for managed policies associated with this role.
     * You can add managed policies later using `addManagedPolicy(arn)`.
     * @default No managed policies.
     */
    managedPolicyArns?: any[];

    /**
     * The path associated with this role. For information about IAM paths, see
     * Friendly Names and Paths in IAM User Guide.
     */
    path?: string;

    /**
     * A name for the IAM role. For valid values, see the RoleName parameter for
     * the CreateRole action in the IAM API Reference. If you don't specify a
     * name, AWS CloudFormation generates a unique physical ID and uses that ID
     * for the group name.
     *
     * IMPORTANT: If you specify a name, you cannot perform updates that require
     * replacement of this resource. You can perform updates that require no or
     * some interruption. If you must replace the resource, specify a new name.
     *
     * If you specify a name, you must specify the CAPABILITY_NAMED_IAM value to
     * acknowledge your template's capabilities. For more information, see
     * Acknowledging IAM Resources in AWS CloudFormation Templates.
     */
    roleName?: string;
}

/**
 * IAM Role
 *
 * Defines an IAM role. The role is created with an assume policy document associated with
 * the specified AWS service principal defined in `serviceAssumeRole`.
 */
export class Role extends Construct implements IIdentityResource, IDependable {
    /**
     * The assume role policy document associated with this role.
     */
    public readonly assumeRolePolicy?: PolicyDocument;

    /**
     * Returns the ARN of this role.
     */
    public readonly roleArn: RoleArn;

    /**
     * Returns the name of the role.
     */
    public readonly roleName: RoleName;

    /**
     * Returns the ARN of this role.
     */
    public readonly principal: PolicyPrincipal;

    /**
     * Returns the role.
     */
    public readonly dependencyElements: IDependable[];

    private defaultPolicy?: Policy;
    private readonly managedPolicies: string[];
    private readonly attachedPolicies = new AttachedPolicies();

    constructor(parent: Construct, name: string, props: RoleProps) {
        super(parent, name);

        this.assumeRolePolicy = createAssumeRolePolicy(props.assumedBy);
        this.managedPolicies = props.managedPolicyArns || [ ];

        const role = new cloudformation.RoleResource(this, 'Resource', {
            assumeRolePolicyDocument: this.assumeRolePolicy as any,
            managedPolicyArns: undefinedIfEmpty(() => this.managedPolicies),
            path: props.path,
            roleName: props.roleName,
        });

        this.roleArn = role.roleArn;
        this.principal = new ArnPrincipal(this.roleArn);
        this.roleName = role.ref;
        this.dependencyElements = [ role ];
    }

    /**
     * Adds a permission to the role's default policy document.
     * If there is no default policy attached to this role, it will be created.
     * @param permission The permission statement to add to the policy document
     */
    public addToPolicy(statement: PolicyStatement) {
        if (!this.defaultPolicy) {
            this.defaultPolicy = new Policy(this, 'DefaultPolicy');
            this.attachInlinePolicy(this.defaultPolicy);
            this.dependencyElements.push(this.defaultPolicy);
        }
        this.defaultPolicy.addStatement(statement);
    }

    /**
     * Attaches a managed policy to this role.
     * @param arn The ARN of the managed policy to attach.
     */
    public attachManagedPolicy(arn: any) {
        this.managedPolicies.push(arn);
    }

    /**
     * Attaches a policy to this role.
     * @param policy The policy to attach
     */
    public attachInlinePolicy(policy: Policy) {
        this.attachedPolicies.attach(policy);
        policy.attachToRole(this);
    }
}

export class RoleName extends Token {

}

function createAssumeRolePolicy(principal: PolicyPrincipal) {
    return new PolicyDocument()
        .addStatement(new PolicyStatement()
            .addPrincipal(principal)
            .addAction(principal.assumeRoleAction));
}
