using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CloudFront
{
    /// <summary>Enums for the methods CloudFront can cache.</summary>
    [JsiiEnum(typeof(CloudFrontAllowedCachedMethods), "@aws-cdk/aws-cloudfront.CloudFrontAllowedCachedMethods")]
    public enum CloudFrontAllowedCachedMethods
    {
        [JsiiEnumMember("GET_HEAD")]
        GET_HEAD,
        [JsiiEnumMember("GET_HEAD_OPTIONS")]
        GET_HEAD_OPTIONS
    }
}