using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Logs
{
    /// <summary>Properties for a new LogStream</summary>
    public class LogStreamProps : DeputyBase, ILogStreamProps
    {
        /// <summary>The log group to create a log stream for.</summary>
        [JsiiProperty("logGroup", "{\"fqn\":\"@aws-cdk/aws-logs.LogGroup\"}", true)]
        public LogGroup LogGroup
        {
            get;
            set;
        }

        /// <summary>
        /// The name of the log stream to create.
        /// 
        /// The name must be unique within the log group.
        /// </summary>
        /// <remarks>default: Automatically generated</remarks>
        [JsiiProperty("logStreamName", "{\"primitive\":\"string\",\"optional\":true}", true)]
        public string LogStreamName
        {
            get;
            set;
        }

        /// <summary>
        /// Retain the log stream if the stack or containing construct ceases to exist
        /// 
        /// Normally you want to retain the log stream so you can diagnose issues
        /// from logs even after a deployment that no longer includes the log stream.
        /// 
        /// The date-based retention policy of your log group will age out the logs
        /// after a certain time.
        /// </summary>
        /// <remarks>default: true</remarks>
        [JsiiProperty("retainLogStream", "{\"primitive\":\"boolean\",\"optional\":true}", true)]
        public bool? RetainLogStream
        {
            get;
            set;
        }
    }
}