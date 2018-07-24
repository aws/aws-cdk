using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.ElastiCache
{
    [JsiiClass(typeof(ReplicationGroupConfigurationEndPointPort), "@aws-cdk/aws-elasticache.ReplicationGroupConfigurationEndPointPort", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class ReplicationGroupConfigurationEndPointPort : Token
    {
        public ReplicationGroupConfigurationEndPointPort(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected ReplicationGroupConfigurationEndPointPort(ByRefValue reference): base(reference)
        {
        }

        protected ReplicationGroupConfigurationEndPointPort(DeputyProps props): base(props)
        {
        }
    }
}