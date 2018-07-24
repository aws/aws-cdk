using Amazon.CDK;
using Amazon.CDK.AWS.IoT.cloudformation.TopicRuleResource;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.IoT.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-topicrule.html </remarks>
    [JsiiInterfaceProxy(typeof(ITopicRuleResourceProps), "@aws-cdk/aws-iot.cloudformation.TopicRuleResourceProps")]
    internal class TopicRuleResourcePropsProxy : DeputyBase, ITopicRuleResourceProps
    {
        private TopicRuleResourcePropsProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``AWS::IoT::TopicRule.TopicRulePayload``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-topicrule.html#cfn-iot-topicrule-topicrulepayload </remarks>
        [JsiiProperty("topicRulePayload", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-iot.cloudformation.TopicRuleResource.TopicRulePayloadProperty\"}]}}")]
        public virtual object TopicRulePayload
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``AWS::IoT::TopicRule.RuleName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-topicrule.html#cfn-iot-topicrule-rulename </remarks>
        [JsiiProperty("ruleName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object RuleName
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}