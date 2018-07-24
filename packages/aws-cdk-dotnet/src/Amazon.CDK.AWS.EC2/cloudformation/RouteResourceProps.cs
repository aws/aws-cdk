using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-route.html </remarks>
    public class RouteResourceProps : DeputyBase, IRouteResourceProps
    {
        /// <summary>``AWS::EC2::Route.RouteTableId``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-route.html#cfn-ec2-route-routetableid </remarks>
        [JsiiProperty("routeTableId", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}", true)]
        public object RouteTableId
        {
            get;
            set;
        }

        /// <summary>``AWS::EC2::Route.DestinationCidrBlock``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-route.html#cfn-ec2-route-destinationcidrblock </remarks>
        [JsiiProperty("destinationCidrBlock", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object DestinationCidrBlock
        {
            get;
            set;
        }

        /// <summary>``AWS::EC2::Route.DestinationIpv6CidrBlock``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-route.html#cfn-ec2-route-destinationipv6cidrblock </remarks>
        [JsiiProperty("destinationIpv6CidrBlock", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object DestinationIpv6CidrBlock
        {
            get;
            set;
        }

        /// <summary>``AWS::EC2::Route.EgressOnlyInternetGatewayId``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-route.html#cfn-ec2-route-egressonlyinternetgatewayid </remarks>
        [JsiiProperty("egressOnlyInternetGatewayId", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object EgressOnlyInternetGatewayId
        {
            get;
            set;
        }

        /// <summary>``AWS::EC2::Route.GatewayId``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-route.html#cfn-ec2-route-gatewayid </remarks>
        [JsiiProperty("gatewayId", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object GatewayId
        {
            get;
            set;
        }

        /// <summary>``AWS::EC2::Route.InstanceId``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-route.html#cfn-ec2-route-instanceid </remarks>
        [JsiiProperty("instanceId", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object InstanceId
        {
            get;
            set;
        }

        /// <summary>``AWS::EC2::Route.NatGatewayId``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-route.html#cfn-ec2-route-natgatewayid </remarks>
        [JsiiProperty("natGatewayId", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object NatGatewayId
        {
            get;
            set;
        }

        /// <summary>``AWS::EC2::Route.NetworkInterfaceId``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-route.html#cfn-ec2-route-networkinterfaceid </remarks>
        [JsiiProperty("networkInterfaceId", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object NetworkInterfaceId
        {
            get;
            set;
        }

        /// <summary>``AWS::EC2::Route.VpcPeeringConnectionId``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-route.html#cfn-ec2-route-vpcpeeringconnectionid </remarks>
        [JsiiProperty("vpcPeeringConnectionId", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object VpcPeeringConnectionId
        {
            get;
            set;
        }
    }
}