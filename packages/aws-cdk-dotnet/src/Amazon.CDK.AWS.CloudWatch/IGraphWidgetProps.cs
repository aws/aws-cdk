using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CloudWatch
{
    /// <summary>Properties for a GraphWidget</summary>
    [JsiiInterface(typeof(IGraphWidgetProps), "@aws-cdk/aws-cloudwatch.GraphWidgetProps")]
    public interface IGraphWidgetProps : IMetricWidgetProps
    {
        /// <summary>Metrics to display on left Y axis</summary>
        [JsiiProperty("left", "{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"fqn\":\"@aws-cdk/aws-cloudwatch.Metric\"}},\"optional\":true}")]
        Metric[] Left
        {
            get;
            set;
        }

        /// <summary>Metrics to display on right Y axis</summary>
        [JsiiProperty("right", "{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"fqn\":\"@aws-cdk/aws-cloudwatch.Metric\"}},\"optional\":true}")]
        Metric[] Right
        {
            get;
            set;
        }

        /// <summary>Annotations for the left Y axis</summary>
        [JsiiProperty("leftAnnotations", "{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"fqn\":\"@aws-cdk/aws-cloudwatch.HorizontalAnnotation\"}},\"optional\":true}")]
        IHorizontalAnnotation[] LeftAnnotations
        {
            get;
            set;
        }

        /// <summary>Annotations for the right Y axis</summary>
        [JsiiProperty("rightAnnotations", "{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"fqn\":\"@aws-cdk/aws-cloudwatch.HorizontalAnnotation\"}},\"optional\":true}")]
        IHorizontalAnnotation[] RightAnnotations
        {
            get;
            set;
        }

        /// <summary>Whether the graph should be shown as stacked lines</summary>
        [JsiiProperty("stacked", "{\"primitive\":\"boolean\",\"optional\":true}")]
        bool? Stacked
        {
            get;
            set;
        }

        /// <summary>Range of left Y axis</summary>
        /// <remarks>default: 0..automatic</remarks>
        [JsiiProperty("leftAxisRange", "{\"fqn\":\"@aws-cdk/aws-cloudwatch.YAxisRange\",\"optional\":true}")]
        IYAxisRange LeftAxisRange
        {
            get;
            set;
        }

        /// <summary>Range of right Y axis</summary>
        /// <remarks>default: 0..automatic</remarks>
        [JsiiProperty("rightAxisRange", "{\"fqn\":\"@aws-cdk/aws-cloudwatch.YAxisRange\",\"optional\":true}")]
        IYAxisRange RightAxisRange
        {
            get;
            set;
        }
    }
}