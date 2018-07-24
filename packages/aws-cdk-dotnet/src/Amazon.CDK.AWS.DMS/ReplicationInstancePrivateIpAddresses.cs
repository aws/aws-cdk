using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.DMS
{
    [JsiiClass(typeof(ReplicationInstancePrivateIpAddresses), "@aws-cdk/aws-dms.ReplicationInstancePrivateIpAddresses", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class ReplicationInstancePrivateIpAddresses : Token
    {
        public ReplicationInstancePrivateIpAddresses(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected ReplicationInstancePrivateIpAddresses(ByRefValue reference): base(reference)
        {
        }

        protected ReplicationInstancePrivateIpAddresses(DeputyProps props): base(props)
        {
        }
    }
}