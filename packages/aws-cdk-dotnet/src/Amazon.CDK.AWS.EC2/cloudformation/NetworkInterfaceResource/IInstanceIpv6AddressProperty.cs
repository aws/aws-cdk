using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2.cloudformation.NetworkInterfaceResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-networkinterface-instanceipv6address.html </remarks>
    [JsiiInterface(typeof(IInstanceIpv6AddressProperty), "@aws-cdk/aws-ec2.cloudformation.NetworkInterfaceResource.InstanceIpv6AddressProperty")]
    public interface IInstanceIpv6AddressProperty
    {
        /// <summary>``NetworkInterfaceResource.InstanceIpv6AddressProperty.Ipv6Address``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-networkinterface-instanceipv6address.html#cfn-ec2-networkinterface-instanceipv6address-ipv6address </remarks>
        [JsiiProperty("ipv6Address", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object Ipv6Address
        {
            get;
            set;
        }
    }
}