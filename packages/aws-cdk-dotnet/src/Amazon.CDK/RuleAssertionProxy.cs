using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK
{
    /// <summary>A rule assertion.</summary>
    [JsiiInterfaceProxy(typeof(IRuleAssertion), "@aws-cdk/cdk.RuleAssertion")]
    internal class RuleAssertionProxy : DeputyBase, IRuleAssertion
    {
        private RuleAssertionProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>The assertion.</summary>
        [JsiiProperty("assert", "{\"fqn\":\"@aws-cdk/cdk.FnCondition\"}")]
        public virtual FnCondition Assert
        {
            get => GetInstanceProperty<FnCondition>();
            set => SetInstanceProperty(value);
        }

        /// <summary>The assertion description.</summary>
        [JsiiProperty("assertDescription", "{\"primitive\":\"string\"}")]
        public virtual string AssertDescription
        {
            get => GetInstanceProperty<string>();
            set => SetInstanceProperty(value);
        }
    }
}