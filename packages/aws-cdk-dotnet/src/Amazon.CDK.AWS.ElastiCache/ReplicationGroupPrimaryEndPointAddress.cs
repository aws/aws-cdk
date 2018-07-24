using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.ElastiCache
{
    [JsiiClass(typeof(ReplicationGroupPrimaryEndPointAddress), "@aws-cdk/aws-elasticache.ReplicationGroupPrimaryEndPointAddress", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class ReplicationGroupPrimaryEndPointAddress : Token
    {
        public ReplicationGroupPrimaryEndPointAddress(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected ReplicationGroupPrimaryEndPointAddress(ByRefValue reference): base(reference)
        {
        }

        protected ReplicationGroupPrimaryEndPointAddress(DeputyProps props): base(props)
        {
        }
    }
}