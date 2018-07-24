using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CloudFront
{
    /// <summary>An enum for the supported methods to a CloudFront distribution.</summary>
    [JsiiEnum(typeof(CloudFrontAllowedMethods), "@aws-cdk/aws-cloudfront.CloudFrontAllowedMethods")]
    public enum CloudFrontAllowedMethods
    {
        [JsiiEnumMember("GET_HEAD")]
        GET_HEAD,
        [JsiiEnumMember("GET_HEAD_OPTIONS")]
        GET_HEAD_OPTIONS,
        [JsiiEnumMember("ALL")]
        ALL
    }
}