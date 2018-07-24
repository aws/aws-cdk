using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.ServiceDiscovery.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicediscovery-publicdnsnamespace.html </remarks>
    [JsiiInterfaceProxy(typeof(IPublicDnsNamespaceResourceProps), "@aws-cdk/aws-servicediscovery.cloudformation.PublicDnsNamespaceResourceProps")]
    internal class PublicDnsNamespaceResourcePropsProxy : DeputyBase, IPublicDnsNamespaceResourceProps
    {
        private PublicDnsNamespaceResourcePropsProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``AWS::ServiceDiscovery::PublicDnsNamespace.Name``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicediscovery-publicdnsnamespace.html#cfn-servicediscovery-publicdnsnamespace-name </remarks>
        [JsiiProperty("publicDnsNamespaceName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object PublicDnsNamespaceName
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``AWS::ServiceDiscovery::PublicDnsNamespace.Description``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicediscovery-publicdnsnamespace.html#cfn-servicediscovery-publicdnsnamespace-description </remarks>
        [JsiiProperty("description", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object Description
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}