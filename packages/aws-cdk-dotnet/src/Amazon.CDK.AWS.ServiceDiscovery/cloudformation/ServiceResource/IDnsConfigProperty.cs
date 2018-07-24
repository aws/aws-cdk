using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.ServiceDiscovery.cloudformation.ServiceResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-servicediscovery-service-dnsconfig.html </remarks>
    [JsiiInterface(typeof(IDnsConfigProperty), "@aws-cdk/aws-servicediscovery.cloudformation.ServiceResource.DnsConfigProperty")]
    public interface IDnsConfigProperty
    {
        /// <summary>``ServiceResource.DnsConfigProperty.DnsRecords``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-servicediscovery-service-dnsconfig.html#cfn-servicediscovery-service-dnsconfig-dnsrecords </remarks>
        [JsiiProperty("dnsRecords", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-servicediscovery.cloudformation.ServiceResource.DnsRecordProperty\"}]}}}}]}}")]
        object DnsRecords
        {
            get;
            set;
        }

        /// <summary>``ServiceResource.DnsConfigProperty.NamespaceId``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-servicediscovery-service-dnsconfig.html#cfn-servicediscovery-service-dnsconfig-namespaceid </remarks>
        [JsiiProperty("namespaceId", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object NamespaceId
        {
            get;
            set;
        }
    }
}