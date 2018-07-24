using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK
{
    /// <summary>An IAM principal that represents an AWS service (i.e. sqs.amazonaws.com).</summary>
    [JsiiClass(typeof(ServicePrincipal), "@aws-cdk/cdk.ServicePrincipal", "[{\"name\":\"service\",\"type\":{\"primitive\":\"any\"}}]")]
    public class ServicePrincipal : PolicyPrincipal
    {
        public ServicePrincipal(object service): base(new DeputyProps(new object[]{service}))
        {
        }

        protected ServicePrincipal(ByRefValue reference): base(reference)
        {
        }

        protected ServicePrincipal(DeputyProps props): base(props)
        {
        }

        [JsiiProperty("service", "{\"primitive\":\"any\"}")]
        public virtual object Service
        {
            get => GetInstanceProperty<object>();
        }

        /// <summary>Return the policy fragment that identifies this principal in a Policy.</summary>
        [JsiiMethod("policyFragment", "{\"fqn\":\"@aws-cdk/cdk.PrincipalPolicyFragment\"}", "[]")]
        public override PrincipalPolicyFragment PolicyFragment()
        {
            return InvokeInstanceMethod<PrincipalPolicyFragment>(new object[]{});
        }
    }
}