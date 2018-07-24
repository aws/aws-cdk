using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.CloudWatch
{
    /// <summary>Properties of a metric that can be changed</summary>
    public class MetricCustomization : DeputyBase, IMetricCustomization
    {
        /// <summary>Dimensions of the metric</summary>
        /// <remarks>default: No dimensions</remarks>
        [JsiiProperty("dimensions", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}},\"optional\":true}", true)]
        public IDictionary<string, object> Dimensions
        {
            get;
            set;
        }

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

        /// <summary>Unit for the metric that is associated with the alarm</summary>
        [JsiiProperty("unit", "{\"fqn\":\"@aws-cdk/aws-cloudwatch.Unit\",\"optional\":true}", true)]
        public Unit Unit
        {
            get;
            set;
        }

        /// <summary>Label for this metric when added to a Graph in a Dashboard</summary>
        [JsiiProperty("label", "{\"primitive\":\"string\",\"optional\":true}", true)]
        public string Label
        {
            get;
            set;
        }

        /// <summary>Color for this metric when added to a Graph in a Dashboard</summary>
        [JsiiProperty("color", "{\"primitive\":\"string\",\"optional\":true}", true)]
        public string Color
        {
            get;
            set;
        }
    }
}