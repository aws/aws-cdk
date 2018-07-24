using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.ServiceDiscovery.cloudformation.ServiceResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-servicediscovery-service-dnsrecord.html </remarks>
    [JsiiInterface(typeof(IDnsRecordProperty), "@aws-cdk/aws-servicediscovery.cloudformation.ServiceResource.DnsRecordProperty")]
    public interface IDnsRecordProperty
    {
        /// <summary>``ServiceResource.DnsRecordProperty.TTL``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-servicediscovery-service-dnsrecord.html#cfn-servicediscovery-service-dnsrecord-ttl </remarks>
        [JsiiProperty("ttl", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object Ttl
        {
            get;
            set;
        }

        /// <summary>``ServiceResource.DnsRecordProperty.Type``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-servicediscovery-service-dnsrecord.html#cfn-servicediscovery-service-dnsrecord-type </remarks>
        [JsiiProperty("type", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object Type
        {
            get;
            set;
        }
    }
}