using Amazon.CDK;
using Amazon.CDK.AWS.ElastiCache;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.ElastiCache.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticache-cache-cluster.html </remarks>
    [JsiiClass(typeof(CacheClusterResource), "@aws-cdk/aws-elasticache.cloudformation.CacheClusterResource", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"properties\",\"type\":{\"fqn\":\"@aws-cdk/aws-elasticache.cloudformation.CacheClusterResourceProps\"}}]")]
    public class CacheClusterResource : Resource
    {
        public CacheClusterResource(Construct parent, string name, ICacheClusterResourceProps properties): base(new DeputyProps(new object[]{parent, name, properties}))
        {
        }

        protected CacheClusterResource(ByRefValue reference): base(reference)
        {
        }

        protected CacheClusterResource(DeputyProps props): base(props)
        {
        }

        /// <summary>The CloudFormation resource type name for this resource class.</summary>
        [JsiiProperty("resourceTypeName", "{\"primitive\":\"string\"}")]
        public static string ResourceTypeName
        {
            get;
        }

        = GetStaticProperty<string>(typeof(CacheClusterResource));
        /// <remarks>cloudformation_attribute: ConfigurationEndpoint.Address</remarks>
        [JsiiProperty("cacheClusterConfigurationEndpointAddress", "{\"fqn\":\"@aws-cdk/aws-elasticache.CacheClusterConfigurationEndpointAddress\"}")]
        public virtual CacheClusterConfigurationEndpointAddress CacheClusterConfigurationEndpointAddress
        {
            get => GetInstanceProperty<CacheClusterConfigurationEndpointAddress>();
        }

        /// <remarks>cloudformation_attribute: ConfigurationEndpoint.Port</remarks>
        [JsiiProperty("cacheClusterConfigurationEndpointPort", "{\"fqn\":\"@aws-cdk/aws-elasticache.CacheClusterConfigurationEndpointPort\"}")]
        public virtual CacheClusterConfigurationEndpointPort CacheClusterConfigurationEndpointPort
        {
            get => GetInstanceProperty<CacheClusterConfigurationEndpointPort>();
        }

        /// <remarks>cloudformation_attribute: RedisEndpoint.Address</remarks>
        [JsiiProperty("cacheClusterRedisEndpointAddress", "{\"fqn\":\"@aws-cdk/aws-elasticache.CacheClusterRedisEndpointAddress\"}")]
        public virtual CacheClusterRedisEndpointAddress CacheClusterRedisEndpointAddress
        {
            get => GetInstanceProperty<CacheClusterRedisEndpointAddress>();
        }

        /// <remarks>cloudformation_attribute: RedisEndpoint.Port</remarks>
        [JsiiProperty("cacheClusterRedisEndpointPort", "{\"fqn\":\"@aws-cdk/aws-elasticache.CacheClusterRedisEndpointPort\"}")]
        public virtual CacheClusterRedisEndpointPort CacheClusterRedisEndpointPort
        {
            get => GetInstanceProperty<CacheClusterRedisEndpointPort>();
        }

        [JsiiMethod("renderProperties", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}}}", "[]")]
        protected override IDictionary<string, object> RenderProperties()
        {
            return InvokeInstanceMethod<IDictionary<string, object>>(new object[]{});
        }
    }
}