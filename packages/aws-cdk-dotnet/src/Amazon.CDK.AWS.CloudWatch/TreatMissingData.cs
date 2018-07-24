using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CloudWatch
{
    /// <summary>Specify how missing data points are treated during alarm evaluation</summary>
    [JsiiEnum(typeof(TreatMissingData), "@aws-cdk/aws-cloudwatch.TreatMissingData")]
    public enum TreatMissingData
    {
        [JsiiEnumMember("Breaching")]
        Breaching,
        [JsiiEnumMember("NotBreaching")]
        NotBreaching,
        [JsiiEnumMember("Ignore")]
        Ignore,
        [JsiiEnumMember("Missing")]
        Missing
    }
}