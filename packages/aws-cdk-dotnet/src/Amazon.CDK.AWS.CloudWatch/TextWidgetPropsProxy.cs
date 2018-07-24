using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CloudWatch
{
    /// <summary>Properties for a Text widget</summary>
    [JsiiInterfaceProxy(typeof(ITextWidgetProps), "@aws-cdk/aws-cloudwatch.TextWidgetProps")]
    internal class TextWidgetPropsProxy : DeputyBase, ITextWidgetProps
    {
        private TextWidgetPropsProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>The text to display, in MarkDown format</summary>
        [JsiiProperty("markdown", "{\"primitive\":\"string\"}")]
        public virtual string Markdown
        {
            get => GetInstanceProperty<string>();
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
        /// <remarks>default: 2</remarks>
        [JsiiProperty("height", "{\"primitive\":\"number\",\"optional\":true}")]
        public virtual double? Height
        {
            get => GetInstanceProperty<double? >();
            set => SetInstanceProperty(value);
        }
    }
}