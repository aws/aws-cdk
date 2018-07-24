using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.IAM
{
    /// <summary>A construct that represents an IAM principal, such as a user, group or role.</summary>
    [JsiiInterface(typeof(IIPrincipal), "@aws-cdk/aws-iam.IPrincipal")]
    public interface IIPrincipal
    {
        /// <summary>The IAM principal of this identity (i.e. AWS principal, service principal, etc).</summary>
        [JsiiProperty("principal", "{\"fqn\":\"@aws-cdk/cdk.PolicyPrincipal\"}")]
        PolicyPrincipal Principal
        {
            get;
        }

        /// <summary>
        /// Adds an IAM statement to the default inline policy associated with this
        /// principal. If a policy doesn't exist, it is created.
        /// </summary>
        [JsiiMethod("addToPolicy", null, "[{\"name\":\"statement\",\"type\":{\"fqn\":\"@aws-cdk/cdk.PolicyStatement\"}}]")]
        void AddToPolicy(PolicyStatement statement);
        /// <summary>
        /// Attaches an inline policy to this principal.
        /// This is the same as calling `policy.addToXxx(principal)`.
        /// </summary>
        /// <param name = "policy">The policy resource to attach to this principal.</param>
        [JsiiMethod("attachInlinePolicy", null, "[{\"name\":\"policy\",\"type\":{\"fqn\":\"@aws-cdk/aws-iam.Policy\"}}]")]
        void AttachInlinePolicy(Policy policy);
        /// <summary>Attaches a managed policy to this principal.</summary>
        /// <param name = "arn">The ARN of the managed policy</param>
        [JsiiMethod("attachManagedPolicy", null, "[{\"name\":\"arn\",\"type\":{\"primitive\":\"any\"}}]")]
        void AttachManagedPolicy(object arn);
    }
}