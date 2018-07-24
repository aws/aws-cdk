using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.ElastiCache
{
    [JsiiClass(typeof(ReplicationGroupReadEndPointPortsList), "@aws-cdk/aws-elasticache.ReplicationGroupReadEndPointPortsList", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class ReplicationGroupReadEndPointPortsList : Token
    {
        public ReplicationGroupReadEndPointPortsList(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected ReplicationGroupReadEndPointPortsList(ByRefValue reference): base(reference)
        {
        }

        protected ReplicationGroupReadEndPointPortsList(DeputyProps props): base(props)
        {
        }
    }
}