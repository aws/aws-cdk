using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CloudWatch
{
    /// <summary>Properties for a SingleValueWidget</summary>
    [JsiiInterfaceProxy(typeof(ISingleValueWidgetProps), "@aws-cdk/aws-cloudwatch.SingleValueWidgetProps")]
    internal class SingleValueWidgetPropsProxy : DeputyBase, ISingleValueWidgetProps
    {
        private SingleValueWidgetPropsProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>Metrics to display</summary>
        [JsiiProperty("metrics", "{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"fqn\":\"@aws-cdk/aws-cloudwatch.Metric\"}}}")]
        public virtual Metric[] Metrics
        {
            get => GetInstanceProperty<Metric[]>();
            set => SetInstanceProperty(value);
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