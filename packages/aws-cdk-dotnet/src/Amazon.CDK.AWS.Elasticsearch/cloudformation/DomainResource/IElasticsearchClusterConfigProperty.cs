using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Elasticsearch.cloudformation.DomainResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticsearch-domain-elasticsearchclusterconfig.html </remarks>
    [JsiiInterface(typeof(IElasticsearchClusterConfigProperty), "@aws-cdk/aws-elasticsearch.cloudformation.DomainResource.ElasticsearchClusterConfigProperty")]
    public interface IElasticsearchClusterConfigProperty
    {
        /// <summary>``DomainResource.ElasticsearchClusterConfigProperty.DedicatedMasterCount``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticsearch-domain-elasticsearchclusterconfig.html#cfn-elasticsearch-domain-elasticseachclusterconfig-dedicatedmastercount </remarks>
        [JsiiProperty("dedicatedMasterCount", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object DedicatedMasterCount
        {
            get;
            set;
        }

        /// <summary>``DomainResource.ElasticsearchClusterConfigProperty.DedicatedMasterEnabled``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticsearch-domain-elasticsearchclusterconfig.html#cfn-elasticsearch-domain-elasticseachclusterconfig-dedicatedmasterenabled </remarks>
        [JsiiProperty("dedicatedMasterEnabled", "{\"union\":{\"types\":[{\"primitive\":\"boolean\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object DedicatedMasterEnabled
        {
            get;
            set;
        }

        /// <summary>``DomainResource.ElasticsearchClusterConfigProperty.DedicatedMasterType``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticsearch-domain-elasticsearchclusterconfig.html#cfn-elasticsearch-domain-elasticseachclusterconfig-dedicatedmastertype </remarks>
        [JsiiProperty("dedicatedMasterType", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object DedicatedMasterType
        {
            get;
            set;
        }

        /// <summary>``DomainResource.ElasticsearchClusterConfigProperty.InstanceCount``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticsearch-domain-elasticsearchclusterconfig.html#cfn-elasticsearch-domain-elasticseachclusterconfig-instancecount </remarks>
        [JsiiProperty("instanceCount", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object InstanceCount
        {
            get;
            set;
        }

        /// <summary>``DomainResource.ElasticsearchClusterConfigProperty.InstanceType``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticsearch-domain-elasticsearchclusterconfig.html#cfn-elasticsearch-domain-elasticseachclusterconfig-instnacetype </remarks>
        [JsiiProperty("instanceType", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object InstanceType
        {
            get;
            set;
        }

        /// <summary>``DomainResource.ElasticsearchClusterConfigProperty.ZoneAwarenessEnabled``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticsearch-domain-elasticsearchclusterconfig.html#cfn-elasticsearch-domain-elasticseachclusterconfig-zoneawarenessenabled </remarks>
        [JsiiProperty("zoneAwarenessEnabled", "{\"union\":{\"types\":[{\"primitive\":\"boolean\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object ZoneAwarenessEnabled
        {
            get;
            set;
        }
    }
}