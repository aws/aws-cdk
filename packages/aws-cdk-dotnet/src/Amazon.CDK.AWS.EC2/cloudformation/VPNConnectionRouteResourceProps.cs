using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-vpn-connection-route.html </remarks>
    public class VPNConnectionRouteResourceProps : DeputyBase, IVPNConnectionRouteResourceProps
    {
        /// <summary>``AWS::EC2::VPNConnectionRoute.DestinationCidrBlock``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-vpn-connection-route.html#cfn-ec2-vpnconnectionroute-cidrblock </remarks>
        [JsiiProperty("destinationCidrBlock", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}", true)]
        public object DestinationCidrBlock
        {
            get;
            set;
        }

        /// <summary>``AWS::EC2::VPNConnectionRoute.VpnConnectionId``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-vpn-connection-route.html#cfn-ec2-vpnconnectionroute-connectionid </remarks>
        [JsiiProperty("vpnConnectionId", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}", true)]
        public object VpnConnectionId
        {
            get;
            set;
        }
    }
}