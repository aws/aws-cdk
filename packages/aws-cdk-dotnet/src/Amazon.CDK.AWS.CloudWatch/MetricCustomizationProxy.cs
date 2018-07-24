using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.CloudWatch
{
    /// <summary>Properties of a metric that can be changed</summary>
    [JsiiInterfaceProxy(typeof(IMetricCustomization), "@aws-cdk/aws-cloudwatch.MetricCustomization")]
    internal class MetricCustomizationProxy : DeputyBase, IMetricCustomization
    {
        private MetricCustomizationProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>Dimensions of the metric</summary>
        /// <remarks>default: No dimensions</remarks>
        [JsiiProperty("dimensions", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}},\"optional\":true}")]
        public virtual IDictionary<string, object> Dimensions
        {
            get => GetInstanceProperty<IDictionary<string, object>>();
            set => SetInstanceProperty(value);
        }

        /// <summary>
        /// The period over which the specified statistic is applied.
        /// 
        /// Specify time in seconds, in multiples of 60.
        /// </summary>
        /// <remarks>default: 300</remarks>
        [JsiiProperty("periodSec", "{\"primitive\":\"number\",\"optional\":true}")]
        public virtual double? PeriodSec
        {
            get => GetInstanceProperty<double? >();
            set => SetInstanceProperty(value);
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
        [JsiiProperty("statistic", "{\"primitive\":\"string\",\"optional\":true}")]
        public virtual string Statistic
        {
            get => GetInstanceProperty<string>();
            set => SetInstanceProperty(value);
        }

        /// <summary>Unit for the metric that is associated with the alarm</summary>
        [JsiiProperty("unit", "{\"fqn\":\"@aws-cdk/aws-cloudwatch.Unit\",\"optional\":true}")]
        public virtual Unit Unit
        {
            get => GetInstanceProperty<Unit>();
            set => SetInstanceProperty(value);
        }

        /// <summary>Label for this metric when added to a Graph in a Dashboard</summary>
        [JsiiProperty("label", "{\"primitive\":\"string\",\"optional\":true}")]
        public virtual string Label
        {
            get => GetInstanceProperty<string>();
            set => SetInstanceProperty(value);
        }

        /// <summary>Color for this metric when added to a Graph in a Dashboard</summary>
        [JsiiProperty("color", "{\"primitive\":\"string\",\"optional\":true}")]
        public virtual string Color
        {
            get => GetInstanceProperty<string>();
            set => SetInstanceProperty(value);
        }
    }
}