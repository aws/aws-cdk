using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-vpn-gatewayrouteprop.html </remarks>
    [JsiiInterface(typeof(IVPNGatewayRoutePropagationResourceProps), "@aws-cdk/aws-ec2.cloudformation.VPNGatewayRoutePropagationResourceProps")]
    public interface IVPNGatewayRoutePropagationResourceProps
    {
        /// <summary>``AWS::EC2::VPNGatewayRoutePropagation.RouteTableIds``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-vpn-gatewayrouteprop.html#cfn-ec2-vpngatewayrouteprop-routetableids </remarks>
        [JsiiProperty("routeTableIds", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}}}]}}")]
        object RouteTableIds
        {
            get;
            set;
        }

        /// <summary>``AWS::EC2::VPNGatewayRoutePropagation.VpnGatewayId``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-vpn-gatewayrouteprop.html#cfn-ec2-vpngatewayrouteprop-vpngatewayid </remarks>
        [JsiiProperty("vpnGatewayId", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object VpnGatewayId
        {
            get;
            set;
        }
    }
}