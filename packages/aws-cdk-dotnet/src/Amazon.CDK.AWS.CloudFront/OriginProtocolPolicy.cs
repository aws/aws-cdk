using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CloudFront
{
    [JsiiEnum(typeof(OriginProtocolPolicy), "@aws-cdk/aws-cloudfront.OriginProtocolPolicy")]
    public enum OriginProtocolPolicy
    {
        [JsiiEnumMember("HttpOnly")]
        HttpOnly,
        [JsiiEnumMember("MatchViewer")]
        MatchViewer,
        [JsiiEnumMember("HttpsOnly")]
        HttpsOnly
    }
}