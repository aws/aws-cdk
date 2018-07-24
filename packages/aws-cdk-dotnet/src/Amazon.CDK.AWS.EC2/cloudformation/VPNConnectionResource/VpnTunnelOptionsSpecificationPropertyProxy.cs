using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2.cloudformation.VPNConnectionResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-vpnconnection-vpntunneloptionsspecification.html </remarks>
    [JsiiInterfaceProxy(typeof(IVpnTunnelOptionsSpecificationProperty), "@aws-cdk/aws-ec2.cloudformation.VPNConnectionResource.VpnTunnelOptionsSpecificationProperty")]
    internal class VpnTunnelOptionsSpecificationPropertyProxy : DeputyBase, IVpnTunnelOptionsSpecificationProperty
    {
        private VpnTunnelOptionsSpecificationPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``VPNConnectionResource.VpnTunnelOptionsSpecificationProperty.PreSharedKey``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-vpnconnection-vpntunneloptionsspecification.html#cfn-ec2-vpnconnection-vpntunneloptionsspecification-presharedkey </remarks>
        [JsiiProperty("preSharedKey", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object PreSharedKey
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``VPNConnectionResource.VpnTunnelOptionsSpecificationProperty.TunnelInsideCidr``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-vpnconnection-vpntunneloptionsspecification.html#cfn-ec2-vpnconnection-vpntunneloptionsspecification-tunnelinsidecidr </remarks>
        [JsiiProperty("tunnelInsideCidr", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object TunnelInsideCidr
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}