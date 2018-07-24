using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Logs
{
    /// <summary>Properties for a new LogStream</summary>
    [JsiiInterfaceProxy(typeof(ILogStreamProps), "@aws-cdk/aws-logs.LogStreamProps")]
    internal class LogStreamPropsProxy : DeputyBase, ILogStreamProps
    {
        private LogStreamPropsProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>The log group to create a log stream for.</summary>
        [JsiiProperty("logGroup", "{\"fqn\":\"@aws-cdk/aws-logs.LogGroup\"}")]
        public virtual LogGroup LogGroup
        {
            get => GetInstanceProperty<LogGroup>();
            set => SetInstanceProperty(value);
        }

        /// <summary>
        /// The name of the log stream to create.
        /// 
        /// The name must be unique within the log group.
        /// </summary>
        /// <remarks>default: Automatically generated</remarks>
        [JsiiProperty("logStreamName", "{\"primitive\":\"string\",\"optional\":true}")]
        public virtual string LogStreamName
        {
            get => GetInstanceProperty<string>();
            set => SetInstanceProperty(value);
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
        [JsiiProperty("retainLogStream", "{\"primitive\":\"boolean\",\"optional\":true}")]
        public virtual bool? RetainLogStream
        {
            get => GetInstanceProperty<bool? >();
            set => SetInstanceProperty(value);
        }
    }
}