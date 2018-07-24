using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-vpc-dhcp-options-assoc.html </remarks>
    [JsiiInterface(typeof(IVPCDHCPOptionsAssociationResourceProps), "@aws-cdk/aws-ec2.cloudformation.VPCDHCPOptionsAssociationResourceProps")]
    public interface IVPCDHCPOptionsAssociationResourceProps
    {
        /// <summary>``AWS::EC2::VPCDHCPOptionsAssociation.DhcpOptionsId``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-vpc-dhcp-options-assoc.html#cfn-ec2-vpcdhcpoptionsassociation-dhcpoptionsid </remarks>
        [JsiiProperty("dhcpOptionsId", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object DhcpOptionsId
        {
            get;
            set;
        }

        /// <summary>``AWS::EC2::VPCDHCPOptionsAssociation.VpcId``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-vpc-dhcp-options-assoc.html#cfn-ec2-vpcdhcpoptionsassociation-vpcid </remarks>
        [JsiiProperty("vpcId", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object VpcId
        {
            get;
            set;
        }
    }
}