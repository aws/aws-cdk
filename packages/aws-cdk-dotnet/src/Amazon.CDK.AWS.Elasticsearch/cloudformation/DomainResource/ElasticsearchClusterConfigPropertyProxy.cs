using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Elasticsearch.cloudformation.DomainResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticsearch-domain-elasticsearchclusterconfig.html </remarks>
    [JsiiInterfaceProxy(typeof(IElasticsearchClusterConfigProperty), "@aws-cdk/aws-elasticsearch.cloudformation.DomainResource.ElasticsearchClusterConfigProperty")]
    internal class ElasticsearchClusterConfigPropertyProxy : DeputyBase, IElasticsearchClusterConfigProperty
    {
        private ElasticsearchClusterConfigPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``DomainResource.ElasticsearchClusterConfigProperty.DedicatedMasterCount``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticsearch-domain-elasticsearchclusterconfig.html#cfn-elasticsearch-domain-elasticseachclusterconfig-dedicatedmastercount </remarks>
        [JsiiProperty("dedicatedMasterCount", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object DedicatedMasterCount
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``DomainResource.ElasticsearchClusterConfigProperty.DedicatedMasterEnabled``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticsearch-domain-elasticsearchclusterconfig.html#cfn-elasticsearch-domain-elasticseachclusterconfig-dedicatedmasterenabled </remarks>
        [JsiiProperty("dedicatedMasterEnabled", "{\"union\":{\"types\":[{\"primitive\":\"boolean\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object DedicatedMasterEnabled
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``DomainResource.ElasticsearchClusterConfigProperty.DedicatedMasterType``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticsearch-domain-elasticsearchclusterconfig.html#cfn-elasticsearch-domain-elasticseachclusterconfig-dedicatedmastertype </remarks>
        [JsiiProperty("dedicatedMasterType", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object DedicatedMasterType
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``DomainResource.ElasticsearchClusterConfigProperty.InstanceCount``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticsearch-domain-elasticsearchclusterconfig.html#cfn-elasticsearch-domain-elasticseachclusterconfig-instancecount </remarks>
        [JsiiProperty("instanceCount", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object InstanceCount
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``DomainResource.ElasticsearchClusterConfigProperty.InstanceType``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticsearch-domain-elasticsearchclusterconfig.html#cfn-elasticsearch-domain-elasticseachclusterconfig-instnacetype </remarks>
        [JsiiProperty("instanceType", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object InstanceType
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``DomainResource.ElasticsearchClusterConfigProperty.ZoneAwarenessEnabled``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticsearch-domain-elasticsearchclusterconfig.html#cfn-elasticsearch-domain-elasticseachclusterconfig-zoneawarenessenabled </remarks>
        [JsiiProperty("zoneAwarenessEnabled", "{\"union\":{\"types\":[{\"primitive\":\"boolean\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object ZoneAwarenessEnabled
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}