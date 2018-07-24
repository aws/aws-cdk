using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CloudWatch
{
    /// <summary>Props of the spacer</summary>
    public class SpacerProps : DeputyBase, ISpacerProps
    {
        /// <summary>Width of the spacer</summary>
        /// <remarks>default: 1</remarks>
        [JsiiProperty("width", "{\"primitive\":\"number\",\"optional\":true}", true)]
        public double? Width
        {
            get;
            set;
        }

        /// <summary>Height of the spacer</summary>
        /// <remarks>default: : 1</remarks>
        [JsiiProperty("height", "{\"primitive\":\"number\",\"optional\":true}", true)]
        public double? Height
        {
            get;
            set;
        }
    }
}