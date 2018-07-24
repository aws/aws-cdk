using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.SES.cloudformation.ReceiptRuleResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-receiptrule-snsaction.html </remarks>
    [JsiiInterface(typeof(ISNSActionProperty), "@aws-cdk/aws-ses.cloudformation.ReceiptRuleResource.SNSActionProperty")]
    public interface ISNSActionProperty
    {
        /// <summary>``ReceiptRuleResource.SNSActionProperty.Encoding``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-receiptrule-snsaction.html#cfn-ses-receiptrule-snsaction-encoding </remarks>
        [JsiiProperty("encoding", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object Encoding
        {
            get;
            set;
        }

        /// <summary>``ReceiptRuleResource.SNSActionProperty.TopicArn``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-receiptrule-snsaction.html#cfn-ses-receiptrule-snsaction-topicarn </remarks>
        [JsiiProperty("topicArn", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object TopicArn
        {
            get;
            set;
        }
    }
}