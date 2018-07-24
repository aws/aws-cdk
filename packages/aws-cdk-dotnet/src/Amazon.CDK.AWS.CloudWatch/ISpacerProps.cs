using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CloudWatch
{
    /// <summary>Props of the spacer</summary>
    [JsiiInterface(typeof(ISpacerProps), "@aws-cdk/aws-cloudwatch.SpacerProps")]
    public interface ISpacerProps
    {
        /// <summary>Width of the spacer</summary>
        /// <remarks>default: 1</remarks>
        [JsiiProperty("width", "{\"primitive\":\"number\",\"optional\":true}")]
        double? Width
        {
            get;
            set;
        }

        /// <summary>Height of the spacer</summary>
        /// <remarks>default: : 1</remarks>
        [JsiiProperty("height", "{\"primitive\":\"number\",\"optional\":true}")]
        double? Height
        {
            get;
            set;
        }
    }
}