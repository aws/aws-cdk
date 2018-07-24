using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CloudWatch
{
    /// <summary>Horizontal annotation to be added to a graph</summary>
    [JsiiInterfaceProxy(typeof(IHorizontalAnnotation), "@aws-cdk/aws-cloudwatch.HorizontalAnnotation")]
    internal class HorizontalAnnotationProxy : DeputyBase, IHorizontalAnnotation
    {
        private HorizontalAnnotationProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>The value of the annotation</summary>
        [JsiiProperty("value", "{\"primitive\":\"number\"}")]
        public virtual double Value
        {
            get => GetInstanceProperty<double>();
            set => SetInstanceProperty(value);
        }

        /// <summary>Label for the annotation</summary>
        /// <remarks>default: No label</remarks>
        [JsiiProperty("label", "{\"primitive\":\"string\",\"optional\":true}")]
        public virtual string Label
        {
            get => GetInstanceProperty<string>();
            set => SetInstanceProperty(value);
        }

        /// <summary>Hex color code to be used for the annotation</summary>
        /// <remarks>default: Automatic color</remarks>
        [JsiiProperty("color", "{\"primitive\":\"string\",\"optional\":true}")]
        public virtual string Color
        {
            get => GetInstanceProperty<string>();
            set => SetInstanceProperty(value);
        }

        /// <summary>Add shading above or below the annotation</summary>
        /// <remarks>default: No shading</remarks>
        [JsiiProperty("fill", "{\"fqn\":\"@aws-cdk/aws-cloudwatch.Shading\",\"optional\":true}")]
        public virtual Shading Fill
        {
            get => GetInstanceProperty<Shading>();
            set => SetInstanceProperty(value);
        }

        /// <summary>Whether the annotation is visible</summary>
        /// <remarks>default: true</remarks>
        [JsiiProperty("visible", "{\"primitive\":\"boolean\",\"optional\":true}")]
        public virtual bool? Visible
        {
            get => GetInstanceProperty<bool? >();
            set => SetInstanceProperty(value);
        }
    }
}