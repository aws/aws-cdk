using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.DMS
{
    [JsiiClass(typeof(ReplicationInstancePublicIpAddresses), "@aws-cdk/aws-dms.ReplicationInstancePublicIpAddresses", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class ReplicationInstancePublicIpAddresses : Token
    {
        public ReplicationInstancePublicIpAddresses(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected ReplicationInstancePublicIpAddresses(ByRefValue reference): base(reference)
        {
        }

        protected ReplicationInstancePublicIpAddresses(DeputyProps props): base(props)
        {
        }
    }
}