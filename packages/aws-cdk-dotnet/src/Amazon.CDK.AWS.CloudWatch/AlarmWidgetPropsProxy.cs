using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CloudWatch
{
    /// <summary>Properties for an AlarmWidget</summary>
    [JsiiInterfaceProxy(typeof(IAlarmWidgetProps), "@aws-cdk/aws-cloudwatch.AlarmWidgetProps")]
    internal class AlarmWidgetPropsProxy : DeputyBase, IAlarmWidgetProps
    {
        private AlarmWidgetPropsProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>The alarm to show</summary>
        [JsiiProperty("alarm", "{\"fqn\":\"@aws-cdk/aws-cloudwatch.Alarm\"}")]
        public virtual Alarm Alarm
        {
            get => GetInstanceProperty<Alarm>();
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