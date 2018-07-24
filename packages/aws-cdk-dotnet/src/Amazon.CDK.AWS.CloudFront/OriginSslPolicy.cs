using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CloudFront
{
    [JsiiEnum(typeof(OriginSslPolicy), "@aws-cdk/aws-cloudfront.OriginSslPolicy")]
    public enum OriginSslPolicy
    {
        [JsiiEnumMember("SSLv3")]
        SSLv3,
        [JsiiEnumMember("TLSv1")]
        TLSv1,
        [JsiiEnumMember("TLSv1_1")]
        TLSv1_1,
        [JsiiEnumMember("TLSv1_2")]
        TLSv1_2
    }
}