using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.SES.cloudformation.ReceiptRuleResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-receiptrule-snsaction.html </remarks>
    [JsiiInterfaceProxy(typeof(ISNSActionProperty), "@aws-cdk/aws-ses.cloudformation.ReceiptRuleResource.SNSActionProperty")]
    internal class SNSActionPropertyProxy : DeputyBase, ISNSActionProperty
    {
        private SNSActionPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``ReceiptRuleResource.SNSActionProperty.Encoding``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-receiptrule-snsaction.html#cfn-ses-receiptrule-snsaction-encoding </remarks>
        [JsiiProperty("encoding", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object Encoding
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``ReceiptRuleResource.SNSActionProperty.TopicArn``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-receiptrule-snsaction.html#cfn-ses-receiptrule-snsaction-topicarn </remarks>
        [JsiiProperty("topicArn", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object TopicArn
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}