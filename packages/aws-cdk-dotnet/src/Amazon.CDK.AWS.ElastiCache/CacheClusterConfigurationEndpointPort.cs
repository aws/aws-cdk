using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.ElastiCache
{
    [JsiiClass(typeof(CacheClusterConfigurationEndpointPort), "@aws-cdk/aws-elasticache.CacheClusterConfigurationEndpointPort", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class CacheClusterConfigurationEndpointPort : Token
    {
        public CacheClusterConfigurationEndpointPort(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected CacheClusterConfigurationEndpointPort(ByRefValue reference): base(reference)
        {
        }

        protected CacheClusterConfigurationEndpointPort(DeputyProps props): base(props)
        {
        }
    }
}