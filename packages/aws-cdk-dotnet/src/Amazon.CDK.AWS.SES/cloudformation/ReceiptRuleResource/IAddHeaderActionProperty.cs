using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.SES.cloudformation.ReceiptRuleResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-receiptrule-addheaderaction.html </remarks>
    [JsiiInterface(typeof(IAddHeaderActionProperty), "@aws-cdk/aws-ses.cloudformation.ReceiptRuleResource.AddHeaderActionProperty")]
    public interface IAddHeaderActionProperty
    {
        /// <summary>``ReceiptRuleResource.AddHeaderActionProperty.HeaderName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-receiptrule-addheaderaction.html#cfn-ses-receiptrule-addheaderaction-headername </remarks>
        [JsiiProperty("headerName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object HeaderName
        {
            get;
            set;
        }

        /// <summary>``ReceiptRuleResource.AddHeaderActionProperty.HeaderValue``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-receiptrule-addheaderaction.html#cfn-ses-receiptrule-addheaderaction-headervalue </remarks>
        [JsiiProperty("headerValue", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object HeaderValue
        {
            get;
            set;
        }
    }
}