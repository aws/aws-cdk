using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CloudWatch
{
    /// <summary>Metric dimension</summary>
    [JsiiInterface(typeof(IDimension), "@aws-cdk/aws-cloudwatch.Dimension")]
    public interface IDimension
    {
        /// <summary>Name of the dimension</summary>
        [JsiiProperty("name", "{\"primitive\":\"string\"}")]
        string Name
        {
            get;
            set;
        }

        /// <summary>Value of the dimension</summary>
        [JsiiProperty("value", "{\"primitive\":\"any\"}")]
        object Value
        {
            get;
            set;
        }
    }
}