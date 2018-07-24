using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CloudWatch
{
    /// <summary>Properties used to construct the Metric identifying part of an Alarm</summary>
    public class AlarmMetricJson : DeputyBase, IAlarmMetricJson
    {
        /// <summary>The dimensions to apply to the alarm</summary>
        [JsiiProperty("dimensions", "{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"fqn\":\"@aws-cdk/aws-cloudwatch.Dimension\"}},\"optional\":true}", true)]
        public IDimension[] Dimensions
        {
            get;
            set;
        }

        /// <summary>Namespace of the metric</summary>
        [JsiiProperty("namespace", "{\"primitive\":\"string\"}", true)]
        public string Namespace
        {
            get;
            set;
        }

        /// <summary>Name of the metric</summary>
        [JsiiProperty("metricName", "{\"primitive\":\"string\"}", true)]
        public string MetricName
        {
            get;
            set;
        }

        /// <summary>How many seconds to aggregate over</summary>
        [JsiiProperty("period", "{\"primitive\":\"number\"}", true)]
        public double Period
        {
            get;
            set;
        }

        /// <summary>Simple aggregation function to use</summary>
        [JsiiProperty("statistic", "{\"fqn\":\"@aws-cdk/aws-cloudwatch.Statistic\",\"optional\":true}", true)]
        public Statistic Statistic
        {
            get;
            set;
        }

        /// <summary>Percentile aggregation function to use</summary>
        [JsiiProperty("extendedStatistic", "{\"primitive\":\"string\",\"optional\":true}", true)]
        public string ExtendedStatistic
        {
            get;
            set;
        }

        /// <summary>The unit of the alarm</summary>
        [JsiiProperty("unit", "{\"fqn\":\"@aws-cdk/aws-cloudwatch.Unit\",\"optional\":true}", true)]
        public Unit Unit
        {
            get;
            set;
        }
    }
}