using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.IAM
{
    [JsiiInterface(typeof(IPolicyProps), "@aws-cdk/aws-iam.PolicyProps")]
    public interface IPolicyProps
    {
        /// <summary>
        /// The name of the policy. If you specify multiple policies for an entity,
        /// specify unique names. For example, if you specify a list of policies for
        /// an IAM role, each policy must have a unique name.
        /// </summary>
        /// <remarks>
        /// default: Uses the logical ID of the policy resource, which is ensured to
        /// be unique within the stack.
        /// </remarks>
        [JsiiProperty("policyName", "{\"primitive\":\"string\",\"optional\":true}")]
        string PolicyName
        {
            get;
            set;
        }

        /// <summary>
        /// Users to attach this policy to.
        /// You can also use `attachToUser(user)` to attach this policy to a user.
        /// </summary>
        [JsiiProperty("users", "{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"fqn\":\"@aws-cdk/aws-iam.User\"}},\"optional\":true}")]
        User[] Users
        {
            get;
            set;
        }

        /// <summary>
        /// Roles to attach this policy to.
        /// You can also use `attachToRole(role)` to attach this policy to a role.
        /// </summary>
        [JsiiProperty("roles", "{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"fqn\":\"@aws-cdk/aws-iam.Role\"}},\"optional\":true}")]
        Role[] Roles
        {
            get;
            set;
        }

        /// <summary>
        /// Groups to attach this policy to.
        /// You can also use `attachToGroup(group)` to attach this policy to a group.
        /// </summary>
        [JsiiProperty("groups", "{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"fqn\":\"@aws-cdk/aws-iam.Group\"}},\"optional\":true}")]
        Group[] Groups
        {
            get;
            set;
        }

        /// <summary>
        /// Initial set of permissions to add to this policy document.
        /// You can also use `addPermission(statement)` to add permissions later.
        /// </summary>
        [JsiiProperty("statements", "{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"fqn\":\"@aws-cdk/cdk.PolicyStatement\"}},\"optional\":true}")]
        PolicyStatement[] Statements
        {
            get;
            set;
        }
    }
}