using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.IoT.cloudformation.TopicRuleResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-putiteminput.html </remarks>
    [JsiiInterfaceProxy(typeof(IPutItemInputProperty), "@aws-cdk/aws-iot.cloudformation.TopicRuleResource.PutItemInputProperty")]
    internal class PutItemInputPropertyProxy : DeputyBase, IPutItemInputProperty
    {
        private PutItemInputPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``TopicRuleResource.PutItemInputProperty.TableName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot-topicrule-putiteminput.html#cfn-iot-topicrule-putiteminput-tablename </remarks>
        [JsiiProperty("tableName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object TableName
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}