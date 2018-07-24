using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Logs
{
    [JsiiClass(typeof(LogGroupArn), "@aws-cdk/aws-logs.LogGroupArn", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class LogGroupArn : Arn
    {
        public LogGroupArn(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected LogGroupArn(ByRefValue reference): base(reference)
        {
        }

        protected LogGroupArn(DeputyProps props): base(props)
        {
        }
    }
}