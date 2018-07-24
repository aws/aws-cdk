using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CloudWatch
{
    /// <summary>Properties to make an alarm from a metric</summary>
    public class NewAlarmProps : DeputyBase, INewAlarmProps
    {
        /// <summary>
        /// The period over which the specified statistic is applied.
        /// 
        /// Specify time in seconds, in multiples of 60.
        /// </summary>
        /// <remarks>default: 300</remarks>
        [JsiiProperty("periodSec", "{\"primitive\":\"number\",\"optional\":true}", true)]
        public double? PeriodSec
        {
            get;
            set;
        }

        /// <summary>
        /// What function to use for aggregating.
        /// 
        /// Can be one of the following:
        /// 
        /// - "Minimum" | "min"
        /// - "Maximum" | "max"
        /// - "Average" | "avg"
        /// - "Sum" | "sum"
        /// - "SampleCount | "n"
        /// - "pNN.NN"
        /// </summary>
        /// <remarks>default: Average</remarks>
        [JsiiProperty("statistic", "{\"primitive\":\"string\",\"optional\":true}", true)]
        public string Statistic
        {
            get;
            set;
        }

        /// <summary>Name of the alarm</summary>
        /// <remarks>default: Automatically generated name</remarks>
        [JsiiProperty("alarmName", "{\"primitive\":\"string\",\"optional\":true}", true)]
        public string AlarmName
        {
            get;
            set;
        }

        /// <summary>Description for the alarm</summary>
        /// <remarks>default: No description</remarks>
        [JsiiProperty("alarmDescription", "{\"primitive\":\"string\",\"optional\":true}", true)]
        public string AlarmDescription
        {
            get;
            set;
        }

        /// <summary>Comparison to use to check if metric is breaching</summary>
        /// <remarks>default: GreaterThanOrEqualToThreshold</remarks>
        [JsiiProperty("comparisonOperator", "{\"fqn\":\"@aws-cdk/aws-cloudwatch.ComparisonOperator\",\"optional\":true}", true)]
        public ComparisonOperator ComparisonOperator
        {
            get;
            set;
        }

        /// <summary>The value against which the specified statistic is compared.</summary>
        [JsiiProperty("threshold", "{\"primitive\":\"number\"}", true)]
        public double Threshold
        {
            get;
            set;
        }

        /// <summary>The number of periods over which data is compared to the specified threshold.</summary>
        [JsiiProperty("evaluationPeriods", "{\"primitive\":\"number\"}", true)]
        public double EvaluationPeriods
        {
            get;
            set;
        }

        /// <summary>
        /// Specifies whether to evaluate the data and potentially change the alarm state if there are too few data points to be statistically significant.
        /// 
        /// Used only for alarms that are based on percentiles.
        /// </summary>
        [JsiiProperty("evaluateLowSampleCountPercentile", "{\"primitive\":\"string\",\"optional\":true}", true)]
        public string EvaluateLowSampleCountPercentile
        {
            get;
            set;
        }

        /// <summary>Sets how this alarm is to handle missing data points.</summary>
        /// <remarks>default: TreatMissingData.Missing</remarks>
        [JsiiProperty("treatMissingData", "{\"fqn\":\"@aws-cdk/aws-cloudwatch.TreatMissingData\",\"optional\":true}", true)]
        public TreatMissingData TreatMissingData
        {
            get;
            set;
        }

        /// <summary>Whether the actions for this alarm are enabled</summary>
        /// <remarks>default: true</remarks>
        [JsiiProperty("actionsEnabled", "{\"primitive\":\"boolean\",\"optional\":true}", true)]
        public bool? ActionsEnabled
        {
            get;
            set;
        }
    }
}