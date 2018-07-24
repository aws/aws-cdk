using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CloudWatch
{
    /// <summary>A minimum and maximum value for either the left or right Y axis</summary>
    [JsiiInterface(typeof(IYAxisRange), "@aws-cdk/aws-cloudwatch.YAxisRange")]
    public interface IYAxisRange
    {
        /// <summary>The minimum value</summary>
        /// <remarks>default: Automatic</remarks>
        [JsiiProperty("min", "{\"primitive\":\"number\",\"optional\":true}")]
        double? Min
        {
            get;
            set;
        }

        /// <summary>The maximum value</summary>
        /// <remarks>default: Automatic</remarks>
        [JsiiProperty("max", "{\"primitive\":\"number\",\"optional\":true}")]
        double? Max
        {
            get;
            set;
        }
    }
}