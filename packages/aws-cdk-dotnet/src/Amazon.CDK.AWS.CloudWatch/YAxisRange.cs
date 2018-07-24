using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CloudWatch
{
    /// <summary>A minimum and maximum value for either the left or right Y axis</summary>
    public class YAxisRange : DeputyBase, IYAxisRange
    {
        /// <summary>The minimum value</summary>
        /// <remarks>default: Automatic</remarks>
        [JsiiProperty("min", "{\"primitive\":\"number\",\"optional\":true}", true)]
        public double? Min
        {
            get;
            set;
        }

        /// <summary>The maximum value</summary>
        /// <remarks>default: Automatic</remarks>
        [JsiiProperty("max", "{\"primitive\":\"number\",\"optional\":true}", true)]
        public double? Max
        {
            get;
            set;
        }
    }
}