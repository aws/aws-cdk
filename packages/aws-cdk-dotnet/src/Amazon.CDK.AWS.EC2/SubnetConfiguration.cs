using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2
{
    /// <summary>Specify configuration parameters for a VPC to be built</summary>
    public class SubnetConfiguration : DeputyBase, ISubnetConfiguration
    {
        /// <summary>
        /// The CIDR Mask or the number of leading 1 bits in the routing mask
        /// 
        /// Valid values are 16 - 28
        /// </summary>
        [JsiiProperty("cidrMask", "{\"primitive\":\"number\",\"optional\":true}", true)]
        public double? CidrMask
        {
            get;
            set;
        }

        /// <summary>
        /// The type of Subnet to configure.
        /// 
        /// The Subnet type will control the ability to route and connect to the
        /// Internet.
        /// </summary>
        [JsiiProperty("subnetType", "{\"fqn\":\"@aws-cdk/aws-ec2.SubnetType\"}", true)]
        public SubnetType SubnetType
        {
            get;
            set;
        }

        /// <summary>
        /// The common Logical Name for the `VpcSubnet`
        /// 
        /// Thi name will be suffixed with an integer correlating to a specific
        /// availability zone.
        /// </summary>
        [JsiiProperty("name", "{\"primitive\":\"string\"}", true)]
        public string Name
        {
            get;
            set;
        }
    }
}