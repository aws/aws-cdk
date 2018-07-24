using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.IoT.cloudformation.TopicRuleResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-putiteminput.html </remarks>
    [JsiiInterface(typeof(IPutItemInputProperty), "@aws-cdk/aws-iot.cloudformation.TopicRuleResource.PutItemInputProperty")]
    public interface IPutItemInputProperty
    {
        /// <summary>``TopicRuleResource.PutItemInputProperty.TableName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-putiteminput.html#cfn-iot-topicrule-putiteminput-tablename </remarks>
        [JsiiProperty("tableName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object TableName
        {
            get;
            set;
        }
    }
}