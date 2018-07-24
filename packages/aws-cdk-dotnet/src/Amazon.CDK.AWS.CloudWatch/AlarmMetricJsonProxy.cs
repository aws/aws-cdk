using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CloudWatch
{
    /// <summary>Properties used to construct the Metric identifying part of an Alarm</summary>
    [JsiiInterfaceProxy(typeof(IAlarmMetricJson), "@aws-cdk/aws-cloudwatch.AlarmMetricJson")]
    internal class AlarmMetricJsonProxy : DeputyBase, IAlarmMetricJson
    {
        private AlarmMetricJsonProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>The dimensions to apply to the alarm</summary>
        [JsiiProperty("dimensions", "{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"fqn\":\"@aws-cdk/aws-cloudwatch.Dimension\"}},\"optional\":true}")]
        public virtual IDimension[] Dimensions
        {
            get => GetInstanceProperty<IDimension[]>();
            set => SetInstanceProperty(value);
        }

        /// <summary>Namespace of the metric</summary>
        [JsiiProperty("namespace", "{\"primitive\":\"string\"}")]
        public virtual string Namespace
        {
            get => GetInstanceProperty<string>();
            set => SetInstanceProperty(value);
        }

        /// <summary>Name of the metric</summary>
        [JsiiProperty("metricName", "{\"primitive\":\"string\"}")]
        public virtual string MetricName
        {
            get => GetInstanceProperty<string>();
            set => SetInstanceProperty(value);
        }

        /// <summary>How many seconds to aggregate over</summary>
        [JsiiProperty("period", "{\"primitive\":\"number\"}")]
        public virtual double Period
        {
            get => GetInstanceProperty<double>();
            set => SetInstanceProperty(value);
        }

        /// <summary>Simple aggregation function to use</summary>
        [JsiiProperty("statistic", "{\"fqn\":\"@aws-cdk/aws-cloudwatch.Statistic\",\"optional\":true}")]
        public virtual Statistic Statistic
        {
            get => GetInstanceProperty<Statistic>();
            set => SetInstanceProperty(value);
        }

        /// <summary>Percentile aggregation function to use</summary>
        [JsiiProperty("extendedStatistic", "{\"primitive\":\"string\",\"optional\":true}")]
        public virtual string ExtendedStatistic
        {
            get => GetInstanceProperty<string>();
            set => SetInstanceProperty(value);
        }

        /// <summary>The unit of the alarm</summary>
        [JsiiProperty("unit", "{\"fqn\":\"@aws-cdk/aws-cloudwatch.Unit\",\"optional\":true}")]
        public virtual Unit Unit
        {
            get => GetInstanceProperty<Unit>();
            set => SetInstanceProperty(value);
        }
    }
}