using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Logs
{
    public class ColumnRestriction : DeputyBase, IColumnRestriction
    {
        /// <summary>Comparison operator to use</summary>
        [JsiiProperty("comparison", "{\"primitive\":\"string\"}", true)]
        public string Comparison
        {
            get;
            set;
        }

        /// <summary>
        /// String value to compare to
        /// 
        /// Exactly one of 'stringValue' and 'numberValue' must be set.
        /// </summary>
        [JsiiProperty("stringValue", "{\"primitive\":\"string\",\"optional\":true}", true)]
        public string StringValue
        {
            get;
            set;
        }

        /// <summary>
        /// Number value to compare to
        /// 
        /// Exactly one of 'stringValue' and 'numberValue' must be set.
        /// </summary>
        [JsiiProperty("numberValue", "{\"primitive\":\"number\",\"optional\":true}", true)]
        public double? NumberValue
        {
            get;
            set;
        }
    }
}