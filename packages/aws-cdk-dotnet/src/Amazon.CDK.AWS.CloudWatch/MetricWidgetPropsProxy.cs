using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CloudWatch
{
    /// <summary>Basic properties for widgets that display metrics</summary>
    [JsiiInterfaceProxy(typeof(IMetricWidgetProps), "@aws-cdk/aws-cloudwatch.MetricWidgetProps")]
    internal class MetricWidgetPropsProxy : DeputyBase, IMetricWidgetProps
    {
        private MetricWidgetPropsProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>Title for the graph</summary>
        [JsiiProperty("title", "{\"primitive\":\"string\",\"optional\":true}")]
        public virtual string Title
        {
            get => GetInstanceProperty<string>();
            set => SetInstanceProperty(value);
        }

        /// <summary>The region the metrics of this graph should be taken from</summary>
        /// <remarks>default: Current region</remarks>
        [JsiiProperty("region", "{\"fqn\":\"@aws-cdk/aws-cloudwatch.Region\",\"optional\":true}")]
        public virtual Region Region
        {
            get => GetInstanceProperty<Region>();
            set => SetInstanceProperty(value);
        }

        /// <summary>Width of the widget, in a grid of 24 units wide</summary>
        /// <remarks>default: 6</remarks>
        [JsiiProperty("width", "{\"primitive\":\"number\",\"optional\":true}")]
        public virtual double? Width
        {
            get => GetInstanceProperty<double? >();
            set => SetInstanceProperty(value);
        }

        /// <summary>Height of the widget</summary>
        /// <remarks>default: Depends on the type of widget</remarks>
        [JsiiProperty("height", "{\"primitive\":\"number\",\"optional\":true}")]
        public virtual double? Height
        {
            get => GetInstanceProperty<double? >();
            set => SetInstanceProperty(value);
        }
    }
}