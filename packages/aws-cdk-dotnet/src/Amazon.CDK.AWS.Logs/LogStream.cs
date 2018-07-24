using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Logs
{
    /// <summary>A new Log Stream in a Log Group</summary>
    [JsiiClass(typeof(LogStream), "@aws-cdk/aws-logs.LogStream", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"id\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"props\",\"type\":{\"fqn\":\"@aws-cdk/aws-logs.LogStreamProps\"}}]")]
    public class LogStream : Construct
    {
        public LogStream(Construct parent, string id, ILogStreamProps props): base(new DeputyProps(new object[]{parent, id, props}))
        {
        }

        protected LogStream(ByRefValue reference): base(reference)
        {
        }

        protected LogStream(DeputyProps props): base(props)
        {
        }

        /// <summary>The name of this log stream</summary>
        [JsiiProperty("logStreamName", "{\"fqn\":\"@aws-cdk/aws-logs.LogStreamName\"}")]
        public virtual LogStreamName LogStreamName
        {
            get => GetInstanceProperty<LogStreamName>();
        }
    }
}