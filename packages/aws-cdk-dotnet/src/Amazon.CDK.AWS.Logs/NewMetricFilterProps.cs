using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Logs
{
    /// <summary>Properties for a MetricFilter created from a LogGroup</summary>
    public class NewMetricFilterProps : DeputyBase, INewMetricFilterProps
    {
        /// <summary>Pattern to search for log events.</summary>
        [JsiiProperty("filterPattern", "{\"fqn\":\"@aws-cdk/aws-logs.IFilterPattern\"}", true)]
        public IIFilterPattern FilterPattern
        {
            get;
            set;
        }

        /// <summary>The namespace of the metric to emit.</summary>
        [JsiiProperty("metricNamespace", "{\"primitive\":\"string\"}", true)]
        public string MetricNamespace
        {
            get;
            set;
        }

        /// <summary>The name of the metric to emit.</summary>
        [JsiiProperty("metricName", "{\"primitive\":\"string\"}", true)]
        public string MetricName
        {
            get;
            set;
        }

        /// <summary>
        /// The value to emit for the metric.
        /// 
        /// Can either be a literal number (typically "1"), or the name of a field in the structure
        /// to take the value from the matched event. If you are using a field value, the field
        /// value must have been matched using the pattern.
        /// 
        /// If you want to specify a field from a matched JSON structure, use '$.fieldName',
        /// and make sure the field is in the pattern (if only as '$.fieldName = *').
        /// 
        /// If you want to specify a field from a matched space-delimited structure,
        /// use '$fieldName'.
        /// </summary>
        /// <remarks>default: "1"</remarks>
        [JsiiProperty("metricValue", "{\"primitive\":\"string\",\"optional\":true}", true)]
        public string MetricValue
        {
            get;
            set;
        }

        /// <summary>The value to emit if the pattern does not match a particular event.</summary>
        /// <remarks>default: No metric emitted.</remarks>
        [JsiiProperty("defaultValue", "{\"primitive\":\"number\",\"optional\":true}", true)]
        public double? DefaultValue
        {
            get;
            set;
        }
    }
}