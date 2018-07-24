using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-subnet-route-table-assoc.html </remarks>
    [JsiiInterface(typeof(ISubnetRouteTableAssociationResourceProps), "@aws-cdk/aws-ec2.cloudformation.SubnetRouteTableAssociationResourceProps")]
    public interface ISubnetRouteTableAssociationResourceProps
    {
        /// <summary>``AWS::EC2::SubnetRouteTableAssociation.RouteTableId``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-subnet-route-table-assoc.html#cfn-ec2-subnetroutetableassociation-routetableid </remarks>
        [JsiiProperty("routeTableId", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object RouteTableId
        {
            get;
            set;
        }

        /// <summary>``AWS::EC2::SubnetRouteTableAssociation.SubnetId``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-subnet-route-table-assoc.html#cfn-ec2-subnetroutetableassociation-subnetid </remarks>
        [JsiiProperty("subnetId", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object SubnetId
        {
            get;
            set;
        }
    }
}