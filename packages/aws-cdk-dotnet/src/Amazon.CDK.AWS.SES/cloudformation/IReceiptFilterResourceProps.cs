using Amazon.CDK;
using Amazon.CDK.AWS.SES.cloudformation.ReceiptFilterResource;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.SES.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ses-receiptfilter.html </remarks>
    [JsiiInterface(typeof(IReceiptFilterResourceProps), "@aws-cdk/aws-ses.cloudformation.ReceiptFilterResourceProps")]
    public interface IReceiptFilterResourceProps
    {
        /// <summary>``AWS::SES::ReceiptFilter.Filter``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ses-receiptfilter.html#cfn-ses-receiptfilter-filter </remarks>
        [JsiiProperty("filter", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-ses.cloudformation.ReceiptFilterResource.FilterProperty\"}]}}")]
        object Filter
        {
            get;
            set;
        }
    }
}