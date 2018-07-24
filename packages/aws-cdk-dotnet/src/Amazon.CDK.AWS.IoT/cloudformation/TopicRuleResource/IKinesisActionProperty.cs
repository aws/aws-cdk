using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.IoT.cloudformation.TopicRuleResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-kinesisaction.html </remarks>
    [JsiiInterface(typeof(IKinesisActionProperty), "@aws-cdk/aws-iot.cloudformation.TopicRuleResource.KinesisActionProperty")]
    public interface IKinesisActionProperty
    {
        /// <summary>``TopicRuleResource.KinesisActionProperty.PartitionKey``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-kinesisaction.html#cfn-iot-topicrule-kinesisaction-partitionkey </remarks>
        [JsiiProperty("partitionKey", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object PartitionKey
        {
            get;
            set;
        }

        /// <summary>``TopicRuleResource.KinesisActionProperty.RoleArn``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-kinesisaction.html#cfn-iot-topicrule-kinesisaction-rolearn </remarks>
        [JsiiProperty("roleArn", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object RoleArn
        {
            get;
            set;
        }

        /// <summary>``TopicRuleResource.KinesisActionProperty.StreamName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-kinesisaction.html#cfn-iot-topicrule-kinesisaction-streamname </remarks>
        [JsiiProperty("streamName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object StreamName
        {
            get;
            set;
        }
    }
}