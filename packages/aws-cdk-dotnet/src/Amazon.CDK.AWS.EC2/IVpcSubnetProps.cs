using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2
{
    /// <summary>Specify configuration parameters for a VPC subnet</summary>
    [JsiiInterface(typeof(IVpcSubnetProps), "@aws-cdk/aws-ec2.VpcSubnetProps")]
    public interface IVpcSubnetProps
    {
        /// <summary>The availability zone for the subnet</summary>
        [JsiiProperty("availabilityZone", "{\"primitive\":\"string\"}")]
        string AvailabilityZone
        {
            get;
            set;
        }

        /// <summary>The VPC which this subnet is part of</summary>
        [JsiiProperty("vpcId", "{\"fqn\":\"@aws-cdk/cdk.Token\"}")]
        Token VpcId
        {
            get;
            set;
        }

        /// <summary>The CIDR notation for this subnet</summary>
        [JsiiProperty("cidrBlock", "{\"primitive\":\"string\"}")]
        string CidrBlock
        {
            get;
            set;
        }

        /// <summary>
        /// Controls if a public IP is associated to an instance at launch
        /// 
        /// Defaults to true in Subnet.Public, false in Subnet.Private or Subnet.Isolated.
        /// </summary>
        [JsiiProperty("mapPublicIpOnLaunch", "{\"primitive\":\"boolean\",\"optional\":true}")]
        bool? MapPublicIpOnLaunch
        {
            get;
            set;
        }
    }
}