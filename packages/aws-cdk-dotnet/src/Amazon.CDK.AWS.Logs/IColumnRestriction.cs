using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Logs
{
    [JsiiInterface(typeof(IColumnRestriction), "@aws-cdk/aws-logs.ColumnRestriction")]
    public interface IColumnRestriction
    {
        /// <summary>Comparison operator to use</summary>
        [JsiiProperty("comparison", "{\"primitive\":\"string\"}")]
        string Comparison
        {
            get;
            set;
        }

        /// <summary>
        /// String value to compare to
        /// 
        /// Exactly one of 'stringValue' and 'numberValue' must be set.
        /// </summary>
        [JsiiProperty("stringValue", "{\"primitive\":\"string\",\"optional\":true}")]
        string StringValue
        {
            get;
            set;
        }

        /// <summary>
        /// Number value to compare to
        /// 
        /// Exactly one of 'stringValue' and 'numberValue' must be set.
        /// </summary>
        [JsiiProperty("numberValue", "{\"primitive\":\"number\",\"optional\":true}")]
        double? NumberValue
        {
            get;
            set;
        }
    }
}