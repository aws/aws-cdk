using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Logs
{
    /// <summary>Properties for a new LogStream created from a LogGroup</summary>
    [JsiiInterface(typeof(INewLogStreamProps), "@aws-cdk/aws-logs.NewLogStreamProps")]
    public interface INewLogStreamProps
    {
        /// <summary>
        /// The name of the log stream to create.
        /// 
        /// The name must be unique within the log group.
        /// </summary>
        /// <remarks>default: Automatically generated</remarks>
        [JsiiProperty("logStreamName", "{\"primitive\":\"string\",\"optional\":true}")]
        string LogStreamName
        {
            get;
            set;
        }
    }
}