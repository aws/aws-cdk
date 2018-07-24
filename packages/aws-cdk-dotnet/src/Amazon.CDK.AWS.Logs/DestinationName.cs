using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Logs
{
    /// <summary>Name of a CloudWatch Destination</summary>
    [JsiiClass(typeof(DestinationName), "@aws-cdk/aws-logs.DestinationName", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class DestinationName : Token
    {
        public DestinationName(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected DestinationName(ByRefValue reference): base(reference)
        {
        }

        protected DestinationName(DeputyProps props): base(props)
        {
        }
    }
}