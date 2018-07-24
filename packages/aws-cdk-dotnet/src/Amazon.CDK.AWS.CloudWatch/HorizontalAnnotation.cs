using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CloudWatch
{
    /// <summary>Horizontal annotation to be added to a graph</summary>
    public class HorizontalAnnotation : DeputyBase, IHorizontalAnnotation
    {
        /// <summary>The value of the annotation</summary>
        [JsiiProperty("value", "{\"primitive\":\"number\"}", true)]
        public double Value
        {
            get;
            set;
        }

        /// <summary>Label for the annotation</summary>
        /// <remarks>default: No label</remarks>
        [JsiiProperty("label", "{\"primitive\":\"string\",\"optional\":true}", true)]
        public string Label
        {
            get;
            set;
        }

        /// <summary>Hex color code to be used for the annotation</summary>
        /// <remarks>default: Automatic color</remarks>
        [JsiiProperty("color", "{\"primitive\":\"string\",\"optional\":true}", true)]
        public string Color
        {
            get;
            set;
        }

        /// <summary>Add shading above or below the annotation</summary>
        /// <remarks>default: No shading</remarks>
        [JsiiProperty("fill", "{\"fqn\":\"@aws-cdk/aws-cloudwatch.Shading\",\"optional\":true}", true)]
        public Shading Fill
        {
            get;
            set;
        }

        /// <summary>Whether the annotation is visible</summary>
        /// <remarks>default: true</remarks>
        [JsiiProperty("visible", "{\"primitive\":\"boolean\",\"optional\":true}", true)]
        public bool? Visible
        {
            get;
            set;
        }
    }
}