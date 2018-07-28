using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2
{
    /// <summary>Specify configuration parameters for a VPC subnet</summary>
    public class VpcSubnetProps : DeputyBase, IVpcSubnetProps
    {
        /// <summary>The availability zone for the subnet</summary>
        [JsiiProperty("availabilityZone", "{\"primitive\":\"string\"}", true)]
        public string AvailabilityZone
        {
            get;
            set;
        }

        /// <summary>The VPC which this subnet is part of</summary>
        [JsiiProperty("vpcId", "{\"fqn\":\"@aws-cdk/cdk.Token\"}", true)]
        public Token VpcId
        {
            get;
            set;
        }

        /// <summary>The CIDR notation for this subnet</summary>
        [JsiiProperty("cidrBlock", "{\"primitive\":\"string\"}", true)]
        public string CidrBlock
        {
            get;
            set;
        }

        /// <summary>
        /// Controls if a public IP is associated to an instance at launch
        /// 
        /// Defaults to true in Subnet.Public, false in Subnet.Private or Subnet.Isolated.
        /// </summary>
        [JsiiProperty("mapPublicIpOnLaunch", "{\"primitive\":\"boolean\",\"optional\":true}", true)]
        public bool? MapPublicIpOnLaunch
        {
            get;
            set;
        }
    }
}