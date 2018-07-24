using Amazon.CDK;
using Amazon.CDK.AWS.ElasticLoadBalancingV2.cloudformation.ListenerRuleResource;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.ElasticLoadBalancingV2.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-listenerrule.html </remarks>
    [JsiiInterface(typeof(IListenerRuleResourceProps), "@aws-cdk/aws-elasticloadbalancingv2.cloudformation.ListenerRuleResourceProps")]
    public interface IListenerRuleResourceProps
    {
        /// <summary>``AWS::ElasticLoadBalancingV2::ListenerRule.Actions``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-listenerrule.html#cfn-elasticloadbalancingv2-listenerrule-actions </remarks>
        [JsiiProperty("actions", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-elasticloadbalancingv2.cloudformation.ListenerRuleResource.ActionProperty\"}]}}}}]}}")]
        object Actions
        {
            get;
            set;
        }

        /// <summary>``AWS::ElasticLoadBalancingV2::ListenerRule.Conditions``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-listenerrule.html#cfn-elasticloadbalancingv2-listenerrule-conditions </remarks>
        [JsiiProperty("conditions", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-elasticloadbalancingv2.cloudformation.ListenerRuleResource.RuleConditionProperty\"}]}}}}]}}")]
        object Conditions
        {
            get;
            set;
        }

        /// <summary>``AWS::ElasticLoadBalancingV2::ListenerRule.ListenerArn``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-listenerrule.html#cfn-elasticloadbalancingv2-listenerrule-listenerarn </remarks>
        [JsiiProperty("listenerArn", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object ListenerArn
        {
            get;
            set;
        }

        /// <summary>``AWS::ElasticLoadBalancingV2::ListenerRule.Priority``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-listenerrule.html#cfn-elasticloadbalancingv2-listenerrule-priority </remarks>
        [JsiiProperty("priority", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object Priority
        {
            get;
            set;
        }
    }
}