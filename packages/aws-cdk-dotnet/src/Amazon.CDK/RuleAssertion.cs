using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK
{
    /// <summary>A rule assertion.</summary>
    public class RuleAssertion : DeputyBase, IRuleAssertion
    {
        /// <summary>The assertion.</summary>
        [JsiiProperty("assert", "{\"fqn\":\"@aws-cdk/cdk.FnCondition\"}", true)]
        public FnCondition Assert
        {
            get;
            set;
        }

        /// <summary>The assertion description.</summary>
        [JsiiProperty("assertDescription", "{\"primitive\":\"string\"}", true)]
        public string AssertDescription
        {
            get;
            set;
        }
    }
}