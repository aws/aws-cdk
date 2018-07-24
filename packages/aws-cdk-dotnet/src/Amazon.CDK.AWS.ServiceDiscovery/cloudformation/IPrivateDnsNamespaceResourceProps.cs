using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.ServiceDiscovery.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicediscovery-privatednsnamespace.html </remarks>
    [JsiiInterface(typeof(IPrivateDnsNamespaceResourceProps), "@aws-cdk/aws-servicediscovery.cloudformation.PrivateDnsNamespaceResourceProps")]
    public interface IPrivateDnsNamespaceResourceProps
    {
        /// <summary>``AWS::ServiceDiscovery::PrivateDnsNamespace.Name``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicediscovery-privatednsnamespace.html#cfn-servicediscovery-privatednsnamespace-name </remarks>
        [JsiiProperty("privateDnsNamespaceName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object PrivateDnsNamespaceName
        {
            get;
            set;
        }

        /// <summary>``AWS::ServiceDiscovery::PrivateDnsNamespace.Vpc``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicediscovery-privatednsnamespace.html#cfn-servicediscovery-privatednsnamespace-vpc </remarks>
        [JsiiProperty("vpc", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object Vpc
        {
            get;
            set;
        }

        /// <summary>``AWS::ServiceDiscovery::PrivateDnsNamespace.Description``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicediscovery-privatednsnamespace.html#cfn-servicediscovery-privatednsnamespace-description </remarks>
        [JsiiProperty("description", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object Description
        {
            get;
            set;
        }
    }
}