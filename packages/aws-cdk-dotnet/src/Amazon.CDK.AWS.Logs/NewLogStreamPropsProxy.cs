using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Logs
{
    /// <summary>Properties for a new LogStream created from a LogGroup</summary>
    [JsiiInterfaceProxy(typeof(INewLogStreamProps), "@aws-cdk/aws-logs.NewLogStreamProps")]
    internal class NewLogStreamPropsProxy : DeputyBase, INewLogStreamProps
    {
        private NewLogStreamPropsProxy(ByRefValue reference): base(reference)
        {
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
    }
}