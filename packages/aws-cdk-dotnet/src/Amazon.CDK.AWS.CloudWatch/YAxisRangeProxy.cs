using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CloudWatch
{
    /// <summary>A minimum and maximum value for either the left or right Y axis</summary>
    [JsiiInterfaceProxy(typeof(IYAxisRange), "@aws-cdk/aws-cloudwatch.YAxisRange")]
    internal class YAxisRangeProxy : DeputyBase, IYAxisRange
    {
        private YAxisRangeProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>The minimum value</summary>
        /// <remarks>default: Automatic</remarks>
        [JsiiProperty("min", "{\"primitive\":\"number\",\"optional\":true}")]
        public virtual double? Min
        {
            get => GetInstanceProperty<double? >();
            set => SetInstanceProperty(value);
        }

        /// <summary>The maximum value</summary>
        /// <remarks>default: Automatic</remarks>
        [JsiiProperty("max", "{\"primitive\":\"number\",\"optional\":true}")]
        public virtual double? Max
        {
            get => GetInstanceProperty<double? >();
            set => SetInstanceProperty(value);
        }
    }
}