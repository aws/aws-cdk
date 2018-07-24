using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CloudFront
{
    /// <summary>How HTTPs should be handled with your distribution.</summary>
    [JsiiEnum(typeof(ViewerProtocolPolicy), "@aws-cdk/aws-cloudfront.ViewerProtocolPolicy")]
    public enum ViewerProtocolPolicy
    {
        [JsiiEnumMember("HTTPSOnly")]
        HTTPSOnly,
        [JsiiEnumMember("RedirectToHTTPS")]
        RedirectToHTTPS,
        [JsiiEnumMember("AllowAll")]
        AllowAll
    }
}