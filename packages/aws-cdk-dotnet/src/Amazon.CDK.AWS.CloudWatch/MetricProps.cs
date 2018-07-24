using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.CloudWatch
{
    /// <summary>Properties for a metric</summary>
    public class MetricProps : DeputyBase, IMetricProps
    {
        /// <summary>Dimensions of the metric</summary>
        /// <remarks>default: No dimensions</remarks>
        [JsiiProperty("dimensions", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}},\"optional\":true}", true)]
        public IDictionary<string, object> Dimensions
        {
            get;
            set;
        }

        /// <summary>Namespace of the metric.</summary>
        [JsiiProperty("namespace", "{\"primitive\":\"string\"}", true)]
        public string Namespace
        {
            get;
            set;
        }

        /// <summary>Name of the metric.</summary>
        [JsiiProperty("metricName", "{\"primitive\":\"string\"}", true)]
        public string MetricName
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
        /// Can be one of the following (case insensitive)
        /// 
        /// - "minimum" | "min"
        /// - "maximum" | "max"
        /// - "average" | "avg"
        /// - "sum"
        /// - "samplecount | "n"
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