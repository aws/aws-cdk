using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2.cloudformation.InstanceResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-network-iface-embedded.html </remarks>
    public class NetworkInterfaceProperty : DeputyBase, Amazon.CDK.AWS.EC2.cloudformation.InstanceResource.INetworkInterfaceProperty
    {
        /// <summary>``InstanceResource.NetworkInterfaceProperty.AssociatePublicIpAddress``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-network-iface-embedded.html#aws-properties-ec2-network-iface-embedded-associatepubip </remarks>
        [JsiiProperty("associatePublicIpAddress", "{\"union\":{\"types\":[{\"primitive\":\"boolean\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object AssociatePublicIpAddress
        {
            get;
            set;
        }

        /// <summary>``InstanceResource.NetworkInterfaceProperty.DeleteOnTermination``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-network-iface-embedded.html#aws-properties-ec2-network-iface-embedded-delete </remarks>
        [JsiiProperty("deleteOnTermination", "{\"union\":{\"types\":[{\"primitive\":\"boolean\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object DeleteOnTermination
        {
            get;
            set;
        }

        /// <summary>``InstanceResource.NetworkInterfaceProperty.Description``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-network-iface-embedded.html#aws-properties-ec2-network-iface-embedded-description </remarks>
        [JsiiProperty("description", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object Description
        {
            get;
            set;
        }

        /// <summary>``InstanceResource.NetworkInterfaceProperty.DeviceIndex``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-network-iface-embedded.html#aws-properties-ec2-network-iface-embedded-deviceindex </remarks>
        [JsiiProperty("deviceIndex", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}", true)]
        public object DeviceIndex
        {
            get;
            set;
        }

        /// <summary>``InstanceResource.NetworkInterfaceProperty.GroupSet``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-network-iface-embedded.html#aws-properties-ec2-network-iface-embedded-groupset </remarks>
        [JsiiProperty("groupSet", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}}}]},\"optional\":true}", true)]
        public object GroupSet
        {
            get;
            set;
        }

        /// <summary>``InstanceResource.NetworkInterfaceProperty.Ipv6AddressCount``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-network-iface-embedded.html#cfn-ec2-instance-networkinterface-ipv6addresscount </remarks>
        [JsiiProperty("ipv6AddressCount", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object Ipv6AddressCount
        {
            get;
            set;
        }

        /// <summary>``InstanceResource.NetworkInterfaceProperty.Ipv6Addresses``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-network-iface-embedded.html#cfn-ec2-instance-networkinterface-ipv6addresses </remarks>
        [JsiiProperty("ipv6Addresses", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-ec2.cloudformation.InstanceResource.InstanceIpv6AddressProperty\"}]}}}}]},\"optional\":true}", true)]
        public object Ipv6Addresses
        {
            get;
            set;
        }

        /// <summary>``InstanceResource.NetworkInterfaceProperty.NetworkInterfaceId``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-network-iface-embedded.html#aws-properties-ec2-network-iface-embedded-network-iface </remarks>
        [JsiiProperty("networkInterfaceId", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object NetworkInterfaceId
        {
            get;
            set;
        }

        /// <summary>``InstanceResource.NetworkInterfaceProperty.PrivateIpAddress``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-network-iface-embedded.html#aws-properties-ec2-network-iface-embedded-privateipaddress </remarks>
        [JsiiProperty("privateIpAddress", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object PrivateIpAddress
        {
            get;
            set;
        }

        /// <summary>``InstanceResource.NetworkInterfaceProperty.PrivateIpAddresses``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-network-iface-embedded.html#aws-properties-ec2-network-iface-embedded-privateipaddresses </remarks>
        [JsiiProperty("privateIpAddresses", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-ec2.cloudformation.InstanceResource.PrivateIpAddressSpecificationProperty\"}]}}}}]},\"optional\":true}", true)]
        public object PrivateIpAddresses
        {
            get;
            set;
        }

        /// <summary>``InstanceResource.NetworkInterfaceProperty.SecondaryPrivateIpAddressCount``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-network-iface-embedded.html#aws-properties-ec2-network-iface-embedded-secondprivateip </remarks>
        [JsiiProperty("secondaryPrivateIpAddressCount", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object SecondaryPrivateIpAddressCount
        {
            get;
            set;
        }

        /// <summary>``InstanceResource.NetworkInterfaceProperty.SubnetId``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-network-iface-embedded.html#aws-properties-ec2-network-iface-embedded-subnetid </remarks>
        [JsiiProperty("subnetId", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object SubnetId
        {
            get;
            set;
        }
    }
}