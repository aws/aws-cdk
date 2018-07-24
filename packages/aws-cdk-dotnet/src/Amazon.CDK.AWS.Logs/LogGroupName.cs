using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Logs
{
    /// <summary>Name of a log group</summary>
    [JsiiClass(typeof(LogGroupName), "@aws-cdk/aws-logs.LogGroupName", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class LogGroupName : Token
    {
        public LogGroupName(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected LogGroupName(ByRefValue reference): base(reference)
        {
        }

        protected LogGroupName(DeputyProps props): base(props)
        {
        }
    }
}