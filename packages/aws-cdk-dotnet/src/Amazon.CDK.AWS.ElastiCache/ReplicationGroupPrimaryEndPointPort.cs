using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.ElastiCache
{
    [JsiiClass(typeof(ReplicationGroupPrimaryEndPointPort), "@aws-cdk/aws-elasticache.ReplicationGroupPrimaryEndPointPort", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class ReplicationGroupPrimaryEndPointPort : Token
    {
        public ReplicationGroupPrimaryEndPointPort(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected ReplicationGroupPrimaryEndPointPort(ByRefValue reference): base(reference)
        {
        }

        protected ReplicationGroupPrimaryEndPointPort(DeputyProps props): base(props)
        {
        }
    }
}