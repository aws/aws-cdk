using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK
{
    /// <summary>A principal representing all identities in all accounts</summary>
    [JsiiClass(typeof(Anyone), "@aws-cdk/cdk.Anyone", "[]")]
    public class Anyone : PolicyPrincipal
    {
        public Anyone(): base(new DeputyProps(new object[]{}))
        {
        }

        protected Anyone(ByRefValue reference): base(reference)
        {
        }

        protected Anyone(DeputyProps props): base(props)
        {
        }

        /// <summary>
        /// Interface compatibility with AccountPrincipal for the purposes of the Lambda library
        /// 
        /// The Lambda's addPermission() call works differently from regular
        /// statements, and will use the value of this property directly if present
        /// (which leads to the correct statement ultimately).
        /// </summary>
        [JsiiProperty("accountId", "{\"primitive\":\"string\"}")]
        public virtual string AccountId
        {
            get => GetInstanceProperty<string>();
        }

        /// <summary>Return the policy fragment that identifies this principal in a Policy.</summary>
        [JsiiMethod("policyFragment", "{\"fqn\":\"@aws-cdk/cdk.PrincipalPolicyFragment\"}", "[]")]
        public override PrincipalPolicyFragment PolicyFragment()
        {
            return InvokeInstanceMethod<PrincipalPolicyFragment>(new object[]{});
        }
    }
}