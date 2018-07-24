using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.ElastiCache
{
    [JsiiClass(typeof(CacheClusterRedisEndpointPort), "@aws-cdk/aws-elasticache.CacheClusterRedisEndpointPort", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class CacheClusterRedisEndpointPort : Token
    {
        public CacheClusterRedisEndpointPort(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected CacheClusterRedisEndpointPort(ByRefValue reference): base(reference)
        {
        }

        protected CacheClusterRedisEndpointPort(DeputyProps props): base(props)
        {
        }
    }
}