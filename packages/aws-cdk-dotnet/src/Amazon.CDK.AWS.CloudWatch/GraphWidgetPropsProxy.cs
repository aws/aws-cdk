using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CloudWatch
{
    /// <summary>Properties for a GraphWidget</summary>
    [JsiiInterfaceProxy(typeof(IGraphWidgetProps), "@aws-cdk/aws-cloudwatch.GraphWidgetProps")]
    internal class GraphWidgetPropsProxy : DeputyBase, IGraphWidgetProps
    {
        private GraphWidgetPropsProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>Metrics to display on left Y axis</summary>
        [JsiiProperty("left", "{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"fqn\":\"@aws-cdk/aws-cloudwatch.Metric\"}},\"optional\":true}")]
        public virtual Metric[] Left
        {
            get => GetInstanceProperty<Metric[]>();
            set => SetInstanceProperty(value);
        }

        /// <summary>Metrics to display on right Y axis</summary>
        [JsiiProperty("right", "{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"fqn\":\"@aws-cdk/aws-cloudwatch.Metric\"}},\"optional\":true}")]
        public virtual Metric[] Right
        {
            get => GetInstanceProperty<Metric[]>();
            set => SetInstanceProperty(value);
        }

        /// <summary>Annotations for the left Y axis</summary>
        [JsiiProperty("leftAnnotations", "{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"fqn\":\"@aws-cdk/aws-cloudwatch.HorizontalAnnotation\"}},\"optional\":true}")]
        public virtual IHorizontalAnnotation[] LeftAnnotations
        {
            get => GetInstanceProperty<IHorizontalAnnotation[]>();
            set => SetInstanceProperty(value);
        }

        /// <summary>Annotations for the right Y axis</summary>
        [JsiiProperty("rightAnnotations", "{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"fqn\":\"@aws-cdk/aws-cloudwatch.HorizontalAnnotation\"}},\"optional\":true}")]
        public virtual IHorizontalAnnotation[] RightAnnotations
        {
            get => GetInstanceProperty<IHorizontalAnnotation[]>();
            set => SetInstanceProperty(value);
        }

        /// <summary>Whether the graph should be shown as stacked lines</summary>
        [JsiiProperty("stacked", "{\"primitive\":\"boolean\",\"optional\":true}")]
        public virtual bool? Stacked
        {
            get => GetInstanceProperty<bool? >();
            set => SetInstanceProperty(value);
        }

        /// <summary>Range of left Y axis</summary>
        /// <remarks>default: 0..automatic</remarks>
        [JsiiProperty("leftAxisRange", "{\"fqn\":\"@aws-cdk/aws-cloudwatch.YAxisRange\",\"optional\":true}")]
        public virtual IYAxisRange LeftAxisRange
        {
            get => GetInstanceProperty<IYAxisRange>();
            set => SetInstanceProperty(value);
        }

        /// <summary>Range of right Y axis</summary>
        /// <remarks>default: 0..automatic</remarks>
        [JsiiProperty("rightAxisRange", "{\"fqn\":\"@aws-cdk/aws-cloudwatch.YAxisRange\",\"optional\":true}")]
        public virtual IYAxisRange RightAxisRange
        {
            get => GetInstanceProperty<IYAxisRange>();
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