using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CloudWatch
{
    /// <summary>Properties used to construct the Metric identifying part of an Alarm</summary>
    [JsiiInterface(typeof(IAlarmMetricJson), "@aws-cdk/aws-cloudwatch.AlarmMetricJson")]
    public interface IAlarmMetricJson
    {
        /// <summary>The dimensions to apply to the alarm</summary>
        [JsiiProperty("dimensions", "{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"fqn\":\"@aws-cdk/aws-cloudwatch.Dimension\"}},\"optional\":true}")]
        IDimension[] Dimensions
        {
            get;
            set;
        }

        /// <summary>Namespace of the metric</summary>
        [JsiiProperty("namespace", "{\"primitive\":\"string\"}")]
        string Namespace
        {
            get;
            set;
        }

        /// <summary>Name of the metric</summary>
        [JsiiProperty("metricName", "{\"primitive\":\"string\"}")]
        string MetricName
        {
            get;
            set;
        }

        /// <summary>How many seconds to aggregate over</summary>
        [JsiiProperty("period", "{\"primitive\":\"number\"}")]
        double Period
        {
            get;
            set;
        }

        /// <summary>Simple aggregation function to use</summary>
        [JsiiProperty("statistic", "{\"fqn\":\"@aws-cdk/aws-cloudwatch.Statistic\",\"optional\":true}")]
        Statistic Statistic
        {
            get;
            set;
        }

        /// <summary>Percentile aggregation function to use</summary>
        [JsiiProperty("extendedStatistic", "{\"primitive\":\"string\",\"optional\":true}")]
        string ExtendedStatistic
        {
            get;
            set;
        }

        /// <summary>The unit of the alarm</summary>
        [JsiiProperty("unit", "{\"fqn\":\"@aws-cdk/aws-cloudwatch.Unit\",\"optional\":true}")]
        Unit Unit
        {
            get;
            set;
        }
    }
}