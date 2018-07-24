using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK
{
    /// <summary>A rule assertion.</summary>
    [JsiiInterface(typeof(IRuleAssertion), "@aws-cdk/cdk.RuleAssertion")]
    public interface IRuleAssertion
    {
        /// <summary>The assertion.</summary>
        [JsiiProperty("assert", "{\"fqn\":\"@aws-cdk/cdk.FnCondition\"}")]
        FnCondition Assert
        {
            get;
            set;
        }

        /// <summary>The assertion description.</summary>
        [JsiiProperty("assertDescription", "{\"primitive\":\"string\"}")]
        string AssertDescription
        {
            get;
            set;
        }
    }
}