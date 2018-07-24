using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CloudWatch
{
    /// <summary>Properties for a GraphWidget</summary>
    public class GraphWidgetProps : DeputyBase, IGraphWidgetProps
    {
        /// <summary>Metrics to display on left Y axis</summary>
        [JsiiProperty("left", "{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"fqn\":\"@aws-cdk/aws-cloudwatch.Metric\"}},\"optional\":true}", true)]
        public Metric[] Left
        {
            get;
            set;
        }

        /// <summary>Metrics to display on right Y axis</summary>
        [JsiiProperty("right", "{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"fqn\":\"@aws-cdk/aws-cloudwatch.Metric\"}},\"optional\":true}", true)]
        public Metric[] Right
        {
            get;
            set;
        }

        /// <summary>Annotations for the left Y axis</summary>
        [JsiiProperty("leftAnnotations", "{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"fqn\":\"@aws-cdk/aws-cloudwatch.HorizontalAnnotation\"}},\"optional\":true}", true)]
        public IHorizontalAnnotation[] LeftAnnotations
        {
            get;
            set;
        }

        /// <summary>Annotations for the right Y axis</summary>
        [JsiiProperty("rightAnnotations", "{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"fqn\":\"@aws-cdk/aws-cloudwatch.HorizontalAnnotation\"}},\"optional\":true}", true)]
        public IHorizontalAnnotation[] RightAnnotations
        {
            get;
            set;
        }

        /// <summary>Whether the graph should be shown as stacked lines</summary>
        [JsiiProperty("stacked", "{\"primitive\":\"boolean\",\"optional\":true}", true)]
        public bool? Stacked
        {
            get;
            set;
        }

        /// <summary>Range of left Y axis</summary>
        /// <remarks>default: 0..automatic</remarks>
        [JsiiProperty("leftAxisRange", "{\"fqn\":\"@aws-cdk/aws-cloudwatch.YAxisRange\",\"optional\":true}", true)]
        public IYAxisRange LeftAxisRange
        {
            get;
            set;
        }

        /// <summary>Range of right Y axis</summary>
        /// <remarks>default: 0..automatic</remarks>
        [JsiiProperty("rightAxisRange", "{\"fqn\":\"@aws-cdk/aws-cloudwatch.YAxisRange\",\"optional\":true}", true)]
        public IYAxisRange RightAxisRange
        {
            get;
            set;
        }

        /// <summary>Title for the graph</summary>
        [JsiiProperty("title", "{\"primitive\":\"string\",\"optional\":true}", true)]
        public string Title
        {
            get;
            set;
        }

        /// <summary>The region the metrics of this graph should be taken from</summary>
        /// <remarks>default: Current region</remarks>
        [JsiiProperty("region", "{\"fqn\":\"@aws-cdk/aws-cloudwatch.Region\",\"optional\":true}", true)]
        public Region Region
        {
            get;
            set;
        }

        /// <summary>Width of the widget, in a grid of 24 units wide</summary>
        /// <remarks>default: 6</remarks>
        [JsiiProperty("width", "{\"primitive\":\"number\",\"optional\":true}", true)]
        public double? Width
        {
            get;
            set;
        }

        /// <summary>Height of the widget</summary>
        /// <remarks>default: Depends on the type of widget</remarks>
        [JsiiProperty("height", "{\"primitive\":\"number\",\"optional\":true}", true)]
        public double? Height
        {
            get;
            set;
        }
    }
}