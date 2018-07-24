using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Logs
{
    [JsiiClass(typeof(DestinationArn), "@aws-cdk/aws-logs.DestinationArn", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class DestinationArn : Arn
    {
        public DestinationArn(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected DestinationArn(ByRefValue reference): base(reference)
        {
        }

        protected DestinationArn(DeputyProps props): base(props)
        {
        }
    }
}