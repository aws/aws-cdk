using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.IAM
{
    /// <remarks>deprecated: Use IPrincipal</remarks>
    [JsiiInterfaceProxy(typeof(IIIdentityResource), "@aws-cdk/aws-iam.IIdentityResource")]
    internal class IIdentityResourceProxy : DeputyBase, IIIdentityResource
    {
        private IIdentityResourceProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>The IAM principal of this identity (i.e. AWS principal, service principal, etc).</summary>
        [JsiiProperty("principal", "{\"fqn\":\"@aws-cdk/cdk.PolicyPrincipal\"}")]
        public virtual PolicyPrincipal Principal
        {
            get => GetInstanceProperty<PolicyPrincipal>();
        }

        /// <summary>
        /// Adds an IAM statement to the default inline policy associated with this
        /// principal. If a policy doesn't exist, it is created.
        /// </summary>
        [JsiiMethod("addToPolicy", null, "[{\"name\":\"statement\",\"type\":{\"fqn\":\"@aws-cdk/cdk.PolicyStatement\"}}]")]
        public virtual void AddToPolicy(PolicyStatement statement)
        {
            InvokeInstanceVoidMethod(new object[]{statement});
        }

        /// <summary>
        /// Attaches an inline policy to this principal.
        /// This is the same as calling `policy.addToXxx(principal)`.
        /// </summary>
        /// <param name = "policy">The policy resource to attach to this principal.</param>
        [JsiiMethod("attachInlinePolicy", null, "[{\"name\":\"policy\",\"type\":{\"fqn\":\"@aws-cdk/aws-iam.Policy\"}}]")]
        public virtual void AttachInlinePolicy(Policy policy)
        {
            InvokeInstanceVoidMethod(new object[]{policy});
        }

        /// <summary>Attaches a managed policy to this principal.</summary>
        /// <param name = "arn">The ARN of the managed policy</param>
        [JsiiMethod("attachManagedPolicy", null, "[{\"name\":\"arn\",\"type\":{\"primitive\":\"any\"}}]")]
        public virtual void AttachManagedPolicy(object arn)
        {
            InvokeInstanceVoidMethod(new object[]{arn});
        }
    }
}