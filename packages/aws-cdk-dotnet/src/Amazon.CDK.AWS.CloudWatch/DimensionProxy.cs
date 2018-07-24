using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CloudWatch
{
    /// <summary>Metric dimension</summary>
    [JsiiInterfaceProxy(typeof(IDimension), "@aws-cdk/aws-cloudwatch.Dimension")]
    internal class DimensionProxy : DeputyBase, IDimension
    {
        private DimensionProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>Name of the dimension</summary>
        [JsiiProperty("name", "{\"primitive\":\"string\"}")]
        public virtual string Name
        {
            get => GetInstanceProperty<string>();
            set => SetInstanceProperty(value);
        }

        /// <summary>Value of the dimension</summary>
        [JsiiProperty("value", "{\"primitive\":\"any\"}")]
        public virtual object Value
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}