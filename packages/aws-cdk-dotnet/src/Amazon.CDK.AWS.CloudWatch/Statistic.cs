using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CloudWatch
{
    /// <summary>Statistic to use over the aggregation period</summary>
    [JsiiEnum(typeof(Statistic), "@aws-cdk/aws-cloudwatch.Statistic")]
    public enum Statistic
    {
        [JsiiEnumMember("SampleCount")]
        SampleCount,
        [JsiiEnumMember("Average")]
        Average,
        [JsiiEnumMember("Sum")]
        Sum,
        [JsiiEnumMember("Minimum")]
        Minimum,
        [JsiiEnumMember("Maximum")]
        Maximum
    }
}