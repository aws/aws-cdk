using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-subnetcidrblock.html </remarks>
    [JsiiInterface(typeof(ISubnetCidrBlockResourceProps), "@aws-cdk/aws-ec2.cloudformation.SubnetCidrBlockResourceProps")]
    public interface ISubnetCidrBlockResourceProps
    {
        /// <summary>``AWS::EC2::SubnetCidrBlock.Ipv6CidrBlock``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-subnetcidrblock.html#cfn-ec2-subnetcidrblock-ipv6cidrblock </remarks>
        [JsiiProperty("ipv6CidrBlock", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object Ipv6CidrBlock
        {
            get;
            set;
        }

        /// <summary>``AWS::EC2::SubnetCidrBlock.SubnetId``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-subnetcidrblock.html#cfn-ec2-subnetcidrblock-subnetid </remarks>
        [JsiiProperty("subnetId", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object SubnetId
        {
            get;
            set;
        }
    }
}