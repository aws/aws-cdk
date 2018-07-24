using Amazon.CDK;
using Amazon.CDK.AWS.Elasticsearch.cloudformation.DomainResource;
using AWS.Jsii.Runtime.Deputy;
using Newtonsoft.Json.Linq;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.Elasticsearch.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticsearch-domain.html </remarks>
    public class DomainResourceProps : DeputyBase, IDomainResourceProps
    {
        /// <summary>``AWS::Elasticsearch::Domain.AccessPolicies``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticsearch-domain.html#cfn-elasticsearch-domain-accesspolicies </remarks>
        [JsiiProperty("accessPolicies", "{\"union\":{\"types\":[{\"primitive\":\"json\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object AccessPolicies
        {
            get;
            set;
        }

        /// <summary>``AWS::Elasticsearch::Domain.AdvancedOptions``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticsearch-domain.html#cfn-elasticsearch-domain-advancedoptions </remarks>
        [JsiiProperty("advancedOptions", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}}}]},\"optional\":true}", true)]
        public object AdvancedOptions
        {
            get;
            set;
        }

        /// <summary>``AWS::Elasticsearch::Domain.DomainName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticsearch-domain.html#cfn-elasticsearch-domain-domainname </remarks>
        [JsiiProperty("domainName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object DomainName
        {
            get;
            set;
        }

        /// <summary>``AWS::Elasticsearch::Domain.EBSOptions``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticsearch-domain.html#cfn-elasticsearch-domain-ebsoptions </remarks>
        [JsiiProperty("ebsOptions", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-elasticsearch.cloudformation.DomainResource.EBSOptionsProperty\"}]},\"optional\":true}", true)]
        public object EbsOptions
        {
            get;
            set;
        }

        /// <summary>``AWS::Elasticsearch::Domain.ElasticsearchClusterConfig``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticsearch-domain.html#cfn-elasticsearch-domain-elasticsearchclusterconfig </remarks>
        [JsiiProperty("elasticsearchClusterConfig", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-elasticsearch.cloudformation.DomainResource.ElasticsearchClusterConfigProperty\"}]},\"optional\":true}", true)]
        public object ElasticsearchClusterConfig
        {
            get;
            set;
        }

        /// <summary>``AWS::Elasticsearch::Domain.ElasticsearchVersion``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticsearch-domain.html#cfn-elasticsearch-domain-elasticsearchversion </remarks>
        [JsiiProperty("elasticsearchVersion", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object ElasticsearchVersion
        {
            get;
            set;
        }

        /// <summary>``AWS::Elasticsearch::Domain.EncryptionAtRestOptions``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticsearch-domain.html#cfn-elasticsearch-domain-encryptionatrestoptions </remarks>
        [JsiiProperty("encryptionAtRestOptions", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-elasticsearch.cloudformation.DomainResource.EncryptionAtRestOptionsProperty\"}]},\"optional\":true}", true)]
        public object EncryptionAtRestOptions
        {
            get;
            set;
        }

        /// <summary>``AWS::Elasticsearch::Domain.SnapshotOptions``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticsearch-domain.html#cfn-elasticsearch-domain-snapshotoptions </remarks>
        [JsiiProperty("snapshotOptions", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-elasticsearch.cloudformation.DomainResource.SnapshotOptionsProperty\"}]},\"optional\":true}", true)]
        public object SnapshotOptions
        {
            get;
            set;
        }

        /// <summary>``AWS::Elasticsearch::Domain.Tags``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticsearch-domain.html#cfn-elasticsearch-domain-tags </remarks>
        [JsiiProperty("tags", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/cdk.Tag\"}]}}}}]},\"optional\":true}", true)]
        public object Tags
        {
            get;
            set;
        }

        /// <summary>``AWS::Elasticsearch::Domain.VPCOptions``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticsearch-domain.html#cfn-elasticsearch-domain-vpcoptions </remarks>
        [JsiiProperty("vpcOptions", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-elasticsearch.cloudformation.DomainResource.VPCOptionsProperty\"}]},\"optional\":true}", true)]
        public object VpcOptions
        {
            get;
            set;
        }
    }
}