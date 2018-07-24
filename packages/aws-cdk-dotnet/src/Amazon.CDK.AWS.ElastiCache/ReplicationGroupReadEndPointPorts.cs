using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.ElastiCache
{
    [JsiiClass(typeof(ReplicationGroupReadEndPointPorts), "@aws-cdk/aws-elasticache.ReplicationGroupReadEndPointPorts", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class ReplicationGroupReadEndPointPorts : Token
    {
        public ReplicationGroupReadEndPointPorts(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected ReplicationGroupReadEndPointPorts(ByRefValue reference): base(reference)
        {
        }

        protected ReplicationGroupReadEndPointPorts(DeputyProps props): base(props)
        {
        }
    }
}