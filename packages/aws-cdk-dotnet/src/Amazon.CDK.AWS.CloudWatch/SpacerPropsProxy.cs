using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CloudWatch
{
    /// <summary>Props of the spacer</summary>
    [JsiiInterfaceProxy(typeof(ISpacerProps), "@aws-cdk/aws-cloudwatch.SpacerProps")]
    internal class SpacerPropsProxy : DeputyBase, ISpacerProps
    {
        private SpacerPropsProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>Width of the spacer</summary>
        /// <remarks>default: 1</remarks>
        [JsiiProperty("width", "{\"primitive\":\"number\",\"optional\":true}")]
        public virtual double? Width
        {
            get => GetInstanceProperty<double? >();
            set => SetInstanceProperty(value);
        }

        /// <summary>Height of the spacer</summary>
        /// <remarks>default: : 1</remarks>
        [JsiiProperty("height", "{\"primitive\":\"number\",\"optional\":true}")]
        public virtual double? Height
        {
            get => GetInstanceProperty<double? >();
            set => SetInstanceProperty(value);
        }
    }
}