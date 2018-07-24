using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.ElastiCache
{
    [JsiiClass(typeof(CacheClusterRedisEndpointAddress), "@aws-cdk/aws-elasticache.CacheClusterRedisEndpointAddress", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class CacheClusterRedisEndpointAddress : Token
    {
        public CacheClusterRedisEndpointAddress(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected CacheClusterRedisEndpointAddress(ByRefValue reference): base(reference)
        {
        }

        protected CacheClusterRedisEndpointAddress(DeputyProps props): base(props)
        {
        }
    }
}