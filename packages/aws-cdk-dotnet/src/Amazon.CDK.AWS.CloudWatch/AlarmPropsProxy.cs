using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CloudWatch
{
    /// <summary>Properties for Alarms</summary>
    [JsiiInterfaceProxy(typeof(IAlarmProps), "@aws-cdk/aws-cloudwatch.AlarmProps")]
    internal class AlarmPropsProxy : DeputyBase, IAlarmProps
    {
        private AlarmPropsProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>
        /// The metric to add the alarm on
        /// 
        /// Metric objects can be obtained from most resources, or you can construct
        /// custom Metric objects by instantiating one.
        /// </summary>
        [JsiiProperty("metric", "{\"fqn\":\"@aws-cdk/aws-cloudwatch.Metric\"}")]
        public virtual Metric Metric
        {
            get => GetInstanceProperty<Metric>();
            set => SetInstanceProperty(value);
        }

        /// <summary>Name of the alarm</summary>
        /// <remarks>default: Automatically generated name</remarks>
        [JsiiProperty("alarmName", "{\"primitive\":\"string\",\"optional\":true}")]
        public virtual string AlarmName
        {
            get => GetInstanceProperty<string>();
            set => SetInstanceProperty(value);
        }

        /// <summary>Description for the alarm</summary>
        /// <remarks>default: No description</remarks>
        [JsiiProperty("alarmDescription", "{\"primitive\":\"string\",\"optional\":true}")]
        public virtual string AlarmDescription
        {
            get => GetInstanceProperty<string>();
            set => SetInstanceProperty(value);
        }

        /// <summary>Comparison to use to check if metric is breaching</summary>
        /// <remarks>default: GreaterThanOrEqualToThreshold</remarks>
        [JsiiProperty("comparisonOperator", "{\"fqn\":\"@aws-cdk/aws-cloudwatch.ComparisonOperator\",\"optional\":true}")]
        public virtual ComparisonOperator ComparisonOperator
        {
            get => GetInstanceProperty<ComparisonOperator>();
            set => SetInstanceProperty(value);
        }

        /// <summary>The value against which the specified statistic is compared.</summary>
        [JsiiProperty("threshold", "{\"primitive\":\"number\"}")]
        public virtual double Threshold
        {
            get => GetInstanceProperty<double>();
            set => SetInstanceProperty(value);
        }

        /// <summary>The number of periods over which data is compared to the specified threshold.</summary>
        [JsiiProperty("evaluationPeriods", "{\"primitive\":\"number\"}")]
        public virtual double EvaluationPeriods
        {
            get => GetInstanceProperty<double>();
            set => SetInstanceProperty(value);
        }

        /// <summary>
        /// Specifies whether to evaluate the data and potentially change the alarm
        /// state if there are too few data points to be statistically significant.
        /// 
        /// Used only for alarms that are based on percentiles.
        /// </summary>
        [JsiiProperty("evaluateLowSampleCountPercentile", "{\"primitive\":\"string\",\"optional\":true}")]
        public virtual string EvaluateLowSampleCountPercentile
        {
            get => GetInstanceProperty<string>();
            set => SetInstanceProperty(value);
        }

        /// <summary>Sets how this alarm is to handle missing data points.</summary>
        /// <remarks>default: TreatMissingData.Missing</remarks>
        [JsiiProperty("treatMissingData", "{\"fqn\":\"@aws-cdk/aws-cloudwatch.TreatMissingData\",\"optional\":true}")]
        public virtual TreatMissingData TreatMissingData
        {
            get => GetInstanceProperty<TreatMissingData>();
            set => SetInstanceProperty(value);
        }

        /// <summary>Whether the actions for this alarm are enabled</summary>
        /// <remarks>default: true</remarks>
        [JsiiProperty("actionsEnabled", "{\"primitive\":\"boolean\",\"optional\":true}")]
        public virtual bool? ActionsEnabled
        {
            get => GetInstanceProperty<bool? >();
            set => SetInstanceProperty(value);
        }
    }
}