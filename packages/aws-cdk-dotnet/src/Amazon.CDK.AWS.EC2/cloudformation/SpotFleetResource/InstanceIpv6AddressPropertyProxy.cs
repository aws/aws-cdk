using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2.cloudformation.SpotFleetResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-spotfleet-instanceipv6address.html </remarks>
    [JsiiInterfaceProxy(typeof(IInstanceIpv6AddressProperty), "@aws-cdk/aws-ec2.cloudformation.SpotFleetResource.InstanceIpv6AddressProperty")]
    internal class InstanceIpv6AddressPropertyProxy : DeputyBase, Amazon.CDK.AWS.EC2.cloudformation.SpotFleetResource.IInstanceIpv6AddressProperty
    {
        private InstanceIpv6AddressPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``SpotFleetResource.InstanceIpv6AddressProperty.Ipv6Address``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-spotfleet-instanceipv6address.html#cfn-ec2-spotfleet-instanceipv6address-ipv6address </remarks>
        [JsiiProperty("ipv6Address", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object Ipv6Address
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}