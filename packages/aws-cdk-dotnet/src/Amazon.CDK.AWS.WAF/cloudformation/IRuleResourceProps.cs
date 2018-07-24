using Amazon.CDK;
using Amazon.CDK.AWS.WAF.cloudformation.RuleResource;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.WAF.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-waf-rule.html </remarks>
    [JsiiInterface(typeof(IRuleResourceProps), "@aws-cdk/aws-waf.cloudformation.RuleResourceProps")]
    public interface IRuleResourceProps
    {
        /// <summary>``AWS::WAF::Rule.MetricName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-waf-rule.html#cfn-waf-rule-metricname </remarks>
        [JsiiProperty("metricName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object MetricName
        {
            get;
            set;
        }

        /// <summary>``AWS::WAF::Rule.Name``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-waf-rule.html#cfn-waf-rule-name </remarks>
        [JsiiProperty("ruleName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object RuleName
        {
            get;
            set;
        }

        /// <summary>``AWS::WAF::Rule.Predicates``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-waf-rule.html#cfn-waf-rule-predicates </remarks>
        [JsiiProperty("predicates", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-waf.cloudformation.RuleResource.PredicateProperty\"}]}}}}]},\"optional\":true}")]
        object Predicates
        {
            get;
            set;
        }
    }
}