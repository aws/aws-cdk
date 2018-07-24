using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.WAF.cloudformation.WebACLResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-waf-webacl-rules.html </remarks>
    [JsiiInterface(typeof(IActivatedRuleProperty), "@aws-cdk/aws-waf.cloudformation.WebACLResource.ActivatedRuleProperty")]
    public interface IActivatedRuleProperty
    {
        /// <summary>``WebACLResource.ActivatedRuleProperty.Action``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-waf-webacl-rules.html#cfn-waf-webacl-rules-action </remarks>
        [JsiiProperty("action", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-waf.cloudformation.WebACLResource.WafActionProperty\"}]}}")]
        object Action
        {
            get;
            set;
        }

        /// <summary>``WebACLResource.ActivatedRuleProperty.Priority``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-waf-webacl-rules.html#cfn-waf-webacl-rules-priority </remarks>
        [JsiiProperty("priority", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object Priority
        {
            get;
            set;
        }

        /// <summary>``WebACLResource.ActivatedRuleProperty.RuleId``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-waf-webacl-rules.html#cfn-waf-webacl-rules-ruleid </remarks>
        [JsiiProperty("ruleId", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object RuleId
        {
            get;
            set;
        }
    }
}