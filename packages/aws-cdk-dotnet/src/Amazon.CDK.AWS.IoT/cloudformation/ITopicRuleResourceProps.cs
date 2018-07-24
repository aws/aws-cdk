using Amazon.CDK;
using Amazon.CDK.AWS.IoT.cloudformation.TopicRuleResource;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.IoT.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-topicrule.html </remarks>
    [JsiiInterface(typeof(ITopicRuleResourceProps), "@aws-cdk/aws-iot.cloudformation.TopicRuleResourceProps")]
    public interface ITopicRuleResourceProps
    {
        /// <summary>``AWS::IoT::TopicRule.TopicRulePayload``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-topicrule.html#cfn-iot-topicrule-topicrulepayload </remarks>
        [JsiiProperty("topicRulePayload", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-iot.cloudformation.TopicRuleResource.TopicRulePayloadProperty\"}]}}")]
        object TopicRulePayload
        {
            get;
            set;
        }

        /// <summary>``AWS::IoT::TopicRule.RuleName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-topicrule.html#cfn-iot-topicrule-rulename </remarks>
        [JsiiProperty("ruleName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object RuleName
        {
            get;
            set;
        }
    }
}