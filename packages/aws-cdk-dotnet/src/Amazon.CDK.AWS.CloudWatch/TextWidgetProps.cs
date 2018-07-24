using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CloudWatch
{
    /// <summary>Properties for a Text widget</summary>
    public class TextWidgetProps : DeputyBase, ITextWidgetProps
    {
        /// <summary>The text to display, in MarkDown format</summary>
        [JsiiProperty("markdown", "{\"primitive\":\"string\"}", true)]
        public string Markdown
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
        /// <remarks>default: 2</remarks>
        [JsiiProperty("height", "{\"primitive\":\"number\",\"optional\":true}", true)]
        public double? Height
        {
            get;
            set;
        }
    }
}