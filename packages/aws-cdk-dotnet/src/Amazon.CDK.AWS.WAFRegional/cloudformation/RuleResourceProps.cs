using Amazon.CDK;
using Amazon.CDK.AWS.WAFRegional.cloudformation.RuleResource;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.WAFRegional.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-rule.html </remarks>
    public class RuleResourceProps : DeputyBase, IRuleResourceProps
    {
        /// <summary>``AWS::WAFRegional::Rule.MetricName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-rule.html#cfn-wafregional-rule-metricname </remarks>
        [JsiiProperty("metricName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}", true)]
        public object MetricName
        {
            get;
            set;
        }

        /// <summary>``AWS::WAFRegional::Rule.Name``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-rule.html#cfn-wafregional-rule-name </remarks>
        [JsiiProperty("ruleName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}", true)]
        public object RuleName
        {
            get;
            set;
        }

        /// <summary>``AWS::WAFRegional::Rule.Predicates``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-rule.html#cfn-wafregional-rule-predicates </remarks>
        [JsiiProperty("predicates", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-wafregional.cloudformation.RuleResource.PredicateProperty\"}]}}}}]},\"optional\":true}", true)]
        public object Predicates
        {
            get;
            set;
        }
    }
}