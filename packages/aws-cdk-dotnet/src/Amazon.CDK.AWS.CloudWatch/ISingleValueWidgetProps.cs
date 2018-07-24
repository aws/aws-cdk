using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CloudWatch
{
    /// <summary>Properties for a SingleValueWidget</summary>
    [JsiiInterface(typeof(ISingleValueWidgetProps), "@aws-cdk/aws-cloudwatch.SingleValueWidgetProps")]
    public interface ISingleValueWidgetProps : IMetricWidgetProps
    {
        /// <summary>Metrics to display</summary>
        [JsiiProperty("metrics", "{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"fqn\":\"@aws-cdk/aws-cloudwatch.Metric\"}}}")]
        Metric[] Metrics
        {
            get;
            set;
        }
    }
}