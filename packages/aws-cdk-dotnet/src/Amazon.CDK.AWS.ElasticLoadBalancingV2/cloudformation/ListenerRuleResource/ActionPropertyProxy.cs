using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.ElasticLoadBalancingV2.cloudformation.ListenerRuleResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-actions.html </remarks>
    [JsiiInterfaceProxy(typeof(IActionProperty), "@aws-cdk/aws-elasticloadbalancingv2.cloudformation.ListenerRuleResource.ActionProperty")]
    internal class ActionPropertyProxy : DeputyBase, Amazon.CDK.AWS.ElasticLoadBalancingV2.cloudformation.ListenerRuleResource.IActionProperty
    {
        private ActionPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``ListenerRuleResource.ActionProperty.TargetGroupArn``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-actions.html#cfn-elasticloadbalancingv2-listener-actions-targetgrouparn </remarks>
        [JsiiProperty("targetGroupArn", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object TargetGroupArn
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``ListenerRuleResource.ActionProperty.Type``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-actions.html#cfn-elasticloadbalancingv2-listener-actions-type </remarks>
        [JsiiProperty("type", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object Type
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}