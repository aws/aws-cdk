using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Logs
{
    /// <summary>Properties for a new LogGroup</summary>
    [JsiiInterface(typeof(ILogGroupProps), "@aws-cdk/aws-logs.LogGroupProps")]
    public interface ILogGroupProps
    {
        /// <summary>Name of the log group.</summary>
        /// <remarks>default: Automatically generated</remarks>
        [JsiiProperty("logGroupName", "{\"primitive\":\"string\",\"optional\":true}")]
        string LogGroupName
        {
            get;
            set;
        }

        /// <summary>
        /// How long, in days, the log contents will be retained.
        /// 
        /// To retain all logs, set this value to Infinity.
        /// </summary>
        /// <remarks>default: 730 days (2 years)</remarks>
        [JsiiProperty("retentionDays", "{\"primitive\":\"number\",\"optional\":true}")]
        double? RetentionDays
        {
            get;
            set;
        }

        /// <summary>
        /// Retain the log group if the stack or containing construct ceases to exist
        /// 
        /// Normally you want to retain the log group so you can diagnose issues
        /// from logs even after a deployment that no longer includes the log group.
        /// In that case, use the normal date-based retention policy to age out your
        /// logs.
        /// </summary>
        /// <remarks>default: true</remarks>
        [JsiiProperty("retainLogGroup", "{\"primitive\":\"boolean\",\"optional\":true}")]
        bool? RetainLogGroup
        {
            get;
            set;
        }
    }
}