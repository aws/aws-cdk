using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.ElastiCache
{
    [JsiiClass(typeof(CacheClusterConfigurationEndpointAddress), "@aws-cdk/aws-elasticache.CacheClusterConfigurationEndpointAddress", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class CacheClusterConfigurationEndpointAddress : Token
    {
        public CacheClusterConfigurationEndpointAddress(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected CacheClusterConfigurationEndpointAddress(ByRefValue reference): base(reference)
        {
        }

        protected CacheClusterConfigurationEndpointAddress(DeputyProps props): base(props)
        {
        }
    }
}