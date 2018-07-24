using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2.cloudformation.NetworkInterfaceResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-network-interface-privateipspec.html </remarks>
    [JsiiInterface(typeof(IPrivateIpAddressSpecificationProperty), "@aws-cdk/aws-ec2.cloudformation.NetworkInterfaceResource.PrivateIpAddressSpecificationProperty")]
    public interface IPrivateIpAddressSpecificationProperty
    {
        /// <summary>``NetworkInterfaceResource.PrivateIpAddressSpecificationProperty.Primary``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-network-interface-privateipspec.html#cfn-ec2-networkinterface-privateipspecification-primary </remarks>
        [JsiiProperty("primary", "{\"union\":{\"types\":[{\"primitive\":\"boolean\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object Primary
        {
            get;
            set;
        }

        /// <summary>``NetworkInterfaceResource.PrivateIpAddressSpecificationProperty.PrivateIpAddress``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-network-interface-privateipspec.html#cfn-ec2-networkinterface-privateipspecification-privateipaddress </remarks>
        [JsiiProperty("privateIpAddress", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object PrivateIpAddress
        {
            get;
            set;
        }
    }
}