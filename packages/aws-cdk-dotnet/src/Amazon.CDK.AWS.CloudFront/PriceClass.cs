using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CloudFront
{
    /// <summary>The price class determines how many edge locations CloudFront will use for your distribution.</summary>
    [JsiiEnum(typeof(PriceClass), "@aws-cdk/aws-cloudfront.PriceClass")]
    public enum PriceClass
    {
        [JsiiEnumMember("PriceClass100")]
        PriceClass100,
        [JsiiEnumMember("PriceClass200")]
        PriceClass200,
        [JsiiEnumMember("PriceClassAll")]
        PriceClassAll
    }
}