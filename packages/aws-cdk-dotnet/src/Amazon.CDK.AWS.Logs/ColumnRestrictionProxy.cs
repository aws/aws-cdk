using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Logs
{
    [JsiiInterfaceProxy(typeof(IColumnRestriction), "@aws-cdk/aws-logs.ColumnRestriction")]
    internal class ColumnRestrictionProxy : DeputyBase, IColumnRestriction
    {
        private ColumnRestrictionProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>Comparison operator to use</summary>
        [JsiiProperty("comparison", "{\"primitive\":\"string\"}")]
        public virtual string Comparison
        {
            get => GetInstanceProperty<string>();
            set => SetInstanceProperty(value);
        }

        /// <summary>
        /// String value to compare to
        /// 
        /// Exactly one of 'stringValue' and 'numberValue' must be set.
        /// </summary>
        [JsiiProperty("stringValue", "{\"primitive\":\"string\",\"optional\":true}")]
        public virtual string StringValue
        {
            get => GetInstanceProperty<string>();
            set => SetInstanceProperty(value);
        }

        /// <summary>
        /// Number value to compare to
        /// 
        /// Exactly one of 'stringValue' and 'numberValue' must be set.
        /// </summary>
        [JsiiProperty("numberValue", "{\"primitive\":\"number\",\"optional\":true}")]
        public virtual double? NumberValue
        {
            get => GetInstanceProperty<double? >();
            set => SetInstanceProperty(value);
        }
    }
}