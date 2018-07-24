using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.ElastiCache
{
    [JsiiClass(typeof(ReplicationGroupReadEndPointAddressesList), "@aws-cdk/aws-elasticache.ReplicationGroupReadEndPointAddressesList", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class ReplicationGroupReadEndPointAddressesList : Token
    {
        public ReplicationGroupReadEndPointAddressesList(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected ReplicationGroupReadEndPointAddressesList(ByRefValue reference): base(reference)
        {
        }

        protected ReplicationGroupReadEndPointAddressesList(DeputyProps props): base(props)
        {
        }
    }
}