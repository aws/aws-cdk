using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2.cloudformation.InstanceResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-network-interface-privateipspec.html </remarks>
    [JsiiInterfaceProxy(typeof(IPrivateIpAddressSpecificationProperty), "@aws-cdk/aws-ec2.cloudformation.InstanceResource.PrivateIpAddressSpecificationProperty")]
    internal class PrivateIpAddressSpecificationPropertyProxy : DeputyBase, Amazon.CDK.AWS.EC2.cloudformation.InstanceResource.IPrivateIpAddressSpecificationProperty
    {
        private PrivateIpAddressSpecificationPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``InstanceResource.PrivateIpAddressSpecificationProperty.Primary``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-network-interface-privateipspec.html#cfn-ec2-networkinterface-privateipspecification-primary </remarks>
        [JsiiProperty("primary", "{\"union\":{\"types\":[{\"primitive\":\"boolean\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object Primary
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``InstanceResource.PrivateIpAddressSpecificationProperty.PrivateIpAddress``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-network-interface-privateipspec.html#cfn-ec2-networkinterface-privateipspecification-privateipaddress </remarks>
        [JsiiProperty("privateIpAddress", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object PrivateIpAddress
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}