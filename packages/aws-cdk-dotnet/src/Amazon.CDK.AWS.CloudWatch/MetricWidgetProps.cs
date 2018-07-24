using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CloudWatch
{
    /// <summary>Basic properties for widgets that display metrics</summary>
    public class MetricWidgetProps : DeputyBase, IMetricWidgetProps
    {
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