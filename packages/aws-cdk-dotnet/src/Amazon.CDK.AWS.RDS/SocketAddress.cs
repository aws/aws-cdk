using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.RDS
{
    /// <summary>A complete socket address (hostname + ":" + port)</summary>
    [JsiiClass(typeof(SocketAddress), "@aws-cdk/aws-rds.SocketAddress", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class SocketAddress : Token
    {
        public SocketAddress(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected SocketAddress(ByRefValue reference): base(reference)
        {
        }

        protected SocketAddress(DeputyProps props): base(props)
        {
        }
    }
}