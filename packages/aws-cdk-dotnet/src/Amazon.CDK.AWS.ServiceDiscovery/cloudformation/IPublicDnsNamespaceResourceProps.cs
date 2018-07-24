using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.ServiceDiscovery.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicediscovery-publicdnsnamespace.html </remarks>
    [JsiiInterface(typeof(IPublicDnsNamespaceResourceProps), "@aws-cdk/aws-servicediscovery.cloudformation.PublicDnsNamespaceResourceProps")]
    public interface IPublicDnsNamespaceResourceProps
    {
        /// <summary>``AWS::ServiceDiscovery::PublicDnsNamespace.Name``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicediscovery-publicdnsnamespace.html#cfn-servicediscovery-publicdnsnamespace-name </remarks>
        [JsiiProperty("publicDnsNamespaceName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object PublicDnsNamespaceName
        {
            get;
            set;
        }

        /// <summary>``AWS::ServiceDiscovery::PublicDnsNamespace.Description``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicediscovery-publicdnsnamespace.html#cfn-servicediscovery-publicdnsnamespace-description </remarks>
        [JsiiProperty("description", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object Description
        {
            get;
            set;
        }
    }
}