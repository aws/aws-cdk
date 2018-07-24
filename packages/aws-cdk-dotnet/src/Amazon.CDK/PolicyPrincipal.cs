using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK
{
    /// <summary>Represents an IAM principal.</summary>
    [JsiiClass(typeof(PolicyPrincipal), "@aws-cdk/cdk.PolicyPrincipal", "[]")]
    public abstract class PolicyPrincipal : DeputyBase
    {
        protected PolicyPrincipal(): base(new DeputyProps(new object[]{}))
        {
        }

        protected PolicyPrincipal(ByRefValue reference): base(reference)
        {
        }

        protected PolicyPrincipal(DeputyProps props): base(props)
        {
        }

        /// <summary>When this Principal is used in an AssumeRole policy, the action to use.</summary>
        [JsiiProperty("assumeRoleAction", "{\"primitive\":\"string\"}")]
        public virtual string AssumeRoleAction
        {
            get => GetInstanceProperty<string>();
        }

        /// <summary>Return the policy fragment that identifies this principal in a Policy.</summary>
        [JsiiMethod("policyFragment", "{\"fqn\":\"@aws-cdk/cdk.PrincipalPolicyFragment\"}", "[]")]
        public abstract PrincipalPolicyFragment PolicyFragment();
    }
}