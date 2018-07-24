using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK
{
    [JsiiClass(typeof(ArnPrincipal), "@aws-cdk/cdk.ArnPrincipal", "[{\"name\":\"arn\",\"type\":{\"primitive\":\"any\"}}]")]
    public class ArnPrincipal : PolicyPrincipal
    {
        public ArnPrincipal(object arn): base(new DeputyProps(new object[]{arn}))
        {
        }

        protected ArnPrincipal(ByRefValue reference): base(reference)
        {
        }

        protected ArnPrincipal(DeputyProps props): base(props)
        {
        }

        [JsiiProperty("arn", "{\"primitive\":\"any\"}")]
        public virtual object Arn
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