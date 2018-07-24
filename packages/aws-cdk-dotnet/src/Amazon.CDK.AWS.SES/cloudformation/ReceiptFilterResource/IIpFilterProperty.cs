using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.SES.cloudformation.ReceiptFilterResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-receiptfilter-ipfilter.html </remarks>
    [JsiiInterface(typeof(IIpFilterProperty), "@aws-cdk/aws-ses.cloudformation.ReceiptFilterResource.IpFilterProperty")]
    public interface IIpFilterProperty
    {
        /// <summary>``ReceiptFilterResource.IpFilterProperty.Cidr``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-receiptfilter-ipfilter.html#cfn-ses-receiptfilter-ipfilter-cidr </remarks>
        [JsiiProperty("cidr", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object Cidr
        {
            get;
            set;
        }

        /// <summary>``ReceiptFilterResource.IpFilterProperty.Policy``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-receiptfilter-ipfilter.html#cfn-ses-receiptfilter-ipfilter-policy </remarks>
        [JsiiProperty("policy", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object Policy
        {
            get;
            set;
        }
    }
}