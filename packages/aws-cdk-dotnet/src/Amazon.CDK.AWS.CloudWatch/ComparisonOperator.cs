using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CloudWatch
{
    /// <summary>Comparison operator for evaluating alarms</summary>
    [JsiiEnum(typeof(ComparisonOperator), "@aws-cdk/aws-cloudwatch.ComparisonOperator")]
    public enum ComparisonOperator
    {
        [JsiiEnumMember("GreaterThanOrEqualToThreshold")]
        GreaterThanOrEqualToThreshold,
        [JsiiEnumMember("GreaterThanThreshold")]
        GreaterThanThreshold,
        [JsiiEnumMember("LessThanThreshold")]
        LessThanThreshold,
        [JsiiEnumMember("LessThanOrEqualToThreshold")]
        LessThanOrEqualToThreshold
    }
}