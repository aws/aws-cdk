using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Logs
{
    /// <summary>The name of a log stream</summary>
    [JsiiClass(typeof(LogStreamName), "@aws-cdk/aws-logs.LogStreamName", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class LogStreamName : Token
    {
        public LogStreamName(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected LogStreamName(ByRefValue reference): base(reference)
        {
        }

        protected LogStreamName(DeputyProps props): base(props)
        {
        }
    }
}