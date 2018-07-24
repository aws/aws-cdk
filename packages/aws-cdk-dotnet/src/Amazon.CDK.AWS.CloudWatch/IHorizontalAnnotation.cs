using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CloudWatch
{
    /// <summary>Horizontal annotation to be added to a graph</summary>
    [JsiiInterface(typeof(IHorizontalAnnotation), "@aws-cdk/aws-cloudwatch.HorizontalAnnotation")]
    public interface IHorizontalAnnotation
    {
        /// <summary>The value of the annotation</summary>
        [JsiiProperty("value", "{\"primitive\":\"number\"}")]
        double Value
        {
            get;
            set;
        }

        /// <summary>Label for the annotation</summary>
        /// <remarks>default: No label</remarks>
        [JsiiProperty("label", "{\"primitive\":\"string\",\"optional\":true}")]
        string Label
        {
            get;
            set;
        }

        /// <summary>Hex color code to be used for the annotation</summary>
        /// <remarks>default: Automatic color</remarks>
        [JsiiProperty("color", "{\"primitive\":\"string\",\"optional\":true}")]
        string Color
        {
            get;
            set;
        }

        /// <summary>Add shading above or below the annotation</summary>
        /// <remarks>default: No shading</remarks>
        [JsiiProperty("fill", "{\"fqn\":\"@aws-cdk/aws-cloudwatch.Shading\",\"optional\":true}")]
        Shading Fill
        {
            get;
            set;
        }

        /// <summary>Whether the annotation is visible</summary>
        /// <remarks>default: true</remarks>
        [JsiiProperty("visible", "{\"primitive\":\"boolean\",\"optional\":true}")]
        bool? Visible
        {
            get;
            set;
        }
    }
}