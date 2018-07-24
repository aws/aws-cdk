using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.ElastiCache
{
    [JsiiClass(typeof(ReplicationGroupReadEndPointAddresses), "@aws-cdk/aws-elasticache.ReplicationGroupReadEndPointAddresses", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class ReplicationGroupReadEndPointAddresses : Token
    {
        public ReplicationGroupReadEndPointAddresses(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected ReplicationGroupReadEndPointAddresses(ByRefValue reference): base(reference)
        {
        }

        protected ReplicationGroupReadEndPointAddresses(DeputyProps props): base(props)
        {
        }
    }
}