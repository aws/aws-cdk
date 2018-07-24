using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.ElastiCache
{
    [JsiiClass(typeof(ReplicationGroupConfigurationEndPointAddress), "@aws-cdk/aws-elasticache.ReplicationGroupConfigurationEndPointAddress", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class ReplicationGroupConfigurationEndPointAddress : Token
    {
        public ReplicationGroupConfigurationEndPointAddress(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected ReplicationGroupConfigurationEndPointAddress(ByRefValue reference): base(reference)
        {
        }

        protected ReplicationGroupConfigurationEndPointAddress(DeputyProps props): base(props)
        {
        }
    }
}